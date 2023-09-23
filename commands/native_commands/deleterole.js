/**
 * - author: g0dswisdom
 * - description: A command that deletes a role
 */

const { osiris } = require("../../api/osiris.js");

function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Server = data?.ServerId;
    const Args = osiris.utils.getArgs(Content);
    const RoleId = Args[1];

    if (!RoleId) {
        return osiris.sendMessage(XSessionToken, Channel, "[REVOLT]: No id given!")
    }
    
    osiris.deleteRole(XSessionToken, Server, RoleId, Channel).catch((err) => { // we're including channel so the sendmessage func works.. not actually needed
        return console.log(err); // we need to catch too
    })
}

module.exports = {
    name: "deleterole",
    description: "Deletes a role with the id of it",
    native: true,
    category: "admin",
    usage: "deleterole",
    arguments: [
        {
            name: "id",
            type: "STRING"
        }
    ],  
    execute,
}