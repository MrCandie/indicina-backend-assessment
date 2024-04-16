import { Document } from "mongoose";

export declare interface IURL extends Document {
  id?: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  urlId: string;
}
