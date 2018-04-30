#!/usr/bin/env node
var dotenv = require('dotenv'),
    prerender = require('./lib'),
    prerenderMemoryCache = require('prerender-memory-cache');

dotenv.config();

var server = prerender({
    chromeLocation: './chromium/chrome.exe',
    // Enable this for test purposes
    // logRequests: true,
    pageLoadTimeout: 10 * 1000,
    waitAfterLastRequest: 1000
});

server.use(prerender.sendPrerenderHeader());
// server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
server.use(prerenderMemoryCache);

server.start();
