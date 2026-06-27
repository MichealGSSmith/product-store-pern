import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";


const app =express();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(cors());
app.use(helmet()); // security middleware helping to protect your app by setting various HTTP headers
app.use(morgan("dev")); //log requests

//apply arc jet rate limit to all routes must be before my routes in this file.

/*
app.use(async (req,res,next) => {
    try{
        const decision = await aj.protect(req, {
            requested:1 //specifies that each request consumes 1 token
        }); 
        if (decision.isDenied()){

            res.status(429).json({ success: false, message: "Too many requests, please try again later." });
        } else if (decision.reason.isBot()){
            res.status(403).json({ success: false, message: "Bots are not allowed to access this resource." });
        } else {
            res.status(403).json({ success: false, message: "Access denied." });
        } 
    next();
    }catch (error) {
        console.log("Error in Arcjet middleware", error);
        next(error);
    }
});*/

app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1,
        });

        if (decision.isDenied()) {

            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests, please try again later.",
                });
            }

            if (decision.reason.isBot()) {
                return res.status(403).json({
                    success: false,
                    message: "Bots are not allowed to access this resource.",
                });
            }

            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        // Arcjet allowed the request
        next();

    } catch (error) {
        console.log("Error in Arcjet middleware", error);
        next(error);
    }
});

app.use("/api/products", productRoutes);

async function initDB() {
    try{
        await sql `
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("Database is initialized successfully");
    } catch(error) {
        console.log("Error initDB", error);
    }
};

initDB().then(() => {
    app.listen( PORT, () => {
        console.log("Server is running on port " + PORT);
    });
})



