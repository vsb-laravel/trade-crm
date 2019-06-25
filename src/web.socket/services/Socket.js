require('dotenv').config();
const socketio = require('socket.io');
const {usersUnique} = require('../utils/helpers');
const middlewareAuth = require('../middleware/authCheckUser.js');
const {middlewSubscription} = require('../middleware/permissionSubscription.js');
const Redis = require('redis');

class Socket {
    constructor(port) {
        this._socketsList = [];
        this.redis = Redis.createClient({host:process.env.REDIS_HOST});
        this.io = socketio(port);
        this.io.use(middlewareAuth);
        this.io.on('connection', (socket) => {
            socket.on('user_info', (data) => this._onSocketUserInfo(socket, data));
            socket.on('disconnect', () => this._onSocketDisconnect(socket.userId));
            socket.on('subscription_private', (data) => this._setSubscriptionId(socket, data));
            socket.on('unsubscribe_private', (data) => this._removeSubscriptionId(socket, data));
            socket.on('sub', (data) => this._setChildrenId(socket, data));
            socket.on('subscribe', (data) => this._setSubscriptionId(socket, data));
            socket.on('unsubscribe', (data) => this._removeSubscriptionId(socket, data));
            socket.listSubscription = [];
        });
    }
    redisCommand(cmd,args=''){
        return new Promise( (resolve,reject) => {
            const arg = typeof(args)=="array"?args:[args];
            this.redis.sendCommand(new Redis.Command(cmd,arg,'urt8',(err, result) => {
                // console.log(cmd,args, result);
                if (err) reject(err);
                resolve(result);
            }));
        })
    }
    _onSocketUserInfo(socket, data) {
        if (typeof data.userId === 'number') {
            socket.userId = data.userId;
            this._socketsList.push(socket);
            this._sendCount();
        }

        if (typeof data.childrenId === 'number') {
            socket.childrenId = data.childrenId;
        }
    }

    _onSocketDisconnect(userId) {
        for (let i in this._socketsList) {
            if (this._socketsList[i].userId === userId) {
                this._socketsList.splice(i, 1);
                this._sendCount();

                break;
            }
        }
    }

    _setSubscriptionId(socket, data) {
        if(socket.userId !== data.subscriptId)
        {
            middlewSubscription(socket,data.subscriptId);

            this.io.emit('subscription_list', {list_id: socket.listSubscription});
        }
    }

    _removeSubscriptionId(socket, data) {
        let index = socket.listSubscription.indexOf(data.subscriptId);

        if (index > -1) {
            socket.listSubscription.splice(index, 1);

            this.io.emit('subscription_list', {list_id: socket.listSubscription});
        }
    }

    _sendCount() {
        const usrlst = usersUnique(this._socketsList);
        // console.debug('send users count',usrlst);
        let redisusr = [];
        for(let i in usrlst){
            const user = usrlst[i];
            redisusr.push("id");
            redisusr.push(user.id);
        }
        this.redis.set('cf:online',JSON.stringify(usrlst),this.redis.print);
        this.io.emit('all_user', {count: usrlst.length, users: usrlst });
    }

    sendPMessage(pattern, channel, message) {
        // console.log(message.event);
        switch(message.data.type) {
            case 'public':
                this.io.emit(message.event, message.data);
                break;
            case 'private':
                this._socketsList.forEach((socket) => {
                    if (socket.userId == message.data.user_id) {
                        socket.emit(message.event, message.data);
                    }
                    if(socket.listSubscription.indexOf(Number(message.data.user_id)) !== -1) {
                        message.data.subscribe_id = message.data.user_id;
                        socket.emit(message.event, message.data);
                    }

                });
                break;
            case 'group':
                console.log('groupe message',message.data.user_id);
                this._socketsList.forEach((socket) => {
                    if (message.data.user_id.indexOf(socket.userId) !== -1){
                        socket.emit(message.event, message.data);
                    }
                });
                break;
            case 'except':
                // console.log('except')
                this._socketsList.forEach((socket) => {
                    // console.log(socket.userId);
                    // console.log(message.data.user_id.indexOf(socket.userId) === -1);
                    if(message.data.user_id.indexOf(socket.userId) === -1){
                        // console.log(message.data.user_id.indexOf(socket.userId) === -1);
                        socket.emit(message.event, message.data);
                    }
                });
                break;
            default:
                break;
        }
    }
}

module.exports = Socket;
