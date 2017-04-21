import React from 'react';
import GameField from './GameField.jsx'


class Main extends React.Component {
  constructor(props) {
    super(props)

    document.body.addEventListener('keydown', (e) => this.handlePress(e))
  }

  componentWillMount() {
    var enemies = [0];
    var environment = this.createEnvironment();
    var gameField = this.createGameField(enemies);
    var playerLocation = [2, 2];
    var isGoing = true;
    var player = gameField[playerLocation[0]][playerLocation[1]];
    this.setState({
      environment,
      gameField,
      playerLocation,
      isGoing,
      player,
      enemies
    })
  }

  createEnvironment() {
    var self = this;
    function Creation(type) {
      this.type = type;
    }

    function Wall() {};
    Wall.prototype = new Creation('wall');

    function Space() {};
    Space.prototype = new Creation('space');

    function Enemy(level) {
      this.level = level || 1;
      this.hp = 30 * this.level;
    }

    Enemy.prototype = new Creation('enemy');

    Enemy.prototype.attack = function() {
      return (Math.round(Math.random() * 8) + 4) * this.level;
    }

    function Player() {
      this.level = 1;
      this.experience = 0;
      this.hp = 100 * this.level;
      this.weapon = 0;
    }

    function Boss() {
      this.type = 'boss'
    };

    Boss.prototype = new Enemy(10);


    Player.prototype = new Creation('player')

    Player.prototype.attack = function(enemy, callback) {
      var playerAttack = (20 + this.weapon) * this.level;
      var enemyAttack = enemy.attack();

      this.hp -= enemyAttack;
      enemy.hp -= playerAttack;
      self.setState({ player: this })
      console.log(`You have just attacked mob. Your hp: ${this.hp}. Mob: ${enemy.hp}`)
      if (this.hp <= 0) {
        console.log('player has to be dead')
        return 'player';
      } else if (enemy.hp <= 0) {
        var enemies = self.state.enemies - 1;
        self.setState({ enemies })
        return 'enemy';
      }
    }

    function Pill() {
      this.restoreHp = 50;
    };

    Pill.prototype = new Creation('pill');

    function Weapon() {}

    Weapon.prototype = new Creation('weapon');

    Weapon.prototype.getWeapon = function() {
      return (Math.round(Math.random() * 30))
    }


    return {
      Enemy,
      Player,
      Space,
      Wall,
      Boss,
      Pill,
      Weapon
    }

  }

  createGameField(enemies) {
    var env = this.state
                    ? this.state.environment
                    : this.createEnvironment();

    var result = [];

    for (let i = 0; i < 20; i++) {
      result[i] = [];
      for (let j = 0; j < 20; j++) {
        result[i][j] = createCell(i, j);
      }
    }

    return result;

    function createCell(i, j) {
      let random = Math.random()
      if (i === 2 && j === 2) {
        var player = new env.Player();

        return player;
      } else if (i === 0 || j === 0 || i === 19 || j === 19) {
        return new env.Wall();
      } else if (i === 10 && j === 10) {
        return new env.Boss();
      } else if (random > 0.97) {
        return new env.Pill();
      } else if (random > 0.92) {
        enemies[0] += 1;
        return new env.Enemy();
      } else if (random < 0.02) {
        return new env.Weapon();
      } else if (random < 0.2) {
        return new env.Wall();
      } else {
        return new env.Space();
      }
    }
  }


  handlePress(e) {
    if (!this.state.isGoing) return;
    var [x, y] = this.state.playerLocation;
    var nX = x;
    var nY = y;
    var gameField = this.state.gameField;
    var player = gameField[x][y];
    var dest;
    if (e.key === 'ArrowLeft') {
      nY--;
    } else if (e.key === 'ArrowRight') {
      nY++;
    } else if (e.key === 'ArrowUp') {
      nX--;
    } else if (e.key === 'ArrowDown') {
      nX++;
    }
    dest = this.state.gameField[nX][nY];
    if (dest.type === 'space') {
      gameField[x][y] = new this.state.environment.Space();
      gameField[nX][nY] = player;
      this.setState({
        playerLocation: [nX, nY],
        gameField
      });
      return;
    } else if (dest.type === 'wall') {
      console.log('You cant move here')
    } else if (dest.type === 'enemy') {
      var assault = player.attack(dest);
      if (assault === 'undefined') return;
      if (assault === 'enemy') {
        player.experience += 10;
        this.handleDeath(nX, nY);
        return;
      }
      if (assault === 'player') {
        console.log('You are looser!!');
        this.handleDeath(x, y);
        this.setState({ isGoing: false })
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
      <div>
        <h1>Roguelike game</h1>
        <aside>
          <p>Health: {this.state.player && this.state.player.hp}</p>
          <p>Exp: {this.state.player && this.state.player.experience}</p>
          <p>Attack: {this.state.player && ((20 + this.state.player.weapon) * this.state.player.level)}</p>
          <p>Enemies: {this.state.enemies}</p>
        </aside>
        <GameField
          gameField={this.state.gameField}
          playerLocation={this.state.playerLocation}
        />
      </div>
    )
  }
}

export default Main;
