class mainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
  }

  preload() {
    console.log("Loading assets...");
    this.load.image("highway", "/resources/assets/images/highway.png");

    // Load in Cars Atlas
    this.load.atlas(
      "cars",
      "resources/assets/spritesheets/cars.png",
      "resources/assets/spritesheets/cars.json"
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
    this.player.setScale(2);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);
  }

  movePlayerManager() {
    this.player.setVelocity(0);

    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-300);
    }
    if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(300);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-300);
    }
    if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(300);
    }
  }

  update() {
    this.background.tilePositionY -= gameSettings.gameSpeed;
    this.movePlayerManager();
  }
}
