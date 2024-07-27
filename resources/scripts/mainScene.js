class mainScene extends Phaser.Scene {
  constructor() {
    super('mainScene');
  }

  preload() {
    console.log("Loading assets...")
    this.load.image("highway", "resources/assets/images/highway.png")
  }
  
  create() {
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "highway");
    this.background.setOrigin(0, 0);
  }
  
  update() {
    this.background.tilePositionY -= gameSettings.gameSpeed;
  }

}