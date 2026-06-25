import { resend, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";
import dotenv from "dotenv";

dotenv.config();
export const sendWelcomeEmail = async (email, clientUrl) => {
        const name = email.split("@")[0];
    const {data, error}= await resend.emails.send({
            from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Tuliza",
                html: createWelcomeEmailTemplate(name, clientUrl),
    });

    if (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }
    console.log("Welcome email sent successfully:", data);
}