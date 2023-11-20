
async function onclickUser() {
	let uname = await mPrompt(); //returns null if invalid!
	console.log('onclickUser:', uname);
	if (uname) {
		let result = await addNewUser(uname);
		console.log('result', result);
		if (!result) { alert('login failed!'); return; }
		U = result.session.users[uname];
	}
	showUser();
}



//#region colors
function sortByMultipleProperties(list, p1, p2, p3) {
  return list.sort((a, b) => {
    // Compare by first property (p1)
    if (a[p1] < b[p1]) return -1;
    if (a[p1] > b[p1]) return 1;

    // If p1 values are equal, compare by second property (p2)
    if (a[p2] < b[p2]) return -1;
    if (a[p2] > b[p2]) return 1;

    // If p1 and p2 values are equal, compare by third property (p3)
    if (a[p3] < b[p3]) return -1;
    if (a[p3] > b[p3]) return 1;

    // If all properties are equal, no change in order
    return 0;
  });
}
function sortByMultipleProperties(list) {
	let props = Array.from(arguments).slice(1); //arrTakeFrom(arguments,1);
	console.log('props',props)
  return list.sort((a, b) => {

		for(const p of props){
			if (a[p] < b[p]) return -1;
			if (a[p] > b[p]) return 1;
		}

    // If all properties are equal, no change in order
    return 0;
  });
}
function sortByHue(colors) {
  // Convert hex colors to HSL format
  const hslColors = colors.map(AhexToHSL);

  // Sort by hue
  hslColors.sort((a, b) => a.hue - b.hue);

  // Convert back to hex format
  const sortedHexColors = hslColors.map(AhslToHex);

  return sortedHexColors;
}
function sortByHueWithoutGrays(colors) {
  // Filter out the gray colors
  const nonGrayColors = colors.filter(color => !isGrayColor(color));

  // Convert non-gray hex colors to HSL format
  const hslNonGrayColors = nonGrayColors.map(AhexToHSL);

  // Sort by hue
  hslNonGrayColors.sort((a, b) => a.hue - b.hue);

  // Convert back to hex format
  const sortedHexColors = hslNonGrayColors.map(AhslToHex);

  return sortedHexColors;
}
function isGrayColor(color,diff=60) {
  const rgb = AhexToRgb(color);
  //return rgb.r === rgb.g && rgb.g === rgb.b;

	return Math.abs(rgb.r-rgb.g) + Math.abs(rgb.r-rgb.b) + Math.abs(rgb.g-rgb.b) < 3*diff;
}

// Helper function to convert hex to HSL
function AhexToHSL(hex) {
  const rgb = AhexToRgb(hex);
  const hsl = ArgbToHsl(rgb.r, rgb.g, rgb.b);
  return hsl;
}

// Helper function to convert HSL to hex
function AhslToHex(hsl) {
  const rgb = AhslToRgb(hsl.hue, hsl.saturation, hsl.lightness);
  return ArgbToHex(rgb.r, rgb.g, rgb.b);
}

// Helper function to convert hex to RGB
function AhexToRgb(hex) {
  // Remove the hash character if present
  hex = hex.replace(/^#/, '');

  // Parse the hex values to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

// Helper function to convert RGB to HSL
function ArgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return { hue: h, saturation: s, lightness: l };
}

// Helper function to convert HSL to RGB
function AhslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// Helper function to convert RGB to hex
function ArgbToHex(r, g, b) {
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

//#endregion

























































