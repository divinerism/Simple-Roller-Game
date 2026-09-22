// =====================================================================
// breakable.js -- platforms that break when you land on them from a fall
// =====================================================================
var Breakable = {
  blocks: []
};

// find every "b" in the level and turn it into a tracked block
Breakable.reset = function () {
  Breakable.blocks = [];
  for (var row = 0; row < CONFIG.ROWS; row++) {
    for (var col = 0; col < Level.cols; col++) {
      if (Level.charAt(col, row) === "b") {
        Breakable.blocks.push({ col: col, row: row, state: "solid", timer: 0 });
        Breakable.setTile(col, row, "#");
      }
    }
  }
};

// Level.grid holds strings, which cannot be changed in place,
// so we rebuild the whole row with one character swapped
Breakable.setTile = function (col, row, character) {
  var line = Level.grid[row];
  Level.grid[row] = line.substring(0, col) + character + line.substring(col + 1);
};

// check every block: a downward landing starts the break countdown
Breakable.update = function () {
  var size = CONFIG.PLAYER_SIZE;
  var feet = Collide.squaresUnder(Player.x,
    Player.y + CONFIG.PLAYER_SIZE - 1,
    size, 2);

  for (var i = 0; i < Breakable.blocks.length; i++) {
    var block = Breakable.blocks[i];

    if (block.state === "solid") {
      // breaks only if the player LANDED here, not if they walked on
      if (Player.landedFromFall && Breakable.touching(feet, block)) {
        block.state = "breaking";
        block.timer = CONFIG.BREAK_FRAMES;
      }
    } else if (block.state === "breaking") {
      block.timer = block.timer - 1;
      if (block.timer <= 0) {
        block.state = "gone";
        Breakable.setTile(block.col, block.row, ".");
      }
    }
    // "gone" blocks stay gone until the level restarts
  }

  // the landing flag only lasts one frame
  Player.landedFromFall = false;
};

Breakable.touching = function (squares, block) {
  for (var i = 0; i < squares.length; i++) {
    if (squares[i].col === block.col && squares[i].row === block.row) {
      return true;
    }
  }
  return false;
};

// breakable blocks look normal but have black cracks down the middle
Breakable.draw = function () {
  var ctx = Draw.ctx;
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  for (var i = 0; i < Breakable.blocks.length; i++) {
    var block = Breakable.blocks[i];
    if (block.state !== "gone") {
      var x = block.col * CONFIG.TILE;
      var y = block.row * CONFIG.TILE;
      ctx.beginPath();
      // a jagged crack down the middle of the block
      ctx.moveTo(x + CONFIG.TILE / 2, y + 4);
      ctx.lineTo(x + CONFIG.TILE / 2 - 4, y + CONFIG.TILE / 2);
      ctx.lineTo(x + CONFIG.TILE / 2 + 3, y + CONFIG.TILE - 4);
      ctx.stroke();
      // while breaking, add a second crack so the player sees time running out
      if (block.state === "breaking") {
        ctx.beginPath();
        ctx.moveTo(x + 6, y + 6);
        ctx.lineTo(x + CONFIG.TILE / 2, y + CONFIG.TILE / 2);
        ctx.lineTo(x + CONFIG.TILE - 6, y + 8);
        ctx.stroke();
      }
    }
  }
};
