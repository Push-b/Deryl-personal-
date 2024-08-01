const axios = require('axios')
const qs = require('qs')
const YT2 =  async (url,type = "audio") => {
  try {
    const form = {
      k_query: url,
      k_page: "home",
      hl: "en",
      q_auto: 0,
    };

     let response = await axios.post(
      "https://in-y2mate.com/mates/analyzeV2/ajax",
      qs.stringify(form),
    );
    let links = response.data.links;
    let linkToken = type === "audio" ? links.mp3.mp3128.k : links.mp4.auto.k;
    let vid = response.data.vid;

    const res = await axios.post(
      "https://in-y2mate.com/mates/convertV2/index",
      qs.stringify({
        vid,
        k: linkToken,
      }),
    );
    let {data } = await axios.get(res.data.dlink, {
      responseType: "arraybuffer",
    })
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = YT2;