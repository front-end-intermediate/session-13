import React from 'react';

import UserAvatar from './UserAvatar'

import { UserConsumer } from './UserProvider'

const UserStats = () => (
  <UserConsumer>
   { user => (
        <div className="user-stats">
        <div>
          <UserAvatar />
          {user.name}
        </div>
        <div className="stats">
          <div>{user.followers} Followers</div>
          <div>Following {user.following}</div>
        </div>
      </div>
   ) }
  </UserConsumer>
);

export default UserStats