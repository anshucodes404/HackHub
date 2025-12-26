import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import React from "react";
import { Team } from "./hackathons-info/JudgeDashboard";
import { Button } from "./ui";

export interface memberToKickProps {
    name: string;
    email: string;
}

interface KickMemberProps {
    memberToKick: memberToKickProps | null;
    setMemberToKick: (member: memberToKickProps | null) => void;
    handleKickMember: () => void;
}

const KickMember = ({
    memberToKick,
    setMemberToKick,
    handleKickMember,
}: KickMemberProps) => {
    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Kick Member?</h3>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6">
                        Are you sure you want to kick{" "}
                        <span className="font-semibold text-gray-900">
                            {memberToKick?.name}
                        </span>{" "}
                        from the Team?
                    </p>

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setMemberToKick(null)}
                            className="px-4 py-2 text-sm font-medium transition-colors"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleKickMember}
                            className="px-4 py-2 text-sm font-medium transition-colors shadow-sm"
                        >
                            Kick Member
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default KickMember;
