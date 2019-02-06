/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2017-12-01 16:17:14
*------------------------------------------------------- */

export default function (app) {
	const remotes = app.remotes();

	// Set X-Total-Count for all search requests
	remotes.after('*.find', (ctx, next) => {
		let filter = {};

		if (ctx.args && ctx.args.filter) {
			filter = ctx.args.filter.where;
		}

		const { limit = 12, skip = 0 } = ctx.req.query.filter ? JSON.parse(ctx.req.query.filter) : {};

		this.count(filter, (err, count) => {
			if (err) {
				return next(err);
			}
			const dataSend = {
				total: count,
				limit,
				skip,
				data: ctx.result,
			};

			ctx.result = dataSend;
			next();
		});
	});
}
