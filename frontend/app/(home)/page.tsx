"use client";

import { useState } from "react";
import ImageUpload from "@/lib/components/ImageUpload";
import axios from "axios";
import Banner from "@/lib/components/Banner";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/lib/context/GlobalStateProvider";
import ZoomCall from "@/lib/components/ZoomCall";
const HomePage = (): JSX.Element => {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url("/assets/images/matrix.gif")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col justify-center items-center py-18"
    >
      <div className="flex mt-16 justify-center">
        <h1 className="text-5xl">hello world</h1>
        <ZoomCall />
      </div>
    </div>
  );
};

export default HomePage;
