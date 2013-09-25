// main method
(function() {
	// import utility functions
	var utils = Util();

	// detect hash
	var hash = document.URL.split('#')[1];

	// keep track of states
	var is_playing = false;
	var edit_state = 0; // 0 for normal gameplay, 1 for board size, 2 for cell painting
	var painted_cells = [];

	// queued animations
	var timeouts = [];

	// preset arrangements
	var presets = {
		glider: {
			rows: 10,
			cols: 10,
			start: [[2, 1], [3, 2], [1, 3], [2, 3], [3, 3]]
		},
		acorn: {
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
			start: ['random'] // will populate cells randomly
		}
	};

	// fill cell
	var fill_cell = function(x, y) {
		$('.col-' + x + '.row-' + y).addClass('live');
	};

	// clear cell
	var clear_cell = function(x, y) {
		$('.col-' + x + '.row-' + y).removeClass('live');
	};

	// draw board given a game object
	var draw_board = function(g) {
		// calculate limiting dimension
		var ROWS = g.rows();
		var COLS = g.cols();
		var MIN_WIDTH = Math.floor($('.board').width() / COLS);
		var MIN_HEIGHT = Math.floor($('.board').height() / ROWS);
		var LIM_DIM = Math.min(MIN_WIDTH, MIN_HEIGHT);

		// draw interior boxes
		utils.from_to_2d(0, ROWS - 1, 0, COLS - 1, function(box) {
			var cell = '<div class="cell row-' + box[0] + ' col-' + box[1] + '" style="width: ' + LIM_DIM + 'px; height: ' + LIM_DIM + 'px"></div>';
			$('.board').append(cell);
		});

		// center playing field
		$('.row-0').css('margin-top', ($('.board').height() - (ROWS * LIM_DIM)) / 2 + 'px');
		$('.col-0').css('margin-left', ($('.board').width() - (COLS * LIM_DIM)) / 2 + 'px');

		// fill starting live cells
		utils.each(g.live_cells(), function(cell) {
			fill_cell(cell[0], cell[1]);
		});
	};

	// fill/clear cells in a board of the correct size
	var fill_board = function(g) {
		$('.cell').removeClass('live');

		utils.each(g.live_cells(), function(cell) {
			fill_cell(cell[0], cell[1]);
		});
	};

	// increment game and redraw board
	var iterate = function() {
		// clear all cells
		utils.each(game.live_cells(), function(cell) {
			clear_cell(cell[0], cell[1]);
		});

		// step, check if stabilized
		if (utils.equals(game.board(), game.step())) {
			is_playing = false;
			$('#control').html('Play &emsp; &#9658;').addClass('disabled');
		}

		// fill new cells
		utils.each(game.live_cells(), function(cell) {
			fill_cell(cell[0], cell[1]);
		});

		// loop if not stable
		if (is_playing) timeouts.push(setTimeout(iterate, 500));
	};

	// initialize game object
	if (hash && hash in presets) {
		game = Game(presets[hash].rows, presets[hash].cols, presets[hash].start);
	}
	else {
		hash = 'random';
		game = Game(25, 25, ['random']); // defaults to random
	}

	// draw board
	draw_board(game);

	// play button
	$('#control').click(function() {
		if (!$(this).hasClass('disabled')) {
			if (is_playing) {
				$(this).html('Play &emsp; &#9658;');
				is_playing = false;
				utils.each(timeouts, function(frame) {
					clearTimeout(frame);
				});
			}
			else {
				$(this).html('Pause &emsp; &#10074; &#10074;');
				is_playing = true;
				iterate();
			}
		}
	});

	// reset button
	$('#reset').click(function() {
		if (!$(this).hasClass('disabled')) {
			// stop animation
			$('#control').html('Play &emsp; &#9658;').removeClass('disabled');
			is_playing = false;
			utils.each(timeouts, function(frame) {
				clearTimeout(frame);
			});

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
		}
	});

	// edit button
	$('#board').click(function() {
		if (edit_state === 0) {
			// state 1: set dimensions
			edit_state += 1;

			// button changes
			$('#control, #reset').addClass('disabled');
			$(this).html('Next');

			// show edit dialogue
			$('.editdialog').fadeIn(650);

			// background animation
			if (!is_playing) {
				is_playing = true;
				iterate();
			}
		}
		else if (edit_state === 1) {
			// state 2: paint board
			edit_state += 1;

			// redraw board
			$('.cell').remove();
			game = Game(parseInt($('#rows').val(), 10), parseInt($('#cols').val(), 10), []);
			draw_board(game);
			$('.board').addClass('paintable');

			// button changes
			$(this).html('Done');

			// hide edit dialog
			$('.editdialog').fadeOut(650);

			// store painted cells
			painted_cells = game.live_cells();

			// paint implementation
			var paint_fill = function(cell) {
				var x = parseInt(cell.classList[2].split('-')[1], 10);
				var y = parseInt(cell.classList[1].split('-')[1], 10);

				if (!utils.contains(painted_cells, [x, y])) {
					$('.col-' + x + '.row-' + y).toggleClass('live');
					painted_cells.push([x, y]);
				}
			};

			var paint_clear = function(cell) {
				var x = parseInt(cell.classList[2].split('-')[1], 10);
				var y = parseInt(cell.classList[1].split('-')[1], 10);

				if (utils.contains(painted_cells, [x, y])) {
					$('.col-' + x + '.row-' + y).toggleClass('live');
					utils.remove(painted_cells, [x, y]);
				}
			};

			var is_dragging = false;
			var is_filling = true;

			$('.cell').mousedown(function(evt) {
				is_dragging = true;
				if (evt.target.classList[3] === 'live') {
					paint_clear(evt.target);
					is_filling = false;
				}
				else {
					paint_fill(evt.target);
					is_filling = true;
				}
			});

			$('.cell').mouseover(function(evt) { // will fill or clear depending on the first cell
				if (is_dragging && is_filling) paint_fill(evt.target);
				if (is_dragging && !is_filling) paint_clear(evt.target);
			});

			$('.cell').mouseup(function() {
				is_dragging = false;
			});
		}
		else {
			// state 0: normal gameplay
			edit_state = 0;
			is_playing = false;

			// redraw board
			game = Game(parseInt($('#rows').val(), 10), parseInt($('#cols').val(), 10), painted_cells);
			fill_board(game);
			$('.board').removeClass('paintable');

			// remove painting event handlers
			$('.cell').unbind();

			// button changes
			$('#control, #reset').removeClass('disabled');
			$(this).html('Board');

			// add starting conditions to presets
			hash = 'custom';
			presets['custom'] = { rows: parseInt($('#rows').val(), 10), cols: parseInt($('#cols').val(), 10), start: painted_cells };
		}
	});
})();