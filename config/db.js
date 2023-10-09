import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
    try {
        const cnt = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`connected to Mongodb Database ${cnt.connection.host}`);
    } catch (error) {
        console.log(`Mongodb error ${error}`)
    }
};

export default connectDB;