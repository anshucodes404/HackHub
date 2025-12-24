"use client";

import type React from "react";
import { useState } from "react";
import type {
  loginUser,
  logInuserObjectType,
  signInuserObjectType,
  signupUser,
  verifyOTPProps,
} from "@/types/types";
import { Button, ErrorMessage, Input } from "@/components/ui";
import { useUser } from "../UserContext";
import { useRouter } from "next/navigation";

const VerifyOTP: React.FC<verifyOTPProps> = ({ user }) => {

  const router = useRouter()
  const { setUser } = useUser()
  const [otp, setOtp] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  console.log(user);
  const mode = user?.mode;

  const buildData = (): loginUser | signupUser => {
    if (mode === "login") {
      return {
        collegeEmail: (user as logInuserObjectType).collegeEmail,
        otp,
        mode: (user as logInuserObjectType).mode,
      };
    } else {
      return {
        name: (user as signInuserObjectType).name,
        mobileNumber: (user as signInuserObjectType).mobileNumber,
        collegeEmail: (user as signInuserObjectType).collegeEmail,
        email: (user as signInuserObjectType).email,
        hostelEmail: (user as signInuserObjectType).hostelEmail,
        branch: (user as signInuserObjectType).branch,
        hostel: (user as signInuserObjectType).hostel,
        studyYear: (user as signInuserObjectType).studyYear,
        LinkedInLink: (user as signInuserObjectType).LinkedInLink,
        githubLink: (user as signInuserObjectType).githubLink,
        otp,
        mode: (user as signInuserObjectType).mode,
      };
    }
  };

  const VerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true)
    try {
      setError("")
      const data = buildData();
      console.log(data);
      const res = await fetch("/api/auth", {
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json());

      console.log(res);
      if(res.success){
        setUser(res.data)
        router.push("/hackathons")
      } else {
        setError("Incorrect OTP")
      }
    }
    finally {
      setVerifying(false)
    }
  };

  return (
    <div className="absolute top-0 w-full  backdrop-blur-2xl min-h-screen flex items-center justify-center">
      <form onSubmit={VerifyOtp} className="w-full max-w-sm px-4 bg-white py-3 rounded-2xl border-gray-300 shadow-md">

        <section className="text-2xl text-black font-bold text-center mb-3">
          OTP for {mode === "login" ? "Log In" : "Sign Up"} to HackHub
        </section>
        <hr className="text-gray-300 mb-3" />
        <div>
          <Input
            className="mb-3"
            label="OTP"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="mb-3">
          {
            error && <ErrorMessage message={error} />
          }
          </div>
          <Button type="submit">{!verifying ? "Verify OTP" : "Verifying..."}</Button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOTP;
