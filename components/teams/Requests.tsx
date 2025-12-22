
import { useCallback, useEffect, useState } from 'react';
import RequestRejectedCard from './RequestRejectedCard'
import { useParams } from 'next/navigation';
import Loader from '../ui/Loader';
import { div } from 'framer-motion/client';
import InviteForm from '../hackathons/InviteForm';

interface RequestsProps{
  _id: string;
  name: string;
  collegeEmail: string;
  profileImageUrl: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const Requests = () => {

  const {slug} = useParams()
  const {teamId} = useParams()
  const [requests, setRequests] = useState<RequestsProps[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getTeamInvites = useCallback( async () => {
    try {
      const res = await fetch(`/api/hackathons/teams/invite/${teamId}`).then(res => res.json());
      console.log(res.data)
      setRequests(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [teamId])

  useEffect(() => {
    getTeamInvites();
  }, [getTeamInvites])

  if(loading) return <div className='flex items-center justify-center'><Loader size={400} /></div> 

  return (
    <div className='max-w-xl mx-auto w-full max-h-[450px] overflow-y-scroll rounded-lg'>
      {
        requests.length === 0 ? <div className='text-center py-10 font-medium'>No Requests Found</div> :
        requests.map((request, index) => (
          <RequestRejectedCard
            key={index}
            src={request.profileImageUrl || ""}
            name={request.name}
            collegeEmail={request.collegeEmail}
            status={request.status}
          />
        ) )
      }
    </div>
  )
}

export default Requests
