import express from "express";
import categoryRoutes from "./routes/category.routes.js";

const app = express();
app.use(express.json());

//Routes 
app.use("/api/categories", categoryRoutes);


app.get("/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

export default app;