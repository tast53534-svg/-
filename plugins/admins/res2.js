const handler = async (m, { conn, args }) => {
  try {
    // جلب قائمة طلبات الانضمام المعلقة
    const req = await conn.groupRequestParticipantsList(m.chat);
    
    if (!req || req.length === 0) return m.reply("📭 مفيش طلبات انضمام معلقة حالياً.");

    let successCount = 0;
    
    // الحالة الأولى: من غير رقم → يقبل كل الطلبات واحد واحد
    if (!args[0] || args[0] === "") {
      let total = req.length;
      let current = 0;
      
      for (const request of req) {
        current++;
        const jid = request.jid || request.phone_number;
        await conn.groupRequestParticipantsUpdate(m.chat, [jid], "approve");
        successCount++;
        
        // رسالة تقدم لكل طلب
        await m.reply(`✅ تم قبول ${successCount} من ${total} طلبات...`);
        
        // تأخير بسيط بين كل طلب واللي بعده
        if (successCount < total) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      return m.reply(`✅ تم قبول كل الطلبات (${successCount} طلب) بنجاح واحد واحد.`);
    }
    
    // الحالة الثانية: مع رقم → يقبل العدد المطلوب دفعة واحدة
    const limit = parseInt(args[0]);
    if (isNaN(limit) || limit <= 0) return m.reply("❌ الرقم غير صالح. استخدم أمر صحيح مثل: .اقبل 5");
    
    const list = req.slice(0, limit);
    const jids = list.map(r => r.jid || r.phone_number);
    
    // قبول كل الطلبات دفعة واحدة
    await conn.groupRequestParticipantsUpdate(m.chat, jids, "approve");
    
    m.reply(`✅ تم قبول ${jids.length} طلب بنجاح دفعة واحدة.`);
    
  } catch (error) {
    console.error(error);
    m.reply("❌ حصلت مشكلة أثناء قبول الطلبات. تأكد إن البوت أدمن.");
  }
};

handler.help = ['اقبل'];
handler.command = ["اقبل"];
handler.tags = ["admin"];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;