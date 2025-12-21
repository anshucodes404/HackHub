import dbConnect from "@/lib/dbConnect";
import jwtDecode from "@/lib/jwtDecode";
import { Hackathon } from "@/models/hackathon.model";
import { Team } from "@/models/team.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const { _id } = await params;
    const { _id: userId } = await jwtDecode().then((res) =>
      res.json().then((data) => data.data)
    );
    console.log("Request received");
    const { collegeEmail } = await (await jwtDecode())
      .json()
      .then((res) => res.data);
    await dbConnect();

    const hackathon = await Hackathon.findById(_id);
    if (!hackathon) {
      console.error("No hackathon found");
      return NextResponse.json(
        new ApiResponse(false, "No Hackathon found corresponding this ID"),
        { status: 500 }
      );
    }

    //FIXME: change the logic for registered b/c now it's only for leader

    const userTeam = await Team.findOne({
      hackathonId: _id,
      members: { $elemMatch: { userId } },
    });
    console.log(userTeam);
    const registered = userTeam ? true : false;

    return NextResponse.json(
      new ApiResponse(true, "Hackathon corresponding the ID found", {
        ...hackathon.toObject(),
        registered,
        teamId: userTeam?._id || null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occured while searching the hackathon");
    return NextResponse.json(
      new ApiResponse(false, "Something went wrong", "", error),
      { status: 500 }
    );
  }
}
