// ExpandedVideo.js
import React from "react";

const ExpandedStories = ({
  stories,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  return (
    <div className="expanded-video">
      <video
        src={"/upload/" + stories[currentIndex].mediaSrc}
        type="video/webm"
        controls={true}
      ></video>
      <span className="name">{stories[currentIndex].name}</span>
      <div className="controls">
        <button onClick={onPrev}>Prev</button>
        <button onClick={onNext}>Next</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ExpandedStories;
