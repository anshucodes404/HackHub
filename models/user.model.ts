import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string,
  profileImageUrl?: string,
  mobileNumber: number,
  collegeEmail: string,
  email: string,
  hostelEmail: string,
  branch: string,
  hostel: string,
  studyYear: string,
  githubLink?: string,
  LinkedInLink?: string,
  createdAt: Date;
  updatedAt: Date;
}

export const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    profileImageUrl: {
      type: String,
    },
    mobileNumber: {
      type: Number,
      required: true
    },
    collegeEmail: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hostelEmail: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    hostel: {
      type: String,
      required: true
    },
    studyYear: {
      type: String,
      required: true
    },
    githubLink: {
      type: String,
    },
    LinkedInLink: {
      type: String
    }
  },
  { timestamps: true }
);


export const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model("User", userSchema);
