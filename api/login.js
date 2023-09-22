/**
 * This function attempts to get session info as well as user info with only logging in (REVOLT FUNCTIONALITY).
 * @param {string} Email - The users email.
 * @param {string} Password - The users password.
 * @returns {Object} The session info and user info.
 */

const axios = require("axios");
const ulid = require("ulid");
function Login(Email, Password) {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `https://api.revolt.chat/auth/session/login`,
      data: {
        email: Email,
        password: Password,
        friendly_name:
          "Revolt.js Selfbot for Revolt.chat (https://github.com/DisECtRy/osiris)",
      },
      headers: {
        Host: "api.revolt.chat",
        Connection: "keep-alive",
        "Content-Length": {
          email: Email,
          password: Password,
          friendly_name:
            "Revolt.js Selfbot for Revolt.chat (https://github.com/DisECtRy/osiris)",
        }.length,
        "sec-ch-ua":
          '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "sec-ch-ua-mobile": "?0",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        "sec-ch-ua-platform": "Windows",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
      },
      Origin: "https://app.revolt.chat",
      Referer: "https://app.revolt.chat/",
    })
      .then((response) => {
        if (response.data.result === "Success") {
          resolve({
            User_Id: response.data["user_id"],
            _Id: response.data["_id"],
            token: response.data["token"],
          });
        } else if (response.data.result == "MFA") {
          return reject(
            `[REVOLT]: (!) Two-Factor authentication is enabled. Here is relevant information:\n Ticket: ${response.data.ticket}\nTIP: Try to verify this device.`,
          );
        } else {
          console.log(response);
          const zlib = require("zlib");
          const { Readable } = require("stream");
          const inputStream = new Readable();
          inputStream.push(response.data);
          inputStream.push(null);
          const gzipStream = inputStream.pipe(zlib.createGunzip());
          const reader = require("readline").createInterface({
            input: gzipStream,
            crlfDelay: Infinity,
          });
          let lines = "";
          reader.on("line", (line) => {
            lines += line;
          });
          reader.on("close", () => {
            console.log(lines);
          });
        }
      })
      .catch((response) => {
        return reject(response);
      });
  });
}

module.exports = { Login };
