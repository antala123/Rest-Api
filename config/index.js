import dotenv from "dotenv";

dotenv.config();

export const { APP_PORT, DEBUG_MODE, DB_URL, JWT_KEY, REFTOKEN_KEY, APP_URL } = process.env;