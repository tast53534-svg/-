/**
 * 🛡️ نظام الحماية الخارق ضد توجيه القنوات (Turbo Edition)
 * 🛠️ تم التعديل بواسطة: Gemini
 */

let handler = async (m, { conn, usedPrefix, command }) => {
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    let chat = global.db.data.chats[m.chat];

    chat.antiChannel = !chat.antiChannel;
    
    let status = chat.antiChannel ? 'تـم تـفـعـيـل الـحـمـايـة ✅' : 'تـم تـعـطـيـل الـحـمـايـة ❌';
    let msg = `
┏━━━━━━━━━━━━━━┓
┃ 🛡️ صـمـام الأمـان ┃
┗━━━━━━━━━━━━━━┛
┃ ⚡ الـحـالـة: ${status}
┃ 📢 مسموح فقط بقناتك الرسمية
┗━━━━━━━━━━━━━━┛`.trim();

    await m.reply(msg);
};

handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (!m.isGroup || !isBotAdmin || isAdmin || !m.message) return;

    let chat = global.db.data.chats[m.chat];
    if (!chat?.antiChannel) return;

    // ايدي قناتك الجديد الذي وضعته
    const myChannelId = '120363427010273264@newsletter';

    // استخراج بيانات التوجيه من القنوات (Newsletters)
    // نبحث في كل محتويات الرسالة الممكنة (نص، صورة، فيديو، إلخ)
    const messageType = Object.keys(m.message)[0];
    const contextInfo = m.message[messageType]?.contextInfo;
    const newsletterData = contextInfo?.forwardedNewsletterMessageInfo;

    // إذا كانت الرسالة موجهة من قناة (Newsletter)
    if (newsletterData) {
        // التحقق: هل الأيدي يختلف عن قناتك؟
        if (newsletterData.newsletterJid !== myChannelId) {
            
            const channelName = newsletterData.newsletterName || "قناة غير معروفة";
            
            try {
                // حذف الرسالة أولاً (الأولوية للسرعة)
                await conn.sendMessage(m.chat, { delete: m.key });
                
                // طرد العضو
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');

                let kickMsg = `
┏━━━━━━━━━━━━━━┓
┃ ⛔ تـم الـرصـد والـتـفـجـيـر ⛔
┗━━━━━━━━━━━━━━┛
┃ 👤 الـمـخـالـف: @${m.sender.split('@')[0]}
┃ 📢 الـمـصـدر: ${channelName}
┃ ⚖️ الإجـراء: طـرد + حـذف
┗━━━━━━━━━━━━━━┛`.trim();

                return conn.reply(m.chat, kickMsg, null, { mentions: [m.sender] });

            } catch (e) {
                console.error("خطأ في نظام الحماية:", e);
            }
        }
    }
};

handler.help = ['قفل_القنوات'];
handler.tags = ['group'];
handler.command = /^(قفل_القنوات|قفل_القناه|antichannel)$/i; 
handler.admin = true;
handler.group = true;

export default handler;