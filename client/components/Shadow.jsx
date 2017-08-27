import React from 'react';

import {
  deleteItemFromPlayer,
  deleteItemFromBackpack,
  swapItemsBeetween,
  addItemToBackpack
} from '../DragManager.js';

class Shadow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 0
    }
  }

  render() {
    var visible = (!!this.props.visible) ? 'visible' : '';
    var component = this.props.component;
    var root = this.props.content.root;
    var itemId = this.props.content.itemId;
    var item = this.props.content.item;
    var type = this.props.content.type;
    var tutorial;
    var currentPage = 0;
    var result;

    const hideShadow = () => {
      component.setState({
        isShadowVisible: false,
        shadowContent: {}
      })
    }

    const onDeleteClick = () => {
      ( root === 'player' ? deleteItemFromPlayer(itemId) : deleteItemFromBackpack(itemId) )
      hideShadow();
    }

    const onAddClick = () => {
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
        swapItemsBeetween(this.props.content.itemType, itemId);
      }

      hideShadow();
    }

    const nextTutorialPage = (next) => {
      var currentPage = this.state.currentPage;

      if ((next + currentPage) < 0 || (next + currentPage) >= tutorial.length) {
        return;
      }

      this.setState({ currentPage: next + currentPage })
    }

    if ( !root ) result = '';

    if ( this.props.content.message ) {
      result = <p>{this.props.content.message}</p>
    }


    if ( type === 'tutorial' ) {
      tutorial = this.props.content.text;
      result = (
        <div className='tutorial-div'>
          <p className='tutorial'>{tutorial[this.state.currentPage]}</p>
          <div id='shadow-buttons'>
            <a href="#" onClick={() => nextTutorialPage(-1)}>PREVIOUS</a>

            <a href="#" onClick={() => nextTutorialPage(1)}>NEXT</a>
          </div>
        </div>
      )
    }


    if ( root ) {

      result = (
        <div>
          <img src={`./public/img/${this.props.content.itemType}.svg`}></img>
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
        <a id="close" href="#" onClick={hideShadow}><i className="fa fa-times-circle fa-2x" aria-hidden="true"></i></a>
        {result}


      </div>
    )
  }

}


export default Shadow;
