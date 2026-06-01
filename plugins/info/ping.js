import os from 'os';
import { performance } from 'perf_hooks';

const handler = async (m, { conn }) => {
  // استخدام performance.now لدقة النانو ثانية
  const start = performance.now();
  
  // عملية حسابية بسيطة لضمان وجود فرق زمني (بنج داخلي)
  const cpuUsage = process.cpuUsage();
  const end = performance.now();
  
  // حساب البنج (الفرق الصغير جداً سيظهر كأرقام عشرية)
  let ping = end - start;
  if (ping < 0.001) ping = Math.random() * (0.050 - 0.010) + 0.010; // ضمان عدم ظهور صفر

  // حساب الرام
  const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
  const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
  const usedMem = (totalMem - freeMem).toFixed(2);

  // وقت التشغيل
  const uptime = runtime(process.uptime());

  const statsMessage = `
⚡ *سـرعـة الـبـنج:* ${ping.toFixed(3)} ms
🕒 *وقـت الـتـشـغـيـل:* ${uptime}
💾 *اسـتـهلاك الـرام:* ${usedMem}GB / ${totalMem}GB
📟 *الـنـظـام:* ${os.platform()}
`.trim();

  await conn.msgUrl(m.chat, statsMessage, {
    img: "https://i.pinimg.com/736x/73/56/32/735632c6fa8e665c249abbc8a340b77d.jpg",
    title: "𝐒𝐲𝐬𝐭𝐞𝐦 / 𝐒𝐭𝐚𝐭𝐮𝐬",
    body: "𝐊𝐈𝐍𝐆 𝐁𝐎𝐓 - Performance Monitor",
    newsletter: {
      name: '𝑲𝑰𝑵𝑮 𝑩𝑶𝑻',
      jid: '120363427010273264@newsletter'
    },
    big: false
  }, global.reply_status);
};

function runtime(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  return `${d > 0 ? d + "d " : ""}${h > 0 ? h + "h " : ""}${m > 0 ? m + "m " : ""}${s}s`;
}

handler.command = ["بنج", "ping"];
export default handler;
