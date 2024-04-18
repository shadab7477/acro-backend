import express from "express";
import * as adminController from "../controller/adminController.js";
import multer from "multer";
const route = express.Router();
const upload = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

// admin routes
route.post("/uploadlectures", adminController.uploadLectures);
route.delete("/deletelecture", adminController.deleteLectures);
route.delete("/delete_company_updates", adminController.deleteCompanyUpdates);

route.post("/updates", upload.array("files", 5), adminController.uploadUpdates);
route.post("/send_bulk_email", adminController.sendBulkEmailUsingBrevo);

export default route;
