import React, {useState, useEffect} from 'react'
import io from 'socket.io-client';

const socket = io("http://localhost:4000");

export const ChatClient = () => {

  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [listMessages, setListmessages] = useState([{
    body : "bienvenido al chat",
    user: "CPU",
  }])

  

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('message', { body: message, user: username})


    const newMsg = {
      body: message,
      user: username
    }

    setListmessages([...listMessages, newMsg])
    setMessage('');
  }

  useEffect(() => {
    const receiveMessage = msg => {
      setListmessages(...listMessages, msg)

      socket.on('message', receiveMessage)
    }
  
    return () => socket.off('message', receiveMessage)

  }, [listMessages])
  
  return (
    <>
    <input onChange={event => setUsername(event.target.value)} className='txt-username' type="text" placeholder='username' />
    <div className="div-chat">
      {
        listMessages.map( (message, idx) => (
          <p key={message+idx}>{message.user}: {message.body}</p>
        ))
      }
    </div>
    <form onSubmit={handleSubmit} className="form">
      <span className="title">Chat-io</span>
      <p className="description">Type your message.</p>
      <div className='div-type-chat'>
        <img
          className="emoji-icon"
          src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
          onClick={() => setShowPicker(!showPicker)} />
        {showPicker && <Picker className="prueba" onEmojiClick={onEmojiClick} />} 
        <input 
          value={message}
          placeholder="Type your message"
          onChange={ e => setMessage(e.target.value)}          
          type="text" name="text" id="chat-message"
          className="input-style" 
        />
        <button type="submit">Send</button>
      </div>
    </form>    
    </>
  )
}
