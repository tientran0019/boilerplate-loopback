/* eslint-disable no-param-reassign */
/* eslint-disable import/no-commonjs */
/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2021-04-23 11:34:33
*------------------------------------------------------- */

import _debug from 'src/utils/debug';

const debug = _debug('paginator');

const DEFAULT_LIMIT = 10;
const DEFAULT_MAX_LIMIT = 100;
const DEFAUL_NO_MAX_LIMIT = false;

export default (Model, options = {}) => {
	debug('Pagintor mixin for model %s', Model.modelName);

	const getLimit = (filter) => {
		if (filter && filter.limit) {
			let limit = parseInt(filter.limit, 10);

			if (options.maxLimit && !options.noMaxLimit) {
				limit = limit > options.maxLimit ? options.maxLimit : limit;
			}

			return limit;
		}

		return options.limit;
	};

	const modifyFilter = (filter, page) => {
		const limit = getLimit(filter);
		const skip = (page - 1) * limit;

		if (!filter) {
			filter = {
				skip,
				limit,
			};
			return filter;
		}

		filter.skip = skip;
		filter.limit = limit;

		return filter;
	};

	Model.getApp((error, app) => {
		if (error) {
			debug(`Error getting app: ${error}`);
		}

		const globalOptions = app.get('paginator') || {};
		options.limit = options.limit || globalOptions.limit || DEFAULT_LIMIT;
		options.maxLimit = options.maxLimit || globalOptions.maxLimit || DEFAULT_MAX_LIMIT;
		options.noMaxLimit = options.noMaxLimit || globalOptions.noMaxLimit || DEFAUL_NO_MAX_LIMIT;
	});

	Model.beforeRemote('find', async (context) => {
		// if (!context.req.query.page) { return; }

		context.args.filter = modifyFilter(context.args.filter, context.req.query.page);
	});

	Model.afterRemote('find', async (context, next) => {
		// if (!context.req.query.page) { return; }

		const limit = getLimit(context.args.filter);
		const where = context.args.filter.where || null;
		const totalItemCount = await Model.count(where);
		const totalPageCount = Math.ceil(totalItemCount / limit);
		const currentPage = parseInt(context.req.query.page, 10) || 1;
		const previousPage = currentPage - 1;
		const nextPage = currentPage + 1;

		context.result = {
			totalItemCount,
			totalPageCount,
			itemsPerPage: limit,
			currentPage,
			data: context.result,
		};

		if (nextPage <= totalPageCount) {
			context.result.nextPage = nextPage;
		}

		if (previousPage > 0) {
			context.result.previousPage = previousPage;
		}
	});
};

module.exports = exports.default; // eslint-disable-line
