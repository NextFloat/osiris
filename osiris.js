const WebSocket = require('ws');
const axios = require("axios")
const ulid = require('ulid');
const crypto = require('crypto');
const commands = {};
const { email, password, prefix } = require("./config.json")
/**
 * Command handler function.
 * @param {string} Command - The command to handle.
 * @param {Function} Callback - The callback function to execute when the command is called.
 * @param {Object} Shared - The shared object to pass between callbacks.
 */
function addCommand(command, callback) {
    commands[command] = callback;
}

/**
 * Generates a random AES-256-GCM encryption key.
 *
 * @returns {string} The randomly generated encryption key.
 */
function generateEncryptionKey() {
    return crypto.randomBytes(32)
}


/**
 * Encrypts a plaintext message using the AES-256-GCM cipher.
 * @param {string} PlainText - The plaintext message to encrypt.
 * @param {Buffer} Key - The secret key to use for encryption.
 * @returns {string} The encrypted ciphertext, formatted as a string in the format "{iv}:{ciphertext}:{tag}".
 */
function encrypt(plaintext, key) {
    const iv = crypto.randomBytes(12); // Generate a random initialization vector
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv); // Create a cipher using the secret key and initialization vector
    let encrypted = cipher.update(plaintext, 'utf8', 'hex'); // Encrypt the plaintext
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag(); // Get the authentication tag
    return `${iv.toString('hex')}:${encrypted}:${tag.toString('hex')}`; // Return the initialization vector, encrypted plaintext, and authentication tag concatenated with a separator
}

/**
 * Decrypts a ciphertext message encrypted using the AES-256-GCM cipher.
 * @param {string} CipherText - The ciphertext message to decrypt, formatted as a string in the format "{iv}:{ciphertext}:{tag}".
 * @param {Buffer} Key - The secret key used to encrypt the plaintext message.
 * @returns {string} The decrypted plaintext message.
 * @throws {Error} Throws an error if the ciphertext is improperly formatted or cannot be decrypted.
 */
function decrypt(ciphertext, key) {
    const parts = ciphertext.split(':'); // Split the ciphertext into its constituent parts
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = Buffer.from(parts[1], 'hex');
    const tag = Buffer.from(parts[2], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv); // Create a decipher using the secret key and initialization vector
    decipher.setAuthTag(tag); // Set the authentication tag
    let plaintext = decipher.update(encrypted, 'hex', 'utf8'); // Decrypt the ciphertext
    plaintext += decipher.final('utf8');
    return plaintext;
}




/**
 * Handle a command from a user.
 * @param {string} command - The command string.
 * @param {string[]} args - The arguments for the command.
 * @param {Object.<string, Function>} commands - The existing commands object to check if a command already exists.
 * @param {Function} callback - The callback function to execute if the command is found.
 * @throws Will throw an error if the command already exists.
 */
function handleCommand(command, data, sharedObj) {
    command = command.slice(prefix.length)
    command = command.split(" ")[0].toLowerCase()
    if (commands[command]) {
        commands[command](data, sharedObj);
    } else {
      console.log(`Unknown command: ${command}`);
    }
}


/**
 * This function attempts to get session info aswell as user info with only logging in (REVOLT FUNCTIONALITY).
 * @param {string} Email - The users email.
 * @param {string} Password - The users password.
 * @returns {Object} The session info and user info.
 */
function Login(Email, Password) {
    return new Promise((resolve, reject) => {
        axios({
            method: "POST",
            url: `https://api.revolt.chat/auth/session/login`,
            data: { "email": Email, "password": Password, "friendly_name": "chrome on Windows 10" },
            headers: {
                Host: 'api.revolt.chat',
                Connection: 'keep-alive',
                'Content-Length': { "email": Email, "password": Password, "friendly_name": "chrome on Windows 10" }.length,
                'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                'sec-ch-ua-platform': "Windows",
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            Origin: "https://app.revolt.chat",
            Referer: "https://app.revolt.chat/"
        }).then(response => {
            if (response.data.result === ("Success")) {
                resolve({
                    User_Id: response.data["user_id"],
                    _Id: response.data["_id"],
                    token: response.data["token"]
                })
            } else if (response.data.result == ("MFA")) {
                return reject(`[REVOLT]: (!) Two-Factor authentication is enabled. Here is relevant information:\n Ticket: ${response.data.ticket}\nTIP: Try to verify this device.`)
            } else {
                console.log(response)
                const zlib = require('zlib');
                const { Readable } = require('stream');
                const inputStream = new Readable();
                inputStream.push(response.data);
                inputStream.push(null);
                const gzipStream = inputStream.pipe(zlib.createGunzip());
                const reader = require('readline').createInterface({
                    input: gzipStream,
                    crlfDelay: Infinity
                });
                let lines = '';
                reader.on('line', (line) => {
                    lines += line;
                });
                reader.on('close', () => {
                    console.log(lines)
                })
            }
        }).catch(response => {
            return reject(response)
        })
    })
}

/**
 * This function generates a X-SESSION-TOKEN header (REVOLT FUNCTIONALITY).
 * @returns {string} The X-SESSION-TOKEN.
 */
function generateToken() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
    const charactersLength = characters.length;
    for (let i = 0; i < 64; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * @deprecated This function is deprecated and should not be used anymore.
 * This should not be used at all. Replaced by `ulid` dependency.
 * This function generates a Idempotency Key token (REVOLT FUNCTIONALITY).
 * @returns {string} The Idempotency Key token.
 */
function generateIdempotencyKey() {
    const prefix = "01GW9G";
    const length = 20;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = prefix;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * @deprecated This function is deprecated and should not be used anymore.
 * This should not be used at all.
 * This function generates a nonce (REVOLT FUNCTIONALITY).
 * @returns {string} The nonce.
 */
function generateNonce() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomChars = [];
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomChars.push(characters[randomIndex]);
    }
    return "01GW9H" + randomChars.join('');
  }

/**
 * This function attempts to send a message to a recipient.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} ChannelId - The Channel id.
 * @param {string} Message - The message to send.
 * @returns {Object} The session info and user info.
 */
function SendMessage(SessionToken, ChannelId, Message){
     return new Promise((resolve, reject) => {
        let Nonce = generateNonce()
        axios({
            method: "POST",
            url: `https://api.revolt.chat/channels/${ChannelId}/messages`,
            data: { "content":Message, "replies":[] },
            headers: {
                Host: 'api.revolt.chat',
                Connection: 'keep-alive',
                'Content-Length': { "content": Message, "replies":[] }.length,
                Accept: 'application/json, text/plain, */*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                'Idempotency-Key': ulid.ulid(),
                'X-Session-Token': SessionToken,
                'Content-Type': 'application/json',
                'Sec-Fetch-Site': 'same-site',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US'  
            },
            Origin: "https://app.revolt.chat",
            Referer: "https://app.revolt.chat/"
        }).then(response => {
            return resolve({
                Nonce: response.data.nonce,
                ChannelId: response.data.channel,
                Author: response.data.author,
                Content: response.data.content,
                MessageId: response.data._id
            })
        }).catch(response => {
            return reject(JSON.stringify(response.response.data))
        })
    })
}

/**
 * This function attempts to fetch a channels information.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} ChannelId - The id of the channel.
 * @returns {Object} The channel information.
 */
function FetchChannel(SessionToken, ChannelId){
    return new Promise((resolve, reject) => {
       axios({
           method: "GET",
           url: `https://api.revolt.chat/channels/${ChannelId}`,
           headers: {
               Host: 'api.revolt.chat',
               Connection: 'keep-alive',
               Accept: 'application/json, text/plain, */*',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
               'Idempotency-Key': ulid.ulid(),
               'X-Session-Token': SessionToken,
               'Content-Type': 'application/json',
               'Sec-Fetch-Site': 'same-site',
               'Sec-Fetch-Mode': 'cors',
               'Sec-Fetch-Dest': 'empty',
               'Accept-Encoding': 'gzip, deflate, br',
               'Accept-Language': 'en-US'  
           },
           Origin: "https://app.revolt.chat",
           Referer: "https://app.revolt.chat/"
       }).then(response => {
        if (response.data?.server){
            return resolve({
                ChannelType : response.data.channel_type,
                ChannelId: response.data._id,
                ServerId: response.data.server
            })
        } else {
            return resolve({
                ChannelType : response.data.channel_type,
                ChannelId: response.data._id
             })
        }
         
       }).catch(response => {
           return reject(JSON.stringify(response.response.data))
       })
   })
}




/**
 * Scans a string for mentions in the format <@USERID> and extracts the USERID.
 * @param {string} Content - The string to scan for mentions.
 * @returns {string} The USERID if a mention is found, otherwise null.
*/
function ScanForMentionsAndExtract(Content){
    var Scan = Content.match(/<@[\w\d]+>/)
    if (Scan) {
        return Scan[0].substring(2, Scan[0].length - 1)
    }
}

/**
 * This function fetches a users information by their unique id.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} UserId - The person to retrieve the information from.
 * @returns {Object} User information.
 */
function FetchUser(SessionToken, UserId){
    return new Promise((resolve, reject) => {
       let Nonce = generateNonce()
       axios({
           method: "GET",
           url: `https://api.revolt.chat/users/${UserId}`,
           headers: {
               Host: 'api.revolt.chat',
               Connection: 'keep-alive',
               Accept: 'application/json, text/plain, */*',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
               'Idempotency-Key': ulid.ulid(),
               'X-Session-Token': SessionToken,
               'Content-Type': 'application/json',
               'Sec-Fetch-Site': 'same-site',
               'Sec-Fetch-Mode': 'cors',
               'Sec-Fetch-Dest': 'empty',
               'Accept-Encoding': 'gzip, deflate, br',
               'Accept-Language': 'en-US'  
           },
           Origin: "https://app.revolt.chat",
           Referer: "https://app.revolt.chat/"
       }).then(response => {
        return resolve({
            UserId: response.data._id,
            UserName: response.data.username,
        })
       }).catch(response => {
        console.log(response)
           return reject(JSON.stringify(response.response.data))
       })
   })
}

/**
 * This function bans a user from a server with a reason.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} Server - The server to ban the user from.
 * @param {string} UserId - The person to ban.
 * @param {string} Reason - The reason for the ban.
 * @returns {Object} ban information.
 */
function BanUser(SessionToken, Server, UserId, Reason){
    return new Promise((resolve, reject) => {
       axios({
           method: "PUT",
           url: `https://api.revolt.chat/servers/${Server}/bans/${UserId}`,
           data : {"reason": Reason},
           headers: {
               Host: 'api.revolt.chat',
               Connection: 'keep-alive',
               'Content-Length': {"reason": Reason}.length,
               Accept: 'application/json, text/plain, */*',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
               'Idempotency-Key': ulid.ulid(),
               'X-Session-Token': SessionToken,
               'Content-Type': 'application/json',
               'Sec-Fetch-Site': 'same-site',
               'Sec-Fetch-Mode': 'cors',
               'Sec-Fetch-Dest': 'empty',
               'Accept-Encoding': 'gzip, deflate, br',
               'Accept-Language': 'en-US'  
           },
           Origin: "https://app.revolt.chat",
           Referer: "https://app.revolt.chat/"
       }).then(response => {
        //{"_id":{"server":"01GWEEVSCFTV7NRYGA4TJ6FJYC","user":"01GW06GTERQR4QSGW5S3EW4SQ1"},"reason":"reaso"}
        return resolve({
            Server: response.data._id.server,
            UserName: response.data._id.user,
            Reason: response.data._id.reason
        })
       }).catch(response => {
        console.log(response)
           return reject(JSON.stringify(response.response.data))
       })
   })
}


/**
 * This function unbans a user from a server.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} Server - The server to unban the user from.
 * @param {string} UserId - The person to unban.
 */
function UnBanUser(SessionToken, Server, UserId){
    return new Promise((resolve, reject) => {
       axios({
           method: "DELETE",
           url: `https://api.revolt.chat/servers/${Server}/bans/${UserId}`,
           headers: {
               Host: 'api.revolt.chat',
               Connection: 'keep-alive',
               Accept: 'application/json, text/plain, */*',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
               'Idempotency-Key': ulid.ulid(),
               'X-Session-Token': SessionToken,
               'Content-Type': 'application/json',
               'Sec-Fetch-Site': 'same-site',
               'Sec-Fetch-Mode': 'cors',
               'Sec-Fetch-Dest': 'empty',
               'Accept-Encoding': 'gzip, deflate, br',
               'Accept-Language': 'en-US'  
           },
           Origin: "https://app.revolt.chat",
           Referer: "https://app.revolt.chat/"
       }).then(response => {
        if (response.data?.type == "NotFound"){
            return reject("Ban/User not found")
        } else {
            return resolve({
                Server: response.data._id.server,
                UserName: response.data._id.user,
                Reason: response.data._id.reason
            })
        }
       }).catch(response => {
        console.log(response)
           return reject(JSON.stringify(response.response.data))
       })
   })
}


/**
 * This function deletes a message sent from someone.
 * @param {string} SessionToken - The session token retrieved from the Login() function.
 * @param {string} Channel - The channel the message has been sent into.
 * @param {string} MessageId - The message identifier.
 */
function DeleteMessage(SessionToken, Channel, MessageId){
    return new Promise((resolve, reject) => {
       axios({
           method: "DELETE",
           url: `https://api.revolt.chat/channels/${Channel}/messages/${MessageId} `,
           headers: {
               Host: 'api.revolt.chat',
               Connection: 'keep-alive',
               Accept: 'application/json, text/plain, */*',
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
               'Idempotency-Key': ulid.ulid(),
               'X-Session-Token': SessionToken,
               'Content-Type': 'application/json',
               'Sec-Fetch-Site': 'same-site',
               'Sec-Fetch-Mode': 'cors',
               'Sec-Fetch-Dest': 'empty',
               'Accept-Encoding': 'gzip, deflate, br',
               'Accept-Language': 'en-US'  
           },
           Origin: "https://app.revolt.chat",
           Referer: "https://app.revolt.chat/"
       }).then(response => {
            return resolve({
                Status: "Deleted"
            })
       }).catch(response => {
        console.log(response)
           return reject(JSON.stringify(response.response.data))
       })
   })
}


function getArgs(content) {
    return content.slice(prefix.length).trim().split(/ +/)
}

function autoUser(id) {
    return `<@${id}>`
}

function markdown(content) {
    return "```ini\n[osiris]\n" + content + "\n[osiris]"
}

// F I R S T

Login(email, password).then(data => {
    console.log("[REVOLT]: Fetched login info, punchin' it in!")
    let Id = data._Id
    let UserId = data.User_Id
    let Token = data.token
    var Client
    var XSessionToken
    var Users = {}
    ws = new WebSocket('wss://ws.revolt.chat/', {
        headers: {
            Host: 'ws.revolt.chat',
            Connection: 'Upgrade',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) revolt-desktop/1.0.6 Chrome/98.0.4758.141 Electron/17.4.3 Safari/537.36',
            Upgrade: 'websocket',
            Origin: 'https',
            'Sec-WebSocket-Version': '13',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US',
            'Sec-WebSocket-Key': 'DxRhe6fokGKthFBqPNrWVw==' //ah yes.
        }
    });
    
    ws.on('open', function open() {
        console.log("[REVOLT]: Connected. Sending over authentication.")
        ws.send(JSON.stringify({
                "type": "Authenticate",
                "_id": Id, //Some browser identifier?
                "name": "chrome on Windows 10",
                "result": "Success",
                "token": Token, //Your account token
                "user_id": UserId //Your account user id
            }
        ))
    })

    ws.on('close', function open(r) {
        console.log(`[REVOLT]: Closed: ${r}`) 
        console.log(`[REVOLT]: Disconnected.. Reconnecting`)
        ws = new WebSocket('wss://ws.revolt.chat/', {
        headers: {
            Host: 'ws.revolt.chat',
            Connection: 'Upgrade',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) revolt-desktop/1.0.6 Chrome/98.0.4758.141 Electron/17.4.3 Safari/537.36',
            Upgrade: 'websocket',
            Origin: 'https',
            'Sec-WebSocket-Version': '13',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US',
            'Sec-WebSocket-Key': 'DxRhe6fokGKthFBqPNrWVw==' //ah yes.
        }
    });
})
    ws.on('message', async function incoming(data) {
        var Message;
        try {
            Message = JSON.parse(data);
        } catch (e) {
            return console.log(`[REVOLT]: Error while parsing data.`)
        }

        switch (Message.type) {
            case "Ready":
                console.log(`[REVOLT]: Revolt client ready.`)
                XSessionToken = Token

                Message.users.filter(predicate => {
                    Users[predicate._id] = {
                        Username: predicate.username
                    }
                })
                console.log("[REVOLT]: Fetched DMS/GCS???")
                let ClientTelle = Message.users.find(u => u._id === UserId)
                if (ClientTelle) {
                    Client = ClientTelle
                    console.log(`[REVOLT]: Fetched client. (Id = ${ClientTelle._id}) (Username = ${ClientTelle.username})`)
                }
            
                for (const member of Message.members) {
                    if (!Users[member._id["user"]]){
                        Users[member._id["user"]] = {
                            Username: "NoFetch",
                            ServerId: member._id["server"]
                        }
                    }
                }
                console.log("[REVOLT]: Fetched ?????")
                setInterval(() => {
                    var TimeStamp = new Date().getTime();
                    ws.send(JSON.stringify({
                        "type": "Ping",
                        "data": TimeStamp
                    }))
                }, 10000);

                //ADD CMDS

                addCommand('encrypt', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const MessageId = data.MessageId
                        var Args = getArgs(Content)
                        var Message = Args.slice(1).join(" ")
                        if (!Message){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid message or no message provided. Options are: `)
                        }
                        var EncryptionKey = generateEncryptionKey()
                        var EncryptedMessage = encrypt(Message, EncryptionKey)
                        DeleteMessage(XSessionToken, Channel, MessageId)
                        console.log(`[REVOLT]: Your decryption or encryption key is ${EncryptionKey.toString('hex')}`)
                        SendMessage(XSessionToken, Channel, `[REVOLT]:\n>Encrypted Message: ${EncryptedMessage}\n>Decryption Key: In your console.`).then(message => {
                            console.log("[REVOLT]: SENT!")
                        })
                    });
                })


                addCommand('decrypt', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const MessageId = data.MessageId
                        var Args = getArgs(Content)
                        var Message = Args[1]
                        var Key = Args.slice(2).join(" ")
                        if (!Message){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid message or no message provided. Options are: `)
                        }
                        if (!Key){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid key or no key provided. Options are: buffer of 32 bytes`)
                        }
                        var decrypted
                        try {
                            decrypted = decrypt(Message, Buffer.from(Key, "hex"))
                        } catch(e){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: An error occured while decrypting: ${e.code}`)
                        }
                        DeleteMessage(XSessionToken, Channel, MessageId)
                        SendMessage(XSessionToken, Channel, `[REVOLT]:\n>Encrypted Message: ${Message}\n>Decrypted Message: ${decrypted}`).then(message => {
                            console.log("[REVOLT]: SENT!")
                        })
                    });
                })

                addCommand('insult', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const User = ScanForMentionsAndExtract(Content);
                        const Channel = data.ChannelId
                        SendMessage(XSessionToken, Channel, `Youre so fucking dependant on women. Fucking weakling, Get a life <@${User}>`).then(message => {
                            console.log("[REVOLT]: SENT!")
                        })
                    });
                })

                addCommand('lenny', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        SendMessage(XSessionToken, Channel, "LennyFace").then(message => {
                            console.log("[REVOLT]: SENT!")
                        }).catch(error => {
                            console.log(error)
                        })
                    });
                })

                addCommand('ban', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const Server = data?.ServerId
                        const Args = getArgs(Content)
                        const User = ScanForMentionsAndExtract(Content);
                        if (!User){
                           return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid user or no user provided. Options are: `)
                        }
                        if (!Args[2]){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid reason or no reason provided. Options are: `)
                         }
                        if (Server){
                            BanUser(XSessionToken, Server, User, Args.slice(1).join(" ")).then(ban => {
                                SendMessage(XSessionToken, Channel, `Successfully Banned ${autoUser(User)}(${User}) For "${Args[2]}"`).then(message => {
                                    console.log("[REVOLT]: SENT!")
                                }).catch(error => {
                                    console.log(error)
                                })
                            }).catch(ban => {
                                console.log("[REVOLT]: Couldnt ban.")
                                console.log(ban)
                            })
                        }
                    })
                })


                addCommand('unban', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const Server = data?.ServerId
                        const Args = getArgs(Content)
                        const User = ScanForMentionsAndExtract(Content);
                        if (!User){
                           return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid user or no user provided. Options are: `)
                        }
                        if (Server){
                            UnBanUser(XSessionToken, Server, User).then(ban => {
                                SendMessage(XSessionToken, Channel, `Successfully UnBanned ${autoUser(User)}(${User}) For "${Args[2]}"`).then(message => {
                                    console.log("[REVOLT]: SENT!")
                                }).catch(error => {
                                    console.log(error)
                                })
                            }).catch(ban => {
                                console.log(ban)
                                console.log("[REVOLT]: Couldnt unban.")
                                SendMessage(XSessionToken, Channel, `[REVOLT]: Couldnt ban.\n>${ban}`)
                            })
                        }
                    })
                })
                //assuming to be a server command
            

                addCommand('argstest', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const Args = getArgs(Content)
                        SendMessage(XSessionToken, Channel, `${getArgs[1]}, ${getArgs[2]}`).then(message => {
                            console.log("[REVOLT]: SENT!")
                        })
                    });
                })

                addCommand('gayrate', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const User = ScanForMentionsAndExtract(Content)
                        const Gayrate = Math.floor(Math.random() * 101) // should work
                        SendMessage(XSessionToken, Channel, `${autoUser(User)} is ${Gayrate}% gay!`).then(message => {
                            console.log("[REVOLT]: SENT!")
                        })
                    })
                })

                addCommand('8ball', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const Args = getArgs(Content)
                        const responses = ["It is certain.","It is decidedly so.","Without a doubt.","Yes - definitely.","You may rely on it.","As I see it, yes.","Most likely.","Outlook good.","Yes.","Signs point to yes.","Reply hazy, try again.","Ask again later.","Better not tell you now.","Cannot predict now.","Concentrate and ask again.","Don't count on it.","Outlook not so good.","My sources say no.","Very doubtful."];
                        SendMessage(XSessionToken, Channel, " `` " + Args.slice(1).join(" ") + "\n" + responses[Math.floor(Math.random() * responses.length)] + " `` ").then(message => {
                            console.log("[REVOLT]: SENT!")
                        })
                    })
                })

                addCommand('text', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const Args = getArgs(Content)
                        var types = ["big", "small"]
                        const colors = ["red", "green", "blue", "pink", "purple","white", "magenta", "yellow", "orange", "brown", "crimson", "indianred", "salmon", "lightpink", "hotpink", "deeppink", "orangered", "gold", "violet", "blueviolet", "fuchsia", "indigo", "lime", "springgreen", "darkgreen", "lightgreen", "teal", "aqua", "turquoise", "lightskyblue", "royalblue", "navy", "gray", "black", "darkslategray"]
                        if (!Args[1]?.toLowerCase()){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid Color or no color provided. Options are: red, green, blue, pink, purple, white, magenta, yellow, orange, brown, crimson, indianred, salmon, lightpink, hotpink, deeppink, orangered, gold, violet, blueviolet, fuchsia, indigo, lime, springgreen, darkgreen, lightgreen, teal, aqua, turquoise, lightskyblue, royalblue, navy, gray, black, darkslategray`)
                        }
                        if (!Args[2]?.toLowerCase()){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid type or no type provided. Options are: big, small`)
                        }
                        var prepare = colors.find(color => color.match(Args[1]))
                        var prepare2 = types.find(type => type.match(Args[2]))

                        if (!prepare){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid Color or no color provided. Options are: red, green, blue, pink, purple, white, magenta, yellow, orange, brown, crimson, indianred, salmon, lightpink, hotpink, deeppink, orangered, gold, violet, blueviolet, fuchsia, indigo, lime, springgreen, darkgreen, lightgreen, teal, aqua, turquoise, lightskyblue, royalblue, navy, gray, black, darkslategray`)
                        } else if (!prepare2){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid type or no type provided. Options are: big, small`)
                        } else if (!Args[3]){
                            return SendMessage(XSessionToken, Channel, `[REVOLT]: Invalid messgae or no message provided. Options are: obviously whatever u want.`)
                        }
                        SendMessage(XSessionToken, Channel, `${Args[2] == ("big") ? "#" : ""} $\\color{${Args[1]}}\\textsf{${Args.slice(3).join(" ")}}$`).then(message => {
                            console.log("[REVOLT]: SENT!")
                        })
                    });
                })
                
                addCommand('cock', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const CockSizes = ['8=D', '8==D', '8===D', '8====D', '8=====D', '8======D', '8=======D', '8========D']
                        const User = autoUser(ScanForMentionsAndExtract(Content))
                        SendMessage(XSessionToken, Channel, `${User}'s cock is this large: ${CockSizes[Math.floor(Math.random() * CockSizes.length)]}`).then(message => {
                            console.log("[REVOLT]: SENT!")
                        }).catch(error => {
                            console.log(error)
                        })
                    });
                })
                
                addCommand('bird', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        axios({
                            method: "GET",
                            url: "https://some-random-api.ml/animal/bird"
                        }).then(response => {
                            SendMessage(XSessionToken, Channel, `${response.data.image}`).then(message => {
                                console.log("[REVOLT]: SENT!")
                            }).catch(error => {
                                console.log(error)
                            })
                        })
                    });
                })
                addCommand('kanye', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        axios({
                            method: "GET",
                            url: "https://api.kanye.rest/"
                        }).then(response => {
                            SendMessage(XSessionToken, Channel, `${response.data.quote}`).then(message => {
                                console.log("[REVOLT]: SENT!")
                            }).catch(error => {
                                console.log(error)
                            })
                        })
                    });
                })
                
                addCommand('chucknorris', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        axios({
                            method: "GET",
                            url: "https://api.chucknorris.io/jokes/random"
                        }).then(response => {
                            SendMessage(XSessionToken, Channel, `${response.data.value}`).then(message => {
                                console.log("[REVOLT]: SENT!")
                            }).catch(error => {
                                console.log(error)
                            })
                        })
                    });
                })
                
                addCommand('dog', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        axios({
                            method: "GET",
                            url: "https://dog.ceo/api/breeds/image/random"
                        }).then(response => {
                            SendMessage(XSessionToken, Channel, `${response.data.message}`).then(message => {
                                console.log("[REVOLT]: SENT!")
                            }).catch(error => {
                                console.log(error)
                            })
                        })
                    });
                })
                
                addCommand('robloxinfo', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const id = getArgs(Content)[1]
                        axios({
                            method: "GET",
                            url: `https://users.roblox.com/v1/users/${id}`
                        }).then(response => {
                            let Data = response.data
                            let Description = Data.description
                            let Created = Data.created
                            let Name = Data.name
                            let Display = Data.displayName
                            axios({
                                method: "GET",
                                url: `https://friends.roblox.com/v1/users/${id}/followers/count`
                            }).then(resp2 => {
                                let Followers = resp2.data.count
                                axios({
                                    method: "GET",
                                    url: `https://friends.roblox.com/v1/users/${id}/friends/count`
                                }).then(resp3 => {
                                    let Friends = resp3.data.count
                                    SendMessage(XSessionToken, Channel, markdown(`Description: ${Description}\nCreated at: ${Created}\nName: ${Name}\nDisplay Name: ${Display}\nFriends: ${Friends}\nFollowers: ${Followers}`)).then(message => {
                                        console.log("[REVOLT]: SENT!")
                                    }).catch(error => {
                                        console.log(error)
                                    })
                                })
                            })
                        }).catch(error => {
                            console.log(error)
                        })
                    });
                })
                
                addCommand('iq', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Content = data.Content
                        const Channel = data.ChannelId
                        const User = autoUser(ScanForMentionsAndExtract(Content))
                        const IQ = Math.floor(Math.random() * 201)
                        SendMessage(XSessionToken, Channel, `${User} has an iq of ${IQ}!`).then(message => {
                            console.log("[REVOLT]: SENT!")
                        })
                    });
                })
                
                addCommand('invismsg', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Channel = data.ChannelId
                        SendMessage(XSessionToken, Channel, `[ ]( )`).then(message => {
                            console.log("[REVOLT]: SENT!")
                        })
                    })
                })
                
                addCommand('wyr', (data, sharedObj) => {
                    return new Promise((resolve, reject) => {
                        const Channel = data.ChannelId
                        axios({
                            method: 'GET',
                            url: 'https://would-you-rather-api.abaanshanid.repl.co/'
                        }).then(response => {
                            SendMessage(XSessionToken, Channel, `${response.data.data}`).then(message => {
                                console.log("[REVOLT]: SENT!")
                            })
                        })
                    })
                })

                

                break;

            case "ChannelStartTyping":
                break;

            case "ChannelStopTyping":
                break;

            case "Message":
                if (!Users[Message.author] && Message.author !== "00000000000000000000000000"){
                    FetchUser(XSessionToken, Message.author).then(user => {
                        Users[Message.author] = {Username: user.UserName}
                        console.log(`[REVOLT]: Author ${Users[Message.author] ? Users[Message.author].Username : "UNKNOWN?"} (${Message.author}) sent ${Message.content}`)
                        FetchChannel(XSessionToken, Message.channel).then(channel => {
                            if (channel.ServerId){
                                if (Message.content?.startsWith(prefix)){
                                    handleCommand(Message.content, {
                                        Context: "Server",
                                        Author: Message.author,
                                        ChannelId: Message.channel,
                                        Content : Message.content,
                                        ServerId : channel.ServerId,
                                        MessageId: Message._id
                                    })
                                }
                            } else {
                                if (Message.content?.startsWith(prefix)){
                                    handleCommand(Message.content, {
                                        Context: "Message",
                                        Author: Message.author,
                                        ChannelId: Message.channel,
                                        Content : Message.content,
                                        MessageId: Message._id
                                    })
                                }
                            }
                        })
                    })
                } else {
                    FetchChannel(XSessionToken, Message.channel).then(channel => {
                        if (channel.ServerId){
                            if (Message.content?.startsWith(prefix)){
                                handleCommand(Message.content, {
                                    Context: "Server",
                                    Author: Message.author,
                                    ChannelId: Message.channel,
                                    Content : Message.content,
                                    ServerId : channel.ServerId,
                                    MessageId: Message._id
                                })
                            }
                        } else {
                            if (Message.content?.startsWith(prefix)){
                                handleCommand(Message.content, {
                                    Context: "Message",
                                    Author: Message.author,
                                    ChannelId: Message.channel,
                                    Content : Message.content,
                                    MessageId: Message._id
                                })
                            }
                        }
                    })
                    console.log(`[REVOLT]: Author ${Users[Message.author] ? Users[Message.author].Username : "UNKNOWN?"} (${Message.author}) sent ${Message.content}`)
                  
                }
              
                
    
                break

            case "Pong":
                console.log(`[REVOLT]: Received heartbeat back`)
                break

            case "Authenticated":
                console.log(`[REVOLT]: Authenticated!`)
                break

            default:
                // console.log(Message)
                break;
        }
    })
}).catch(oopsies => {
    console.error(oopsies)
    throw new Error(`[REVOLT]: Couldnt login. Additional information`)
}) //First start off by logging in your acc with email and password. Captchas should be absent.
