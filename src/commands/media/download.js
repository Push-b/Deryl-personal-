const axios = require('axios');

module.exports = {
    name: 'download',
    category: 'media',
    description: 'Downloads content from various social media platforms',
    react: "✅",
    async execute(client, arg, M) {
        if (!arg) {
            return M.reply('❌ Please provide a URL or search term');
        }

        const url = arg.trim();
        console.log('Received URL:', url); // Debug statement

        const handlers = [
            { regex: /instagram\.com\/(p|reel|tv)\//, handler: handleInstagramDownload },
            { regex: /^https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)(\?.*)?$/, handler: handleSpotifyDownload },
            { regex: /tiktok\.com\//, handler: handleTikTokDownload },
        ];

        const matchedHandler = handlers.find(({ regex }) => {
            const isMatch = regex.test(url);
            console.log(`Testing regex: ${regex} - Match: ${isMatch}`); // Debug statement
            return isMatch;
        });

        if (matchedHandler) {
            try {
                await matchedHandler.handler(client, url, M);
            } catch (error) {
                console.error('Error processing URL:', error);
                await M.reply('❌ Error processing URL.');
            }
        } else {
            await M.reply('❌ Unsupported URL. Please provide a valid Instagram, TikTok, or Spotify URL.');
        }
    }
};

async function handleInstagramDownload(client, url, M) {
    try {
        const { data } = await axios.get(`https://weeb-api.vercel.app/insta?url=${url}`);
        if (data.urls && data.urls.length > 0) {
            for (const { url: mediaUrl, type } of data.urls) {
                const buffer = await client.utils.getBuffer(mediaUrl);
                const mediaType = type === 'image' ? 'image' : 'video';
                await client.sendMessage(M.from, {
                    [mediaType]: buffer,
                    caption: 'Here is your result',
                }, { quoted: M });
            }
        } else {
            await M.reply('❌ No video/image data found for the provided URL.');
        }
    } catch (error) {
        await M.reply(`❌ Error while getting video/image data: ${error.message}`);
    }
}

async function handleTikTokDownload(client, url, M) {
    try {
        const tiktokData = await client.utils.Tiktok(url);
        const { title, nowm } = tiktokData;
        const caption = `🎵 Title: ${title}`;
        const media = await client.utils.getBuffer(nowm);
        await client.sendMessage(M.from, {
            video: media,
            gifPlayback: true,
            caption: caption,
        }, { quoted: M });
    } catch (error) {
        console.error('Error fetching TikTok data:', error);
        await M.reply('❌ Error fetching TikTok data');
    }
}

async function handleSpotifyDownload(client, url, M) {
    try {
        const trackId = url.match(/^https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)(\?.*)?$/)[1];
        const down = await downloadTrack2(trackId);
        await client.sendMessage(M.from, {
            caption: `📗 *Title: ${down.title}*\n📕 *Channel: ${down.artists}*\n📙 *Duration: ${down.duration}s*`,
            image: await client.utils.getBuffer(down.imageUrl),
            audio: down.audioBuffer,
            mimetype: 'audio/mp4',
            fileName: down.title
        }, { quoted: M });
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        await M.reply('❌ Error fetching Spotify data');
    }
}
