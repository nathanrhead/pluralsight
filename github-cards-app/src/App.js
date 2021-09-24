import React from 'react';
import './App.css';
import axios from 'axios';

const CardList = (props) => (
	<div>
  	{props.profiles.map(profile => <Card {...profile} key={profile.id}/>)}
	</div>
);

class Card extends React.Component {
	render() {
  	const profile = this.props;
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
}

class Form extends React.Component {
  state = {
    username: ''
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const base_url = 'https://api.github.com/users/';
    const response = await axios.get(base_url + this.state.username)
    this.props.onSubmit(response.data);
    this.setState({ username: '' });
  }

	render() {
  	return (
    	<form onSubmit={this.handleSubmit}>
    	  <input 
          type="text" 
          value={this.state.username}
          onChange={event => this.setState({ username: event.target.value })}
          placeholder="GitHub Username" 
          required
        />
        <button>Add card</button>
    	</form>
    );
  }
}

export default class App extends React.Component {
  state = {
    profiles: [],
  };

  addNewProfile = (profileData) => {
    this.setState(prevState => ({
      profiles: [...prevState.profiles, profileData]
    }))
  };
  
	render() {
  	return (
    	<div>
    	  <div className="header">{this.props.title}</div>
        <Form onSubmit={this.addNewProfile}/>
        <CardList profiles={this.state.profiles} />
    	</div>
    );
  }	
}

// export default App;
