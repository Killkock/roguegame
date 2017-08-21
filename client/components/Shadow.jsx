import React from 'react';

const Shadow = (props) => {
  var visible = (!!props.visible) ? 'visible' : '';


  return (
    <div className={`shadow ${visible}`}>
      <button>Click me</button>
    </div>
  )
}


export default Shadow;
