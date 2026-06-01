import axios from 'axios';

let tts = async (m, { text, conn }) => {
    try {
        let say = text ? text : (m.quoted && m.quoted.text ? m.quoted.text : null);
        if (!say) return m.reply("⚠️ اكتب النص الذي تريد نطقه");

        await m.react("⏳");

        // الرابط المباشر من جوجل
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(say)}&tl=ar&client=tw-ob`;

        // جلب البيانات كـ Buffer لضمان وصول الملف كامل
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        const audioBuffer = Buffer.from(res.data, 'binary');

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg', // صيغة MP3 قياسية
            ptt: false, // كدة هيوصل كملف صوتي مش ريكورد
            fileName: `KING-BOT-TTS.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: "𝑲𝑰𝑵𝑮 𝑩𝑶𝑻🃏 | صوتي",
                    body: "تم توليد ملف صوتي من النص",
                    thumbnailUrl: "https://i.top4top.io/p_3765en58l1.png",
                    sourceUrl: 'https://whatsapp.com/channel/0029VbCPEZ88F2pNsd7YQB1i',
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m });

        await m.react("✅");

    } catch (e) {
        console.error(e);
        m.reply("❌ حدث خطأ: " + e.message);
    }
};

tts.command = ['قول', 'نطق'];
tts.usage = ['قول'];  
tts.category = 'other';
export default tts;