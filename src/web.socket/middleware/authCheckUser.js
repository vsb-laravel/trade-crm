require('dotenv').config();
const request = require('request');

module.exports = (socket, next) => {
    const referer = socket.handshake.headers.referer.replace(/(http(s?):\/\/.+?\/).*/,"$1");
    const fastlogin = socket.handshake.headers.referer.match(/user\/fastlogin\/(\d+)/);
    console.log('connection ',`${referer}check-auth`, socket.handshake.headers.cookie);
    if(fastlogin){
        socket.auth = true;
        socket.userRawData = {
            id:parseInt(fastlogin[1]),
            rights_id: 1,
            fastlogin:true
        };
        // console.log('fastlogin',fastlogin[0]);
        return next();
    }
    request.get({
        // url:process.env.APP_URL_NODE + "/check-auth",
        url:`${referer}check-auth`,
        headers: { cookie: socket.handshake.headers.cookie },
        json: true,
    }, (error, response, json) => {
        // console.log('check-auth',error,response,json);
        if(typeof json != 'undefined' && typeof json.auth != 'undefined'){
            socket.userRawData = json.user_info;
            socket.auth = json.auth;
            return next();
        }
    });
};
