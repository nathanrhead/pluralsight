import React from 'react';

const Card  = (props) => {
  const profile = props;
  return (
    <div className="github-profile">
      <img src={profile.avatar_url} style={{height: "15vh"}} alt="avatar" />
      <div className="info">
        <div className="name">{profile.name}</div>
        <div className="company">{profile.company}</div>
      </div>
    </div>
  );
}

export default Card;
