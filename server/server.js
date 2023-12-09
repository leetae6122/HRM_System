import app from "./app.js";
import connectDB from './connectDB.js';
import logger from './logger.js';

//Start Server
async function startServer() {
    try {
        await connectDB();
        const port = process.env.PORT || 5000;
        const server = app.listen(port, () => { console.log(`Server is running on port ${port}.`) });
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