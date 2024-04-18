import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const SubjectSchema = mongoose.Schema({
  subject_id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

SubjectSchema.plugin(mongooseUniqueValidator);

const Subject = mongoose.model("Subject", SubjectSchema);

export default Subject;
