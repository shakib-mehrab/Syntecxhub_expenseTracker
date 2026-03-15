import mongoose from "mongoose";

let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  connectionPromise = mongoose
    .connect(mongoUri)
    .then((connection) => {
      console.log("MongoDB connected");
      return connection;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};
