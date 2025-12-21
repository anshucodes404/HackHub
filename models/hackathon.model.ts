import mongoose, { Schema, Document } from "mongoose";

export interface IHackathon extends Document {
  hackathonName: string;
  mode: "online" | "inplace";
  location?: string;
  tagline?: string;
  description: string;
  prize: string;
  participants?: mongoose.Types.ObjectId[]; //? TEAM IDs
  participantsEmails?: string[]; //? team leaders email
  rules?: string;
  organiser: mongoose.Types.ObjectId;
  organiserName: string;
  startAt: Date;
  duration: string;
  registrationDeadline: Date;
  minTeamSize: number;
  maxTeamSize: number;
  criteria: string;
  bannerImage?: string;
  organiserEmail: string;
  OCEmails: string[];
  socialLink?: string;
  webSiteLink?: string;
  tags?: string[];
  status: "draft" | "published" | "ended" | "upcoming";
  createdAt: Date;
  updatedAt: Date;
}

const hackathonSchema = new Schema<IHackathon>(
  {
    hackathonName: {
      type: String,
    },
    mode: {
      type: String,
      enum: ["online", "inplace"],
      default: "online",
    },
    location: {
      type: String,
    },
    tagline: {
      type: String,
    },
    description: {
      type: String,
    },
    prize: {
      type: String,
      default: "0",
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "Team",
    },
    participantsEmails: {
      type: [String],
    },
    rules: {
      type: String,
    },
    organiser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organiserName: {
      type: String,
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    minTeamSize: {
      type: Number,
    },
    maxTeamSize: {
      type: Number,
    },
    criteria: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String
    },
    organiserEmail: {
      type: String,
      required: true,
    },
    OCEmails: {
      type: [String],
      required: true,
    },
    socialLink: {
      type: String,
    },
    webSiteLink: {
      type: String,
    },
    tags: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["draft", "published", "ended", "upcoming"],
      default: "published",
    },
  },
  { timestamps: true },
);

export const Hackathon =
  mongoose.models.Hackathon ||
  mongoose.model<IHackathon>("Hackathon", hackathonSchema);
