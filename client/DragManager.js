import Main from './components/Main.jsx';

var component;


var DragManager = new function() {

  var dragObject = {};

  var self = this;

  function onMouseDown(e) {
    component = Main.this;
    if (e.which != 1) return;
    component.setState({ isMousedown: true })
    var elem = e.target.closest('.draggable');
    if (!elem) return;

    dragObject.elem = elem;
    dragObject.cells = document.querySelectorAll(`.${elem.dataset.destination}.droppable`);
    // запомним, что элемент нажат на текущих координатах pageX/pageY
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;
    dragObject.destination = elem.dataset.destination;
    dragObject.parent = elem.parentNode;


    if (elem.parentNode.classList.contains('droppable')) {
      dragObject.item = component.state.player.equipment[dragObject.destination];
      dragObject.root = 'player';
      // deleteItemFromPlayer(dragObject.destination);
    } else if (elem.parentNode.classList.contains('back-droppable')) {
      dragObject.root = 'backpack';
      dragObject.id = findChildPosition(dragObject.parent);
      dragObject.item = component.state.backpack[dragObject.id];
      // deleteItemFromBackPack(dragObject.id);
    }

    return false;
  }

  function onMouseMove(e) {
    if (!dragObject.elem) return; // элемент не зажат

    if (!dragObject.avatar) { // если перенос не начат...
      var moveX = e.pageX - dragObject.downX;
      var moveY = e.pageY - dragObject.downY;

      emphasizeRightCell(dragObject.cells, true);
      // если мышь передвинулась в нажатом состоянии недостаточно далеко
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }

      // начинаем перенос
      dragObject.avatar = createAvatar(e); // создать аватар
      if (!dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
        dragObject = {};
        return;
      }

      // аватар создан успешно
      // создать вспомогательные свойства shiftX/shiftY
      var coords = getCoords(dragObject.avatar);
      dragObject.shiftX = dragObject.downX - coords.left;
      dragObject.shiftY = dragObject.downY - coords.top;

      startDrag(e); // отобразить начало переноса
    }

    // отобразить перенос объекта при каждом движении мыши
    dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

    return false;
  }

  function onMouseUp(e) {
    if (dragObject.avatar) { // если перенос идет
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

    // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
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
