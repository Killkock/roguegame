import React from 'react';

import {
  deleteItemFromPlayer,
  deleteItemFromBackpack,
  swapItemsBeetween,
  addItemToBackpack
} from '../DragManager.js';

const Shadow = (props) => {
  var visible = (!!props.visible) ? 'visible' : '';
  var component = props.component;
  var root = props.content.root;
  var itemId = props.content.itemId;
  var item = props.content.item;
  var result;

  var onDeleteClick = () => {
    ( root === 'player' ? deleteItemFromPlayer(itemId) : deleteItemFromBackpack(itemId) )
    component.setState({ isShadowVisible: false })
  }

  var onAddClick = () => {
    if (root === 'player') {
      let index;
      let backpack = component.state.backpack;

      for (let i = 0; i < backpack.length; i++) {
        if (!backpack[i]) {
          index = i;
          break;
        }

      }

      if (!index && index !== 0) {
        alert('there is not free space in backpack!');
        return;
      }

      console.log(item, itemId, 'attempting of adding to backpack')

      deleteItemFromPlayer(itemId);
      addItemToBackpack(item, index);


    } else if (root === 'backpack') {
      swapItemsBeetween(props.content.itemType, itemId);
    }

    component.setState({ isShadowVisible: false })
  }


  if ( !root ) result = '';

  if ( props.content.message ) {
    result = <p>{props.content.message}</p>
  }

  if ( root ) {

    result = (
      <div>
        <img src={`./public/img/${props.content.itemType}.svg`}></img>
        <p>ATTACK: {item.damage} <span>ARMOR: {item.armor}</span></p>

        <div id='shadow-buttons'>
          <a href="#" onClick={onDeleteClick}>DELETE</a>

          <a href="#" onClick={onAddClick}>
            { root === 'player' ? 'TAKE OFF' : 'PUT ON' }
          </a>
        </div>


      </div>
    )
  }

  return (
    <div className={`shadow ${visible}`}>
      <a id="close" href="#" onClick={props.onClick}><i className="fa fa-times-circle fa-2x" aria-hidden="true"></i></a>
      {result}


    </div>
  )
}


export default Shadow;
