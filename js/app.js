// Enemies our player must avoid
var Enemy = function(speed,x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
    this.x = x;
    this.y = y;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
      this.x = this.x + (this.speed * dt);

      if(this.x * 101 > 6 * 101){
        var newEnemy = makeEnemie();
        this.speed = newEnemy.speed;
        this.x =  newEnemy.x;
        this.y = newEnemy.y;
      }



};

Enemy.prototype.enemyCollisions = function(){
  if( Math.ceil(this.x - 0.5) === player.x && this.y === player.y)
  player.die();
};



// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(index) {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 72);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var player = function(x,y) {

  this.sprite = 'images/knight.png';
  this.x = x;
  this.y = y;
  this.ready = false;
  this.numPlayed = 0;
  this.numCross = 0;
  this.score = 0 ;
  this.allScores = [];

};

player.prototype.update = function(gem) {

  if(gem.gemCollisions()){
    this.score += parseInt(gem.points);
  }

  if(this.y === 0){
    this.y === 5;
  }

};

var hitSound = new Audio('sound/hit.wav');

player.prototype.die = function() {
  hitSound.play();
  this.ready = false;
  this.numCross = 0;
  this.allScores.push(this.score);
  this.x = 2;
  this.y = 5;
};

var abilitySound = new Audio('sound/ability.wav');
player.prototype.ability = function() {

  if (this.numCross >= 5) {
    allEnemies = [];

    abilitySound.play();
    allFire = makeFire(this.x,this.y);
    setTimeout(function(){ for (var i = 0; i < 4; i++) {
      allEnemies.push(makeEnemie());
    }},1000);

    setTimeout(function() {
      allFire = [];
    },600)
    this.numCross = 0;

  }

}

var Fire = function (x,y,d) {

  this.sprite = 'images/fire.png';
  this.x = x;
  this.y = y;
  this.d = d;

}

var makeFire = function (x,y) {
    fire = []

  for (var i = 0; i < y; i++) {
    fire.push(new Fire(x,i,'left'));
    fire.push(new Fire(x,i,'right'));
  }

  for (var i = y; i  > -1; i--) {
    fire.push(new Fire(x,i,'left'));
    fire.push(new Fire(x,i,'right'));
  }

  return fire;
}

var allFire = [];

Fire.prototype.update = function(dt ,d) {

  if (d === 'right' && this.x != null && this.y != null) {
    this.x = this.x + (10 * dt);

    if(this.x * 101 > 6 * 101){
      this.x =  null;
      this.y = null;
    }
  }

  if (d === 'left' && this.x != null && this.y != null) {
    this.x = this.x - (10 * dt);

    if(this.x * 101 < -3){
      this.x =  null;
      this.y = null;
    }
  }

}

Fire.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 75);
}

player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 75);
};

var crossSound = new Audio('sound/cross.wav');
player.prototype.handleInput = function(key){

  if(!this.ready && key === 'space'){
    this.ready = true;
    this.score = 0;
    this.numPlayed++;
  }

  if (this.ready && key === 'space') {
    player.ability()
  }
  if(key === 'left' && this.x != 0 && this.ready)
  this.x--;

  if(key === 'right' && this.x != 4 && this.ready)
  this.x++;

  if(key === 'up' && this.ready){
    this.y--;
    if(this.y === 0){
        this.y = 5;
        this.score += 10;
        this.numCross++;
        crossSound.play();
    }
  }
  if(key === 'down' && this.y != 5 && this.ready)
  this.y++;
};

var Gem = function(x,y,sprite,points) {

    this.sprite = sprite;
    this.points = points;
    this.x = x;
    this.y = y;

};

Gem.prototype.gemCollisions = function(){
  if( Math.floor(this.x) === player.x && this.y === player.y)
  return true;
};

var makeGems = function() {

  var sprites = ['images/Gem-Green.png' , 'images/Gem-Blue.png' ,'images/Gem-Orange.png'];
  var points = ['5' , '10' , '20'];
  var x = [0,1,2,3,4];
  var y = [1,2,3];
  var gemIndex = getRandomInt(0,2);

  var gem = new Gem(x[getRandomInt(0,4)],y[getRandomInt(0,2)],sprites[gemIndex],points[gemIndex]);
  return gem;
};

var gemSound = new Audio('sound/gem.wav');

Gem.prototype.update = function(dt) {

  if(this.gemCollisions()){
    gemSound.play();
    var newGem = makeGems();
    this.sprite = newGem.sprite;
    this.points = newGem.points;
    this.x = newGem.x;
    this.y = newGem.y;
  }
};

Gem.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 100, 101/2 , 171/2);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var makeEnemie = function(){
  var speeds = [1,2,3,4];
  var x = -1;
  var y = [1,2,3];
  var enemy = new Enemy(speeds[getRandomInt(0,3)],x,y[getRandomInt(0,2)]);
  return enemy ;
};

var allEnemies = [];
for (var i = 0; i < 4; i++) {
  allEnemies.push(makeEnemie());
}

var player = new player(2,5);
var gem = makeGems();

var meunRender = function() {
  ctx.drawImage(Resources.get('images/menu.png'), 0, 0);
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32:'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
} );
