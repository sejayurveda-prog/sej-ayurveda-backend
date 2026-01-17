import dotenv from "dotenv";

/*
  Load environment variables
  Single source of truth for config
*/
dotenv.config();

/* ===============================
   ENV CONFIG OBJECT
================================ */
const ENV = {
  /* ===============================
     APP
  ================================ */
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  /* ===============================
     FRONTEND
  ================================ */
  FRONTEND_URL: process.env.FRONTEND_URL || "*",

  /* ===============================
     GOOGLE SHEET (DATABASE)
  ================================ */
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID || "",
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL || "",
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : "",
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || "",

  /* ===============================
     AUTH / ADMIN
  ================================ */
  JWT_SECRET: process.env.JWT_SECRET || "sej_super_secret_key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  /* ===============================
     PAYMENT (RAZORPAY)
  ================================ */
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",

  /* ===============================
     BUSINESS RULES (LOCKED)
  ================================ */
  CONSULTATION_PRICES: {
    audio: 300,
    video: 500
  },

  ORDER_ADVANCE_AMOUNT: 150
};

export default ENV;
