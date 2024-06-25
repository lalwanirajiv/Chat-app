const io = require('socket.io')(8000, {
    cors: {
        origin: "*",
    }
});

console.log("Server started on port 8000");
const users = {};

io.on('connection', socket => {
    console.log("New connection established");

    socket.on('new-user-joined', name => {
        console.log("New User joined: " + name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        console.log("Message received: " + message);
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

});

