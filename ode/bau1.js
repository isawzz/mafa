
function colorGetBucket(c){
	let buckets='red orange yellow lime green greencyan cyan cyanblue blue bluemagenta magenta magentared black'.split(' ');
	console.log('buckets',buckets);

	c=colorFrom(c);
	let hsl=colorHexToHsl360Object(c);
	let hue = hsl.h;

	//0 30 60 ...
	//orange range 15-45
	//yellow range 45-75
	//lime range 75-105
	//green range 105-135
	
	//hue+15:
	//red ... 0-30
	//orange ... 30-60
	let hshift=(hue+15)%360;
	let ib=Math.floor(360/hshift);
	return buckets[ib];

	
}










