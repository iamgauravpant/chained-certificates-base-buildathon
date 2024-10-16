import { v2 as cloudinary} from "cloudinary";
import fs from "fs"; // inbuilt in nodejs , read , write , remove a file syncronously or asyncronously using fs in Node.js

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null; // agar file path hi nahi hai toh kya upload karun ? null return karun !
        // uploading file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
        // file has been uploaded on cloudinary successfully
        console.log("File is uploaded on cloudinary :",response.url);
        fs.unlinkSync(localFilePath); // synchronously server se file remove kardo ! 
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary};