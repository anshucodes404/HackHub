import dbConnect from "@/lib/dbConnect";
import { Review } from "@/models/review.model";
import { Submission } from "@/models/submission.model";
import { ApiResponse } from "@/utils/ApiResponse";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const hackathonId = searchParams.get("hackathonId");
    const teamId = searchParams.get("teamId");

    const reviewData = await Review.findOne({ teamId, hackathonId }).populate('teamId', { name: 1 })
    const submissionData = await Submission.findOne({ teamId, hackathonId });
    const topTeams = await Review.find({ hackathonId, rank: { $in: [1, 2, 3] } }).sort({ rank: 1 }).populate('teamId', { name: 1 });

    console.log(topTeams)
    console.log(reviewData);
    console.log(topTeams);
    console.log(submissionData);

    return NextResponse.json(
      new ApiResponse(true, "Review data fetched successfully", { reviewData, topTeams, submissionData })
    );
  } catch (error) {
    return NextResponse.json(
      new ApiResponse(false, "Something went wrong", null, error)
    );
  }
}