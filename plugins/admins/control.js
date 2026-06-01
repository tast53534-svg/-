let control = async (m, { command, text, conn, bot }) => {
try {
const isBotOwner = (userId) => {
if (!bot.config || !bot.config.owners) return false;
return bot.config.owners.some(owner =>
owner.jid === userId || owner.lid === userId
);
};

const getUser = () => {  
        if (m.quoted) return m.quoted.sender;  
        if (m.mentionedJid && m.mentionedJid.length > 0) return m.mentionedJid[0];  
        if (text && text.trim()) return text.replace(/[^0-9]/g, '') + "@s.whatsapp.net";  
        return null;  
    };  

    if (command === "ضيف") {  
        let user = getUser();  
        if (!user) return m.reply("❌ فين الرقم أو المنشن؟");  
        await conn.groupParticipantsUpdate(m.chat, [user], 'add');  
        return m.reply("*✅ تمت الإضافة بنجاح*");  
    }  

    if (command === "انطر") {  
        let user = getUser();  
        if (!user) return m.reply("❌ منشن أو رد على العضو");  

        if (isBotOwner(user) || user === conn.user.id) {  
            m.reply("عايز تطرد المطور يا حب؟ خد أنت الطرد ده.. 😂");  
            return await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');  
        }  

        await conn.groupParticipantsUpdate(m.chat, [user], 'remove');  
        return m.reply(`ــــــــــــــ { 🐉 تـم الـطرد 🐉 } ــــــــــــــ

تـم طـرد هـذا الـعـضـو بـنـجـاح
مـمـنـوع الـمـخـالـفـة فـي وجـود الـكـيـنـج
ـــــــــــــــــــــــــ 🐉 ـــــــــــــــــــــــــ
| ⚡🃏 بـاي بـاي يـا حـلـو 🃏⚡ 🕶✅`);
}

if (command === "رفع") {  
        let user = getUser();  
        if (!user) return m.reply("❌ منشن أو رد على العضو");  
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');  
        return m.reply(`ــــــــــــــ { 🃏 تم الرفع 🃏 } ــــــــــــــ

مبروك الادمن 🃏
انت دلوقتي من النخبة 🃏🤍
ـــــــــــــــــــــــــ 🐉 ـــــــــــــــــــــــــ
| ⚡🃏 بقيت ادمن يعم افرح 😂🃏⚡✅`);
}

if (command === "خفض") {  
        let user = getUser();  
        if (!user) return m.reply("❌ منشن أو رد على العضو");  
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote');  
        return m.reply(`ــــــــــــــ { 🃏 تم الخفض 🃏 } ــــــــــــــ

ارجع لأصلك 😂🃏
بقيت عضو يا فقير 🃏🤍
ـــــــــــــــــــــــــ 🐉 ـــــــــــــــــــــــــ
| ⚡🃏 للأسف رجعت عضو 😂🃏⚡✅`);
}

} catch (error) {  
    await m.reply("❌ تأكد أنني مشرف في المجموعة (Admin) لتنفيذ الأوامر.");  
}

};

control.usage = ['ضيف', 'انطر', 'رفع', 'خفض'];
control.command = ['ضيف', 'انطر', 'رفع', 'خفض'];

control.group = true;
control.admin = true;
control.botAdmin = true;

control.category = "admin";
export default control;
