import dbConnect from "@/lib/dbConnect";
import { Hackathon } from "@/models/hackathon.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ApiResponse } from "@/utils/ApiResponse";


//get the oc members of a hackathon
export async function GET(req: NextRequest, { params }: { params: Promise<{ _id: string }> }) {
    try {
        await dbConnect();
        const { _id } = await params;

        const ocMembers = await Hackathon.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(_id) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "OCEmails",
                    foreignField: "collegeEmail",
                    as: "ocMembers"
                }
            },
            {
                $project: {
                    _id: 0,
                    ocMembers: {
                        $map: {
                            input: "$ocMembers",
                            as: "member",
                            in: {
                                _id: "$$member._id",
                                name: "$$member.name",
                                collegeEmail: "$$member.collegeEmail",
                                profileImage: "$$member.profileImageUrl"
                            }
                        }
                    }
                }
            }
        ])

        if (!ocMembers || ocMembers.length === 0) {
            return NextResponse.json(
                new ApiResponse(false, "No OC Members found"), { status: 404 }
            )
        }

        console.log(ocMembers);

        return NextResponse.json(
            new ApiResponse(true, "OC Members fetched successfully", ocMembers[0].ocMembers), { status: 200 }
        )

    } catch (_) {
        return NextResponse.json(
            new ApiResponse(false, "Failed to fetch OC Members"), { status: 500 }
        )
    }
}


//add new oc members to a hackathon
export async function POST(req: NextRequest, { params }: { params: Promise<{ _id: string }> }) {
    try {
        await dbConnect();
        const { _id } = await params;
        let { email } = await req.json();

        email = email.toLowerCase().concat("@kiit.ac.in");


        await Hackathon.findByIdAndUpdate(_id, {
            $addToSet: { OCEmails: email }
        })

        return NextResponse.json(
            new ApiResponse(true, "OC Member added successfully"), { status: 200 }
        )
    } catch (_) {
        return NextResponse.json(
            new ApiResponse(false, "Failed to add OC Member"), { status: 500 }
        )
    }
}


//remove oc member from a hackathon
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ _id: string }> }) {
    try {
        await dbConnect();
        const { _id } = await params;
        const { email } = await req.json();

        await Hackathon.findByIdAndUpdate(_id, {
            $pull: { OCEmails: email }
        })

        return NextResponse.json(
            new ApiResponse(true, "OC Member removed successfully"), { status: 200 }
        )
    } catch (_) {
        return NextResponse.json(
            new ApiResponse(false, "Failed to remove OC Member"), { status: 500 }
        )
    }
}   