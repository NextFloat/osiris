/**
 * This function fetches a users information by their unique id.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} UserId - The person to retrieve the information from.
 * @returns {Object} User information.
 */

const { generateNonce } = require("../utils/generateNonce.js");
const axios = require("axios");
const ulid = require("ulid");
function FetchUser(SessionToken, UserId) {
  return new Promise((resolve, reject) => {
    let Nonce = generateNonce();
    axios({
      method: "GET",
      url: `https://api.revolt.chat/users/${UserId}`,
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
          UserId: response.data._id,
          UserName: response.data.username,
        });
      })
      .catch((response) => {
        console.log(response);
        return reject(JSON.stringify(response.response.data));
      });
  });
}

module.exports = { FetchUser };
