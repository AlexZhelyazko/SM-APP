import Posts from '../../components/Posts/Posts';
import Share from '../../components/Share/Share';
import Stories from '../../components/Storie/Stories';
import './home.scss';

export const Home = () => {
  return (
    <div className="home">
      <Stories />
      <Share />
      <Posts />
    </div>
  );
};
