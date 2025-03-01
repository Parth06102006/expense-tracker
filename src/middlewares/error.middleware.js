import { ApiError } from "../utilitis/ApiError.js";
import mongoose from "mongoose";

export const errorHandler = (error,req,res,next)=>
{

        if(!(error instanceof ApiError)) return;
        const statusCode = error.statusCode || new mongoose.error? 400 :500;
        const message  = error.message || 'Something went wrong'
        const response = new ApiError(statusCode,message,error?.errors);

        return res.status(statusCode).json({...response,message:statusCode});
}
