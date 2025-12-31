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
	const [filteredHackathons, setFilteredHackathons] = useState<ParticipatedHackathonCardProps[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [filters, setFilters] = useState({
		search: "",
		status: "all",
		mode: "all",
		role: "all",
		teamStatus: "N/A"
	});

	const fetchHackathonsData = async () => {
		try {
			const response = await fetch(`/api/hackathons/participated/`, { method: "GET" }).then(res => res.json()).then(data => data.data)
			console.log(response)
			setHackathons(response)
			setFilteredHackathons(response)

		} catch (error) {
			console.error("Something went wrong while fetching data!!!, Try again", error)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchHackathonsData()
	}, [])

	useEffect(() => {
		let result = hackathons;
		if (filters.search) {
			result = result.filter(h => h.hackathonName.toLowerCase().includes(filters.search.toLowerCase()));
		}


		if (filters.status !== "all") {
			result = result.filter(h => h.hackathonStatus === filters.status);
		}

		if (filters.mode !== "all") {
			result = result.filter(h => h.mode === filters.mode);
		}

		if (filters.role !== "all") {
			result = result.filter(h => h.role === filters.role);
		}

		if (filters.teamStatus !== "N/A") {
			result = result.filter(h => h.teamStatus === filters.teamStatus);
		}

		setFilteredHackathons(result);
	}, [filters, hackathons]);

	const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
		const { name, value } = e.target;
		setFilters(prev => ({ ...prev, [name]: value }));
	};

	if (isLoading) return <Loader fullscreen />;


	return (
		<div className="w-full mx-auto max-w-7xl h-screen flex flex-col">
			<section className="bg-white px-10 pb-8 pt-24 border-b border-gray-200 sticky top-0 z-10">
				<h1 className="text-4xl font-bold text-center mb-8">
					My Participated Hackathons
				</h1>

				<section className="mt-6 flex flex-col md:flex-row gap-4 justify-between items-end">
					<div className="w-full md:w-1/3">
						<Input
							label="Hackathon Name"
							name="search"
							type="text"
							placeholder="Search Hackathon..."
							className="w-full"
							value={filters.search}
							onChange={handleFilterChange}
						/>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-2/3">
						<div className="flex flex-col gap-1">
							<label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
							<div className="relative">
								<select
									name="status"
									id="status"
									value={filters.status}
									onChange={handleFilterChange}
									className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 appearance-none bg-white"
								>
									<option value="all">All</option>
									<option value="upcoming">Upcoming</option>
									<option value="published">Published</option>
									<option value="ended">Ended</option>
								</select>
								<Funnel className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label htmlFor="mode" className="text-sm font-medium text-gray-700">Mode</label>
							<div className="relative">
								<select
									name="mode"
									id="mode"
									value={filters.mode}
									onChange={handleFilterChange}
									className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 appearance-none bg-white"
								>
									<option value="all">All</option>
									<option value="online">Online</option>
									<option value="inplace">In Place</option>
								</select>
								<Funnel className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
							<div className="relative">
								<select
									name="role"
									id="role"
									value={filters.role}
									onChange={handleFilterChange}
									className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 appearance-none bg-white"
								>
									<option value="all">All</option>
									<option value="leader">Leader</option>
									<option value="member">Member</option>
								</select>
								<Funnel className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label htmlFor="teamStatus" className="text-sm font-medium text-gray-700">Team Result</label>
							<div className="relative">
								<select
									name="teamStatus"
									id="teamStatus"
									value={filters.teamStatus}
									onChange={handleFilterChange}
									className="w-full rounded-lg border-gray-300 border px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 appearance-none bg-white"
								>
									<option value="N/A">All</option>
									<option value="Won">Won</option>
									<option value="Disqualified">Disqualified</option>
									<option value="Registered">Registered</option>
								</select>
								<Funnel className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
							</div>
						</div>
					</div>
				</section>
			</section>

			<main className="flex-1 overflow-auto px-10 py-6 no-scrollbar">
				{filteredHackathons.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{filteredHackathons.map((h) => (
							<MyHacksCard key={h.hackathonId} hackathon={h} />
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-64 text-gray-500">
						<div className="bg-gray-100 p-4 rounded-full mb-4">
							<Funnel size={32} className="text-gray-400" />
						</div>
						<h3 className="text-lg font-medium">No hackathons found</h3>
						<p className="text-sm">Try adjusting your filters</p>
					</div>
				)}
			</main>
		</div>
	);
};

export default page;
