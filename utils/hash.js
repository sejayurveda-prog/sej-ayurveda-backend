import crypto from "crypto";

/* =========================================================
   HASH UTILITIES – SEJ AYURVEDA
========================================================= */

/**
 * Hash plain text (password / secret)
 * @param {string} text
 * @returns {string} hashed value
 */
export function hashText(text) {
  try {
    return crypto
      .createHash("sha256")
      .update(text)
      .digest("hex");
  } catch (error) {
    console.error("❌ Hash Error:", error.message);
    throw new Error("Failed to hash text");
  }
}

/**
 * Compare plain text with hashed value
 * @param {string} plainText
 * @param {string} hashedText
 * @returns {boolean}
 */
export function compareHash(plainText, hashedText) {
  try {
    const newHash = hashText(plainText);
    return newHash === hashedText;
  } catch (error) {
    console.error("❌ Compare Hash Error:", error.message);
    return false;
  }
}
