import React from 'react';
import ReactDOM from 'react-dom';
import ConfigScreen from './components/ConfigScreen';
import './styles.css';

const App = () => {
  return (
    <>
      <ConfigScreen />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('index'));
