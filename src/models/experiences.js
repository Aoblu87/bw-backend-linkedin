import mongoose, { Schema } from "mongoose";

const ExperienceSchema = new Schema({
  users: {
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
    month: {
      type: "date",
      required: true,
    },
    year: {
      type: "date",
      required: true,
    },
  },
  endDate: {
    month: {
      type: "date",
      required: true,
    },
    year: {
      type: "date",
      required: true,
    },
  },
  description: {
    type: "string",
  },
});

export const Experince = mongoose.model("experiences", ExperienceSchema);
