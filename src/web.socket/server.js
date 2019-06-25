require('dotenv').config();
// const fs = require('fs');
const Socket = require('./services/Socket');
const EventReporter = require('./services/EventReporter');

// const options = {
//     key: fs.readFileSync(process.env.SSL_KEY).toString()
//     ,cert: fs.readFileSync(process.env.SSL_CRT).toString()
//     // ,ca: fs.readFileSync(process.env.SSL_CA).toString()
// }
// console.log('Starting Socket...');
const socket = new Socket(3000);
// const socket = new Socket(3000,options);
// const socket = require('socket.io').listen(3000,options);
// console.log('Starting Redis listener...',process.env.REDIS_HOST,process.env.REDIS_PORT);
const eventReporter = new EventReporter({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT
});

eventReporter.onPMessage((pattern, channel, message) => {
	// console.log(message);
    socket.sendPMessage(pattern, channel, message);
});
