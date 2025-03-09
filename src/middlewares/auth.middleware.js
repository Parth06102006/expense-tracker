// import {User} from '../models/user.model.js'
import {asyncHandler} from '../utilitis/asyncHandler.js'
import {ApiError} from '../utilitis/ApiError.js'
import jwt from 'jsonwebtoken'

export const authVerify = asyncHandler(async(req,res,next)=>{
    const accessToken = req.body.accessToken || req.cookies.accessToken || req.headers('Authorization').replace('Bearer ','');
    if(!accessToken)
    {
        return ApiError(400,'There is no access Token');
    }
    try {
        const user = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        if(!user)
        {
            return ApiError(403,'User not found');
        }

        req.user = user;
        console.log(req.user);
        next();
    } catch (error) {
        throw new ApiError(500,'Error fetching the details of the user')
    }
})