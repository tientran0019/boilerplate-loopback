/* eslint-disable no-param-reassign */
/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2018-05-13 08:57:54
*------------------------------------------------------- */
import { FB } from 'fb';
import { PASSWORD_DEFAULT } from 'src/constant/parameters';

import sendMailVerify from 'src/utils/sendMailVerify';

export default function (accessToken, ttl, include = '{}', next) {
	const self = this;

	FB.api('me', { fields: 'email,name,gender,picture,link', 'access_token': accessToken }, (res) => {
		if (res.error) {
			return next({ ...res.error });
		}

		if (!res.id) {
			return next({ message: 'accessToken is invalid!' });
		}

		if (!res.email) {
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
			email: res.email,
			fullName: res.name || '',
			gender: res.gender || '',
			facebookId: res.id,
			loginType: 'facebook',
			avatar: res.picture && res.picture.data && res.picture.data.url,
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
				if (userCheck.loginType === 'facebook') {
					handleLogin(userCheck);
				} else {
					return next({ message: 'Email ' + userCheck.email + ' already exists!' });
				}
			}
		});
	});
}
