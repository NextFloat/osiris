const osiris = {};

// Revolt API functions
const { BanUser } = require ('./banUser.js');
const { BulkDeleteMessages } = require ('./bulkDeleteMessages.js');
const { CreateRole } = require ('./createRole.js');
const { DeleteMessage } = require ('./deleteMessage.js');
const { FetchChannel } = require ('./fetchChannel.js');
const { FetchOwnMessages } = require ('./fetchOwnMessages.js');
const { FetchUser } = require ('./fetchUser.js');
const { KickUser } = require ('./kickUser.js');
const { Login } = require ('./login.js');
const { SendMessage } = require ('./sendMessage.js');
const { setStatus } = require ('./setStatus.js');
const { UnBanUser } = require ('./unbanUser.js');
const { CreateInvite } = require ('./createInvite.js');
const { CreateServer } = require ('./createServer.js');
const { DeleteRole } = require ('./deleteRole.js');
const { LeaveServer } = require ('./leaveServer.js');

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

// utils

const utils = {};

utils.generateNonce = generateNonce;

utils.getArgs = getArgs;

utils.scanForMentionsAndExtract = ScanForMentionsAndExtract;

osiris.utils = utils;


module.exports = { osiris };

