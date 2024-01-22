import { useContext, useState } from 'react';
import './comments.scss';
import { AuthContext } from '../../context/authContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getComments, makeRequest } from '../../axios';
import moment from 'moment';

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);

  const [desc, setDesc] = useState(null);

  const { isLoading, error, data } = useQuery(['comments'], () =>
    makeRequest.get('/comments?postId=' + postId).then((res) => {
      return res.data;
    }),
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post('/comments', newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['comments']);
      },
    },
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc('');
  };

  return (
    <div className="comments">
      <div className="write">
        <img
          src={
            currentUser.profilePic
              ? '/upload/' + currentUser.profilePic
              : 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
          }
          alt=""
        />
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          type="text"
          placeholder="write a comment"
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? 'Something went wrong'
        : isLoading
        ? 'loading'
        : data.map((comment) => (
            <div className="comment">
              <img
                src={
                  currentUser.profilePic
                    ? '/upload/' + currentUser.profilePic
                    : 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
                }
                alt=""
              />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">{moment(comment.createdAt).fromNow()}</span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
