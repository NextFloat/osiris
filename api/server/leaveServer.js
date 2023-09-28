/**
 * This function creates a server
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} ServerId - The server's id
 */

const axios = require("axios");
const ulid = require("ulid");

function LeaveServer(SessionToken, ServerId) {
  return new Promise((resolve, reject) => {
    axios({
      method: "DELETE",
      url: `https://api.revolt.chat/servers/${ServerId}`,
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
      Referer: "https://app.revolt.chat/",
    })
      .then((response) => {
        console.log("[REVOLT]: LEFT SERVER")
      })
      .catch((response) => {
        console.log(response);
        return reject(JSON.stringify(response.data));
      });
  });
}

module.exports = { LeaveServer };
