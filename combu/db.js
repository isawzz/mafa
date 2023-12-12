
async function getEvent(id, cachedOk = true) { 
	let res = lookup(Serverdata, ['events',id]); 
	if (!cachedOk) Serverdata.events[id] = await mGetRoute('event',{id}); 
	return res;
}
async function getEvents(cachedOk = false) { 
	let res = lookup(Serverdata, ['events']); 
	if (!cachedOk) Serverdata.events = await mGetRoute('events'); 
	return res;
}
async function getUser(uname, cachedOk = false) { 
	let res = lookup(Serverdata, ['users',uname]); 
	//console.log(uname,res)
	if (!res || !cachedOk) res = await mGetRoute('user',{uname}); 
	if (!res) { res = await postUserChange({ name: uname, color: rChoose(M.playerColors) }); }
	Serverdata.users[uname] = res;
	return res;
}

async function postUserChange(data) {
  data = valf(data, U)
  return Serverdata.users[data.name] = await mPostRoute('postUser', data);
}
async function postEventChange(data) {
  return Serverdata.events[data.id] = await mPostRoute('postEvent', data);
}

//wenn ich ein get vom server mache, soll ich dann ALLES gleich updaten?ne nur das was geholt habe!
















