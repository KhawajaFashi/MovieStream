import mongoose from "mongoose";

const connection = async (url) => {
    mongoose.connect(url).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
}

export default connection;