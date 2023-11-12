import app from "./app";
import connectDB from './connectDB';

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
            console.log('a user connected', socket.id);
            console.log('Client connected');

            // Lắng nghe sự kiện điểm danh từ máy khách
            socket.on('check-in', (employeeId) => {
                console.log(`Employee ${employeeId} checked in`);
                // Gửi sự kiện điểm danh đến tất cả các máy khách
                io.emit('check-in', employeeId);
            });

            // Xử lý sự kiện khi máy khách ngắt kết nối
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });

    } catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();