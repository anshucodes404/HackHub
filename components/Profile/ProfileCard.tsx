"use client";

import { useState } from "react";
import {
	User,
	Mail,
	Github,
	Linkedin,
	CalendarSync,
	MapPin,
	GraduationCap,
	SquarePen,
	Smartphone,
	Trash2,
} from "lucide-react";
import { useUser } from "../UserContext";
import ProfileEdit from "./ProfileEdit";
import ProfileImageView from "../ProfileImageView";
import DeleteProfile from "../DeleteProfile";
import { useRouter } from "next/navigation";
import Loader from "../ui/Loader";

export default function ProfileCard() {
	const { user } = useUser();
	const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter()

	const handleDeleteProfile = async () => {
		try {
			setIsLoading(true);
			const res = await fetch("/api/user", {
				method: "DELETE"
			}).then(res => res.json())

			if(res.success){
				setIsLoading(false);
				router.push("/");
			}

		} catch (error) {
			
		}
	}

	if(isLoading) return <Loader fullscreen />

	if (!user)
		return (
			<div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 text-center">
				User not found
			</div>
		);

	return (
		<>
			<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden w-2xl">
				<div className="p-6 sm:p-8 flex flex-col gap-6">
					<div className="flex flex-col justify-center items-center relative">
						<div className="flex gap-2 absolute top-0 right-0 ">
							<button
								type="button"
								title="Edit Profile"
								onClick={() => setIsEditOpen(true)}
								className=" text-gray-400 hover:text-blue-600 transition-all p-2"
							>
								<SquarePen size={20} />
							</button>
							<button
								type="button"
								title="Delete Profile"
								onClick={() => setIsDeleteOpen(true)}
								className=" text-red-400 hover:text-red-600 transition-all p-2"
							>
								<Trash2 size={20} />
							</button>

						</div>

						<ProfileImageView src={user.profileImageUrl} name={user.name} size={100} />

						<div className="mt-3 text-sm text-slate-500 text-center">
							Member since {new Date(user.createdAt).toLocaleDateString()}
						</div>
					</div>

					<div className="flex-1">
						<div className="flex items-center justify-between">
							<div className="flex flex-col">
								<h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
									{user.name}
								</h1>
								<p className="flex text-sm text-slate-500 gap-2 items-center mt-1">
									<Smartphone size={16} />
									<span>{user.mobileNumber}</span>
								</p>
							</div>

							<div className="flex items-center gap-3">
								{user.githubLink && (
									<a
										href={user.githubLink}
										target="_blank"
										className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm shadow-sm"
									>
										<Github size={16} /> GitHub
									</a>
								)}
								{user.LinkedInLink && (
									<a
										href={user.LinkedInLink}
										target="_blank"
										className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm shadow-sm"
									>
										<Linkedin size={16} /> LinkedIn
									</a>
								)}
							</div>
						</div>

						<hr className="my-5 border-slate-300/70" />

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-start gap-3">
								<div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
									<Mail size={18} />
								</div>
								<div>
									<div className="text-xs text-slate-400">College Email</div>
									<div className="text-sm text-slate-800">
										{user.collegeEmail}
									</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
									<User size={18} />
								</div>
								<div>
									<div className="text-xs text-slate-400">Personal Email</div>
									<div className="text-sm text-slate-800">{user.email}</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="p-2 rounded-lg bg-amber-50 text-amber-600">
									<MapPin size={18} />
								</div>
								<div>
									<div className="text-xs text-slate-400">Hostel</div>
									<div className="text-sm text-slate-800">
										{user.hostel} — {user.hostelEmail}
									</div>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<div className="p-2 rounded-lg bg-violet-50 text-violet-600">
									<GraduationCap size={18} />
								</div>
								<div>
									<div className="text-xs text-slate-400">Branch & Year</div>
									<div className="text-sm text-slate-800">
										{user.branch} • Year {user.studyYear}
									</div>
								</div>
							</div>
						</div>

						<hr className="my-5 border-slate-100" />

						<div className="flex items-center justify-between text-sm text-slate-500">
							<div className="flex items-center gap-3">
								<CalendarSync size={16} />
								<span>
									Updated {new Date(user.updatedAt).toLocaleDateString()}
								</span>
							</div>

							<div className="text-center">
								<div className="text-xs text-slate-400">User Roll No.</div>
								<div className="text-xs text-slate-600 font-medium font-mono">
									{user.collegeEmail.split("@")[0]}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ProfileEdit
				user={user}
				isEditOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
			/>

			{
				isDeleteOpen && <DeleteProfile onClose={() => setIsDeleteOpen(false)} deleteProfile={() => handleDeleteProfile()} />
			}

		</>
	);
}
