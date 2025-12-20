import dbConnect from "@/lib/dbConnect";
import { Review } from "@/models/review.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod";

const reviewSchema = z.object({
    hackathonId: z.string(),
    teamId: z.string(),
    comments: z.string().min(1),
    score: z.number().min(0).max(100),
});

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { hackathonId, teamId, comments, score } = body;

        const parsedData = reviewSchema.safeParse({ hackathonId, teamId, comments, score });
        console.log(parsedData)
        
        if(!parsedData.success){
             return NextResponse.json(
                new ApiResponse(false, "Data validation error", null, parsedData.error),
            { status: 500 }
        );
        }

        const review = await Review.create({
            hackathonId: parsedData.data.hackathonId,
            teamId: parsedData.data.teamId,
            comments: parsedData.data.comments,
            score: parsedData.data.score,
        })

        return NextResponse.json(
            new ApiResponse(true, "Review submitted successfully", review),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error submitting review:", error);
        return NextResponse.json(
            new ApiResponse(false, "Failed to submit review", null, error),
            { status: 500 }
        );
    }
}
