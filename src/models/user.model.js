import {Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const userScehma = new Schema
(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        refreshToken:{
            type:String,
        }
    },{timestamps:true}
)

userScehma.methods.isPasswordCorrect = async function(password) {
        
        console.log('hellno')
        return await bcrypt.compare(password,this.password);
    } 

userScehma.methods.generateAccessToken = function()
{
    const options = 
    {
        _id:this._id,
        username:this.username,
        email:this.email,
    }
    return jwt.sign(options,process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
     })
}

userScehma.methods.generateRefreshToken = function()
{
    const options = 
    {
        _id:this._id,
    }
    return jwt.sign(options,process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
     })
}


const User = mongoose.model('User',userScehma);
export {User};