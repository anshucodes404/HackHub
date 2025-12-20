import ProfileImageView from "../ProfileImageView";
import StatusTag from "./StatusTag";


interface RequestRejectedCardProps {
    src: string;
    name: string;
    size?: number;
    collegeEmail: string;
    status: "accepted" | "rejected" | "pending"
}

const RequestRejectedCard = ({ src, name, size, collegeEmail, status }: RequestRejectedCardProps) => {
  return (
    <div className='border-gray-200 border rounded-lg bg-gray-200/70 mb-2.5'>
      <div className='flex justify-between items-center px-2 py-2'>
        <div className='flex items-center gap-3'>
            <ProfileImageView src={src} name={name} size={size} />
            <div>
                <h4 className='font-semibold'>{name}</h4>
                <p className="text-xs">{collegeEmail}</p>
            </div>
        </div>
        <div className="pr-5">
            <StatusTag status={status} />
        </div>
        
      </div>
        
    </div>
  )
}

export default RequestRejectedCard
