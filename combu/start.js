onload = start;

async function start() { test34_colorjs_YES(); }

function mimali(c,n){
	function whh(c1,c2){return generateArrayColors(colorHex(c1), colorHex(c2), 10);}
	function genc(c,hinc){	let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,hsl.s*100,hsl.l*100);}
	function cinc(c,hinc,sinc,linc){let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,clamp(hsl.s*100+sinc,0,100),clamp(hsl.l*100+linc,0,100));}
	function arrd(c,hinc,sinc,linc,n){let r=[];for(let i=0;i<n;i++){r.push(cinc(c,hinc*i,sinc*i,linc*i));}return r;}

	function light(c,lper=75){let hsl=colorHSL(c,true);return colorHSLBuild(hsl.h,hsl.s*100,lper);}
	function sat(c,sper=100){let hsl=colorHSL(c,true);return colorHSLBuild(sper,hsl.s*100,hsl.l*100);}
	function hue(c,hdeg){let hsl=colorHSL(c,true);return colorHSLBuild(hdeg,hsl.s*100,hsl.l*100);}

	c=light(c,75);
	c=cinc(c,30,0,0);
	wheel=arrd(c,30,0,0,n);

	return wheel;
}

async function test34_colorjs_YES(){
	await prelims();
	UI.nav.activate('schedule');
	onclickSchedule();
}
async function test33_colorjs(){
	await prelims();
	UI.nav.activate('schedule');
	onclickSchedule();



	let c,hsl,c1,c2,c3,c4,c5,hsl1,hsl2,hsl3;
	c=U.color;
	hsl=colorHSL(c,true);

	//console.log(colorHex('yellow'))
	function wh(c1,c2){return generateArrayColors(colorHex(c1), colorHex(c2), 10);}
	let wheel = wh(c,'yellow').concat(wh('yellow','red')); //generateArrayColors(c, '#ffff00', 10); //arrRepeat(12,'orange');
	//wheel = wh('yellow','red')

	function whh(c1,c2){return generateArrayColors(colorHex(c1), colorHex(c2), 10);}
	function genc(c,hinc){	let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,hsl.s*100,hsl.l*100);}
	function cinc(c,hinc,sinc,linc){let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,clamp(hsl.s*100+sinc,0,100),clamp(hsl.l*100+linc,0,100));}
	function arrd(c,hinc,sinc,linc,n){let r=[];for(let i=0;i<n;i++){r.push(cinc(c,hinc*i,sinc*i,linc*i));}return r;}

	function light(c,lper=75){let hsl=colorHSL(c,true);return colorHSLBuild(hsl.h,hsl.s*100,lper);}
	function sat(c,sper=100){let hsl=colorHSL(c,true);return colorHSLBuild(sper,hsl.s*100,hsl.l*100);}
	function hue(c,hdeg){let hsl=colorHSL(c,true);return colorHSLBuild(hdeg,hsl.s*100,hsl.l*100);}

	c=light(c,75);
	c=cinc(c,30,0,0);
	wheel=arrd(c,30,0,0,12);
	console.log(wheel);

	hsl=colorHSL(c,true);
	console.log('hsl',hsl);
	c1=colorHSLBuild(hsl.h,hsl.s*100,hsl.l*100);
	hsl1=colorHSL(c1,true);
	console.log('hsl1',hsl1);
	c2=genc(c1,30); console.log('c2 raw',c2)
	hsl2=colorHSL(c2,true);
	console.log('hsl2',hsl2);

	c3=cinc(c2,30,10,20);
	hsl3=colorHSL(c3,true);
	console.log('hsl3',hsl3);

	//console.log(genc('red',0));
	//return;
	//console.log('wheel',wheel)
	showWheel(wheel, 'white'); // hat 12 colors
}

async function test32_colorjs(){
	await prelims();
	UI.nav.activate('schedule');
	onclickSchedule();

	let wheel = arrRepeat(12,'orange');

	var rainbow = new Rainbow();

	let c1=U.color; //BLUEGREEN;
	console.log('color',c1);
	let c2=getMatchingColor(c1,90);
	let c3=getMatchingColor(c2,90);
	c3=getComplementaryColor(c1);


	//return;

	rainbow.setSpectrum(c1,c3); //rColor(75),rColor(75)); //'red','green'); //'#ffffff', '#3E296B');
	rainbow.setNumberRange(1, 12); 
	//rainbow.colourAt(number); // based on the numbers from your array, this would return the color you want
	wheel=[];
	for(let i=0;i<12;i++) wheel.push('#'+rainbow.colourAt(i));
	//shuffle(wheel)
	console.log('wheel',wheel)

	// wheel = generateGradientColor(colorToNumber('red'),colorToNumber('blue'),5); //rColor(75,.5), rColor(75,.5), 12);
	// console.log('wheel',wheel)
	// wheel=wheel.map(x=>numberToColor(x));
	// console.log('wheel',wheel)
	showWheel(wheel, 'white'); // hat 12 colors
}
function colorToNumber(color='yellow') {

	let c=colorRGB(color,true); console.log(c)
  // Ensure each component is in the valid range (0-255)
  red = c.r;// Math.max(0, Math.min(255, red));
  green = c.g;//Math.max(0, Math.min(255, green));
  blue = c.b;//Math.max(0, Math.min(255, blue));

  // Combine components into a single integer
  const numberRepresentation = (red << 16) + (green << 8) + blue;

  return numberRepresentation;
}
function numberToColor(numberRepresentation) {
  // Extract red, green, and blue components
  const red = (numberRepresentation >> 16) & 255;
  const green = (numberRepresentation >> 8) & 255;
  const blue = numberRepresentation & 255;

  return colorFrom({ r:red, g:green, b:blue });
}
function mist(){
	let color = new Color("p3", [0, 1, 0]);
	color.steps("red", {
		space: "lch",
		outputSpace: "srgb",
		maxDeltaE: 3, // max deltaE between consecutive steps
		steps: 14 // min number of steps
	});
	let redgreen = color.range("red", {
		space: "lch", // interpolation space
		outputSpace: "srgb"
	});
	console.log('redgreen',redgreen(...wheel))	

}
async function test31_colorjs(){
	await prelims();
	UI.nav.activate('colors');
	onclickColors();
	//onclickSchedule();
	//onclickColors(); //showColors('dExtra');
}

async function prelims() {
	if (nundef(M.superdi)) {

		Serverdata = await mGetRoute('load', { config: true, session: true }); //console.log('Serverdata', Serverdata);
		await loadCollections();
		loadPlayerColors();

		let nav = UI.nav = mNavbar('dNav',{},'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
		nav.disable('play');

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
		//mInsert(document.body, dTitle, 1);

		dUser = mDom(nav.ui, {}, { id: 'dUser' });
		await userLoad();



	}

}



