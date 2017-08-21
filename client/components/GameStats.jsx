import React from 'react';

const GameStats = (props) => {
  var { enemies, pills, weapons, boss } = props.stats;

  return (
    <header>
      <ul>
        <li>Enemies: {enemies}</li>
        <li>Pills: {pills}</li>
        <li>Weapons: {weapons}</li>
        <li>Boss: {boss}</li>
      </ul>
      <button onClick={props.visibility}>Visibility</button>
      <button onClick={props.update}>Update</button>
    </header>
  )

}

export default GameStats;
