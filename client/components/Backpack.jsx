import React from 'react';

const Backpack = (props) => {
  var { backpack, backpackCapacity } = props;
  var items = [];

  for (var i = 0; i < backpack.length; i++) {
    if (backpack[i]) {
      var { damage, armor } = backpack[i];
      items.push(<div data-belong="backpack" className='back-droppable'><img className="draggable" src={`${backpack[i].type}.svg`} data-damage={damage} data-armor={armor} data-destination={backpack[i].type}></img></div>)
    } else {
      items.push(<div data-belong="backpack" className='back-droppable'></div>)
    }
  }

  return (
    <div id="backpack">
      {items}
    </div>
  )
}

export default Backpack;
