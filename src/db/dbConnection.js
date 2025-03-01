import mongoose from "mongoose";

export const dbConnect = async()=>
{
    try {
        const response = await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database connection successfull');
        return response;
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}