import dbConnect from "@/lib/dbConnect";
import { Invite } from "@/models/invite.model";
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    await dbConnect();
    const { teamId } = await params;

    const teamInvites = await Invite.aggregate([
      {
        $match: {
          teamId: new mongoose.Types.ObjectId(teamId),
        },
      },
      {
        $unwind: "$status",
      },
      {
        $lookup: {
          from: "users",
          localField: "status.email",
          foreignField: "collegeEmail",
          as: "membersDetails",
        },
      },
      {
        $unwind: "$membersDetails",
      },
      {
        $project: {
          _id: 1,
          inviteEntry: {
            _id: "$membersDetails._id",
            name: "$membersDetails.name",
            profileImageUrl: "$membersDetails.profileImageUrl",
            status: "$status.status",
            collegeEmail: "$membersDetails.collegeEmail",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          status: { $push: "$inviteEntry" },
        },
      },
    ]);

    console.log(teamInvites)
    const requests = teamInvites[0]?.status || [];

    return NextResponse.json(
      new ApiResponse(true, "Team invites fetched successfully", requests),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      new ApiResponse(false, "Failed to fetch team invites", null, error),
      { status: 500 }
    );
  }
}
