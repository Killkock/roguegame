import React from 'react';

const GameMessages = (props) => {
  props = props.messages.map((prop) => <p className={prop.type + '-message'}>{prop.text}</p>);

  return (
    <div className="messages">
      {props}
    </div>
  )
}

export default GameMessages;
