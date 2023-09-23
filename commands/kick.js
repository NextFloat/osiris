/**
 * - author: g0dswisdom
 * - description: A command that kicks the user
 */

const { SendMessage } = require("../api/sendMessage.js");
const { getArgs } = require("../api/extra/getArgs.js");
const { KickUser } = require("../api/kickUser.js");
const { ScanForMentionsAndExtract } = require("../api/extra/scanForMentionsAndExtract.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Server = data?.ServerId;
    const User = ScanForMentionsAndExtract(Content);

    if (!User) {
        return SendMessage(XSessionToken, Channel, "[REVOLT]: No user given!")
    }
    
    KickUser(XSessionToken, Server, User);
    
    SendMessage(XSessionToken, Channel, `Successfully kicked <@${User}>`).then((message) => {
        console.log("[REVOLT]: KICKED USER!");
    })
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