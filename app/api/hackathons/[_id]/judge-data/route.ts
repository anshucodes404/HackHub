import dbConnect from "@/lib/dbConnect";
import { Team } from "@/models/team.model";
import { Submission } from "@/models/submission.model"; // Ensure model is registered
import { Review } from "@/models/review.model"; // Ensure model is registered
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const { _id } = await params;
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const hackathonId = new mongoose.Types.ObjectId(_id);

    const totalTeams = await Team.countDocuments({ hackathonId: hackathonId });

    const teams = await Team.aggregate([
      { $match: { hackathonId: hackathonId } },

      {
        $lookup: {
          from: "submissions",
          localField: "_id",
          foreignField: "teamId",
          as: "submission",
        },
      },
      {
        $unwind: {
          path: "$submission",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    console.log(teams);

    const totalPages = Math.ceil(totalTeams / limit);

    return NextResponse.json(
      new ApiResponse(true, "Judge data fetched successfully", {
        teams,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalTeams,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching judge data:", error);
    return NextResponse.json(
      new ApiResponse(false, "Failed to fetch judge data", null, error),
      { status: 500 }
    );
  }
}
