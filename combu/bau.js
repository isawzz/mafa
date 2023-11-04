
function formatDate(date) {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

	return `${day}_${month}_${year}`;
}
function generateEventId(tsDay,tsCreated){return `${rLetter()}_${tsDay}_${tsCreated}`; }

//function calendarGetDayId(dt) { return `d_${dt.getTime()}_${rUniqueId()}`; }
//function calendarGetEventId(o) { return `inp_${o.id}`; }

function onclickDay(ev){
	//id kann ja nur die day id sein!!!!
	let tsDay = evToId(ev); //ev.target.getAttribute('date'); //evToTargetAttribute(ev,'date'); //ts for this day
	let tsCreated = Date.now()
	let id = generateEventId(tsDay,tsCreated);
	let o={id:id,created:tsCreated,day:tsDay,from:null,to:null,title:'',text:'',user:ClientData.userid,subscribers:[]};
	Config.events[id]=o;
	// console.log(id,o);

  let d1 = addEditable(ev.target, { w: '100%' }, { id:id, onEnter: onEventEdited });
	console.log(d1);

	//trag dieses event ein!
	//soll ich das event hier eintragen oder erst wenn es einen content hat?
}
function muell(){
	console.log('clicked on day',idDay);
	let tsEventDay = firstNumber(idDay);
	let dte = new Date(tsEventDay)
	let day=`${dte.get}`
	console.log('clicked on date',dte);
	let tsCreated = Date.now();
	console.log('created',tsCreated,new Date(tsCreated));
	let id = idDay;
	let o = {inpId:idDay,day:tsEventDay,from:null,to:null,created:tsCreated,title:'',text:'',user:ClientData.userid,subscribers:[]};
	//Config.Events
	console.log('created event',o)
	//start input field in this day element
	//find a unique id for input field
	//create an event for this input field
	//event:{id,user,content,date,time}
}


function eventEdited(o,inp){
	//irgendwo muessen all die events gespeichert sein!
	//ein event muss eine id haben!!!

}






