/* eslint-disable */
import { useEffect, useState } from "react";

export const isSpeechRecognitionSupported = (): boolean => {
  if (
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  ) {
    return true;
  }

  return false;
};

type useSpeechProps = {
  setMessage: any;
  currentMessage: string;
};

export const useSpeech = ({ setMessage, currentMessage }: useSpeechProps) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      setSpeechSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const mic = new SpeechRecognition();

      mic.continuous = true;
      mic.interimResults = false;
      mic.lang = "en";

      mic.onstart = () => {
        console.log("Mics on");
      };

      mic.onend = () => {
        console.log("Mics off");
      };

      mic.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.log(event.error);
        setIsListening(false);
      };

      mic.onresult = (event: SpeechRecognitionEvent) => {
        const interimTranscript =
          event.results[event.results.length - 1][0].transcript;
        setMessage(currentMessage + interimTranscript);
      };

      if (isListening) {
        mic.start();
      }

      return () => {
        if (mic) {
          mic.stop();
        }
      };
    }
  }, [isListening, setMessage]);

  const startListening = () => {
    setIsListening((prevIsListening) => !prevIsListening);
  };

  return { startListening, speechSupported, isListening };
};
