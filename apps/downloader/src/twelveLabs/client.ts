import dotenv from "dotenv";
import { TwelveLabs } from "twelvelabs-js";

dotenv.config();

const apiKey = process.env.TWELVE_LABS_API_KEY!;

export const client12Labs = new TwelveLabs({ apiKey });
