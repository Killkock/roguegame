import React from 'react';

const Cell = (props) => {
  var state;
  if (props.state.type) {
    state = props.state.type;
  } else {
    state = props.state
  }
  
  return <div className={`cell ${state}`}></div>
}

export default Cell;
