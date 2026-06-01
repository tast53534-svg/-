import { Client } from 'meowsab';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '201024109563', // Bot number
  prefix: [".", "/", "!"],
  fromMe: null, 
  owners: [
  // Owner 1
    { name: "ديـ🔥ـشا || Disha⁩", lid: "253579701026847@lid", jid: "201551798379@s.whatsapp.net" },
  // Owner 2
    { name: "ج", lid: "34515045093@lid", jid: "201187246@s.whatsapp.net" },
  // Owner 3
    { name: "غرام", jid: "79152573071400@lid", lid: "201116765995@s.whatsapp.net" },
  // Owner 4 
   { name: "ي", jid: "2t", lid: "5" }
  ],
  settings: { noWelcome: false },
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);


if (!global.db) {
    global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;
config.info = { 
  nameBot: "♡ 𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 👑〈", 
  nameChannel: "𝑲𝑰𝑵𝑮 𝑩𝑶𝑻", 
  idChannel: "120363427010273264@newsletter",
  urls: {
    repo: "https://wa.me/201551798379",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029VbCPEZ88F2pNsd7YQB1i"
  },
  copyright: { 
    pack: '𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 👑', 
    author: '𝑲𝑰𝑵𝑮 𝑩𝑶𝑻 👑'
  },
  images: [
    "https://files.catbox.moe/2xhp9q.jpg",
    "https://i.pinimg.com/originals/e2/21/20/e221203f319df949ee65585a657501a2.jpg",
    "https://i.pinimg.com/originals/bb/77/0f/bb770fad66a634a6b3bf93e9c00bf4e5.jpg"
  ]
};

/* =========== Start ========== */
client.start();

setTimeout(async () => {
if (client.commandSystem) { 
sub(client)
  }
}, 2000);


/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
    if (e.message.includes('rate-overlimit')) {}
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
});


setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 800) {
        console.log(`🔄 Bot memory full (${used.toFixed(1)}MB), restarting...`)
        process.exit(1) 
    }
}, 300_000) 

