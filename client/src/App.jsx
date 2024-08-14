import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// connect to socket.io-server
const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);

  // to automatically scroll to the bottom of the message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on('set user id', (id) => {
      setUserId(id);
    });

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('set user id');
      socket.off('chat message');
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      socket.emit('chat message', inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="App" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', marginBottom: '20px', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.userId === userId ? 'right' : 'left',
              marginBottom: '10px'
            }}
          >
            <span style={{
              background: msg.userId === userId ? '#dcf8c6' : '#f1f0f0',
              padding: '5px 10px',
              borderRadius: '10px',
              display: 'inline-block',
              color: 'black'
            }}>
              {msg.userId === userId ? 'You' : `User ${msg.userId.substr(0, 4)}`}: {msg.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ flexGrow: 1, marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Send</button>
      </form>
    </div>
  );
}

export default App;