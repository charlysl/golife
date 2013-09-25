# 6.170 Project 1

DOM-based implementation of Conway's Game of Life.

## Setup
To play, open `index.htm` in your web browser of choice. By default, the game will generate a random seed in a 25x25 grid; however, you can try some of the other preset seeds by adding a hash symbol (#) after the URL and one of the following key words:

* `acorn` - the acorn, a [methuselah](http://www.conwaylife.com/wiki/Methuselah) requiring only seven cells
* `glider` - a [glider](http://www.conwaylife.com/wiki/Glider), the smallest and most-common spaceship
* `lwss` - a basic [lightweight spaceship](http://www.conwaylife.com/wiki/LWSS)

## Documentation
### `app.js`
The "main method" of the app. Checks the URL for a recognized hash and constructs the game object accordingly. Draws the board at startup and at each concurrent step. Board size is calculated by determining the limiting dimension (width or height) in order to fit the requested grid to the container. Handles player input in the form of buttons bound with jQuery event handlers. There are two basic modes of usage:

* **View mode** - Lets users view the progression of a seed. Runs in a loop using recursive `setTimeout` calls such that the user can play and pause the game.

* **Edit mode** - Lets users define the starting conditions, including board dimensions and the seed. Dimensions are specified by text input while cells are inputted via a "painting" interface that makes use of the `mousedown`, `mouseover`, and `mouseup` jQuery event handlers.

#### Functions

#####`fill_cell(x, y)`
Graphically fills in the cell at a particular coordinate (`x`, `y`).
#####`clear_cell(x,y)`
Graphically clears the cell at a particular coordinate (`x`, `y`).
#####`draw_board(g)`
Draws the board for a valid Game object `g`.
#####`fill_board(g)`
Fills in starting cells for a Game `g` — if and only if board does not have to be resized.
#####`iterate()`
Steps forward one tick in game time. Calls itself recursively via `setTimeout`, thus creating an animation. Stops when stable (identical consecutive boards) or when paused.

***

### `game.js`
Contains the game logic, i.e. the constructor and mutator methods for the game object. Stores the board as an array (size specified in constructor, default 10x10) containing 2x2 arrays representing cell coordinates. Additionally, live cells are stored in another array by themselves for easy access.

#### Functions

####`board()`
Returns the board as an two-dimensional array, with 1's representing live cells and 0's representing dead cells. For example, the 2x2 identity matrix would return [[1, 0], [0, 1]].

#####`rows()`
Returns the number of rows in the board.

#####`cols()`
Returns the number of columns in the board.

#####`cell(x, y)`
Returns the state of the cell (`x`, `y`) — 1 if live, 0 if dead, -1 if invalid.

#####`live_cells()`
Returns the array of currently live cells.

#####`neighbors(x, y)`
Returns an array of coordinates for neighbors of (`x`, `y`), bounded by the board dimensions.

#####`live_neighbors(x, y)`
Returns the number of live neighbors of (`x`, `y`).

#####`step()`
Increments the board by one tick, applying the game rules. Returns the board as an array.

***

### `util.js`
Contains generic utility functions to make life easier, namely iteration abstractions and array-related functions.

#### Functions
#####`from_to(from, to, f)`
Functional iteration abstraction (by Daniel Jackson). Executes function `f` from index `from` to index `to` (included).

#####`from_to_2d(from1, to1, from2, to2, f)`
Two-dimensional functional iteration abstraction. Executes function `f` from index `from1` to index `to1` (first dimension) and from index `from2` to index `to2`. In this case, the functional is used to traverse the x and y dimensions of the game board.

#####`each(a, f)`
Element iterator (by Daniel Jackson). Executes function `f` on each element in array `a`.

#####`equals(a1, a2)`
Checks if arrays `a1` and `a2` are equal. Handles nested arrays via recursive calls.

#####`contains(a, target)`
Returns true if array `a` contains target element `target`.

#####`remove(a, target)`
Removes all occurrences of `target` in array `a`.

***


### `test.js`
Contains testing suite. No formal unit testing framework used, relied on `console.log` in the browser.

## Design
### Board ADT
The board state was stored as a two-dimensional array (comprising `c` columns of length `r`), with 1's for live cells and 0's for dead cells. This was easy to understand and manipulate from the get-go; in particular, it played well with `console.log` and debugging. In retrospect, it would have probably been good to create an abstract Cell data type, in order to avoid dealing with nested arrays (as the number of array functions in `util.js` attests to).

###Two-dimensional iteration
The choice of a two-dimensional array meant that early on many methods were implemented using nested for loops. In order to make these functions less cumbersome, I adapted the provided `from_to` iteration abstraction for two dimensions. It took me some extensive debugging before I realized that I needed a separate `from2_init`, because `from2` was being incremented, thus compromising the results once the recursion started incrementing `from1`.

### Checking dead neighbors
The rest of the game implementation was pretty straightforward, except for the rule involving dead cells coming back to life. Unlike with live cells, there wasn't a helpful array keeping track of which cells to check. With a 10x10 grid, this wasn't a big deal, but this design would not scale well. In order to increase efficiency the `step` function only looks at dead cells that neighbor live cells, drastically narrowing the pool of candidates for revival.

### Calculating cell size
In order to calculate the optimal size of a cell in the grid, I modified the provided drawing code and calculated a "limiting dimension" based on the largest height/width the boxes could be to still fit in the container. This was also offset horizontally and vertically to avoid awkward-looking layouts. 

### Converting to DOM
Switching from a graphical approach to a DOM-based approach was rather simple, thanks to the magic of jQuery selectors. This helped clean up the JavaScript significantly, as much of the styling was moved to CSS. In order to make selecting specific cells easier, the cell divs were assigned additional `row-<number>` and `col-<number>` classes (a choice inspired by grid frameworks).

### Animating the game
In Phase 1.1, the game was implemented using a play button that sequentially stepped to the next tick. Based on TA feedback, this was changed to an animated interface instead. Using recursive `setTimeout` calls, the `iterate` function could be looped without the danger of freezing up the browser with infinite function calls. The `is_playing` variable was also introduced, allowing for play/pause functionality with the help of `clearTimeout`.

### Painting interface
At first, the board editing interface simply toggled the `live` class with a `click` mouse event. As an additional feature, I implemented a "painting" interface, much like collaborative scheduling tool WhenIsGood. To do this, I used a combination of `mousedown`, `mouseover`, and `mouseup` event listeners. I later split this into two different functions, one specifically for filling and one for clearing depending on the first cell clicked.