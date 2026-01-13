import React, { useState, useEffect } from "react";
import { Input, Section, Textarea, Button } from "@/components/ui";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/components/ToastContext";
import { ImagePlus, X } from "lucide-react";
import uploadOnCloudinary from "@/lib/uploadOnCloudinary";
import { DetailedHackathon } from "@/types/types";

interface UpdateHackathonModalProps {
    isOpen: boolean;
    onClose: () => void;
    hackathon: DetailedHackathon;
}

const UpdateHackathonModal: React.FC<UpdateHackathonModalProps> = ({
    isOpen,
    onClose,
    hackathon,
}) => {
    const { addToast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [mode, setMode] = useState(hackathon.mode || "online");
    const [bannerImage, setBannerImage] = useState<string>(hackathon.bannerImage || "");

    useEffect(() => {
        if (isOpen) {
            setMode(hackathon.mode || "online");
            setBannerImage(hackathon.bannerImage || "");
        }
    }, [isOpen, hackathon]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            addToast("Updating Hackathon...");
            setIsUpdating(true);

            const formData = new FormData(e.currentTarget);
            formData.append("bannerImage", bannerImage);

            const res = await fetch(`/api/hackathons/${hackathon._id}`, {
                method: "PATCH",
                body: formData,
            }).then((res) => res.json());

            if (!res?.success) {
                addToast("Hackathon update failed");
            } else {
                addToast("Hackathon Updated Successfully");
                onClose();
                window.location.reload();
            }
        } catch (_) {
            addToast("Operation failed");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleBannerImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                addToast("Uploading Banner Image...");
                const url = await uploadOnCloudinary(file, "hackathon_banners");
                setBannerImage(url);
                addToast("Banner Image Uploaded Successfully");
            } catch (error) {
                addToast("Banner Image Upload Failed");
                console.error("Banner Image Upload Failed", error);
            }
        } else {
            addToast("No file selected for Banner Image");
        }
    };

    const formatDate = (date: Date | string) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    };

    const formatDateTime = (date: Date | string) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {isUpdating && (
                    <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center">
                        <Loader />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            🏁 Update Hackathon Data
                        </h1>
                        <p className="text-gray-600 text-sm mt-2">
                            Update the details of your hackathon below.
                        </p>
                    </div>

                    <hr className="mb-6 text-gray-200" />

                    <Section title="Basic Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                required
                                name="hackathonName"
                                label="Hackathon Name"
                                placeholder="Enter hackathon name"
                                defaultValue={hackathon.hackathonName}
                            />
                            <Input
                                name="tagline"
                                label="Short Tagline"
                                placeholder="E.g. Build. Learn. Compete."
                                defaultValue={hackathon.tagline}
                            />
                        </div>

                        <div className="mt-6">
                            <Textarea
                                required
                                name="description"
                                label="Description"
                                placeholder="Describe your hackathon, themes, and goals..."
                                defaultValue={hackathon.description}
                            />
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                            <div className="grid grid-cols-1 gap-6">
                                <Input
                                    name="tags"
                                    label="Related Tags"
                                    type="text"
                                    placeholder="E.g. AI, Hackathon, Gaming (comma separated)"
                                    defaultValue={hackathon.tags?.join(", ")}
                                />
                            </div>

                            <div>
                                <span className="inline-block text-sm font-medium text-gray-700 mb-1">
                                    Mode
                                </span>
                                <select
                                    name="mode"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value as "online" | "inplace")}
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
                                    defaultValue={hackathon.location}
                                />
                            )}
                        </div>
                    </Section>

                    <Section title="Media & Branding">
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium text-gray-700">
                                Hackathon Banner
                            </span>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group text-center relative overflow-hidden h-64">
                                {bannerImage ? (
                                    <img
                                        src={bannerImage}
                                        alt="Banner"
                                        className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
                                    />
                                ) : null}
                                <Input
                                    required
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleBannerImage}
                                />
                                <div className="p-4 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform z-10">
                                    <ImagePlus className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-sm font-semibold text-gray-900 z-10">
                                    Click to upload new banner
                                </span>
                                <span className="text-xs text-gray-500 mt-1 z-10">
                                    SVG, PNG, JPG or GIF (max. 800x400px)
                                </span>
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
                                defaultValue={formatDateTime(hackathon.startAt)}
                            />
                            <Input
                                required
                                name="registrationDeadline"
                                label="Registration Deadline"
                                type="date"
                                defaultValue={formatDate(hackathon.registrationDeadline)}
                            />
                            <Input
                                required
                                name="duration"
                                label="Duration"
                                placeholder="e.g. 48 hours"
                                defaultValue={hackathon.duration}
                            />
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
                                defaultValue={hackathon.minTeamSize}
                            />
                            <Input
                                required
                                name="maxTeamSize"
                                label="Max Team Size"
                                placeholder="e.g. 5"
                                type="number"
                                defaultValue={hackathon.maxTeamSize}
                            />
                        </div>

                        <div className="mt-6">
                            <Textarea
                                required
                                name="criteria"
                                label="Eligibility Criteria"
                                placeholder="e.g. College students only"
                                defaultValue={hackathon.criteria}
                            />
                        </div>

                        <div className="mt-6">
                            <Input
                                required
                                name="prize"
                                label="Prize"
                                placeholder="e.g. 50,000"
                                type="text"
                                defaultValue={hackathon.prize}
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
                                defaultValue={hackathon.organiserName}
                                readOnly
                            />
                            <Input
                                required
                                name="organiserEmail"
                                label="Contact Email"
                                placeholder="example@email.com"
                                type="email"
                                defaultValue={hackathon.organiserEmail}
                            />
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                name="socialLink"
                                label="Social Link"
                                placeholder="https://instagram.com/yourclub"
                                defaultValue={hackathon.socialLink}
                            />
                            <Input
                                name="webSiteLink"
                                label="Website Link"
                                placeholder="https://yourlink.com"
                                defaultValue={hackathon.webSiteLink}
                            />
                        </div>
                    </Section>

                    <div className="border-t border-gray-200 mt-10 pt-6 text-right flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Update Hackathon</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateHackathonModal;
