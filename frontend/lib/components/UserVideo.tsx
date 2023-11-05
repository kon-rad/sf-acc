import React, { useState } from "react";
import Webcam from "react-webcam";
import { useGlobalState } from "@/lib/context/GlobalStateProvider";

const UserVideo = ({ name }: { name: string }) => {
  const webcamRef = React.useRef<Webcam>(null);
  const { setPreviewSource } = useGlobalState();
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleTakeScreenshot = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setScreenshot(imageSrc || null);
    setPreviewSource(imageSrc);
  };

  return (
    <div className="relative bg-gray-700 rounded-lg overflow-hidden">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png" // Set format to PNG
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 bg-black bg-opacity-60 w-full p-2 text-white text-sm">
        {name || "user 1"}
        {/* <button
          onClick={handleTakeScreenshot}
          className="ml-8 mt-1 bg-gray-600 text-white p-1 rounded"
        >
          Take Screenshot
        </button> */}
        {/* {screenshot && (
          <div className="mt-4">
            <img src={screenshot} alt="Screenshot" />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default UserVideo;
