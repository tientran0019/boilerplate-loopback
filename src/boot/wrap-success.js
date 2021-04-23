/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2021-04-23 10:11:14
*------------------------------------------------------- */

export default function (app) {
	const remotes = app.remotes();

	remotes.after('**', (ctx, next) => {
		ctx.result = {
			statusCode: 200,
			// message: ctx.methodString + ' success',
			result: ctx.result,
		};

		next();
	});
}
