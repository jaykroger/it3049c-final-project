const gameSettings = {
    gameSpeed: 8
  }

  const config = {
    type: Phaser.AUTO,
    width: 845,
    height: 1000,
    scene: mainScene,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    }
  };
  
  console.log('Starting game...')
  const game = new Phaser.Game(config);
  