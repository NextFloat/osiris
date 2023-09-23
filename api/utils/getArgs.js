/**
 * Gets the given message's arguments
 * @param {string} content - The message's content
*/

const { prefix } = require("../../config.json");

function getArgs(content) {
    return content.slice(prefix.length).trim().split(/ +/);
}

module.exports = { getArgs };