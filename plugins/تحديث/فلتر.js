export default async function before(m, { conn, isBotAdmin, isAdmin }) {
    if (!m.text) return false;

    const badWords = [
        "كسم", "شرموط", "عرص", "خول", "لبوة", "متناك", "قحبة", 
        "منيك", "كس", "زب", "طيز", "ابن المتناكة", "يا خول",
        "يا عرص", "يا شرموطة", "يا وسخ", "يا معرص", "سكس", "بورن"
    ];

    const hasBadWord = badWords.some(word => m.text.toLowerCase().includes(word));

    if (hasBadWord) {
        const myNumber = "201551798379";
        const isOwner = m.sender.includes(myNumber);
        if (isOwner || isAdmin) return false;

        try {
            // 1. مسح الرسالة القذرة فوراً
            if (isBotAdmin) {
                await conn.sendMessage(m.chat, { delete: m.key });
            }

            // 2. إرسال الرد كرسالة "جديدة" (بدون quoted) عشان تظهر للكل
            await conn.sendMessage(m.chat, { 
                text: `*مـمـنـوع شـتـايـم يـا نـرم احـتـرم نـفـسـك..*` 
            });

            return true;
        } catch (e) {
            console.error("Error in Anti-Badword:", e);
        }
    }
    return false;
}