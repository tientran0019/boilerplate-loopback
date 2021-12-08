/* eslint-disable no-template-curly-in-string */
/* --------------------------------------------------------
* Copyright ZelloSoft
* Website: https://www.zellosoft.com
*
* Author Tien Tran
* Email tientran@zellosoft.com
* Phone 0972970075
*
* Created: 2021-09-24 11:15:20
*------------------------------------------------------- */

module.exports = { // eslint-disable-line
	'initial:before': {
		'loopback#favicon': {
			'params': './favicon.ico',
		},
	},
	'initial': {
		'compression': {
			'enabled': true,
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
				'debug': true,
				'log': true,
				'rootProperty': false,
				'disableStackTrace': false,
			},
		},
	},
};
