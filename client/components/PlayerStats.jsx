import React from 'react';

import Backpack from './Backpack.jsx';
import PlayerItems from './PlayerItems.jsx';

const PlayerStats = (props) => {
  var opened = props.isOpened ? 'opened' : '';
  return (
    <aside className={opened}>
      <a href="#" id="aside-open" className={opened} onClick={props.click}><i className="fa fa-chevron-right" aria-hidden="true"></i></a>
      <div id="player-stats">
        <p>Attack: {'0' && props.stats.damage} <span>Armor: {'0' && props.stats.armor}</span></p>
      </div>
      <PlayerItems items={props.items}/>

      <div id='enemy-stats'></div>
      <Backpack backpack={props.backpack} items={props.items} backpackCapacity={props.backpackCapacity}/>
    </aside>
  )
}

export default PlayerStats;
