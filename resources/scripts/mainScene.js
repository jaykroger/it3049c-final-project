class mainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
  }

  preload() {
    // Load highway background
    this.load.image("highway", "/resources/assets/images/highway.png");

    // Load in cars sprite atlas
    this.load.atlas(
      "cars",
      "resources/assets/spritesheets/cars.png",
      "resources/assets/spritesheets/cars.json"
    );

    // Load audio and sound effects
    this.load.audio("accelerate", "resources/assets/audio/accelerate.mp3");
    this.load.audio("decelerate", "resources/assets/audio/decelerate.mp3");
    this.load.audio("music", "resources/assets/audio/mutecity.mp3");

    // Load font
    this.load.bitmapFont(
      "pixelFont",
      "resources/assets/font/font.png",
      "resources/assets/font/font.xml"
    );
  }

  create() {
    this.background = this.add.tileSprite(
      0,
      0,
      config.width,
      config.height,
      "highway"
    );
    this.background.setOrigin(0, 0);

    this.player = this.physics.add.sprite(487, 850, "cars", "lambo");
    this.player.setScale(2.5);
    this.player.setCollideWorldBounds(true);
    this.currentSpeed = gameSettings.minSpeed;

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.carList = [
      "dumptruck",
      "tow_truck",
      "tow_truck2",
      "tow_truck3",
      "truck2",
      "truck3",
      "landcruiser",
      "landcruiser2",
      "landcruiser3",
      "van",
      "raptor",
      "raptor2",
      "pickup",
      "pickup2",
      "pickup3",
      "suv",
      "suv2",
      "van2",
      "van3",
      "mustang2",
      "camaro",
      "camaro2",
      "challenger2",
      "challenger3",
      "lexus",
      "lexus2",
      "gwagon",
      "bmw",
      "gwagon2",
      "patrol",
      "patrol2",
      "lexus3",
      "taxi",
      "taxi2",
      "lambo2",
      "lancer",
      "bmw2",
      "bmw3",
      "lancer2",
      "mustang3",
      "mini",
      "tida2",
      "tida3",
      "convertible",
      "figo",
      "figo2",
      "porsche",
      "bike2",
      "bike",
    ];

    this.gameOver = false;

    // add scoreboard
    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(config.width, 0);
    graphics.lineTo(config.width, 60);
    graphics.lineTo(0, 60);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    let scoreFormated = this.zeroPad(this.score, 6);
    this.scoreLabel = this.add.bitmapText(
      20,
      20,
      "pixelFont",
      "SCORE " + scoreFormated,
      32
    );
    this.usernameLabel = this.add.bitmapText(
      780,
      20,
      "pixelFont",
      gameSettings.username.toLocaleUpperCase(),
      32
    );

    this.accelerationSound = this.sound.add("accelerate");
    this.decelerationSound = this.sound.add("decelerate");
    this.music = this.sound.add("music");
    this.music.play(gameSettings.musicConfig);
  }

  update() {
    this.background.tilePositionY -= this.currentSpeed;
    this.movePlayerManager();
    this.updateScore();
    this.toggleSound();
    this.toggleMusic();
  }

  movePlayerManager() {
    // Handle all player movement
    // Reset player velocity and angle when no button is being pressed
    this.player.setVelocity(0);
    this.player.setAcceleration(0);
    this.player.setAngle(0);

    // Move player left and right and add rotation to simulate steering
    if (this.cursorKeys.left.isDown && this.player.x > 170) {
      this.player.setAccelerationX(-15000);
      this.player.setAngle(-10);
    }
    if (this.cursorKeys.right.isDown && this.player.x < 675) {
      this.player.setAccelerationX(15000);
      this.player.setAngle(10);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setAccelerationY(-15000);

      // Acceleration mechanics:
      // Create illusion of going faster as long as max speed as not been reached
      if (this.currentSpeed < gameSettings.maxSpeed) {
        this.currentSpeed += 0.2;
      }
      // Acceleration sound will play while up arrow is pressed
      if (!this.accelerationSound.isPlaying) {
        this.accelerationSound.play({ loop: true });
      }
    } else {
      if (this.accelerationSound.isPlaying) {
        this.accelerationSound.stop();
      }
    }

    if (this.cursorKeys.down.isDown) {
      this.player.setAccelerationY(18000);

      // Create illusion of slowing down as long as min speed has not been reached
      if (this.currentSpeed > gameSettings.minSpeed) {
        this.currentSpeed -= 0.25;
      }
      // Rev matching sound effect will play while down arrow is pressed
      if (!this.decelerationSound.isPlaying) {
        this.decelerationSound.play({ loop: true });
      }
    } else {
      if (this.decelerationSound.isPlaying) {
        this.decelerationSound.stop();
      }
    }
  }

  spawnCar() {
    // Spawn a car at a random lane on the road
  }

  zeroPad(number, size) {
    var stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }

  updateScore() {
    if (!this.gameOver) {
      this.score += gameSettings.pointsIteration;
      let scoreFormated = this.zeroPad(this.score, 6);
      this.scoreLabel.text = "SCORE " + scoreFormated;
    }
  }

  toggleSound() {
    if (!gameSettings.soundEnabled) {
      this.accelerationSound.setMute(true);
      this.decelerationSound.setMute(true);
    } else {
      this.accelerationSound.setMute(false);
      this.decelerationSound.setMute(false);
    }
  }

  toggleMusic() {
    if (!gameSettings.musicEnabled) {
      this.music.setMute(true);
    } else {
      this.music.setMute(false);
    }
  }
}
