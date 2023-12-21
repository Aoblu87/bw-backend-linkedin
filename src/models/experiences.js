import mongoose, { Schema } from "mongoose";

const ExperienceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  employmentType: {
    type: String,
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  locationType: {
    type: String,
  },
  workInProgress: {
    type: "boolean",
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
});

export const Experience = mongoose.model("experiences", ExperienceSchema);
