import express from "express";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();
app.use(express.json());

//Routes 
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);


app.get("/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

export default app;