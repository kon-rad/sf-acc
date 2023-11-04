"use client";

import { useState } from "react";
import ImageUpload from "@/lib/components/ImageUpload";
import axios from "axios";
import Banner from "@/lib/components/Banner";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/lib/context/GlobalStateProvider";

const HomePage = (): JSX.Element => {
  const router = useRouter();

  return (
    <>
      <main data-testid="home-page">
        <div className="flex mt-16 justify-center">
          <h1 className="text-5xl">hello world</h1>
        </div>
      </main>
    </>
  );
};

export default HomePage;
