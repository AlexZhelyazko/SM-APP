import Posts from "../../components/Posts/Posts";
import Share from "../../components/Share/Share";
import Stories from "../../components/Storie/Stories";
import { useState } from "react";
import "./home.scss";
import { WebcamVideo } from "../../components/WebcamVideo/WebcamVideo";

export const Home = () => {
  const [editMode, setEditMode] = useState(false);
  const [editPostInfo, setEditPostInfo] = useState(null);
  const [webCamVisible, setWebCamVisible] = useState(false);
  return (
    <div className="home">
      {webCamVisible && <WebcamVideo setWebCamVisible={setWebCamVisible} />}
      <Stories setWebCamVisible={setWebCamVisible} />
      <Share
        editMode={editMode}
        setEditMode={setEditMode}
        setEditPostInfo={setEditPostInfo}
        editPostInfo={editPostInfo}
      />
      <Posts setEditMode={setEditMode} setEditPostInfo={setEditPostInfo} />
    </div>
  );
};
