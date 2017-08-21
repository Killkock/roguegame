import React from 'react';

import Backpack from './Backpack.jsx';
import PlayerItems from './PlayerItems.jsx';

const PlayerStats = (props) => {

  return (
    <aside>
      <div id="player-stats">
        <p>Health: {'0' && props.health}</p>
        <p>Level: {'0' && props.level  }</p>
        <p>Exp: {'0' && props.exp}</p>
        <p>Attack: {'0' && props.stats.damage}</p>
        <p>Armor: {'0' && props.stats.armor}</p>
      </div>
      <PlayerItems items={props.items}/>

      <div id='enemy-stats'></div>
      <Backpack backpack={props.backpack} backpackCapacity={props.backpackCapacity}/>
    </aside>
  )
}

export default PlayerStats;
