import React from "react";
import UserVideo from "./UserVideo";

const demo = false;
const ZoomCall = () => {
  const users = [
    { id: 1, name: "Dr. Therapist", img: "/assets/images/bot-1.png" },
    { id: 2, name: "Dr. Siddhartha Buddha", img: "/assets/images/bot-2.png" },
    { id: 3, name: "Dr. J. Christ", img: "/assets/images/bot-3.png" },
  ];
  const username = "konrad";
  const displayUsers = [...users];
  console.log("users: ", users);
  const VideoComponent = ({ src, name }) => (
    <div className="relative bg-gray-700 rounded-lg overflow-hidden">
      <video
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        controls
      />
      <div className="absolute bottom-0 bg-black bg-opacity-60 w-full p-2 text-white text-sm">
        {name}
      </div>
    </div>
  );
  return (
    <div className="w-full h-screen flex items-center justify-center p-4 mb-16">
      <div className="grid grid-cols-2 gap-4 w-full h-full max-w-2xl">
        {displayUsers.map((user, index) => {
          if (demo && index === 2) {
            return (
              <VideoComponent key={user.id} src={user.img} name={user.name} />
            );
          }
          return (
            <div
              key={user.id}
              className="relative bg-gray-700 rounded-lg overflow-hidden"
            >
              <img
                src={user.img}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 bg-black bg-opacity-60 w-full p-2 text-white text-sm">
                {user.name}
              </div>
            </div>
          );
        })}
        <UserVideo name={username} />
      </div>
    </div>
  );
};

export default ZoomCall;
