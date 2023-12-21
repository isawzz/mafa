onload = start;

async function start() { test44(); } //test42_toolbar(); }

async function test44(){
	let dbody=document.body;
	dbody.innerHTML = '';
	let d=mDom(dbody,{h:800,w:1000,bg:'skyblue'});
	let src="../assets/games/nations/civs/japan.jpg"; //'../assets/img/emo/abacus.png'; //

	d.innerHTML = 'HALLO'; //return;
	let img = mDom(d,{},{tag:'img',width:400,src:src});


	//let canvas = mDom(d,{},{tag:'canvas',width:'100%',height:'100%'});
}
function mist(){
	var img = document.createElement("img"); 
	img.src = "../assets/games/nations/civs/korea.jpg"; //specify url
	
	img.onload=()=>{
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img,100,100); //draw it
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
	
	img.onload=async()=>{
		const canvas = document.createElement('canvas');
		mAppend(dParent,canvas);
		console.log('w,h',img.width,img.height);
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
		console.log('resp',resp)
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



