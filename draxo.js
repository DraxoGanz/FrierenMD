/**
  * Base Ori Created By MannR
  * Name Script : draxo
  * Creator Script : MannR
  * Version Script : 1.2.5
  * Libary : @whiskeysockets/baileys
  * Version Libary : ^6.6.0
  * Created on Sunday, Sep 1, 2024
  * Updated on Sunday, Dec 15, 2024
  * Thank you to MannR and the module providers and those who use this base.
  * Please use this base as best as possible and do not delete the copyright.
  * © Draxo 2024
**/

require("./lib/config.js")
var { axios, JavaScriptObfuscator, fetch, fs, chalk, baileys, execSync, util } = require("./lib/module.js")
var { watchFile, unwatchFile, readFileSync } = fs
var { generateWAMessageContent, generateWAMessageFromContent, getContentType, proto } = baileys
let cp = execSync
let { promisify } = util
let exec = promisify(cp.exec).bind(cp)
const {resep, wikipedia, cerpen, soundcloud, hoax, spesifikasi, wallpaper, pinterest, fakechat, sfile, distance, happymod, checkWeb, tts, kodepos, jadwalTV, simi, processing, otakudesu, anime, manga, character, topAnime, topManga, tiktok, BukaLapak, RingTone, ttp, lyrics, iNewsTV, DailyNews, DetikNews, Okezone, CNBC, AntaraNews, Kontan, halodoc, xnxx, aiCover, Instrument, vitsSpeech, Instagram, Komikcast, leptonAi, novita, nvidia, screenshotWeb, thinkany, GPT4, groupsor, komiku, facebook, ytSearch, LikeDown, mediafiredl, stickerTele, googleImage, sinonim, nomorhoki, jadwalsholat, chord, shanzzCdn } = require("./lib/scrape.js")
const { remini } = require('./source/remini.js')
const { TelegraPh } = require('./source/uploader.js')
const uploadImage = require('./source/uploadImage.js')
const ntilink = JSON.parse(fs.readFileSync("./lib/antilink.json"))

module.exports = draxo = async (draxo, m) => {
    try {
    let Read = async (draxo, jid, messageId) => {
        await draxo.readMessages([{ remoteJid: jid, id: messageId, participant: null }]);
    }
    
    if (!m) return m
    let M = proto.WebMessageInfo
    if (m.key) {
        m.id = m.key.id
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = draxo.decodeJid(m.fromMe && draxo.user.id || m.participant || m.key.participant || m.chat || '')
        if (m.isGroup) m.participant = draxo.decodeJid(m.key.participant) || ''
    }
    
    if (m.message) {
        m.mtype = getContentType(m.message)
        m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
        m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
        let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
        m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
        if (m.quoted) {
            let type = getContentType(quoted)
			m.quoted = m.quoted[type]
            if (['productMessage'].includes(type)) {
				type = getContentType(m.quoted)
				m.quoted = m.quoted[type]
			}
            if (typeof m.quoted === 'string') m.quoted = {
				text: m.quoted
			}
            m.quoted.mtype = type
            m.quoted.id = m.msg.contextInfo.stanzaId
			m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
            m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
			m.quoted.sender = draxo.decodeJid(m.msg.contextInfo.participant)
			m.quoted.fromMe = m.quoted.sender === (draxo.user && draxo.user.id)
            m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
			m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
            let vM = m.quoted.fakeObj = M.fromObject({
                key: {
                    remoteJid: m.quoted.chat,
                    fromMe: m.quoted.fromMe,
                    id: m.quoted.id
                },
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            })

            m.quoted.delete = () => draxo.sendMessage(m.quoted.chat, { delete: vM.key })

            m.quoted.copyNForward = (jid, forceForward = false, options = {}) => draxo.copyNForward(jid, vM, forceForward, options)

            m.quoted.download = () => draxo.downloadMediaMessage(m.quoted)
        }
    }
    if (m.msg.url) m.download = () => draxo.downloadMediaMessage(m.msg)
    m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''

	m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => draxo.copyNForward(jid, m, forceForward, options)

	const quoted = m.quoted ? m.quoted : m
    const message = m.message;
    const isGroup = m.key.remoteJid.endsWith('@g.us');
    const isName = m.pushName || 'no name';
    const isFrom = m.key.remoteJid;
    const sender = m.isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid;
const senderNumber = sender.split('@')[0];
    const isSender = isGroup ? (m.key.participant ? m.key.participant : m.participant) : m.key.remoteJid;
    const isOwner = global.owner.includes(isSender);
    const groupMetadata = isGroup ? await draxo.groupMetadata(isFrom) : {}; 
    const mime = (quoted.msg || quoted).mimetype || quoted.mediaType || "";
    const participants = isGroup ? groupMetadata.participants : '';
    const groupName = isGroup ? groupMetadata.subject : '';
    const groupAdmins = m.isGroup ? await participants.filter(v => v.admin !== null).map(v => v.id) : '';
    const isBotAdmins = m.isGroup ? groupAdmins.includes(draxo.user.jid) : false
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    const AntiLink = m.isGroup ? ntilink.includes(from) : false 
    
    let mType = Object.keys(message)[0];
    let body = (mType === 'conversation' && message.conversation) ? message.conversation :
               (mType === 'extendedTextMessage' && message.extendedTextMessage.text) ? message.extendedTextMessage.text :
               (mType === 'imageMessage' && message.imageMessage.caption) ? message.imageMessage.caption :
               (mType === 'videoMessage' && message.videoMessage.caption) ? message.videoMessage.caption :
               (mType === 'buttonsResponseMessage') ? message.buttonsResponseMessage.selectedButtonId :
               (mType === 'listResponseMessage') ? message.listResponseMessage.singleSelectReply.selectedRowId :
               (mType === 'templateButtonReplyMessage') ? message.templateButtonReplyMessage.selectedId :
               (mType === 'messageContextInfo') ? (message.buttonsResponseMessage?.selectedButtonId || message.listResponseMessage?.singleSelectReply.selectedRowId || message.text) :
               (mType === 'documentMessage' && message.documentMessage.caption) ? message.documentMessage.caption : '';
   const moment = require('moment-timezone');
const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
if(time2 < "19:00:00"){
var ucapanWaktu = "Selamat Malam🌃"
}
if(time2 < "15:00:00"){
var ucapanWaktu = "Selamat Sore🌄"
 }
if(time2 < "11:00:00"){
var ucapanWaktu = "Selamat Siang🏞️"
}
if(time2 < "06:00:00"){
var ucapanWaktu = "Selamat Pagi🏙️ "
 }
if(time2 < "23:59:00"){
var ucapanWaktu = "Selamat Subuh🌆"
}
const tanggal = moment().tz("Asia/Jakarta").format("ll");
const wib = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("HH:mm:ss z");
const wita = moment(Date.now()).tz("Asia/Makassar").locale("id").format("HH:mm:ss z");
const wit = moment(Date.now()).tz("Asia/Jayapura").locale("id").format("HH:mm:ss z");

// Database
const prem = JSON.parse(fs.readFileSync("./source/premium.json"));

// Cek database
const isPremium = prem.includes(sender);

    const prefix = ['.', ',', '!', '?', '#', ''];
    const args = body.trim().split(/ +/).slice(1);
    const text = args.join(' ');
    if (!prefix.some(p => body.startsWith(p))) return;
    if (m.fromMe) return;
    const [command] = body.slice(prefix.find(p => body.startsWith(p)).length).trim().split(/ +/);
    
    var cmd = prefix + command

    await Read(draxo, m.key.remoteJid, m.key.id);
    
    let x = chalk.bold.cyan("[ Message Draxo ]");
    x += chalk.cyan("\nᕐ⁠ᐷ From: ")
    x += chalk.bold.white(isSender)
    x += chalk.cyan("\nᕐ⁠ᐷ Command: ")
    x += chalk.bold.white(command + " " + text)
    console.log(x)
    
    m.reply = async (text) => {
        let { id, name } = await draxo.user
        let z = await draxo.profilePictureUrl(id, "image")
        draxo.sendMessage(m.key.remoteJid, { text: text, contextInfo: {
        forwardingScore: 0,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363297087070564@newsletter",
          serverMessageId: 0,
          newsletterName: global.namabot
        },
        mentionedJid: [m.sender],
        externalAdReply: {
        showAdAttribution: true,
        title: name,
        body: "© Draxo - 2024",
        thumbnailUrl: global.thumb,
        sourceUrl: "https://whatsapp.com/channel/0029Vae24SL0VycNBWSvVX00",
        mediaType: 1,
        renderLargerThumbnail: false
        }}}, { quoted: m })
    };
    draxoreply = async (text) => {
    let { id, name } = await draxo.user
    draxo.sendMessage(m.key.remoteJid, { text: text, contextInfo: {
        forwardingScore: 0,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363297087070564@newsletter",
          serverMessageId: 0,
          newsletterName: global.namabot
        },
        mentionedJid: [m.sender],
        externalAdReply: {
        showAdAttribution: true,
        title: name,
        body: "© Draxo - 2024",
        thumbnailUrl: global.thumb,
        sourceUrl: "https://whatsapp.com/channel/0029Vae24SL0VycNBWSvVX00",
        mediaType: 1,
        renderLargerThumbnail: true
        }}}, { quoted: m })
        };
    m.react = (q) => {
        draxo.sendMessage(m.chat, { react: { text: q, key: m.key }})
    }
    
    m.upTime = () => {
        let ms = require("process").uptime() * 1000
        let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
        let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
        let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
        return [d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* '].map(v => v.toString().padStart(2, 0)).join('')
    }
    
    draxo.sendButton = async (jid, text, btn) => {
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
    }
    
    function format(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    } else {
        return views.toString();
    }
    }
    
    const sendPlay = async (text) => {
        if (!text) return m.reply("Masukan judul!")
        try {
        let { data } = await axios({
            "method": "GET",
            "url": "https://mannoffc-x.hf.space/search/spotify",
            "params": { "s": text }
        })
        let { name, artists, link, image, duration_ms } = data.result[0]
        let { data: _data } = await axios({
            "method": "GET",
            "url": "https://mannoffc-x.hf.space/download/spotify",
            "params": { "url": link }
        })
        let { download } = _data.result
        let resText = `• *Name:* ${name}\n• *Artist:* ${artists}\n• *Duration:* ${duration_ms}ms`
        let qq = await draxo.sendMessage(m.chat, { image: { url: image }, caption: resText }, { quoted: m })
        draxo.sendMessage(m.chat, { audio: { url: download }, mimetype: "audio/mpeg" }, { quoted: qq })
        } catch (e) {
        console.log(e)
        m.reply(e.message)
        }
    }
    
    const sendTxt2img = async (text) => {
        if (!text) return m.reply("Masukan teks!")
        try {
        var { data } = await axios({
            "method": "GET",
            "url": "https://hercai.onrender.com/v3/text2image",
            "params": { "prompt": text }
        })
        draxo.sendMessage(m.chat, {
        image: { url: data.url }
        }, { quoted: m })
        } catch (e) {
        m.reply(e.message)
        console.log(e)
        }
    }
    
    switch (command) {

        case "ai": {
            //if (!text) return m.reply(`Contoh *.ai* <on/off>`)
            if (text == "off") {
                delete draxo.ai_sessions[m.sender]
                m.reply("[ ✓ ] Success delete session chat")
            } else if (draxo.ai_sessions[m.sender]) {
                m.reply("[ ! ] Ai sudah aktif lohhh kak..!!!")
            } else {
                draxo.ai_sessions[m.sender] = { messages: [] }
                m.reply("[ ✓ ] Success create session chat\n> Ketik *.ai* off atau *matikan ai* untuk menghapus sessions chat.")
            }
        }
        break
        
        case "enc": {
        if (!text) return m.reply("Masukan teksnya!")
        try {
        let { getObfuscatedCode: res } = JavaScriptObfuscator.obfuscate(text)
        return res
        } catch ({ message }) {
        m.reply(message)
        }
        }
        break
        case "runtime": case "uptime": {
        let _muptime
    if (process.send) {
        process.send('uptime')
        _muptime = await new Promise(resolve => {
            process.once('message', resolve)
            setTimeout(resolve, 1000)
        }) * 1000 }
    let muptime = m.upTime(_muptime)
    m.reply(muptime)
    }
    break
        case "clock": {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let x = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
        m.reply(x)
        }
        break
        
        case "tiktok": case "tt": {
        if (!text.includes("tiktok.com")) return m.reply("Masukan link tiktok, Contoh *.tt* https://www.tiktok.com/xxxx")
        try {
        let { data } = await axios({
        "method": "GET",
        "url": "https://mannoffc-x.hf.space/download/tiktok",
          "params": {
            "url": text
          }
        })
        let { author, title, duration, medias } = data.result;
        let { url } = medias[1]
        let caption = `*T I K T O K • D O W N L O A D E R*\n• Author: ${author}\n• Title: ${title}\n• Duration: ${duration}s`
        draxo.sendMessage(m.chat, { video: { url }, caption }, { quoted: m })
        } catch ({ message }) {
        m.reply(message)
        }
        }
        break

	    case "facebook": case "fb": {
        if (!text.includes("facebook.com")) return m.reply("Masukan link facebook, Contoh *.fb* https://www.facebook.com/xxxx")
        try {
        axios({ "method": "GET", "url": "https://mannoffc-x.hf.space/download/facebook", "params": { "url": text }}).then(_ => {
        draxo.sendMessage(m.chat, { video: { url: _.data.result.video }, caption: "Ini dia kak" }, { quoted: m })
        })
        } catch ({ message }) {
        return m.reply(message)
        }
        }
        break
        
        /** case "upch": {
        if (!m.quoted) return m.reply("Balas sebuah gambar/video/audio dengan caption *.upch*")
        try {
        let q = await m.quoted.download()
        } catch ({ message }) {
        m.reply(message)
        }
        }
        break **/
        
        case "ngl": {
        let c = text.split("|")
        let username = c[0]
        let message = c[1]
        if (!username) return m.reply("Masukan usernamenya, Contoh *.ngl* mann|halo")
        if (!message) return m.reply("Masukan messagenya, Contoh *.ngl* mann|halo")
        try {
        await axios({
            method: "POST",
            url: "https://api.manaxu.my.id/api/tools/ngl",
            headers: {
              "x-api-key": "key-manaxu-free",
              "Content-Type": "application/json"
            },
            data: {
                username,
                message
            }
        })
        m.reply("Pesan " + message + " berhasil terkirim ke " + username)
        } catch ({ message }) {
        m.reply(message)
        }
        }
        break
        
        case "exec": {
        if (!isOwner) return m.reply("Khusus owner hehe :3")
        m.reply('🐾Executing...')
        let o
        try {
        o = await exec(command.trimStart()  + ' ' + text.trimEnd())
        } catch (e) {
        o = e
        } finally {
        let { stdout, stderr } = o
        if (stdout.trim()) m.reply(stdout)
        if (stderr.trim()) m.reply(stderr)
        }
        }
        break
        
        case ">": {
        if (!isOwner) return m.reply("Khusus owner hehe :3")
        try {
        let evaled = await eval(text)
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
        await m.reply(evaled)
        } catch (err) {
        m.reply(String(err))
        }
        }
        break
        
        case "soundcloud": {
        if (!text) return m.reply("Masukan judulnya, Contoh *.soundcloud* dear god");
        try {
        var { data: dataSearch } = await axios({
            "method": "GET",
            "url": "https://api-nodex.vercel.app/soundcloud/search",
            "params": {
                "q": text
            }
        })
    
        let { result: resultSearch } = dataSearch
        // let { link, title } = resultSearch[Math.floor(Math.random() * resultSearch.length)]
        let { link, title } = resultSearch[0]
    
        var { data: dataDownload } = await axios({
            "method": "GET",
            "url": "https://api-nodex.vercel.app/soundcloud/download",
           "params": {
                "url": link
            }
        })
    
        let { result: resultDownload } = dataDownload
    
        draxo.sendMessage(m.chat, { audio: { url: resultDownload.download }, mimetype: "audio/mp4" }, { quoted: m })
        } catch ({ message }) {
        return m.reply(message)
        }
        }
        break
        
        case "getpp": {
        try {
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
        else who = m.quoted.sender ? m.quoted.sender : m.sender
        let pp = await draxo.profilePictureUrl(who, 'image').catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png")
        draxo.sendMessage(m.chat, { image: { url: pp }, caption: "Ini dia kak" }, { quoted: m })
        } catch {
        let sender = m.sender
        let pp = await draxo.profilePictureUrl(sender, 'image').catch((_) => "https://telegra.ph/file/24fa902ead26340f3df2c.png")
        draxo.sendMessage(m.chat, { image: { url: pp }, caption: "Ini dia kak" }, { quoted: m })
        }
        }
        break
        
        case "toptv": {
        if (!m.quoted) return m.reply("Balas sebuah video dengan *.toptv*")
        try {
        let x = await m.quoted.download()
        let msg = await generateWAMessageContent({ video: x }, { upload: draxo.waUploadToServer })
        await draxo.relayMessage(m.chat, { ptvMessage: msg.videoMessage }, { quoted: m })
        } catch ({ message }) {
        return m.reply(message)
        }
        }
        break
        
        case "brat": {
        if (!text) return m.reply("Masukan teks, Contoh *.brat* kmu knp sih?")
        try {
        let data = "https://mannoffc-x.hf.space/brat?q=" + text
        draxo.sendImageAsSticker(m.chat, data, { pack: "Created by Draxo", author: m.pushName, type: "full" })
        } catch ({ message }) {
        return m.reply(message)
        }
        }
        break
        
        case "videy": {
        if (!text.includes("videy.com")) return m.reply("Mana linknya?")
        try {
        let cap = `Menonton video porno itu bahaya, guys! 😤 Bisa bikin hati kita kotor dan jauh dari Allah. Dalam Al-Qur'an Surah Al-Mu'minun ayat 5-7, Allah bilang, "Dan mereka yang menjaga kemaluannya, kecuali terhadap istri-istri mereka..." Jadi, lebih baik fokus ke hal yang positif dan menjaga diri dari yang haram! 😇`
        let { data } = await axios({
            "method": "GET",
            "url": "https://mannoffc-x.hf.space/download/videy",
            "params": { "url": text }
        })
        let s = await draxo.sendMessage(m.chat, { video: { url: data.result }}, { quoted: m })
        draxo.sendMessage(m.chat, { text: cap }, { quoted: s })
        } catch (e) {
        m.reply("Terdapat kesalahan: " + e.message)
        console.log(e)
        }
        }
        break;

        case "play": {
        await sendPlay(text);
        }
        break;
        
        case "hitungwr": {
        if (!text) return m.reply("Contoh *.hitungwr* 650 58 89")
        let [tm, tw, mw] = text.split(" ")
        if (isNaN(tm)) return m.reply("Masukan total Match")
        if (isNaN(tw)) return m.reply("Masukan total Winrate")
        if (isNaN(mw)) return m.reply("Masukan tujuan Winrate")
        try {
        const TotalMatch = tm
        const TotalWr = tw
        const MauWr = mw

        function result() {
        if (MauWr === 100) {
        m.reply("Mana bisalahh 100% 😂");
        }
        const resultNum = rumus(TotalMatch, TotalWr, MauWr);
        const x = `Kamu memerlukan sekitar ${resultNum} win tanpa lose untuk mendapatkan win rate ${MauWr}%`;
        m.reply(x)
        }

        function rumus(TotalMatch, TotalWr, MauWr) {
        let tWin = TotalMatch * (TotalWr / 100);
        let tLose = TotalMatch - tWin;
        let sisaWr = 100 - MauWr;
        let wrResult = 100 / sisaWr;
        let seratusPersen = tLose * wrResult;
        let final = seratusPersen - TotalMatch;
        return Math.round(final);
        }
        result()
        } catch (e) {
        console.log(e)
        }
        }
        break
        
        case "txt2img": {
        await sendTxt2img(text);
        }
        break
        case "cekidch":
case "idch": {
    if (!text) return m.reply("linkchnya");
    if (!text.includes("https://whatsapp.com/channel/")) return m.reply("Link tautan tidak valid");
    let result = text.split('https://whatsapp.com/channel/')[1];
    try {
        let res = await draxo.newsletterMetadata("invite", result);
        let teks = `
*ID:* ${res.id}
*Nama:* ${res.name}
*Total Pengikut:* ${res.subscribers}
*Status:* ${res.state}
*Verified:* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}
`;
        return m.reply(teks);
    } catch (error) {
        return m.reply("Terjadi kesalahan saat mengambil data: " + error.message);
    }
}
break
        case "myip": {
        if (!isOwner) return m.reply("Khusus owner hehe :3")
        try {
        var { ip } = (await axios.get("https://api.ipify.org/?format=json")).data
        m.reply("IP: " + ip)
        } catch (e) {
        console.log(e)
        m.reply(e.message)
        }
        }
        break;
        
        case "s": case "sticker": case "stiker": {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (/image/.test(mime)) {
        let media = await q.download()
        draxo.sendImageAsSticker(m.chat, media, m, { pack: "cobalagidanlagi", type: "full" })
        } else {
        m.reply("Balas sebuah gambar (ga support video) dengan *.s*")
        }
        }
        break
        case "1gb": case "2gb": case "3gb": case "4gb": case "5gb": case "6gb": case "7gb": case "8gb": case "9gbb": case "10gb": case "unli": {
    if (!isPremium && !isOwner) return draxoreply("Maaf Kamu Belum Terdaftar Di Database Resseler Silahkan Untuk Menghubungi Owner")
let s = text.split(',')
let nomor = s[1]
if (!args[0]) return m.reply("nama,6283XXX")
if (!text.split(",")) return m.reply("nama,6283XXX")
var buyyer = text.split(",")[0].toLowerCase()
if (!buyyer) return m.reply("nama,6283XXX")
var ceknya = text.split(",")[1]
if (!ceknya) return m.reply("nama,6283XXX")
var client = text.split(",")[1].replace(/[^0-9]/g, '')+'@s.whatsapp.net'
var check = await draxo.onWhatsApp(ceknya)
if (!check[0].exists) return m.reply("Nomor Buyyer Tidak Valid!")
global.panel2 = [buyyer, client]
let nomornya = nomor.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
var ram
var disknya
var cpu
if (command == "1gb") {
ram = "1125"
disknya = "1125"
cpu = "40"
} else if (command == "2gb") {
ram = "2125"
disknya = "2125"
cpu = "60"
} else if (command == "3gb") {
ram = "3125"
disknya = "3125"
cpu = "80"
} else if (command == "4gb") {
ram = "4125"
disknya = "4125"
cpu = "100"
} else if (command == "5gb") {
ram = "5125"
disknya = "5125"
cpu = "120"
} else if (command == "6gb") {
ram = "6125"
disknya = "6125"
cpu = "140"
} else if (command == "7gb") {
ram = "7125"
disknya = "7125"
cpu = "160"
} else if (command == "8gb") {
ram = "8125"
disknya = "8125"
cpu = "180"
} else if (command == "9gb") {
ram = "9124"
disknya = "9125"
cpu = "200"
} else if (command == "10gb") {
ram = "10125"
disknya = "10125"
cpu = "220"
} else {
ram = "0"
disknya = "0"
cpu = "0"
}
let username = global.panel2[0].toLowerCase()
let email = username+"@buyer.draxo"
let name = username
let password = username + "024"
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Memb",
"language": "en",
"password": password
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
let desc = "Buyer Draxo"
let usr_id = user.id
let f1 = await fetch(domain + "/api/application/nests/5/eggs/" + egg, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let data2 = await f1.json();
let startup_cmd = data2.attributes.startup
let f2 = await fetch(domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
},
"body": JSON.stringify({
"name": name,
"description": desc,
"user": usr_id,
"egg": parseInt(egg),
"docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"CMD_RUN": "npm start"
},
"limits": {
"memory": ram,
"swap": 0,
"disk": disknya,
"io": 500,
"cpu": cpu
},
"feature_limits": {
"databases": 5,
"backups": 5,
"allocations": 5
},
deploy: {
locations: [parseInt(loc)],
dedicated_ip: false,
port_range: [],
},
})
})
let result = await f2.json()
if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))
let server = result.attributes
await m.reply(`*Berhasil Membuat Akun Panel ✅*\n\n* *User ID :* ${user.id}\n* *Server ID :* ${server.id}\n* *Nama :* ${name} Server\n* *Ram :* ${ram == "0" ? "Unlimited" : ram.charAt(0) + "GB"}\n* *CPU :* ${cpu == "0" ? "Unlimited" : cpu+"%"}\n* *Storage :* ${disknya == "0" ? "Unlimited" : disknya.charAt(0) + "GB"}\n* *Created :* ${desc}\n\nData Akun Sudah Dikirim Ke Nomor ${global.panel2[1].split('@')[0]}`)
var datapanel = `Hai @${global.panel2[1].split`@`[0]}
*BERIKUT DATA AKUN PANEL ANDA*

* *Username :* ${user.username}
* *Password :* ${password.toString()}
* *Link Login :* ${global.domain}

*Note / Catatan :*
> dilarang membagikan panel free
> dilarang menyebarkan data panel
> dilarang menyebarkan link panel
`
draxo.sendMessage(nomornya, {text: datapanel }, { quoted: m })
}
break

case "cadmin": case "adp": {
if (!isPremium && !isOwner) return draxoreply(mess.owner)

let s = text.split(',')
let email = s[0];
let username = s[0]
let nomor = s[1]
if (s.length < 2) return draxoreply(`*Format salah!*
Penggunaan:
${prefix + command} user,nomer`)
if (!username) return draxoreply(`Ex : ${prefix+command} Username,@tag/nomor\n\nContoh :\n${prefix+command} example,@user`)
if (!nomor) return draxoreply(`Ex : ${prefix+command} Username,@tag/nomor\n\nContoh :\n${prefix+command} example,@user`)
let password = username + "024"
let nomornya = nomor.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": username + "@gmail.com",
"username": username,
"first_name": username,
"last_name": "Memb",
"language": "en",
 "root_admin" : true,  
"password": password.toString()
})

})

let data = await f.json();

if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));

let user = data.attributes

let tks = `
TYPE: USER

ID: ${user.id}
USERNAME: ${user.username}
EMAIL: ${user.email}
NAME: ${user.first_name} ${user.last_name}
CREATED AT: ${user.created_at}
`
    const listMessage = {

        text: tks,

    }

	

    await draxo.sendMessage(m.chat, listMessage)

    await draxo.sendMessage(nomornya, {

        text: `*DETAIL AKUN ADMIN  PANEL ANDA*


╭─❏ *『 USER INFO 』*
┣❏ ➤ *👤USERNAME* : ${username}
┣❏ ➤ *🔐PASSWORD* : ${password}
┣❏ ➤ *🌐LOGIN* : ${domain}
┗⬣

_*Rules :*_
*- Jangan Hapus Akun Admin Lain*
*- Jangan Colong SC Buyer panel*
*- Jangan membuat Panel Terlalu besar*
*- Jangan Share Akun Admin Panel Kalian*
*- Jangan Membuat Akun Admin Panel Lain*
*- Jangan Open Reseller Panel*
*- Jangan Otak Atik Server Panel*
*- Jangan Give Away Panel*
*Melanggar Salah Satu Rules Di Atas Langsung Di Hapus Admin Panel Nya*
_*mohon ikuti rules nya*_
`,

    })        
}
break
        case "listadmin": {
  if (!isPremium && !isOwner) return draxoreply(`Maaf, Anda tidak dapat melihat daftar pengguna.`);
  let page = args[0] ? args[0] : '1';
  let f = await fetch(domain + "/api/application/users?page=" + page, {
    "method": "GET",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apikey
    }
  });
  let res = await f.json();
  let users = res.data;
  let messageText = "Berikut list admin:\n\n";

  for (let user of users) {
    let u = user.attributes;
    if (u.root_admin) {
      messageText += `ID: ${u.id} - Status: ${u.attributes?.user?.server_limit === null ? 'Inactive' : 'Active'}\n`;
      messageText += `${u.username}\n`;
      messageText += `${u.first_name} ${u.last_name}\n\n`;
    }
  }

  messageText += `Page: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
  messageText += `Total Admin: ${res.meta.pagination.count}`;

  await draxo.sendMessage(m.chat, { text: messageText }, { quoted: m });

  if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
    m.reply(`Gunakan perintah .listusr ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya.`);
  }        
}
break
case "addprem":{
if (!isPremium && !isOwner) return m.reply('Khusus Draxo')
if (!args[0]) return m.reply(`Penggunaan .${command} nomor\nContoh .${command} 6288242704508`)
prrkek = text.split("|")[0].replace(/[^0-9]/g, '')+`@s.whatsapp.net`
let ceknya = await draxo.onWhatsApp(prrkek)
if (ceknya.length == 0) return reply(`Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!`)
prem.push(prrkek)
fs.writeFileSync("./source/premium.json", JSON.stringify(prem))
m.reply(`Nomor ${prrkek} Telah Menjadi Premium!`)
}
break
case "delprem":{
if (!isOwner) return m.reply('Khusus Draxo')
if (!args[0]) return m.reply(`Penggunaan .${command} nomor\nContoh .${command} 6288242704508`)
ya = text.split("|")[0].replace(/[^0-9]/g, '')+`@s.whatsapp.net`
unp = prem.indexOf(ya)
prem.splice(unp, 1)
fs.writeFileSync("./source/premium.json", JSON.stringify(prem))
m.reply(`Nomor ${ya} Telah Di Hapus Premium!`)
}
        break
case "listuser": {
  if (!isOwner) return m.reply('Khusus Draxo')
  let page = args[0] ? args[0] : '1';
  let f = await fetch(domain + "/api/application/users?page=" + page, {
    "method": "GET",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apikey
    }
  });
  let res = await f.json();
  let users = res.data;
  let messageText = "Berikut list user:\n\n";
  
  for (let user of users) {
    let u = user.attributes;
    messageText += `ID: ${u.id} - Status: ${u.attributes?.user?.server_limit === null ? 'Inactive' : 'Active'}\n`;
    messageText += `${u.username}\n`;
    messageText += `${u.first_name} ${u.last_name}\n\n`;
  }
  
  messageText += `Page: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
  messageText += `Total Users: ${res.meta.pagination.count}`;
  
  await draxo.sendMessage(m.chat, { text: messageText }, { quoted: m });
  
  if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
    m.reply(`Gunakan perintah .listuser ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya.`);
  }
}
break
case "listserver": {
  if (!isPremium && !isOwner) return m.reply(`Maaf, Anda tidak dapat melihat daftar server.`);
  let page = args[0] ? args[0] : '1';
  let f = await fetch(domain + "/api/application/servers?page=" + page, {
    "method": "GET",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apikey
    }
  });
  let res = await f.json();
  let servers = res.data;
  let sections = [];
  let messageText = "Berikut adalah daftar server:\n\n";
  
  for (let server of servers) {
    let s = server.attributes;
    
    let f3 = await fetch(domain + "/api/client/servers/" + s.uuid.split`-`[0] + "/resources", {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + capikey
      }
    });
    
    let data = await f3.json();
    let status = data.attributes ? data.attributes.current_state : s.status;
    
    messageText += `ID Server: ${s.id}\n`;
    messageText += `Nama Server: ${s.name}\n`;
    messageText += `Status: ${status}\n\n`;
  }
  
  messageText += `Halaman: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;
  messageText += `Total Server: ${res.meta.pagination.count}`;
  
  await draxo.sendMessage(m.chat, { text: messageText }, { quoted: m });
  
  if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {
    m.reply(`Gunakan perintah .listserver ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya.`);
  }        
}
break
case "addsrv": {
let s = text.split(',');
if (s.length < 7) return m.reply(`*Format salah!*

Penggunaan:
.${command} name,tanggal,userId,eggId,locationId,memory/disk,cpu`)
let name = s[0];
let desc = s[1] || ''
let usr_id = s[2];
let egg = s[3];
let loc = s[4];
let memo_disk = s[5].split`/`;
let cpu = s[6];
let f1 = await fetch(domain + "/api/application/nests/5/eggs/" + egg, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let data = await f1.json();
let startup_cmd = data.attributes.startup

let f = await fetch(domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
},
"body": JSON.stringify({
"name": name,
"description": desc,
"user": usr_id,
"egg": parseInt(egg),
"docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"CMD_RUN": "npm start"
},
"limits": {
"memory": memo_disk[0],
"swap": 0,
"disk": memo_disk[1],
"io": 500,
"cpu": cpu
},
"feature_limits": {
"databases": 5,
"backups": 5,
"allocations": 5
},
deploy: {
locations: [parseInt(loc)],
dedicated_ip: false,
port_range: [],
},
})
})
let res = await f.json()
if (res.errors) return m.reply(JSON.stringify(res.errors[0], null, 2))
let server = res.attributes
m.reply(`*SUCCESSFULLY ADD SERVER*

TYPE: ${res.object}

ID: ${server.id}
UUID: ${server.uuid}
NAME: ${server.name}
DESCRIPTION: ${server.description}
MEMORY: ${server.limits.memory === 0 ? 'Unlimited' : server.limits.memory} MB
DISK: ${server.limits.disk === 0 ? 'Unlimited' : server.limits.disk} MB
CPU: ${server.limits.cpu}%
CREATED AT: ${server.created_at}`)     }
break
case "deluser": {
if (!isOwner) return m.reply(global.mess.owner)
let usr = args[0]
if (!usr) return m.reply('ID nya mana?')
let f = await fetch(domain + "/api/application/users/" + usr, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res = f.ok ? {
errors: null
} : await f.json()
if (res.errors) return m.reply('*USER NOT FOUND*')
m.reply('*SUCCESSFULLY DELETE THE USER*')
} 
break
case "ss": case "ssweb": {
    let args = text.split(' ');
    let url = args[0];
    let mode = 'desktop';
    if (args.includes('--mobile')) {
        mode = 'mobile';
    } else if (args.includes('--tab')) {
        mode = 'tab';
    }
    if (!text) return m.reply(`Contoh: .${command} https://google.com/ --mobile`);
    if (!/^https?:\/\//.test(url)) return m.reply(`Contoh: .${command} https://google.com/ --mobile`);
    let krt = await (await fetch('https://endpoint.web.id/tools/ssweb?key=' + global.keyshanz + '&url=' + url + '&mode=' + mode)).json();
    draxo.sendMessage(m.chat, { image: { url: krt.result.url }, caption: "*SUCCESS* ✅" }, { quoted: m });
}
break
case 'hd': case 'hdr': case 'remini': {
if (!quoted) return m.reply(`Fotonya Mana?`)
if (!/image/.test(mime)) return m.reply(`☘️ *Fotonya Mana?*`)
m.reply(mess.wait)
let media = await quoted.download()
let proses = await remini(media, "enhance");
draxo.sendMessage(m.chat, { image: proses, caption: '☘️ *Selesai*'}, { quoted: m })
}
break
case "txt2morse": {
if (!text) return m.reply(`Contoh: .${command} draxo`)
try {
let mors = await (await fetch('https://endpoint.web.id/tools/txt2morse?key=' + global.keyshanz + '&query=' + text)).json()
let morsecuy = mors.result
m.reply('morsecuy')
} catch (error) {
     m.reply('Rest Api sedang error')
     }
}
break
case "instagram": case "ig": {
  if (!text) return m.reply(`Contoh: .${command} https://vt.tiktok.com/ZS6AKtFKV/`);
  m.reply(mess.wait)
  let media = await (await fetch(`https://endpoint.web.id/downloader/Instagram?key=${global.keyshanz}&url=${text}`)).json();
 let data = media.result;
 let draxocap = data.title
draxo.sendMessage(m.chat, { video: { url: data.play }, caption: draxocap, fileName: `tiktok.mp4`, mimetype: 'video/mp4' }).then(() => {
draxo.sendMessage(m.chat, { audio: { url: data.music }, fileName: `tiktok.mp3`, mimetype: 'audio/mp4' })
})
}
break
        case "menu": {
        try {
        let { id, name } = await draxo.user
        let c = "_Hello i'm FrierenMD Simple WhatsApp bot created by Draxo._\n\n[ *INFO BOT* ]\n⛩️ Name : FrierenMD\n⛩️ Author : Draxo\n⛩️ Script : Base FrierenMD\n⛩️ Version : 1.0\n\n*┃ MENU OWNER*\n*┃ MENU PANEL*\n*┃ MENU TOOLS*\n\n_© Draxo - 2024_"
        let z = await draxo.profilePictureUrl(id, "image")
        draxo.sendMessage(m.chat, { text: c, contextInfo: {
        forwardingScore: 0,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363297087070564@newsletter",
          serverMessageId: 0,
          newsletterName: "Frieren CPANEL"
        },
        mentionedJid: [m.sender],
        externalAdReply: {
        showAdAttribution: true,
        title: name,
        body: "© Draxo - 2024",
        thumbnailUrl: global.thumb,
        sourceUrl: "https://whatsapp.com/channel/0029Vae24SL0VycNBWSvVX00",
        mediaType: 1,
        renderLargerThumbnail: true
        }}})
        } catch ({ message }) {
        return m.reply(message)
        }
        }
        break
case "menuowner": {
let c = `╭━━━⌲ *MENU OWNER*
┃ addprem
┃ delprem
┃ cadmin
┃ listadmin
┃ listuser
┃ listserver
┃ deluser
┗━━━━━━━━━━━━━━━━━◧`
draxoreply(c)
}
break
case "menupanel": {
let c = `╭━━━⌲ *PANEL MENU*
┃ 1GB
┃ 2GB
┃ 3GB
┃ 4GB
┃ 5GB
┃ 6GB
┃ 7GB
┃ 8GB
┃ 9GB
┃ 10GB
┃ UNLI
┗━━━━━━━━━━━━━━━━━◧`
draxoreply(c)
}
break
case "menutools": {
let c = `╭━━━⌲ *MENU TOOLS*
┃ tiktok
┃ facebook
┃ toptv
┃ videy
┃ sticker
┃ brat
┃ ai on/off
┃ txt2img
┃ ssweb
┃ txt2morse
┗━━━━━━━━━━━━━━━━━◧`
draxoreply(c)
}
break
        default:
        let xtx = m.text.slice(0)
        if (draxo.ai_sessions[m.sender] && xtx) {
        if (xtx.startsWith("gambarkan")) {
        sendTxt2img(xtx.slice(9))
        } else if (xtx.includes("buka grup")) {
        if (!isGroup) return m.reply("Hmm cuma bisa digrup")
        if (!isBotAdmins) return m.reply("Jadikan bot sebagai Admin grup")
        if (!isAdmins) return m.reply("Khusus Admin")
        draxo.groupSettingsUpdate(m.chat, "announcement")
        } else if (xtx.includes("tutup grup")) {
        if (!isGroup) return m.reply("Hmm cuma bisa digrup")
        if (!isBotAdmins) return m.reply("Jadikan bot sebagai Admin grup")
        if (!isAdmins) return m.reply("Khusus Admin")
        draxo.groupSettingsUpdate(m.chat, "not_announcement")
        } else if (xtx.startsWith("putarkan")) {
        sendPlay(xtx.slice(8))
        } else if (xtx.includes("matikan ai")) {
        delete draxo.ai_sessions[m.sender]
        m.reply("[ ✓ ] Success delete session chat")
        } else {
        const senderId = m.sender;
        const aiSessions = draxo.ai_sessions

        const msgs = [
        ...aiSessions[senderId].messages,
        { content: xtx, role: "user" }
        ];

        const api_url = 'https://api.manaxu.my.id/api/ai';
        const api_key = 'key-manaxu-free';

        axios({
        method: 'POST',
        url: api_url,
        headers: {
           'x-api-key': api_key,
           'Content-Type': 'application/json'
        },
        data: {
            logic: 'Nama kamu adalah FrierenMD, assistent AI cerdas buatan Draxo. 6288242704508 adalah nomor penciptamu, Ketika kamu berbicara dengannya maka kamu harus manja.',
            messages: msgs
        }
        })
        .then(response => {
        if (response.status === 200) {
        const { result } = response.data;
        m.reply(result ?? "Hmmm sepertinya terjadi kesalahan pada API, Minta bantuan ke owner ya.");
        aiSessions[senderId].messages.push({ content: xtx, role: "user" });
        aiSessions[senderId].messages.push({ content: result, role: "assistant" });
        draxo.ai_sessions = aiSessions;
        } else {
        m.reply("Hmmm sepertinya terjadi kesalahan pada API, Minta bantuan ke owner ya.");
        }
        })
        .catch(error => {
        console.error(error);
        m.reply("Hmmm sepertinya terjadi kesalahan, Minta bantuan ke owner ya.");
        });
        }
        }
    }
    } catch ({ message }) {
    console.log(chalk.redBright(message))
    }
}
let file = require.resolve(__filename);
watchFile(file, () => {
    unwatchFile(file);
    console.log(chalk.redBright(`File telah diubah: ${__filename}`));
    delete require.cache[file];
    require(file);
})
