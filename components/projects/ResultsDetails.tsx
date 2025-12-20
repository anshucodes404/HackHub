import React from 'react';
import { Trophy, MessageSquare, Sparkles, Quote, Medal } from 'lucide-react';

const ResultsDetails = () => {
  // Mock Data - In a real app, this would be passed as props
  const teamResult = {
    rank: 4,
    teamName: "Pixel Pioneers",
    score: 88,
    feedback: "The concept was innovative and the design system was implemented beautifully. The user flow was intuitive. However, we noticed some performance bottlenecks when loading large datasets on the dashboard. The pitch was engaging but could have focused more on the business model.",
  };

  const topTeams = [
    { rank: 1, name: "Quantum Coders", score: 98, avatar: "🥇" },
    { rank: 2, name: "Neural Ninjas", score: 95, avatar: "🥈" },
    { rank: 3, name: "Binary Bandits", score: 92, avatar: "🥉" },
  ];

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="font-semibold text-lg mb-4 px-1 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <span>Results & Feedback</span>
      </div>

      <div className="space-y-4">
        {/* Your Team's Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{teamResult.teamName}</h2>
              <p className="text-sm text-gray-500">Your Submission</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">#{teamResult.rank}</div>
              <div className="text-sm text-gray-500">Overall Rank</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
              <MessageSquare className="w-4 h-4" />
              <span>Judges Comments</span>
            </div>
            <div className="relative pl-4 border-l-2 border-indigo-400">
              <p className="text-gray-600 text-sm leading-relaxed italic">
                &quot;{teamResult.feedback}&quot;
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-gray-900">Top 3 Winners</h3>
          </div>

          <div className="space-y-3">
            {topTeams.map((team) => (
              <div key={team.rank} className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                                ${team.rank === 1 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      team.rank === 2 ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                        'bg-orange-100 text-orange-700 border border-orange-200'}
                            `}>
                    {team.rank}
                  </div>
                  <span className="font-medium text-gray-800">{team.name}</span>
                </div>
                <div className="font-mono text-sm font-semibold text-gray-600">
                  {team.score} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsDetails
