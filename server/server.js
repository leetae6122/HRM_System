import app from "./app";
import connectDB from './connectDB';
import logger from './logger';

//Start Server
async function startServer() {
    try {
        await connectDB();
        const server = app.listen(process.env.PORT, "127.0.0.1", undefined, () => { console.log(`Server is running on 127.0.0.1:${process.env.PORT}.`) });
        const io = require("socket.io")(server, {
            cors: {
                origin: process.env.CLIENT_URL,
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        io.on('connection', (socket) => {
            logger.info(`Client connected ${socket.id}`);

            socket.on('check-in', (...arr) => {
                io.emit('check-in', arr);
            });

            socket.on('disconnect', () => {
                logger.info(`Client disconnected ${socket.id}`);
            });
        });

    } catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();