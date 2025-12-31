import dbConnect from "@/lib/dbConnect";
import { Hackathon } from "@/models/hackathon.model";
import { Review } from "@/models/review.model";
import { Submission } from "@/models/submission.model";
import { ITeamMember, Team } from "@/models/team.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, {params}: {params: Promise<{_id: string, teamId: string}>}){
    try {
        await dbConnect();
        const { _id, teamId } = await params;
        const team = await Team.findById(teamId);

        if(!team){
            return NextResponse.json(
                new ApiResponse(false, "Team not found")
            )
        }

        const leaderEmail = team.members.filter((member: ITeamMember) => member.role === "leader")[0].collegeEmail;

        await Submission.findOneAndDelete({hackathonId: _id, team: teamId});
        await Review.findOneAndDelete({hackathonId: _id, team: teamId});
        await Team.findByIdAndDelete(teamId);
        await Hackathon.findByIdAndUpdate(_id, {
            $pull: {participants: teamId, participantsEmails: leaderEmail}
        })

        return NextResponse.json(
            new ApiResponse(true, "Team kicked successfully"), {status: 200}
        )

    } catch (error) {
        
    }
}