class Socket {
    constructor(socket, redisDB) {
        this.io = socket;
        this.redisDB = redisDB;
    }

    socketEvents() {
        const IO = this.io;


        IO.on('connection', (socket) => {

            socket.setMaxListeners(20); /* Setting Maximum listeners */

            /*
            * In this Event user will create a new Room and can ask someone to join.
            */
            socket.on('new-game', (data) => {
                Promise.all(['game'].map(key => redisDB.getAsync(key))).then(values => {
                    console.log(values);
                });
            });


            socket.on('disconnecting', () => {

            });

        });
    }

    socketConfig() {
        this.socketEvents();
    }
}

module.exports = Socket;
