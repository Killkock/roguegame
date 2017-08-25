import React from 'react';

const StatsOpenBtn = (props) => {
  var opened = props.isOpened ? 'opened' : '';

  return (
    <div id="close-header" className={opened} onClick={props.click}>
      <i className="fa fa-chevron-left" aria-hidden="true"></i>
    </div>
  )
}

export default StatsOpenBtn;
