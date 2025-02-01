const axios = require('axios');

const API = `https://api.nexoracle.com`;
const KEY = `free_key@maher_apis`;

module.exports = {
    name: 'ytaudio',
    aliases: ['yta', 'play'],
    category: 'media',
    react: "✅",
    usage: 'Use :ytaudio <song_link>',
    description: 'Downloads given YouTube Video and sends it as Audio',
    async execute(client, arg, M) {
        try {
            if (!arg) return M.reply('Please use this command with a valid YouTube link');

            const validPathDomains = /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
            if (!validPathDomains.test(arg.trim())) return M.reply('Invalid YouTube link');

            M.reply(`Downloading audio...`);

            // Requesting audio download from NexOracle API
            const response = await axios.get(`${API}/youtube/audio`, {
                params: {
                    url: arg.trim(),
                    key: KEY
                },
                responseType: 'arraybuffer'
            });

            if (response.status !== 200) throw new Error('Failed to fetch audio');

            const audioBuffer = response.data;

            await client.sendMessage(
                M.from,
                {
                    document: audioBuffer,
                    mimetype: 'audio/mpeg',
                    fileName: `audio.mp3`
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
