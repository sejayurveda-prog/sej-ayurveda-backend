import jwt from "jsonwebtoken";
import ENV from "../config/env.js";

/* ===============================
   ADMIN CREDENTIALS
================================ */
const ADMIN_EMAIL = ENV.ADMIN_EMAIL;
const ADMIN_PASSWORD = ENV.ADMIN_PASSWORD;

/* ===============================
   GENERATE TOKEN
================================ */
const generateToken = () => {
  return jwt.sign(
    { role: "admin" },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN }
  );
};

/* ===============================
   ADMIN LOGIN
================================ */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }

    const token = generateToken();

    return res.json({
      success: true,
      message: "Admin login successful",
      data: {
        token
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin login failed"
    });
  }
};

/* ===============================
   ADMIN PROFILE
================================ */
export const adminProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      email: ADMIN_EMAIL,
      role: "admin"
    }
  });
};

/* ===============================
   ADMIN LOGOUT
================================ */
export const adminLogout = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
};
