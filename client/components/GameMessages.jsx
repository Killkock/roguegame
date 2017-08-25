import React from 'react';

const GameMessages = (props) => {
  var opened = props.opened ? 'opened' : '';
  props = props.messages.map((prop) => <p className={prop.type + '-message'}>{prop.text}</p>);

  return (
    <div className={`messages ${opened}`}>
      {props}
    </div>
  )
}

export default GameMessages;
