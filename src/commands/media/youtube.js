const YT = require('../../lib/YT2');
const yts = require("youtube-yts");

module.exports = {
    name: 'youtube',
    aliases: ['youtube'],
    category: 'media',
    description: 'Downloads given YT Video',
    async execute(client, arg, M) {

  
        const link = async (term) => {
            const { videos } = await yts(term.trim())
            if (!videos || !videos.length) return null
            return videos[0].url
        }
        if (!arg) return M.reply('Please use this command with a valid youtube.com link')
         const linkData = await link(arg);
        const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/
        const term = validPathDomains.test(arg) ? arg.trim() : await link(arg)
        if (!term) return M.reply('Please use this command with a valid youtube content link')
      
        M.reply(`Downloading: ${linkData?.title}`)
        if (Number(videoDetails.lengthSeconds) > 1800) return M.reply('Cannot download video longer than 30 minutes')
         const audioBuffer = await YT(term, 'video');
                await client.sendMessage(
                    M.from,
                    {
                        video: res,
                        mimetype: 'video/mp4',
                        fileName: `${linkData.title}.mp4`
                    },
                    {
                        quoted: M
                    }
                )
            })
            .catch((err) => {
                return M.reply(err.toString())
            })
    }
}
//M.quoted.mtype === 'imageMessage',