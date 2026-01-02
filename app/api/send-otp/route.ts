import dbConnect from "@/lib/dbConnect";
import { sendOTP } from "@/Emails/sendOtpEmail";
import { OTP } from "@/models/otp.model";
import type { IUser } from "@/models/user.model";
import { User } from "@/models/user.model";
import { ApiResponse } from "@/utils/ApiResponse";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";

const reqSchema = z.object({
	collegeEmail: z.email(),
	from: z.enum(["login", "signup"]),
});

export async function POST(req: NextRequest) {
	const body = await req.json();

	const parsedBody = reqSchema.safeParse(body);
	if (!parsedBody.success) {
		return NextResponse.json(new ApiResponse(false, "Email is missing"), {
			status: 400,
		});
	}

	const { collegeEmail, from } = parsedBody.data;

	await dbConnect();

	try {
    console.log("OTP request")
		const existingUser: IUser | null = await User.findOne({ collegeEmail });

		if(from === "signup" && existingUser){
			return NextResponse.json(new ApiResponse(false, "User already exists, Log in instead"), {status: 307});
		}

		if(from === "login" && !existingUser){
			return NextResponse.json(new ApiResponse(false, "User does not exist, Sign up first"), {status: 307});
		}

		// console.log(existingUser)

		// if(!existingUser){
		// 	return NextResponse.json(new ApiResponse(false, "User does not exist, Sign up first"), {status: 307});
		// }

		const mode = existingUser ? "login" : "signup";

		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		await OTP.deleteMany({ collegeEmail });

	 const otpGenerated =	await OTP.create({
			collegeEmail,
			otp,
			expiresAt: new Date(Date.now() + 5 * 60 * 1000),
		});

    console.log(otpGenerated)

		await sendOTP(collegeEmail, otp, mode, existingUser);

		return NextResponse.json(
			new ApiResponse(true, `OTP sent successfully to email ${collegeEmail}`, {
				mode,
			}),
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error occured while sending otp");
		return NextResponse.json(
			new ApiResponse(false, "Error occured while sending otp", "", error),
			{ status: 500 },
		);
	}
}
