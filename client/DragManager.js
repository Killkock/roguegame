import Main from './components/Main.jsx';

var component;

var DragManager = new function() {
  // the function gives player a possibility of dragging items
  var dragObject = {};
  var self = this;

  function onMouseDown(e) {
    // function imports Main's component state, so it will be able to change it
    component = Main.this;
    if (e.which != 1) return;

    // user cant control his character while mouse buttons in pressed
    component.setState({ isMousedown: true })

    // if clicks target isn't an equipment target function returns nothing
    var elem = e.target.closest('.draggable');
    if (!elem) return;

    dragObject.elem = elem;
    dragObject.cells = document.querySelectorAll(`.${elem.dataset.destination}.droppable`);
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;
    dragObject.destination = elem.dataset.destination;
    dragObject.parent = elem.parentNode;


    // function add to dragObject data about dragged item. The data depends
    // on the root of an item (player or backpack)
    if (elem.parentNode.classList.contains('droppable')) {
      dragObject.item = component.state.player.equipment[dragObject.destination];
      dragObject.root = 'player';
    } else if (elem.parentNode.classList.contains('back-droppable')) {
      dragObject.root = 'backpack';
      dragObject.id = findChildPosition(dragObject.parent);
      dragObject.item = component.state.backpack[dragObject.id];
    }

    return false;
  }

  function onMouseMove(e) {
    if (!dragObject.elem) return;

    if (!dragObject.avatar) {
      var moveX = e.pageX - dragObject.downX;
      var moveY = e.pageY - dragObject.downY;


      // the drag wont start until user shift the mouse more than 3px away of
      // the item
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }

      // while draggin, the proper cell in player's equipment will be emphasized
      emphasizeRightCell(dragObject.cells, true);

      dragObject.avatar = createAvatar(e);
      if (!dragObject.avatar) {
        dragObject = {};
        return;
      }

      var coords = getCoords(dragObject.avatar);
      dragObject.shiftX = dragObject.downX - coords.left;
      dragObject.shiftY = dragObject.downY - coords.top;

      startDrag(e);
    }

    dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

    return false;
  }

  function onMouseUp(e) {
    if (dragObject.avatar) {
      finishDrag(e);
    }

    component.setState({ isMousedown: false })

    dragObject = {};
  }

  function finishDrag(e) {
    var dropElem = findDroppable(e);
    emphasizeRightCell(dragObject.cells, false);

    if (!dropElem) {
      self.onDragCancel(dragObject);
    } else {
      self.onDragEnd(dragObject, dropElem);
    }
  }

  function createAvatar(e) {

    var avatar = dragObject.elem;
    var old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || ''
    };

    avatar.old = old;

    avatar.rollback = function() {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex
    };

    return avatar;
  }

  function startDrag(e) {
    var avatar = dragObject.avatar;

    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
  }

  function findDroppable(event) {
    dragObject.avatar.hidden = true;
    // получить самый вложенный элемент под курсором мыши
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    dragObject.avatar.hidden = false;

    if (elem == null) return null;

    return elem.closest(`.${dragObject.destination}.droppable`) || elem.closest('.back-droppable');
  }

  document.onmousemove = onMouseMove;
  document.onmouseup = onMouseUp;
  document.onmousedown = onMouseDown;

  this.onDragEnd = function(dragObject, dropElem) {};
  this.onDragCancel = function(dragObject) {};

};

function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}

DragManager.onDragCancel = function(dragObject) {
  // if drag cancels the function returns an item to its initial position
  dragObject.avatar.rollback();
};

DragManager.onDragEnd = function(dragObject, dropElem) {
  var dropChild = dropElem.children[0];
  dragObject.elem.style.position = 'static';

  if (dropChild) {
    if (dragObject.root === 'player') {
      dragObject.avatar.rollback();
    } else {
      if (dropElem.classList.contains('back-droppable')) {
        swapItemsInsideBackpack(dragObject.parent, dropElem)
      } else {
        swapItemsBeetween(dragObject.destination, findChildPosition(dragObject.parent));
      }
    }
  } else {
    if (dragObject.root === 'player') {
      deleteItemFromPlayer(dragObject.destination);
      addItemToBackpack(dragObject.item, dropElem);
    } else {
      if (dropElem.classList.contains('back-droppable')) {
        swapItemsInsideBackpack(dragObject.parent, dropElem);
      } else {
        deleteItemFromBackpack(dragObject.parent);
        addItemToPlayer(dragObject.destination, dragObject.item);
      }
    }
  }

};

function emphasizeRightCell(cell, on) {
  for (var i = 0; i < cell.length; i++) {
    if (on) {
      cell[i].classList.add('appropriate-item');
    } else {
      cell[i].classList.remove('appropriate-item');
    }

  }
}

function findChildPosition(elem) {
  // the function finds out id of the item, if the item belongs to backpack

  var child = elem;
  var parent = child.parentNode;
  var position;
  for (var i = 0; i < parent.children.length; i++) {
    if (child === parent.children[i]) {
      position = i;
      return position;
    }
  }
}

function deleteItemFromBackpack(item) {
  var backpack = component.state.backpack;
  var id = item;
  if ( !(typeof(item) === 'number') ) {
    var id = findChildPosition(item);
  }

  backpack[id] = null;

  component.setState({ backpack });
}

function addItemToBackpack(item, destination) {
  var backpack = component.state.backpack;
  var backpackId = destination;

  if (typeof(backpackId) !== 'number') {
    backpackId = findChildPosition(destination);
  }

  backpack[backpackId] = item;

  component.setState({ backpack })
}

function deleteItemFromPlayer(item) {
  var player = component.state.player;
  player.equipment[item] = null;

  component.setState({ player });
}

function addItemToPlayer(destination, item) {
  var player = component.state.player;
  player.equipment[destination] = item;

  component.setState({ player })
}

function swapItemsBeetween(playerId, backpackId) {
  // swaps items between player and backpack
  var player = component.state.player;
  var equipment = player.equipment;
  var backpack = component.state.backpack;

  [equipment[playerId], backpack[backpackId]] = [backpack[backpackId], equipment[playerId]];

  component.setState({
    player,
    backpack
  })

}

function swapItemsInsideBackpack(first, second) {
  var firstId = findChildPosition(first);
  var secondId = findChildPosition(second);
  var backpack = component.state.backpack;

  [backpack[firstId], backpack[secondId]] = [backpack[secondId], backpack[firstId]];

  component.setState({ backpack })
}


export {
  DragManager,
  findChildPosition,
  swapItemsBeetween,
  deleteItemFromPlayer,
  deleteItemFromBackpack,
  addItemToBackpack
}
