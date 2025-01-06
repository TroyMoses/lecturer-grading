"use client";

import React from "react";
import HeroImg from "../../../public/1234.png";
import Image from "next/image";
import ApplicationGuidelines from "../Guidelines";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Hero = () => {

  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  // const isAdmin = user?.publicMetadata?.role === "admin";
  // const isCommissioner = user?.publicMetadata?.role === "commissioner";
  // const isCAO = user?.publicMetadata?.role === "cao";
  // const isTechnical = user?.publicMetadata?.role === "technical";

  // if (isAdmin || isCommissioner || isCAO || isTechnical) {
  //   router.push("/dashboard/home");
  // }

  return (
    <div className="pt-[5rem] pb-[3rem]">
      <div className="w-[100%] h-[60vh] justify-center">
        <div className="w-[80%] mx-auto items-center justify-center gap-[2rem]">
          {/* Content */}
          <div className="flex flex-col justify-center items-center">
            <Image
              src={HeroImg}
              alt="Hero"
              width={50}
              height={50}
              className="w-[10%] h-[10%] rounded-full"
            />
            <h3 className="text-[16px] sm:text-[16px] text-center lg:text-[16px] text-[#05264e] leading-[3rem] lg:leading-[4rem] font-extrabold">
              Lecturer Grading System
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
