import Main from './components/Main.jsx';

function AdjustViewport() {
  // if player is too close to a border, the function will scroll
  // the gamefield div in order to make a player be in center of the screen

  var gamefield = document.getElementById('main-container'),
      parentPos = gamefield.getBoundingClientRect(),
      childrenPos = document.querySelector('.cell.player').getBoundingClientRect(),
      relativePos = {},
      parentWidth = parentPos.right - parentPos.left,
      parentHeight = parentPos.bottom - parentPos.top;

    relativePos.top = childrenPos.top - parentPos.top,
    relativePos.left = childrenPos.left - parentPos.left;

    if (relativePos.top > ( parentHeight - 50 )) {
      gamefield.scrollTop += (parentHeight / 2);
    } else if (relativePos.top < (50)) {
      gamefield.scrollTop -= (parentHeight / 2);
    }

    if (relativePos.left > ( parentWidth - 50 )) {
      gamefield.scrollLeft += (parentWidth / 2);
    } else if (relativePos.left < (50)) {
      gamefield.scrollLeft -= (parentWidth / 2);
    }

}

export default AdjustViewport;
