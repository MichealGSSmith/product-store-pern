import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";


const app =express();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(cors());
app.use(helmet()); // security middleware helping to protect your app by setting various HTTP headers
app.use(morgan("dev")); //log requests

app.use("/api/products", productRoutes);

app.listen(PORT,() => {
    console.log("server is running on port " + PORT);
});

