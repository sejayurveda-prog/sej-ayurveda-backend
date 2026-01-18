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

    // 🔴 Razorpay completely bypassed (TEST MODE)
    const razorpayOrder = {
      id: "TEST_ORDER_ID",
      amount: consultationType === "audio" ? 30000 : 50000,
      currency: "INR"
    };

    const row = {
      id: consultationId,
      Name: name,
      Phone: phone,
      Email: email || "",
      ConsultationType: consultationType,
      Problem: problem,
      Amount: razorpayOrder.amount,
      PaymentStatus: "TEST",
      Status: "CREATED",
      CreatedAt: new Date().toISOString()
    };

    await addRow("Consultations", row);

    return res.json({
      success: true,
      message: "Consultation saved successfully (TEST MODE)",
      consultationId,
      razorpayOrder
    });

  } catch (error) {
    console.error("🔥 CREATE CONSULTATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
