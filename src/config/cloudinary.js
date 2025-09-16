// config/cloudinary.js (or wherever this code is)
import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_NAME, // Changed from CLOUDINARY_CLOUD_NAME
} from "./env.js";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME, // Use CLOUDINARY_NAME
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;
