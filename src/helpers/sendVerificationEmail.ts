import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import React from 'react';
import ReactDOMServer from 'react-dom/server';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    // Validate environment variable
    if (!process.env.EMAIL_FROM) {
        console.error("EMAIL_FROM environment variable is not set");
        return { success: false, message: "Sender email is not configured", isAcceptingMessages: false };
    }

    // Validate recipient email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return { success: false, message: "Invalid recipient email address", isAcceptingMessages: false };
    }

    try {
        // Render the email content to HTML
        const emailContent = ReactDOMServer.renderToStaticMarkup(
            <VerificationEmail
                username={username}
                otp={verifyCode}
                verificationUrl={`https://yourdomain.com/verify?code=${verifyCode}`}
                isVerified={false}
            />
        );

        // Send the email using Resend
        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Mystry Message | Verification Code",
            html: emailContent,
        });

        console.log("Email sent successfully:", data);
        return { success: true, message: "Verification email sent successfully", isAcceptingMessages: true };
    } catch (error) {
        console.error("Error sending verification email:", error);
        if (error instanceof Error) {
            return { success: false, message: error.message, isAcceptingMessages: false };
        }
        return { success: false, message: "An unknown error occurred", isAcceptingMessages: false };
    }
}