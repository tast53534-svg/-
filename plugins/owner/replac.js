// تـم الـتـطـويـر بـواسـطـه أكــســيــوس ❄️💚
// 201284042708
import fs from 'fs';
import path from 'path';

// الأرقام المسموح لها (اختياري)
const allowedNumbers = [
  '201284042708@s.whatsapp.net',
  '201551798379@s.whatsapp.net'
];

const handler = async (m, { conn, text }) => {
  const basePath = './plugins';
  const emoji = '❄️';

  // التحقق من الصلاحية
  if (allowedNumbers.length > 0 && !allowedNumbers.includes(m.sender)) {
    return conn.sendMessage(m.chat, { text: `${emoji} ⇦ ≺غـيـر مـسـمـوح لـك بـهـذا الأمـر يـا حــب❌🌿≺` }, { quoted: m });
  }

  // التحقق من الصيغة
  if (!text || !text.includes('|')) {
    return conn.sendMessage(m.chat, { text: `${emoji} ⇦ ≺اكـتـب الأمـر بـهـذا الـشـكـل يـا حــب💡≺\n\n*.بدل كلمه_قديمه|كلمه_جديده*` }, { quoted: m });
  }

  const [oldWord, newWord] = text.split('|').map(s => s.trim());
  if (!oldWord) {
    return conn.sendMessage(m.chat, { text: `${emoji} ⇦ ≺يـجـب تـحـديـد الـكـلـمـة الـقـديـمـة≺` }, { quoted: m });
  }

  // فحص وجود المجلد
  if (!fs.existsSync(basePath)) {
    return conn.sendMessage(m.chat, { text: `${emoji} ⇦ ≺مـجـلـد الـمـلـحـقـات غـيـر مـوجـود ❄️🌿≺` }, { quoted: m });
  }

  // إشعار البدء
  await conn.sendMessage(m.chat, { text: `${emoji} ⇦ ≺جـاري اسـتـبـدال "${oldWord}" بـ "${newWord}" فـي جـمـيـع الـمـلـفـات🛠️🌿≺` }, { quoted: m });

  let changedFiles = 0;
  const errors = [];

  // دالة لاستبدال النص في مجلد معين (بشكل متكرر)
  const replaceInDir = (dir) => {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        replaceInDir(fullPath);
      } else if (item.endsWith('.js')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes(oldWord)) {
            const newContent = content.split(oldWord).join(newWord);
            fs.writeFileSync(fullPath, newContent, 'utf8');
            changedFiles++;
          }
        } catch (err) {
          errors.push({ file: fullPath, error: err.message });
        }
      }
    }
  };

  try {
    replaceInDir(basePath);
  } catch (err) {
    return conn.sendMessage(m.chat, { text: `${emoji} ⇦ ≺حـدث خـطـأ خـلال الاسـتـبـدال: ${err.message}≺` }, { quoted: m });
  }

  // صياغة الرد النهائي
  let reply = `╮──⊰ ❄️ ⊱──╭\n`;
  reply += `${emoji} ⇦ ≺تـم اسـتـبـدال "${oldWord}" بـ "${newWord}" بـنـجـاح يـا حــب💚≺\n`;
  reply += `🌿 ⇦ ≺عـدد الـمـلـفـات الـمـتـغـيـره : ${changedFiles}≺\n`;
  if (errors.length > 0) {
    reply += `\n⚠️ ⇦ ≺وجـدت أخـطـاء فـي بـعـض الـمـلـفـات:≺\n`;
    errors.forEach(({ file, error }) => {
      reply += `📄 ${path.relative(basePath, file)}\n💢 ${error}\n`;
    });
  }
  reply += `╯──⊰ ❄️ ⊱──╰`;

  await conn.sendMessage(m.chat, { text: reply }, { quoted: m });
};

handler.help = ['بدل <قديم>|<جديد>'];
handler.tags = ['owner'];
handler.command = ['بدل', 'استبدال'];
handler.usePrefix = true;

export default handler;