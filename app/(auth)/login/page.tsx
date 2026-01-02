"use client";

import { useEffect, useState } from "react";
import VerifyOTP from "../../../components/verifyOTP/page";
import type { logInuserObjectType } from "@/types/types";
import { Button, Input } from "@/components/ui";
import { SendHorizontal } from "lucide-react";
import { useUser } from "@/components/UserContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastContext";
import Sending from "@/components/ui/Sending";

const Page = () => {
	const { user } = useUser();
	const router = useRouter();
	const { addToast } = useToast()

	useEffect(() => {
		if (user) router.push("/hackathons");
	}, [user, router]);

	const userObject = {
		collegeEmail: "",
		mode: "",
	};
	const [loginUser, setLoginUser] = useState<logInuserObjectType>(userObject);
	const [isSending, setIsSending] = useState<boolean>(false);
	const [otpSent, setOtpSent] = useState<boolean>(false);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginUser((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSending(true);
		const res = await fetch("/api/send-otp", {
			method: "POST",
			body: JSON.stringify({ collegeEmail: loginUser.collegeEmail, from: "login" }),
		}).then((data) => data.json());
		console.log(res)
		const data = res.data;
		if (res.success) {
			loginUser.mode = data.mode;
			setOtpSent(true);
		} else {
			addToast(res.message || "Failed to send OTP");
			router.push("/signup");
		}

		console.log(data);
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center">
			<form onSubmit={handleSubmit} className="w-full max-w-sm px-4">
				<div className="border border-gray-200 px-6 py-6 shadow-md rounded-2xl bg-white">
					<section className="text-black font-bold text-2xl text-center mb-3">
						Log In to HackHub
					</section>
					<hr className="text-gray-200 mb-3" />
					<Input
						required
						label="College Email"
						name="collegeEmail"
						type="email"
						placeholder="Enter college email"
						value={loginUser.collegeEmail}
						onChange={handleChange}
						className="mb-3"
					/>
					<div className="text-center">
						<Button
							type="submit"
							className="mx-auto flex items-center justify-center gap-2"
						>
							{!isSending ? "Get OTP" : "Sending..."}
							{!isSending && <SendHorizontal size={16} />}

						</Button>
					</div>
				</div>
			</form>

			{otpSent && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-white/10 backdrop-blur-md">
					<VerifyOTP user={loginUser} />
				</div>
			)}
		</div>
	);
};

export default Page;
