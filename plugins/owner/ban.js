import fs from 'fs';

const ff = async (m, { conn, text, command }) => {
    let target;
    
    // 1. استخراج الرقم من الرسالة بالكامل
    let numberInText = m.text.replace(/[^0-9]/g, '');

    if (m.quoted) { 
        target = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) { 
        target = m.mentionedJid[0];
    } else if (numberInText.length >= 10) { 
        target = numberInText + '@s.whatsapp.net';
    }

    if (!target) return m.reply(`*⚠️ يرجى تحديد المستخدم!*\nمثال: .${command} 201289824539`);

    const jid = m.lid2jid ? await m.lid2jid(target) : target;
    if (!global.db.users[jid]) global.db.users[jid] = {};
    let user = global.db.users[jid];

    const isUnban = ["فك_حظر", "الغاء_الحظر", "فك_بان", "انبان"].includes(command);

    if (isUnban) {
        user.banned = false;
        await m.reply(`*✅ تم فك حظر @${target.split('@')[0]}*`, null, { mentions: [target] });
    } else {
        user.banned = true;
        
        // --- إضافة إرسال رسالة خاصة للمحظور ---
        try {
            await conn.sendMessage(target, { 
                text: `*🚫 تم منعك من استخدام البوت بسبب مخالفة القوانين!*` 
            });
        } catch (e) {
            console.log("فشل إرسال رسالة خاصة للمحظور، قد يكون خاص المستخدم مغلقاً.");
        }
        // ------------------------------------

        await m.reply(`*🚫 تم حظر @${target.split('@')[0]} بنجاح*\n*وتم إرسال رسالة المنع له على الخاص.*`, null, { mentions: [target] });
    }
};

ff.usage = ["حظر", "بان"];
ff.category = "owner";
ff.command = ["حظر", "بان", "فك_حظر", "الغاء_الحظر", "فك_بان", "انبان"];
ff.owner = true;

export default ff;
