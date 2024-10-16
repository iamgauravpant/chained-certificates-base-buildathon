import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is listening on port : ${process.env.PORT}`)
    }).on("error",(error)=>{
        console.log(`Server error :`,error);
        throw error;
    })
}).catch((error)=>{
    console.log("MongoDB connection error :",error);
});