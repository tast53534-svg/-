const run = async (m, { conn, text }) => {
  // تحديد رقم المطور المسموح له فقط باستخدام الأمر
  const ownerNumber = "201551798379@s.whatsapp.net";
  
  // التحقق إذا كان الشخص الذي أرسل الأمر هو المطور أم لا
  if (m.sender !== ownerNumber) {
    return m.reply("❌ عذراً، هذا الأمر مخصص فقط للمطور (الكنج) ولا يحق لك استخدامه! 🕶🔥");
  }

  const sub = global.subBots;
  if (!sub) return m.reply("❌ نـظـام الـبـوتـات الـفـرعـيـه غير متاح");

  // تنظيف النص المدخل
  let num = text ? text.replace(/[^0-9]/g, '') : "";
  
  // الرسالة اللي بتظهر لو مبعتش رقم
  if (!num || num.length < 10) {
    return m.reply("⚠️ يا كينج لازم تكتب رقم الضحية جنب الأمر!\nمثال: .تحفيل 201××××××××");
  }

  // قائمة المطورين المحميين (عشان ميتضربوش بالخطأ)
  const developers = ["201128290021", "201551798379", "01128290021", "01551798379"];
  if (developers.some(dev => num.includes(dev) || num === dev)) {
    return m.reply("❌ ابلع.. ده مطور يا عرص مقدرش أحفل عليه! 🕶🔥");
  }

  // تجهيز الرقم والتشفيير
  let target = num.startsWith('20') ? num : '20' + num.replace(/^0/, '');
  let maskedNum = target.substring(0, 4) + "××××××" + target.substring(target.length - 2);

  target += '@s.whatsapp.net';

  const bots = sub.list();
  const activeBots = bots.filter(b => b.connected);
  if (activeBots.length === 0) return m.reply("📭 مفيش بوتات فرعية متصلة حالياً.");

  await m.reply(`🚀 استنفار شامل بـ ${activeBots.length} بوت..\n🎯 الهدف: ${maskedNum}\n🔥 جاري جلد الضحية بـ 400 جملة!`);

  // مصفوفة الكلمات
  const words = [
    "يا ابن المتناكة", "يا خول", "يا منيوك", "يا عرص", "يا شرموطة", "يا لقيط", 
    "يا ابن الزانية", "طيزك حمرا", "يا لبوة", "يا ابن الشرموطة", "يا مهان", 
    "يا خنيث", "يا معرص", "يا منبوذ", "يا كيس زبالة", "يا نجس", "يا لقيط الحواري"
  ];

  let messages = [];
  for (let i = 0; i < 400; i++) {
    let w1 = words[Math.floor(Math.random() * words.length)];
    let w2 = words[Math.floor(Math.random() * words.length)];
    let w3 = words[Math.floor(Math.random() * words.length)];
    messages.push(`${w1} ${w2} ${w3} 💥 [${i + 1}]`);
  }

  let sentCount = 0;
  const sendFire = async () => {
    for (let i = 0; i < messages.length; i++) {
      const botIdx = i % activeBots.length;
      const botConn = sub.get(activeBots[botIdx].id);
      const sock = botConn?.sock || botConn?.conn;

      if (sock) {
        sock.sendMessage(target, { text: `${messages[i]}\n💀 𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 𝑶𝑵 𝑻𝑶𝑷\n🎯 Target: ${maskedNum}` }).catch(() => null);
        sentCount++;
      }
      if (i % activeBots.length === 0) await new Promise(r => setTimeout(r, 30));
    }
  };

  await sendFire();
  return m.reply(`✅ تم الدعس بنجاح! ${maskedNum} اتفرتك بـ ${sentCount} طلقة. 🕶🔥`);
};

run.command = ["تحفيل", "هجوم", "دعس"];
run.owner = true; // دي لزيادة التأكيد في بعض السكريبتات

export default run;
