import dbConnect from "@/lib/dbConnect";
import { Review } from "@/models/review.model";
import { ApiResponse } from "@/utils/ApiResponse";
import {NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: Promise<{_id: string}>}){

    try {
        await dbConnect()
        const {_id} = await params;

        const reviewData = await Review.find({teamId: _id});

        if(!reviewData){
            return NextResponse.json(
            new ApiResponse(false, "Team Data do not exist", null)
        )
        }

        console.log(reviewData)

        return NextResponse.json(
            new ApiResponse(true, "Review data fetched successfully", reviewData)
        )
    } catch (error) {
        return NextResponse.json(
            new ApiResponse(false, "Something went wrong", null, error)
        )
    }
}