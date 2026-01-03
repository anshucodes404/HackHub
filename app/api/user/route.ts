import dbConnect from "@/lib/dbConnect";
import jwtDecode from "@/lib/jwtDecode";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { Team } from "@/models/team.model";
import { Invite } from "@/models/invite.model";
import { Submission } from "@/models/submission.model";
import { Hackathon } from "@/models/hackathon.model";

async function cleanupUser(_id: string, collegeEmail: string) {
  try {

    await dbConnect();

    const userTeams = await Team.find({ leader: _id });
    const teamIds = userTeams.map(team => team._id);
    if (teamIds.length > 0) {
      await Hackathon.updateMany(
        { participants: { $in: teamIds } },
        { $pull: { participants: { $in: teamIds } } }
      );
    }

    await Team.deleteMany({ leader: _id });

    await Team.updateMany(
      { "members.userId": _id },
      { $pull: { members: { userId: _id } } }
    );
    await Invite.deleteMany({ inviterEmail: collegeEmail });

    await Invite.updateMany(
      { membersEmail: collegeEmail },
      { $pull: { membersEmail: collegeEmail, status: { email: collegeEmail } } }
    );


    await Submission.deleteMany({ submitterId: _id });


    await Hackathon.deleteMany({ organiser: _id });

    await Hackathon.updateMany(
      { OCEmails: collegeEmail },
      { $pull: { OCEmails: collegeEmail } }
    );

    console.log(`Successfully cleaned up all references for user ${_id}`);
  } catch (error) {
    console.error(`Error cleaning up user references for ${_id}:`, error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { _id } = await (await jwtDecode()).json().then(res => res.data)

    if (!_id) {
      return NextResponse.json(
        new ApiResponse(false, "User is not logged in"),
        { status: 302 }
      )
    }

    const user = await User.findById(_id)

    if (!user) {
      return NextResponse.json(
        new ApiResponse(false, "User not fetched"),
        { status: 500 }
      )
    }

    return NextResponse.json(
      new ApiResponse(true, "User fetched succeddfully", user),
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      new ApiResponse(false, "Something went wrong while fetching the user", "", error),
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect()
    const { _id } = await (await jwtDecode()).json().then(res => res.data)

    const body = await req.json()

    if (!_id) {
      return NextResponse.json(
        new ApiResponse(false, "User is not logged in"),
        { status: 302 }
      )
    }

    const user = await User.findByIdAndUpdate(_id, body, { new: true });

    if (!user) {
      return NextResponse.json(
        new ApiResponse(false, "User not found"),
        { status: 404 }
      )
    }

    return NextResponse.json(
      new ApiResponse(true, "Profile updated successfully", user),
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      new ApiResponse(false, "Update Failed, Try again", "", error)
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { _id, collegeEmail } = await (await jwtDecode()).json().then(res => res.data);

    if (!_id) {
      return NextResponse.json(
        new ApiResponse(false, "User is not logged in"),
        { status: 302 }
      )
    }
    await dbConnect();

    await User.findByIdAndDelete(_id);

    const response = NextResponse.json(
      new ApiResponse(true, "Profile deleted successfully"),
      { status: 200 }
    );

    cleanupUser(_id, collegeEmail).catch(error =>
      console.error("Background cleanup error:", error)
    );

    return response;

  } catch (error) {
    return NextResponse.json(
      new ApiResponse(false, "Failed to delete profile", "", error),
      { status: 500 }
    )
  }
}