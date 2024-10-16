import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

// database ka operation hai , fail hosakta hai , time lagega , trycatch lagado
export const verifyJWT = asyncHandler(async (req,_,next)=>{
    try {
            const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","");
            if(!token) {
                throw new ApiError(401,"Unauthorized Request");
            }
            const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedToken?.id).select("-password -refreshToken -ethereumPrivateKey");
            if(!user) {
                throw new ApiError(401,"Invalid Access Token");
            }
            req.user = user;
            next();
    } catch (error) {
        throw new ApiError(401,"Invalid access token");
    }
})

export const verifyAdminJWT = asyncHandler(async (req,_,next)=>{
    try {
            const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","");
            if(!token) {
                throw new ApiError(401,"Unauthorized Request");
            }
            const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            const admin = await Admin.findById(decodedToken?.id).select("-password -refreshToken");
            if(!admin) {
                throw new ApiError(401,"Invalid Access Token");
            }
            req.user = admin;
            next();
    } catch (error) {
        throw new ApiError(401,"Invalid access token");
    }
})