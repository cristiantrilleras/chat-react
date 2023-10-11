import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


const socket = io('http://localhost:4000');
// const socket = io('https://chat-server-edwin-dev.onrender.com/');

export const ChatClient = () => {

  // Estado que controla el mensaje actual  
  const [message, setMessage] = useState('');
  const [username, setUserName] = useState('Machine');
  // 2. estado de control para emojis
  const [showPicker, setShowPicker] = useState(false);

  // 3. función que asigna el emoji
  const onEmojiClick = (emojiObject) => {
    setMessage( prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };

  // estado para controlar la lista de mensajes
  const [listMessages, setListMessages] = useState([{
      body: "Welcome to the chat room",
      user: "Machine",
    }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Para enviar, usaremos el evento emit, este enviará el mensaje por medio del socket
    // recibe dos parámetros: el primero es una cadena con el nombre del evento "message", y el segundo su valor
    socket.emit('message', {body: message, user: username});
    const newMsg = {
      body: message,
      user: username
    }
    setListMessages([...listMessages,newMsg]);
    setMessage('');
  }

  useEffect(() => {
    //Muestra por consola el mensaje que el backend me envía
    const receiveMessage = msg => {
      setListMessages([...listMessages, msg])      
    }
    socket.on( 'message', receiveMessage);
    
    // Función que va a desuscribir el evento
    return () => socket.off( 'message',receiveMessage);
  }, [listMessages])
  

  return (
    <>
      <input onChange={event => setUserName(event.target.value)} className='txt-username' type="text" placeholder='username' />

      <div className='div-chat'>
        { listMessages.map( (message, idx) => (
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