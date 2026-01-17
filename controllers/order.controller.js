import { v4 as uuidv4 } from "uuid";
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  getOrderPaymentDetails
} from "../config/payment.js";

import {
  getAllRows,
  addRow,
  updateRowById
} from "../services/google-sheet.service.js";

/* =========================================================
   GOOGLE SHEET CONFIG
========================================================= */
const SHEET_NAME = "Orders";

/* =========================================================
   CREATE ORDER (PARTIAL ₹150 OR FULL)
========================================================= */
export const createOrder = async (req, res) => {
  try {
    const {
      name,
      phone,
      kitName,
      totalAmount,
      paymentType, // PARTIAL | FULL
      address
    } = req.body;

    if (!name || !phone || !kitName || !totalAmount || !paymentType) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // Calculate payment safely (backend-controlled)
    const paymentDetails = getOrderPaymentDetails({
      totalAmount,
      paymentType
    });

    const orderId = uuidv4();

    // Create Razorpay order only for prepaid amount
    const razorpayOrder = await createRazorpayOrder({
      amount: paymentDetails.paidAmount,
      receipt: `order_${orderId}`,
      notes: {
        orderId,
        kitName,
        paymentType
      }
    });

    // Save initial order in Google Sheet
    const orderRow = {
      OrderID: orderId,
      Name: name,
      Phone: phone,
      KitName: kitName,
      TotalAmount: totalAmount,
      PaidAmount: paymentDetails.paidAmount,
      DueAmount: paymentDetails.dueAmount,
      PaymentType: paymentType,
      PaymentStatus: "PENDING",
      Address: address || "",
      Status: "CREATED",
      CreatedAt: new Date().toISOString()
    };

    await addRow(SHEET_NAME, orderRow);

    res.json({
      success: true,
      message: "Order created. Proceed to payment.",
      razorpayOrder
    });

  } catch (error) {
    console.error("Create order error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create order"
    });
  }
};

/* =========================================================
   VERIFY ORDER PAYMENT
========================================================= */
export const verifyOrderPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
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

    // Update order in Google Sheet
    await updateRowById(SHEET_NAME, orderId, {
      PaymentStatus: "PAID",
      Status: "CONFIRMED",
      TransactionId: razorpay_payment_id
    });

    res.json({
      success: true,
      message: "Payment verified and order confirmed"
    });

  } catch (error) {
    console.error("Verify order payment error:", error.message);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};

/* =========================================================
   GET USER ORDERS (BY PHONE)
========================================================= */
export const getUserOrders = async (req, res) => {
  try {
    const { phone } = req.params;

    const orders = await getAllRows(SHEET_NAME);
    const userOrders = orders.filter(o => o.Phone === phone);

    res.json({
      success: true,
      data: userOrders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders"
    });
  }
};

/* =========================================================
   GET ALL ORDERS (ADMIN)
========================================================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await getAllRows(SHEET_NAME);

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

/* =========================================================
   UPDATE ORDER STATUS (ADMIN)
========================================================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await updateRowById(SHEET_NAME, id, {
      Status: status
    });

    res.json({
      success: true,
      message: "Order status updated"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};
