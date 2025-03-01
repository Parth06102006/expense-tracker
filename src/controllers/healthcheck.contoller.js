import { ApiResponse } from "../utilitis/ApiResponse.js";
import { asyncHandler } from "../utilitis/asyncHandler.js";

export const healthCheck = asyncHandler(async(req,res,next)=>{
    return res.status(200).json(new ApiResponse(200,"OK",'HealthCheck Checked Successfully'))
});