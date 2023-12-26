import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
const userSchema = mongoose.Schema({
  _id: Number,
  status: Number,
  info: String,
  role: String,
  name: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
  },
});
userSchema.plugin(mongooseUniqueValidator);
const userSchemaModel = mongoose.model("user_details", userSchema);
export default userSchemaModel;
