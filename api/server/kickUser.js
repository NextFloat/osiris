/**
 * This function kicks a user from a server.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} Server - The server to kick the user from.
 * @param {string} UserId - The person to kick.
 * @returns {Object} kick information.
 */

const axios = require("axios");
const ulid = require("ulid");
function KickUser(SessionToken, Server, UserId) { // ChannelId ?
  return new Promise((resolve, reject) => {
    axios({
      method: "DELETE",
      url: `https://api.revolt.chat/servers/${Server}/members/${UserId}`,
      data: { },
      headers: {
        Host: "api.revolt.chat",
        Connection: "keep-alive",
        //"Content-Length": { reason: Reason }.length,
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
      Referer: "https://app.revolt.chat/", // incase this doesn't work, ill use https://app.revolt.chat/server/${Server}/channel/${ChannelId}
    })
      .then((response) => {
        //{"_id":{"server":"01GWEEVSCFTV7NRYGA4TJ6FJYC","user":"01GW06GTERQR4QSGW5S3EW4SQ1"},"reason":"reaso"}
        //return resolve({
         // Server: response.data._id.server,
         // UserName: response.data._id.user,
        //});
      })
      .catch((response) => {
        //return reject(JSON.stringify(response.response.data));
      });
  });
}

module.exports = { KickUser };
