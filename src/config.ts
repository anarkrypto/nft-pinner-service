import * as dotenv from 'dotenv';
dotenv.config();

export const NFT_STORAGE_API_KEY : string = process.env.NFT_STORAGE_API_KEY || ""
export const AMQP_URL : string = process.env.AMQP_URL || "amqp://localhost:5673"