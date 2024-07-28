//#region get API calls over web
const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({ apiKey: process.env.API_KEY, });
const openai = new OpenAIApi(config);
const axios = require('axios');
const apiKey = process.env.API_KEY;
const client = axios.create({
	headers: { 'Authorization': 'Bearer ' + apiKey }
});
const params = {
	"prompt": "Once upon a time",
	"max_tokens": 10
}
client.post('https://api.openai.com/v1/engines/davinci/completions', params)
	.then(result => {
		console.log(params.prompt + result.data.choices[0].text);
	}).catch(err => {
		console.log(err);
	});
//#endregion

//#region openai
async function fetchWiki(query) {
	// if (isEmpty(query)) return 'NO QUESTION!';
	// let response = await mGetRoute('wiki',{question: query});
	// return response;

	if (!query) {
		alert('Please enter a query.');
		return;
	}

	try {
		const response = await fetch(`http://localhost:3000/wiki?query=${encodeURIComponent(query)}`);
		const data = await response.json();
		console.log(data)
		// const resultDiv = document.getElementById('result');
		// resultDiv.innerHTML = `<h2>${data.title}</h2><p>${data.extract}</p>`;
		return data;
	} catch (error) {
		console.error('Error fetching Wikipedia entry:', error);
		alert('Error fetching Wikipedia entry. Please try again later.');
	}
}

async function fetchWiki(keyword) {
	// Encode the keyword for use in the URL
	const encodedKeyword = encodeURIComponent(keyword);

	// Construct the URL for the Wikipedia API query
	const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&titles=${encodedKeyword}`;

	try {
		// Fetch data from Wikipedia API
		const response = await fetch(apiUrl);
		const data = await response.json();

		// Extract the page content
		const pages = data.query.pages;
		const firstPageId = Object.keys(pages)[0]; // Get the first page ID
		const extract = pages[firstPageId].extract; // Extract text content

		// Return a paragraph (first 500 characters) of the extract
		return extract ? extract.substring(0, 500) : 'No information found.';
	} catch (error) {
		console.error('Error fetching data from Wikipedia:', error);
		return 'Error fetching data from Wikipedia.';
	}
}
async function fetchWikiFromProxy(keyword) {
	const proxyUrl = 'http://localhost:3000/wiki';
	const url = `${proxyUrl}?keyword=${encodeURIComponent(keyword)}`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		//console.log(data); // Process the response data as needed
		return Object.values(data.query.pages)[0];
	} catch (error) {
		console.error('Error fetching data from proxy server:', error);
		return null
	}
}

async function fetchAnswer(prompt) {
	//const prompt = document.getElementById('prompt').value.trim();
	if (!prompt) { alert('Please enter a prompt.'); return; }

	try {
		const response = await fetch('/ask', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', },
			body: JSON.stringify({ prompt }),
		});

		if (!response.ok) { throw new Error('Network response was not ok'); }

		const data = await response.json();
		return data;
		//document.getElementById('answer').textContent = data.answer || 'No answer found.';
	} catch (error) {
		console.error('Error fetching answer:', error);
		return 'ERROR!!!'
		//document.getElementById('answer').textContent = 'Error fetching answer. Please try again later.';
	}
}

function nodejs() {
	const { Configuration, OpenAIApi } = require('openai');
	const configuration = new Configuration({ apiKey: process.env.API_KEY, });
	var openai = new OpenAIApi(configuration);
	async function fetchAnswerOpenai(prompt) {
		try {
			const response = await openai.createCompletion({
				model: 'text-davinci-003',
				prompt: prompt,
				max_tokens: 100,
			});
			console.log(response.data.choices[0].text.trim());
		} catch (error) {
			console.error('Error fetching answer:', error);
		}
	}

	app.post('/ask_list_BROKEN', async (req, res) => {
		let word = req.body.word;
		let num = valf(req.body.num, 100);
		if (isString(word)) word = word.toLowerCase(); else return res.json('ERROR');
		console.log('ask_list:', word);
		let key = normalizeString(word)
		let result = lookup(M.lists, [key]);
		if (result) { console.log('FOUND!'); return res.json(result); }
		let prompt = pListOf(word, num);
		console.log('=>openai:', prompt);
		result = await fetchAnswerOpenai(prompt);
		console.log('openai:', result)
		answer = result.message.content;
		if (answer.includes('```')) answer = stringBeforeLast(stringAfter(answer, '\n'), '\n');
		let o = yaml.load(answer);
		o = o[word]; console.log('o', o, typeof o);
		// o = toFlatObject(o);
		// lookupSet(M.lists, [key], o);
		// let y = yaml.dump(M.lists);
		// fs.writeFileSync(listsFile, y, 'utf8');
		res.json(o);
	});
		app.get('/wikipara', async (req, res) => {
		const { keyword } = req.query;
		if (!keyword) {
			return res.status(400).json({ error: 'Keyword parameter is required.' });
		}
		try {
			const encodedKeyword = encodeURIComponent(keyword);
			const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&titles=${encodedKeyword}`;
			const response = await fetch(apiUrl);
			const data = await response.json();
			res.json(data);
		} catch (error) {
			console.error('Error fetching data from Wikipedia:', error);
			res.status(500).json({ error: 'Error fetching data from Wikipedia.' });
		}
	});
	app.get('/fetch_answer_1', async (req, res) => {
		const query = req.query.question;
		if (!query) {
			console.log('!!!!!!!!!!!!')
			return res.status(400).json({ error: 'Question parameter is required' });
		}
		// const url = 'https://api-inference.huggingface.co/models/gpt2';
		const url = 'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2';
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.HuggingFace_token1}`,
			},
			body: JSON.stringify({ inputs: query }),
		};
	
		try {
			const response = await fetch(url, options);
			const data = await response.json();
	
			console.log(response)
			if (response.ok) {
				res.json({ answer: data[0].generated_text });
			} else {
				res.status(response.status).json({ error: data });
			}
		} catch (error) {
			res.status(500).json({ error: 'Error fetching answer from Hugging Face API', details: error.message });
		}
	});
	
	app.post('/ask', async (req, res) => {
		const { prompt } = req.body;
		console.log('ask', 'hello')
		let result = await fetchAnswerOpenai('hello');
		res.json(result); //data.choices[0].text.trim() });
	});
	app.post('/ask2', async (req, res) => {
		const { prompt } = req.body;
		console.log('ask', 'hello')
		let conversationLog = [
			{ role: "system", content: "you are an encouraging chatbot" },
			{ role: "user", content: prompt, }
		];
		const result = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: conversationLog,
		});
		//message.reply(result.data.choices[0].message);
		res.json(result); //data.choices[0].text.trim() });
	});
	app.post('/ask1', async (req, res) => {
		const { prompt } = req.body;
		console.log('ask', prompt)
		try {
			const response = await fetch('https://api.openai.com/v1/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${process.env.API_KEY}`,
				},
				body: JSON.stringify({
					prompt,
					max_tokens: 150,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log(data)
			res.json({ answer: data }); //data.choices[0].text.trim() });
		} catch (error) {
			console.error('Error querying OpenAI:', error.message);
			res.json(error.message); //status(500).json({ error: 'Failed to query OpenAI' });
		}
	});
}
//#endregion

//#region 1.7.24 OMNIFIN

//#region obsolete db stuff
function dboutput(q) {
	let result = dbq(q);
	return output = result.map(({ columns, values }) => {
		return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
	}).join('\n\n');
}
function dbtable(q, dParent) {
	let result = dbq(q)[0];
	let di = { dateof: 'date', sender_name: 'from', sender_owner: 'owner', receiver_name: 'to', receiver_owner: 'owner', description: 'note' };
	let headers = result.columns.map(x => valf(di[x], x));
	let t = mTable(dParent, headers, true);
	for (const rec of result.values) {
		let r = mDom(t, {}, { tag: 'tr' });
		console.log(rec);
		for (const s of rec) {
			mTableCol(r, s)
		}
	}
}
function dbview(q, dParent, fformat) {
	let result = dbq(q)[0];

	let di = { dateof: 'date', sender_name: 'from', sender_owner: 'owner', receiver_name: 'to', receiver_owner: 'owner', description: 'note' };
	let headers = result.columns.map(x => valf(di[x], x));
	let t = mTable(dParent, headers, true);
	for (const rec of result.values) {
		let r = mDom(t, {}, { tag: 'tr' });
		console.log(rec);
		for (const s of rec) {
			mTableCol(r, s)
		}

		//return;
	}

	// return output = result.map(({ columns, values }) => {
	// 	return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
	// }).join('\n\n');
}

function _dbQuery(db, q, dParent) {
	try {
		const result = db.exec(q);
		// console.log('result',result)
		// return result;
		const output = result.map(({ columns, values }) => {
			return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
		}).join('\n\n');
		if (isdef(dParent)) {
			dParent = toElem(dParent);
			mClear(dParent)
			dParent.textContent = output || 'Query executed successfully.';
		}
		return output;
	} catch (error) {
		dParent.textContent = 'Error executing SQL: ' + error.message;
		return null;
	}

}



function menuCommand(dParent, menuKey, key, html, open, close) {
	let cmd = mCommand(dParent, key, html, { open, close });
	let a = iDiv(cmd);
	a.setAttribute('key', `${menuKey}_${key}`);
	a.onclick = onclickMenu;
	cmd.menuKey = menuKey;
	return cmd;
}
function onclickMenu(ev) {
	let keys = evToAttr(ev, 'key');
	let [menuKey, cmdKey] = keys.split('_');
	let menu = UI[menuKey];
	switchToMenu(menu, cmdKey);
}
async function switchToMenu(menu, key) {
	menuCloseCurrent(menu); console.log('switchToMenu')
	Menu = { key }; localStorage.setItem('menu', key);
	await menuOpen(menu, key);
}
async function menuOpen(menu, key, defaultKey = 'settings') {
	let cmd = menu.commands[key]; console.log(cmd)
	if (nundef(cmd)) { console.log('abandon', key); await switchToMainMenu(defaultKey); return; }
	menu.cur = key;
	mClass(iDiv(cmd), 'activeLink'); //console.log('cmd',cmd)
	//if (isdef(mBy('dExtra'))) await updateExtra();
	console.log('HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
	console.log('WIE BITTE???')
	//await menuOpenSql();
	await cmd.open();
}

//#endregion


function sidebarHome() {
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 });
	let gap = 5;
	UI.commands.showSchema = mCommand(d, 'showSchema', 'DB Structure'); mNewline(d, gap);
}


//#region 30.6.24
function playerStatCount(key, n, dParent, styles = {}, opts = {}) {
	//console.log(key)
	let sz = valf(styles.sz, 16);
	addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'center', fz: sz, align: 'center' }, styles);
	let d = mDiv(dParent, styles);
	let o = M.superdi[key];
	if (typeof key == 'function') key(d, { h: sz, hline: sz, w: '100%', fg: 'grey' });
	else if (isFilename(key)) showim2(key, d, { h: sz, hline: sz, w: '100%', fg: 'grey' }, opts);
	else if (isdef(o)) showim2(key, d, { h: sz, hline: sz, w: '100%', fg: 'grey' }, opts);
	else mText(key, d, { h: sz, fz: sz, w: '100%' });
	d.innerHTML += `<span ${isdef(opts.id) ? `id='${opts.id}'` : ''} style="font-weight:bold;color:inherit">${n}</span>`;
	return d;
}
function showim2(imgKey, d, styles = {}, opts = {}) {
	let o = lookup(M.superdi, [imgKey]); //console.log(imgKey,o)
	let src;
	if (isFilename(imgKey)) src = imgKey;
	else if (isdef(o) && isdef(opts.prefer)) src = valf(o[opts.prefer], o.img);
	else if (isdef(o)) src = valf(o.img, o.photo)
	let [w, h] = mSizeSuccession(styles, 40);
	addKeys({ w, h }, styles);

	//console.log(imgKey,src)
	if (nundef(o) && nundef(src)) src = rChoose(M.allImages).path;
	if (isdef(src)) return mDom(d, styles, { tag: 'img', src });

	fz = .8 * h;
	let [family, html] = isdef(o.text) ? ['emoNoto', o.text] : isdef(o.fa) ? ['pictoFa', String.fromCharCode('0x' + o.fa)] : isdef(o.ga) ? ['pictoGame', String.fromCharCode('0x' + o.ga)] : isdef(o.fa6) ? ['fa6', String.fromCharCode('0x' + o.fa6)] : ['algerian', o.friendly];
	addKeys({ family, fz, hline: fz, display: 'inline' }, styles);

	let el = mDom(d, styles, { html }); mCenterCenterFlex(el);

	return el;

	if (isdef(o.text)) el = mDom(d, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	return el;
}

//obsolete!
function showFood(dParent, tokens, w, fz) {
	let dOuter = mDom(dParent); mCenterFlex(dOuter);
	let sz = w / 4;
	let last = arrLast(tokens);
	let ch = tokens.length == 2 && coin() ? '/' : '+';
	for (const t of tokens) {
		wsDrawFoodToken(dOuter, t, sz);

		// if (t != last) {
		// 	//let d1=mDom(dOuter,{h:sz});mCenterCenterFlex(d1);
		// 	mDom(dOuter, { fz,matop:sz/2 }, { html: ch })
		// }
	}

}
function showFoodMist() {

	let img = showim1('../assets/games/wingspan/pie3.svg', df, { w: sz, h: sz }); return;
	let len = tokens.length, i = 0;

	let [sz, szSym, szChar, gap] = [w / 3, w / 3.5, w / 9, 10];
	k
	let src = tokens[0]; if (!src) return;


	let ch = len < 3 && coin() ? '/' : '+';

	let tlist = [{ t: tokens[0], sz: szSym }];
	if (len > 1) { tlist.push({ t: ch, sz: szChar }); tlist.push({ t: tokens[1], sz: szSym }) }
	if (len > 2) { tlist.push({ t: ch, sz: szChar }); tlist.push({ t: tokens[2], sz: szSym }) }
	let [l, y] = [0, 0];
	for (const x of tlist) {
		let d = mDom(df, { w: x.sz, position: 'absolute', x: l, y }); //,bg:rColor()}); 
		//mCenterCenterFlex(d);
		let c = x.t;
		if (c == '+') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c == '/') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c.includes('.')) {
			let img = showim1(c, d, { w: x.sz });
			if (c.includes('mouse')) mStyle(img, { matop: fz / 4 })
		} else {
			let szimg = x.sz * .7;
			let img = showim1('../assets/games/wingspan/pie2.png', d, { w: szimg, h: szimg });//mStyle(img,{round:true})
		}
	}
}
function getOhab() {
	let colors = [];
	let imgs = [];
	colors.push('lightblue'); imgs.push('../assets/games/wingspan/wetland.png');
	colors.push('goldenrod'); imgs.push('../assets/games/wingspan/grassland2.png');
	colors.push('emerald'); imgs.push('../assets/games/wingspan/forest1.png');
	return { colors, imgs };
}
function randomSvg(dParent, sz) {
	let files = {
		seedling: '../assets/img/emo/seedling.png',
		mouse: '../assets/games/wingspan/mouse.svg',
		cherries: '../assets/games/wingspan/fruit.svg',
		grain: '../assets/games/wingspan/wheat.svg',
		fish: '../assets/games/wingspan/fish.svg',
		worm: '../assets/games/wingspan/worm.svg',
		wetland: '../assets/games/wingspan/wetland.png',
		grassland: '../assets/games/wingspan/grassland2.png',
		forest: '../assets/games/wingspan/forest1.png',
	};
	let keys = Object.keys(files);
	mDom(dParent, { w: sz, h: sz }, { tag: 'img', width: sz, height: sz, src: files[rChoose(keys)] }); //'../assets/img/emo/seedling.png'})
	//wsDrawWorm(dParent,{w:sz,h:sz,sz});
}
function wsDrawFoodToken(d, func, sz) {
	let df = mDom(d, { w: sz, h: sz }); //mCenterCenterFlex(df);
	func(df, { w: sz, h: sz, sz });
	return df;
}
function wsDrawSeedling(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let sz = styles.h; console.log(sz)
	let d1 = mDom(d, styles);
	let html = `<img width='${sz}' height='${sz}' style='margin-top:-${sz / 20}px' src='../assets/img/emo/seedling.png' />`;
	d1.innerHTML = html
}
function wsDrawOmni(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = generatePizzaSvg(styles.w, 'red', 'yellow', 'blue', 'orange', 'green');
	d1.innerHTML = html
}
function wsDrawGrain(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
		<svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
			<g transform="matrix(1.9,0,0,1.8,-655,-980)">
				<g transform="matrix(7.70232,0,0,7.70232,-3403,-873.691)">
					<g>
						<g>
							<g transform="matrix(1,0,0,1,487.796,189.11)">
									<path d="M0,-2.293C0.445,-1.498 1.102,-0.729 1.282,-0.522C1.462,-0.316 3.41,-0.035 4.113,0.01C3.948,-0.403 3.671,-0.749 3.079,-1.281C2.586,-1.724 2.109,-1.963 1.47,-2.084C1.11,-2.152 0.279,-2.303 0,-2.293" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(0.807192,0.590289,0.590289,-0.807192,489.51,186.325)">
									<path d="M0.599,0.015C0.869,0.113 1.467,0.126 1.68,0.173C1.017,0.749 0.85,1.614 0.599,1.67C0.348,1.727 -0.747,1.767 -1.127,1.674C-1.066,1.536 -0.423,0.405 0.599,0.015" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(1,0,0,1,493.462,188.018)">
									<path d="M0,-0.85C-0.107,-1.338 -1.235,-2.168 -1.841,-2.459C-1.935,-2.155 -2.079,-1.594 -2.053,-1.056C-2.024,-0.467 -1.76,0.211 -1.407,0.615C-1.055,1.019 -0.183,1.515 0.13,1.609C0.128,1.597 0.126,1.586 0.124,1.574C-0.042,0.499 0.107,-0.361 0,-0.85" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(1,0,0,1,493.524,194.883)">
									<path d="M0,-2.513C-1.031,-2.522 -1.653,-2.448 -2.565,-2.524C-2.161,-1.814 -1.315,-0.599 -0.557,-0.253C0.201,0.094 1.4,-0.3 2.482,-0.291C2.697,-0.289 3.439,-0.2 3.657,-0.152C3.551,-0.509 3.087,-1.833 2.6,-2.147C1.889,-2.607 1.577,-2.5 0,-2.513" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(1,0,0,1,496.22,189.606)">
									<path d="M0,-0.012C-0.375,-1.259 -1.609,-2.115 -2.317,-2.551C-2.342,-1.879 -2.343,-1.374 -2.21,-0.514C-2.049,0.535 -1.946,0.574 -1.451,1.053C-1.175,1.319 -0.283,2.43 0.145,2.539C0.145,2.539 0.144,0.467 0,-0.012" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(-0.506442,0.862274,0.862274,0.506442,497.305,197.132)">
									<path d="M-1.454,-1.812C-0.793,-3.066 -0.232,-3.44 0.202,-4.508C0.816,-2.36 0.396,0.388 -1.454,1.136C-1.693,1.232 -0.925,0.982 -1.454,1.136C-1.409,0.584 -2.027,-0.726 -1.454,-1.812" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(1,0,0,1,496.942,193.86)">
									<path d="M0,-2.164C-0.197,-0.955 0.514,0.481 0.88,0.901C1.246,1.32 1.926,2.192 2.218,2.336C3.808,0.963 1.265,-2.639 0.213,-3.845C0.017,-4.069 -0.193,-4.287 -0.415,-4.5C-0.415,-4.5 -0.002,-3.337 0,-2.164" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(0.658061,-0.752964,-0.752964,-0.658061,489.682,185.285)">
									<path d="M-1.083,-0.492C-0.929,-0.19 -0.7,0.149 -0.362,0.372C-0.023,0.597 -1.083,2.385 -1.083,2.385C-1.083,2.385 -1.281,0.976 -1.678,0.238C-1.494,0.048 -1.282,-0.197 -1.083,-0.492" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(1,0,0,1,493.645,189.424)">
									<path d="M0,2.503C0.135,2.509 1.42,2.539 1.55,2.55C1.235,2.005 0.612,1.245 0.031,0.771C-0.532,0.313 -1.45,0.27 -2.369,0.204C-2.97,0.161 -3.964,-0.039 -4.563,-0.047C-4.309,0.6 -3.575,1.878 -3.04,2.181C-2.504,2.485 -1.165,2.457 0,2.503" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(1,0,0,1,498.162,197.672)">
									<path d="M0,-0.974C0.138,-0.91 0.295,-0.809 0.427,-0.701C0.564,-0.594 0.684,-0.467 0.803,-0.344C0.906,-0.218 0.995,-0.088 1.06,0.052C1.119,0.181 1.236,0.44 1.251,0.547L2.018,-0.089C1.867,-0.346 1.481,-0.74 1.316,-0.866C0.983,-1.134 0.56,-1.408 0.317,-1.521L0,-0.974Z" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
							</g>
						</g>
					</g>
				</g>
			</g>
		</svg>
    `;
	d1.innerHTML = html
}
function wsDrawMouse(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
		<svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
				<g transform="matrix(1.3,0,0,1.5,-680,-490)">
						<g transform="matrix(9.09451,0,0,9.09451,670.98,392.954)">
								<g id="ws-5">
										<path id="mouse" d="M0,0.136C-0.705,-0.412 -2.127,-0.236 -2.867,-0.095C-2.803,-2.905 -7.442,-5.024 -10.299,-2.45L-11.797,-2.233C-11.131,-3.613 -12.9,-3.994 -13.312,-2.346L-15.426,-0.406C-16.451,0.4 -16.105,1.031 -15.189,1.031C-14.876,1.031 -11.897,1.617 -11.472,2.094C-11.535,2.206 -11.852,2.384 -11.773,2.995L-5.978,3.179C-4.286,2.679 -3.368,1.772 -3.023,0.768C-2.195,0.57 -0.921,0.449 -0.497,0.777C-0.434,0.826 -0.369,0.899 -0.369,1.063C-0.369,1.549 -0.767,1.699 -1.744,1.949C-2.445,2.129 -3.24,2.332 -3.749,2.912C-4.156,3.376 -4.309,3.827 -4.202,4.25C-4.05,4.859 -3.429,5.107 -3.359,5.134C-3.312,5.152 -3.264,5.16 -3.216,5.16C-3.052,5.16 -2.897,5.059 -2.837,4.896C-2.758,4.687 -2.864,4.452 -3.074,4.374C-3.131,4.352 -3.371,4.228 -3.415,4.053C-3.452,3.907 -3.354,3.692 -3.139,3.447C-2.796,3.057 -2.159,2.893 -1.542,2.735C-0.658,2.509 0.442,2.227 0.442,1.063C0.442,0.681 0.289,0.36 0,0.136" style="fill:rgb(116,100,91);fill-rule:nonzero;"/>
								</g>
						</g>
				</g>
		</svg>
    `;
	d1.innerHTML = html
}
function wsDrawCherries(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
		<svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
				<g transform="matrix(1.6,0,0,1.6,-540,-540)">
						<g transform="matrix(8.59167,0,0,8.59167,432.85,422.626)">
								<g>
										<path d="M0,-5.356C-0.427,-5.356 -0.825,-5.247 -1.184,-5.07L-1.487,-6.86C-1.18,-7.11 -0.839,-7.331 -0.47,-7.508C0.341,-7.901 1.273,-8.154 2.148,-8.241L2.17,-8.243C2.227,-8.249 2.283,-8.262 2.338,-8.282C2.695,-8.415 2.877,-8.811 2.745,-9.168C2.612,-9.524 2.216,-9.706 1.859,-9.574C0.872,-9.208 -0.018,-8.809 -0.897,-8.288C-1.327,-8.022 -1.751,-7.73 -2.127,-7.365C-2.478,-7.028 -2.813,-6.676 -3.154,-6.309C-3.37,-6.078 -3.566,-5.826 -3.752,-5.566C-3.756,-5.566 -3.759,-5.568 -3.763,-5.568L-5.106,-5.582C-5.308,-6.864 -6.41,-7.847 -7.749,-7.847C-9.233,-7.847 -10.435,-6.645 -10.435,-5.162C-10.435,-3.679 -9.233,-2.476 -7.749,-2.476C-6.304,-2.476 -5.134,-3.62 -5.074,-5.051L-4.184,-4.886C-4.394,-4.515 -4.579,-4.131 -4.719,-3.739C-4.942,-3.129 -5.117,-2.511 -5.27,-1.883C-6.879,-1.753 -8.148,-0.421 -8.148,1.221C-8.148,2.949 -6.748,4.35 -5.019,4.35C-3.291,4.35 -1.89,2.949 -1.89,1.221C-1.89,-0.297 -2.973,-1.562 -4.408,-1.846C-4.278,-2.39 -4.122,-2.933 -3.938,-3.457C-3.647,-4.336 -3.233,-5.136 -2.609,-5.816C-2.452,-5.994 -2.279,-6.162 -2.1,-6.327L-1.724,-4.714C-2.307,-4.221 -2.686,-3.493 -2.686,-2.67C-2.686,-1.187 -1.483,0.016 0,0.016C1.484,0.016 2.686,-1.187 2.686,-2.67C2.686,-4.153 1.484,-5.356 0,-5.356" style="fill:rgb(152,21,49);fill-rule:nonzero;"/>
								</g>
						</g>
				</g>
		</svg>
    `;
	d1.innerHTML = html
}
function wsDrawFish(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
		<svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
			<g transform="matrix(1.28,0,0,1.28,-924,-406)">
				<g transform="matrix(-10.1636,-1.24469e-15,1.24469e-15,-10.1636,756.948,402.109)">
					<g>
						<path d="M0,0.092C0,-0.238 0.267,-0.506 0.598,-0.506C0.927,-0.506 1.195,-0.238 1.195,0.092C1.195,0.422 0.927,0.69 0.598,0.69C0.267,0.69 0,0.422 0,0.092M-11.442,-1.15L-11.442,-1.088C-11.442,-1.037 -11.42,-0.992 -11.408,-0.945C-11.275,-0.465 -10.779,-0.016 -10.771,0.305C-10.756,0.912 -11.504,1.256 -11.586,1.625C-11.586,1.625 -11.667,1.904 -11.559,2.025C-11.499,2.092 -11.42,2.102 -11.337,2.094C-9.921,1.954 -8.259,1.047 -7.839,1.24C-7.419,1.433 -5.796,3.438 -2.936,3.63C-1.327,3.738 1.139,3.412 2.135,2.096C2.368,1.819 2.579,1.517 2.783,1.224C2.876,1.09 2.97,0.957 3.065,0.825C3.225,0.596 3.097,0.387 3.056,0.337C2.902,0.146 2.75,-0.056 2.602,-0.253C2.27,-0.693 1.927,-1.148 1.529,-1.524C-0.167,-3.129 -2.469,-3.646 -4.806,-2.897C-5.842,-2.565 -7.774,-0.907 -7.775,-0.907C-8.289,-0.579 -10.235,-1.284 -11.139,-1.405C-11.214,-1.415 -11.286,-1.421 -11.346,-1.37C-11.406,-1.32 -11.442,-1.237 -11.442,-1.15" style="fill:rgb(0,121,159);fill-rule:nonzero;"/>
					</g>
				</g>
			</g>
		</svg>
    `;
	d1.innerHTML = html
}
function wsDrawWorm(d, styles = {}) {
	[styles.w, styles.h] = mSizeSuccession(styles);
	let d1 = mDom(d, styles);
	let html = `
    <svg width="${styles.w}" height="${styles.h}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(1.8,0,0,1.9,-621,-280)">
            <g transform="matrix(7.14802,0,0,7.14802,-2977.16,-1174.38)">
                <g>
                    <g>
                        <g transform="matrix(1,0,0,1,467.653,195.772)">
                            <path d="M0,-8.535C-0.018,-8.351 -0.038,-8.047 -0.036,-7.798C-0.033,-7.536 -0.021,-7.275 0.007,-7.021C0.06,-6.511 0.179,-6.031 0.35,-5.619C0.432,-5.41 0.538,-5.226 0.648,-5.059C0.75,-4.905 0.789,-4.895 0.869,-4.838C1.013,-4.757 1.318,-4.665 1.782,-4.653C2.239,-4.635 2.789,-4.679 3.406,-4.729C3.718,-4.754 4.049,-4.779 4.42,-4.788C4.792,-4.794 5.204,-4.792 5.732,-4.686C6.694,-4.473 7.445,-4.057 8.093,-3.608C8.416,-3.38 8.716,-3.139 8.999,-2.886C9.14,-2.758 9.278,-2.629 9.413,-2.493C9.556,-2.348 9.664,-2.238 9.84,-2.031L9.993,-1.85C10.704,-1.01 10.599,0.248 9.758,0.959C8.918,1.67 7.66,1.564 6.95,0.724C6.866,0.626 6.79,0.513 6.729,0.404C6.711,0.373 6.616,0.251 6.548,0.17C6.473,0.08 6.394,-0.009 6.313,-0.096C6.152,-0.269 5.983,-0.43 5.815,-0.575C5.479,-0.863 5.134,-1.063 4.895,-1.148C4.821,-1.18 4.615,-1.217 4.37,-1.231C4.125,-1.248 3.839,-1.252 3.535,-1.254C2.922,-1.259 2.237,-1.25 1.464,-1.348C0.709,-1.447 -0.233,-1.666 -1.075,-2.345C-1.479,-2.669 -1.84,-3.145 -2.029,-3.534C-2.22,-3.903 -2.374,-4.283 -2.48,-4.66C-2.701,-5.417 -2.79,-6.164 -2.792,-6.886C-2.795,-7.247 -2.774,-7.603 -2.74,-7.957C-2.701,-8.323 -2.657,-8.633 -2.563,-9.056C-2.408,-9.76 -1.711,-10.205 -1.007,-10.049C-0.355,-9.906 0.075,-9.297 0.011,-8.649L0,-8.535Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                        <g transform="matrix(-0.516885,-0.856055,-0.856055,0.516885,474.654,198.339)">
                            <path d="M-0.369,-0.653C-0.561,-0.652 -0.716,-0.461 -0.716,-0.223C-0.716,0.015 -0.561,0.208 -0.369,0.208C-0.177,0.208 -0.021,0.016 -0.021,-0.223C-0.021,-0.46 -0.177,-0.653 -0.369,-0.653" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                        <g transform="matrix(1,0,0,1,474.892,196.692)">
                            <path d="M0,1.752C0.014,1.561 0.041,1.419 0.072,1.26C0.114,1.108 0.14,0.954 0.209,0.811C0.272,0.66 0.356,0.52 0.439,0.401C0.515,0.27 0.593,0.149 0.661,0L1.046,0.377C0.917,0.433 0.806,0.524 0.705,0.613C0.614,0.715 0.525,0.806 0.489,0.922C0.451,1.042 0.417,1.168 0.427,1.297C0.431,1.42 0.458,1.564 0.518,1.653L0,1.752Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                        <g transform="matrix(0.516885,0.856055,0.856055,-0.516885,479.321,195.111)">
                            <path d="M0.369,-0.208C0.561,-0.208 0.716,-0.015 0.716,0.222C0.716,0.461 0.56,0.653 0.369,0.653C0.176,0.653 0.021,0.46 0.021,0.222C0.021,-0.016 0.177,-0.208 0.369,-0.208" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                        <g transform="matrix(1,0,0,1,479.355,194.874)">
                            <path d="M0,0.679C-0.051,0.585 -0.166,0.495 -0.273,0.434C-0.382,0.364 -0.51,0.336 -0.633,0.314C-0.753,0.293 -0.874,0.329 -1.008,0.362C-1.134,0.41 -1.266,0.465 -1.375,0.554L-1.53,0.038C-1.367,0.047 -1.223,0.034 -1.072,0.028C-0.927,0.01 -0.764,0 -0.602,0.015C-0.443,0.02 -0.295,0.069 -0.14,0.102C0.015,0.148 0.152,0.191 0.329,0.267L0,0.679Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
    `;
	d1.innerHTML = html

}
function showCardWingspanPortrait(o, d, h) {
	let item = { o, key: o.key };
	let fa = h / 250;
	let w = 170 * fa;
	console.log(h, w, fa)
	let card = cBlank(d, { h, w, border: 'silver' }); //return;
	let dCard = iDiv(card);
	addKeys(card, item);

	let [rounding, fz, gap] = [card.rounding, 8 * fa, w / 36];
	let wtop = w / 3.5;
	let htop = wtop * 1.1;
	let dlt = mDom(dCard, { w: wtop, h: htop, bg: '#ccc' }); mPlace(dlt, 'tl'); dlt.style.borderTopLeftRadius = dlt.style.borderBottomRightRadius = `${rounding}px`; mCenterCenterFlex(dlt);


	showHabitat(dlt, o.ohabitat, 16 * fa);
	mLinebreak(dlt, 3 * fa);

	//console.log(o.foodTokens); //return item;
	showFood(dlt, o.foodTokens, wtop, fz); return item;

	let dtitle = mDom(dCard, { paleft: gap, wmax: wtop * 1.5 }); mPlace(dtitle, 'tl', wtop, gap)
	mDom(dtitle, { fz: fz * 1.2, weight: 'bold' }, { html: fromNormalized(o.friendly) });
	mDom(dtitle, { fz, 'font-style': 'italic' }, { html: o.species });

	let [szPic, yPic] = [h / 2, wtop + gap]
	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', w / 50, yPic);

	let szPlatz = h / 30;
	let dPlaetze = item.dPlaetze = showPlaetze(dCard, o.ooffsprings.num, szPlatz);
	mPlace(dPlaetze, 'tl', (w - szPic) / 2, wtop + szPlatz);

	let power = 'WHEN ACTIVATED: All players gain 1 food from supply.';
	let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: wtop + szPic + szPlatz, w100: true, bg: 'sienna', fg: 'white', box: true }, { html: power })
	item.power = dbrown.innerHTML;

	let lifespan = item.lifespan = calcLifespan(o.lifespan);
	let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'bl', gap);

	let size = item.size = calcSize(o.size);
	let dsize = mDom(dCard, { fz, display: 'inline' }, { html: size.text })
	mPlace(dsize, 'br', gap);

	let value = item.value = rChoose(range(1, 3)) * o.foodTokens.length;
	let dval = mDom(dCard, { fz: fz * 1.8, weight: 'bold' }, { html: value }); mPlace(dval, 'tr', 2 * gap, gap)

	return item;
}
function showInfoCard(key, d) {
	let o = getDetailedSuperdi(key);
	let sz = 400;
	let [yTitle, yPic, szPic] = [8, sz / 5, sz / 2];
	let [yLifespan, yBrown, hTop] = [yPic + szPic, yPic + szPic + 22, yPic];
	let card = cBlank(d, { h: sz, border: 'dimgray' });
	let dCard = iDiv(card);
	let d1 = showim1(key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tc', 0, yPic);
	let title = fromNormalized(o.friendly);
	let dtitle = mDom(dCard, { display: 'inline', weight: 'bold' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle);
	let lifespan = calcLifespan(o.lifespan);
	let dlifespan = mDom(dCard, { display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'tr', 40, yLifespan);
	let dbrown = mDom(dCard, { matop: yBrown, w100: true, bg: 'sienna', fg: 'white', padding: 10, box: true }, { html: 'WHEN ACTIVATED: All players gain 1 food from supply.' })
	let foodtype = extractFoodType(o.food);
	let difood = { omnivorous: 'pot_of_food', carnivorous: 'poultry_leg', herbivorous: 'seedling', insectivorous: 'ant' }
	let dfood = mDom(dCard);
	showim1(difood[foodtype], dfood, { sz: 30 });
	mPlace(dfood, 'tl', 10, 0)
	let weight = calcNumericInfo(o.weight, { kg: 1000, g: 1, mg: .001 }, 'kg');
	let size = calcNumericInfo(o.size, { cm: .01, centimeter: .01, mm: .001, millimeter: .001, meter: 1, m: 1 }, 'm');
	let offs = calcOffsprings(o.offsprings);
	o.foodType = foodtype;
	o.difood = difood;
	o.weight = weight;
	o.size = size;
	o.offsprings = offs;
	addKeys(card, o)
	return o;
}


function wsFromCardInfo(s, d, sz) {
	let [key, valueFactor, power, colorPower, sym, colorSym, op] = s.split('@');
	power = wsFromNormalized(power); //console.log('power',power)
	power = stringBefore(power, ':').toUpperCase() + ':' + stringAfter(power, ':');
	return wsShowCard(key, d, sz, Number(valueFactor), power, colorPower, sym, colorSym, op);
}
function wsShowCard(key, d, fa, valueFactor, power, colorPower, sym, colorSym, op) {
	let o = getDetailedSuperdi(key);
	let item = jsCopy(o);
	let [w, h, sztop, sz, gap, fz] = [340, 500, 100, 30, 8, 16].map(x => x * fa);

	let [card, dCard] = wsCard(d, w, h);
	let dtop = wsTopLeft(dCard, sztop, card.rounding);//mStyle(dtop,{h:200})
	addKeys(card, item);

	let bg = item.colorPower = valf(colorPower, rChoose(['white', 'sienna', 'pink', 'lightblue']));
	let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
	let fg = item.colorSym = valf(colorSym, rChoose(palette)); //console.log(palette)
	sym = item.abstract = valf(sym, getAbstractSymbol([2, 4, 8, 23, 26]));
	power = valf(power, 'WHEN ACTIVATED: All players gain 1 food from supply.');
	valueFactor = item.valueFactor = valf(valueFactor, rChoose(range(1, 3)));
	let value = item.value = valueFactor * (item.op == '+' ? 1 : o.foodTokens.length);

	//o.habTokens.push('wetland');
	wsHabitat(o.habTokens, dtop, sz * 1.1); mLinebreak(dtop, sz / 5);
	wsFood(o.foodTokens, op, dtop, sz * .8);
	wsTitle(o, dCard, sztop, fz, gap);

	let [szPic, yPic] = [h / 2, sztop + gap]
	let d1 = showim2(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', gap, yPic);

	let leftBorderOfPic = w - (szPic + gap);
	let dleft = mDom(dCard, { w: leftBorderOfPic, h: szPic }); mPlace(dleft, 'tl', gap / 2, sztop + gap);
	mCenterCenterFlex(dleft);

	let dval = mDom(dleft, { fg, w: sz * 1.2, align: 'center', fz: fz * 1.8, weight: 'bold' }, { html: value });
	// mPlace(dval, 'tl', sztop/2-gap,sztop+gap); //(w-szPic)/2-3*gap, sztop+gap); //mPlace(dval, 'tr', 2 * gap, gap)
	mLinebreak(dleft, 2 * gap)

	let szSym = sz * 1.5;
	let a = showim2(sym, dleft, { w: szSym, h: szSym, fg });
	// mPlace(a,'tl',sztop/2-gap,sztop*2)
	mLinebreak(dleft, 3 * gap)

	//let szPlatz = h / 30; //o.ooffsprings.num =1;
	let dPlaetze = item.live.dPlaetze = showPlaetze(dleft, o.ooffsprings.num, gap * 2); //szPlatz);
	//mPlace(dPlaetze, 'cl', (w - szPic) / 2 - 3 * gap, 5 * gap); //2*gap,gap); //(w - szPic) / 2,0);//, sztop*2); // + szPlatz);

	let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + gap * 3, w100: true, bg, fg: 'contrast', box: true }, { html: power })
	item.power = dbrown.innerHTML;

	let dinfo = mDom(dCard, { fz, hpadding: gap, box: true, w100: true });
	mPlace(dinfo, 'bl'); mFlexLine(dinfo, 'space-between');
	mDom(dinfo, {}, { html: o.class });
	mDom(dinfo, {}, { html: o.olifespan.text });
	mDom(dinfo, {}, { html: o.osize.text });
	// let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: `${o.class.toLowerCase()} ${o.olifespan.text}` })
	// mPlace(dlifespan, 'bl', gap);

	// let dsize = mDom(dCard, { fz, display: 'inline' }, { html: o.osize.text })
	// mPlace(dsize, 'br', gap);

	// let dclass = mDom(dCard, { fz, display: 'inline' }, { html: o.class });
	// mPlace(dsize, 'br', gap);

	return item;

}
function wsGenerateCardInfo_0(key) {
	let bg = rChoose(['white', 'sienna', 'pink', 'lightblue']);
	let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
	let fg = rChoose(palette);
	sym = getAbstractSymbol([2, 4, 8, 23, 26]);
	power = 'WHEN ACTIVATED: All players gain 1 food from supply.';
	valueFactor = rChoose(range(1, 3));
	op = rChoose(['+', '/']); console.log('op', op)
	return wsFenFromItem({ key, valueFactor, power, colorPower: bg, abstract: sym, colorSym: fg, op });
}
function wsItemFromFen_0(fen) {

	let [key, valueFactor, power, colorPower, sym, colorSym, op] = fen.split('@');
	power = wsFromNormalized(power); //console.log('power',power)
	power = stringBefore(power, ':').toUpperCase() + ':' + stringAfter(power, ':');

	let o = getDetailedSuperdi(key);
	let item = jsCopy(o);
	let bg = item.colorPower = valf(colorPower, rChoose(['white', 'sienna', 'pink', 'lightblue']));
	let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
	let fg = item.colorSym = valf(colorSym, rChoose(palette)); //console.log(palette)
	sym = item.abstract = valf(sym, getAbstractSymbol([2, 4, 8, 23, 26]));
	item.power = valf(power, 'WHEN ACTIVATED: All players gain 1 food from supply.');
	valueFactor = item.valueFactor = valf(valueFactor, rChoose(range(1, 3)));
	let value = item.value = valueFactor * (item.op == '+' ? 1 : o.foodTokens.length);

	return item;
}
async function editDetailsFor(key, anchor) {
	let content = lookup(M.details, [key]); //getDetailedSuperdi(key); let content = getPresentableDetails(details); //console.log(di)
	let result = await mGather(anchor, {}, { content, type: 'multiText', title: M.superdi[key].friendly });
	if (!result) return;
	let res = await updateDetails(result, key);
}

function wsFromCardInfo(s, d, sz) {
	let [key, valueFactor, power, colorPower, sym, colorSym, op] = s.split('@');
	power = wsFromNormalized(power); //console.log('power',power)
	power = stringBefore(power, ':').toUpperCase() + ':' + stringAfter(power, ':');
	return wsShowCard(key, d, sz, Number(valueFactor), power, colorPower, sym, colorSym, op);
}
function wsShowCard(key, d, fa, valueFactor, power, colorPower, sym, colorSym, op) {
	let o = getDetailedSuperdi(key);
	let item = jsCopy(o);
	let [w, h, sztop, sz, gap, fz] = [340, 500, 100, 30, 8, 16].map(x => x * fa);

	let [card, dCard] = wsCard(d, w, h);
	let dtop = wsTopLeft(dCard, sztop, card.rounding);//mStyle(dtop,{h:200})
	addKeys(card, item);

	let bg = item.colorPower = valf(colorPower, rChoose(['white', 'sienna', 'pink', 'lightblue']));
	let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
	let fg = item.colorSym = valf(colorSym, rChoose(palette)); //console.log(palette)
	sym = item.abstract = valf(sym, getAbstractSymbol([2, 4, 8, 23, 26]));
	power = valf(power, 'WHEN ACTIVATED: All players gain 1 food from supply.');
	valueFactor = item.valueFactor = valf(valueFactor, rChoose(range(1, 3)));
	let value = item.value = valueFactor * (item.op == '+' ? 1 : o.foodTokens.length);

	//o.habTokens.push('wetland');
	wsHabitat(o.habTokens, dtop, sz * 1.1); mLinebreak(dtop, sz / 5);
	wsFood(o.foodTokens, op, dtop, sz * .8);
	wsTitle(o, dCard, sztop, fz, gap);

	let [szPic, yPic] = [h / 2, sztop + gap]
	let d1 = showim2(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', gap, yPic);

	let leftBorderOfPic = w - (szPic + gap);
	let dleft = mDom(dCard, { w: leftBorderOfPic, h: szPic }); mPlace(dleft, 'tl', gap / 2, sztop + gap);
	mCenterCenterFlex(dleft);

	let dval = mDom(dleft, { fg, w: sz * 1.2, align: 'center', fz: fz * 1.8, weight: 'bold' }, { html: value });
	// mPlace(dval, 'tl', sztop/2-gap,sztop+gap); //(w-szPic)/2-3*gap, sztop+gap); //mPlace(dval, 'tr', 2 * gap, gap)
	mLinebreak(dleft, 2 * gap)

	let szSym = sz * 1.5;
	let a = showim2(sym, dleft, { w: szSym, h: szSym, fg });
	// mPlace(a,'tl',sztop/2-gap,sztop*2)
	mLinebreak(dleft, 3 * gap)

	//let szPlatz = h / 30; //o.ooffsprings.num =1;
	let dPlaetze = item.live.dPlaetze = showPlaetze(dleft, o.ooffsprings.num, gap * 2); //szPlatz);
	//mPlace(dPlaetze, 'cl', (w - szPic) / 2 - 3 * gap, 5 * gap); //2*gap,gap); //(w - szPic) / 2,0);//, sztop*2); // + szPlatz);

	let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + gap * 3, w100: true, bg, fg: 'contrast', box: true }, { html: power })
	item.power = dbrown.innerHTML;

	let dinfo = mDom(dCard, { fz, hpadding: gap, box: true, w100: true });
	mPlace(dinfo, 'bl'); mFlexLine(dinfo, 'space-between');
	mDom(dinfo, {}, { html: o.class });
	mDom(dinfo, {}, { html: o.olifespan.text });
	mDom(dinfo, {}, { html: o.osize.text });
	// let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: `${o.class.toLowerCase()} ${o.olifespan.text}` })
	// mPlace(dlifespan, 'bl', gap);

	// let dsize = mDom(dCard, { fz, display: 'inline' }, { html: o.osize.text })
	// mPlace(dsize, 'br', gap);

	// let dclass = mDom(dCard, { fz, display: 'inline' }, { html: o.class });
	// mPlace(dsize, 'br', gap);

	return item;

}

//#region 25.6.24
function wsFromCardInfo(s, d, sz) {
	let [key, valueFactor, power, colorPower, sym, colorSym, op] = s.split('@');
	power = wsFromNormalized(power); //console.log('power',power)
	power = stringBefore(power, ':').toUpperCase() + ':' + stringAfter(power, ':');
	return wsShowCard(key, d, sz, Number(valueFactor), power, colorPower, sym, colorSym, op);
}
function wsShowCard(key, d, fa, valueFactor, power, colorPower, sym, colorSym, op) {
	let o = getDetailedSuperdi(key);
	let item = jsCopy(o);
	let [w, h, sztop, sz, gap, fz] = [340, 500, 100, 30, 8, 16].map(x => x * fa);

	let [card, dCard] = wsCard(d, w, h);
	let dtop = wsTopLeft(dCard, sztop, card.rounding);//mStyle(dtop,{h:200})
	addKeys(card, item);

	let bg = item.colorPower = valf(colorPower, rChoose(['white', 'sienna', 'pink', 'lightblue']));
	let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
	let fg = item.colorSym = valf(colorSym, rChoose(palette)); //console.log(palette)
	sym = item.abstract = valf(sym, getAbstractSymbol([2, 4, 8, 23, 26]));
	power = valf(power, 'WHEN ACTIVATED: All players gain 1 food from supply.');
	valueFactor = item.valueFactor = valf(valueFactor, rChoose(range(1, 3)));
	let value = item.value = valueFactor * (item.op == '+' ? 1 : o.foodTokens.length);

	//o.habTokens.push('wetland');
	wsHabitat(o.habTokens, dtop, sz * 1.1); mLinebreak(dtop, sz / 5);
	wsFood(o.foodTokens, op, dtop, sz * .8);
	wsTitle(o, dCard, sztop, fz, gap);

	let [szPic, yPic] = [h / 2, sztop + gap]
	let d1 = showim2(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', gap, yPic);

	let leftBorderOfPic = w - (szPic + gap);
	let dleft = mDom(dCard, { w: leftBorderOfPic, h: szPic }); mPlace(dleft, 'tl', gap / 2, sztop + gap);
	mCenterCenterFlex(dleft);

	let dval = mDom(dleft, { fg, w: sz * 1.2, align: 'center', fz: fz * 1.8, weight: 'bold' }, { html: value });
	// mPlace(dval, 'tl', sztop/2-gap,sztop+gap); //(w-szPic)/2-3*gap, sztop+gap); //mPlace(dval, 'tr', 2 * gap, gap)
	mLinebreak(dleft, 2 * gap)

	let szSym = sz * 1.5;
	let a = showim2(sym, dleft, { w: szSym, h: szSym, fg });
	// mPlace(a,'tl',sztop/2-gap,sztop*2)
	mLinebreak(dleft, 3 * gap)

	//let szPlatz = h / 30; //o.ooffsprings.num =1;
	let dPlaetze = item.live.dPlaetze = showPlaetze(dleft, o.ooffsprings.num, gap * 2); //szPlatz);
	//mPlace(dPlaetze, 'cl', (w - szPic) / 2 - 3 * gap, 5 * gap); //2*gap,gap); //(w - szPic) / 2,0);//, sztop*2); // + szPlatz);

	let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + gap * 3, w100: true, bg, fg: 'contrast', box: true }, { html: power })
	item.power = dbrown.innerHTML;

	let dinfo = mDom(dCard, { fz, hpadding: gap, box: true, w100: true });
	mPlace(dinfo, 'bl'); mFlexLine(dinfo, 'space-between');
	mDom(dinfo, {}, { html: o.class });
	mDom(dinfo, {}, { html: o.olifespan.text });
	mDom(dinfo, {}, { html: o.osize.text });
	// let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: `${o.class.toLowerCase()} ${o.olifespan.text}` })
	// mPlace(dlifespan, 'bl', gap);

	// let dsize = mDom(dCard, { fz, display: 'inline' }, { html: o.osize.text })
	// mPlace(dsize, 'br', gap);

	// let dclass = mDom(dCard, { fz, display: 'inline' }, { html: o.class });
	// mPlace(dsize, 'br', gap);

	return item;

}


//#region 23.6.24
async function test151_card() { //showCard
	await prelims();
	let key = ['arctic_fox'];
	let o = getDetailedSuperdi(key);
	let item = jsCopy(o);

	let d = clearFlex();
	let fa = 1;
	let [w, h, sztop, sz, gap, fz] = [340, 500, 100, 30, 8, 16].map(x => x * fa);

	let [card, dCard] = wsCard(d, w, h);
	let dtop = wsTopLeft(dCard, sztop, card.rounding);//mStyle(dtop,{h:200})
	addKeys(card, item);

	//o.habTokens.push('wetland');
	wsHabitat(o.habTokens, dtop, sz * 1.1); mLinebreak(dtop, sz / 5);
	wsFood(o.foodTokens, dtop, sz * .8);
	wsTitle(o, dCard, sztop, fz, gap);

	let value = item.value = rChoose(range(1, 3)) * o.foodTokens.length;
	let dval = mDom(dCard, { fz: fz * 1.8, weight: 'bold' }, { html: value });
	mPlace(dval, 'tl', 2 * gap, szTop + gap); //mPlace(dval, 'tr', 2 * gap, gap)

	let [szPic, yPic] = [h / 2, sztop + gap]
	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', gap, yPic);

	//let symbol=
	let szPlatz = h / 30; o.ooffsprings.num = 60000;
	let dPlaetze = item.live.dPlaetze = showPlaetze(dCard, o.ooffsprings.num, gap * 2); //szPlatz);
	mPlace(dPlaetze, 'cl', (w - szPic) / 2 - 3 * gap, 5 * gap); //2*gap,gap); //(w - szPic) / 2,0);//, sztop*2); // + szPlatz);

	let power = 'WHEN ACTIVATED: All players gain 1 food from supply.';
	let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + szPlatz, w100: true, bg: 'sienna', fg: 'white', box: true }, { html: power })
	item.power = dbrown.innerHTML;

	let dinfo = mDom(dCard, { fz, hpadding: gap, box: true, w100: true });
	mPlace(dinfo, 'bl'); mFlexLine(dinfo, 'space-between');
	mDom(dinfo, {}, { html: o.class });
	mDom(dinfo, {}, { html: o.olifespan.text });
	mDom(dinfo, {}, { html: o.osize.text });
	// let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: `${o.class.toLowerCase()} ${o.olifespan.text}` })
	// mPlace(dlifespan, 'bl', gap);

	// let dsize = mDom(dCard, { fz, display: 'inline' }, { html: o.osize.text })
	// mPlace(dsize, 'br', gap);

	// let dclass = mDom(dCard, { fz, display: 'inline' }, { html: o.class });
	// mPlace(dsize, 'br', gap);


	console.log(item)

}
function showHabitat(dParent, ohab, h) {
	for (let i = 0; i < ohab.imgs.length; i++) {
		let c = ohab.colors[i];
		if (c == 'gray') continue;
		let d = showim1(ohab.imgs[i], dParent, { h, round: true, bg: c, 'clip-path': PolyClips.diamond })
		if (i == 2) mStyle(d, { matop: -h }); //-20})
	}
}
function showCardWingspanPortrait(o, d, h) {
	let item = { o, key: o.key };
	let fa = h / 250;
	let w = 170 * fa;
	console.log(h, w, fa)
	let card = cBlank(d, { h, w, border: 'silver' }); //return;
	let dCard = iDiv(card);
	addKeys(card, item);

	let [rounding, fz, gap] = [card.rounding, 8 * fa, w / 36];
	let wtop = w / 3.5;
	let htop = wtop * 1.1;
	let dlt = mDom(dCard, { w: wtop, h: htop, bg: '#ccc' }); mPlace(dlt, 'tl'); dlt.style.borderTopLeftRadius = dlt.style.borderBottomRightRadius = `${rounding}px`; mCenterCenterFlex(dlt);


	showHabitat(dlt, o.ohabitat, 16 * fa);
	mLinebreak(dlt, 3 * fa);

	//console.log(o.foodTokens); //return item;
	showFood(dlt, o.foodTokens, wtop, fz); return item;

	let dtitle = mDom(dCard, { paleft: gap, wmax: wtop * 1.5 }); mPlace(dtitle, 'tl', wtop, gap)
	mDom(dtitle, { fz: fz * 1.2, weight: 'bold' }, { html: fromNormalized(o.friendly) });
	mDom(dtitle, { fz, 'font-style': 'italic' }, { html: o.species });

	let [szPic, yPic] = [h / 2, wtop + gap]
	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', w / 50, yPic);

	let szPlatz = h / 30;
	let dPlaetze = item.dPlaetze = showPlaetze(dCard, o.ooffsprings.num, szPlatz);
	mPlace(dPlaetze, 'tl', (w - szPic) / 2, wtop + szPlatz);

	let power = 'WHEN ACTIVATED: All players gain 1 food from supply.';
	let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: wtop + szPic + szPlatz, w100: true, bg: 'sienna', fg: 'white', box: true }, { html: power })
	item.power = dbrown.innerHTML;

	let lifespan = item.lifespan = calcLifespan(o.lifespan);
	let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'bl', gap);

	let size = item.size = calcSize(o.size);
	let dsize = mDom(dCard, { fz, display: 'inline' }, { html: size.text })
	mPlace(dsize, 'br', gap);

	let value = item.value = rChoose(range(1, 3)) * o.foodTokens.length;
	let dval = mDom(dCard, { fz: fz * 1.8, weight: 'bold' }, { html: value }); mPlace(dval, 'tr', 2 * gap, gap)

	return item;
}
function wsPrintSymbol(dParent, sz, key) {
	let files = {
		cherries: '../assets/games/wingspan/fruit.svg',
		fish: '../assets/games/wingspan/fish.svg',
		forest: '../assets/games/wingspan/forest1.png',
		grain: '../assets/games/wingspan/wheat.svg',
		grassland: '../assets/games/wingspan/grassland2.png',
		mouse: '../assets/games/wingspan/mouse.svg',
		omni: '../assets/games/wingspan/pie3.svg',
		seedling: '../assets/img/emo/seedling.png',
		wetland: '../assets/games/wingspan/wetland.png',
		worm: '../assets/games/wingspan/worm.svg',
	};
	let keys = Object.keys(files);
	// if (key == 'omni') {
	// 	mDom(dParent, { w: sz, h: sz, matop:-sz/1.4 }, { html: generatePizzaSvg(sz, 'red', 'yellow', 'blue', 'orange', 'green') });
	// } else {
	let styles = { w: sz, h: sz, };
	if (['wetland', 'grassland', 'forest'].includes(key)) styles['clip-path'] = PolyClips.diamond;
	if (key == 'wetland') styles.bg = 'lightblue';
	else if (key == 'grassland') styles.bg = 'goldenrod';
	else if (key == 'forest') styles.bg = 'darkgreen';
	mDom(dParent, styles, { tag: 'img', width: sz, height: sz, src: files[valf(key, rChoose(keys))] });
	// }

	//wsDrawWorm(dParent,{w:sz,h:sz,sz});
}

//#region 22.6.24 simple game editor
function getDetailedSuperdi(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o);
	addKeys(M.details[o.friendly], o);
	o.key = key;
	if (isdef(o.lifespan)) o.olifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) {
		[o.foodlist, o.foodtype] = extractFoodAndType(o.food);
		let foodTokens = [];
		if (['berries', 'fruit'].some(x => o.foodlist.includes(x))) foodTokens.push(wsDrawCherries);//'../assets/games/wingspan/fruit.svg');
		if (['fish', 'shrimp', 'squid'].some(x => o.foodlist.includes(x))) foodTokens.push(wsDrawFish); //'../assets/games/wingspan/fish.svg');
		if (['wheat', 'grain', 'crops'].some(x => o.foodlist.includes(x))) foodTokens.push(wsDrawGrain); //'../assets/games/wingspan/wheat.svg');
		if (o.foodtype.startsWith('insect')) foodTokens.push(wsDrawWorm); //'../assets/games/wingspan/worm.svg');
		else if (o.foodtype.startsWith('carni')) foodTokens.push(wsDrawMouse); //'../assets/games/wingspan/mouse.svg');
		else if (o.foodtype.startsWith('omni')) foodTokens.push(wsDrawOmni); //'../assets/games/wingspan/pie2.png'); //'omni');
		else if (o.foodtype.startsWith('herbi')) foodTokens.push(wsDrawSeedling); //'../assets/img/emo/seedling.png');
		o.foodTokens = foodTokens;
	}
	if (isdef(o.offsprings)) o.ooffsprings = calcOffsprings(o.offsprings);
	if (isdef(o.weight)) { o.oweight = calcWeight(o.weight); o.nweight = o.oweight.avg; }
	if (isdef(o.size)) { o.osize = calcSize(o.size); o.nsize = o.osize.avg; }
	if (isdef(o.species)) {
		let x = o.species; o.longSpecies = x; o.species = extractSpecies(x);
	}
	if (isdef(o.habitat)) {
		let text = o.habitat;
		let ohab = o.ohabitat = { text };
		let hlist = ohab.list = extractHabitat(text, ['coastal']);
		let colors = ohab.colors = [];
		let imgs = ohab.imgs = [];
		if (['wetland'].some(x => hlist.includes(x))) { colors.push('lightblue'); imgs.push('../assets/games/wingspan/wetland.png'); }
		if (['dwellings', 'grassland', 'desert'].some(x => hlist.includes(x))) { colors.push('goldenrod'); imgs.push('../assets/games/wingspan/grassland2.png'); }
		if (['forest', 'mountain', 'ice'].some(x => hlist.includes(x))) { colors.push('emerald'); imgs.push('../assets/games/wingspan/forest1.png'); }
	}
	let colors = ['turquoise', 'bluegreen', 'teal', 'brown', 'gray', 'green', 'violet', 'blue', 'black', 'yellow', 'white', 'lavender', 'orange', 'buff', 'red', 'pink', 'golden', 'cream', 'grey', 'sunny', 'beige'];
	if (isdef(o.color)) o.colors = extractColors(o.color, colors);
	o = sortDictionary(o);
	return o;
}
function showFood(dParent, tokens, w, fz) {
	let df = mDom(dParent); mCenterCenterFlex(df);
	let len = tokens.length;
	let ch = len < 3 && coin() ? '/' : '+';
	let [szSym, szChar] = [w / 3.5, w / 9];
	let tlist = [{ t: tokens[0], sz: szSym }];
	if (len > 1) { tlist.push({ t: ch, sz: szChar }); tlist.push({ t: tokens[1], sz: szSym }) }
	if (len > 2) { tlist.push({ t: ch, sz: szChar }); tlist.push({ t: tokens[2], sz: szSym }) }
	for (const x of tlist) {
		let d = mDom(df, { w: x.sz }); //,bg:rColor()}); 
		mCenterCenterFlex(d);
		let c = x.t;
		if (c == '+') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c == '/') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c.includes('.')) {
			let img = showim1(c, d, { w: x.sz });
			if (c.includes('mouse')) mStyle(img, { matop: fz / 4 })
		} else {
			let szimg = x.sz * .7;
			let img = showim1('../assets/games/wingspan/pie2.png', d, { w: szimg, h: szimg });//mStyle(img,{round:true})
		}
	}
}

function showImageCard(key, dParent, styles = {}, opts = {}) {
	let d = mDom(dParent, styles, opts);
	let o = M.superdi[key];
	console.log(o);
	let d1 = showImage1(key, d);
}
function showImage1(key, dParent, styles = {}, useSymbol = false) {
	let o = M.superdi[key];
	assertion(o, `showImage:key not found ${key}`);
	let [w, h] = mSizeSuccession(styles); console.log(w, h)
	let [sz, fz] = [.9 * w, .8 * h];
	addKeys({ position: 'relative', w, h, padding: 11, box: true }, styles)
	let d1 = mDiv(dParent, styles);//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'contain', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	assertion(el, 'PROBLEM mit' + key);
	return d1;
}


//#region 21.6.24 scroll to bottom funktioniert NICHT!!!
function scrollToBottomOf(d) {
	//d=toElem(d);d.scrollTop = d.offsetTop;
	d = mBy('dTable');
	let elem = d.lastChild;
	ensureInView(d, elem);
}
function ensureInView(container, element) {
	let cTop = container.scrollTop;
	let cBottom = cTop + container.clientHeight;
	let eTop = element.offsetTop;
	let eBottom = eTop + element.clientHeight;
	if (eTop < cTop) {
		container.scrollTop -= cTop - eTop;
	} else if (eBottom > cBottom) {
		container.scrollTop += eBottom - cBottom;
	}
}
function scrollToBottomOf(d) {
	d = toElem(d);
	var a, b, i = 0;
	a = d;//document.getElementById("leftmenuinnerinner");
	if (!a || !a.getElementsByClassName) { return false; }
	b = arrChildren(a); //a.lastChild; //getElementsByClassName("active");
	if (b.length < 1) { return false; }
	while (!isIntoView(a, arrLast(b))) {
		i++
		if (i > 1000) { break; }
		a.scrollTop += 10;
	}
}
function scrollToBottomOf(d) {
	d = toElem(d);

	mStyle(d, { h: 1400, w: 1000, overy: 'scroll', border: 'red' });

	console.log(d.offsetHeight, d.style);

	d.scrollTop = d.scrollHeight; //1000;
}
function isIntoView(x, y) {
	var a = x.scrollTop;
	var b = a + window.innerHeight;
	var ytop = y.offsetTop;
	var ybottom = ytop + 140;
	return ((ybottom <= b) && (ytop >= a));
}
function scrolltop() {
	var top = 0;
	if (typeof (window.pageYOffset) == "number") {
		top = window.pageYOffset;
	} else if (document.body && document.body.scrollTop) {
		top = document.body.scrollTop;
	} else if (document.documentElement && document.documentElement.scrollTop) {
		top = document.documentElement.scrollTop;
	}
	return top;
}
//#endregion

//#region 19.6.24
function _showCardWingspanPortrait(o, d, sz = 480) {
	let item = { o, key: o.key };
	let fa = sz / 480;
	let card = cBlank(d, { sz, border: 'silver' });
	let dCard = iDiv(card);
	let [rounding, h, w, fz] = [card.rounding, card.h, card.w, 15].map(x => x * fa);

	let hu = measureHeightOfTextStyle(dCard, { fz });
	let wu = w / 20;
	console.log('card', card, sz, h, w, rounding, hu, wu, 480 / 20);

	return;
	//habitat
	mCenterCenterFlex(dlt);

	let hcolors = o.ohabitat.colors; //console.log(hcolors)
	//let dHabitat = mDom(dlt, { w: hTop, h: hTop, bg: '#eee', rounding }); mCenterCenterFlex(dHabitat);
	//mPizza(dlt, 40*fa, ...hcolors);//mDom(dCard, {}, { html: generatePizzaSvg(50, ...hcolors) });
	mDom(dlt, { h: 40 * fa, w: 40 * fa, bg: hcolors[0], round: true })
	mLinebreak(dlt, 4 * fa);

	let df = mDom(dlt); mCenterCenterFlex(df);
	let tokens = o.foodTokens;
	let len = tokens.length;
	let ch = len < 3 && coin() ? '/' : '+';
	let [szf, szt] = [szlt / 4, szlt / 9];
	let tlist = [{ t: tokens[0], sz: szf }];
	if (len > 1) { tlist.push({ t: ch, sz: szt }); tlist.push({ t: tokens[1], sz: szf }) }
	if (len > 2) { tlist.push({ t: ch, sz: szt }); tlist.push({ t: tokens[2], sz: szf }) }
	for (const x of tlist) {
		let d = mDom(df, { w: x.sz }); //,bg:rColor()}); 
		mCenterCenterFlex(d);
		let c = x.t;
		if (c == '+') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c == '/') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c.includes('.')) {
			let img = showim1(c, d, { w: x.sz });
			if (c.includes('mouse')) mStyle(img, { matop: fz / 4 })
		} else {
			let d1 = mDom(d, { h: x.sz * .8 })
			//mPizza(d1, x.sz*.8, 'red', 'green', 'yellow', 'gray', 'orange', 'skyblue'); 
		}
	}
	// for (let i = 0; i < Math.min(3, len); i++) {

	// 	if (i == 2) { mLinebreak(dfood); mDom(dfood, { fz: hTop / 5, matop: -gap, maright: gap }, { html: '+' }); }
	// 	if (i == 1) mDom(dfood, { fz: hTop / 5, matop: gap / 2 }, { html: len > 2 || coin() ? '+' : '/&nbsp;' });
	// 	let t = tokens[i];
	// 	if (t == 'omni') {
	// 		let d = mDom(dfood, { matop: i == 2 ? -gap : 1 });
	// 		mPizza(d, hTop / 4, 'red', 'green', 'yellow', 'gray', 'orange', 'skyblue');
	// 	} else showim1(t, dfood, { sz: hTop / 2.8 });
	// }
	// let flist = o.foodlist; console.log(flist);
	// mPlace(dfood, 'tl', 0, 0);
	// console.log(o.foodtype);

	// let dfoodtype = mDom(dCard, { display: 'inline' }, { html: o.foodtype })
	// mPlace(dfoodtype, 'tl', 40, yLifespan);


}
function rest() {
	let [yTitle, yPic, szPic] = [8, sz / 5, sz / 2];
	let [yLifespan, yBrown, hTop, szPlatz] = [yPic + szPic, yPic + szPic + 22, sz * .12, Math.max(sz / 40, 8)];


	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tc', 0, yPic);

	let hcolors = o.ohabitat.colors; //console.log(hcolors)
	let dHabitat = mDom(dCard, { w: hTop, h: hTop, bg: '#eee', rounding }); mCenterCenterFlex(dHabitat);
	mPizza(dHabitat, hTop - 10, ...hcolors);//mDom(dCard, {}, { html: generatePizzaSvg(50, ...hcolors) });
	mPlace(dHabitat, 'tr', 0, 0);


	let title = fromNormalized(o.friendly);
	let dtitle = mDom(dCard, { display: 'inline', weight: 'bold' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle);

	title = o.species; //fromNormalized(o.friendly);
	dtitle = mDom(dCard, { fz: '80%', display: 'inline', 'font-style': 'italic' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle + 24);

	let n = o.ooffsprings.num; //console.log()
	let plaetze = nundef(n) ? 2 : n == 0 ? 0 : n == 1 ? 1 : n < 8 ? 2 : n < 25 ? 3 : n < 100 ? 4 : n < 1000 ? 5 : 6;
	let dPlaetze = item.dPlaetze = mDom(dCard, { w: '60%', gap: szPlatz }); mCenterFlex(dPlaetze);
	for (const i of range(plaetze)) { mDom(dPlaetze, { round: true, w: szPlatz, h: szPlatz, border: 'silver' }); }
	mPlace(dPlaetze, 'tc', 0, yTitle + 60);

	let lifespan = calcLifespan(o.lifespan);// console.log('lifespan',lifespan);
	let dlifespan = mDom(dCard, { display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'tr', 40, yLifespan);

	let dbrown = mDom(dCard, { matop: yBrown, w100: true, bg: 'sienna', fg: 'white', padding: 10, box: true }, { html: 'WHEN ACTIVATED: All players gain 1 food from supply.' })

	let rounding = mGetStyle(dCard, 'rounding')
	let dfood = mDom(dCard, { w: hTop, h: hTop, bg: '#eee', rounding }); mCenterCenterFlex(dfood);
	let gap = hTop / 15;

	console.log(mGetStyle(dfood, 'fz'))

	let tokens = o.foodTokens;
	let len = tokens.length;
	for (let i = 0; i < Math.min(3, len); i++) {
		if (i == 2) { mLinebreak(dfood); mDom(dfood, { fz: hTop / 5, matop: -gap, maright: gap }, { html: '+' }); }
		if (i == 1) mDom(dfood, { fz: hTop / 5, matop: gap / 2 }, { html: len > 2 || coin() ? '+' : '/&nbsp;' });
		let t = tokens[i];
		if (t == 'omni') {
			let d = mDom(dfood, { matop: i == 2 ? -gap : 1 });
			mPizza(d, hTop / 4, 'red', 'green', 'yellow', 'gray', 'orange', 'skyblue');
		} else showim1(t, dfood, { sz: hTop / 2.8 });
	}
	let flist = o.foodlist; console.log(flist);
	mPlace(dfood, 'tl', 0, 0);
	console.log(o.foodtype);

	let dfoodtype = mDom(dCard, { display: 'inline' }, { html: o.foodtype })
	mPlace(dfoodtype, 'tl', 40, yLifespan);



	return item;

	//food
	//wieviel food soll das ding essen?
	let list = o.foodTokens;
	console.log(list);
	let nlist = range(list.length);
	list = arrTake(list, 3);
	let plusor = nlist > 2 ? '+' : nlist == 2 ? coin() ? '+' : '/' : coin() ? '+' : '';

	showim1(difood[foodtype], dfood, { sz: 30 });





}

function showCardWingspanPortrait_trial1(o, d, sz = 480) {
	let item = { o, key: o.key };
	let card = cBlank(d, { sz, border: 'silver' });
	let dCard = iDiv(card);
	let fa = sz / 480;
	let [rounding, h, w, fz] = [card.rounding, card.h, card.w, 15 * fa];

	let szlt = w / 3;
	let dlt = mDom(dCard, { w: szlt, h: szlt, bg: '#eee' }); mPlace(dlt, 'tl'); dlt.style.borderTopLeftRadius = dlt.style.borderBottomRightRadius = `${rounding}px`; mCenterCenterFlex(dlt);

	showHabitat(dlt, o.ohabitat, 40 * fa);
	// let ohab=o.ohabitat;
	// for(let i=0;i<ohab.imgs.length;i++){
	// 	let c=ohab.colors[i];
	// 	if (c == 'gray') continue;
	// 	let d=showim1(ohab.imgs[i],dlt,{h:40*fa,round:true,bg:c,'clip-path':PolyClips.diamond})	
	// 	if (i == 2) mStyle(d,{matop:-40*fa}); //-20})
	// }
	// if (hcolors.includes('blue') &&hcolors.includes('goldenrod') && hcolors.includes('green')) console.log(o.key);
	// if (hcolors.includes('blue')) showim1('../ode/wetland.png',dlt,{h:40*fa,round:true,bg:'lightblue'})	
	// if (hcolors.includes('goldenrod')) showim1('../ode/grassland2.png',dlt,{h:40*fa,round:true})	
	// if (hcolors.includes('green')) showim1('../ode/forest1.png',dlt,{h:40*fa,round:true,bg:'emerald'})	
	//let dHabitat = mDom(dlt, { w: hTop, h: hTop, bg: '#eee', rounding }); mCenterCenterFlex(dHabitat);
	//mPizza(dlt, 40*fa, ...hcolors);//mDom(dCard, {}, { html: generatePizzaSvg(50, ...hcolors) });
	//mDom(dlt,{h:40*fa,w:40*fa,bg:hcolors[0],round:true})
	mLinebreak(dlt, 4 * fa);
	let df = mDom(dlt); mCenterCenterFlex(df);
	let tokens = o.foodTokens; //console.log(tokens,o.foodtype,o.food)
	let len = tokens.length;
	let ch = len < 3 && coin() ? '/' : '+';
	let [szf, szt] = [szlt / 4, szlt / 9];
	let tlist = [{ t: tokens[0], sz: szf }];
	if (len > 1) { tlist.push({ t: ch, sz: szt }); tlist.push({ t: tokens[1], sz: szf }) }
	if (len > 2) { tlist.push({ t: ch, sz: szt }); tlist.push({ t: tokens[2], sz: szf }) }
	for (const x of tlist) {
		let d = mDom(df, { w: x.sz }); //,bg:rColor()}); 
		mCenterCenterFlex(d);
		let c = x.t;
		if (c == '+') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c == '/') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c.includes('.')) {
			let img = showim1(c, d, { w: x.sz });
			if (c.includes('mouse')) mStyle(img, { matop: fz / 4 })
		} else {
			let szimg = x.sz * .7;
			let img = showim1('../ode/pie2.png', d, { w: szimg, h: szimg });//mStyle(img,{round:true})
			//omnisym(d,x.sz)
			//let d1=mDom(d,{h:x.sz*.8})
			//mAppend(d,mCreateFrom(generatePizzaSvg(sz)));
			//mPizza(d, x.sz*.75, 'red', 'green', 'yellow', 'gray', 'orange', 'skyblue'); 
		}
	}

}
function omnisym(dParent, sz) {
	let d = mDom(dParent, { w: sz, h: sz, bg: 'red', position: 'absolute' });
	d.innerHTML = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="10" height="10">
			<!-- Circle background -->
			<circle cx="50" cy="50" r="48" stroke="black" stroke-width="2" fill="white" />
			
			<!-- Beak shape -->
			<path d="M 50 10 L 75 50 L 50 90 L 25 50 Z" fill="orange" stroke="black" stroke-width="2"/>
			
			<!-- Optional lines for more detail -->
			<line x1="50" y1="10" x2="50" y2="90" stroke="black" stroke-width="2" />
			<line x1="25" y1="50" x2="75" y2="50" stroke="black" stroke-width="2" />
		</svg>
		`;
}
function showCardWingspanPortrait(o, d, sz = 500) {

	let item = { o, key: o.key };
	let [yTitle, yPic, szPic] = [8, sz / 5, sz / 2];
	let [yLifespan, yBrown, hTop, szPlatz] = [yPic + szPic, yPic + szPic + 22, sz * .12, Math.max(sz / 40, 8)];

	let card = cBlank(d, { h: sz, border: 'silver', fz: Math.max(10, 16 * sz / 500) });
	let dCard = iDiv(card);// console.log(card);

	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tc', 0, yPic);

	let title = fromNormalized(o.friendly);
	let dtitle = mDom(dCard, { display: 'inline', weight: 'bold' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle);

	title = o.species; //fromNormalized(o.friendly);
	dtitle = mDom(dCard, { fz: '80%', display: 'inline', 'font-style': 'italic' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle + 24);

	let n = o.ooffsprings.num; //console.log()
	let plaetze = nundef(n) ? 2 : n == 0 ? 0 : n == 1 ? 1 : n < 8 ? 2 : n < 25 ? 3 : n < 100 ? 4 : n < 1000 ? 5 : 6;
	let dPlaetze = item.dPlaetze = mDom(dCard, { w: '60%', gap: szPlatz }); mCenterFlex(dPlaetze);
	for (const i of range(plaetze)) { mDom(dPlaetze, { round: true, w: szPlatz, h: szPlatz, border: 'silver' }); }
	mPlace(dPlaetze, 'tc', 0, yTitle + 60);

	let lifespan = calcLifespan(o.lifespan);// console.log('lifespan',lifespan);
	let dlifespan = mDom(dCard, { display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'tr', 40, yLifespan);

	let dbrown = mDom(dCard, { matop: yBrown, w100: true, bg: 'sienna', fg: 'white', padding: 10, box: true }, { html: 'WHEN ACTIVATED: All players gain 1 food from supply.' })

	let rounding = mGetStyle(dCard, 'rounding')
	let dfood = mDom(dCard, { w: hTop, h: hTop, bg: '#eee', rounding }); mCenterCenterFlex(dfood);
	let gap = hTop / 15;

	console.log(mGetStyle(dfood, 'fz'))

	let tokens = o.foodTokens;
	let len = tokens.length;
	for (let i = 0; i < Math.min(3, len); i++) {
		if (i == 2) { mLinebreak(dfood); mDom(dfood, { fz: hTop / 5, matop: -gap, maright: gap }, { html: '+' }); }
		if (i == 1) mDom(dfood, { fz: hTop / 5, matop: gap / 2 }, { html: len > 2 || coin() ? '+' : '/&nbsp;' });
		let t = tokens[i];
		if (t == 'omni') {
			let d = mDom(dfood, { matop: i == 2 ? -gap : 1 });
			mPizza(d, hTop / 4, 'red', 'green', 'yellow', 'gray', 'orange', 'skyblue');
		} else showim1(t, dfood, { sz: hTop / 2.8 });
	}
	let flist = o.foodlist; console.log(flist);
	mPlace(dfood, 'tl', 0, 0);
	console.log(o.foodtype);

	let dfoodtype = mDom(dCard, { display: 'inline' }, { html: o.foodtype })
	mPlace(dfoodtype, 'tl', 40, yLifespan);


	//habitat
	let hcolors = o.ohabitat.colors; //console.log(hcolors)
	let dHabitat = mDom(dCard, { w: hTop, h: hTop, bg: '#eee', rounding }); mCenterCenterFlex(dHabitat);
	mPizza(dHabitat, hTop - 10, ...hcolors);//mDom(dCard, {}, { html: generatePizzaSvg(50, ...hcolors) });
	mPlace(dHabitat, 'tr', 0, 0);

	return item;

	//food
	//wieviel food soll das ding essen?
	let list = o.foodTokens;
	console.log(list);
	let nlist = range(list.length);
	list = arrTake(list, 3);
	let plusor = nlist > 2 ? '+' : nlist == 2 ? coin() ? '+' : '/' : coin() ? '+' : '';

	showim1(difood[foodtype], dfood, { sz: 30 });





}
function mist() {

	let foodtype = extractFoodType(o.food); //console.log(key,foodtype)
	let difood = { omnivorous: 'pot_of_food', carnivorous: 'poultry_leg', herbivorous: 'seedling', insectivorous: 'ant' }
	let dfood = mDom(dCard); //,{bg:'silver',round:true,}); //,{},{html:foodtype});
	showim1(difood[foodtype], dfood, { sz: 30 });
	mPlace(dfood, 'tl', 10, 0)

	let weight = calcNumericInfo(o.weight, { kg: 1000, g: 1, mg: .001 }, 'kg');
	let size = calcNumericInfo(o.size, { cm: .01, centimeter: .01, mm: .001, millimeter: .001, meter: 1, m: 1 }, 'm');
	let offs = calcOffsprings(o.offsprings);

	o.foodType = foodtype;
	o.difood = difood;
	o.weight = weight;
	o.size = size;
	o.offsprings = offs;
	//console.log(key,offs.text);

	addKeys(card, o)
	//mLinebreak(d)

	return o;

}
function showInfoCard(key, d) {

	let o = getDetailedSuperdi(key);

	let sz = 400;
	let [yTitle, yPic, szPic] = [8, sz / 5, sz / 2];
	let [yLifespan, yBrown, hTop] = [yPic + szPic, yPic + szPic + 22, yPic];

	let card = cBlank(d, { h: sz, border: 'dimgray' });
	let dCard = iDiv(card);// console.log(card);

	let d1 = showim1(key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tc', 0, yPic);

	let title = fromNormalized(o.friendly);
	let dtitle = mDom(dCard, { display: 'inline', weight: 'bold' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle);

	let lifespan = calcLifespan(o.lifespan);// console.log('lifespan',lifespan);
	let dlifespan = mDom(dCard, { display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'tr', 40, yLifespan);

	let dbrown = mDom(dCard, { matop: yBrown, w100: true, bg: 'sienna', fg: 'white', padding: 10, box: true }, { html: 'WHEN ACTIVATED: All players gain 1 food from supply.' })

	let foodtype = extractFoodType(o.food); //console.log(key,foodtype)
	let difood = { omnivorous: 'pot_of_food', carnivorous: 'poultry_leg', herbivorous: 'seedling', insectivorous: 'ant' }
	let dfood = mDom(dCard); //,{bg:'silver',round:true,}); //,{},{html:foodtype});
	showim1(difood[foodtype], dfood, { sz: 30 });
	mPlace(dfood, 'tl', 10, 0)

	let weight = calcNumericInfo(o.weight, { kg: 1000, g: 1, mg: .001 }, 'kg');
	let size = calcNumericInfo(o.size, { cm: .01, centimeter: .01, mm: .001, millimeter: .001, meter: 1, m: 1 }, 'm');
	let offs = calcOffsprings(o.offsprings);

	o.foodType = foodtype;
	o.difood = difood;
	o.weight = weight;
	o.size = size;
	o.offsprings = offs;
	//console.log(key,offs.text);

	addKeys(card, o)
	//mLinebreak(d)

	return o;

}


function extractFoodType(s) {
	s = s.toLowerCase();
	for (const t of ['omni', 'herbi', 'carni', 'insecti']) {
		if (s.includes(t)) return t + 'vorous';
	}
	let plants = M.byCat.plant; plants = plants.concat(['leave', 'tree', 'twig', 'fruit', 'grass', 'grain']);
	let carni = M.byCat.animal;
	let types = [];

	if (plants.some(x => s.includes(x.substring(0, 4)))) types.push('herbi');
	if (carni.some(x => s.includes(x.substring(0, 4)))) types.push('carni');
	if (isEmpty(types)) { console.log(s); return 'unknown' }
	if (types.length >= 2) return 'omnivorous';
	else return types[0] + 'vorous';
}

function _fillFormFromObject(ev, inputs, form) {
	//let form = 
	let popup = mPopup(form, { margin: 100 }); //mStyle(popup,{left:10})
	mDom(popup, {}, { html: 'paste your information into the text area' })
	let ta = mDom(popup, {}, { tag: 'textarea', rows: 20, cols: 80 });
	mButton('Fill Form', () => { onclickPasteDetailObject(ta.value, inputs); }, popup);
}
function createPanZoomCanvas(parentElement, src, wCanvas, hCanvas) {
	// Create canvas and button elements
	const canvas = document.createElement('canvas');
	// const saveButton = document.createElement('button');
	// saveButton.textContent = 'Save Image';

	// Set canvas dimensions
	canvas.width = wCanvas;
	canvas.height = hCanvas;

	// Append elements to the parent element
	parentElement.appendChild(canvas);
	//parentElement.appendChild(saveButton);

	const ctx = canvas.getContext('2d');
	let image = new Image();
	image.src = src;

	// Variables for panning and zooming
	let scale = 1;
	let originX = 0;
	let originY = 0;
	let startX = 0;
	let startY = 0;
	let isDragging = false;

	image.onload = () => {
		// Calculate the scale to fit the smaller side of the image to the canvas
		const scaleX = canvas.width / image.width;
		const scaleY = canvas.height / image.height;
		scale = Math.min(scaleX, scaleY);

		// Center the image initially
		originX = (canvas.width - image.width * scale) / 2;
		originY = (canvas.height - image.height * scale) / 2;

		draw();
	};
	// image.onload = () => {
	// 	// Center the image initially
	// 	//if (image.width>wCanvas*2) scale=.5;
	// 	originX = (canvas.width - image.width) / 2;
	// 	originY = (canvas.height - image.height) / 2;
	// 	if (image.width>wCanvas*2) {
	// 		console.log(wCanvas,image.width)
	// 		zoomTo(wCanvas/image.width);
	// 	}
	// 	draw();
	// };
	// function zoomTo(zoomFactor){
	// 	scale *= zoomFactor;
	// 	originX *= zoomFactor;
	// 	originY *= zoomFactor;
	// }


	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(originX, originY);
		ctx.scale(scale, scale);
		ctx.drawImage(image, 0, 0);
		ctx.restore();
	}

	// Mouse events for panning
	canvas.addEventListener('mousedown', (e) => {
		isDragging = true;
		startX = e.clientX - originX;
		startY = e.clientY - originY;
		canvas.style.cursor = 'grabbing';
	});

	canvas.addEventListener('mousemove', (e) => {
		if (isDragging) {
			originX = e.clientX - startX;
			originY = e.clientY - startY;
			draw();
		}
	});

	canvas.addEventListener('mouseup', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	canvas.addEventListener('mouseout', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	// Mouse wheel event for zooming
	canvas.addEventListener('wheel', (e) => {
		e.preventDefault();
		const zoom = Math.exp(e.deltaY * -0.001);
		scale *= zoom;

		// Zoom relative to the mouse pointer
		const mouseX = e.clientX - canvas.offsetLeft;
		const mouseY = e.clientY - canvas.offsetTop;
		originX = mouseX - (mouseX - originX) * zoom;
		originY = mouseY - (mouseY - originY) * zoom;

		draw();
	});

	// Touch events for mobile support
	let touchStartX = 0;
	let touchStartY = 0;

	canvas.addEventListener('touchstart', (e) => {
		if (e.touches.length === 1) {
			isDragging = true;
			touchStartX = e.touches[0].clientX - originX;
			touchStartY = e.touches[0].clientY - originY;
			canvas.style.cursor = 'grabbing';
		}
	});

	canvas.addEventListener('touchmove', (e) => {
		if (e.touches.length === 1 && isDragging) {
			originX = e.touches[0].clientX - touchStartX;
			originY = e.touches[0].clientY - touchStartY;
			draw();
		}
	});

	canvas.addEventListener('touchend', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	// // Save button event
	// saveButton.addEventListener('click', () => {
	// 	const dataURL = canvas.toDataURL('image/png');
	// 	const link = document.createElement('a');
	// 	link.href = dataURL;
	// 	link.download = 'canvas-image.png';
	// 	link.click();
	// });

	return canvas;
}
//#endregion

//#region 14.6.24: removed obsolete app routes fuer superdi
app.post('/postNewItem_', (req, res) => {
	let key = req.body.key;
	let item = req.body.item;
	if (nundef(M.superdi[key])) {
		M.superdi[key] = item;
		let y = yaml.dump(M.superdi);
		fs.writeFileSync(superdiFile, y, 'utf8');
		item.key = key;
		io.emit('superdi', item);
		res.json(`item ${key} posted successfully!`);
	} else {
		res.json(`item ${key} is a DUPLICATE!!!! NOT ADDED!!!`);
	}
});
app.post('/postUpdateItem_', (req, res) => {
	let key = req.body.key;
	let item = req.body.item;
	if (nundef(M.superdi[key])) {
		res.json(`item ${key} NOT FOUND! NO UPDATE!!!!!!`);
	} else {
		M.superdi[key] = item;
		let y = yaml.dump(M.superdi);
		fs.writeFileSync(superdiFile, y, 'utf8');
		item.key = key;
		io.emit('superdi', item);
		res.json(`item ${key} updated successfully!`);
	}
});
//#endregion

//#region 14.6.24 edited
function showDetailsAndMagnify(elem) {
	let key = elem.firstChild.getAttribute('key')
	if (nundef(key)) { mMagnify(elem); return; }
	MAGNIFIER_IMAGE = elem;
	let d = mPopup(null, {}, { id: 'hallo' });
	let o = detailsForKey(key);
	let title = fromNormalized(valf(o.name, o.friendly));
	mDom(d, {}, { tag: 'h1', html: title });
	mDom(d, {}, { tag: 'img', src: valf(o.photo, o.img) });
	let list = detailsPresentList(o);
	list.map(x => mDom(d, {}, { html: `${x.key}:${x.val}` }))
	// for (const k in o) {
	// 	if ('cats colls fa fa6 img photo text key friendly ga name'.includes(k)) continue;
	// 	let val = o[k];
	// 	if (!isLiteral(val)) continue;
	// 	mDom(d, {}, { html: `${k}:${val}` })
	// }
}
//#endregion

//#region 14.6.24 elim altes panzoom zeug
async function onclickSaveCropData() {
	let o = UI.zoomo;
	let pd = UI.panData;
	console.log(o, pd); return;
	let [d, img, wOrig, hOrig, sz, fa, famin] = [o.d, o.img, o.wOrig, o.hOrig, o.sz, o.fa, o.famin];
	if (fa >= 1) { console.log('cant zoom in more!!!', fa); return; }
	fa *= 1.5; if (fa > 1) fa = 1; UI.fa = fa;
	showImgCentered(d, img, wOrig, hOrig, sz, fa, famin);

}
function showImgCentered(d, img, wOrig, hOrig, sz, fa, famin) {
	UI.zoomo = { d, img, wOrig, hOrig, sz, fa, famin };
	let wsc = wOrig * fa, hsc = hOrig * fa; console.log('fa', fa);

	let [xwo, ywo] = [(sz - wsc) / 2, (sz - hsc) / 2]

	showImagePartial(d, img, 0, 0, wOrig, hOrig, xwo, ywo, wsc, hsc, sz, sz, wOrig, hOrig); //, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig);
	let szCrop = sz - 100;
	let dc = mDom(d, { position: 'absolute', left: (sz - szCrop) / 2, top: (sz - szCrop) / 2, w: szCrop, h: szCrop, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
}
async function onclickZoomIn() {
	let o = UI.zoomo;
	let [d, img, wOrig, hOrig, sz, fa, famin] = [o.d, o.img, o.wOrig, o.hOrig, o.sz, o.fa, o.famin];
	if (fa >= 1) { console.log('cant zoom in more!!!', fa); return; }
	fa *= 1.5; if (fa > 1) fa = 1; UI.fa = fa;
	showImgCentered(d, img, wOrig, hOrig, sz, fa, famin);

}
async function onclickZoomOut() {
	let o = UI.zoomo;
	let [d, img, wOrig, hOrig, sz, fa, famin] = [o.d, o.img, o.wOrig, o.hOrig, o.sz, o.fa, o.famin];
	if (fa * wOrig <= sz && fa * hOrig <= sz) { console.log('cant zoom out more!!!', wOrig, hOrig, fa, fa * wOrig, fa * hOrig, sz); return; }
	fa *= 0.5; if (fa < famin) fa = famin; UI.fa = fa;
	showImgCentered(d, img, wOrig, hOrig, sz, fa, famin);

}
function startPanning(ev) {
	console.log('_________startPanning!')
	const panData = {};
	function panStart(ev) {
		evNoBubble(ev);
		assertion(nundef(panData.panning), panData)
		let dc = panData.dCrop = ev.target;
		panData.cropStartSize = { w: mGetStyle(dc, 'w'), h: mGetStyle(dc, 'h') }
		panData.cropStartPos = { l: mGetStyle(dc, 'left'), t: mGetStyle(dc, 'top') }
		panData.elParent = panData.dCrop.parentNode;
		panData.img = panData.elParent.querySelector('img, canvas');//console.log('img',panData.img);
		panData.panning = true;
		panData.counter = -1;
		panData.mouseStart = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		panData.posStart = { x: mGetStyle(dc, 'left'), y: mGetStyle(dc, 'top') };
		addEventListener('mouseup', panEnd);
		panData.elParent.addEventListener('mousemove', panMove);
		console.log('panStart!', panData.mouseStart);
	}
	function panMove(ev) {
		evNoBubble(ev);
		if (!panData.panning || ++panData.counter % 3) return;
		panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		let [x, y] = [panData.posStart.x, panData.posStart.y];
		let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];
		[dx, dy] = [Math.round(dx / 10) * 10, Math.round(dy / 10) * 10];
		adjustComplex(panData)
	}
	function panEnd(ev) {
		assertion(panData.panning == true);
		let d = evToClass(ev, 'imgWrapper');
		if (d == panData.elParent) {
			evNoBubble(ev);
			panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
			console.log('SUCCESS!', panData.mouse)
		}
		removeEventListener('mouseup', panEnd);
		panData.elParent.removeEventListener('mousemove', panMove);
		panData.panning = false;
		console.log('* THE END *', panData)
		UI.panData = panData;
	}
	panStart(ev);
}

//noch aelter
function adjustCropper1(img, dc, sz) {
	let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	mStyle(dc, { left: cx - radx, top: cy - rady, w: sz, h: sz });
}

function showImagePart(dParent, src, x, y, wi, hi) {
	mClear(dParent);
	let [w, h] = [mGetStyle(dParent, 'w'), mGetStyle(dParent, 'h')];
	let canvas = mDom(dParent, { w, h, fill: 'blue' }, { tag: 'canvas', width: w, height: h });
	return;

}
function showImagePart(image, x, y, w, h) {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to the specified width and height
	canvas.width = w;
	canvas.height = h;

	// Draw the specified part of the image onto the canvas
	ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
}

function imgZoomOut(img, dc, sz, wOrig, hOrig) {
	let w = mGetStyle(dc, 'w');
	let h = mGetStyle(dc, 'h');
	console.log('__image', img.width, img.height);
	console.log('sz', sz, 'orig', wOrig, hOrig)
	console.log(w, h)

	return;

	if (img.width == w || img.height == h) return;
	else {
		img.width = Math.max(img.width - 20, w);
		img.width = Math.max(img.width - 20, w);
		adjustCropper1(img, dc, sz);
		return [img.width, img.height];
	}
}

//#endregion

//#region 13.6.24
function createPanZoomCanvas(parentElement, src, wCanvas, hCanvas) {
	// Create canvas and button elements
	const canvas = document.createElement('canvas');
	// const saveButton = document.createElement('button');
	// saveButton.textContent = 'Save Image';

	// Set canvas dimensions
	canvas.width = wCanvas;
	canvas.height = hCanvas;

	// Append elements to the parent element
	parentElement.appendChild(canvas);
	//parentElement.appendChild(saveButton);

	const ctx = canvas.getContext('2d');
	let image = new Image();
	image.src = src;

	// Variables for panning and zooming
	let scale = 1;
	let originX = 0;
	let originY = 0;
	let startX = 0;
	let startY = 0;
	let isDragging = false;

	image.onload = () => {
		// Calculate the scale to fit the smaller side of the image to the canvas
		const scaleX = canvas.width / image.width;
		const scaleY = canvas.height / image.height;
		scale = Math.min(scaleX, scaleY);

		// Center the image initially
		originX = (canvas.width - image.width * scale) / 2;
		originY = (canvas.height - image.height * scale) / 2;

		draw();
	};
	// image.onload = () => {
	// 	// Center the image initially
	// 	//if (image.width>wCanvas*2) scale=.5;
	// 	originX = (canvas.width - image.width) / 2;
	// 	originY = (canvas.height - image.height) / 2;
	// 	if (image.width>wCanvas*2) {
	// 		console.log(wCanvas,image.width)
	// 		zoomTo(wCanvas/image.width);
	// 	}
	// 	draw();
	// };
	// function zoomTo(zoomFactor){
	// 	scale *= zoomFactor;
	// 	originX *= zoomFactor;
	// 	originY *= zoomFactor;
	// }


	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(originX, originY);
		ctx.scale(scale, scale);
		ctx.drawImage(image, 0, 0);
		ctx.restore();
	}

	// Mouse events for panning
	canvas.addEventListener('mousedown', (e) => {
		isDragging = true;
		startX = e.clientX - originX;
		startY = e.clientY - originY;
		canvas.style.cursor = 'grabbing';
	});

	canvas.addEventListener('mousemove', (e) => {
		if (isDragging) {
			originX = e.clientX - startX;
			originY = e.clientY - startY;
			draw();
		}
	});

	canvas.addEventListener('mouseup', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	canvas.addEventListener('mouseout', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	// Mouse wheel event for zooming
	canvas.addEventListener('wheel', (e) => {
		e.preventDefault();
		const zoom = Math.exp(e.deltaY * -0.001);
		scale *= zoom;

		// Zoom relative to the mouse pointer
		const mouseX = e.clientX - canvas.offsetLeft;
		const mouseY = e.clientY - canvas.offsetTop;
		originX = mouseX - (mouseX - originX) * zoom;
		originY = mouseY - (mouseY - originY) * zoom;

		draw();
	});

	// Touch events for mobile support
	let touchStartX = 0;
	let touchStartY = 0;

	canvas.addEventListener('touchstart', (e) => {
		if (e.touches.length === 1) {
			isDragging = true;
			touchStartX = e.touches[0].clientX - originX;
			touchStartY = e.touches[0].clientY - originY;
			canvas.style.cursor = 'grabbing';
		}
	});

	canvas.addEventListener('touchmove', (e) => {
		if (e.touches.length === 1 && isDragging) {
			originX = e.touches[0].clientX - touchStartX;
			originY = e.touches[0].clientY - touchStartY;
			draw();
		}
	});

	canvas.addEventListener('touchend', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	// // Save button event
	// saveButton.addEventListener('click', () => {
	// 	const dataURL = canvas.toDataURL('image/png');
	// 	const link = document.createElement('a');
	// 	link.href = dataURL;
	// 	link.download = 'canvas-image.png';
	// 	link.click();
	// });

	return canvas;
}

async function simpleFinishEditing(canvas, dPopup, ta, inpFriendly, inpCats, sisi) {
	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!
	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	let friendly = inpFriendly.value;
	let cats = extractWords(valf(inpCats.value, ''));
	let filename = (isdef(M.superdi[friendly]) ? 'i' + getTimestamp() : friendly) + '.png'; //console.log('filename', filename);
	let o = { image: dataUrl, coll: sisi.name, path: filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${sisi.name}/${filename}`;

	let details = ta.value.trim(), odetails;
	if (!isEmpty(details)) {
		//console.log('details',details);
		let odetails = {};
		try { odetails = jsyaml.load(details); } catch { odetails[key] = details; }
		console.log('yaml object', odetails);
	}

	let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [sisi.name] };
	// if (isDict(odetails)) item.details = odetails;
	dPopup.remove();
	await simpleOnDroppedItem(item, sisi);
}
async function simpleOnDroppedUrl(src, sisi) {

	let sz = 400;
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz, hmin: sz, bg: 'pink' });
	let dParent = mDom(dPopup);
	let canvas = createPanZoomCanvas(dParent, src, sz, sz);
	mStyle(canvas, { border: 'red' })
	mLinebreak(dParent)
	//mButton('save', ()=>savePanZoomCanvas(canvas), dParent,{},'button');

	let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
	mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
	let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
	let defaultName = '';
	let iDefault = 1;
	let k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`); }
	defaultName = `${sisi.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });

	// mLinebreak(dinp);
	// let ta = mDom(dinp,{w:sz},{tag:'textarea',rows:10,value:''})

	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('OK', () => simpleFinishEditing(canvas, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');





}
async function rest() {
	let m = await imgMeasure(src); console.log('simpleOnDroppedUrl!!! sz', m);
	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 400];
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz + 80, hmin: sz + 80, bg: 'pink' });
	let d = mDom(dPopup); //, wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });

	mIfNotRelative(d);

	let zoom = 1;


	mStyle(img, { h: sz });

	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];
	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
	let db1 = mDom(dPopup, { bg: 'red', padding: 10, display: 'flex', gap: 10, 'justify-content': 'center' });

	mButton('restart', () => imgReset(img, dc, sz, w0, h0), db1, { w: 70 }, 'input');
	mButton('squish', () => imgSquish(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('expand', () => imgExpand(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('zoom out', () => imgZoomOut(img, dc, sz, wOrig, hOrig), db1, { w: 70 }, 'input');
	mButton('zoom in', () => imgZoomIn(img, dc, sz), db1, { w: 70 }, 'input');

	let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
	mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
	let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
	let defaultName = '';
	let iDefault = 1;
	let k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`); }
	defaultName = `${sisi.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });
	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('OK', () => simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');
}
async function simpleOnDropImage(ev, elem) {
	let dt = ev.dataTransfer;
	//console.log('dropped', ev.dataTransfer);
	//console.log('types', dt.types);
	//console.log('files', dt.files);
	if (dt.types.includes('itemkey')) {
		let data = ev.dataTransfer.getData('itemkey');
		//console.log('itemkey', data)
		await simpleOnDroppedItem(data);
	} else {
		const files = ev.dataTransfer.files;
		//console.log('drop', ev.dataTransfer);
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = async (evReader) => {
				let data = evReader.target.result;
				await simpleOnDroppedUrl(data, UI.simple);
			};
			reader.readAsDataURL(files[0]);
		}
	}
	return;
	if (isString(file) && isdef(M.superdi[file])) {
		console.log('YEAH!!!!!!!!!!!! ein key', file)
		await simpleOnDroppedItem(M.superdi[file], UI.simple)
	} else if (isDict(file) && isdef(M.allImages[file.name])) {
		assertion(false, "DROP IMAGE FROM KEY ist aber file instead!!!!!!!!!!!!!!!!")
		console.log('NOOOOOOOOO!!!!!!!!!!!! ein eigenes img', M.allImages[file.name])
	} else {
		assertion(!isDict(file), 'MUSS VON WO ANDERS KOMMEN!!!!!')
		console.log('from somewhere else!!!!', file);
	}
}

async function simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi) {
	let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); //console.log('dims', dims);
	let wScale = img.width / wOrig;
	let hScale = img.height / hOrig;
	let d1 = mDom(document.body, { margin: 10 });
	let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)
	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!
	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	let friendly = inpFriendly.value;
	let cats = extractWords(valf(inpCats.value, ''));
	let filename = (isdef(M.superdi[friendly]) ? 'i' + getTimestamp() : friendly) + '.png'; //console.log('filename', filename);
	let o = { image: dataUrl, coll: sisi.name, path: filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${sisi.name}/${filename}`;
	let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [sisi.name] };
	dPopup.remove();
	await simpleOnDroppedItem(item, sisi);
}

async function simpleOnDroppedUrl(url, sisi) {
	let m = await imgMeasure(url); console.log('simpleOnDroppedUrl!!! sz', m);
	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 400];
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz + 80, hmin: sz + 80, bg: 'pink' });
	let d = mDom(dPopup, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);

	let zoom = 1;


	mStyle(img, { h: sz });

	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];
	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
	let db1 = mDom(dPopup, { bg: 'red', padding: 10, display: 'flex', gap: 10, 'justify-content': 'center' });

	mButton('restart', () => imgReset(img, dc, sz, w0, h0), db1, { w: 70 }, 'input');
	mButton('squish', () => imgSquish(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('expand', () => imgExpand(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('zoom out', () => imgZoomOut(img, dc, sz, wOrig, hOrig), db1, { w: 70 }, 'input');
	mButton('zoom in', () => imgZoomIn(img, dc, sz), db1, { w: 70 }, 'input');

	let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
	mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
	let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
	let defaultName = '';
	let iDefault = 1;
	let k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`); }
	defaultName = `${sisi.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });
	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('OK', () => simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');
}
//#endregion

//#region 11.6.24
function _showImagePart1(dParent, image, x, y, wShow, hShow) {

	mClear(dParent)
	let canvas = mDom(dParent, {}, { tag: 'canvas' });
	//const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to the specified width and height
	canvas.width = w;
	canvas.height = h;

	// Draw the specified part of the image onto the canvas
	ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
}
async function _onclickZoomOut() {
	let o = UI.zoomo;
	let [d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig] = [o.d, o.img, o.xi, o.yi, o.wi, o.hi, o.dx, o.dy, o.wCrop, o.hCrop, o.wCanvas, o.hCanvas, o.wOrig, o.hOrig];
	let fa = o.fa;

	if (wi >= wOrig || hi >= hOrig) { console.log(`can't zoom out`); return; }

	//wenn komplett zoomed out will ich das img voll sehen koennen auch wenn es NICHT das dc covered
	let [w, h] = [wCrop, hCrop];
}
async function _onclickZoomIn() {
	let o = UI.zoomo;
	let [d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig] = [o.d, o.img, o.xi, o.yi, o.wi, o.hi, o.dx, o.dy, o.wCrop, o.hCrop, o.wCanvas, o.hCanvas, o.wOrig, o.hOrig];
	let fa = o.fa;
	if (wi <= wCrop || hi <= hCrop) { console.log(`can't zoom in`); return; }

	console.log('fa', fa)
	fa = Math.min(1, fa + .1);
	let [wshow, hshow] = [wOrig * fa, hOrig * fa];
	[xi, yi, wi, hi, wCrop, hCrop] = [0, 0, wOrig, hOrig, wOrig * fa, hOrig * fa];

	//if (fa)

	showImagePartial(d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig);

}
function mist() {
	let [d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig] = [o.d, o.img, o.xi, o.yi, o.wi, o.hi, o.dx, o.dy, o.wCrop, o.hCrop, o.wCanvas, o.hCanvas, o.wOrig, o.hOrig];
	let fa = o.fa;
	if (wi <= wCrop || hi <= hCrop) { console.log(`can't zoom in`); return; }

	console.log('fa', fa)
	fa = Math.min(1, fa + .1);
	let [wshow, hshow] = [wOrig * fa, hOrig * fa];
	[xi, yi, wi, hi, wCrop, hCrop] = [0, 0, wOrig, hOrig, wOrig * fa, hOrig * fa];

	//if (fa)

	showImagePartial(d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig);

}
//#endregion

//#region weitere tiere
function getAnimalDetails() {
	const NEWDETAILS = {
	};
	return NEWDETAILS;
	const old_details = {
		bear: {
			name: 'eurasian_brown_bear',
			lifespan: "20-30 years in the wild, up to 50 years in captivity",
			habitat: "Forests, mountains, and tundra across Europe and northern Asia",
			weight: "Females: 100-250 kg, Males: 135-390 kg",
			size: "1.2-2.2 meters in length, 0.7-1.5 meters in height at the shoulders",
			food: "Omnivorous: feeds on a wide variety of foods including fruits, nuts, berries, insects, small mammals, fish, and carrion",
			species: "Ursus arctos arctos",
			color: "Varies from pale brown to dark brown; occasionally black or with blonde highlights",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 1-4 cubs per litter after a gestation period of about 8 months, with delayed implantation",
			class: "Mammal"
		},
		gray_squirrel: {
			name: 'eastern_gray_squirrel',
			lifespan: "6-12 years in the wild, up to 20 years in captivity",
			habitat: "Deciduous and mixed forests, urban and suburban areas in eastern North America",
			weight: "400-600 grams",
			size: "23-30 cm in body length, with a tail length of 15-25 cm",
			food: "Omnivorous: primarily feeds on nuts, seeds, fruits, fungi, and occasionally insects and bird eggs",
			species: "Sciurus carolinensis",
			color: "Gray fur with a white underside; variations can include black or brown fur",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 young per litter after a gestation period of about 44-45 days",
			class: "Mammal"
		},
		mandrill: {
			lifespan: "20-30 years in the wild, up to 40 years in captivity",
			habitat: "Tropical rainforests and occasionally savannas in Central Africa, primarily in countries like Gabon, Cameroon, and Congo",
			weight: "Females: 11-14 kg, Males: 19-37 kg",
			size: "Females: 55-66 cm in body length, Males: 75-95 cm in body length; both sexes have tails about 5-10 cm long",
			food: "Omnivorous: feeds on fruits, seeds, leaves, insects, small mammals, and occasionally fungi",
			species: "Mandrillus sphinx",
			color: "Distinctive colorful face with blue and red markings; olive green or dark gray fur; males have more vibrant colors",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 1 offspring per litter after a gestation period of about 6 months",
			class: "Mammal"
		},
		monkey: {
			lifespan: "15-30 years depending on the species",
			habitat: "Various habitats including tropical rainforests, savannas, mountains, and grasslands worldwide",
			weight: "0.3-40 kg depending on the species",
			size: "25-100 cm in body length, not including the tail",
			food: "Omnivorous: feeds on fruits, leaves, seeds, nuts, insects, and small animals",
			species: "Various species within the infraorder Simiiformes",
			color: "Varies widely; common colors include brown, black, gray, and golden",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 1-2 offspring per litter after a gestation period of 4-8 months depending on the species",
			class: "Mammal"
		},
		squirrel:
		{
			name: 'american_red_squirrel',
			lifespan: "6-12 years in the wild, up to 20 years in captivity",
			habitat: "Found in coniferous and mixed forests of Eastern Europe and Asia, particularly in Siberia",
			weight: "250-400 grams",
			size: "19-23 cm in body length, with a tail length of 15-20 cm",
			food: "Omnivorous: feeds on seeds, nuts, fruits, fungi, and occasionally insects and bird eggs",
			species: "Sciurus vulgaris ognevi",
			color: "Reddish-brown fur with a white or cream-colored underside; winter coat may be grayer",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 young per litter after a gestation period of about 38-39 days",
			class: "Mammal"
		},
		british_shorthair: {
			lifespan: "12-20 years on average",
			habitat: "Domesticated; commonly found in homes, originating from the United Kingdom",
			weight: "4-8 kg",
			size: "56-64 cm in length including tail, 30-36 cm in height at the shoulders",
			food: "Carnivorous: primarily feeds on commercially prepared cat food, small mammals, and birds",
			species: "Felis catus (British Shorthair breed)",
			color: "Varies widely; common colors include blue (gray), black, white, red, cream, and various patterns such as tabby, bicolor, and tortoiseshell",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},
		american_bobtail: {
			lifespan: "13-15 years on average",
			habitat: "Domesticated; commonly found in homes, originating from North America",
			weight: "3-7 kg",
			size: "30-38 cm in length excluding tail, 25-30 cm in height at the shoulders",
			food: "Carnivorous: primarily feeds on commercially prepared cat food, small mammals, and birds",
			species: "Felis catus (American Bobtail breed)",
			color: "Varies widely; common colors include brown, black, white, blue, red, and various patterns such as tabby, calico, and bicolor",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},
		siberian_cat: {
			lifespan: "12-15 years on average",
			habitat: "Domesticated; commonly found in homes and rural areas, originating from Russia's Siberian forests",
			weight: "3.5-8 kg",
			size: "23-30 cm in height at the shoulders, 38-46 cm in body length excluding tail",
			food: "Carnivorous: primarily feeds on commercially prepared cat food, small mammals, and birds",
			species: "Felis catus (Siberian Cat breed)",
			color: "Varies widely; common colors include white, black, blue, red, and various patterns such as tabby, tortoiseshell, and bicolor",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},

		norwegian_forest_cat: {
			lifespan: "14-16 years on average",
			habitat: "Domesticated; commonly found in homes, farms, and rural areas; native to Norway's forests",
			weight: "4.5-9 kg",
			size: "30-46 cm in body length, excluding tail; 23-30 cm in height at the shoulders",
			food: "Carnivorous: primarily feeds on commercially prepared cat food, small mammals, and birds",
			species: "Felis catus (Norwegian Forest Cat breed)",
			color: "Varies widely; common colors include white, black, blue, red, and various patterns such as tabby, tortoiseshell, and bicolor",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},
		domestic_cat: {
			lifespan: "12-15 years on average, with some living over 20 years",
			habitat: "Found worldwide in various habitats including homes, farms, urban, and rural areas",
			weight: "3.6-4.5 kg on average, but can range from 2.5-7 kg or more depending on the breed",
			size: "23-25 cm in height at the shoulders, 46-51 cm in body length excluding tail",
			food: "Carnivorous: primarily feeds on small mammals, birds, and commercially prepared cat food",
			species: "Felis catus",
			color: "Varies widely; common colors include black, white, gray, orange, and various patterns such as tabby, calico, and tortoiseshell",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 64-67 days",
			class: "Mammal"
		},
		pallas_cat: {
			lifespan: "12-14 years in the wild",
			habitat: "Found in montane grasslands and shrublands of Central Asia, including Mongolia, China, and the Himalayas",
			weight: "2.5-4.5 kg",
			size: "46-65 cm in length, not including the tail",
			food: "Carnivorous: primarily feeds on small mammals, birds, and insects",
			species: "Otocolobus manul",
			color: "Dense, long fur with a gray to reddish-brown coat; has dark vertical bars on the torso and legs",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 2-6 kittens per litter after a gestation period of about 66-75 days",
			class: "Mammal"
		},
		eastern_rosella: {
			lifespan: "15-20 years in the wild, longer in captivity",
			habitat: "Found in open woodlands, gardens, parks, and forests in southeastern Australia and Tasmania",
			weight: "90-120 grams",
			size: "30-33 cm in length",
			food: "Seeds, fruits, berries, nuts, flowers, and insects",
			species: "Platycercus eximius",
			color: "Bright red head and chest, white cheek patches, yellow-green underparts, and a combination of blue, green, and black on the wings and back",
			reproduction: "Oviparous",
			offsprings: "Females lay 4-8 eggs per clutch; incubation period is about 19-21 days",
			class: "Bird"
		},
		"Sparkling Violetear": {
			lifespan: "3-4 years in the wild, potentially longer in captivity",
			habitat: "Found in high-altitude forests, gardens, and shrublands in the Andes Mountains of South America",
			weight: "6-7 grams",
			size: "13-15 cm in length",
			food: "Nectar from flowers, small insects, and spiders",
			species: "Colibri coruscans",
			color: "Iridescent green with a violet-blue patch on the throat and chest, and blue-violet ear tufts",
			reproduction: "Oviparous",
			offsprings: "Females lay 2 eggs per clutch; incubation period is about 17-18 days",
			class: "Bird"
		},
		"White-lipped Tree Frog": {
			lifespan: "Up to 10 years in the wild, longer in captivity",
			habitat: "Tropical rainforests, mangroves, and wet sclerophyll forests in northern Australia, New Guinea, and surrounding islands",
			weight: "50-90 grams",
			size: "Up to 14 cm in length, making it the largest tree frog in the world",
			food: "Insectivorous: primarily feeds on insects, spiders, and other small invertebrates; occasionally consumes smaller frogs and lizards",
			species: "Litoria infrafrenata",
			color: "Bright green with a distinctive white stripe along the lower lip and extending to the shoulders; some may exhibit white spots on their sides",
			reproduction: "Oviparous",
			offsprings: "Females lay hundreds to thousands of eggs in temporary pools of water, tadpoles metamorphose into frogs over several weeks",
			class: "Amphibian"
		},
		"Blue poison dart frog": {
			lifespan: "4-6 years in the wild, up to 12 years in captivity",
			habitat: "Tropical rainforests of Suriname and northern Brazil, usually found near streams and moist areas",
			weight: "3-5 grams",
			size: "3-5 cm in length",
			food: "Insectivorous: primarily feeds on ants, termites, and other small invertebrates",
			species: "Dendrobates tinctorius 'azureus'",
			color: "Bright blue with black spots or patches; coloration serves as a warning to predators about its toxicity",
			reproduction: "Oviparous",
			offsprings: "Females lay 5-10 eggs in moist, protected areas; tadpoles are carried to water by the male where they continue development",
			class: "Amphibian"
		},
		"European Garden Spider": {
			lifespan: "1-2 years",
			habitat: "Gardens, woodlands, grasslands, and human structures throughout Europe and parts of North America",
			weight: "0.5-2 grams",
			size: "Females: 6.5-20 mm, Males: 5.5-13 mm",
			food: "Carnivorous: primarily feeds on flying insects such as flies, mosquitoes, and moths",
			species: "Araneus diadematus",
			color: "Varies from pale yellow to dark brown, with a distinctive white cross pattern on the abdomen",
			reproduction: "Oviparous",
			offsprings: "Females lay up to 300-800 eggs in a silk sac; eggs hatch into spiderlings after several weeks",
			class: "Arachnid"
		},
		"Barn Spider": {
			lifespan: "1 year",
			habitat: "Barns, sheds, gardens, and areas near human habitation across North America",
			weight: "Approximately 1 gram",
			size: "Females: 14-20 mm, Males: 10-13 mm",
			food: "Carnivorous: primarily feeds on flying insects such as flies, moths, and beetles",
			species: "Araneus cavaticus",
			color: "Varies from brown to orange with white and dark markings on the abdomen",
			reproduction: "Oviparous",
			offsprings: "Females lay several hundred eggs in a silk sac; eggs hatch into spiderlings in the spring",
			class: "Arachnid"
		},
		"Housefly": {
			lifespan: "15-30 days",
			habitat: "Found worldwide in a variety of environments, especially in close association with human habitation",
			weight: "10-15 milligrams",
			size: "6-7 mm in length",
			food: "Omnivorous: feeds on a wide range of organic matter, including food waste, feces, and decaying organic material",
			species: "Musca domestica",
			color: "Gray thorax with four dark longitudinal stripes; the abdomen is yellowish with a central dark stripe",
			reproduction: "Oviparous",
			offsprings: "Females can lay up to 500 eggs in several batches over their lifetime; eggs hatch into larvae (maggots) which then pupate and emerge as adult flies",
			class: "Insect"
		},
		"Dragonfly": {
			lifespan: "Several months to several years (including larval stage)",
			habitat: "Found near freshwater habitats like ponds, lakes, rivers, and wetlands worldwide",
			weight: "0.2-0.5 grams",
			size: "2-5 inches (5-12.5 cm) in wingspan",
			food: "Carnivorous: primarily feeds on other insects, including mosquitoes, flies, and small aquatic organisms during the larval stage",
			species: "Suborder Anisoptera, encompassing numerous genera and species",
			color: "Varies widely among species; often bright and iridescent with colors such as blue, green, red, and yellow",
			reproduction: "Oviparous",
			offsprings: "Females lay hundreds to thousands of eggs in or near water; eggs hatch into aquatic larvae (nymphs) which eventually metamorphose into adults",
			class: "Insect"
		},
		"Variegated Ladybug": {
			lifespan: "1-2 years",
			habitat: "Found in various habitats including gardens, fields, forests, and meadows across Europe, Asia, Africa, and introduced to North America and Australia",
			weight: "Less than 1 gram",
			size: "4-7 mm in length",
			food: "Carnivorous: primarily feeds on aphids, but also consumes other soft-bodied insects and mites",
			species: "Hippodamia variegata",
			color: "Typically orange to red with black spots; some individuals may have a more yellowish or tan hue",
			reproduction: "Oviparous",
			offsprings: "Females lay clusters of 10-50 eggs on plants near aphid colonies; eggs hatch into larvae that feed voraciously on aphids",
			class: "Insect"
		},
		"Caterpillar": {
			lifespan: "Several weeks to months (larval stage)",
			habitat: "Found in various habitats including forests, fields, gardens, and meadows worldwide",
			weight: "Varies widely; can range from a few milligrams to several grams depending on the species",
			size: "Varies widely; typically ranges from a few millimeters to over 10 cm in length depending on the species",
			food: "Herbivorous: primarily feeds on leaves of various plants; some species may have specific host plants",
			species: "Numerous species across the Order Lepidoptera",
			color: "Varies widely among species; can be green, brown, yellow, black, and often with patterns and markings for camouflage or warning",
			reproduction: "Oviparous",
			offsprings: "Females lay hundreds to thousands of eggs depending on the species; eggs hatch into larvae (caterpillars) which then undergo several molts",
			class: "Insect"
		},
		"Grasshopper": {
			lifespan: "Several months",
			habitat: "Found in various habitats including grasslands, meadows, fields, and forests worldwide",
			weight: "0.1-3 grams depending on the species",
			size: "2-5 inches (5-12 cm) in length depending on the species",
			food: "Herbivorous: primarily feeds on grasses, leaves, and other plant material",
			species: "Numerous species across the Suborder Caelifera",
			color: "Varies widely among species; typically green or brown, but can also be brightly colored or patterned",
			reproduction: "Oviparous",
			offsprings: "Females lay hundreds of eggs in the soil or plant material; eggs hatch into nymphs which gradually develop into adults through several molts",
			class: "Insect"
		},
		"European Rhinoceros Beetle": {
			lifespan: "3-5 years (including larval stage)",
			habitat: "Woodlands, forests, gardens, and areas with decaying wood or compost piles across Europe and parts of Asia",
			weight: "4-10 grams",
			size: "20-40 mm in length",
			food: "Larvae feed on decaying wood and organic matter; adults feed on plant sap and fruit",
			species: "Oryctes nasicornis",
			color: "Shiny dark brown to black",
			reproduction: "Oviparous",
			offsprings: "Females lay 50-100 eggs in decaying wood or compost; eggs hatch into larvae that undergo several molts before pupating and emerging as adults",
			class: "Insect"
		},
		"Wasp": {
			lifespan: "Several weeks to months depending on the species",
			habitat: "Found worldwide in various habitats including gardens, forests, fields, and urban areas",
			weight: "Varies widely among species; typically ranges from a few milligrams to several grams",
			size: "Varies widely among species; typically ranges from a few millimeters to several centimeters in length",
			food: "Varies among species; carnivorous or omnivorous diets including insects, nectar, fruit, and other food sources",
			species: "Numerous species across various families including Vespidae, Apidae, and others",
			color: "Varies widely among species; can be black, yellow, brown, or metallic with various patterns and markings",
			reproduction: "Oviparous",
			offsprings: "Varies among species; queens lay eggs in nests or cells, and eggs hatch into larvae that are cared for until they pupate and emerge as adults",
			class: "Insect"
		},
		"White Peacock Butterfly": {
			lifespan: "2-4 weeks (adult stage)",
			habitat: "Found in open, sunny areas including meadows, fields, gardens, and parks across the Americas",
			weight: "Varies, typically less than 1 gram",
			size: "Wingspan of 4-5 cm",
			food: "Herbivorous: feeds primarily on nectar from various flowers, particularly those in the aster family (Asteraceae)",
			species: "Anartia jatrophae",
			color: "White wings with black and orange patterns; males and females have similar wing patterns",
			reproduction: "Oviparous",
			offsprings: "Females lay eggs on host plants of the passionflower family (Passifloraceae); eggs hatch into caterpillars which pupate and eventually emerge as adult butterflies",
			class: "Insect"
		},
		"Stag Beetle": {
			lifespan: "1-7 years depending on the species",
			habitat: "Found in forests, woodlands, and gardens across Europe, Asia, and North America",
			weight: "5-35 grams depending on the species",
			size: "5-12 cm in length depending on the species",
			food: "Larvae feed on decaying wood; adults primarily feed on tree sap and fruit juices",
			species: "Lucanidae family, encompassing numerous genera and species",
			color: "Varies among species; typically brown to black with shiny, smooth exoskeletons; males have enlarged mandibles resembling deer antlers",
			reproduction: "Oviparous",
			offsprings: "Females lay eggs in decaying wood; larvae hatch and develop within the wood, often taking several years to mature before pupating into adults",
			class: "Insect"
		},
		"European Mantis": {
			lifespan: "1-2 years in the wild",
			habitat: "Found in various habitats including gardens, meadows, and shrublands across Europe, Asia, and North America",
			weight: "2-5 grams",
			size: "5-7 cm in length",
			food: "Carnivorous: feeds primarily on insects such as flies, moths, and smaller insects",
			species: "Mantis religiosa",
			color: "Typically green or brown with long, slender bodies and triangular heads; front legs adapted for grasping prey",
			reproduction: "Oviparous",
			offsprings: "Females lay a foamy egg case called an ootheca containing up to 200 eggs; nymphs hatch from eggs and resemble miniature adults",
			class: "Insect"
		},
		"Arctic Fox": {
			lifespan: "3-6 years in the wild, up to 14 years in captivity",
			habitat: "Found in Arctic and subarctic regions, including tundra, coastal areas, and mountains",
			weight: "3-8 kg",
			size: "46-68 cm in length, not including tail",
			food: "Omnivorous: feeds on small mammals, birds, eggs, fish, berries, and carrion",
			species: "Vulpes lagopus",
			color: "White or blue-gray in winter for Arctic populations, brown or gray in summer; transitional phases also occur",
			reproduction: "Ovoviviparous",
			offsprings: "Females give birth to 5-8 pups in spring; pups are cared for in underground dens",
			class: "Mammal"
		},
		"Florida Panther": {
			lifespan: "8-15 years in the wild",
			habitat: "Found in swamps, forests, and prairies of southern Florida, USA",
			weight: "Female: 29-45 kg, Male: 45-72 kg",
			size: "Length: 180-210 cm including tail, Height: 60-70 cm at the shoulders",
			food: "Carnivorous: primarily feeds on white-tailed deer, but also small mammals, birds, and occasionally livestock",
			species: "Puma concolor coryi",
			color: "Tawny or reddish-brown with lighter underparts; kittens have spots that fade with age",
			reproduction: "Viviparous",
			offsprings: "Females give birth to 1-4 kittens per litter; kittens stay with their mother for up to 2 years",
			class: "Mammal"
		},
		Aardvark: {
			name: "Aardvark",
			lifespan: "23 years",
			habitat: "Savannahs, grasslands, woodlands",
			weight: "60 kg",
			size: "1.3 m",
			food: "Ants and termites",
			species: "Orycteropus afer",
			color: "Pale yellow or grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		alpaca: {
			name: "Alpaca",
			lifespan: "15-20 years",
			habitat: "Mountainous regions of South America",
			weight: "55-65 kg",
			size: "90-100 cm tall",
			food: "Grasses, hay, and sometimes grains",
			species: "Vicugna pacos",
			color: "Various colors including white, brown, and black",
			reproduction: "Viviparous",
			offsprings: "1 cria (baby alpaca)",
			class: "Mammal"
		},
		ant: {
			name: "Ant",
			lifespan: "Several weeks to several years depending on species",
			habitat: "Various terrestrial habitats including forests, grasslands, and urban areas",
			weight: "0.1-5 mg depending on species",
			size: "1-50 mm depending on species",
			food: "Omnivorous: scavenges for dead insects, nectar, seeds, fungi",
			species: "Formicidae family",
			color: "Varies by species: black, brown, red, or yellow",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: from a few to thousands of eggs per queen",
			class: "Insect"
		},
		badger: {
			name: "Badger",
			lifespan: "4-10 years in the wild, up to 14 years in captivity",
			habitat: "Forests, grasslands, deserts",
			weight: "5-15 kg",
			size: "0.6-0.9 m long",
			food: "Omnivorous: insects, small mammals, birds, fruits, roots",
			species: "Meles and Taxidea genera",
			color: "Gray to black with distinctive white facial markings",
			reproduction: "Viviparous",
			offsprings: "1-5 cubs per litter",
			class: "Mammal"
		},
		Beaver: {
			name: "Beaver",
			lifespan: "10-15 years in the wild, up to 20 years in captivity",
			habitat: "Rivers, streams, lakes, and ponds",
			weight: "16-32 kg",
			size: "0.9-1.4 m long including tail",
			food: "Herbivorous: bark, twigs, leaves, aquatic plants",
			species: "Castor genus",
			color: "Brown fur with webbed hind feet and flat tail",
			reproduction: "Viviparous",
			offsprings: "2-4 kits per litter",
			class: "Mammal"
		},
		bee: {
			name: "Bee",
			lifespan: "4-6 weeks for worker bees, several months for queen bees",
			habitat: "Varied habitats including gardens, meadows, and forests",
			weight: "Approximately 100 mg",
			size: "10-20 mm depending on species",
			food: "Herbivorous: collects pollen and nectar from flowers",
			species: "Anthophila order",
			color: "Varies by species: yellow and black stripes, or metallic green or blue",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: up to thousands of eggs per queen",
			class: "Insect"
		},
		bison: {
			name: "Bison",
			lifespan: "15-20 years",
			habitat: "Grasslands, prairies, forests",
			weight: "500-1000 kg",
			size: "1.5-2 m tall at the shoulder",
			food: "Grasses, herbs, shrubs",
			species: "Bison bison (American bison)",
			color: "Dark brown to black",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		blue_morpho_butterfly: {
			name: "Blue Morpho Butterfly",
			lifespan: "2-3 weeks as adults",
			habitat: "Tropical rainforests of Central and South America",
			weight: "0.5-0.7 g",
			size: "12-20 cm wingspan",
			food: "Herbivorous: primarily feeds on rotting fruits, tree sap, and nectar",
			species: "Morpho genus",
			color: "Iridescent blue wings with brown undersides",
			reproduction: "Egg-laying",
			offsprings: "Hundreds of eggs laid individually on host plants",
			class: "Insect"
		},
		Bobcat: {
			name: "Bobcat",
			lifespan: "10-12 years in the wild, up to 25 years in captivity",
			habitat: "Forests, swamps, deserts, and urban areas",
			weight: "6-12 kg",
			size: "0.5-0.8 m long",
			food: "Carnivorous: small mammals, birds, rabbits, and rodents",
			species: "Lynx rufus",
			color: "Spotted or streaked coat, usually brownish-red to grayish-brown",
			reproduction: "Viviparous",
			offsprings: "1-6 kittens per litter",
			class: "Mammal"
		},
		buffalo: {
			name: "Buffalo",
			lifespan: "10-20 years",
			habitat: "Grasslands, savannas, woodlands",
			weight: "500-900 kg",
			size: "1.5-1.8 m tall at the shoulder",
			food: "Grasses, herbs, shrubs",
			species: "Syncerus caffer (Cape buffalo)",
			color: "Dark brown to black",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		Bumblebee: {
			name: "Bumblebee",
			lifespan: "4-6 weeks for worker bees, several months for queen bees",
			habitat: "Varied habitats including gardens, meadows, and forests",
			weight: "Approximately 300 mg",
			size: "10-23 mm depending on species",
			food: "Herbivorous: collects pollen and nectar from flowers",
			species: "Bombus genus",
			color: "Varies by species: black and yellow stripes, or orange and black",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: up to hundreds of eggs per queen",
			class: "Insect"
		},
		camel: {
			name: "Camel",
			lifespan: "40-50 years",
			habitat: "Deserts, arid regions",
			weight: "400-600 kg",
			size: "1.8-2.2 m tall at the shoulder",
			food: "Grasses, grains, leaves",
			species: "Camelus",
			color: "Light brown to dark brown",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		Capybara: {
			name: "Capybara",
			lifespan: "8-10 years in the wild, up to 12 years in captivity",
			habitat: "Semi-aquatic: rivers, lakes, marshes, and forests",
			weight: "35-65 kg",
			size: "0.5-0.6 m tall at the shoulder",
			food: "Herbivorous: grasses, aquatic plants, fruits",
			species: "Hydrochoerus hydrochaeris",
			color: "Brownish-gray fur with a stout body and webbed feet",
			reproduction: "Viviparous",
			offsprings: "2-8 pups per litter",
			class: "Mammal"
		},
		cheetah: {
			name: "Cheetah",
			lifespan: "10-12 years",
			habitat: "Grasslands, savannas",
			weight: "50 kg",
			size: "1.2 m",
			food: "Gazelles, wildebeests calves, impalas",
			species: "Acinonyx jubatus",
			color: "Golden with black spots",
			reproduction: "Viviparous",
			offsprings: "3-5",
			class: "Mammal"
		},
		chimpanzee: {
			name: "Chimpanzee",
			lifespan: "33-40 years",
			habitat: "Tropical forests",
			weight: "40-70 kg",
			size: "1.2 m",
			food: "Fruit, nuts, seeds, insects",
			species: "Pan troglodytes",
			color: "Black",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		Cockroach: {
			name: "Cockroach",
			lifespan: "6 months to 2 years depending on species",
			habitat: "Found worldwide in warm environments, often in homes and buildings",
			weight: "3-50 g depending on species",
			size: "10-50 mm depending on species",
			food: "Omnivorous: scavenges on organic matter, food scraps, and even glue",
			species: "Blattodea order",
			color: "Varies by species: typically brown or black",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can produce several hundred to thousands of eggs",
			class: "Insect"
		},
		cricket: {
			name: "Cricket",
			lifespan: "1-2 years depending on species",
			habitat: "Grasslands, forests, and urban areas",
			weight: "0.5-3 g depending on species",
			size: "2-5 cm",
			food: "Omnivorous: eats plants, fungi, and occasionally other insects",
			species: "Gryllidae family",
			color: "Varies by species: typically brown or black",
			reproduction: "Egg-laying",
			offsprings: "Up to 150 eggs laid in soil or vegetation",
			class: "Insect"
		},
		Earwig: {
			name: "Earwig",
			lifespan: "1-3 years depending on species",
			habitat: "Moist areas such as gardens, under rocks, and in rotting wood",
			weight: "0.1-1 g depending on species",
			size: "10-50 mm including pincers",
			food: "Omnivorous: feeds on plants, insects, and decaying organic matter",
			species: "Dermaptera order",
			color: "Dark brown or black with reddish-brown appendages",
			reproduction: "Egg-laying",
			offsprings: "Up to 80 eggs laid in soil or debris",
			class: "Insect"
		},
		elephant: {
			name: "Elephant",
			lifespan: "60-70 years",
			habitat: "Savannah and forest",
			weight: "6000 kg",
			size: "3 m",
			food: "Grass, leaves",
			species: "Loxodonta",
			color: "Grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		flamingo: {
			name: "Flamingo",
			lifespan: "20-30 years in the wild, up to 60 years in captivity",
			habitat: "Shallow lakes, lagoons, and coastal mudflats",
			weight: "2-4 kg",
			size: "1.1-1.5 m tall",
			food: "Algae, crustaceans, small fish",
			species: "Phoenicopteridae",
			color: "Pink to reddish-orange",
			reproduction: "Oviparous",
			offsprings: "1 chick",
			class: "Bird"
		},
		flea: {
			name: "Flea",
			lifespan: "2-3 months",
			habitat: "Found worldwide, often in homes, on pets, and in wildlife habitats",
			weight: "Varies by species, typically less than 1 mg",
			size: "1-4 mm",
			food: "Parasitic: blood of mammals and birds",
			species: "Siphonaptera order",
			color: "Dark brown to reddish-brown",
			reproduction: "Egg-laying",
			offsprings: "Several hundred eggs laid in bedding or host animal fur",
			class: "Insect"
		},
		fire_ant: {
			name: "Fire Ant",
			lifespan: "1-3 years",
			habitat: "Mostly in warm climates, often found in urban areas and agricultural lands",
			weight: "0.5-6 mg depending on species",
			size: "2-6 mm",
			food: "Omnivorous: feeds on plant matter, seeds, insects, and other small animals",
			species: "Solenopsis genus",
			color: "Reddish-brown to black",
			reproduction: "Egg-laying",
			offsprings: "Varies by colony size: can produce thousands of eggs per queen",
			class: "Insect"
		},
		fox: {
			name: "Fox",
			lifespan: "2-5 years in the wild, up to 15 years in captivity",
			habitat: "Varied habitats including forests, grasslands, mountains, and urban areas",
			weight: "3-14 kg depending on species",
			size: "0.3-0.5 m tall at the shoulder",
			food: "Small mammals, birds, insects, fruits, and berries",
			species: "Vulpes genus",
			color: "Red, gray, brown, white, or black depending on species",
			reproduction: "Viviparous",
			offsprings: "4-5 pups per litter",
			class: "Mammal"
		},
		giraffe: {
			name: "Giraffe",
			lifespan: "20-25 years",
			habitat: "Savannah",
			weight: "1200 kg",
			size: "4.8 m",
			food: "Leaves, twigs",
			species: "Giraffa camelopardalis",
			color: "Yellow with brown spots",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		gorilla: {
			name: "Gorilla",
			lifespan: "35-40 years",
			habitat: "Forests",
			weight: "160 kg",
			size: "1.7 m",
			food: "Leaves, shoots, fruit",
			species: "Gorilla beringei",
			color: "Black, grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		Grasshopper: {
			name: "Grasshopper",
			lifespan: "1 year or more depending on species",
			habitat: "Grasslands, meadows, and agricultural fields",
			weight: "Up to 2 g depending on species",
			size: "2-11 cm depending on species",
			food: "Herbivorous: primarily eats grasses, leaves, and crops",
			species: "Caelifera suborder",
			color: "Varies by species: typically green, brown, or gray camouflage",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can lay dozens to hundreds of eggs",
			class: "Insect"
		},
		Hedgehog: {
			name: "Hedgehog",
			lifespan: "2-5 years in the wild, up to 7 years in captivity",
			habitat: "Forests, grasslands, urban gardens",
			weight: "0.4-1.2 kg",
			size: "15-30 cm long",
			food: "Insectivorous: insects, worms, small vertebrates",
			species: "Erinaceidae family",
			color: "Spiny coat ranging from brown to white",
			reproduction: "Viviparous",
			offsprings: "2-7 hoglets per litter",
			class: "Mammal"
		},
		hippopotamus: {
			name: "Hippopotamus",
			lifespan: "40-50 years",
			habitat: "Rivers, lakes",
			weight: "1500 kg",
			size: "1.5 m at the shoulder",
			food: "Grasses",
			species: "Hippopotamus amphibius",
			color: "Greyish",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		hyena: {
			name: "Hyena",
			lifespan: "10-25 years",
			habitat: "Savannas, grasslands, and woodlands",
			weight: "50-80 kg",
			size: "0.7-1.3 m tall at the shoulder",
			food: "Scavenger: carrion, but also hunt small to medium-sized animals",
			species: "Hyaenidae family",
			color: "Spotted or striped coats, varying in color from light grey to dark brown",
			reproduction: "Viviparous",
			offsprings: "1-3 cubs per litter",
			class: "Mammal"
		},
		ibex: {
			name: "Ibex",
			lifespan: "10-15 years",
			habitat: "Mountainous regions, cliffs, and rocky slopes",
			weight: "30-120 kg depending on species",
			size: "0.8-1.2 m tall at the shoulder",
			food: "Herbivorous: grasses, herbs, leaves",
			species: "Capra genus",
			color: "Brownish-gray fur with long, curved horns",
			reproduction: "Viviparous",
			offsprings: "1 kid",
			class: "Mammal"
		},
		Imago: {
			name: "Imago",
			lifespan: "Several days to several weeks depending on species",
			habitat: "Varied habitats depending on the insect species",
			weight: "Varies by species",
			size: "Varies by species",
			food: "Varies by species: could be nectar, pollen, or other plant parts",
			species: "Varies by insect species",
			color: "Varies by species",
			reproduction: "Varies by species: can reproduce sexually or asexually",
			offsprings: "Varies by species",
			class: "Insect"
		},
		kangaroo: {
			name: "Kangaroo",
			lifespan: "20 years",
			habitat: "Grasslands, forests, savannahs",
			weight: "85 kg",
			size: "1.6 m",
			food: "Grasses, leaves",
			species: "Macropus",
			color: "Brown, grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		Katydid: {
			name: "Katydid",
			lifespan: "1-2 years depending on species",
			habitat: "Tropical and temperate regions, often in trees and shrubs",
			weight: "1-5 g depending on species",
			size: "2-6 cm depending on species",
			food: "Herbivorous: primarily eats leaves, flowers, and fruits",
			species: "Tettigoniidae family",
			color: "Varies by species: green, brown, or leaf-like camouflage",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can lay dozens to hundreds of eggs",
			class: "Insect"
		},
		koala: {
			name: "Koala",
			lifespan: "13-18 years",
			habitat: "Forest",
			weight: "14 kg",
			size: "85 cm",
			food: "Eucalyptus leaves",
			species: "Phascolarctos cinereus",
			color: "Grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		ladybug: {
			name: "Ladybug",
			lifespan: "1-2 years",
			habitat: "Gardens, meadows, forests, and agricultural fields",
			weight: "Approximately 10 mg",
			size: "5-8 mm",
			food: "Carnivorous: aphids, scale insects, and other small insects",
			species: "Coccinellidae family",
			color: "Red or orange with black spots, or black with red spots",
			reproduction: "Egg-laying",
			offsprings: "Up to hundreds of eggs",
			class: "Insect"
		},
		leopard: {
			name: "Leopard",
			lifespan: "12-17 years",
			habitat: "Forests, savannas, mountains, and grasslands",
			weight: "60 kg",
			size: "1.3 m",
			food: "Deer, antelopes, rodents",
			species: "Panthera pardus",
			color: "Golden with black spots",
			reproduction: "Viviparous",
			offsprings: "2-3",
			class: "Mammal"
		},
		lion: {
			name: "Lion",
			lifespan: "10-14 years in the wild, up to 20 years in captivity",
			habitat: "Grasslands, savannas, dense scrub, and open woodlands",
			weight: "190 kg for males, 130 kg for females",
			size: "1.2 m at the shoulder",
			food: "Large ungulates such as zebras, antelopes, and wildebeests",
			species: "Panthera leo",
			color: "Tawny yellow coat",
			reproduction: "Viviparous",
			offsprings: "2-3 cubs",
			class: "Mammal"
		},
		llama: {
			name: "Llama",
			lifespan: "15-25 years",
			habitat: "Mountainous regions of South America",
			weight: "130-200 kg",
			size: "1.7-1.8 m tall",
			food: "Grasses, hay, and occasionally grains",
			species: "Lama glama",
			color: "Various colors including white, brown, and black",
			reproduction: "Viviparous",
			offsprings: "1 cria (baby llama)",
			class: "Mammal"
		},
		lynx: {
			name: "Lynx",
			lifespan: "10-15 years in the wild, up to 25 years in captivity",
			habitat: "Forests, tundra, and mountainous regions",
			weight: "8-18 kg depending on species",
			size: "0.5-0.8 m tall at the shoulder",
			food: "Carnivorous: small to medium-sized mammals, birds",
			species: "Lynx genus",
			color: "Light brown to gray fur with tufted ears and short tail",
			reproduction: "Viviparous",
			offsprings: "1-4 kittens per litter",
			class: "Mammal"
		},
		meerkat: {
			name: "Meerkat",
			lifespan: "12-14 years in captivity",
			habitat: "Open, arid habitats like savannas and grasslands",
			weight: "0.7-1 kg",
			size: "25-35 cm",
			food: "Insects, small vertebrates, eggs, roots",
			species: "Suricata suricatta",
			color: "Greyish to tan with darker bands",
			reproduction: "Viviparous",
			offsprings: "2-5 pups per litter",
			class: "Mammal"
		},
		mongoose: {
			name: "Mongoose",
			lifespan: "6-10 years in the wild, up to 20 years in captivity",
			habitat: "Various habitats including forests, savannas, and grasslands",
			weight: "0.3-5 kg depending on species",
			size: "0.2-0.6 m long",
			food: "Omnivorous: insects, small mammals, birds, eggs, fruits",
			species: "Herpestidae family",
			color: "Brown, gray, or yellowish fur",
			reproduction: "Viviparous",
			offsprings: "2-4 pups per litter",
			class: "Mammal"
		},
		Moth: {
			name: "Moth",
			lifespan: "1-2 months depending on species",
			habitat: "Varied habitats including forests, gardens, and urban areas",
			weight: "Varies by species, typically less than 1 g",
			size: "1-5 cm wingspan depending on species",
			food: "Herbivorous: larvae feed on plant material, adults primarily seek nectar",
			species: "Lepidoptera order",
			color: "Varies by species: wide range of colors and patterns",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can lay hundreds of eggs",
			class: "Insect"
		},
		Narwhal: {
			name: "Narwhal",
			lifespan: "50-60 years",
			habitat: "Arctic waters near Canada, Greenland, and Russia",
			weight: "1,500-1,800 kg",
			size: "4-5 m long, including tusk",
			food: "Carnivorous: fish, squid, shrimp",
			species: "Monodon monoceros",
			color: "Mottled grayish-brown skin with a distinctive spiral tusk",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		Orangutan: {
			name: "Orangutan",
			lifespan: "35-45 years in the wild, up to 55 years in captivity",
			habitat: "Tropical rainforests of Borneo and Sumatra",
			weight: "30-90 kg depending on species",
			size: "1.2-1.5 m tall",
			food: "Primarily frugivorous: fruits, leaves, insects",
			species: "Pongo genus",
			color: "Orange to reddish-brown fur",
			reproduction: "Viviparous",
			offsprings: "1 infant",
			class: "Mammal"
		},
		ostrich: {
			name: "Ostrich",
			lifespan: "30-40 years",
			habitat: "Savannas, grasslands, and semi-desert areas",
			weight: "100-130 kg",
			size: "2-2.8 m tall",
			food: "Plants, seeds, and occasionally insects",
			species: "Struthio camelus",
			color: "Mainly brown and white",
			reproduction: "Viviparous",
			offsprings: "4-8 eggs per clutch",
			class: "Bird"
		},
		otter: {
			name: "Otter",
			lifespan: "10-15 years in the wild, up to 25 years in captivity",
			habitat: "Rivers, lakes, coastal areas",
			weight: "5-14 kg",
			size: "0.6-1.3 m long",
			food: "Carnivorous: fish, crustaceans, amphibians",
			species: "Lutrinae family",
			color: "Brown fur with lighter underparts",
			reproduction: "Viviparous",
			offsprings: "1-5 pups per litter",
			class: "Mammal"
		},
		panda: {
			name: "Panda",
			lifespan: "20 years",
			habitat: "Temperate broadleaf and mixed forests",
			weight: "100 kg",
			size: "1.5 m",
			food: "Bamboo",
			species: "Ailuropoda melanoleuca",
			color: "Black and white",
			reproduction: "Viviparous",
			offsprings: "1-2",
			class: "Mammal"
		},
		penguin: {
			name: "Penguin",
			lifespan: "15-20 years",
			habitat: "Marine and coastal",
			weight: "25 kg",
			size: "70 cm",
			food: "Fish, squid",
			species: "Aptenodytes forsteri",
			color: "Black and white",
			reproduction: "Oviparous",
			offsprings: "2",
			class: "Bird"
		},
		Platypus: {
			name: "Platypus",
			lifespan: "15-20 years in the wild, up to 17 years in captivity",
			habitat: "Freshwater rivers, streams, and lakes in eastern Australia and Tasmania",
			weight: "0.7-2.4 kg",
			size: "30-40 cm long",
			food: "Carnivorous: aquatic insects, larvae, and small crustaceans",
			species: "Ornithorhynchus anatinus",
			color: "Dark brown fur with a duck-like bill and webbed feet",
			reproduction: "Oviparous (egg-laying)",
			offsprings: "1-3 eggs per clutch",
			class: "Mammal"
		},
		Porcupine: {
			name: "Porcupine",
			lifespan: "15-20 years",
			habitat: "Forests, deserts, and grasslands",
			weight: "18 kg",
			size: "80 cm",
			food: "Bark, leaves, fruit",
			species: "Erethizon dorsatum",
			color: "Brown or black with sharp spines",
			reproduction: "Viviparous",
			offsprings: "1-2",
			class: "Mammal"
		},
		raccoon: {
			name: "Raccoon",
			lifespan: "2-3 years in the wild, up to 20 years in captivity",
			habitat: "Forests, wetlands, urban areas",
			weight: "5-12 kg",
			size: "0.3-0.6 m long",
			food: "Omnivorous: fruits, nuts, insects, small vertebrates, eggs, garbage",
			species: "Procyon lotor",
			color: "Grayish-brown fur with black facial mask and ringed tail",
			reproduction: "Viviparous",
			offsprings: "2-5 kits per litter",
			class: "Mammal"
		},
		red_panda: {
			name: "Red Panda",
			lifespan: "8-12 years in the wild, up to 14 years in captivity",
			habitat: "Temperate forests in the Himalayas",
			weight: "3-6 kg",
			size: "0.5-0.6 m long including tail",
			food: "Herbivorous: bamboo leaves, berries, fruits",
			species: "Ailurus fulgens",
			color: "Reddish-brown fur with white face markings and ringed tail",
			reproduction: "Viviparous",
			offsprings: "1-4 cubs per litter",
			class: "Mammal"
		},
		rhinoceros: {
			name: "Rhinoceros",
			lifespan: "35-50 years",
			habitat: "Grasslands, savannahs",
			weight: "2300 kg",
			size: "1.8 m",
			food: "Grasses, leaves, branches",
			species: "Rhinocerotidae",
			color: "Grey",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		sea_lion: {
			name: "Sea Lion",
			lifespan: "20-30 years",
			habitat: "Marine",
			weight: "300 kg",
			size: "2.5 m",
			food: "Fish, squid",
			species: "Zalophus californianus",
			color: "Brown",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		seal: {
			name: "Seal",
			lifespan: "20-30 years",
			habitat: "Coastal waters and ice floes of the Arctic and Antarctic",
			weight: "85-300 kg depending on species",
			size: "1.5-3 m long",
			food: "Carnivorous: fish, squid, and crustaceans",
			species: "Phocidae family",
			color: "Varies by species: gray, brown, or spotted patterns",
			reproduction: "Viviparous",
			offsprings: "1 pup",
			class: "Mammal"
		},
		Silverfish: {
			name: "Silverfish",
			lifespan: "2-8 years depending on species",
			habitat: "Dark and damp areas such as basements, kitchens, and bathrooms",
			weight: "Up to 1 g",
			size: "10-20 mm including antennae and tail",
			food: "Detritivorous: feeds on starches, cellulose, and sugars found in paper, books, and fabrics",
			species: "Lepisma saccharina",
			color: "Silvery-gray or bluish-silver scales covering elongated body",
			reproduction: "Egg-laying",
			offsprings: "Up to 60 eggs laid in cracks and crevices",
			class: "Insect"
		},
		skunk: {
			name: "Skunk",
			lifespan: "2-4 years in the wild, up to 10 years in captivity",
			habitat: "Forests, grasslands, urban areas",
			weight: "1.5-4.5 kg",
			size: "0.3-0.4 m long",
			food: "Omnivorous: insects, small vertebrates, fruits, plants",
			species: "Mephitidae family",
			color: "Black with white stripes down the back",
			reproduction: "Viviparous",
			offsprings: "2-10 kits per litter",
			class: "Mammal"
		},
		sloth: {
			name: "Sloth",
			lifespan: "20-30 years",
			habitat: "Tropical rainforests",
			weight: "8 kg",
			size: "60 cm",
			food: "Leaves, fruits, insects",
			species: "Bradypus",
			color: "Brown",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		stick_insect: {
			name: "Stick Insect",
			lifespan: "1-3 years depending on species",
			habitat: "Forests, grasslands, and gardens",
			weight: "0.5-50 g depending on species",
			size: "2-30 cm depending on species",
			food: "Herbivorous: primarily eats leaves and foliage",
			species: "Phasmatodea order",
			color: "Varies by species: brown, green, or mottled to blend with surroundings",
			reproduction: "Egg-laying",
			offsprings: "Varies by species: can lay hundreds of eggs",
			class: "Insect"
		},
		tapir: {
			name: "Tapir",
			lifespan: "25-30 years",
			habitat: "Rainforests, grasslands, and mountains",
			weight: "300 kg",
			size: "2 m",
			food: "Leaves, twigs, fruit",
			species: "Tapirus",
			color: "Varies (typically dark brown, black, or grey)",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		termite: {
			name: "Termite",
			lifespan: "Several years depending on the caste",
			habitat: "Woodlands, forests, and urban areas",
			weight: "Varies by species and caste, typically less than 1 g for workers",
			size: "3-20 mm depending on species and caste",
			food: "Cellulose-rich materials like wood, paper, and plant debris",
			species: "Isoptera order",
			color: "Varies by species: white, cream, brown, or black",
			reproduction: "Egg-laying",
			offsprings: "Millions of eggs per colony, laid by the queen",
			class: "Insect"
		},
		tiger: {
			name: "Tiger",
			lifespan: "10-15 years",
			habitat: "Forest",
			weight: "200 kg",
			size: "3 m",
			food: "Deer, wild boars",
			species: "Panthera tigris",
			color: "Orange with black stripes",
			reproduction: "Viviparous",
			offsprings: "2-4",
			class: "Mammal"
		},
		Walrus: {
			name: "Walrus",
			lifespan: "20-30 years in the wild, up to 40 years in captivity",
			habitat: "Arctic and subarctic regions, often found on ice floes",
			weight: "800-1,700 kg",
			size: "2.2-3.6 m long",
			food: "Carnivorous: benthic invertebrates such as clams and snails",
			species: "Odobenus rosmarus",
			color: "Brown or pinkish skin with large tusks and whiskers",
			reproduction: "Viviparous",
			offsprings: "1 calf",
			class: "Mammal"
		},
		Warthog: {
			name: "Warthog",
			lifespan: "15 years",
			habitat: "Grasslands, savanna, and woodlands",
			weight: "100 kg",
			size: "85 cm at the shoulder",
			food: "Grass, roots, berries",
			species: "Phacochoerus africanus",
			color: "Grey with sparse hair",
			reproduction: "Viviparous",
			offsprings: "2-6",
			class: "Mammal"
		},
		wolf: {
			name: "Wolf",
			lifespan: "6-8 years in the wild, up to 16 years in captivity",
			habitat: "Forests, mountains, grasslands, and arctic tundra",
			weight: "20-80 kg depending on species",
			size: "0.6-0.9 m tall at the shoulder",
			food: "Hunts large ungulates such as deer and elk, also small mammals",
			species: "Canis lupus",
			color: "Gray, brown, black, or white",
			reproduction: "Viviparous",
			offsprings: "4-6 pups per litter",
			class: "Mammal"
		},
		zebra: {
			name: "Zebra",
			lifespan: "25 years",
			habitat: "Grasslands, savannahs",
			weight: "450 kg",
			size: "1.3 m at the shoulder",
			food: "Grasses",
			species: "Equus quagga",
			color: "Black and white stripes",
			reproduction: "Viviparous",
			offsprings: "1",
			class: "Mammal"
		},
		sphynx_cat: {
			name: "Sphynx Cat",
			lifespan: "8-14 years",
			habitat: "Domestic",
			weight: "3-5 kg",
			size: "30-40 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Varies: often appears hairless with skin pigmentation",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		chameleon: {
			name: "Common Chameleon",
			lifespan: "2-10 years depending on species",
			habitat: "Tropical and subtropical forests, savannas",
			weight: "100-200 g",
			size: "15-25 cm",
			food: "Insectivorous: insects, small invertebrates",
			species: "Chamaeleo chamaeleon",
			color: "Varies: green, brown, can change color for camouflage and communication",
			reproduction: "Oviparous",
			offsprings: "20-40 eggs per clutch",
			class: "Reptile"
		},
		bengal_cat: {
			name: "Bengal Cat",
			lifespan: "12-16 years",
			habitat: "Domestic",
			weight: "4-7 kg",
			size: "35-45 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Spotted or marbled coat with a variety of colors",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		barn_owl: {
			name: "Barn Owl",
			lifespan: "4-10 years in the wild, up to 20 years in captivity",
			habitat: "Open countryside, farmlands, woodlands",
			weight: "400-700 g",
			size: "33-39 cm in length, wingspan 80-95 cm",
			food: "Carnivorous: small mammals, birds, insects",
			species: "Tyto alba",
			color: "Pale, heart-shaped face with a mix of white, golden-brown, and gray feathers",
			reproduction: "Oviparous",
			offsprings: "4-7 eggs per clutch",
			class: "Bird"
		},
		cattle_egret: {
			name: "Cattle Egret",
			lifespan: "10-15 years",
			habitat: "Grasslands, agricultural fields, wetlands",
			weight: "300-400 g",
			size: "46-56 cm in length, wingspan 88-96 cm",
			food: "Insectivorous: insects, especially grasshoppers, and other small invertebrates",
			species: "Bubulcus ibis",
			color: "White with yellow or orange bill and legs, can have buff patches during breeding season",
			reproduction: "Oviparous",
			offsprings: "3-4 eggs per clutch",
			class: "Bird"
		},
		main_coon_cat: {
			name: "Maine Coon Cat",
			lifespan: "12-15 years",
			habitat: "Domestic",
			weight: "5-8 kg (males can be larger)",
			size: "48-100 cm in length including tail",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Variety of colors and patterns, including tabby, solid, bicolor, and more",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		ojos_azules_cat: {
			name: "Ojos Azules Cat",
			lifespan: "12-15 years",
			habitat: "Domestic",
			weight: "3-5 kg",
			size: "30-40 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Variety of colors, notable for striking blue eyes",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		scarlet_tanager: {
			name: "Scarlet Tanager",
			lifespan: "3-5 years in the wild",
			habitat: "Deciduous and mixed woodlands, forests",
			weight: "23-38 g",
			size: "16-19 cm in length, wingspan 25-30 cm",
			food: "Omnivorous: insects, fruits, berries",
			species: "Piranga olivacea",
			color: "Bright red with black wings and tail (males), yellowish-green with darker wings (females)",
			reproduction: "Oviparous",
			offsprings: "3-5 eggs per clutch",
			class: "Bird"
		},
		southern_festoon: {
			name: "Southern Festoon",
			lifespan: "2-3 weeks as adults",
			habitat: "Grasslands, meadows, and open woodlands in Southern Europe",
			weight: "0.5-1 g",
			size: "5-7 cm wingspan",
			food: "Herbivorous: larvae feed on Aristolochia plants, adults feed on nectar",
			species: "Zerynthia polyxena",
			color: "Yellow with black, red, and blue markings",
			reproduction: "Egg-laying",
			offsprings: "Several dozen eggs laid on host plants",
			class: "Insect"
		},
		khao_manee_cat: {
			name: "Khao Manee Cat",
			lifespan: "10-15 years",
			habitat: "Domestic",
			weight: "3-5 kg",
			size: "30-40 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Pure white with striking blue, green, or odd-colored eyes",
			reproduction: "Viviparous",
			offsprings: "4-6 kittens per litter",
			class: "Mammal"
		},
		toucan: {
			name: "Toucan",
			lifespan: "15-20 years",
			habitat: "Tropical and subtropical rainforests in Central and South America",
			weight: "300-700 g depending on species",
			size: "29-63 cm in length including bill",
			food: "Omnivorous: fruits, insects, small reptiles, and eggs",
			species: "Ramphastidae family",
			color: "Brightly colored plumage with a large, colorful bill",
			reproduction: "Oviparous",
			offsprings: "2-4 eggs per clutch",
			class: "Bird"
		},
		bald_eagle: {
			name: "Bald Eagle",
			lifespan: "20-30 years in the wild",
			habitat: "Near large bodies of open water such as lakes, rivers, and coastal regions in North America",
			weight: "3-6.3 kg",
			size: "70-102 cm in length, wingspan 180-230 cm",
			food: "Carnivorous: primarily fish, but also small mammals, birds, and carrion",
			species: "Haliaeetus leucocephalus",
			color: "Dark brown body with a white head and tail, yellow beak and feet",
			reproduction: "Oviparous",
			offsprings: "1-3 eggs per clutch",
			class: "Bird"
		},
		Axolotl: {
			name: "Axolotl",
			lifespan: "10-15 years in captivity",
			habitat: "Freshwater lakes and canals in Mexico, particularly Lake Xochimilco",
			weight: "60-200 g",
			size: "15-45 cm",
			food: "Carnivorous: worms, insects, small fish, and other small aquatic animals",
			species: "Ambystoma mexicanum",
			color: "Varies: wild types are usually dark with speckling, while captive-bred can be white, pink, or gold",
			reproduction: "Oviparous",
			offsprings: "100-300 eggs per clutch",
			class: "Amphibian"
		},
		macaw: {
			name: "Macaw",
			lifespan: "30-50 years, some species up to 75 years in captivity",
			habitat: "Tropical rainforests, savannas, and woodlands of Central and South America",
			weight: "900-1200 g depending on species",
			size: "76-100 cm in length including tail",
			food: "Omnivorous: seeds, nuts, fruits, leaves, and occasionally insects",
			species: "Ara genus",
			color: "Brightly colored plumage, often in shades of blue, red, green, and yellow",
			reproduction: "Oviparous",
			offsprings: "2-4 eggs per clutch",
			class: "Bird"
		},
		blue_tit: {
			lifespan: "2-3 years in the wild, up to 15 years in captivity",
			habitat: "Woodlands, gardens, hedgerows, and parks throughout Europe and western Asia",
			weight: "9-12 g",
			size: "12 cm in length, wingspan 17-20 cm",
			food: "Omnivorous: insects, seeds, nuts, and berries",
			species: "Cyanistes caeruleus",
			color: "Blue cap, wings, and tail with yellow underparts and greenish back",
			reproduction: "Oviparous",
			offsprings: "7-12 eggs per clutch",
			class: "Bird"
		},
		"Alpine Ibex": {
			lifespan: "10-14 years in the wild",
			habitat: "Mountainous regions in the European Alps",
			weight: "65-100 kg (males), 45-55 kg (females)",
			size: "1.3-1.5 m in length, 70-90 cm at shoulder height",
			food: "Herbivorous: grasses, herbs, and leaves",
			species: "Capra ibex",
			color: "Brownish-gray with lighter underparts and large, backward-curving horns",
			reproduction: "Viviparous",
			offsprings: "1-2 kids per birth",
			class: "Mammal"
		},
		"Grizzly Bear": {
			lifespan: "20-25 years in the wild, up to 30 years in captivity",
			habitat: "Forests, alpine meadows, and tundra in North America",
			weight: "180-360 kg (males), 130-200 kg (females)",
			size: "1.8-2.4 m in length, 1-1.2 m at shoulder height",
			food: "Omnivorous: berries, roots, salmon, small mammals, and carrion",
			species: "Ursus arctos horribilis",
			color: "Brown with grizzled (gray-tipped) fur",
			reproduction: "Viviparous",
			offsprings: "1-4 cubs per litter",
			class: "Mammal"
		},
		"Giant Swallowtail": {
			lifespan: "6-14 days as adults",
			habitat: "Woodlands, fields, gardens, and citrus groves in North and Central America",
			weight: "0.5-1 g",
			size: "10-16 cm wingspan",
			food: "Herbivorous: larvae feed on leaves of citrus plants, adults feed on nectar from flowers",
			species: "Papilio cresphontes",
			color: "Black wings with yellow bands and spots, underside is yellow with blue and red spots",
			reproduction: "Oviparous",
			offsprings: "Several hundred eggs laid singly on host plants",
			class: "Insect"
		},
		"Blue Morpho": {
			lifespan: "115 days (about 4 months) from egg to adult",
			habitat: "Tropical rainforests in Central and South America",
			weight: "0.3-0.5 g",
			size: "15-20 cm wingspan",
			food: "Herbivorous: larvae feed on leaves, adults feed on rotting fruit, fungi, and tree sap",
			species: "Morpho menelaus",
			color: "Brilliant blue upper wings, brown underside with eyespots for camouflage",
			reproduction: "Oviparous",
			offsprings: "Several hundred eggs laid singly on host plants",
			class: "Insect"
		},
		"Domestic Water Buffalo": {
			lifespan: "18-25 years",
			habitat: "Wetlands, swamps, and agricultural lands in tropical and subtropical regions",
			weight: "400-900 kg (females), 700-1200 kg (males)",
			size: "2.4-3 m in length, 1.5-1.8 m at shoulder height",
			food: "Herbivorous: grasses, aquatic plants, and crop residues",
			species: "Bubalus bubalis",
			color: "Generally dark gray to black",
			reproduction: "Viviparous",
			offsprings: "1 calf per birth",
			class: "Mammal"
		},
		"Tabby Cat": {
			lifespan: "12-15 years on average",
			habitat: "Domestic",
			weight: "3.6-7.2 kg (males), 3.2-5.4 kg (females)",
			size: "23-25 cm in height, 46-51 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Varies: distinct coat pattern with stripes, swirls, or spots",
			reproduction: "Viviparous",
			offsprings: "3-5 kittens per litter on average",
			class: "Mammal"
		},
		"Persian Cat": {
			lifespan: "10-15 years on average, some live up to 20 years",
			habitat: "Domestic",
			weight: "3.6-6.8 kg (males), 3.2-5.4 kg (females)",
			size: "25-30 cm in height, 30-50 cm in length",
			food: "Carnivorous: commercial cat food, meat",
			species: "Felis catus",
			color: "Varies: long-haired breed with various coat colors and patterns",
			reproduction: "Viviparous",
			offsprings: "3-4 kittens per litter on average",
			class: "Mammal"
		},
		"Siberian Husky": {
			lifespan: "12-15 years on average",
			habitat: "Domestic",
			weight: "20-27 kg (males), 16-23 kg (females)",
			size: "50-60 cm in height, 50-60 cm in length",
			food: "Omnivorous: commercial dog food, meat",
			species: "Canis lupus familiaris",
			color: "Varies: commonly black, white, gray, or a mix with distinctive facial markings",
			reproduction: "Viviparous",
			offsprings: "4-6 puppies per litter on average",
			class: "Mammal"
		},
		"Chinese Alligator": {
			lifespan: "50-70 years in the wild, up to 80 years in captivity",
			habitat: "Freshwater habitats such as rivers, streams, and marshes in eastern China",
			weight: "20-45 kg",
			size: "1.5-2.1 m in length",
			food: "Carnivorous: fish, amphibians, small mammals, and birds",
			species: "Alligator sinensis",
			color: "Dark olive-green with lighter underbelly and distinct bony plates on the head",
			reproduction: "Oviparous",
			offsprings: "10-50 eggs per nest, depending on environmental conditions",
			class: "Reptile"
		},
		"Pacific Orange-spine Unicornfish": {
			lifespan: "Unknown (varies among species)",
			habitat: "Coral reefs and rocky areas in the Pacific Ocean, particularly around Hawaii and French Polynesia",
			weight: "Up to 1 kg",
			size: "30-50 cm in length",
			food: "Herbivorous: primarily algae and small invertebrates",
			species: "Naso lituratus (also includes other species in the Naso genus)",
			color: "Bright blue body with orange spots, a distinctive horn-like projection from its forehead",
			reproduction: "Oviparous",
			offsprings: "Varies depending on species",
			class: "Fish"
		},
		"Ocellaris Clownfish": {
			lifespan: "6-10 years in the wild, up to 20 years in captivity",
			habitat: "Coral reefs and lagoons in the Indo-Pacific region",
			weight: "Up to 100 g",
			size: "7-12 cm in length",
			food: "Omnivorous: algae, zooplankton, and small crustaceans",
			species: "Amphiprion ocellaris",
			color: "Bright orange with white bands outlined in black",
			reproduction: "Oviparous",
			offsprings: "Hundreds of eggs per clutch, cared for by the male",
			class: "Fish"
		},
		"Sandbar Shark": {
			lifespan: "20-30 years",
			habitat: "Temperate and tropical waters worldwide, typically found near continental and insular shelves",
			weight: "Up to 159 kg (males), up to 91 kg (females)",
			size: "2-2.5 m in length",
			food: "Carnivorous: fish, rays, crustaceans, and cephalopods",
			species: "Carcharhinus plumbeus",
			color: "Gray to brownish-gray upper body with a white underside",
			reproduction: "Viviparous",
			offsprings: "1-14 pups per litter, with a 1-3 year reproductive cycle",
			class: "Fish"
		},
		"African Bush Elephant": {
			lifespan: "Up to 60-70 years in the wild",
			habitat: "Various habitats including savannas, forests, and deserts in sub-Saharan Africa",
			weight: "Up to 6,000 kg (male), up to 3,000-4,000 kg (female)",
			size: "2.5-4 m tall at the shoulder, 6-7 m in length",
			food: "Herbivorous: primarily grasses, leaves, fruits, and bark",
			species: "Loxodonta africana",
			color: "Gray to brownish-gray skin",
			reproduction: "Viviparous",
			offsprings: "1 calf every 2-4 years",
			class: "Mammal"
		},
		"Yellow Tang": {
			lifespan: "7-10 years in the wild, up to 20 years in captivity",
			habitat: "Reef environments and shallow lagoons in the Pacific Ocean, particularly around Hawaii",
			weight: "Up to 100 g",
			size: "12-15 cm in length",
			food: "Herbivorous: primarily algae and small invertebrates",
			species: "Zebrasoma flavescens",
			color: "Vibrant yellow body with a white spine along the base of the tail fin",
			reproduction: "Oviparous",
			offsprings: "Eggs hatch into larvae which eventually settle and develop into adults",
			class: "Fish"
		},
		"Siamese Fighting Fish": {
			lifespan: "2-5 years on average",
			habitat: "Freshwater habitats such as rice paddies, shallow ponds, and slow-moving streams in Southeast Asia",
			weight: "Up to 15 g",
			size: "6-8 cm in length",
			food: "Carnivorous: primarily insects, larvae, and small crustaceans",
			species: "Betta splendens",
			color: "Vibrant colors and elaborate fins, including shades of blue, red, green, and white",
			reproduction: "Oviparous",
			offsprings: "Up to several hundred eggs laid in bubble nests by the male",
			class: "Fish"
		},
		"Spinner Dolphin": {
			lifespan: "20-25 years on average",
			habitat: "Tropical and subtropical waters worldwide, often near continental shelves and islands",
			weight: "Up to 80-100 kg",
			size: "1.7-2.3 m in length",
			food: "Carnivorous: primarily fish, squid, and small crustaceans",
			species: "Stenella longirostris",
			color: "Gray with a distinct three-part color pattern: dark gray on top, light gray on the sides, and white underside",
			reproduction: "Viviparous",
			offsprings: "Usually 1 calf per birth",
			class: "Mammal"
		},
		"Callanthiidae": {
			lifespan: "Varies among species",
			habitat: "Deep-sea environments, typically found on continental slopes and seamounts",
			weight: "Varies among species",
			size: "Varies among species",
			food: "Carnivorous: feeds on small fish, crustaceans, and mollusks",
			species: "Various species within the Callanthiidae family",
			color: "Varies among species, often brightly colored with distinctive patterns",
			reproduction: "Oviparous",
			offsprings: "Varies among species",
			class: "Fish"
		},
		"Copperband Butterflyfish": {
			lifespan: "5-7 years in the wild",
			habitat: "Tropical coral reefs and lagoons in the Indo-Pacific region",
			weight: "Up to 100 g",
			size: "15-20 cm in length",
			food: "Omnivorous: feeds primarily on coral polyps, small invertebrates, and algae",
			species: "Chelmon rostratus",
			color: "White body with black vertical bands and a prominent coppery-orange band across its face",
			reproduction: "Oviparous",
			offsprings: "Eggs are released into the water and develop into larvae",
			class: "Fish"
		},
		"Nile Crocodile": {
			lifespan: "40-50 years in the wild, up to 80-100 years in captivity",
			habitat: "Freshwater habitats such as rivers, lakes, and marshes in sub-Saharan Africa",
			weight: "Up to 225-550 kg",
			size: "3.5-5 m in length, with some individuals reaching up to 6 m",
			food: "Carnivorous: fish, reptiles, birds, and mammals",
			species: "Crocodylus niloticus",
			color: "Dark bronze-green with black spots and bands on the body and tail",
			reproduction: "Oviparous",
			offsprings: "20-80 eggs per nest, with hatchlings cared for by the female",
			class: "Reptile"
		},
		"Intellagama lesueurii": {
			lifespan: "10-20 years in the wild, up to 30 years in captivity",
			habitat: "Eastern Australia, inhabiting forests, woodlands, and near water sources such as rivers and lakes",
			weight: "300-600 grams",
			size: "60-80 cm in length, including the tail",
			food: "Omnivorous: diet includes insects, small mammals, fish, and vegetation",
			species: "Intellagama lesueurii",
			color: "Varies; typically green to brown with dark bands and markings, juveniles often have brighter colors",
			reproduction: "Oviparous",
			offsprings: "6-18 eggs per clutch",
			class: "Reptile"
		},
		"Red Lionfish": {
			lifespan: "5-10 years in the wild",
			habitat: "Coral reefs and rocky crevices in the Indo-Pacific region, also found in the Atlantic Ocean",
			weight: "Up to 1 kg",
			size: "25-38 cm in length",
			food: "Carnivorous: feeds on small fish, crustaceans, and mollusks",
			species: "Pterois volitans (and Pterois miles for some similar species)",
			color: "Red to dark brown with white stripes and spines",
			reproduction: "Oviparous",
			offsprings: "Several thousands of eggs released into the water column",
			class: "Fish"
		},
		bee: {
			lifespan: "Varies among species; typically several weeks to a few months",
			habitat: "Varies widely; bees are found on every continent except Antarctica, predominantly in gardens, forests, and agricultural areas",
			weight: "Approximately 0.1-1 gram",
			size: "Approximately 0.8-2.5 cm in length",
			food: "Herbivorous: primarily feeds on nectar and pollen collected from flowers",
			species: "There are over 20,000 known species of bees, belonging to the superfamily Apoidea",
			color: "Varies among species; commonly yellow and black striped, but can range from metallic blue-green to solid black",
			reproduction: "Oviparous",
			offsprings: "Varies among species; a single queen bee can lay up to 2,000 eggs per day in peak season",
			class: "Insect"
		},
		hare: {
			lifespan: "1-9 years, depending on species and environmental factors",
			habitat: "Varies widely; found in grasslands, meadows, woodlands, and tundra regions across Europe, Asia, Africa, and North America",
			weight: "2-5 kg",
			size: "40-70 cm in length",
			food: "Herbivorous: primarily feeds on grasses, herbs, and twigs",
			species: "Several species within the genus Lepus",
			color: "Varies among species; typically shades of brown or gray, with some species exhibiting seasonal color changes",
			reproduction: "Viviparous",
			offsprings: "1-8 leverets per litter, depending on species and environmental conditions",
			class: "Mammal"
		},
		"Camargue Horse": {
			lifespan: "20-30 years",
			habitat: "Camargue region in the south of France, primarily found in wetlands, marshes, and salt flats",
			weight: "400-500 kg",
			size: "130-150 cm at the withers",
			food: "Herbivorous: primarily feeds on grasses, reeds, and other vegetation found in its habitat",
			species: "Equus ferus caballus",
			color: "Gray to white coat, known for its light coloration which helps with heat reflection in its hot and sunny habitat",
			reproduction: "Viviparous",
			offsprings: "1 foal per birth",
			class: "Mammal"
		},
		"Cotentin Donkey": {
			lifespan: "25-35 years",
			habitat: "Originally from the Cotentin Peninsula in Normandy, France; found in various habitats including pastures and meadows",
			weight: "300-400 kg",
			size: "110-130 cm at the withers",
			food: "Herbivorous: primarily feeds on grasses, hay, and other vegetation",
			species: "Equus africanus asinus",
			color: "Gray to brown coat, often with a lighter underbelly",
			reproduction: "Viviparous",
			offsprings: "1 foal per birth",
			class: "Mammal"
		},
		"Mule": {
			lifespan: "25-30 years",
			habitat: "Varies widely depending on human activity; found in agricultural settings, ranches, and sometimes wild environments",
			weight: "350-500 kg",
			size: "140-160 cm at the withers",
			food: "Herbivorous: primarily feeds on grasses, hay, and grains",
			species: "Equus asinus x Equus caballus hybrid",
			color: "Varies widely depending on the parent species; can be any color found in horses or donkeys",
			reproduction: "Sterile hybrid; mules are typically sterile and cannot reproduce",
			offsprings: "Mules do not reproduce; they are the offspring of a male donkey (jack) and a female horse (mare)",
			class: "Mammal"
		},
		"Northern Giraffe": {
			lifespan: "20-25 years in the wild, up to 30 years in captivity",
			habitat: "Savannas, woodlands, and dry forests in parts of sub-Saharan Africa, including countries like Kenya, Uganda, and South Sudan",
			weight: "800-1,400 kg",
			size: "5-6 m tall at the shoulder, with males taller than females",
			food: "Herbivorous: primarily feeds on leaves, shoots, and fruits from acacia and other trees",
			species: "Giraffa camelopardalis",
			color: "Yellowish to brown coat with irregular patches of darker spots; northern giraffes have lighter coats than their southern counterparts",
			reproduction: "Viviparous",
			offsprings: "Usually one calf per birth, after a gestation period of about 15 months",
			class: "Mammal"
		},
		"African Leopard": {
			lifespan: "12-17 years in the wild, up to 23 years in captivity",
			habitat: "Varies widely across sub-Saharan Africa, including forests, savannas, and mountainous regions",
			weight: "30-70 kg",
			size: "1.5-2.1 m in length, with a tail length of 0.6-1.1 m",
			food: "Carnivorous: hunts a variety of prey including antelopes, gazelles, and smaller mammals",
			species: "Panthera pardus",
			color: "Yellow to gold with black rosettes and spots; the coloration helps provide camouflage in different habitats",
			reproduction: "Viviparous",
			offsprings: "2-3 cubs per litter, born after a gestation period of approximately 90-105 days",
			class: "Mammal"
		},
		"Barbary Lion": {
			lifespan: "Estimated to be similar to other lion subspecies, around 10-14 years in the wild",
			habitat: "Historically found in North Africa, particularly in the Atlas Mountains and surrounding regions",
			weight: "200-250 kg for males, slightly smaller for females",
			size: "2.5-3.3 m in length, including tail",
			food: "Carnivorous: hunts large mammals such as gazelles, zebras, and buffalo",
			species: "Panthera leo leo",
			color: "Similar to other lion subspecies; tawny yellow to reddish-brown coat with a mane that varies in color from dark to blond",
			reproduction: "Viviparous",
			offsprings: "2-4 cubs per litter, born after a gestation period of approximately 100-110 days",
			class: "Mammal"
		},
		"Bengal Tiger": {
			lifespan: "10-15 years in the wild, up to 20-25 years in captivity",
			habitat: "Varies across India, Bangladesh, Nepal, Bhutan, and Myanmar; habitats include tropical and subtropical forests, mangroves, and grasslands",
			weight: "180-258 kg for males, 100-160 kg for females",
			size: "2.4-3 m in length, including tail",
			food: "Carnivorous: hunts large prey such as deer, wild boar, and occasionally smaller mammals and birds",
			species: "Panthera tigris tigris",
			color: "Orange to yellow coat with black stripes; the pattern of stripes is unique to each tiger, serving as camouflage in their habitat",
			reproduction: "Viviparous",
			offsprings: "2-4 cubs per litter, born after a gestation period of approximately 100-110 days",
			class: "Mammal"
		},
		"Jewel Bug": {
			lifespan: "Varies among species; typically several months to a year",
			habitat: "Found in tropical and subtropical regions worldwide, often on plants, bushes, and trees",
			weight: "Varies among species; generally less than 1 gram",
			size: "Approximately 1-2 cm in length",
			food: "Herbivorous: feeds on plant sap, often from seeds, flowers, and stems",
			species: "Family Scutelleridae, which includes numerous genera and species",
			color: "Highly variable and often vibrant, with metallic or iridescent hues of green, blue, red, and orange",
			reproduction: "Oviparous",
			offsprings: "Varies among species; eggs laid on plants and undergo several nymphal stages before reaching adulthood",
			class: "Insect"
		},
		"Hoplia": {
			lifespan: "Varies among species; typically several weeks to a few months",
			habitat: "Found in various habitats with flowering plants, including gardens, meadows, and grasslands",
			weight: "Varies among species; generally less than 1 gram",
			size: "Approximately 1-2 cm in length",
			food: "Herbivorous: feeds primarily on pollen, nectar, and petals of flowers",
			species: "Genus Hoplia, which includes numerous species of flower beetles",
			color: "Varies among species; often metallic green, blue, or brown with patterns of spots or stripes",
			reproduction: "Oviparous",
			offsprings: "Varies among species; eggs laid near flowers, larvae feed on plant material",
			class: "Insect"
		},
		"Asian Lady Beetle": {
			lifespan: "1-3 years",
			habitat: "Found in various habitats including gardens, agricultural fields, forests, and urban areas",
			weight: "Less than 1 gram",
			size: "5-8 mm in length",
			food: "Omnivorous: feeds on aphids, scale insects, and other soft-bodied insects, as well as pollen and nectar",
			species: "Harmonia axyridis",
			color: "Highly variable; typically orange to red with black spots, but can also be yellow to black or even melanistic (black with red spots)",
			reproduction: "Oviparous",
			offsprings: "Females can lay up to 1,500 eggs in their lifetime",
			class: "Insect"
		},
		"Scarlet Lily Beetle": {
			lifespan: "1-2 years",
			habitat: "Found in gardens, parks, and other areas where lilies and fritillaries are cultivated",
			weight: "Less than 1 gram",
			size: "Approximately 6-8 mm in length",
			food: "Herbivorous: feeds on the leaves, stems, and flowers of lilies and fritillaries",
			species: "Lilioceris lilii",
			color: "Bright scarlet red with black legs, head, antennae, and undersides",
			reproduction: "Oviparous",
			offsprings: "Females lay clusters of bright orange eggs on the undersides of lily leaves",
			class: "Insect"
		},
		"Southern Black Rhinoceros": {
			lifespan: "30-35 years in the wild, up to 45 years in captivity",
			habitat: "Found in savannas and semi-arid areas of southern Africa, including countries like Namibia, South Africa, Zimbabwe, and Kenya",
			weight: "800-1,400 kg",
			size: "1.4-1.8 m tall at the shoulder",
			food: "Herbivorous: primarily feeds on leaves, branches, and twigs of shrubs and trees",
			species: "Diceros bicornis bicornis",
			color: "Gray to brownish-gray in color, with two distinctive horns on the snout; horns are made of keratin and used for defense and dominance",
			reproduction: "Viviparous",
			offsprings: "Usually one calf per birth, after a gestation period of approximately 15-16 months",
			class: "Mammal"
		},
		"British Shorthair Cat": {
			lifespan: "12-20 years",
			habitat: "Domesticated; found in households and occasionally in breeding facilities",
			weight: "Male: 4.5-7 kg, Female: 3.6-5.4 kg",
			size: "Medium to large size, with males typically larger than females",
			food: "Omnivorous: commercial cat food, meat, and occasionally vegetables",
			species: "Felis catus",
			color: "Wide variety of colors and patterns including solid blue, black, white, tabby, and more",
			reproduction: "Viviparous",
			offsprings: "Varies; a typical litter size ranges from 3-6 kittens",
			class: "Mammal"
		},
		"Wallum Sedge Frog": {
			lifespan: "Up to 5 years",
			habitat: "Found in wetlands, swamps, and heathlands with acidic sandy soils, primarily in eastern Australia",
			weight: "Less than 10 grams",
			size: "3-4 cm in length",
			food: "Insectivorous: feeds on small insects and other invertebrates found in its habitat",
			species: "Litoria olongburensis",
			color: "Variable; typically ranges from light brown to green with darker markings; may change color based on environment and temperature",
			reproduction: "Oviparous",
			offsprings: "Several hundred eggs laid in shallow water, tadpoles undergo metamorphosis to become adult frogs",
			class: "Amphibian"
		},

		armadillo: {
			lifespan: "4-30 years, depending on species",
			habitat: "Grasslands, forests, and semi-deserts",
			weight: "0.5-6 kg, depending on species",
			size: "15-75 cm, depending on species",
			food: "Insects, small vertebrates, plants",
			species: "Dasypodidae",
			color: "Brown, grey, or pinkish",
			reproduction: "Viviparous",
			offsprings: "1-12, depending on species",
			class: "Mammal"
		},

	};
	return old_details;
}

function getAnimals() {
	const animals = `
		Earwig,Cockroach,Grasshopper,Silverfish,Moth
		Mosquito
		Fly
		Bee
		Wasp
		Beetle
	`;
}
//#endregion

//#region 11.6.24

function menuCloseSimple() { closeLeftSidebar(); clearMain(); } //	window.onresize = null;}

async function onclickSimple() {
	let name = valf(localStorage.getItem('sisi'), 'tierspiel'); //console.log(name);
	simpleSidebar(150);
	mAdjustPage(150);
	let div = mDom100('dMain');
	let sisi = UI.simple = { name, div };
	let [w, h, bg, fg] = [sisi.w, sisi.h, sisi.bg, sisi.fg] = [mGetStyle(div, 'w'), mGetStyle(div, 'h'), getNavBg(), getThemeFg()];

	let d1 = mDom(div); mCenterFlex(d1)
	let dMenu = sisi.dMenu = mDom(d1, { gap: 10, padding: 12 }, { className: 'title' }); mFlexVWrap(dMenu);
	let dInstruction = sisi.dInstruction = mDom(d1, { w100: true, align: 'center', fg }, { html: '* press Control key when hovering to magnify image! *' })

	let dBatch = sisi.dBatch = mDom(d1);
	let cellStyles = { bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' };
	let o = createBatchGridCells(dBatch, w * .9, h * .9, cellStyles);
	addKeys(o, sisi);

	mStyle(dInstruction, { w: mGetStyle(sisi.dGrid, 'w') });

	mLinebreak(d1)
	sisi.dPageIndex = mDom(d1, { fg });

	simpleInit(name, sisi);

	sisi.isOpen = true;
	sisi.dInstruction.innerHTML = '* drag images into the shaded area *'
	let grid = sisi.dGrid;
	mStyle(grid, { bg: '#00000030' })
	enableDataDrop(grid, simpleOnDropImage)
	//rBgFor(sisi.div,sisi.dMenu,sisi.dBatch,sisi.dGrid); //damit man sieht was der macht mit div sizing
}
async function onclickSimpleClearSelections(ev) { simpleClearSelections(); }

async function onclickSimpleNew(name) {
	if (nundef(name)) name = await mGather(iDiv(UI.simpleCommands.simpleNew));
	if (!name) return;
	name = normalizeString(name);
	if (isEmpty(name)) {
		showMessage(`ERROR! you need to enter a valid name!!!!`);
		return;
	}
	if (M.collections.includes(name)) {
		showMessage(`collection ${name} already exists!`);
	}
	M.collections.push(name); M.collections.sort();
	if (name != UI.simple) simpleInit(name, UI.simple);
}
async function onclickSimpleRemove() {
	let selist = UI.selectedImages;
	let di = {};
	for (const key of selist) {
		let collname = UI.simple.name;
		if (simpleLocked(collname)) continue;
		let item = M.superdi[key];
		removeInPlace(item.colls, collname);
		di[key] = item;
	}
	if (isEmpty(di)) {
		showMessage(`ERROR: cannot delete selected items!!!`);
		simpleClearSelections();
		return;
	}
	await updateSuperdi(di);
	simpleInit()
}
async function onclickSimpleSelectAll(ev) {
	let sisi = UI.simple;
	for (const cell of sisi.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break;
		mSelect(d);
	}
	for (const k of sisi.keys) { addIf(UI.selectedImages, k); }
	simpleCheckCommands();
}
async function onclickSimpleSelectPage(ev) {
	let sisi = UI.simple;
	for (const cell of sisi.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break;
		mSelect(d);
		let o = sisi.items[d.id];
		addIf(UI.selectedImages, o.key);
	}
	simpleCheckCommands();
}
async function onclickSetAvatar(ev) { await simpleSetAvatar(UI.selectedImages[0]); }

function simpleClearSelections() {
	mClearAllSelections();
	simpleCheckCommands();
}
async function simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi) {
	let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); //console.log('dims', dims);
	let wScale = img.width / wOrig;
	let hScale = img.height / hOrig;
	let d1 = mDom(document.body, { margin: 10 });
	let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)
	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!
	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	let friendly = inpFriendly.value;
	let cats = extractWords(valf(inpCats.value, ''));
	let filename = (isdef(M.superdi[friendly]) ? 'i' + getTimestamp() : friendly) + '.png'; //console.log('filename', filename);
	let o = { image: dataUrl, coll: sisi.name, path: filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${sisi.name}/${filename}`;
	let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [sisi.name] };
	dPopup.remove();
	await simpleOnDroppedItem(item, sisi);
}
function simpleInit(name, sisi) {
	if (nundef(name) && isdef(UI.simple)) { sisi = UI.simple; name = sisi.name; }
	let isReload = isdef(sisi.index) && sisi.name == name;
	if (!isReload) { sisi.index = 0; sisi.pageIndex = 1; sisi.name = name; sisi.filter = null; }

	let list = [];
	if (name == 'all' || isEmpty(name)) { list = Object.keys(M.superdi); }
	else if (isdef(M.byCollection[name])) { list = M.byCollection[name]; }
	else list = [];

	localStorage.setItem('sisi', name)

	let dMenu = sisi.dMenu;
	mClear(dMenu);
	let d = mDom(dMenu); mFlexV(d);
	mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });

	let collNames = M.collections;
	let dlColl = mDatalist(d, collNames, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => { console.log(sisi.name, ev.target.value); simpleInit(ev.target.value, sisi); }
	dlColl.inpElem.value = name;

	list = sortByFunc(list, x => M.superdi[x].friendly);
	sisi.masterKeys = list;
	sisi.keys = sisi.filter ? collFilterImages(sisi, sisi.filter) : list;

	let cats = collectCats(sisi.keys);
	cats.sort();
	d = mDom(dMenu); mFlexV(d);
	let wLabel = sisi.cols < 6 ? 117 : 'auto';
	mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit: true, html: 'Filter:' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>", value: sisi.filter });
	dlCat.inpElem.oninput = ev => {
		let coll = UI.simple;
		let s = ev.target.value.toLowerCase().trim();
		let list = collFilterImages(coll, s);
		coll.keys = list;
		coll.filter = s;
		coll.index = 0; coll.pageIndex = 1; simpleClearSelections();
		simpleShowImageBatch(coll, 0, false);
	};

	d = mDom(dMenu, { gap: 10, align: 'right' });
	mButton('prev', () => simpleShowImageBatch(sisi, -1), d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
	mButton('next', () => simpleShowImageBatch(sisi, 1), d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');
	simpleClearSelections();
	simpleShowImageBatch(sisi);
}
function simpleLocked(collname) {
	if (nundef(collname)) collname = lookup(UI, ['simple', 'name']);
	if (!collname) return true;
	return getUname() != '_unsafe' && ['all', 'amanda', 'emo', 'fa6', 'icon', 'nations', 'users'].includes(collname);
}
async function simpleOnclickItem(ev) {
	let id = evToId(ev);
	let item = UI.simple.items[id]; if (nundef(item)) return;
	let selkey = item.key;
	toggleSelectionOfPicture(iDiv(item), selkey, UI.selectedImages);
	simpleCheckCommands();
}
async function simpleOnclickLabel(ev) {
	evNoBubble(ev);
	let id = evToId(ev); console.log('id', id)
	let o = lookup(UI.simple, ['items', id]);
	if (!o) return;
	console.log('clicked label of', o);
	let [key, elem, collname] = [o.key, o.name, iDiv(o)];

	let newfriendly = await mGather(ev.target);
	if (!newfriendly) return;
	if (isEmpty(newfriendly)) {
		showMessage(`ERROR: name invalid: ${newfriendly}`);
		return;
	}
	console.log('rename friendly to', newfriendly)
	let item = M.superdi[key];
	item.friendly = newfriendly;

	let di = {};
	di[key] = item;
	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	ev.target.innerHTML = newfriendly;
}
async function simpleOnDropImage(ev, elem) {
	let dt = ev.dataTransfer;
	console.log('dropped', ev.dataTransfer);

	console.log('types', dt.types);
	//console.log('items',dt.items); 
	console.log('files', dt.files);

	if (dt.types.includes('itemkey')) {
		let data = ev.dataTransfer.getData('itemkey');

		console.log('itemkey', data)
		await simpleOnDroppedItem(data);
	} else {
		const files = ev.dataTransfer.files;
		console.log('drop', ev.dataTransfer);
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = async (evReader) => {
				let data = evReader.target.result;
				await simpleOnDroppedUrl(data, UI.simple);
				//onDropCallback(, files[0].name, elem);
			};
			reader.readAsDataURL(files[0]);
		}

	}
	//console.log('dropped',ev.dataTransfer); 

	return;
	if (isString(file) && isdef(M.superdi[file])) {
		console.log('YEAH!!!!!!!!!!!! ein key', file)
		await simpleOnDroppedItem(M.superdi[file], UI.simple)
	} else if (isDict(file) && isdef(M.allImages[file.name])) {
		assertion(false, "DROP IMAGE FROM KEY ist aber file instead!!!!!!!!!!!!!!!!")
		//hab ein eigenes item gedropped!!!!
		//muss ueberhaupt kein item adden!
		//nur in die neue collection integrieren!
		console.log('NOOOOOOOOO!!!!!!!!!!!! ein eigenes img', M.allImages[file.name])
	} else {
		assertion(!isDict(file), 'MUSS VON WO ANDERS KOMMEN!!!!!')
		console.log('from somewhere else!!!!', file);

		//await simpleOnDroppedUrl(data, UI.simple);
	}
	// return 
}
async function simpleOnDroppedItem(itemOrKey, sisi) {
	console.log(itemOrKey)
	if (nundef(sisi)) sisi = UI.simple;
	let item, key;
	if (isString(itemOrKey)) { key = itemOrKey; item = M.superdi[key]; } else { item = itemOrKey; key = item.key; }
	console.log(item, key)
	assertion(isdef(key), 'NO KEY!!!!!');
	let o = M.superdi[key]; console.log(key, item, o, sisi)
	assertion(nundef(o) || o == item, "DISPARITY!!!!!!!!!!!!!!!!!!!!!")
	let list = item.colls;
	if (isdef(o) && list.includes(sisi.name)) { console.log(`HA! ${key} already there`); return; }// dropped item into same collection!!!
	lookupAddIfToList(item, ['colls'], sisi.name);
	addIf(item.colls, sisi.name);
	let di = {}; di[key] = item;
	await updateSuperdi(di);
	simpleInit(sisi.name, sisi)
}
async function simpleOnDroppedUrl(url, sisi) {
	//console.log(url,sisi); //return;
	let m = await imgMeasure(url); console.log('simpleOnDroppedUrl!!! sz', m);
	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 400];
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz + 80, hmin: sz + 80, bg: 'pink' });
	let d = mDom(dPopup, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);
	mStyle(img, { h: sz });
	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];
	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
	let db1 = mDom(dPopup, { bg: 'red', padding: 10, display: 'flex', gap: 10, 'justify-content': 'center' });
	mButton('restart', () => imgReset(img, dc, sz, w0, h0), db1, { w: 70 }, 'input');
	mButton('squish', () => imgSquish(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('expand', () => imgExpand(img, dc, sz), db1, { w: 70 }, 'input');
	let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
	mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
	let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
	let defaultName = '';
	let iDefault = 1;
	let k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`); }
	defaultName = `${sisi.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });
	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('OK', () => simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');
}
async function simpleSetAvatar(key) {
	U.imgKey = key;
	let res = await postUserChange(U);
	//console.log('res', res)
}
function simpleShowImageBatch(sisi, inc = 0, alertEmpty = false) {
	let [keys, index, numCells] = [sisi.keys, sisi.index, sisi.rows * sisi.cols];
	if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!');
	if (keys.length <= numCells) inc = 0;
	let newPageIndex = sisi.pageIndex + inc;
	let numItems = keys.length;
	let maxPage = Math.max(1, Math.ceil(numItems / numCells));
	if (newPageIndex > maxPage) newPageIndex = 1;
	if (newPageIndex < 1) newPageIndex = maxPage;
	index = numCells * (newPageIndex - 1);
	let list = arrTakeFromTo(keys, index, index + numCells);
	sisi.index = index; sisi.pageIndex = newPageIndex;
	sisi.items = {};
	let name = sisi.name;
	for (let i = 0; i < list.length; i++) {
		let key = list[i];
		let d = sisi.cells[i];
		mStyle(d, { opacity: 1 });
		mClass(d, 'magnifiable')
		let id = getUID();
		let d1 = simpleShowImageInBatch(key, d, {}, { prefer: sisi.name == 'emo' ? 'img' : 'photo' });
		d1.id = id;
		let item = { div: d1, key, name, id, index: i, page: newPageIndex };
		sisi.items[id] = item;
		// d1.setAttribute('collname', sisi.name);
		// let selkey = collGenSelkey(key, sisi.name);
		if (isList(UI.selectedImages) && UI.selectedImages.includes(key)) mSelect(d1);
	}
	for (let i = list.length; i < numCells; i++) {
		mStyle(sisi.cells[i], { opacity: 0 })
	}
	sisi.dPageIndex.innerHTML = `page ${sisi.pageIndex}/${maxPage}`;
	let [dNext, dPrev] = [mBy('bNext'), mBy('bPrev')];
	if (maxPage == 1) { mClass(dPrev, 'disabled'); mClass(dNext, 'disabled'); }
	else { mClassRemove(dPrev, 'disabled'); mClassRemove(dNext, 'disabled'); }
}
function simpleShowImageInBatch(key, dParent, styles = {}, opts = {}) {
	let o = M.superdi[key]; o.key = key;
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	let src = (opts.prefer == 'photo' && isdef(o.photo)) ? o.photo : valf(o.img, null);
	if (isdef(src)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
		}
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	let label = mDom(d1, { fz: 11, cursor: 'pointer' }, { html: o.friendly, className: 'ellipsis hoverHue' });
	label.onclick = simpleOnclickLabel;
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = simpleOnclickItem;
	//console.log('.......key',key)
	d1.setAttribute('key', key);
	d1.setAttribute('draggable', true)
	d1.ondragstart = ev => { ev.dataTransfer.setData('itemkey', key); }
	// d1.ondragstart = ev => { 
	// 	ev.dataTransfer.setData('text/uri-list', draggableImage.src);

	// 	// The "text/html" format is useful for dragging the image as HTML
	// 	ev.dataTransfer.setData('text/html', `<img src="${draggableImage.src}" alt="Draggable Image">`);
	// 	ev.dataTransfer.setData('hallo','mySpecialData');
	// 	// // Optionally, you can set a custom drag image
	// 	// const dragIcon = new Image();
	// 	// dragIcon.src = 'path/to/drag-icon.png'; // Optional custom drag icon
	// 	// ev.dataTransfer.setDragImage(dragIcon, 10, 10); // Adjust x and y offset as needed

	// 	UI.draggedItem = o; 
	// };
	return d1;
}


//#endregion

//#region 10.6.24
async function __simpleOnDropImage(data, file, elem) {
	console.log('dropped', file, typeof file);
	if (isString(file) && isdef(M.superdi[file])) {
		console.log('YEAH!!!!!!!!!!!! ein key', file)
		await simpleOnDroppedItem(M.superdi[file], UI.simple)
	} else if (isDict(file) && isdef(M.allImages[file.name])) {
		assertion(false, "DROP IMAGE FROM KEY ist aber file instead!!!!!!!!!!!!!!!!")
		//hab ein eigenes item gedropped!!!!
		//muss ueberhaupt kein item adden!
		//nur in die neue collection integrieren!
		console.log('NOOOOOOOOO!!!!!!!!!!!! ein eigenes img', M.allImages[file.name])
	} else {
		assertion(!isDict(file), 'MUSS VON WO ANDERS KOMMEN!!!!!')
		console.log('from somewhere else!!!!', file);

		//await simpleOnDroppedUrl(data, UI.simple);
	}
	// return 
}
//#endregion

//#region 9.6.24 elim coll code alt
async function collAddItem(coll, key, item) {
	if (nundef(M.superdi[key])) {
		M.superdi[key] = item;
		let res = await mPostRoute('postNewItem', { key: key, item: item });
	} else {
		addIf(item.colls, coll.name);
		let res = await mPostRoute('postUpdateItem', { key: key, item: item });
	}
	for (const cat of item.cats) lookupAddIfToList(M.byCat, [cat], key);
	for (const coll of item.colls) lookupAddIfToList(M.byCollection, [coll], key);
	lookupAddIfToList(M.byFriendly, [item.friendly], key)
	M.categories = Object.keys(M.byCat); M.categories.sort();
	M.collections = Object.keys(M.byCollection); M.collections.sort();
	M.names = Object.keys(M.byFriendly); M.names.sort();
}

function showImageInBatch1(key, dParent, styles = {}) {
	let o = M.superdi[key]; o.key = key;
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	if (isdef(o.img)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
		}
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	let label = mDom(d1, { fz: 11, cursor: 'pointer' }, { html: o.friendly, className: 'ellipsis hoverHue' });
	label.onclick = onclickCollItemLabel;
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = onclickCollItem;
	d1.setAttribute('key', key);
	d1.setAttribute('draggable', true)
	d1.ondragstart = () => { UI.draggedItem = o; };
	return d1;
}
//#endregion

//#region 7.6.24 elim lauter route calls
async function onclickBot() {
	let name = getUname();
	let table = T;
	let plmode = table.players[name].playmode;
	if (plmode == 'bot') return;
	let id = table.id;
	let olist = [];
	olist.push({ keys: ['players', name, 'playmode'], val: 'bot' });
	let res = await sendMergeTable({ id, name, olist });
}
async function onclickHuman() {
	let name = getUname();
	let table = T;
	let plmode = table.players[name].playmode;
	if (plmode == 'human') return;
	let id = table.id;
	let olist = [];
	olist.push({ keys: ['players', name, 'playmode'], val: 'human' });
	let res = await sendMergeTable({ id, name, olist });
}
async function sendMergeTable(o, cond = 'merge') {
	if (nundef(o)) {
		let table = Cliendata.table;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	} else if (nundef(o.name)) {
		let table = o;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	}
	let table = await mPostRoute(`${cond}Table`, o);
	if (!isDict(table)) { console.log('from server', table); } //INVALID!!!
	else await showTable(table);
}
async function sendRaceError(table, name, errors = 1) {
	let data = {
		id: table.id,
		name,
		errors,
		olist: [
			{ keys: ['players', name, 'score'], val: table.players[name].score - errors },
			{ keys: ['players', name, 'errors'], val: valf(table.players[name].errors, 0) + errors }
		]
	}
	let res = await sendMergeTable(data, 'race');
}
async function sendRaceStepScore(table, name, score = 1, olist = []) {
	let step = table.step + 1;
	olist.push({ keys: ['step'], val: step });
	olist.push({ keys: ['players', name, 'score'], val: table.players[name].score + score });
	let data = { id: table.id, name, step, olist };
	let res = await sendMergeTable(data, 'race');
}

//#endregion

//#region 5.6.24
function button96() {

	function setup(table) {
		//console.log('setup',table)
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
		}
		fen.cards = [1, 2, 3];
		fen.deck = range(4, table.options.numCards); //[4, 5, 6, 7, 8, 9, 10];
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function resolvePending(table) {
		let [fen, players] = [table.fen, table.players];
		let pending = table.pending; delete table.pending;
		let [name, move] = [pending.name, pending.move];

		let best = arrMinMax(fen.cards).min; //check if the card is the best
		if (move == best) {
			players[name].score += 1;
			removeInPlace(fen.cards, move);
			let cardlist = deckDeal(fen.deck, 1);
			if (isEmpty(cardlist)) {
				table.winners = getPlayersWithMaxScore(table);
				table.status = 'over';
				table.turn = [];
			} else {
				fen.cards.push(cardlist[0]);
				DA.pendingChanges = [['players', name, 'score'], ['fen']];
			}
		} else {
			players[name].score -= 1;
			DA.pendingChanges = [['players', name, 'score']];
		}
	}
	function present(table) {
		let fen = table.fen;
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let items = [];
		for (const card of fen.cards) {
			let item = cNumber(card);
			mAppend(d, iDiv(item));
			items.push(item);
			item.feno = card;
		}
		return items;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d);
		}
	}
	async function activate(table, items) {
		let myTurn = isMyTurn(table);

		let styleInstruction = { display: 'flex', 'justify-content': 'center', 'align-items': 'center' };
		let dinst = mBy('dInstruction'); mClear(dinst);

		if (!myTurn) {
			mDom(dinst, styleInstruction, { html: `waiting for: ${getTurnPlayers(table)}` });
			return;
		}

		styleInstruction.maleft = -30;
		let instruction = 'must click a card';
		html = `
				${get_waiting_html()}
				<span style="color:red;font-weight:bold;max-height:25px">You</span>
				&nbsp;${instruction};
				`;
		mDom(dinst, styleInstruction, { html });

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item);
		}

		if (amIHuman(table)) return;

		//bot move activation
		TO.bot = setInterval(async () => {
			//console.log('BOT!!!',table.step);
			let list = sortBy(items, x => x.feno); //console.log(list);
			let item = list[0]; //rChoose(items);
			await onclickCard(table, item);
		}, rNumber(1000, 4000));

	}

	async function onclickCard(table, item) {
		mShield('dTable', { bg: 'transparent' });

		//highlight clicked card
		let d = iDiv(item);
		let ms = rChoose(range(300, 400));
		mClass(d, 'framedPicture'); TO.hallo = setTimeout(() => mClassRemove(d, 'framedPicture'), ms);
		try { await mSleep(ms); } catch (err) { return; } //console.log("ERR", err); 

		let id = table.id;
		let name = getUname();
		let move = item.feno;
		let step = table.step;
		let olist = [{ keys: ['pending'], val: { name, move } },];
		if (isdef(DA.pendingChanges)) {
			for (const klist of DA.pendingChanges) {
				olist.push({ keys: klist, val: lookup(table, klist) });
			}
		}

		let o = { id, name, olist, step };
		let best = arrMinMax(table.fen.cards).min;

		if (move == best) o.stepIfValid = step + 1; // nur 1 kann punkt kriegen pro runde

		let res = await mPostRoute('olist', o); //console.log(res);
	}

	return { setup, resolvePending, present, stats, activate };
}

function setgame() {

	function setup(table) {
		//console.log('setup',table)
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
		}
		fen.deck = setCreateDeck(); //console.log('deck size',fen.deck.length)
		fen.cards = deckDeal(fen.deck, table.options.numCards);
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		//console.log('players',table.players)
		return fen;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d); //, {}, {id:`stat_${plname}_score`});
		}
	}
	function present(table) {
		const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' };
		setLoadPatterns('dPage', colors);
		let fen = table.fen;

		mStyle('dTable', { padding: 50, wmin: 500 });

		let d = mDom('dTable', { gap: 10, padding: 0 }); mCenterFlex(d);

		//fen.cards = arrTake(fen.deck,12)

		let rows = Math.ceil(fen.cards.length / 3);
		let gap = 10;

		// let hMax=80; hMin=50; //window.innerHeight/1.8;

		// let hCardMax=((hMax-120)/rows)-10;
		let sz = rows <= 4 ? 80 : rows == 5 ? 70 : rows == 6 ? 68 : rows == 7 ? 65 : rows == 8 ? 62 : 60;
		//4 rows ... 1
		//5 rows ... 20
		//6 rows ... 15
		//7 rows ... 12
		//9 rows ... 2
		//... 10 rows: 0
		//let sz = hMax - 30* (rows-4); //hCardMax; //Math.min(80, Math.round(420 / rows));

		let dBoard = T.dBoard = mGrid(rows, 3, d, { gap });
		let items = [];
		for (const c of fen.cards) {
			let dc = setDrawCard(c, dBoard, colors, sz); //TESTING ? 80 : 100);
			let item = mItem({ div: dc }, { key: c });
			items.push(item);
		}

		//cheat mode!
		let oset = setFindOneSet(items); console.log('=>', oset ? oset.keys[0] : 'NO SET');

		return items;
	}
	async function activate(table, items) {

		if (!isMyTurn(table)) { console.log('table.turn', table.turn); return; }

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}

		//show no set button
		let dParent = mBy('dTable').parentNode;
		mIfNotRelative(dParent);

		let bNoSet = mButton('No Set', () => onclickNoSet(table, items), dParent, {}, 'button', 'bNoSet');
		mPos(bNoSet, window.innerWidth / 2 + 180, 110);

		if (amIHuman(table) && getGameOption('use_level') == 'yes' && getPlayerProp('level') <= 2) {
			let bHint = mButton('Hint', () => onclickHint(table, items), dParent, {}, 'button', 'bHint');
			mPos(bHint, window.innerWidth / 2 - 200 - 80, 110);
		}

		if (isEmpty(table.fen.cards)) return gameoverScore(table);

		if (amIHuman(table) && table.options.gamemode == 'multi') return;

		//bot move activation: random move
		let name = amIHuman(table) ? someOtherPlayerName(table) : getUname();
		if (nundef(name)) return; //console.log('bot name',name)

		await botMove(name, table, items);
	}
	async function botMove(name, table, items) {
		let oset = setFindOneSet(items); //console.log('botset',oset?oset.keys:'NO SET!');
		//if (!oset) return; //kann noch kein No Set!

		let avg = calcBotLevel(table); //console.log('botlevel',avg)
		let ms = avg ? 18000 - avg * 2000 : 1000;

		TO.bot = setTimeout(async () => {
			if (!oset) await onclickNoSet(table, items);
			else {
				for (const item of oset.items) toggleItemSelection(item);
				TO.bot1 = setTimeout(async () => await evalMove(name, table, oset.keys), 1000);
			}
		}, rNumber(ms, ms + 2000));

	}

	//#region set specific functions
	function setCheckIfSet(keys) {
		let arr = makeArrayWithParts(keys);
		let isSet = arr.every(x => arrAllSameOrDifferent(x));
		return isSet;
	}
	function setCreateDeck() {
		let deck = [];
		['red', 'purple', 'green'].forEach(color => {
			['diamond', 'squiggle', 'oval'].forEach(shape => {
				[1, 2, 3].forEach(num => {
					['solid', 'striped', 'open'].forEach(fill => {
						deck.push(`${color}_${shape}_${num}_${fill}`);
					});
				});
			});
		});
		arrShuffle(deck);
		return deck;
	}
	function setDrawCard(card, dParent, colors, sz = 100) {
		const paths = {
			diamond: "M25 0 L50 50 L25 100 L0 50 Z",
			squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
			oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
		}
		let [color, shape, num, fill] = card.split('_');
		var attr = {
			d: paths[shape],
			fill: fill == 'striped' ? `url(#striped-${color})` : fill == 'solid' ? colors[color] : 'none',
			stroke: colors[color],
			'stroke-width': 2,
		};
		let h = sz, w = sz / .65;
		let ws = w / 4;
		let hs = 2 * ws;
		let d0 = mDom(dParent, { display: 'flex', w, h, bg: 'white', rounding: 10 });
		mStyle(d0, { justify: 'center', 'align-items': 'center', gap: 6 })
		let shapeSvg = `<svg viewbox="-2 -2 54 104">` + makeSVG("path", attr) + '</svg>';
		for (const i of range(num)) {
			let d1 = mDom(d0, { h: hs, w: ws }, { html: shapeSvg });
		}
		return d0;
	}
	function setFindAllSets(items) {
		let result = [];
		for (var x = 0; x < items.length; x++) {
			for (var y = x + 1; y < items.length; y++) {
				for (var z = y + 1; z < items.length; z++) {
					assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
					let list = [items[x], items[y], items[z]];
					let keys = list.map(x => x.key);
					if (setCheckIfSet(keys)) result.push(list);
				}
			}
		}
		if (isEmpty(result)) console.log('no set!')
		return result;
	}
	function setFindOneSet(items) {
		for (var x = 0; x < items.length; x++) {
			for (var y = x + 1; y < items.length; y++) {
				for (var z = y + 1; z < items.length; z++) {
					assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
					let list = [items[x], items[y], items[z]];
					let keys = list.map(x => x.key);
					if (setCheckIfSet(keys)) return { items: list, keys };
				}
			}
		}
		//console.log('no set!')
		return null;
	}
	function setLoadPatterns(dParent, colors) {
		dParent = toElem(dParent);
		let id = "setpatterns";
		if (isdef(mBy(id))) { return; }
		let html = `
			<svg id="setpatterns" width="0" height="0">
				<!--  Define the patterns for the different fill colors  -->
				<pattern id="striped-red" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.red}; stroke-width:1" />
				</pattern>
				<pattern id="striped-green" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.green}; stroke-width:1" />
				</pattern>
				<pattern id="striped-purple" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.purple}; stroke-width:1" />
				</pattern>
			</svg>
			`;
		let el = mCreateFrom(html);
		mAppend(dParent, el)
	}

	async function onclickCard(table, item, items) {
		toggleItemSelection(item);
		let selitems = items.filter(x => x.isSelected);
		let [keys, m] = [selitems.map(x => x.key), selitems.length];
		if (m == 3) {
			await evalMove(getUname(), table, keys);
		}
	}
	async function onclickHint(table, items) {
		let oset = setFindOneSet(items);
		let bHint = mBy('bHint');
		disableButton('bHint');
		if (!oset) {
			ANIM.button = scaleAnimation('bNoSet');
		} else {
			//console.log('oset',oset);
			let item = rChoose(oset.items);
			await onclickCard(table, item, items);
		}
	}
	async function onclickNoSet(table, items) {
		//console.log('clicked No Set!') 
		clearEvents();
		mShield('dTable', { bg: 'transparent' });
		let id = table.id;
		let name = getUname();
		let step = table.step;

		let oset = setFindOneSet(items);
		if (!oset) {
			table.players[name].score += 1;
			let fen = table.fen;
			let newCards = deckDeal(fen.deck, 1); //add 1 cards!
			if (!isEmpty(newCards)) fen.cards.push(newCards[0]); else return await gameoverScore(table);
		} else {
			table.players[name].score -= 1;
		}
		lookupAddToList(table, ['moves'], { step, name, move: ['noSet'], change: oset ? '-1' : '+1', score: table.players[name].score });

		let o = { id, name, step, table };

		if (!oset) o.stepIfValid = step + 1;

		let res = await mPostRoute('table', o); //console.log(res);
	}
	async function evalMove(name, table, keys) {
		clearEvents();
		mShield('dTable', { bg: 'transparent' });
		let id = table.id;
		//let name = getUname();
		let step = table.step;

		let isSet = setCheckIfSet(keys);
		if (isSet) {
			table.players[name].score += 1;

			//calc how to replace cards from set
			let fen = table.fen;
			let toomany = Math.max(0, fen.cards.length - table.options.numCards);
			let need = Math.max(0, 3 - toomany);
			let newCards = deckDeal(fen.deck, need);
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i]);
		} else {
			table.players[name].score -= 1;
		}
		lookupAddToList(table, ['moves'], { step, name, move: keys, change: isSet ? '+1' : '-1', score: table.players[name].score });

		let o = { id, name, step, table };

		if (isSet) o.stepIfValid = step + 1;

		let res = await mPostRoute('table', o); //console.log(res);
	}
	//#endregion

	return { setup, present, stats, activate };
}

//#endregion

//#region 4.6.24
function mimali(c, m) {
	//das ding muss einfach nur n colors returnen!
	//ich koennt es so machen: nimm einfach random pixels auf dem background!
	//just return n colors!
	//console.log('___mimali n',n)

	//console.log(c,m)

	let seasonColors = 'winter_blue midnightblue light_azure capri spring_frost light_green deep_green summer_sky yellow_pantone orange pale_fallen_leaves timberwolf'.split(' ');
	let c2 = seasonColors[m - 1];

	//why 43?
	let colors = generateArrayColors(c, c2, 7).slice(1); //paletteShadesBi(c,36*m);
	//console.log('colors',colors);
	let wheel = [];//'blue'];
	for (const x of colors) {
		let pal1 = paletteShades(x); //console.log(pal1.length)
		//wheel=wheel.concat(pal1);
		for (const i of range(7)) wheel.push(pal1[i + 2]);
	}
	//console.log('wheel',wheel.length)
	return wheel;



	// function whh(c1, c2) { return generateArrayColors(colorHex(c1), colorHex(c2), 10); }
	// function genc(c, hinc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, hsl.s * 100, hsl.l * 100); }
	// function cinc(c, hinc, sinc, linc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, clamp(hsl.s * 100 + sinc, 0, 100), clamp(hsl.l * 100 + linc, 0, 100)); }
	// function arrd(c, hinc, sinc, linc, n) { let r = []; for (let i = 0; i < n; i++) { r.push(cinc(c, hinc * i, sinc * i, linc * i)); } return r; }
	// function light(c, lper = 75) { let hsl = colorHSL(c, true); return colorHSLBuild(hsl.h, hsl.s * 100, lper); }
	// function sat(c, sper = 100) { let hsl = colorHSL(c, true); return colorHSLBuild(sper, hsl.s * 100, hsl.l * 100); }
	// function hue(c, hdeg) { let hsl = colorHSL(c, true); return colorHSLBuild(hdeg, hsl.s * 100, hsl.l * 100); }
	// c = light(c, 75);
	// let diff = Math.round(360 / n)
	// wheel = arrd(c, diff, 0, 0, n);
	// return wheel;
}

//#endregion

//#region 3.6.24
function mCommand(dParent, key, html, opts = {}) {
	if (nundef(html)) html = capitalize(key);
	let close = valf(opts.close, () => { console.log('close', key) });
	// let closeHandler = valf(opts.close, () => { console.log('close', key) });
	// let close = null;
	// if (opts.save) {
	// 	close = async () => { 
	// 		localStorage.setItem('settingsMenu', key); 
	// 		console.log('saved submenu',key)
	// 		await closeHandler(); 
	// 	}
	// }else close = closeHandler;
	let save = valf(opts.save, false);
	let open = valf(opts.open, window[`onclick${capitalize(key)}`]);
	// let openHandler = valf(opts.open, window[`onclick${capitalize(key)}`]);
	// let open = null;
	// if (opts.save) {
	// 	open = async () => { 
	// 		localStorage.setItem('settingsMenu', key); 
	// 		console.log('saved submenu',key)
	// 		await openHandler(); 
	// 	}
	// }else open = openHandler;
	let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	let a = mDom(d, {}, { key: `${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: onclickCommand })
	return { dParent, elem: d, div: a, key, open, close, save };
}
async function showPaletteFor_messy(src, color, blendMode) {
	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let dParent = mPopup();
	let d = mDom(dParent, { gap: 4 }); mFlexWrap(d);

	let palette = [color];
	if (isdef(src)) {
		let ca = await getCanvasCtx(d, { w: 310, h: 200, fill, bgBlend }, { src });
		palette = await getPaletteFromCanvas(ca.cv);
		palette.unshift(fill);
	} else {
		//make a palette with color and other shades of that color
		palette = arrCycle(paletteShades(color), 4);
	}

	let dominant = palette[0];

	// let dfunc = colorDistanceHue;

	// let opal = paletteAddDistanceTo(palette, fill, 'bg', dfunc);
	// paletteAddDistanceTo(opal, dominant, 'dom', dfunc);
	// opal.map(x => showObject(x, ['hex', 'hue', 'dist_bg', 'dist_dom'], d, { bg: x.hex, wmin: 50 }));
	// mLinebreak(d);

	// let best = arrMinMax(opal, x => Math.min(x.dist_bg, x.dist_dom)).imax;
	// let obest = opal[best];
	// showObject(obest, ['hue'], d, { bg: obest.hex, wmin: 50 }); mLinebreak(d);
	//console.log('===>best',opal[best]); 

	//console.log('opal',opal.map(x=>x.hex)); 
	// let p1 = palettePureHue(opal);
	// p1.map(x => showObject(x, ['hue'], d, { bg: x.hex, wmin: 50 }));	//showPaletteMini(d1, p1); 
	// mLinebreak(d);

	// let o = paletteGetBestContrasting(p1, fill, dominant);
	// showObject(o.best, ['hue'], d, { bg: o.best.hex, wmin: 50 });
	// mLinebreak(d);

	let p2 = paletteContrastVariety(palette);
	// p2.map(x => showObject(x, ['hue'], d, { bg: x.hex, wmin: 50 }));
	// mLinebreak(d);

	showPaletteMini(d, p2);
	mLinebreak(d);

	return;
	//do NOT add color if distance is too close to one that is already in the array
	console.log('_______________')
	let palContrast = p2.slice(0, 2);//	console.log(p2);
	let sorted = colorSortByLightness(p2.slice(2)); //console.log('===>',sorted);
	showPaletteMini(d, sorted);
	mLinebreak(d);

	let i = 0;
	while (i < sorted.length) {
		let hex = sorted[i];
		let ok = true;
		for (const h1 of palContrast) {
			let d = colorDistance(hex, h1);//console.log(d);
			if (d < 70) { ok = false; break; }
		}
		if (ok) palContrast.push(hex);
		i++;
	}

	showPaletteMini(d, palContrast);
	mLinebreak(d);

	//console.log(p3[0], p3[2], colorDistance(p3[0], p3[2]))
	return [palette.map(x => colorO(x)), palContrast];

	// //showPaletteMini(d1, palette);
	// let pal2 = [colorComplement(fill), colorComplement(dominant), 'white', 'silver', 'dimgray', 'black'];
	// showPaletteMini(d, pal2); mLinebreak(d);
	// let pal3 = [colorTurnHueBy(fill), colorTurnHueBy(dominant), colorTurnHueBy(fill, 120), colorTurnHueBy(dominant, 120), colorTurnHueBy(fill, 240), colorTurnHueBy(dominant, 240)];
	// showPaletteMini(d, pal3); mLinebreak(d);
	// let pal4 = [getBestContrastingColor(fill), getBestContrastingColor(dominant)];
	// showPaletteMini(d, pal4); mLinebreak(d);
	// let pal5 = [fill, colorTurnHueBy(fill), colorComplement(fill), getBestContrastingColor(fill), colorIdealText(fill)]
	// showPaletteMini(d, pal5); mLinebreak(d);
	// for (const c of pal5) {
	// 	console.log(c, colorDistance(fill, c));
	// }

	// console.log(src, opal)
	// return palette;
}
async function showPaletteFor(src, color, blendMode) {
	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let dParent = mPopup();
	let d = mDom(dParent, { gap: 4 }); mFlexWrap(d);

	let palette = [color];
	if (isdef(src)) {
		let ca = await getCanvasCtx(d, { w: 310, h: 200, fill, bgBlend }, { src });
		palette = await getPaletteFromCanvas(ca.cv);
		palette.unshift(fill);
	} else {
		//make a palette with color and other shades of that color
		palette = arrCycle(paletteShades(color), 4);
	}

	let dominant = palette[0];
	let dfunc = colorDistanceHue;

	let opal = paletteAddDistanceTo(palette, fill, 'bg', dfunc);
	paletteAddDistanceTo(opal, dominant, 'dom', dfunc);
	opal.map(x => showObject(x, ['hex', 'hue', 'dist_bg', 'dist_dom'], d, { bg: x.hex, wmin: 50 }));
	mLinebreak(d);

	let best = arrMinMax(opal, x => Math.min(x.dist_bg, x.dist_dom)).imax;
	let obest = opal[best];
	showObject(obest, ['hue'], d, { bg: obest.hex, wmin: 50 }); mLinebreak(d);
	//console.log('===>best',opal[best]); 

	//console.log('opal',opal.map(x=>x.hex)); 
	let p1 = palettePureHue(opal);
	p1.map(x => showObject(x, ['hue'], d, { bg: x.hex, wmin: 50 }));	//showPaletteMini(d1, p1); 
	mLinebreak(d);

	let o = paletteGetBestContrasting(p1, fill, dominant);
	showObject(o.best, ['hue'], d, { bg: o.best.hex, wmin: 50 });
	mLinebreak(d);

	let p2 = paletteContrastVariety(opal);
	p2.map(x => showObject(x, ['hue'], d, { bg: x.hex, wmin: 50 }));
	mLinebreak(d);

	res = p2.map(x => x.hex); res = arrRemoveDuplicates(res);
	showPaletteMini(d, res);
	mLinebreak(d);

	//do NOT add color if distance is too close to one that is already in the array
	console.log('_______________')
	let p3 = res.slice(0, 2);
	let i = 2;
	while (i < res.length) {
		let hex = res[i];
		let ok = true;
		for (const h1 of p3) {
			let d = colorDistance(hex, h1);
			//console.log(d);
			if (d < 40) { ok = false; break; }
		}
		if (ok) p3.push(hex);
		i++;
	}

	showPaletteMini(d, p3);
	mLinebreak(d);

	console.log(p3[0], p3[2], colorDistance(p3[0], p3[2]))
	return;

	//showPaletteMini(d1, palette);
	let pal2 = [colorComplement(fill), colorComplement(dominant), 'white', 'silver', 'dimgray', 'black'];
	showPaletteMini(d, pal2); mLinebreak(d);
	let pal3 = [colorTurnHueBy(fill), colorTurnHueBy(dominant), colorTurnHueBy(fill, 120), colorTurnHueBy(dominant, 120), colorTurnHueBy(fill, 240), colorTurnHueBy(dominant, 240)];
	showPaletteMini(d, pal3); mLinebreak(d);
	let pal4 = [getBestContrastingColor(fill), getBestContrastingColor(dominant)];
	showPaletteMini(d, pal4); mLinebreak(d);
	let pal5 = [fill, colorTurnHueBy(fill), colorComplement(fill), getBestContrastingColor(fill), colorIdealText(fill)]
	showPaletteMini(d, pal5); mLinebreak(d);
	for (const c of pal5) {
		console.log(c, colorDistance(fill, c));
	}

	console.log(src, opal)
	return palette;
}
async function calcUserPalette(name) {
	if (nundef(name)) name = U.name;
	let user = await getUser(name);

	let d = mPopup();
	return await calcPalette(d, user.texture, user.color, user.blendMode);
}
async function calcPalette(dParent, src, color, blendMode) {
	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let d1 = mDom(dParent, { gap: 4 }); mFlexWrap(d1);

	let palette = [color];
	if (isdef(src)) {
		let ca = await getCanvasCtx(d1, { w: 310, h: 200, fill, bgBlend }, { src });
		palette = await getPaletteFromCanvas(ca.cv);
		palette.unshift(fill);
	} else {
		//make a palette with color and other shades of that color
		palette = arrCycle(paletteShades(color), 4);
	}

	let dominant = palette[0];
	let dfunc = colorDistanceHue;

	let opal = paletteAddDistanceTo(palette, fill, 'bg', dfunc);
	paletteAddDistanceTo(opal, dominant, 'dom', dfunc);
	opal.map(x => showObject(x, ['hex', 'hue', 'dist_bg', 'dist_dom'], d1, { bg: x.hex, wmin: 50 }));
	mLinebreak(d1);

	let best = arrMinMax(opal, x => Math.min(x.dist_bg, x.dist_dom)).imax;
	let obest = opal[best];
	showObject(obest, ['hue'], d1, { bg: obest.hex, wmin: 50 }); mLinebreak(d1);
	//console.log('===>best',opal[best]); 

	//console.log('opal',opal.map(x=>x.hex)); 
	let p1 = palettePureHue(opal);
	p1.map(x => showObject(x, ['hue'], d1, { bg: x.hex, wmin: 50 }));	//showPaletteMini(d1, p1); 
	mLinebreak(d1);

	let o = paletteGetBestContrasting(p1, fill, dominant);
	showObject(o.best, ['hue'], d1, { bg: o.best.hex, wmin: 50 });
	mLinebreak(d1);

	let p2 = paletteContrastVariety(opal);
	p2.map(x => showObject(x, ['hue'], d1, { bg: x.hex, wmin: 50 }));
	mLinebreak(d1);

	res = p2.map(x => x.hex); res = arrRemoveDuplicates(res);
	showPaletteMini(d1, res);
	mLinebreak(d1);

	//do NOT add color if distance is too close to one that is already in the array
	console.log('_______________')
	let p3 = res.slice(0, 2);
	let i = 2;
	while (i < res.length) {
		let hex = res[i];
		let ok = true;
		for (const h1 of p3) {
			let d = colorDistance(hex, h1);
			//console.log(d);
			if (d < 40) { ok = false; break; }
		}
		if (ok) p3.push(hex);
		i++;
	}

	showPaletteMini(d1, p3);
	mLinebreak(d1);

	console.log(p3[0], p3[2], colorDistance(p3[0], p3[2]))
	return;

	//showPaletteMini(d1, palette);
	let pal2 = [colorComplement(fill), colorComplement(dominant), 'white', 'silver', 'dimgray', 'black'];
	showPaletteMini(d1, pal2); mLinebreak(d1);
	let pal3 = [colorTurnHueBy(fill), colorTurnHueBy(dominant), colorTurnHueBy(fill, 120), colorTurnHueBy(dominant, 120), colorTurnHueBy(fill, 240), colorTurnHueBy(dominant, 240)];
	showPaletteMini(d1, pal3); mLinebreak(d1);
	let pal4 = [getBestContrastingColor(fill), getBestContrastingColor(dominant)];
	showPaletteMini(d1, pal4); mLinebreak(d1);
	let pal5 = [fill, colorTurnHueBy(fill), colorComplement(fill), getBestContrastingColor(fill), colorIdealText(fill)]
	showPaletteMini(d1, pal5); mLinebreak(d1);
	for (const c of pal5) {
		console.log(c, colorDistance(fill, c));
	}

	console.log(src, opal)
	return palette;
}

//#endregion

//#region 1.6.24
function colorDistanceHue_ai(color1, color2) {
	let hsl1 = hexToHSL(color1);
	let hsl2 = hexToHSL(color2);

	// Calculate hue distance
	let hueDiff = Math.abs(c1, hue - c2.hue);
	let hueDistance = Math.min(hueDiff, 360 - hueDiff) / 180; // Normalize to [0, 1]

	// Calculate lightness distance
	let lightnessDistance = Math.abs(hsl1.l - hsl2.l) / 100; // Normalize to [0, 1]

	// Combine distances, prioritizing hue
	let distance = hueDistance + 0.5 * lightnessDistance;

	return distance;
}
//#endregion

//#region 1.6.24: eliminate analyseColorsForUseer, calcPalette orig!!!

async function calcPalette(dParent, src, color, blendMode) {
	let fill = color;
	let bgBlend = getBlendCanvas(blendMode);
	let d1 = mDom(dParent);
	let ca = await getCanvasCtx(d1, { w: 310, h: 200, fill, bgBlend }, { src });
	let palette = await getPaletteFromCanvas(ca.cv);
	//palette.splice(8);
	let dominant = palette[0];

	let opal = [];
	for (let i = 0; i < palette.length; i++) {
		let c = palette[i];
		let o = w3color(c);
		o.hex = c;
		o.distbg = colorDistance(c, fill);
		o.distbg = colorDistance(c, dominant);
		opal.push(o);
	}
	palette.unshift(fill);
	showPaletteMini(d1, palette);
	let pal2 = [colorComplement(fill), colorComplement(dominant), 'white', 'silver', 'dimgray', 'black'];
	showPaletteMini(d1, pal2);
	let pal3 = [colorTurnHueBy(fill), colorTurnHueBy(dominant), colorTurnHueBy(fill, 120), colorTurnHueBy(dominant, 120), colorTurnHueBy(fill, 240), colorTurnHueBy(dominant, 240)];
	showPaletteMini(d1, pal3);
	let pal4 = [getBestContrastingColor(fill), getBestContrastingColor(dominant)];
	showPaletteMini(d1, pal4);
	let pal5 = [fill, colorTurnHueBy(fill), colorComplement(fill), getBestContrastingColor(fill), colorIdealText(fill)]
	showPaletteMini(d1, pal5);
	for (const c of pal5) {
		console.log(c, colorDistance(fill, c));
	}

	console.log(src, opal)
	return palette;
}


async function analyseColorsForUser(d, name) {
	let user = Serverdata.users[name];
	let d1 = mDom(d, { align: 'center', bg: user.color, fg: valf(user.fg, colorIdealText(user.color)) });
	mDom(d1, {}, { html: name });
	let palette = await calcPalette(d1, user.texture, user.color, user.blendMode);
}
//#endregion

//#region 1.6.24: uiGadgetType und uiType checkListInput
function uiGadgetTypeCheckListInput(form, content, styles, opts) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dParent = mDom(dOuter, { pabottom: 10, box: true });
	let ui = uiTypeCheckListInput(content, dParent, styles, opts);
	return () => DA.formResult;
}
function uiTypeCheckListInput(lst, dParent, styles = {}, opts = {}) {
	mStyle(dParent, { w: 1000 })
	let dg = mDom(dParent);
	let list = lst;
	let items = [];
	for (const o of list) {
		let div = mCheckbox(dg, o.name, o.value);
		items.push({ nam: o.name, div, w: mGetStyle(div, 'w'), h: mGetStyle(div, 'h') });
	}
	let wmax = arrMax(items, 'w'); //console.log('wmax',wmax); //measure max width of items
	let cols = 3;
	let wgrid = wmax * cols + 100;
	dg.remove();
	dg = mDom(dParent);
	let inp = mDom(dg, { w100: true, box: true, mabottom: 10 }, { className: 'input', tag: 'input', type: 'text' });
	let db = mDom(dg, { w100: true, box: true, align: 'right', mabottom: 4 });
	mButton('cancel', () => DA.formResult = null, db, {}, 'input');
	mButton('clear', ev => { ev.preventDefault(); onclickClear(inp, grid) }, db, { maleft: 10 }, 'input');
	mButton('done', () => DA.formResult = extractWords(inp.value, ' '), db, { maleft: 10 }, 'input');
	mStyle(dg, { w: wgrid, box: true, padding: 10 }); //, w: wgrid })
	let grid = mGrid(null, cols, dg, { w100: true, gap: 10, matop: 4, hmax: 500 });
	items.map(x => mAppend(grid, iDiv(x)));
	let chks = Array.from(dg.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
	for (const chk of chks) {
		chk.addEventListener('click', ev => checkToInput(ev, inp, grid))
	}
	inp.value = list.filter(x => x.value).map(x => x.name).join(', ');
	inp.addEventListener('keypress', ev => inpToChecklist(ev, grid));
	return { dg, inp, grid };
}
//#endregion

//#region 1.6.24: uiGadgetType und uiTypeCheckList mit resolve
function uiGadgetTypeCheckList(dParent, content, resolve, styles = {}, opts = {}) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	let dOuter = mDom(dParent, styles)
	let dParent = mDom(dOuter, { hmax: 510, wmax: 200, pabottom: 10, box: true }); //,bg:'blue',fg:'contrast'});
	let ui = uiTypeCheckList(content, dParent, styles, opts);
	mButton('done', () => onclickCatListDone(dParent), dOuter, { classes: 'input', margin: 10 }); //da muss noch ein button dazu
	return () => dParent.getAttribute('proceed');
}
function uiTypeCheckList(lst, dParent, styles = {}, opts = {}) {
	let d = mDom(dParent, { overy: 'auto' }); //hier drin kommt die liste!
	lst.forEach((o, index) => {
		let [text, value] = [o.name, o.value];
		let dcheck = mDom(d, {}, { tag: 'input', type: 'checkbox', name: text, value: text, id: `ch_${index}`, checked: value });
		let dlabel = mDom(d, {}, { tag: 'label', for: dcheck.id, html: text });
		mNewline(d, 0);
	});
	let r = getRect(d);
	let rp = getRect(dParent);
	let hParent = rp.h;
	if (hParent == 0) hParent = mGetStyle(dParent, 'max-height');
	let p = mGetStyle(dParent, 'pabottom'); //console.log('pb',p,mGetStyle(dParent,'padding'))
	let h = hParent - r.y;
	mStyle(d, { hmax: h });//,pabottom:10,box:true});
	return d;
}
async function onclickCatListDone(ui) { ui.setAttribute('proceed', getCheckedNames(ui).join('@')); }

//#endregion

//#region 1.6.24: uiGadgetTypeChecklist origs
function uiGadgetTypeCheckList(form, content, styles, opts) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dParent = mDom(dOuter, { hmax: 510, wmax: 200, pabottom: 10, box: true }); //,bg:'blue',fg:'contrast'});
	let ui = uiTypeCheckList(content, dParent, styles, opts);
	mButton('done', () => onclickCatListDone(form), dOuter, { classes: 'input', margin: 10 }); //da muss noch ein button dazu
	return () => form.getAttribute('proceed');
}
function uiGadgetTypeCheckListInput(form, content, styles, opts) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dParent = mDom(dOuter, { pabottom: 10, box: true });
	let ui = uiTypeCheckListInput(content, dParent, styles, opts);
	return () => DA.formResult;
}

//#endregion

//#region 31.mai 24: uiGadgetType Originals!!!!!
function uiGadgetTypeText(form, content, styles = {}, opts = {}) {
	let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return () => inp.value;
}


function uiGadgetTypeCheckList(form, content, styles, opts) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dParent = mDom(dOuter, { hmax: 510, wmax: 200, pabottom: 10, box: true }); //,bg:'blue',fg:'contrast'});
	let ui = uiTypeCheckList(content, dParent, styles, opts);
	mButton('done', () => onclickCatListDone(form), dOuter, { classes: 'input', margin: 10 }); //da muss noch ein button dazu
	return () => form.getAttribute('proceed');
}
function uiGadgetTypeCheckListInput(form, content, styles, opts) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dParent = mDom(dOuter, { pabottom: 10, box: true });
	let ui = uiTypeCheckListInput(content, dParent, styles, opts);
	return () => DA.formResult;
}
function uiGadgetTypeMulti(form, dict, styles = {}, opts = {}) {
	let inputs = [];
	for (const k in dict) {
		let [content, val] = [k, dict[k]];
		let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', value: val, placeholder: `<enter ${content}>` });
		inputs.push({ name: content, inp: inp });
		mNewline(form)
	}
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return () => {
		let di = {};
		inputs.map(x => di[x.name] = x.inp.value);
		return di;
	};
}
function uiGadgetTypeYesNo(form, content, styles = {}, opts = {}) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dq = mDom(dOuter, { mabottom: 7 }, { html: capitalize(content) });
	let db = mDom(dOuter, { w100: true, box: true, display: 'flex', 'justify-content': 'space-between', gap: 10 })
	let bYes = mDom(db, { w: 70, classes: 'input' }, { html: 'Yes', tag: 'button', onclick: () => form.setAttribute('proceed', 'yes') })
	let bNo = mDom(db, { w: 70, classes: 'input' }, { html: 'No', tag: 'button', onclick: () => form.setAttribute('proceed', 'no') })
	return () => form.getAttribute('proceed') == 'yes';
}
//#endregion

//#region 31.mai 24: neues mGather trial 1
async function mGather(dAnchor, styles = {}, opts = {}) {
	return new Promise((resolve, _) => {
		let [content, type] = [valf(opts.content, 'name'), valf(opts.type, 'text')]; //defaults
		let dbody = document.body;
		let dDialog = mDom(dbody, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog', id: 'dDialog' });

		let d = mDom(dDialog);
		let uiFunc = window[`uiGadgetType${capitalize(type)}`];
		uiFunc(d, content, resolve, styles, opts);
		dDialog.showModal();
	});
}
function uiGadgetTypeSelect(dParent, content, resolve, styles = {}, opts = {}) {

	//resolve('hallo'); mBy('dDialog').remove(); return;
	let d = mDom(dParent);

	let handler = (ev, selval) => {
		ev.preventDefault();
		dParent.setAttribute('proceed', selval);
		console.log('form', dParent)
		dParent.submit();
	}
	let select = uiTypeSelect(content, handler, d, styles, opts);
	//mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	//return () => form.getAttribute('proceed');

	let rect = getRect(select);
	mStyle(dParent, { bg: 'red', padding: 10, wmin: rect.w, hmin: (1 + content.length) * 25 }); //,wmin:'100vw',hmin:'100vh'});


	return () => dParent.getAttribute('proceed');
}
function uiTypeSelect(any, handler, form, styles = {}, opts = {}) {

	let list = toNameValueList(any);
	//console.log(list); //return;

	let d = form; // mDom(dParent, { overy: 'auto' }); //hier drin kommt das select elem
	let id = getUID();
	let dselect = mDom(d, { bg: 'blue' }, { className: 'input', tag: 'select', id });
	for (const el of list) {
		//console.log(el.name,el.value)
		mDom(dselect, {}, { tag: 'option', html: el.name, value: el.value });
	}
	// dselect.onchange = ()=>isdef(opts.handler)??opts.handler(id); //ev=>console.log('changed',id,mBy(id).value);

	if (nundef(handler)) handler = () => console.log(id, 'value changed to', mBy(id).value)


	dselect.onchange = ev => handler(ev, mBy(id).value)// ()=>{form.setAttribute('proceed',mBy(id).value)}; //;form.submit(); } //console.log('changed',id,mBy(id).value);
	return dselect;
}
//#endregion

//region 31.mai 24: mGather original
async function mGather(dAnchor, styles = {}, opts = {}) {
	return new Promise((resolve, _) => {
		let [content, type, align] = [valf(opts.content, 'name'), valf(opts.type, 'text'), valf(opts.align, 'bl')];
		let d = document.body;
		let dialog = mDom(d, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog' });
		let rect = dAnchor.getBoundingClientRect();
		let [v, h] = [align[0], align[1]];
		let vPos = v == 'b' ? { top: rect.bottom } : v == 'c' ? { top: rect.top } : { bottom: rect.top };
		let hPos = h == 'l' ? { left: rect.left } : v == 'c' ? { left: rect.left } : { right: window.innerWidth - rect.right };
		let formStyles = { position: 'absolute' };
		addKeys(vPos, formStyles);
		addKeys(hPos, formStyles);
		let form = mDom(dialog, formStyles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
		dialog.addEventListener('mouseup', ev => {
			if (opts.type != 'select' && isPointOutsideOf(form, ev.clientX, ev.clientY)) {
				console.log('RESOLVE NULL POINTER OUTSIDE!!!', form, ev.clientX, ev.clientY)
				resolve(null);
				dialog.remove();
			}
		});
		dialog.addEventListener('keydown', ev => {
			if (ev.key === 'Escape') {
				dialog.remove();
				console.log('RESOLVE NULL ESCAPE');
				resolve(null);
			}
		});
		let evalFunc;
		if (type == 'multi') evalFunc = uiGadgetTypeMulti(form, content, styles, opts);
		else if (type == 'yesno') evalFunc = uiGadgetTypeYesNo(form, content, styles, opts);
		else if (type == 'select') evalFunc = uiGadgetTypeSelect(form, content, styles, opts);
		else if (type == 'checklist') evalFunc = uiGadgetTypeCheckList(form, content, styles, opts);
		else if (type == 'checklistinput') evalFunc = uiGadgetTypeCheckListInput(form, content, styles, opts);
		else if (type == 'text') evalFunc = uiGadgetTypeText(form, content, styles, opts);
		dialog.showModal();
		form.onsubmit = (ev) => {
			console.log('SUBMIT!!! val', ev)
			ev.preventDefault();
			let val = evalFunc();
			//dialog.remove();
			resolve(val);
		};
	});
}

//#endregion

//#region 28.mai 24 ai zeug
function hexToRgb(hex) {
	// Remove the hash at the start if it's there
	hex = hex.replace(/^#/, '');

	// Parse the r, g, b values
	let bigint = parseInt(hex, 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;

	return { r: r, g: g, b: b };
}
function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	return { h: h * 360, s: s, l: l };
}
function rgbToHwb(r, g, b) {
	// Get the HSL values to extract the hue
	let hsl = rgbToHsl(r, g, b);
	let h = hsl.h;

	// Calculate whiteness and blackness
	let w = Math.min(r, g, b) / 255;
	let bValue = 1 - Math.max(r, g, b) / 255;

	return { h: h, w: w * 100, b: bValue * 100 };
}
function hexToHwb(hex) {
	// Convert hex to RGB
	let rgb = hexToRgb(hex);

	// Convert RGB to HWB
	let hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);

	return hwb;
}
//#endregion

//#region 27.mai 24 color-burn mode
function hexToRgb(hex) {
	hex = hex.replace(/^#/, '');
	let bigint = parseInt(hex, 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;
	return [r, g, b];
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function colorBurn(base, blend) {
	return (blend === 0) ? 0 : Math.max(0, 255 - Math.floor((255 - base) / blend));
}

function applyColorBurn(baseColor, blendColor) {
	let [baseR, baseG, baseB] = hexToRgb(baseColor);
	let [blendR, blendG, blendB] = hexToRgb(blendColor);

	let resultR = colorBurn(baseR, blendR);
	let resultG = colorBurn(baseG, blendG);
	let resultB = colorBurn(baseB, blendB);

	return rgbToHex(resultR, resultG, resultB);
}

// Example usage:
let baseColor = "#ff5733";
let blendColor = "#33ff57";
let resultColor = applyColorBurn(baseColor, blendColor);

console.log(`Base Color: ${baseColor}, Blend Color: ${blendColor}, Result Color: ${resultColor}`);
//#endregion

//#region 27.mai 24
function addColorDistance(c, palette) {
	let dist = 10000, idx = 0;
	palette.forEach((c1, i) => {
		let distance = colorDistance(c, c1);
		if (distance < dist) { dist = distance; idx = i; }
	});
	return { dist, idx };

}
function colorMostSimilar(c, palette) {
	let dist = 10000, idx = 0;
	palette.forEach((c1, i) => {
		let distance = colorDistance(c, c1);
		if (distance < dist) { dist = distance; idx = i; }
	});
	return { dist, idx };

}
//#endregion

//#region 27.mai 24: opposite hue color
function hexToRgb(hex) {
	hex = hex.replace(/^#/, '');
	let bigint = parseInt(hex, 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;
	return [r, g, b];
}

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;
	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		let hue2rgb = function (p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		let p = 2 * l - q;
		h /= 360;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function getOppositeHueColor(hex) {
	// Convert hex to RGB
	let [r, g, b] = hexToRgb(hex);

	// Convert RGB to HSL
	let [h, s, l] = rgbToHsl(r, g, b);

	// Calculate the opposite hue
	h = (h + 180) % 360;

	// Convert HSL back to RGB
	let [newR, newG, newB] = hslToRgb(h, s, l);

	// Convert RGB back to hex
	return rgbToHex(newR, newG, newB);
}

// Example usage:
let originalColor = "#ff5733";
let oppositeHueColor = getOppositeHueColor(originalColor);

console.log(`Original Color: ${originalColor}, Opposite Hue Color: ${oppositeHueColor}`);
//#endregion

//#region 27.mai 24
function hexToRgb(hex) {
	// Remove the hash at the start if it's there
	hex = hex.replace(/^#/, '');

	// Parse r, g, b values
	let bigint = parseInt(hex, 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;

	return [r, g, b];
}
// Example usage:
let color1 = "#ff5733";
let color2 = "#ff8d1a";
let similarity = colorDistance(color1, color2);
console.log(`The similarity distance between ${color1} and ${color2} is ${similarity}`);
//#endregion

//#region 26.mai 24
async function onclickSettSwapColoring() {
	if (isdef(U.swapColoring)) delete U.swapColoring;
	else U.swapColoring = true;
	await postUserChange(U, true);
	setTheme();
}
async function showBlendModes() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 10, gap: 10 }); mFlexWrap(dTheme);
	// let items = [];
	// let list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
	let list = arrMinus(getBlendModesCSS(), ['saturation', 'color']);
	for (const blendMode of list) { await showBlendMode(dTheme, blendMode); }
	// 	let item = await showBlendMode(dTheme, blendMode); 
	// 	items.push(item);
	// }
	// return items;
}
async function showBlendMode(dParent, blendCSS) {
	let src = U.texture;
	let fill = U.color;
	let bgBlend = getBlendCanvas(blendCSS);

	let d1 = mDom(dParent);
	let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
	let palette = await getPaletteFromCanvas(ca.cv);
	palette.unshift(fill); palette.splice(8);
	showPaletteMini(d1, palette);

	//let item = { div: d1, palette, texture, bgRepeat, bgSize, blendCSS, isSelected: false };

	d1.onclick = async () => {
		U.palette = palette;
		U.blendMode = blendCSS;
		await updateUserTheme();
	}
	//return item;

}
function setUserTheme() {
	setColors(U.color, U.fg);
	setTexture(U);
}
function setTexture(item) {
	let d = document.body;
	let bgImage = valf(item.bgImage, bgImageFromPath(item.texture), '');
	let bgBlend = valf(item.bgBlend, item.blendMode, '');
	// let bgRepeat = bgImage == ''? '': bgImage.includes('marble') || bgImage.includes('wall') ? 'no-repeat' : 'repeat';
	// let bgSize = bgImage == ''? '':bgImage.includes('marble') || bgImage.includes('wall') ? 'cover' : '';
	d.style.backgroundColor = valf(item.color, item.bg, '');
	d.style.backgroundImage = bgImage;
	d.style.backgroundSize = bgImage.includes('marble') || bgImage.includes('wall') ? '100vw 100vh' : '';
	d.style.backgroundRepeat = 'repeat';
	d.style.backgroundBlendMode = bgBlend;
}
async function updateUserTheme() {
	await postUserChange();
	setUserTheme(U);
}
function setTheme(o) {
	if (nundef(o)) o = U;
	setColors(o.color, o.fg);
	if (isdef(o.texture)) o.bgImage = bgImageFromPath(o.texture);
	setTexture(o);
}
async function showBlendMode2(d, fill, bgImage, bgRepeat, bgSize, bgBlendCSS) {
	let d1 = mDom(d);
	let bgBlend = getBlendCanvas(bgBlendCSS);
	let src = pathFromBgImage(bgImage);

	mDom(d1, {}, { html: `${bgBlend}<br>${src}<br>` });
	let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
	let palette = await getPaletteFromCanvas(ca.cv);
	//console.log(palette); 
	palette.unshift(fill); palette.splice(8);
	showPaletteMini(d1, palette);

	let item = { div: d1, palette, bgImage, bgRepeat, bgSize, bgBlend, isSelected: false };
	return item;
}
async function showBlendModes() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 10, gap: 10 }); mFlexWrap(dTheme);

	let bgImage = bgImageFromPath(U.texture);
	let bg = U.color;
	let bgRepeat = bgImage.includes('marble') || bgImage.includes('wall') ? 'no-repeat' : 'repeat';
	let bgSize = bgImage.includes('marble') || bgImage.includes('wall') ? 'cover' : '';
	//let bgSizeItem = bgSize;
	let list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
	let items = [];
	for (const bgBlend of list) {
		//let item = await showBlendMode(dTheme, bg, bgImage, bgRepeat, bgSize, bgBlend); 
		let item = await showBlendMode2(dTheme, bg, bgImage, bgRepeat, bgSize, bgBlend);
		items.push(item);
	}
	return items;
}
async function showBlendMode(dParent, bg, bgImage, bgRepeat, bgSize, bgBlend) {
	let d = mDom(dParent, { align: 'center', border: 'red', bgBlend, bg, bgImage, bgRepeat, bgSize, w: '30%', h: 150 });
	mCenterCenterFlex(d);
	let d1 = mDom(d, { className: 'no_events' })
	mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'white' }, { html: bgBlend })
	mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'black' }, { html: bgBlend })
	let item = { div: d, bgImage, bgRepeat, bgSize: bgSizeItem, bgBlend, isSelected: false };
	d.onclick = async () => onclickBlendMode(item);
	return item;
}
async function showBlendModes() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 10, gap: 10 }); mFlexWrap(dTheme);
	let bgImage = bgImageFromPath(U.texture);
	let bg = U.color;
	let bgRepeat = bgImage.includes('marble') || bgImage.includes('wall') ? 'no-repeat' : 'repeat';
	let bgSize = bgImage.includes('marble') || bgImage.includes('wall') ? 'cover' : '';
	let bgSizeItem = bgSize;
	let list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
	let items = [];
	for (const bgBlend of list) {
		let d = mDom(dTheme, { align: 'center', border: 'red', bgBlend, bg, bgRepeat, bgImage, bgRepeat, bgSize, w: '30%', h: 150 });
		mCenterCenterFlex(d);
		let d1 = mDom(d, { className: 'no_events' })
		mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'white' }, { html: bgBlend })
		mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'black' }, { html: bgBlend })
		let item = { div: d, bgImage, bgRepeat, bgSize: bgSizeItem, bgBlend, isSelected: false };
		items.push(item);
		d.onclick = async () => onclickBlendMode(item);
	}
	return items;
}
async function onclickBlendMode(item) {
	U.texture = pathFromBgImage(item.bgImage);
	U.bgBlend = item.bgBlend;
	U.bgSize = item.bgSize;
	U.bgRepeat = item.bgRepeat;
	U.palette = item.palette;
	await postUserChange();
	setTheme(U);
}
async function _showBlendModes() {
	let d = mBy('dSettingsColor'); mClear(d);
	let dTheme = mDom(d, { padding: 10, gap: 10 }); mFlexWrap(dTheme);
	let bgImage = bgImageFromPath(U.texture);
	let bg = U.color;
	let bgRepeat = bgImage.includes('marble') || bgImage.includes('wall') ? 'no-repeat' : 'repeat';
	let bgSize = bgImage.includes('marble') || bgImage.includes('wall') ? 'cover' : '';
	let bgSizeItem = bgSize;
	let list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
	let items = [];
	for (const bgBlend of list) {
		let d = mDom(dTheme, { align: 'center', border: 'red', bgBlend, bg, bgRepeat, bgImage, bgRepeat, bgSize, w: '30%', h: 150 });
		mCenterCenterFlex(d);
		let d1 = mDom(d, { className: 'no_events' })
		mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'white' }, { html: bgBlend })
		mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'black' }, { html: bgBlend })
		let item = { div: d, bgImage, bgRepeat, bgSize: bgSizeItem, bgBlend, isSelected: false };
		items.push(item);
		d.onclick = async () => onclickBlendMode(item);
	}
	return items;
}

function showim(key, dParent, styles = {}, imgFit = 'fill', useSymbol = false) {
	let o = M.superdi[key];
	let h = valf(styles.h, styles.sz, 100);
	let w = valf(styles.w, styles.sz, 'auto');
	let fz = h * .9;
	let hline = fz;
	addKeys({ w, h, fz, hline }, styles);
	let d1 = mDom(dParent, styles);
	let el;
	if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': imgFit, 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': imgFit, 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	return el;
}
function restVonShowBlendMode() {
	let d = mDom(dParent, { align: 'center', border: 'red', bgBlend, bg, bgImage, bgRepeat, bgSize, w: '30%', h: 150 });
	mCenterCenterFlex(d);
	let d1 = mDom(d, { className: 'no_events' })
	mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'white' }, { html: bgBlend })
	mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'black' }, { html: bgBlend })
	let item = { div: d, bgImage, bgRepeat, bgSize, bgBlend, isSelected: false };
	d.onclick = async () => onclickBlendMode(item);
	return item;
}
//#endregion

//#region 22.mai 24: ai canvas blend-mode
async function createBlendedCanvas(parentDiv, imageSrc) {
	// Create a canvas element
	const cv = document.createElement('canvas');
	cv.width = 500;
	cv.height = 500;
	const ctx = cv.getContext('2d');

	// Append the canvas to the parent div
	parentDiv.appendChild(cv);

	// Fill the canvas with blue
	ctx.fillStyle = 'blue';
	ctx.fillRect(0, 0, cv.width, cv.height);

	// Load the image
	const img = new Image();
	img.src = imageSrc;

	// Return a promise that resolves when the image is loaded and drawn
	return new Promise((resolve, reject) => {
		img.onload = () => {
			// Set the blend mode
			ctx.globalCompositeOperation = 'multiply'; // Change to your desired blend mode

			// Draw the image on top of the blue background
			ctx.drawImage(img, 0, 0, cv.width, cv.height);

			// Resolve the promise with the canvas
			resolve(cv);
		};

		img.onerror = () => {
			reject(new Error('Failed to load the image.'));
		};
	});
}

// Example usage
window.onload = async () => {
	const parentDiv = document.getElementById('parentDiv');
	const imageSrc = 'your-image-url.jpg'; // Replace with your image URL

	try {
		const canvas = await createBlendedCanvas(parentDiv, imageSrc);
		console.log('Canvas created:', canvas);
	} catch (error) {
		console.error(error);
	}
};
//#endregion

//#region 21.mai 24: voriges settings menu: colors, textures, blendmode samples
async function getPaletteFromColorTextureBlend(color, texture, blend, dParent) {
	let elem = mDom(dParent, { w: 100, h: 100, border: 'red', position: 'absolute', top: 100, left: 800 });
	elem.style.backgroundColor = color;
	if (isEmpty(texture)) return colorPalette(color);
	elem.style.backgroundImage = texture.startsWith('url') ? texture : `url("${texture}")`;
	elem.style.backgroundBlend = blend;
	let [repeat, size] = getRepeatAndSizeForTexture(texture);
	elem.style.backgroundRepeat = repeat;
	elem.style.backgroundSize = size;
	return getPaletteFromElem(elem);
}
function getRepeatAndSizeForTexture(t) {
	if (isEmpty(t)) return ['', ''];
	let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
	let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
	return [bgRepeat, bgSize];
}
async function onclickBlendSample(item, items) {
	//console.log('CLICK!!!');//,item)
	let texture = settingsGetSelectedTexture();
	if (nundef(texture)) { console.log('please select a texture'); return; }
	let bgBlend = item.bgBlend; //ev.target.style.backgroundImage;
	let prev = settingsGetSelectedBlend();//console.log(prev)
	if (prev != item) toggleItemSelection(prev);
	toggleItemSelection(item);
	if (item.isSelected) document.body.style.backgroundBlendMode = bgBlend;

	let color = settingsGetSelectedColor();

}
async function onclickColor(item, items) {
	let c = item.color;//ev.target.style.background; 
	toggleItemSelection(item);//console.log('items',items)
	let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
	//console.log('c',c,typeof(c),isEmpty(c))
	if (!isEmpty(c)) c = colorHex(c);
	//if (isEmpty(c)) { console.log('color EMPTY!', item); } //ev.target.style);}
	for (const i of range(0, 9)) { mBy(`dSample${i}`).style.backgroundColor = c; }
	document.body.style.backgroundColor = c;
	// mBy('dPos').style.backgroundColor = c;
}
async function _onclickTexture(item, items) {
	//console.log('item', item)
	let texture = item.bgImage; //ev.target.style.backgroundImage;
	let repeat = item.bgRepeat; //ev.target.style.backgroundRepeat;
	let bgSize = item.bgSize; //repeat == 'repeat'?'auto':'cover';
	let blend = item.bgBlend;
	toggleItemSelection(item);
	let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
	//console.log('texture',texture,'repeat',repeat)
	//if (isEmpty(texture)) { console.log('texture EMPTY!', item); } //ev.target.style);}
	let blendDiv = null;
	for (const i of range(0, 9)) {
		let sample = mBy(`dSample${i}`);
		//console.log(sample.style.backgroundBlend, blend)
		if (sample.style.backgroundBlend == blend) { blendDiv = sample; break; }//console.log('YES!') }
		sample.style.backgroundImage = texture;
		sample.style.backgroundRepeat = repeat;
		sample.style.backgroundSize = bgSize;
	}
	document.body.style.backgroundImage = texture;
	document.body.style.backgroundRepeat = repeat;
	document.body.style.backgroundSize = bgSize;
	if (nundef(blendDiv)) return;
	blendDiv.click();

	let palette = item.palette.map(x => x.hex); console.log(palette);
	let d = mBy('dPalette');
	mClear(d);
	let szSmall = 30;
	for (const c of palette) { mDom(d, { w: szSmall, h: szSmall, bg: c }) }
	mLinebreak(d);

}
function selectUserColor(itemsColor) {
	if (isEmpty(U.color)) U.color = rChoose(itemsColor);
	console.log('user color is', U.color)
	let c = colorHex(U.color);  //console.log(chex,itemsColor)
	let item = itemsColor.find(x => x.color == c);  //console.log('item with same color',item);
	console.log(c, item)
	if (isdef(item)) iDiv(item).click();
	return item.color;
}
function selectUserTexture(itemsTexture) {
	if (isEmpty(U.texture)) { console.log('no texture'); return ''; }
	let item = itemsTexture.find(x => x.bgImage.includes(U.texture));
	if (isdef(item)) iDiv(item).click();
	return isdef(item) ? item.path : '';
}
function selectUserBlend(itemsBlend) {
	if (isEmpty(U.bgBlend)) { console.log('no blend'); return ''; }
	let item = itemsBlend.find(x => x.bgBlend == U.bgBlend);
	if (isdef(item)) iDiv(item).click();
	return isdef(item) ? item.bgBlend : '';
}
function settingsGetSelectedBlend() {
	let item = DA.itemsBlend.find(x => x.isSelected == true);
	return item;
}
function settingsGetSelectedColor() {
	let item = DA.itemsColor.find(x => x.isSelected == true);
	return item;
}
function settingsGetSelectedTexture() {
	let item = DA.itemsTexture.find(x => x.isSelected == true);
	return item;
}
async function settingsSave() {
	let o = { name: U.name };
	let item = settingsGetSelectedColor(); if (isdef(item)) o.color = item.color;
	item = settingsGetSelectedTexture(); if (isdef(item)) o.texture = item.path;
	item = settingsGetSelectedBlend(); if (isdef(item)) o.bgBlend = item.bgBlend;
}
async function _showColors() {
	showTitle('Settings');
	let [szSmall, szMiddle, wmax] = [30, 80, 34 * 15];
	let dParent = mBy('dMain'); mClear(dParent);

	DA.itemsColor = showColorGrid(dParent, szSmall, wmax, onclickColor)

	let dPalette = mDom(dParent, { wmax, hmargin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true }, { id: 'dPalette' });

	DA.itemsTexture = showTextureGrid(dParent, szSmall, wmax, onclickTexture);

	DA.itemsBlend = showBlendGrid(dParent, szMiddle, wmax, onclickBlendSample);

	mButton('Apply', settingsApply, 'dMain', { fz: 24, maleft: 20 });
	mButton('Save', settingsSave, 'dMain', { fz: 24, maleft: 20 });

	let color = selectUserColor(DA.itemsColor);
	let pathTexture = selectUserTexture(DA.itemsTexture);
	if (isEmpty(pathTexture)) return;
	let blend = selectUserBlend(DA.itemsBlend);
}
function showBlendGrid(dParent, sz, wmax, handler) {
	let dBlend = mDom(dParent, { wmax, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
	list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
	let itemsBlend = DA.itemsBlend = [];
	// console.log('list',list.length)
	for (const [idx, mode] of list.entries()) {
		let id = `dSample${idx}`;
		let db = mDom(dBlend, { border: 'white', w: sz, h: sz, 'background-blend-mode': mode, cursor: 'pointer' }, { id, idx });
		let item = { div: db, blend: mode, isSelected: false };
		itemsBlend.push(item);
		db.onclick = () => handler(item, itemsBlend);
	}
	return itemsBlend;
}
function showColorGrid(dParent, sz, wmax, handler) {
	let dColors = mDom(dParent, { wmax, hmargin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true }, { id: 'dColors' });
	let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
	list = M.playerColors.concat(grays);
	let items = [];
	//console.log(BLUEGREEN)
	for (const c of list) {
		let dc = mDom(dColors, { w: sz, h: sz, bg: c, cursor: 'pointer' });
		let item = { div: dc, color: c, isSelected: false };
		//console.log('color',c,dc,item)
		items.push(item);
		dc.onclick = () => handler(item, items);
	}
	return items;
}
function showTextureGrid(dParent, sz, wmax, handler) {
	let dTheme = mDom(dParent, { wmax, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
	list = M.textures;
	let itemsTexture = [];
	for (const t of list) {
		let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
		let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
		let bgImage = `url('${t}')`;
		let recommendedMode = t.includes('ttrans') ? 'normal' : t.includes('marble_') ? 'luminosity' : 'multiply';
		// let dc = mDom(dTheme, { cursor: 'pointer', border: 'black', w: sz, h: sz, 'background-image': bgImage, 'background-blend-mode': recommendedMode });
		let dc = mDom(dTheme, { cursor: 'pointer', border: 'black', w: sz, h: sz }, { tag: 'img' });
		let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, blend: recommendedMode, isSelected: false };
		itemsTexture.push(item);
		dc.onclick = () => handler(item, itemsTexture);
	}
	for (const [i, o] of itemsTexture.entries()) {
		let img = iDiv(o);
		img.onload = () => {
			let pal = ColorThiefObject.getPalette(img);
			if (pal == null) {
				//mach eine transparency palette!
				pal = colorTransPalette();

			}
			if (pal != null) {
				pal.unshift('white'); pal.push('black');
				let n = pal.length;
				pal = pal.map(x => colorHex(x)); // console.log(pal)
				let palhex = Array.from(new Set(pal));// console.log(palhex)
				let palhsl = palhex.map(x => colorHexToHsl360Object(x));
				let lum = palhsl.map(x => x.l);
				let hue = palhsl.map(x => x.h);
				let sat = palhsl.map(x => x.s);
				pal = [];
				for (let i = 0; i < palhex.length; i++) {
					let o = { hex: palhex[i], lum: lum[i], hue: hue[i], sat: sat[i] };
					pal.push(o);
				}
				//if (n!=pal.length) console.log('reduce from',n,'to',pal.length)
			}

			itemsTexture[i].palette = pal;
		}
		img.src = o.path; //,src:t		//let pal=colorPaletteFromUrl(t); //await getPaletteFromElem(dc);

	}
	return itemsTexture;
}
function settingsApply() {
	console.log('apply settings');
	let color = settingsGetSelectedColor();
	let texture = settingsGetSelectedTexture();
	let blend = settingsGetSelectedBlend();
	_setColors(color, texture, blend);
}
function extractUrlFromBlendMode(blend) {
	let parts = blend.split('.');
	console.log('parts', parts);
}
function _setColors(c, texture, blend) {
	// mClass(document.body, 'wood');
	if (nundef(c)) {
		//pickup document.body style
		c = document.body.style.background;
		texture = document.body.style.backgroundImage;
		blend = document.body.style.backgroundBlendMode;
	}
	if (isEmpty(c)) c = 'transparent';
	if (nundef(texture)) texture = '';
	if (nundef(blend)) blend = '';
	let [bgRepeat, bgSize] = getRepeatAndSizeForTexture(texture);
}

//#endregion

//#region 21.mai 24 unused legacy code: isolate and eliminate
function colorHSL(cAny, asObject = false) {
	let res = colorFrom(cAny, undefined, true);
	let shsl = res;
	if (res[0] == '#') {
		if (res.length == 9) {
			shsl = hexAToHSLA(res);
		} else if (res.length == 7) {
			shsl = hexToHSL(res);
		}
	} else if (res[0] == 'r') {
		if (res[3] == 'a') {
			shsl = RGBAToHSLA(res);
		} else {
			shsl = RGBToHSL(res);
		}
	}
	let n = allNumbers(shsl);
	if (asObject) {
		return { h: n[0] / 360, s: n[1] / 100, l: n[2] / 100, a: n.length > 3 ? n[3] : 1 };
	} else {
		return shsl;
	}
}
function colorLum(cAny, percent = false) {
	let hsl = colorHSL(cAny, true);
	return percent ? hsl.l * 100 : hsl.l;
}
function hexAToHSLA(H) {
	let ex = /^#([\da-f]{4}){1,2}$/i;
	if (ex.test(H)) {
		let r = 0,
			g = 0,
			b = 0,
			a = 1;
		if (H.length == 5) {
			r = '0x' + H[1] + H[1];
			g = '0x' + H[2] + H[2];
			b = '0x' + H[3] + H[3];
			a = '0x' + H[4] + H[4];
		} else if (H.length == 9) {
			r = '0x' + H[1] + H[2];
			g = '0x' + H[3] + H[4];
			b = '0x' + H[5] + H[6];
			a = '0x' + H[7] + H[8];
		}
		r /= 255;
		g /= 255;
		b /= 255;
		let cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;
		if (delta == 0) h = 0;
		else if (cmax == r) h = ((g - b) / delta) % 6;
		else if (cmax == g) h = (b - r) / delta + 2;
		else h = (r - g) / delta + 4;
		h = Math.round(h * 60);
		if (h < 0) h += 360;
		l = (cmax + cmin) / 2;
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
		a = (a / 255).toFixed(3);
		return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
	} else {
		return 'Invalid input color';
	}
}
function hexToHSL(H) {
	let ex = /^#([\da-f]{3}){1,2}$/i;
	if (ex.test(H)) {
		let r = 0,
			g = 0,
			b = 0;
		if (H.length == 4) {
			r = '0x' + H[1] + H[1];
			g = '0x' + H[2] + H[2];
			b = '0x' + H[3] + H[3];
		} else if (H.length == 7) {
			r = '0x' + H[1] + H[2];
			g = '0x' + H[3] + H[4];
			b = '0x' + H[5] + H[6];
		}
		r /= 255;
		g /= 255;
		b /= 255;
		let cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;
		if (delta == 0) h = 0;
		else if (cmax == r) h = ((g - b) / delta) % 6;
		else if (cmax == g) h = (b - r) / delta + 2;
		else h = (r - g) / delta + 4;
		h = Math.round(h * 60);
		if (h < 0) h += 360;
		l = (cmax + cmin) / 2;
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
		return 'hsl(' + h + ',' + s + '%,' + l + '%)';
	} else {
		return 'Invalid input color';
	}
}
function hex2RgbObject(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		}
		: null;
}
function HSLAToRGBA(hsla, isPct) {
	let ex = /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
	if (ex.test(hsla)) {
		let sep = hsla.indexOf(',') > -1 ? ',' : ' ';
		hsla = hsla
			.substr(5)
			.split(')')[0]
			.split(sep);
		if (hsla.indexOf('/') > -1) hsla.splice(3, 1);
		isPct = isPct === true;
		let h = hsla[0],
			s = hsla[1].substr(0, hsla[1].length - 1) / 100,
			l = hsla[2].substr(0, hsla[2].length - 1) / 100,
			a = hsla[3];
		if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
		else if (h.indexOf('rad') > -1) h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
		else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
		if (h >= 360) h %= 360;
		let c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
			m = l - c / 2,
			r = 0,
			g = 0,
			b = 0;
		if (0 <= h && h < 60) {
			r = c;
			g = x;
			b = 0;
		} else if (60 <= h && h < 120) {
			r = x;
			g = c;
			b = 0;
		} else if (120 <= h && h < 180) {
			r = 0;
			g = c;
			b = x;
		} else if (180 <= h && h < 240) {
			r = 0;
			g = x;
			b = c;
		} else if (240 <= h && h < 300) {
			r = x;
			g = 0;
			b = c;
		} else if (300 <= h && h < 360) {
			r = c;
			g = 0;
			b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);
		let pctFound = a.indexOf('%') > -1;
		if (isPct) {
			r = +((r / 255) * 100).toFixed(1);
			g = +((g / 255) * 100).toFixed(1);
			b = +((b / 255) * 100).toFixed(1);
			if (!pctFound) {
				a *= 100;
			} else {
				a = a.substr(0, a.length - 1);
			}
		} else if (pctFound) {
			a = a.substr(0, a.length - 1) / 100;
		}
		return 'rgba(' + (isPct ? r + '%,' + g + '%,' + b + '%,' + a + '%' : +r + ',' + +g + ',' + +b + ',' + +a) + ')';
	} else {
		return 'Invalid input color';
	}
}
function hslToHex(h, s, l, alpha) {
	//expects h:0..360, s,l 0..100%, alpha 0..1
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}` + (isdef(alpha) ? alphaToHex(alpha) : '');
}
function hslToHexCOOL(hslColor) {
	const hslColorCopy = { ...hslColor };
	hslColorCopy.l /= 100;
	const a =
		(hslColorCopy.s * Math.min(hslColorCopy.l, 1 - hslColorCopy.l)) / 100;
	const f = (n) => {
		const k = (n + hslColorCopy.h / 30) % 12;
		const color = hslColorCopy.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0");
	};
	return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
function HSLToRGB(hsl, isPct) {
	let ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
	if (ex.test(hsl)) {
		let sep = hsl.indexOf(',') > -1 ? ',' : ' ';
		hsl = hsl
			.substr(4)
			.split(')')[0]
			.split(sep);
		isPct = isPct === true;
		let h = hsl[0],
			s = hsl[1].substr(0, hsl[1].length - 1) / 100,
			l = hsl[2].substr(0, hsl[2].length - 1) / 100;
		if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
		else if (h.indexOf('rad') > -1) h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
		else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
		if (h >= 360) h %= 360;
		let c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
			m = l - c / 2,
			r = 0,
			g = 0,
			b = 0;
		if (0 <= h && h < 60) {
			r = c;
			g = x;
			b = 0;
		} else if (60 <= h && h < 120) {
			r = x;
			g = c;
			b = 0;
		} else if (120 <= h && h < 180) {
			r = 0;
			g = c;
			b = x;
		} else if (180 <= h && h < 240) {
			r = 0;
			g = x;
			b = c;
		} else if (240 <= h && h < 300) {
			r = x;
			g = 0;
			b = c;
		} else if (300 <= h && h < 360) {
			r = c;
			g = 0;
			b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);
		if (isPct) {
			r = +((r / 255) * 100).toFixed(1);
			g = +((g / 255) * 100).toFixed(1);
			b = +((b / 255) * 100).toFixed(1);
		}
		return 'rgb(' + (isPct ? r + '%,' + g + '%,' + b + '%' : +r + ',' + +g + ',' + +b) + ')';
	} else {
		return 'Invalid input color';
	}
}
function hue(h) {
	var r = Math.abs(h * 6 - 3) - 1;
	var g = 2 - Math.abs(h * 6 - 2);
	var b = 2 - Math.abs(h * 6 - 4);
	return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}
function idealTextColor(bg, grayPreferred = false, nThreshold = 105) {
	if (bg.substring(0, 1) != '#') bg = colorNameToHexString(bg);
	rgb = hex2RgbObject(bg);
	r = rgb.r;
	g = rgb.g;
	b = rgb.b;
	var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
	var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
	if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
	return foreColor;
}
function RGBAToHSLA(rgba) {
	let ex = /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
	if (ex.test(rgba)) {
		let sep = rgba.indexOf(',') > -1 ? ',' : ' ';
		rgba = rgba
			.substr(5)
			.split(')')[0]
			.split(sep);
		if (rgba.indexOf('/') > -1) rgba.splice(3, 1);
		for (let R in rgba) {
			let r = rgba[R];
			if (r.indexOf('%') > -1) {
				let p = r.substr(0, r.length - 1) / 100;
				if (R < 3) {
					rgba[R] = Math.round(p * 255);
				}
			}
		}
		let r = rgba[0] / 255,
			g = rgba[1] / 255,
			b = rgba[2] / 255,
			a = rgba[3],
			cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;
		if (delta == 0) h = 0;
		else if (cmax == r) h = ((g - b) / delta) % 6;
		else if (cmax == g) h = (b - r) / delta + 2;
		else h = (r - g) / delta + 4;
		h = Math.round(h * 60);
		if (h < 0) h += 360;
		l = (cmax + cmin) / 2;
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
		return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
	} else {
		return 'Invalid input color';
	}
}
function RGBToHSL(rgb) {
	let ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
	if (ex.test(rgb)) {
		let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
		rgb = rgb
			.substr(4)
			.split(')')[0]
			.split(sep);
		for (let R in rgb) {
			let r = rgb[R];
			if (r.indexOf('%') > -1) rgb[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
		}
		let r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255,
			cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;
		if (delta == 0) h = 0;
		else if (cmax == r) h = ((g - b) / delta) % 6;
		else if (cmax == g) h = (b - r) / delta + 2;
		else h = (r - g) / delta + 4;
		h = Math.round(h * 60);
		if (h < 0) h += 360;
		l = (cmax + cmin) / 2;
		s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);
		return 'hsl(' + h + ',' + s + '%,' + l + '%)';
	} else {
		return 'Invalid input color';
	}
}

function bestContrastingColor(color, colorlist = ['white', 'black']) {
	let contrast = 0;
	let result = null;
	let rgb = colorRGB(color, true);
	rgb = [rgb.r, rgb.g, rgb.b];
	for (c1 of colorlist) {
		let x = colorRGB(c1, true)
		x = [x.r, x.g, x.b];
		let c = colorGetContrast(rgb, x);
		if (c > contrast) { contrast = c; result = c1; }
	}
	return result;
}

function colorFromHSL(hue, sat = 100, lum = 50) {
	return hslToHex(valf(hue, rHue()), sat, lum);
}
function colorHex(cAny) {
	let c = colorFrom(cAny);
	if (c[0] == '#') {
		return c;
	} else {
		let res = pSBC(0, c, 'c');
		return res;
	}
}
function colorHexToRgb(hex) {
	hex = hex.replace(/^#/, '');
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return { r, g, b };
}
function colorHSLBuild(hue, sat = 100, lum = 50) { let result = "hsl(" + hue + ',' + sat + '%,' + lum + '%)'; return result; }
function colorNameToHexString(str) {
	var ctx = document.createElement('canvas').getContext('2d');
	ctx.fillStyle = str;
	return ctx.fillStyle;
}
function colorRGB(cAny, asObject = false) {
	let res = colorFrom(cAny);
	let srgb = res;
	if (res[0] == '#') {
		srgb = pSBC(0, res, 'c');
	}
	let n = allNumbers(srgb);
	if (asObject) {
		return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 };
	} else {
		return srgb;
	}
}
function _colorLight(c, percent = 20, log = true) {
	if (nundef(c)) {
		return colorFromHSL(rHue(), 100, 85);
	} else c = colorFrom(c);
	let zero1 = percent / 100;
	return pSBC(zero1, c, undefined, !log);
}
function colorLighter(c, zero1 = .2, log = true) {
	c = colorFrom(c);
	return pSBC(zero1, c, undefined, !log);
}
function computeColor(c) { return (c == 'random') ? randomColor() : c; }
function getExtendedColors(bg, fg) {
	bg = computeColor(bg);
	fg = computeColor(fg);
	if (bg == 'inherit' && (nundef(fg) || fg == 'contrast')) {
		fg = 'inherit';
	} else if (fg == 'contrast' && isdef(bg) && bg != 'inherit') fg = colorIdealText(bg);
	else if (bg == 'contrast' && isdef(fg) && fg != 'inherit') { bg = colorIdealText(fg); }
	return [bg, fg];
}
function mStyleX(elem, styles, unit = 'px') {
	const paramDict = {
		bg: 'background-color',
		fg: 'color',
		align: 'text-align',
		matop: 'margin-top',
		maleft: 'margin-left',
		mabottom: 'margin-bottom',
		maright: 'margin-right',
		patop: 'padding-top',
		paleft: 'padding-left',
		pabottom: 'padding-bottom',
		paright: 'padding-right',
		rounding: 'border-radius',
		w: 'width',
		h: 'height',
		fontSize: 'font-size',
		fz: 'font-size',
		family: 'font-family',
		weight: 'font-weight',
	};
	let bg, fg;
	if (isdef(styles.bg) || isdef(styles.fg)) {
		[bg, fg] = getExtendedColors(styles.bg, styles.fg);
	}
	if (isdef(styles.vmargin) && isdef(styles.hmargin)) {
		styles.margin = vmargin + unit + ' ' + hmargin + unit;
	}
	if (isdef(styles.vpadding) && isdef(styles.hpadding)) {
		styles.padding = vpadding + unit + ' ' + hpadding + unit;
	}
	for (const k in styles) {
		let val = styles[k];
		let key = k;
		if (isdef(paramDict[k])) key = paramDict[k];
		else if (k == 'font' && !isString(val)) {
			let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
			let ff = f.family;
			let fv = f.variant;
			let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
			let fs = isdef(f.italic) ? 'italic' : f.style;
			if (nundef(fz) || nundef(ff)) return null;
			let s = fz + ' ' + ff;
			if (isdef(fw)) s = fw + ' ' + s;
			if (isdef(fv)) s = fv + ' ' + s;
			if (isdef(fs)) s = fs + ' ' + s;
			elem.style.setProperty(k, s);
			continue;
		} else if (k == 'border') {
			if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
		}
		if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
		else if (key == 'background-color') elem.style.background = bg;
		else if (key == 'color') elem.style.color = fg;
		else {
			elem.style.setProperty(key, makeUnitString(val, unit));
		}
	}
}
function geht(sp) {
	POOLS.augData = makeDefaultPool(sData);
	annotate(sp);
	dynSpec = sp;
	let pool = POOLS.augData;
	for (const oid in pool) {
		let o = pool[oid];
		if (nundef(o.RSG)) continue;
		let info = mergeIncludingPrototype(oid, o);
		INFO[oid] = info;
	}
}

function expandHexShorthand(c) {
	// Check if the input is a valid shorthand hex code
	if (c.length === 4 && c[0] === '#') {
		// Expand each character to double
		let r = c[1];
		let g = c[2];
		let b = c[3];

		return `#${r}${r}${g}${g}${b}${b}`;
	} else {
		// Return the original input if it's not a valid shorthand hex code
		return c;
	}
}
//#endregion

//#region 21.mai 24 todo old showTable
async function ____showTable(table) {
	if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
	let func = DA.funcs[table.game];
	let me = getUname();

	menuCloseHome(); //INTERRUPT();

	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; //console.log(table);
	TPrev = T; T = { table, me };

	let d = T.dMain = mBy('dMain');//mClass(d,'wood')
	let dInstruction = T.dInstruction = mDom(d, { className: 'instruction' }, { html: `Waiting for ${table.fen.turn.join(', ')}` });
	mCenterFlex(dInstruction);
	// let dTitle=T.dTitle=mDom(d,{fz:'2em',weight:'bold',padding:'10'},{html:table.friendly,classes:'title'});
	let dTitle = T.dTitle = mDom(d, {}, { html: table.friendly });
	let dGameover = T.dGameover = mDom(d);
	let dStats = T.dStats = mDom('dMain');
	let dOpenTable = T.dOpenTable = mDom(d);
	// showRibbon(d,"this is the game!")
	//showMessage('HALLO this is a message');
	let dt = testUpdateTestButtons(dTitle); mStyle(dt, { matop: 4 });

	func.present(T);
	func.showStats(T);
	mRise(d);


}
async function ___showTable_rest(table) {
	//showTitle(`${table.friendly}`);
	mStyle('dTitle', { display: 'flex', justify: 'space-between' })
	mDom('dTitle', { fz: '2em', weight: 'bold', maleft: 10, display: 'inline' }, { html: table.friendly, classes: 'title' });
	let dOver = mDom('dMain', {}, { id: 'dGameover' })



	T = func.present('dMain', table, me); //console.log('TPrev',TPrev,'T',T);
	func.showStats(T);
	mRise('dMain');

	if (TESTING) testUpdateTestButtons();

	if (table.status == 'over') return showGameover(table, dOver);
	else if (func.checkGameover(table)) return await sendMergeTable(table);

	if (!table.fen.turn.includes(me)) { staticTitle(table); return; }

	animatedTitle();

	let playmode = getPlaymode(table, me);
	if (playmode == 'bot') return await func.botMove(T);
	else return await func.activate(T);
}
//#endregion 

//#region 20.mai 24: discarded set functions
async function setActivate(items) {
	try {
		T.sets = setFindAllSets(items);
		[T.bNoSet, T.bHint] = setShowButtons(items);
		setActivateCards(items);
		let use_level = getGameOption('use_level'); if (use_level == 'no') { T.bHint.remove(); return; }
		let level = getPlayerProp('level');
		let noset = isEmpty(T.sets);
		T.numHints = level <= 3 ? noset ? 1 : 2 : level <= 5 ? 1 : 0;
		if (level > 5) { T.bHint.remove(); }
		else if (level == 1) { T.autoHints = noset ? 1 : 2; T.hintTimes = [noset ? 10000 : 2000, 5000]; }
		else if (level == 2) { T.autoHints = noset ? 1 : 2; T.hintTimes = [noset ? 10000 : 3000, 8000]; }
		else if (level == 3) { T.autoHints = 1; T.hintTimes = [noset ? 10000 : 4000]; }
		else if (level == 4) { T.autoHints = 1; T.hintTimes = [noset ? 10000 : 8000]; }
		let i = 0;
		while (i < T.autoHints) {
			await mSleep(T.hintTimes[i]);
			if (checkInterrupt(items)) { console.log(`autoHint ${i}`); return; }
			if (DA.stopAutobot == true) { console.log(`autoHint ${i}`); return; }
			await setOnclickHint(items);
			i++;
		}
	} catch { console.log('human: please reload!') }
}
function setActivateCards(items) {
	for (const item of items) {
		let d = iDiv(item);
		d.onclick = () => setOnclickCard(item, items, true);
		mStyle(d, { cursor: 'pointer' })
	}
}
async function setBotMove(table) {
	try {
		let items = T.items;
		[T.bNoSet, T.bHint] = setShowButtons(items); T.bHint.remove();
		mShield(dOpenTable, { bg: '#00000010' });
		let speed = calcBotSpeed(table); console.log('speed', speed);
		T.sets = setFindAllSets(items);
		if (isEmpty(T.sets)) {
			speed *= 3;
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!sleep noset'); return; }
			await setOnclickNoSet(items);
		} else {
			let list = rChoose(T.sets);
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!sleep 1'); return; }
			await setOnclickCard(list[0], items);
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!!sleep 2'); return; }
			await setOnclickCard(list[1], items);
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!!!sleep 3'); return; }
			await setOnclickCard(list[2], items);
		}
		console.log('* END OF AUTOMOVE *');
	} catch { console.log('please reload!') }
}
function setCheckIfSet(keys) {
	let arr = makeArrayWithParts(keys);
	let isSet = arr.every(x => arrAllSameOrDifferent(x));
	return isSet;
}
function setDrawCard(card, dParent, colors, sz = 100) {
	const paths = {
		diamond: "M25 0 L50 50 L25 100 L0 50 Z",
		squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
		oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
	}
	let [color, shape, num, fill] = card.split('_');
	var attr = {
		d: paths[shape],
		fill: fill == 'striped' ? `url(#striped-${color})` : fill == 'solid' ? colors[color] : 'none',
		stroke: colors[color],
		'stroke-width': 2,
	};
	let h = sz, w = sz / .65;
	let ws = w / 4;
	let hs = 2 * ws;
	let d0 = mDom(dParent, { display: 'flex', w, h, bg: 'white', rounding: 10 });
	mStyle(d0, { justify: 'center', 'align-items': 'center', gap: 6 })
	let shapeSvg = `<svg viewbox="-2 -2 54 104">` + makeSVG("path", attr) + '</svg>';
	for (const i of range(num)) {
		let d1 = mDom(d0, { h: hs, w: ws }, { html: shapeSvg });
	}
	return d0;
}
function setFindAllSets(items) {
	let result = [];
	for (var x = 0; x < items.length; x++) {
		for (var y = x + 1; y < items.length; y++) {
			for (var z = y + 1; z < items.length; z++) {
				assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
				let list = [items[x], items[y], items[z]];
				let keys = list.map(x => x.key);
				if (setCheckIfSet(keys)) result.push(list);
			}
		}
	}
	if (isEmpty(result)) console.log('no set!')
	return result;
}
function setGameover(table) {
	table.status = 'over';
	table.winners = getPlayersWithMaxScore(table);
}
function setHintHide() { mClass(T.bHint, 'disabled'); } //mStyle(T.bHint,{display:'hidden'}); } //T.bHint.remove();}

function setLoadPatterns(dParent, colors) {
	dParent = toElem(dParent);
	let id = "setpatterns";
	if (isdef(mBy(id))) { return; }
	let html = `
    <svg id="setpatterns" width="0" height="0">
      <!--  Define the patterns for the different fill colors  -->
      <pattern id="striped-red" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 H5" style="stroke:${colors.red}; stroke-width:1" />
      </pattern>
      <pattern id="striped-green" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 H5" style="stroke:${colors.green}; stroke-width:1" />
      </pattern>
      <pattern id="striped-purple" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 H5" style="stroke:${colors.purple}; stroke-width:1" />
      </pattern>
    </svg>
    `;
	let el = mCreateFrom(html);
	mAppend(dParent, el)
}
async function setOnclickCard(item, items, direct = false) {
	if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
	else if (direct) stopAutobot();
	else if (!direct && item.isSelected) { console.log('already clicked!'); return; }
	else if (DA.stopAutobot == true) { assertion(!direct, 'direct and autobot true'); return; }
	toggleItemSelection(item);
	let selitems = items.filter(x => x.isSelected);
	let [keys, m] = [selitems.map(x => x.key), selitems.length];
	let olist = [];
	if (m == 3) {
		clearEvents();
		mShield(dOpenTable, { bg: '#00000000' }); //disable ui
		let [me, table] = [getUname(), T];
		let [fen, pl] = [table.fen, table.players[me]];
		let isSet = setCheckIfSet(keys);
		if (isSet) {
			assertion(fen.cards.length >= table.options.numCards || isEmpty(fen.deck), `LOGISCHER IRRTUM SET REPLENISH ${fen.cards.length}, deck:${fen.deck.length}`)
			let toomany = Math.max(0, fen.cards.length - table.options.numCards);
			let need = Math.max(0, 3 - toomany);
			let newCards = deckDeal(fen.deck, need);
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i])
			olist.push({ keys: ['fen', 'cards'], val: table.fen.cards });
			olist.push({ keys: ['fen', 'deck'], val: table.fen.deck });
			pl.score++;
			pl.incScore = 1;
		} else {
			pl.score--;
			pl.incScore = -1;
		}
		olist.push({ keys: ['players', me, 'score'], val: pl.score });
		if (pl.playmode == 'bot') {
			await mSleep(500);
			if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
		}
		let res = await sendMergeTable({ id: table.id, name: me, olist }); // console.log('res', res)
	}
}
async function setOnclickHint(items, direct = false) {
	assertion(T.numHints > 0, 'NO Hints left!!!!');
	if (direct) stopAutobot();
	T.numHints -= 1;
	if (isEmpty(T.sets)) {
		let elem = T.bNoSet;
		T.numHints = 0; setHintHide();
		ANIM.button = scaleAnimation(elem);
		return;
	} else if (nundef(T.hintSet)) {
		T.hintSet = rChoose(T.sets);
	} else {
		let sofar = T.items.filter(x => x.isSelected);
		if (sofar.length >= 2) {
			return;
		}
	}
	let item = T.hintSet.find(x => !x.isSelected);
	if (!T.numHints) setHintHide();
	await setOnclickCard(item, T.items, direct);
}
async function setOnclickNoSet(items, direct = false) {
	if (direct) stopAutobot();
	mShield(dOpenTable, { bg: '#00000000' }); //disable ui
	let b = T.bNoSet; mClass(b, 'framedPicture')
	let [me, table] = [getUname(), T];
	let [fen, pl] = [table.fen, table.players[me]];
	let olist = [];
	if (isEmpty(T.sets)) {
		pl.score++;
		pl.incScore = 1;
		let newCards = deckDeal(fen.deck, 1);
		if (!isEmpty(newCards)) {
			fen.cards.push(newCards[0]);
			olist.push({ keys: ['fen', 'cards'], val: table.fen.cards });
			olist.push({ keys: ['fen', 'deck'], val: table.fen.deck });
		} else {
			setGameover(table);
			olist.push({ keys: ['status'], val: table.status });
			olist.push({ keys: ['winners'], val: table.winners });
			console.log(`table status is now ${table.status}`);
			assertion(table.status == 'over', "HAAAAAAAAALLLLLLLO")
		}
	} else {
		pl.score--;
		pl.incScore = -1;
	}
	olist.push({ keys: ['players', me, 'score'], val: pl.score });
	if (pl.playmode == 'bot') {
		await mSleep(500);
		if (checkInterrupt(items)) { console.log('!!!onclick noset!!!'); return; }
	}
	let res = await sendMergeTable({ id: table.id, name: me, olist });
}
async function setPresent(dParent, table) {
	const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' };
	setLoadPatterns('dPage', colors);
	mClear(dParent);
	let d = mDom(dParent, { margin: 10 });
	[dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(d);
	let [fen, playerNames, players, turn] = [table.fen, table.playerNames, table.players, table.turn];
	let cards = fen.cards;
	let dp = mDom(dOpenTable, { w100: true }); mCenterFlex(dp);
	let dBoard = T.dBoard = mGrid(cards.length / 3, 3, dp, { gap: 14 });
	let items = [];
	for (const c of cards) {
		let d = setDrawCard(c, dBoard, colors, TESTING ? 80 : 100);
		let item = mItem({ div: d }, { key: c });
		items.push(item);
	}
	setStats(table, dOben, 'rowflex', false);
	return items;
}
function setShowButtons(items) {
	let buttons = mDom(dOpenTable, { w100: true, gap: 10, matop: 20 }); mCenterCenterFlex(buttons);
	let bno = mButton('NO Set', () => setOnclickNoSet(items, true), buttons, { w: 80 }, 'input');
	let bhint = mButton('Hint', () => setOnclickHint(items, true), buttons, { w: 80 }, 'input');
	return [bno, bhint];
}
function setStats(table, dParent, layout, showTurn = true) {
	let [fen, me] = [table.fen, getUname()];
	let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
	let player_stat_items = uiTypePlayerStats(table, me, dParent, layout, style)
	let uselevel = getGameOption('use_level');
	let botLevel = Math.floor(calcBotLevel(table));
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		let item = player_stat_items[plname];
		if (pl.playmode == 'bot') {
			let c = getLevelColor(botLevel);
			mStyle(item.img, { rounding: 0, border: `${c} ${botLevel}px solid` });
		}
		let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
		playerStatCount('star', pl.score, d);
		if (uselevel != 'yes') continue;
		mDom(d, { fz: 11, round: true, hpadding: 3, fg: 'contrast', bg: getLevelColor(pl.level), position: 'absolute', top: 1, right: 2 }, { html: pl.level })
	}
}

//#endregion

//#region 19.mai 24: calcHeightLeftUnder('dExtra')

//#region 19.mai 24: resolvePending wird wieder eliminiert! hier die version mit resolvePending:
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	let me = getUname();
	let table = await mGetRoute('table', { id });	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game];

	if (table.status == 'started' && isdef(table.pending)) {
		func.resolvePending(table); // deterministic!!! (table.pending)
		if (table.status == 'over') { mPostRoute('postTable', table); return; }
	}

	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title

	//let tableSize = calcHeightLeftUnder('dExtra') - 40; //height visible in browser
	d = mDom('dMain'); mCenterFlex(d);

	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction

	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}
function setgame() {

	function setup(table) {
		//console.log('setup',table)
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
		}
		fen.deck = setCreateDeck();
		fen.cards = deckDeal(fen.deck, table.options.numCards);
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function resolvePending(table) {
		let [fen, players] = [table.fen, table.players];
		let pending = table.pending; delete table.pending;
		let [name, move] = [pending.name, pending.move];

		let skip = false;

		if (isdef(move.noset)) {
			if (move.noset == 'correct') {
				players[name].score += 1;
				let newCards = deckDeal(fen.deck, 1); //add 1 cards!
				if (!isEmpty(newCards)) fen.cards.push(newCards[0]);
				DA.pendingChanges = [['players', name, 'score'], ['fen']];
			} else {
				//console.log('INCORRECT NOSET!!!!');
				players[name].score -= 1;
				DA.pendingChanges = [['players', name, 'score']];
			}
		} else {
			let isSet = setCheckIfSet(move);
			if (isSet) {
				players[name].score += 1;

				//calc how to replace cards from set
				let toomany = Math.max(0, fen.cards.length - table.options.numCards);
				let need = Math.max(0, 3 - toomany);
				let newCards = deckDeal(fen.deck, need);
				for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, move[i], newCards[i]); else removeInPlace(fen.cards, move[i]);

				DA.pendingChanges = [['players', name, 'score'], ['fen']];
			} else {
				//console.log('INCORRECT SET!!!!');
				players[name].score -= 1;
				DA.pendingChanges = [['players', name, 'score']];
			}
		}

		// ***TODO*** nicht ganz correct hier!!!
		if (isEmpty(fen.deck)) {
			table.winners = getPlayersWithMaxScore(table);
			table.status = 'over';
			table.turn = [];
			delete DA.pendingChanges;
		}
	}
	function present(table) {
		const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' };
		setLoadPatterns('dPage', colors);
		let fen = table.fen;
		mStyle('dTable', { padding: 50, wmin: 500 });//rounding:250});
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let rows = fen.cards.length / 3;
		let sz = Math.min(80, Math.round(400 / rows));
		let dBoard = T.dBoard = mGrid(rows, 3, d, { gap: 14 });
		let items = [];
		for (const c of fen.cards) {
			let dc = setDrawCard(c, dBoard, colors, sz); //TESTING ? 80 : 100);
			let item = mItem({ div: dc }, { key: c });
			items.push(item);
		}

		let oset = setFindOneSet(items);
		console.log('set', oset ? oset.keys : 'NO SET');
		//if (oset)	console.log('set',oset.keys); else console.log('NO')

		return items;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d); //, {}, {id:`stat_${plname}_score`});
		}
	}
	async function activate(table, items) {
		let myTurn = isMyTurn(table);

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}

		//show no set button
		let dParent = mBy('dTable').parentNode;
		mIfNotRelative(dParent);
		let bNoSet = mButton('No Set', () => onclickNoSet(table, items), dParent, { className: 'button' });
		mPos(bNoSet, window.innerWidth / 2 + 180, 110);

		if (amIHuman(table)) return;

		//bot move activation: random move
		TO.bot = setInterval(async () => {
			//console.log('BOT!!!',table.step);
			let item = rChoose(items);
			await onclickCard(table, item, items);
		}, rNumber(1000, 4000));

	}

	//#region set specific functions
	function setCheckIfSet(keys) {
		let arr = makeArrayWithParts(keys);
		let isSet = arr.every(x => arrAllSameOrDifferent(x));
		return isSet;
	}
	function setCreateDeck() {
		let deck = [];
		['red', 'purple', 'green'].forEach(color => {
			['diamond', 'squiggle', 'oval'].forEach(shape => {
				[1, 2, 3].forEach(num => {
					['solid', 'striped', 'open'].forEach(fill => {
						deck.push(`${color}_${shape}_${num}_${fill}`);
					});
				});
			});
		});
		arrShuffle(deck);
		return deck;
	}
	function setDrawCard(card, dParent, colors, sz = 100) {
		const paths = {
			diamond: "M25 0 L50 50 L25 100 L0 50 Z",
			squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
			oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
		}
		let [color, shape, num, fill] = card.split('_');
		var attr = {
			d: paths[shape],
			fill: fill == 'striped' ? `url(#striped-${color})` : fill == 'solid' ? colors[color] : 'none',
			stroke: colors[color],
			'stroke-width': 2,
		};
		let h = sz, w = sz / .65;
		let ws = w / 4;
		let hs = 2 * ws;
		let d0 = mDom(dParent, { display: 'flex', w, h, bg: 'white', rounding: 10 });
		mStyle(d0, { justify: 'center', 'align-items': 'center', gap: 6 })
		let shapeSvg = `<svg viewbox="-2 -2 54 104">` + makeSVG("path", attr) + '</svg>';
		for (const i of range(num)) {
			let d1 = mDom(d0, { h: hs, w: ws }, { html: shapeSvg });
		}
		return d0;
	}
	function setFindAllSets(items) {
		let result = [];
		for (var x = 0; x < items.length; x++) {
			for (var y = x + 1; y < items.length; y++) {
				for (var z = y + 1; z < items.length; z++) {
					assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
					let list = [items[x], items[y], items[z]];
					let keys = list.map(x => x.key);
					if (setCheckIfSet(keys)) result.push(list);
				}
			}
		}
		if (isEmpty(result)) console.log('no set!')
		return result;
	}
	function setFindOneSet(items) {
		for (var x = 0; x < items.length; x++) {
			for (var y = x + 1; y < items.length; y++) {
				for (var z = y + 1; z < items.length; z++) {
					assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
					let list = [items[x], items[y], items[z]];
					let keys = list.map(x => x.key);
					if (setCheckIfSet(keys)) return { items: list, keys };
				}
			}
		}
		console.log('no set!')
		return null;
	}
	function setLoadPatterns(dParent, colors) {
		dParent = toElem(dParent);
		let id = "setpatterns";
		if (isdef(mBy(id))) { return; }
		let html = `
			<svg id="setpatterns" width="0" height="0">
				<!--  Define the patterns for the different fill colors  -->
				<pattern id="striped-red" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.red}; stroke-width:1" />
				</pattern>
				<pattern id="striped-green" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.green}; stroke-width:1" />
				</pattern>
				<pattern id="striped-purple" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.purple}; stroke-width:1" />
				</pattern>
			</svg>
			`;
		let el = mCreateFrom(html);
		mAppend(dParent, el)
	}

	async function onclickCard(table, item, items) {
		toggleItemSelection(item);
		let selitems = items.filter(x => x.isSelected);
		let [keys, m] = [selitems.map(x => x.key), selitems.length];
		if (m == 3) {
			clearEvents();
			mShield('dTable', { bg: 'transparent' });
			let id = table.id;
			let name = getUname();
			let move = keys;
			let step = table.step;
			let olist = [{ keys: ['pending'], val: { name, move } },];
			if (isdef(DA.pendingChanges)) {
				for (const klist of DA.pendingChanges) {
					olist.push({ keys: klist, val: lookup(table, klist) });
				}
			}
			let o = { id, name, olist, step };

			let isSet = setCheckIfSet(keys);
			if (isSet) o.stepIfValid = step + 1;

			let res = await mPostRoute('olist', o); //console.log(res);
		}
	}
	async function onclickNoSet(table, items) {
		console.log('was nun?');
		clearEvents();
		mShield('dTable', { bg: 'transparent' });

		let oset = setFindOneSet(items);

		let id = table.id;
		let name = getUname();
		let move = oset ? { noset: 'wrong', keys: oset.keys } : { noset: 'correct' };
		let step = table.step;
		let olist = [{ keys: ['pending'], val: { name, move } },];
		if (isdef(DA.pendingChanges)) {
			for (const klist of DA.pendingChanges) {
				olist.push({ keys: klist, val: lookup(table, klist) });
			}
		}
		let o = { id, name, olist, step };

		if (!oset) o.stepIfValid = step + 1;
		let res = await mPostRoute('olist', o); //console.log(res);
	}

	//#endregion

	return { setup, resolvePending, present, stats, activate };
}
//#endregion

//#region 19.mai 24: skip variante geht nicht!!! revert!
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	let me = getUname();
	let table = await mGetRoute('table', { id });	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game];

	if (table.status == 'started' && isdef(table.pending)) {
		let skip = func.resolvePending(table); console.log('skip', skip); // deterministic!!! (table.pending)
		if (table.status == 'over') { mPostRoute('postTable', table); return; }
		else if (skip && isdef(mBy('dTable'))) return;
	}

	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title

	//let tableSize = calcHeightLeftUnder('dExtra') - 40; //height visible in browser
	d = mDom('dMain'); mCenterFlex(d);

	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction

	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}
function resolvePending(table) {
	let [fen, players] = [table.fen, table.players];
	let pending = table.pending; delete table.pending;
	let [name, move] = [pending.name, pending.move];

	let skip = false;

	if (isdef(move.noset)) {
		if (move.noset == 'correct') {
			players[name].score += 1;
			let newCards = deckDeal(fen.deck, 1); //add 1 cards!
			if (!isEmpty(newCards)) fen.cards.push(newCards[0]);
			DA.pendingChanges = [['players', name, 'score'], ['fen']];
		} else {
			console.log('INCORRECT NOSET!!!!');
			players[name].score -= 1;
			DA.pendingChanges = [['players', name, 'score']];
			skip = name != getUname();
			modifyStat(name, 'score', players[name].score); //mach ui changes gleich und skip

		}
	} else {
		let isSet = setCheckIfSet(move);
		if (isSet) {
			players[name].score += 1;

			//calc how to replace cards from set
			let toomany = Math.max(0, fen.cards.length - table.options.numCards);
			let need = Math.max(0, 3 - toomany);
			let newCards = deckDeal(fen.deck, need);
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, move[i], newCards[i]); else removeInPlace(fen.cards, move[i]);

			DA.pendingChanges = [['players', name, 'score'], ['fen']];
		} else {
			console.log('HALLO!!!!');
			DA.pendingChanges = [['players', name, 'score']];
			skip = name != getUname();
			modifyStat(name, 'score', players[name].score); //mach ui changes gleich und skip

		}
	}


	// ***TODO*** nicht ganz correct hier!!!
	if (isEmpty(fen.deck)) {
		table.winners = getPlayersWithMaxScore(table);
		table.status = 'over';
		table.turn = [];
		delete DA.pendingChanges;
	}
	return skip;
}
//#endregion

//#region 18.mai 24
async function showThemeEditor() {
	let d = mBy('dSettingsColor'); mClear(d);
	let sam = mDom(d, { margin: 20, w: '80vw', h: '80vh', bg: 'white' });
	let dnav = mDom(sam, { h: '20%', bg: 'orange' });
	let drest = mDom(sam, { h: '80%' });
	let [dside, dmain] = mColFlex(drest, [1, 5], ['blue', 'green']);
	let [bg, bgImage, bgSize, bgBlend, bgRepeat, fg] = [U.bg, U.bgImage, U.bgSize, U.bgBlend, U.bgRepeat, U.fg];
}
function __animate(elem, aniclass, timeoutms) {
	mClass(elem, aniclass);
	TO.anim = setTimeout(() => mRemoveClass(elem, aniclass), timeoutms);
}
function __setup() {
	axiom = system.axiom;
	rules = system.rules;
	factor = valf(system.factor, 1);
	angle = radians(valf(system.angle, 60));
	sentence = axiom;
	let button = createButton("generate"); button.mousePressed(generate);
	button = createButton("animate"); button.mousePressed(() => interval_id = setInterval(generate, 500));
	createCanvas(400, 400);
	background(51);
	createP(axiom);
	turtle();
}
function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	assertion(me in players, "_createOpenTable without owner!!!!!")
	for (const name in players) { addIf(playerNames, name); }
	let pdict = {};
	for (const name of playerNames) { pdict[name] = players[name]; }
	// 	let o = {};
	// 	let pl = players[name];
	// 	for (const k in pl) {
	// 		if (k == gamename) { addKeys(pl[gamename], o); }
	// 		else if (k == options) { addKeys(pl.options, o); }
	// 		else if (!['div', 'isSelected'].includes(k)) o[k] = pl[k];
	// 	}
	// 	// let opts = pl.options; delete pl.options; addKeys(opts, pl);
	// 	pdict[name] = o;
	// }
	assertion(playerNames[0] == me, `_addTable: owner should be ${me} and first in ${playerNames.join(',')}`);

	//vielleicht sort player keys
	// //mach das hier schon dass die options aufgeteilt werden!!!
	// if (TESTING && gamename == 'setgame') {
	// 	let keys = ['playmode', 'score', 'level', 'name', 'color', 'key'];
	// 	let osorted = {};
	// 	for (const k of keys) { osorted[k] = o[k]; }
	// 	pdict[name] = osorted;
	// } else pdict[name] = o;

	console.log('pdict', jsCopy(pdict));

	let t = {
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players: pdict,
		playerNames: playerNames,
		options
	};
	return t;
}
function collectPlayers() {
	let players = {};
	for (const name of DA.playerList) {
		// players[name] = allPlToPlayer(name);
		let o = {}
		let da = DA.allPlayers[name];
		for (const k in da) {
			if (k == 'options') { addKeys(da.options, o) }
			else if (k == 'div' || k == 'isSelected') continue;
			else o[k] = da[k];
		}
		players[name] = o;

	}
	return players;
}
function allPlayerToUser(name, gamename) {
	//assumes Serverdata.users is up-to-date!
	//converts from player back to user of gamename
	//all keys that are player options in gamename are copied back to user.games[gamename] object
	let poss = valf(getGamePlayerOptions(gamename), {});
	let optKeys = Object.keys(poss);

	let exceptKeys = ['div', 'isSelected', 'playmode'].concat(optKeys);

	let user = jsCopyExceptKeys(DA.allPlayers[name], exceptKeys);


}
function muell(name, gamename) {
	let pl = jsCopyExceptKeys(Serverdata.users[name], ['games']);
	let options = valf(getUserOptionsForGame(name, gamename), {});
	addKeys(options, pl);

	pl.playmode = playmode;

	//for all the player options in this game, if this user does not have the corresponding options,
	//copy the default value from game options	
	let poss = getGamePlayerOptions(gamename);
	console.log('poss', poss);
	for (const p in poss) {
		if (isdef(pl[p])) continue;
		let val = poss[p];
		let defval = arrLast(val.split(','));
		if (isNumber(defval)) defval = Number(defval);
		pl[p] = defval;
		//console.log('default for',p,'is',defval);
	}
	return pl;
}
async function saveAndUpdatePlayerOptions(allPl, gamename) {
	let name = allPl.name;
	let poss = getGamePlayerOptionsAsDict(gamename);

	// let allPlCopy = jsCopyExceptKeys(allPl, ['div', 'isSelected']);
	// console.log('___saveAndUpdatePlayerOptions', name, '\nallPl', allPlCopy, '\nposs', jsCopy(poss));

	if (nundef(poss)) return;

	let opts = {};
	for (const p in poss) {
		allPl[p] = getRadioValue(p);
		if (p == 'playmode') continue;
		opts[p] = allPl[p];
	}

	let id = 'dPlayerOptions'; mRemoveIfExists(id); //dont need UI anymore

	let oldOpts = valf(getUserOptionsForGame(name, gamename), {});

	let changed = false;
	for (const p in poss) {
		if (p == 'playmode') continue;
		if (oldOpts[p] != opts[p]) { changed = true; break; }
	}

	if (changed) {
		let games = valf(Serverdata.users[name].games, {});
		games[gamename] = opts;
		await postUserChange({ name, games })
	}
}
function createGamePlayer(name, gamename, opts = {}) {
	let pl = jsCopy(Serverdata.users[name]);
	let plopts = valf(pl.options, {}); delete pl.options;
	copyKeys(opts, plopts);
	let defopts = Serverdata.config.games[gamename].ploptions;
	for (const k in defopts) {
		let val = plopts[k];
		if (nundef(val)) {
			let vals = defopts[k].split(',').map(x => x.trim());
			val = arrLast(vals);
			if (isNumeric(val)) val = Number(val);
			plopts[k] = val;
		}
	}
	copyKeys(plopts, pl);
	return pl;
}
async function collectPlayerOptions(allPl, gamename) {
	let name = allPl.name;
	let options = allPl.options;
	let poss = Serverdata.config.games[gamename].ploptions;

	console.log('___collectPlayerOptions', name, '\npl.options', jsCopy(allPl.options), '\nposs', jsCopy(poss))

	if (nundef(poss)) return options;
	for (const p in poss) {
		options[p] = getRadioValue(p);
	}
	//pl[gamename] = options;
	let id = 'dPlayerOptions'; mRemoveIfExists(id);//mRemove(d);
	let uold = Serverdata.users[allPl.name];
	let unew = {};
	for (const k in allPl) {
		if (['div', 'isSelected', 'playmode', 'options'].includes(k)) continue;
		unew[k] = jsCopy(allPl[k]);
	}
	lookupSetOverride(unew, ['games', gamename], options);
	for (const k in unew.options) {
		if (k == 'playmode') continue;
		if (lookup(uold, ['games', gamename, k]) != lookup(unew, ['games', gamename, k])) {
			let res = await postUserChange(unew);
			let o = DA.allPlayers[name];
			copyKeys(res, o);
			o.options = lookup(res, ['games', gamename]);
			delete o.games;
			delete o.options.playmode;
			DA.allPlayers[name] = o;
			return;
		}
	}
}
async function setPlayerPlaying(item, gamename) {
	let [name, da] = [item.name, item.div];
	addIf(DA.playerList, name);
	selectPlayerItem(item);
	await collectFromPrevious(gamename);
	let id = 'dPlayerOptions';
	DA.lastPlayerItem = item;
	let poss = getGamePlayerOptions(gamename);
	if (nundef(poss)) return;
	let dParent = mBy('dGameMenu'); //mBy('dMain'); //mBy('dGameMenu'); //document.body;
	let bg = getUserColor(name);
	let rounding = 6;
	let d1 = mDom(dParent, { bg: colorLight(bg, 50), border: `solid 2px ${bg}`, rounding, display: 'inline-block', hpadding: 3, rounding }, { id });
	mDom(d1, {}, { html: `${name}` }); //title
	d = mDom(d1, {}); mCenterFlex(d);
	mCenterCenter(d);
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = formatLegend(key);
			let fs = mRadioGroup(d, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, false); }
			let userval = lookup(DA.allPlayers, [name, 'options', p]);
			let radio;
			let chi = fs.children;
			for (const ch of chi) {
				let id = ch.id;
				if (nundef(id)) continue;
				let radioval = stringAfterLast(id, '_');
				if (isNumber(radioval)) radioval = Number(radioval);
				if (userval == radioval) ch.firstChild.checked = true;
				else if (nundef(userval) && `${radioval}` == arrLast(list)) ch.firstChild.checked = true;
			}
			measureFieldset(fs);
		}
	}
	let r = getRectInt(da, mBy('dGameMenu'));
	let rp = getRectInt(d1);
	let [y, w, h] = [r.y - rp.h - 4, rp.w, rp.h];
	let x = r.x - rp.w / 2 + r.w / 2;
	if (x < 0) x = r.x - 22;
	if (x > window.innerWidth - w - 100) x = r.x - w + r.w + 14;
	mIfNotRelative(dParent);
	mPos(d1, x, y);
	mButtonX(d1, ev => collectPlayerOptions(item, gamename), 18, 3, 'dimgray');
}
async function showGamePlayers(dParent, users) {
	let me = getUname();
	mStyle(dParent, { wrap: true });
	let userlist = ['amanda', 'felix', 'mimi'];
	for (const name in users) addIf(userlist, name);
	for (const name of userlist) {
		let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
		d.setAttribute('username', name)
		let img = showUserImage(name, d, 40);
		let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
		let item = jsCopy(users[name]);


		delete item.games;
		let options = valf(lookup(users, [name, 'games', DA.gamename]), {});
		item.options = jsCopy(options);
		item.div = d;
		item.isSelected = false;
		DA.allPlayers[name] = item;
		d.onclick = onclickGameMenuPlayer;
	}
	await clickOnPlayer(me);
}

function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	assertion(me in players, "createOpenTable without owner!!!!!")
	for (const name in players) { addIf(playerNames, name); }
	let pdict = {};
	for (const name of playerNames) {
		let o = {};
		let pl = players[name];
		for (const k in pl) {
			if (k == gamename) { addKeys(pl[gamename], o); }
			else if (!['div', 'isSelected'].includes(k)) o[k] = pl[k];
		}
		pdict[name] = o;
	}
	assertion(playerNames[0] == me, `_addTable: owner should be ${me} and first in ${playerNames.join(',')}`);

	// //mach das hier schon 
	// if (TESTING && gamename == 'setgame') {
	// 	let keys = ['playmode', 'score', 'level', 'name', 'color', 'key'];
	// 	let osorted = {};
	// 	for (const k of keys) { osorted[k] = o[k]; }
	// 	pdict[name] = osorted;
	// } else pdict[name] = o;


	let t = {
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players: pdict,
		playerNames: playerNames,
		options
	};
	return t;
}

function button96() {

	function setup(table) {
		//console.log('setup:table',table)
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			let opts = pl.options;
			delete pl.options;
			addKeys(opts, pl)
			pl.score = 0;
		}
		fen.cards = [1, 2, 3];
		fen.deck = range(4, 100); //[4, 5, 6, 7, 8, 9, 10];
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function resolvePending(table) {
		//console.log('resolvePending',table.pending)
		let [fen, players] = [table.fen, table.players];
		let pending = table.pending; delete table.pending;
		let [name, move] = [pending.name, pending.move];

		let best = arrMinMax(fen.cards).min; //check if the card is the best
		if (move == best) {
			players[name].score += 1;
			removeInPlace(fen.cards, move);
			let cardlist = deckDeal(fen.deck, 1); //console.log('new card(s)',cardlist);
			if (!isEmpty(cardlist)) fen.cards.push(cardlist[0]);
			DA.pendingChanges = [['players', name, 'score'], ['fen']];
		} else {
			players[name].score -= 1;
			DA.pendingChanges = [['players', name, 'score']];
		}

	}
	function present(table) {
		let [fen, players] = [table.fen, table.players];
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let items = [];
		for (const card of fen.cards) {
			//console.log('card',card)
			let item = cNumber(card);
			mAppend(d, iDiv(item));
			items.push(item);
			item.feno = card;
			//console.log(c);
		}
		return items;
	}
	function stats(table) {
		let [fen, me, players] = [table.fen, getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') {
				mStyle(item.img, { rounding: 0 });
			}

			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d);
		}
	}
	async function activate(table, items) {
		let fen = table.fen;
		let instruction = 'must click a card';
		let html = (isMyTurn(table) ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` + "&nbsp;" + instruction : `waiting for: ${getTurnPlayers(table)}`);
		let dinst = mBy('dInstruction'); mClear(dinst);
		let style = { display: 'flex', 'justify-content': 'center', 'align-items': 'center' };
		if (isMyTurn(table)) style.maleft = -30;
		mDom(dinst, style, { html });

		if (!isMyTurn(table)) return;

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item);
		}

		if (amIHuman(table)) return;

		//bot move activation
		TO.bot = setInterval(async () => {
			//console.log('BOT!!!',table.step);
			let list = sortBy(items, x => x.feno); //console.log(list);
			let item = list[0]; //rChoose(items);
			await onclickCard(table, item);
		}, rNumber(1000, 4000));

	}

	async function onclickCard(table, item) {
		mShield('dTable', { bg: 'transparent' });

		//highlight clicked card
		let d = iDiv(item);
		let ms = rChoose(range(300, 400));
		mClass(d, 'framedPicture'); TO.hallo = setTimeout(() => mClassRemove(d, 'framedPicture'), ms);
		try { await mSleep(ms); } catch (err) { console.log("ERR", err); return; }

		let id = table.id;
		let name = getUname();
		let move = item.feno;
		let step = table.step;
		let olist = [
			{ keys: ['pending'], val: { name, move } },
		];
		if (isdef(DA.pendingChanges)) {
			for (const klist of DA.pendingChanges) {
				olist.push({ keys: klist, val: lookup(table, klist) });
			}
		}

		let o = { id, name, olist, step };
		let best = arrMinMax(table.fen.cards).min;

		if (move == best) o.stepIfValid = step + 1; // nur 1 kann punkt kriegen pro runde

		let res = await mPostRoute('olist', o); console.log(res);
	}

	return { setup, resolvePending, present, stats, activate }; //, activate, checkGameover, showStats, botMove };
}
async function testOnclickDeck0() {
	let tnew = jsCopy(T);
	tnew.fen.deck = [];
	let res = await sendMergeTable({ name: getUname(), id: tnew.id, table: tnew });
	console.log('res', res.fen.deck)
}
function checkInterrupt(items) {
	return isdef(T) && items[0] == T.items[0] && isdef(DA.Tprev) && T.items[0] == DA.Tprev.items[0];
}
//#endregion

//#region 17.mai 24
async function switchToUser(uname, menu) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	localStorage.setItem('username', uname);
	iDiv(UI.user).innerHTML = uname;
	setTheme(U);
	menu = valf(menu, Clientdata.curMenu, localStorage.getItem('menu'), 'home');
	switchToMainMenu(menu);
	if (menu == 'table') {
		assertion(Clientdata.table, "Table menu without table!!!!!!!")
		showTable(Clientdata.table.id);
	} else await switchToMainMenu(menu);
}
function closeApps() {
	if (isdef(DA.calendar)) { closePopup(); delete DA.calendar; }
	mClear('dMain');
	mClear(dTitle);
}
function subscribeAsSpectator(id, name) {
	mPostRoute('spectate', { id, name })
}
async function onclickCard(table, item) {
	//console.log('click!!!')
	//was soll denn jetzt passieren?
	let [fen, players] = [table.fen, table.fen.players];
	let card = item.feno;

	let d = iDiv(item);
	let ms = 500;
	mClass(d, 'framedPicture'); TO.hallo = setTimeout(() => mClassRemove(d, 'framedPicture'), ms);
	try { await mSleep(ms); } catch (err) { console.log("ERR", err); return; }

	try {
		let best = arrMinMax(fen.cards).min;
		if (card == best) {
			mShield('dTable', { bg: 'transparent' });
			let name = getUname();
			let move = card;
			table.pending = { name, move };
			//console.log('sending',table)
			let res = await mPostRoute('move', table);
			console.log('res', res)
			//if (isString(res) && res.includes('INVALID')) console.log('...from server:', res)
		} else {
			//console.log('fehler!');
			//was soll bei einem fehler passieren?
			//was wenn es ein bot war?
		}
	} catch (err) {
		console.log(`wie bitte???!!!!!!!!!!!!!!!!!!`, err);
		if (isdef(TO.SLEEPTIMEOUT)) {
			clearTimeout(TO.SLEEPTIMEOUT);
			console.log('after clearTimeout', TO.SLEEPTIMEOUT);
		}
	}


}
var MergeCount = 0;
app.post('/mergeTable', (req, res) => { //partial override using olist, emits to players-name
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for mergeTable!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for mergeTable!")
	let tnew = req.body.table;
	let olist = req.body.olist;
	let table = lookup(Session, ['tables', id]);

	console.log(`__merge ${MergeCount++}:`, name);
	if (isdef(olist)) {
		//partial merge!
		for (const o of olist) {
			lookupSetOverride(table, o.keys, o.val);
			//let last = arrLast(o.keys);
			// console.log('override',last,isLiteral(o.val)?o.val:typeof o.val)
		}
	} else if (isdef(tnew)) {
		// console.log(Object.keys(tnew))
		table = tnew; //deepmergeOverride(table,tnew);
	}
	saveTable(id, table);
	// console.log('table',table)
	//io.emit('table', { msg, id, turn, isNew: false }) DAS WAR DER FEHLER!!!!!!!!!!!!!!!!!!!
	emitToPlayers(arrMinus(table.playerNames, name), 'merged', table);
	res.json(table);
});
var RaceCount = 0;
app.post('/raceTable0', (req, res) => { //ohne error, just 1 score point per step
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for raceTable!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for raceTable!")
	let step = req.body.step;
	if (nundef(step)) return res.json("ERRROR! no step provided for raceTable!")
	let tnew = req.body.table;
	let olist = req.body.olist;
	let table = lookup(Session, ['tables', id]);
	if (!assertion(table, `table ${id} does NOT exist`)) { res.json('ASSERTION ERROR'); return; }

	console.log(`__race ${RaceCount++}:`, name, step);

	let tcopy = jsCopy(table); //erstmal eine table copy machen
	if (isdef(olist)) {
		//partial merge!
		for (const o of olist) {
			lookupSetOverride(tcopy, o.keys, o.val);
			//let last = arrLast(o.keys); console.log('override',last,isLiteral(o.val)?o.val:typeof o.val);
		}
	} else if (isdef(tnew)) {
		// console.log(Object.keys(tnew))
		tcopy = tnew; //deepmergeOverride(table,tnew);
	}

	let sum = calcScoreSum(tcopy); //check if this new table is valid!
	let fen = tcopy.fen;
	let scores = tcopy.playerNames.map(x => fen.players[x].score).join(',')
	if (sum != step) {
		console.log('=>INVALID!\nstep', step, '\nsum', sum, '\nplayer', name, '\nscores', scores);
		//do NOT update table and do NOT send anything!!!
		res.json('INVALID');
		return;
	}
	saveTable(id, tcopy);
	//io.emit('table', { msg, id, turn, isNew: false }) DAS WAR DER FEHLER!!!!!!!!!!!!!!!!!!!
	emitToPlayers(arrMinus(tcopy.playerNames, name), 'merged', tcopy);
	res.json(tcopy);
});
app.post('/raceTable', (req, res) => { // 1 score poiint per step, -1 per error
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for raceTable!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for raceTable!")
	let tnew = req.body.table;
	let olist = req.body.olist;
	let table = lookup(Session, ['tables', id]);
	if (!assertion(table, `table ${id} does NOT exist`)) { res.json('ASSERTION ERROR'); return; }

	let step = valf(req.body.step, table.step);
	let errors = valf(req.body.errors, 0);

	let tcopy = jsCopy(table); //erstmal eine table copy machen
	if (isdef(olist)) {
		//partial merge!
		for (const o of olist) {
			lookupSetOverride(tcopy, o.keys, o.val);
			//let last = arrLast(o.keys); console.log('override',last,isLiteral(o.val)?o.val:typeof o.val);
		}
	} else if (isdef(tnew)) {
		// console.log(Object.keys(tnew))
		tcopy = tnew; //deepmergeOverride(table,tnew);
	}

	let sum = calcScoreSum(tcopy); //check if this new table is valid!
	let errsum = calcErrSum(tcopy);
	console.log(`__race ${RaceCount++}:`, name, step, `-${errors}`, sum, errsum);

	let scores = tcopy.playerNames.map(x => `${x}:${tcopy.fen.players[x].score}`).join(',')
	let allErrors = tcopy.playerNames.map(x => `${x}:${tcopy.fen.players[x].errors}`).join(',')
	if (sum != step - errsum) {
		console.log('=>INVALID!\nstep', step, sum + errsum, '\nerrsum', errsum, '\nsum', sum, '\nplayer', name, '\nscores', scores, '\nerrors', allErrors);
		//do NOT update table and do NOT send anything!!!
		res.json('INVALID');
		return;
	}
	saveTable(id, tcopy);
	//io.emit('table', { msg, id, turn, isNew: false }) DAS WAR DER FEHLER!!!!!!!!!!!!!!!!!!!
	// *** the following only works if players is only logged in ONCE!!!!!!
	emitToPlayers(arrMinus(tcopy.playerNames, name), 'merged', tcopy);
	res.json(tcopy);
});
app.post('/privateOlist', (req, res) => { //partial override using olist, noemit!
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for privateOlist!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for privateOlist!")
	let olist = req.body.olist;
	if (nundef(olist)) return res.json("ERRROR! no olist provided for privateOlist!")
	let table = lookup(Session, ['tables', id]);
	for (const o of olist) lookupSetOverride(table, o.keys, o.val);
	saveTable(id, table);
	res.json(table);
});
app.post('/move', (req, res) => { //send complete table! emits to all players!
	let table = req.body;
	let [step, id] = [table.step, table.id];
	let ti = Session.tableInfo[id];
	if (nundef(ti)) ti = Session.tableInfo[id] = table.step;
	if (step < ti) {
		//diese table ist veraltet!!!
		res.json(`INVALID!!!! step:${step} tableInfo:${ti}`);
	} else {
		Session.tableInfo[id] += 1;
		saveTableInfo();
		table.step += 1;
		saveTable(id, table);
		emitToPlayers(table.playerNames, 'pending', table);
		res.json(`YEAH!!!! step:${step} tableInfo:${ti}`);
	}
});
app.post('/spectate', (req, res) => { //emits id turn to everyone, fuer den anfang von einer table!
	let id = req.body.id;
	let name = req.body.name;
	console.log('SPECTATE!!!', name)
	//lookupAddIfToList(Spectators,[id],name); console.log('Spectators',Spectators)
});



//#region CancelablePromise take 1
class CancelablePromise {
	constructor(executor) {
		this._hasCanceled = false;
		this.promise = new Promise((resolve, reject) => {
			this._reject = reject; // Store reject function to call it on cancel

			executor(
				(value) => {
					if (this._hasCanceled) {
						reject({ isCanceled: true });
					} else {
						resolve(value);
					}
				},
				(error) => {
					if (this._hasCanceled) {
						reject({ isCanceled: true });
					} else {
						reject(error);
					}
				}
			);
		});
	}

	cancel() {
		this._hasCanceled = true;
		this._reject({ isCanceled: true }); // Immediately reject with cancelation
	}
}

async function mySleep(ms) {
	return new CancelablePromise((resolve) => {
		const timeoutId = setTimeout(resolve, ms);
		// Clean up timeout if canceled
		this.promise.catch((err) => {
			if (err.isCanceled) {
				clearTimeout(timeoutId);
			}
		});
	});
}

// Usage example:
const sleep = mySleep(5000);

sleep.promise
	.then(() => console.log('Completed'))
	.catch((err) => {
		if (err.isCanceled) {
			console.log('Sleep was canceled');
		} else {
			console.error('Error:', err);
		}
	});

// To cancel the sleep
setTimeout(() => sleep.cancel(), 2000); // Cancels the sleep after 2 seconds
//#endregion

//#region CancelablePromise take 0
class CancelablePromise {
	constructor(executor) {
		this._hasCanceled = false;

		this.promise = new Promise((resolve, reject) => {
			executor(
				(value) => {
					if (this._hasCanceled) {
						reject({ isCanceled: true });
					} else {
						resolve(value);
					}
				},
				(error) => {
					if (this._hasCanceled) {
						reject({ isCanceled: true });
					} else {
						reject(error);
					}
				}
			);
		});
	}

	cancel() {
		this._hasCanceled = true;
	}
}

// Usage example
const cancelablePromise = new CancelablePromise((resolve, reject) => {
	setTimeout(() => resolve('Promise resolved'), 3000);
});

cancelablePromise.promise
	.then((value) => console.log(value))
	.catch((error) => {
		if (error.isCanceled) {
			console.log('Promise was canceled');
		} else {
			console.error('Promise error:', error);
		}
	});

// To cancel the promise
cancelablePromise.cancel();
//#endregion

//#endregion

//#region 16.mai 24
function button96() {

	function setup(table) {
		let fen = {};
		fen.players = {};
		for (const name in table.players) {
			let pl = fen.players[name] = table.players[name];
			let opts = pl.options;
			delete pl.options;
			addKeys(opts, pl)
			//pl.color = getUserColor(name)
			pl.score = 0;
		}
		fen.cards = [1, 2, 3];
		fen.deck = range(4, 100); //[4, 5, 6, 7, 8, 9, 10];
		fen.plorder = jsCopy(table.playerNames);
		fen.turn = jsCopy(table.playerNames);
		return fen;
	}
	function resolvePending(table) {
		let [fen, players] = [table.fen, table.fen.players];
		let pending = table.pending; delete table.pending;
		let [name, move] = [pending.name, pending.move];
		//console.log(name,move,fen.cards,fen.deck);
		removeInPlace(fen.cards, move);
		let cardlist = deckDeal(fen.deck, 1); //console.log('new card(s)',cardlist);
		if (!isEmpty(cardlist)) fen.cards.push(cardlist[0]);
		players[name].score += 1;
		//table.step+=1;
	}
	function present(table) {
		//console.log(table)
		let [fen, players] = [table.fen, table.fen.players];
		console.log('players', players)
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let items = [];
		for (const card of fen.cards) {
			//console.log('card',card)
			let item = cNumber(card);
			mAppend(d, iDiv(item));
			items.push(item);
			item.feno = card;
			//console.log(c);
		}
		return items;
	}
	function stats(table) {
		let [fen, me] = [table.fen, getUname()];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(fen, me, 'dStats', 'rowflex', style)
		for (const plname in fen.players) {
			let pl = fen.players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') {
				mStyle(item.img, { rounding: 0 });
			}

			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d);
		}
	}
	async function activate(table, items) {
		let fen = table.fen;
		let instruction = 'must click a card';
		let html = (isMyTurn(fen) ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` + "&nbsp;" + instruction : `waiting for: ${getTurnPlayers(fen)}`);
		//html = 'was ist da eigentlich los???'
		//mDom('dInstruction',{className:'instruction',},{html})
		let dinst = mBy('dInstruction'); mClear(dinst);
		let style = { display: 'flex', 'justify-content': 'center', 'align-items': 'center' };
		if (isMyTurn(fen)) style.maleft = -30;
		mDom(dinst, style, { html })

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item);
		}
	}

	async function onclickCard(table, item) {
		//was soll denn jetzt passieren?
		let [fen, players] = [table.fen, table.fen.players];
		let card = item.feno;
		let best = arrMinMax(fen.cards).min;
		if (card == best) {
			mShield('dTable');
			let name = getUname();
			let move = card;
			table.pending = { name, move };
			//console.log('sending',table)
			let res = await mPostRoute(`move`, table); console.log('from server:', res)
			//this should be the correct click!
			//sendmove to server;
			//if move is valid, 
		} else { console.log('fehler!') }


	}

	return { setup, resolvePending, present, stats, activate }; //, activate, checkGameover, showStats, botMove };
}

app.post('muell', (req, res) => {
	let step = req.body.table.step;

	let tnew = req.body;
	let id = tnew.id;
	let table = lookup(Session, ['tables', id]);
	if (!table) { io.emit('tables', getTablesInfo()); return; } //as if deleted
	assertion(table.status == 'started', `ERROR: ${table.status} (condTable only valid for table with status started)`)
	let expected = diTableStep[id];
	if (nundef(expected)) diTableStep[id] = expected = 0;
	//if (table.step != )
});

app.post('/muell', (req, res) => {
	let name = req.body.name;
	if (nundef(name)) return res.json("ERRROR! no name provided for raceTable!")
	let id = req.body.id;
	if (nundef(id)) return res.json("ERRROR! no id provided for raceTable!")
	let tnew = req.body.table;
	let olist = req.body.olist;
	let table = lookup(Session, ['tables', id]);
	if (!assertion(table, `table ${id} does NOT exist`)) { res.json('ASSERTION ERROR'); return; }

	let step = valf(req.body.step, table.step);
	let errors = valf(req.body.errors, 0);

	let tcopy = jsCopy(table); //erstmal eine table copy machen
	if (isdef(olist)) {
		//partial merge!
		for (const o of olist) {
			lookupSetOverride(tcopy, o.keys, o.val);
			//let last = arrLast(o.keys); console.log('override',last,isLiteral(o.val)?o.val:typeof o.val);
		}
	} else if (isdef(tnew)) {
		// console.log(Object.keys(tnew))
		tcopy = tnew; //deepmergeOverride(table,tnew);
	}

	let sum = calcScoreSum(tcopy); //check if this new table is valid!
	let errsum = calcErrSum(tcopy);
	console.log(`__race ${RaceCount++}:`, name, step, `-${errors}`, sum, errsum);

	let scores = tcopy.playerNames.map(x => `${x}:${tcopy.fen.players[x].score}`).join(',')
	let allErrors = tcopy.playerNames.map(x => `${x}:${tcopy.fen.players[x].errors}`).join(',')
	if (sum != step - errsum) {
		console.log('=>INVALID!\nstep', step, sum + errsum, '\nerrsum', errsum, '\nsum', sum, '\nplayer', name, '\nscores', scores, '\nerrors', allErrors);
		//do NOT update table and do NOT send anything!!!
		res.json('INVALID');
		return;
	}
	saveTable(id, tcopy);
	//io.emit('table', { msg, id, turn, isNew: false }) DAS WAR DER FEHLER!!!!!!!!!!!!!!!!!!!
	// *** the following only works if players is only logged in ONCE!!!!!!
	emitToPlayers(arrMinus(tcopy.playerNames, name), 'merged', tcopy);
	res.json(tcopy);
});
//#endregion

//#region 15.mai 24
async function showTable(table) {
	INTERRUPT(); //reentrance?!?!?
	DA.counter += 1; let me = getUname();
	if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; DA.tsTable = DA.merged;

	clearEvents();
	showTitle(`${table.friendly}`);
	let func = DA.funcs[table.game];
	T = {};
	let items = T.items = await func.present('dMain', table);
	mRise('dMain');

	let playmode = getPlaymode(table, me);
	if (TESTING) testUpdateTestButtons();

	if (table.status == 'over') return showGameover(table);

	if (!table.fen.turn.includes(me)) return;

	if (playmode == 'bot') return await func.botMove(table, items, me);
	else return await func.activate(table, items);

}
//#endregion

//region 14.mai 24
async function showColors() {

	let d = mBy('dSettingsColor'); mClear(d);
	let di = M.dicolor; //console.log('buckets',Object.keys(di).length);
	let bucketlist = 'yellow orangeyellow orange orangered red magentapink magenta bluemagenta blue cyanblue cyan greencyan green yellowgreen'.split(' ');
	for (const bucket of bucketlist) {
		let list = dict2list(di[bucket]);
		let clist = [];
		for (const c of list) {
			let o = w3color(c.value);
			o.name = c.id;
			o.hex = c.value;
			clist.push(o);
		}
		let sorted = sortByFunc(clist, x => -x.lightness);
		// mDom(d, {hpadding:10}, { html: `<br>${bucket}<br>`, class:'nav' });
		_showPaletteNames(d, sorted);
	}

	let divs = document.getElementsByClassName('colorbox');
	for (const div of divs) {
		mStyle(div, { cursor: 'pointer' })
		div.onclick = async () => onclickColor(div.getAttribute('dataColor'));
	}
}

//#endregion

//region 13.mai 24
async function onclickSettColor() {
	console.log('set Color!!!')
	await showColors();
}
async function onclickSettFg() {
	console.log('set Color!!!')
	await showTextColors();
}
async function onclickSettBlendMode() {
	if (isEmpty(U.bgImage)) {
		showMessage('You need to set a Texture in order to set a Blend Mode!');
		return;
	}
	showBlendModes();
	setTexture({});
	for (const prop of ['bgImage', 'bgSize', 'bgBlend', 'bgRepeat']) delete U[prop];
	//console.log(U);
	await postUserChange(U, true)
}
async function onclickSettRemoveTexture() {
	if (isEmpty(U.bgImage)) return;
	setTexture({});
	for (const prop of ['bgImage', 'bgSize', 'bgBlend', 'bgRepeat']) delete U[prop];
	console.log(U);
	await postUserChange(U, true)
}
async function onclickSettTexture() {
	//console.log('set Texture!!!')
	await showTextures();
}
async function onclickTexture(item) {

	//console.log('item',item)
	//console.log('items',items)

	//console.log(U)

	U.bgImage = item.bgImage;
	U.bgBlend = item.bgBlend;
	U.bgSize = item.bgSize;
	U.bgRepeat = item.bgRepeat;


	//[U.bgImage,U.bgRepeat,U.bgBlend,U.bgSize]=[item.bgImage,item.bgRepeat,item.bgBlend,item.bgSize];

	setTexture(item);
	//let bgBlend = await mGather(dc, {}, { content: catlist, type: 'select' });

	// await uiGadgetTypeSelect()
	//let c=getCSSVariable('--bgBody');
	//let hex = colorToHex79(c);
	//U.color = hex;
	//console.log(await postUserChange())


}
async function showColors() {
	//console.log('open Settings!!!'); 

	mClear('dMain');

	let di = M.dicolor;
	let d = mDom('dMain', { padding: 12 });
	for (const bucket in di) {
		let list = dict2list(di[bucket]);
		let clist = [];
		for (const c of list) {
			let o = w3color(c.value);
			//console.log('c',c)
			o.name = c.id;
			o.hex = c.value;
			clist.push(o);
		}

		let sorted = sortByFunc(clist, x => -x.lightness); //(10*x.lightness+x.sat*100));
		//console.log(sorted[0]); return;

		mDom(d, {}, { html: `<br>${bucket}<br>` })
		showPaletteNames(d, sorted);

	}

	let divs = document.getElementsByClassName('colorbox');
	for (const div of divs) {
		div.onclick = async () => {
			let c = div.getAttribute('dataColor');
			setColors(c);
			//let c=getCSSVariable('--bgBody');
			let hex = colorToHex79(c);
			U.color = hex;
			await postUserChange();

		}
		//console.log('HAAAAAAALLLO',div);break;

	}

}
async function showTextColors() {
	mClear('dMain');
	let d = mDom('dMain', { padding: 12 });

	//ich brauch die palette fuer den current body background
	//weiss, schwarz, silver, dimgray
	let d1 = mDom(d, { gap: 12 }); mFlexWrap(d1);
	let colors = ['white', 'silver', 'dimgray', 'black', getCSSVariable('--fgButton'), getCSSVariable('--fgButtonHover')].map(x => w3color(x));
	for (var c of colors) {
		let bg = 'transparent';
		let fg = c.hex = c.toHexString();
		let d2 = mDom(d1, { border: fg, wmin: 250, bg, fg, padding: 20 }, { class: 'colorbox', dataColor: fg });
		mDom(d2, { weight: 'bold', align: 'center' }, { html: 'Text Sample' });
		let html = `<br>${bg}<br>hue:${c.hue}<br>sat:${Math.round(c.sat * 100)}<br>lum:${Math.round(c.lightness * 100)}`
		let dmini = mDom(d2, { align: 'center', wmin: 120, padding: 2, bg, fg }, { html });
	}

	let divs = document.getElementsByClassName('colorbox');
	for (const div of divs) {
		div.onclick = async () => {
			console.log('HALLO')
			let fg = div.getAttribute('dataColor');
			setColors(getCSSVariable('--bgBody'), fg);
			let hex = colorToHex79(fg);
			U.fg = hex;
			await postUserChange({ name: U.name, fg: U.fg });

		}
		//console.log('HAAAAAAALLLO',div);break;

	}

}
async function showTextures() {
	mClear('dMain');
	let list = M.textures;
	let dTheme = mDom('dMain', { padding: 12, gap: 10 }); mFlexWrap(dTheme);
	//console.log(list)
	let itemsTexture = [];
	for (const t of list) {
		// let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
		// let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
		let bgRepeat = 'repeat';
		let bgSize = t.includes('marble_') ? `100vw 100vh` : 'auto';
		let bgImage = `url('${t}')`;
		let recommendedMode = t.includes('ttrans') ? 'normal' : t.includes('marble_') ? 'luminosity' : 'multiply';

		let dc = mDom(dTheme, { cursor: 'pointer', border: 'white', w: 300, h: 170 }, { tag: 'img' });

		let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, bgBlend: recommendedMode, isSelected: false };
		itemsTexture.push(item);

		//dc.onclick = () => handler(item, itemsTexture);
		dc.onclick = async () => onclickTexture(item, itemsTexture);
	}

	for (const [i, o] of itemsTexture.entries()) {
		let img = iDiv(o);
		img.onload = () => {
			let pal = ColorThiefObject.getPalette(img);
			if (pal == null) {
				//mach eine transparency palette!
				pal = colorTransPalette();

			}
			if (pal != null) {
				pal.unshift('white'); pal.push('black');
				let n = pal.length;
				pal = pal.map(x => colorHex(x)); // console.log(pal)
				let palhex = Array.from(new Set(pal));// console.log(palhex)
				let palhsl = palhex.map(x => colorHexToHsl360Object(x));
				let lum = palhsl.map(x => x.l);
				let hue = palhsl.map(x => x.h);
				let sat = palhsl.map(x => x.s);
				pal = [];
				for (let i = 0; i < palhex.length; i++) {
					let o = { hex: palhex[i], lum: lum[i], hue: hue[i], sat: sat[i] };
					pal.push(o);
				}
				//if (n!=pal.length) console.log('reduce from',n,'to',pal.length)
			}

			itemsTexture[i].palette = pal;


		}
		img.src = o.path; //,src:t		//let pal=colorPaletteFromUrl(t); //await getPaletteFromElem(dc);

	}
	return itemsTexture;
}
function setTheme(o) {
	setColors(o.color, o.fg);
	setTexture(o);
}
async function settingsOpen() {
	await showColors();
	settingsSidebar();


}
async function settingsClose() {
	//uebernimm current color!
	//console.log('close Settings!!!'); mClear('dMain');
	closeLeftSidebar(); clearMain();
}
function settingsSidebar() {
	let wmin = 170;
	mStyle('dLeft', { wmin: wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 160, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;
	UI.settColor = mCommand(d, 'settColor', 'Color'); mNewline(d, gap);
	UI.settFg = mCommand(d, 'settFg', 'Text Color'); mNewline(d, gap);
	UI.settTexture = mCommand(d, 'settTexture', 'Texture'); mNewline(d, gap);
	UI.settRemoveTexture = mCommand(d, 'settRemoveTexture', 'Remove Texture'); mNewline(d, gap);
	UI.settBlendMode = mCommand(d, 'settBlendMode', 'Blend Mode'); mNewline(d, gap);
}

//#endregion

//#region 12.mai 24
function setColors(c, fg) {
	let hsl = colorHSL(c, true);
	let [hue, diff, wheel, p] = [hsl.h, 30, [], 20];
	let hstart = (hue + diff);
	for (i = hstart; i <= hstart + 235; i += 20) {
		let h = i % 360;
		let c1 = colorFromHSL(h, 100, 75);
		wheel.push(c1);
	}
	fg = 'red';
	let cc = 'white'; // valf(fg,idealTextColor(c)); console.log('!!!',fg);



	let pal = colorPalette(c); pal.unshift('black'); pal.push('white');
	let palc = colorPalette(cc);
	function light(i = 3) { if (i < 0) i = 0; if (i > 5) i = 5; return pal[5 + i]; }
	function dark(i = 3) { if (i < 0) i = 0; if (i > 5) i = 5; return pal[5 - i]; }
	function simil(i = 3) { return cc == 'white' ? dark(i) : light(i); }
	function contrast(i = 3) { return cc == 'white' ? light(i) : dark(i); }
	setCssVar('--bgBody', c);
	setCssVar('--bgButton', 'transparent')
	setCssVar('--bgButtonActive', light(3))
	setCssVar('--bgNav', simil(2))
	setCssVar('--bgLighter', light())
	setCssVar('--bgDarker', dark())
	setCssVar('--fgButton', contrast(3))
	setCssVar('--fgButtonActive', cc == 'black' ? dark(2) : c)
	setCssVar('--fgButtonDisabled', 'silver')
	setCssVar('--fgButtonHover', contrast(5))
	setCssVar('--fgTitle', contrast(4))
	setCssVar('--fgSubtitle', contrast(3))
}
async function prelims_old() {
	ColorThiefObject = new ColorThief();//console.log(ColorThiefObject);
	let t1 = performance.now();
	Serverdata = await mGetRoute('session'); //session ist: users,config,events
	let t2 = performance.now();
	await loadAssets();
	let t4 = performance.now();
	sockInit();
	UI.nav = showNavbar();
	UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
	UI.dTitle = mBy('dTitle');
	let t5 = performance.now();
	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;
	DA.funcs = { button96: button96() }; //implemented games!
	for (const gname in Serverdata.config.games) {
		if (isdef(DA.funcs[gname])) continue;
		DA.funcs[gname] = defaultGameFunc();
	}
	await switchToUser(localStorage.getItem('username'));
}
function hslTable(dParent, x, color) {
	let i, a = '', match, same, comp, loopHSL, HSL;
	//var color = document.getElementById("colorhexDIV").innerHTML;
	let hslObj = w3color(color);
	let h = hslObj.hue;
	let s = hslObj.sat;
	let l = hslObj.lightness;
	let arr = [];
	let lineno = (x == "hue") ? 12 : 10;
	let header = x.toUpperCase();
	for (i = 0; i <= lineno; i++) {
		let chue = `hsl(${(h + i * 30) % 360},${s},${l})`;
		if (x == "hue") { arr.push(w3color(chue)); }
		// if (x == "hue") { arr.push(w3color("hsl(" + (i * 15) + "," + s + "," + l + ")")); }
		else if (x == "sat") { arr.push(w3color("hsl(" + h + "," + (i * 0.05) + "," + l + ")")); }
		else if (x == "light") { arr.push(w3color("hsl(" + h + "," + s + "," + (i * 0.05) + ")")); }
	}
	// console.log('arr',arr); 
	if (x == "sat" || x == "light") { arr.reverse(); }
	a += "<div class='w3-responsive'>";
	a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
	a += "<tr>";
	a += `<td style='width:30px;'>${header}</td>`;
	for (i = 0; i < arr.length; i++) {
		a += `<tr><td style='cursor:pointer;background-color:${arr[i].toHexString()}' onclick='onclickColor("${arr[i].toHexString()}")'>${arr[i].toHexString()}</td></tr>`;
	}
	a += "</table></div>";
	dParent.innerHTML = a;
}
function hslTables(dParent, color) {
	let i, a = '', match, same, comp, loopHSL, HSL;
	//var color = document.getElementById("colorhexDIV").innerHTML;
	let hslObj = w3color(color);
	let h = hslObj.hue;
	let s = hslObj.sat;
	let l = hslObj.lightness;
	let arr = [];
	lineno = 10;
	//let header = x.toUpperCase();
	for (i = 0; i <= lineno; i++) {
		let chue = `hsl(${(h - 50 + i * 10) % 360},${s},${l})`;
		let csat = `hsl(${h},${i * .1},${l})`;
		let clum = `hsl(${h},${s},${i * .1})`;
		arr.push({ h: w3color(chue), s: w3color(csat), l: w3color(clum) });
	}
	// console.log('arr',arr); 
	a += "<div class='w3-responsive'>";
	a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
	a += "<tr>";
	a += `<td style='width:30px;'>Hue</td><td style='width:30px;'>Sat</td><td style='width:30px;'>Lum</td>`;
	for (i = 0; i < arr.length; i++) {
		let [hexh, hexs, hexl] = [arr[i].h.toHexString(), arr[i].s.toHexString(), arr[i].l.toHexString()];
		a += `
      <tr>
        <td style='cursor:pointer;background-color:${hexh}' onclick='onclickHue("${hexh}")'>${hexh}</td>
        <td style='cursor:pointer;background-color:${hexs}' onclick='onclickSat("${hexs}")'>${hexs}</td>
        <td style='cursor:pointer;background-color:${hexl}' onclick='onclickLum("${hexl}")'>${hexl}</td>
      </tr>`;
	}
	a += "</table></div>";
	dParent.innerHTML = a;
}
function mColorPickerBoard(dParent) {
	dParent = mDom(dParent);

	//let board = drawHexBoard(7, 7, dParent, { bg: rColor(), padding:10, transition:'1s' }, {w:20,h:22, classes:'hexframe'}); //, {padding:10});
	let board = drawHexBoard(7, 7, dParent, { bg: 'transparent', padding: 10 }, { w: 20, h: 22 });
	board.dSample = mDom(dParent, { w: 200, hmin: 40, margin: 'auto', align: 'center' });
	let tables = mDom(dParent, {}, { id: 'dHslTable' });
	let colors = getColormapColors(); //console.log('colors', colors);

	let i = 0;
	for (const item of board.items) {
		let bg = colors[i++];
		item.color = bg;
		let dhex = iDiv(item);
		dhex.onmouseenter = () => onenterHex(item, board);
		dhex.onmouseleave = () => onleaveHex(item, board);
		dhex.onclick = () => onclickHex(item, board); //{mStyle(document.body, {bg});} 
		mStyle(dhex, { bg });
	}

	return board;
}
function sortColorsByHueAndLuminance(colors) {
	function _hexToHSL(hex) {
		// Convert hex to RGB first
		let r = parseInt(hex.slice(1, 3), 16) / 255;
		let g = parseInt(hex.slice(3, 5), 16) / 255;
		let b = parseInt(hex.slice(5, 7), 16) / 255;
		let cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;

		if (delta === 0)
			h = 0;
		else if (cmax === r)
			h = ((g - b) / delta) % 6;
		else if (cmax === g)
			h = (b - r) / delta + 2;
		else
			h = (r - g) / delta + 4;

		h = Math.round(h * 60);

		// Make negative hues positive behind 360°
		if (h < 0)
			h += 360;

		l = (cmax + cmin) / 2;

		// Calculate saturation
		s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

		// Multiply s and l by 100 to get the value in percentage, rather than [0,1]
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);

		return { h, s, l };
	}
	return colors.sort((a, b) => {
		const hslA = _hexToHSL(a);
		const hslB = _hexToHSL(b);
		if (hslA.h !== hslB.h) {
			return hslA.h - hslB.h;
		}
		// Sort by luminance if hues are equal
		return hslB.l - hslA.l; // Note: reverse to get light to dark if desired
	});
}
function sortColorsByLumHue(colors) {
	function _hexToHSL(hex) {
		// Convert hex to RGB first
		let r = parseInt(hex.slice(1, 3), 16) / 255;
		let g = parseInt(hex.slice(3, 5), 16) / 255;
		let b = parseInt(hex.slice(5, 7), 16) / 255;
		let cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;

		if (delta === 0)
			h = 0;
		else if (cmax === r)
			h = ((g - b) / delta) % 6;
		else if (cmax === g)
			h = (b - r) / delta + 2;
		else
			h = (r - g) / delta + 4;

		h = Math.round(h * 60);

		// Make negative hues positive behind 360°
		if (h < 0)
			h += 360;

		l = (cmax + cmin) / 2;

		// Calculate saturation
		s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

		// Multiply s and l by 100 to get the value in percentage, rather than [0,1]
		s = +(s * 100).toFixed(1);
		l = +(l * 100).toFixed(1);

		return { h, s, l };
	}
	return colors.sort((a, b) => {
		const hslA = _hexToHSL(a);
		const hslB = _hexToHSL(b);
		if (hslA.l !== hslB.l) {
			return hslA.l - hslB.l;
		}
		// Sort by luminance if hues are equal
		return hslB.h - hslA.h; // Note: reverse to get light to dark if desired
	});
}
//#endregion

//#region 11.mai 24
function generateRYBColorHexagon() {
	const colors = [];
	const steps = 127;
	const huesPerStep = 360 / steps;

	for (let i = 0; i < steps; i++) {
		const hue = i * huesPerStep;
		const angle = hue * Math.PI / 180;
		// Generate RYB values based on the angle
		const ryb = [
			(Math.cos(angle) + 1) / 2 * 255,               // Red
			(Math.cos(angle - 2 * Math.PI / 3) + 1) / 2 * 255, // Yellow
			(Math.cos(angle + 2 * Math.PI / 3) + 1) / 2 * 255  // Blue
		];
		const rgb = rybToRgb(ryb);
		const hex = `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
		colors.push(hex);
	}

	return colors;
}
function rybToRgb(ryb) {
	const r = ryb[0] / 255, y = ryb[1] / 255, b = ryb[2] / 255;
	// Convert RYB directly to RGB
	const rgb = [
		1 * r + 1 * y + 0 * b, // Red
		0 * r + 1 * y + 0.5 * b, // Green
		0 * r + 0 * y + 1 * b // Blue
	];
	// Normalize the colors
	return rgb.map(c => Math.round(c * 255));
}

function sortByHue(colors) {
	let list = colors.map(x => w3color(x));
	list = sortBy(list, 'hue');
	for (const c of list) { c.hex = c.toHexString() }
	return list.map(x => x.hex);
}
function sortByLum(colors) {
	let list = colors.map(x => w3color(x));
	list = sortBy(list, 'lightness');
	for (const c of list) { c.hex = c.toHexString() }
	return list.map(x => x.hex);
}

function hslTable(dParent, x, color, cols) {
	var lineno, header, i, a, match, same, comp, loopHSL, HSL;
	//var color = document.getElementById("colorhexDIV").innerHTML;
	var hslObj = w3color(color);
	var h = hslObj.hue;
	var s = hslObj.sat;
	var l = hslObj.lightness;
	var arr = [];
	if (x == "hue") { header = "Hue"; lineno = 24; }
	if (x == "sat") { header = "Saturation"; lineno = 20; }
	if (x == "light") { header = "Lightness"; lineno = 20; }
	for (i = 0; i <= lineno; i++) {
		if (x == "hue") { arr.push(w3color("hsl(" + (i * 15) + "," + s + "," + l + ")")); }
		if (x == "sat") { arr.push(w3color("hsl(" + h + "," + (i * 0.05) + "," + l + ")")); }
		if (x == "light") { arr.push(w3color("hsl(" + h + "," + s + "," + (i * 0.05) + ")")); }
	}
	if (x == "sat" || x == "light") { arr.reverse(); }
	a = "<h3>" + header + "</h3>";
	a += "<div class='w3-responsive'>";
	a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
	a += "<tr>";
	a += "<td style='width:150px;'></td>";
	a += "<td style='text-align:right;text-transform:capitalize;'>" + x + "&nbsp;</td>";
	a += "<td>Hex</td>";
	a += "<td>Rgb</td>";
	a += "<td>Hsl</td>";
	a += "</tr>";
	match = 0;
	for (i = 0; i < arr.length; i++) {
		same = 0;
		if (x == "hue") {
			loopHSL = w3color(arr[i]).hue;
			HSL = h;
			if (i == arr.length - 1) { loopHSL = 360; }
			comp = (loopHSL > HSL);
		}
		if (x == "sat") {
			loopHSL = Math.round(w3color(arr[i]).sat * 100);
			HSL = Number(s * 100);
			HSL = Math.round(HSL);
			comp = (loopHSL < HSL);
			HSL = HSL + "%";
			loopHSL = loopHSL + "%";
		}
		if (x == "light") {
			loopHSL = Math.round(w3color(arr[i]).lightness * 100);
			HSL = Number(l * 100);
			HSL = Math.round(HSL);
			comp = (loopHSL < HSL);
			HSL = HSL + "%";
			loopHSL = loopHSL + "%";
		}
		if (HSL == loopHSL) {
			match++;
			same = 1;
		}
		if (comp) { match++; }
		if (match == 1) {
			a += "<tr class='ws-green'>";
			a += "<td style='background-color:" + hslObj.toHexString() + "'></td>";
			a += "<td style='text-align:right;'><b>" + HSL + "&nbsp;</b></td>";
			a += "<td><b>" + hslObj.toHexString() + "</b></td>";
			a += "<td><b>" + hslObj.toRgbString() + "</b></td>";
			a += "<td><b>" + hslObj.toHslString() + "</b></td>";
			a += "</tr>";
			match = 2;
		}
		if (same == 0) {
			a += "<tr>";
			a += "<td style='cursor:pointer;background-color:" + arr[i].toHexString() + "' onclick='clickColor(\"" + arr[i].toHexString() + "\")'></td>";
			a += "<td style='text-align:right;'>" + loopHSL + "&nbsp;</td>";
			a += "<td>" + arr[i].toHexString() + "</td>";
			a += "<td>" + arr[i].toRgbString() + "</td>";
			a += "<td>" + arr[i].toHslString() + "</td>";
			a += "</tr>";
		}
	}
	a += "</table></div>";
	dParent.innerHTML = a;
	// if (x == "hue") { document.getElementById("huecontainer").innerHTML = a; }
	// if (x == "sat") { document.getElementById("hslsatcontainer").innerHTML = a; }
	// if (x == "light") { document.getElementById("hsllumcontainer").innerHTML = a; }
}

function hslTable(dParent, x, color) {
	let i, a = '', match, same, comp, loopHSL, HSL;
	//var color = document.getElementById("colorhexDIV").innerHTML;
	let hslObj = w3color(color);
	let h = hslObj.hue;
	let s = hslObj.sat;
	let l = hslObj.lightness;
	let arr = [];
	let lineno = (x == "hue") ? 24 : 20;
	let header = x.toUpperCase();
	for (i = 0; i <= lineno; i++) {
		if (x == "hue") { arr.push(w3color("hsl(" + (i * 15) + "," + s + "," + l + ")")); }
		else if (x == "sat") { arr.push(w3color("hsl(" + h + "," + (i * 0.05) + "," + l + ")")); }
		else if (x == "light") { arr.push(w3color("hsl(" + h + "," + s + "," + (i * 0.05) + ")")); }
	}
	// console.log('arr',arr); 
	if (x == "sat" || x == "light") { arr.reverse(); }
	a += "<div class='w3-responsive'>";
	a += "<table class='ws-table-all colorTable' style='width:100%;white-space: nowrap;font-size:14px;'>";
	a += "<tr>";
	a += `<td style='width:30px;'>${header}</td>`;
	for (i = 0; i < arr.length; i++) {
		a += `<tr><td style='cursor:pointer;background-color:${arr[i].toHexString()}' onclick='onclickColor("${arr[i].toHexString()}")'>${arr[i].toHexString()}</td></tr>`;
	}
	a += "</table></div>";
	dParent.innerHTML = a;
}

function hsl360StringToHex79_(hsl) {
	let [h, s, l] = hsl.match(/\d+\.?\d*/g).map(Number);
	console.log('anfang', h, s, l);
	const hue = h / 360;
	const saturation = s / 100;
	const lightness = l / 100;



	const [r, g, b] = hslToRgb__(h, s, l); //saturation, lightness);
	console.log('rgb', r, g, b)
	// Convert RGB to Hex
	const toHex = x => x.toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function hslToRgb__(h, s, l) {
	console.log('hallo')
	let c = (1 - Math.abs(2 * l - 1)) * s;
	let x = c * (1 - Math.abs((h / 60) % 2 - 1));
	let m = l - c / 2;
	let r = 0, g = 0, b = 0;

	if (h >= 0 && h < 60) {
		r = c; g = x; b = 0;
	} else if (h >= 60 && h < 120) {
		r = x; g = c; b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0; g = c; b = x;
	} else if (h >= 180 && h < 240) {
		r = 0; g = x; b = c;
	} else if (h >= 240 && h < 300) {
		r = x; g = 0; b = c;
	} else if (h >= 300 && h < 360) {
		r = c; g = 0; b = x;
	}

	// Converting from 0-1 range to 0-255 range and adding m
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return [r, g, b];
}

async function mColorPicker(dParent) {
	let d = mDom(dParent, { bg: 'black' });
	let img = await imgAsync(d, {}, { src: '../copi2/img_colormap.gif', usemap: '#colormap' });
	mStyle(d, { w: img.naturalWidth, h: img.naturalHeight });
	//console.log(img.naturalWidth, img.naturalHeight); let r = getRect(d); let ri = getRect(img); console.log('rect', r.w, r.h); console.log('ri', ri.w, ri.h);
	mAppend(d, colormapHtml());

	let dselect = mDom(d, { visibility: 'hidden', position: 'relative', w: 21, h: 21, bgImage: 'url("../copi2/img_selectedcolor.gif")' }, { id: 'selectedhexagon' });

	// <div id="selectedhexagon"
	// style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/img_selectedcolor.gif")'>
	// </div>


	// d.innerHTML = `
	// 		<div style="display:inline-block;height:199px">
	// 			<img src='../copi2/img_colormap.gif' usemap='#colormap' alt='colormap' />
	// 			${map111()}				
	// 			${selecthexagon111()}				
	// 		</div>
	// `;
	console.log('rect', getRect(d));
	return d;
}
function drawHexBoard(topside, side, dParent, styles = {}, opts = {}) {
	addKeys({ position: 'relative' }, styles);
	let d = mDom(dParent, styles, opts); // { position: 'relative', bg:'#222' });
	let [centers, rows, maxcols] = hexBoardCenters(topside, side);
	//console.log('centers',centers[0],centers)
	let sz = 20;
	let [w, h] = [sz, sz];
	let items = [];
	for (const c of centers) {
		// let [x,y]=[w/2+c.x*w,h/2+c.y*h*.75];
		let dhex = hexFromCenter(d, { x: c.x * w, y: c.y * h }, { w: w - 2, h: h - 2, bg: 'pink' }, { classes: 'hop1' });
		dhex.onclick = () => mStyle(document.body, { bg: rColor() });
		let item = { div: dhex, cx: c.x, cy: c.y, row: c.row, col: c.col };
		items.push(item);
	}
	let [wBoard, hBoard] = [maxcols * w, rows * h * .75 + h * .25];
	mStyle(d, { w: wBoard, h: hBoard }); //,'clip-path': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'});
	return { div: d, topside, side, centers, rows, maxcols, boardShape: 'hex', w, h, wBoard, hBoard, items }

}
function drawHexBoard(topside, side, dParent, styles = {}, opts = {}) {
	addKeys({ position: 'relative' }, styles);
	let d = mDom(dParent, styles, opts); // { position: 'relative', bg:'#222' });
	let [centers, rows, maxcols] = hexBoardCenters(topside, side);
	//console.log('centers',centers[0],centers)
	let sz = 20;
	let [w, h] = [sz, sz];
	let items = [];
	for (const c of centers) {
		// let [x,y]=[w/2+c.x*w,h/2+c.y*h*.75];
		let dhex = hexFromCenter(d, { x: c.x * w, y: c.y * h }, { w: w - 2, h: h - 2, bg: 'pink' }, { classes: 'hop1' });
		dhex.onclick = () => mStyle(document.body, { bg: rColor() });
		let item = { div: dhex, cx: c.x, cy: c.y, row: c.row, col: c.col };
		items.push(item);
	}
	let [wBoard, hBoard] = [maxcols * w, rows * h * .75 + h * .25];
	mStyle(d, { w: wBoard, h: hBoard }); //,'clip-path': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'});
	return { div: d, topside, side, centers, rows, maxcols, boardShape: 'hex', w, h, wBoard, hBoard, items }

}
function drawHex(dParent, styles = {}, opts = {}) {
	//if (nundef(styles.w)) addKeys({ w: 100, h: 100, bg: 'blue' },styles);
	//styles.h=valf(styles.h,styles.w);//*.866);
	addKeys({ classes: 'hop1' }, opts);
	let d = mDom(dParent, styles, opts);
	// if (nundef(classes)) classes = ['frameOnHover'];
	// if (nundef(sizing)) sizing = { hgrow: true, wgrow: true };
	// let d = mDiv(dParent, styles, null, null, classes, sizing);
	mStyle(d, { 'clip-path': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' });
	return d;
}
//#endregion

//#region clickColor progress from orig
function clickColor(hex, seltop, selleft, html5) {
	var c = hex;
	let cObj = w3color(c);
	let colorhex = cObj.toHexString();
	let colormap, areas, i, areacolor, cc;
	r = cObj.red;
	g = cObj.green;
	b = cObj.blue;

	//hier versucht er herauszufinden ob die color die via input eingegeben wurde im colorpicker existiert und setzt die coordinates falls ja!
	if (isdef(mBy('colornamDIV'))) {
		document.getElementById("colornamDIV").innerHTML = (cObj.toName() || "");
		document.getElementById("colorhexDIV").innerHTML = cObj.toHexString();
		document.getElementById("colorrgbDIV").innerHTML = cObj.toRgbString();
		document.getElementById("colorhslDIV").innerHTML = cObj.toHslString();
		if ((!seltop || seltop == -1) && (!selleft || selleft == -1)) {
			colormap = document.getElementById("colormap");
			areas = colormap.getElementsByTagName("AREA");
			for (i = 0; i < areas.length; i++) {
				areacolor = areas[i].getAttribute("onmouseover").replace('mouseOverColor("', '');
				areacolor = areacolor.replace('")', '');
				if (areacolor.toLowerCase() == colorhex) {
					cc = areas[i].getAttribute("onclick").replace(')', '').split(",");
					seltop = Number(cc[1]);
					selleft = Number(cc[2]);
				}
			}
		}
		document.getElementById("selectedcolor").style.backgroundColor = cObj.toHexString();
	}

	if ((seltop + 200) > -1 && selleft > -1) {
		document.getElementById("selectedhexagon").style.top = seltop + "px";
		document.getElementById("selectedhexagon").style.left = selleft + "px";
		document.getElementById("selectedhexagon").style.visibility = "visible";
	} else {
		document.getElementById("divpreview").style.backgroundColor = cObj.toHexString();
		document.getElementById("selectedhexagon").style.visibility = "hidden";
	}

	if (isdef(mBy('html5colorpicker'))) {
		document.getElementById("html5colorpicker").value = cObj.toHexString();
	}

	if (isdef(mBy('slideRed'))) {
		document.getElementById('slideRed').value = r;
		document.getElementById('slideGreen').value = g;
		document.getElementById('slideBlue').value = b;
		changeRed(r); changeGreen(g); changeBlue(b);
		changeColor();
		document.getElementById("fixed").style.backgroundColor = cObj.toHexString();
	}
}
function clickColor_orig(hex, seltop, selleft, html5) {
	var c, cObj, colormap, areas, i, areacolor, cc;
	if (html5 && html5 == 5) {
		c = document.getElementById("html5colorpicker").value;
	} else {
		if (hex == 0) {
			c = document.getElementById("entercolor").value;
			c = c.replace(/;/g, ","); //replace any semicolon with a comma
		} else {
			c = hex;
		}
	}
	cObj = w3color(c);
	colorhex = cObj.toHexString();
	if (cObj.valid) {
		clearWrongInput();
	} else {
		wrongInput();
		return;
	}

	r = cObj.red;
	g = cObj.green;
	b = cObj.blue;

	if (isdef(mBy('colornamDIV'))) {
		document.getElementById("colornamDIV").innerHTML = (cObj.toName() || "");
		document.getElementById("colorhexDIV").innerHTML = cObj.toHexString();
		document.getElementById("colorrgbDIV").innerHTML = cObj.toRgbString();
		document.getElementById("colorhslDIV").innerHTML = cObj.toHslString();
		if ((!seltop || seltop == -1) && (!selleft || selleft == -1)) {
			colormap = document.getElementById("colormap");
			areas = colormap.getElementsByTagName("AREA");
			for (i = 0; i < areas.length; i++) {
				areacolor = areas[i].getAttribute("onmouseover").replace('mouseOverColor("', '');
				areacolor = areacolor.replace('")', '');
				if (areacolor.toLowerCase() == colorhex) {
					cc = areas[i].getAttribute("onclick").replace(')', '').split(",");
					seltop = Number(cc[1]);
					selleft = Number(cc[2]);
				}
			}
		}
		document.getElementById("selectedcolor").style.backgroundColor = cObj.toHexString();
	}

	if ((seltop + 200) > -1 && selleft > -1) {
		document.getElementById("selectedhexagon").style.top = seltop + "px";
		document.getElementById("selectedhexagon").style.left = selleft + "px";
		document.getElementById("selectedhexagon").style.visibility = "visible";
	} else {
		document.getElementById("divpreview").style.backgroundColor = cObj.toHexString();
		document.getElementById("selectedhexagon").style.visibility = "hidden";
	}

	if (isdef(mBy('html5colorpicker'))) {
		document.getElementById("html5colorpicker").value = cObj.toHexString();
	}

	if (isdef(mBy('slideRed'))) {
		document.getElementById('slideRed').value = r;
		document.getElementById('slideGreen').value = g;
		document.getElementById('slideBlue').value = b;
		changeRed(r); changeGreen(g); changeBlue(b);
		changeColor();
		document.getElementById("fixed").style.backgroundColor = cObj.toHexString();
	}
}


//#endregion

//#region bad copi2 parts
function NOpart111() {
	let html = `
	<div class="w3-row">
		<div class="w3-col colorthird1" style="text-align:center;">
			${h3_111('Pick a Color:')}				
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${script111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				${h3_111('Or Enter a Color')}				
				${entercolor111()}				
				${wrongInput_111()}
				<br>
				${html5Div_111()}
				<br>
				<br>
			</div>
		</div>
	`;
	return createFom(html);
}
function NOpart111() {
	let d = mDom(null, {}, { classes: 'w3-row' });
	let html = `
		<div class="w3-col colorthird1" style="text-align:center;">
			${h3_111('Pick a Color:')}				
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${script111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				${h3_111('Or Enter a Color')}				
				${entercolor111()}				
				${wrongInput_111()}
				<br>
				${html5Div_111()}
				<br>
				<br>
			</div>
		</div>
	`;
	mAppend(d, createFom(html));
	return d;
}
function NOpart111() {
	let d = mDom(null, {}, { classes: 'w3-row' });
	let d1 = mDom(d, { align: 'center', w100: true }, { classes: 'w3-col', html: h3_111('Pick a Color:') });

	let html = `
		<div style="margin:auto;width:236px;">
			<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
			${map111()}				
			${script111()}				
			${selecthexagon111()}				
			${previewDiv_111()}				
			${h3_111('Or Enter a Color')}				
			${entercolor111()}				
			${wrongInput_111()}
			<br>
			${html5Div_111()}
			<br>
			<br>
		</div>
	`;
	mAppend(d1, createFom(html));
	return d;
}
function part111_2() {
	let html = `
		<div class="w3-col colorthird2" style="text-align:center;">
			<h3>Selected Color:</h3>
			<div id="selectedcolor" class="w3-large">
				<br><br>
				<span class="w3-text-black">Black Text</span><br><br>
				<span class="w3-text-black" style="text-shadow:1px 1px 0 #444">Shadow</span><br><br>
				<span class="w3-text-white">White Text</span><br><br>
				<span class="w3-text-white" style="text-shadow:1px 1px 0 #444">Shadow</span>
			</div>
			<div id="colornamDIV" class="w3-margin-top"></div>
			<div><b><span id="colorhexDIV"></span></b></div>
			<div id="colorrgbDIV"></div>
			<div id="colorhslDIV"></div>
		</div>

		<div class="w3-col colorthird3">
			<div id="lumtopcontainer"></div>
		</div>
	</div>

	`;

	return mCreateFrom(html);

}
function col3_111() {
	return `
			<div class="w3-col colorthird3">
				<div id="lumtopcontainer"></div>
			</div>
		`;
}
function col2_111() {
	return `
	<div class="w3-col colorthird2" style="text-align:center;">
		<h3>Selected Color:</h3>
		<div id="selectedcolor" class="w3-large">
			<br><br>
			<span class="w3-text-black">Black Text</span><br><br>
			<span class="w3-text-black" style="text-shadow:1px 1px 0 #444">Shadow</span><br><br>
			<span class="w3-text-white">White Text</span><br><br>
			<span class="w3-text-white" style="text-shadow:1px 1px 0 #444">Shadow</span>
		</div>
		<div id="colornamDIV" class="w3-margin-top"></div>
		<div><b><span id="colorhexDIV"></span></b></div>
		<div id="colorrgbDIV"></div>
		<div id="colorhslDIV"></div>
	</div>
`;
}
function copi2_all111() {
	let html = `
	<div class="w3-col colorthird1" style="text-align:center;">
	<h3>Pick a Color:</h3>
	<div style="margin:auto;width:236px;">
		<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' /><map
			id='colormap' name='colormap' onmouseout='mouseOutMap()'><area style='cursor:pointer' shape='poly'
				coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)'
				onmouseover='mouseOverColor("#003366")' alt='#003366' /><area style='cursor:pointer' shape='poly'
				coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)'
				onmouseover='mouseOverColor("#336699")' alt='#336699' /><area style='cursor:pointer' shape='poly'
				coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)'
				onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' /><area style='cursor:pointer' shape='poly'
				coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)'
				onmouseover='mouseOverColor("#003399")' alt='#003399' /><area style='cursor:pointer' shape='poly'
				coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)'
				onmouseover='mouseOverColor("#000099")' alt='#000099' /><area style='cursor:pointer' shape='poly'
				coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)'
				onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' /><area style='cursor:pointer' shape='poly'
				coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)'
				onmouseover='mouseOverColor("#000066")' alt='#000066' /><area style='cursor:pointer' shape='poly'
				coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)'
				onmouseover='mouseOverColor("#006666")' alt='#006666' /><area style='cursor:pointer' shape='poly'
				coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)'
				onmouseover='mouseOverColor("#006699")' alt='#006699' /><area style='cursor:pointer' shape='poly'
				coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)'
				onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' /><area style='cursor:pointer' shape='poly'
				coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)'
				onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' /><area style='cursor:pointer' shape='poly'
				coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)'
				onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' /><area style='cursor:pointer' shape='poly'
				coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)'
				onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' /><area style='cursor:pointer' shape='poly'
				coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)'
				onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' /><area style='cursor:pointer' shape='poly'
				coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)'
				onmouseover='mouseOverColor("#333399")' alt='#333399' /><area style='cursor:pointer' shape='poly'
				coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)'
				onmouseover='mouseOverColor("#669999")' alt='#669999' /><area style='cursor:pointer' shape='poly'
				coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)'
				onmouseover='mouseOverColor("#009999")' alt='#009999' /><area style='cursor:pointer' shape='poly'
				coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)'
				onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' /><area style='cursor:pointer' shape='poly'
				coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)'
				onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' /><area style='cursor:pointer' shape='poly'
				coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)'
				onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' /><area style='cursor:pointer' shape='poly'
				coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)'
				onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' /><area style='cursor:pointer' shape='poly'
				coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)'
				onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' /><area style='cursor:pointer' shape='poly'
				coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)'
				onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' /><area style='cursor:pointer' shape='poly'
				coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)'
				onmouseover='mouseOverColor("#666699")' alt='#666699' /><area style='cursor:pointer' shape='poly'
				coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)'
				onmouseover='mouseOverColor("#339966")' alt='#339966' /><area style='cursor:pointer' shape='poly'
				coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)'
				onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' /><area style='cursor:pointer' shape='poly'
				coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)'
				onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' /><area style='cursor:pointer' shape='poly'
				coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)'
				onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' /><area style='cursor:pointer' shape='poly'
				coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)'
				onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' /><area style='cursor:pointer' shape='poly'
				coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)'
				onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' /><area style='cursor:pointer' shape='poly'
				coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)'
				onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' /><area style='cursor:pointer' shape='poly'
				coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)'
				onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' /><area style='cursor:pointer' shape='poly'
				coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)'
				onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' /><area style='cursor:pointer' shape='poly'
				coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)'
				onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' /><area style='cursor:pointer' shape='poly'
				coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)'
				onmouseover='mouseOverColor("#339933")' alt='#339933' /><area style='cursor:pointer' shape='poly'
				coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)'
				onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' /><area style='cursor:pointer' shape='poly'
				coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)'
				onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' /><area style='cursor:pointer' shape='poly'
				coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)'
				onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' /><area style='cursor:pointer' shape='poly'
				coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)'
				onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' /><area style='cursor:pointer' shape='poly'
				coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)'
				onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' /><area style='cursor:pointer' shape='poly'
				coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)'
				onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' /><area style='cursor:pointer' shape='poly'
				coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)'
				onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' /><area style='cursor:pointer' shape='poly'
				coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)'
				onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' /><area style='cursor:pointer' shape='poly'
				coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)'
				onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' /><area style='cursor:pointer' shape='poly'
				coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)'
				onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' /><area style='cursor:pointer' shape='poly'
				coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)'
				onmouseover='mouseOverColor("#006600")' alt='#006600' /><area style='cursor:pointer' shape='poly'
				coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)'
				onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' /><area style='cursor:pointer' shape='poly'
				coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)'
				onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' /><area style='cursor:pointer' shape='poly'
				coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)'
				onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' /><area style='cursor:pointer' shape='poly'
				coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)'
				onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' /><area style='cursor:pointer' shape='poly'
				coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)'
				onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' /><area style='cursor:pointer' shape='poly'
				coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)'
				onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' /><area style='cursor:pointer' shape='poly'
				coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)'
				onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' /><area style='cursor:pointer' shape='poly'
				coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)'
				onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' /><area style='cursor:pointer' shape='poly'
				coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)'
				onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' /><area style='cursor:pointer' shape='poly'
				coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)'
				onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' /><area style='cursor:pointer' shape='poly'
				coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)'
				onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' /><area style='cursor:pointer' shape='poly'
				coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)'
				onmouseover='mouseOverColor("#003300")' alt='#003300' /><area style='cursor:pointer' shape='poly'
				coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)'
				onmouseover='mouseOverColor("#009933")' alt='#009933' /><area style='cursor:pointer' shape='poly'
				coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)'
				onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' /><area style='cursor:pointer' shape='poly'
				coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)'
				onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' /><area style='cursor:pointer' shape='poly'
				coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)'
				onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' /><area style='cursor:pointer' shape='poly'
				coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)'
				onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' /><area style='cursor:pointer' shape='poly'
				coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)'
				onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' /><area style='cursor:pointer' shape='poly'
				coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-110,126)'
				onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' /><area style='cursor:pointer' shape='poly'
				coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-110,144)'
				onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' /><area style='cursor:pointer' shape='poly'
				coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-110,162)'
				onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' /><area style='cursor:pointer' shape='poly'
				coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-110,180)'
				onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' /><area style='cursor:pointer' shape='poly'
				coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)'
				onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' /><area style='cursor:pointer' shape='poly'
				coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)'
				onmouseover='mouseOverColor("#660066")' alt='#660066' /><area style='cursor:pointer' shape='poly'
				coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)'
				onmouseover='mouseOverColor("#336600")' alt='#336600' /><area style='cursor:pointer' shape='poly'
				coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)'
				onmouseover='mouseOverColor("#009900")' alt='#009900' /><area style='cursor:pointer' shape='poly'
				coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)'
				onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' /><area style='cursor:pointer' shape='poly'
				coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)'
				onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' /><area style='cursor:pointer' shape='poly'
				coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)'
				onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' /><area style='cursor:pointer' shape='poly'
				coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)'
				onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' /><area style='cursor:pointer' shape='poly'
				coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)'
				onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' /><area style='cursor:pointer' shape='poly'
				coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)'
				onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' /><area style='cursor:pointer' shape='poly'
				coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)'
				onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' /><area style='cursor:pointer' shape='poly'
				coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)'
				onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' /><area style='cursor:pointer' shape='poly'
				coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)'
				onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' /><area style='cursor:pointer' shape='poly'
				coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)'
				onmouseover='mouseOverColor("#993399")' alt='#993399' /><area style='cursor:pointer' shape='poly'
				coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)'
				onmouseover='mouseOverColor("#333300")' alt='#333300' /><area style='cursor:pointer' shape='poly'
				coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)'
				onmouseover='mouseOverColor("#669900")' alt='#669900' /><area style='cursor:pointer' shape='poly'
				coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)'
				onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' /><area style='cursor:pointer' shape='poly'
				coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)'
				onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' /><area style='cursor:pointer' shape='poly'
				coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)'
				onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' /><area style='cursor:pointer' shape='poly'
				coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)'
				onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' /><area style='cursor:pointer' shape='poly'
				coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)'
				onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' /><area style='cursor:pointer' shape='poly'
				coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)'
				onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' /><area style='cursor:pointer' shape='poly'
				coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)'
				onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' /><area style='cursor:pointer' shape='poly'
				coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)'
				onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' /><area style='cursor:pointer' shape='poly'
				coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)'
				onmouseover='mouseOverColor("#990099")' alt='#990099' /><area style='cursor:pointer' shape='poly'
				coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)'
				onmouseover='mouseOverColor("#666633")' alt='#666633' /><area style='cursor:pointer' shape='poly'
				coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)'
				onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' /><area style='cursor:pointer' shape='poly'
				coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)'
				onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' /><area style='cursor:pointer' shape='poly'
				coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)'
				onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' /><area style='cursor:pointer' shape='poly'
				coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)'
				onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' /><area style='cursor:pointer' shape='poly'
				coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)'
				onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' /><area style='cursor:pointer' shape='poly'
				coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)'
				onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' /><area style='cursor:pointer' shape='poly'
				coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)'
				onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' /><area style='cursor:pointer' shape='poly'
				coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)'
				onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' /><area style='cursor:pointer' shape='poly'
				coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)'
				onmouseover='mouseOverColor("#993366")' alt='#993366' /><area style='cursor:pointer' shape='poly'
				coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)'
				onmouseover='mouseOverColor("#999966")' alt='#999966' /><area style='cursor:pointer' shape='poly'
				coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)'
				onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' /><area style='cursor:pointer' shape='poly'
				coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)'
				onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' /><area style='cursor:pointer' shape='poly'
				coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)'
				onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' /><area style='cursor:pointer' shape='poly'
				coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)'
				onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' /><area style='cursor:pointer' shape='poly'
				coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)'
				onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' /><area style='cursor:pointer' shape='poly'
				coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)'
				onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' /><area style='cursor:pointer' shape='poly'
				coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)'
				onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' /><area style='cursor:pointer' shape='poly'
				coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)'
				onmouseover='mouseOverColor("#660033")' alt='#660033' /><area style='cursor:pointer' shape='poly'
				coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)'
				onmouseover='mouseOverColor("#996633")' alt='#996633' /><area style='cursor:pointer' shape='poly'
				coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)'
				onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' /><area style='cursor:pointer' shape='poly'
				coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)'
				onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' /><area style='cursor:pointer' shape='poly'
				coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)'
				onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' /><area style='cursor:pointer' shape='poly'
				coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)'
				onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' /><area style='cursor:pointer' shape='poly'
				coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)'
				onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' /><area style='cursor:pointer' shape='poly'
				coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)'
				onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' /><area style='cursor:pointer' shape='poly'
				coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)'
				onmouseover='mouseOverColor("#990033")' alt='#990033' /><area style='cursor:pointer' shape='poly'
				coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)'
				onmouseover='mouseOverColor("#663300")' alt='#663300' /><area style='cursor:pointer' shape='poly'
				coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)'
				onmouseover='mouseOverColor("#996600")' alt='#996600' /><area style='cursor:pointer' shape='poly'
				coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)'
				onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' /><area style='cursor:pointer' shape='poly'
				coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)'
				onmouseover='mouseOverColor("#993300")' alt='#993300' /><area style='cursor:pointer' shape='poly'
				coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)'
				onmouseover='mouseOverColor("#990000")' alt='#990000' /><area style='cursor:pointer' shape='poly'
				coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)'
				onmouseover='mouseOverColor("#800000")' alt='#800000' /><area style='cursor:pointer' shape='poly'
				coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)'
				onmouseover='mouseOverColor("#993333")' alt='#993333' /></map>
		
		<script>
			var thistop = "-35";
			var thisleft = "135";
		</script>

		<div id='selectedhexagon'
			style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/w3/img_selectedcolor.gif")'>
		</div>
		<div id='divpreview'>&nbsp;</div>
		<h3>Or Enter a Color:</h3>
		<div id="entercolorDIV">
			<input type="text" id="entercolor" placeholder="Color value" onkeydown="submitOnEnter(event)"
				onfocus="clearWrongInput();" style="z-index:0;"><button class="btn btn-default" type="button"
				onclick="clickColor(0,-1,-1)" style="z-index:0;">OK</button>
		</div>
		<div id="wronginputDIV">Wrong Input</div>
		<br>
		<div id="html5DIV">
			<h3>Or Use HTML5:</h3>
			<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000"
				style="width:85%;">
		</div>
		<br>
		<br>
	</div>
	</div>

		`;
	return mCreateFrom(html);
}
function copi2_ganzerColorpicker() {
	let html = `
		<div style="margin:auto;width:236px;">
			<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' /><map
				id='colormap' name='colormap' onmouseout='mouseOutMap()'><area style='cursor:pointer' shape='poly'
					coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)'
					onmouseover='mouseOverColor("#003366")' alt='#003366' /><area style='cursor:pointer' shape='poly'
					coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)'
					onmouseover='mouseOverColor("#336699")' alt='#336699' /><area style='cursor:pointer' shape='poly'
					coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)'
					onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' /><area style='cursor:pointer' shape='poly'
					coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)'
					onmouseover='mouseOverColor("#003399")' alt='#003399' /><area style='cursor:pointer' shape='poly'
					coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)'
					onmouseover='mouseOverColor("#000099")' alt='#000099' /><area style='cursor:pointer' shape='poly'
					coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)'
					onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' /><area style='cursor:pointer' shape='poly'
					coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)'
					onmouseover='mouseOverColor("#000066")' alt='#000066' /><area style='cursor:pointer' shape='poly'
					coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)'
					onmouseover='mouseOverColor("#006666")' alt='#006666' /><area style='cursor:pointer' shape='poly'
					coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)'
					onmouseover='mouseOverColor("#006699")' alt='#006699' /><area style='cursor:pointer' shape='poly'
					coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)'
					onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' /><area style='cursor:pointer' shape='poly'
					coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)'
					onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' /><area style='cursor:pointer' shape='poly'
					coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)'
					onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' /><area style='cursor:pointer' shape='poly'
					coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)'
					onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' /><area style='cursor:pointer' shape='poly'
					coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)'
					onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' /><area style='cursor:pointer' shape='poly'
					coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)'
					onmouseover='mouseOverColor("#333399")' alt='#333399' /><area style='cursor:pointer' shape='poly'
					coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)'
					onmouseover='mouseOverColor("#669999")' alt='#669999' /><area style='cursor:pointer' shape='poly'
					coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)'
					onmouseover='mouseOverColor("#009999")' alt='#009999' /><area style='cursor:pointer' shape='poly'
					coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)'
					onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' /><area style='cursor:pointer' shape='poly'
					coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)'
					onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' /><area style='cursor:pointer' shape='poly'
					coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)'
					onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' /><area style='cursor:pointer' shape='poly'
					coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)'
					onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' /><area style='cursor:pointer' shape='poly'
					coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)'
					onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' /><area style='cursor:pointer' shape='poly'
					coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)'
					onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' /><area style='cursor:pointer' shape='poly'
					coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)'
					onmouseover='mouseOverColor("#666699")' alt='#666699' /><area style='cursor:pointer' shape='poly'
					coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)'
					onmouseover='mouseOverColor("#339966")' alt='#339966' /><area style='cursor:pointer' shape='poly'
					coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)'
					onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' /><area style='cursor:pointer' shape='poly'
					coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)'
					onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' /><area style='cursor:pointer' shape='poly'
					coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)'
					onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' /><area style='cursor:pointer' shape='poly'
					coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)'
					onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' /><area style='cursor:pointer' shape='poly'
					coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)'
					onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' /><area style='cursor:pointer' shape='poly'
					coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)'
					onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' /><area style='cursor:pointer' shape='poly'
					coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)'
					onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' /><area style='cursor:pointer' shape='poly'
					coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)'
					onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' /><area style='cursor:pointer' shape='poly'
					coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)'
					onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' /><area style='cursor:pointer' shape='poly'
					coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)'
					onmouseover='mouseOverColor("#339933")' alt='#339933' /><area style='cursor:pointer' shape='poly'
					coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)'
					onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' /><area style='cursor:pointer' shape='poly'
					coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)'
					onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' /><area style='cursor:pointer' shape='poly'
					coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)'
					onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' /><area style='cursor:pointer' shape='poly'
					coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)'
					onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' /><area style='cursor:pointer' shape='poly'
					coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)'
					onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' /><area style='cursor:pointer' shape='poly'
					coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)'
					onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' /><area style='cursor:pointer' shape='poly'
					coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)'
					onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' /><area style='cursor:pointer' shape='poly'
					coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)'
					onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' /><area style='cursor:pointer' shape='poly'
					coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)'
					onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' /><area style='cursor:pointer' shape='poly'
					coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)'
					onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' /><area style='cursor:pointer' shape='poly'
					coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)'
					onmouseover='mouseOverColor("#006600")' alt='#006600' /><area style='cursor:pointer' shape='poly'
					coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)'
					onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' /><area style='cursor:pointer' shape='poly'
					coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)'
					onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' /><area style='cursor:pointer' shape='poly'
					coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)'
					onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' /><area style='cursor:pointer' shape='poly'
					coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)'
					onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' /><area style='cursor:pointer' shape='poly'
					coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)'
					onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' /><area style='cursor:pointer' shape='poly'
					coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)'
					onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' /><area style='cursor:pointer' shape='poly'
					coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)'
					onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' /><area style='cursor:pointer' shape='poly'
					coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)'
					onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' /><area style='cursor:pointer' shape='poly'
					coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)'
					onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' /><area style='cursor:pointer' shape='poly'
					coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)'
					onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' /><area style='cursor:pointer' shape='poly'
					coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)'
					onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' /><area style='cursor:pointer' shape='poly'
					coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)'
					onmouseover='mouseOverColor("#003300")' alt='#003300' /><area style='cursor:pointer' shape='poly'
					coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)'
					onmouseover='mouseOverColor("#009933")' alt='#009933' /><area style='cursor:pointer' shape='poly'
					coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)'
					onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' /><area style='cursor:pointer' shape='poly'
					coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)'
					onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' /><area style='cursor:pointer' shape='poly'
					coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)'
					onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' /><area style='cursor:pointer' shape='poly'
					coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)'
					onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' /><area style='cursor:pointer' shape='poly'
					coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)'
					onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' /><area style='cursor:pointer' shape='poly'
					coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-110,126)'
					onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' /><area style='cursor:pointer' shape='poly'
					coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-110,144)'
					onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' /><area style='cursor:pointer' shape='poly'
					coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-110,162)'
					onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' /><area style='cursor:pointer' shape='poly'
					coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-110,180)'
					onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' /><area style='cursor:pointer' shape='poly'
					coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)'
					onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' /><area style='cursor:pointer' shape='poly'
					coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)'
					onmouseover='mouseOverColor("#660066")' alt='#660066' /><area style='cursor:pointer' shape='poly'
					coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)'
					onmouseover='mouseOverColor("#336600")' alt='#336600' /><area style='cursor:pointer' shape='poly'
					coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)'
					onmouseover='mouseOverColor("#009900")' alt='#009900' /><area style='cursor:pointer' shape='poly'
					coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)'
					onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' /><area style='cursor:pointer' shape='poly'
					coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)'
					onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' /><area style='cursor:pointer' shape='poly'
					coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)'
					onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' /><area style='cursor:pointer' shape='poly'
					coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)'
					onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' /><area style='cursor:pointer' shape='poly'
					coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)'
					onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' /><area style='cursor:pointer' shape='poly'
					coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)'
					onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' /><area style='cursor:pointer' shape='poly'
					coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)'
					onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' /><area style='cursor:pointer' shape='poly'
					coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)'
					onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' /><area style='cursor:pointer' shape='poly'
					coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)'
					onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' /><area style='cursor:pointer' shape='poly'
					coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)'
					onmouseover='mouseOverColor("#993399")' alt='#993399' /><area style='cursor:pointer' shape='poly'
					coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)'
					onmouseover='mouseOverColor("#333300")' alt='#333300' /><area style='cursor:pointer' shape='poly'
					coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)'
					onmouseover='mouseOverColor("#669900")' alt='#669900' /><area style='cursor:pointer' shape='poly'
					coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)'
					onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' /><area style='cursor:pointer' shape='poly'
					coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)'
					onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' /><area style='cursor:pointer' shape='poly'
					coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)'
					onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' /><area style='cursor:pointer' shape='poly'
					coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)'
					onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' /><area style='cursor:pointer' shape='poly'
					coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)'
					onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' /><area style='cursor:pointer' shape='poly'
					coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)'
					onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' /><area style='cursor:pointer' shape='poly'
					coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)'
					onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' /><area style='cursor:pointer' shape='poly'
					coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)'
					onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' /><area style='cursor:pointer' shape='poly'
					coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)'
					onmouseover='mouseOverColor("#990099")' alt='#990099' /><area style='cursor:pointer' shape='poly'
					coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)'
					onmouseover='mouseOverColor("#666633")' alt='#666633' /><area style='cursor:pointer' shape='poly'
					coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)'
					onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' /><area style='cursor:pointer' shape='poly'
					coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)'
					onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' /><area style='cursor:pointer' shape='poly'
					coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)'
					onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' /><area style='cursor:pointer' shape='poly'
					coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)'
					onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' /><area style='cursor:pointer' shape='poly'
					coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)'
					onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' /><area style='cursor:pointer' shape='poly'
					coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)'
					onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' /><area style='cursor:pointer' shape='poly'
					coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)'
					onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' /><area style='cursor:pointer' shape='poly'
					coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)'
					onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' /><area style='cursor:pointer' shape='poly'
					coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)'
					onmouseover='mouseOverColor("#993366")' alt='#993366' /><area style='cursor:pointer' shape='poly'
					coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)'
					onmouseover='mouseOverColor("#999966")' alt='#999966' /><area style='cursor:pointer' shape='poly'
					coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)'
					onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' /><area style='cursor:pointer' shape='poly'
					coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)'
					onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' /><area style='cursor:pointer' shape='poly'
					coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)'
					onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' /><area style='cursor:pointer' shape='poly'
					coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)'
					onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' /><area style='cursor:pointer' shape='poly'
					coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)'
					onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' /><area style='cursor:pointer' shape='poly'
					coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)'
					onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' /><area style='cursor:pointer' shape='poly'
					coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)'
					onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' /><area style='cursor:pointer' shape='poly'
					coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)'
					onmouseover='mouseOverColor("#660033")' alt='#660033' /><area style='cursor:pointer' shape='poly'
					coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)'
					onmouseover='mouseOverColor("#996633")' alt='#996633' /><area style='cursor:pointer' shape='poly'
					coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)'
					onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' /><area style='cursor:pointer' shape='poly'
					coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)'
					onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' /><area style='cursor:pointer' shape='poly'
					coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)'
					onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' /><area style='cursor:pointer' shape='poly'
					coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)'
					onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' /><area style='cursor:pointer' shape='poly'
					coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)'
					onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' /><area style='cursor:pointer' shape='poly'
					coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)'
					onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' /><area style='cursor:pointer' shape='poly'
					coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)'
					onmouseover='mouseOverColor("#990033")' alt='#990033' /><area style='cursor:pointer' shape='poly'
					coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)'
					onmouseover='mouseOverColor("#663300")' alt='#663300' /><area style='cursor:pointer' shape='poly'
					coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)'
					onmouseover='mouseOverColor("#996600")' alt='#996600' /><area style='cursor:pointer' shape='poly'
					coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)'
					onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' /><area style='cursor:pointer' shape='poly'
					coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)'
					onmouseover='mouseOverColor("#993300")' alt='#993300' /><area style='cursor:pointer' shape='poly'
					coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)'
					onmouseover='mouseOverColor("#990000")' alt='#990000' /><area style='cursor:pointer' shape='poly'
					coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)'
					onmouseover='mouseOverColor("#800000")' alt='#800000' /><area style='cursor:pointer' shape='poly'
					coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)'
					onmouseover='mouseOverColor("#993333")' alt='#993333' /></map>
			
			<script>
				var thistop = "-35";
				var thisleft = "135";
			</script>

			<div id='selectedhexagon'
				style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/w3/img_selectedcolor.gif")'>
			</div>
			<div id='divpreview'>&nbsp;</div>
			<h3>Or Enter a Color:</h3>
			<div id="entercolorDIV">
				<input type="text" id="entercolor" placeholder="Color value" onkeydown="submitOnEnter(event)"
					onfocus="clearWrongInput();" style="z-index:0;"><button class="btn btn-default" type="button"
					onclick="clickColor(0,-1,-1)" style="z-index:0;">OK</button>
			</div>
			<div id="wronginputDIV">Wrong Input</div>
			<br>
			<div id="html5DIV">
				<h3>Or Use HTML5:</h3>
				<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000"
					style="width:85%;">
			</div>
			<br>
			<br>
		</div>

		`;
	return mCreateFrom(html);
}

function copi2_part() {
	let html = `

		`;
	return mCreateFrom(html);
}
function part111() {
	let html = `
	<div class="w3-row">
		<div class="w3-col colorthird1" style="text-align:center;">
			<h3>Pick a Color:</h3>
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				<script>
					var thistop = "-35";
					var thisleft = "135";
				</script>

				<div id='selectedhexagon'
					style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/w3/img_selectedcolor.gif")'>
				</div>
				<div id='divpreview'>&nbsp;</div>
				<h3>Or Enter a Color:</h3>
				<div id="entercolorDIV">
					<input type="text" id="entercolor" placeholder="Color value" onkeydown="submitOnEnter(event)"
						onfocus="clearWrongInput();" style="z-index:0;"><button class="btn btn-default" type="button"
						onclick="clickColor(0,-1,-1)" style="z-index:0;">OK</button>
				</div>
				<div id="wronginputDIV">Wrong Input</div>
				<br>
				${html5Div_111()}
				<br>
				<br>
			</div>
		</div>

		<div class="w3-col colorthird2" style="text-align:center;">
			<h3>Selected Color:</h3>
			<div id="selectedcolor" class="w3-large">
				<br><br>
				<span class="w3-text-black">Black Text</span><br><br>
				<span class="w3-text-black" style="text-shadow:1px 1px 0 #444">Shadow</span><br><br>
				<span class="w3-text-white">White Text</span><br><br>
				<span class="w3-text-white" style="text-shadow:1px 1px 0 #444">Shadow</span>
			</div>
			<div id="colornamDIV" class="w3-margin-top"></div>
			<div><b><span id="colorhexDIV"></span></b></div>
			<div id="colorrgbDIV"></div>
			<div id="colorhslDIV"></div>
		</div>

		<div class="w3-col colorthird3">
			<div id="lumtopcontainer"></div>
		</div>
	</div>

	`;

	return mCreateFrom(html);

}
//#endregion

//#region


//#endregion



