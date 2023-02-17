import Posts from '../../components/Posts/Posts';
import Stories from '../../components/Storie/Stories';
import './home.scss';

export const Home = () => {
  return (
    <div className="home">
      <Stories />
      <Posts />
    </div>
  );
};
