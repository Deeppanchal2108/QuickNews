import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@') || !email.includes('.')) {
            return NextResponse.json(
                { message: "Valid email is required" },
                { status: 400 }
            );
        }

        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "deepanchal2290@gmail.com", // Your email
                pass: process.env.PASS_KEY, // App password from your provided code
            },
        });

        // Email content
        const mailOptions = {
            from: "QuickNews <deepanchal2290@gmail.com>",
            to: email,
            subject: "Welcome to QuickNews - Stay Updated with Short News",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #c42b2b; padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to QuickNews!</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">Your source for concise, relevant news updates</p>
          </div>
          
          <div style="padding: 30px 20px; background-color: #f9f9f9;">
            <p style="font-size: 16px; line-height: 1.5;">Hello there,</p>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for subscribing to QuickNews! We're excited to have you join our community of informed readers.</p>
            <p style="font-size: 16px; line-height: 1.5;">With QuickNews, you'll receive:</p>
            <ul style="font-size: 16px; line-height: 1.5;">
              <li>Daily news summaries delivered straight to your inbox</li>
              <li>Breaking news alerts on important events</li>
              <li>Concise articles that respect your time</li>
              <li>Balanced reporting across various topics</li>
            </ul>
            
           
          </div>
          
          <div style="padding: 20px; background-color: #eeeeee; text-align: center; font-size: 14px; color: #666;">
           
         
            <p>© 2025 QuickNews. All rights reserved.</p>
           
          </div>
        </div>
      `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: "Subscription successful! Check your email." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json(
            { message: "Failed to send email. Please try again." },
            { status: 500 }
        );
    }
}