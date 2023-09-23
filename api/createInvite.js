/**
 * This function creates an invite
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} RoleId - The role's id
 * @param {string} Channel - The channel to create an invite for
 */

const axios = require("axios");
const ulid = require("ulid");
const { SendMessage } = require("./sendMessage");

function CreateInvite(SessionToken, Channel) {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `https://api.revolt.chat/channels/${Channel}/invites`,
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
        console.log("[REVOLT]: CREATED INVITE")
        SendMessage(SessionToken, Channel, `Successfully created invite! https://rvlt.gg/${response.data._id}`).then((message) => {
            console.log("[REVOLT]: SENT!");
        })
      })
      .catch((response) => {
        console.log(response);
        return reject(JSON.stringify(response.data));
      });
  });
}

module.exports = { CreateInvite };
