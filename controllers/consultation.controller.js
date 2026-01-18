import { v4 as uuidv4 } from "uuid";
import { addRow, getAllRows, updateRowById } from "../services/google-sheet.service.js";

/* =========================================================
   SHEET CONFIG
========================================================= */
const SHEET_NAME = "Consultations";

/* =========================================================
   CREATE CONSULTATION (TEST MODE – NO RAZORPAY)
========================================================= */
export const createConsultation = async (req, res) => {
  try {
    const { name, phone, email, consultationType, problem } = req.body;

    if (!name || !phone || !consultationType || !problem) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const consultationId = uuidv4();

    const row = {
      id: consultationId,
      Name: name,
      Phone: phone,
      Email: email || "",
      ConsultationType: consultationType,
      Problem: problem,
      Amount: consultationType === "audio" ? 30000 : 50000,
      PaymentStatus: "TEST",
      Status: "CREATED",
      CreatedAt: new Date().toISOString()
    };

    await addRow(SHEET_NAME, row);

    return res.json({
      success: true,
      message: "Consultation saved successfully (TEST MODE)",
      consultationId
    });

  } catch (error) {
    console.error("CREATE CONSULTATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================================================
   VERIFY PAYMENT (DUMMY – REQUIRED FOR ROUTES)
========================================================= */
export const verifyConsultationPayment = async (req, res) => {
  return res.json({
    success: true,
    message: "Payment verification skipped (TEST MODE)"
  });
};

/* =========================================================
   GET CONSULTATIONS BY PHONE
========================================================= */
export const getConsultationsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const rows = await getAllRows(SHEET_NAME);
    const filtered = rows.filter(r => r.Phone === phone);

    return res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================================================
   GET ALL CONSULTATIONS (ADMIN)
========================================================= */
export const getAllConsultations = async (req, res) => {
  try {
    const rows = await getAllRows(SHEET_NAME);
    return res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================================================
   UPDATE CONSULTATION STATUS
========================================================= */
export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await updateRowById(SHEET_NAME, id, { Status: status });

    return res.json({
      success: true,
      message: "Status updated"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
