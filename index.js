class Queue {
  //implement queue with array
  constructor() {
    this.items = [];
  }
  //add element to queue
  enqueue(elem) {
    this.items.push(elem);
  }
  //remove first element in queue
  dequeue() {
    //return 'underflow' when called on empty queue
    if (this.items.isEmpty) return "Underflow";
    //remove and return first element with 'shift'
    return this.items.shift();
  }
  //get element at front of queue
  front() {
    //respond if queue is empty
    if (this.isEmpty) return "Queue is empty";
    //return first element
    return this.items[0];
  }
  //helper function to check if queue is empty
  isEmpty() {
    //return true on empty queue
    return this.items.length === 0;
  }
  //create string of queue contents
  printQueue() {
    let str = "";
    for (let i = 0; i < this.items.length; i++) {
      str += this.items[i] + " ";
    }
    return str;
  }
  //check if element is in queue
  includes(elem) {
    return this.items.includes(elem);
  }
  //custom function to check for duplicate coordinates
  includesCoords(elem) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i][0] === elem[0] && this.items[i][1] === elem[1]) {
        //duplicate found
        return true;
      }
    }
    //no duplicate found
    return false;
  }
}

//get canvas element and context
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

//set canvas height and width variables
const cHeight = 512;
const cWidth = 512;

//size of boxes in pixels
//speed of operation intervals
//TODO: set as input option
const pixelSize = 32;
const pixelInterval = 60;
const blendInterval = 75;

let imgData = ctx.createImageData(cHeight, cWidth);
let pixels = imgData.data;

let imgBtn = document.getElementById("newImg");
let replaceBtn = document.getElementById("replaceBtn");
let loopCheck = document.getElementById("loopCheck");
let testBtn = document.getElementById("testBtn");
let testBtn2 = document.getElementById("testBtn2");
//let clrBtn = document.getElementById('getClr');

let loopFlag = false;
let defaultModeFlag = true;
let testModeFlag = false;
let testMode2Flag = false;

let coordQueue = new Queue();

loopCheck.addEventListener("change", (e) => {
  if (e.target.checked) {
    loopFlag = true;
  } else {
    loopFlag = false;
  }
});

//function to obtain the rgba index for a given pixel
const getColorIndicesAtCoords = (x, y, width) => {
  let red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
};

const getColorAtCoords = (x, y) => {
  pixels = ctx.getImageData(0, 0, cWidth, cHeight).data;
  let indices = getColorIndicesAtCoords(x, y, cWidth);
  return Array.from(indices, (i) => pixels[i]);
};

//clrBtn.onclick = () => { console.log(getColorAtCoords(0,0))};

const blendColors = (oldColor, newColor) => {
  let blend = [];
  const newAlpha = 1 - (1 - newColor[3]) * (1 - oldColor[3]);
  //red [0]
  blend.push(
    Math.round(
      (newColor[0] * newColor[3]) / newAlpha +
        (oldColor[0] * oldColor[3] * (1 - newColor[3])) / newAlpha
    )
  );
  //green [1]
  blend.push(
    Math.round(
      (newColor[1] * newColor[3]) / newAlpha +
        (oldColor[1] * oldColor[3] * (1 - newColor[3])) / newAlpha
    )
  );
  //blue [2]
  blend.push(
    Math.round(
      (newColor[2] * newColor[3]) / newAlpha +
        (oldColor[2] * oldColor[3] * (1 - newColor[3])) / newAlpha
    )
  );
  //alpha - not used outside of blending
  //blend.push(newAlpha);
  return blend;
};

//difference mode blending
const blendDiff = (oldColor, newColor) => {
  let blend = [];
  const newAlpha = 1 - (1 - newColor[3]) * (1 - oldColor[3]);
  //red [0]
  blend.push(
    Math.round(
      Math.abs(
        (newColor[0] * newColor[3]) / newAlpha +
          (oldColor[0] * oldColor[3] * (1 - newColor[3])) / newAlpha
      )
    )
  );
  //green [1]
  blend.push(
    Math.round(
      Math.abs(
        (newColor[1] * newColor[3]) / newAlpha +
          (oldColor[1] * oldColor[3] * (1 - newColor[3])) / newAlpha
      )
    )
  );
  //blue [2]
  blend.push(
    Math.round(
      Math.abs(
        (newColor[2] * newColor[3]) / newAlpha +
          (oldColor[2] * oldColor[3] * (1 - newColor[3])) / newAlpha
      )
    )
  );
  //alpha - not used outside of blending
  //blend.push(newAlpha);
  return blend;
};

const rgbVal = () => {
  return Math.floor(Math.random() * 256);
};
const rgbArray = () => {
  return [rgbVal(), rgbVal(), rgbVal()];
};
const array2rgb = (arr) => {
  return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
};

//initialize canvas image data
const newImage = () => {
  for (let y = 0; y < cHeight; y += pixelSize) {
    for (let x = 0; x < cWidth; x += pixelSize) {
      ctx.fillStyle = array2rgb(rgbArray());
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }
  pixels = ctx.getImageData(0, 0, cWidth, cHeight).data;
};

imgBtn.onclick = () => {
  newImage();
  defaultModeFlag = true;
  testModeFlag = false;
  testMode2Flag = false;
};

const rgBlah = (c) => {
  let newC = [0, 0, 0];
  let avg = (c[0] + c[1] + c[2]) / 3;
  newC[0] = rgbVal() * Math.cos(avg);
  newC[1] = Math.cos(c[1]) * 5;
  newC[2] = Math.sin(avg) * 127;
  return newC;
};

const rgbHist = (c, mod = 1.0) => {
  let newC = [0, 0, 0];
  let avg = ((c[0] + c[1] + c[2]) / 3) * mod;
  newC[0] = Math.floor(rgbVal() * mod) - 1;
  newC[1] = Math.floor(rgbVal() * mod) - 1;
  newC[2] = Math.floor(rgbVal() * mod) - 1;
  return newC;
};

const testMode = () => {
  let lastColor = rgbArray();
  let blah = [];
  let mod = 1.0;
  for (let y = 0; y < cHeight; y += pixelSize) {
    for (let x = 0; x < cWidth; x += pixelSize) {
      blah = rgBlah(lastColor);

      ctx.fillStyle = array2rgb(blah);
      ctx.fillRect(x, y, pixelSize, pixelSize);
      lastColor = blah;
    }
  }
  pixels = ctx.getImageData(0, 0, cWidth, cHeight).data;
};
//set click event for test mode 1
testBtn.onclick = () => {
  testMode();
  defaultModeFlag = false;
  testModeFlag = true;
  testMode2Flag = false;
};

const testMode2 = () => {
  let lastColor = rgbArray();
  let blah = [];
  let mod = 1.0;
  for (let y = 0; y < cHeight; y += pixelSize) {
    for (let x = 0; x < cWidth; x += pixelSize) {
      //mod is average rgb val mapped to 0<->1
      mod = (lastColor[0] + lastColor[1] + lastColor[2]) / 3 / 255;
      if (mod > 2.8) mod = 0.1;
      else mod += 0.3;
      blah = rgbHist(lastColor, mod);

      ctx.fillStyle = array2rgb(blah);
      ctx.fillRect(x, y, pixelSize, pixelSize);
      lastColor = blah;
    }
  }
  pixels = ctx.getImageData(0, 0, cWidth, cHeight).data;
};
//set click event for mode 2
testBtn2.onclick = () => {
  testMode2();
  defaultModeFlag = false;
  testModeFlag = false;
  testMode2Flag = true;
};

const randomCoords = () => {
  let xDirty = Math.floor(Math.random() * cWidth);
  let x = xDirty - (xDirty % pixelSize);
  let yDirty = Math.floor(Math.random() * cHeight);
  let y = yDirty - (yDirty % pixelSize);
  return [x, y];
};

const replacePixels = () => {
  //console.log('entering replacePixels');

  let mainInterval = setInterval(() => {
    let coords = randomCoords();
    //console.log('Rndm Coords: ', coords);
    let maxAttempts = 25;
    while (coordQueue.includesCoords(coords) && maxAttempts > 0) {
      //console.log('Coord conflict: ', coords);
      coords = randomCoords();
      maxAttempts--;
    }
    if (maxAttempts > 0) {
      coordQueue.enqueue(coords);

      let alpha1 = 1,
        alpha2 = 0;
      let oldColor = getColorAtCoords(coords[0], coords[1]);
      //console.log(`Got color ${oldColor} at coords ${coords}`);//test code
      let newColor = [rgbVal(), rgbVal(), rgbVal(), alpha2];
      if (testModeFlag) {
        newColor = rgBlah(newColor);
      } else if (testMode2Flag) {
        let thisMod = (oldColor[0] + oldColor[1] + oldColor[2]) / 3 / 255;
        newColor = rgbHist(newColor, thisMod);
      }
      //console.log(`New color ${newColor}`);//test code
      const blendSteps = 40;
      const alphaStep = 1 / blendSteps;
      let doBlend = () => {
        alpha1 -= alphaStep;
        alpha2 += alphaStep;
        oldColor[3] = alpha1;
        newColor[3] = alpha2;
        let blend = blendColors(oldColor, newColor);
        //console.log('blendVal: ', blend);
        ctx.fillStyle =
          "rgb(" + blend[0] + "," + blend[1] + "," + blend[2] + ")";
        ctx.fillRect(coords[0], coords[1], pixelSize, pixelSize);
      };

      let intervalSetup = (num) => {
        //console.log('entering intervalSetup');
        let counter = num;
        let interval = setInterval(() => {
          //console.log(`blend loop #${blendSteps - counter}`);
          doBlend();
          counter--;
          if (counter <= 0) {
            coordQueue.dequeue();
            clearInterval(interval);
          }
        }, blendInterval);
      };
      intervalSetup(blendSteps);
    }

    if (!loopFlag) {
      clearInterval(mainInterval);
    }
  }, pixelInterval);
};
replaceBtn.onclick = replacePixels;

window.onload = newImage();
