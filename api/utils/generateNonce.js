/**
 * @deprecated This function is deprecated and should not be used anymore.
 * This should not be used at all.
 * This function generates a nonce (REVOLT FUNCTIONALITY).
 * @returns {string} The nonce.
 */

function generateNonce() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomChars = [];
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomChars.push(characters[randomIndex]);
  }
  return "01GW9H" + randomChars.join("");
}

module.exports = { generateNonce };
