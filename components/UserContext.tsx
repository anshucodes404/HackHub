"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import Loader from "./ui/Loader";

export interface UserData {
	_id: string;
	name: string;
	profileImageUrl?: string;
	collegeEmail: string;
   mobileNumber: string;
	email: string;
	hostelEmail: string;
	branch: string;
	hostel: string;
	studyYear: string;
	githubLink?: string;
	LinkedInLink?: string;
	createdAt: string;
	updatedAt: string;
}

interface UserContextType {
	user: UserData | null;
	setUser: (user: UserData | null) => void;
	refreshUser: () => Promise<void>;
	isUserLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("UserProvider is missing");
	}

	return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserData | null>(null);
	const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

	const refreshUser = async () => {
		setIsUserLoading(true);
		try {
			const res = await fetch("/api/user", { method: "GET" });
			const data = await res.json();
			if (data?.success) {
				setUser(data.data as UserData);
			}
		} catch (err) {
			console.error("Failed to fetch user:", err);
			setUser(null);
		} finally {
			setIsUserLoading(false);
		}
	};

	useEffect(() => {
		refreshUser();
	}, []);

	if (isUserLoading) {
		return <Loader fullscreen />;
	}

	return (
		<UserContext.Provider value={{ user, setUser, refreshUser, isUserLoading }}>
			{children}
		</UserContext.Provider>
	);
};
