import { v4 as uuidv4 } from "uuid";
import {
  getAllRows,
  addRow,
  updateRowById,
  deleteRowById
} from "../services/google-sheet.service.js";

/* =========================================================
   GOOGLE SHEET CONFIG
========================================================= */
const SHEET_NAME = "Reviews";

/* =========================================================
   SUBMIT REVIEW (PUBLIC)
========================================================= */
export const submitReview = async (req, res) => {
  try {
    const { name, phone, rating, review } = req.body;

    if (!name || !phone || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const reviewRow = {
      id: uuidv4(),
      Name: name,
      Phone: phone,
      Rating: rating,
      Review: review,
      Approved: "NO",
      CreatedAt: new Date().toISOString()
    };

    await addRow(SHEET_NAME, reviewRow);

    res.json({
      success: true,
      message: "Review submitted successfully"
    });

  } catch (error) {
    console.error("Submit review error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit review"
    });
  }
};

/* =========================================================
   GET APPROVED REVIEWS (PUBLIC)
========================================================= */
export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await getAllRows(SHEET_NAME);
    const approved = reviews.filter(r => r.Approved === "YES");

    res.json({
      success: true,
      data: approved
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });
  }
};

/* =========================================================
   GET ALL REVIEWS (ADMIN)
========================================================= */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await getAllRows(SHEET_NAME);

    res.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all reviews"
    });
  }
};

/* =========================================================
   APPROVE / REJECT REVIEW (ADMIN)
========================================================= */
export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body; // YES / NO

    await updateRowById(SHEET_NAME, id, {
      Approved: approved === "YES" ? "YES" : "NO"
    });

    res.json({
      success: true,
      message: "Review status updated"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update review"
    });
  }
};

/* =========================================================
   DELETE REVIEW (ADMIN)
========================================================= */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteRowById(SHEET_NAME, id);

    res.json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review"
    });
  }
};
