import mongoose , {Schema} from "mongoose";

const tokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
    },
    otp:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        required:true,
        default: Date.now,
        expires: 600
    },
});

export const Token = mongoose.model("Token",tokenSchema);