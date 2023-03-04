import './Friends.scss';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { makeRequest } from '../../axios';
import { AuthContext } from '../../context/authContext';

export const Friends = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, data: followings } = useQuery(['relationship'], () =>
    makeRequest.get('/friends?followerUserId=' + currentUser.id).then((res) => {
      return res.data;
    }),
  );

  if (isLoading) return <div>Loading</div>;
  return (
    <div>
      {followings.map((el) => {
        return (
          <div className="following">
            <img
              src={
                el.profilePic ||
                'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
              }
              alt=""
            />
            <div className="followingInfo">
              <div>{el.name}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
