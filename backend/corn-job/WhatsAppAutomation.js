
import { LeadModels } from "../models/LeadModel.js";

import {
  getWhatsApp,
  isWhatsAppReady,
} from "../config/whatsapp.js";

import {
  generateWhatsAppMessage,
} from "./AI.js";
import { UserModel } from "../models/UserModel.js";

// Prevent multiple processes running simultaneously
let isSending = false;

export const sendMessage = async () => {

  if (isSending) {
    console.log("Message sending already in progress");
    return;
  }

  // Check connection before doing anything
  if (!isWhatsAppReady()) {
    console.log("WhatsApp is not connected");
    return;
  }

  const whatsapp = getWhatsApp();

  if (!whatsapp?.user) {
    console.log("WhatsApp socket not available");
    return;
  }

  isSending = true;

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  try {
    
    const user=await UserModel.findOne({admin:true}).populate(
      {
        
        path:'leads',
 msgSend: false,
      intrested: true,
      converted: false,
      
      }
    )
    const leads=user.leads
    console.log(leads)


    
  

    console.log("Pending leads:", leads.length);

    if (leads.length === 0) {
      console.log("No pending leads found");
      return;
    }

    for (const lead of leads) {

      try {

        if (!isWhatsAppReady()) {
          console.log("WhatsApp disconnected. Stopping...");
          break;
        }

        // ==================================
        // VALIDATE PHONE
        // ==================================

        if (!lead.phone) {
          console.log("Phone missing:", lead.name);
          skipped++;
          continue;
        }

      
        let phone = String(lead.phone)
  .replace(/\D/g, "")     // Remove spaces, +, hyphens, etc.
  .replace(/^0+/, "");    // Remove all starting zeros

console.log(phone);

        // Add India country code if necessary
        if (phone.length === 10) {
          phone = `91${phone}`;
        }

        if (!/^91[6-9]\d{9}$/.test(phone)) {
          console.log("Invalid phone:", lead.phone);
          skipped++;
          continue;
        }

        // ==================================
        // CHECK WHATSAPP NUMBER
        // ==================================

        const jid = `${phone}@s.whatsapp.net`;

        console.log("Checking number:", jid);

        const registered = await whatsapp.onWhatsApp(jid);

        console.log("WhatsApp registration:", registered);

        if (!registered?.[0]?.exists) {
          console.log("Number not registered:", phone);
          skipped++;
          continue;
        }

        const recipientJid = registered[0].jid || jid;

        // ==================================
        // GENERATE AI MESSAGE
        // ==================================

        const message = await generateWhatsAppMessage({
          name: lead.name,
          type: "Business",
          location: lead.address || "",
          website: lead.website || "",
        });

        if (!message?.trim()) {
          console.log("Empty AI message:", lead.name);
          failed++;
          continue;
        }

        console.log("Generated message:", message);

        // ==================================
        // SEND MESSAGE
        // ==================================

        console.log("Sending to:", recipientJid);

        const result = await whatsapp.sendMessage(
          recipientJid,
          {
            text: message,
          }
        );

        console.log("Baileys response:", result);

        // ==================================
        // UPDATE DATABASE
        // ==================================

        if (result?.key?.id) {

          await LeadModels.findByIdAndUpdate(
            lead._id,
            {
              $set: {
                msgSend: true,
              },
            }
          );

          sent++;

          console.log("Message submitted:", lead.name);

        } else {

          failed++;

          console.log("Message submission failed:", lead.name);

        }

      } catch (error) {

        failed++;

        console.error(
          `Error sending to ${lead.name}:`,
          error.message
        );

      }
    }

    console.log("WhatsApp process completed");

    console.log({
      sent,
      failed,
      skipped,
    });

  } catch (error) {

    console.error("WhatsApp Automation Error:", error.message);

  } finally {

    isSending = false;

  }
};
