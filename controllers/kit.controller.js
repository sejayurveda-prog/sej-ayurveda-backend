import { v4 as uuidv4 } from "uuid";
import {
  getAllRows,
  addRow,
  updateRowById,
  deleteRowById
} from "../services/google-sheet.service.js";

/* =========================================================
   SHEET CONFIG
========================================================= */
const SHEET_NAME = "Kits";

/* =========================================================
   GET ALL KITS (PUBLIC)
========================================================= */
export const getAllKits = async (req, res) => {
  try {
    const kits = await getAllRows(SHEET_NAME);

    res.json({
      success: true,
      data: kits
    });
  } catch (error) {
    console.error("Get kits error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch kits"
    });
  }
};

/* =========================================================
   GET SINGLE KIT BY SLUG (PUBLIC)
========================================================= */
export const getKitBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const kits = await getAllRows(SHEET_NAME);
    const kit = kits.find(k => k.slug === slug);

    if (!kit) {
      return res.status(404).json({
        success: false,
        message: "Kit not found"
      });
    }

    res.json({
      success: true,
      data: kit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch kit"
    });
  }
};

/* =========================================================
   CREATE KIT (ADMIN)
========================================================= */
export const createKit = async (req, res) => {
  try {
    const { name, slug, price, description } = req.body;

    if (!name || !slug || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const newKit = {
      id: uuidv4(),
      name,
      slug,
      price,
      description: description || "",
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    await addRow(SHEET_NAME, newKit);

    res.json({
      success: true,
      message: "Kit created successfully",
      data: newKit
    });
  } catch (error) {
    console.error("Create kit error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create kit"
    });
  }
};

/* =========================================================
   UPDATE KIT (ADMIN)
========================================================= */
export const updateKit = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await updateRowById(SHEET_NAME, id, updateData);

    res.json({
      success: true,
      message: "Kit updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update kit"
    });
  }
};

/* =========================================================
   DELETE KIT (ADMIN)
========================================================= */
export const deleteKit = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteRowById(SHEET_NAME, id);

    res.json({
      success: true,
      message: "Kit deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete kit"
    });
  }
};
