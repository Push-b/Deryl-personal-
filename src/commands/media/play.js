const YT = require('../../lib/YT2');
const yts = require('yt-search');

module.exports = {
    name: 'ytaudio',
    aliases: ['yta', 'play'],
    category: 'media',
    react: "✅",
    usage: 'Use :ytaudio <song_link>',
    description: 'Downloads given YouTube Video and sends it as Audio',
    async execute(client, arg, M) {
        try {
            const link = async (term) => {
                const { videos } = await yts(term.trim());
                if (!videos || !videos.length) return null;
                return videos[0];
            };

            if (!arg) return M.reply('Please use this command with a valid YouTube link');
            const linkData = await link(arg);
            const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
            const term = validPathDomains.test(arg) ? arg.trim() : linkData?.url;
            if (!term) return M.reply('Please use this command with a valid YouTube content link');

            if (!validPathDomains.test(term.trim())) return M.reply('Please use this command with a valid YouTube link');

            M.reply(`Downloading: ${linkData?.title}`);

            // Checking if the video is longer than 30 minutes
            if (Number(linkData.seconds) > 1800) return M.reply('Cannot download audio longer than 30 minutes');

            // Downloading and sending the audio
            const audioBuffer = await YT(term, 'audio');
            await client.sendMessage(
                M.from,
                {
                    document: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${videoDetails.title}.mp3`
                },
                {
                    quoted: M
                }
            );
        } catch (error) {
            console.error(error);
            M.reply('An error occurred while downloading the YouTube video audio.');
        }
    }
};
