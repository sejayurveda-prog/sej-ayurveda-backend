// payments.js (RENDER SAFE FINAL VERSION)

import Razorpay from "razorpay";
import crypto from "crypto";
import ENV from "./env.js";

/* =========================================================
   RAZORPAY INSTANCE (SAFE INITIALIZATION)
========================================================= */
let razorpay = null;

if (ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: ENV.RAZORPAY_KEY_ID,
    key_secret: ENV.RAZORPAY_KEY_SECRET
  });
}

/* =========================================================
   BUSINESS RULES
========================================================= */
export const CONSULTATION_PRICES = ENV.CONSULTATION_PRICES;
export const ORDER_PARTIAL_AMOUNT = ENV.ORDER_ADVANCE_AMOUNT;

/* =========================================================
   CALCULATE CONSULTATION AMOUNT
========================================================= */
export const getConsultationAmount = (type) => {
  if (!CONSULTATION_PRICES?.[type]) {
    throw new Error("Invalid consultation type");
  }
  return CONSULTATION_PRICES[type];
};

/* =========================================================
   CALCULATE ORDER PAYMENT
========================================================= */
export const getOrderPaymentDetails = ({
  totalAmount,
  paymentType
}) => {
  if (!totalAmount || totalAmount <= 0) {
    throw new Error("Invalid total amount");
  }

  if (paymentType === "PARTIAL") {
    return {
      paidAmount: ORDER_PARTIAL_AMOUNT,
      dueAmount: totalAmount - ORDER_PARTIAL_AMOUNT,
      paymentStatus: "PARTIALLY_PAID"
    };
  }

  if (paymentType === "FULL") {
    return {
      paidAmount: totalAmount,
      dueAmount: 0,
      paymentStatus: "PAID"
    };
  }

  throw new Error("Invalid payment type");
};

/* =========================================================
   CREATE RAZORPAY ORDER
========================================================= */
export const createRazorpayOrder = async ({
  amount,
  receipt,
  notes = {}
}) => {
  if (!razorpay) {
    throw new Error("Razorpay not configured");
  }

  if (!amount || amount <= 0) {
    throw new Error("Invalid Razorpay amount");
  }

  try {
    return await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      notes
    });
  } catch (error) {
    console.error("❌ Razorpay order error:", error.message);
    throw new Error("Failed to create Razorpay order");
  }
};

/* =========================================================
   VERIFY PAYMENT SIGNATURE
========================================================= */
export const verifyPaymentSignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
}) => {
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return false;
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", ENV.RAZORPAY_KEY_SECRET || "")
    .update(body)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};
