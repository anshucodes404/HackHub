"use client";

import ProjectSubmission from "@/components/projects/ProjectSubmission";
import Results from "@/components/projects/Results";
import TeamDetails from "@/components/teams/TeamDetails";
import Loader from "@/components/ui/Loader";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
	const hackathonSlug = useParams()?.slug as string
	const [hackathonName, setHackathonName] = useState<string>("")
	const [tagline, setTagline] = useState<string>("")
	const [bannerImage, setBannerImage] = useState<string>("")
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const hackathonData = async () => {
		try {
			const res = await fetch(`/api/hackathons/${hackathonSlug}`).then(res => res.json())
			if(res?.success){
				setHackathonName(res.data.hackathonName)
				setTagline(res.data.tagline)
				setBannerImage(res.data.bannerImage)
			}
		} catch (error) {
			console.error(error)	
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		hackathonData()
	}, [hackathonSlug])

	const [activeTab, setActiveTab] = useState<"details" | "submission" | "results">(
		"details",
	);

	if(isLoading){
		return (
			<div className="flex justify-center items-center h-[70vh]">
				<Loader fullscreen />
			</div>
		)
	}


	return (
		<div className="max-w-6xl w-full mt-12 mx-auto">
			<section>
				<div className="flex">
					{bannerImage && (
						<Image
						height={40}
						width={80}
							src={bannerImage}
							alt="Hackathon Banner"
							className="object-cover rounded-md mr-4"
						/>
					)}
					<div className="">
						<h1 className="text-xl font-bold">{hackathonName}</h1>
						<p>{tagline}</p>
					</div>
				</div>
			</section>

			<main className="max-w-3xl w-full mx-auto my-10 space-y-6">
				<section className="flex justify-center">
					<div className="flex gap-3 py-2 px-3 bg-gray-100 rounded-full">
						<button
							type="button"
							onClick={() => setActiveTab("details")}
							className={`px-4 py-1 rounded-full transition-all ${
								activeTab === "details"
									? "bg-white text-slate-900 shadow-md"
									: "text-gray-600 hover:text-gray-900"
							} `}
						>
							Team Details
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("submission")}
							className={`px-4 py-1 rounded-full transition-all ${
								activeTab === "submission"
									? "bg-white text-slate-900 shadow-md"
									: "text-gray-600 hover:text-gray-900"
							} `}
						>
							Project submission
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("results")}
							className={`px-4 py-1 rounded-full transition-all ${
								activeTab === "results"
									? "bg-white text-slate-900 shadow-md"
									: "text-gray-600 hover:text-gray-900"
							} `}
						>
							Results
						</button>
					</div>
				</section>

				{activeTab === "details" && <TeamDetails />}

				{activeTab === "submission" && <ProjectSubmission />}

				{activeTab === "results" && <Results />}
			</main>
		</div>
	);
};

export default page;
