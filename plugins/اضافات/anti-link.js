export default async function before(m, { conn, isBotAdmin }) {
    if (!m.isGroup || !m.text) return false;
    
    // جلب إعدادات الجروب من قاعدة البيانات
    const g = global.db?.data?.chats?.[m.chat]; // تأكد من مسار الداتابيز عندك

    // التحقق من تفعيل الأنتي لينك وأن المرسل ليس مطوراً أو مشرفاً
    if (g?.antiLink && !m.isOwner && !m.isAdmin) {
        const groupLinkRegex = /(https?:\/\/)?(chat\.whatsapp\.com|whatsapp\.com\/channel)\/[A-Za-z0-9]+/i; // حذفنا حرف الـ g لتجنب مشكلة التتبع

        if (groupLinkRegex.test(m.text)) {
            // 1. مسح الرسالة فوراً
            await conn.sendMessage(m.chat, { delete: m.key });

            // 2. إرسال رسالة التحذير (المنشن)
            await conn.sendMessage(m.chat, { 
                text: `@${m.sender.split('@')[0]} غبي يعم سيتم طردك بس تحت 😎🖕🏻`,
                mentions: [m.sender]
            }, { quoted: m });

            // 3. تنفيذ الطرد فوراً إذا كان البوت آدمن
            if (isBotAdmin) {
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            } else {
                return m.reply("أنا مش آدمن هنا عشان أطرده! 🥲");
            }

            return true;
        }
    }

    return false;
}
