/**
 * This function unbans a user from a server.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} Server - The server to unban the user from.
 * @param {string} UserId - The person to unban.
 * @returns {Promise<object>} The server, username, and reason for the ban.
 */

const axios = require("axios");
const ulid = require("ulid");
function UnBanUser(SessionToken, Server, UserId) {
  return new Promise((resolve, reject) => {
    axios({
      method: "DELETE",
      url: `https://api.revolt.chat/servers/${Server}/bans/${UserId}`,
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
        if (response.data?.type == "NotFound") {
          return reject("Ban/User not found");
        } else {
          return resolve({
            Server: response.data._id.server,
            UserName: response.data._id.user,
            Reason: response.data._id.reason,
          });
        }
      })
      .catch((response) => {
        console.log(response);
        return reject(JSON.stringify(response.response.data));
      });
  });
}

module.exports = { UnBanUser };
