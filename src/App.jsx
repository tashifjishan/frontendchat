import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false); // Track connection status

  useEffect(() => {
    const pusher = new Pusher('b78c3262430b985587a3', {
      cluster: 'us2',
    });

    pusher.connection.bind('connected', () => {
      setConnected(true);
      alert('Pusher connected successfully!');
    });

    pusher.connection.bind('error', (err) => {
      console.error('Pusher connection error:', err);
    });

    const channel = pusher.subscribe('chat-channel');
    channel.bind('new-message', function (data) {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe('chat-channel');
      pusher.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (name && message) {
      await axios.post('https://backchat-two.vercel.app/send-message', {
        name,
        message,
      });
      setMessage('');
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Chat App</h1>

      {connected ? (
        <>
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
        </>
      ) : (
        <p>Connecting to chat server...</p>
      )}

      <div>
        <h2>Chat Messages:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.name}: </strong>
              {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
