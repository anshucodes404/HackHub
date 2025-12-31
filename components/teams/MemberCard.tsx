import { UserRoundX } from "lucide-react";
import ProfileImageView from "../ProfileImageView";
import { useUser } from "../UserContext";
import RoleTag from "./RoleTag";
import { memberToKickProps } from "../KickMember";

interface MemberCardProps {
	src: string;
	name: string;
	role_user: "member" | "leader";
	size?: number;
	collegeEmail: string;
	setMemberToKick: (member: memberToKickProps) => void;
}

const MemberCard = ({
	src,
	name,
	role_user,
	size,
	collegeEmail,
	setMemberToKick,
}: MemberCardProps) => {
	const { user } = useUser();


	//FIXME: shayad yaha par logic thoda change karna padega; isme kick out button tabhi dikega agar current user leader ho aur usme bhi leader ka card me na dikhe
	const userIsCurrent = user?.collegeEmail === collegeEmail;
	const leaderCard = role_user === "leader";
	const canBeKickedOut = !userIsCurrent && !leaderCard; //yaha par un sab card me kick out button show hoga jo current user nhi hai aur jinka role member hai


	return (
		<div className="border-gray-200 border rounded-lg bg-gray-200/70 mb-2.5">
			<div className="flex justify-between items-center px-2 py-2">
				<div className="flex items-center gap-3">
					<ProfileImageView src={"https://images.unsplash.com/photo-1761839258045-6ef373ab82a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"} name={name} size={size} />
					<div>
						<h4 className="font-semibold">{name}</h4>
						<RoleTag role={role_user} />
					</div>
				</div>
				{canBeKickedOut && (
					<button
						onClick={() => setMemberToKick({ name, email: collegeEmail })}
						className="pr-5 cursor-pointer transition"
						title="Kick Out"
						type="button"
					>
						<UserRoundX className="size-5 hover:text-red-600 text-red-400 transition-all duration-200" />
					</button>
				)}
			</div>
		</div>
	);
};

export default MemberCard;
