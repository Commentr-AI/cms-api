import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
import routes from "./routes/index.js";
import userRoutes from "./routes/userRoutes.js";
import languageRoutes from "./routes/language.js";
app.use("/api", routes);
app.use("/api/users", userRoutes);
// Language routes
app.use("/api/languages", languageRoutes);

export default app;
