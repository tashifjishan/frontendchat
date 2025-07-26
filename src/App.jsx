import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Initialize Pusher and subscribe to the channel
  useEffect(() => {
    const pusher = new Pusher("b78c3262430b985587a3", {
      cluster: "us2",
    });

    const channel = pusher.subscribe('chat-channel');
    channel.bind('new-message', function (data) {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      pusher.unsubscribe('chat-channel');
    };
  }, []);

  // Handle sending messages
  const sendMessage = async () => {
    if (name && message) {
      await axios.post('https://localhost:5000/send-message', {
        name,
        message,
      });
      setMessage('');
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Chat App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <textarea
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button onClick={sendMessage}>Send</button>

      <div>
        <h2>Chat Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.name}: </strong>{msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
