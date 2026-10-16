import express from "express"
import { GenerateLead, getLeads, notIntrested, SaveLead, setReminder } from "../controller/leadController.js"
import {  getWhatsAppQRController, getWhatsAppStatusController,  logoutWhatsAppController, reconnectWhatsAppController } from "../controller/whatsappController.js"
import {  Login,  logout,  Registor } from "../controller/UserController.js"
import { AuthUser } from "../middleware/Auth.js"

export const  mainRouter=express.Router()

// All user router 
mainRouter.post("/register",Registor)
mainRouter.post("/login",Login)


// -----------------  All Leads Router ------------------
mainRouter.get("/getlead",GenerateLead)
mainRouter.post("/save-lead",AuthUser,SaveLead)

mainRouter.get("/all-lead",AuthUser,getLeads)
mainRouter.post("/set-reminder",AuthUser,setReminder)

mainRouter.post("/not-intrested",AuthUser,notIntrested)
mainRouter.post("/logout",AuthUser,logout)





///  whatsApp router
// get qr code 
mainRouter.get('/getqr',getWhatsAppQRController)

// logout WhatsApp
mainRouter.get('/logout',logoutWhatsAppController)

// get whatsApp Status 
mainRouter.get("/getstatus",getWhatsAppStatusController)

//  reconnect the whatsApp

mainRouter.get("/reconnect",reconnectWhatsAppController)