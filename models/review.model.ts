import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
    hackathonId: mongoose.Types.ObjectId;
    teamId: mongoose.Types.ObjectId;
    comments: string;
    score: number;
    ranking?: number;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        hackathonId: { type: Schema.Types.ObjectId, ref: "Hackathon", required: true },
        teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
        comments: { type: String, required: true },
        score: { type: Number, required: true },
        ranking: { type: Number },
    },
    { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);
