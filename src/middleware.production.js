/* eslint-disable no-template-curly-in-string */
/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2018-05-21 23:26:08
*------------------------------------------------------- */

module.exports = { // eslint-disable-line
	'initial:before': {
		'loopback#favicon': {
			'params': './favicon.ico',
		},
	},
	'initial': {
		'compression': {
			'enabled': false,
		},
		'cors': {
			'params': {
				'origin': process.env.CORS_DOMAIN ? process.env.CORS_DOMAIN.split(',') : true,
				'credentials': true,
				'maxAge': 86400,
			},
		},
		'helmet#xssFilter': {},
		'helmet#frameguard': {
			'params': [
				'deny',
			],
		},
		'helmet#hsts': {
			'params': {
				'maxAge': 0,
				'includeSubDomains': true,
			},
		},
		'helmet#hidePoweredBy': {},
		'helmet#ieNoOpen': {},
		'helmet#noSniff': {},
		'helmet#noCache': {
			'enabled': false,
		},
	},
	'session': {},
	'auth': {},
	'parse': {},
	'routes': {
		'loopback#rest': {
			'paths': [
				'${restApiRoot}',
			],
		},
	},
	'files': {},
	'final': {
		'loopback#urlNotFound': {},
	},
	'final:after': {
		'strong-error-handler': {
			'params': {
				'debug': false,
				'log': true,
				'rootProperty': false,
			},
		},
	},
};
