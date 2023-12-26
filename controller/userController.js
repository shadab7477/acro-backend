import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchemaModel from "../model/userModel.js";
import "../model/connection.js";
import sendMail from "./mailapi.js";
import sendOtpMail from "./otpmailapi.js";
import sendForgotPasswordOtp from "./forgotpasswordmailapi.js";
import sendFeedbackEmail from "./feedbackmailapi.js";

//-----------------------------------------------------------save data api--------------------------------------------------------------
export const save = async (req, res, next) => {
  const user = await userSchemaModel.find().sort({ _id: -1 });
  const id = user.length === 0 ? 1 : user[0]._id + 1;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userObj = {
    _id: id,
    status: 1, // Set status to 0 (pending) until OTP is verified
    info: new Date(),
    role: "user",
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name,
  };

  try {
    const isUserSaved = await userSchemaModel.create(userObj);
    if (isUserSaved) {
      res.status(200).json({
        status: true,
        msg: "registered successfully.",
      });

      // if successfully registered then send the registration mail to the user
      sendMail(userObj.email);
    } else {
      res.status(400).json({ status: false, msg: "Server error......" });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: "Given data already exists or there is an error.",
    });
  }
};

//-----------------------------------------------------------login api--------------------------------------------------------------
export const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Please enter your email and password" });
    }

    // Normalize and trim the email before using it in the query
    const normalizedEmail = req.body.email.trim().toLowerCase();

    const user = await userSchemaModel.findOne({
      email: normalizedEmail,
      status: 1,
    });

    if (user) {
      // Compare the input password with the stored hashed password
      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isPasswordMatch) {
        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );

        return res.status(200).json({
          status: true,
          msg: "Logged in successfully...",
          token: token,
          username: user.name,
        });
      } else {
        return res.status(401).json({ msg: "Invalid password" });
      }
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//--------------------------------------------------send otp mail api----------------------------------------------------------

export const otpVerify = async (req, res, next) => {
  try {
    // Retrieve user by email
    const email = req.body.email;
    console.log(email + "aagya bhai");
    const user = await userSchemaModel.findOne({ email });

    if (user) {
      // User already exists, do not send OTP again
      return res
        .status(200)
        .json({ status: false, msg: "User already exists" });
    } else {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      try {
        // Send OTP via email
        sendOtpMail(req.body.email, otp);
        res
          .status(200)
          .json({ status: true, msg: "OTP sent successfully", otp });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, msg: "Internal server error" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

//---------------------------------------------
export const getUser = async (req, res, next) => {
  const user = await userSchemaModel.find();
  res.status(400).json({ user: user });
};

//----------------------------------------------------------------------------forgot password api---------------------------------------------

export const forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log(email);
    const user = await userSchemaModel.findOne({ email });
    console.log(user);

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // if user exists then send the otp for updating password
      sendForgotPasswordOtp(email, otp);
      return res.status(200).json({
        status: true,
        msg: "user with the given email exists",
        otp: otp,
      });
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};
//---------------------------------------------- =----------------------------change password api--------------------------------------

export const changePassword = async (req, res, next) => {
  try {
    const newPassword = req.body.password;
    const confirmNewPassword = req.body.confirm_password;

    // Check if the new password matches the confirmed password
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ status: false, msg: "Passwords do not match" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Check if the hashed password already exists in the database
    const existingUser = await userSchemaModel.findOne({
      password: hashedPassword,
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, msg: "Password already exists" });
    }

    // Update the user's password in the database
    const updatedUser = await userSchemaModel.findOneAndUpdate(
      { email: req.body.email }, // Assuming you have the email in the request body
      { $set: { password: hashedPassword } },
      { new: true } // To get the updated user document in the response
    );

    if (updatedUser) {
      return res.status(200).json({
        status: true,
        msg: "Password updated successfully",
        updatedUser,
      });
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

//---------------------------------------------- =----------------------------feedback email  api--------------------------------------

export const sendFeedback = (req, res, next) => {
  const { name, email, feedback } = req.body;
  const isEmailSent = sendFeedbackEmail(name, email, feedback);

  if (isEmailSent) {
    return res.status(200).json({
      status: true,
      msg: "feedback email sent successfully",
    });
  } else {
    return res.status(500).json({
      status: false,
      msg: "cannot sent email",
    });
  }
};
