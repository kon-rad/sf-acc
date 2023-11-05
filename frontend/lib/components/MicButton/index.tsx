/* eslint-disable */
"use client";
import { IoMicCircle, IoMicOffCircleSharp } from "react-icons/io5";
import Button from "@/lib/components/ui/Button";
import { useSpeech } from "./hooks/useSpeech";

type MicButtonProps = {
  setMessage: string;
  currentMessage: string;
};

export const MicButton = ({
  setMessage,
  currentMessage,
}: MicButtonProps): JSX.Element => {
  const { isListening, speechSupported, startListening } = useSpeech({
    setMessage,
    currentMessage,
  });

  return (
    <Button
      className="p-2 sm:px-3"
      variant={"tertiary"}
      type="button"
      onClick={startListening}
      disabled={!speechSupported}
      data-testid="mic-button"
    >
      {isListening ? (
        <IoMicCircle
          style={{ color: "red" }}
          className="text-red text-lg sm:text-xl lg:text-2xl h-8 w-8"
        />
      ) : (
        <IoMicOffCircleSharp className="text-lg sm:text-xl lg:text-2xl h-8 w-8" />
      )}
    </Button>
  );
};
