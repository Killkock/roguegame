import React from 'react';

const MobileControlBtns = (props) => {
  // this component returns a div with arrows, which will be shown if
  // player is playing the game via a small device. Otherwise, these arrows
  // will be hidden

  var mobile = Modernizr.touch;
  var callback = props.onTouchEvent;
    function mouseDown(e) {
      // if player just click an arrow, the player will move just for 1 cell.
      // But if he will clamp the arrow, the player will move every 500ms

      var interval;
      var self = e.target.classList.contains('fa') ? e.target.parentNode : e.target;
      self.classList.add('pressed');
      callback(self.dataset.direction);

      interval = setInterval(function() {
        callback(self.dataset.direction);
      }, 500)

      self.onmouseup = function() {
        self.classList.remove('pressed');
        clearInterval(interval);
        self.onmouseup = null;
      }

      self.ontouchend = function() {
        self.classList.remove('pressed');
        clearInterval(interval);
        self.onmouseup = null;
      }
    }

  return (
    <div id="mobile-buttons">
      <div id='top' onTouchStart={(e) => mouseDown(e)} data-direction='up'><i className="fa fa-arrow-up" aria-hidden="true"></i></div>
      <div id='bottom' onTouchStart={(e) => mouseDown(e)} data-direction='down'><i className="fa fa-arrow-down" aria-hidden="true"></i></div>
      <div id='left' onTouchStart={(e) => mouseDown(e)} data-direction='left'><i className="fa fa-arrow-left" aria-hidden="true"></i></div>
      <div id='right' onTouchStart={(e) => mouseDown(e)} data-direction='right'><i className="fa fa-arrow-right" aria-hidden="true"></i></div>
    </div>
  )
}

export default MobileControlBtns;
