import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

export const env = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  HOST: isProd ? (process.env.HOST || "") : "localhost",
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_DURATION: process.env.JWT_DURATION,
  JWT_REFRESH_DURATION: process.env.JWT_REFRESH_DURATION,
};
