/* eslint-disable no-param-reassign */
/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2018-05-13 08:57:54
*------------------------------------------------------- */
import GoogleAuth from 'google-auth-library';

import sendMailVerify from 'src/utils/sendMailVerify';

import { PASSWORD_DEFAULT } from 'src/constant/parameters';

const auth = new GoogleAuth();
const client = new auth.OAuth2([process.env.GG_CUSTOMER_ID], process.env.GG_CLIENT_SECRET_CODE, '');

export default function (accessToken, ttl, include = '{}', next) {
	const self = this;

	client.verifyIdToken(accessToken, [process.env.GG_CUSTOMER_ID], (e, res) => {
		if (e) {
			return next(e);
		}

		const payload = res.getPayload();


		if (payload.error) {
			return next({ ...payload.error });
		}

		if (!payload.sub) {
			return next({ message: 'accessToken is invalid!' });
		}

		if (!payload.email) {
			return next({ message: 'Email not found!' });
		}

		const handleLogin = (user) => {
			const tokenHandler = (errr, token) => {
				if (errr) {
					return next(errr);
				}
				token.__data.user = user;
				next(errr, token);
			};

			if (user.createAccessToken.length === 2) {
				user.createAccessToken(ttl, tokenHandler);
			} else {
				const credentials = {
					email: user.email,
					password: PASSWORD_DEFAULT,
					ttl,
				};

				user.createAccessToken(ttl, credentials, tokenHandler);
			}
		};

		const userData = {
			email: payload.email,
			fullName: payload.name || '',
			googleId: payload.sub,
			loginType: 'google',
			avatar: payload.picture || '',
			password: PASSWORD_DEFAULT,
		};

		self.findOne({ ...JSON.parse(include), where: { email: userData.email } }, (err, userCheck) => {
			if (err) {
				return next({ ...err });
			}

			if (!userCheck) {
				self.create(userData, (errCreate, userCreate) => {
					if (errCreate) {
						return next({ ...errCreate });
					}

					sendMailVerify(self, userCreate);

					handleLogin(userCreate);
				});
			} else {
				if (userCheck.status === 'inactive') {
					return next({
						code: 'ACCOUNT_DISABLED',
						message: 'Account has been disabled',
						name: 'Error',
						status: 401,
						statusCode: 401,
					});
				}
				if (userCheck.loginType === 'google') {
					handleLogin(userCheck);
				} else {
					return next({ message: 'Email ' + userCheck.email + ' already exists!' });
				}
			}
		});
	});
}
