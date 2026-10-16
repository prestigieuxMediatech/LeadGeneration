import  mongoose from "mongoose"
import { type } from "os"

const UserSchema=mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    admin:{
        type:Boolean,
        default:false
    },
    leads:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "lead",
      
    }],

    isLogged:{
        type:Boolean,
        default:false
    }

})

export const UserModel=mongoose.model("user",UserSchema)