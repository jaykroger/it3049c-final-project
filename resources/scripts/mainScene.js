class mainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
  }

  preload() {
    // Load highway background
    this.load.image("highway", "resources/assets/images/highway.png");

    // Load in cars sprite atlas
    this.load.atlas(
      "cars",
      "resources/assets/spritesheets/cars.png",
      "resources/assets/spritesheets/cars.json"
    );

    // Load audio and sound effects
    this.load.audio("accelerate", "resources/assets/audio/accelerate.mp3");
    this.load.audio("decelerate", "resources/assets/audio/decelerate.mp3");
    this.load.audio("carCrash", "resources/assets/audio/crash.mp3");
    this.load.audio("music", "resources/assets/audio/mutecity.mp3");

    // Load font
    this.load.bitmapFont(
      "pixelFont",
      "resources/assets/font/font.png",
      "resources/assets/font/font.xml"
    );
  }

  create(data) {
    const username = data.user;
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
    this.player.setPushable(true);
    this.currentSpeed = gameSettings.minSpeed;

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.car1 = this.physics.add.sprite(229, -300, "cars", "pickup");
    this.car2 = this.physics.add.sprite(487, -30, "cars", "convertible");
    this.car3 = this.physics.add.sprite(611, -300, "cars", "bike");
    this.car4 = this.physics.add.sprite(611, -40, "cars", "bmw2");

    this.car1.setScale(2.5);
    this.car2.setScale(2.5);
    this.car3.setScale(2.5);
    this.car4.setScale(2.5);

    this.car1.setInteractive();
    this.car2.setInteractive();
    this.car3.setInteractive();
    this.car4.setInteractive();

    this.car1.setPushable(false);
    this.car2.setPushable(false);
    this.car3.setPushable(false);
    this.car4.setPushable(false);

    this.traffic = this.physics.add.group();
    this.traffic.add(this.car1);
    this.traffic.add(this.car2);
    this.traffic.add(this.car3);
    this.traffic.add(this.car4);

    this.physics.add.collider(
      this.player,
      this.traffic,
      this.hurtPlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.traffic,
      this.hurtPlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.car1,
      this.traffic,
      this.seperateTraffic(this.car1),
      null,
      this
    );
    this.physics.add.overlap(
      this.car3,
      this.traffic,
      this.seperateTraffic(this.car3),
      null,
      this
    );

    this.createHUD();

    this.gameOver = false;
    this.crashed = false;

    this.accelerationSound = this.sound.add("accelerate");
    this.decelerationSound = this.sound.add("decelerate");
    this.crashSound = this.sound.add("carCrash");

    // Source: F-Zero
    // Arrangement: Yasufumi Fukuda
    // Composition: Nintendo
    // Composition and arrangement Copyright Nintendo
    // All rights belong to their respective owners!

    this.music = this.sound.add("music");
    this.music.play(gameSettings.musicConfig);
  }

  update() {
    this.background.tilePositionY -= this.currentSpeed;
    this.movePlayerManager();
    this.updateScore();
    this.toggleSound();
    this.toggleMusic();

    // Calculate delay between spawning cars based on the calculated traffic difficulty
    let timeDelay = 0;

    if (gameSettings.difficulty === "Easy") {
      timeDelay = 4000;
    } else if (gameSettings.difficulty === "Medium") {
      timeDelay = 3000;
    } else if (gameSettings.difficulty === "Hard") {
      timeDelay = 2000;
    } else if (gameSettings.difficulty === "Ultra Hard") {
      timeDelay = 1000;
    }

    this.time.delayedCall(timeDelay, () => {
      this.moveCar(this.car1);
      this.moveCar(this.car2);
      this.moveCar(this.car3);
      this.moveCar(this.car4);
    });
  }

  seperateTraffic(car) {
    var randomTime = Phaser.Math.Between(1000, 2000);
    this.time.delayedCall(randomTime, () => { }, [], this);
    car.y = 0;
  }

  hurtPlayer(player, car) {
    // Set game over flag
    this.gameOver = true;

    this.player.setVelocity(0);
    this.player.setAcceleration(0);
    this.player.setCollideWorldBounds(false);

    // Stop sounds
    this.accelerationSound.stop();
    this.decelerationSound.stop();

    // play crash sound
    if (!this.crashed) {
      this.crashSound.play();
      this.crashed = true;
    }

    // Create game over title
    this.createGameOverTitle();
    this.checkHighscore();

    // Move the player's car off the screen to the bottom when crash occurs
    this.player.setVelocityX(0);
    this.player.setVelocityY(this.currentSpeed * 30);
  }

  movePlayerManager() {
    // Handle all player movement
    // Reset player velocity and angle when no button is being pressed
    if (!this.gameOver) {
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
  }

  moveCar(car) {
    if (car.x == 229 || car.x == 353) {
      car.y += 5 * 1.5 + Phaser.Math.Between(0, 3);
    } else {
      car.y += 5 + Phaser.Math.Between(0, 3);
    }

    if (car.y > config.height + 80) {
      this.resetCarPos(car, 5);
    }
  }

  resetCarPos(car, speed) {
    car.y = 0;
    let randomX = Phaser.Math.Between(0, 3);
    let randomCar = Phaser.Math.Between(0, 48);

    switch (randomCar) {
      case 0:
        car.setFrame("dumptruck");
        car.setScale(1.8);
        break;
      case 1:
        car.setFrame("tow_truck");
        car.setScale(2.5);
        break;
      case 2:
        car.setFrame("tow_truck2");
        car.setScale(2.5);
        break;
      case 3:
        car.setFrame("tow_truck3");
        car.setScale(2.5);
        break;
      case 4:
        car.setFrame("truck2");
        car.setScale(2.5);
        break;
      case 5:
        car.setFrame("truck3");
        car.setScale(2.5);
        break;
      case 6:
        car.setFrame("landcruiser");
        car.setScale(2.5);
        break;
      case 7:
        car.setFrame("landcruiser2");
        car.setScale(2.5);
        break;
      case 8:
        car.setFrame("landcruiser3");
        car.setScale(2.5);
        break;
      case 9:
        car.setFrame("van");
        car.setScale(2.5);
        break;
      case 10:
        car.setFrame("raptor");
        car.setScale(2.5);
        break;
      case 11:
        car.setFrame("raptor2");
        car.setScale(2.5);
        break;
      case 12:
        car.setFrame("pickup");
        car.setScale(2.5);
        break;
      case 13:
        car.setFrame("pickup2");
        car.setScale(2.5);
        break;
      case 14:
        car.setFrame("pickup3");
        car.setScale(2.5);
        break;
      case 15:
        car.setFrame("suv");
        car.setScale(2.5);
        break;
      case 16:
        car.setFrame("suv2");
        car.setScale(2.5);
        break;
      case 17:
        car.setFrame("van2");
        car.setScale(2.5);
        break;
      case 18:
        car.setFrame("van3");
        car.setScale(2.5);
        break;
      case 19:
        car.setFrame("mustang2");
        car.setScale(2.5);
        break;
      case 20:
        car.setFrame("camaro");
        car.setScale(2.5);
        break;
      case 21:
        car.setFrame("camaro2");
        car.setScale(2.5);
        break;
      case 22:
        car.setFrame("challenger2");
        car.setScale(2.5);
        break;
      case 23:
        car.setFrame("challenger3");
        car.setScale(2.5);
        break;
      case 24:
        car.setFrame("lexus");
        car.setScale(2.5);
        break;
      case 25:
        car.setFrame("lexus2");
        car.setScale(2.5);
        break;
      case 26:
        car.setFrame("gwagon");
        car.setScale(2.5);
        break;
      case 27:
        car.setFrame("bmw");
        car.setScale(2.5);
        break;
      case 28:
        car.setFrame("gwagon2");
        car.setScale(2.5);
        break;
      case 29:
        car.setFrame("patrol");
        car.setScale(2.5);
        break;
      case 30:
        car.setFrame("patrol2");
        car.setScale(2.5);
        break;
      case 31:
        car.setFrame("lexus3");
        car.setScale(2.5);
        break;
      case 32:
        car.setFrame("taxi");
        car.setScale(2.5);
        break;
      case 33:
        car.setFrame("taxi2");
        car.setScale(2.5);
        break;
      case 34:
        car.setFrame("lambo2");
        car.setScale(2.5);
        break;
      case 35:
        car.setFrame("lancer");
        car.setScale(2.5);
        break;
      case 36:
        car.setFrame("bmw2");
        car.setScale(2.5);
        break;
      case 37:
        car.setFrame("bmw3");
        car.setScale(2.5);
        break;
      case 38:
        car.setFrame("lancer2");
        car.setScale(2.5);
        break;
      case 39:
        car.setFrame("mustang3");
        car.setScale(2.5);
        break;
      case 40:
        car.setFrame("mini");
        car.setScale(2.5);
        break;
      case 41:
        car.setFrame("tida2");
        car.setScale(2.5);
        break;
      case 42:
        car.setFrame("tida3");
        car.setScale(2.5);
        break;
      case 43:
        car.setFrame("convertible");
        car.setScale(2.5);
        break;
      case 44:
        car.setFrame("figo");
        car.setScale(2.5);
        break;
      case 45:
        car.setFrame("figo2");
        car.setScale(2.5);
        break;
      case 46:
        car.setFrame("porsche");
        car.setScale(2.5);
        break;
      case 47:
        car.setFrame("bike2");
        car.setScale(2.5);
        break;
      case 48:
        car.setFrame("bike");
        car.setScale(2.5);
        break;
    }

    switch (randomX) {
      case 0:
        car.x = 229;
        car.y += speed;
        car.setAngle(180);
        break;
      case 1:
        car.x = 353;
        car.y += speed;
        car.setAngle(180);
        break;
      case 2:
        car.x = 478;
        car.y += speed;
        car.setAngle(0);
        break;
      case 3:
        car.x = 611;
        car.y += speed;
        car.setAngle(0);
        break;
    }
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
      let scoreFormatted = this.zeroPad(this.score, 6);
      this.scoreLabel.text = "SCORE " + scoreFormatted;
    }
  }

  toggleSound() {
    if (!gameSettings.soundEnabled) {
      this.accelerationSound.setMute(true);
      this.decelerationSound.setMute(true);
    } else {
      this.accelerationSound.setMute(false);
      this.decelerationSound.setMute(false);
      this.crashSound.setMute(false);
    }
  }

  toggleMusic() {
    if (!gameSettings.musicEnabled) {
      this.music.setMute(true);
    } else {
      this.music.setMute(false);
    }
  }

  createHUD() {
    // add scoreboard and HUD at top of screen
    // Code for Scoreboard from Ansimuz on YouTube:
    // Getting started with Phaser 3 Tutorial
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
      740,
      20,
      "pixelFont",
      this.username,
      32
    );
  }

  createGameOverTitle() {
    this.time.delayedCall(3000, () => {
      // create game over title
      let gameOverTitle = this.add.graphics();
      gameOverTitle.fillStyle(0x000000, 1);
      gameOverTitle.beginPath();
      gameOverTitle.moveTo(config.width / 2 - 120, config.height / 2 - 30);
      gameOverTitle.lineTo(config.width / 2 + 120, config.height / 2 - 30);
      gameOverTitle.lineTo(config.width / 2 + 120, config.height / 2 + 30);
      gameOverTitle.lineTo(config.width / 2 - 120, config.height / 2 + 30);
      gameOverTitle.lineTo(config.width / 2 - 120, config.height / 2 - 30);
      gameOverTitle.closePath();
      gameOverTitle.fillPath();

      this.gameOverText = this.add.bitmapText(
        config.width / 2 - 75,
        config.height / 2 - 12,
        "pixelFont",
        "GAME OVER",
        40
      );
    });
  }

  checkHighscore() {
    let highscore = localStorage.getItem("highscore");
    if (this.score > highscore) {
      localStorage.setItem("highscore", this.score);
    }
  }
}
