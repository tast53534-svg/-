const handler = async (m, { conn, command }) => {
  if (command === "قفل") {
    await conn.groupSettingUpdate(m.chat, 'announcement');
    let closeMsg = `🔒
ــــــــــــــ { 🃏 تم قفل الشات 🃏 } ــــــــــــــ
المشرفين بس اللي مسموح ليهم يتكلموا
                       (يعضو 😂) 
ـــــــــــــــــــــــــ 🐉 ـــــــــــــــــــــــــ
| ⚡🃏 الجروب مقفول 🃏⚡ 🔒`;
    await m.reply(closeMsg);

  } else if (command === "فتح") {
    await conn.groupSettingUpdate(m.chat, 'not_announcement');
    let openMsg = `🔓
ــــــــــــــ { 🃏 تم فتح الشات 🃏 } ــــــــــــــ
الجروب مفتوح دلوقتي الكل يقدر يتكلم
ـــــــــــــــــــــــــ 🐉 ـــــــــــــــــــــــــ
| ⚡🃏 الجروب مفتوح 🃏⚡ 🔓`;
    await m.reply(openMsg);
  }
};

handler.help = ["قفل", "فتح"];
handler.tags = ["admin"];
handler.command = /^(قفل|فتح)$/i; // استخدام Regex أفضل لضمان الاستجابة
handler.group = true; // ليعمل في المجموعات فقط
handler.admin = true;
handler.botAdmin = true;

export default handler;
