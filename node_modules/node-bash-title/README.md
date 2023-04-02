# node-bash-title

A NodeJS library to change the title of your BASH shell. Usefull in development: name your bash screens and display error or info messages. You can use even uni-code 🍻

![screeenshot](https://cloud.githubusercontent.com/assets/582533/20051424/3caa15b6-a4cf-11e6-8ce3-642523998a04.png)


## Install

```
  npm install node-bash-title --save
```

or 

```
  yarn add node-bash-title
````


## Usage (in Node)

```javascript
  const setTitle = require('node-bash-title');
  setTitle('🍻  Server');
```

## Usage (in NPM scripts)

```javascript
 "scripts": {
    "start": "set-bash-title server && node server/app.js"
  },
```

