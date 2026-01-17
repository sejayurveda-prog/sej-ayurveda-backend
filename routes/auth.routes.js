import express from "express";
import {
  adminLogin,
  adminProfile,
  adminLogout
} from "../controllers/auth.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =========================================================
   ADMIN AUTH ROUTES
========================================================= */

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post("/login", adminLogin);

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in admin profile
 * @access  Protected
 */
router.get("/profile", protectAdmin, adminProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Admin logout
 * @access  Protected
 */
router.post("/logout", protectAdmin, adminLogout);

export default router;
