#!/usr/bin/env node
const setTitle = require('./index');
const title = process.argv[2];
if (title) {
    setTitle(title);
}
