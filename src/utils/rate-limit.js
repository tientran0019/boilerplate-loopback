/* --------------------------------------------------------
* Copyright ZelloSoft
* Website: https://www.zellosoft.com
*
* Author Tien Tran
* Email tientran@zellosoft.com
* Phone 0972970075
*
* Created: 2021-10-30 09:45:22
*------------------------------------------------------- */
import rateLimit from 'express-rate-limit';
// import RedisStore from 'rate-limit-redis';

const useRateLimit = (app) => {
	app.set('trust proxy', 1);

	const ignoreUrls = ['/api/v1/users/login'];

	const limiter = rateLimit({
		// store: new RedisStore({}),
		windowMs: 1 * 60 * 1000,
		// skipFailedRequests: true,
		max: 600,
		skip: (req) => {
			if (ignoreUrls.includes(req.originalUrl)) {
				return true;
			}
			return false;
		},
	});

	//  apply to all requests
	app.use('/api/', limiter);

	const anotherLimiter = rateLimit({
		// store: new RedisStore({}),
		windowMs: 56 * 1000,
		// skipFailedRequests: true,
		max: 5,
	});

	app.use('/api/v1/users/login', anotherLimiter);
};

export default useRateLimit;
