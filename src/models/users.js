import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  country: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  city: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  photo: {
    type: String,
  },
});

export const User = mongoose.model("users", UserSchema);
