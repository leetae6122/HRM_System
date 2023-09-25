import app from "./app";
import connectDB from './connectDB';

//Start Server
async function startServer() {
    try {
        await connectDB();
        app.listen(process.env.PORT, "127.0.0.1");
        console.log(`Server is running on 127.0.0.1:${process.env.PORT}.`);
    } catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();