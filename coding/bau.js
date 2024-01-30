async function codebaseFromFiles2(files, bykey={}, bytype={}, list=[]) {
	let olist = [];
	for (const path of files) {
		let opath = await codeParseFile(path);
		olist = olist.concat(opath);
	}
	//sollen die jetzt gleich in bytype kommen?oder in bykey? bytype kann duplicates haben!!! davon nimm das letzte in olist!
	let mytype = {}, mykey = {};
	for (const o of olist) { mykey[o.key] = o; }
	for (const k in mykey) { let o = mykey[k]; lookupAddIfToList(mytype, [o.type], o); }

	//alle keys in bykey und in mykey sind unique. aber es kann same key in beiden geben
	//welchen code nehm ich dann?
	let dupltext = '';
	for (const k in mykey) {
		let onew = mykey[k];
		let oold = bykey[k];
		if (isdef(oold) && onew.code == oold.code) {
			console.log('override w/ SAME code', k);//brauch garnix machen!
		} else if (isdef(oold)) {
			console.log('override w/ DIFFERENT code', k);//override code with new code but keep old code!
			oold.oldcode = oold.code;
			oold.code = onew.code;
			dupltext += oold.oldcode + '\n' + oold.code + '\n';
		} else {
			bykey[k] = onew; //add new element to bykey
			lookupAddIfToList(bytype, [onew.type], onew);
			list.push(onew);
		}
	}

	// console.log('bytype',bytype); return //get_keys(bytype));return;
	//list, bytype und bykey sind jetzt complete!!!!
	let globtext = '', functext = '', functextold = '';
	for (const type of ['const', 'var', 'class']) {
		if (nundef(bytype[type])) continue;
		for (const o of bytype[type]) { if (!isEmptyOrWhiteSpace(o.code)) globtext += o.code + '\r\n'; }
	}
	let sortedFuncKeys = sortCaseInsensitive(bytype.function.map(x => x.key)).filter(x => !['step', 'Number'].includes(x));
	sortedFuncKeys.map(x => functext += isEmptyOrWhiteSpace(bykey[x].code) ? '' : (bykey[x].code + '\r\n'));
	sortedFuncKeys.map(x => functextold += (isdef(bykey[x].oldcode) ? bykey[x].oldcode : bykey[x].code) + '\n');

	return [globtext, functext, functextold]
}
function getServerurl() {
  let type = detectSessionType();
  let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
  return server;
}
async function mGetFiles(dir) {
  let server = getServerurl();
  let data = await mGetJsonCors(`${server}/filenames?directory=${dir}`);
  return data.files;
}
async function mGetJsonCors(url) {
  let res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors' // Set CORS mode to enable cross-origin requests
  });
  let json = await res.json();
  //console.log('json', json)
  return json;
}













