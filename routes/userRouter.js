import express from "express";
import * as userController from "../controller/userController.js";

import jwt from "jsonwebtoken";
const route = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decoded);
    req.user = decoded; // Attach user information to the request object
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

route.post("/save", userController.save);
route.post("/login", userController.login);

route.post("/otpverification", userController.otpVerify);
route.get("/getuser", verifyToken, userController.getUser);
route.post("/forgotpassword", userController.forgotPassword);
route.post("/changepassword", userController.changePassword);
route.post("/sendfeedback", userController.sendFeedback);
route.get("/subjects", userController.getSubjects);
route.post("/get_lectures", userController.getLectures);
route.delete("/delete_lecture/:id", userController.deleteLecture);
route.delete(
  "/delete_company_updates/:id",
  userController.deleteCompanyUpdates
);
route.get("/get_all_lectures", userController.getAllLectures);
route.get("/get_company_updates", userController.getCompanyUpdates);

export default route;
