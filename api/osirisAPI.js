const osirisAPI = {};

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

// Extra functions
const { generateNonce } = require ('./extra/generateNonce.js');
const { getArgs } = require ('./extra/getArgs.js');
const { ScanForMentionsAndExtract } = require ('./extra/scanForMentionsAndExtract.js');



// Revolt API functions

osirisAPI.banUser = BanUser;

osirisAPI.bulkDeleteMessages = BulkDeleteMessages;

osirisAPI.createRole = CreateRole;

osirisAPI.deleteMessage = DeleteMessage;

osirisAPI.fetchChannel = FetchChannel;

osirisAPI.fetchOwnMessages = FetchOwnMessages;

osirisAPI.fetchUser = FetchUser;

osirisAPI.kickUser = KickUser;

osirisAPI.login = Login;

osirisAPI.sendMessage = SendMessage;

osirisAPI.setStatus = setStatus;

osirisAPI.unbanUser = UnBanUser;

// Extra functions

osirisAPI.generateNonce = generateNonce;

osirisAPI.getArgs = getArgs;

osirisAPI.scanForMentionsAndExtract = ScanForMentionsAndExtract;

module.exports = { osirisAPI };

