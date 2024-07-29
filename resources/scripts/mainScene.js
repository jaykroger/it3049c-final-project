class mainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
  }

  preload() {
    this.load.image("highway", "/resources/assets/images/highway.png");

    // Load in Cars Atlas
    this.load.atlas(
      "cars",
      "resources/assets/spritesheets/cars.png",
      "resources/assets/spritesheets/cars.json"
    );

    this.load.audio("music", "resources/assets/audio/mutecity.mp3");
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
    this.player.setScale(2);
    this.player.setCollideWorldBounds(true);
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

    this.music = this.sound.add("music");
    const musicConfig = {
      mute: false,
      volume: 0.5,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    this.music.play(musicConfig);
  }

  update() {
    this.background.tilePositionY -= gameSettings.gameSpeed;
    this.movePlayerManager();
  }

  movePlayerManager() {
    // Handle all player movement
    // Reset player velocity and angle when no button is being pressed
    this.player.setVelocity(0);
    this.player.setAcceleration(0);
    this.player.setAngle(0);

    // Move player left and right and add rotation to simulate steering
    if (this.cursorKeys.left.isDown) {
      this.player.setAccelerationX(-15000);
      this.player.setAngle(-10);
    }
    if (this.cursorKeys.right.isDown) {
      this.player.setAccelerationX(15000);
      this.player.setAngle(10);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setAccelerationY(-15000);
    }
    if (this.cursorKeys.down.isDown) {
      this.player.setAccelerationY(18000);
    }
  }

  spawnCar() {
    // Spawn a car at a random lane on the road
  }
}
