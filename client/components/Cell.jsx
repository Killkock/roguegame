import React from 'react';

const Cell = (props) => {
  var state = props.state.type;
  var cell;
  var dungeon;

  if (props.level === 0) {
    dungeon = '';
  } else if (props.level === 1) {
    dungeon = 'basement';
  } else if (props.level === 2) {
    dungeon = 'dungeon'
  }

  if (props.state.type) {
    state = props.state.type;
  } else {
    state = props.state
  }

  return <div className={`cell ${state} ${dungeon}`}></div>;
}

export default Cell;
