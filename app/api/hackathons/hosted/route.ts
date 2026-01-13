import dbConnect from "@/lib/dbConnect";
import jwtDecode from "@/lib/jwtDecode";
import { Hackathon } from "@/models/hackathon.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { type NextRequest, NextResponse } from "next/server";
import { Query } from "@/types/types";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams

    const search = searchParams.get("search");
		const mode = searchParams.get("mode");
		const status = searchParams.get("status")?.split(",");
		const tags = searchParams.get("tags")?.split(",");

    const query: Query = {};
    
        if (search) {
          query.hackathonName = { $regex: search, $options: "i" };
        }
        if (mode) {
          query.mode = mode;
        }
    
        if (tags && tags.length > 0) {
          query.tags = { $in: tags.map(tag => tag.trim().toLowerCase()) };
        }
    

    console.log("Hackathon call recieved");
    await dbConnect();
    const { _id } = await (await jwtDecode()).json().then(res => res.data)
    const hackathons = await Hackathon.find({organiser: _id, ...query}).select(
      "-description -criteria -organiserEmail -socialLink -webSiteLink -createdAt -updatedAt -__v"
    );
    console.log(hackathons);
    return NextResponse.json(
      new ApiResponse(true, "Hackathon call recieved", hackathons),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
        new ApiResponse(false, "Something went wrong while fetching hosted hackathons", "", error),
        {status: 500}
    )
  }
}
