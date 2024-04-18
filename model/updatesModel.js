import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const companySchema = mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  images: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

companySchema.plugin(mongooseUniqueValidator);

const Company = mongoose.model("Company", companySchema);

export default Company;
