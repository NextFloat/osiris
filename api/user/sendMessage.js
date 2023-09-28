/**
 * This function attempts to send a message to a recipient.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} ChannelId - The Channel id.
 * @param {string} Message - The message to send.
 * @returns {Object} The session info and user info.
 */

const { generateNonce } = require("../utils/generateNonce.js");
const axios = require("axios");
const ulid = require("ulid");
function SendMessage(SessionToken, ChannelId, Message) {
  return new Promise((resolve, reject) => {
    let Nonce = generateNonce();
    axios({
      method: "POST",
      url: `https://api.revolt.chat/channels/${ChannelId}/messages`,
      data: { content: Message, replies: [] },
      headers: {
        Host: "api.revolt.chat",
        Connection: "keep-alive",
        "Content-Length": { content: Message, replies: [] }.length,
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
        return resolve({
          Nonce: response.data.nonce,
          ChannelId: response.data.channel,
          Author: response.data.author,
          Content: response.data.content,
          MessageId: response.data._id,
        });
      })
      .catch((response) => {
        return reject(JSON.stringify(response.response.data));
      });
  });
}

module.exports = { SendMessage };
