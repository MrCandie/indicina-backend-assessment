import mongoose from "mongoose";
import { IURL } from "../interface";

const schema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    urlId: {
      type: String,
      required: [true, "URL identifier is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<IURL>("URL", schema);
