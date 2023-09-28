/**
 * This function bans a user from a server with a reason.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} Server - The server to ban the user from.
 * @param {string} UserId - The person to ban.
 * @param {string} Reason - The reason for the ban.
 * @returns {Object} ban information.
 */

const axios = require("axios");
const ulid = require("ulid");
function BanUser(SessionToken, Server, UserId, Reason) {
  return new Promise((resolve, reject) => {
    axios({
      method: "PUT",
      url: `https://api.revolt.chat/servers/${Server}/bans/${UserId}`,
      data: { reason: Reason },
      headers: {
        Host: "api.revolt.chat",
        Connection: "keep-alive",
        "Content-Length": { reason: Reason }.length,
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
        //{"_id":{"server":"01GWEEVSCFTV7NRYGA4TJ6FJYC","user":"01GW06GTERQR4QSGW5S3EW4SQ1"},"reason":"reaso"}
        return resolve({
          Server: response.data._id.server,
          UserName: response.data._id.user,
          Reason: response.data._id.reason,
        });
      })
      .catch((response) => {
        console.log(response);
        return reject(JSON.stringify(response.response.data));
      });
  });
}

module.exports = { BanUser };
