var util = require('../util');

// https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
getClientIp = (req) => {
    return req.headers['x-forwarded-for'] || 
		req.connection.remoteAddress || 
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null);
}

// Extracted logic from httpHeaders.js to get status code
getStatusCode = (req) => {
    if (req.prerender.content && req.prerender.renderType == 'html') {
        let statusMatch = /<meta[^<>]*(?:name=['"]prerender-status-code['"][^<>]*content=['"]([0-9]{3})['"]|content=['"]([0-9]{3})['"][^<>]*name=['"]prerender-status-code['"])[^<>]*>/i,
            head = req.prerender.content.toString().split('</head>', 1).pop(),
            statusCode = 200,
            match;

        if (match = statusMatch.exec(head)) {
            statusCode = match[1] || match[2];
        }

        return statusCode;
    }

    return 404;
}

getRequestString = (req, isReady) => {
    let request = {
		headers: req.headers,
		method: req.method,
        clientIp: getClientIp(req)
    };

    if (isReady) {
        request.statusCode = getStatusCode(req);
    }

	return JSON.stringify(request);
}

// Additional logging for detecting rendering life cycle
module.exports = {
    requestReceived: (req, res, next) => {
        util.log(`Rendering started: ${getRequestString(req, false)}`);
        next();
    },
	pageLoaded: (req, res, next) => {
        util.log(`Rendering finished: ${getRequestString(req, true)}`);
		next();
    },
    beforeSend: (req, res, next) => {
        util.log(`Send response: ${getRequestString(req, true)}`);
		next();
    },
};