/**
 * - author: g0dswisdom
 * - description: A command that kicks the user
 */

const { osiris } = require ("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Server = data?.ServerId;
    const User = osiris.utils.scanForMentionsAndExtract(Content);

    if (!User) {
        return osiris.sendMessage(XSessionToken, Channel, "[REVOLT]: No user given!")
    }
    
    osiris.kickUser(XSessionToken, Server, User);
    
    osiris.embed(XSessionToken, Channel, "", {
        EmbedTitle: "osiris",
        EmbedDescription: `Successfully kicked <@${User}>`,
        EmbedColour: "#a81808"
    }).then((msg) => console.log("[REVOLT]: SENT")).catch((err) => console.log(err));

}

module.exports = {
    name: "kick",
    description: "Kicks the given user",
    native: true,
    category: "admin",
    usage: "kick",
    arguments: [
        {
            name: "user",
            type: "USER_MENTION"
        }
    ],  
    execute,
}