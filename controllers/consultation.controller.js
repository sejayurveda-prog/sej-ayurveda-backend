import { v4 as uuidv4 } from "uuid";
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  getConsultationAmount
} from "../config/payment.js";

import {
  addRow,
  getAllRows,
  updateRowById
} from "../services/google-sheet.service.js";

/* =========================================================
   GOOGLE SHEET CONFIG
========================================================= */
const SHEET_NAME = "Consultations";

/* =========================================================
   CREATE CONSULTATION (FULL PREPAID)
========================================================= */
export const createConsultation = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      consultationType, // audio | video
      problem
    } = req.body;

    if (!name || !phone || !consultationType || !problem) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // Backend decides amount (SECURE)
    const amount = getConsultationAmount(consultationType);
    const consultationId = uuidv4();

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount,
      receipt: `consult_${consultationId}`,
      notes: {
        consultationId,
        consultationType
      }
    });

    // Save consultation (initial)
    const row = {
      id: consultationId,
      Name: name,
      Phone: phone,
      Email: email || "",
      ConsultationType: consultationType,
      Problem: problem,
      Amount: amount,
      PaymentStatus: "PENDING",
      TransactionId: "",
      ScheduledDateTime: "",
      Status: "CREATED",
      CreatedAt: new Date().toISOString()
    };

    await addRow(SHEET_NAME, row);

    res.json({
      success: true,
      message: "Consultation created. Proceed to payment.",
      razorpayOrder,
      consultationId
    });

  } catch (error) {
    console.error("Create consultation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create consultation"
    });
  }
};

/* =========================================================
   VERIFY CONSULTATION PAYMENT
========================================================= */
export const verifyConsultationPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      consultationId
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !consultationId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data missing"
      });
    }

    const isValid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    await updateRowById(SHEET_NAME, consultationId, {
      PaymentStatus: "PAID",
      TransactionId: razorpay_payment_id,
      Status: "PAID"
    });

    res.json({
      success: true,
      message: "Consultation payment verified"
    });

  } catch (error) {
    console.error("Verify consultation payment error:", error.message);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};

/* =========================================================
   GET CONSULTATIONS BY PHONE (USER)
========================================================= */
export const getConsultationsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const rows = await getAllRows(SHEET_NAME);
    const userConsults = rows.filter(r => r.Phone === phone);

    res.json({
      success: true,
      data: userConsults
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultations"
    });
  }
};

/* =========================================================
   GET ALL CONSULTATIONS (ADMIN)
========================================================= */
export const getAllConsultations = async (req, res) => {
  try {
    const rows = await getAllRows(SHEET_NAME);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch consultations"
    });
  }
};

/* =========================================================
   UPDATE CONSULTATION STATUS (ADMIN)
========================================================= */
export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledDateTime } = req.body;

    await updateRowById(SHEET_NAME, id, {
      Status: status,
      ScheduledDateTime: scheduledDateTime || ""
    });

    res.json({
      success: true,
      message: "Consultation updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update consultation"
    });
  }
};
