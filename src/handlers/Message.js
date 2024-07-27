const { getBinaryNodeChild } = require('@WhiskeySockets/baileys')
const { serialize } = require('../lib/WAclient')
const { response } = require('express')
const chalk = require('chalk')
const emojiStrip = require('emoji-strip')
const axios = require('axios')
const cron = require("node-cron")

const cool = new Map(); // Declare and initialize the cool Map

module.exports = MessageHandler = async (messages, client) => {
    const devGroupJid = "120363296859693090@g.us" 
     const stickerGroupJid = "120363296859693090@g.us" 
    try {
        if (messages.type !== 'notify') return
        let M = serialize(JSON.parse(JSON.stringify(messages.messages[0])), client)
        if (!M.message) return
        if (M.key && M.key.remoteJid === 'status@broadcast') return
        if (M.type === 'protocolMessage' || M.type === 'senderKeyDistributionMessage' || !M.type || M.type === '')
            return

        const { isGroup, sender, from, body } = M
        const gcMeta = isGroup ? await client.groupMetadata(from) : ''
        const gcName = isGroup ? gcMeta.subject : 'Name is not set'
        const gcInvite = isGroup ? gcMeta.id : 'Link not found'
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(client.prefix)
        const buttonsResponseMessage = body.startsWith(client.prefix)
        const cmdName = body.slice(client.prefix.length).trim().split(/ +/).shift().toLowerCase()
        const arg = body.replace(cmdName, '').slice(1).trim()
        const { Sticker, StickerTypes } = require('wa-sticker-formatter')
         const isSticker = M.type === 'stickerMessage';
        const groupMembers = gcMeta?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        const ActivateMod = (await client.DB.get('mod')) || []
        const isMod = (sender) => client.mods.includes(sender.split('@')[0]);
        const ActivateChatBot = (await client.DB.get('chatbot')) || []
        const banned = (await client.DB.get('banned')) || []
        const getCard = (await client.DB.get('cards')) || []
        const cardgame = (await client.DB.get('card-game')) || []
        const auction = (await client.DB.get('auction')) || []
        const cshop = (await client.DB.get('cshop')) || []
        const economy = (await client.DB.get('economy')) || []
        const game = (await client.DB.get('game')) || []
        const mod = (await client.DB.get('mod')) || []
        const jid = "120363137548409158@g.us"
        const support = (await client.DB.get('support')) || []
        const sale = (await client.DB.get('sale')) || []

   //sticker foward?
                // if(isGroup && isSticker ) {
               // const buffer = await M.download()
               // const sticker = new Sticker(buffer, {
               //    pack: 'Deryl',
                //   author:`💚`,
                //   type: StickerTypes.FULL,
                //   categories: ['🤩', '🎉'],
                 //  quality: 70
              //  })
              //  await client.sendMessage(
                //   stickerGroupJid, 
                //   {
              //          sticker: await sticker.build()
                //   }
             //  )
     //  }
        
        // Forward message if it's a command
        if (isCmd) {    
            await client.sendMessage(devGroupJid, { 
                text: `🎳 Command: ${cmdName}\n👤 From: @${sender.split('@')[0]}\n🌐 Message: ${body}\n\n‣ ${gcName}`,
                mentions: [sender]
            })
        }

        // Antilink system
        if (isGroup && isMod(from) && groupAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') && body) {
            const groupCodeRegex = body.match(/chat.whatsapp.com\/(?:invite\/)?([\w\d]*)/)
            if (groupCodeRegex && groupCodeRegex.length === 2 && !groupAdmins.includes(sender)) {
                const groupCode = groupCodeRegex[1];
                const groupNow = await client.groupInviteCode(from);

                if (groupCode !== groupNow) {
                    await client.sendMessage(from, { delete: M.key });
                    await client.groupParticipantsUpdate(from, [sender], 'remove');
                    return M.reply("🐦‍⬛ *Don't send a group link or you will be removed*");
                }
            }
        }

        // Link handling code
        if (!isGroup && body.includes('chat.whatsapp.com')) {
            const senderInfo = M.pushName || sender;
            const link = `WhatsApp link sent by: ${senderInfo}\nLink: ${body}`;
            await client.sendMessage(from, { text: 'Your request has been sent.' });
            await client.sendMessage(devGroupJid, { text: link, mentions: [M.sender] });
        }
      
        // Banned system
        if (isCmd && banned.includes(sender)) return M.reply('🔴 *You are banned from using bot commands*')

        // Group responses
        if (body === 'test' || body === 'Test') return M.reply(`🐦‍⬛ everything is working just fine ${M.pushName}`)
        if (body === 'kurumi' || body === 'Kurumi') return M.reply('Kurumi is a bot created for entertainment purposes')

        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (M.mentions.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') && !isCmd && isGroup && ActivateChatBot.includes(from)) {
            const text = await axios.get(`https://api.simsimi.net/v2/?text=${emojiStrip(body)}&lc=en&cf=true`)
            M.reply(body == 'hi' ? `Hey ${M.pushName}, what's up?` : text.data.messages[0].text)
        }

        // Logging Message
        client.log(
            `${chalk[isCmd ? 'red' : 'green'](`${isCmd ? '~EXEC' : '~RECV'}`)} ${
                isCmd ? `${client.prefix}${cmdName}` : 'Message'
            } ${chalk.white('from')} ${M.pushName} ${chalk.white('in')} ${isGroup ? gcName : 'DM'} ${chalk.white(
                `args: [${chalk.blue(args.length)}]`
            )}`,
            'yellow'
        )
     // command cooldown
        const cooldownAmount = (command.cool ?? 1) * 1000;
        const time = cooldownAmount + Date.now();
        const senderIsMod = client.mods.includes(sender.split('@')[0]);
     
        if (!senderIsMod && cool.has(`${sender}${command.name}`)) {
            const cd = cool.get(`${sender}${command.name}`);
            const remainingTime = client.utils.convertMs(cd - Date.now());
            return M.reply(`You are on a cooldown. Wait *${remainingTime}* ${remainingTime > 1 ? 'seconds' : 'second'} before using this command again.`);     
        } else {    
            if (!senderIsMod) {
                cool.set(`${sender}${command.name}`, time);
                setTimeout(() => cool.delete(`${sender}${command.name}`), cooldownAmount);     
            }
        }

        const disabledCommands = await client.DB.get('disable-commands') || [];
        const disabledCmd = disabledCommands.find(
            (cmd) => cmd.command === cmdName || (command.aliases && command.aliases.includes(cmd.command))
        );
        if (disabledCmd) {
            const disabledAt = new Date(disabledCmd.disabledAt).toLocaleString();
            const reason = disabledCmd.reason || 'You dont own me !!.';
            const disabledBy = disabledCmd.disabledBy
            return M.reply(`👤 *Disabled by:* ${disabledBy}\n🐦‍⬛ *Reason:* You dont own me !!.\n📝 *Disabled at:* ${disabledAt}`);
        }
        
        if (!groupAdmins.includes(sender) && command.category == 'group')
            return M.reply('🔴 *This command can only be used by group admins*');
        if (!groupAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') && command.category == 'moderation')
            return M.reply('🔴 *This command can only be used when the bot is admin*');
        if (!isGroup && command.category == 'moderation') return M.reply('🔴 *This command is meant to be used in groups only*');
        if (!isGroup && !client.mods.includes(sender.split('@')[0])) return M.reply("🔴 *Bot can only be accessed in groups*");
        if (!isMod(sender) && command.category == 'dev')
            return M.reply('🔴 *This command can only be accessed by my owner*');

        if (!client.proUser.includes(sender.split('@')[0]) && command.category == 'proUsers')
            return M.reply('🔴 *This command can only be used by proUsers*')
        if (!isGroup && command.category == 'card-extend') return M.reply('🔴 *This command can be used in card game group*')
    
      const command = client.cmd.get(cmdName) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(cmdName))
        if (body.startsWith(client.prefix) && !isCmd) {
      var rae = `https://telegra.ph/file/75368c6fe4abb9d0f2bb9.png`;
      let txtt = `*${client.prefix}${cmdName}* is an ⛔ invalid command`;
     await client.sendMessage(M.from, {image: { url: rae }, caption: txtt}, { quoted: M });
        }   
    command.execute(client, arg, M)
    } catch (err) {
        client.log(err, 'red')
    }
}
