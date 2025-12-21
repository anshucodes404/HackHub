import React, { useEffect, useState } from 'react';
import { Trophy, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import Loader from '../ui/Loader';


interface ResultsDetailsProps {
  name: string;
  score: number;
  comments: string;
  rank: number;
  teamId: {
    _id: string,
    name: string
  }
}

interface TopTeamProps {
  rank: number;
  teamId: {
    _id: string,
    name: string
  }
  score: number;
}

const ResultsDetails = () => {
  const {slug, teamId} = useParams()
  console.log(slug, " ", teamId)
  const [teamResult, setTeamResult] = useState<ResultsDetailsProps | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [topTeams, setTopTeams] = useState<TopTeamProps[]>([])

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/hackathons/teams/result?hackathonId=${slug}&teamId=${teamId}`).then(res => res.json())
      if(res.success){
        setTeamResult(res.data.reviewData)
        setTopTeams(res.data.topTeams)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [slug, teamId])


if(loading) return <div className='flex items-center justify-center'><Loader size={400} /></div> 

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="font-semibold text-lg mb-4 px-1 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <span>Results & Feedback</span>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{teamResult?.teamId?.name}</h2>
              <p className="font-mono text-sm font-semibold text-gray-600">
                  {teamResult?.score} pts
                </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">#{teamResult?.rank}</div>
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
                &quot;{teamResult?.comments}&quot;
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
                  <span className="font-medium text-gray-800">{team.teamId?.name}</span>
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
