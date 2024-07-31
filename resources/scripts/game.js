const highscoreBox = document.getElementById("highscore");

function getPlayerLocation(callback) {
  if (!navigator.geolocation) {
    console.log(
      "Geolocation Services not present. Setting difficulty to Ulta-hard."
    );
  } else {
    navigator.geolocation.getCurrentPosition(callback, callback);
  }
}

async function setCoords(position) {
  let lat, lon;

  // If a position is received from the Geolocation API, traffic conditions will be retrieved from the player's location
  if (position instanceof GeolocationPosition) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log(`Player Location: 
      \nLatitude: ${lat} 
      \nLongitude: ${lon}`);
  }

  // ERROR HANDLING !!!
  // For any error the Geolocation API encounters...
  // No valid coords found, Player denies location services, etc:
  // Player location will be set to Los Angeles Metro Area I5
  // (the busiest stretch of highway in the United States)
  else {
    // LOS ANGELES METRO AREA COORDS
    lat = 34.05772;
    lon = -118.21438;
    console.log(
      `Unable to get Player Location. Setting position to Los Angeles Metro Area I5: Latitude: ${lat}, Longitude: ${lon}`
    );
  }

  const trafficData = await getTrafficConditions(lat, lon);
  setGameDifficulty(trafficData);
}

async function getTrafficConditions(lat, lon) {
  // TomTom API takes this parameter to determine the accuracy of the coordinates and what road to use
  let zoom = 5;
  try {
    trafficData = await fetch(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative/${zoom}/json?key=rAVgm1Ywe2nTKIxgCeASgBYwWS9SjKBJ&point=${lat},${lon}&unit=mph&thickness=1&openLr=false&jsonp=jsonp`
    ).then((response) => response.json());
  } catch (error) {
    console.error("Error fetching traffic conditions:", error);
  }

  return trafficData;
}

function setGameDifficulty(trafficData) {
  // Estimated traffic speed is return in MPH
  // Difficulty will be calculate based on the traffic speed at the user's location
  currentSpeed = trafficData.flowSegmentData.currentSpeed;
  let trafficDifficulty = "";

  if (currentSpeed >= 70) {
    trafficDifficulty = "Easy";
  } else if (currentSpeed < 70 && currentSpeed > 50) {
    trafficDifficulty = "Medium";
  } else if (currentSpeed < 50 && currentSpeed > 30) {
    trafficDifficulty = "Hard";
  } else if (currentSpeed < 30) {
    trafficDifficulty = "Ultra Hard";
  }

  gameSettings.difficulty = trafficDifficulty;

  console.log(`Traffic Flow: ${currentSpeed}`);
  console.log(
    `Difficulty set to ${gameSettings.difficulty} based on traffic conditions.`
  );
}

function setHighScore() {
  if (!localStorage.getItem("highscore")) {
    localStorage.setItem("highscore", 0);
  } else {
    let highscore = localStorage.getItem("highscore");
    highscoreBox.textContent = `High Score: ${highscore.toString()}`;
  }
}

function startGame() {
  getPlayerLocation(setCoords);
  setHighScore();

  console.log("Starting game...");
  const game = new Phaser.Game(config);
}

const gameSettings = {
  minSpeed: 10,
  maxSpeed: 25,
  difficulty: "",
  pointsIteration: 2,
  username: "RONALD",
  soundEnabled: false,
  musicEnabled: false,
  musicConfig: {
    mute: false,
    volume: 0.5,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0,
  },
};

const config = {
  type: Phaser.AUTO,
  width: 840,
  height: 900,
  scene: mainScene,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

// MAIN

startGame();
