import React, { useEffect, useState } from "react";
import { X, Github, ExternalLink, FileText, Send, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Team, TeamMember } from "./JudgeDashboard";
import { Input, Textarea } from "../ui";

interface TeamReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onSubmitReview: (reviewData: {
    score: number;
    comments: string;
    rank: number
  }) => Promise<void>;
}

const TeamReviewModal: React.FC<TeamReviewModalProps> = ({
  isOpen,
  onClose,
  team,
  onSubmitReview,
}) => {
  const [score, setScore] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [rank, setRank] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const getReviewData = async () => {
    const res = await fetch(
      `/api/hackathons/${team?.hackathonId}/teams/${team?._id}/review-data`
    ).then((res) => res.json());
    if (res.success) {
      setScore(res.data?.score ?? 0);
      setComments(res.data?.comments ?? "");
      setRank(res.data?.rank ?? 0);
    }
  };

  useEffect(() => {
    getReviewData();
  }, [team, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmitReview({ score, comments, rank });
    setSubmitting(false);
    onClose();
  };

  const submission = team?.submission;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{team?.name}</h2>
              <p className="text-sm text-gray-500">Team Details & Review</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Project Submission
                </h3>
              </div>

              {submission ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="font-medium text-gray-900 text-lg mb-2">
                      {submission.projectName}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {submission.projectDetails}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {submission.githubLink && (
                      <a
                        href={submission.githubLink}
                        target="_blank"
                        className="flex items-center justify-center gap-2 p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        <Github className="w-4 h-4" />
                        View Code
                      </a>
                    )}
                    
                      <a
                        href={submission.demoLink}
                        target="_blank"
                        className="flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {submission.demoLink ? "View Demo" : "No Demo Link"}
                      </a>
                    
                    {submission.pptURL && (
                      <a
                        href={submission.pptURL.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-2 flex items-center justify-center gap-2 p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        View Presentation
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">No project submitted yet.</p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-2 text-sm">
                  Team Members
                </h4>
                <div className="flex flex-wrap gap-2">
                  {team?.members.map((member: TeamMember) => (
                    <span
                      key={member.userId}
                      className="bg-white px-3 py-1 rounded-full text-xs font-medium text-blue-700 shadow-sm border border-blue-100"
                    >
                      {member.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Judge&apos;s Review
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="md:grid-cols-2 grid gap-4">
                  <Input
                    label="Score (0-100)"
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full px-4 py-2"
                    placeholder="85"
                    required
                  />

                  <Input
                    label="Rank"
                    type="number"
                    value={rank}
                    onChange={(e) => setRank(Number(e.target.value))}
                    className="w-full px-4 py-2"
                    placeholder="1"
                    required
                  />
                </div>

                <div>
                  <Textarea
                    label="Feedback & Comments"
                    rows={6}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-4 py-3 resize-none"
                    placeholder="Provide constructive feedback about the project..."
                    required
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TeamReviewModal;
