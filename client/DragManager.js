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

    // функция для отмены переноса
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

    // инициировать начало переноса
    // document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
  }

  function findDroppable(event) {
    dragObject.avatar.hidden = true;
    // получить самый вложенный элемент под курсором мыши
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    dragObject.avatar.hidden = false;

    if (elem == null) return null;

    // .${dragObject.destination}

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
  dragObject.elem.style.position = 'static'
  console.log(dropChild)
  console.log(dragObject.root)
  if (dropChild) {
    if (dragObject.root === 'player') {
      console.log('were rying to swap items between player and backpack')
      dragObject.avatar.rollback();
      console.log('item was returned to its origin place')
    } else {

      if (dropElem.classList.contains('back-droppable')) {
        swapItemsInsideBackpack(dragObject.parent, dropElem)
      } else {
        swapItemsBeetween(dragObject, dropChild);
        // dropElem.appendChild(dragObject.elem.cloneNode(true));
        // dropChild.remove();
      }
    }

  } else {
    // dropElem.appendChild(dragObject.elem.cloneNode(true));
    if (dragObject.root === 'player') {
      deleteItemFromPlayer(dragObject.destination);
      addItemToBackpack(dragObject.item, dropElem);
    } else {
      if (dropElem.classList.contains('back-droppable')) {
        console.log('we swap items inside backpack')
        console.log(dropElem)
        swapItemsInsideBackpack(dragObject.parent, dropElem);
        console.log('backpack swapping completed')
      } else {
        console.log('deletion startings')
        deleteItemFromBackpack(dragObject.parent);
        console.log('problem isnt in deletion')
        console.log('adding item to player')
        addItemToPlayer(dragObject.destination, dragObject.item);
        console.log('player adding completed')
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
    console.log(parent, child)
    if (child === parent.children[i]) {
      position = i;
      return position;
    }
  }
}

function deleteItemFromBackpack(item) {
  var backpack = component.state.backpack;
  var id = findChildPosition(item);
  console.log(backpack, id, item)
  backpack[id] = null;

  component.setState({ backpack });
}

function addItemToBackpack(item, destination) {
  var backpack = component.state.backpack;
  var backpackId = findChildPosition(destination);

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

function swapItemsBeetween(fromBackpack, toPlayer) {
  var player = component.state.player;
  var equipment = player.equipment;
  var backpack = component.state.backpack;
  var playerId = fromBackpack.destination;
  var backpackId = findChildPosition(fromBackpack.parent);
  // console.log(player, '***', equipment, backpack, 'before')
  [equipment[playerId], backpack[backpackId]] = [backpack[backpackId], equipment[playerId]];
  // console.log(player, '***', equipment, backpack, 'after')
  component.setState({
    player,
    backpack
  })

}

function swapItemsInsideBackpack(first, second) {
  var firstId = findChildPosition(first);
  var secondId = findChildPosition(second);
  var backpack = component.state.backpack;
  // console.log(firstId, secondId, backpack[firstId], backpack[secondId], 'heyheyehey')
  // console.log(backpack, 'before')

  [backpack[firstId], backpack[secondId]] = [backpack[secondId], backpack[firstId]];
  // console.log(backpack, 'after')
  component.setState({ backpack })
}


export default DragManager;
