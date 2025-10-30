// // sendMessage.js

// const twilio = require("twilio");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

// const client = twilio(accountSid, authToken);

// // /**
// //  * Sends a WhatsApp message via Twilio
// //  * @param {string} to - Recipient's WhatsApp number (format: whatsapp:+91xxxxxxxxxx)
// //  * @param {string} status - Either "accepted" or "rejected"
// //  */
// const sendMessage = async (to, status) => {
//   const messageBody = `Your request has been ${status}.`;

//   try {
//     const message = await client.messages.create({
//       from: fromWhatsAppNumber,
//       to: to,
//       body: messageBody,
//     });

//     return { success: true, sid: message.sid };
//   } catch (error) {
//     console.error("Failed to send WhatsApp message:", error.message);
//     return { success: false, error: error.message };
//   }
// };

// module.exports = { sendMessage };
