import mongoose from "mongoose";

let cashed = global.mongoose || { conn: null, promise: null };

export default async function connectDB() {
  if (cashed.conn) return cashed.conn;
  if (!cashed.promise) {
    cashed.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mon) => mon);
  }
  try {
    cashed.conn = await cashed.promise;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to mongoDb", error);
  }
  return cashed.conn;
}
