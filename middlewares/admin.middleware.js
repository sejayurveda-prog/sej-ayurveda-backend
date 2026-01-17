import express from "express";
import {
  getDashboardStats,
  getRecentOrders,
  getRecentConsultations,
  getPendingReviews,
  markConsultationScheduled
} from "../controllers/admin.controller.js";

import { protectAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

/* =========================================================
   ADMIN DASHBOARD ROUTES (PROTECTED)
========================================================= */

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
