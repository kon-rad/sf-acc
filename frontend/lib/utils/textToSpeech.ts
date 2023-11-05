import axios from "axios";

const textToSpeech = async (inputText: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_KEY;
  const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

  console.log("text to speech called: ", inputText);

  const options = {
    method: "POST",
    url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    headers: {
      accept: "audio/mpeg",
      "content-type": "application/json",
      "xi-api-key": `${API_KEY}`,
    },
    data: {
      text: inputText,
    },
    responseType: "arraybuffer",
  };

  const speechDetails = await axios.request(options);
  console.log("text to speech called: speechDetails", speechDetails);

  return speechDetails.data;
};

export default textToSpeech;
