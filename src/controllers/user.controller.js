import {User} from '../models/user.model.js'
import { ApiError } from '../utilitis/ApiError.js';
import { ApiResponse } from '../utilitis/ApiResponse.js';
import { asyncHandler } from '../utilitis/asyncHandler.js'
import bcrypt from 'bcrypt'

export const signUp = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body;
    
    if([username,email,password].some(t => t?.trim() === ''))
    {
        throw new ApiError(400,'Empty request');
    }
    
    const existingUser = await User.findOne({email});
    if(existingUser)
    {
        throw new ApiError(403,'User already exists');
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password,10);
        console.log('Password hashed successfully')
    } catch (error) {
        throw new ApiError(500,'Error in encrypting password')
    }
     

    try {
        const user =  await User.create({username,password:hashedPassword,email});
        console.log(user);
        return res.status(201).json(new ApiResponse(200,user,'User signed up successfully'));
    } catch (error) {
        throw new ApiError(403,'User creation unsuccessful')
    }
})

export const login = asyncHandler(async(req,res,next)=>
{
    const {email,password} = req.body;
    if(!email||!password)
    {
        throw new ApiError(400,'Fields are empty')
    }

    const user = await User.findOne({email});
    if(!user)
    {
        throw new ApiError(403,'User not signedUp');
    }

    let isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid)
    {
        throw new ApiError(401,'Password incorrect')
    }


    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    if(!accessToken||!refreshToken)
    {
        throw new ApiError(404,'Tokens not generated')
    }

    user.refreshToken = refreshToken;
    user.save();

    const options = 
    {
        httpOnly:true,
    }

    try {
        const loggedInUser = await User.findById(user?._id);
        if(!loggedInUser)
        {
            throw new ApiError(500,'Cannot login right now')
        }
        return res.cookie('accessToken',accessToken,options).cookie('refreshToken',refreshToken,options).status(200).json(new ApiResponse(200,user,'Logged in successfully'));

    } catch (error) {
        throw new ApiError(500,'Something went wrong kindly try again later')
    }
})

export const refershAccessToken = asyncHandler(async(req,res)=>{
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken || req.header('Authorization').replace('Bearer ','')

    if(!refreshToken)
    {
        throw new ApiError(500,'Refresh Token Missing');
    }

    const user = await User.findOne({refreshToken}).select('-password');
    if(!user)
    {
        throw new ApiError(403,'Invalid Refresh Token');
    }

    const accessToken = await user.generateAccessToken()
    const newRefreshToken = await user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    const options = {httpOnly:true}
    return res.status(200).cookie('accessToken',accessToken,options).cookie('refreshToken',refreshToken,options).json(new ApiResponse(200,{accessToken,refreshToken,user},'Tokens Refreshed Successfully'));
})

export const logOut = asyncHandler(async(req,res,next)=>
{
    const user = await User.findByIdAndUpdate(req.user?._id,{$unset:{refreshToken : 1}},{new:true});
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json(new ApiResponse(200,user,'LoggedOut Successfully'));
})

