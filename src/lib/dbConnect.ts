import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

// here void means we don't care what type of data is returning
async function dbConnect(): Promise<void> {
    // To check if DB already connected and to avoid DataBase choking
    if(connection.isConnected) {
        console.log("Database Already Connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        // This returns a number to check if DB connected
        connection.isConnected = db.connections[0].readyState

        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("Database Connection Failed", error);
        process.exit(1);
    }
}

export default dbConnect;