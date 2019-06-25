var socket = io();

var userId = (typeof currentAuth !== 'undefined') ? currentAuth.id: undefined;

socket.on('connect', function (sockets) {
    socket.emit('user_info', {userId: userId});
});

socket.on('all_user', function (data) {
    console.log('Numbers off users ' + data.count);
});

socket.on('example_channel', function (data) {
    console.log(data);
});

socket.on('public_channel', function (data) {
    console.log(data);
});

socket.on('private_channel', function (data) {
    console.log(data);
});