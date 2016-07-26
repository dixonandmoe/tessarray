document.write('<script src="justified-layout.min.js" type="text/javascript"></script>');

// var justify = function(grid, itemClass, selector) {

// }

var JustifiedGrid = function(grid, itemClass, selector) {
	this.grid = grid;
	this.items = [];
	this.selectors = [];

	this.instantiate(grid, itemClass, selector);
}

JustifiedGrid.prototype.instantiate = function(grid, itemClass, selector) {
	var items = document.getElementsByClassName(itemClass);
	for (var i = 0; i < items.length; i++) {
		this.items.push(new GridItem(items[i]));
	}
}

var GridItem = function(item) {
	var classes = item.getAttribute('class').split(" ");
	for (var i = 0; i < classes.length; i++) {
		this[classes[i]] = item.getAttribute("data" + classes[i]) || null;
	}
	console.log(this);
}