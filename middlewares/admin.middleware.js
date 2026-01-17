import express from "express";
import {
  getDashboardStats,
  getRecentOrders,
  getRecentConsultations,
  getPendingReviews,
  markConsultationScheduled
} from "../controllers/admin.controller.js";

import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =========================================================
   ADMIN DASHBOARD ROUTES (PROTECTED)
========================================================= */

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Admin
 */
router.get("/dashboard", protectAdmin, getDashboardStats);

/**
 * @route   GET /api/admin/orders/recent
 * @desc    Get recent orders
 * @access  Admin
 */
router.get("/orders/recent", protectAdmin, getRecentOrders);

/**
 * @route   GET /api/admin/consultations/recent
 * @desc    Get recent consultations
 * @access  Admin
 */
router.get("/consultations/recent", protectAdmin, getRecentConsultations);

/**
 * @route   GET /api/admin/reviews/pending
 * @desc    Get pending reviews
 * @access  Admin
 */
router.get("/reviews/pending", protectAdmin, getPendingReviews);

/**
 * @route   PUT /api/admin/consultations/:id/schedule
 * @desc    Schedule consultation (date & time)
 * @access  Admin
 */
router.put(
  "/consultations/:id/schedule",
  protectAdmin,
  markConsultationScheduled
);

export default router;
