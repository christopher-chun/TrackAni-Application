import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import favoritesRoutes from "./routes/favoritesRoutes.js";
import listRoutes from "./routes/listRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://trackani.onrender.com"
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/favorites", favoritesRoutes);
app.use("/api/list", listRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
