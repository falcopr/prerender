const isLoggingDisabled = process.env.DISABLE_LOGGING == 'true',
	  isConsoleLoggingEnabled = process.env.CONSOLE_LOGGING == 'true',
	  isFileLoggingEnabled = process.env.FILE_LOGGING == 'true',
	  moment = require('moment'),
	  // https://www.npmjs.com/package/winston
	  winston = require('winston'),
	  winstonConfig = winston.config;

let transports = [];

if (isConsoleLoggingEnabled) {
	transports.push(new winston.transports.Console({
		timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss.SSSS'),
		formatter: (options) => 
			options.timestamp() + ' ' +
			winstonConfig.colorize(options.level, options.level.toUpperCase()) + ' ' +
			(options.message ? options.message : '') +
			(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' )
	}));
}

if (isFileLoggingEnabled) {
	transports.push(new winston.transports.File({ filename: process.env.FILENAME_LOGGING || 'prerender.log' }));
}

let logger = isLoggingDisabled ? console : new winston.Logger({ transports: transports });

module.exports = { logger, isLoggingDisabled };