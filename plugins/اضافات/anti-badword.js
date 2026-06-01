export default async function before(m, { conn, isBotAdmin, isAdmin }) {
    // 1. تجاهل الرسالة إذا لم تكن نصية، أو مرسلة من البوت، أو ليست في مجموعة
    if (!m.text || m.fromMe || !m.isGroup) return false

    // 2. تعريف المطورين (ضع أرقام المطورين هنا بدون @s.whatsapp.net)
    const developers = ['201012345678', '966500000000'] 
    const isDeveloper = developers.some(v => m.sender.includes(v)) || m.isOwner

    // إذا كان المرسل مطور أو أدمن، يتجاهل البوت الفحص تماماً
    if (isDeveloper || isAdmin) return false

    // 3. قائمة كلمات موسعة (شتائم شائعة)
    const badwords = [
        "عرص", "كسمك", "احا", "متناك", "لبوه", "قحبه", "شرموط", "منيوك", "كس امك", 
        "كسم", "يا بن الـ", "خول", "ديوث", "شرموطه", "فسيو", "تيزك", "طيزك", 
        "مصمم", "سكس", "نيك", "بضان", "بيضاتك", "بضاني", "يلعن", "زبي"
    ]

    // 4. تنظيف النص (إزالة التشكيل، المد، الزخارف، والرموز) لضمان عدم الهروب
    const cleanText = m.text
        .replace(/[\u064B-\u065F]/g, "") // حذف التشكيل
        .replace(/ـ+/g, "")             // حذف المد (الشرطة)
        .replace(/[^\u0621-\u064A\s]/g, "") // حذف الرموز والزخارف مع الإبقاء على الحروف العربية والمسافات

    // 5. فحص لو النص يحتوي على أي كلمة من القائمة
    const isBad = badwords.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi') // فحص الكلمة كقطعة واحدة
        return cleanText.includes(word) || m.text.toLowerCase().includes(word)
    })

    if (isBad) {
        if (isBotAdmin) {
            // حذف الرسالة
            await conn.sendMessage(m.chat, { delete: m.key })

            // رد المحقق كونان
            let warningMsg = `*🕵️‍♂️ لقطتك يا @${m.sender.split('@')[0]} !!*\n*ممنوع الغلط هنا، تم حذف رسالتك! خليك محترم 🔍*`
            await conn.reply(m.chat, warningMsg, m, { mentions: [m.sender] })
        } else {
            // تنبيه في حال عدم وجود صلاحيات للأدمن
            await conn.reply(m.chat, "🕵️‍♂️ لقطت شتيمة بس لازم ترفعني أدمن عشان أتعامل معاه!", m)
        }
        return true 
    }

    return false 
}
