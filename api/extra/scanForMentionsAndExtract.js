/**
 * Scans a string for mentions in the format <@USERID> and extracts the USERID.
 * @param {string} Content - The string to scan for mentions.
 * @returns {string} The USERID if a mention is found, otherwise null.
 */
function ScanForMentionsAndExtract(Content) {
  // Catch errors
  if (!Content) return null;
  // Scan for mentions

  try {
    var Scan = Content.match(/<@[\w\d]+>/);
    if (Scan) {
      return Scan[0].substring(2, Scan[0].length - 1);
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { ScanForMentionsAndExtract };
