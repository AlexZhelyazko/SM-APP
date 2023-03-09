import './share.scss';
import Image from '../../assets/img.png';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';
import { useMutation, useQueryClient } from 'react-query';
import { addPost, addPostImg, getPosts, makeRequest } from '../../axios';

const Share = ({ editMode, setEditMode, setEditPostInfo, editPostInfo }) => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState('');
  console.log(typeof file);

  useEffect(() => {
    setDesc(editPostInfo?.desc);
    setFile(editPostInfo?.img);
  }, [editPostInfo]);

  const upload = async (e) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await makeRequest.post('/upload', formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post('/posts', newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['posts']);
      },
    },
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = '';
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setDesc('');
    setFile(null);
  };

  const editMutation = useMutation(
    (post) => {
      return makeRequest.put('/posts/' + editPostInfo.postId, post);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
      },
    },
  );

  const handleEdit = async (e) => {
    e.preventDefault();
    let imgUrl = '';
    if (file && typeof file !== 'string') imgUrl = await upload();
    editMutation.mutate({ desc, img: imgUrl });
    setEditPostInfo(null);
    setFile(null);
    setDesc('');
    setEditMode(false);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={
                currentUser.profilePic
                  ? '/upload/' + currentUser.profilePic
                  : 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
              }
              alt=""
            />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img
                className="file"
                alt=""
                src={typeof file === 'string' ? '/upload/' + file : URL.createObjectURL(file)}
              />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                e.target.files.length > 0 && setFile(e.target.files[0]);
              }}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
          </div>
          <div className="right">
            {editMode ? (
              <button onClick={(e) => handleEdit(e)}>Edit</button>
            ) : (
              <button onClick={(e) => handleClick(e)}>Share</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
