// utility functions for general use
var Util = function() {
	return {
		// iteration abstraction (by Daniel Jackson)
		from_to: function(from, to, f) {
			if (from > to) return;
			f(from);
			this.from_to(from + 1, to, f);
		},

		// two-dimensional iteration abstraction
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
		each: function(a, f) {
			this.from_to(0, a.length - 1, function(i) {
				f(a[i]);
			});
		}
	};
};