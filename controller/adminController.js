import cloudinary from "cloudinary";
import Lecture from "../model/lectureModel.js";
import "../model/connection.js";
import Company from "../model/updatesModel.js";
import userSchemaModel from "../model/userModel.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration

export const uploadLectures = async (req, res, next) => {
  try {
    const { title, description, subject, videoUrl } = req.body;

    const lecture = new Lecture({
      title,
      description,
      subject,
      videoUrl,
    });

    await lecture.save();

    res.status(201).json({ message: "Lecture uploaded successfully" });
  } catch (error) {
    console.error("Error uploading lecture:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete lecture function

export const deleteLectures = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log;
    const lectureData = await Lecture.deleteOne({
      _id: new mongoose.Types.ObjectId(_id),
    });
    res
      .status(201)
      .json({ message: "Lecture Deleted successfully", lectureData });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Delete company updates function

export const deleteCompanyUpdates = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log;
    const companyData = await Company.deleteOne({
      _id: new mongoose.Types.ObjectId(_id),
    });
    res
      .status(201)
      .json({ message: "Company Details Deleted successfully", companyData });
  } catch (error) {
    console.error("Error deleting Company Details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// storing company's details
export const uploadUpdates = async (req, res, next) => {
  try {
    const { companyName, description } = req.body;
    const files = req.files;

    const uploadedImages = [];

    for (const file of files) {
      let resource_type = "auto";
      if (file.mimetype.startsWith("image/")) {
        resource_type = "image";
      } else if (file.mimetype.startsWith("video/")) {
        resource_type = "video";
      }

      const uploadResult = await cloudinary.uploader.upload(file.path, {
        resource_type: resource_type,
        upload_preset: "ml_default",
      });

      uploadedImages.push(uploadResult.secure_url);
    }

    // Create new company document
    const company = new Company({
      companyName,
      description,
      images: uploadedImages,
    });

    await company.save();
    res.status(201).json({ message: "Company Details uploaded successfully" });
  } catch (error) {
    console.error("Error uploading Company Details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create Brevo API instance

export const sendBulkEmailUsingBrevo = async (req, res, next) => {
  try {
    const { htmlContent, subject } = req.body;

    const users = await userSchemaModel.find();

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY_BULK_MAIL;

    const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendEmailPromises = [];

    users.forEach((user) => {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.sender = {
        email: process.env.MAIL_SENDER,
        name: process.env.BULK_MAIL_SENDER_NAME,
      };
      sendSmtpEmail.to = [{ email: user.email, name: user.name }];

      sendEmailPromises.push(
        transactionalEmailsApi.sendTransacEmail(sendSmtpEmail)
      );
    });
    await Promise.all(sendEmailPromises);

    res.status(200).json({ message: "Bulk emails sent successfully" });
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
