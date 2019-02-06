/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2017-12-01 15:58:41
*------------------------------------------------------- */

export default (server) => {
	// Install a `/` route that returns server status
	const router = server.loopback.Router();

	router.get('/', server.loopback.status());
	server.use(router);
};
