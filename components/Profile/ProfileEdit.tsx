// biome-ignore assist/source/organizeImports: <>
import type React from "react";
import { useState, useEffect } from "react";
import { Button, Input, Section } from "../ui";
import { X } from "lucide-react";
import { useToast } from "../ToastContext";
import { useUser } from "../UserContext";
import Loader from "../ui/Loader";
import ProfileImageEdit from "../ProfileImageEdit";
import uploadOnCloudinary from "@/lib/uploadOnCloudinary";


type User = {
	name: string;
	profileImageUrl?: string;
	mobileNumber: string;
	collegeEmail: string;
	email: string;
	hostelEmail: string;
	branch: string;
	hostel: string;
	studyYear: string;
	githubLink?: string;
	LinkedInLink?: string;
	createdAt: string;
	updatedAt: string;
};

interface UserDataProps {
	user: User;
	isEditOpen: boolean;
	onClose: () => void;
}

const ProfileEdit: React.FC<UserDataProps> = ({
	user,
	isEditOpen,
	onClose,
}) => {
	const [tempUser, setTempUser] = useState<User>(user as User);
	const [saving, setSaving] = useState(false);
	const { addToast } = useToast();
	const { setUser } = useUser();
	const [uploading, setUploading] = useState(false)

	useEffect(() => {
		if (isEditOpen) {
			setTempUser(user);
		}
	}, [isEditOpen, user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTempUser((prev) => ({ ...prev, [name]: value }));
	};



	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const res = await fetch(`/api/user`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(tempUser),
			}).then((res) => res.json());

			if (res.success) {
				addToast(res.message);
			} else {
				addToast("Failed to update profile");
			}
			setUser(res.data);
			onClose();
		} catch (err) {
			console.error("Failed to save profile", err);
		} finally {
			setSaving(false);
		}
	};

	const uploadImage = async (file: File) => {
		addToast("Uploading image...")
		setUploading(true)
		const url = await uploadOnCloudinary(file, "profile_images");
		if (url) {
			setTempUser(prev => ({ ...prev, profileImageUrl: url }))
		}
		setUploading(false)
		addToast("Image uploaded")
	}

	if (!isEditOpen) return null;

	return (
		<div className="fixed inset-0 z-30 flex items-center justify-center">
			<form
				onSubmit={handleSubmit}
				className="relative z-10 max-w-4xl w-full mx-4 bg-white rounded-2xl shadow-xl p-6 max-h-[75vh] overflow-auto no-scrollbar"
			>
				<div>
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">Edit Profile</h3>

						<button
							type="button"
							onClick={onClose}
							className="text-gray-500 hover:text-gray-800"
						>
							<X size={20} />
						</button>
					</div>

					<section className="flex justify-center">
						<ProfileImageEdit src={tempUser.profileImageUrl} name={tempUser.name} size={100} uploadImage={uploadImage} />
					</section>

					<Section title="Personal Details">
						<div className="grid md:grid-cols-2 gap-5 mb-3">
							<Input
								required
								label="Name"
								name="name"
								onChange={handleChange}
								type="text"
								placeholder="Enter your name"
								value={tempUser.name}
							/>

							<Input
								required
								label="Mobile Number"
								name="mobileNumber"
								onChange={handleChange}
								value={tempUser.mobileNumber}
								type="text"
								placeholder="Enter mobile number"
							/>
						</div>

						<Input
							required
							label="Personal Email"
							onChange={handleChange}
							type="email"
							name="email"
							placeholder="Enter your personal email"
							value={tempUser.email}
						/>
					</Section>

					<Section title="Academic Details">
						<div className="grid md:grid-cols-2 gap-5 mb-3">
							<Input
								required
								label="College Email"
								name="collegeEmail"
								onChange={handleChange}
								type="email"
								placeholder="Enter college Email ID"
								value={tempUser.collegeEmail}
							/>

							<Input
								required
								label="Hostel Email"
								name="hostelEmail"
								placeholder="Enter Hostel Email"
								type="email"
								value={tempUser.hostelEmail}
								onChange={handleChange}
							/>
						</div>

						<div className="grid md:grid-cols-3 gap-5 mb-3">
							<Input
								required
								label="Branch"
								name="branch"
								placeholder="Enter your branch"
								type="text"
								value={tempUser.branch}
								onChange={handleChange}
							/>

							<Input
								required
								label="Hostel Name"
								name="hostel"
								placeholder="Enter Hostel name"
								type="text"
								value={tempUser.hostel}
								onChange={handleChange}
							/>

							<Input
								required
								label="Year of Study"
								name="studyYear"
								placeholder="Enter year of Study"
								type="text"
								value={tempUser.studyYear}
								onChange={handleChange}
							/>
						</div>
					</Section>

					<Section title="Additional Links">
						<Input
							className="mb-3"
							label="Github Link"
							name="githubLink"
							onChange={handleChange}
							type="text"
							placeholder="Enter github link"
							value={tempUser.githubLink}
						/>

						<Input
							label="LinkedIn Profile"
							name="LinkedInLink"
							onChange={handleChange}
							type="text"
							placeholder="Enter LinkedIn Profile"
							value={tempUser.LinkedInLink}
						/>
					</Section>

					<div className="mt-4 flex justify-end gap-3">
						<Button type="button" onClick={onClose} variant="secondary">
							Cancel
						</Button>
						<Button className="disabled:bg-blue-700" type="submit" disabled={saving || uploading}>
							{saving ? "Saving..." : "Save"}
						</Button>
					</div>
				</div>
				{saving &&
					(
						<div className="absolute inset-0 z-40 flex items-center justify-center bg-white/60 backdrop-blur-sm">
							<Loader />
						</div>
					)}
			</form>
		</div>
	);
};

export default ProfileEdit;
