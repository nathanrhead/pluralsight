import React, { useState } from 'react';
import axios from 'axios';

const Form = props => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async event => {
    event.preventDefault();
    const base_url = 'https://api.github.com/users/';
    try {
      const response = await axios.get(base_url + username);
      const profile = response.data;
      props.addProfile(profile);
      setUsername('');
      setError('');
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={event => setUsername(event.target.value)}
          placeholder='GitHub Username'
          required
        />
        <button>Add card</button>
      </form>
      {error ? <p>Invalid Username.</p> : ''}
    </div>
  );
};

export default Form;
