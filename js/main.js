/* =====================================================================
   main.js  --  THE STARTING LINE.

   This is the smallest file in the project and it runs last. All it
   does is: set up the screen, load the data files, build the first
   level, and start the loop.

   You will almost never need to change this file.
   ===================================================================== */

Draw.setup();
Game.setupMenu();

Level.loadData(function () {
  Game.startLevel(CONFIG.START_LEVEL);
  Game.loop();
});
