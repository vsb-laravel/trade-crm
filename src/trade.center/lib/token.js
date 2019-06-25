const querystring = require('querystring');
const url = require('url');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

function getToken(host, login, password, company, userAgent, callback) {
    let hostParsing = url.parse(host);

    let http = require(hostParsing.protocol.replace(':', ''));

    const postdata = querystring.stringify({
        login: login,
        password: password,
        company: company
    });

    const req = http.request({
        hostname: hostParsing.host.replace(/(:[0-9]+$)/, ''),
        port: hostParsing.port,
        path: '/login',
        rejectUnauthorized: !process.env.NODE_TLS_REJECT_UNAUTHORIZED,
        method: 'POST',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'user-agent': userAgent,
            'Referer': host + 'auth/',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postdata.length,
        }
    }, res => {
        if (res.statusCode === 200) {
            let body = [];
            let cookie = res.headers['set-cookie'];

            res.on('data', chunk => {
                body.push(chunk);
            });

            res.on('end', () => {
                body = JSON.parse(body.join(''));
                if (!body['errors']) {
                    callback(null, cookie);
                }
            });
        }
    });

    req.on('error', e => {
        console.log('Login error:', + e.message);
        callback(e.message);
    });

    req.write(postdata);
    req.end();
}

module.exports = getToken;
