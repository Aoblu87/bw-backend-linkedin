import mongoose, { Schema } from "mongoose";

const ExperienceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  employmentType: {
    type: "string",
  },
  companyName: {
    type: "string",
    required: true,
  },
  location: {
    type: "string",
  },
  locationType: {
    type: "string",
  },
  workInProgress: {
    type: "boolean",
  },
  startDate: {
    type: "string",
    required: true,
  },
  endDate: {
    type: "string",
    required: true,
  },
  description: {
    type: "string",
  },
  image: {
    type: "string",
  },
});

export const Experience = mongoose.model("experiences", ExperienceSchema);
