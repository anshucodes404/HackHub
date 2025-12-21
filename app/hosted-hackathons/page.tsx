"use client";
import Aside from "@/components/hackathons/Aside";
import HackathonCard from "@/components/hackathons/HackathonCard";

import Loader from "@/components/ui/Loader";
import type { HackathonCardProps } from "@/types/types";
import { useEffect, useState } from "react";

const Page = () => {
   const [isGettingInfo, setIsGettingInfo] = useState<boolean>(false);
   useEffect(() => {
      console.log("Hackathons page mounted");
      (async () => {
         await getHackathonInfos();
      })();
   }, []);

   const [hackathons, setHackathons] = useState<HackathonCardProps[]>([]);

   const getHackathonInfos = async () => {
      try {
         setIsGettingInfo(true);
         console.log("fetching hackathons...");
         const raw = await fetch("/api/hackathons/hosted", { method: "GET" });
         const res = await raw.json();
         console.log("hackathons response:", res);
         if (res?.data) setHackathons(res.data as HackathonCardProps[]);
      } catch (err) {
         console.error("Error fetching hackathons:", err);
      } finally {
         setIsGettingInfo(false);
      }
   };

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
