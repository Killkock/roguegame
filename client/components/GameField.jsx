import React from 'react';

import Cell from './Cell.jsx'


const GameField = (props) => {
  var field = props.gameField;
  var [x, y] = props.playerLocation;
  var isVisible = props.isVisible;
  var visibleCells = calculateVisibleArea(x, y);
  var level = props.gameLevel;

  var cells = field.map((elem, i) => {
    return elem.map((cell, j) => {
      if (isVisible) {
        if (i === x && j === y) {
          cell = 'player';
        }
      } else {
        if (i === x && j === y) {
          cell = 'player';
          visibleCells.shift();
        } else if (visibleCells[0] && i === visibleCells[0][0] && j === visibleCells[0][1]) {

          visibleCells.shift();
        } else {
          cell = 'invisible';
        }
      }

      return <Cell key={(i+1) * j} state={cell} level={level}/>
    })
  })

  function calculateVisibleArea(x, y) {
    // the function calculates the area around the player which will be shown.
    // other cells will be hidden
    var result = [];
    for (let i = x - 2; i <= x + 2; i++) {
      if (i < 0 || i > 29) continue;
      for (let j = y - 2; j <= y + 2; j++) {
        if (j < 0 || j > 29) continue;
        result.push([i, j]);
      }
    }
    return result;
  }

  return (
    <main>
      {cells}
    </main>
  )
}

export default GameField;
