import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext.js";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";
import Next from "../../assets/next.png";
import { useNavigate } from "react-router-dom";

const Stories = ({ setWebCamVisible }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
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
      <div className="controlImg">
        <img
          src={Next}
          style={{ transform: "rotateY(180deg)" }}
          alt=""
          srcset=""
          onClick={prevSlide}
        />
      </div>
      <div className="slider-container">
        <div className="slider">
          <div className="slide" style={{ backgroundColor: "black" }}>
            <div
              onClick={() => setWebCamVisible(true)}
              style={{ widows: "100%", height: "100%" }}
            ></div>
            <span className="name">{currentUser.name}</span>
          </div>
          {visibleStories.map((story) => (
            <div className="slide" key={story.id}>
              <video
                onClick={() => navigate(`/stories/${story.id}`)}
                src={"/upload/" + story.mediaSrc}
                type="video/webm"
              ></video>
              <span className="name">{story.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="controlImg">
        <img src={Next} alt="" onClick={nextSlide} />
      </div>
    </div>
  );
};

export default Stories;
