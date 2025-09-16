// config/env.js
import { config } from "dotenv";
config();

export const {
  DB_URL,
  PORT,
  JWT_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME, // This matches your .env file
  SEND_EMAIL_FROM,
  RECOVERY_CODE_TWILIO,
  SENDER_EMAIL,
  BREVO_API_KEY,
} = process.env;

// Validation
const requiredEnvVars = {
  DB_URL,
  PORT,
  JWT_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
  SEND_EMAIL_FROM,
  RECOVERY_CODE_TWILIO,
  SENDER_EMAIL,
  BREVO_API_KEY,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});
