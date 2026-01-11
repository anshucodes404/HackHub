"use client";
import React, { useState } from "react";
import { Input, Section, Textarea, Button } from "@/components/ui";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ToastContext";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";
import uploadOnCloudinary from "@/lib/uploadOnCloudinary";

export default function Page() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [mode, setMode] = useState("online");
  const [bannerImage, setBannerImage] = useState<string>("")
  const [status, setStatus] = useState<"published" | "draft">("published")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      addToast("Creating Hackathon");
      setIsCreating(true);
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      formData.append("bannerImage", bannerImage as string)
      formData.append("status", status)

      console.log(formData)

      const res = await fetch("/api/organise-hackathon", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (!res?.success) {
        addToast("Hackathon creation failed");
      } else {
        addToast("Hackathon Created Successfully");
        router.push("/hosted-hackathons");
      }
    } catch (_) {
      addToast("Creation failed");
    } finally {
      setIsCreating(false);
    }
  };

  const handleBannerImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      try {
        addToast("Uploading Banner Image...")
        await uploadOnCloudinary(file, "hackathon_banners").then(url => setBannerImage(url))
        addToast("Banner Image Uploaded Successfully")
      } catch (error) {
        addToast("Banner Image Upload Failed")
        console.error("Banner Image Upload Failed", error)
      }
    } else {
      addToast("No file selected for Banner Image")
    }
  }

  if (isCreating) return <Loader fullscreen />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-5xl w-full mx-auto bg-white rounded-2xl shadow-md p-8 mt-20 mb-20 border border-gray-200">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🏁 Organize a Hackathon</h1>
          <p className="text-gray-600 text-sm mt-2">
            Fill in the details below to host your next hackathon.
          </p>
        </div>

        <hr className="mb-3 text-gray-300" />


        <Section title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              required
              name="hackathonName"
              label="Hackathon Name"
              placeholder="Enter hackathon name"
            />
            <Input
            
              name="tagline"
              label="Short Tagline"
              placeholder="E.g. Build. Learn. Compete."
            />
          </div>

          <div className="mt-6">
            <Textarea
            required
              name="description"
              label="Description"
              placeholder="Describe your hackathon, themes, and goals..."
            />
          </div>


          <div className="mt-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
            <div className="grid grid-cols-1 gap-6">
              <Input
                name="tags"
                label="Related Tags"
                type="text"
                placeholder="E.g. AI, Hackathon, Gaming (comma separated)"
              />
            </div>

            <div>
              <span className="inline-block text-sm font-medium text-gray-700 mb-1">
                Mode
              </span>
              <select
                name="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full border rounded-md px-3 py-2.5 border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="online">Online</option>
                <option value="inplace">In Place</option>
              </select>
            </div>

          </div>

          <div className="mt-6">
            {mode === "inplace" && (
              <Input
              required={mode === "inplace"}
                name="location"
                label="Location"
                placeholder="Enter hackathon venue"
              />
            )}
          </div>

        </Section>

        <Section title="Media & Branding">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Hackathon Banner{" "}<span className="text-red-600">*</span> </span>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group text-center relative overflow-hidden">
              <Input
              required
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleBannerImage}
              />
              <div className="p-4 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <ImagePlus className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Click to upload banner</span>
              <span className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
            </div>
          </div>
        </Section>


        <Section title="Schedule">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
            required
              name="startAt"
              label="Start Date and Time"
              type="datetime-local"
            />
            <Input
            required
              name="registrationDeadline"
              label="Registration Deadline"
              type="date"
            />
            <Input required type="number" name="duration" label="Duration (in hours) " placeholder="e.g. 48" />
          </div>
        </Section>


        <Section title="Team & Eligibility">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
            required
              name="minTeamSize"
              label="Min Team Size"
              placeholder="e.g. 2"
              type="number"
            />
            <Input
            required
              name="maxTeamSize"
              label="Max Team Size"
              placeholder="e.g. 5"
              type="number"
            />
          </div>

          <div className="mt-6">
            <Textarea
            required
              name="criteria"
              label="Eligibility Criteria"
              placeholder="e.g. College students only"
            />
          </div>

          <div className="mt-6">
            <Input
            required
              name="prize"
              label="Prize"
              placeholder="e.g. 50,000"
              type="text"
            />
          </div>
        </Section>


        <Section title="Organizer Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
            required
              name="organiser"
              label="Organizer / Society Name"
              placeholder="e.g. Tech Club"
            />
            <Input
            required
              name="organiserEmail"
              label="Contact Email"
              placeholder="example@email.com"
              type="email"
            />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="socialLink"
              label="Social Link"
              placeholder="https://instagram.com/yourclub"
            />
            <Input
              name="webSiteLink"
              label="Website Link"
              placeholder="https://yourlink.com"
            />
          </div>
        </Section>

        <div className="border-t border-gray-200 mt-10 pt-6 text-right flex justify-end gap-6">
          <Button
            variant="secondary"
            type="submit"
            onClick={() => setStatus("draft")}
          >
            Save as Draft
          </Button>

          <Button
            type="submit"
            onClick={() => setStatus("published")}
          >
            Publish Hackathon
          </Button>
        </div>
      </div>
    </form>
  );
}
