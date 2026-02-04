import {
  getAllRows,
  updateRowById
} from "../services/google-sheet.service.js";

/* =========================================================
   SHEET NAMES (MUST MATCH GOOGLE SHEET TAB NAMES)
========================================================= */
const SHEETS = {
  ORDERS: "Orders",
  CONSULTATIONS: "Consultations",
  REVIEWS: "Reviews"
};

/* =========================================================
   DASHBOARD STATS
   GET /api/admin/dashboard
========================================================= */
export const getDashboardStats = async (req, res) => {
  try {
    const [orders, consultations, reviews] = await Promise.all([
      getAllRows(SHEETS.ORDERS),
      getAllRows(SHEETS.CONSULTATIONS),
      getAllRows(SHEETS.REVIEWS)
    ]);

    const totalOrders = orders.length;
    const totalConsultations = consultations.length;

    const pendingOrders = orders.filter(
      o => o.PaymentStatus !== "PAID"
    ).length;

    const pendingConsultations = consultations.filter(
      c => c.Status !== "COMPLETED"
    ).length;

    const totalRevenue = orders.reduce(
      (sum, o) => sum + Number(o.PaidAmount || 0),
      0
    );

    return res.json({
      success: true,
      data: {
        totalOrders,
        totalConsultations,
        pendingOrders,
        pendingConsultations,
        totalRevenue
      }
    });

  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats"
    });
  }
};

/* =========================================================
   RECENT ORDERS
   GET /api/admin/orders/recent
========================================================= */
export const getRecentOrders = async (req, res) => {
  try {
    const orders = await getAllRows(SHEETS.ORDERS);

    const recent = orders.slice(-10).reverse();

    return res.json({
      success: true,
      data: recent
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders"
    });
  }
};

/* =========================================================
   RECENT CONSULTATIONS
   GET /api/admin/consultations/recent
========================================================= */
export const getRecentConsultations = async (req, res) => {
  try {
    const consultations = await getAllRows(SHEETS.CONSULTATIONS);

    const recent = consultations.slice(-10).reverse();

    return res.json({
      success: true,
      data: recent
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent consultations"
    });
  }
};

/* =========================================================
   PENDING REVIEWS
   GET /api/admin/reviews/pending
========================================================= */
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await getAllRows(SHEETS.REVIEWS);

    const pending = reviews.filter(
      r => r.Approved === "NO"
    );

    return res.json({
      success: true,
      data: pending
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending reviews"
    });
  }
};

/* =========================================================
   SCHEDULE CONSULTATION (ADMIN)
   PUT /api/admin/consultations/:id/schedule
========================================================= */
export const markConsultationScheduled = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledDateTime } = req.body;

    if (!scheduledDateTime) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date & time required"
      });
    }

    await updateRowById(SHEETS.CONSULTATIONS, id, {
      ScheduledDateTime: scheduledDateTime,
      Status: "SCHEDULED"
    });

    return res.json({
      success: true,
      message: "Consultation scheduled successfully"
    });

  } catch (error) {
    console.error("Schedule consultation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to schedule consultation"
    });
  }
};
/* =========================================================
   TEST MAIL (ADMIN)
   GET /api/admin/test-mail
========================================================= */
export const testMail = async (req, res, next) => {
  try {
    await sendMail({
      to: "sejayurveda@gmail.com",
      subject: "SEJ Ayurveda – Mail Test ✅",
      html: `
        <h2>Mail system working 🚀</h2>
        <p>This mail is sent from <b>Render deployed backend</b>.</p>
      `
    });

    return res.json({
      success: true,
      message: "Test mail sent successfully"
    });

  } catch (error) {
    console.error("Test mail error:", error.message);
    next(error);
  }
};
