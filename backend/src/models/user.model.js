import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ethers } from 'ethers';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // searchable optimized tarike se karne ke liye index true set kara , soch samajh ke ye use karna warna band bajegi
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    ethereumAddress: {
        type: String,
        // trim: true
    },
    ethereumPrivateKey: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    country:{
        type: String
    },
    avatar: {
        type: String, // cloudinary url
    },
    otp:{
        type:Number
    },
    otpExpiryTime:{
        type:Number
    },
    password: {
        type: String, // encrypt karke store karna
        required:[true,"Password is required"]
    },
    refreshToken: {
        type: String
    }

},{timestamps:true});

// password encrypt karne ke liye jab register ho ya more accurately jab bhi password modify ho
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

// methods banane ka tareeka thoda cezual hai , iske baare mein aur padho !
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}

// access token aur refresh tokens generate karne ka tareeka same hi hai , strange but true
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
                {
                    id : this._id,
                    email : this.email,
                    username : this.username,
                    fullname : this.fullname
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
                }
            )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.createEthereumWallet = function() {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
}

export const User = mongoose.model("User",userSchema);