import app from "./app";
import connectDB from './connectDB';

//Start Server
async function startServer() {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}.`);
            console.log('------------------------------------------------------------------');
        });
    } catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();