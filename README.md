Author: {Jordan Demler} [{jdemler@arizona.edu}]  
Course: Undergrad 433
Date: [Feburary]. [9], 2025

**PLEASE UPDATE THIS README TO INCLUDE:**
* a text description of how to run your program, 
* document any idiosyncrasies, behaviors, or bugs of note that you want us to be aware of when grading, and
* any other comments that you feel are relevant.

Executing program:

To run the program, just click on the button to upload an image file. Select the image file, and the image
will automatically be animated to spin and scale (scale for extra credit). You can stop the spinning and scaling with the "Stop Animation" button, and start 
it again with the "Start Animation" button.


Description:

This is a simple program that takes in an image and animates it using matrix manipulation to spin, and scale.
The image is quickly rotated many times in order to animate "spinning," this is done using the provided MathUtiliteis js file that has operations such as rotation to use matrix multiplication to rotate the image repeatedly (to emulate spinning).


Included files (**PLEASE ADD/UPDATE THIS LIST**):
* index.html    -- a sample html file with a canvas
* a01.js        -- a sample javascript file for functionality with the image uploading, and a method to parse PPM images,
along with this is also has the implementation that makes the image spin and scale.
* MathUtilities.js		-- some math functions that you can use and extend yourself. It contains matrix manipulations
* bunny.ppm     -- a test image
* pic1.ppm      -- a picture chosen by e for the program to animate


**PLEASE PROVIDE ANY ATTRIBUTION HERE**
* Images obtained from the following sources:
  * bunny: http://graphics.stanford.edu/data/3Dscanrep/  
  * pic1:  https://filesamples.com/formats/ppm
* Figuring out scaling and rotation from following sources: 
  * scaling:  https://stackoverflow.com/questions/24910899/scaling-an-image-2d-transformation-matrix 
  * rotation and scaling  : https://ebookcentral.proquest.com/lib/UAZ/detail.action?docID=4710787 (16, 17)