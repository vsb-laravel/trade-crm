require('dotenv').config()
const request = require('request');

function middlewSubscription(socket, idSubscription) {
    request.get({
        // url: process.env.APP_URL_NODE + "/check-user/" + idSubscription,
        url:socket.handshake.headers.referer + "check-user/" + idSubscription,
        headers: {cookie: socket.request.headers.cookie},
        json: true,
    }, (error, response, json) => {
        if(typeof json != 'undefined' && json.subscribe == true)
        {
        	socket.listSubscription.push(Number(idSubscription));
        }
        else
        {
        	return false;
        }
    });
}

module.exports = {
	middlewSubscription
};
