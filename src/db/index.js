import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB Connected successfully !! DB:HOST:${connectionInstance}`
    );
  } catch (error) {
    console.log('MongoDB connection failed', error);
    process.exit(1);
  }
};
