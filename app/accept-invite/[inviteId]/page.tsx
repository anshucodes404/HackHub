"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ToastContext";
import { Button, ErrorMessage } from "@/components/ui";
import Loader from "@/components/ui/Loader";
import type { Invite } from "@/types/types";

function Page() {
   const params = useParams();
   const { addToast } = useToast();
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [invite, setInvite] = useState<Invite | null>(null);
   const [error, setError] = useState("");

   useEffect(() => {
      async function loadInvite() {
         try {
            console.log("Fetching invitation");
            const data = await fetch(
               `/api/invite?inviteId=${params.inviteId}`,
               {
                  method: "GET",
               },
            ).then((res) => res.json());
            setInvite(data.data);
         } catch (error) {
            console.log(error);
            setError("Invalid or expired invitation link.");
         } finally {
            setLoading(false);
         }
      }
      loadInvite();
   }, [params]);

   console.log("TeamId: ", params.inviteId);

   const handleAccept = async () => {
      setLoading(true)
      const res = await fetch(`/api/accept-decline-invite/${params.inviteId}`, {
         method: "POST",
         body: JSON.stringify({ action: "accept", teamId: invite?.teamId }),
      }).then((res) => res.json());
      if (res.success) {
         addToast(res.message || "Invitation accepted");
         setLoading(false)
         router.push("/participated-hackathons");
      } else {
         setLoading(false);
         addToast(res.message || "Failed to accept invitation");
         router.push("/participated-hackathons");
      }
   };

   const handleDecline = async () => {
      setLoading(true)
      const res = await fetch(`/api/accept-decline-invite/${params.inviteId}`, {
         method: "POST",
         body: JSON.stringify({ action: "decline", teamId: invite?.teamId }),
      }).then((res) => res.json());
      if(res.success){
         setLoading(false)
         router.push("/");
         addToast("Invitation declined.");
      }  else {
         setLoading(false);
         addToast(res.message || "Failed to decline invitation");
         router.push("/");
      }
   };

   if (loading) return <Loader fullscreen />;
   if (error)
      return (
         <div className=" fixed top-1/2 right-1/2 -translate-y-1/2">
            <ErrorMessage message={error} />
         </div>
      );

   return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="w-full max-w-md bg-white shadow-2xl rounded-xl border border-slate-200 p-8 mx-4 relative">
            <h1 className="text-2xl font-bold text-indigo-700 mb-2 text-center">
               {invite?.hackathonName}
            </h1>
            <p className="text-gray-600 text-center mb-4">{invite?.tagline}</p>
            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
               <div className="mb-2">
                  <span className="font-semibold text-indigo-600">Team:</span>{" "}
                  {invite?.teamName}
               </div>
               <div>
                  <span className="font-semibold text-indigo-600">
                     Invited by:
                  </span>{" "}
                  {invite?.inviterName} (
                  <a
                     href={`mailto:${invite?.inviterEmail}`}
                     className="underline text-indigo-500"
                  >
                     {invite?.inviterEmail}
                  </a>
                  )
               </div>
            </div>
            <div className="mb-4">
               <div className="font-semibold text-gray-700 mb-1">Rules:</div>
               <ul className="list-disc list-inside text-sm text-gray-600">
                  {
                     invite?.rules.length === 0 ? <li>No specific rules provided.</li> : (invite?.rules?.map((rule: string, idx: number) => (
                     <li key={idx}>{rule}</li>
                  )))
                  }
                  
               </ul>
            </div>
            <div className="flex gap-4 mt-6">
               <Button className="flex-1 cursor-pointer" onClick={handleAccept}>
                  Accept Invitation
               </Button>
               <Button
                  className="flex-1 cursor-pointer"
                  variant="danger"
                  onClick={handleDecline}
               >
                  Decline
               </Button>
            </div>
         </div>
      </div>
   );
}

export default Page;
