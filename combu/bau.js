
function filterImages(ev){
	//s can be interpreted as cat or part of key
	//erstmal nur als cat
	//wenn da nix ist, dann als part of key
	console.log('oninput!!!!!!!!!!!!!!!!');
	let s = ev.target.value;
	let list = M.byCat[s.toLowerCase()];
	if (nundef(list) || isEmpty(list)) return; //list = Object.keys(M.superdi);
	M.keys = list;
	M.index = 0;
	showImageBatch(0);

}







