
import { OpenRouter } from "@openrouter/sdk";
import { config } from "dotenv";

config();

const openrouter = new OpenRouter({
  apiKey: process.env.openApi_key,
});

// ==========================================
// AGENCY INFORMATION
// ==========================================

const agency = {


  services: [
    "Software Development",
    "App Development",
    "Web Development",
    "Data Analytics",
    " Digital Marketing",
    "SEO",
   "Meta Ads ",
     "Google Ads",
    "Google My Business Optimization",
    "Social Media Management",
     "content creation",
      "Graphic designing",
  ],
};

// ==========================================
// EXPORTABLE FUNCTION
// ==========================================

export const generateWhatsAppMessage = async (business) => {
  try {
    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-super-120b-a12b:free",

        messages: [
          {
            role: "system",

            content: `
You are an expert B2B WhatsApp outreach message writer
working for a professional digital agency.

Your job is to write personalized WhatsApp messages
introducing our agency and ALL the services we provide
to local business owners.

AGENCY INFORMATION:

Agency Name: Prestigieux Media Tech Private Limited
Agency Website: https://prestigieux.in/

AGENCY SERVICES:

${agency.services.map((service) => `- ${service}`).join("\n")}

WHATSAPP MESSAGE WRITING RULES:

1. Write a natural, professional, human-sounding WhatsApp message.

2. Keep the message concise and easy to read.

3. Personalize the greeting using the actual business name.

4. Introduce our agency naturally.

5. Clearly communicate that we provide complete digital solutions.

6. Mention ALL 10 agency services.

7. Present the services in a clean, readable list.

8. Do not focus on only one service.

9. Do not invent business problems or opportunities.

10. Do not claim the business needs a specific service
unless that information has been provided.

11. Avoid exaggerated promises and guaranteed results.

12. Do not sound desperate, robotic, or overly promotional.

13. Use friendly but professional WhatsApp language.

14. Do not use emojis or hashtags.

15. Do not include an email subject line.

16. Avoid phrases such as:
- I hope this message finds you well
- Dear Sir/Madam
- We are the leading agency
- Guaranteed results
- Limited time offer

17. Include one simple call-to-action encouraging
the business owner to contact us.

18. Do not include placeholders such as:
[Your Name], [Business Name], or [Website].

19. Always include the agency website URL at the end.

20. Use this exact closing format:

For more details, visit our website:
https://prestigieux.in/

21. Do not invent, shorten, or modify the website URL.

22. Do not add any content after the website URL.

23. Return ONLY the final WhatsApp message.

24. Do not include explanations or alternative versions.

IMPORTANT:

The message should introduce our complete range of
digital services while still feeling like a personal
WhatsApp message rather than a generic advertisement
and also add why choose us 
.
            `,
          },

          {
            role: "user",

            content: `
Generate a professional WhatsApp outreach message
using the following information.

BUSINESS INFORMATION:

Business Name: ${business.name || "Business"}

Location: ${business.location || business.address || "Not specified"}

Website: ${business.website || "Not found"}


AGENCY INFORMATION:

Agency Name: Prestigieux Media Tech Private Limited
Agency Website: https://prestigieux.in/

OUR SERVICES:

${agency.services.map((service) => `- ${service}`).join("\n")}

MESSAGE GOAL:

Introduce our digital agency to the business owner.

Briefly explain that we help businesses establish
and improve their digital presence.

Mention every service we provide.

Present the services in a readable WhatsApp format.

Encourage the business owner to reply if they are
interested in discussing any of our services.

Include our agency website at the end.

Write the WhatsApp message now.
            `,
          },
        ],

        stream: true,
      },
    });

    // ==========================================
    // HANDLE STREAM RESPONSE
    // ==========================================

    let response = "";

    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content;

      if (content) {
        response += content;
      }
    }

    // ==========================================
    // FINAL MESSAGE
    // ==========================================

    let finalMessage = response.trim();

    if (!finalMessage) {
      throw new Error("AI returned an empty message");
    }

    

    return finalMessage;

  } catch (error) {
    console.error("WhatsApp AI Generation Error:", error.message);
    throw error;
  }
};
