const moment = require("moment-timezone")

 module.exports = {
    name: 'help',
    aliases: ['h', 'menu', 'list'],
    category: 'general',
    react: "🏹",
    cool: 20,
    description: 'Displays the command list or specific command info',
    async execute(client, arg, M) {

    const thumbnailUrls = [
    'https://telegra.ph/file/696d57ab7da60785da604.jpg',
    'https://telegra.ph/file/b1a1fda49ed556f2d89ef.jpg',
    'https://telegra.ph/file/8134328382431189937e0.jpg',
    'https://telegra.ph/file/6a1d8bb62428b85b20879.jpg',
    'https://telegra.ph/file/584c6fcafb36f00dafccd.jpg',
    'https://telegra.ph/file/09eeb2d88ae7b01ee2d22.jpg', 
    'https://telegra.ph/file/bb4eb58c1a55ec72b70f4.jpg',
    'https://telegra.ph/file/e09d411bd2aa8bdfb90fa.jpg', 
    'https://telegra.ph/file/e7ed2722c592d16d6432e.jpg',
    'https://telegra.ph/file/597c2f786af9a94c482cd.jpg'
    
];

function getRandomThumbnailUrl() {
    const randomIndex = Math.floor(Math.random() * thumbnailUrls.length);
    return thumbnailUrls[randomIndex];
}            
   
const now = new Date();
const hour = now.getHours();
let greeting;
if (hour >= 0 && hour < 12) {
    greeting = "🌄 Good Morning"; //good morning
} else if (hour >= 12 && hour < 18) {
    greeting = "⛱️ Good Afternoon"; //good afternoon
} else {
    greeting = "🌃 Good Evening"; //good evening
}     
        
  try {
            
   if (!arg) {
    
      let pushName = M.pushName.trim();
  
      if (pushName.split(' ').length === 1) {
        pushName = `${pushName} ,`;
      }
       
      M.reply (`*${greeting}* ${pushName}.`) 
       
        const categories = client.cmd.reduce((obj, cmd) => {
        const category = cmd.category || 'Uncategorized'
       // if (category === 'general') return obj;
     //   if (category === 'dev') return obj;
     //   if (category === 'rpg') return obj;
     //   if (category === 'media') return obj;
     //   if (category === 'group') return obj;
     //   if (category === 'utils') return obj;
     //   if (category === 'fun') return obj;
    //    if (category === 'economy') return obj;
   //     if (category === 'card game') return obj;
   //     if (category === 'pokemon') return obj;
        obj[category] = obj[category] || []
        obj[category].push(cmd.name)
        return obj
      }, {})
      
      const emojis = ['👨‍💻', '🎮', '🃏' , '📈' ,  '🌊' , '⛩️' , '🎉' ,  '♨️' , '🎵' , '🉐' , '🔧', '⛩️']  
      
      const commandList = Object.keys(categories)
      
      let commands = ''
      
      for (const category of commandList) {
        commands += `*${client.utils.capitalize(
          category,
          true
          )} ${emojis[commandList.indexOf(category)]}  :-*  \n\`\`\`${categories[category].map((cmd) => 
            `${cmd}`).join(' , ')}\`\`\`\n\n`
        
        }

        // commands += `\n${emojis[commandList.indexOf(category)]} *${client.utils.capitalize(
        //   category,
        //   true
        //   )}*\n\n${categories[category].map((cmd) => `${client.prefix}${cmd}`).join(', ')}\`\`\`\n\n`
       
        
        
         const thumbnailUrl = getRandomThumbnailUrl();
         const time = moment(moment())
                    .format('HH:mm:ss')
                moment.tz.setDefault('Asia/KOLKATA')
                    .locale('id')
                const date = moment.tz('Asia/Kolkata').format('DD/MM/YYYY')

 let message = `*╭──────────────╮*
*│ ⋊ ɴᴀᴍᴇ: Kurumi Tokisaki*
*│ ⋊ ᴜsᴇʀ:* @${pushName}
*│ ⋊ ᴘʀᴇғɪx: << ${client.prefix} >>*
*│ ⋊ Time: ${time}*
*│ ⋊ Date: ${date}*
*│ ⋊ ᴏᴡɴᴇʀ: ${client.owner}* 
*╰──────────────╯*\n\n${commands}`;
   
      const buffer = await client.utils.getBuffer('https://i.imgur.com/ZgrSw7W.jpg')
      await client.sendMessage(
          M.from,
          {
            image: { url: thumbnailUrl },
            caption: message
          },
          {
            quoted: M
          }
        );
        return;
      }
         const command = client.cmd.get(arg) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(arg));

            if (!command) return M.reply('Command not found');

            const message = `👾 *Command:* ${command.name}\n📡 *Aliases:* ${command.aliases.join(', ')}\n🗂️ *Category:* ${command.category || 'None'}\n⏰ *Cooldown:* ${command.cooldown || 'None'}\n💡 *Usage:* ${client.prefix}${command.name}\n📝 *Description:* ${command.description}`;

            M.reply(message);
         }catch(err){
    await client.sendMessage(M.from , {image: {url: `${client.utils.errorChan()}`} , caption: `${client.utils.greetings()} Error-Chan Dis\n\nError:\n${err}`})
  }
          
    }
}
