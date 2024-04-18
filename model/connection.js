import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGO_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// You can also listen for SIGINT (Ctrl+C) to gracefully close the connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection disconnected through app termination");
    process.exit(0);
  });
});
