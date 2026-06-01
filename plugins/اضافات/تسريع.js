let speed = async (m, { conn }) => {
try {
    const start = Date.now();
    await m.reply("🚀 جاري اختبار سرعة البوت...");
    const end = Date.now();
    const ping = end - start;
    
    let emoji = "🟢";
    let rate = "ممتازة";
    let note = "أداء خارق! البوت يعمل بكفاءة عالية";
    
    if (ping > 2000) {
        emoji = "🔴";
        rate = "ضعيفة جداً";
        note = "هناك مشكلة في الأداء، يفضل إعادة تشغيل البوت";
    } else if (ping > 1000) {
        emoji = "🟡";
        rate = "بطيئة";
        note = "يفضل مراجعة كود البوت أو تقليل عدد المتصلين";
    } else if (ping > 500) {
        emoji = "🟠";
        rate = "مقبولة";
        note = "أداء مقبول، يمكن تحسينه قليلاً";
    }
    
    await m.reply(`╭━━━━━━━━━━━━━━━━━━━━╮
┃     📊 *تقرير سرعة البوت*
┃
┃ ${emoji} *التقييم:* ${rate}
┃
┃ ⚡ *وقت الاستجابة:* \`${ping}ms\`
┃
┃ 📊 *المعيار:*
┃ 🚀 ممتاز: < 500ms
┃ ⚡ مقبول: 500-1000ms
┃ ⚠️ بطيء: 1000-2000ms
┃ ❌ ضعيف: > 2000ms
┃
┃ 💡 *نصيحة:* ${note}
┃
┃ ${ping < 1000 ? '🎉 البوت في حالة ممتازة!' : '🔧 يفضل تحسين أداء البوت'}
╰━━━━━━━━━━━━━━━━━━━━╯`);
    
} catch (error) {
    console.error(error);
    await m.reply("❌ حدث خطأ أثناء اختبار السرعة");
}
};

speed.command = ['تسريع', 'speed', 'سرعة', 'ping'];
speed.tags = ['info'];
speed.group = false;
speed.admin = false;
speed.botAdmin = false;

export default speed;