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



    this.car1 = this.add.sprite(487, 100, "cars", "pickup");
    this.car2 = this.add.sprite(487, 100, "cars", "pickup");
    this.car3 = this.add.sprite(487, 100, "cars", "pickup");
    this.car4 = this.add.sprite(487, 100, "cars", "pickup");

    this.car1.setScale(2.5);
    this.car2.setScale(2.5);
    this.car3.setScale(2.5);
    this.car4.setScale(2.5);

    this.car1.setInteractive();
    this.car2.setInteractive();
    this.car3.setInteractive();
    this.car4.setInteractive();

    this.traffic = this.physics.add.group();
    this.traffic.add(this.car1);
    this.traffic.add(this.car2);
    this.traffic.add(this.car3);
    this.traffic.add(this.car4);

    this.physics.add.overlap(this.player, this.traffic, this.hurtPlayer, null, this);

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
    this.moveCar(this.car1)
    this.moveCar(this.car2)
    this.moveCar(this.car3)
    this.moveCar(this.car4)
  }

  hurtPlayer() {
    console.log("Player has hit a car!")
    this.gameOver = true
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

  moveCar(car) {

    if (car.x == 229 || car.x == 353) {
      car.y += 5 * 1.5 + (Phaser.Math.Between(0, 3))
    }
    else {
      car.y += 5 + (Phaser.Math.Between(0, 3))
    }

    if (car.y > config.height) {
      this.resetCarPos(car, 5);
    }
  }

  resetCarPos(car, speed) {
    car.y = 0;
    var randomX = Phaser.Math.Between(0, 3);
    var randomCar = Phaser.Math.Between(0, 48);

    switch (randomCar) {
      case 0:
        car.setFrame("dumptruck")
        car.setScale(1.8);
        break;
      case 1:
        car.setFrame("tow_truck")
        car.setScale(2.5);
        break;
      case 2:
        car.setFrame("tow_truck2")
        car.setScale(2.5);
        break;
      case 3:
        car.setFrame("tow_truck3")
        car.setScale(2.5);
        break;
      case 4:
        car.setFrame("truck2")
        car.setScale(2.5);
        break;
      case 5:
        car.setFrame("truck3")
        car.setScale(2.5);
        break;
      case 6:
        car.setFrame("landcruiser")
        car.setScale(2.5);
        break;
      case 7:
        car.setFrame("landcruiser2")
        car.setScale(2.5);
        break;
      case 8:
        car.setFrame("landcruiser3")
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
        car.x = 229
        car.y += speed
        car.setAngle(180)
        break;
      case 1:
        car.x = 353
        car.y += speed
        car.setAngle(180)
        break;
      case 2:
        car.x = 478
        car.y += speed
        car.setAngle(0)
        break;
      case 3:
        car.x = 611
        car.y += speed
        car.setAngle(0)
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
