import dbConnect from "@/lib/dbConnect";
import { ITeamMember, Team } from "@/models/team.model";
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


export async function DELETE(req: NextRequest){
    try {
        await dbConnect();
        const {collegeEmail, teamId} = await req.json();

        const team = await Team.findById(teamId);

        if(!team){
            return NextResponse.json(
                new ApiResponse(false, "Team not found"), {status: 404}
            )
        }

        team.members = team.members.filter((member: ITeamMember) => member.collegeEmail !== collegeEmail);
        await team.save();

        return NextResponse.json(
            new ApiResponse(true, "Member kicked out successfully"), {status: 200}
        )
    } catch (error) {
         return NextResponse.json(
                new ApiResponse(false, "Something went wrong", null, error), {status: 500}
            )
    }
}