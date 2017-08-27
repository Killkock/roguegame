import React from 'react';

const GameStats = (props) => {
  var { enemies, pills, weapons, boss } = props.stats;
  var opened = props.opened ? 'opened' : '';

  return (
    <header className={opened}>
      <ul>
        <li>Enemies: {enemies} Boss: {boss}</li>
        <li>Weapons: {weapons} Pills: {pills}</li>
        <li><a onClick={props.visibility} href="#">VISIBILITY</a></li>
        <li><a onClick={props.update} href="#">UPDATE</a></li>
        <li><a onClick={props.tutorial} href="#">TUTORIAL</a></li>
      </ul>
    </header>
  )

}

export default GameStats;
