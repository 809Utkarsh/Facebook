import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
    });
    console.log('MongoDB Connected');
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);  // Safely access err.message
    } else {
      console.error('Unknown error occurred');
    }
    process.exit(1);
  }
};

export default connectDB;
