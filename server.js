import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import foodRoutes from "./routes/foodRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

// App config
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["https://food-del-frontend-ecru.vercel.app"], 
  methods: ["POST", "GET"],
  credentials: true
}));

// Database connection
connectDb();

// API Endpoints
app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/images", express.static("uploads"));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Export app for Vercel
export default app;
