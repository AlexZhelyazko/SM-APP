import { useContext, useEffect, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext.js";
import { useQuery } from "react-query";
import { makeRequest } from "../../axios";

const Stories = ({ setWebCamVisible }) => {
  const { currentUser } = useContext(AuthContext);
  const [stories, setStories] = useState();
  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories?userId=" + currentUser.id).then((res) => {
      setStories(res.data);
    })
  );

  useEffect(() => {
    return () => {
      // Очищаем URL объектов, чтобы предотвратить утечки памяти
      stories?.forEach((story) => URL.revokeObjectURL(story.mediaBlob.data));
    };
  }, [stories]);

  console.log(stories);

  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={() => setWebCamVisible(true)}>+</button>
      </div>
      {stories?.map((story) => {
        // Преобразование Buffer в Uint8Array
        const uint8Array = new Uint8Array(story.mediaBlob.data);
        console.log(uint8Array);

        // Создание Blob из Uint8Array
        const blob = new Blob([uint8Array], { type: "video/webm" });
        console.log(blob);

        return (
          <div className="story" key={story.id}>
            <video
              src={URL.createObjectURL(blob)}
              type="video/webm"
              controls={true}
            ></video>
            <span>{story.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Stories;
