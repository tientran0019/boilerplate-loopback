/* --------------------------------------------------------
* Author Tien Tran
* Email tientran0019@gmail.com
* Phone 0972970075
*
* Created: 2021-05-29 17:22:52
*------------------------------------------------------- */

export default {
	...process.env,
	EMAIL_FROM: `"${process.env.EMAIL_NAME || (process.env.BRAND + ' Web Services')}" <${process.env.EMAIL}>`,
};
