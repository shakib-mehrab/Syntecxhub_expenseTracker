import cors from "cors";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PROD,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments.
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/settings", settingsRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

export default app;