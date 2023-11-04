import React, { useState, useEffect, useRef } from "react";
import lamejs from "lamejs";

const VoiceToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setText((prev) => prev + transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        setText((prev) => prev + interimTranscript);
      };
    } else {
      alert("SpeechRecognition is not supported in this browser.");
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setText("");
      recognitionRef.current?.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    recognitionRef.current?.stop();
  };

  return (
    <div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="border rounded-xl m-8 py-2 px-6 bg-red-300"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <p className="text-sm text-center p-4">Text: {text}</p>
      {audioUrl && (
        <div className="flex flex-col justify-center items-center">
          <p>Audio Recording:</p>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default VoiceToText;
