import React from 'react';

const Shadow = (props) => {
  var visible = (!!props.visible) ? 'visible' : '';


  return (
    <div className={`shadow ${visible}`} onClick={props.onClick}>
      <div>
        <p>props.message</p>
        <button>Click me</button>
      </div>

    </div>
  )
}


export default Shadow;
