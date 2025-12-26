import dbConnect from "@/lib/dbConnect";
import jwtDecode from "@/lib/jwtDecode";
import { Hackathon } from "@/models/hackathon.model";
import { ITeamMember, Team } from "@/models/team.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { hackathonReqSchema } from "../../organise-hackathon/route";

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

    const userTeam = await Team.findOne({
      hackathonId: _id,
      members: { $elemMatch: { userId } },
    });
    console.log(userTeam);
    const registered = userTeam ? true : false;
    const isLeader = userTeam
      ? userTeam.members.some(
        (member: ITeamMember) =>
          member.collegeEmail === collegeEmail && member.role === "leader"
      )
      : false;

    return NextResponse.json(
      new ApiResponse(true, "Hackathon corresponding the ID found", {
        ...hackathon.toObject(),
        registered,
        teamId: userTeam?._id || null,
        isLeader
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const { _id } = await params;
    const decoded = await jwtDecode();
    if (!decoded.ok) {
      return NextResponse.json(new ApiResponse(false, "Unauthorized"), { status: 401 });
    }
    const { _id: userId } = await decoded.json().then((data) => data.data);

    await dbConnect();

    const hackathon = await Hackathon.findById(_id);
    if (!hackathon) {
      return NextResponse.json(new ApiResponse(false, "Hackathon not found"), { status: 404 });
    }

    if (hackathon.organiser.toString() !== userId) {
      return NextResponse.json(new ApiResponse(false, "Unauthorized: You are not the organiser"), { status: 403 });
    }

    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const parsedBody = hackathonReqSchema.partial().safeParse(data);

    if (!parsedBody.success) {
      return NextResponse.json(new ApiResponse(false, "Invalid inputs", parsedBody.error), { status: 400 });
    }

    const updates = parsedBody.data;

    if (updates.tags) {
      hackathon.tags = Array.from(updates.tags.split(",")).map(tag => tag.trim().toLowerCase());  //yaha pe jo tags aaya hai updates me usko array me convert karke hackathon me store kar rahe aur uske baad updates ka tags delete kar diye
      delete updates.tags;
    }

    Object.assign(hackathon, updates);

    await hackathon.save();

    return NextResponse.json(
      new ApiResponse(true, "Hackathon updated successfully", hackathon),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating hackathon:", error);
    return NextResponse.json(
      new ApiResponse(false, "Something went wrong while updating", error),
      { status: 500 }
    );
  }
}
