var mainState = {
  preload: function() {
    // Load sprites
    game.load.image('bird', 'assets/bird.png');
    game.load.image('pipe', 'assets/pipe.png');

    // Add sounds
    game.load.audio('jump', 'assets/jump.wav');
  },

  create: function() {
    // Setup the game
    game.stage.backgroundColor = '#71c5cf';

    // Set physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display Bird
    this.bird = game.add.sprite(100, 245, 'bird');
    game.physics.arcade.enable(this.bird);
    // Add gravity to Bird
    this.bird.body.gravity.y = 1000;

    // Call jump function when spacebar is hit
    let spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    // Move anchor for bird to the left and downward
    this.bird.anchor.setTo(-0.2, 0.5);

    // Create phaser grp for pipes
    this.pipes = game.add.group();

    // Timer for addRowOfPipes
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    // Score
    this.score = 0;
    this.labelScore = game.add.text(20, 20, '0', {
      font: "30px Arial",
      fill: "#ffffff"
    });

    // Jump sound
    this.jumpSound = game.add.audio('jump');
  },

  update: function() {
    // Game Logic
    // If bird is out of screen call restartGame()
    if (this.bird.y < 0 || this.bird.y > 490)
      this.restartGame();

    // Bird downward angle
    if (this.bird.angle < 20)
      this.bird.angle += 1;

    // If the bird hits a pipe, call restartGame()
    game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
  },

  jump: function() {
    if (this.bird.alive == false)
      return;

    this.bird.body.velocity.y = -350;

    // Create animation on Bird
    let animation = game.add.tween(this.bird);
    // change angle of bird to 20degrees in 100 milliseconds
    animation.to({
      angle: -20
    }, 100);
    animation.start();
    this.jumpSound.play();
  },

  restartGame: function() {
    game.state.start('main');
  },

  addOnePipe: function(x, y) {
    // Create a pipe at the position x and y
    let pipe = game.add.sprite(x, y, 'pipe');
    this.pipes.add(pipe);

    // Add physics and velocity
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = -200;

    // Kill the pipe when it's no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function() {
    // Random number for hole position
    let hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes and hole
    for (let i = 0; i < 8; i++)
      if (i != hole && i != hole + 1)
        this.addOnePipe(400, i * 60 + 10);

    // Update Score
    this.score += 1;
    this.labelScore.text = this.score;
  },

  hitPipe: function() {
    // If the bird has already hit a pipe, do nothing
    if (this.bird.alive == false)
      return;

    this.bird.alive = false;
    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Stop all pipes movement
    this.pipes.forEach(function(p) {
      p.body.velocity.x = 0;
    }, this);
  },
};

// Initialize Phaser, and create a 400px by 490px game
let game = new Phaser.Game(400, 490);

game.state.add('main', mainState);
game.state.start('main');
