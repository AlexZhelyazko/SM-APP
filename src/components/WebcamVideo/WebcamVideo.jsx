import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import Webcam from "react-webcam";
import { makeRequest } from "../../axios";

export const WebcamVideo = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaStream, setMediaStream] = useState(null);
  const [video, setVideo] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (videoFile) => {
      console.log(videoFile);
      return makeRequest.post("/stories", { file: videoFile });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );
  const upload = async (e) => {
    try {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      // const formData = new FormData();
      // formData.append("file", blob, "recorded-video.webm");
      const res = await makeRequest.post("/upload", blob);
      console.log(res);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = async () => {
    try {
      let videoUrl = await upload();
      mutation.mutate(video);

      setVideo(null);
      setRecordedChunks([]);
    } catch (error) {
      console.log(error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream); // Сохраняем ссылку на MediaStream
      webcamRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.onstop = handleStopRecording;

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing the webcam:", err);
    }
  };

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop()); // Отключаем все треки MediaStream
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleStartRecording = () => {
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleDataAvailable = (e) => {
    if (e.data.size > 0) {
      setRecordedChunks((prev) => prev.concat(e.data));
    }
  };

  const handleDownload = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-video.webm";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    setRecordedChunks([]);
  };

  useEffect(() => {
    return () => {
      stopRecording(); // Отключаем камеру при размонтировании компонента
    };
  }, []);

  return (
    <div>
      <div>
        <video ref={webcamRef} autoPlay style={{ width: 640, height: 480 }} />
      </div>
      <div>
        {isRecording ? (
          <button onClick={handleStopRecording}>Stop Recording</button>
        ) : (
          <button onClick={handleStartRecording}>Start Recording</button>
        )}
      </div>
      {recordedChunks.length > 0 && (
        <div>
          <h2>Recorded Video:</h2>
          <video controls autoPlay style={{ width: 640, height: 480 }}>
            {recordedChunks.map((chunk, index) => (
              <source
                key={index}
                src={URL.createObjectURL(chunk)}
                type="video/webm"
              />
            ))}
          </video>
          <button onClick={handleDownload}>Download</button>
          <button onClick={handleUpload}>Upload</button>{" "}
          {/* Добавляем кнопку загрузки видео */}
        </div>
      )}
    </div>
  );
};
