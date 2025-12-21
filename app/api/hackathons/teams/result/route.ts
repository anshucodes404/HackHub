import dbConnect from "@/lib/dbConnect";
import { Review } from "@/models/review.model";
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
    const reviewData = await Review.findOne({ teamId, hackathonId }).populate('teamId', {name: 1})
    const topTeams = await Review.find({ hackathonId, rank: {$in : [1, 2, 3]}}).sort({ rank: 1 }).populate('teamId', {name: 1});

    console.log(topTeams)
    if (!reviewData) {
      return NextResponse.json(
        new ApiResponse(false, "Team Data do not exist", null)
      );
    }

    console.log(reviewData); 
    return NextResponse.json(
      new ApiResponse(true, "Review data fetched successfully", {reviewData, topTeams})
    );
  } catch (error) {
    return NextResponse.json(
      new ApiResponse(false, "Something went wrong", null, error)
    );
  }
}