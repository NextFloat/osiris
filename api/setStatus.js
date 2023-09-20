/**
 *
 * @param {string} SessionToken The user's session token.
 * @param {string} Status The status to set.
 * @param {string} StatusText The status text to set.
 * @param {string} UserId The user's id. *
 * @returns {Promise<object>} The server, username, and reason for the ban.
 */

const axios = require("axios");
const ulid = require("ulid");

function setStatus(SessionToken, Status, StatusText, UserId) {
  return new Promise((resolve, reject) => {
    axios({
      method: "PATCH",
      url: `https://api.revolt.chat/users/${UserId}`,
      data: {
        status: {
          text: StatusText,
          presence: Status,
        },
      },
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
          success: true,
        });
      })
      .catch((response) => {
        return reject(JSON.stringify(response.response.data));
      });
  });
}

module.exports = { setStatus };
