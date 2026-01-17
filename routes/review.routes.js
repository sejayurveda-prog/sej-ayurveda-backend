import express from "express";
import {
  submitReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  deleteReview
} from "../controllers/review.controller.js";

/* ADMIN MIDDLEWARE */
import { protectAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

/* =========================================================
   USER / FRONTEND ROUTES
========================================================= */

/**
 * @route   POST /api/reviews
 * @desc    Submit a review
 * @access  Public
 */
router.post("/", submitReview);

/**
 * @route   GET /api/reviews
 * @desc    Get approved reviews (for website)
 * @access  Public
 */
router.get("/", getApprovedReviews);

/* =========================================================
   ADMIN ROUTES (PROTECTED)
========================================================= */

/**
 * @route   GET /api/reviews/all
 * @desc    Get all reviews (approved + pending)
 * @access  Admin
 */
router.get("/all", protectAdmin, getAllReviews);

/**
 * @route   PUT /api/reviews/:id/approve
 * @desc    Approve or reject a review
 * @access  Admin
 */
router.put("/:id/approve", protectAdmin, approveReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Admin
 */
router.delete("/:id", protectAdmin, deleteReview);

export default router;
