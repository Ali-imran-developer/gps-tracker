// import React, { useState, useEffect, useRef } from "react";

// export const SpeechToText: React.FC = () => {
//   const [transcript, setTranscript] = useState<string>("");
//   const [listening, setListening] = useState<boolean>(false);
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

//   useEffect(() => {
//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       console.warn("Browser does not support SpeechRecognition");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = true;
//     recognition.continuous = true;

//     recognition.onresult = (event: SpeechRecognitionEvent) => {
//       let interim = "";
//       let final = "";
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const result = event.results[i];
//         if (result.isFinal) {
//           final += result[0].transcript + " ";
//         } else {
//           interim += result[0].transcript;
//         }
//       }
//       setTranscript(final + interim);
//     };

//     recognition.onerror = (err) => {
//       console.error("Speech recognition error", err);
//     };

//     recognition.onend = () => {
//       console.log("Recognition ended");
//       setListening(false);
//     };

//     recognitionRef.current = recognition;

//     // Cleanup on unmount
//     return () => {
//       recognition.stop();
//     };
//   }, []);

//   const startListening = () => {
//     if (recognitionRef.current && !listening) {
//       recognitionRef.current.start();
//       setListening(true);
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current && listening) {
//       recognitionRef.current.stop();
//       setListening(false);
//     }
//   };

//   return (
//     <div>
//       <button onClick={startListening} disabled={listening}>
//         Start
//       </button>
//       <button onClick={stopListening} disabled={!listening}>
//         Stop
//       </button>
//       <p>Transcript: {transcript}</p>
//     </div>
//   );
// };


 // Install the axios and fs-extra package by executing the command "npm install axios fs-extra"

// import axios from "axios";

// const baseUrl = "https://api.assemblyai.com";

// const headers = {
//   authorization: "573b22a0049b499ab4f9bf150e0f7304",
// };

// // You can upload a local file using the following code
// // const path = "./my-audio.mp3";
// // const audioData = await fs.readFile(path);
// // const uploadResponse = await axios.post(`${baseUrl}/v2/upload`, audioData, {
// //   headers,
// // });
// // const audioUrl = uploadResponse.data.upload_url;

// const audioUrl = "https://assembly.ai/wildfires.mp3";

// const data = {
//   audio_url: audioUrl,
//   speech_model: "universal",
// };

// const url = `${baseUrl}/v2/transcript`;
// const response = await axios.post(url, data, { headers: headers });

// const transcriptId = response.data.id;
// const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;

// while (true) {
//   const pollingResponse = await axios.get(pollingEndpoint, {
//     headers: headers,
//   });
//   const transcriptionResult = pollingResponse.data;

//   if (transcriptionResult.status === "completed") {
//     console.log(transcriptionResult.text);
//     break;
//   } else if (transcriptionResult.status === "error") {
//     throw new Error(`Transcription failed: ${transcriptionResult.error}`);
//   } else {
//     await new Promise((resolve) => setTimeout(resolve, 3000));
//   }
// }



import React, { useState } from "react";
import axios from "axios";

export default function AudioUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:3000/transcribe/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTranscript(res.data.text);
      setStatus("Completed!");
    } catch (err) {
      console.error(err);
      setStatus("Error during transcription");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">🎙️ Audio Transcriber</h1>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="p-2 border border-gray-400 rounded"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Upload & Transcribe
      </button>
      <p className="text-gray-600">{status}</p>
      {transcript && (
        <div className="w-full max-w-2xl mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
          <p className="whitespace-pre-wrap">{transcript}</p>
        </div>
      )}
    </div>
  );
}
