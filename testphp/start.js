onload = start;

async function start() {
	test4_twemoji();
	let result = await test5(); console.log('DONE:', result);
}
async function test5() {
	//Canvas = document.getElementById('gameCanvas'); 
	Canvas = mDom('dMain', { margin: 10, w: 500, h: 400, bg: '#333', rounding: 12, display: 'inline-block' }, { id: 'canvas', tag: 'canvas', width: 500, height: 300 });
	Ctx = Canvas.getContext('2d');

	//user menu

	// Session = await getSession();
	// ClientId = getClientId();

	// //wenn jetzt die id in der user list ist, dann log in
	// if (isdef(Session.users) && Session.users.includes(ClientId)) { 
	// 	setClient(ClientId); 
	// } else console.log('no users available!')

	return 'no result'; //{Session,ClientId};
}

function animateAllPlayers(data) {
	data.users.map(x => animatePlayer(x, data))
}
function animatePlayer(id, data, steps = 10) {
	showPlayer(id, data);
	if (steps > 0) setTimeout(() => animatePlayer(id, data, steps - 1), 200)
}
function createUserMenu(users) {

	var dUsernames = document.getElementById("dUsernames");
	//mCenterFlex(dUsernames);

	// Clear the list (if you want to refresh its contents)
	dUsernames.innerHTML = '';

	for (const name in users) {
		var li = document.createElement("div");
		mStyle(li, { fg: users[name].color, display: 'inline', maleft: 10, cursor: 'pointer' })
		li.innerHTML = name;
		li.onclick = ev => setUserId(ev.target.innerHTML);
		li.id = name;
		dUsernames.appendChild(li);
	}
	//console.log('list',dUsernames)
}
function drawCircleC(pos, sz = 10, color = 'red') {
	Ctx.fillStyle = color;
	Ctx.beginPath();
	Ctx.arc(pos.x, pos.y, sz / 2, 0, 2 * Math.PI);
	Ctx.closePath();
	Ctx.fill();
}
function drawRectC(pos, sz = 10, color = 'red') {
	// C ... ctx is set! pos is pos ON CANVAS!!! must be adjusted!!!!!!!
	//console.log('HALLO???', pos, sz, color)
	Ctx.fillStyle = color;
	Ctx.fillRect(pos.x, pos.y, sz, sz);
	// ctx.fillRect(pos.x - sz / 2, pos.y - sz / 2, sz, sz);

}
function getCanvasCenter() {
	return { x: Canvas.width / 2, y: Canvas.height / 2 };
}
function getCanvasRect() {
	return { x: 0, y: 0, w: Canvas.width, h: Canvas.height };
}
function getClientId() { return ClientId = valf(sessionStorage.getItem('ClientId'), 'guest'); }

function getMousePosition(parent, ev) {
	const rect = parent.getBoundingClientRect();
	const x = ev.clientX - rect.left;
	const y = ev.clientY - rect.top;
	return { x, y };
}
async function getSession() {
	let type = detectSessionType();
	if (type == 'live') { // live-server always starts with empty session!
		if (isEmpty(Session))
			return Session;
	} else { // php or telecave

		return await sendGet('session');
	}


	//ich hab jetzt in Session.users die user list, und in ClientData die id und color.
	if (isEmpty(Session)) {
		console.log('session is empty!');
		//sollte load from DB machen damit irgendwelche users hab!
		//was ich brauch ist: users,games,apps,tables
		//wo ist eine gute DB?
		//erstmal nur paar users, thats all

	}


}
async function getUserList() {
	//TODO: get them from server
	let r = getCanvasRect(), offs = 8;
	let [x, y, w, h] = [r.x, r.y, r.w, r.h];
	let users = {
		felix: { name: 'felix', color: 'blue', startPos: { x: 0 + offs, y: 0 + offs } },
		amanda: { name: 'amanda', color: 'green', startPos: { x: w - offs, y: h - offs } },
		gul: { name: 'gul', color: 'deepskyblue', startPos: { x: 0 + offs, y: h - offs } },
		mitra: { name: 'mitra', color: 'hotpink', startPos: { x: w - offs, y: 0 + offs } },
	}; // You can customize this array
	return users;
}
async function getUserList() {
	let users = {
		felix: { name: 'felix', color: 'blue' },
		amanda: { name: 'amanda', color: 'green' },
		gul: { name: 'gul', color: 'deepskyblue' },
		mitra: { name: 'mitra', color: 'hotpink' },
	};
	return users;
}
function movePointCloser(xy, xyGoal, percent = 10) {
	let dx = xyGoal.x - xy.x;
	let dy = xyGoal.y - xy.y;
	//console.log('dx,dy',dx,dy)
	let frac = percent / 100;
	return { x: xy.x + dx * frac, y: xy.y + dy * frac }
}
async function onclickReset() { console.log('session reset:', await phpGetCommand('reset')); }

async function populateUsers() {
	Users = await getUserList();
	//get_values(Users).map(x=>x.startPos={x:0,y:0});
	for (const k in Users) Users[k].startPos = { x: 8, y: 8 };
	createUserMenu(Users);
	return Users;
}
async function phpGetCommand(command, getParams = {}) {
	let type = detectSessionType();
	let url = 'api.php?action=';
	if (type == 'live') url = 'http://localhost:8080/ma/basecommon/' + url;
	url += command;
	for (const k in getParams) { url += `&${k}=${getParams[k]}` }
	const response = await fetch(url);
	//const data = await response.json();
	const astext = await response.text();
	const data = tryJSONParse(astext);
	return data;
}
async function sendPostSimple() { let data = await sendPost(U); showJsonInTextarea(data, 'textarea1'); return data; }

async function sendGetReset() { let data = await sendGet('reset'); showJsonInTextarea(data, 'textarea1'); return data; }

async function sendGet(command) {
	const response = await fetch('server.php?action=' + command);
	//const data = await response.json();
	const astext = await response.text();
	const data = tryJSONParse(astext);
	return data;
}
async function sendPost(o) {
	const start = performance.now();
	const response = await fetch('server.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(o)
	});
	const end = performance.now();

	const latency = end - start;
	showLatency(latency);

	const astext = await response.text();
	const data = tryJSONParse(astext);
	return data;
}
function setClient(id) {
	ClientId = id;
	sessionStorage.setItem('ClientId', ClientId);
}
function setUserId(name) {
	let item = U = jsCopy(Users[name]);
	let elem = mBy(name);
	//console.log('elem',elem)
	// Remove 'selected' class from all list items
	var allItems = document.querySelectorAll("#dUsernames div");
	allItems.forEach(el => { el.classList.remove("selected"); });

	// Add 'selected' class to the clicked item
	elem.classList.add("selected");
	//console.log('selected user',item);

	userId = item.id = item.name; //document.getElementById('dUsernames').value;
	item.pos = item.startPos;
	item.goal = getCanvasCenter();
	sessionStorage.setItem('userId', userId);
	mBy('dLoggedInAs').innerHTML = `logged in as <span style="color:${item.color}">${name}</span>`
}
function showClientLoggedIn() {
	//assumes Session.users.includes(ClientId) && Session[ClientId] exists
	ClientData.user = jsCopy(Session[ClientId]);

	let elem = mBy(name);
	//console.log('elem',elem)
	// Remove 'selected' class from all list items
	var allItems = document.querySelectorAll("#dUsernames div");
	allItems.forEach(el => { el.classList.remove("selected"); });

	// Add 'selected' class to the clicked item
	elem.classList.add("selected");
	//console.log('selected user',item);

	userId = item.id = item.name; //document.getElementById('dUsernames').value;
	item.pos = item.startPos;
	item.goal = getCanvasCenter();
	sessionStorage.setItem('userId', userId);
	mBy('dLoggedInAs').innerHTML = `logged in as <span style="color:${item.color}">${name}</span>`
}
function showGoal(pos, color) {
	drawRectC(pos, 10, color); //zeichne auch dem canvas ein rect mit mittelpunkt pos und groesse 10px
}
function showJsonInTextarea(o, dParent) {
	const textarea = toElem(dParent);
	textarea.value = JSON.stringify(o, null, 2);
	textarea.scrollTop = textarea.scrollHeight;
}
function showLatency(latency) {
	document.getElementById('latencyOutput').innerText = `Latency: ${latency.toFixed(2)}ms`;
}
function showPiece(pos, color) {
	drawCircleC(pos, 8, color); //zeichne auch dem canvas ein rect mit mittelpunkt pos und groesse 10px
}
function showPlayer(id, data) {
	let pl = data[id];
	pl.pos = movePointCloser(pl.pos, pl.goal);
	showGoal(pl.goal, pl.color);
	showPiece(pl.pos, pl.color);
}
function tryJSONParse(astext) {
	try {
		const data = JSON.parse(astext);
		return data;
	} catch {
		console.log('text', astext)
		return { message: 'ERROR', text: astext }
	}
}



































