import mongoose, { Document, Schema } from "mongoose";

export interface ISubmission extends Document {
  hackathonId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  submitterId: mongoose.Types.ObjectId;
  projectName: string;
  projectDetails: string;
  githubLink: string;
  demoLink?: string;
  pptURL: string;
  reviewed: boolean;
  submittedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  hackathonId: { type: Schema.Types.ObjectId, ref: "Hackathon", required: true },
  teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  submitterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  projectName: { type: String, required: true },
  projectDetails: { type: String, required: true },
  githubLink: { type: String, required: true },
  demoLink: { type: String },
   pptURL: { type: String, required: true },
   reviewed: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
});

export const Submission = mongoose.models.Submission || mongoose.model<ISubmission>("Submission", submissionSchema);
