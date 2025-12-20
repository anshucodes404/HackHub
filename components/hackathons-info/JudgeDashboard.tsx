"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, Trophy, CheckCircle, Clock } from "lucide-react";
import Loader from "@/components/ui/Loader";
import TeamReviewModal from "./TeamReviewModal";
import { useUser } from "@/components/UserContext";
import { Input } from "../ui";

export interface JudgeDashboardProps {
  hackathonId: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Review {
      _id: string,
      hackathonId: string,
      teamId: string,
      judgeId: string,
      __v: 0,
      comments: string,
      createdAt: Date,
      score: number,
      updatedAt: Date
    }


export interface TeamMember {
  userId: string,
  role: string;
  name: string;
  collegeEmail: string;
}

export interface Team {
   _id: string,
    name: string,
    hackathonId: string,
    hackathonName: string,
    leader: string,
    members: TeamMember[],
    status: string,
    createdAt: Date,
    updatedAt: Date,
    __v: 0,
    submission: {
      _id: string,
      hackathonId: string,
      teamId: string,
      submitterId: string,
      projectName: string,
      projectDetails: string,
      githubLink: string,
      demoLink: string,
      pptURL: string,
      submittedAt: Date,
      __v: 0
    },
    reviews: Review

}

const JudgeDashboard: React.FC<JudgeDashboardProps> = ({ hackathonId }) => {
  console.log(hackathonId);
  const { user } = useUser();
  const [teams, setTeams] = useState<Team[] | []>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/hackathons/${hackathonId}/judge-data`);
      const json = await res.json();
      if (json.success) {
        setTeams(json.data.teams);
        setPagination(json.data.pagination);
      }
      console.log(json)
    } catch (error) {
      console.error("Failed to fetch judge data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hackathonId]);

  const handleReviewSubmit = async (reviewData: {
    score: number;
    comments: string;
  }) => {
    if (!selectedTeam) return;

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hackathonId,
          teamId: selectedTeam._id,
          ...reviewData,
        }),
      }).then(res => res.json())
      if (res.success) {
        await fetchData();
        setSelectedTeam(null);
      }
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader fullscreen={false} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span>Showing {filteredTeams.length} teams</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600 text-sm">
                  Team Name
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm">
                  Members
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm">
                  Status
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm">
                  Submission
                </th>
                <th className="p-4 font-semibold text-gray-600 text-sm text-right">
                  My Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/70">
              {filteredTeams.map((team) => {
                const hasSubmission = team.submission;
                 const isReviewed = team.reviews;

                return (
                  <tr
                    key={team._id}
                    onClick={() => setSelectedTeam(team)}
                    className="group cursor-pointer hover:bg-indigo-50/50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900 group-hover:text-indigo-700">
                      {team.name}
                    </td>
                    <td className="p-4">
                      <div className="flex -space-x-2 overflow-hidden">
                        {team.members.slice(0, 3).map((m: TeamMember, i: number) => (
                          <div
                            key={i}
                            className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500"
                            title={m.name}
                          >
                            {m.name.charAt(0)}
                          </div>
                        ))}
                        {team.members.length > 3 && (
                          <div className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                            +{team.members.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              team.status === "Disqualified"
                                ? "bg-red-100 text-red-800"
                                : team.status === "Won"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                      >
                        {team.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {hasSubmission ? (
                        <div className="flex items-center gap-1.5 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Submitted</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                       {isReviewed ? (
                        <div className="inline-flex items-center gap-1 font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                          <Trophy className="w-3.5 h-3.5" />
                          {team.reviews.score}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">
                          Rate now
                        </span>
                      )} 
                    </td>
                  </tr>
                );
              })}

              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No teams found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TeamReviewModal
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        team={selectedTeam}
        onSubmitReview={handleReviewSubmit}
      />
    </div>
  );
};

export default JudgeDashboard;
