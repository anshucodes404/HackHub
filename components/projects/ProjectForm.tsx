import { NotepadTextDashed, Upload } from "lucide-react";
import { Button, Input, Textarea } from "../ui";
import { useState, useRef } from "react";
import { useToast } from "../ToastContext";
import uploadOnCloudinary from "@/lib/uploadOnCloudinary";
import { useParams } from "next/navigation";

const ProjectForm = () => {
  const { addToast } = useToast();
  const [pptURL, setPptURL] = useState<string>("");
  const [uploaded, setUploaded] = useState<boolean>(false);
  const hackathonId = useParams().slug;
  const teamId = useParams().teamId;
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(hackathonId, teamId);
      const formData = new FormData(e.currentTarget);
      const data = JSON.stringify({
        projectName: formData.get("projectName"),
        projectDetails: formData.get("projectDetails"),
        githubLink: formData.get("githubLink"),
        demoLink: formData.get("demoLink"),
        pptURL,
      });
      console.log(data);

      const res = await fetch(
        `/api/hackathons/teams/projectSubmit?hackathonId=${hackathonId}&teamId=${teamId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }
      ).then((res) => res.json());

      if (res.success) {
        addToast("Project submitted successfully!");
        clearForm();
      } else {
        addToast("Failed to submit project. Please try again.");
      }
    } catch (error) {
      addToast("An error occurred while submitting the project.");
      console.error(error);
    }
  };

  const clearForm = () => {
    formRef.current?.reset();
    setPptURL("");
    setUploaded(false);
    const fileInput = document.getElementById("ppt-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (
      file &&
      file.type === "application/pdf" &&
      file.size <= 10 * 1024 * 1024
    ) {
      addToast("Uploading presentation, please wait...");
      setPptURL(await uploadOnCloudinary(file, "project_presentations"));
      addToast("Presentation uploaded successfully");
      setUploaded(true);
    } else {
      addToast("Please upload a PDF file under 10MB");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="h-[630px] no-scrollbar px-1"
    >
      <section className="">
        <div className="flex items-center text-2xl font-bold gap-2">
          <NotepadTextDashed />
          Project Submission
        </div>
      </section>
      <hr className="text-gray-300 mt-3" />

      <section className="mt-7">
        <div>
          <Input
            name="projectName"
            label="Project Name"
            required
            placeholder="Enter your project name"
          />
        </div>
        <div className="mt-3">
          <Textarea
            name="projectDetails"
            label="Project Description"
            required
            placeholder="Describe your project..."
          />
        </div>
        <div className="mt-3 ">
          <Input
            name="githubLink"
            required
            label="Github Repository Link"
            placeholder="https://github.com/user/project_repo"
          />
        </div>
        <div className="mt-3 ">
          <Input
            name="demoLink"
            label="Live Demo Link"
            placeholder="https://project-demo.com"
          />
        </div>
        <div className="mt-3">
          <label
            htmlFor="ppt-upload"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Upload Presentation (PDF) <span className="text-red-600">*</span>
          </label>
          <label
            htmlFor="ppt-upload"
            className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition hover:bg-blue-50/70 cursor-pointer"
          >
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <input
              name="ppt"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="ppt-upload"
              required
            />
            <p className="text-sm text-gray-600">
              {uploaded
                ? "Presentation uploaded successfully!"
                : "Click to upload or drag and drop"}
            </p>
            {!uploaded && (
              <p className="text-xs text-gray-400 mt-1">PDF up to 10MB</p>
            )}
          </label>
        </div>
        <div className="flex gap-3 justify-end mt-3">
          <Button variant="secondary" type="button" onClick={clearForm}>
            Clear Form
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </section>
    </form>
  );
};

export default ProjectForm;
