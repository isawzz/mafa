onload = start;

async function start() { test45(); } //test42_toolbar(); }
async function test46_civs(){
	let dbody = document.body; dbody.innerHTML = ''; 
	let d = mDom(dbody, { bg: 'skyblue', hmin:'100vh' },{id:'d1'});
	let dhidden = mDom(dbody);

	for(const civ of ['japan']){
		let src=`../assets/games/nations/civs/${civ}.jpg`;
		let w=800;
		
	}
}
async function imgSaveAsLandscape(src,width,viewParent,sendToServer,downloadAtClient){
	if (isdef(mBy('img1'))) mBy('img1').remove();
	let img = mDom(document.body, { position: 'absolute',top:'100vh',h:width }, { tag: 'img', src: src, id:'img1' });
	img.onload=()=>{
		let d=viewParent;
		mClear(d);
		let canvas = mDom(d, {border:'red'}, { tag: 'canvas', id: 'canvas', width:img.height, height:img.width }); 
		let ctx = canvas.getContext('2d');
		ctx.translate(img.height,0)
		ctx.rotate(90 * Math.PI / 180);
	
		// ctx.fillStyle='yellow';
		//ctx.fillRect(1,1,w,h);
		ctx.drawImage(img,0,0,img.width,img.height)
	
		if (downloadAtClient) downloadCanvas(canvas);
		if (sendToServer) 
	
	
	};

}
function test45() {
	let dbody = document.body; dbody.innerHTML = ''; 
	let d = mDom(dbody, { bg: 'skyblue', hmin:'100vh' },{id:'d1'});

	let src = '../assets/img/emo/abacus.png'; //"../assets/games/nations/civs/japan.jpg"; //

	let img = mDom(dbody, { position: 'absolute',top:500,h:800 }, { tag: 'img', src: src, id:'img1' });
	img.src="../assets/games/nations/civs/japan.jpg";
	img.onload=weiterStart;
}
function weiterStart(){

	let [d,img]=[mBy('d1'),mBy('img1')];
	let canvas = mDom('d1', {border:'red'}, { tag: 'canvas', id: 'canvas', width:img.height, height:img.width }); let ctx = canvas.getContext('2d');
	ctx.fillStyle='yellow';

	let [w,h]=[200,400]

	ctx.translate(img.height,0)
	ctx.rotate(90 * Math.PI / 180);

	//ctx.fillRect(1,1,w,h);
	ctx.drawImage(img,0,0,img.width,img.height)

	downloadCanvas(canvas);






}
async function test44() {
	let dbody = document.body;
	dbody.innerHTML = '';
	let d = mDom(dbody, { bg: 'skyblue' });
	let src = "../assets/games/nations/civs/japan.jpg"; //'../assets/img/emo/abacus.png'; //

	d.innerHTML = 'HALLO'; //return;
	let img = mDom(d, { visibility: 'hidden', position: 'absolute' }, { tag: 'img', src: src });
	let canvas = mDom(d, {}, { tag: 'canvas', id: 'canvas' })
	let link = mDom(dbody, {}, { tag: 'a', id: 'download', html: 'download', onclick: () => downloadCanvas(canvas) })

	img.onload = () => {
		rotateImage(img, 90);
	}
	//let canvas = mDom(d,{},{tag:'canvas',width:'100%',height:'100%'});
}
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
function mist() {
	var img = document.createElement("img");
	img.src = "../assets/games/nations/civs/korea.jpg"; //specify url

	img.onload = () => {
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 100, 100); //draw it
		d.appendChild(canvas); // display it!	
	}

	//ctx.rotate(90 * Math.PI/180); // rotate by 90 degrees
	//ctx.fill();
}
async function test43() {
	await prelims();

	//onclickPlay
	showTitle('Nations');
	//let d = mDom('dMain', { hpadding: 20, display: 'flex', gap: '2px 4px', wrap: true });
	for (const civ of ['korea']) {
		await saveCiv(civ);
	}
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
async function test42_toolbar() {
	await prelims();
	await onclickAdd();
	UI.imgName.value = 'dadadha das ist gut';
	UI.imgColl.value = 'all';
}

async function test41_allNewApp() {
	await prelims();
	await onclickSchedule();
}

async function prelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session'); //hier wird gesamte session geladen!!!
		await loadCollections();
		loadPlayerColors();

		showNavbar();

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })

		let uname = localStorage.getItem('username');
		if (isdef(uname)) U = await getUser(uname);
		await showUser(uname);

		let server = getServerurl();
		Socket = io(server);
		Socket.on('message', showChatMessage);
		Socket.on('disconnect', x => console.log('>>disconnect:', x));
		Socket.on('update', x => console.log('>>update:', x));

		showChatWindow();

	}
}



