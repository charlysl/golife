// main method
(function() {
	// import utility functions
	var utils = Util();

	// detect hash
	var hash = document.URL.split('#')[1];

	// generate a random seed
	var random_seed = function(r, c) {
		var arr = [];
		utils.from_to(0, 49, function() {
			var cell = [Math.floor(Math.random() * c), Math.floor(Math.random() * r)];
			if (!utils.contains(arr, cell)) arr.push(cell);
		});
		return arr;
	};

	// preset arrangements
	var presets = {
		glider: {
			rows: 10,
			cols: 10,
			start: [[2, 1], [3, 2], [1, 3], [2, 3], [3, 3]]
		},
		methuselah: {
			rows: 20,
			cols: 20,
			start: [[8, 9], [7, 11], [8, 11], [10, 10], [11, 11], [12, 11], [13, 11]]
		},
		lwss: {
			rows: 20,
			cols: 20,
			start: [[15, 8], [15, 9], [15, 10], [16, 7], [16, 10], [17, 10], [18, 10], [19, 7], [19, 9]]
		},
		random: {
			rows: 25,
			cols: 25,
			start: random_seed(25, 25)
		}
	};

	// initialize game object
	if (hash && hash in presets) {
		game = Game(presets[hash].rows, presets[hash].cols, presets[hash].start);
	}
	else {
		hash = 'glider';
		game = Game(10, 10, [[2, 1], [3, 2], [1, 3], [2, 3], [3, 3]]); // defaults to glider
	}

	// create the drawing pad object and associate with the canvas
	pad = Pad(document.getElementById('canvas'));
	pad.clear();

	// define canvas styles
	var black = Color(0, 0, 0);
	var gray = Color(128, 128, 128);
	var white = Color(256, 256, 256);
	var LINE_WIDTH = 2;

	// calculate limiting dimension
	var ROWS = game.rows();
	var COLS = game.cols();
	var MIN_WIDTH = Math.floor(pad.get_width() / COLS);
	var MIN_HEIGHT = Math.floor(pad.get_height() / ROWS);
	var LIM_DIM = Math.min(MIN_WIDTH, MIN_HEIGHT);

	// draw exterior box
	pad.draw_rectangle(Coord(0, 0), LIM_DIM * COLS, LIM_DIM * ROWS, LINE_WIDTH, gray);

	// draw interior boxes
	utils.from_to_2d(0, COLS - 1, 0, ROWS - 1, function(box) {
		pad.draw_rectangle(Coord(box[0] * LIM_DIM, box[1] * LIM_DIM), LIM_DIM, LIM_DIM, LINE_WIDTH, gray);
	});

	// fill cell
	var fill_cell = function(x, y) {
		pad.draw_rectangle(Coord(x * LIM_DIM, y * LIM_DIM), LIM_DIM, LIM_DIM, LINE_WIDTH, gray, black);
	};

	// clear cell
	var clear_cell = function(x, y) {
		pad.draw_rectangle(Coord(x * LIM_DIM, y * LIM_DIM), LIM_DIM, LIM_DIM, LINE_WIDTH, gray, white);
	};

	// fill starting live cells
	utils.each(game.live_cells(), function(cell) {
		fill_cell(cell[0], cell[1]);
	});

	// iterate
	document.getElementById("next").onclick = function() {
		// clear all cells
		utils.each(game.live_cells(), function(cell) {
			clear_cell(cell[0], cell[1]);
		});

		// step and fill new cells
		game.step();
		utils.each(game.live_cells(), function(cell) {
			fill_cell(cell[0], cell[1]);
		});
	};

	// reset
	document.getElementById("reset").onclick = function() {
		// clear all cells
		utils.each(game.live_cells(), function(cell) {
			clear_cell(cell[0], cell[1]);
		});

		// re-initialize game object
		game = Game(presets[hash].rows, presets[hash].cols, presets[hash].start);

		// repopulate starting cells
		utils.each(game.live_cells(), function(cell) {
			fill_cell(cell[0], cell[1]);
		});
	};
})();