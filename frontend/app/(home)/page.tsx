"use client";

import { useState } from "react";
import ImageUpload from "@/lib/components/ImageUpload";
import axios from "axios";
import Banner from "@/lib/components/Banner";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/lib/context/GlobalStateProvider";
import ZoomCall from "@/lib/components/ZoomCall";
import Chat from "@/lib/components/Chat";
import { useSupabase } from "@/lib/context/SupabaseProvider";

const HomePage = (): JSX.Element => {
  // const router = useRouter();

  const { session } = useSupabase();
  if (!session?.user.id) {
    alert("please login /login");
  }
  console.log("session: ", session?.user.id);
  return (
    <div
      style={{
        height: "100vh", // Set the container to the full viewport height
        display: "flex",
        flexDirection: "row", // Align children in a row
        alignItems: "stretch", // Stretch children to fill the container height
        backgroundImage: 'url("/assets/images/sfacc.png")',
        backgroundSize: "cover",
        backgroundPosition: "left",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ZoomCall component to take up the remaining space */}
      <div style={{ width: "70%", height: "100%" }}>
        <ZoomCall />
      </div>

      {/* Chat component with 30% screen width, on the right */}
      <div style={{ width: "30%", height: "100%" }}>
        <Chat />
      </div>
    </div>
  );
};

export default HomePage;
