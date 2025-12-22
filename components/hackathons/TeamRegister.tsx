import { useState } from "react";
import { Button, Input } from "../ui";

const TeamRegister = ({
  registrationDeadline,
  hackathonId,
  hackathonName,
  setRegistered,
  setOpenTeamRegister,
  setTeamId
}: {
  registrationDeadline: Date, hackathonId: string, hackathonName: string, setRegistered: (args: boolean) => void, setOpenTeamRegister: (args: boolean) => void, setTeamId: (id: string) => void
}) => {

  const [teamName, setTeamName] = useState<string>("")

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/hackathons/teams/register",
        {
          method: "POST",
          body: JSON.stringify({ name: teamName, hackathonId, hackathonName })
        }
      ).then(res => res.json())

      if (res.success) {
        setRegistered(true)
        if (res.data && res.data._id) {
          setTeamId(res.data._id);
        }
        setOpenTeamRegister(false)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setTeamName("")
    }
  }
  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 sticky top-20">
      <h2 className="text-xl font-semibold mb-4">
        Register for this Hackathon
      </h2>
      <div
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <Input
            label="Team Name"
            type="text"
            name="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            placeholder="Enter your team name"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          onClick={handleSubmit}
        >
          Register as Team Lead
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Registration closes on{" "}
        <strong>{new Date(registrationDeadline).toLocaleDateString()}</strong>
      </p>
    </div>
  );
};

export default TeamRegister;
