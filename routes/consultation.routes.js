import express from "express";
import {
  createConsultation,
  verifyConsultationPayment,
  getConsultationsByPhone,
  getAllConsultations,
  updateConsultationStatus
} from "../controllers/consultation.controller.js";

/* ADMIN MIDDLEWARE */
import { protectAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

/* =========================================================
   USER / FRONTEND ROUTES
========================================================= */

/**
 * @route   POST /api/consultation
 * @desc    Create consultation (Audio ₹300 / Video ₹500) – FULL PREPAID
 * @access  Public
 */
router.post("/", createConsultation);

/**
 * @route   POST /api/consultation/verify-payment
 * @desc    Verify Razorpay payment for consultation
 * @access  Public
 */
router.post("/verify-payment", verifyConsultationPayment);

/**
 * @route   GET /api/consultation/user/:phone
 * @desc    Get consultations by user phone
 * @access  Public
 */
router.get("/user/:phone", getConsultationsByPhone);

/* =========================================================
   ADMIN ROUTES (PROTECTED)
========================================================= */

/**
 * @route   GET /api/consultation
 * @desc    Get all consultations
 * @access  Admin
 */
router.get("/", protectAdmin, getAllConsultations);

/**
 * @route   PUT /api/consultation/:id/status
 * @desc    Update consultation status
 *          (SCHEDULED / COMPLETED / CANCELLED)
 * @access  Admin
 */
router.put("/:id/status", protectAdmin, updateConsultationStatus);

export default router;
