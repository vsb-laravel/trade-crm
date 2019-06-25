const socketio = require('socket.io');

class Socket {
    constructor(port) {
        this.sockets = [];
        this.io = socketio(port);
        this.io.on('connection', (socket) => {
            socket.emit('symbols', `hi`);
            socket.on('subscribe', (data) => this.subscribe(socket, data));
            socket.on('disconnect', () => this.ondisconnect(socket));
        });
    }
    ondisconnect(socket){
        for(let sock in this.sockets){
            if(this.sockets[sock] == socket) {
                this.sockets[sock]= null;
                return;
            }
        }
        return;
    }
    subscribe(socket, data) {

        this.sockets.push(socket);
        console.debug('new connection',this.sockets.length)
    }
    sendMessage(message) {
        this.sockets.map((socket,i) => {
            if(socket && socket.connected) {
                console.log(`new tick on ${message.symbol} - proxying...`);
                socket.emit(message.event, message);
            }
        })
    }
}

module.exports = Socket;
