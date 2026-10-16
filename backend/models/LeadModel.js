 import mongoose from "mongoose";
import { type } from "os";

 const leadSchema=mongoose.Schema({
    name:{type:String},
    phone:{type:String},
    website:{type:String},
    address:{type:String},
    rating:{type:String},
    mapsUrl:{type:String},
    msgSend:{type:Boolean, default:false},
    reminder:{type:String, default:null},
    reminderSend:{type:Boolean, default:false},
    reminderUserId: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "users",
  default: null,
}],
 intrested:{type:Boolean, default:true },
 converted:{type:Boolean, default:false}

})

export const LeadModels=mongoose.model("lead",leadSchema)