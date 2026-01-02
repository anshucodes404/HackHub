import { Ban } from "lucide-react";

const ErrorMessage = ({ message }: { message: string }) => {
	return (
		<div className="w-full bg-red-200 text-red-600 border-red-400 px-3 py-1.5 my-2 rounded-md border text-sm">
			<div className="flex items-center gap-1.5">
				<Ban size={14} /> {message}
			</div>
		</div>
	);
};

export default ErrorMessage;
