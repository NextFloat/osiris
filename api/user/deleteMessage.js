/**
 * This function deletes a message sent from someone.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} Channel - The channel the message has been sent into.
 * @param {string} MessageId - The message identifier.
 * @returns {Promise<object>} The status of the message.
 */

const axios = require("axios");
const ulid = require("ulid");
function DeleteMessage(SessionToken, Channel, MessageId) {
  return new Promise((resolve, reject) => {
    // Check if message is set
    if (!MessageId) {
      return reject("MessageId is not set");
    }
    // Check if channel is set
    if (!Channel) {
      return reject("Channel is not set");
    }

    axios({
      method: "DELETE",
      url: `https://api.revolt.chat/channels/${Channel}/messages/${MessageId} `,
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
        return resolve({
          Status: "Deleted",
        });
      })
      .catch((response) => {
        // If message is not found
        if (response.response.data?.type == "NotFound") {
          return reject("Message not found");
        }

        // Check if status code is 429
        if (response.response.status == 429) {
          console.log(response);
          return reject("Rate limited");
        }

        console.log(response);
        return reject(JSON.stringify(response.response.data));
      });
  });
}

module.exports = { DeleteMessage };
