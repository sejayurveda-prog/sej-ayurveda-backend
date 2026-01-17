/* =========================================================
   SEJ AYURVEDA – NOTIFICATION SERVICE
   (Centralized notification handler)
========================================================= */

/**
 * NOTE:
 * Currently this service logs notifications.
 * Later you can plug:
 *  - WhatsApp API
 *  - Email (SMTP)
 *  - SMS Gateway
 */

/* =========================================================
   CONSULTATION NOTIFICATION
========================================================= */

export function notifyNewConsultation(consultation) {
  try {
    console.log("📞 NEW CONSULTATION BOOKED");
    console.log("----------------------------------");
    console.log("Name:", consultation.name);
    console.log("Phone:", consultation.phone);
    console.log("Type:", consultation.type);
    console.log("Amount:", consultation.amount);
    console.log("Problem:", consultation.message);
    console.log("Status:", consultation.status);
    console.log("----------------------------------");
  } catch (error) {
    console.error("❌ Consultation notification error:", error);
  }
}

/* =========================================================
   ORDER NOTIFICATION
========================================================= */

export function notifyNewOrder(order) {
  try {
    console.log("📦 NEW ORDER RECEIVED");
    console.log("----------------------------------");
    console.log("Order ID:", order.orderId);
    console.log("Name:", order.name);
    console.log("Phone:", order.phone);
    console.log("Total Amount:", order.totalAmount);
    console.log("Paid Amount:", order.paidAmount);
    console.log("Payment Type:", order.paymentType);
    console.log("Payment Status:", order.paymentStatus);
    console.log("----------------------------------");
  } catch (error) {
    console.error("❌ Order notification error:", error);
  }
}

/* =========================================================
   ADMIN ALERT (GENERIC)
========================================================= */

export function notifyAdmin(message) {
  try {
    console.log("🔔 ADMIN ALERT");
    console.log("----------------------------------");
    console.log(message);
    console.log("----------------------------------");
  } catch (error) {
    console.error("❌ Admin notification error:", error);
  }
}
