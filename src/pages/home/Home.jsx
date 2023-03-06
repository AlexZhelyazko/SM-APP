import Posts from '../../components/Posts/Posts';
import Share from '../../components/Share/Share';
import Stories from '../../components/Storie/Stories';
import { useState } from 'react';
import './home.scss';

export const Home = () => {
  const [editMode, setEditMode] = useState(false);
  const [editPostInfo, setEditPostInfo] = useState(null);
  return (
    <div className="home">
      <Stories />
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
