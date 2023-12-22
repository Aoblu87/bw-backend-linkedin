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
    required: function () {
      return this.googleId ? false : true;
    },
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
  cover: {
    type: String,
  },
  googleId: {
    type: String,
    required: function () {
      return this.password ? false : true;
    },
  },
});

export const User = mongoose.model("users", UserSchema);
