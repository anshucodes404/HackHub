"use client";

import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { ParticipatedHackathonCardProps } from "@/types/types";


//TODO: Add the teamId in hackathon Data props
export default function MyHacksCard({ hackathon }: { hackathon: ParticipatedHackathonCardProps }) {
	return (
		<Link href={`/hackathons-info/${hackathon.hackathonId}?origin=joined-hackathons&teamId=${hackathon.teamId}`} className="block h-full">
			<div className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
				
				<div className="relative h-48 w-full overflow-hidden bg-gray-100">
					<Image
						src={hackathon.bannerImage || "/placeholder.jpg"}
						alt={hackathon.hackathonName}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />

					
					<div className="absolute top-3 right-3">
						<span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-sm`}>
							{hackathon.status}
						</span>
					</div>


					<div className="absolute bottom-3 left-3 flex gap-2">
						<span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-black/40 backdrop-blur-sm rounded-md border border-white/10">
							{hackathon.mode === 'offline' && hackathon.location ? <MapPin size={12} /> : <Users size={12} />}
							{hackathon.mode}
						</span>
					</div>
				</div>

			
				<div className="flex flex-col flex-1 p-5">
					<div className="mb-4">
						<h2 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
							{hackathon.hackathonName}
						</h2>
						<p className="mt-1 text-sm font-medium text-gray-500 flex items-center gap-2">
							<span>Organized by {hackathon.organiserName}</span>
						</p>
					</div>

					<div className="space-y-3 flex-1">
						<div className="flex items-center gap-3 text-sm text-gray-600">
							<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
								<Users size={16} />
							</div>
							<div className="flex flex-col">
								<span className="text-xs text-gray-400">Team</span>
								<span className="font-semibold text-gray-800">{hackathon.teamName}</span>
							</div>
						</div>

						<div className="flex items-center gap-3 text-sm text-gray-600">
							<div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
								<Calendar size={16} />
							</div>
							<div className="flex flex-col">
								<span className="text-xs text-gray-400">Date</span>
								<span className="font-semibold text-gray-800">
									{new Date(hackathon.startAt).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric'
									})}
								</span>
							</div>
						</div>

						{hackathon.location && (
							<div className="flex items-center gap-3 text-sm text-gray-600">
								<div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
									<MapPin size={16} />
								</div>
								<div className="flex flex-col">
									<span className="text-xs text-gray-400">Location</span>
									<span className="font-semibold text-gray-800">{hackathon.location}</span>
								</div>
							</div>
						)}
					</div>

					<div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
						<span className="text-xs text-gray-400 font-medium">
							{hackathon.minTeamSize}-{hackathon.maxTeamSize} Members
						</span>
						<span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all duration-300">
							View Details <ArrowRight size={16} />
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
