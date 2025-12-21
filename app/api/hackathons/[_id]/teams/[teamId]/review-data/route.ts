import dbConnect from "@/lib/dbConnect";
import { Review } from "@/models/review.model";
import { Submission } from "@/models/submission.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const reviewSchema = z.object({
  hackathonId: z.string(),
  teamId: z.string(),
  comments: z.string().min(1),
  rank: z.number(),
  score: z.number().min(0).max(100),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ _id: string; teamId: string }> }
) {
  try {
    await dbConnect();
    const { _id: hackathonId, teamId } = await params;
    const reviewData = await Review.findOne({ teamId, hackathonId });

    if (!reviewData) {
      return NextResponse.json(
        new ApiResponse(false, "Team Data do not exist", null)
      );
    }

    console.log(reviewData);

    return NextResponse.json(
      new ApiResponse(true, "Review data fetched successfully", reviewData)
    );
  } catch (error) {
    return NextResponse.json(
      new ApiResponse(false, "Something went wrong", null, error)
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ _id: string; teamId: string }> }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id: hackathonId, teamId } = await params;
    const { comments, score, rank } = body;

    const parsedData = reviewSchema.safeParse({
      hackathonId,
      teamId,
      comments,
      rank,
      score,
    });
    console.log(parsedData);

    if (!parsedData.success) {
      return NextResponse.json(
        new ApiResponse(false, "Data validation error", null, parsedData.error),
        { status: 500 }
      );
    }

    const reviewExist = await Review.findOne({ hackathonId, teamId });

    if (reviewExist) {
      console.log(reviewExist);
      reviewExist.comments = parsedData.data.comments;
      reviewExist.score = parsedData.data.score;
        reviewExist.rank = parsedData.data.rank;
      await reviewExist.save();
    } else {
      await Review.create({
        hackathonId: parsedData.data.hackathonId,
        teamId: parsedData.data.teamId,
        comments: parsedData.data.comments,
        score: parsedData.data.score,
        rank: parsedData.data.rank,
      });
    }

    await Submission.findOneAndUpdate({teamId, hackathonId}, {reviewed: true})

    return NextResponse.json(
      new ApiResponse(true, "Review submitted successfully"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting review: ", error);
    return NextResponse.json(
      new ApiResponse(false, "Failed to submit review", null, error),
      { status: 500 }
    );
  }
}
