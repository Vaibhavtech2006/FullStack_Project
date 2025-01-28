import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/Apiresponse";

// Define the ApiResponse type if not already defined
export interface ApiResponse {
    success: boolean;
    message: string;
}

export async function sendVerificationEmail(
    email: string, // The recipient's email
    username: string, // The recipient's username
    verifyCode: string // Verification code
): Promise<ApiResponse> {
    try {
        // Sending the email using Resend
        await resend.emails.send({
            from: process.env.EMAIL_FROM || "you@example.com", // Use environment variable for sender email
            to: email, // Recipient's email
            subject: "Mystry Message | Verification Code",
            react: VerificationEmail({ username, otp: verifyCode }), // React component for email body
        });

        return { success: true, message: "Verification email sent successfully" }; // Success response
    } catch (error) {
        console.error("Error sending verification email:", error); // Log the error
        return { success: false, message: "Failed to send verification email" }; // Error response
    }
}
