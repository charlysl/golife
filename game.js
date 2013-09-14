// game logic for Conway's Game of Life

// initializes game board with specified conditions:
// r = number of rows
// c = number of columns
// s = array of coords of starting live cells
var Game = function(r, c, s) {
	var DEFAULT_ROWS = 10;
	var DEFAULT_COLS = 10;

	// import utility functions
	var utils = Util();

	// validate and set start conditions
	var rows = (r && typeof r === 'number') ? r : DEFAULT_ROWS;
	var cols = (c && typeof c === 'number') ? c : DEFAULT_COLS;
	var live_cells = [];

	//TODO: rewrite this whole thing
	if (s && s instanceof Array) {
		for (var i = 0; i < s.length; i++) {
			if (s[i] instanceof Array && s[i].length === 2 && typeof s[0] === 'number' && typeof s[1] === 'number') {
				//TODO: validate that s[i] falls within grid
				live_cells.push(s[i]);
			}
		}
	}

	if (live_cells.length === 0) {
		live_cells = [[0,0], [Math.floor(cols/2), Math.floor(rows/2)]]; // defaults to most central cell
	}

	return {
		// returns current board
		board: function() {
			var grid = [];
			var zero_col = [];

			// create grid of dead cells
			utils.from_to(0, rows - 1, function() {
				zero_col.push(0);
			});
			utils.from_to(0, cols - 1, function() {
				grid.push(zero_col.slice());
			});

			// populate live cells
			utils.each(live_cells, function(cell) {
				grid[cell[0]][cell[1]] = 1;
			});

			return grid;
		},

		// return cell state at (x, y)
		cell: function(x, y) {
			return this.board()[x][y];
		},

		// return coords of (x, y)'s neighbors
		neighbors: function(x, y) {
			var neighborhood = [];
			utils.from_to_2d(Math.max(0, x - 1), Math.min(x + 1, cols), Math.max(0, y - 1), Math.min(y + 1, rows), function(cell) {
				if (cell[0] !== x || cell[1] !== y) neighborhood.push(cell); // exclude self
			});
			return neighborhood;
		},

		// state transition
		step: function() {
			//TODO: iterate!
		}
	};
};