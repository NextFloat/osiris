const osiris = {};

// Revolt API functions
const { BanUser } = require ('./server/banUser.js');
const { BulkDeleteMessages } = require ('./user/bulkDeleteMessages.js');
const { CreateRole } = require ('./server/createRole.js');
const { DeleteMessage } = require ('./user/deleteMessage.js');
const { FetchChannel } = require ('./user/fetchChannel.js');
const { FetchOwnMessages } = require ('./user/fetchOwnMessages.js');
const { FetchUser } = require ('./user/fetchUser.js');
const { KickUser } = require ('./server/kickUser.js');
const { Login } = require ('./login.js');
const { SendMessage } = require ('./user/sendMessage.js');
const { setStatus } = require ('./user/setStatus.js');
const { UnBanUser } = require ('./server/unbanUser.js');
const { CreateInvite } = require ('./server/createInvite.js');
const { CreateServer } = require ('./server/createServer.js');
const { DeleteRole } = require ('./server/deleteRole.js');
const { LeaveServer } = require ('./server/leaveServer.js');
const { SendMessageWithEmbed } = require('./user/sendMessageWithEmbed.js');

// Extra functions
const { generateNonce } = require ('./utils/generateNonce.js');
const { getArgs } = require ('./utils/getArgs.js');
const { ScanForMentionsAndExtract } = require ('./utils/scanForMentionsAndExtract.js');



// Revolt API functions

osiris.banUser = BanUser;

osiris.bulkDeleteMessages = BulkDeleteMessages;

osiris.createRole = CreateRole;

osiris.deleteMessage = DeleteMessage;

osiris.fetchChannel = FetchChannel;

osiris.fetchOwnMessages = FetchOwnMessages;

osiris.fetchUser = FetchUser;

osiris.kickUser = KickUser;

osiris.login = Login;

osiris.sendMessage = SendMessage;

osiris.setStatus = setStatus;

osiris.unbanUser = UnBanUser;

osiris.createInvite = CreateInvite;

osiris.createServer = CreateServer;

osiris.deleteRole = DeleteRole;

osiris.leaveServer = LeaveServer;

osiris.embed = SendMessageWithEmbed;

// utils

const utils = {};

utils.generateNonce = generateNonce;

utils.getArgs = getArgs;

utils.scanForMentionsAndExtract = ScanForMentionsAndExtract;

osiris.utils = utils;


module.exports = { osiris };

