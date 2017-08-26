import React from 'react';

const GameStats = (props) => {
  var { enemies, pills, weapons, boss } = props.stats;
  var opened = props.opened ? 'opened' : '';

  return (
    <header className={opened}>
      <ul>
        <li>Enemies: {enemies}</li>
        <li>Pills: {pills}</li>
        <li>Weapons: {weapons}</li>
        <li>Boss: {boss}</li>
        <li><a onClick={props.visibility} href="#">VISIBILITY</a></li>
        <li><a onClick={props.update} href="#">UPDATE</a></li>
        <li><a onClick={props.shadow} href="#">SHADOW</a></li>
        <li><a onClick={props.tutorial} href="#">TUTORIAL</a></li>
      </ul>
    </header>
  )

}

export default GameStats;
