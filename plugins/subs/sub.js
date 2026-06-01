const run = async (m, { args, conn, bot }) => {

if (subBots.list().length >= 1 ) {
  return m.reply(" التنصيب غير متاح ع بوت لعد وجود سيرفر او عاد مادي من بوت لو عاوز تشتري بوت كلم مطور https://wa.me/201551798379");
} // عدد البوتات الي مسموح ب ربطهم فقط


  if (global.db.noSub) return m.reply("التنصيب غير متاح ع بوت لعد وجود سيرفر او عاد مادي من بوت لو عاوز تشتري بوت كلم مطور https://wa.me/201551798379 ")
  try {
    const num = m.sender.split("@")[0].replace(/[+\s-]/g, '');

    if (!/^\d+$/.test(num)) return m.reply("⚠️ رقم الهاتف غير الح");

    const sub = global.subBots;
    if (!sub) return m.reply("❌ نظام البوتات الفرعية غير متاح");

    const init = await m.reply(`⏳ جاري تنصيب بوت للرقم *${num}*...`);

    const state = { uid: null, pairDone: false, resolved: false, pending: null };

    const { images: img } = bot.config.info;

    const cleanup = () => {
      sub.off('pair', handlers.pair);
      sub.off('ready', handlers.ready);
      sub.off('error', handlers.error);
    };

    const handlers = {
      pair: (id, code) => {
        if (state.pairDone) return;
        if (!state.uid) { 
          state.pending = { id, code }; 
          return; 
        }
        if (id !== state.uid) return;
        state.pairDone = true;
        Func.pair(conn, code, num, m, init);
      },
      ready: (id) => {
        if (id !== state.uid || state.resolved) return;
        state.resolved = true;
        Func.ready(conn, num, m, img[Math.floor(Math.random() * img.length)]);
        cleanup();
      },
      error: (id, err) => {
        if (id !== state.uid || state.resolved) return;
        state.resolved = true;
        Func.error(conn, num, err, m);
        cleanup();
      },
    };

    sub.on('pair', handlers.pair);
    sub.on('ready', handlers.ready);
    sub.on('error', handlers.error);

    state.uid = await sub.add(num);

    if (state.pending?.id === state.uid && !state.pairDone) {
      state.pairDone = true;
      Func.pair(conn, state.pending.code, num, m, init);
    }

    setTimeout(() => {
      if (state.resolved) return;
      state.resolved = true;
      Func.timeout(conn, m, state.pairDone);
      cleanup();
    }, 120000);

  } catch (error) {
    await m.reply(error.message);
  }
};

run.command = ["رابط"];
run.noSub = true;
run.usage =  ["رابط"];
run.category = "sub";
export default run;



const Func = {
  pair: async (conn, code, num, m, reply_status) => {
    await conn.sendButton(m.chat, {
      imageUrl: "https://files.catbox.moe/2xhp9q.jpg",
      bodyText: `🔐⤿ نـظـام الـبـوتـات الـفـرعـيـه 𑁍
⊱⋅ ──────────── ⋅⊰
📱 — الرقم: ${num}
🔑 — الكود: ${code}
⊱⋅ ──────────── ⋅⊰
> *_افتح واتساب > الأجهزة المرتبطة > ربط جهاز برقم الهاتف > أدخل الكود_*`,
      footerText: "@𝑺𝒚𝒔𝒕𝒆𝒎_𝑺𝒖𝒃𝑩𝒐𝒕𝒔_𝑽𝑰𝑰",
      buttons: [
        { name: "cta_copy", params: { display_text: "⟨👑| 𝐂𝐨𝐩𝐲 𝐂𝐨𝐝𝐞 |👑⟩", copy_code: code } },
        { name: "cta_url", params: { display_text: "⟨👑| 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 𝐕𝐀 |👑⟩", url: "https://whatsapp.com/channel/0029VbCPEZ88F2pNsd7YQB1i" } },
      ],
      mentions: [m.sender],
      newsletter: {
        name: '𝑲𝑰𝑵𝑮 𝑩𝑶𝑻',
        jid: '120363427010273264@newsletter'
      },
      interactiveConfig: {
        buttons_limits: 10,
        list_title: "@𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 👑",
        button_title: "Click Here",
        canonical_url: `https://code.com/${code}`
      }
    }, global.reply_status);
  },

  ready: async (conn, num, m, img) => {
    await m.react("✅");
    await conn.sendMessage(m.chat, {
      text: `✅ — *تـم الاتـصـال بـنـجـاح*\n\n📱 الرقم: ${num}\n> *البوت جاهز للاستخدام الآن*`,
      contextInfo: {
        externalAdReply: {
          title: "𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 👑 | صلي على النبي محمد 🌺",
          body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢 𝚊𝚗𝚍 𝚟𝚎𝚛𝚢 𝚏𝚊𝚜𝚝",
          thumbnailUrl: img,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
  },

  error: async (conn, num, err, m) => {
    await m.reply(`❌ *فشل الاقتران!*\n\n📱 الرقم: ${num}\n⚠️ الخطأ: ${err?.message || 'غير معروف'}`);
  },

  timeout: async (conn, m, pairDone) => {
    await m.reply(pairDone
      ? `⏰ تم إرسال الكود لكن لم يتم تأكيد الاتصال.\nتأكد من إدخال الكود في واتساب.`
      : `⏰ لم يتم استلام كود الاقتران خلال 120 ثانية.\nالرجاء المحاولة مرة أخرى.`
    );
  }
};
