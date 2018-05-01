const logger = require('../logger').logger;

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

getRequestInfo = (req, isReady) => {
    let request = {
		headers: req.headers,
		method: req.method,
        clientIp: getClientIp(req)
    };

    if (isReady) {
        request.statusCode = getStatusCode(req);
    }

	return request;
}

logSeverityByStatusCode = (req, message) => {
    const requestInfo = getRequestInfo(req, true);
    if (requestInfo.statusCode >= 200 && requestInfo.statusCode < 400) {
        logger.info(`${message}: ${JSON.stringify(requestInfo)}`);
    } else {
        logger.error(`${message}: ${JSON.stringify(requestInfo)}`);
    }
}

// Additional logging for detecting rendering life cycle
module.exports = {
    requestReceived: (req, res, next) => {
        logger.info(`Rendering started: ${JSON.stringify(getRequestInfo(req, false))}`);
        next();
    },
	pageLoaded: (req, res, next) => {
        logSeverityByStatusCode(req, 'Rendering finished');
		next();
    },
    beforeSend: (req, res, next) => {
        logSeverityByStatusCode(req, 'Send response');
		next();
    },
};