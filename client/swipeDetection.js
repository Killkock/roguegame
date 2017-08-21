function swipedetect(delay, callback){
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  var isSwipeAllowed = true;
  var xDown = null;
  var yDown = null;

  function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
  };

  function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault)
          e.preventDefault();
      e.returnValue = false;
    }

    function disableScroll() {
      if (window.addEventListener) // older FF
          window.addEventListener('DOMMouseScroll', preventDefault, false);
      window.ontouchmove  = preventDefault; // mobile
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var direction;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */
          direction = 'left';
        } else {
          direction = 'right';
        }
    } else {
        if ( yDiff > 0 ) {
          direction = 'up';
            /* up swipe */
        } else {
          direction = 'down';
            /* down swipe */
        }
    }

    if (isSwipeAllowed) callback(direction);
    isSwipeAllowed = false;
    setTimeout(delay, () => isSwipeAllowed = true);
    xDown = null;
    yDown = null;
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
  };

    // var touchsurface = el,
    // swipedir,
    // startX,
    // startY,
    // distX,
    // distY,
    // threshold = 150,
    // restraint = 100,
    // allowedTime = 300,
    // elapsedTime,
    // startTime,
    // handleswipe = callback || function(swipedir){}
    //
    // touchsurface.addEventListener('touchstart', function(e){
    //     var touchobj = e.changedTouches[0]
    //     swipedir = 'none'
    //     dist = 0
    //     startX = touchobj.pageX
    //     startY = touchobj.pageY
    //     startTime = new Date().getTime() // record time when finger first makes contact with surface
    //     e.preventDefault()
    // }, false)
    //
    // touchsurface.addEventListener('touchmove', function(e){
    //     e.preventDefault() // prevent scrolling when inside DIV
    // }, false)
    //
    // touchsurface.addEventListener('touchend', function(e){
    //     var touchobj = e.changedTouches[0]
    //     distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
    //     distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
    //     elapsedTime = new Date().getTime() - startTime // get time elapsed
    //     if (elapsedTime <= allowedTime){ // first condition for awipe met
    //         if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
    //             swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
    //         }
    //         else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
    //             swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
    //         }
    //     }
    //     handleswipe(swipedir)
    //     e.preventDefault()
    // }, false)
}


export default swipedetect;
