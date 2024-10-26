import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4080';

  const [message, setMessage] = useState<string>('');

  const fetchMessage = async () => {
    try {
      const response = await fetch(`${apiUrl}/test`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      console.error('There was a problem fetching the message:', error);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
      <div className="App">
        <header className="App-header">
          <h1>Hello!</h1>
          <p>{message ? `Message from Backend: ${message}` : ''}</p>
        </header>
      </div>
  );
}

export default App;
