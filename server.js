import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import foodRoutes from "./routes/foodRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

// App config
const app = express();

const PORT =  5000;

// Middleware
app.use(express.json());

app.use(cors({
  origin: ["https://food-del-frontend-ecru.vercel.app","https://food-del-admin-chi.vercel.app"], // allow your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // include methods you're using
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Export app for Vercel
export default app;
