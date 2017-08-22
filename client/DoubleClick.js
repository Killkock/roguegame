import Main from './components/Main.jsx';

var DoubleClick = (function() {
  var component;

  var tapped = false;


  var doubleClick = function(e) {
    var parent;
    var backpack = false;
    component = Main.this;

    if (!e.target.classList.contains('draggable')) return;

    parent = e.target.parentNode;

    if (parent.classList.contains('back-droppable')) {
      backpack = true;
    }

    if (backpack) {

    }

    if (!tapped) {
      tapped = setTimeout(function() {
          tapped=null
      }, 300);
    } else {
      clearTimeout(tapped);
      tapped = null;
      console.log('double click!')
    }
  }

  return doubleClick;
})();



export default DoubleClick;
