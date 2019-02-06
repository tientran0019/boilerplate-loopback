// /* --------------------------------------------------------
// * Author Trần Đức Tiến
// * Email ductienas@gmail.com
// * Phone 0972970075
// *
// * Created: 2018-03-06 15:06:41
// *------------------------------------------------------- */

// import es from 'event-stream';

// export default function (app) {
// 	const Notification = app.models.Notification;

// 	Notification.createChangeStream((err, changes) => {
// 		if (err) {
// 			console.log('err', err);
// 		}

// 		changes.pipe(es.stringify()).pipe(process.stdout);
// 	});
// }
