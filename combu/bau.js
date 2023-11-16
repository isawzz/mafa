

async function addNewUser(uname){
	if (!isString(uname)) return false;
	uname = uname.toLowerCase().trim();
	//only letters please!
	let correct = true;
	for(const ch of toLetters(uname)){if (!isLetter(ch)) correct=false;}
	if (!correct) return false;
	//name is correct, so send it to session and update UI!
	console.log('adding new user!!!',uname);
	let data = {	name: uname, color: rColor() };	
	o = { data: data, path: `users.${uname}`, mode: 's' }; //['users',uname]
	return await uploadJson('save',o);
	//phpPost(o, 'add_user');
}













function drawFa6(o){
	let fz = 50;
	let d = mDom('dMain', { w: 120, h: 80, margin: 4, align: 'center', display: 'inline-block' });
	let el = mDom(d, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor() }, { html: String.fromCharCode('0x' + o.fa6) });
	let t = mDom(d, { fz: 11 }, { html: o.key });

}

function drawFaga(o){
	let fz = 50;
	let [code,family] = isdef(o.fa)?[o.fa,'pictoFa']:[o.ga,'pictoGame'];
	//console.log('family:',family)
	let d = mDom('dMain', { w: 120, h: 80, margin: 4, align: 'center', display: 'inline-block' });
	let el = mDom(d, { fz: fz, hline: fz, family: family, bg: 'transparent', fg: rColor() }, { html: String.fromCharCode('0x' + code) });
	let t = mDom(d, { fz: 11 }, { html: o.key });

}






function showSidebar(dParent){

	dSidebar = mDom(dParent,{'align-self':'stretch',hmin:'100vh'},{id:'dSidebar'});
	dLeiste = mDiv(dParent);
	mStyle(dLeiste, { bg:'#eee', wmin: 70, hmin: '100vh', display: 'flex', 'flex-flow': 'column wrap' });
	//da kommen jetzt die tools drauf!

	//wenn ich eines selecte kann ich edit,remove,delete,edit categories,edit name,add to collection machen
	//wenn ich mehrere selecte kann ich remove,delete,add category,add to collection machen

	//soll jetzt ein user sich ausweisen muessen? ja mindestens einloggen!

}








































