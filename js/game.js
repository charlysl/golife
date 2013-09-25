// game logic for Conway's Game of Life

// initializes game board with specified conditions:
// r: rows on board (number)
// c: columns on board (number)
// s: array of coords of starting live cells (nested array)
var Game = function(r, c, s) {
	var DEFAULT_ROWS = 10;
	var DEFAULT_COLS = 10;

	// import utility functions
	var utils = Util();

	// validate and set start conditions
	// defaults to 10 x 10 empty grid
	var rows = (r && typeof r === 'number' && r > 0) ? r : DEFAULT_ROWS;
	var cols = (c && typeof c === 'number' && c > 0) ? c : DEFAULT_COLS;
	var live_cells = [];

	// populate starting live cells
	if (s && s instanceof Array) {
		utils.each(s, function(cell) {
			if (cell instanceof Array && cell.length === 2 && typeof cell[0] === 'number' && typeof cell[1] === 'number') { // validate cell format
				if (cell[0] >= 0 && cell[0] < cols && cell[1] >= 0 && cell[1] < rows) live_cells.push(cell); // validate that cell falls within grid
			}
		});

		// randomize board
		if (s[0] === 'random') {
			utils.from_to(0, Math.floor((rows + cols)/2)*4, function() {
				var cell = [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)];
				if (!utils.contains(live_cells, cell)) live_cells.push(cell);
			});
		}
	}

	var self = {
		// returns current board as a two-dimensional array
		// 1's represent live cells, 0's represent dead cells
		// e.g. the 2x2 identity matrix returns [[1, 0], [0, 1]]
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
			utils.each(live_cells, function(c) {
				grid[c[0]][c[1]] = 1;
			});

			return grid;
		},

		// returns number of rows as a number
		rows: function() {
			return rows;
		},

		// returns number of cols as a number
		cols: function() {
			return cols;
		},

		// returns cell state at (x, y)
		// 1 if live, 0 if dead, -1 if invalid
		cell: function(x, y) {
			if (x >= 0 && x < self.cols() && y >= 0 && y < self.rows()) {
				return self.board()[x][y];
			}
			else {
				return -1; // if coords fall outside grid
			}
		},

		// returns coords of currently live cells
		live_cells: function() {
			return live_cells;
		},

		// returns coords of (x, y)'s neighbors, bounded by board dimensions
		neighbors: function(x, y) {
			var neighborhood = [];
			if (x >= 0 && x < self.cols() && y >= 0 && y < self.rows()) {
				utils.from_to_2d(Math.max(0, x - 1), Math.min(x + 1, cols - 1), Math.max(0, y - 1), Math.min(y + 1, rows - 1), function(c) {
					if (c[0] !== x || c[1] !== y) neighborhood.push(c); // exclude self
				});
			}
			return neighborhood;
		},

		// returns count of live neighbors
		live_neighbors: function(x, y) {
			var count = 0;
			utils.each(self.neighbors(x, y), function(n) {
				if (self.cell(n[0], n[1]) === 1) count += 1;
			});
			return count;
		},

		// increments the board by one tick
		// returns board as an array
		step: function() {
			var for_removal = [];
			var for_addition = [];

			utils.each(live_cells, function(c) {
				var live_neighbor_count = self.live_neighbors(c[0], c[1]);

				// dead cells with exactly 3 live neighbors revive
				utils.each(self.neighbors(c[0], c[1]), function(n) {
					if (self.cell(n[0], n[1]) === 0) { // dead neighbor
						if (self.live_neighbors(n[0], n[1]) === 3) {
							if (!utils.contains(for_addition, [n[0], n[1]])) for_addition.push([n[0], n[1]]); // do not duplicate
						}
					}
				});

				// only live cells with 2 or 3 live neighbors survive
				if (live_neighbor_count !== 2 && live_neighbor_count !== 3) for_removal.push([c[0], c[1]]);
			});

			// apply rules simultaneously
			utils.each(for_addition, function(cell) {
				live_cells.push(cell);
			});
			utils.each(for_removal, function(cell) {
				utils.remove(live_cells, cell);
			});

			return self.board();
		}
	};

	Object.freeze(self);

	return self;
};