
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



import {config} from 'dotenv'

import { trans } from '../config/mailConfig.js'
import { UserModel } from '../models/UserModel.js'

config()

const createToken=(id,role)=>{
    return jwt.sign({id},process.env.JWT_SECRATE)
}


export const Registor=async(req,res)=>{
try{
 const {name,email,password}=req.body
 
 const user= await UserModel.findOne({email})
 if(user)return res.json({success:false, error:"user already exist"})

  const Newuser= await  UserModel.create({
    name,
    email,
    password
  })
  
console.log(Newuser)
const token =createToken(Newuser._id, Newuser.admin)
console.log(token)
return res.json({success:true, token})


}
catch(e){
    res.json({success:false,error:e.message})
    console.log(e.message)
}
}

//Login

export const Login=async(req,res)=>{
    try{
       const {email,password}=req.body
       console.log(password)
        const user=await UserModel.findOne({email})
        if(!user)return res.json({success:false,error:'user not found'})

        else{
            const isMatch=user.password === password
            if(isMatch){
                user.isLogged=true
                await user.save()
                const token=createToken(user._id,user.admin)
                console.log(token)
               return res.json({success:true,token, role:user.admin})
            }
            else{
                res.json({success:false,error:'wrong password'})
            }
        }

        

    }
    catch(e){
        return res.json({success:true, error:e.message})
    }
} 

export const logout=async(req,res)=>{
    try{
    console.log(req.userId.id)
    const user=await UserModel.findOne({_id:req.userId.id})
     user.isLogged=false
    await user.save();
    res.json({success:true, data:"logged"})
    }
    catch(e){
        console.log(e.message)
    }
}