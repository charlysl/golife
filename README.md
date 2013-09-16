# 6.170 Project 1

Graphics-based implementation of Conway's Game of Life.

## Setup
To play, open `index.htm` in your web browser of choice. By default, the game will use a [glider](http://www.conwaylife.com/wiki/Glider) as its seed; however, you can try some of the other preset seeds by adding a hash symbol (#) after the URL and one of the following key words:

* `acorn` - the acorn, a [methuselah](http://www.conwaylife.com/wiki/Methuselah) requiring only seven cells
* `lwss` - a basic [lightweight spaceship](http://www.conwaylife.com/wiki/LWSS)
* `random` - a random assortment of cells in a 25x25 grid

## Documentation
### `app.js`
The "main method" of the app. Checks the URL for a recognized hash and constructs the game and pad objects accordingly. Draws the board at startup and at each concurrent step. Board size is calculated by determining the limiting dimension (width or height) in order to fit the requested grid to the canvas. Handles player input in the form of button listeners.

#### Functions

* `fill_cell` - graphically fills in the cell at a particular coordinate
* `clear_cell` - graphically clears the cell at a particular coordinate

### `game.js`
Contains the game logic, i.e. the constructor and mutator methods for the game object. Stores the board as an array (size specified in constructor, default 10x10) containing 2x2 arrays representing cell coordinates. Additionally, live cells are stored in another array to keep track of them.

#### Functions

* `board` - returns the board as an array
* `rows` - returns the number of rows (so that `app.js` can access it)
* `cols` - returns the number of columns (so that `app.js` can access it)
* `live_cells` - returns the array of currently live cells
* `neighbors` - given coordinates, returns the array of its neighbors
* `live_neighbors` - given coordinates, returns the count of live neighbors
* `step` - increments board by one tick, applying the game rules (returns board as an array)

### `util.js`
Contains generic utility functions to make life easier, namely iteration abstractions and array-related functions.

#### Functions
* `from_to` - iteration abstraction covered in class by Daniel Jackson
* `from_to_2d` - two-dimensional iteration abstraction
* `each` - element iterator covered in class by Daniel Jackson
* `equals` - checks if two arrays are equal
* `contains` - checks if an array contains a particular element
* `remove` - removes all instances of an element from an array

### `graphics.js`
Library provided by Daniel Jackson and the 6.170 staff. Used as-is, with the exception of minor changes for syntactic consistency.

### `test.js`
Contains testing suite. No formal unit testing framework used, relied on `console.log` in the browser.