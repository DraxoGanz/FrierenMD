/**
  * Base Ori Created By MannR
  * Name Script : Frieren CPANEL
  * Creator Script : Draxo
  * Version Script : 1.2.5
  * Libary : @whiskeysockets/baileys
  * Version Libary : ^6.6.0
  * Created on Sunday, Sep 1, 2024
  * Updated on Sunday, Dec 28, 2024
  * Thank you to MannR and the module providers and those who use this base.
  * Please use this base as best as possible and do not delete the copyright.
  * © Draxo 2024
**/

require('./lib/config.js')
const { Boom } = require('@hapi/boom')
const { baileys, chalk, fs, pino, readline, process, PhoneNumber } = require("./lib/module");
const { default: makeConnectionDraxo, DisconnectReason, useMultiFileAuthState, makeInMemoryStore, jidDecode, generateForwardMessageContent, downloadContentFromMessage, generateWAMessageFromContent, proto } = baileys
const CFonts = require('cfonts');
const { Sticker } = require("wa-sticker-formatter");

let useOfPairing = true

function question(q) {
    let y = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });
    return new Promise((resolve) => {
    y.question(q, resolve)
    });
};
global.tempatDB = 'json';
const DataBase = require('./source/database.js');
const database = new DataBase();
(async () => {
	const loadData = await database.read()
	if (loadData && Object.keys(loadData).length === 0) {
		global.db = {
			users: {},
			groups: {},
			database: {},
			settings : {}, 
			...(loadData || {}),
		}
		await database.write(global.db)
	} else {
		global.db = loadData
	}
	
	setInterval(async () => {
		if (global.db) await database.write(global.db)
	}, 3500)
});

let store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' })})

async function whatsappConnect() {
    let { state, saveCreds } = await useMultiFileAuthState("connect")
    var draxo = makeConnectionDraxo({
    printQRInterminal: !useOfPairing,
    browser: ["Linux", "Safari", ""],
    logger: pino({ level: "silent" }),
    auth: state
    })
    console.log(chalk.bold.blue('- Hi Welcome to Frieren Bot '))
    console.log(chalk.bold.white('| Terimakasih telah menggunakan Script ini !'))
    if (useOfPairing && !draxo.authState.creds.registered) {
        var number = await question('input your number whatsapp:\n')
        var code = await draxo.requestPairingCode(number.trim())
        console.log(chalk.bold.white('code:' + code))
    }
    
    draxo.welcome = "Halo @user selamat datang"
    draxo.leave = "Selamat tinggal @user"
    draxo.promote = "Selamat @user dipromote"
    draxo.demote = "Yahh @user didemote"
    
    draxo.public = true
    
    draxo.ai_sessions = draxo.ai_sessions ? draxo.ai_sessions : {};
    
    draxo.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
        if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete Session and Scan Again`);
        draxo.logout();
        } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting...."); whatsappConnect();
        } else if (reason === DisconnectReason.connectionLost) { 
        console.log("Connection Lost from Server, reconnecting..."); 
        whatsappConnect();
        } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First")
        draxo.logout();
        } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Scan Again And Run.`);
        draxo.logout();
        } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        whatsappConnect();
        } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        whatsappConnect();
        } else draxo.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        } else if (connection === "open") { 
        CFonts.say('Draxo', {
            font: 'simple', // Pilih salah satu font yang tersedia
            align: 'left', // Posisi teks
            colors: ['cyanBright', 'magentaBright'], // Warna teks
            background: 'transparent', // Warna background
            letterSpacing: 1, // Jarak antar huruf
            lineHeight: 2, // Tinggi baris
            space: true, // Spasi antar karakter
            maxLength: '0' // Panjang maksimal
        });
        console.log(chalk.bold.white("Simple Bot Create Panel Made by Draxo"))
        draxo.sendMessage('6288242704508' + "@s.whatsapp.net", { text: `☘️ *${global.namabot} Sukses Terhubung*\n🎁 *Author :* wa.me/6288242704508\n Ingin membeli script no enc? hubungi nomor author:)` }) // Hargailah yang create jangan ditempel² weem anj
        }
    console.log('Connected...', update)
    })
    
    draxo.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m) return;
        const messageHandler = await require('./draxo.js');
        messageHandler(draxo, m);
    });
    
    draxo.ev.on('group-participants.update', async (nu) => {
        console.log(nu);
        try {
        let { id, participants, action } = nu
        var metadata = await draxo.groupMetadata(id);
        
        for (let n of participants) {
            try {
            ppser = await draxo.profilePicture(n, 'image');
            } catch (e) {
            ppser = 'https://telegra.ph/file/68d47ac90bcc8ef1510fa.jpg';
            }
            
            switch (action) {
             case 'add':
             case 'remove': {
                var t = draxo.welcome.replace("user", n.split("@")[0])
                var t2 = draxo.leave.replace("user", n.split("@")[0])
                draxo.sendMessage(id, { text: (action === 'add' ? t : t2) }, { contextInfo: { mentionedJid: [n], externalAdReply: { title: action === 'add' ? 'Welcome' : 'Goodbye', body: "© Created by Draxo", thumbnailUrl: ppser, mediaType: 3, renderLargerThumbnail: false }}, mentions: [n] },{})
             }
             break;
             case 'promote': {
                var u = draxo.promote.replace("user", n.split("@")[0])
                draxo.sendMessage(id, { text: u }, { contextInfo: { mentionedJid: [n], externalAdReply: { title: '', body: "© Created by Draxo", thumbnailUrl: ppser, mediaType: 3, renderLargerThumbnail: false }}, mentions: [n] },{})
             }
             break;
             case 'demote': {
                var x = draxo.demote.replace("user", n.split("@")[0])
                draxo.sendMessage(id, { text: u }, { contextInfo: { mentionedJid: [n], externalAdReply: { title: '', body: "© Created by Draxo", thumbnailUrl: ppser, mediaType: 3, renderLargerThumbnail: false }}, mentions: [n] },{})
             }
             break;
            }
            
        }
        } catch (e) {
        console.log(e);
        }
    });
    
    
    draxo.ev.on('creds.update', await saveCreds);
    
    draxo.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {}
        return decode.user && decode.server && decode.user + '@' + decode.server || jid
    } else return jid
    }
    
    draxo.sendImageAsSticker = async (jid, imageBuffer, yaya) => {
    const sticker = new Sticker(imageBuffer, yaya)
    const stickerBuffer = await sticker.toBuffer()
    draxo.sendMessage(jid, { sticker: stickerBuffer })
    }
    
    draxo.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || ''
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
    const stream = await downloadContentFromMessage(message, messageType)
    let buffer = Buffer.from([])
    for await(const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk])}
    return buffer
    }
    
    draxo.copyNForward = async (jid, message, forceForward = false, options = {}) => {
    let vtype
    if (options.readViewOnce) {
        message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
        vtype = Object.keys(message.message.viewOnceMessage.message)[0]
        delete (message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
        delete message.message.viewOnceMessage.message[vtype].viewOnce
        message.message = {
            ...message.message.viewOnceMessage.message
        }
    }
    let mtype = Object.keys(message.message)[0]
    let content = await generateForwardMessageContent(message, forceForward)
    let ctype = Object.keys(content)[0]
    let context = {}
    if (mtype != "conversation") context = message.message[mtype].contextInfo
    content[ctype].contextInfo = {
        ...context,
        ...content[ctype].contextInfo
    }
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
        ...content[ctype],
        ...options,
        ...(options.contextInfo ? {
            contextInfo: {
                ...content[ctype].contextInfo,
                ...options.contextInfo
            }
        } : {})
    } : {})
    await draxo.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
    return waMessage
    }
    
    /** draxo.sendButton = async (jid, text, btn) => {
    let msg = generateWAMessageFromContent(jid, { viewOnceMessage: {
        message: { 
            "messageContextInfo": { 
            "deviceListMetadata": {}, 
            "deviceListMetadataVersion": 2
        }, 
        interactiveMessage: proto.Message.InteractiveMessage.create({
        contextInfo: { 
            mentionedJid: [jid] 
        },
        body: proto.Message.InteractiveMessage.Body.create({ 
            text: text
        }), 
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ 
        buttons: btn
        })
        })}
        }}, { userJid: jid, quoted: m })
        await draxo.relayMessage(msg.key.remoteJid, msg.message, { 
        messageId: msg.key.id 
        })
    } **/
    
    return draxo;
}

whatsappConnect();

process.on('uncaughtExceptopn', function (e) {
    console.log('Caught exception', e);
})
let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})
