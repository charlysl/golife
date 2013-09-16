// testing suite

// game object constructor
// base case - should return 1, 1, [0, 0]
var game_constructor_test = Game(1, 1, [[0, 0]]);
console.log(game_constructor_test.rows());
console.log(game_constructor_test.cols());
console.log(game_constructor_test.live_cells());

// multiple cells - should return 3, 3, [[0, 0], [1, 1], [2, 2]]
var game_constructor_test = Game(3, 3, [[0, 0], [1, 1], [2, 2]]);
console.log(game_constructor_test.rows());
console.log(game_constructor_test.cols());
console.log(game_constructor_test.live_cells());

// invalid row value - should return 10, 1, [0, 0]
game_constructor_test = Game(-1, 1, [[0, 0]]);
console.log(game_constructor_test.rows());
console.log(game_constructor_test.cols());
console.log(game_constructor_test.live_cells());

// invalid column value - should return 1, 10, [0, 0]
game_constructor_test = Game(1, -1, [[0, 0]]);
console.log(game_constructor_test.rows());
console.log(game_constructor_test.cols());
console.log(game_constructor_test.live_cells());

// no cells defined - should return 10, 10, and random set of cells within grid
game_constructor_test = Game(10, 10);
console.log(game_constructor_test.rows());
console.log(game_constructor_test.cols());
console.log(game_constructor_test.live_cells());

// large grid - should (hopefully) not hit max stack size
game_constructor_test = Game(1000, 1000);
console.log(game_constructor_test.rows());
console.log(game_constructor_test.cols());
console.log(game_constructor_test.live_cells());

// Game.board method
// base case - should return the 3x3 identity matrix
var game_board_test = Game(3, 3, [[0, 0], [1, 1], [2, 2]]);
console.log(game_board_test.board());

// Game.cell method
// base case - should return 1 for live cell, 0 for dead cell
var game_cell_test = Game(3, 3, [[0, 0], [1, 1], [2, 2]]);
console.log(game_cell_test.cell(0, 0));
console.log(game_cell_test.cell(0, 1));

// request invalid coordinates - should return -1
game_cell_test = Game(3, 3, [[0, 0], [1, 1], [2, 2]]);
console.log(game_cell_test.cell(4, 4));
console.log(game_cell_test.cell(-1, 2));

// Game.neighbors method
var game_neighbors_test = Game(3, 3, [[0, 1], [2, 2], [1, 0], [1, 1]]);

// base case - should return 8 neighbors
console.log(game_neighbors_test.neighbors(1, 1));

// corner case - should return 3 neighbors
console.log(game_neighbors_test.neighbors(0, 0));

// side case - should return 5 neighbors
console.log(game_neighbors_test.neighbors(1, 0));

// request invalid coordinates - should return empty array
console.log(game_neighbors_test.neighbors(2, 4));

// Game.live_neighbors method
// base case - should return 3
console.log(game_neighbors_test.live_neighbors(1, 1));

// Game.step method
// tested with "blinker" oscillator: http://en.wikipedia.org/wiki/File:Game_of_life_blinker.gif
var game_step_test = Game(5, 5, [[2, 1], [2, 2], [2, 3]]);
console.log(game_step_test.step());
console.log(game_step_test.step());
console.log(game_step_test.step());

// app.js tested by eye, using the two recognized seeds and the random function you now see as presets