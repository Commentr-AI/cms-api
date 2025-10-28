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
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Routes
import routes from "./routes/index.js";
import userRoutes from "./routes/userRoutes.js";
import languageRoutes from "./routes/language.js";
import categoryRoutes from "./routes/category.js";
import postRoutes from "./routes/post.js";
import privacyRoutes from "./routes/privacy.js";
import mediaRoutes from "./routes/media.js";
import StoryRoute from "./routes/story.js"
import PageRoute from "./routes/pages.js";
app.use("/api", routes);
app.use("/api/users", userRoutes);
// Language routes
app.use("/api/languages", languageRoutes);
// Category routes
app.use("/api/categories", categoryRoutes);
// Post routes
app.use("/api/posts", postRoutes);
// Settings routes
import settingsRoutes from "./routes/settings.js";
app.use("/api/settings", settingsRoutes);
import dashboardRoutes from "./routes/dashboard.js";
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/privacy", privacyRoutes);
// media routes

app.use("/api/media", mediaRoutes);

app.use("/api/story",StoryRoute)

// Pages route 

app.use("/api/pages",PageRoute )
export default app;
