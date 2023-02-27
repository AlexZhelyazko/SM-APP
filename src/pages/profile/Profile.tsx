import './profile.scss';
import { useContext } from 'react';
import FacebookTwoToneIcon from '@mui/icons-material/FacebookTwoTone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Posts from '../../components/Posts/Posts';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { makeRequest } from '../../axios';
import { AuthContext } from '../../context/authContext';

const Profile = () => {
  const params = useParams();
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  const { isLoading, error, data } = useQuery(['users'], () =>
    makeRequest.get('/users/find/' + params.id).then((res) => {
      return res.data;
    }),
  );

  console.log(data);
  if (isLoading) {
    return <div>Load</div>;
  }

  return (
    <div className="profile">
      <div className="images">
        <img
          src={
            data.coverPic
              ? data.coverPic
              : 'https://images.unsplash.com/photo-1619251173183-eccbb0f03cd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2ltcGxlJTIwY29sb3J8ZW58MHx8MHx8&w=1000&q=80'
          }
          alt=""
          className="cover"
        />
        <img
          src={
            data.profilePic
              ? data.profilePic
              : 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
          }
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>USA</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>lama.dev</span>
              </div>
            </div>
            {currentUser.id === Number(params.id) ? <button>Edit</button> : <button>follow</button>}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts />
      </div>
    </div>
  );
};

export default Profile;
