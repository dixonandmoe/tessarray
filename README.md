# Tessarray

Responsive application of Flickr's Justified Layout with optional sorting and filtering.

## Install
### Download
+ JavaScript:
  - [flickity.pkgd.min.js](https://unpkg.com/flickity@2.0/dist/flickity.pkgd.min.js) minified, or
  - [flickity.pkgd.js](https://unpkg.com/flickity@2.0/dist/flickity.pkgd.js) un-minified

### CDN
Link directly to Flickity files on [unpkg](https://unpkg.com).

``` html
<script src="https://unpkg.com/flickity@2.0/dist/flickity.pkgd.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/flickity@2.0/dist/flickity.pkgd.js"></script>
```

### Package managers
Bower: `bower install flickity --save`
npm: `npm install flickity --save`

## Getting Started

Tessarray works with container and a set of boxes. If the boxes contain images, Tessarray
can calculate the dimensions of the box, otherwise dimensions need to be passed in.

```html
<div id="container">
  <div class="box">
    <img style="height: 100%; width: 100%;" src="#" />
  </div>
  <div class="box" data-aspect-ratio="1.333">
    <sgv>...</svg>
  </div>
  <div class="box" data-height="900" data-width="1600" style="background-color: red;">
  </div>
</div>
```

### Options

``` js
var tessarray = new Tessarray('.box', '#container', {
  // Options, defaults listed

  selectorClass: false,
  // Add selectorClass if you want to be able to sort and filter the boxes.
  // Each of the selectors should have the class of selectorClass, and a 
  // data-category value equal to the value they filter on.
  // If a box is supposed to show in a certain filter, give the box the class
  // of the data-category value on the corresponding selector.
  // If a box is supposed to render in a certain position, assign that position
  // with a data attribute of the filter class, and give it a numerical value.

  imageClass: false,
  // Specifies what element is the image is within the box.
  // By default, Tessarray searches for an <img> tag in each box.
  // If you have multiple <img> tags in a box or you are not using <img> tags,
  // give the image the class of your assigned imageClass instead.

  defaultCategory: false,
  // Filters by given category on initial render

  resize: true,
  // Allows the resizing of the window to trigger a re-rendering of the boxes 
  // if containerClass is given and the container is not statically sized
  
  containerTransition: {
    duration: 375,
    timingFunction: 'ease-in',
    delay: 0
  },
  // Options for the container's opacity transition. Used to fade in container
  // once its dimensions have loaded

  boxTransition: {
    duration: 375,
    timingFunction: 'ease-in',
    delay: 0,
  },
  // Options for box transitions. This transition data is used when boxes are
  // faded in (upon load), resized, moved, and scaled in and out.
  
  boxTransformOutTransition: {
    duration: 250,
    timingFunction: "ease-in",
    delay: 0
  },
  // Options for the transition out for boxes. This transition data is used when boxes
  // are scaled out. 
  
  containerLoadedClass: 'container-is-loaded',
  // Determines what class is added to the container once its dimensions have loaded
  
  boxLoadedClass: 'is-loaded',
  // Determines what class is added to a box once its contents have loaded

  containerLoadedCallback: false,
  // Callback that is called when container has loaded
  
  boxLoadedCallback: false,
  // Callback that is called every time a box is loaded
  
  flickr: {}
  // Pass in your Justified Layout options that differ from the defaults
});
```
A complete list of Flickr's Justified Layout options and defaults can be found [here.](http://flickr.github.io/justified-layout)

## License
Open Source Licensed under the MIT license.

---
By [Dixon and Moe](https://dixonandmoe.com)