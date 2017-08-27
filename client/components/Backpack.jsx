import React from 'react';

const Backpack = (props) => {
  var { backpack, backpackCapacity } = props;
  var playerItems = props.items;
  var items = [];
  var isBetter;

  for (var i = 0; i < backpack.length; i++) {
    // this code returns a div with class back-droppable, which will represent
    // a cell of a backpack. If a backpack's cell isn't empty, the image
    // depicting an item will be put inside a div

    if (backpack[i]) {
      var { damage, armor } = backpack[i];
      var better = ( checkItemsForSuperiority(backpack[i], backpack[i].type) ?
                      'better' :
                      '');

      items.push(<div key={i} data-belong="backpack" className={`back-droppable ${better}`}><img className="draggable" src={`public/img/${backpack[i].type}.svg`} data-damage={damage} data-armor={armor} data-destination={backpack[i].type}></img></div>)
    } else {
      items.push(<div key={i} data-belong="backpack" className='back-droppable'></div>)
    }
  }

  function checkItemsForSuperiority(backpackItem, playerId) {
    // the function checks if a backpack item is better than an item which is
    // on the player

    var isBetter = false;
    var playerItem = playerItems[playerId];
    if (!playerItem                             ||
        playerItem.damage < backpackItem.damage ||
        playerItem.armor < backpackItem.armor) {
      isBetter = true;
    }

    return isBetter;
  }

  return (
    <div id="backpack">
      {items}
    </div>
  )
}

export default Backpack;
