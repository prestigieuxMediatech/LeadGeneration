import nodemailer from 'nodemailer'
import { config } from 'dotenv';
config()

export const trans= nodemailer.createTransport({      
    host: "smtp.gmail.com",
    service:"gmail",
    auth: {
      type: "login", // default
      user: process.env.email, 
      pass: process.env.email_password
    }
  });