import express from "express";
import {
  createOrder,
  verifyOrderPayment,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";

/* ADMIN MIDDLEWARE */
import { protectAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

/* =========================================================
   USER / FRONTEND ROUTES
========================================================= */

/**
 * @route   POST /api/orders
 * @desc    Create order (PARTIAL ₹150 OR FULL prepaid)
 * @access  Public
 */
router.post("/", createOrder);

/**
 * @route   POST /api/orders/verify-payment
 * @desc    Verify Razorpay payment for order
 * @access  Public
 */
router.post("/verify-payment", verifyOrderPayment);

/**
 * @route   GET /api/orders/user/:phone
 * @desc    Get orders by user phone
 * @access  Public
 */
router.get("/user/:phone", getUserOrders);

/* =========================================================
   ADMIN ROUTES (PROTECTED)
========================================================= */

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Admin
 */
router.get("/", protectAdmin, getAllOrders);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (SHIPPED / DELIVERED)
 * @access  Admin
 */
router.put("/:id/status", protectAdmin, updateOrderStatus);

export default router;
