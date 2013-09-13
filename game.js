// game logic for Conway's Game of Life

// initializes game board with specified conditions:
// r = number of rows
// c = number of columns
// s = array of coords of starting live cells
var Game = function(r, c, s) {
	var DEFAULT_ROWS = 10,
			DEFAULT_COLS = 10;

	// validate and set start conditions
	var rows = (r && typeof r === 'number') ? r : DEFAULT_ROWS,
			cols = (c && typeof c === 'number') ? c : DEFAULT_COLS,
			live_cells = [];

	if (s && s instanceof Array) {
		for (var i = 0; i < s.length; i++) {
			if (s[i] instanceof Array && s[i].length === 2 && typeof s[0] === 'number' && typeof s[1] === 'number') {
				//TODO: validate that s[i] falls within grid
				live_cells.push(s[i]);
			}
		}
	}

	if (live_cells.length === 0 ) {
		live_cells = [[Math.floor(cols/2), Math.floor(rows/2)]]; // defaults to most central cell
	}

	return {
		// returns current grid
		grid: function() {
			var arr = [],
					std_col = [],
					i = cols,
					j = rows;

			// populate grid with zeros
			while (j--) {
				std_col.push(0);
			}
			while (i--) {
				arr.push(std_col.slice());
			}

			// populate live cells
			for (var n = 0; n < live_cells.length; n++) {
				var x = live_cells[n][0],
						y = live_cells[n][1];
				arr[x][y] = 1;
			}

			return arr;
		},

		// returns state of a particular cell
		cell: function(x, y) {
			return this.grid()[x][y];
		},

		step: function() {
			//TODO: iterate!
		}
	};
};