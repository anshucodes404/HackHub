"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button, CheckBox, Input } from "../ui";

const TAGS = [
	"AI",
	"ML",
	"Web",
	"Blockchain",
	"Cyber Security",
	"IoT",
	"Low/No Code",
	"Gaming",
	"Robotics",
	"Design",
	"Beginner Friendly",
	"Music",
	"Art",
];

function Aside() {
	const router = useRouter();
	const searchParams = useSearchParams();

	//firstly gwtting all the params in the current URL
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const [selectedMode, setSelectedMode] = useState(
		searchParams.get("mode") || "",
	);
	const [selectedStatus, setSelectedStatus] = useState<string[]>(
		searchParams.get("status")?.split(",") || [],
	);
	const [selectedTags, setSelectedTags] = useState<string[]>(
		searchParams.get("tags")?.split(",") || [],
	);

	const updateFilters = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("mode");
		params.delete("status");
		params.delete("tags");
		params.delete("search");

		if (search) params.set("search", search);
		if (selectedMode) params.set("mode", selectedMode);
		if (selectedStatus.length) params.set("status", selectedStatus.join(","));
		if (selectedTags.length) params.set("tags", selectedTags.join(","));

		router.push(`?${params.toString()}`);
	}, [
		router,
		selectedMode,
		selectedStatus,
		selectedTags,
		search,
		searchParams,
	]);

	useEffect(() => {
		updateFilters();
	}, [selectedMode, selectedStatus, selectedTags, router]);

	const handleSearch = () => {
		updateFilters();
	};

	const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.checked ? e.target.value : "";
		setSelectedMode(value);
	};

	const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (e.target.checked) {
			console.log(value);
			setSelectedStatus((prev) => [...prev, value]);
		} else {
			setSelectedStatus((prev) => prev.filter((status) => status !== value));
		}
	};

	const handleTagClick = (tag: string) => {
		setSelectedTags((prev) => {
			const isSelected = prev.includes(tag); //this will check if the tag is selected or not
			const newTags = isSelected
				? prev.filter((t) => t !== tag) //this will remove the tag is it was selected
				: [...prev, tag]; // this will add the tag if not selected
			return newTags;
		});
	};

	return (
		<aside className="w-full md:w-72 pt-12 ml-30">
			<div className="p-6 mt-4">
				<h4 className="font-semibold mb-4">Filters</h4>
				<div className="space-y-3 text-sm text-textSecondary">
					<div>
						<Input
							label="Search"
							className="w-full px-3 py-2 border border-border rounded"
							placeholder="Search by name"
							value={search}
							name="search"
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button
							type="button"
							className="w-full mt-2"
							onClick={handleSearch}
						>
							Search
						</Button>
					</div>

					<div>
						<span className="text-sm font-medium text-gray-700 mb-1">Mode</span>
						<CheckBox
							type="radio"
							id="online"
							name="mode"
							value="online"
							label="Online"
							checked={selectedMode === "online"}
							onChange={handleModeChange}
						/>

						<CheckBox
							type="radio"
							name="mode"
							value="inplace"
							id="inperson"
							label="In Person"
							checked={selectedMode === "inplace"}
							onChange={handleModeChange}
						/>
					</div>

					<div>
						<div className="text-sm font-medium text-gray-700 mb-3">Tags</div>
						<div className="flex flex-wrap gap-2">
							{TAGS.map((tag) => (
								<button
									key={tag}
									type="button"
									onClick={() => handleTagClick(tag)}
									className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
										selectedTags.includes(tag)
											? "bg-blue-100 text-blue-600"
											: "bg-gray-100 text-gray-600"
									}`}
								>
									{tag}
								</button>
							))}
						</div>
					</div>

					<div>
						<span className="text-sm font-medium text-gray-700 mb-1">
							Status
						</span>
						<CheckBox
							name="status"
							value="upcoming"
							id="upcoming"
							label="Upcoming"
							checked={selectedStatus.includes("upcoming")}
							onChange={handleStatusChange}
						/>
						<CheckBox
							name="status"
							value="published"
							id="published"
							label="published"
							checked={selectedStatus.includes("published")}
							onChange={handleStatusChange}
						/>
						<CheckBox
							name="status"
							value="ended"
							id="ended"
							label="Ended"
							checked={selectedStatus.includes("ended")}
							onChange={handleStatusChange}
						/>
					</div>
				</div>
			</div>
		</aside>
	);
}

export default Aside;
