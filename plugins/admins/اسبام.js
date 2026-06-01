// مصفوفة لتخزين إعدادات المجموعات وسجل الرسائل مؤقتاً
let antispamGroups = {};
let spamTracker = {}; 

let handler = async (m, { conn, command, args, isAdmin, isBotAdmin }) => {
    if (!m.isGroup) return m.reply("❌ هذا الأمر للمجموعات فقط!");

    const subCmd = args[0]?.toLowerCase();

    // القائمة التفاعلية عند كتابة ".سبام"
    if (!subCmd) {
        const menu = `
╭─┈─┈─┈─⟞🚫⟝─┈─┈─┈─╮
│ *إعدادات مضاد السبام*
│
│ *1️⃣ سبام تشغيل*
│ > طرد من يرسل رسائل متكررة
│
│ *2️⃣ سبام ايقاف*
│ > إيقاف حماية السبام
╰─┈─┈─┈─⟞🚫⟝─┈─┈─┈─╯
`;

        await conn.sendButton(m.chat, {
            bodyText: menu,
            footerText: "𝐊𝐈𝐍𝐆 𝐁𝐎𝐓 ~ 𝐃𝐈𝐒𝐇𝐀 🃏",
            buttons: [
                { name: "quick_reply", params: { display_text: "🚫 تشغيل مضاد السبام", id: ".سبام تشغيل" } },
                { name: "quick_reply", params: { display_text: "✅ إيقاف مضاد السبام", id: ".سبام ايقاف" } }
            ],
            mentions: [m.sender],
            interactiveConfig: {
                buttons_limits: 1,
                list_title: "خيارات السبام",
                button_title: "اضغط هنا"
            }
        }, m);
        return;
    }

    // الأوامر المباشرة
    if (subCmd === 'تشغيل' || subCmd === 'تفعيل') {
        if (!isAdmin) return m.reply("❌ للأدمن فقط");
        antispamGroups[m.chat] = true;
        return m.reply("✅ تم تفعيل مضاد السبام.\n> أي عضو يرسل أكثر من 3 رسائل في 3 ثواني سيتم طرده.");
    }

    if (subCmd === 'ايقاف' || subCmd === 'قفل') {
        if (!isAdmin) return m.reply("❌ للأدمن فقط");
        delete antispamGroups[m.chat];
        return m.reply("❌ تم إيقاف مضاد السبام.");
    }
};

// وظيفة المراقبة (Logic)
handler.before = async (m, { conn, isAdmin, isBotAdmin }) => {
    if (!m.isGroup || !antispamGroups[m.chat] || !m.sender) return;
    if (isAdmin) return; // المشرفين حصانة

    const sender = m.sender;
    const now = Date.now();
    
    if (!spamTracker[sender]) {
        spamTracker[sender] = { count: 0, lastTime: now };
    }

    const userData = spamTracker[sender];
    const diff = now - userData.lastTime;

    // إذا أرسل رسالة في أقل من 5 ثواني
    if (diff < 3000) {
        userData.count++;
    } else {
        userData.count = 1;
        userData.lastTime = now;
    }

    // حد السبام (مثلاً 5 رسائل متتالية)
    if (userData.count >= 3) {
        if (!isBotAdmin) return; // لازم البوت يكون أدمن

        // 1. حذف رسائل السبام (اختياري، يفضل الطرد فوراً)
        await conn.sendMessage(m.chat, { delete: m.key });

        // 2. الرد والطرد بنفس أسلوب كود الروابط
        await m.reply(`@${sender.split('@')[0]} ممنوع السبام يا غبي سيتم طردك بص تحت 👇`, { mentions: [sender] });
        
        // 3. الطرد
        await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
        
        // تصفير البيانات بعد الطرد
        delete spamTracker[sender];
    }
};

handler.help = ['سبام'];
handler.tags = ['admin'];
handler.command = ['سبام']; 
handler.admin = true;
handler.group = true;
handler. usage = ['سبام '];    
handler.category = 'admin';   

export default handler;