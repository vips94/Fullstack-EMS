/**
 * Email Configuration Module using Nodemailer
 * nodemailer.createTransport() - Creates SMTP transporter for sending emails
 * Uses Brevo (formerly Sendinblue) as SMTP service provider
 */

import { createTransport } from "nodemailer"; // Email library for Node.js

/**
 * transporter - SMTP configuration object for sending emails
 * createTransport() parameters:
 * - host: SMTP server address (Brevo relay service)
 * - port: SMTP port (587 = TLS encryption)
 * - auth: credentials for SMTP authentication
 */
const transporter = createTransport({
  host: "smtp-relay.brevo.com", // Brevo SMTP relay server
  port: 587, // Standard SMTP port with TLS encryption
  auth: {
    user: process.env.SMTP_USER, // SMTP username from environment
    pass: process.env.SMTP_PASS, // SMTP password from environment
  },
});

/**
 * sendEmail - Sends email using configured transporter
 * Parameters:
 * - to: recipient email address
 * - subject: email subject line
 * - body: HTML email content
 * 
 * transporter.sendMail() - Sends email with provided configuration
 * Returns promise with response containing messageId and other metadata
 */
const sendEmail = async ({ to, subject, body }) => {
  // sendMail() sends email and returns response promise
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL, // Sender email address
    to, // Recipient email
    subject, // Email subject
    html: body, // HTML formatted email body
  });

  return response;
};

export default sendEmail;
