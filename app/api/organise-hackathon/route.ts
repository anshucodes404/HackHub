import dbConnect from "@/lib/dbConnect";
import jwtDecode from "@/lib/jwtDecode";
import { Hackathon } from "@/models/hackathon.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export const hackathonReqSchema = z.object({
  hackathonName: z.string(),
  tagline: z.string().optional(),
  description: z.string(),
  rules: z.string().optional(),
  startAt: z.coerce.date(),
  duration: z.string(),
  registrationDeadline: z.coerce.date(),
  minTeamSize: z.coerce.number(),
  maxTeamSize: z.coerce.number(),
  criteria: z.string(),
  bannerImage: z.string().optional(),
  organiserEmail: z.email(),
  socialLink: z.string().optional(),
  webSiteLink: z.string().optional(),
  tags: z.string(),
  mode: z.string(),
  prize: z.string(),
  location: z.string().optional(),
  status: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    const parsedBody = hackathonReqSchema.safeParse(data);
    if (!parsedBody.success) {
      console.log(parsedBody.error.format());
      return NextResponse.json(new ApiResponse(false, "Invalid inputs"), {
        status: 400,
      });
    }

    console.log(parsedBody);

    const { _id, collegeEmail, name } = await (await jwtDecode()).json().then(res => res.data)
    console.log(_id)

    const {
      hackathonName,
      tagline,
      description,
      rules,
      startAt,
      duration,
      registrationDeadline,
      minTeamSize,
      maxTeamSize,
      criteria,
      bannerImage,
      organiserEmail,
      socialLink,
      webSiteLink,
      tags,
      mode,
      prize,
      location,
      status,
    } = parsedBody.data;

    console.log(tags);
    const tagArray = Array.from(tags.split(",")).map(tag => tag.trim().toLowerCase())
    console.log(tagArray);
    await dbConnect();
    const hackathon = await Hackathon.create({
      hackathonName,
      tagline,
      description,
      rules,
      startAt,
      duration,
      organiser: _id,
      organiserName: name,
      registrationDeadline,
      minTeamSize,
      maxTeamSize,
      criteria,
      bannerImage,
      organiserEmail,
      OCEmails: collegeEmail,
      socialLink,
      webSiteLink,
      tags: tagArray,
      mode,
      prize,
      location,
      status
    });

    if (!hackathon) {
      return NextResponse.json(
        new ApiResponse(false, "Hackathon creation failed! Retry Again"),
        { status: 500 }
      );
    }

    return NextResponse.json(
      new ApiResponse(true, "Data recieved and parsed", hackathon),
      { status: 200 }
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while Creating Hackathon",
      error
    );
  }
}
