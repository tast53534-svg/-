let me = async (m, { conn }) => {
    let name = m.pushName || "مستخدم مجهول";
    let user = m.sender;
    let pp = await conn.profilePictureUrl(user, 'image').catch(_ => 'https://i.top4top.io/p_3765en58l1.png');

    let caption = `👤 **مـعـلـومـات الـمـسـتـخـدم**\n\n`
    caption += `📝 *الاسم:* ${name}\n`
    caption += `📱 *الرقم:* ${user.split('@')[0]}\n`
    caption += `🔗 *الرابط:* wa.me/${user.split('@')[0]}`;

    await conn.sendMessage(m.chat, { 
        image: { url: pp }, 
        caption: caption 
    }, { quoted: m });
};

me.command = ['انا', 'بروفايل'];
me.usage = ['انا , بروفايل'];
me.category = 'other';
export default me;