import axios from 'axios';
import FormData from 'form-data';

const client = axios.create({
  baseURL: 'https://emam-api-test.vercel.app/home/sections/Tools/api/imageEditPro'
});

const validRatios = ["1:1", "16:9", "3:2", "2:3", "4:5", "5:4", "9:16", "3:4", "4:3", "custom"];

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("النص الي هنفذو\nمثال: .صوره-تعديل اجعل لون البشرة اسود|1:1");
  if (!m.quoted || !m.quoted.mimetype || !m.quoted.mimetype.includes('image')) {
    return m.reply('الصوره الي هتعدلها');
  }

  m.reply('⏳ Processing...');

  try {
    let [prompt, size] = text.split('|');
    if (!prompt) prompt = text;

    const buffer = await m.quoted.download();
    
    const formData = new FormData();
    formData.append('image', buffer, 'image.jpg');
    formData.append('prompt', prompt);
    if (size && validRatios.includes(size)) formData.append('size', size); // لو سبيتها زي مهي هترجع لك نفس عرض الصوره الي حطيتها

    const createRes = await client.post('/process-image', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    const { status, recordId, message } = createRes.data;
    
    if (!status || !recordId) {
      throw new Error(message || 'Failed to start processing');
    }

    let result = null;
    let error = null;
    let maxRetries = 40;
    let retries = 0;

    while (!result && !error && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      retries++;
      
      const getRes = await client.get(`/check-result?rid=${recordId}`, {
        responseType: 'arraybuffer'
      });
      
      const contentType = getRes.headers['content-type'];
      
      if (contentType?.includes('application/json')) {
        const jsonData = JSON.parse(Buffer.from(getRes.data).toString('utf-8'));
        if (jsonData.status === false && jsonData.message !== 'Processing not completed yet') {
          error = jsonData.message;
          break;
        }
      } else if (contentType?.includes('image')) {
        result = getRes.data;
        break;
      }
    }

    if (retries >= maxRetries) throw new Error('Max retries reached, no result');
    if (error) throw new Error(error);
    if (!result) throw new Error('No result obtained');

    await conn.sendMessage(m.chat, {
      image: result,
      caption: 'Done'
    }, { quoted: m });

  } catch (e) {
    m.reply(`Error: ${e.message}`);
  }
};

handler.usage = ["تعديل"];
handler.command = ["editimage", "تعديل"];
handler.category = "tools";

export default handler;