import React from 'react';

const PlayerItems = (props) => {
  var { helmet, necklace, sword, armor, shield, ring, daggers, bracers, pants, 'leg-armor': legArmor } = props.items;


  return (
    <div id="player-items">

      <div className='helmet droppable'>{helmet ? <img className='draggable' src='helmet.svg' data-destination='helmet'></img> : ''}</div>
      <div className='necklace droppable'>{necklace ? <img className='draggable' src='necklace.svg' data-destination='necklace'></img> : ''}</div>
      <div className='items-flex'>
        <div className='sword droppable'>{sword ? <img className='draggable' src='sword.svg' data-destination='sword'></img> : ''}</div>
        <div className='armor droppable'>{armor ? <img className='draggable' src='armor.svg' data-destination='armor'></img> : ''}</div>
        <div className='shield droppable'>{shield ? <img className='draggable' src='shield.svg' data-destination='shield'></img> : ''}</div>
      </div>
      <div className='items-flex'>
        <div className='daggers droppable'>{daggers ? <img className='draggable' src='daggers.svg' data-destination='daggers'></img> : ''}</div>
        <div className='bracers droppable'>{bracers ? <img className='draggable' src='bracers.svg' data-destination='bracers'></img> : ''}</div>
        <div className='ring droppable'>{ring ? <img className='draggable' src='ring.svg' data-destination='ring'></img> : ''}</div>
      </div>
      <div className='pants droppable'>{pants ? <img className='draggable' src='pants.svg' data-destination='pants'></img> : ''}</div>
      <div className='leg-armor droppable'>{legArmor ? <img className='draggable' src='leg-armor.svg' data-destination='leg-armor'></img> : ''}</div>




    </div>
  )
}

export default PlayerItems;



  // <div data-attr="helmet" data-belong='player' className='helmet droppable'></div>
  // <div data-attr="necklace" data-belong='player' className='necklace droppable'></div>
  // <div className='items-flex'>
  //   <div data-attr="sword" data-belong='player' className='sword droppable'></div>
  //   <div data-attr="armor" data-belong='player' className='armor droppable'></div>
  //   <div data-attr="shield" data-belong='player' className='shield droppable'></div>
  // </div>
  // <div className='items-flex'>
  //   <div data-attr="first-ring" data-belong='player' className='first-ring ring droppable'></div>
  //   <div data-attr="bracers" data-belong='player' className='bracers droppable'></div>
  //   <div data-attr="second-ring" data-belong='player' className='second-ring ring droppable'></div>
  // </div>
  // <div data-attr="pants" data-belong='player' className='pants droppable'></div>
  // <div data-attr="leg-armor" data-belong='player' className='leg-armor droppable'></div>
