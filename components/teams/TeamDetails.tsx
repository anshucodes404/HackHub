"use client"
import React, { useState } from "react";
import { SetActive } from "../ui";
import Members from "./Members";
import Requests from "./Requests";
import { UsersRound } from "lucide-react";

const TeamDetails = () => {

	const [activeTab, setActiveTab] = useState<string>("members");
	const [isLeader, setIsLeader] = useState<boolean>(false)

	return (
		<div className=" rounded-lg p-4 shadow-sm border border-gray-200 h-[600px]">

			{/* //! This section is only for Team Leader */}
			{
				isLeader && (<section className="flex justify-center gap-10 items-center pb-4 border-b border-gray-300">
					<SetActive activeTab={activeTab} setActiveTab={setActiveTab} tab="members" title="Members" />
					<SetActive activeTab={activeTab} setActiveTab={setActiveTab} tab="requests" title="Requests" />
				</section>)
			}

			<section className="mt-7">
				<h3 className="text-center text-2xl font-bold flex items-center justify-center gap-2"><UsersRound />Team Details</h3>
			</section>
			<section className="mt-6">
				{activeTab === "members" && <Members setIsLeader={setIsLeader} />}
				{activeTab === "requests" && <Requests />}
			</section>
		</div>
	);
};

export default TeamDetails;
