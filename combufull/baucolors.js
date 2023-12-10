function generateArrayColors(startColor, endColor, numSteps) {
  // Create an empty array to store the generated colors
  const colors = [];

  // Create a variable to store the current step
  let step = 0;

  // Loop through the number of steps
  while (step < numSteps) {
    // Calculate the current color
    const currentColor = mixColors(startColor, endColor, step / numSteps);

    // Add the current color to the array
    colors.push(currentColor);

    // Increment the step
    step++;
  }

  // Return the array of colors
  return colors;
}
function mixColors(color1, color2, weight) {
  // Convert the colors to hexadecimal values
  const hex1 = color1.substring(1);
  const hex2 = color2.substring(1);
  //console.log(hex1,hex2)

  // Convert the hexadecimal values to integers
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  // Calculate the mixed color
  const r = Math.floor(r1 * (1 - weight) + r2 * weight);
  const g = Math.floor(g1 * (1 - weight) + g2 * weight);
  const b = Math.floor(b1 * (1 - weight) + b2 * weight);

  // Convert the mixed color to a hexadecimal value
  const hex = colorHex({r:r,g:g,b:b}); // '#' + r.toString(16) + g.toString(16) + b.toString(16);
  //console.log('result',hex)
  // Return the mixed color
  return hex;
}