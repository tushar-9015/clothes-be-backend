import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI; // Get URI from environment variables

    if (!dbURI) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true, // Helps with parsing MongoDB connection strings
      useUnifiedTopology: true, // Enables the new connection management engine
    });

    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
