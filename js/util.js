// utility functions for general use
var Util = function() {
	var self = {
		// iteration abstraction (by Daniel Jackson)
		// from: start index
		// to: end index (included)
		// f: function to execute
		from_to: function(from, to, f) {
			if (from > to) return;
			f(from);
			self.from_to(from + 1, to, f);
		},

		// two-dimensional iteration abstraction
		// from1: start index, first dimension
		// to1: end index, first dimension
		// from2: start index, second dimension
		// to2: end index, second dimension
		// f: function to execute
		from_to_2d: function(from1, to1, from2, to2, f) {
			var from2_init = from2;
			var subprocess = function(from1, to1, from2, to2, f) {
				if (from1 > to1) return;
				f([from1, from2]);
				if (from2 === to2) {
					subprocess(from1 + 1, to1, from2_init, to2, f);
				}
				else {
					subprocess(from1, to1, from2 + 1, to2, f);
				}
			};
			subprocess(from1, to1, from2, to2, f);
		},

		// element iterator (by Daniel Jackson)
		// a: array to iterate through
		// f: function to execute
		each: function(a, f) {
			self.from_to(0, a.length - 1, function(i) {
				f(a[i]);
			});
		},

		// checks if two arrays are equal
		// handles nested arrays via recursive calls
		// a1: first array
		// a2: second array
		equals: function(a1, a2) {
			var result = true;
			if (a1 instanceof Array && a2 instanceof Array && a1.length === a2.length) {
				self.from_to(0, a1.length - 1, function(i) {
					// nested arrays
					if (a1[i] instanceof Array && a2[i] instanceof Array && a1[i].length === a2[i].length) {
						if (result) result = self.equals(a1[i], a2[i]);
					}
					// other types
					else if (a1[i] !== a2[i]) {
						result = false;
					}
				});
			}
			else {
				result = false;
			}
			return result;
		},

		// checks if array contains an element
		// a: the array to be checked
		// target: the target element
		contains: function(a, target) {
			var result = false;
			if (target instanceof Array) {
				self.from_to(0, a.length - 1, function(i) {
					if (self.equals(a[i], target)) {
						result = true;
					}
				});
			} else {
				self.from_to(0, a.length - 1, function(i) {
					if (a[i] === target) {
						result = true;
					}
				});
			}
			return result;
		},

		// removes all occurrences of a target element in an array
		// a: the array to be purged
		// target: the target element
		remove: function(a, target) {
			if (target instanceof Array) {
				self.from_to(0, a.length - 1, function(i) {
					if (self.equals(a[i], target)) {
						a.splice(i, 1);
					}
				});
			} else {
				self.from_to(0, a.length - 1, function(i) {
					if (a[i] === target) {
						a.splice(i, 1);
					}
				});
			}
		}
	};

	return self;
};