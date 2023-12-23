
function rotateImage(img, degree) {
	let canvas = mBy('canvas')
	var ctx = canvas.getContext('2d');
	var cw, ch, cx, cy;
	//var cw = img.width/2, ch = img.height/2, cx = 0, cy = 0;

	//   Calculate new canvas size and x/y coorditates for image
	switch (degree) {
		case 90:
			cw = img.height / 2;
			ch = img.width / 2;
			cx = 100; //(img.width/2);
			cy = 100; //(img.height/2) * (-1);
			break;
		case 180:
			cx = img.width * (-1);
			cy = img.height * (-1);
			break;
		case 270:
			cw = img.height;
			ch = img.width;
			cx = img.width * (-1);
			break;
	}

	//  Rotate image            
	canvas.setAttribute('width', cw);
	canvas.setAttribute('height', ch);

	degree = 20;
	cw = img.height / 2;
	ch = img.width / 2;
	cx = 100; //(img.width/2);
	cy = 100; //(img.height/2) * (-1);
	//ctx.rotate(degree * Math.PI / 180);
	//cContext.drawImage(img, cx, cy);
	//console.log('dim',cx,cy,cw,ch);
	ctx.fillStyle = 'red';
	ctx.fillRect
	//ctx.drawImage(img, cx, cy,cw,ch);

	//downloadCanvas(canvas);
	//document.getElementById('download').setAttribute('href',canvas.toDataURL())
}
function downloadCanvas(canvas) {
	//var canvas = document.getElementById('myCanvas');
	var dataURL = canvas.toDataURL('image/png');

	// Create a temporary link element
	var link = document.createElement('a');
	link.href = dataURL;
	link.download = 'canvas_image.png';

	// Append the link to the body and simulate a click
	document.body.appendChild(link);
	link.click();

	// Remove the link from the body
	document.body.removeChild(link);
}
async function saveCiv(name, sz = 800) {

	let dParent = mBy('dMain');
	let img = mDom(dParent, {}, { tag: 'img', src: `../assets/games/nations/civs/${name}.jpg`, height: sz });
	img.style.transform = `rotate(90deg) translateY(-${sz}px)`;
	img.style.transformOrigin = 'top left';

	img.onload = async () => {
		const canvas = document.createElement('canvas');
		mAppend(dParent, canvas);
		console.log('w,h', img.width, img.height);
		canvas.width = img.height;
		canvas.height = img.width;
		const ctx = canvas.getContext('2d');

		// ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation matrix
		// ctx.translate(0, 800); // Apply the translation
		// ctx.rotate((90 * Math.PI) / 180); // Apply the rotation
		ctx.drawImage(img, 0, 0, 800, 400); // Draw the image


		//ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		const dataUrl = canvas.toDataURL('image/png');
		return dataUrl;

	};

	return;

	img.onload = async () => {

		let dataUrl = imgToDataUrl(img);
		let unique = `civ_${name}_${rName()}`;
		let o = { image: dataUrl, name: name, unique: unique, coll: 'nations', path: unique + '.png', ext: 'png' };
		console.log('dataUrl');
		let resp = await mPostRoute('postImage', o);
		console.log('resp', resp)
	};

}






function calendarOpenDay(date, d, ev) {
  if (isdef(ev) && ev.target != d) return;
  console.log('open event on', typeof date, date)
  let d1 = addEditable(d, { w: 50 }, {
    onEnter: ev => {
      let inp = ev.target;
      let o = { date: date.getTime(), text: inp.value, title: firstWord(inp.value) };
      onEventEdited(o, inp);
    }
  });
  return d1;
}
async function loadUserdata(uname) {
  let data = await mGetRoute('user', uname);
  console.log('data',data)
  if (!data) { data = await postUserChange({ name: uname, color: rChoose(M.playerColors) }); }
  else Serverdata.users[uname] = data;
  return data;
}
