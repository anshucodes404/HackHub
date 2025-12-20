"use server";

import { v2 as cloudinary } from "cloudinary";
import jwtDecode from "@/lib/jwtDecode";
import { type NextRequest, NextResponse } from "next/server";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
	console.error("Cloudinary environment variables are missing");
}

export async function GET(req: NextRequest) {
	if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
		return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
	}

	const folder = req.nextUrl.searchParams?.get("folder");

	const authResponse = await jwtDecode();
	const authData = await authResponse.json();

	if (!authData.success) {
		return NextResponse.json({ success: false, message: "Not authorized" });
	}

	cloudinary.config({
		cloud_name: CLOUD_NAME,
		api_key: API_KEY,
		api_secret: API_SECRET,
	});

	const paramsToSign = {
		timestamp: Math.floor(Date.now() / 1000),
		folder: folder,
	};

	const signature = cloudinary.utils.api_sign_request(
		paramsToSign,
		API_SECRET as string,
	);


	const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

	return NextResponse.json({
		success: true,
		data: {
			uploadUrl,
			signature: signature,
			apiKey: API_KEY,
			cloudName: CLOUD_NAME,
			timestamp: paramsToSign.timestamp,
			folder: paramsToSign.folder,
		},
	});
}
