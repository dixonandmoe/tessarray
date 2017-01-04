# Tessarray

Easy application of Flickr's Justified Layout with optional sorting and filtering.

## Easiest Usage

```js
var tessarray = new Tessarray("box");
```
```html
<div class="box">
	<img class="image" src="#" />
</div>
<div class="box">
	<img class="image" src="#" />
</div>
```
```css
.image {
	height: 100%;
	width: 100%
}
```

Resizes images to a flickr justified layout on initial render, just pass in the the class of the image containers.

## Easy Usage
```js
var tessarray = new Tessarray("box", {
	containerClass: "container",
	selectorClass: "selector"
});
```
This is uses the container functionality along with the sorting/filtering functionality.

If you pass in the class of the container of all images, the images will reposition when the container size changes (unless otherwise specified), and you can set default container height.

To use the selector class, add the class to each button or element that you want to be able to sort. On the same element, set the data-category value to the class that you want to sort by. On the individual boxes, add the class of the categories they belong to. 

If the filtered boxes are to be sorted, add a data attribute that is the name of the filtering class with a value of it's position as a string. 

For instace, this is a box that displays fifth when categorized by the class `dogs`:

```html
<div class="box dogs" data-dogs="5">
  <img class="image" src="#"/>
</div>
```

## Options
Tessarray comes with its own set of options as well as 

## License

Open Source Licensed under the MIT license.