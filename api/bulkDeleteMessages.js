/**
 *
 * @param {String} SessionToken - The session token retrieved from the Login() function.
 * @param {String} Channel - The channel to delete the messages from.
 * @param {Array} MessageIds - Array of message ids to delete.
 * @returns {Promise<object>} The status of the messages.
 */

function BulkDeleteMessages(SessionToken, Channel, MessageIds) {
  return new Promise((resolve, reject) => {
    axios({
      method: "DELETE",
      url: `https://api.revolt.chat/channels/${Channel}/messages/bulk`,
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
        ids: MessageIds,
      },
    })
      .then((response) => {
        return resolve({
          Status: "Deleted",
        });
      })
      .catch((response) => {
        console.log(response);
        return reject(JSON.stringify(response.response.data));
      });
  });
}

module.exports = { BulkDeleteMessages };
