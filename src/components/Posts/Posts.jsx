import Post from '../Post/Post';
import { useQuery } from 'react-query';
import './posts.scss';
import { getPosts, makeRequest } from '../../axios';

const Posts = ({ userId, setEditPostInfo, setEditMode }) => {
  const { isLoading, error, data } = useQuery(['posts'], () =>
    makeRequest.get('/posts?userId=' + userId).then((res) => {
      return res.data;
    }),
  );

  return (
    <div className="posts">
      {error
        ? 'Something went wrong!'
        : isLoading || data === undefined
        ? 'loading'
        : data.map((post) => (
            <Post
              setEditPostInfo={setEditPostInfo}
              setEditMode={setEditMode}
              post={post}
              key={post.id}
            />
          ))}
    </div>
  );
};

export default Posts;
