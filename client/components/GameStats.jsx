import React from 'react';

const GameStats = (props) => {
  var { enemies, pills, weapons, boss } = props.stats;
  var opened = props.opened ? 'opened' : '';

  return (
    <header className={opened}>
      <a href="#" id="close-header" className={opened} onClick={props.openDiv}><i className="fa fa-chevron-left" aria-hidden="true"></i></a>
      <ul>
        <li>Enemies: {enemies}</li>
        <li>Pills: {pills}</li>
        <li>Weapons: {weapons}</li>
        <li>Boss: {boss}</li>
        <li><a onClick={props.visibility} href="#">VISIBILITY</a></li>
        <li><a onClick={props.update} href="#">UPDATE</a></li>
        <li><a onClick={props.shadow} href="#">SHADOW</a></li>
      </ul>
    </header>
  )

}

export default GameStats;
