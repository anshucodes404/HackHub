"use client"
import { Funnel, User } from "lucide-react";
import HackathonCardMyHacks from "@/components/hackathons/HackathonCardMyHacks";
import MyHacksCard from "@/components/MyHacksCard";
import StatsCard from "@/components/StatsCard";
import { Input } from "@/components/ui";
import { useEffect, useState } from "react";
import { ParticipatedHackathonCardProps } from "@/types/types";
import Loader from "@/components/ui/Loader";

const page = () => {
	const [hackathons, setHackathons] = useState<ParticipatedHackathonCardProps[]>([]);	
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchHackathonsData = async () => {
		try {
			
			const response = await fetch(`/api/hackathons/participated/`, {method: "GET"}).then(res => res.json()).then(data => data.data)
			console.log(response)
			setHackathons(response)

		} catch (error) {
			console.error("Something went wrong while fetching data!!!, Try again", error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchHackathonsData()
	}, [])

	if(isLoading) return <Loader fullscreen />;


	return (
		<div className="w-full mx-auto max-w-7xl h-screen flex flex-col">
			<section className="bg-white px-10 pb-8 pt-24 border-b border-gray-200">
				<h1 className="text-4xl font-bold text-center mb-8">
					My Participated Hackathons
				</h1>

				<section className="flex gap-5 flex-wrap">
					<StatsCard
						title="Total Hackathons"
						value={5}
						icon={<User size={20} />}
						color="text-blue-700"
						bgColor="bg-blue-200/50"
						borderColor="border-blue-500"
					/>
					<StatsCard
						title="Teams Joined"
						value={3}
						icon={<User size={20} />}
						color="text-green-700"
						bgColor="bg-green-200/50"
						borderColor="border-green-500"
					/>
					<StatsCard
						title="Projects"
						value={2}
						icon={<User size={20} />}
						color="text-amber-700"
						bgColor="bg-amber-200/50"
						borderColor="border-amber-500"
					/>
					<StatsCard
						title="Awards"
						value={1}
						icon={<User size={20} />}
						color="text-violet-700"
						bgColor="bg-violet-200/50"
						borderColor="border-violet-500"
					/>
					
				</section>

				<section className="mt-10">
					<div className="flex gap-1.5 items-center mb-1">
						<Funnel size={20} /> Filters
					</div>
					<div className="flex gap-2">
						<Input
							type="text"
							placeholder="Search Hackathons..."
							className="w-2xl"
						/>
						<div className="grid grid-cols-4 gap-4 w-full max-w-5xl">
							<select
								name="status"
								id="status"
								className="rounded-lg px-2 border border-gray-300 min-w-20"
							>
								<option value="all">All</option>
								<option value="upcoming">Upcoming</option>
								<option value="ongoing">Ongoing</option>
								<option value="ended">Ended</option>
							</select>
							<select
								name="mode"
								id="mode"
								className="rounded-lg px-2 border border-gray-300"
							>
								<option value="all">All</option>
								<option value="online">Online</option>
								<option value="offline">Offline</option>
							</select>
							<select
								name="role"
								id="role"
								className="rounded-lg px-2 border border-gray-300"
							>
								<option value="all">All</option>
								<option value="online">Leader</option>
								<option value="offline">Member</option>
							</select>

							<select
								
								name="team-status"
								id="team-status"
								className="rounded-lg px-2 border border-gray-300"
							>
								<option value="N/A">N/A</option>
								<option value="Won">Won</option>
								<option value="Disqualified">Disqualified</option>
							</select>
						</div>
					</div>
				</section>
			</section>

			<main className="flex-1 overflow-auto px-10 py-6 no-scrollbar">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					{hackathons.map((h) => (
						<MyHacksCard key={h.hackathonId} hackathon={h} />
					))}
				</div>
			</main>
		</div>
	);
};

export default page;
