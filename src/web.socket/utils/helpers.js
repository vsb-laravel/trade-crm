/**
 * Count unique userIds
 * @param {Object[]} listSockets
 */
function usersUnique(listSockets) {
    const userIds = [];
    listSockets.forEach((socket) => {
        if (userIds.indexOf(socket.userId) === -1) {
            if(socket.auth && socket.userRawData) userIds.push(socket.userRawData);
        }
    });
    return userIds;
}

module.exports = {
    usersUnique,
};
