import { useContext, useState, useEffect } from "react";
import { StoriesContext } from "../../context/storiesContext";
import { useLocation } from "react-router-dom";

const ExpandedStories = ({}) => {
  const { stories, setStories } = useContext(StoriesContext);
  const location = useLocation();
  let storyId = location.pathname.match(/\d+/)[0];
  const foundStory = stories.find((story) => story.storyId === +storyId);
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 3;

  const nextSlide = () => {
    if (startIndex + itemsToShow < stories.length) {
      itemsToShow = 3;
      setStartIndex((prev) => prev + 1);
    } else {
      itemsToShow = 2;
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      itemsToShow = 3;
      setStartIndex((prev) => prev - 1);
    } else {
      itemsToShow = 2;
    }
  };

  useEffect(() => {
    const foundIndex = stories.findIndex((story) => story.storyId === +storyId);
    setStartIndex(foundIndex);
  }, []);

  const visibleStories = stories.slice(
    startIndex > 0 ? startIndex - 1 : 0,
    startIndex + itemsToShow
  );

  return (
    <div className="expanded-video">
      {visibleStories.map((story) => (
        <div className="slide" key={story.storyId}>
          <video src={"/upload/" + story.mediaSrc} type="video/webm"></video>
          <span className="name">{story.name}</span>
        </div>
      ))}
      {/*<div className="controls">
        <button onClick={onPrev}>Prev</button>
        <button onClick={onNext}>Next</button>
        <button onClick={onClose}>Close</button>
      </div> */}
    </div>
  );
};

export default ExpandedStories;
