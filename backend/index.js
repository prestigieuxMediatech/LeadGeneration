






import express from  'express'
import {config} from 'dotenv'
import cors from 'cors'
import { ConnectDB } from './config/mongoDB.js'

import corn from "node-cron"
import { mainRouter } from './routes/mainRoute.js'
import { connectWhatsApp } from './config/tp.js'
import startReminderCron from './corn-job/reminder.js'
import { sendMessage } from './corn-job/WhatsAppAutomation.js'
import { isWhatsAppReady } from './config/whatsapp.js'
import { UserModel } from './models/UserModel.js'
import { LeadModels } from './models/LeadModel.js'



const app=express()

config()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
// routes
app.use('/api', mainRouter)

ConnectDB()
sendMessage()

//Am formate 
//"24 4 * * *"

//Pm Formate
// "27 16 * * *" 

// corn.schedule("27 16 * * *",()=>{
//   try{
//     console.log("hii bolte ")
//  checkDueDate()
//   }
//   catch(e){
//     console.log(e.message)
//   }

// },)


 corn.schedule(
    "* * * * *",

    async () => {
      try {
        console.log("WhatsApp cron started...");
     
      



       // Check WhatsApp connection
        if (!isWhatsAppReady()) {
          console.log("WhatsApp is not connected. Skipping cron.");
          return;
        }

        // Send pending messages
        await sendMessage();

        console.log("WhatsApp cron completed");

      } catch (error) {
        console.error(
          "WhatsApp Cron Error:",
          error.message
        );
      }
    },

    {
      timezone: "Asia/Kolkata",
      noOverlap: true,
    }
  );




const startServer =
  async () => {

    try {

     
      startReminderCron()

      app.listen(
        3000,
        () => {

          console.log(
            ` http://localhost:${3000}`
          );

        }
      );


    } catch (error) {

      console.error(
        "❌ Server startup error:",
        error
      );


      process.exit(1);

    }

  };


startServer();
// creating the connection 

console.log(process.env.MONGO_URL)
app.get('/',(req,res)=>{
    res.json('landing page is here ')
})


