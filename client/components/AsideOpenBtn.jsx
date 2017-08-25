import React from 'react';

const AsideOpenBtn = (props) => {
  var opened = props.isOpened ? 'opened' : '';

  return (
    <div id="aside-open" className={opened} onClick={props.click}>
      <i className="fa fa-chevron-right" aria-hidden="true"></i>
    </div>
  )
}

export default AsideOpenBtn;
