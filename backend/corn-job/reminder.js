
import cron from "node-cron";
import "dotenv/config";

import { trans } from "../config/mailConfig.js";
import { LeadModels } from "../models/LeadModel.js";
import { UserModel } from "../models/UserModel.js";


const startReminderCron = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const currentTime = new Date();

      const leads = await LeadModels.find({
        reminderSend: false,
        reminder: {
          $ne: null,
          $lte: currentTime,
        },
        reminderUserId: {
          $ne: null,
        },
      });

      for (const lead of leads) {
        try {
          // Additional date check
           if (lead.reminder && new Date(lead.reminder).getTime() <= Date.now()) {

            const user = await UserModel.findById(
              lead.reminderUserId
            );

            if (!user || !user.email) continue;

            const reminderDate = lead.reminder.toLocaleString(
              "en-IN",
              { timeZone: "Asia/Kolkata" }
            );

            // Send reminder
            await trans.sendMail({
              from: `"Prestigieux LeadGeneration" <${process.env.email}>`,
              to: user.email,

              subject: `Lead Follow-up Reminder - ${lead.name || "Business"}`,

              text: `
Your scheduled reminder is due.

Business Name: ${lead.name || "N/A"}
Phone: ${lead.phone || "N/A"}
Address: ${lead.address || "N/A"}
Reminder Date: ${reminderDate}
              `,
            });

            // Clear reminder after sending
            await LeadModels.updateOne(
              {
                _id: lead._id,
                reminder: lead.reminder,
                reminderSend: false,
              },
              {
                $set: {
                  reminder: null,
                  reminderSend: true,
                },
              }
            );

            console.log(`Reminder sent: ${lead.name}`);
          }
        } catch (error) {
          console.error("Email error:", error.message);
        }
      }
    } catch (error) {
      console.error("Cron error:", error.message);
    }
  });
};

export default startReminderCron;


