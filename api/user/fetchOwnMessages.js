/**
 * This function fetches your own messages from a channel.
 * @param {String} SessionToken - The session token retrieved from the Login() function.
 * @param {String} Channel - The channel to fetch the messages from.
 * @param {String} Limit - The limit of messages to fetch.
 * @param {String} After - The message to fetch after n date.
 * @returns {Promise<object>} The messages.
 */

function FetchOwnMessages(SessionToken, Channel, Limit, After = null) {
  return new Promise((resolve, reject) => {
    const params = {
      limit: Limit,
    };
    if (After) {
      console.log(After);
      params.after = After;
    }
    axios({
      method: "GET",
      url: `https://api.revolt.chat/channels/${Channel}/messages`,
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
      data: {
        params,
      },
    })
      .then((response) => {
        return resolve({
          Messages: response.data,
        });
      })
      .catch((response) => {
        console.log(response);
        return reject(JSON.stringify(response.response.data));
      });
  });
}

module.exports = { FetchOwnMessages };
