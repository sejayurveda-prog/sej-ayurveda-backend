import express from "express";

/* AUTH CONTROLLER */
import {
  adminLogin,
  adminProfile,
  adminLogout
} from "../controllers/admin.auth.controller.js";

/* ADMIN DATA CONTROLLER */
import {
  getDashboardStats,
  getRecentOrders,
  getRecentConsultations,
  getPendingReviews,
  markConsultationScheduled
} from "../controllers/admin.controller.js";

import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===========================
   AUTH ROUTES (PUBLIC)
=========================== */
router.post("/login", adminLogin);

/* ===========================
   PROTECTED ROUTES
=========================== */
router.get("/profile", protectAdmin, adminProfile);
router.post("/logout", protectAdmin, adminLogout);

router.get("/dashboard", protectAdmin, getDashboardStats);
router.get("/orders/recent", protectAdmin, getRecentOrders);
router.get("/consultations/recent", protectAdmin, getRecentConsultations);
router.get("/reviews/pending", protectAdmin, getPendingReviews);

router.put(
  "/consultations/:id/schedule",
  protectAdmin,
  markConsultationScheduled
);

export default router;
