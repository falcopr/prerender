const isLoggingDisabled = process.env.DISABLE_LOGGING == 'true',
	  isConsoleLoggingEnabled = process.env.CONSOLE_LOGGING == 'true',
	  isFileLoggingEnabled = process.env.FILE_LOGGING == 'true',
	  moment = require('moment'),
	  // https://www.npmjs.com/package/winston
	  winston = require('winston'),
	  winstonConfig = winston.config;

// https://github.com/winstonjs/winston-daily-rotate-file
require('winston-daily-rotate-file');

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
	// Standard logging to file
	// transports.push(new winston.transports.File({ filename: process.env.FILENAME_LOGGING || 'prerender.log' }));

	// Daily rotate logging to file
	transports.push(new winston.transports.DailyRotateFile({
		dirname: process.env.DIRNAME_LOGGING || './logs',
		filename: process.env.FILENAME_LOGGING || 'prerender-%DATE%.log',
		datePattern: process.env.FILENAME_DATEPATTERN_LOGGING || 'YYYY-MM-DD-HH',
		zippedArchive: process.env.ZIPPED_ARCHIVE_LOGGING == 'true',
		maxSize: process.env.MAXSIZE_LOGGING || '20m',
		maxFiles: process.env.MAXFILES_LOGGING || '14d'
	}));
}

let logger = isLoggingDisabled ? console : new winston.Logger({ transports: transports });

module.exports = { logger, isLoggingDisabled };