import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext.js";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";

const Stories = ({ setWebCamVisible }) => {
  const { currentUser } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = 3; // Количество элементов, которые нужно отобразить

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories?userId=" + currentUser.id).then((res) => {
      setStories(res.data);
    })
  );

  const nextSlide = () => {
    if (startIndex + itemsToShow < stories.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const visibleStories = stories.slice(startIndex, startIndex + itemsToShow);

  return (
    <div className="stories">
      <div className="slider-container">
        <div className="slider">
          <div className="slide">
            <img src={currentUser.profilePic} alt="" />
            <span>{currentUser.name}</span>
            <button onClick={() => setWebCamVisible(true)}>+</button>
          </div>
          {visibleStories.map((story) => (
            <div className="slide" key={story.id}>
              <video
                src={"/upload/" + story.mediaSrc}
                type="video/webm"
                controls={true}
              ></video>
              <span>{story.name}</span>
            </div>
          ))}
        </div>
        <button className="prev" onClick={prevSlide}>
          Prev
        </button>
        <button className="next" onClick={nextSlide}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Stories;
