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
import categoryRoutes from "./routes/category.js";
import postRoutes from "./routes/post.js";
app.use("/api", routes);
app.use("/api/users", userRoutes);
// Language routes
app.use("/api/languages", languageRoutes);
// Category routes
app.use("/api/categories", categoryRoutes);
// Post routes
app.use("/api/posts", postRoutes);
export default app;
