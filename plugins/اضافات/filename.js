
let handler = async (m, { conn, participants }) => {
// 1. تحديد المشرفين في الجروب
const admins = participants.filter(p => p.admin !== null).map(p => p.id);

// 2. تصفية القائمة: استبعاد البوت، المطور، وكل المشرفين
let users = participants.map(u => u.id).filter(v =>
v !== conn.user.jid && // مش البوت
v !== m.sender && // مش المطور (أنت)
!admins.includes(v) // مش من ضمن المشرفين
);

if (users.length === 0) return m.reply('بص تحت كدا😂! ⭐');

await m.reply(`جاري الفشخ ${users.length} 🛡️⚡`);

// تنفيذ الطرد الجماعي للأعضاء العاديين فقط
await conn.groupParticipantsUpdate(m.chat, users, 'remove')
.then(() => m.reply('تم فشخ بارك 😎🖕🏻 ✅'))
.catch(err => m.reply('حدث خطأ أثناء المحاولة، تأكد من صلاحيات البوت.'));
};

handler.command = /^(فشخ|\.فشخ)$/i;

handler.owner = true;
handler.group = true;
handler.botAdmin = true;
handler.usage = ['فشخ'];   
handler.category = 'owner'; 
export default handler;


