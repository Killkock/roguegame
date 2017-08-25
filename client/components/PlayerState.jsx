import React from 'react';

const PlayerState = (props) => {
  var { hp, maxHP, experience, level } = props.player;
  var percentHP = ( hp / maxHP ) * 100;
  var exp = experience % 100;

  return (
    <div id="player-state">
      <div className='bar health'>
        <div style={{width: `${percentHP}%`}}></div>
      </div>
      <div className='bar experience'>
        <div style={{width: `${exp}`}}></div>
      </div>
      <div className='level'>
        <p><i className="fa fa-chevron-up" aria-hidden="true"></i>{level}</p>
      </div>

    </div>
  )
}

export default PlayerState;
