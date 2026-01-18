import express from "express";

/* ===========================
   CONTROLLERS
=========================== */

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

/* MIDDLEWARE */
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===========================
   ROUTER HEALTH CHECK
=========================== */
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Admin routes working ✅"
  });
});

/* ===========================
   AUTH ROUTES (PUBLIC)
=========================== */
router.post("/login", adminLogin);

/* ===========================
   AUTH ROUTES (PROTECTED)
=========================== */
router.get("/profile", protectAdmin, adminProfile);
router.post("/logout", protectAdmin, adminLogout);

/* ===========================
   ADMIN DATA ROUTES (PROTECTED)
=========================== */
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
