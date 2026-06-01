let handler = async (m, { conn, bot, isBotAdmin }) => {
  // التحقق من المطور بطريقة آمنة تتجنب إيرور الـ split
  const owners = bot.config.owners || [];
  const isBotOwner = owners.some(owner => 
    owner.jid === m.sender || owner.lid === m.sender
  );

  if (!isBotOwner) return m.reply("الأمر للمطورين يعم 😂");
  if (!m.isGroup) return m.reply("الأمر ده في الجروبات بس!");
  if (!isBotAdmin) return m.reply("ارفعني أدمن الأول عشان أغير البيانات!");

  try {
    // 1. تغيير اسم الجروب فوراً
    await conn.groupUpdateSubject(m.chat, 'تم سحب الجروب بواسطه(𝑲𝑰𝑵𝑮 𝑩𝑶𝑻)');

    // 2. تغيير وصف الجروب (البايو) بالروابط المطلوبة
    let newDescription = `لو عاوز تعمل كده تعال هنا\nجروب تنصيب بوت تعالو\https://chat.whatsapp.com/IvJYpdrv5HG01SzWCEyY2l?mode=gi_t\n\n‏تابع قناة 𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 في واتساب: https://whatsapp.com/channel/0029VbCPEZ88F2pNsd7YQB1i`;
    await conn.groupUpdateDescription(m.chat, newDescription);

    await m.reply("✅ تم تغيير اسم ووصف الجروب بنجاح بواسطة 𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 👑");

  } catch (error) {
    // إرسال تنبيه لو حصل مشكلة تانية
    await m.reply("❌ حدث خطأ أثناء تعديل البيانات، تأكد من صلاحيات البوت.");
  }
};

handler.command = /^(اخلص)$/i;
handler.usage = ['اخلص']; 
handler.category = 'owner'
export default handler;

