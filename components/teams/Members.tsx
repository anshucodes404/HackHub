import { useCallback, useEffect, useState } from "react";
import MemberCard from "./MemberCard";
import { useParams } from "next/navigation";
import type { TeamDetails } from "@/types/types";
import Loader from "../ui/Loader";
const Members = () => {

	const {teamId} = useParams();
	const [team, setTeam] = useState<TeamDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchTeamMembers = useCallback(async () => {
		try {
			const res = await fetch(`/api/hackathons/teams/members?teamId=${teamId}`).then(res => res.json());
			console.log(res)
			console.log(res.data.members)
			setTeam(res.data);
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}, [teamId]); 

	useEffect(() => {
		fetchTeamMembers()
	}, [fetchTeamMembers])

	if(loading) return <div className='flex items-center justify-center'><Loader size={400} /></div> 

	return (
		<div className="max-w-xl mx-auto w-full">
			<div className="ftext-lg flex justify-between px-3">
        <div>
        Members: <span className="font-semibold">{team ? team.members.length : 0}</span> 
        </div>
        <div>
          Team: <span className="font-semibold">{team?.name}</span>
        </div>
        
        </div>

			<section className="mt-1.5">
				<div>
					{
						team?.members.map((member) => (
							<MemberCard
								key={member.collegeEmail}
								src={member.userId.profileImageUrl || ""}
								name={member.name}
								size={50}
								role_user={member.role}
								collegeEmail={member.collegeEmail}
							/>
						))
					}
				</div>
			</section>
		</div>
	);
};

export default Members;
