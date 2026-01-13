"use client";
import Aside from "@/components/hackathons/Aside";
import HackathonCard from "@/components/hackathons/HackathonCard";

import Loader from "@/components/ui/Loader";
import type { HackathonCardProps } from "@/types/types";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
   const [isGettingInfo, setIsGettingInfo] = useState<boolean>(false);
   const searchParams = useSearchParams();
   const getHackathonInfos = useCallback(async () => {
      try {
         setIsGettingInfo(true);
         console.log("fetching hackathons...");

         const queryString = searchParams.toString();
         const url = queryString
            ? `/api/hackathons/hosted?${queryString}`
            : "/api/hackathons/hosted";

         const raw = await fetch(url, { method: "GET" });
         const res = await raw.json();
         console.log("hackathons response:", res);
         if (res?.data) setHackathons(res.data as HackathonCardProps[]);
      } catch (err) {
         console.error("Error fetching hackathons:", err);
      } finally {
         setIsGettingInfo(false);
      }
   }, [searchParams]);

   useEffect(() => {
      (async () => {
         await getHackathonInfos();
      })();
   }, [getHackathonInfos]);

   const [hackathons, setHackathons] = useState<HackathonCardProps[]>([]);



   if (isGettingInfo) {
      return <Loader fullscreen />;
   }

   return (
      <div className="grid grid-cols-[1fr_2fr] h-screen pb-12">
         <Aside />
         <div className="h-full overflow-y-auto pr-4 min-w-0 pt-12">
            {hackathons && hackathons.length > 0 ? (
               hackathons.map((hackathon) => {
                  return (
                     <div key={hackathon._id} className="cursor-pointer">
                        <HackathonCard {...hackathon} btnText="View Details" origin="hosted-hackathons" />
                     </div>
                  );
               })
            ) : (
               <div className="h-full flex justify-center items-center">
                  <span className="text-2xl font-bold text-gray-400">
                     No Hackathons Hosted
                  </span>
               </div>
            )}
         </div>
      </div>
   );
};

export default Page;
