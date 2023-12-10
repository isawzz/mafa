
function closeApps(){
	if (isdef(DA.calendar)) {closePopup(); delete DA.calendar; }
	mClear('dMain'); 
	mClear(dTitle);
}

function getUser(uname){return lookup(Serverdata,['users',uname]);}
function getEvents() { return lookup(Serverdata,['users',uname]); }
function getEvent(id) { return lookup(U,['data','events',id]); } //lookup(U.Serverdata,['config','events',id]);//evToEventObject(ev);
function setEvent(id, o) { 
	//console.log('text',o.text)
	Items[id] = lookupSetOverride(U.data, ['events', id], o); 
	mBy(id).value=stringBefore(o.text,'\n');
	return o; 
} 
function getServerurl(){
	let type = detectSessionType();
	let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
	return server;
}
async function deleteEvent(id){
	let result = await simpleUpload('event', {id:id,user:U.name}); 
	delete Items[id]; 
	mBy(id).remove(); 
	//console.log('result', result);  
}
async function updateEvent(id, o) { 
	let result = await simpleUpload('event', o); 
	setEvent(id, o); 
	console.log('result', result); 
}

function onclickDay(ev) {
	let tsDay = evToId(ev);
	let tsCreated = Date.now()
	let id = generateEventId(tsDay, tsCreated);
	let uname = U ? U.name : 'guest';
	let o = { id: id, created: tsCreated, day: tsDay, time: '', text: '', user: uname, shared: false, subscribers: [] };
	Items[id] = o;
	let d1 = addEditable(ev.target, { w: '100%' }, { id: id, onEnter: onEventEdited, onclick: onclickExistingEvent });

}
async function onEventEdited(ev) {
	let id = evToId(ev);
	let o = Items[id];
	let inp = mBy(id);
	if (inp.value) {
		o.text = inp.value;
		//o.text = await(encryptData(inp.value));
		console.log('text',o.text);
		await updateEvent(id, o);
	}
}
function onclickExistingEvent(ev) { showEventOpen(evToId(ev)); }

async function onclickSetEditedEvent(id, text, time) {
	let e = getEvent(id);
	e.time = time;
	e.text = text;
	await updateEvent(id, e);
	closePopup();
}
function showEventOpen(id) {

	let e = getEvent(id); 
	if (!e) return;

	let date = new Date(Number(e.day));
	let [day, month, year] = [date.getDate(), date.getMonth(), date.getFullYear()];
	console.log('day', `${day}.${month}.${year}`);
	let time = e.time;
	let popup = openPopup();
	let d = mBy(id); //input element for this event!
	console.log('d', d)
	let [x, y, w, h, wp, hp] = [d.offsetLeft, d.offsetTop, d.offsetWidth, d.offsetHeight, 300, 180];

	let [left,top]=[Math.max(10,x + w / 2 - wp / 2),Math.min(window.innerHeight-hp-60,y + h / 2 - hp / 2)]
	console.log('left,top',left,top)
	mStyle(popup, { left: left, top: top, w:wp, h:hp });

	let dd = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 3, pabottom: 4 }, { html: `date: ${day}.${month}.${year}` });
	let dt = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 20, pabottom: 4 }, { html: `time:` });
	let inpt = mDom(popup, { fz: '80%', maleft: 3, mabottom: 4, w: 60 }, { tag: 'input', value: e.time });
	mOnEnter(inpt);
	let ta = mDom(popup, { rounding: 4, matop:7, box: true, w: '100%', vpadding: 4, hpadding: 10, }, { tag: 'textarea', rows: 7, value: e.text });

	let line=mDom(popup,{matop:6,w:'100%'}); //,'align-items':'space-between'});
	let buttons=mDom(line,{display:'inline-block'});

	//variant 1: nur server send
	let bsend=mButton('Save', () => onclickSetEditedEvent(id, ta.value, inpt.value), buttons, {fg:'red'});
	mButton('Cancel', () => closePopup(), buttons,{hmargin:10})

	//variant 2: save server or download
	// let bsend=mButton('Send*', () => onclickSetEditedEvent(id, ta.value, inpt.value), buttons, {fg:'red'});
	// mTooltip(bsend,'data are being sent to the server!')
	// let blocal=mButton('Save local*', () => onclickSetEditedEvent(id, ta.value, inpt.value), buttons,{hmargin:10});
	// mTooltip(blocal,'data are kept locally only, but you need to load this data at login!')

	mButton('Delete', () => {deleteEvent(id);closePopup();}, buttons, )
	mDom(line,{fz:'90%',maright:5,float:'right',},{html:`by ${e.user}`});

	//mNode(e, popup)

}
async function simpleUpload(route, o) {
	let server = getServerurl();
	server += `/${route}`;

	const response = await fetch(server, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors',
		body: JSON.stringify(o)
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		return 'ERROR 1';
	}
}



























































