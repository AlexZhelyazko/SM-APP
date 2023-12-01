import "./webcam.scss";
import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import Webcam from "react-webcam";
import { makeRequest } from "../../axios";

export const WebcamVideo = ({ setWebCamVisible }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaStream, setMediaStream] = useState(null);
  const [video, setVideo] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (videoFile) => {
      return makeRequest.post("/stories", { mediaSrc: videoFile });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );
  const upload = async () => {
    try {
      const formData = new FormData();
      recordedChunks.forEach((chunk, index) => {
        formData.append("video", chunk, `video_${index}.webm`);
      });

      const res = await makeRequest.post("/upload-video", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = async (e) => {
    try {
      e.preventDefault();
      let mediaSrc = await upload();
      console.log(mediaSrc);
      mutation.mutate(mediaSrc);

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

  const handleCancel = () => {
    setVideo(null);
    setRecordedChunks([]);
  };

  const handleCloseVideo = () => {
    setVideo(null);
    setRecordedChunks([]);
    setWebCamVisible(false);
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div onClick={handleCloseVideo} className="webcam_modal">
      <div onClick={(e) => e.stopPropagation()} className="webcam_video">
        {recordedChunks.length > 0 ? (
          <div style={{ height: "100%" }}>
            <video controls autoPlay>
              {recordedChunks.map((chunk, index) => (
                <source
                  key={index}
                  src={URL.createObjectURL(chunk)}
                  type="video/webm"
                />
              ))}
            </video>
          </div>
        ) : (
          <video ref={webcamRef} autoPlay />
        )}
      </div>
      <div onClick={(e) => e.stopPropagation()} className="webcam_controls">
        {recordedChunks.length > 0 ? (
          <>
            <button className="webcam_controls_cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="webcam_controls_upload" onClick={handleUpload}>
              Upload
            </button>
          </>
        ) : isRecording ? (
          <button
            className="webcam_controls_stop"
            onClick={handleStopRecording}
          >
            <div></div>
          </button>
        ) : (
          <button
            className="webcam_controls_start"
            onClick={handleStartRecording}
          >
            <div></div>
          </button>
        )}
      </div>
    </div>
  );
};
