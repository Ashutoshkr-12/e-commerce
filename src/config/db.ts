import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(`${MONGODB_URI}/zenotech`, opts)
      .then(() => {
        return mongoose.connection;
      })
      
      try {
        cached.conn = await cached.promise;
      } catch (error) {
        console.log("Error in connecting DB:",error)
      }
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
export default connectDB;
