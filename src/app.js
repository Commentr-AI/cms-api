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
import TextNewsRoutes from "./routes/textNews.js"
import PageRoute from "./routes/pages.js";
import PromptTemplateRoute from "./routes/PromptTemplate.js"
import MobileUsersRoutes from "./routes/mobileUsers.js"
import MasterTemplateRoute from "./routes/masterTemplate.js"
app.use("/api", routes);
app.use("/api/users", userRoutes);
// Mobile users 
app.use("/api/mobile-users",MobileUsersRoutes)
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
app.use("/api/text-news",TextNewsRoutes)


// Pages route 

app.use("/api/pages",PageRoute )

// Prompte template route 
app.use("/api/prompt-template",PromptTemplateRoute)
app.use("/api/master-template",MasterTemplateRoute)
export default app;
