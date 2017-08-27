import React from 'react';

const GameMessages = (props) => {
  var opened = props.opened ? 'opened' : '';
  var props = props.messages.map((prop, i) => (
    <p key={i} className={prop.type + '-message'}>{prop.text}</p>
  ))

  return (
    <div className={`messages ${opened}`}>
      {props}
    </div>
  )
}

export default GameMessages;
