import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// middlewares hain app.use() se samajh jaana

// generally configuration app banne ke baad hota hai ( line 5 pe app banri hai )
app.use(cors({
    origin:process.env.ENV==="dev"?process.env.FRONTEND_URL_DEV:process.env.FRONTEND_URL_PROD, // process.env.CORS_ORIGIN // chatgpt solution on 14th july
    credentials:true
}));

// allowing this application to handle json and limiting the json that can be sent by frontend to 16kb
app.use(express.json({
    limit:"16kb"
}))

// params mein data bhejna hai toh usko encode karna hai toh use this middleware
app.use(express.urlencoded({
    extended:true
}));

// kuch files aur folders jo ki server pe store hote hain aur yhin se serve kiye jaate hain
app.use(express.static("public"));

// cookie parser se user ke browser ki cookies access kar paun aur cookies set bhi kar paun , uski cookies pe CRUD operation perform kar paun
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.json({message:"Hello World"});
})

// routes import 
import userRouter from "./routes/user.routes.js";
import certificateIssuerRouter from "./routes/certificateIssuer.routes.js"
import certificateReceiverRouter from "./routes/certificateReceiver.routes.js"
import adminRouter from "./routes/admin.routes.js"


// routes declaration
app.use("/api/v2/users",userRouter); // /users se control userRouter pe chala gya
app.use("/api/v2/certificateIssuers",certificateIssuerRouter);
app.use("/api/v2/certificateReceivers",certificateReceiverRouter);
app.use("/api/v2/admins",adminRouter);

export {app};