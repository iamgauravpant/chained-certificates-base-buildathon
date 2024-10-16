import { ApiError } from "./ApiError.js";

import nodemailer from "nodemailer";
import * as crypto from 'crypto';

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  secure:true,
  host: "smtp.gmail.com",
  port:465,
  service: "gmail", // You can use any service like Gmail, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USERNAME, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

export const sendForgotPasswordOTP = async (userEmail) => {
  try {
    // Generate OTP (you can choose any logic to generate this)
    const otp = crypto.randomInt(100000, 999999); // 6-digit OTP

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Sender address
      to: userEmail, // List of recipients
      subject: "Your OTP for Password Reset", // Subject line
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`, // Plain text body
    };

    // Send OTP email using transporter
    const info = await transporter.sendMail(mailOptions);

    console.log("OTP sent: %s", info.response);

    // Return OTP only on successful email send
    return otp;
  } catch (error) {
    // console.error("Error sending OTP email: ", error);
    throw new ApiError(500,null, "Error sending OTP email. Please try again.");
  }
};

export const sendResetPasswordLink = async (userEmail,link) => {
  // Send OTP to user's email
  const mailOptions = {
    from: process.env.EMAIL_USERNAME, // Sender address
    to: userEmail, // List of recipients
    subject: "Your Password Reset Link", // Subject line
    text: `Your password reset link is ${link} . It is valid for 10 minutes.`, // Plain text body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
      throw new ApiError(500, "Error sending email. Please try again.");
    }
    console.log("info :",info)
    console.log("error here :",error)
    console.log("Password reset link sent: %s", info.response);
  });
  
};

export const notifyCertificateReceiver = async (userEmail,content) => {

  try {
    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME, // Sender address
      to: userEmail, // List of recipients
      subject: "Yay! Someone just issued you a certificate!", // Subject line
      html: content, // html body
    };

    // Send OTP email using transporter
    const info = await transporter.sendMail(mailOptions);

    console.log("response %s", info.response);

  } catch (error) {
    // console.error("Error sending OTP email: ", error);
    throw new ApiError(500,null, "Error sending email. Please try again.");
  }
};