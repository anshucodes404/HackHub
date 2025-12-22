"use client";

import HackathonDetails from "@/components/hackathons-info/HackathonDetails";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import InviteForm from "@/components/hackathons/InviteForm";
import TeamRegister from "@/components/hackathons/TeamRegister";
import { Button, ErrorMessage } from "@/components/ui";
import Loader from "@/components/ui/Loader";
import type { DetailedHackathon, HackathonDetailsProps } from "@/types/types";
import SendMessagetoParticipants from "@/components/hackathons/SendMessage";
import { useRouter } from "next/navigation";

export default function Page() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();

  const slug = (params?.slug as string) ?? "";
  const origin = search.get("origin") ?? "";
  const [teamId, setTeamId] = useState(search.get("teamId") ?? "");

  const [hackathon, setHackathon] = useState<DetailedHackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);
  const [openTeamRegister, setOpenTeamRegister] = useState<boolean>(false);
  const [viewTeamDetails, setViewTeamDetails] = useState<boolean>(false);
  console.log(teamId);
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Missing slug");
      return;
    }

    const getHackathonData = async () => {
      try {
        const res = await fetch(`/api/hackathons/${slug}`, {
          method: "GET",
        }).then((r) => r.json());
        if (!res?.success) {
          setError("Hackathon not found");
          return;
        }
        setRegistered(res.data.registered);
        setHackathon(res.data as DetailedHackathon);
        setTeamId(res.data.teamId || "");
      } catch (err) {
        setError((err as Error).message || "Failed to load hackathon");
      } finally {
        setLoading(false);
      }
    };

    getHackathonData();
  }, [slug]);

  if (loading) return <Loader fullscreen />;

  if (error || !hackathon) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-4">Hackathon not found</h2>
        <ErrorMessage message={error || "Data not available"} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 mt-12">
      {
        origin === "hosted-hackathons" && (
          <div className="flex justify-end mb-6 gap-5 items-center">
            <Button>Edit Information </Button>
            <Button className="cursor-pointer" variant="secondary" onClick={() => router.push(`/hackathons-info/${slug}/hosted-hackathons/review`)} >Teams Details</Button>
          </div>
        )
      }
      <HackathonDetails
        hackathon={{ ...hackathon, hackathonId: hackathon._id }}
      />

      {/* This part appears when called from hackathons list Page */}
      {origin === "" && (
        <div
          className={`${openTeamRegister || viewTeamDetails ? "hidden" : ""
            } flex justify-center`}
        >
          {!registered ? (
            <Button onClick={() => setOpenTeamRegister(true)}>
              Register Now
            </Button>
          ) : (
            <div className="w-full">
              <div className="mb-10">
                <InviteForm
                  hackathonId={hackathon._id}
                  hackathonName={hackathon.hackathonName}
                  rules={hackathon.rules}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  variant="success"
                  onClick={() =>
                    router.push(`/hackathons-info/${slug}/joined-hackathons/${teamId}`)
                  }
                >
                  Registered&nbsp;&nbsp;▏Team Details
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {openTeamRegister && (
        <TeamRegister
          registrationDeadline={hackathon.registrationDeadline}
          hackathonId={slug}
          hackathonName={hackathon.hackathonName}
          setRegistered={setRegistered}
          setOpenTeamRegister={setOpenTeamRegister}
          setTeamId={setTeamId}
        />
      )}

      {/* this part is when called from joined hackathons page*/}
      {origin === "joined-hackathons" && (
        <div>
          {!registered ? (
            <TeamRegister
              registrationDeadline={hackathon.registrationDeadline}
              hackathonId={slug}
              hackathonName={hackathon.hackathonName}
              setRegistered={setRegistered}
              setOpenTeamRegister={setOpenTeamRegister}
              setTeamId={setTeamId}
            />
          ) : (
            <div className="w-full">
              <div className="mb-10">
                <InviteForm
                  hackathonId={hackathon._id}
                  hackathonName={hackathon.hackathonName}
                  rules={hackathon.rules}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  variant="success"
                  onClick={() =>
                    router.push(
                      `/hackathons-info/${slug}/joined-hackathons/${teamId}`
                    )
                  }
                >
                  Registered&nbsp;&nbsp;▏Team Details
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* this part will appear when called from hosted hackathons page */}
      {origin === "hosted-hackathons" && (
        <div>
          <SendMessagetoParticipants hackathonId={slug} />
        </div>
      )}
    </div>
  );
}
