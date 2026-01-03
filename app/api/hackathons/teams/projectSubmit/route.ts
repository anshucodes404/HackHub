import dbConnect from "@/lib/dbConnect";
import jwtDecode from "@/lib/jwtDecode";
import { Submission } from "@/models/submission.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {

    const searchParams = req.nextUrl.searchParams;
    const hackathonId = searchParams.get("hackathonId");
    const teamId = searchParams.get("teamId");

    await dbConnect();
    const { projectName, projectDetails, githubLink, demoLink, pptURL } =
      await req.json();
    const { _id } = await jwtDecode()
      .then((res) => res.json())
      .then((res) => res.data);
    console.log(_id);

    console.log(pptURL)

    const submission = {
      hackathonId,
      teamId,
      submitterId: _id,
      projectName,
      projectDetails,
      githubLink,
      demoLink,
      pptURL
    };

    const submissionResult = await Submission.replaceOne(
      { hackathonId, teamId },
      submission,
      { upsert: true }
    );

    if(!submissionResult){
      return NextResponse.json(
        new ApiResponse(
          false,
          "Failed to submit project",
          null
        ),
        { status: 500 }
      );
    }
    
    console.log(submission)

    return NextResponse.json(
      new ApiResponse(true, "Project submitted successfully", null),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      new ApiResponse(
        false,
        "Something went wrong while submitting project",
        null,
        error
      ),
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest){
  try {
    const searchParams = req.nextUrl.searchParams;
    const hackathonId = searchParams.get("hackathonId");
    const teamId = searchParams.get("teamId");

    await dbConnect();
    
    const submission = await Submission.findOne({hackathonId, teamId});

    if(!submission){
      return NextResponse.json(
        new ApiResponse(false, "No submission done yet", null), { status: 404 }
      )
    } else {
      return NextResponse.json(
        new ApiResponse(true, "Submission done already, new submission will update the existing one"), { status: 200 }
      )
    }

  } catch (error) {
    return NextResponse.json(
      new ApiResponse(
        false,
        "Something went wrong while fetching submission",
        null,
        error
      ),
      { status: 500 }
    );
  }
}