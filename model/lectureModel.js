import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const lectureSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: false,
  },
  subject: {
    type: Number,
    ref: "Subject",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

lectureSchema.plugin(mongooseUniqueValidator);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
