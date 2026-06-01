let handler = async (m, { conn, usedPrefix, command }) => {
    // تحديد الشخص (منشن أو ريبلاي)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    
    if (!who) return m.reply(`*🪄 منشن الضحية اللي هتعمل عليها السحر!*\n\nمثال: ${usedPrefix + command} @user`)

    // جمل السحر
    let spells = [
        '🪄 *أبرا كادابرا.. حبرا كادبرا..*',
        '✨ *جاري تحضير لعنة الإخفاء..*',
        '🌀 *تتطاير ذرات الغبار السحري..*',
        '💀 *وداعاً أيها المسكين..*'
    ]

    // إرسال جمل السحر بالتتابع
    for (let spell of spells) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await conn.sendMessage(m.chat, { text: spell }, { quoted: m })
    }

    // محاولة الطرد
    try {
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
        m.reply('💥 *بـوم!* الشخص اختفى في الهواء! 🧙‍♂️💨')
    } catch (e) {
        m.reply('❌ السحر فشل! اتأكد إني أدمن، وإن الشخص ده مش أدمن زيي لأن سحري مبيأثرش في الكبار! 😂')
    }
}

handler.help = ['سحر']
handler.tags = ['group']
handler.command = /^(سحر|magic)$/i

// الشروط
handler.group = true
handler.admin = true // لازم اللي يكتب الأمر يكون أدمن
handler.botAdmin = true// لازم البوت يكون أدمن عشان يطرد
handler.usage = ['سحر'];     
handler. category = 'admin'; 
export default handler

