"use client";

import HackathonDetails from "@/components/hackathons-info/HackathonDetails";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import InviteForm from "@/components/hackathons/InviteForm";
import TeamRegister from "@/components/hackathons/TeamRegister";
import { Button, ErrorMessage } from "@/components/ui";
import Loader from "@/components/ui/Loader";
import type { DetailedHackathon } from "@/types/types";
import SendMessagetoParticipants from "@/components/hackathons/SendMessage";

export default function Page() {
	const params = useParams();
	const search = useSearchParams();

	const slug = (params?.slug as string) ?? "";
	const origin = search.get("origin") ?? "";

	const [hackathon, setHackathon] = useState<DetailedHackathon | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [registered, setRegistered] = useState<boolean>(false);
	const [openTeamRegister, setOpenTeamRegister] = useState<boolean>(false)
	const [viewTeamDetails, setViewTeamDetails] = useState<boolean>(false)

	useEffect(() => {
		if (!slug) {
			setLoading(false);
			setError("Missing slug");
			return;
		}

		const getHackathonData = async () => {
			try {
				const res = await fetch(`/api/hackathons/${slug}`, {
					method: "GET",
				}).then((r) => r.json());
				if (!res?.success || !res?.data) {
					setError("Hackathon not found");
					return;
				}
				setRegistered(res.data.registered);
				setHackathon(res.data as DetailedHackathon);
			} catch (err) {
				setError((err as Error)?.message || "Failed to load hackathon");
			} finally {
				setLoading(false);
			}
		};

		getHackathonData();
	}, [slug]);

	if (loading) return <Loader fullscreen />;

	if (error || !hackathon) {
		return (
			<div className="max-w-6xl mx-auto px-6 py-10">
				<h2 className="text-2xl font-semibold mb-4">Hackathon not found</h2>
				<ErrorMessage message={error || "Data not available"} />
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto px-6 py-10 mt-12">

			{/* //FIXME: De-Comment this component */}
			{/* <HackathonDetails hackathon={hackathon} /> */}

			{/* This part appears when called from hackathons list Page */}
			{origin === "" && (
				<div className={`${openTeamRegister || viewTeamDetails ? "hidden" : ""} flex justify-center`}>
					{!registered ? (
						<Button onClick={() => setOpenTeamRegister(true)} > Register Now </Button>
					) : (
						<Button variant="success" onClick={() => setViewTeamDetails(true)} > Registered&nbsp;&nbsp;▏View Details </Button>
					)}
					</div>
			)}

			{
				openTeamRegister && (
					<TeamRegister
							registrationDeadline={hackathon.registrationDeadline}
							hackathonId={slug}
							hackathonName={hackathon.hackathonName}
							setRegistered={setRegistered}
							setOpenTeamRegister={setOpenTeamRegister}
						/>
				)
			}

			{/* this part is when called from joined hackathons page*/}
			{origin === "joined-hackathons" && (
				<div>
					{!registered ? (
						<TeamRegister
							registrationDeadline={hackathon.registrationDeadline}
							hackathonId={slug}
							hackathonName={hackathon.hackathonName}
							setRegistered={setRegistered}
							setOpenTeamRegister={setOpenTeamRegister}
						/>
					) : (
						<InviteForm
							hackathonId={hackathon._id}
							hackathonName={hackathon.hackathonName}
							rules={hackathon.rules}
						/>
					)}
				</div>
			)}

			{/* this part will appear when called from hosted hackathons page */ }
			{origin === "hosted-hackathons" && (
				<div>
					<SendMessagetoParticipants hackathonId={slug} />
				</div>
			)}
		</div>
	);
}
