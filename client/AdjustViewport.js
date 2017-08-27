import Main from './components/Main.jsx';

function AdjustViewport() {
  var gamefield = document.getElementById('main-container'),
    parentPos = gamefield.getBoundingClientRect(),
    childrenPos = document.querySelector('.cell.player').getBoundingClientRect(),
    relativePos = {},
    parentWidth = parentPos.right - parentPos.left,
    parentHeight = parentPos.bottom - parentPos.top
    console.log(parentHeight, parentWidth);

    relativePos.top = childrenPos.top - parentPos.top,
    relativePos.right = childrenPos.right - parentPos.right,
    relativePos.bottom = childrenPos.bottom - parentPos.bottom,
    relativePos.left = childrenPos.left - parentPos.left;

    if (relativePos.top > ( parentHeight - 50 )) {
      console.log('player is too low')
      gamefield.scrollTop += (parentHeight / 2);
      // smoothScroll('top', (parentHeight / 2) - 100, 500)
    } else if (relativePos.top < (50)) {
      console.log('player is too high')
      gamefield.scrollTop -= (parentHeight / 2);
      // smoothScroll('top', -((parentHeight / 2) - 100), 500)
    }

    if (relativePos.left > ( parentWidth - 50 )) {
      console.log('player is too right')
      gamefield.scrollLeft += (parentWidth / 2);
      // smoothScroll('left', (parentWidth / 2) - 100, 500)
    } else if (relativePos.left < (50)) {
      console.log('player is too left')
      gamefield.scrollLeft -= (parentWidth / 2);
      // smoothScroll('left', -((parentWidth / 2) - 100), 500)
    }

    function smoothScroll(dir, amount, time) {
      var tick = 20;
      var chunk = amount / (time / tick);
      var start = Date.now();
      var interval = setInterval(function() {
        if (dir === 'left') {
          gamefield.scrollLeft += chunk;
        } else {
          gamefield.scrollTop += chunk;
        }

        console.log(scroll);
        ((Date.now() - start) > time) ? clearInterval(interval) : '';
        console.log('somethings is happend rigth now')
      }, tick)
    }
}

export default AdjustViewport;
