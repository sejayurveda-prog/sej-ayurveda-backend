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
  markConsultationScheduled,
  testMail
} from "../controllers/admin.controller.js";

/* MIDDLEWARE */
import { protectAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* HEALTH */
router.get("/health", (req, res) => {
  res.json({ success: true });
});

/* AUTH */
router.post("/login", adminLogin);
router.get("/profile", protectAdmin, adminProfile);
router.post("/logout", protectAdmin, adminLogout);

/* DATA */
router.get("/dashboard", protectAdmin, getDashboardStats);
router.get("/orders/recent", protectAdmin, getRecentOrders);
router.get("/consultations/recent", protectAdmin, getRecentConsultations);
router.get("/reviews/pending", protectAdmin, getPendingReviews);

router.put(
  "/consultations/:id/schedule",
  protectAdmin,
  markConsultationScheduled
);

/* ✅ TEST MAIL (TEMP) */
router.get("/test-mail", protectAdmin, testMail);

export default router;
