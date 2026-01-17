import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ==============================
   MIDDLEWARES
============================== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Preflight fix
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==============================
   HEALTH CHECK
============================== */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SEJ Ayurveda Backend is running 🚀"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API working fine ✅"
  });
});

/* ==============================
   ROUTES
============================== */
import authRoutes from "./routes/auth.routes.js";
import kitRoutes from "./routes/kit.routes.js";
import orderRoutes from "./routes/order.routes.js";
import consultationRoutes from "./routes/consultation.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import adminRoutes from "./routes/admin.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/kits", kitRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

/* ==============================
   404 HANDLER
============================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

/* ==============================
   GLOBAL ERROR HANDLER
============================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/* ==============================
   SERVER START
============================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SEJ Ayurveda Backend running on port ${PORT}`);
});
