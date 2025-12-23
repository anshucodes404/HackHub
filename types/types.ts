export type signInuserObjectType = {
	name: string;
	mobileNumber: string;
	collegeEmail: string;
	email: string;
	hostelEmail: string;
	branch: string;
	hostel: string;
	studyYear: string;
	githubLink?: string;
	LinkedInLink?: string;
	mode: string;
};

export type logInuserObjectType = {
	collegeEmail: string;
	mode: string;
};

export type loginUser = {
	collegeEmail: string;
	otp: string;
	mode: string;
};

export type signupUser = {
	name: string;
	mobileNumber: string;
	collegeEmail: string;
	email: string;
	hostelEmail: string;
	branch: string;
	hostel: string;
	studyYear: string;
	githubLink?: string;
	LinkedInLink?: string;
	mode: string;
	otp: string;
};

export type verifyOTPProps = {
	user: signInuserObjectType | logInuserObjectType;
};

export interface HackathonCardProps {
	_id: string;
	hackathonName: string;
	mode: string;
	location?: string;
	tagline: string;
	organiserName: string;
	duration: string;
	minTeamSize: number;
	maxTeamSize: number;
	startAt: Date;
	registrationDeadline: Date;
	tags: string[];
	participants?: string[];
	slug: string;
	prize: string;
	status: string;
	bannerImage?: string;
	btnText: string;
	origin?: string
}

export type DetailedHackathon = {
	_id: string;
	hackathonName: string;
	mode: "online" | "inplace";
	location?: string;
	tagline?: string;
	description: string;
	paricipants?: string[];
	rules?: string;
	organiser: string;
	organiserName: string;
	startAt: Date;
	duration: string;
	registrationDeadline: Date;
	minTeamSize: number;
	maxTeamSize: number;
	criteria: string;
	bannerImage?: string;
	organiserEmail: string;
	socialLink?: string;
	webSiteLink?: string;
	tags?: string[];
	status: "draft" | "open" | "ended" | "upcoming";
	createdAt: Date;
	updatedAt: Date;
	prize: string;
};

export type Invite = {
	_id: string;
	teamId: string;
	hackathonName: string;
	tagline: string;
	teamName: string;
	inviterName: string;
	inviterEmail: string;
	status: "pending" | "accepted" | "declined";
	rules: string[];
};

export type ParticipatedHackathonCardProps = {
	hackathonId: string;
	hackathonName: string;
	bannerImage?: string;
	teamName: string;
	teamId: string;
	startAt: Date;
	mode: string;
	location?: string;
	organiserName: string;
	minTeamSize: number;
	maxTeamSize: number;
	status: string;
	hackathonStatus: string;
	teamStatus: string;
	role: string;
};

export type HackathonDetailsProps = {
	hackathonId: string;
	bannerImage?: string;
	hackathonName: string;
	tagline?: string;
	status?: string;
	startAt: string;
	duration: string;
	minTeamSize: number;
	maxTeamSize: number;
	mode: "online" | "inplace";
	location?: string;
	description: string;
	rules?: string;
	criteria: string;
	tags?: string[];
	webSiteLink?: string;
	socialLink?: string;
};

export type Query = {
	hackathonName?: { $regex: string; $options: string };
	mode?: string;
	status?: { $in: string[] } | { $ne: string };
	tags?: { $in: string[] };
};

export type TeamDetails = {
	_id: string;
	name: string;
	role: "leader" | "member";
	collegeEmail: string;
	members: {
		userId: {
			profileImageUrl?: string;
		};
		role: "leader" | "member";
		name: string;
		collegeEmail: string;
	}[];
};
