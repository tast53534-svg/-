export default async function before(m, { conn, isBotAdmin, isAdmin }) {
    // 1. تحويل الرسالة لنص صافي (بدون مسافات زيادة)
    const text = m.text || "";
    
    // 2. رادار الروابط (Regex): بيلقط http أو https أو www أو روابط الجروبات
    // حتى لو النص فيه زخرفة أو حروف لازقة في اللينك
    const linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com\/)[^\s]+/gi;
    const hasLink = linkRegex.test(text);

    if (hasLink) {
        // 3. استثناء المطور (رقمك) والأدمن عشان الجروب ميبوظش
        const myNumber = "201551798379";
        const isOwner = m.sender.includes(myNumber);
        
        if (isOwner || isAdmin) return false;

        // 4. لو البوت مش أدمن مش هيقدر يطرد، فهيكتفي بالتحذير
        if (!isBotAdmin) return false;

        try {
            // تنفيذ المسح والطرد الفوري
            await conn.sendMessage(m.chat, { delete: m.key });
            
            await m.reply(`*⌞ 𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 𝑨𝑵𝑻𝑰-𝑳𝑰𝑵𝑲 ⚠️ ⌝*\n\n*قـفـشـتـك يـا حـب! الـروابـط مـمـنـوعـة هـنـا.. 🃏*\n*تـم حـذف رسـالـتـك وطـردك لـتـكـون عـبـرة! 👋🔥*`);
            
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            
            return true;
        } catch (e) {
            console.error("Error in Anti-Link Radar:", e);
        }
    }

    return false;
}