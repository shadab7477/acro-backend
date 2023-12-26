import mongoose from "mongoose";

const url ="mongodb+srv://aashutoshchouhan2:zFToYP1Go06JgrDY@cluster0.kthddbd.mongodb.net/acropolisnotes?retryWrites=true&w=majority";

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
