import './profile.scss';
import { useContext, useState } from 'react';
import FacebookTwoToneIcon from '@mui/icons-material/FacebookTwoTone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import PlaceIcon from '@mui/icons-material/Place';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Posts from '../../components/Posts/Posts';
import { Update } from '../../components/Update/Update';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { makeRequest } from '../../axios';
import { AuthContext } from '../../context/authContext';

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const params = useParams();
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(['users'], () =>
    makeRequest.get('/users/find/' + params.id).then((res) => {
      return res.data;
    }),
  );

  const { isLoading: relationshipLoading, data: relationshipData } = useQuery(
    ['relationship'],
    () =>
      makeRequest.get('/relationships?followedUserId=' + params.id).then((res) => {
        return res.data;
      }),
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (following) => {
      if (following) return makeRequest.delete('/relationships?userId=' + params.id);
      return makeRequest.post('/relationships', { userId: params.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['relationship']);
      },
    },
  );

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

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
              {data.city && (
                <div className="item">
                  <PlaceIcon />
                  <span>{data.city}</span>
                </div>
              )}
            </div>
            {currentUser.id === Number(params.id) ? (
              <button onClick={() => setOpenUpdate(true)}>Edit</button>
            ) : (
              <button onClick={handleFollow}>
                {!relationshipLoading && relationshipData.includes(currentUser.id)
                  ? 'Unfollow'
                  : 'Follow'}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={params.id} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
