"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
// Typ för e-postdata
type EmailData = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};
// Funktion för att skicka e-post
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: EmailData): Promise<void> {
  console.log("[Mail] Attempting to send email:", { to, subject });
  console.log("[Mail] Using transport config:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    secure: Number(process.env.SMTP_PORT) === 465,
  });
  // Skicka e-post
  try {
    const info = await transporter.sendMail({
      from: `"Dagens Dos" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html ?? text,
    });
    // Logga resultat
    console.log("[Mail] Email sent successfully!");
    console.log("[Mail] Message ID:", info.messageId);
    console.log("[Mail] Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("[Mail] Failed to send email:", err);
    throw err;
  }
}
