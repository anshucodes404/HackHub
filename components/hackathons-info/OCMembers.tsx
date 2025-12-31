import React, { useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';
import ProfileImageView from '../../components/ProfileImageView';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useParams } from 'next/navigation';
import { ErrorMessage } from '../ui';
import Loader from '../ui/Loader';
import { useUser } from '../UserContext';

type OCMembersProps = {
    _id: string;
    name: string;
    collegeEmail: string;
    profileImage?: string;
}

const OCMembers = ({ setOcMembersOpen }: { setOcMembersOpen: (val: boolean) => void }) => {

    const { slug } = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [ocMembers, setOcMembers] = useState<OCMembersProps[] | []>([]);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    const { user } = useUser();

    useEffect(() => {
        getOcMembers();
    }, [slug])

    const getOcMembers = async () => {
        try {
            setError(null);
            setIsLoading(true);
            const res = await fetch(`/api/hackathons/${slug}/oc-members`).then(res => res.json());
            if (res.success) {
                setOcMembers(res.data);
            } else {
                setError("Failed to load OC members");
            }
        } catch (error) {
            console.error("Failed to fetch OC members", error);
        } finally {
            setIsLoading(false);
        }
    }

    const removeMember = async (email: string) => {
        try {
            setError(null);
            const res = await fetch(`/api/hackathons/${slug}/oc-members`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            }).then(res => res.json());

            if (res.success) {
                await getOcMembers();
            } else {
                setError("Failed to Remove Member");
            }
        } catch (error) {
            console.error("Failed to Remove Member")
        }
    }

    const addMember = async (email: string) => {
        try {
            setError(null);
            const res = await fetch(`/api/hackathons/${slug}/oc-members`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            }).then(res => res.json());

            if (res.success) {
                await getOcMembers();
            } else {
                setError("Failed to Add Member");
            }
        } catch (error) {
            console.error("Failed to Add Member")
        } finally {
            setEmail("");
        }
    }

    return (
        <div className='w-[400px] bg-white border border-gray-200 shadow-xl rounded-xl p-5 flex flex-col gap-4'>
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-800">OC Members</h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{ocMembers.length} Members</span>
                    <button onClick={() => setOcMembersOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {
                isLoading ? <div className="flex items-center justify-center">
                    <Loader size={200} />
                </div> : (
                    <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                        {ocMembers.map((member) => (
                            <div key={member._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-all group border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <ProfileImageView name={member.name} src={member.profileImage} size={40} />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium text-gray-900 truncate">{member.name}</span>
                                        <span className="text-xs text-gray-500 truncate">{member.collegeEmail}</span>
                                    </div>
                                </div>
                                {
                                    user?.collegeEmail !== member.collegeEmail && (
                                        <button
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Remove member"
                                            onClick={() => removeMember(member.collegeEmail)}
                                        >
                                            <X size={16} />
                                        </button>
                                    )
                                }

                            </div>
                        ))}

                        {ocMembers.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No members yet</p>
                            </div>
                        )}
                    </div>
                )
            }



            {
                error && <ErrorMessage message={error} />
            }

            <div className="pt-4 border-t border-gray-100 mt-1">
                <label className="text-xs font-medium text-gray-700 mb-2 block">Add new member</label>
                <div className="flex gap-2 items-start">
                    <div className="flex-1">
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter roll number"
                            className="w-full text-sm py-2"
                            type="text"
                        />
                    </div>
                    <Button type='submit' variant="primary" className="px-3 py-[9px] flex items-center justify-center rounded-lg" aria-label="Add member" onClick={() => addMember(email)}>
                        <Plus size={18} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OCMembers
