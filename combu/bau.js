
//#region user
async function addNewUser(uname) {
  console.log('adding new user!!!', uname);
  let data={name:uname,color:rChoose(M.playerColors)};
  o = { data: data, path: `users.${uname}`, mode: 's' }; //['users',uname]
  return await uploadJson('save', o);
}
async function onclickUser() {
  let uname = await mPrompt(); //returns null if invalid!
  console.log('onclickUser:', uname);
  //wenn der user schon bekannt ist dann soll ihn einfach laden

  if (uname) { await loadUser(uname); }
}
async function loadUser(uname){

	if (nundef(Config)) {Serverdata = await mGetRoute('load',{config:true,session:true}); console.log('Serverdata',Serverdata);}

	//am anfang lookup username (!!!) in localstorage!
	if (nundef(uname)){
		uname = localStorage.getItem('username');
		assertion(nundef(uname) || isdef(Serverdata.config.users[uname]));
	}
	if (isdef(uname)) U = getUser(uname);
	if (!U) {
    Serverdata = await addNewUser(uname);
    console.log(Serverdata)
    U=Serverdata.session.users[uname];
	}
	showUser();
}
function showUser() {
  mClear(dUser);
  let d;
  if (U) {
    d = mDom(dUser, { fg: U.color, cursor: 'pointer' }, { html: U.name });
    mStyle(document.body, { bg: U.color });
    let d1=showImage('gear',dUser,{sz:30});
    d1.onclick=ev=>showColors(M.playerColors,updateUserColor);
  } else {
    let styles = { family: 'fa6', fg: 'grey', cursor: 'pointer' }; //,'align-self': 'end'
    d = mDom(dUser, styles, { html: String.fromCharCode('0x' + M.superdi.user.fa6) })
  }
  d.onclick = onclickUser;
}
function updateUserColor(ev){
  let c=ev.target.style.background;
  console.log(c)
}

//#endregion user



























































