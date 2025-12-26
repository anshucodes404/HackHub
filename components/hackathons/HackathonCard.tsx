
import { Button } from "../ui";
import type { HackathonCardProps } from "@/types/types";
import Image from "next/image";
import {
  Award,
  Calendar,
  Globe,
  MapPin,
  Users,
  Building2,
  Clock
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const HackathonCard = ({
  _id,
  hackathonName,
  mode,
  location,
  tagline,
  organiserName,
  duration,
  startAt,
  registrationDeadline,
  tags,
  participants,
  prize,
  status,
  bannerImage,
  btnText,
  origin
}: HackathonCardProps) => {

  const router = useRouter()
  const path = usePathname()

  const redirectToDetailedPage = () => {
    if (!_id) return;

    if (path === "/hackathons") {
      router.push(`/hackathons-info/${_id}`);
    } else if(path === "/hosted-hackathons") {
      router.push(`/hackathons-info/${_id}?origin=${origin || "hosted-hackathons"}`)
    } else {
      router.push(`/hackathons-info/${_id}?origin=${origin || "joined-hackathons"}`)
    }
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 mt-6 flex flex-col md:flex-row h-auto md:h-64">

      <div className="relative h-48 md:h-full md:w-72 md:shrink-0 bg-gray-100">
        <Image
          src={bannerImage || "/sa"}
          alt={hackathonName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white rounded-full 
                ${status === 'draft' ? 'bg-gray-500' : status === 'ended' ? 'bg-red-500' : 'bg-green-700'} 
                shadow-sm`}>
            {status}
          </span>
        </div>
      </div>

     
      <div className="flex flex-col flex-1 p-6 justify-between">

    
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {hackathonName}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Building2 size={14} className="text-gray-400" />
                <span>By {organiserName}</span>
              </div>
            </div>

    
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100 text-sm font-semibold">
              <Award size={16} />
              <span>₹{prize}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {tagline}
          </p>
        </div>


        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 mt-2 border-y border-gray-100">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-medium uppercase">Mode</span>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              {mode === 'online' ? <Globe size={16} className="text-blue-500" /> : <MapPin size={16} className="text-red-500" />}
              <span className="capitalize">{mode}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-medium uppercase">Date</span>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar size={16} className="text-purple-500" />
              <span>{new Date(startAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-medium uppercase">Duration</span>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Clock size={16} className="text-orange-500" />
              <span>{duration}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 font-medium uppercase">Teams</span>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users size={16} className="text-emerald-500" />
              <span>{participants?.length || 0} Joined</span>
            </div>
          </div>
        </div>

      
        <div className="flex items-center justify-between pt-4 mt-auto">
          <div className="hidden md:flex gap-2">
            {tags?.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-md border border-gray-100">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex-1 md:flex-none flex justify-end">
            <Button
            variant="secondary"
              onClick={redirectToDetailedPage}
              className="w-full md:w-auto px-6 py-2 rounded-lg transition-colors font-medium text-sm cursor-pointer"
            >
              {btnText}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HackathonCard;
