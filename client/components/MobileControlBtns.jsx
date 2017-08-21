import React from 'react';

const MobileControlBtns = (props) => {
  var callback = props.onTouchEvent;
    function mouseDown(e) {
      var interval;
      var self = e.target.classList.contains('fa') ? e.target.parentNode : e.target;
      self.classList.add('pressed');
      interval = setInterval(function() {
        callback(self.dataset.direction);
      }, 500)

      self.onmouseup = function() {
        self.classList.remove('pressed');
        clearInterval(interval);
        self.onmouseup = null;
      }
    }



  return (
    <div id="mobile-buttons">
      <div id='top' onMouseDown={(e) => mouseDown(e)} data-direction='up'><i className="fa fa-arrow-up" aria-hidden="true"></i></div>
      <div id='bottom' onMouseDown={(e) => mouseDown(e)} data-direction='down'><i className="fa fa-arrow-down" aria-hidden="true"></i></div>
      <div id='left' onMouseDown={(e) => mouseDown(e)} data-direction='left'><i className="fa fa-arrow-left" aria-hidden="true"></i></div>
      <div id='right' onMouseDown={(e) => mouseDown(e)} data-direction='right'><i className="fa fa-arrow-right" aria-hidden="true"></i></div>
    </div>
  )
}

export default MobileControlBtns;
