import express from "express";
import {
  getAllKits,
  getKitBySlug,
  createKit,
  updateKit,
  deleteKit
} from "../controllers/kit.controller.js";

/* ADMIN MIDDLEWARE */
import { protectAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

/* =========================================================
   PUBLIC ROUTES (FRONTEND)
========================================================= */

/**
 * @route   GET /api/kits
 * @desc    Get all treatment kits
 * @access  Public
 */
router.get("/", getAllKits);

/**
 * @route   GET /api/kits/:slug
 * @desc    Get single kit by slug
 * @access  Public
 */
router.get("/:slug", getKitBySlug);

/* =========================================================
   ADMIN ROUTES (PROTECTED)
========================================================= */

/**
 * @route   POST /api/kits
 * @desc    Create new kit
 * @access  Admin
 */
router.post("/", protectAdmin, createKit);

/**
 * @route   PUT /api/kits/:id
 * @desc    Update kit
 * @access  Admin
 */
router.put("/:id", protectAdmin, updateKit);

/**
 * @route   DELETE /api/kits/:id
 * @desc    Delete kit
 * @access  Admin
 */
router.delete("/:id", protectAdmin, deleteKit);

export default router;
