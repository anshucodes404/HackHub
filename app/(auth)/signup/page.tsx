"use client";

import { signInuserObjectType } from "@/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import VerifyOTP from "../../../components/verifyOTP/page";
import { Button, ErrorMessage, Input, Section } from "@/components/ui";
import { SendHorizontal } from "lucide-react";
import { useToast } from "@/components/ToastContext";
import { useUser } from "@/components/UserContext";

const Page = () => {
   const { user } = useUser();
   const router = useRouter();

   useEffect(() => {
      if (user) router.push("/hackathons");
   }, [user, router]);

   const userObject = {
      name: "",
      mobileNumber: "",
      collegeEmail: "",
      email: "",
      hostelEmail: "",
      branch: "",
      hostel: "",
      studyYear: "",
      githubLink: "",
      LinkedInLink: "",
      mode: "",
   };

   const { addToast } = useToast();

   const [signInUser, setSignInUser] = useState<signInuserObjectType>(userObject);
   const [isSending, setIsSending] = useState<boolean>(false);
   const [otpSent, setOtpSent] = useState<boolean>(false);
   const [error, setError] = useState<string>("");

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setSignInUser((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!signInUser.collegeEmail.endsWith("@kiit.ac.in")) {
         setError("Please enter a valid college email ending with @kiit.ac.in");
         return;
      }

      if(!signInUser.email.includes("@")){
         setError("Please enter a valid personal email address");
         return;
      }

      setIsSending(true);
      try {
         const res = await fetch("/api/send-otp", {
            method: "POST",
            body: JSON.stringify({ collegeEmail: signInUser.collegeEmail, from: "signup" }),
         }).then((data) => data.json());

         const data = res.data;
         if (res.success) {
            signInUser.mode = data.mode;
            addToast("OTP sent! Please verify !!");
            setOtpSent(true);
         } else {
            addToast(res.message || "Failed to send OTP");
            router.push("/login");
         }

         console.log(data);
      } catch (error) {
         console.error(error)
         addToast("Error sending OTP. Please try again.");
      } finally {
         setIsSending(false);
      }
   };

   return (
      <>
         <form onSubmit={handleSubmit}>
            <div className="my-20 border border-gray-200 max-w-3xl mx-auto px-6 py-3 shadow-md rounded-2xl">
               <section className="text-center text-2xl font-bold text-black mb-3">
                  Sign Up to HackHub
               </section>

               <hr className="mb-3 text-gray-200" />

               <Section title="Personal Details">
                  <div className="grid md:grid-cols-2 gap-5 mb-3">
                     <Input
                        required
                        label="name"
                        name="name"
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter your name"
                        value={signInUser.name}
                     />

                     <Input
                        required
                        label="Mobile Number"
                        name="mobileNumber"
                        onChange={handleChange}
                        value={signInUser.mobileNumber}
                        type="tel"
                        minLength={10}
                        maxLength={10}
                        placeholder="Enter mobile number"
                     />
                  </div>

                  <Input
                     required
                     label="Personal Email"
                     onChange={handleChange}
                     type="email"
                     name="email"
                     placeholder="Enter your personal email"
                     value={signInUser.email}
                  />
               </Section>

               <Section title="Academic Details">
                  <div className="grid md:grid-cols-2 gap-5 mb-3">
                     <Input
                        required
                        label="College Email"
                        name="collegeEmail"
                        onChange={handleChange}
                        type="email"
                        placeholder="Enter college Email ID"
                        value={signInUser.collegeEmail}
                     />

                     <Input
                        required
                        label="Hostel Email"
                        name="hostelEmail"
                        placeholder="Enter Hostel Email"
                        type="email"
                        value={signInUser.hostelEmail}
                        onChange={handleChange}
                     />
                  </div>

                  <div className="grid md:grid-cols-3 gap-5 mb-3">
                     <Input
                        required
                        label="Branch"
                        name="branch"
                        placeholder="Enter your branch"
                        type="text"
                        value={signInUser.branch}
                        onChange={handleChange}
                     />

                     <Input
                        required
                        label="Hostel Name"
                        name="hostel"
                        placeholder="Enter Hostel name"
                        type="text"
                        value={signInUser.hostel}
                        onChange={handleChange}
                     />

                     <Input
                        required
                        label="Year of Study"
                        name="studyYear"
                        placeholder="Enter year of Stusy"
                        type="text"
                        value={signInUser.studyYear}
                        onChange={handleChange}
                     />
                  </div>
               </Section>

               <Section title="Additional Links">
                  <Input

                     className="mb-3"
                     label="Github Link"
                     name="githubLink"
                     onChange={handleChange}
                     type="text"
                     placeholder="Enter github link"
                     value={signInUser.githubLink}
                  />

                  <Input

                     label="LinkedIn Profile"
                     name="linkedinLink"
                     onChange={handleChange}
                     type="text"
                     placeholder="Enter LinkedIn Profile"
                     value={signInUser.LinkedInLink}
                  />
               </Section>

               {
                  error && <ErrorMessage message={error} />
               }

               <div className="text-center">
                  <Button
                     type="submit"
                     className="mx-auto flex items-center justify-center gap-2"
                  >
                     {!isSending ? "Get OTP" : "Sending..."}
                     {!isSending && <SendHorizontal size={16} />}
                  </Button>
               </div>
            </div>
         </form>
         {otpSent && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/10 backdrop-blur-md">
               <VerifyOTP user={signInUser} />
            </div>
         )}
      </>
   );
};

export default Page;
