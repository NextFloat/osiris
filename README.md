# Osiris

Osiris is a selfbot for revolt.chat, built using Node.js and websockets.
Osiris was made to enhance the user experience on revolt.chat!

## Features

- Message Encryption!
- Commands!

## Demo

- [Streamable](https://streamable.com/h2s5ty)

# Making your own commands

We currently do not have any wiki or documentation on how to make your own commands, but here's a quick guide on how to start making your own commands.

- Go to the `commands` folder
- Create a new file with the name of your command (Or whatever you want to name it)
- Create your command using the following template:

```js
function execute (XSessionToken, data, sharedObj) {

    // Your code here

}

module.exports = {
    name: "command name",
    description: "command description",
    native: false, // This currently has no use but will be used to easily identify custom commands in the future so just leave it as false
    category: "category", // This is used to group commands together there will be a list of categories in the future
    usage: "command usage", // This is used to show how to use the command in the help command (Might be removed later, just make it the same as the name)
    arguments: []
    /*

        There are 3 types of arguments:
        STRING
        NUMBER
        USER, USER_MENTION, MENTION (All of these are the same thing, oh well)

        To add an argument, just add it to the array like this:
        arguments: [
            {
                name: "A person",
                type: "USER"
            },
            {
                name: "A number",
                type: "NUMBER"
            },
            {
                name: "A string",
                type: "STRING"
            }
        ]


    */
    execute,
};
```

- The command will be automatically loaded when you start osiris

I highly recommend you look at the other commands to get a better understanding of how to make your own commands.

# Authors

- [@AggelosLua](https://github.com/AggelosLua)
- [@g0dswisdom](https://github.com/g0dswisdom)
- [@ananymoos](https://github.com/ananymoos1)
- [@9xCatto](https://github.com/9xCatto)
