import Main from './components/Main.jsx';

import { findChildPosition, swapItemsBeetween } from './DragManager.js';

var DoubleClick = (function() {
  var component;

  var tapped = false;

  var doubleClick = function(e) {
    if (!e.target.classList.contains('draggable')) return;

    component = Main.this;
    var isShadowVisible = true;
    var player = component.state.player;
    var parent = e.target.parentNode;
    var backpack = ( parent.classList.contains('back-droppable') ? true : false );
    var itemId = ( !backpack ? parent.classList[0] : findChildPosition(parent) );
    var item = ( backpack ? component.state.backpack[itemId] : player.equipment[itemId] );

    var shadowContent = {
      item,
      itemId,
      itemType: e.target.dataset.destination,
      root: ( backpack ? 'backpack' : 'player' )
    };

    if (!tapped) {
      tapped = setTimeout(function() {
          tapped = null
      }, 300);
    } else {
      clearTimeout(tapped);
      tapped = null;

      component.setState({
        isShadowVisible,
        shadowContent
      })

    }
  }

  return doubleClick;
})();



export default DoubleClick;
