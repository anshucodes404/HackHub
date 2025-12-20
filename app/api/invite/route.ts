import { type NextRequest, NextResponse } from "next/server";
import { sendInviteEmail } from "@/Emails/sendInviteEmail";
import dbConnect from "@/lib/dbConnect";
import jwtDecode from "@/lib/jwtDecode";
import { Invite } from "@/models/invite.model";
import { Team } from "@/models/team.model";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req: NextRequest) {
	//TODO: isme ek document banana hai per team usme members ka email ka field aur model me banana hai aur har request pe bas append karet jana hai emails,
	try {
		let inviteLink: string = "";
		console.log("Request");
		await dbConnect();
		const body = await req.json();
		console.log(body);

		const { _id, name, collegeEmail } = await (await jwtDecode())
			.json()
			.then((res) => res.data);

		const { hackathonId, membersEmail, hackathonName, rules } = body;

		const teamMembersEmail = membersEmail.map((email: string) =>
			email.toLowerCase().concat("@kiit.ac.in"),
		);

		if (
			!hackathonId ||
			!membersEmail ||
			!hackathonName ||
			!Array.isArray(membersEmail)
		) {
			return NextResponse.json(new ApiResponse(false, "Details not enough"), {
				status: 400,
			});
		}


		const teamDetails = await Team.findOne({
			leader: _id,
			hackathonId,
		}).populate({ path: "hackathonId", select: "tagline" });
		console.log(teamDetails);

		if (!teamDetails) {
			return NextResponse.json(new ApiResponse(false, "Team not found"), {
				status: 404,
			});
		}

		const inviteExists = await Invite.findOne({ teamId: teamDetails._id });
		const status = teamMembersEmail.map((email: string) => ({
			email,
			status: "pending",
		}));
		console.log(teamMembersEmail);
		console.log(status);
		const InviteData = {
			teamId: teamDetails._id,
			hackathonName: teamDetails.hackathonName,
			tagline: teamDetails.hackathonId.tagline,
			teamName: teamDetails.name,
			inviterName: name,
			inviterEmail: collegeEmail,
			membersEmail: teamMembersEmail,
			status,
			rules: rules?.split(","),
			expiresAt: new Date(Date.now() + 96 * 60 * 60 * 1000),
		};

		if (inviteExists) {
			await Invite.findByIdAndUpdate(inviteExists._id, {
				$push: {
					membersEmail: { $each: teamMembersEmail },  //each operator se sara elements single-single push hoga
					status: { $each: status },
				},
			});

			inviteLink = `https://hack-hub-two.vercel.app/accept-invite/${inviteExists._id}`;
		} else {
			const invite = await Invite.create(InviteData);
			if (!invite) {
				return NextResponse.json(new ApiResponse(false, "Invitation failed"), {
					status: 500,
				});
			}
			inviteLink = `https://hack-hub-two.vercel.app/accept-invite/${invite._id}`;
		}

		const { name: teamName } = teamDetails;

		await sendInviteEmail(
			teamMembersEmail,
			teamName,
			inviteLink,
			hackathonName,
			name,
		);

		return NextResponse.json(new ApiResponse(true, "Email sent successfully"), {
			status: 200,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			new ApiResponse(false, "Email sending failed", "", error),
			{ status: 500 },
		);
	}
}

export async function GET(req: NextRequest) {
	console.log("Request recieved");
	try {
		await dbConnect();
		const searchParams = req.nextUrl.searchParams;
		const inviteId = searchParams.get("inviteId");

		if (!inviteId) {
			return NextResponse.json(new ApiResponse(false, "Team ID is missing"), {
				status: 400,
			});
		}

		const InviteData = await Invite.findById(inviteId).select(
			"-expiresAt -createdAt",
		);

		if (!InviteData) {
			return NextResponse.json(new ApiResponse(false, "Invitation not found"), {
				status: 500,
			});
		}

		return NextResponse.json(
			new ApiResponse(true, "Team Data Fetched", InviteData),
			{ status: 200 },
		);
	} catch (_) {
		return NextResponse.json(
			new ApiResponse(
				false,
				"Something went wrong while fetching invitation data",
			),
		);
	}
}
