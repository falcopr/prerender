#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();

let prerender = require('./lib'),
    prerenderMemoryCache = require('prerender-memory-cache'),
    server = prerender({
        chromeLocation: process.env.CHROME_LOCATION || './chromium/chrome.exe',
        logRequests: process.env.REQUEST_LOGGING == 'true' && process.env.DISABLE_LOGGING == 'false'
    });

server.use(prerender.sendPrerenderHeader());
server.use(prerender.removeScriptTags());
server.use(prerender.blockResources());
server.use(prerender.logger());
server.use(prerenderMemoryCache);
server.use(prerender.httpHeaders());

server.start();
