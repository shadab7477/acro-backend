import bodyParser from "body-parser";
import express from "express";
import useRouter from "./routes/userRouter.js";
import dotenv from "dotenv";
import cors from "cors";

const PORT = process.env.PORT || 3001;

// Set up Global configuration access
dotenv.config();

const app = express();

//ENCODING DATA IN THE BODY SECURELY
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ADDED TO SOLVE THE PROBLEM OF CROSS ORIGIN
app.use(cors());

//REDIRECTING TO THE USER ROUTE
app.use("/user", useRouter);

app.listen(PORT);
console.log(`server is activated at http://localhost:${PORT}`);
