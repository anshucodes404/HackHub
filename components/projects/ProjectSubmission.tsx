import ProjectForm from "./ProjectForm";

export interface ProjectSubmissionProps {
	startSubmission: Date | null;
  endSubmission: Date | null;
}

const ProjectSubmission = ({startSubmission, endSubmission}: ProjectSubmissionProps) => {
	return (
		<div className="border border-gray-200 rounded-lg shadow-md h-[650px] px-4 py-3">
			<ProjectForm startSubmission={startSubmission} endSubmission={endSubmission} />
		</div>
	);
};

export default ProjectSubmission;
