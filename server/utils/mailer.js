const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // Your email
    pass: process.env.MAIL_PASS, // App password (not your actual email password)
  },
});

async function sendOtpEmail(toEmail, otp) {
  const mailOptions = {
    from: `"OneLife Experience" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Your OTP for Login",
    html: `
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #222; font-size: 24px; margin-bottom: 10px;">OneLife Experience</h1>
        <p style="font-size: 14px; color: #777;">Embrace your holistic health</p>
      </div>
  
      <p style="font-size: 16px; line-height: 1.5;">
        Hi there,
      </p>
  
      <p style="font-size: 16px; line-height: 1.5;">
        Your One-Time Password (OTP) for logging in is:
      </p>
  
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 24px; background-color: #f3f3f3; border-radius: 6px; border: 1px dashed #ccc;">
          ${otp}
        </span>
      </div>
  
      <p style="font-size: 15px; line-height: 1.5; color: #555;">
        This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
      </p>
  
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
      <p style="font-size: 13px; color: #aaa; text-align: center;">
        If you didn’t request this, you can safely ignore this email.
      </p>
  
      <p style="font-size: 13px; color: #aaa; text-align: center;">
        © ${new Date().getFullYear()} OneLife Experience. All rights reserved.
      </p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending mail:", error);
    return false;
  }
}

async function sendEventStatusEmail(toEmail, status) {
  // Subject and message content based on the status (approved or rejected)
  const subject =
    status === "approved"
      ? "Your Event Request is Approved"
      : "Your Event Request is Rejected";

  const message =
    status === "approved"
      ? `
        <p style="font-size: 16px;">Congratulations! Your registration request has been <strong>APPROVED</strong>.</p>
        <p style="font-size: 16px;">You can now proceed with your registration and access the events.</p>
      `
      : `
        <p style="font-size: 16px;">We regret to inform you that your registration request has been <strong>REJECTED</strong>.</p>
        <p style="font-size: 16px;">If you believe this is an error, please contact support.</p>
      `;

  const mailOptions = {
    from: `"OneLife Experience" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: `
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #222; font-size: 24px; margin-bottom: 10px;">OneLife Experience</h1>
          <p style="font-size: 14px; color: #777;">Embrace your holistic health</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>

        ${message}

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} OneLife Experience. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending registration status email:", error);
    return false;
  }
}

async function sendResetPasswordEmail(toEmail, url) {
  const subject = "Reset Your Password - OneLife Experience";

  const message = `
    <p style="font-size: 16px;">We received a request to reset your password.</p>
    <p style="font-size: 16px;">Click the button below to reset it:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 16px;">Reset Password</a>
    </div>
    <p style="font-size: 16px;">If you didn’t request this, you can safely ignore this email.</p>
  `;

  const mailOptions = {
    from: `"OneLife Experience" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: `
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #222; font-size: 24px; margin-bottom: 10px;">OneLife Experience</h1>
          <p style="font-size: 14px; color: #777;">Embrace your holistic health</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>

        ${message}

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} OneLife Experience. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return false;
  }
}

async function sendTicketReplyEmail(toEmail, replyMessage) {
  const subject = "Your Ticket has been Updated - OneLife Experience Support";

  const mailOptions = {
    from: `"OneLife Experience Support" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: `
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #222; font-size: 24px; margin-bottom: 10px;">OneLife Experience Support</h1>
          <p style="font-size: 14px; color: #777;">We’ve replied to your ticket</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>

        <p style="font-size: 16px; line-height: 1.5;">Thank you for your patience! We have reviewed your ticket and are happy to provide the following update:</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-bottom: 20px;">
          <p style="font-size: 16px; line-height: 1.5; font-weight: bold;">Admin Reply:</p>
          <p style="font-size: 16px; line-height: 1.5;">${replyMessage}</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">If you have any further questions or need more assistance, feel free to reach out to us again. We're here to help!</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} OneLife Experience. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending ticket reply email:", error);
    return false;
  }
}

async function sendPaymentSuccessfulEmail(
  toEmail,
  event,
  orderId,
  paymentId,
  amount
) {
  // Subject and message content for the payment success
  const subject = "Payment Successful - Your Event Registration is Confirmed";

  const message = `
    <p style="font-size: 16px;">Thank you for your payment! We are excited to confirm your registration for the event:</p>
    <p style="font-size: 16px;"><strong>Event Title:</strong> ${event.title}</p>
    <p style="font-size: 16px;"><strong>Category:</strong> ${event.category}</p>
    <p style="font-size: 16px;"><strong>Price Paid:</strong> ₹${amount}</p>
    <p style="font-size: 16px;">Your payment has been successfully processed. Below are your payment and order details:</p>
    <p style="font-size: 16px;"><strong>Order ID:</strong> ${orderId}</p>
    <p style="font-size: 16px;"><strong>Payment ID:</strong> ${paymentId}</p>
    <p style="font-size: 16px;">You can now proceed to access the event details. We look forward to seeing you there!</p>
  `;

  const mailOptions = {
    from: `"OneLife Experience" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: `
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #222; font-size: 24px; margin-bottom: 10px;">OneLife Experience</h1>
          <p style="font-size: 14px; color: #777;">Embrace your holistic health</p>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>

        ${message}

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          If you didn’t make this payment, you can safely ignore this email.
        </p>

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} OneLife Experience. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending payment success email:", error);
    return false;
  }
}

async function sendWelcomeEmail(toEmail, whatsappLink_land) {
  const subject = "Welcome to BloomLand - Your Community Awaits!";

  const mailOptions = {
    from: `"BloomLand Community" <noreply@bloomland.com>`,
    to: toEmail,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to BloomLand</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        
        <!-- Email Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style=" padding: 40px 20px;">
          <tr>
            <td align="center">
              
              <!-- Main Content Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background: #ffffff; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden;">
                
                <!-- Header Section -->
                <tr>
                  <td style="background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Welcome to BloomLand!</h1>
                    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0; font-weight: 300;">Your journey to a thriving community starts here</p>
                  </td>
                </tr>
                
                <!-- Content Section -->
                <tr>
                  <td style="padding: 40px 30px;">
                    
                    <!-- Welcome Message -->
                    <div style="text-align: center; margin-bottom: 35px;">
                      <h2 style="color: #2c3e50; font-size: 24px; font-weight: 600; margin: 0 0 15px;">Hi there! 👋</h2>
                      <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0;">We're absolutely thrilled to have you as part of the BloomLand Community! Get ready to connect, grow, and bloom together.</p>
                    </div>
                    
                    <!-- WhatsApp Communities Section -->
                    <div style="background: linear-gradient(135deg, #f8f9ff 0%, #fff5f5 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                      <div style="text-align: center; margin-bottom: 25px;">
                        <h3 style="color: #2c3e50; font-size: 22px; font-weight: 600; margin: 0 0 10px;">Join Our WhatsApp Community</h3>
                        <p style="color: #7f8c8d; font-size: 14px; margin: 0;">Connect with fellow members and stay updated</p>
                      </div>
                      
                      <!-- Community Cards -->
                      <div style="margin-bottom: 20px;">
                        
                        <!-- BloomLand Community -->
                        <div style="background: #ffffff; border-radius: 10px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #27ae60; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                          <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 20px; margin-right: 10px;">🌱</span>
                            <h4 style="color: #2c3e50; font-size: 16px; font-weight: 600; margin: 0;">BloomLand Community</h4>
                          </div>
                          <p style="color: #7f8c8d; font-size: 14px; margin: 0 0 15px; line-height: 1.4;">For early updates related to exclusive events and bloomtreats join this</p>
                          <a href="${whatsappLink_land}" style="display: inline-block; background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: #ffffff; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-size: 14px; font-weight: 600; transition: transform 0.2s;">Join BloomLand →</a>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Closing Message -->
                    <div style="text-align: center; padding: 20px 0;">
                      <p style="color: #5a6c7d; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">We can't wait to see you flourish in our community! 🌟</p>
                      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 2px; width: 60px; margin: 0 auto; border-radius: 1px;"></div>
                    </div>
                    
                  </td>
                </tr>
                
                <!-- Footer Section -->
                <tr>
                  <td style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #6c757d; font-size: 13px; margin: 0 0 10px; line-height: 1.5;">
                      If you didn't sign up for this community, you can safely ignore this email.
                    </p>
                    <p style="color: #adb5bd; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} BloomLand. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
        
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}

module.exports = {
  sendOtpEmail,
  sendEventStatusEmail,
  sendResetPasswordEmail,
  sendTicketReplyEmail,
  sendPaymentSuccessfulEmail,
  sendWelcomeEmail,
};
