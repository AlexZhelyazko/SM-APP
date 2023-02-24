import Post from '../Post/Post';
import { useQuery } from 'react-query';
import './posts.scss';
import { getPosts } from '../../axios';

const Posts = () => {
  const { isLoading, error, data } = useQuery(['posts'], getPosts);

  return (
    <div className="posts">
      {data && data.map((post: any) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
