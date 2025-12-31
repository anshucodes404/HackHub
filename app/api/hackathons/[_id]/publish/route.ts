import dbConnect from "@/lib/dbConnect";
import { Hackathon } from "@/models/hackathon.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ _id: string }> }) {
    try {
        await dbConnect()
        const { _id } = await params;

        await Hackathon.findByIdAndUpdate(_id, { status: "published" })
        return NextResponse.json(new ApiResponse(true, "Hackathon published successfully"), { status: 200 })
    } catch (error) {
        return NextResponse.json(new ApiResponse(false, "Failed to publish hackathon"), { status: 500 })
    }
}