class titleScene extends Phaser.Scene {
  constructor() {
    super("titleScene");
    this.username = "";
    this.startBtn = document.getElementById("startButton");
    this.playerNameInput = document.getElementById("playerName");
    this.buttonHints = document.getElementById("button-hints");
  }

  preload() {
    this.load.image("highway", "resources/assets/images/highway.png");

    // Load in cars sprite atlas
    this.load.atlas(
      "cars",
      "resources/assets/spritesheets/cars.png",
      "resources/assets/spritesheets/cars.json"
    );

    //Load Font
    this.load.bitmapFont(
      "pixelFont",
      "resources/assets/font/font.png",
      "resources/assets/font/font.xml"
    );
  }
  create() {
    this.highway = this.add.tileSprite(
      0,
      0,
      config.width,
      config.height,
      "highway"
    );
    this.highway.setOrigin(0, 0);

    this.startBtn.style.display = "inline";
    this.playerNameInput.style.display = "inline";

    if (localStorage.getItem("username")) {
      this.username = localStorage.getItem("username");
      gameSettings.username = this.username;
      this.playerNameInput.value = this.username;
    }

    this.startBtn.addEventListener("click", () => {
      this.username = this.playerNameInput.value.trim();
      gameSettings.username = this.username;
      if (gameSettings.username) {
        localStorage.setItem("username", gameSettings.username);
        this.startGame();
      } else {
        alert("Please enter a name.");
      }
    });

    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(config.width, 0);
    graphics.lineTo(config.width, 90);
    graphics.lineTo(0, 90);
    graphics.lineTo(0, 0);
    graphics.closePath();
    graphics.fillPath();

    this.txt = this.add
      .bitmapText(config.width / 2, 30, "pixelFont", "ENTER YOUR USERNAME", 50)
      .setOrigin(0.5, 0);

    this.car2 = this.physics.add.sprite(487, 20, "cars", "convertible");
    this.car3 = this.physics.add.sprite(611, 600, "cars", "bike");
    this.car4 = this.physics.add.sprite(611, 0, "cars", "bmw2");

    this.car2.setScale(2.5);
    this.car3.setScale(2.5);
    this.car4.setScale(2.5);
  }
  update() {
    this.highway.tilePositionY -= 0.5;
    this.moveCar(this.car2);
    this.moveCar(this.car3);
    this.moveCar(this.car4);
  }
  moveCar(car) {
    if (car.x == 229 || car.x == 353) {
      car.y += Phaser.Math.Between(0, 3);
    } else {
      car.y += Phaser.Math.Between(0, 3);
    }

    if (car.y > config.height + 80) {
      this.resetCarPos(car, 5);
    }
  }
  resetCarPos(car, speed) {
    car.y = 0;
    var randomX = Phaser.Math.Between(0, 3);
    var randomCar = Phaser.Math.Between(0, 48);

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
  startGame() {
    this.startBtn.style.display = "none";
    this.playerNameInput.style.display = "none";
    this.buttonHints.style.display = "block";
    this.scene.start(
      "mainScene",
      { user: this.username },
      { transition: { duration: 500, easing: "Linear" } }
    );
  }
}
