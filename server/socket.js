const socketIO = require('socket.io');

let io;

const init = (server) => {
    io = socketIO(server, {
        cors: {
            origin: "http://localhost:4201",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        socket.on('join_order', (orderId) => {
            socket.join(orderId);
            console.log(`Socket joined order: ${orderId}`);
        });

        // Group Ordering
        socket.on('join_group', (groupCode) => {
            socket.join(groupCode);
            console.log(`Socket joined group: ${groupCode}`);
        });

        socket.on('group_update', (data) => {
            // data contains groupCode and updated group object
            socket.to(data.groupCode).emit('group_received', data.group);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { init, getIO };
