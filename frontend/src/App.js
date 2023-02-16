import 'bootstrap/dist/css/bootstrap.min.css';

import logo from './logo.svg';
import Navigation from './Navigation';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Oooo spinny thing
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
