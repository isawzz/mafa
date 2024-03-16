async function onsockEvent(x){
	console.log('SOCK::event',x)
	Serverdata.events[x.id]=x;
	//TODO: if calendar app is open refreshEvents!
}
async function onsockSuperdi(x){
	console.log('SOCK::superdi',x)
	//TODO: update superdi!
	//M.superdi[x.id]=x;
}

function onclickExistingEvent(ev) { evNoBubble(ev); showEventOpen(evToId(ev)); }















