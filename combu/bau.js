
async function onclickUser() {
	let uname = await mPrompt(); //returns null if invalid!
	console.log('onclickUser:', uname);
  //wenn der user schon bekannt ist dann soll ihn einfach laden
  
	if (uname) {
		let result = await addNewUser(uname);

		console.log('result', result);
		if (!result) { alert('login failed!'); return; }
		U = result.session.users[uname];
	}
	showUser();
}
async function addNewUser(uname) {
	// if (!isString(uname)) return false;
	// uname = uname.toLowerCase().trim();
	// //only letters please!
	// let correct = true;
	// for (const ch of toLetters(uname)) { if (!isLetter(ch)) correct = false; }
	// if (!correct) return false;
	//name is correct, so send it to session and update UI!
	console.log('adding new user!!!', uname);
	let data = { name: uname, color: valf(userColors[uname],rChoose(plColors))}; //rColor(50,1,15) };
	o = { data: data, path: `users.${uname}`, mode: 's' }; //['users',uname]
	return await uploadJson('save', o);
	//phpPost(o, 'add_user');
}



























































