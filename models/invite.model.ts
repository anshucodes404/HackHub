import mongoose, { type Document, Schema } from "mongoose";

export interface IInvite extends Document {
  teamId: mongoose.Types.ObjectId;
  hackathonName: string;
  rules: string[];
  tagline: string;
  teamName: string;
  inviterName: string;
  inviterEmail: string;
  membersEmail: string[];
  status: {email: string, status: "pending" | "accepted" | "rejected"}[];
  expiresAt: Date;
}

const inviteSchema = new Schema<IInvite>({
  teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  hackathonName: {type: String, required: true},
  tagline: {type: String, required: true},
  teamName: {type: String, required: true},
  inviterName: {type: String, required: true},
  inviterEmail: { type: String, required: true},
  membersEmail: {type: [String], required: true},
  status:[
    {
      email: {type: String, required: true},
      status: {type: String, enum: ["pending", "accepted", "rejected"], default: "pending"},
    }
  ],
  rules: [String],
  expiresAt: { type: Date, required: true },
});

inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invite = mongoose.models.Invite || mongoose.model<IInvite>("Invite", inviteSchema);
