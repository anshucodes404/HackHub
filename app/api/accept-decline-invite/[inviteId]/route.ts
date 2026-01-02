import dbConnect from "@/lib/dbConnect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwtDecode from "@/lib/jwtDecode";
import { ApiResponse } from "@/utils/ApiResponse";
import { Team } from "@/models/team.model";
import { sendDeclineEmail } from "@/Emails/sendDeclineEmail";
import { sendAcceptEmail } from "@/Emails/sendAcceptEmail";
import { Invite } from "@/models/invite.model";
import type {ITeamMember} from "@/models/team.model"

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ inviteId: string }> },
) {
	try {
		console.log("Request");
		const { inviteId } = await params;
		const { action, teamId } = await req.json();
		await dbConnect();
		console.log("Team Id: ", inviteId);
		const { _id, name, collegeEmail } = await (await jwtDecode())
			.json()
			.then((res) => res.data);

		if (!inviteId) {
			console.error("Team ID is missing");
			return NextResponse.json(new ApiResponse(false, "Team ID is missing"), {
				status: 400,
			});
		}

		const team = await Team.findById(teamId);
		if(!team){
			return NextResponse.json(new ApiResponse(false, "Team not found"), {
				status: 404,
			});
		}

		const userAlreadyMember = team.members.some((member: ITeamMember) => member.collegeEmail === collegeEmail)

		if(userAlreadyMember){
			return NextResponse.json(new ApiResponse(false, "You are already a member of the team"), {status: 400})
		}

		const invite = await Invite.findById(inviteId)

		if (action === "accept") {
			const member = {
				userId: _id,
				name: name,
				collegeEmail: collegeEmail,
			};

		

			const team = await Team.findByIdAndUpdate(
				teamId,
				{
					$push: { members: member },
				},
				{ new: true },
			);
			if (!team) {
				console.error("Invitation accept failed");
				return NextResponse.json(
					new ApiResponse(false, "Invitation accept failed"),
					{ status: 500 },
				);
			}

			invite.status.map((inv: {email: string, status: string}) => {
				if(inv.email === collegeEmail){
					inv.status = "accepted"
				}
			})
			await invite.save()
			const leader = team.members.filter(
				(member: { role: string }) => member.role === "leader",
			)[0];

			await sendAcceptEmail({
				teamLeaderEmail: leader.collegeEmail,
				teamLeaderName: leader.name,
				accepterName: name,
				accepterEmail: collegeEmail,
				hackathonName: team.hackathonName,
				teamName: team.name,
			});

			return NextResponse.json(new ApiResponse(true, "Invitation accepted"), {
				status: 201,
			});
		} else {  //? If declined
	
			const team = await Team.findById(teamId);
			
			if (!team) {
				return NextResponse.json(new ApiResponse(false, "Team not found"), {
					status: 404,
				});
			}

			const leader = team.members.filter(
				(member: { role: string }) => member.role === "leader",
			)[0];

			invite.status.map((inv: {email: string, status: string}) => {
				if(inv.email === collegeEmail){
					console.log("rejected")
					inv.status = "rejected"
				}
			})
			await invite.save()

			console.log(invite)

			const res = await sendDeclineEmail({
				teamLeaderName: leader.name,
				teamLeaderEmail: leader.collegeEmail,
				declinerName: name,
				declinerEmail: collegeEmail,
				hackathonName: team.hackathonName,
				teamName: team.name,
			});

			if (!res.success) {
				console.error("Email sending failed");
				return NextResponse.json(
					new ApiResponse(false, "Email Sending failed", "", res.error),
					{ status: 500 },
				);
			}

			return NextResponse.json(
				new ApiResponse(true, "Email Sent Successfully"),
				{ status: 201 },
			);
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			new ApiResponse(false, "Invitation operation failed", "", error),
			{ status: 500 },
		);
	}
}
