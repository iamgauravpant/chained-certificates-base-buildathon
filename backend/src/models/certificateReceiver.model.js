import mongoose, { Schema } from "mongoose";

const certificateReceiverSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email:{
        type:String,
        required:true
    },
    ethereumAddress: {
        type: String,
    },
    certificateIssuer:{
      type:mongoose.Schema.Types.ObjectId
    }
  },
  { timestamps: true }
);


export const CertificateReceiver = mongoose.model(
  "CertificateReceiver",
  certificateReceiverSchema
);
