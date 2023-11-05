import axios from "axios";

const textToSpeech = async (inputText: string, voice: string) => {
  const API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_KEY;
  // const mayor = w3EdR9mKGvzchm52cxmz
  let VOICE_ID = "w3EdR9mKGvzchm52cxmz";
  if (voice === "ilya") {
    VOICE_ID = "M3UdLIQLd0fs1KTrfkcA";
  } else if (voice === "mayor") {
    VOICE_ID = "w3EdR9mKGvzchm52cxmz";
  } else if (voice === "reporter") {
    // marcus
    VOICE_ID = "Z2kF1nyIVpRr2AAAxlOh";
  }

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
