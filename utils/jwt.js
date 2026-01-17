import jwt from "jsonwebtoken";
import ENV from "../config/env.js";

/* =========================================================
   JWT UTILITIES – SEJ AYURVEDA
========================================================= */

/**
 * Generate JWT token
 * @param {Object} payload - data to store in token
 * @param {String} expiresIn - optional override
 * @returns {String} token
 */
export function generateToken(payload, expiresIn = ENV.JWT_EXPIRES_IN) {
  try {
    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn
    });
  } catch (error) {
    console.error("❌ JWT Generate Error:", error.message);
    throw new Error("Failed to generate token");
  }
}

/**
 * Verify JWT token
 * @param {String} token
 * @returns {Object|null} decoded payload
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (error) {
    console.error("❌ JWT Verify Error:", error.message);
    return null;
  }
}
