/**
 * This function attempts to fetch a channels information.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} ChannelId - The id of the channel.
 * @returns {Object} The channel information.
 */

const axios = require("axios");
const ulid = require("ulid");
function FetchChannel(SessionToken, ChannelId) {
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `https://api.revolt.chat/channels/${ChannelId}`,
      headers: {
        Host: "api.revolt.chat",
        Connection: "keep-alive",
        Accept: "application/json, text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        "Idempotency-Key": ulid.ulid(),
        "X-Session-Token": SessionToken,
        "Content-Type": "application/json",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US",
      },
      Origin: "https://app.revolt.chat",
      Referer: "https://app.revolt.chat/",
    })
      .then((response) => {
        if (response.data?.server) {
          return resolve({
            ChannelType: response.data.channel_type,
            ChannelId: response.data._id,
            ChannelName: response.data.name,
            ServerId: response.data.server,
          });
        } else {
          return resolve({
            ChannelType: response.data.channel_type,
            ChannelId: response.data._id,
          });
        }
      })
      .catch((response) => {
        try {
          return reject(JSON.stringify(response.response.data));
        } catch (error) {
          return reject(error);
        }
      });
  });
}

module.exports = { FetchChannel };
