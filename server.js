import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Import Routes
import UserRoute from "./routers/userRouter.js"
import RoomRoute from "./routers/roomRouter.js"
import FlashRoute from "./routers/flashRouter.js"
import TokenRoute from "./routers/tokenRouter.js"

// Load environment variables
dotenv.config();

// App Initialization
const app = express();
const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;
const clientURI = process.env.MODE === "production" ? process.env.SERVER_URI_PRODUCTION : process.env.SERVER_URI_DEVELOPMENT;
const roomURI = process.env.MODE === "production" ? process.env.ROOM_URI_PRODUCTION : process.env.ROOM_URI_DEVELOPMENT;
const allowedOrigins = [clientURI, roomURI];

//Middleware
app.use(express.json())
app.use(cors({
    origin: "*"
}))

// Route
app.use("/api/user", UserRoute);
app.use("/api/room", RoomRoute);
app.use("/api/flashCard", FlashRoute);
app.use("/api/token", TokenRoute);


// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to Simple");
});


//Start Server
const StartServer = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connect to mongodb success!!")
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })

    } catch (error) {
        console.error("Error connecting to database or starting server:", error);
    }
}

StartServer();
