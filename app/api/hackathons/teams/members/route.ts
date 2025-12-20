import dbConnect from "@/lib/dbConnect";
import { Team } from "@/models/team.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        await dbConnect();
        const searchParams = req.nextUrl.searchParams;
        console.log(searchParams)
        const teamId = searchParams.get("teamId");
        

        const teamDetails = await Team.findById(teamId)
                            .populate({path: "members.userId", select: "profileImageUrl"})
                            .select("name members _id status createdAt updatedAt")

        console.log(teamDetails)
        if(!teamDetails){
            return NextResponse.json(
                new ApiResponse(false, "Team not found"), {status: 404}
            )
        }



        return NextResponse.json(new ApiResponse(true, "Team members fetched", teamDetails))
    } catch (error) {
        return NextResponse.json(
            new ApiResponse(false, "Something went wrong", null, error), {status: 500}
        )
    }
}