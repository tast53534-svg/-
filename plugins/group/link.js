let handler = async (m, {
    conn
}) => {
    try {
        m.reply(`❀° ┄──────────╮
🃏┊ *رابـــط الـــمـــجـــمـــوعـــة:* ${(await conn.groupMetadata(m.chat)).subject}
🃏┊
🃏┊ https://chat.whatsapp.com/` + await conn.groupInviteCode(m.chat) + `
🃏┊
🃏┊ ${conn.user.name || "Bot WhatsApp"}
╰──────────┄ °❀`)
    } catch {
        const mentionedUser = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        conn.sendMessage(m.chat, { 
            text: `❀° ┄──────────╮
🃏┊ يـــجـــب تـــعـــيـــيـــن @${mentionedUser.split('@')[0]} كـــمـــشـــرف لـــلـــتـــمـــكـــن مـــن اســـتـــخـــدام هـــذا الـــأمـــر!
╰──────────┄ °❀`, 
            mentions: [mentionedUser]
        })
    }
}
handler.usage = ["لينك"];
handler.category = "group";
handler.command = ["لينك", "link"];
handler.group = true;
// تم إزالة شرط الأدمن هنا لكي يستخدمه الجميع
handler.botAdmin = true;

export default handler;