import dbConnect from "@/lib/dbConnect";
import jwtDecode from "@/lib/jwtDecode";
import { Team } from "@/models/team.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await dbConnect();
		const { _id } = await (await jwtDecode()).json().then((res) => res.data);

		const userID = new Types.ObjectId(_id);

		//here writing the aggregate pipeline to look for user in teams and returing the hackathons in which the user has participated
		const hackathons = await Team.aggregate([
			{
				$match: {
					"members.userId": userID,
				},
			},
			{
				$lookup: {
					from: "hackathons",
					localField: "hackathonId",
					foreignField: "_id",
					as: "hackathonDetails",
				},
			},
			{ $unwind: "$hackathonDetails" },
			{
				$project: {
					_id: 0,
					hackathonId: "$hackathonDetails._id",
					hackathonName: "$hackathonDetails.hackathonName",
					bannerImage: "$hackathonDetails.bannerImage",
					startAt: "$hackathonDetails.startAt",
					mode: "$hackathonDetails.mode",
					location: "$hackathonDetails.location",
					organiserName: "$hackathonDetails.organiserName",
					minTeamSize: "$hackathonDetails.minTeamSize",
					maxTeamSize: "$hackathonDetails.maxTeamSize",
					hackathonStatus: "$hackathonDetails.status",
					teamName: "$name",
					teamId: "$_id",
					teamStatus: "$status",
					role: {
						$arrayElemAt: [
							{
								$map: {
									input: {
										$filter: {
											input: "$members",
											as: "member",
											cond: { $eq: ["$$member.userId", userID] }
										}
									},
									as: "m",
									in: "$$m.role"
								}
							},
							0
						]
					}
				}
			}
		]);

		console.log(hackathons)

		return NextResponse.json(
			new ApiResponse(true, "Hackathons fetched successfully", hackathons)
		)
	} catch (error) {
		return NextResponse.json(
			new ApiResponse(false, "Something went wrong", null, error),
		);
	}
}
