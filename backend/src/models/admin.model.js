import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
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
adminSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

// methods banane ka tareeka thoda cezual hai , iske baare mein aur padho !
adminSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}

// access token aur refresh tokens generate karne ka tareeka same hi hai , strange but true
adminSchema.methods.generateAccessToken = function() {
    return jwt.sign(
                {
                    id : this._id,
                    email : this.email,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
                }
            )
}

adminSchema.methods.generateRefreshToken = function() {
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

export const Admin = mongoose.model("Admin",adminSchema);