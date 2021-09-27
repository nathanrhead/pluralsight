import React, { useState } from 'react';
import Form from './components/form';
import CardList from './components/card-list';

const App = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(false);
  let cleanUser = false;
  const addNewProfile = (profileData) => {
    if (profiles.length !== 0) {
      for(let user of profiles) {
        if (profileData.login === user.login) {
          setError(true);
          cleanUser = false;
          break;
        }
        else 
          cleanUser = true;
      }
    } else {
      setProfiles([...profiles, profileData]);
    }

    if (cleanUser) {
      setProfiles([...profiles, profileData]);
      setError(false);
    }
  };
  
  return (
    <div>
      <div className="header"></div>
      <Form addProfile={addNewProfile}/>
      <CardList profiles={profiles} />
      {error ? <p>That user is already in the list.</p> : ''}
    </div>
  );
}

export default App;
