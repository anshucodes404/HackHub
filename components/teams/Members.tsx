import { useCallback, useEffect, useState } from "react";
import MemberCard from "./MemberCard";
import { useParams } from "next/navigation";
import type { TeamDetails } from "@/types/types";
import Loader from "../ui/Loader";
import { useToast } from "../ToastContext";
import { AnimatePresence } from "framer-motion";
import KickMember, { memberToKickProps } from "../KickMember";
import { useUser } from "../UserContext";
const Members = ({setIsLeader}: {setIsLeader: (isLeader: boolean) => void}) => {

	const {addToast} = useToast()
	const {teamId} = useParams();
	const [team, setTeam] = useState<TeamDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [memberToKick, setMemberToKick] = useState<memberToKickProps | null>(null);
	const {user} = useUser()

	const onKickOut = async (collegeEmail: string) => {
		try {
			console.log(collegeEmail)
			const res = await fetch('/api/hackathons/teams/members', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({collegeEmail, teamId}),
			}).then(res => res.json());
	
			if(res.success){
				setTeam((prevTeam) => {
					if(!prevTeam) return prevTeam;
					return {
						...prevTeam,
						members: prevTeam.members.filter(member => member.collegeEmail !== collegeEmail),
					}
				})
			} else {
				addToast("Unable to kick out member")
			}
		} catch (error) {
			console.error(error);
			addToast("Something went wrong")
		} finally {
			setMemberToKick(null);
		}
	}

	const fetchTeamMembers = useCallback(async () => {
		try {
			const res = await fetch(`/api/hackathons/teams/members?teamId=${teamId}`).then(res => res.json());
			console.log(res)
			console.log(res.data.members)
			setTeam(res.data);
			setIsLeader(res.data.members.some((member: any) => member.collegeEmail === user?.collegeEmail && member.role === 'leader'))
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
				<div className="max-h-[410px] overflow-y-auto no-scrollbar">
					{
						team?.members.map((member) => (
							<MemberCard
								key={member.collegeEmail}
								src={member.userId.profileImageUrl || ""}
								name={member.name}
								size={50}
								role_user={member.role}
								collegeEmail={member.collegeEmail}
								setMemberToKick={setMemberToKick}
							/>
						))
					}
				</div>
			</section>

			<AnimatePresence>
				{
					memberToKick && (
						<KickMember 
							memberToKick={memberToKick}
							setMemberToKick={setMemberToKick}
							handleKickMember={() => {
								onKickOut(memberToKick.email);
								
							}}
						/>
					)}
			</AnimatePresence>
		</div>
	);
};

export default Members;
