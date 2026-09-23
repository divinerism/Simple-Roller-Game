/* =====================================================================
   game.js  --  THE RULES AND THE LOOP.

   The game is always in exactly ONE mode: "playing", "dead", or "won".
   Which mode it is in decides what happens each frame.

   The loop runs about 60 times a second, forever. Every time it runs it
   does the same two things: UPDATE (change the numbers) and DRAW (show
   the numbers).
   ===================================================================== */

var Game = {
  mode: "playing",   // "playing", "dead", or "won"
  levelNumber: 0
};

Game.startLevel = function (levelNumber) {
  Game.levelNumber = levelNumber;
  Level.build(levelNumber);
  Breakable.reset();
  Player.reset();
  Game.mode = "playing";
  Game.showMessage("");
};

Game.showMessage = function (text) {
  document.getElementById("message").textContent = text;
};

// --- ONE FRAME --------------------------------------------------------
Game.update = function () {

  // R always restarts, no matter what mode we are in.
  if (Input.restart) {
    Game.startLevel(Game.levelNumber);
    return;
  }

  // If we are not playing, nothing moves. We just wait for R.
  if (Game.mode !== "playing") { return; }

  Player.update();
  Breakable.update();

  if (Player.isDead()) {
    Game.mode = "dead";
    Game.showMessage("You hit something. Press R to try again.");
    return;
  }

  if (Player.hasWon()) {
    if (Game.levelNumber < Level.levels.length - 1) {
      Game.startLevel(Game.levelNumber + 1);
    } else {
      Game.mode = "won";
      Game.showMessage("You made it. Press R to play again.");
    }
    return;
  }
};

// --- THE LOOP ITSELF --------------------------------------------------
Game.loop = function () {
  Game.update();
  Draw.updateCamera();
  Draw.everything();
  window.requestAnimationFrame(Game.loop);
};
