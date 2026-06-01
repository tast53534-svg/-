export default async function before(m, { conn, bot }) {
    // التأكد إن الرسالة فيها نص ومن غير مسافات زيادة
    const text = m.text?.trim();

    // دالة التحقق من المطورين من الملف الأساسي
    const isBotOwner = (userId) => {
        if (!bot.config || !bot.config.owners) return false;
        return bot.config.owners.some(owner => 
            owner.jid === userId || owner.lid === userId
        );
    };

    // الشرط: الكلمة تكون "بوتي" بالظبط
    if (text === "بوتي") {
        if (isBotOwner(m.sender)) {
            let loveMessages = [
                'قلب بوتك من جوه يا مطوري.. ❤️',
                'مطوري وحبيبي.. أمرك مطاع! ✨',
                'عُيون بوتك.. محتاج حاجة يا بطل؟ 😍',
                'حبك مطوري.. البوت كله فداك! 🫡'
            ];
            let randomReply = loveMessages[Math.floor(Math.random() * loveMessages.length)];
            
            // الرد على المطور
            return m.reply(randomReply);
        } else {
            // رد اختياري لو حد تاني نادى عليه
            return m.reply("الأمر للمطورين بس يا حب 😂");
        }
    }

    return false;
}