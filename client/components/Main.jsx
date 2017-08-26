import React from 'react';

import GameField from './GameField.jsx';
import PlayerStats from './PlayerStats.jsx';
import Shadow from './Shadow.jsx';
import GameMessages from './GameMessages.jsx';
import GameStats from './GameStats.jsx';
import MobileControlBtns from './MobileControlBtns.jsx'
import PlayerState from './PlayerState.jsx';
import AsideOpenBtn from './AsideOpenBtn.jsx';
import StatsOpenBtn from './StatsOpenBtn.jsx';

import { DragManager } from '../DragManager.js';
import DoubleClick from '../DoubleClick.js';
import AdjustViewport from '../AdjustViewport.js';
import tutorialText from '../TutorialText.js';

class Main extends React.Component {
  constructor(props) {
    super(props)
    document.body.addEventListener('keydown', (e) => this.handlePress(e));
    document.body.addEventListener('click', DoubleClick);
  };

  componentDidMount() {
    AdjustViewport();
  }

  componentWillMount() {
    this.mounting();
    Main.this = this;
  }

  mounting() {
    var currentGameLevel = 0;
    var environment = this.createEnvironment();
    var gameLevels = 3;
    var gameFields = [];
    var playerLocations = [];
    var allStats = [];

    for (var level = 0; level < gameLevels; level++) {
      var { gameField, playerLocation, player, stats } = this.createGameField(level, player)
      player = player;
      gameFields.push(gameField);
      playerLocations.push(playerLocation);
      allStats.push(stats);
    }

    var isFinished = false;
    var isInBattle = false;

    this.setState({
      environment,
      playerLocation: playerLocations[currentGameLevel],
      gameField: gameFields[currentGameLevel],
      stats: allStats[currentGameLevel],
      gameFields,
      playerLocations,
      allStats,
      isFinished,
      isMapVisible: false,
      isInBattle,
      currentGameLevel,
      gameLevels,
      savePreviosSpot: false,
      gameFieldHeight: 40,
      gameFieldWidth: 40,
      consoleMsgs: [],
      player: player,
      backpack: new Array(8),
      backpackCapacity: 8,
      isMousedown: false,
      isShadowVisible: false,
      shadowContent: {},
      isAsideOpened: false,
      isStatsDivOpened: false
    })
  }

  createEnvironment() {
    var self = this;
    function Creation(type) {
      this.type = type;
    }

    function Wall() {
      Creation.call(this, 'wall');
    };
    Wall.prototype = Object.create(Creation.prototype);

    function Road() {
      Creation.call(this, 'road');
    };
    Road.prototype = Object.create(Creation.prototype);

    function Space() {
      Creation.call(this, 'space');
    };
    Space.prototype = Object.create(Creation.prototype);

    function Door(dest) {
      Creation.call(this, 'door');
      this.destination = dest;
    };
    Door.prototype = Object.create(Creation.prototype);

    Door.prototype.action = function(component, callback) {
      if (confirm('do you want to go on the another level?')) {
        var level = this.destination;
         component.setState({
          currentGameLevel: level,
          gameField:  component.state.gameFields[level],
          playerLocation:  component.state.playerLocations[level],
          stats:  component.state.allStats[level],
          isMapVisible: false
        })
      } else {
        callback();
        component.setState({ savePreviousSpot: this })
      }
    }

    function Enemy(level) {
      Creation.call(this, 'enemy');
      this.level = level || 1;
      this.hp = 30 * this.level;
    }

    Enemy.prototype = Object.create(Creation.prototype);

    Enemy.prototype.attack = function() {
      return (Math.round(Math.random() * 20) + 5) * this.level;
    }

    function Player() {
      Creation.call(this, 'player');
      this.experience = 0;
      this.level = Math.floor( this.experience / 100 ) || 1;
      this.hp = 100;
      this.maxHP = 100 + ( 100 * (this.level - 1) * 0.5);
      this.equipment = {
        helmet: null,
        necklace: null,
        armor: null,
        sword: {
          damage: 5,
          armor: 0,
          type: 'sword'
        },
        shield: null,
        daggers: null,
        ring: null,
        bracers: null,
        'leg-armor': null
      }
    }

    function Boss() {
      this.type = 'boss'
    };

    Boss.prototype = new Enemy(10);

    Player.prototype = Object.create(Creation.prototype);

    Player.prototype.calculateStats = function() {
      // the function calculates all the stats which are given to player from
      // his equipment

      var equipment = this.equipment;
      var damage = 0;
      var armor = 0;
      for (var key in equipment) {
        if (!equipment[key]) continue;
        damage += equipment[key].damage;
        armor += equipment[key].armor;
      }

      return {
        damage,
        armor
      }
    }

    Player.prototype.attack = function(enemy, callback) {
      var { damage: playerDamage, armor } = this.calculateStats();
      var playerAttack = playerDamage * this.level;
      var enemyAttack = enemy.attack();

      this.hp -= (enemyAttack > armor) ? (enemyAttack - armor) : 0;

      enemy.hp -= playerAttack;
      self.setState({ player: this })
      console.log(`You have just attacked mob. Your hp: ${this.hp}. Mob: ${enemy.hp}`)
      if (this.hp <= 0) {
        return 'player';
      } else if (enemy.hp <= 0) {
        var enemies = self.state.enemies - 1;
        self.setState({ enemies })
        return 'enemy';
      }
    }



    function Pill() {
      Creation.call(this, 'pill')
      this.action = function(player) {
        player.hp = ( (player.hp + 30) > player.maxHP ? player.maxHP : player.hp + 30 );
        return 'pills';
      };
    };

    Pill.prototype = Object.create(Creation.prototype);

    function Equipment() {
      // randomly creates an equipment and randomly sets its stats

      var random = Math.floor(Math.random() * 10);
      var armor = (Math.round(Math.random() * 3)) + 1;
      var damage = (Math.round(Math.random() * 15)) + 1;
      var type;
      var stats;



      if (random === 0) {
        type = 'sword';
        stats = 'attack';
      } else if (random === 1) {
        type = 'helmet';
        stats = 'defence';
      } else if (random === 2) {
        type = 'necklace';
        stats = 'mixed';
      } else if (random === 3) {
        type = 'armor';
        stats = 'defence';
      } else if (random === 4) {
        type = 'shield';
        stats = 'defence';
      } else if (random === 5) {
        type = 'ring';
        stats = 'mixed';
      } else if (random === 6) {
        type = 'bracers';
        stats = 'defence';
      } else if (random === 7) {
        type = 'leg-armor';
        stats = 'defence';
      } else if (random === 8) {
        type = 'pants';
        stats = 'defence';
      } else if (random === 9) {
        type = 'daggers';
        stats = 'attack';
      }



      if (stats === 'attack') {
        damage *= 2;
        armor = 0;
      } else if (stats === 'defence') {
        armor *= 2;
        damage = 0;
      }

      console.log(type, stats, armor, damage)

      Creation.call(this, type);
      this.armor = armor;
      this.damage = damage;


    }

    Equipment.prototype = Object.create(Creation.prototype);

    return {
      Enemy,
      Player,
      Space,
      Door,
      Road,
      Wall,
      Boss,
      Pill,
      Equipment
    }
  }

  createGameField(level, player) {
    var env = this.state
                    ? this.state.environment
                    : this.createEnvironment();

    var gameField = [];
    var roomHeads = [];
    var height = 40;
    var width = 40;
    var roomsAmount = 15;
    var stats;

    for (let i = 0; i < height; i++) {
      gameField[i] = [];
      for (let j = 0; j < width; j++) {
        gameField[i][j] = new env.Wall();
      }
    }

    var freeRoom = [];

    for (var i = 0; i < roomsAmount; i++) {
      fillRoom();
    }

    drawTheRoads();

    fillGameField(this);

    if (level !== 0) {
      console.log(gameField[roomHeads[0].x - 1], roomHeads[0].x - 1)
      gameField[roomHeads[0].x][roomHeads[0].y] = player;
      if (level === 2) {
        gameField[roomHeads[0].x - 1][roomHeads[0].y] = new env.Door(level - 1);
      } else {
        gameField[roomHeads[0].x - 1][roomHeads[0].y] = new env.Door(level - 1);
        gameField[roomHeads.slice(-1)[0].x][roomHeads.slice(-1)[0].y] = new env.Door(level + 1);
      }
    } else {
      gameField[roomHeads[0].x][roomHeads[0].y] = new env.Player();
      gameField[roomHeads.slice(-1)[0].x][roomHeads.slice(-1)[0].y] = new env.Door(level + 1);
    }

    var playerLocation = [roomHeads[0].x, roomHeads[0].y];
    var player = gameField[roomHeads[0].x][roomHeads[0].y];

    return {
      gameField,
      playerLocation,
      player,
      stats
    }

    function fillGameField(self) {
      var enemies = 0,
          pills = 0,
          weapons = 0,
          boss = 0,
          x, y, i;

      for (i = 0; i < freeRoom.length; i++) {
        [x, y] = freeRoom[i];
        gameField[x][y] = chooseCellFiller(x, y, self);
      }

      function chooseCellFiller(i, j, self) {
        if (gameField[i][j].type !== 'space') return gameField[i][j];
        let random = Math.random()

        if (random > 0.97) {
          pills++;
          return new env.Pill();
        } else if (random > 0.92) {
          enemies++;
          return new env.Enemy(level + 1);
        } else if (random < 0.02) {
          weapons++;
          var equip = new env.Equipment();
          return equip;
        } else {
          return new env.Space();
        }
      }

      stats = {
        enemies,
        pills,
        weapons,
        boss
      }
    }

    function fillRoom() {
      var size = generateRoom();
      var width = size.width;
      var height = size.height;
      var place = chooseCellForRoom(size);
      var x = place.x;
      var y = place.y;
      var maxHeight = (x + height) < 40 ? x + height : 40;
      var maxWidth = (y + width) < 40 ? y + width : 40;

      for (var i = x; i < maxHeight; i++) {
        for (var j = y; j < maxWidth; j++) {
          if (gameField[i] === undefined || gameField[i][j] === undefined) continue;
          freeRoom.push([i, j]);
          gameField[i][j] = new env.Space();
        }
      }
    }

    function generateRoom() {
      var minWidth = 4;
      var minHeight = 4;
      var maxWidth = 8;
      var maxHeight = 8;

      var width = Math.round(Math.random() * (maxWidth - minWidth)) + minWidth;
      var height = Math.round(Math.random() * (maxHeight - minHeight)) + minHeight;

      return {
        width: width,
        height: height
      }
    }

    function chooseCellForRoom(size) {
      var { width, height } = size;
      var place;
      var isFree = isAreaFree();

      while (!isFree) {
        isFree = isAreaFree();
      }

      function isAreaFree() {
        var isFree = true;
        place = random();
        var { x, y } = place;

        outer: for (var i = x; i < x + height; i++) {
          for (var j = y; j < y + width; j++) {
            if (gameField[i] === undefined || gameField[i][j] === undefined) continue;
            if (gameField[i][j] === 1) {
              isFree = false;
              break outer;
            }
          }
        }
        return isFree;
      }
      roomHeads.push(place);

      return place;

      function random() {
        var x = Math.floor(Math.random() * 40);
        var y = Math.floor(Math.random() * 40);

        return {
          x: x,
          y: y
        }
      }
    }

    function drawTheRoads() {
      // function connects rooms with each other

      for (var j = 0; j < roomHeads.length; j++) {
        if (!checkForRoomsConnection(roomHeads[0].x, roomHeads[0].y, roomHeads[j])) {
          // if rooms aren't connected => connect them
          paveTheWay(roomHeads[j], roomHeads[roomHeads.length - 1 - j]);
        }
      }

      for (var i = 1; i < roomHeads.length; i++) {
        if (!checkForRoomsConnection(roomHeads[0].x, roomHeads[0].y, roomHeads[i])) {
          paveTheWay(roomHeads[0], roomHeads[i]);
        }
      }

      function paveTheWay(room1, room2) {
        // function connects 2 rooms

        var xDifference = room2.x - room1.x;
        var yDifference = room2.y - room1.y;

        for (var diff of range(xDifference)) {
          gameField[room1.x + diff][room1.y] = (gameField[room1.x + diff][room1.y].type === 'room') ?
                                                  new env.Space() :
                                                  new env.Road();
        }

        for (var diff of (range(yDifference))) {
          gameField[room2.x][room1.y + diff] = (gameField[room2.x][room1.y + diff].type === 'room') ?
                                                  new env.Space() :
                                                  new env.Road();
        }

      }

      function range(num) {
          // function returns array of numbers from 0 to num or from num to 0,
          // it depends on num value (more or less than 0)

          var result = [];
          if (num > 0) {
            for (var i = 1; i <= num; i++) {
              result.push(i);
            }
          } else {
            for (var j = -1; j >= num; j--) {
              result.push(j)
            }
          }

          return result;
      }

      function checkForRoomsConnection(room1, room2) {
        // the function checks if 2 rooms are connected.
        // it recursively checks every surrounding cell until the destination is
        // reached or all of the surrounding cells are visited

        var successfulWays = [];

        iter(room1.x, room1.y, room2, [{x: room1.x, y: room1.y}]);

        if (successfulWays.length !== 0) {
          return true;
        } else {
          return false;
        }

        function iter(x, y, destination, visitedCells) {
          if (!isCellValid(x, y)) return;
          if (!isCellPassable(x, y)) return;
          if (isCellVisited(x, y, visitedCells)) return;
          if (x === destination.x && y === destination.y) {
            successfulWays.push(visitedCells)
            return;
          }

          visitedCells.push({ x: x, y: y });

          iter(x + 1, y, destination, visitedCells.slice());
          iter(x - 1, y, destination, visitedCells.slice());
          iter(x, y + 1, destination, visitedCells.slice());
          iter(x, y - 1, destination, visitedCells.slice());

          function isCellVisited(x, y, arr) {
            var visited = false;

            for (var i = 0; i < arr.length; i++) {
              if (arr[i].x === x && arr[i].y === y) {
                visited = true;
                break;
              }
            }

            return visited;
          }

          function isCellValid(x, y) {
            if (gameField[x] === undefined || gameField[x][y] === undefined) {
              return false;
            }

            return true;
          }

          function isCellPassable(x, y) {
            if (gameField[x][y].type === 'wall') {
              return false;
            }

            return true;
          }
        }
      }
    }
  }

  handlePress(e) {
    // function which is invoked when user presses w-a-s-d or
    // arrow buttons which apeears on small screens

    if (this.state.isFinished) return;
    if (this.state.isMousedown) return;
    if (this.state.isShadowVisible) return;


    var savePreviousSpot = this.state.savePreviousSpot;
    var [x, y] = this.state.playerLocation;
    var nX = x;
    var nY = y;
    var gameField = this.state.gameField;
    var player = gameField[x][y];
    var dest;

    if (e.key === 'a' || e === 'left') {
      nY--;
    } else if (e.key === 'd' || e === 'right') {
      nY++;
    } else if (e.key === 'w' || e === 'up') {
      nX--;
    } else if (e.key === 's' || e === 'down') {
      nX++;
    } else {
      return;
    }

    AdjustViewport();

    const changePlayersLocation = () => {
      var playerLocations = this.state.playerLocations;
      gameField[x][y] = savePreviousSpot || new this.state.environment.Space();
      gameField[nX][nY] = player;
      playerLocations[this.state.currentGameLevel] = [nX, nY];
      this.setState({
        playerLocation: [nX, nY],
        playerLocations,
        gameField,
        savePreviousSpot: false
      });
    }

    const sendMessage = (text, type) => {
      // function consoles messages to the message's div

      this.setState({
        consoleMsgs: [{ text, type }, ...this.state.consoleMsgs]
      })
    }

    const pickWeapon = (item) => {
      // function invokes when user meets an equipment.
      // if users backpack is full, nothing but message printing will happen.
      // Otherwise function puts an item to players backpack

      var backpack = this.state.backpack;
      var index;
      for (var i = 0; i < backpack.length; i++) {
        if (!backpack[i]) {
          index = i;
          break;
        }
      }

      if (!index && index !== 0) {
        sendMessage('You cant pick this item, your backpack is full', 'warning');
        return false;
      }

      backpack[index] = item;

      this.setState({
        backpack
      });

      return true;
    }

    const decreaseStat = (stat) => {
      // when player kills enemy or picks a pill or equipment, the function
      // decreases an amount of enemy of picked item

      var allStats = this.state.allStats;
      var stats = allStats[this.state.currentGameLevel];
      stats[stat] -= 1;

      this.setState({ allStats })
    }

    dest = this.state.gameField[nX][nY];
    if (dest.type === 'space' || dest.type === 'road') {
      changePlayersLocation();
    } else if (dest.type === 'door') {
      dest.action(this, changePlayersLocation);
    } else if (dest.type === 'wall') {

    } else if (dest.type === 'enemy') {
      sendMessage('You attacked an enemy', 'warning')
      var assault = player.attack(dest);
      if (assault === 'undefined') return;
      if (assault === 'enemy') {
        decreaseStat('enemies')
        sendMessage('Enemy was defeated', 'defeat')
        player.experience += 20;
        this.handleDeath(nX, nY);
        return;
      }
      if (assault === 'player') {
        this.state.player.hp = 0;
        sendMessage('You lost', 'warning');
        this.handleDeath(x, y);
        this.setState({
          isFinished: true,
          player: this.state.player
        })
      }
    } else if (dest.type === 'pill') {
      decreaseStat(dest.action(player));
      changePlayersLocation();
    } else if (dest.type !== undefined ){
      if (pickWeapon(dest)) {
        decreaseStat('weapons');
        sendMessage('You took a helper item', 'helper');
        changePlayersLocation();
      }

    }
  }

  handleDeath(x, y) {
    var gameField = this.state.gameField;
    gameField[x][y] = new this.state.environment.Space();
    this.setState({ gameField })
  }

  render() {
    return (
      <div id='rogue-container' >
        <GameStats
          stats={this.state.stats}
          update={() => {
            this.mounting();

          }}
          visibility={() => {
              this.setState({ isMapVisible: !this.state.isMapVisible })
              console.log(this.state.isMapVisible)
          }}
          shadow={() => this.setState({ isShadowVisible: !this.state.isShadowVisible })}
          tutorial={() => this.setState({
            isShadowVisible: true,
            shadowContent: tutorialText
          })}
          openDiv={() => {
            this.setState({
              isAsideOpened: false,
              isStatsDivOpened: !this.state.isStatsDivOpened
            })
          }}
          opened={this.state.isStatsDivOpened}
        />

        <PlayerStats
          stats={this.state.player.calculateStats()}
          backpack={this.state.backpack}
          backpackCapacity={this.state.backpackCapacity}
          items={this.state.player.equipment}
          isOpened={this.state.isAsideOpened}
          click={() => this.setState({ isAsideOpened: !this.state.isAsideOpened })}
        />


      <div id="main-container">
          <GameField
            gameField={this.state.gameField}
            playerLocation={this.state.playerLocation}
            isVisible={this.state.isMapVisible}
            gameLevel={this.state.currentGameLevel}
            health={this.state.player.hp}
            level={this.state.player.level}
            exp={this.state.player.experience}

          />
        <PlayerState player={this.state.player}/>
        </div>

        <Shadow
          visible={this.state.isShadowVisible}
          content={this.state.shadowContent}
          component={this}
        />
        <GameMessages
          messages={this.state.consoleMsgs}
          opened={this.state.isStatsDivOpened}
        />
      <AsideOpenBtn
        isOpened={this.state.isAsideOpened}
        click={() => this.setState({
          isAsideOpened: !this.state.isAsideOpened,
          isStatsDivOpened: false
        })}
      />
      <StatsOpenBtn
        isOpened={this.state.isStatsDivOpened}
        click={() => this.setState({
          isStatsDivOpened: !this.state.isStatsDivOpened,
          isAsideOpened: false
        })}
      />
        <MobileControlBtns onTouchEvent={(e) => this.handlePress(e)}/>
      </div>
    )
  }
}

export default Main;
