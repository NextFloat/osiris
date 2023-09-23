/**
 * - author: g0dswisdom
 * - description: A command that kicks the user
 */


const { osiris } = require ("../../api/osiris.js");


function execute(XSessionToken, data, sharedObj) {
    const Channel = data.ChannelId;
    const Content = data.Content;
    const Server = data?.ServerId;
    const Args = osiris.utils.getArgs(Content);
    const RoleName = Args[1];

    if (!RoleName) {
        return osiris.sendMessage(XSessionToken, Channel, "[REVOLT]: No name given!")
    }
    
    osiris.createRole(XSessionToken, Server, RoleName, Channel).catch((err) => { // we're including channel so the sendmessage func works.. not actually needed
        return console.log(err); // we need to catch too
    })
}

module.exports = {
    name: "createrole",
    description: "Creates a role with the given name",
    native: true,
    category: "admin",
    usage: "createrole",
    arguments: [
        {
            name: "name",
            type: "STRING"
        }
    ],  
    execute,
}