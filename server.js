#!/usr/bin/env node
var dotenv = require('dotenv'),
    prerender = require('./lib'),
    prerenderMemoryCache = require('prerender-memory-cache');

dotenv.config();

var server = prerender({
    chromeLocation: process.env.CHROME_LOCATION || './chromium/chrome.exe',
    logRequests: process.env.ENABLE_LOGGING || false
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.removeScriptTags());
server.use(prerender.blockResources());
server.use(prerender.logger());
server.use(prerenderMemoryCache);
server.use(prerender.httpHeaders());

server.start();
