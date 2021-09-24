import React from 'react';
import { useState } from 'react';

import './App.css';

function Button(props) {
  const handleClick = () => props.onclickFunction(props.increment);
	return (
    <button onClick={handleClick}>
      +{props.increment}
    </button>
  );
}

function Display(props) {
  return (
    <div>{props.count}</div>
  );
}

function App() {
  const [counter, setCounter] = useState(0);
  const incrementCounter = (num) => setCounter(counter + num);

  return (
    <React.Fragment>
      <Button 
        onclickFunction={incrementCounter}
        increment={1}
        />
      <Button 
        onclickFunction={incrementCounter}
        increment={5}
        />
      <Button 
        onclickFunction={incrementCounter}
        increment={10}
        />
      <Button 
        onclickFunction={incrementCounter}
        increment={100}
        />
      <Display count={counter} />
    </React.Fragment>
  );
}

export default App;