/*
  Basic File I/O for displaying
  Skeleton Author: Joshua A. Levine
  Modified by: Amir Mohammad Esmaieeli Sikaroudi
  Email: amesmaieeli@email.arizona.edu

  Further Modified by: Jordan Demler
  CSC 433
  HW1
  Added code that makes the image spin and scale using matrix manipulation, from the 
  MathUtilities.js file provided
*/

//access DOM elements we'll use
var input = document.getElementById('load_image')
var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

// The width and height of the image
var width = 0
var height = 0
// The image data
var ppm_img_data

// Add variables for animating the spinning
let currentAngle = 0
let animationId = null
const ROTATION = 60 // this is the speed, in degrees per second
const TARGET = 30

// Variables for tracking animation timing
let lastTime = null
const SCALING = true // this is the bonus for undergrad

// let diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
// width = diagonal;
// height = diagonal;

// Function to add aniamtion
function animate (time) {
  if (!lastTime) {
    lastTime = time
  }

  const deltaTime = (time - lastTime) / 1000 // in seconds
  lastTime = time

  currentAngle = (currentAngle + ROTATION * deltaTime) % 360

  // center coordinates for the canvas
  const centerX = canvas.width / 2 // for making pic spin at center
  const centerY = canvas.height / 2 // for making pic spin at center

  // image center (for rotation)
  const imageCenterX = width / 2
  const imageCenterY = height / 2

  // translate to canvas center
  const center = GetTranslationMatrix(centerX, centerY)

  // transalte to the origin
  const origin = GetTranslationMatrix(-width / 2, -height / 2)

  // rotate
  const rotate = GetRotationMatrix(currentAngle)

  // scale (for the bonus :))
  const scaling = GetScalingMatrix(1, 1)
  if (SCALING) {
    // math to get scale factor to keep corners in bounds
    const scaleFactor =
      Math.abs(Math.cos((currentAngle * Math.PI) / 180)) +
      Math.abs(Math.sin((currentAngle * Math.PI) / 180))
    scaling[0][0] = 1 / scaleFactor
    scaling[1][1] = 1 / scaleFactor
  }

  // combine matrices with multiplication -> center * scaling * rotation * origin
  let matrix = MultiplyMatrixMatrix(center, scaling) // center * scaling
  matrix = MultiplyMatrixMatrix(matrix, rotate) // matrix (aka (center * scaling)) * rotation
  matrix = MultiplyMatrixMatrix(matrix, origin) // (center * scaling * rotation) * origin

  // create new image data for transformed image
  const imageData = ctx.createImageData(width, height)

  // transformation and map pixels to new pixel places
  for (let y = 0; y < height; y++) {
    // for the pixels in the height
    for (let x = 0; x < width; x++) {
      // for the pixels in the width
      // get the current pixel position
      const pixel = [x, y, 1]

      // source pixels location
      const source = MultiplyMatrixVector(matrix, pixel)

      // round to nearest pixel
      const srcX = Math.round(source[0] - centerX + imageCenterX)
      const srcY = Math.round(source[1] - centerY + imageCenterY)

      // check if source pixel is within bounds
      if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
        const destOffset = (y * width + x) * 4
        const srcOffset = (srcY * width + srcX) * 4

        // copy the pixel data
        imageData.data[destOffset] = ppm_img_data.data[srcOffset]
        imageData.data[destOffset + 1] = ppm_img_data.data[srcOffset + 1]
        imageData.data[destOffset + 2] = ppm_img_data.data[srcOffset + 2]
        imageData.data[destOffset + 3] = 255
      }
    }
  }
  // clear canvas and draw new image
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // center the image in the canvas
  ctx.putImageData(imageData, centerX - imageCenterX, centerY - imageCenterY)

  // show current transformation matrix
  showMatrix(matrix)

  // Request next frame
  animationId = requestAnimationFrame(animate)
}

//Function to process upload
var upload = function () {
  if (input.files.length > 0) {
    var file = input.files[0]
    console.log('You chose', file.name)
    if (file.type) console.log('It has type', file.type)
    var fReader = new FileReader()
    fReader.readAsBinaryString(file)

    fReader.onload = function (e) {
      //if successful, file data has the contents of the uploaded file
      var file_data = fReader.result
      parsePPM(file_data)

      /*
       * TODID: ADD CODE HERE TO DO 2D TRANSFORMATION and ANIMATION
       * Modify any code if needed
       * Hint: Write a rotation method, and call WebGL APIs to reuse the method for animation
       */
      // stop any existing animation
      if (animationId) {
        cancelAnimationFrame(animationId)
      }

      // reset animation
      currentAngle = 0
      lastTime = null

      // start the animation
      animationId = requestAnimationFrame(animate)

      // *** The code below is for the template to show you how to use matrices and update pixels on the canvas.
      // *** Modify/remove the following code and implement animation

      // Create a new image data object to hold the new image
      //   var newImageData = ctx.createImageData(width, height);
      //   var transMatrix = GetTranslationMatrix(0, height); // Translate image
      //   var scaleMatrix = GetScalingMatrix(1, -1); // Flip image y axis
      //   var matrix = MultiplyMatrixMatrix(transMatrix, scaleMatrix); // Mix the translation and scale matrices

      //   // Loop through all the pixels in the image and set its color
      //   for (var i = 0; i < ppm_img_data.data.length; i += 4) {
      //     // Get the pixel location in x and y with (0,0) being the top left of the image
      //     var pixel = [Math.floor(i / 4) % width, Math.floor(i / 4) / width, 1];

      //     // Get the location of the sample pixel
      //     var samplePixel = MultiplyMatrixVector(matrix, pixel);

      //     // Floor pixel to integer
      //     samplePixel[0] = Math.floor(samplePixel[0]);
      //     samplePixel[1] = Math.floor(samplePixel[1]);

      //     setPixelColor(newImageData, samplePixel, i);
      //   }

      //   // Draw the new image
      //   ctx.putImageData(
      //     newImageData,
      //     canvas.width / 2 - width / 2,
      //     canvas.height / 2 - height / 2
      //   );

      //   // Show matrix
      //   showMatrix(matrix);
    }
  }
}

// Initialize animation controls
function initControls () {
  const stopButton = document.createElement('button')
  stopButton.textContent = 'Stop Animation'
  stopButton.onclick = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  const startButton = document.createElement('button')
  startButton.textContent = 'Start Animation'
  startButton.onclick = () => {
    if (!animationId) {
      lastTime = null
      animationId = requestAnimationFrame(animate)
    }
  }

  document.body.appendChild(stopButton)
  document.body.appendChild(startButton)
}

// call initControls when the page loads
window.addEventListener('load', initControls)

// Show transformation matrix on HTML
function showMatrix (matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = Math.floor(matrix[i][j] * 100) / 100
    }
  }
  document.getElementById('row1').innerHTML =
    'row 1:[ ' + matrix[0].toString().replaceAll(',', ',\t') + ' ]'
  document.getElementById('row2').innerHTML =
    'row 2:[ ' + matrix[1].toString().replaceAll(',', ',\t') + ' ]'
  document.getElementById('row3').innerHTML =
    'row 3:[ ' + matrix[2].toString().replaceAll(',', ',\t') + ' ]'
}

// Sets the color of a pixel in the new image data
function setPixelColor (newImageData, samplePixel, i) {
  var offset = ((samplePixel[1] - 1) * width + samplePixel[0] - 1) * 4

  // Set the new pixel color
  newImageData.data[i] = ppm_img_data.data[offset]
  newImageData.data[i + 1] = ppm_img_data.data[offset + 1]
  newImageData.data[i + 2] = ppm_img_data.data[offset + 2]
  newImageData.data[i + 3] = 255
}

// Load PPM Image to Canvas
function parsePPM (file_data) {
  /*
   * Extract header
   */
  var format = ''
  var max_v = 0
  var lines = file_data.split(/#[^\n]*\s*|\s+/) // split text by whitespace or text following '#' ending with whitespace
  var counter = 0
  // get attributes
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length == 0) {
      continue
    } //in case, it gets nothing, just skip it
    if (counter == 0) {
      format = lines[i]
    } else if (counter == 1) {
      width = lines[i]
    } else if (counter == 2) {
      height = lines[i]
    } else if (counter == 3) {
      max_v = Number(lines[i])
    } else if (counter > 3) {
      break
    }
    counter++
  }
  console.log('Format: ' + format)
  console.log('Width: ' + width)
  console.log('Height: ' + height)
  console.log('Max Value: ' + max_v)
  /*
   * Extract Pixel Data
   */
  var bytes = new Uint8Array(3 * width * height) // i-th R pixel is at 3 * i; i-th G is at 3 * i + 1; etc.
  // i-th pixel is on Row i / width and on Column i % width
  // Raw data must be last 3 X W X H bytes of the image file
  var raw_data = file_data.substring(file_data.length - width * height * 3)
  for (var i = 0; i < width * height * 3; i++) {
    // convert raw data byte-by-byte
    bytes[i] = raw_data.charCodeAt(i)
  }
  // update width and height of canvas
  document.getElementById('canvas').setAttribute('width', window.innerWidth)
  document.getElementById('canvas').setAttribute('height', window.innerHeight)
  // create ImageData object
  var image_data = ctx.createImageData(width, height)
  // fill ImageData
  for (var i = 0; i < image_data.data.length; i += 4) {
    let pixel_pos = parseInt(i / 4)
    image_data.data[i + 0] = bytes[pixel_pos * 3 + 0] // Red ~ i + 0
    image_data.data[i + 1] = bytes[pixel_pos * 3 + 1] // Green ~ i + 1
    image_data.data[i + 2] = bytes[pixel_pos * 3 + 2] // Blue ~ i + 2
    image_data.data[i + 3] = 255 // A channel is deafult to 255
  }
  ctx.putImageData(
    image_data,
    canvas.width / 2 - width / 2,
    canvas.height / 2 - height / 2
  )
  //ppm_img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);   // This gives more than just the image I want??? I think it grabs white space from top left?
  ppm_img_data = image_data
}

//Connect event listeners
input.addEventListener('change', upload)
