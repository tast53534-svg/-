// === ⚙️ الإعدادات العامة ===
const CONFIG = {
    FLOOD_LIMIT: 5,
    FLOOD_WINDOW: 7000,
    DUPLICATE_LIMIT: 3,
    MENTION_LIMIT: 5,
    LONG_MSG_LENGTH: 200,
    WARN_RESET_TIME: 300000,
    CLEANUP_INTERVAL: 60000
};

// === 🧠 ذاكرة التتبع ===
if (!(global.spamTracker instanceof Map)) global.spamTracker = new Map();
if (!(global.spamWarns instanceof Map)) global.spamWarns = new Map();

// === 🧹 تنظيف الذاكرة ===
if (!global.spamCleanupStarted) {
    global.spamCleanupStarted = true;
    setInterval(() => {
        const now = Date.now();
        for (const [key, t] of global.spamTracker) {
            if (now - t.lastTime > 120000) global.spamTracker.delete(key);
        }
        for (const [key, w] of global.spamWarns) {
            if (now - w.lastWarn > CONFIG.WARN_RESET_TIME) global.spamWarns.delete(key);
        }
    }, CONFIG.CLEANUP_INTERVAL);
}

// === ✅ دالة فحص الأدمية (محسّنة - تدعم JID و LID) ===
async function isBotAdmin(conn, chat) {
    try {
        const meta = await conn.groupMetadata(chat);

        const botIds = new Set();
        if (conn.user?.id) {
            botIds.add(conn.user.id);
            botIds.add(conn.user.id.split(':')[0]);
            botIds.add(conn.user.id.split(':')[0].split('@')[0]);
            botIds.add(conn.user.id.split(':')[0] + '@s.whatsapp.net');
        }
        if (conn.user?.lid) {
            botIds.add(conn.user.lid);
            botIds.add(conn.user.lid.split(':')[0]);
            botIds.add(conn.user.lid.split(':')[0].split('@')[0]);
        }

        const botParticipant = meta.participants.find(p => {
            const pId = p.id || '';
            const pLid = p.lid || '';
            const pNum = pId.split('@')[0].split(':')[0];
            const pLidNum = pLid.split('@')[0].split(':')[0];
            return botIds.has(pId) || botIds.has(pLid) || botIds.has(pNum) || botIds.has(pLidNum);
        });

        return botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
    } catch (e) {
        console.error('❌ isBotAdmin error:', e.message);
        return false;
    }
}

// === ✅ حذف الرسالة ===
async function deleteSpam(conn, m) {
    try {
        await conn.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.sender
            }
        });
    } catch {}
}

// === ✅ طرد المستخدم ===
async function kickUser(conn, chat, sender) {
    try {
        await conn.groupParticipantsUpdate(chat, [sender], 'remove');
        return true;
    } catch (e) {
        console.error('❌ kickUser error:', e.message);
        return false;
    }
}

// =====================================================
// 🛡️ الأمر الرئيسي - الإدارة
// =====================================================
const handler = async (m, { conn, args, prefix }) => {
    if (!m.isGroup) {
        return conn.sendMessage(m.chat, { 
            text: '💠 هذا الأمر يعمل في المجموعات فقط' 
        }, { quoted: m });
    }
    
    if (!m.isAdmin && !m.isOwner) {
        return conn.sendMessage(m.chat, { 
            text: '📯 هذا الأمر للمشرفين فقط' 
        }, { quoted: m });
    }

    if (!global.db.groups) global.db.groups = {};
    if (!global.db.groups[m.chat]) global.db.groups[m.chat] = {};

    const arg = (args[0] || '').toLowerCase();
    const isEnable = ['on', 'تشغيل', 'فعل', 'enable'].includes(arg);
    const isDisable = ['off', 'تعطيل', 'ايقاف', 'disable'].includes(arg);

    if (isEnable) {
        global.db.groups[m.chat].antiSpam = true;
        global.dbInstance?.saveNow();
        return conn.sendMessage(m.chat, { 
            text: '✅ تم تفعيل مضاد السبام بنجاح' 
        }, { quoted: m });
    }

    if (isDisable) {
        global.db.groups[m.chat].antiSpam = false;
        global.dbInstance?.saveNow();
        return conn.sendMessage(m.chat, { 
            text: '🛑 تم تعطيل مضاد السبام' 
        }, { quoted: m });
    }

    // عرض الحالة والتعليمات
    const isOn = global.db.groups[m.chat].antiSpam;
    const statusText = `
*مـضـاد الـسـبـام*
*الحالة الحالية:* ${isOn ? '✅ مـفـعـل' : '🛑 مـعـطـل'} 

*🛠️ الاستخدام:*
- ${prefix}مضاد_السبام تشغيل
- ${prefix}مضاد_السبام تعطيل

*⚙️ الإعدادات:*
- الحد: ${CONFIG.FLOOD_LIMIT} رسائل / 7ث
- التكرار: ${CONFIG.DUPLICATE_LIMIT} مرات
`.trim();

    return conn.sendMessage(m.chat, { text: statusText }, { quoted: m });
};

// =====================================================
// 🎯 المعالج التلقائي (Before)
// =====================================================
handler.before = async (m, { conn }) => {
    if (!m.isGroup || !m.text || m.isOwner || m.isAdmin) return false;
    if (!global.db?.groups?.[m.chat]?.antiSpam) return false;

    const userKey = `${m.chat}:${m.sender}`;
    const now = Date.now();
    const cleanText = m.text.trim().toLowerCase();

    if (!global.spamTracker.has(userKey)) {
        global.spamTracker.set(userKey, { messages: [], lastText: '', duplicateCount: 0, lastTime: now });
    }
    const tracker = global.spamTracker.get(userKey);


    tracker.messages.push(now);
    tracker.messages = tracker.messages.filter(t => now - t <= CONFIG.FLOOD_WINDOW);
    const isFlood = tracker.messages.length > CONFIG.FLOOD_LIMIT;

    let isDuplicate = false;
    if (cleanText === tracker.lastText && cleanText.length > 3) {
        tracker.duplicateCount++;
        if (tracker.duplicateCount >= CONFIG.DUPLICATE_LIMIT) isDuplicate = true;
    } else {
        tracker.duplicateCount = 1;
        tracker.lastText = cleanText;
    }

    const mentions = m.mentionedJid || [];
    const isMentionSpam = mentions.length > CONFIG.MENTION_LIMIT;

    tracker.lastTime = now;

    if (!isFlood && !isDuplicate && !isMentionSpam) return false;

    const reason = isFlood ? '🔥 سرعة إرسال عالية' 
                : isDuplicate ? '🔁 تكرار الرسائل' 
                : '📢 منشن مكثف';

    if (!global.spamWarns.has(userKey)) {
        global.spamWarns.set(userKey, { count: 0, lastWarn: now });
    }
    const warns = global.spamWarns.get(userKey);
    warns.count++;
    warns.lastWarn = now;

    await deleteSpam(conn, m);

    tracker.messages = [];
    tracker.duplicateCount = 0;

    const userMention = `@${m.sender.split('@')[0]}`;

    if (warns.count === 1) {
        await conn.sendMessage(m.chat, {
            text: `⚠️ ${userMention} تـوقـف عـن الـسـبـام!\n📋 السبب: ${reason}\n⚡ التحذير القادم نهائي.`,
            mentions: [m.sender]
        });
    } else if (warns.count === 2) {
        await conn.sendMessage(m.chat, {
            text: `🚨 ${userMention} تـحـذيـر أخـيـر!\n📋 السبب: ${reason}\n⛔ المخالفة القادمة = طرد تلقائي.`,
            mentions: [m.sender]
        });
    } else {
        const botAdmin = await isBotAdmin(conn, m.chat);
        if (botAdmin) {
            const kicked = await kickUser(conn, m.chat, m.sender);
            if (kicked) {
                await conn.sendMessage(m.chat, {
                    text: `⛔ تم طرد ${userMention} بسبب استمراره في السبام.`,
                    mentions: [m.sender]
                });
                global.spamWarns.delete(userKey);
                global.spamTracker.delete(userKey);
            } else {
                await conn.sendMessage(m.chat, {
                    text: `❌ فشل طرد ${userMention} - ربما المستخدم أدمن.`,
                    mentions: [m.sender]
                });
            }
        } else {
            await conn.sendMessage(m.chat, {
                text: `⚠️ ${userMention} يرجى من المشرفين طرده (أنا لست أدمن).`,
                mentions: [m.sender]
            });
        }
    }
    return true;
};

handler.group = true;

export default handler;