import Main from './components/Main.jsx';

var DoubleClick = (function() {
  // this function checks for user's double click.
  var component;
  var tapped = false;
  var doubleClick = function(e) {
    // if double click's target isn't an equipment item,
    // function returns nothing
    if (!e.target.classList.contains('draggable')) return;

    // function gathers all the data about clicked item and make the shadow
    // element appears
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
      // in order to create a double click the time between clicks has to be
      // lower than 300ms
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
