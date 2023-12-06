//#region basemin
const BLUE = '#4363d8';
const BLUEGREEN = '#004054';
const BROWN = '#96613d';
const GREEN = '#3cb44b';
const FIREBRICK = '#800000';
const LIGHTGREEN = '#afff45'; //'#bfef45';
const LIGHTBLUE = '#42d4f4';
const NEONORANGE = '#ff6700';
const NEONYELLOW = '#efff04';
const OLIVE = '#808000';
const ORANGE = '#f58231';
const PURPLE = '#911eb4';
const RED = '#e6194B';
const TEAL = '#469990';
const YELLOW = '#ffe119';
const YELLOW2 = '#fff620'; //?pink???
const YELLOW3 = '#ffed01';
const DIBOA = {
	home: { link: "../rechnung/index.html", img: 'home.png', align: 'left', pop: false },
	bill: { link: "../rechnung/index.html", img: 'bill.png', align: 'left', pop: false },
	boa: { link: "", img: 'boa.png', align: 'left', pop: false },
	bw: { link: "../rechnung/bwindex.html", img: 'bwicon.png', align: 'right', pop: true },
	authenticator: { link: "../rechnung/boaa.html", img: 'authenticator.png', align: 'right', pop: true },
	authy: { link: "../rechnung/boaa.html", img: 'authy.png', align: 'right', pop: true },
	onedrive: { link: "../rechnung/boaa.html", img: 'onedrive.png', align: 'right', pop: true },
	skype: {
		link: "../rechnung/boaa.html", img: 'skype.png', align: 'right', pop: false,
		contacts: {
			'Julia Oasis': { date: 'Wed', msg: 'Wow', color: BLUEGREEN },
			'+14778991960': { date: 'Thu', msg: 'Missed Call', color: ORANGE },
		}
	},
	bw_info: {
		boa: { userid: 'gleem@gmail.com', pwd: rPassword(20) },
		authy: { userid: 'gleem@gmail.com', pwd: rPassword(20) },
	},
	boa_data: {
		'AAA-MBNA 5464 3332 3333 5555': { sub: '*5555', logo: 'boa.png' },
		'AMERICAN EXPRESS': { sub: '*4554', logo: 'amex.png' },
		'AT&T Mobility': { sub: '*1331', logo: 'att.png' },
		'AT&T Mobility{AT&T WA}': { sub: '*7575', logo: 'att.png' },
		'AT&T Mobility': { sub: '*8585', logo: 'att.png' },
		'Bank Of Amerika Credit Card': { sub: '*1212', logo: 'boa.png', 'Last Payment': '5-25 $1150.41', brand: 'BofA_rgb' },
		'Bank Of Amerika': { sub: '*0898', logo: 'boa.png' },
		'Bank Of Amerika Mail-in1': { sub: '*6565', logo: 'boa.png' },
		'Bel-Red Oral': { sub: '*2432' },
		'Bellevue Kendo Club': { sub: '*hallo' },
		'CapitalOne': { sub: '*1324', logo: 'capitalOne.png' },
		'CapitalOneVenture': { sub: '*6456', logo: 'capitalOne.png' },
		'CapitalOneVentureF': { sub: '*9789', logo: 'capitalOne.png' },
		'Chase': { sub: '*3131', logo: 'chase.png' },
		'Chase Amazon': { sub: '*0898', 'Last Payment': '5-25 $1150.41', logo: 'chase.png', brand: 'prime' },
		'Chase Card': { sub: '*1432', logo: 'chase.png' },
		'CHASE MANHATTAN BANK-MC': { sub: '*0797', 'Last Payment': '5-25 $110.99', logo: 'chase.png', brand: 'chase_bank' },
		'Chase Sapphire': { sub: '*5132', logo: 'chase.png' },
		'Chase Sapphire': { sub: '*8679', logo: 'chase.png' },
		'City Cards': { sub: '*3124', logo: 'citi.png' },
		'City Cards Divident': { sub: '*9678', logo: 'citi.png' },
		'CITY CARDS Points': { sub: '*7678', logo: 'citi.png' },
		'Citi Costco': { sub: '*8768', 'Last Payment': '6-17 $506.14', logo: 'citi.png', brand: 'citibank' },
		'Citi Costco gu': { sub: '*0890', 'Last Payment': '6-6 $228.92', logo: 'citi.png', brand: 'citibank' },
		'CITI DIVIDENT Platinum': { sub: '*3454', logo: 'citi.png' },
		'CITIBANK VISA NV': { sub: '*7566', logo: 'citi.png' },
		'City of Redmond': { sub: '*4998' },
		'City of Redmond WA': { sub: '*2887', 'Last Payment': '5-17 $214.94', brand: 'redmond' },
		'Comcast': { sub: '*7676', logo: 'comcast.png' },
		'Comcast Perrigo': { sub: '*1324', 'Last Payment': '6-21 $89.44', logo: 'comcast.png', brand: 'comcast' },
		'ComCast WA': { sub: '*6456', logo: 'comcast.png' },
		'DISCOVER CARD SERVICES': { sub: '*8678' },
		'Dr. Ellie Tabaraie': { sub: '*hallo' },
		'Fastenerz.com': { sub: '*000' },
		'Fibonacci': { sub: '*6666' },
		'Fleet Credit Card Service': { sub: '*8798' },
		'FLEET CREDIT CARD0MC/VS (32)': { sub: '*8799' },
		'Frontier': { sub: '*05-5' },
		'Frontier2': { sub: '*5366' },
		'GoodToGo': { sub: '*7767' },
		'Hardford Mutual Funds Inc.': { sub: '*8878' },
		'King County Treasury': { sub: '*0-02' },
		'King County Treasury': { sub: '*0-03' },
		'LabCorp': { sub: '*8899' },
		'Landover Mortgage': { sub: '*hallo' },
		'Lauren Magada': { sub: 'Lauren boa' },
		'Lederman&Pulman': { sub: '*9988' },
		'Liberty Mutual Group': { sub: '*-660' },
		'Liberty Mutual Group': { sub: '*-768' },
		'Liberty Mutual Group': { sub: '*-760' },
		"Macy's Star Rewards": { sub: '*23-0', logo: 'macys.png' },
		'MBNA': { sub: '*3444' },
		'MBNA 6455 6677 7924 5555': { sub: '*5555' },
		'Oachita': { sub: '*6556' },
		'Oasis Condominium CA': { sub: '*889' },
		'Oasis Condominium CA': { sub: '*1889', 'Last Payment': '5-31 $581.54', brand: 'oasis' },
		'Orthodontics Roos': { sub: '*1111' },
		'Overcast Law Office, PS': { sub: '*4423' },
		'Overlake Medical Center': { sub: '*hallo' },
		'Pediatric Associates Inc': { sub: '*8383' },
		'Perrigo Heights HOA': { sub: '*t#98' },
		'Premier Periodontics': { sub: '*9494' },
		'PreventionMD': { sub: '*9566' },
		'Prime Trust LLC': { sub: '*8788' },
		'ProSport': { sub: '*1233' },
		'PSE - Puget Sound Energy': { sub: '*3444', 'Last Payment': '5-25 $70.59', brand: 'PSE' },
		'Puget Sound Energy': { sub: '*66-9' },
		'Real Property Management Eclipse': { sub: '*asss' },
		'Remadina Ridge Family Dentistry': { sub: '*6656' },
		'Sewage Capacity Charge': { sub: '*7575' },
		'Silkroad': { sub: '*788-1' },
		'Suhrco': { sub: '*899' },
		'Target': { sub: '*9789' },
		'Target National Bank': { sub: '*1432' },
		'Univerity Of WA Medical Center': { sub: '*1543' },
		'US Bank Credit Card FlexPerks': { sub: '*0789', 'Last Payment': '5-20 $11.13', brand: 'usbank' },
		'USBank': { sub: '*7567' },
		'USBank-CashPlus': { sub: '*3123' },
		'USBank-FlexPerks': { sub: '*1321' },
		'Verizon': { sub: '*7567' },
		'Waste Management': { sub: '*87-1' },
		'Waste Management': { sub: '*23-9' },
		'Wells Fargo Home Mortgage': { sub: '*1333', 'Last Payment': '6-10 $1625.06', logo: 'wellsfargo.png', brand: 'wellsfargo' },
		'Wells Fargo Mortgage': { sub: '*2444', logo: 'wellsfargo.png' },
		'Williams-Sonoma': { sub: '*9888' },
		'WINDERMERE PROPERTY MGMT/EASTSID': { sub: '*8766' },
		'Windermere Real Estate/East': { sub: '*ntal' },
	}
};
const INNO = {
	color: { blue: '#89aad7', red: '#da7887', green: '#72b964', yellow: '#e2e57a', purple: '#9b58ba' },
	sym: {
		tower: { key: 'white-tower', fg: 'silver', bg: 'dimgray' },
		leaf: { key: 'leaf', fg: '#96D6BE', bg: '#275D45' },
		tree: { key: 'leaf', fg: '#96D6BE', bg: '#275D45' },
		bulb: { key: 'lightbulb', fg: 'white', bg: '#69224C' },
		crown: { key: 'queen-crown', fg: '#FEE593', bg: '#A27E44' },
		factory: { key: 'i_factory', fg: '#CD5147', bg: '#6D1A12' },
		clock: { key: 'clock', fg: '#3E84B5', bg: '#0B5884' },
		none: { key: 'flamer', fg: 'silver', bg: 'dimgrey' },
		plus: { key: 'plus', fg: 'silver', bg: '#00000020' },
		fountain: { key: 'fountain', fg: 'silver', bg: '#00000020' },
		flag: { key: 'flying-flag', fg: 'silver', bg: '#00000020' },
		up: { key: 'arrow-up', fg: 'silver', bg: '#00000020' },
		left: { key: 'arrow-left', fg: 'silver', bg: '#00000020' },
		right: { key: 'arrow-right', fg: 'silver', bg: '#00000020' },
	},
	symNames: ['tower', 'tree', 'bulb', 'crown', 'factory', 'clock'],
	phases: [
		{ key: 'init', message: 'select initial card to meld!' },
		{ key: 'just_one_turn', message: 'take your first turn!' },
		{ key: 'two_turns', message: 'take your turn!' },
	],
	special_achievements: {
		MONUMENT: "Claim immediately if you tuck six cards or score six cards during a single turn (May also be claimed via Masonry from Age 1)",
		EMPIRE: "Claim immediately if you have three  or more icons of all six types (May also be claimed via Construction from Age 2)",
		WORLD: "Claim immediately if you have twelve or more clocks on your board (May also be claimed via Translation from Age 3)",
		WONDER: "Claim immediately if you have all five colors on your board, and each is splayed either up or right (May also be claimed via Invention from Age 4)",
		UNIVERSE: "Claim immediately if you have five top cards, and each is of value 8 or higher (May also be claimed via Astronomy from Age 5)",
		LEGEND: "Claim if you meld a city with a left arrow on a color already splayed left",
		REPUTE: "Claim if you meld a city with a right arrow on a color already splayed right",
		FAME: "Claim if you meld a city with a up arrow on a color already splayed up",
		GLORY: "Claim immediately tuck a city with a flag",
		VICTORY: "Claim immediately tuck a city with a fountain",
		SUPREMACY: "Claim immediately if you have 3 or more of one icon in 4 different colors (May also be claimed via Novel from Age 3)",
		DESTINY: "Claim immediately if you have 7 or more cards in your forecast (May also be claimed via Barometer from Age 4)",
		WEALTH: "Claim immediately if you have 8 or more bonuses (May also be claimed via Palampore from Age 5)",
		HERITAGE: "Claim immediately if you have 8 or more numbers in one color (May also be claimed via Loom from Age 6)",
		HISTORY: "Claim immediately if you have 4 or more echoes in one color (May also be claimed via Photography from Age 7)",
	},
};
const ARI = {
	sz_hand: 7,
	stage: {
		1: 'journey',
		2: 'tax',
		3: 'auto market',
		4: 'stall selection',
		1004: 'TEST_starts_in_stall_selection_complete',
		5: 'action: command',
		6: 'action step 2',
		7: 'action 3',
		8: 'action 4',
		9: 'action 5',
		10: 'end game?',
		11: 'ball',
		12: 'auction: bid',
		13: 'auction: buy',
		14: 'complementing_market_after_church',
		15: 'commission',
		16: 'commission new',
		17: 'church',
		18: 'church_minplayer_tithe',
		19: 'church_newcards',
		20: 'payment action',
		21: 'church_minplayer_tithe_add',
		22: 'church_minplayer_tithe_downgrade',
		23: 'comm_weitergeben',
		24: 'rumors_weitergeben',
		25: 'rumor',
		26: 'blackmail',
		blackmail: 26,
		27: 'inspect',
		rumor: 25,
		28: 'buy rumor',
		'buy rumor': 28,
		29: 'rumor discard',
		30: 'pick luxury or journey cards',
		31: 'add new journey',
		32: 'rumor_both',
		33: 'blackmail_owner',
		34: 'accept_blackmail',
		35: 'blackmail_complete',
		36: 'reject_blackmail',
		37: 'commission_stall',
		38: 'pick_schwein',
		40: 'trade',
		41: 'build',
		42: 'visit',
		43: 'buy',
		44: 'upgrade',
		45: 'downgrade',
		46: 'visit destroy',
		build: 41,
		upgrade: 44,
		downgrade: 45,
		visit: 42,
		buy: 43,
		100: 'pickup end',
		101: 'build end',
		102: 'select building to upgrade',
		103: 'select downgrade cards',
		104: 'next_comm_setup_stage',
		105: 'next_rumor_setup_stage',
	}
};
const BLUFF = {
	torank: { _: '_', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: 'T', jack: 'J', queen: 'Q', king: 'K', ace: 'A' },
	toword: { _: '_', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', T: 'ten', J: 'jack', Q: 'queen', K: 'king', A: 'ace' },
	rankstr: '3456789TJQKA',
};
const SHERIFF = {
	color: {
		legal: GREEN, //'lime',
		contraband: 'crimson',
		royal: 'orangered'
	},
	cards: {
		apples: { ksym: 'green apple', kcenter: 'red apple', label: 'apple', type: 'legal', value: 2, penalty: 2 },
		cheese: { ksym: 'cheese wedge', kcenter: 'cheese wedge', label: 'cheese', type: 'legal', value: 3, penalty: 2 },
		pineapple: { ksym: 'pineapple', kcenter: 'pineapple', label: 'pineapple', type: 'legal', value: 4, penalty: 2 },
		chicken: { ksym: 'poultry leg', kcenter: 'poultry leg', label: 'chicken', type: 'legal', value: 4, penalty: 2 },
		bread: { ksym: 'bread', kcenter: 'bread', label: 'bread', type: 'legal', value: 3, penalty: 2 },
		pepper: { ksym: 'hot pepper', kcenter: 'hot pepper', label: 'pepper', type: 'contraband', value: 6, penalty: 4 },
		mead: { ksym: 'beer mug', kcenter: 'beer mug', label: 'mead', type: 'contraband', value: 7, penalty: 4 },
		silk: { ksym: 'sari', kcenter: 'kimono', label: 'silk', type: 'contraband', value: 8, penalty: 4 },
		crossbow: { ksym: 'crossbow', kcenter: 'crossbow', label: 'crossbow', type: 'contraband', value: 9, penalty: 4 },
		chestnut: { ksym: 'chestnut', kcenter: 'chestnut', label: 'chestnut', type: 'royal', value: 4, penalty: 3 },
		pear: { ksym: 'pear', kcenter: 'pear', label: 'pear', type: 'royal', value: 6, penalty: 4 },
		pie: { ksym: 'pie', kcenter: 'pie', label: 'pie', type: 'royal', value: 6, penalty: 4 },
		squid: { ksym: 'squid', kcenter: 'squid', label: 'squid', type: 'royal', value: 9, penalty: 5 },
		shortcake: { ksym: 'shortcake', kcenter: 'shortcake', label: 'shortcake', type: 'royal', value: 9, penalty: 5 },
		grapes: { ksym: 'grapes', kcenter: 'grapes', label: 'grapes', type: 'royal', value: 9, penalty: 5 },
		pretzel: { ksym: 'pretzel', kcenter: 'pretzel', label: 'pretzel', type: 'royal', value: 9, penalty: 5 },
		baguette: { ksym: 'baguette bread', kcenter: 'baguette bread', label: 'bread', type: 'royal', value: 6, penalty: 4 },
		cherries: { ksym: 'cherries', kcenter: 'cherries', label: 'cherries', type: 'royal', value: 8, penalty: 4 },
	},
	cardtypes: {
		legal: ['apples', 'cheese', 'pineapple', 'bread'],
		contraband: ['pepper', 'mead', 'silk', 'crossbow'],
		royal: ['chestnut', 'pear', 'pie', 'shortcake', 'pretzel', 'grapes', 'baguette', 'cherries'] //die mit penalty 4 gibt es je 2x
	},
	stage: {
		1: 'exchange',
	}
}
const STYLE_PARAMS = {
	align: 'text-align',
	bg: 'background-color',
	dir: 'flex-direction',
	fg: 'color',
	hgap: 'column-gap',
	vgap: 'row-gap',
	matop: 'margin-top',
	maleft: 'margin-left',
	mabottom: 'margin-bottom',
	maright: 'margin-right',
	origin: 'transform-origin',
	patop: 'padding-top',
	paleft: 'padding-left',
	pabottom: 'padding-bottom',
	paright: 'padding-right',
	rounding: 'border-radius',
	w: 'width',
	h: 'height',
	wmin: 'min-width',
	hmin: 'min-height',
	wmax: 'max-width',
	hmax: 'max-height',
	hline: 'line-height',
	fontSize: 'font-size',
	fz: 'font-size',
	family: 'font-family',
	weight: 'font-weight',
	z: 'z-index'
};
var SOCKETSERVER = 'http://localhost:5000'; //geht im spital
var SERVER = "http://localhost:8080/aroot/simple"; // oder telecave!
var Pollmode = 'auto'; 
var Sayings;
var Info;
var ColorDi;
var Items = {};
var DA = {}; 
var Card = {};
var TO = {};
var Counter = { server: 0 };
var Socket = null;
var uiActivated = false;
var Selected;
var Turn;
var Prevturn;
var S = {};
var Z;
var U = null;
var PL;
var G;
var UI = {};
var Users;
var Tables;
var Basepath;
var Serverdata = {};
var Clientdata = {};
var dTable;
var dHistory;
var Config;
var Syms;
var SymKeys;
var ByGroupSubgroup;
var KeySets;
var C52;
var Cinno;
var C52Cards;
var FORCE_REDRAW = false;
var TESTING = false;
var ColorThiefObject;
var SelectedItem;
var SelectedColor;
var FirstLoad = true;
var firsttime = false;
var MyEasing = 'ease'; //cubic-bezier(1,-0.03,.86,.68)';
var SHAPEFUNCS = {
	'circle': agCircle,
	'hex': agHex,
	'rect': agRect,
}
var TOFleetingMessage, dFleetingMessage, Animation1;
var UIDCounter = 0;
class SimpleTimer {
	constructor(elem, msTick, onTick, msTotal, onElapsed) {
		this.elem = elem;
		this.msTotal = this.msLeft = msTotal;
		this.onTick = onTick;
		this.onElapsed = onElapsed;
		this.interval = msTick;
		this.running = false;
		this.paused = false;
		this.TO = null;
	}
	togglePause() { if (this.paused) this.continue(); else this.pause(); }
	clear() { let elapsed = this.stop(); clearElement(this.elem); return elapsed; }
	continue() {
		if (!this.running) this.start();
		else if (!this.paused) return;
		else { this.paused = false; this.TO = setInterval(this.tickHandler.bind(this), this.interval); }
	}
	tickHandler() {
		this.msLeft -= this.interval;
		this.msElapsed = this.msTotal - this.msLeft;
		this.output();
		if (isdef(this.onTick)) this.onTick();
		if (this.msLeft <= 0) {
			this.stop();
			this.msLeft = 0;
			if (isdef(this.onElapsed)) {
				this.onElapsed(0);
			}
		}
	}
	start() {
		if (this.running) this.stop();
		this.started = new Date().now;
		this.msLeft = this.msTotal;
		this.msElapsed = 0;
		this.running = true;
		this.output();
		this.TO = setInterval(this.tickHandler.bind(this), this.interval);
	}
	output() {
		this.elem.innerHTML = timeConversion(Math.max(this.msLeft, 0), 'msh');
	}
	stop() {
		if (!this.running) return;
		clearInterval(this.TO);
		this.TO = null;
		this.running = false;
		return this.msLeft;
	}
	pause() {
		if (this.paused || !this.running) return;
		clearInterval(this.TO);
		this.paused = true;
	}
}
function addIf(arr, el) { if (!arr.includes(el)) arr.push(el); }
function addKeys(ofrom, oto) { for (const k in ofrom) if (nundef(oto[k])) oto[k] = ofrom[k]; return oto; }
function addMonthToDate(date, months) {
	let d = new Date(date);
	d.setMonth(d.getMonth() + months);
	return d;
}
function addWeekToDate(date, weeks) {
	let d = new Date(date);
	d.setDate(d.getDate() + (weeks * 7));
	return d;
}
function aFlip(d, ms = 300, x = 0, y = 1, easing = 'cubic-bezier(1,-0.03,.27,1)') {
	return d.animate({ transform: `scale(${2}px,${y}px)` }, { easing: easing, duration: ms });
}
function agCircle(g, sz) { let r = gEllipse(sz, sz); g.appendChild(r); return r; }
function agColoredShape(g, shape, w, h, color) {
	SHAPEFUNCS[shape](g, w, h);
	gBg(g, color);
}
function agEllipse(g, w, h) { let r = gEllipse(w, h); g.appendChild(r); return r; }
function agG(g) { let g1 = gG(); g.appendChild(g1); return g1; }
function aggregate_elements(list_of_object, propname) {
	let result = [];
	for (let i = 0; i < list_of_object.length; i++) {
		let obj = list_of_object[i];
		let arr = obj[propname];
		for (let j = 0; j < arr.length; j++) {
			result.push(arr[j]);
		}
	}
	return result;
}
function agHex(g, w, h) { let pts = size2hex(w, h); return agPoly(g, pts); }
function agLine(g, x1, y1, x2, y2) { let r = gLine(x1, y1, x2, y2); g.appendChild(r); return r; }
function agPoly(g, pts) { let r = gPoly(pts); g.appendChild(r); return r; }
function agRect(g, w, h) { let r = gRect(w, h); g.appendChild(r); return r; }
function agShape(g, shape, w, h, color, rounding) {
	let sh = gShape(shape, w, h, color, rounding);
	g.appendChild(sh);
	return sh;
}
function allNumbers(s) {
	let m = s.match(/\-.\d+|\-\d+|\.\d+|\d+\.\d+|\d+\b|\d+(?=\w)/g);
	if (m) return m.map(v => Number(v)); else return null;
}
function alphaToHex(zero1) {
	zero1 = Math.round(zero1 * 100) / 100;
	var alpha = Math.round(zero1 * 255);
	var hex = (alpha + 0x10000)
		.toString(16)
		.slice(-2)
		.toUpperCase();
	var perc = Math.round(zero1 * 100);
	return hex;
}
function aMove(d, dSource, dTarget, callback, offset, ms, easing, fade) {
	let b1 = getRect(dSource);
	let b2 = getRect(dTarget);
	if (nundef(offset)) offset = { x: 0, y: 0 };
	let dist = { x: b2.x - b1.x + offset.x, y: b2.y - b1.y + offset.y };
	d.style.zIndex = 100;
	let a = d.animate({ opacity: valf(fade, 1), transform: `translate(${dist.x}px,${dist.y}px)` }, { easing: valf(easing, 'EASE'), duration: ms });
	a.onfinish = () => { d.style.zIndex = iZMax(); if (isdef(callback)) callback(); };
}
function animateProperty(elem, prop, start, middle, end, msDuration, forwards) {
	let kflist = [];
	for (const v of [start, middle, end]) {
		let o = {};
		o[prop] = isString(v) || prop == 'opacity' ? v : '' + v + 'px';
		kflist.push(o);
	}
	let opts = { duration: msDuration };
	if (isdef(forwards)) opts.fill = forwards;
	elem.animate(kflist, opts); // {duration:msDuration}); //,fill:'forwards'});
}
function animatePropertyX(elem, prop, start_middle_end, msDuration, forwards, easing, delay) {
	let kflist = [];
	for (const perc in start_middle_end) {
		let o = {};
		let val = start_middle_end[perc];
		o[prop] = isString(val) || prop == 'opacity' ? val : '' + val + 'px';
		kflist.push(o);
	}
	let opts = { duration: msDuration, fill: valf(forwards, 'none'), easing: valf(easing, 'ease-it-out'), delay: valf(delay, 0) };
	elem.animate(kflist, opts); // {duration:msDuration}); //,fill:'forwards'});
}
function aRotate(d, ms = 2000) { return d.animate({ transform: `rotate(360deg)` }, ms); }
function aRotateAccel(d, ms) { return d.animate({ transform: `rotate(1200deg)` }, { easing: 'cubic-bezier(.72, 0, 1, 1)', duration: ms }); }
function arr_get_max(arr, func) {
	if (isEmpty(arr)) return null;
	if (nundef(func)) func = x => x;
	let i = 0; let aug = arr.map(x => ({ el: jsCopy(x), val: func(x), i: i++ }));
	sortByDescending(aug, 'val');
	let max = aug[0].val;
	let res = arrTakeWhile(aug, x => x.val == max); return res.map(x => arr[x.i]);
}
function arr_get_min(arr, func) {
	if (isEmpty(arr)) return null;
	if (nundef(func)) func = x => x;
	let i = 0; let aug = arr.map(x => ({ el: jsCopy(x), val: func(x), i: i++ }));
	sortBy(aug, 'val');
	let min = aug[0].val;
	let res = arrTakeWhile(aug, x => x.val == min); return res.map(x => arr[x.i]);
}
function arrBuckets(arr, func, sortbystr) {
	let di = {};
	for (const a of arr) {
		let val = func(a);
		if (nundef(di[val])) di[val] = { val: val, list: [] };
		di[val].list.push(a);
	}
	let res = []
	let keys = get_keys(di);
	if (isdef(sortbystr)) {
		keys.sort((a, b) => sortbystr.indexOf(a) - sortbystr.indexOf(b));
	}
	return keys.map(x => di[x]);
}
function arrChildren(elem) { return [...toElem(elem).children]; }
function arrClear(arr) { arr.length = 0; }
function arrCount(arr, func) { return arr.filter(func).length; }
function arrCycle(arr, count) { return arrRotate(arr, count); }
function arrExtend(arr, list) { list.map(x => arr.push(x)); return arr; }
function arrFirst(arr) { return arr.length > 0 ? arr[0] : null; }
function arrFlatten(arr) {
	let res = [];
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[i].length; j++) {
			res.push(arr[i][j]);
		}
	}
	return res;
}
function arrFromIndex(arr, i) { return arr.slice(i); }
function arrFromTo(arr, iFrom, iTo) { return takeFromTo(arr, iFrom, iTo); }
function arrFunc(n, func) { let res = []; for (let i = 0; i < n; i++) res.push(func()); return res; }
function arrIndices(arr, func) {
	let indices = [];
	for (let i = 0; i < arr.length; i++) { if (func(arr[i])) indices.push(i); }
	return indices;
}
function arrLast(arr) { return arr.length > 0 ? arr[arr.length - 1] : null; }
function arrLastOfLast(arr) { if (arr.length > 0) { let l = arrLast(arr); return isList(l) ? arrLast(l) : null; } else return null; }
function arrMax(arr, f) { return arr_get_max(arr, f); }
function arrMin(arr, f) { return arr_get_min(arr, f); }
function arrMinMax(arr, func) {
	if (nundef(func)) func = x => x;
	let min = func(arr[0]), max = func(arr[0]), imin = 0, imax = 0;
	for (let i = 1, len = arr.length; i < len; i++) {
		let v = func(arr[i]);
		if (v < min) {
			min = v; imin = i;
		} else if (v > max) {
			max = v; imax = i;
		}
	}
	return { min: min, imin: imin, max: max, imax: imax, elmin: arr[imin], elmax: arr[imax] };
}
function arrMinus(a, b) { if (isList(b)) return a.filter(x => !b.includes(x)); else return a.filter(x => x != b); }
function arrPlus(a, b) { b.map(x => a.push(x)); return a; }
function arrRange(from = 1, to = 10, step = 1) { let res = []; for (let i = from; i <= to; i += step)res.push(i); return res; }
function arrRemove(arr, listweg) {
	arrReplace(arr, listweg, []);
}
function arrRemoveLast(arr) { arr.length -= 1; }
function arrRemovip(arr, el) {
	let i = arr.indexOf(el);
	if (i > -1) arr.splice(i, 1);
	return i;
}
function arrRepeat(n, el) { let res = []; for (let i = 0; i < n; i++) res.push(el); return res; }
function arrReplace(arr, listweg, listdazu) {
	arrExtend(arr, listdazu);
	listweg.map(x => arrRemovip(arr, x));
	return arr;
}
function arrReplace1(arr, elweg, eldazu) {
	let i = arr.indexOf(elweg);
	arr[i] = eldazu;
	return arr;
}
function arrReverse(arr) { return jsCopy(arr).reverse(); }
function arrRotate(arr, count) {
	var unshift = Array.prototype.unshift,
		splice = Array.prototype.splice;
	var len = arr.length >>> 0, count = count >> 0;
	let arr1 = jsCopy(arr);
	unshift.apply(arr1, splice.call(arr1, count % len, len));
	return arr1;
}
function arrShufflip(arr) { if (isEmpty(arr)) return []; else return fisherYates(arr); }
function arrSplitAtIndex(arr, i) {
	return [arr.slice(0, i), arr.slice(i)];
}
function arrSplitByIndices(arr, indices) {
	let [a1, a2] = [[], jsCopy(arr)];
	for (let i = 0; i < indices.length; i++) {
		let el = arr[indices[i]];
		a1.push(el);
		removeInPlace(a2, el);
	}
	return [a1, a2];
}
function arrSum(arr, props) { if (nundef(props)) return arr.reduce((a, b) => a + b); if (!isList(props)) props = [props]; return arr.reduce((a, b) => a + (lookup(b, props) || 0), 0); }
function arrSwap(arr, i, j) { let h = arr[i]; arr[i] = arr[j]; arr[j] = h; }
function arrTake(arr, n = 0, from = 0) {
	if (isDict(arr)) {
		let keys = Object.keys(arr);
		return n > 0 ? keys.slice(from, from + n).map(x => (arr[x])) : keys.slice(from).map(x => (arr[x]));
	} else return n > 0 ? arr.slice(from, from + n) : arr.slice(from);
}
function arrTakeLast(arr, n, from = 0) {
	let res = [];
	if (isDict(arr)) {
		let keys = Object.keys(arr);
		let ilast = keys.length - 1; for (let i = ilast - from; i >= 0 && i > ilast - from - n; i--) { res.unshift(arr[keys[i]]); }
	} else {
		let ilast = arr.length - 1; for (let i = ilast - from; i >= 0 && i > ilast - from - n; i--) { res.unshift(arr[i]); }
	}
	return res;
}
function arrTakeWhile(arr, func) {
	let res = [];
	for (const a of arr) {
		if (func(a)) res.push(a); else break;
	}
	return res;
}
function arrWithout(arr, b) { return arrMinus(arr, b); }
function arrZip(arr1, arr2) {
	let res = [];
	for (let i = 0; i < Math.min(arr1, arr2); i++) {
		let o = {};
		addKeys(arr1[i], o);
		addKeys(arr2[i], o);
		res.push(o);
	}
	return res;
}
function assertion(cond) {
	if (!cond) {
		let args = [...arguments];
		for (const a of args) {
			console.log('\n', a);
		}
		throw new Error('TERMINATING!!!')
	}
}
function aSvg(dParent) {
	if (!dParent.style.position) dParent.style.position = 'relative';
	let svg1 = gSvg();
	svg1.setAttribute('width', '100%');
	svg1.setAttribute('height', '100%');
	let style = 'margin:0;padding:0;position:absolute;top:0px;left:0px;';
	svg1.setAttribute('style', style);
	dParent.appendChild(svg1);
	return svg1;
}
function aSvgg(dParent, originInCenter = true) {
	if (!dParent.style.position) dParent.style.position = 'relative';
	let svg1 = gSvg();
	svg1.setAttribute('width', '100%');
	svg1.setAttribute('height', '100%');
	let style = 'margin:0;padding:0;position:absolute;top:0px;left:0px;';
	svg1.setAttribute('style', style);
	dParent.appendChild(svg1);
	let g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	svg1.appendChild(g1);
	if (originInCenter) { g1.style.transform = "translate(50%, 50%)"; } //works!
	return g1;
}
function aTranslateBy(d, x, y, ms) { return d.animate({ transform: `translate(${x}px,${y}px)` }, ms); }// {easing:'cubic-bezier(1,-0.03,.27,1)',duration:ms}); }
function aTranslateByEase(d, x, y, ms, easing = 'cubic-bezier(1,-0.03,.27,1)') {
	return d.animate({ transform: `translate(${x}px,${y}px)` }, { easing: easing, duration: ms });
}
function aTranslateFadeBy(d, x, y, ms) { return d.animate({ opacity: .5, transform: `translate(${x}px,${y}px)` }, { easing: MyEasing, duration: ms }); }
function bottom_elem_from_to(arr1, arr2) { last_elem_from_to(arr1, arr2); }
function bottom_elem_from_to_top(arr1, arr2) { arr2.unshift(arr1.pop()); }
function calculateDaysBetweenDates(begin, end) {
	var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	var firstDate = new Date(begin);
	var secondDate = new Date(end);
	var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
	return diffDays;
}
function capitalize(s) {
	if (typeof s !== 'string') return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
}
function choose(arr, n, excepti) { return rChoose(arr, n, null, excepti); }
function chooseRandom(arr) { return rChoose(arr); }
function clear_timeouts() {
	for (const k in TO) clearTimeout(TO[k]);
	stop_simple_timer();
}
function clearElement(elem) {
	if (isString(elem)) elem = document.getElementById(elem);
	if (window.jQuery == undefined) { elem.innerHTML = ''; return elem; }
	while (elem.firstChild) {
		$(elem.firstChild).remove();
	}
	return elem;
}
function clearFleetingMessage() {
	if (isdef(dFleetingMessage)) {
		dFleetingMessage.remove();
		dFleetingMessage = null;
		clearTimeout(TOFleetingMessage);
	}
}
function coin(percent = 50) { let r = Math.random(); r *= 100; return r < percent; }
function colorDark(c, percent = 50, log = true) {
	if (nundef(c)) c = rColor(); else c = colorFrom(c);
	let zero1 = -percent / 100;
	return pSBC(zero1, c, undefined, !log);
}
function colorFrom(cAny, a, allowHsl = false) {
	if (isString(cAny)) {
		if (cAny[0] == '#') {
			if (a == undefined) return cAny;
			cAny = cAny.substring(0, 7);
			return cAny + (a == 1 ? '' : alphaToHex(a));
		} else if (isdef(ColorDi) && lookup(ColorDi, [cAny])) {
			let c = ColorDi[cAny].c;
			if (a == undefined) return c;
			c = c.substring(0, 7);
			return c + (a == 1 ? '' : alphaToHex(a));
		} else if (startsWith(cAny, 'rand')) {
			let spec = capitalize(cAny.substring(4));
			if (isdef(window['color' + spec])) {
				c = window['color' + spec]();
			} else c = rColor();
			if (a == undefined) return c;
			return c + (a == 1 ? '' : alphaToHex(a));
		} else if (startsWith(cAny, 'linear')) {
			return cAny;
		} else if (cAny[0] == 'r' && cAny[1] == 'g') {
			if (a == undefined) return cAny;
			if (cAny[3] == 'a') {
				if (a < 1) {
					return stringBeforeLast(cAny, ',') + ',' + a + ')';
				} else {
					let parts = cAny.split(',');
					let r = firstNumber(parts[0]);
					return 'rgb(' + r + ',' + parts[1] + ',' + parts[2] + ')';
				}
			} else {
				if (a < 1) {
					return 'rgba' + cAny.substring(3, cAny.length - 1) + ',' + a + ')';
				} else {
					return cAny;
				}
			}
		} else if (cAny[0] == 'h' && cAny[1] == 's') {
			if (allowHsl) {
				if (a == undefined) return cAny;
				if (cAny[3] == 'a') {
					if (a < 1) {
						return stringBeforeLast(cAny, ',') + ',' + a + ')';
					} else {
						let parts = cAny.split(',');
						let r = firstNumber(parts[0]);
						return 'hsl(' + r + ',' + parts[1] + ',' + parts[2] + ')';
					}
				} else {
					return a == 1 ? cAny : 'hsla' + cAny.substring(3, cAny.length - 1) + ',' + a + ')'; //cAny.substring(0,cAny.length-1) + ',' + a + ')';
				}
			} else {
				if (cAny[3] == 'a') {
					cAny = HSLAToRGBA(cAny);
				} else {
					cAny = HSLToRGB(cAny);
				}
				return colorFrom(cAny, a, false);
			}
		} else { //will get here only once!!!
			ensureColorDict();
			let c = ColorDi[cAny];
			if (nundef(c)) {
				if (startsWith(cAny, 'rand')) {
					let spec = cAny.substring(4);
					if (isdef(window['color' + spec])) {
						c = window['color' + spec](res);
					} else c = rColor();
				} else {
					console.log('color not available:', cAny);
					throw new Error('color not found: ' + cAny)
					return '#00000000'; //transparent!
				}
			} else c = c.c;
			if (a == undefined) return c;
			c = c.substring(0, 7);
			return c + (a == 1 ? '' : alphaToHex(a));
		}
	} else if (Array.isArray(cAny)) {
		if (cAny.length == 3 && isNumber(cAny[0])) { //assume this is a rgb
			let r = cAny[0];
			let g = cAny[1];
			let b = cAny[2];
			return a == undefined || a == 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
		} else { // interpret as list of colors to choose from!
			return rChoose(cAny);
		}
	} else if (typeof cAny == 'object') {
		if ('h' in cAny) {
			let hslString = '';
			if (a == undefined || a == 1) {
				hslString = `hsl(${cAny.h},${Math.round(cAny.s <= 1.0 ? cAny.s * 100 : cAny.s)}%,${Math.round(cAny.l <= 1.0 ? cAny.l * 100 : cAny.l)}%)`;
			} else {
				hslString = `hsla(${cAny.h},${Math.round(cAny.s <= 1.0 ? cAny.s * 100 : cAny.s)}%,${Math.round(cAny.l <= 1.0 ? cAny.l * 100 : cAny.l)}%,${a})`;
			}
			if (allowHsl) {
				return hslString;
			} else {
				return colorFrom(hslString, a, allowHsl);
			}
		} else if ('r' in cAny) {
			if (a !== undefined && a < 1) {
				return `rgba(${cAny.r},${cAny.g},${cAny.b},${a})`;
			} else {
				return `rgb(${cAny.r},${cAny.g},${cAny.b})`;
			}
		}
	}
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
		return { h: n[0], s: n[1] / 100, l: n[2] / 100, a: n.length > 3 ? n[3] : 1 };
	} else {
		return shsl;
	}
} //ok
function colorHSLBuild(hue, sat = 100, lum = 50) { let result = "hsl(" + hue + ',' + sat + '%,' + lum + '%)'; return result; }
function colorHue(cAny) { let hsl = colorHSL(cAny, true); return hsl.h; }
function colorHueWheel(contrastTo, minDiff = 25, mod = 30, start = 0) {
	let hc = colorHue(contrastTo);
	let wheel = [];
	while (start < 360) {
		let d1 = Math.abs((start + 360) - hc);
		let d2 = Math.abs((start) - hc);
		let d3 = Math.abs((start - 360) - hc);
		let min = Math.min(d1, d2, d3);
		if (min > minDiff) wheel.push(start);
		start += mod;
	}
	return wheel;
}
function colorIdealText(bg, grayPreferred = false) {
	let rgb = colorRGB(bg, true);
	const nThreshold = 105; //40; //105;
	let r = rgb.r;
	let g = rgb.g;
	let b = rgb.b;
	var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
	var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
	if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
	return foreColor;
}
function colorLight(c, percent = 20, log = true) {
	if (nundef(c)) {
		return colorFromHSL(rHue(), 100, 85);
	} else c = colorFrom(c);
	let zero1 = percent / 100;
	return pSBC(zero1, c, undefined, !log);
}
function colorPalette(color, type = 'shade') {
	color = colorFrom(color);
	return colorShades(color);
}
function colorPaletteFromImage(img) {
	if (nundef(ColorThiefObject)) ColorThiefObject = new ColorThief();
	let palette0 = ColorThiefObject.getPalette(img);
	let palette = [];
	for (const pal of palette0) {
		let color = colorFrom(pal);
		palette.push(color);
	}
	return palette;
}
function colorPaletteFromUrl(path) {
	let img = mCreateFrom(`<img src='${path}' />`);
	let pal = colorPaletteFromImage(img);
	return pal;
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
function colorsFromBFA(bg, fg, alpha) {
	if (fg == 'contrast') {
		if (bg != 'inherit') bg = colorFrom(bg, alpha);
		fg = colorIdealText(bg);
	} else if (bg == 'contrast') {
		fg = colorFrom(fg);
		bg = colorIdealText(fg);
	} else {
		if (isdef(bg) && bg != 'inherit') bg = colorFrom(bg, alpha);
		if (isdef(fg) && fg != 'inherit') fg = colorFrom(fg);
	}
	return [bg, fg];
}
function colorShades(color) {
	let res = [];
	for (let frac = -0.8; frac <= 0.8; frac += 0.2) {
		let c = pSBC(frac, color, undefined, true); //colorShade(frac,color);
		res.push(c);
	}
	return res;
}
function colorTrans(cAny, alpha = 0.5) {
	return colorFrom(cAny, alpha);
}
function colorTransPalette(color = '#000000') {
	let res = [];
	for (const alpha of [.0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1]) res.push(colorTrans(color, alpha));
	return res;
}
function colorWheel(contrastTo, n) {
	let hc = colorHue(contrastTo);
	let wheel = [];
	let start = hc;
	let inc = Math.round(360 / (n + 1));
	start += inc;
	for (let i = 0; i < n; i++) {
		wheel.push(start % 360);
		start += inc;
	}
	return wheel.map(x => colorHSLBuild(x));
}
function complexCompare(obj1, obj2) {
	const obj1Keys = Object.keys(obj1);
	const obj2Keys = Object.keys(obj2);
	if (obj1Keys.length !== obj2Keys.length) {
		return false;
	}
	for (let objKey of obj1Keys) {
		if (obj1[objKey] !== obj2[objKey]) {
			if (typeof obj1[objKey] == "object" && typeof obj2[objKey] == "object") {
				if (!isEqual(obj1[objKey], obj2[objKey])) {
					return false;
				}
			}
			else {
				return false;
			}
		}
	}
	return true;
}
function contains(s, sSub) { return s.toLowerCase().includes(sSub.toLowerCase()); }
function copyKeys(ofrom, oto, except = {}, only) {
	let keys = isdef(only) ? only : Object.keys(ofrom);
	for (const k of keys) {
		if (isdef(except[k])) continue;
		oto[k] = ofrom[k];
	}
}
function date2locale(date) { return date.toLocaleDateString(); }
function dict2list(d, keyName = 'id') {
	let res = [];
	for (const key in d) {
		let val = d[key];
		let o;
		if (isDict(val)) { o = jsCopy(val); } else { o = { value: val }; }
		o[keyName] = key;
		res.push(o);
	}
	return res;
}
function divInt(a, b) { return Math.trunc(a / b); }
function draw_from_deck_to(deck, arr) { top_elem_from_to(deck, arr); }
function draw_from_deck_to_board(deck, arr) { top_elem_from_to_top(deck, arr); }
function drawFlatHex(dParent, styles, classes, sizing) {
	if (nundef(styles)) styles = { w: 100, h: 100, bg: 'blue' };
	if (nundef(classes)) classes = ['frameOnHover'];
	if (nundef(sizing)) sizing = { hgrow: true, wgrow: true };
	let d = mDiv(dParent, styles, null, null, classes, sizing);
	mStyle(d, { 'clip-path': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' });
	return d;
}
function drawHex(dParent, styles, classes, sizing) {
	if (nundef(styles)) styles = { w: 100, h: 100, bg: 'blue' };
	if (nundef(classes)) classes = ['frameOnHover'];
	if (nundef(sizing)) sizing = { hgrow: true, wgrow: true };
	let d = mDiv(dParent, styles, null, null, classes, sizing);
	mStyle(d, { 'clip-path': 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' });
	return d;
}
function drawPlainCircle(c) {
	let item = mPic('heart', dMain, { fz: 8, bg: 'red', rounding: '50%', padding: 1 });
	mPos(iDiv(item), c.x, c.y);
	return item;
}
function drawShape(key, dParent, styles, classes, sizing) {
	if (nundef(styles)) styles = { w: 96, h: 96, bg: 'random' };
	if (nundef(sizing)) sizing = { hgrow: true, wgrow: true };
	let d = mDiv(dParent, styles, null, null, classes, sizing);
	if (key == 'circle' || key == 'ellipse') mStyle(d, { rounding: '50%' });
	else mStyle(d, { 'clip-path': PolyClips[key] });
	return d;
}
function drawSym(sym, c) {
	let item = mPic(sym, dMain, { fz: 25, bg: 'skyblue', rounding: '50%', padding: 4 });
	mPos(iDiv(item), c.x, c.y);
	return item;
}
function drawText(text, c) {
	let item = mText(text, dMain, { fz: 16, bg: 'skyblue', rounding: '50%', padding: 4 });
	mPos(iDiv(item), c.x, c.y);
	return item;
}
function drawTriangle(dParent, styles, classes, sizing) {
	if (nundef(styles)) styles = { w: 100, h: 100, bg: 'blue' };
	if (nundef(classes)) classes = ['frameOnHover'];
	if (nundef(sizing)) sizing = { hgrow: true, wgrow: true };
	let d = mDiv(dParent, styles, null, null, classes, sizing);
	mStyle(d, { 'clip-path': 'polygon(50% 0%, 100% 100%, 0% 100%)' });
	return d;
}
function elem_from_to(el, arr1, arr2) { removeInPlace(arr1, el); arr2.push(el); }
function elem_from_to_top(el, arr1, arr2) { removeInPlace(arr1, el); arr2.unshift(el); }
function endsWith(s, sSub) { let i = s.indexOf(sSub); return i >= 0 && i == s.length - sSub.length; }
function ensureColorDict() {
	if (isdef(ColorDi)) return;
	ColorDi = {};
	let names = getColorNames();
	let hexes = getColorHexes();
	for (let i = 0; i < names.length; i++) {
		ColorDi[names[i].toLowerCase()] = { c: '#' + hexes[i] };
	}
	const newcolors = {
		black: { c: '#000000', D: 'schwarz' },
		blue: { c: '#0000ff', D: 'blau' },
		BLUE: { c: '#4363d8', E: 'blue', D: 'blau' },
		BLUEGREEN: { c: '#004054', E: 'bluegreen', D: 'blaugrün' },
		BROWN: { c: '#96613d', E: 'brown', D: 'braun' },
		deepyellow: { c: '#ffed01', E: 'yellow', D: 'gelb' },
		FIREBRICK: { c: '#800000', E: 'darkred', D: 'rotbraun' },
		gold: { c: 'gold', D: 'golden' },
		green: { c: 'green', D: 'grün' },
		GREEN: { c: '#3cb44b', E: 'green', D: 'grün' },
		grey: { c: 'grey', D: 'grau' },
		lightblue: { c: 'lightblue', D: 'hellblau' }, //{ c: '#42d4f4', D: 'hellblau' },
		LIGHTBLUE: { c: '#42d4f4', E: 'lightblue', D: 'hellblau' },
		lightgreen: { c: 'lightgreen', D: 'hellgrün' },
		LIGHTGREEN: { c: '#afff45', E: 'lightgreen', D: 'hellgrün' },
		lightyellow: { c: '#fff620', E: 'lightyellow', D: 'gelb' },
		NEONORANGE: { c: '#ff6700', E: 'neonorange', D: 'neonorange' },
		NEONYELLOW: { c: '#efff04', E: 'neonyellow', D: 'neongelb' },
		olive: { c: 'olive', D: 'oliv' },
		OLIVE: { c: '#808000', E: 'olive', D: 'oliv' },
		orange: { c: 'orange', D: 'orange' },
		ORANGE: { c: '#f58231', E: 'orange', D: 'orange' },
		PINK: { c: 'deeppink', D: 'rosa' },
		pink: { c: 'pink', D: 'rosa' },
		purple: { c: 'purple', D: 'lila' },
		PURPLE: { c: '#911eb4', E: 'purple', D: 'lila' },
		red: { c: 'red', D: 'rot' },
		RED: { c: '#e6194B', E: 'red', D: 'rot' },
		skyblue: { c: 'skyblue', D: 'himmelblau' },
		SKYBLUE: { c: 'deepskyblue', D: 'himmelblau' },
		teal: { c: '#469990', D: 'blaugrün' },
		TEAL: { c: '#469990', E: 'teal', D: 'blaugrün' },
		transparent: { c: '#00000000', E: 'transparent', D: 'transparent' },
		violet: { c: 'violet', E: 'violet', D: 'violett' },
		VIOLET: { c: 'indigo', E: 'violet', D: 'violett' },
		white: { c: 'white', D: 'weiss' },
		yellow: { c: 'yellow', D: 'gelb' },
		yelloworange: { c: '#ffc300', E: 'yellow', D: 'gelb' },
		YELLOW: { c: '#ffe119', E: 'yellow', D: 'gelb' },
	};
	for (const k in newcolors) {
		let cnew = newcolors[k];
		if (cnew.c[0] != '#' && isdef(ColorDi[cnew.c])) cnew.c = ColorDi[cnew.c].c;
		ColorDi[k] = cnew;
	}
}
function errlog() { console.log('ERROR!', ...arguments); }
function evNoBubble(ev) { ev.preventDefault(); ev.cancelBubble = true; }
function evToClass(ev, className) {
	let elem = findParentWithClass(className);
	return elem;
}
function evToClosestId(ev) {
	let elem = findParentWithId(ev.target);
	return elem.id;
}
function evToId(ev) {
	let elem = findParentWithId(ev.target);
	return elem.id;
}
function evToProp(ev, prop) {
	let x = ev.target;
	while (isdef(x) && nundef(x.getAttribute(prop))) x = x.parentNode;
	return isdef(x) ? x.getAttribute(prop) : null;
}
function evToTargetAttribute(ev, attr) {
	let val = ev.target.getAttribute(attr);
	if (nundef(val)) { val = ev.target.parentNode.getAttribute(attr); }
	return val;
}
function exchange_by_index(arr1, i1, arr2, i2) {
	let temp = arr1[i1];
	arr1[i1] = arr2[i2];
	arr2[i2] = temp;
}
function find_minimum(array) {
	let min = array[0];
	for (let i = 1; i < array.length; i++) {
		if (array[i] < min) min = array[i];
	}
	return min;
}
function find_minimum_by_function(array, func) {
	let min = func(array[0]);
	for (let i = 1; i < array.length; i++) {
		if (func(array[i]) < func(min)) min = array[i];
	}
	return min;
}
function findAncestorElemOfType(el, type) {
	while (el) {
		let t = getTypeOf(el);
		if (t == type) break;
		el = el.parentNode;
	}
	return el;
}
function findAncestorElemWithParentOfType(el, type) {
	while (el && el.parentNode) {
		let t = getTypeOf(el);
		let tParent = getTypeOf(el.parentNode);
		if (tParent == type) break;
		el = el.parentNode;
	}
	return el;
}
function findAttributeInAncestors(elem, attr) {
	let val;
	while (elem && nundef(val = elem.getAttribute(attr))) { elem = elem.parentNode; }
	return val;
}
function findChildOfType(type, parentElem) {
	let children = arrChildren(parentElem);
	for (const ch of children) {
		if (getTypeOf(ch) == type) return ch;
	}
	return null;
}
function findChildrenOfType(type, parentElem) {
	let children = arrChildren(parentElem);
	let res = [];
	for (const ch of children) {
		if (getTypeOf(ch) == type) res.push(ch);
	}
	return res;
}
function findChildWithClass(className, parentElem) {
	testHelpers(parentElem);
	let children = arrChildren(parentElem);
	for (const ch of children) {
		if (ch.classList.includes(className)) return ch;
	}
	return null;
}
function findChildWithId(id, parentElem) {
	testHelpers(parentElem);
	let children = arrChildren(parentElem);
	for (const ch of children) {
		if (ch.id == id) return ch;
	}
	return null;
}
function findDescendantOfType(type, parent) {
	if (getTypeOf(parent) == type) return parent;
	let children = arrChildren(parent);
	if (isEmpty(children)) return null;
	for (const ch of children) {
		let res = findDescendantOfType(type, ch);
		if (res) return res;
	}
	return null;
}
function findDescendantWithId(id, parent) {
	if (parent.id == id) return parent;
	let children = arrChildren(parent);
	if (isEmpty(children)) return null;
	for (const ch of children) {
		let res = findDescendantWithId(id, ch);
		if (res) return res;
	}
	return null;
}
function findKeys(s) { return SymKeys.filter(x => contains(x, s) || contains(Syms[x].E) || contains(Syms[x].D), s); }
function findParentWithClass(elem, className) { while (elem && !mHasClass(elem, className)) { elem = elem.parentNode; } return elem; }
function findParentWithId(elem) { while (elem && !(elem.id)) { elem = elem.parentNode; } return elem; }
function fireClick(node) {
	if (document.createEvent) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, false);
		node.dispatchEvent(evt);
	} else if (document.createEventObject) {
		node.fireEvent('onclick');
	} else if (typeof node.onclick == 'function') {
		node.onclick();
	}
}
function fireKey(k, { control, alt, shift } = {}) {
	console.log('fireKey called!' + document.createEvent)
	if (document.createEvent) {
		console.log('fireKey: createEvent and node.dispatchEvent exist!!!', k, control, alt, shift);
		window.dispatchEvent(new KeyboardEvent('keypress', { key: '+', ctrlKey: true }));
	} else if (document.createEventObject) {
		console.log('fireClick: createEventObject and node.fireEvent exist!!!', node)
		node.fireEvent('onclick');
	} else if (typeof node.onclick == 'function') {
		console.log('fireClick: node.onclick exists!!!', node)
		node.onclick();
	}
}
function fireWheel(node) {
	if (document.createEvent) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('wheel', true, false);
		console.log('fireClick: createEvent and node.dispatchEvent exist!!!', node)
		node.dispatchEvent(evt);
	} else if (document.createEventObject) {
		console.log('fireClick: createEventObject and node.fireEvent exist!!!', node)
		node.fireEvent('onclick');
	} else if (typeof node.onclick == 'function') {
		console.log('fireClick: node.onclick exists!!!', node)
		node.onclick();
	}
}
function firstCond(arr, func) {
	if (nundef(arr)) return null;
	for (const a of arr) {
		if (func(a)) return a;
	}
	return null;
}
function firstCondDict(dict, func) {
	for (const k in dict) { if (func(dict[k])) return k; }
	return null;
}
function firstCondDictKey() { return firstCondDictKeys(...arguments); }
function firstCondDictKeys(dict, func) {
	for (const k in dict) { if (func(k)) return k; }
	return null;
}
function firstNCond(n, arr, func) {
	if (nundef(arr)) return [];
	let result = [];
	let cnt = 0;
	for (const a of arr) {
		cnt += 1; if (cnt > n) break;
		if (func(a)) result.push(a);
	}
	return result;
}
function firstNumber(s) {
	if (s) {
		let m = s.match(/-?\d+/);
		if (m) {
			let sh = m.shift();
			if (sh) { return Number(sh); }
		}
	}
	return null;
}
function fisherYates(arr) {
	if (arr.length == 2 && coin()) { return arr; } //let temp=arr[0];arr[0]=arr[1];arr[1]=temp;return arr;} //return coin()?[arr[0],arr[1]]:[arr[1],arr[0]];
	var rnd, temp;
	let last = arr[0];
	for (var i = arr.length - 1; i; i--) {
		rnd = Math.random() * i | 0;
		temp = arr[i];
		arr[i] = arr[rnd];
		arr[rnd] = temp;
	}
	return arr;
}
function fleetingMessage(msg, d, styles, ms, fade) {
	if (isString(msg)) {
		dFleetingMessage.innerHTML = msg;
		mStyle(dFleetingMessage, styles);
	} else {
		mAppend(dFleetingMessage, msg);
	}
	if (fade) Animation1 = mAnimate(dFleetingMessage, 'opacity', [1, .4, 0], null, ms, 'ease-in', 0, 'both');
	return dFleetingMessage;
}
function forAll(arr, func) { for (const a of arr) if (!func(a)) return false; return true; }
function format_currency(num) {
	return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function format_date(date) {
	let d = new Date(date);
	let month = '' + (d.getMonth() + 1);
	let day = '' + d.getDate();
	let year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [month, day, year].join('/');
}
function gBg(g, color) { g.setAttribute('fill', color); }
function gCanvas(area, w, h, color, originInCenter = true) {
	let dParent = mBy(area);
	let div = stage3_prepContainer(dParent);
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	let svg = gSvg();
	let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;`
	svg.setAttribute('style', style);
	mColor(svg, color);
	div.appendChild(svg);
	let g = gG();
	if (originInCenter) g.style.transform = "translate(50%, 50%)";
	svg.appendChild(g);
	return g;
}
function gCreate(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }
function gEllipse(w, h) { let r = gCreate('ellipse'); r.setAttribute('rx', w / 2); r.setAttribute('ry', h / 2); return r; }
function genCats(n) {
	let di = {};
	let cats = Object.keys(Categories);
	for (let i = 0; i < n; i++) {
		let cat = chooseRandom(cats);
		let incompat = DA.incompatibleCats[cat];
		cats = arrMinus(cats, incompat);
		removeInPlace(cats, cat);
		di[cat] = Categories[cat];
	}
	return di;
}
function get_checked_radios(rg) {
	let inputs = rg.getElementsByTagName('INPUT');
	let list = [];
	for (const ch of inputs) {
		let checked = ch.getAttribute('checked');
		if (ch.checked) list.push(ch.value);
	}
	return list;
}
function get_keys(o) { return Object.keys(o); }
function get_mouse_pos(ev) {
	let x = ev.pageX - document.body.scrollLeft; // - ev.target.offsetY;
	let y = ev.pageY - document.body.scrollTop; // - ev.target.offsetY;
	return ({ x: x, y: y });
}
function get_now() { return new Date(); }
function get_timestamp() { return Date.now(); }
function get_values(o) { return Object.values(o); }
function get_weekday(date) {
	let d = new Date(date);
	return d.getDay();
}
function getAnimals() {
	let gr = 'Animals & Nature';
	let result = [];
	for (const sg in ByGroupSubgroup[gr]) {
		if (startsWith(sg, 'anim')) result = result.concat(ByGroupSubgroup[gr][sg]);
	}
	return result;
}
function getColorHexes(x) {
	return [
		'f0f8ff',
		'faebd7',
		'00ffff',
		'7fffd4',
		'f0ffff',
		'f5f5dc',
		'ffe4c4',
		'000000',
		'ffebcd',
		'0000ff',
		'8a2be2',
		'a52a2a',
		'deb887',
		'5f9ea0',
		'7fff00',
		'd2691e',
		'ff7f50',
		'6495ed',
		'fff8dc',
		'dc143c',
		'00ffff',
		'00008b',
		'008b8b',
		'b8860b',
		'a9a9a9',
		'a9a9a9',
		'006400',
		'bdb76b',
		'8b008b',
		'556b2f',
		'ff8c00',
		'9932cc',
		'8b0000',
		'e9967a',
		'8fbc8f',
		'483d8b',
		'2f4f4f',
		'2f4f4f',
		'00ced1',
		'9400d3',
		'ff1493',
		'00bfff',
		'696969',
		'696969',
		'1e90ff',
		'b22222',
		'fffaf0',
		'228b22',
		'ff00ff',
		'dcdcdc',
		'f8f8ff',
		'ffd700',
		'daa520',
		'808080',
		'808080',
		'008000',
		'adff2f',
		'f0fff0',
		'ff69b4',
		'cd5c5c',
		'4b0082',
		'fffff0',
		'f0e68c',
		'e6e6fa',
		'fff0f5',
		'7cfc00',
		'fffacd',
		'add8e6',
		'f08080',
		'e0ffff',
		'fafad2',
		'd3d3d3',
		'd3d3d3',
		'90ee90',
		'ffb6c1',
		'ffa07a',
		'20b2aa',
		'87cefa',
		'778899',
		'778899',
		'b0c4de',
		'ffffe0',
		'00ff00',
		'32cd32',
		'faf0e6',
		'ff00ff',
		'800000',
		'66cdaa',
		'0000cd',
		'ba55d3',
		'9370db',
		'3cb371',
		'7b68ee',
		'00fa9a',
		'48d1cc',
		'c71585',
		'191970',
		'f5fffa',
		'ffe4e1',
		'ffe4b5',
		'ffdead',
		'000080',
		'fdf5e6',
		'808000',
		'6b8e23',
		'ffa500',
		'ff4500',
		'da70d6',
		'eee8aa',
		'98fb98',
		'afeeee',
		'db7093',
		'ffefd5',
		'ffdab9',
		'cd853f',
		'ffc0cb',
		'dda0dd',
		'b0e0e6',
		'800080',
		'663399',
		'ff0000',
		'bc8f8f',
		'4169e1',
		'8b4513',
		'fa8072',
		'f4a460',
		'2e8b57',
		'fff5ee',
		'a0522d',
		'c0c0c0',
		'87ceeb',
		'6a5acd',
		'708090',
		'708090',
		'fffafa',
		'00ff7f',
		'4682b4',
		'd2b48c',
		'008080',
		'd8bfd8',
		'ff6347',
		'40e0d0',
		'ee82ee',
		'f5deb3',
		'ffffff',
		'f5f5f5',
		'ffff00',
		'9acd32'
	];
}
function getColorNames() {
	return [
		'AliceBlue',
		'AntiqueWhite',
		'Aqua',
		'Aquamarine',
		'Azure',
		'Beige',
		'Bisque',
		'Black',
		'BlanchedAlmond',
		'Blue',
		'BlueViolet',
		'Brown',
		'BurlyWood',
		'CadetBlue',
		'Chartreuse',
		'Chocolate',
		'Coral',
		'CornflowerBlue',
		'Cornsilk',
		'Crimson',
		'Cyan',
		'DarkBlue',
		'DarkCyan',
		'DarkGoldenRod',
		'DarkGray',
		'DarkGrey',
		'DarkGreen',
		'DarkKhaki',
		'DarkMagenta',
		'DarkOliveGreen',
		'DarkOrange',
		'DarkOrchid',
		'DarkRed',
		'DarkSalmon',
		'DarkSeaGreen',
		'DarkSlateBlue',
		'DarkSlateGray',
		'DarkSlateGrey',
		'DarkTurquoise',
		'DarkViolet',
		'DeepPink',
		'DeepSkyBlue',
		'DimGray',
		'DimGrey',
		'DodgerBlue',
		'FireBrick',
		'FloralWhite',
		'ForestGreen',
		'Fuchsia',
		'Gainsboro',
		'GhostWhite',
		'Gold',
		'GoldenRod',
		'Gray',
		'Grey',
		'Green',
		'GreenYellow',
		'HoneyDew',
		'HotPink',
		'IndianRed',
		'Indigo',
		'Ivory',
		'Khaki',
		'Lavender',
		'LavenderBlush',
		'LawnGreen',
		'LemonChiffon',
		'LightBlue',
		'LightCoral',
		'LightCyan',
		'LightGoldenRodYellow',
		'LightGray',
		'LightGrey',
		'LightGreen',
		'LightPink',
		'LightSalmon',
		'LightSeaGreen',
		'LightSkyBlue',
		'LightSlateGray',
		'LightSlateGrey',
		'LightSteelBlue',
		'LightYellow',
		'Lime',
		'LimeGreen',
		'Linen',
		'Magenta',
		'Maroon',
		'MediumAquaMarine',
		'MediumBlue',
		'MediumOrchid',
		'MediumPurple',
		'MediumSeaGreen',
		'MediumSlateBlue',
		'MediumSpringGreen',
		'MediumTurquoise',
		'MediumVioletRed',
		'MidnightBlue',
		'MintCream',
		'MistyRose',
		'Moccasin',
		'NavajoWhite',
		'Navy',
		'OldLace',
		'Olive',
		'OliveDrab',
		'Orange',
		'OrangeRed',
		'Orchid',
		'PaleGoldenRod',
		'PaleGreen',
		'PaleTurquoise',
		'PaleVioletRed',
		'PapayaWhip',
		'PeachPuff',
		'Peru',
		'Pink',
		'Plum',
		'PowderBlue',
		'Purple',
		'RebeccaPurple',
		'Red',
		'RosyBrown',
		'RoyalBlue',
		'SaddleBrown',
		'Salmon',
		'SandyBrown',
		'SeaGreen',
		'SeaShell',
		'Sienna',
		'Silver',
		'SkyBlue',
		'SlateBlue',
		'SlateGray',
		'SlateGrey',
		'Snow',
		'SpringGreen',
		'SteelBlue',
		'Tan',
		'Teal',
		'Thistle',
		'Tomato',
		'Turquoise',
		'Violet',
		'Wheat',
		'White',
		'WhiteSmoke',
		'Yellow',
		'YellowGreen'
	];
}
function getFunctionCallerName() {
	return new Error().stack.match(/at (\S+)/g)[1].slice(3);
}
function getFunctionsNameThatCalledThisFunction() {
	let c1 = getFunctionsNameThatCalledThisFunction.caller;
	if (nundef(c1)) return 'no caller!';
	let c2 = c1.caller;
	if (nundef(c2)) return 'no caller!';
	return c2.name;
}
function getGSGElements(gCond, sCond) {
	let keys = [];
	let byg = ByGroupSubgroup;
	for (const gKey in byg) {
		if (!gCond(gKey)) continue;
		for (const sKey in byg[gKey]) {
			if (!sCond(sKey)) continue;
			keys = keys.concat(byg[gKey][sKey]);
		}
	}
	return keys.sort();
}
function getKeySets() {
	makeCategories();	//console.log('Categories',Categories)
	let res = {};
	for (const k in Syms) {
		let info = Syms[k];
		if (nundef(info.cats)) continue;
		for (const ksk of info.cats) {
			lookupAddIfToList(res, [ksk], k);
		}
	}
	res.animals = getAnimals();
	res.nature = getNature();
	localStorage.setItem('KeySets', JSON.stringify(res));
	return res;
}
function getNature() {
	let gr = 'Animals & Nature';
	let result = [];
	for (const sg in ByGroupSubgroup[gr]) {
		result = result.concat(ByGroupSubgroup[gr][sg]);
	}
	return result;
}
function getRect(elem, relto) {
	if (isString(elem)) elem = document.getElementById(elem);
	let res = elem.getBoundingClientRect();
	if (isdef(relto)) {
		let b2 = relto.getBoundingClientRect();
		let b1 = res;
		res = {
			x: b1.x - b2.x,
			y: b1.y - b2.y,
			left: b1.left - b2.left,
			top: b1.top - b2.top,
			right: b1.right - b2.right,
			bottom: b1.bottom - b2.bottom,
			width: b1.width,
			height: b1.height
		};
	}
	let r = { x: res.left, y: res.top, w: res.width, h: res.height };
	addKeys({ l: r.x, t: r.y, r: r.x + r.w, b: r.t + r.h }, r);
	return r;
}
function getSizeNeeded(elem) {
	var d = elem.cloneNode(true); //document.createElement("div");
	d.style.width = 'auto';
	document.body.appendChild(d);
	let cStyles = {};
	cStyles.position = 'fixed';
	cStyles.opacity = 0;
	cStyles.top = '-9999px';
	mStyle(d, cStyles);
	height = d.clientHeight;
	width = d.clientWidth;
	d.parentNode.removeChild(d);
	return { w: Math.round(width), h: Math.round(height) };
}
function getStyleProp(elem, prop) { return getComputedStyle(elem).getPropertyValue(prop); }
function getTextSize(s = 'hallo', parentDivOrId) {
	var newDiv = document.createElement("div");
	newDiv.innerHTML = s;
	newDiv.style.cssText = "position:fixed; top:-9999px; opacity:0;"
	if (isdef(parentDivOrId)) {
		if (isString(parentDivOrId)) parentDivOrId = document.getElementById(parentDivOrId);
		parentDivOrId.appendChild(newDiv);
	} else {
		document.body.appendChild(newDiv);
	}
	height = newDiv.clientHeight;
	width = newDiv.clientWidth;
	newDiv.parentNode.removeChild(newDiv)
	return { w: width, h: height };
}
function getTextSizeX(text, fz, family, weight = 900, parentDivOrId = null, styles = {}) {
	var d = document.createElement("div");
	styles.fz = fz;
	styles.family = family;
	styles['font-weight'] = weight;
	styles.position = 'fixed';
	styles.opacity = 0;
	styles.top = '-9999px';
	styles.w = 200;
	mStyleX(d, styles);
	d.innerHTML = text;
	if (isdef(parentDivOrId)) {
		if (isString(parentDivOrId)) parentDivOrId = document.getElementById(parentDivOrId);
		parentDivOrId.appendChild(d);
	} else {
		document.body.appendChild(d);
	}
	height = d.clientHeight;
	width = d.clientWidth;
	d.parentNode.removeChild(d)
	return { w: width, h: height };
}
function getTextSizeX1(text, fz, family, weight = 900, parentDivOrId = null, styles = {}) {
	var d = document.createElement("div");
	styles.fz = fz;
	styles.family = family;
	styles['font-weight'] = weight;
	styles.position = 'fixed';
	styles.opacity = 0;
	styles.top = '-9999px';
	mStyleX(d, styles);
	d.innerHTML = text;
	if (isdef(parentDivOrId)) {
		if (isString(parentDivOrId)) parentDivOrId = document.getElementById(parentDivOrId);
		parentDivOrId.appendChild(d);
	} else {
		document.body.appendChild(d);
	}
	height = d.clientHeight;
	width = d.clientWidth;
	return { w: width, h: height, d: d };
}
function getTextWidth(text, font) {
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
	var context = canvas.getContext('2d');
	context.font = font;
	var metrics = context.measureText(text);
	return metrics.width;
}
function getTypeOf(param) {
	let type = typeof param;
	if (type == 'string') {
		return 'string';
	}
	if (type == 'object') {
		type = param.constructor.name;
		if (startsWith(type, 'SVG')) type = stringBefore(stringAfter(type, 'SVG'), 'Element').toLowerCase();
		else if (startsWith(type, 'HTML')) type = stringBefore(stringAfter(type, 'HTML'), 'Element').toLowerCase();
	}
	let lType = type.toLowerCase();
	if (lType.includes('event')) type = 'event';
	return type;
}
function getUID(pref = '') {
	UIDCounter += 1;
	return pref + '_' + UIDCounter;
}
function gFg(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gG() { return gCreate('g'); }// document.createElementNS('http://www.w3.org/2000/svg', 'g'); }
function gHex(w, h) { let pts = size2hex(w, h); return gPoly(pts); }
function gLine(x1, y1, x2, y2) { let r = gCreate('line'); r.setAttribute('x1', x1); r.setAttribute('y1', y1); r.setAttribute('x2', x2); r.setAttribute('y2', y2); return r; }
function gPoly(pts) { let r = gCreate('polygon'); if (pts) r.setAttribute('points', pts); return r; }
function gPos(g, x, y) { g.style.transform = `translate(${x}px, ${y}px)`; }
function gRect(w, h) { let r = gCreate('rect'); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('x', -w / 2); r.setAttribute('y', -h / 2); return r; }
function gRounding(r, rounding) {
	r.setAttribute('rx', rounding); // rounding kann ruhig in % sein!
	r.setAttribute('ry', rounding);
}
function gShape(shape, w = 20, h = 20, color = 'green', rounding) {
	let el = gG();
	if (nundef(shape)) shape = 'rect';
	if (shape != 'line') agColoredShape(el, shape, w, h, color);
	else gStroke(el, color, w); //agColoredLine(el, w, color);
	if (isdef(rounding) && shape == 'rect') {
		let r = el.children[0];
		gRounding(r, rounding);
	}
	return el;
}
function gSize(g, w, h, shape = null, iChild = 0) {
	let el = (getTypeOf(g) != 'g') ? g : g.children[iChild];
	let t = getTypeOf(el);
	switch (t) {
		case 'rect': el.setAttribute('width', w); el.setAttribute('height', h); el.setAttribute('x', -w / 2); el.setAttribute('y', -h / 2); break;
		case 'ellipse': el.setAttribute('rx', w / 2); el.setAttribute('ry', h / 2); break;
		default:
			if (shape) {
				switch (shape) {
					case 'hex': let pts = size2hex(w, h); el.setAttribute('points', pts); break;
				}
			}
	}
	return el;
}
function gSizeToContent(svg) {
	var bbox = svg.getBBox();
	svg.setAttribute("width", bbox.x + bbox.width + bbox.x);
	svg.setAttribute("height", bbox.y + bbox.height + bbox.y);
}
function gStroke(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gSvg() { return gCreate('svg'); } //document.createElementNS('http://www.w3.org/2000/svg', 'svg'); }
function hasWhiteSpace(s) { return /\s/g.test(s); }
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
} //ok
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
} //ok
function hide(elem) {
	if (isString(elem)) elem = document.getElementById(elem);
	if (nundef(elem)) return;
	if (isSvg(elem)) {
		elem.setAttribute('style', 'visibility:hidden;display:none');
	} else {
		elem.style.display = 'none';
	}
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
} //ok
function hslToHex(h, s, l) {
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = n => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
	};
	return `#${f(0)}${f(8)}${f(4)}`;
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
} //ok
function iAdd(item, props) {
	let id, l;
	if (isString(item)) { id = item; item = Items[id]; }
	else if (nundef(item.id)) { id = item.id = iRegister(item); }
	else { id = item.id; if (nundef(Items[id])) Items[id] = item; }
	if (nundef(item.live)) item.live = {};
	l = item.live;
	for (const k in props) {
		let val = props[k];
		if (nundef(val)) {
			continue;
		}
		l[k] = val;
		if (k == 'div') val.id = id;
		if (isdef(val.id) && val.id != id) {
			lookupAddIfToList(val, ['memberOf'], id);
		}
	}
}
function iDiv(i) { return isdef(i.live) ? i.live.div : isdef(i.div) ? i.div : i; }
function if_plural(n) { return n == 1 ? '' : 's'; }
function if_stringified(obj) { return is_stringified(obj) ? JSON.parse(obj) : obj; }
function if_stringified_or_dict(obj) { return nundef(obj) ? {} : is_stringified(obj) ? JSON.parse(obj) : obj; }
function if_stringified_or_list(obj) { return nundef(obj) ? [] : is_stringified(obj) ? JSON.parse(obj) : obj; }
function if_stringified_or_string(obj) { return nundef(obj) ? '' : is_stringified(obj) ? JSON.parse(obj) : obj; }
function iG(i) { return isdef(i.live) ? i.live.g : isdef(i.g) ? i.g : i; }
function iMeasure(item, sizingOptions) {
	if (nundef(iDiv(item))) return;
	setRect(iDiv(item), valf(sizingOptions, { hgrow: true, wgrow: true }));
}
function incInput(inp, n = 1) {
	let val = Number(inp.innerHTML);
	val += n;
	inp.innerHTML = val;
}
function intersection(arr1, arr2) {
	let res = [];
	for (const a of arr1) {
		if (arr2.includes(a)) {
			addIf(res, a);
		}
	}
	return res;
}
function iRegister(item, id) { let uid = isdef(id) ? id : getUID(); Items[uid] = item; return uid; }
function is_stringified(obj) {
	if (isString(obj)) {
		return '"\'{[('.includes(obj[0]);
	}
	return false;
}
function isAlphaNum(s) { query = /^[a-zA-Z0-9]+$/; return query.test(s); }
function isdef(x) { return x !== null && x !== undefined; }
function isDict(d) { let res = (d !== null) && (typeof (d) == 'object') && !isList(d); return res; }
function isDictOrList(d) { return typeof (d) == 'object'; }
function isDigit(s) { return /^[0-9]$/i.test(s); }
function isDOM(x) { let c = lookup(x, ['constructor', 'name']); return c ? startsWith(c, 'HTML') || startsWith(c, 'SVG') : false; }
function isEmpty(arr) {
	return arr === undefined || !arr
		|| (isString(arr) && (arr == 'undefined' || arr == ''))
		|| (Array.isArray(arr) && arr.length == 0)
		|| Object.entries(arr).length === 0;
}
function isEmptyOrWhiteSpace(s) { return isEmpty(s.trim()); }
function isLetter(s) { return /^[a-zA-Z]$/i.test(s); }
function isList(arr) { return Array.isArray(arr); }
function isListOf(arr, predfunc) { return Array.isArray(arr) && !firstCond(arr, x => !predfunc(x)); }
function isLiteral(x) { return isString(x) || isNumber(x); }
function isNumber(x) { return x !== ' ' && x !== true && x !== false && isdef(x) && (x == 0 || !isNaN(+x)); }
function isOverflown(element) {
	return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
function isString(param) { return typeof param == 'string'; }
function isSvg(elem) { return startsWith(elem.constructor.name, 'SVG'); }
function iSvg(i) { return isdef(i.live) ? i.live.svg : isdef(i.svg) ? i.svg : i; }
function isVisible(elem) { // Where el is the DOM element you'd like to test for visibility
	if (isString(elem)) elem = document.getElementById(elem);
	let x = elem.style.flex;
	return (elem.style.display != 'none' || elem.offsetParent !== null) && (nundef(elem.style.flex) || !endsWith(elem.style.flex, '0%'));
}
function isWhiteSpace(ch) { return /\s/.test(ch) }
function isWhiteSpace2(ch) {
	const alphanum = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
	return !alphanum.includes(ch);
}
function isWhiteSpaceString(s) { return isEmptyOrWhiteSpace(s); }
function jsClean(o) {
	if (nundef(o)) return o;
	else if (isDOM(o)) return null;
	else if (isLiteral(o)) return o;
	else if (isList(o)) {
		let onew = o.map(x => jsClean(x));
		return onew.filter(x => x !== null);
	} else if (isDict(o)) {
		for (const k in o) o[k] = jsClean(o[k]);
		let onew = {};
		for (const k in o) if (o[k] !== null) onew[k] = o[k];
		return onew;
	}
}
function jsCopy(o) { return JSON.parse(JSON.stringify(o)); }
function jsCopySafe(o) { return JSON.parse(JSON.stringify(jsClean(o))); }
function jsonToYaml(o) { let y = jsyaml.dump(o); return y; }
function last_elem_from_to(arr1, arr2) { arr2.push(arr1.pop()); }
function lastCond(arr, func) {
	if (nundef(arr)) return null;
	for (let i = arr.length - 1; i >= 0; i--) { let a = arr[i]; if (func(a)) return a; }
	return null;
}
function lastDescendantOfType(type, parent) {
	if (getTypeOf(parent) == type) return parent;
	let children = arrChildren(parent);
	if (isEmpty(children)) return null;
	for (const ch of children.reverse()) {
		let res = lastDescendantOfType(type, ch);
		if (res) return res;
	}
	return null;
}
function list2dict(arr, keyprop = 'id', uniqueKeys = true) {
	let di = {};
	for (const a of arr) {
		if (uniqueKeys) lookupSet(di, [a[keyprop]], a);
		else lookupAddToList(di, [a[keyprop]], a);
	}
	return di;
}
function load_assets_direct(obj) {
	Config = jsyaml.load(obj.config);
	Syms = jsyaml.load(obj.syms);
	SymKeys = Object.keys(Syms);
	ByGroupSubgroup = jsyaml.load(obj.symGSG);
	Info = jsyaml.load(obj.info);
	KeySets = getKeySets();
	console.assert(isdef(Config), 'NO Config!!!!!!!!!!!!!!!!!!!!!!!!');
}
async function load_assets_fetch(basepath, baseminpath) {
	let path = basepath + 'assets/';
	Config = await route_path_yaml_dict(baseminpath + 'config.yaml');
	DB = await route_path_yaml_dict(basepath + 'DB.yaml');
	Syms = await route_path_yaml_dict(path + 'allSyms.yaml');
	SymKeys = Object.keys(Syms);
	ByGroupSubgroup = await route_path_yaml_dict(path + 'symGSG.yaml');
	C52 = await route_path_yaml_dict(path + 'c52.yaml');
	Cinno = await route_path_yaml_dict(path + 'fe/inno.yaml');
	Info = await route_path_yaml_dict(path + 'lists/info.yaml');
	create_card_assets_c52();
	KeySets = getKeySets();
	console.assert(isdef(Config), 'NO Config!!!!!!!!!!!!!!!!!!!!!!!!');
	return { users: dict2list(DB.users, 'name'), games: dict2list(Config.games, 'name'), tables: [] };
}
async function load_syms(path) {
	if (nundef(path)) path = './base/assets/';
	Syms = await route_path_yaml_dict(path + 'allSyms.yaml');
	SymKeys = Object.keys(Syms);
	ByGroupSubgroup = await route_path_yaml_dict(path + 'symGSG.yaml');
	KeySets = getKeySets();
}
function loader_off() { let d = mBy('loader_holder'); if (isdef(d)) d.className = 'loader_off'; }
function loader_on() { let d = mBy('loader_holder'); if (isdef(d)) d.className = 'loader_on'; }
function log_array(arr) {
	arr.map(x => console.log(x));
}
function log_object(o = {}, msg = '', props = [], indent = 0) {
	console.log(indent ? '.'.repeat(indent) : '____', msg, indent ? '' : `(caller:${getFunctionsNameThatCalledThisFunction()})`);
	let keys = get_keys(o); keys.sort();
	for (const k of keys) {
		if (isEmpty(props) || props.includes(k)) {
			if (isDict(o[k])) { log_object(o[k], k, get_keys(o[k]).join(' '), indent + 1); console.log(); }
			else if (isListOf(o[k], isLiteral)) console.log(' '.repeat(indent), k + ':', o[k].join(','));
			else console.log(' '.repeat(indent), k + ':', o[k]);
		}
	}
}
function lookup(dict, keys) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (k === undefined) break;
		let e = d[k];
		if (e === undefined || e === null) return null; // {console.log('null',k,typeof k);return null;}
		d = d[k];
		if (i == ilast) return d;
		i += 1;
	}
	return d;
}
function lookupAddIfToList(dict, keys, val) {
	let lst = lookup(dict, keys);
	if (isList(lst) && lst.includes(val)) return;
	lookupAddToList(dict, keys, val);
}
function lookupAddToList(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (i == ilast) {
			if (nundef(k)) {
				console.assert(false, 'lookupAddToList: last key indefined!' + keys.join(' '));
				return null;
			} else if (isList(d[k])) {
				d[k].push(val);
			} else {
				d[k] = [val];
			}
			return d[k];
		}
		if (nundef(k)) continue; //skip undef or null values
		if (d[k] === undefined) d[k] = {};
		d = d[k];
		i += 1;
	}
	return d;
}
function lookupSet(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (nundef(k)) continue; //skip undef or null values
		if (d[k] === undefined) d[k] = (i == ilast ? val : {});
		if (nundef(d[k])) d[k] = (i == ilast ? val : {});
		d = d[k];
		if (i == ilast) return d;
		i += 1;
	}
	return d;
}
function lookupSetOverride(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (i == ilast) {
			if (nundef(k)) {
				return null;
			} else {
				d[k] = val;
			}
			return d[k];
		}
		if (nundef(k)) continue; //skip undef or null values
		if (nundef(d[k])) d[k] = {};
		d = d[k];
		i += 1;
	}
	return d;
}
function makeCategories() {
	let keys = Categories = {
		animal: getGSGElements(g => g == 'Animals & Nature', s => startsWith(s, 'animal')),
		clothing: getGSGElements(g => g == 'Objects', s => s == 'clothing'),
		emotion: getGSGElements(g => g == 'Smileys & Emotion', s => startsWith(s, 'face') && !['face-costume', 'face-hat'].includes(s)),
		food: getGSGElements(g => g == 'Food & Drink', s => startsWith(s, 'food')),
		'game/toy': (['sparkler', 'firecracker', 'artist palette', 'balloon', 'confetti ball'].concat(ByGroupSubgroup['Activities']['game'])).sort(),
		gesture: getGSGElements(g => g == 'People & Body', s => startsWith(s, 'hand')),
		job: ByGroupSubgroup['People & Body']['job'],
		mammal: ByGroupSubgroup['Animals & Nature']['animal-mammal'],
		music: getGSGElements(g => g == 'Objects', s => startsWith(s, 'musi')),
		object: getGSGElements(g => g == 'Objects', s => true),
		place: getGSGElements(g => g == 'Travel & Places', s => startsWith(s, 'place')),
		plant: getGSGElements(g => g == 'Animals & Nature' || g == 'Food & Drink', s => startsWith(s, 'plant') || s == 'food-vegetable' || s == 'food-fruit'),
		sport: ByGroupSubgroup['Activities']['sport'],
		tool: getGSGElements(g => g == 'Objects', s => s == 'tool'),
		transport: getGSGElements(g => g == 'Travel & Places', s => startsWith(s, 'transport')),
	};
	let incompatible = DA.incompatibleCats = {
		animal: ['mammal'],
		clothing: ['object'],
		emotion: ['gesture'],
		food: ['plant', 'animal'],
		'game/toy': ['object', 'music'],
		gesture: ['emotion'],
		job: ['sport'],
		mammal: ['animal'],
		music: ['object', 'game/toy'],
		object: ['music', 'clothing', 'game/toy', 'tool'],
		place: [],
		plant: ['food'],
		sport: ['job'],
		tool: ['object'],
		transport: [],
	}
}
function makeUnitString(nOrString, unit = 'px', defaultVal = '100%') {
	if (nundef(nOrString)) return defaultVal;
	if (isNumber(nOrString)) nOrString = '' + nOrString + unit;
	return nOrString;
}
function mAnimate(elem, prop, valist, callback, msDuration = 1000, easing = 'cubic-bezier(1,-0.03,.86,.68)', delay = 0, forwards = 'none') {
	let kflist = [];
	for (const perc in valist) {
		let o = {};
		let val = valist[perc];
		o[prop] = isString(val) || prop == 'opacity' ? val : '' + val + 'px';
		kflist.push(o);
	}
	let opts = { duration: msDuration, fill: forwards, easing: easing, delay: delay };
	let a = toElem(elem).animate(kflist, opts);
	if (isdef(callback)) { a.onfinish = callback; }
	return a;
}
function mAnimateList(elem, ogoal, callback, msDuration = 1000, easing = 'cubic-bezier(1,-0.03,.86,.68)', delay = 0) {
	for (const k in ogoal) {
		ogoal[k] = isString(ogoal[k]) || k == 'opacity' ? ogoal[k] : '' + ogoal[k] + 'px';
	}
	let kflist = [ogoal];
	let opts = { duration: msDuration, fill: 'forwards', easing: easing, delay: delay };
	let a = toElem(elem).animate(kflist, opts);
	if (isdef(callback)) { a.onfinish = callback; }
	return a;
}
function mAnimateTo(elem, prop, val, callback, msDuration = 1000, easing = 'cubic-bezier(1,-0.03,.86,.68)', delay = 0) {
	let o = {};
	o[prop] = isString(val) || prop == 'opacity' ? val : '' + val + 'px';
	let kflist = [o];
	let opts = { duration: msDuration, fill: 'forwards', easing: easing, delay: delay };
	let a = toElem(elem).animate(kflist, opts);
	if (isdef(callback)) { a.onfinish = callback; }
	return a;
}
function mAppear(d, ms = 800, callback = null) { return mAnimateTo(d, 'opacity', 1, callback, ms); }
function mAppend(d, child) { toElem(d).appendChild(child); return child; }
function mAttrs(elem, attrs) { for (const k in attrs) { elem.setAttribute(k, attrs[k]); } }
function mBackground(bg, fg) { mStyle(document.body, { bg: bg, fg: fg }); }
function mBoxFromMargins(dParent, t, r, b, l, styles, id, inner, classes) {
	let d = mDiv(dParent, { position: 'absolute', top: t, right: r, bottom: b, left: l }, id, inner, classes);
	let pos = dParent.style.position;
	if (pos != 'absolute') dParent.style.position = 'relative';
	if (isdef(styles)) mStyle(d, styles);
	return d;
}
function mButton(caption, handler, dParent, styles, classes, id) {
	let x = mCreate('button');
	x.innerHTML = caption;
	if (isdef(handler)) x.onclick = handler;
	if (isdef(dParent)) dParent.appendChild(x);
	if (isdef(styles)) mStyle(x, styles);
	if (isdef(classes)) mClass(x, classes);
	if (isdef(id)) x.id = id;
	return x;
}
function mButtonX(dParent, handler, pos = 'tr', sz = 25, color = 'white') {
	let d2 = mDiv(dParent, { fg: color, w: sz, h: sz, pointer: 'cursor' }, null, `<i class="fa fa-times" style="font-size:${sz}px;"></i>`, 'btnX');
	mPlace(d2, pos, 2);
	d2.onclick = handler;
	return d2;
}
function mBy(id) { return document.getElementById(id); }
function mCard(dParent, styles, classtr = '', id = null) {
	let classes = toWords("card300 wb " + classtr);
	return mDiv(dParent, styles, id, null, classes);
}
function mCardButton(caption, handler, dParent, styles, classtr = '', id = null) {
	let classes = toWords("card300 wb fett no_outline btn" + classtr);
	return mButton(caption, handler, dParent, styles, classes, id);
}
function mCardText(ckey, sz, color) {
	let j = is_jolly(ckey);
	if (nundef(color)) color = get_color_of_card(ckey);
	return is_jolly(ckey) ?
		`<span style="font-size:12px;font-family:Algerian;color:${color}">jolly</span>` :
		is_color(ckey) ? `<span style="font-weight:bold;color:${color}">${ckey}</span>` :
			is_color(stringAfter(ckey, '_')) ? `<span style="font-size:16px;font-family:Algerian;color:${color}">${stringBefore(ckey, '_')}</span>` :
				`${ckey[0]}${mSuit(ckey, sz, color)}`;
}
function mCenterCenterFlex(d) { mCenterFlex(d, true, true, true); }
function mCenterFlex(d, hCenter = true, vCenter = false, wrap = true) {
	let styles = { display: 'flex' };
	if (hCenter) styles['justify-content'] = 'center';
	styles['align-content'] = vCenter ? 'center' : 'flex-start';
	if (wrap) styles['flex-wrap'] = 'wrap';
	mStyle(d, styles);
}
function mClass(d) {
	d = toElem(d);
	if (arguments.length == 2 && isList(arguments[1])) for (let i = 0; i < arguments[1].length; i++) d.classList.add(arguments[1][i]);
	else for (let i = 1; i < arguments.length; i++) d.classList.add(arguments[i]);
}
function mClass0(d) { d = toElem(d); d.className = ''; }
function mClassRemove(d) { d = toElem(d); for (let i = 1; i < arguments.length; i++) d.classList.remove(arguments[i]); }
function mClassReplace(d, weg, her) { mClassRemove(d, weg); mClass(d, her); }
function mClear(d) { clearElement(d); }
function mColFlex(dParent, chflex = [1, 5, 1], bgs) { // = [YELLOW, ORANGE, RED]) {
	let styles = { opacity: 1, display: 'flex', 'align-items': 'stretch', 'flex-flow': 'nowrap' };
	mStyle(dParent, styles);
	let res = [];
	for (let i = 0; i < chflex.length; i++) {
		let bg = isdef(bgs) ? bgs[i] : null;
		let d1 = mDiv(dParent, { flex: chflex[i], bg: bg });
		res.push(d1);
	}
	return res;
}
function mColorLetters(s, brightness) {
	return toLetters(s).map(x => `<div style='display:inline-block;transform:rotate(${rChoose([10, 5, -10, -5])}deg);color:${rColor(brightness)}'>${x == ' ' ? '&nbsp;' : x}</div>`).join('');
}
function mColorPickerBehavior(value, targetImage, elem, handler) {
	let hues = arrTake(colorHueWheel(value), 10);
	let colorPalette = hues.map(x => colorFrom(colorHSLBuild(x)));
	let palette = isdef(targetImage) ? colorPaletteFromImage(targetImage) : colorPalette;
	mStyle(elem, { bg: value });
	let inp = new JSColor(elem, { alpha: 'ff', closeButton: true, value: value, palette: palette, });
	inp.onInput = () => { let c = inp.toHEXAString(); handler(c); }
	return inp;
}
function mColorPickerControl(label, value, targetImage, dParent, handler, styles = { hpadding: 25 }) {
	let d = mDiv(dParent, styles);
	let hpad = valf(styles.hpadding, 6);
	let dLabel = mDiv(d, { 'vertical-align': 'top', w: '35%', align: 'right', hpadding: hpad, display: 'inline-block' }, null, label);
	let hues = arrTake(colorHueWheel(value), 10);
	let colorPalette = hues.map(x => colorFrom(colorHSLBuild(x)));
	let palette = isdef(targetImage) ? colorPaletteFromImage(targetImage) : colorPalette;
	let elem = mDiv(d, { w: '55%', hpadding: hpad, h: 24, rounding: hpad, display: 'inline-block' });
	let inp = new JSColor(elem, {
		alpha: 'ff',
		closeButton: true,
		value: value,
		palette: palette,
	});
	inp.onInput = () => { let c = inp.toHEXAString(); handler(c); }
	return inp;
}
function mCreate(tag, styles, id) { let d = document.createElement(tag); if (isdef(id)) d.id = id; if (isdef(styles)) mStyle(d, styles); return d; }
function mCreateFrom(htmlString) {
	var div = document.createElement('div');
	div.innerHTML = htmlString.trim();// '<div>halloooooooooooooo</div>';// htmlString.trim();
	return div.firstChild;
}
function mDataTable(reclist, dParent, rowstylefunc, headers, id, showheaders = true) {
	if (nundef(headers)) headers = get_keys(reclist[0]);
	let t = mTable(dParent, headers, showheaders);
	if (isdef(id)) t.id = `t${id}`;
	let rowitems = [];
	let i = 0;
	for (const u of reclist) {
		let rid = isdef(id) ? `r${id}_${i}` : null;
		r = mTableRow(t, u, headers, rid);
		if (isdef(rowstylefunc)) mStyle(r.div, rowstylefunc(u));
		rowitems.push({ div: r.div, colitems: r.colitems, o: u, id: rid, index: i });
		i++;
	}
	return { div: t, rowitems: rowitems };
}
function mDiv(dParent, styles, id, inner, classes, sizing) {
	let d = mCreate('div');
	if (dParent) mAppend(dParent, d);
	if (isdef(styles)) mStyle(d, styles);
	if (isdef(classes)) mClass(d, classes);
	if (isdef(id)) d.id = id;
	if (isdef(inner)) d.innerHTML = inner;
	if (isdef(sizing)) { setRect(d, sizing); }
	return d;
}
function mDiv100(dParent, styles, id, sizing = true) { let d = mDiv(dParent, styles, id); mSize(d, 100, 100, '%', sizing); return d; }
function mDivItem(dParent, styles, id, content) {
	if (nundef(id)) id = getUID();
	let d = mDiv(dParent, styles, id, content);
	return mItem(id, { div: d });
}
function mDivLR(dParent, styles, id, innerlist, classes) {
	let d = mDiv(dParent, styles, id, `<div>${innerlist[0]}</div><div>${innerlist[1]}</div>`, classes);
	mStyle(d, { display: 'flex', 'justify-content': 'space-between', 'align-items': 'center' });
	return d;
}
function mDover(dParent, styles = {}, sizing = true) {
	let d = mDiv(dParent, styles);
	mIfNotRelative(dParent);
	mStyle(d, { position: 'absolute', left: 0, top: 0, w: '100%', h: '100%' });
	setRect(d, sizing);
	return d;
}
function mDraggable(item) {
	let d = iDiv(item);
	d.draggable = true;
	d.ondragstart = drag;
}
function mDroppable(item, handler, dragoverhandler) {
	function allowDrop(ev) { ev.preventDefault(); }
	let d = iDiv(item);
	d.ondragover = isdef(dragoverhandler) ? dragoverhandler : allowDrop;
	d.ondrop = handler;
}
function measure_fieldset(fs) {
	let legend = fs.firstChild;
	let r = getRect(legend);
	let labels = fs.getElementsByTagName('label');
	let wmax = 0;
	for (const l of labels) {
		let r1 = getRect(l);
		wmax = Math.max(wmax, r1.w);
	}
	let wt = r.w;
	let wo = wmax + 24;
	let diff = wt - wo;
	if (diff >= 10) {
		for (const l of labels) { let d = l.parentNode; mStyle(d, { maleft: diff / 2 }); }
	}
	let wneeded = Math.max(wt, wo) + 10;
	mStyle(fs, { wmin: wneeded });
	for (const l of labels) { let d = l.parentNode; mStyle(l, { display: 'inline-block', wmin: 50 }); mStyle(d, { wmin: wneeded - 40 }); }
}
function measureTextX(text, fz, family, weight = 900) {
	let sFont = '' + weight + ' ' + fz + 'px ' + family;
	sFont = sFont.trim();
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
	var context = canvas.getContext('2d');
	context.font = sFont;
	var metrics = context.measureText(text);
	let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	console.log(metrics.width, actualHeight, fz)
	return { w: metrics.width, h: actualHeight, fz: fz };
}
function mEdit(label, value, dParent, handler, styles, classes, id) {
	let d = mDiv(dParent, styles);
	let hpad = valf(styles.hpadding, 4);
	let dLabel = mDiv(d, { w: '50%', align: 'right', hpadding: hpad, display: 'inline-block' }, null, label); //mCreateFrom(`<label>${label}</label>`);
	let inp = mCreateFrom(`<div contenteditable="true" spellcheck="false">${value}</div>	`)
	mAppend(d, inp);
	mStyle(inp, { display: 'inline-block', w: '50%', align: 'left', hpadding: hpad });
	inp.addEventListener('keydown', unfocusOnEnter);
	inp.addEventListener('focusout', ev => { handler(inp.innerHTML, ev); });
	inp.onclick = ev => selectText(ev.target);
	if (isdef(classes)) mClass(inp, classes);
	if (isdef(id)) inp.id = id;
	return inp;
}
function mEditableInput(dParent, label, val, styles, classes, id) {
	let labelElem = mCreateFrom(`<span>${label}</span>	`)
	let elem = mCreateFrom(`<span contenteditable="true" spellcheck="false">${val}</span>	`)
	elem.addEventListener('keydown', (ev) => {
		if (ev.key === 'Enter') {
			ev.preventDefault();
			mBy('dummy').focus();
		}
	});
	let dui = mDiv(dParent, { margin: 2 });
	mAppend(dui, labelElem);
	mAppend(dui, elem);
	if (isdef(styles)) {
		if (isdef(styles.wInput)) mStyle(elem, { wmin: styles.wInput });
		mStyle(elem, styles);
	}
	if (isdef(classes)) mStyle(elem, classes);
	if (isdef(id)) elem.id = id;
	return elem;
}
function mEditableOnEdited(id, dParent, label, initialVal, onEdited, onOpening, styles, classes) {
	let inp = mEditableInput(dParent, label, initialVal, styles, classes);
	inp.id = id;
	if (isdef(onOpening)) { inp.addEventListener('focus', ev => onOpening(ev)); }
	inp.addEventListener('focusout', ev => {
		window.getSelection().removeAllRanges();
		if (isdef(onEdited)) onEdited(inp.innerHTML, ev);
	});
	return inp;
}
function mEditNumber(label, value, dParent, handler, styles, classes, id, triggerOnChange = false) {
	let d = mDiv(dParent, styles);
	let hpad = valf(styles.hpadding, 4);
	let dLabel = mDiv(d, { w: '50%', align: 'right', hpadding: hpad, display: 'inline-block' }, null, label); //mCreateFrom(`<label>${label}</label>`);
	if (nundef(handler)) handler = x => console.log(x);
	let inp = mCreateFrom(`<div contenteditable="true" spellcheck="false">${value}</div>	`)
	mAppend(d, inp);
	mStyle(inp, { display: 'inline-block', w: '40%', align: 'left', hpadding: hpad });
	inp.addEventListener('keydown', unfocusOnEnter);
	inp.addEventListener('focusout', ev => { handler(inp.innerHTML, ev); });
	inp.onclick = ev => selectText(ev.target);
	if (isdef(classes)) mClass(inp, classes);
	if (isdef(id)) inp.id = id;
	return inp;
}
function mEditRange(label, value, min, max, step, dParent, handler, styles, classes, id, triggerOnChange = true) {
	let d = mDiv(dParent, styles);
	let hpad = valf(styles.hpadding, 4);
	let dLabel = mDiv(d, { w: '30%', align: 'right', hpadding: hpad, display: 'inline-block' }, null, label); //mCreateFrom(`<label>${label}</label>`);
	let inpText = mCreateFrom(`<input type='number'  step=${step} min="${min}" max="${max}" value="${value}" ></input>`);
	let inp = mCreateFrom(`<input type="range" step=${step} min="${min}" max="${max}" value="${value}" ></input>`);
	mAppend(d, inpText);
	mAppend(d, inp);
	mStyle(inpText, { display: 'inline', w: '20%', align: 'left', hpadding: hpad });
	mStyle(inp, { display: 'inline', w: '40%', hpadding: hpad });
	inpText.onchange = (ev) => { inp.value = inpText.value; handler(inpText.value, ev); };
	inpText.onclick = ev => selectText(ev.target);
	inp.onchange = (ev) => { inpText.value = inp.value; handler(inpText.value, ev); };
	if (isdef(classes)) mClass(inp, classes);
	if (isdef(id)) inp.id = id;
	return inpText;
}
function mEditX(label, val, dParent, styles, classes, handler, id, opt = {}) {
	let defOptions = {
		alignLabel: 'right',
		fgLabel: 'silver',
		wminLabel: 120,
		alignInput: 'left',
		fgInput: 'white',
		wminInput: 50,
		wminRight: 120,
		align: 'center',
	}
	addKeys(defOptions, opt);
	let wminTotal = wminLabel + wminRight;
	if (nundef(styles)) styles = {};
	if (nundef(styles.wmin)) styles.wmin = 0;
	styles.wmin = Math.max(styles.wmin, wminTotal);
	styles.align = opt.align;
	let dOuter = mDiv(dParent, styles, id, null, classes);
	let dLabel = mDiv(dOuter, { fg: opt.fgLabel, wmin: opt.wminLabel, align: opt.alignLabel }, null, label);
	let dInput = mDiv(dOuter, { contenteditable: true, spellcheck: false, fg: opt.fgInput, wmin: opt.wminInput, align: opt.alignInput }, null, val);
	dInput.onfocusout = ev => handler(dInput.innerHTML, ev);
	dInput.onkeydown = (ev) => {
		if (ev.key === 'Enter') {
			ev.preventDefault();
			mBy('dummy').focus();
		}
	}
	return dInput;
}
function mFade(d, ms = 800, callback = null) { return mAnimateTo(d, 'opacity', 0, callback, ms); }
function mFadeClear(d, ms = 800, callback = null) { return mAnimateTo(d, 'opacity', 0, () => { mClear(d); if (callback) callback(); }, ms); }
function mFadeClearShow(d, ms = 800, callback = null) { return mAnimate(d, 'opacity', [1, 0], () => { mClear(d); if (callback) callback(); }, ms); }
function mFadeRemove(d, ms = 800, callback = null) { return mAnimateTo(d, 'opacity', 0, () => { mRemove(d); if (callback) callback(); }, ms); }
function mFall(d, ms = 800, dist = 50) { toElem(d).animate([{ opacity: 0, transform: `translateY(-${dist}px)` }, { opacity: 1, transform: 'translateY(0px)' },], { fill: 'both', duration: ms, easing: 'ease' }); }
function mFlex(d, or = 'h') {
	d = toElem(d);
	d.style.display = 'flex';
	d.style.flexFlow = (or == 'v' ? 'column' : 'row') + ' ' + (or == 'w' ? 'wrap' : 'nowrap');
}
function mFlexColumn(d, or = 'h') {
	d = toElem(d);
	d.style.display = 'flex';
	d.style.flexFlow = (or == 'v' ? 'column' : 'row') + ' ' + (or == 'w' ? 'wrap' : 'nowrap');
	d.style.alignItems = 'stretch';
	d.style.alignContent = 'stretch';
	d.style.justiifyItems = 'stretch';
	d.style.justifyContent = 'stretch';
}
function mFlexEvenly(d) {
	let styles = { display: 'flex' };
	styles['justify-content'] = 'space-evenly';
	mStyle(d, styles);
}
function mFlexLR(d) { mStyle(d, { display: 'flex', 'justify-content': 'space-between', 'align-items': 'center' }); }
function mFlexSpacebetween(d) { mFlexLR(d); }
function mFlexWrap(d) { mFlex(d, 'w'); }
function mFlip(card, ms, callback) {
	let a = mAnimate(iDiv(card), 'transform', [`scale(1,1)`, `scale(0,1)`],
		() => {
			if (card.faceUp) face_down(card); else face_up(card);
			mAnimate(iDiv(card), 'transform', [`scale(0,1)`, `scale(1,1)`], callback, ms / 2, 'ease-in', 0, 'both');
		},
		ms / 2, 'ease-out', 0, 'both');
}
function mForm(dParent) {
	return mAppend(dParent, mCreate('form'));
}
function mFromPoint(x, y) {
	var element, elements = [];
	var old_visibility = [];
	while (true) {
		element = document.elementFromPoint(x, y);
		if (!element || element === document.documentElement) {
			break;
		}
		elements.push(element);
		old_visibility.push(element.style.visibility);
		element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
	}
	for (var k = 0; k < elements.length; k++) {
		elements[k].style.visibility = old_visibility[k];
	}
	elements.reverse();
	return elements;
}
function mGetStyle(elem, prop) {
	let val;
	elem = toElem(elem);
	if (prop == 'bg') { val = getStyleProp(elem, 'background-color'); if (isEmpty(val)) return getStyleProp(elem, 'background'); }
	else if (isdef(STYLE_PARAMS[prop])) { val = getStyleProp(elem, STYLE_PARAMS[prop]); } //elem.style[STYLE_PARAMS[prop]]; }
	else {
		switch (prop) {
			case 'vmargin': val = stringBefore(elem.style.margin, ' '); break;
			case 'hmargin': val = stringAfter(elem.style.margin, ' '); break;
			case 'vpadding': val = stringBefore(elem.style.padding, ' '); break;
			case 'hpadding': val = stringAfter(elem.style.padding, ' '); break;
			case 'box': val = elem.style.boxSizing; break;
			case 'dir': val = elem.style.flexDirection; break;
		}
	}
	if (nundef(val)) val = getStyleProp(elem, prop); // elem.style[prop];
	if (val.endsWith('px')) return firstNumber(val); else return val;
}
function mGrid(rows, cols, dParent, styles = {}) {
	let d = mDiv(dParent, styles);
	d.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
	d.style.gridTemplateRows = 'repeat(' + rows + ',1fr)';
	d.style.display = 'inline-grid';
	d.style.padding = valf(styles.padding, styles.gap) + 'px';
	return d;
}
function mgSvg(dParent, attrs) { return mgTag('svg', dParent, attrs); }
function mgTag(tag, dParent, attrs, styles = {}, innerHTML) {
	let elem = gCreate(tag);
	mStyle(elem, styles);
	mAttrs(elem, attrs);
	if (isdef(innerHTML)) elem.innerHTML = innerHTML;
	if (isdef(dParent)) mAppend(dParent, elem);
	return elem;
}
function mgText(text, dParent, attrs, styles) { return mgTag('text', dParent, attrs, styles, text); }
function mHide(d, ms = 0) { if (ms > 0) mFade(d, ms); else mStyle(d, { opacity: 0 }); }
function mIfNotRelative(d) { if (isEmpty(d.style.position)) d.style.position = 'relative'; }
function mImage() { return mImg(...arguments); }
function mImg(path, dParent, styles, classes, callback) {
	let d = mCreate('img');
	if (isdef(callback)) d.onload = callback;
	d.src = path;
	mAppend(dParent, d);
	if (isdef(styles)) mStyle(d, styles);
	if (isdef(classes)) mClass(d, classes);
	if (isdef(styles.w)) d.setAttribute('width', styles.w + 'px');
	if (isdef(styles.h)) d.setAttribute('height', styles.h + 'px');
	return d;
}
function mInput(dParent, styles, id, placeholder, classtr = 'input', tabindex = null, value = '') {
	let html = `<input type="text" id=${id} class="${classtr}" placeholder="${valf(placeholder, '')}" tabindex="${tabindex}" value="${value}">`;
	let d = mAppend(dParent, mCreateFrom(html));
	if (isdef(styles)) mStyle(d, styles);
	return d;
}
function mInsert(dParent, el, index = 0) { dParent.insertBefore(el, dParent.childNodes[index]); }
function mInsertAfter(dParent, el, index = 0) {
	if (dParent.childNodes.length == index) mAppend(dParent, el);
	else mInsert(dParent, el, index + 1);
}
function mInsertAt(dParent, el, index = 0) { mInsert(dParent, el, index); }
function mInsertFirst(dParent, el) { mInsert(dParent, el, 0); return el; }
function miPic(item, dParent, styles, classes) {
	let info = isString(item) ? Syms[item] : isdef(item.info) ? item.info : item;
	let d = mDiv(dParent);
	d.innerHTML = info.text;
	if (nundef(styles)) styles = {};
	let family = info.family; // == 'emoNoto' && DA.isFirefox == true? 'emoNotoFF':info.family;
	addKeys({ family: family, fz: 50, display: 'inline-block' }, styles);
	mStyle(d, styles);
	if (isdef(classes)) mClass(d, classes);
	mCenterCenterFlex(d);
	return d;
}
function mItem(id, diDOM, di = {}, addSizing = false) {
	let item = di;
	id = isdef(id) ? id : isdef(diDOM) && isdef(diDOM.div) && !isEmpty(diDOM.div.id) ? diDOM.div.id : getUID();
	item.id = iRegister(item, id);
	if (isdef(diDOM) && isdef(diDOM.div)) { diDOM.div.id = id; iAdd(item, diDOM); }
	if (addSizing) {
		if (nundef(item.sizing)) item.sizing = 'sizeToContent';
		if (nundef(item.positioning)) { item.positioning = 'absolute'; }
		if (nundef(item.posType)) { item.posType = 'center'; }
		if (isdef(diDOM) && item.sizing == 'sizeToContent') iMeasure(item, item.sizingOptions);
	}
	return item;
}
function mLine(dParent, styles) { return mDiv(dParent, styles, null, '<hr>'); }
function mLinebreak(dParent, gap) {
	dParent = toElem(dParent);
	let d;
	let display = getComputedStyle(dParent).display;
	if (display == 'flex') {
		d = mDiv(dParent, { fz: 2, 'flex-basis': '100%', h: 0, w: '100%' }, null, ' &nbsp; ');
	} else {
		d = mDiv(dParent, {}, null, '<br>');
	}
	if (isdef(gap)) { d.style.minHeight = gap + 'px'; d.innerHTML = ' &nbsp; '; d.style.opacity = .2; }//return mLinebreak(dParent);}
	return d;
}
function mLinebreakFlex(dParent, gap) {
	dParent = toElem(dParent);
	let d = mDiv(dParent, { fz: 2, 'flex-basis': '100%', h: 0, w: '100%' }, null, ' &nbsp; ');
	if (isdef(gap)) { d.style.minHeight = gap + 'px'; d.innerHTML = ' &nbsp; '; d.style.opacity = .2; }//return mLinebreak(dParent);}
	return d;
}
function mLink(dParent, styles, id, inner, classes, sizing) {
	let d = mCreate('a');
	if (dParent) mAppend(dParent, d);
	if (isdef(styles)) mStyle(d, styles);
	if (isdef(classes)) mClass(d, classes);
	if (isdef(id)) d.id = id;
	if (isdef(inner)) d.innerHTML = inner;
	if (isdef(sizing)) { setRect(d, sizing); }
	return d;
}
function mMagnifyOnHoverControl(elem) {
	elem.onmouseenter = ev => { if (ev.ctrlKey) mClass(elem, 'magnify_on_hover'); }
	elem.onmouseleave = ev => mClassRemove(elem, 'magnify_on_hover');
}
function mMagnifyOnHoverControlPopup(elem) {
	elem.onmouseenter = ev => {
		if (ev.ctrlKey) {
			let r = getRect(elem, document.body);
			let popup = mDiv(document.body, { rounding: 4, position: 'absolute', top: r.y, left: r.x }, 'popup');
			let clone = elem.cloneNode(true);
			popup.appendChild(clone);
			mClass(popup, 'doublesize')
			popup.onmouseleave = () => popup.remove();
		}
	}
}
function mMagnifyOnHoverControlRemove(elem) {
	elem.onmouseenter = elem.onmouseleave = null;
	mClassRemove(elem, 'magnify_on_hover');
}
function mMeasure(d) { let r = getRect(d); mStyle(d, { w: r.w, h: r.h }); return r; }
function mNode(o, dParent, title) {
	recConvertLists(o);
	//console.log('mNode o', o);
	let d = mCreate('div');
	mYaml(d, o);
	let pre = d.getElementsByTagName('pre')[0];
	pre.style.fontFamily = 'inherit';
	if (isdef(title)) mInsert(d, mText(title));
	if (isdef(dParent)) mAppend(dParent, d);
	if (isDict(o)) d.style.textAlign = 'left';
	return d;
}
function mPlace(elem, pos, offx, offy) {
	elem = toElem(elem);
	pos = pos.toLowerCase();
	let dParent = elem.parentNode; if (dParent.style.position != 'absolute') dParent.style.position = 'relative';
	let vert = valf(offx, 0); // valf(margin, Math.max(wSym,hSym) / 10); //0;
	let hor = isdef(offy) ? offy : vert;
	if (pos[0] == 'c' || pos[1] == 'c') {
		let rParent = getRect(dParent);
		let [wParent, hParent] = [rParent.w, rParent.h];
		let rElem = getRect(elem);
		let [wElem, hElem] = [rElem.w, rElem.h];
		switch (pos) {
			case 'cc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert + (hParent - hElem) / 2 }); break;
			case 'tc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert }); break;
			case 'bc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, bottom: vert }); break;
			case 'cl': mStyle(elem, { position: 'absolute', left: hor, top: vert + (hParent - hElem) / 2 }); break;
			case 'cr': mStyle(elem, { position: 'absolute', right: hor, top: vert + (hParent - hElem) / 2 }); break;
		}
		return;
	}
	let di = { t: 'top', b: 'bottom', r: 'right', l: 'left' };
	elem.style.position = 'absolute';
	elem.style[di[pos[0]]] = hor + 'px'; elem.style[di[pos[1]]] = vert + 'px';
}
function mPopup(content, dParent, styles, id) {
	if (isdef(mBy(id))) mRemove(id);
	mIfNotRelative(dParent);
	if (nundef(styles)) styles = { top: 0, left: 0 };
	styles.position = 'absolute';
	let d1 = mDiv(dParent, styles, valf(id, getUID()), content);
	return d1;
}
function mPos(d, x, y, unit = 'px') { mStyle(d, { left: x, top: y, position: 'absolute' }, unit); }
function mPulse(d, ms, callback = null) { mClass(d, 'onPulse'); TO[getUID()] = setTimeout(() => { mClassRemove(d, 'onPulse'); if (callback) callback(); }, ms); }
function mPulse1(d, callback) { mPulse(d, 1000, callback); }
function mPulse2(d, callback) { mPulse(d, 2000, callback); }
function mPulse3(d, callback) { mPulse(d, 3000, callback); }
function mRadio(label, val, name, dParent, styles = {}, handler, group_id, is_on) {
	let cursor = styles.cursor; delete styles.cursor;
	let d = mDiv(dParent, styles, group_id + '_' + val);
	let id = isdef(group_id) ? `i_${group_id}_${val}` : getUID();
	let type = isdef(group_id) ? 'radio' : 'checkbox';
	let checked = isdef(is_on) ? is_on : false;
	let inp = mCreateFrom(`<input class='radio' id='${id}' type="${type}" name="${name}" value="${val}">`); // checked="${checked}" >`);
	if (checked) inp.checked = true;
	let text = mCreateFrom(`<label for='${inp.id}'>${label}</label>`);
	if (isdef(cursor)) { inp.style.cursor = text.style.cursor = cursor; }
	mAppend(d, inp);
	mAppend(d, text);
	if (isdef(handler)) {
		inp.onclick = ev => {
			ev.cancelBubble = true;
			if (handler == 'toggle') {
			} else if (isdef(handler)) {
				handler(val);
			}
		};
	}
	return d;
}
function mRadio1(label, val, dParent, styles = {}, handler, group_id) {
	let cursor = styles.cursor; delete styles.cursor;
	let d = mDiv(dParent, styles, group_id + '_' + val);
	let inp = mCreateFrom(`<input class='radio' id='i_${group_id}_${val}' type="radio" name="${group_id}" value="${val}" >`);
	let text = mCreateFrom(`<label for='${inp.id}'>${label}</label>`);
	if (isdef(cursor)) { inp.style.cursor = text.style.cursor = cursor; }
	mAppend(d, inp);
	mAppend(d, text);
	if (isdef(handler)) d.onclick = () => handler(val);
	return d;
}
function mRadioGroup(dParent, styles, id, legend, legendstyles) {
	let f = mCreate('fieldset');
	f.id = id;
	if (isdef(styles)) mStyle(f, styles);
	if (isdef(legend)) {
		let l = mCreate('legend');
		l.innerHTML = legend;
		mAppend(f, l);
		if (isdef(legendstyles)) { mStyle(l, legendstyles); }
	}
	mAppend(dParent, f);
	return f;
}
function mRadioToggle(label, val, dParent, styles = {}, is_on = true) {
	let cursor = styles.cursor; delete styles.cursor;
	let d = mDiv(dParent, styles);
	let id = getUID();
	let inp = mCreateFrom(`<input class='radio' id='${id}' type="checkbox" checked="${is_on}" value="${val}" >`);
	let text = mCreateFrom(`<label for='${id}'>${label}</label>`);
	if (isdef(cursor)) { inp.style.cursor = text.style.cursor = cursor; }
	mAppend(d, inp);
	mAppend(d, text);
	return d;
}
function mRemove(elem) {
	elem = toElem(elem);
	var a = elem.attributes, i, l, n;
	if (a) {
		for (i = a.length - 1; i >= 0; i -= 1) {
			n = a[i].name;
			if (typeof elem[n] === 'function') {
				elem[n] = null;
			}
		}
	}
	a = elem.childNodes;
	if (a) {
		l = a.length;
		for (i = a.length - 1; i >= 0; i -= 1) {
			mRemove(elem.childNodes[i]);
		}
	}
	elem.remove(); //elem.parentNode.removeChild(elem);
}
function mRemoveChildrenFromIndex(dParent, i) { while (dParent.children[i]) { mRemove(dParent.children[i]); } }
function mRise(d, ms = 800) {
	toElem(d).animate([{ opacity: 0, transform: 'translateY(50px)' }, { opacity: 1, transform: 'translateY(0px)' },], { fill: 'both', duration: ms, easing: 'ease' });
}
function mScale(d, scale) { mStyle(d, { 'transform-origin': 'top', transform: `scale(${scale})` }); }
function mSelectTableRow(r, color = 'pink') {
	let t = r.parentNode;
	for (const ch of t.children) mStyle(ch, { background: 'transparent' });
	mStyle(r, { background: color });
}
function mShield(dParent, styles = { bg: '#00000020' }, id = null, classnames = null, hideonclick = false) {
	dParent = toElem(dParent);
	let d = mDiv(dParent, styles, id, classnames);
	lookupAddIfToList(DA, ['shields'], d);
	mIfNotRelative(dParent);
	mStyle(d, { position: 'absolute', left: 0, top: 0, w: '100%', h: '100%' });
	if (hideonclick) d.onclick = ev => { evNoBubble(ev); d.remove(); };
	else d.onclick = ev => { evNoBubble(ev); };
	mClass(d, 'topmost');
	return d;
}
function mShieldsOff() { if (nundef(DA.shields)) return; for (const d of DA.shields) d.remove(); }
function mShow(d, ms = 0) { if (ms > 0) mAppear(d, ms); else mStyle(d, { opacity: 1 }); }
function mShrink(d, x = .75, y = .75, ms = 800, callback = null) {
	let anim = toElem(d).animate([{ transform: `scale(${1},${1})` }, { transform: `scale(${x},${y})` },], { fill: 'both', duration: ms, easing: 'ease' });
	anim.onfinish = callback;
}
function mShrinkTranslate(child, scale, newParent, ms = 800, callback) {
	let [dx, dy] = get_screen_distance(child, newParent);
	mAnimate(child, 'transform', [`translateX(${dx}px) translateY(${dy}px) scale(${scale})`], callback, ms, 'ease');
}
function mShrinkUp(d, x = .75, y = 0, ms = 800, callback = null) {
	let anim = toElem(d).animate([{ transform: `scale(${1},${1})`, opacity: 1 }, { transform: `scale(${x},${y})`, opacity: 0 },], { fill: 'none', duration: ms, easing: 'ease' });
	anim.onfinish = mClear(d);
}
function mSize(d, w, h, unit = 'px', sizing) { if (nundef(h)) h = w; mStyle(d, { width: w, height: h }, unit); if (isdef(sizing)) setRect(d, sizing); }
function mStamp(d1, text, color, sz) {
	mStyle(d1, { position: 'relative' });
	let r = getRect(d1);
	let [w, h] = [r.w, r.h];
	color = valf(color, 'black');
	sz = valf(sz, r.h / 7);
	let [padding, border, rounding, angle] = [sz / 10, sz / 6, sz / 8, rChoose([-16, -14, -10, 10, 14])];
	let d2 = mDiv(d1, {
		fg: color,
		position: 'absolute', top: 25, left: 5,
		transform: `rotate(${angle}deg)`,
		fz: sz,
		hpadding: 2,
		vpadding: 0,
		rounding: rounding,
		border: `${border}px solid ${colorTrans(color, .8)}`, // black
		'-webkit-mask-size': `${w}px ${h}px`,
		'-webkit-mask-position': `50% 50%`,
		'-webkit-mask-image': 'url("../base/assets/images/textures/grunge.png")',
		weight: 400, // 800
		display: 'inline-block',
		'text-transform': 'uppercase',
		family: 'blackops', // courier blackops fredericka
		'mix-blend-mode': 'multiply',
	}, null, text);
}
function mStyle(elem, styles, unit = 'px') {
	elem = toElem(elem);
	if (isdef(styles.vmargin)) { styles.mabottom = styles.matop = styles.vmargin; }
	if (isdef(styles.hmargin)) { styles.maleft = styles.maright = styles.hmargin; }
	let bg, fg;
	if (isdef(styles.bg) || isdef(styles.fg)) {
		[bg, fg] = colorsFromBFA(styles.bg, styles.fg, styles.alpha);
	}
	if (isdef(styles.vpadding) || isdef(styles.hpadding)) {
		styles.padding = valf(styles.vpadding, 0) + unit + ' ' + valf(styles.hpadding, 0) + unit;
	}
	if (isdef(styles.upperRounding)) {
		let rtop = '' + valf(styles.upperRounding, 0) + unit;
		let rbot = '0' + unit;
		styles['border-radius'] = rtop + ' ' + rtop + ' ' + rbot + ' ' + rbot;
	} else if (isdef(styles.lowerRounding)) {
		let rbot = '' + valf(styles.lowerRounding, 0) + unit;
		let rtop = '0' + unit;
		styles['border-radius'] = rtop + ' ' + rtop + ' ' + rbot + ' ' + rbot;
	}
	if (isdef(styles.box)) styles['box-sizing'] = 'border-box';
	for (const k in styles) {
		let val = styles[k];
		let key = k;
		if (isdef(STYLE_PARAMS[k])) key = STYLE_PARAMS[k];
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
		} else if (k == 'classname') {
			mClass(elem, styles[k]);
		} else if (k == 'border') {
			if (isNumber(val)) val = `solid ${val}px ${isdef(styles.fg) ? styles.fg : '#ffffff80'}`;
			if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
		} else if (k == 'layout') {
			if (val[0] == 'f') {
				val = val.slice(1);
				elem.style.setProperty('display', 'flex');
				elem.style.setProperty('flex-wrap', 'wrap');
				let hor, vert;
				if (val.length == 1) hor = vert = 'center';
				else {
					let di = { c: 'center', s: 'start', e: 'end' };
					hor = di[val[1]];
					vert = di[val[2]];
				}
				let justStyle = val[0] == 'v' ? vert : hor;
				let alignStyle = val[0] == 'v' ? hor : vert;
				elem.style.setProperty('justify-content', justStyle);
				elem.style.setProperty('align-items', alignStyle);
				switch (val[0]) {
					case 'v': elem.style.setProperty('flex-direction', 'column'); break;
					case 'h': elem.style.setProperty('flex-direction', 'row'); break;
				}
			} else if (val[0] == 'g') {
				val = val.slice(1);
				elem.style.setProperty('display', 'grid');
				let n = allNumbers(val);
				let cols = n[0];
				let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
				elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
				elem.style.setProperty('place-content', 'center');
			}
		} else if (k == 'layflex') {
			elem.style.setProperty('display', 'flex');
			elem.style.setProperty('flex', '0 1 auto');
			elem.style.setProperty('flex-wrap', 'wrap');
			if (val == 'v') { elem.style.setProperty('writing-mode', 'vertical-lr'); }
		} else if (k == 'laygrid') {
			elem.style.setProperty('display', 'grid');
			let n = allNumbers(val);
			let cols = n[0];
			let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
			elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
			elem.style.setProperty('place-content', 'center');
		}
		if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
		else if (key == 'background-color') elem.style.background = bg;
		else if (key == 'color') elem.style.color = fg;
		else if (key == 'opacity') elem.style.opacity = val;
		else if (key == 'wrap') elem.style.flexWrap = 'wrap';
		else if (startsWith(k, 'dir')) {
			isCol = val[0] == 'c';
			elem.style.setProperty('flex-direction', 'column');
		} else if (key == 'flex') {
			if (isNumber(val)) val = '' + val + ' 1 0%';
			elem.style.setProperty(key, makeUnitString(val, unit));
		} else {
			elem.style.setProperty(key, makeUnitString(val, unit));
		}
	}
}
function mStyleRemove(elem, prop) {
	if (isdef(STYLE_PARAMS[prop])) prop = STYLE_PARAMS[prop];
	elem.style.removeProperty(prop);
}
function mSuit(ckey, sz = 20, color = null) {
	let suit = ckey.length == 1 ? ckey : ckey[1];
	let di = { S: '&spades;', H: '&hearts;', D: '&diams;', C: '&clubs;' };
	color = valf(color, suit == 'H' || suit == 'D' ? 'red' : 'black');
	let html = `<span style='color:${color};font-size:${sz}px'>${di[suit]}</span>`;
	return html;
}
function mSym(key, dParent, styles = {}, pos, classes) {
	let info = Syms[key];
	styles.display = 'inline-block';
	let family = info.family; // == 'emoNoto' && DA.isFirefox == true? 'emoNotoFF':info.family;
	styles.family = family;
	let sizes;
	if (isdef(styles.sz)) { sizes = mSymSizeToBox(info, styles.sz, styles.sz); }
	else if (isdef(styles.w) && isdef(styles.h)) { sizes = mSymSizeToBox(info, styles.w, styles.h); }
	else if (isdef(styles.fz)) { sizes = mSymSizeToFz(info, styles.fz); }
	else if (isdef(styles.h)) { sizes = mSymSizeToH(info, styles.h); }
	else if (isdef(styles.w)) { sizes = mSymSizeToW(info, styles.w); }
	else { sizes = mSymSizeToFz(info, 25); }
	styles.fz = sizes.fz;
	styles.w = sizes.w;
	styles.h = sizes.h;
	styles.align = 'center';
	if (isdef(styles.bg) && info.family != 'emoNoto') { styles.fg = styles.bg; delete styles.bg; }
	let x = mDiv(dParent, styles, null, info.text);
	if (isdef(classes)) mClass(x, classes);
	if (isdef(pos)) { mPlace(x, pos); }
	return x;
}
function mSymSizeToBox(info, w, h) {
	let fw = w / info.w;
	let fh = h / info.h;
	let f = Math.min(fw, fh);
	return { fz: 100 * f, w: info.w * f, h: info.h * f };
}
function mSymSizeToFz(info, fz) { let f = fz / 100; return { fz: fz, w: info.w * f, h: info.h * f }; }
function mSymSizeToH(info, h) { let f = h / info.h; return { fz: 100 * f, w: info.w * f, h: h }; }
function mSymSizeToW(info, w) { let f = w / info.w; return { fz: 100 * f, w: w, h: info.h * f }; }
function mSymText(s, dParent, styles = {}, pos, classes) {
	styles.display = 'inline-block';
	styles.w = valfi(styles.w, styles.sz, styles.h, '25%');
	styles.h = valfi(styles.h, styles.sz, styles.w, styles.fz, '25%');
	styles.fz = valfi(styles.fz, styles.sz * 4 / 5, styles.h * 4 / 5, styles.w * 2, '20%');
	styles.align = 'center';
	let x = mDiv(dParent, styles, null, s); mCenterCenterFlex(x);
	if (isdef(classes)) mClass(x, classes);
	if (isdef(pos)) { mPlace(x, pos); }
	return x;
}
function mTable(dParent, headers, showheaders, styles = { mabottom: 0 }, className = 'table') {
	let d = mDiv(dParent);
	let t = mCreate('table');
	mAppend(d, t);
	if (isdef(className)) mClass(t, className);
	if (isdef(styles)) mStyle(t, styles);
	if (showheaders) {
		let code = `<tr>`;
		for (const h of headers) {
			code += `<th>${h}</th>`
		}
		code += `</tr>`;
		t.innerHTML = code;
	}
	return t;
}
function mTableCol(r, val) {
	let col = mCreate('td');
	mAppend(r, col);
	if (isdef(val)) col.innerHTML = val;
	return col;
}
function mTableCommandify(rowitems, di) {
	for (const item of rowitems) {
		for (const index in di) {
			let colitem = item.colitems[index];
			colitem.div.innerHTML = di[index](item, colitem.val);
		}
	}
}
function mTableCommandifyList(rowitem, val, func) {
	let names = isString(val) ? val.replaceAll(' ', ',').split(',') : val;
	let html = '';
	for (const name of names) {
		html += func(rowitem, name); //`<a href="/table/${rowitem.o.name}/${name}">${name}</a>`
	}
	return html;
}
function mTableHeader(t, val) {
	let col = mCreate('th');
	mAppend(t.firstChild, col);
	col.innerHTML = val;
	return col;
}
function mTableRow(t, o, headers, id) {
	let elem = mCreate('tr');
	if (isdef(id)) elem.id = id;
	mAppend(t, elem);
	let colitems = [];
	for (const k of headers) {
		let val = isdef(o[k]) ? isDict(o[k]) ? JSON.stringify(o[k]) : isList(o[k]) ? o[k].join(', ') : o[k] : '';
		let col = mTableCol(elem, val);
		colitems.push({ div: col, key: k, val: val });
	}
	return { div: elem, colitems: colitems };
}
function mTableTransition(d, ms = 800) {
	toElem(d).animate([{ opacity: .25 }, { opacity: 1 },], { fill: 'both', duration: ms, easing: 'ease' });
}
function mText(text, dParent, styles, classes) {
	if (!isString(text)) text = text.toString();
	let d = mDiv(dParent);
	if (!isEmpty(text)) { d.innerHTML = text; }
	if (isdef(styles)) mStyle(d, styles);
	if (isdef(classes)) mClass(d, classes);
	return d;
}
function mTextArea(rows, cols, dParent, styles = {}, id) {
	let html = `<textarea id="${id}" rows="${rows}" cols="${cols}" wrap="hard"></textarea>`;
	let t = mCreateFrom(html);
	mAppend(dParent, t);
	mStyle(t, styles);
	return t;
}
function mTranslate(child, newParent, ms = 800, callback = null) {
	let [dx, dy] = get_screen_distance(child, newParent);
	onend = () => { mAppend(newParent, child); if (callback) callback(); };
	mAnimate(child, 'transform', [`translateX(${dx}px) translateY(${dy}px)`], onend, ms, 'ease'); //translate(${dx}px,${dy}px)`
}
function mTranslateBy(elem, x, y, ms = 800, callback = null) {
	mAnimate(elem, 'transform', [`translateX(${x}px) translateY(${y}px)`], callback, ms, 'ease'); //translate(${dx}px,${dy}px)`
}
function mTranslateByFade(elem, x, y, ms = 800, callback = null) {
	mAnimate(elem, 'transform', [`translateX(${x}px) translateY(${y}px)`], callback, ms, 'ease'); //translate(${dx}px,${dy}px)`
	let a = toElem(elem).animate([{ opacity: .25 }, { opacity: 1 },], { fill: 'both', duration: ms, easing: 'ease' });
}
function mYaml(d, js) {
	d.innerHTML = '<pre>' + jsonToYaml(js) + '</pre>';
	return d;
}
function normalize_string(s, sep = '_') {
	s = s.toLowerCase().trim();
	let res = '';
	for (let i = 0; i < s.length; i++) { if (isAlphaNum(s[i])) res += s[i]; else if (s[i] == ' ') res += sep; }
	return res;
}
function nundef(x) { return x === null || x === undefined; }
function object2string(o, props = [], except_props = []) {
	let s = '';
	if (nundef(o)) return s;
	if (isString(o)) return o;
	let keys = Object.keys(o).sort();
	for (const k of keys) {
		if (!isEmpty(props) && props.includes(k) || !except_props.includes(k)) {
			let val = isList(o[k]) ? o[k].join(',') : isDict(o[k]) ? object2string(o[k].props, except_props) : o[k];
			let key_part = isEmpty(s) ? '' : `, ${k}:`;
			s += val;
		}
	}
	return s;
}
function old_mButtonX(dParent, pos = 'tr', handler = null, defaultBehavior = 'hide', sz = 40) {
	dParent = toElem(dParent);
	let styles = { cursor: 'pointer', w: sz, h: sz };
	let d2 = mDiv(dParent, styles, null, `<svg width='100%' height='100%' ><use xlink:href="#Times" /></svg>`); //, 'btnX');
	mClass(d2, 'svgbtnX');
	d2.onclick = isdef(handler) ? handler : defaultBehavior == 'hide' ? () => hide(dParent) : () => dParent.remove();
	mPlace(d2, pos, 10);
	return d2;
}
function oneWordKeys(keys) { return keys.filter(x => !x.includes(' ')); }
function plural(n) { return n == 0 || n > 1 ? 's' : ''; }
function pSBC(p, c0, c1, l) {
	let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof c1 == 'string';
	if (typeof p != 'number' || p < -1 || p > 1 || typeof c0 != 'string' || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
	h = c0.length > 9;
	h = a ? (c1.length > 9 ? true : c1 == 'c' ? !h : false) : h;
	f = pSBCr(c0);
	P = p < 0;
	t = c1 && c1 != 'c' ? pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 };
	p = P ? p * -1 : p;
	P = 1 - p;
	if (!f || !t) return null;
	if (l) { r = m(P * f.r + p * t.r); g = m(P * f.g + p * t.g); b = m(P * f.b + p * t.b); }
	else { r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5); g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5); b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5); }
	a = f.a;
	t = t.a;
	f = a >= 0 || t >= 0;
	a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0;
	if (h) return 'rgb' + (f ? 'a(' : '(') + r + ',' + g + ',' + b + (f ? ',' + m(a * 1000) / 1000 : '') + ')';
	else return '#' + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2);
}
function pSBCr(d) {
	let i = parseInt, m = Math.round, a = typeof c1 == 'string';
	let n = d.length,
		x = {};
	if (n > 9) {
		([r, g, b, a] = d = d.split(',')), (n = d.length);
		if (n < 3 || n > 4) return null;
		(x.r = parseInt(r[3] == 'a' ? r.slice(5) : r.slice(4))), (x.g = parseInt(g)), (x.b = parseInt(b)), (x.a = a ? parseFloat(a) : -1);
	} else {
		if (n == 8 || n == 6 || n < 4) return null;
		if (n < 6) d = '#' + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : '');
		d = parseInt(d.slice(1), 16);
		if (n == 9 || n == 5) (x.r = (d >> 24) & 255), (x.g = (d >> 16) & 255), (x.b = (d >> 8) & 255), (x.a = m((d & 255) / 0.255) / 1000);
		else (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
	}
	return x;
}
function rAlphanums(n) { return rChoose(toLetters('0123456789abcdefghijklmnopq'), n); }
function randomColor() { return rColor(); }
function range(f, t, st = 1) {
	if (nundef(t)) {
		t = f - 1;
		f = 0;
	}
	let arr = [];
	for (let i = f; i <= t; i += st) {
		arr.push(i);
	}
	return arr;
}
function rCard(postfix = 'n', ranks = '*A23456789TJQK', suits = 'HSDC') { return rChoose(ranks) + rChoose(suits) + postfix; }
function rChoose(arr, n = 1, func = null, exceptIndices = null) {
	let indices = arrRange(0, arr.length - 1);
	if (isdef(exceptIndices)) {
		for (const i of exceptIndices) removeInPlace(indices, i);
	}
	if (isdef(func)) indices = indices.filter(x => func(arr[x]));
	if (n == 1) {
		let idx = Math.floor(Math.random() * indices.length);
		return arr[indices[idx]];
	}
	arrShufflip(indices);
	return indices.slice(0, n).map(x => arr[x]);
}
function rCoin(percent = 50) {
	let r = Math.random();
	r *= 100;
	return r < percent;
}
function rColor(cbrightness, c2, alpha = null) {
	if (isdef(c2)) {
		let c = colorMix(cbrightness, c2, rNumber(0, 100));
		return colorTrans(c, alpha ?? Math.random());
	}
	if (isdef(cbrightness)) {
		let hue = rHue();
		let sat = 100;
		let b = isNumber(cbrightness) ? cbrightness : cbrightness == 'dark' ? 25 : cbrightness == 'light' ? 75 : 50;
		return colorFromHSL(hue, sat, b);
	}
	let s = '#';
	for (let i = 0; i < 6; i++) {
		s += rChoose(['f', 'c', '9', '6', '3', '0']);
	}
	return s;
}
function rDate(before, after) {
	let after_date = new Date(after);
	let before_date = new Date(before);
	let random_date = new Date(Math.random() * (before_date.getTime() - after_date.getTime()) + after_date.getTime());
	return random_date;
}
function rDigits(n) { return rChoose(toLetters('0123456789'), n); }
function recConvertLists(o, maxlen = 25) {
	for (const k in o) {
		let val = o[k];
		if (isList(val)) {
			if (val.length > maxlen) val = val.slice(0, maxlen).toString() + '...';
			else val = val.toString();
			o[k] = val;
		} else if (isDict(val)) recConvertLists(val);
	}
}
function removeDuplicates(keys, prop) {
	let di = {};
	let res = [];
	let items = keys.map(x => Syms[x]);
	for (const item of items) {
		if (isdef(di[item.best])) { continue; }
		res.push(item);
		di[item.key] = true;
	}
	return res.map(x => x.key);
}
function removeInPlace(arr, el) {
	arrRemovip(arr, el);
}
function replaceAll(str, sSub, sBy) {
	let regex = new RegExp(sSub, 'g');
	return str.replace(regex, sBy);
}
function replaceAllFast(str, sSub, sBy) { return replaceAll(str, sSub, sBy); }
function replaceAllSafe(str, sSub, sBy) { return replaceAllSpecialChars(str, sSub, sBy); }
function replaceAllSpecialChars(str, sSub, sBy) { return str.split(sSub).join(sBy); }
function replaceAllX(str, sSub, sBy) { return replaceAllSpecialChars(str, sSub, sBy); }
function replaceAtString(s, i, ssub) { return s.substring(0, i) + ssub + s.substring(i + 1); }
function replaceEvery(w, letter, nth) {
	let res = '';
	for (let i = 1; i < w.length; i += 2) {
		res += letter;
		res += w[i];
	}
	if (w.length % 2) res += w[0];
	return res;
}
function return_elem_to_deck_from(el, arr, deck) { elem_from_to(el, arr, deck); }
function reverse(x) {
	if (isString(x)) {
		var newString = "";
		for (var i = x.length - 1; i >= 0; i--) {
			newString += x[i];
		}
		return newString;
	}
	if (isList(x)) return x.reverse();
	if (isDict(x)) return dict2list(x, 'value').reverse();
	return x;
}
function RGBAToHex9(rgba) {
	let n = allNumbers(rgba); //allNumbers does not catch .5 as float!
	if (n.length < 3) {
		return randomHexColor();
	}
	let a = n.length > 3 ? n[3] : 1;
	let sa = alphaToHex(a);
	if (rgba.includes('%')) {
		n[0] = Math.round((n[0] * 255) / 100);
		n[1] = Math.round((n[1] * 255) / 100);
		n[2] = Math.round((n[2] * 255) / 100);
	}
	return '#' + ((1 << 24) + (n[0] << 16) + (n[1] << 8) + n[2]).toString(16).slice(1) + sa;
} //ok
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
} //ok
function rgbToHex(rgbStr) { return rgbStr && '#' + rgbStr.slice(4, -1).split(',').map(x => (+x).toString(16).padStart(2, '0')).join(''); }
function RGBToHex7(c) {
	let n = allNumbers(c);
	if (c.includes('%')) {
		n[0] = Math.round((n[0] * 255) / 100);
		n[1] = Math.round((n[1] * 255) / 100);
		n[2] = Math.round((n[2] * 255) / 100);
	}
	return '#' + ((1 << 24) + (n[0] << 16) + (n[1] << 8) + n[2]).toString(16).slice(1);
} //ok
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
} //ok
function rHue() { return (rNumber(0, 36) * 10) % 360; }
function rLetter(except) { return rLetters(1, except)[0]; }
function rLetters(n, except = []) {
	let all = 'abcdefghijklmnopqrstuvwxyz';
	for (const l of except) all = all.replace(l, '');
	console.log('all', all, except)
	return rChoose(toLetters(all), n);
}
function rNumber(min = 0, max = 100) {
	return Math.floor(Math.random() * (max - min + 1)) + min; //min and max inclusive!
}
async function route_path_yaml_dict(url) {
	let data = await fetch(url);
	let text = await data.text();
	let dict = jsyaml.load(text);
	return dict;
}
function rPassword(n) { return rChoose(toLetters('0123456789abcdefghijklmnopqABCDEFGHIJKLMNOPQRSTUVWXYZ!.?*&%$#@:;_'), n).join(''); }
function rPrimaryColor() { let c = '#' + rChoose(['ff', '00']) + rChoose(['ff', '00']); c += c == '#0000' ? 'ff' : c == '#ffff' ? '00' : rChoose(['ff', '00']); return c; }
function rRank(ranks = 'A23456789TJQK') { return rChoose(ranks); }
function rSuit(suit = 'HSDC') { return rChoose(suit); }
function sameList(l1, l2) {
	if (l1.length != l2.length) return false;
	for (const s of l1) {
		if (!l2.includes(s)) return false;
	}
	return true;
}
function selectText(el) {
	var sel, range;
	if (window.getSelection && document.createRange) { //Browser compatibility
		sel = window.getSelection();
		if (sel.toString() == '') { //no text selection
			window.setTimeout(function () {
				range = document.createRange(); //range object
				range.selectNodeContents(el); //sets Range
				sel.removeAllRanges(); //remove all ranges from selection
				sel.addRange(range);//add Range to a Selection.
			}, 1);
		}
	} else if (document.selection) { //older ie
		sel = document.selection.createRange();
		if (sel.text == '') { //no text selection
			range = document.body.createTextRange();//Creates TextRange object
			range.moveToElementText(el);//sets Range
			range.select(); //make selection.
		}
	}
}
function setKeys({ allowDuplicates, nMin = 25, lang, key, keySets, filterFunc, param, confidence, sortByFunc } = {}) {
	let keys = jsCopy(keySets[key]);
	if (isdef(nMin)) {
		let diff = nMin - keys.length;
		let additionalSet = diff > 0 ? nMin > 100 ? firstCondDictKeys(keySets, k => k != key && keySets[k].length > diff) : 'best100' : null;
		if (additionalSet) KeySets[additionalSet].map(x => addIf(keys, x)); //
	}
	let primary = [];
	let spare = [];
	for (const k of keys) {
		let info = Syms[k];
		info.best = info[lang];
		if (nundef(info.best)) {
			let ersatzLang = (lang == 'D' ? 'D' : 'E');
			let klang = 'best' + ersatzLang;
			if (nundef(info[klang])) info[klang] = lastOfLanguage(k, ersatzLang);
		}
		let isMatch = true;
		if (isdef(filterFunc)) isMatch = isMatch && filterFunc(param, k, info.best);
		if (isdef(confidence)) isMatch = info[klang + 'Conf'] >= confidence;
		if (isMatch) { primary.push(k); } else { spare.push(k); }
	}
	if (isdef(nMin)) {
		let len = primary.length;
		let nMissing = nMin - len;
		if (nMissing > 0) { let list = choose(spare, nMissing); spare = arrMinus(spare, list); primary = primary.concat(list); }
	}
	if (isdef(sortByFunc)) { sortBy(primary, sortByFunc); }
	if (isdef(nMin)) console.assert(primary.length >= nMin);
	if (nundef(allowDuplicates)) {
		primary = removeDuplicates(primary);
	}
	return primary;
}
function setRect(elem, options) {
	let r = getRect(elem);
	elem.rect = r;
	elem.setAttribute('rect', `${r.w} ${r.h} ${r.t} ${r.l} ${r.b} ${r.r}`); //damit ich es sehen kann!!!
	if (isDict(options)) {
		if (options.hgrow) mStyle(elem, { hmin: r.h });
		else if (options.hfix) mStyle(elem, { h: r.h });
		else if (options.hshrink) mStyle(elem, { hmax: r.h });
		if (options.wgrow) mStyle(elem, { wmin: r.w });
		else if (options.wfix) mStyle(elem, { w: r.w });
		else if (options.wshrink) mStyle(elem, { wmax: r.w });
	}
	return r;
}
function show(elem, isInline = false) {
	if (isString(elem)) elem = document.getElementById(elem);
	if (isSvg(elem)) {
		elem.setAttribute('style', 'visibility:visible');
	} else {
		elem.style.display = isInline ? 'inline-block' : null;
	}
	return elem;
}
function show_special_message(msg, stay = false, ms = 3000, delay = 0, styles = {}, callback = null) { //divTestStyles={}) {
	let dParent = mBy('dBandMessage');
	if (nundef(dParent)) dParent = mDiv(document.body, {}, 'dBandMessage');
	show(dParent);
	clearElement(dParent);
	addKeys({ position: 'fixed', top: 200, classname: 'slow_gradient_blink', vpadding: 10, align: 'center', position: 'absolute', fg: 'white', fz: 24, w: '100vw' }, styles);
	if (!isEmpty(styles.classname)) { mClass(dParent, styles.classname); }
	delete styles.classname;
	mStyle(dParent, styles);
	dParent.innerHTML = msg;
	if (delay > 0) TO.special = setTimeout(() => { mFadeRemove(dParent, ms, callback); }, delay);
	else mFadeRemove(dParent, ms, callback);
}
function showFleetingMessage(msg, dParent, styles = {}, ms = 3000, msDelay = 0, fade = true) {
	clearFleetingMessage();
	dFleetingMessage = mDiv(dParent);
	if (msDelay) {
		TOFleetingMessage = setTimeout(() => fleetingMessage(msg, dFleetingMessage, styles, ms, fade), msDelay);
	} else {
		TOFleetingMessage = setTimeout(() => fleetingMessage(msg, dFleetingMessage, styles, ms, fade), 10);
	}
}
function shuffle(arr) { if (isEmpty(arr)) return []; else return fisherYates(arr); }
function shuffle_children(d) {
	let arr = Array.from(d.children);
	shuffle(arr);
	for (const ch of arr) { mAppend(d, ch); }
}
function shuffleChildren(dParent) { shuffle_children(dParent); }
function simpleCompare(o1, o2) {
	let s1 = object2string(o1);
	let s2 = object2string(o2);
	return s1 == s2;
}
function sortBy(arr, key) { arr.sort((a, b) => (a[key] < b[key] ? -1 : 1)); return arr; }
function sortByDescending(arr, key) { arr.sort((a, b) => (a[key] > b[key] ? -1 : 1)); return arr; }
function sortByFunc(arr, func) { arr.sort((a, b) => (func(a) < func(b) ? -1 : 1)); return arr; }
function sortByFuncDescending(arr, func) { arr.sort((a, b) => (func(a) > func(b) ? -1 : 1)); return arr; }
function sortNumbers(ilist) { ilist.sort(function (a, b) { return a - b }); return ilist; }
function splitAtAnyOf(s, sep) {
	let arr = [], w = '';
	for (let i = 0; i < s.length; i++) {
		let ch = s[i];
		if (sep.includes(ch)) {
			if (!isEmpty(w)) arr.push(w);
			w = '';
		} else {
			w += ch;
		}
	}
	if (!isEmpty(w)) arr.push(w);
	return arr;
}
function splitIntoNumbersAndWords(s) {
	let arr = [], i = 0;
	while (i < s.length) {
		let ch = s[i];
		let w = '';
		if (isDigit(ch)) while (i < s.length && isDigit(ch)) { w += ch; i++; ch = s[i]; }
		else if (isLetter(ch)) while (i < s.length && isLetter(ch)) { w += ch; i++; ch = s[i]; }
		else { i++; continue; } //skip white spaces
		arr.push(w);
	}
	return arr;
}
function start_simple_timer(dtimer, msInterval, onTick, msTotal, onElapsed) {
	if (isdef(DA.timer)) { DA.timer.clear(); DA.timer = null; }
	let timer = DA.timer = new SimpleTimer(dtimer, msInterval, onTick, msTotal, onElapsed);
	timer.start();
}
function startsWith(s, sSub) {
	return s.substring(0, sSub.length) == sSub;
}
function stop_simple_timer() { if (isdef(DA.timer)) { DA.timer.clear(); DA.timer = null; } }
function stringAfter(sFull, sSub) {
	let idx = sFull.indexOf(sSub);
	if (idx < 0) return '';
	return sFull.substring(idx + sSub.length);
}
function stringAfterLast(sFull, sSub) {
	let parts = sFull.split(sSub);
	return arrLast(parts);
}
function stringBefore(sFull, sSub) {
	let idx = sFull.indexOf(sSub);
	if (idx < 0) return sFull;
	return sFull.substring(0, idx);
}
function stringBeforeLast(sFull, sSub) {
	let parts = sFull.split(sSub);
	return sFull.substring(0, sFull.length - arrLast(parts).length - 1);
}
function stringBetween(sFull, sStart, sEnd) {
	return stringBefore(stringAfter(sFull, sStart), isdef(sEnd) ? sEnd : sStart);
}
function stringBetweenLast(sFull, sStart, sEnd) {
	let s1 = stringBeforeLast(sFull, isdef(sEnd) ? sEnd : sStart);
	return stringAfterLast(s1, sStart);
}
function stripToKeys(o, di) {
	let res = {};
	for (const k in o) {
		if (isdef(di[k])) res[k] = o[k];
	}
	return res;
}
function timeConversion(duration, format = 'Hmsh') {
	const portions = [];
	const msInHour = 1000 * 60 * 60;
	const hours = Math.trunc(duration / msInHour);
	if (format.includes('H')) portions.push((hours < 10 ? '0' : '') + hours);
	duration = duration - (hours * msInHour); // hours + 'h');
	const msInMinute = 1000 * 60;
	const minutes = Math.trunc(duration / msInMinute);
	if (format.includes('m')) portions.push((minutes < 10 ? '0' : '') + minutes);// minutes + 'm');
	duration = duration - (minutes * msInMinute);
	const msInSecond = 1000;
	const seconds = Math.trunc(duration / 1000);
	if (format.includes('s')) portions.push((seconds < 10 ? '0' : '') + seconds);//seconds + 's');
	duration = duration - (seconds * msInSecond);
	const hundreds = duration / 10;
	if (format.includes('h')) portions.push((hundreds < 10 ? '0' : '') + hundreds);//hundreds);
	return portions.join(':');
}
function toElem(d) { return isString(d) ? mBy(d) : d; }
function toggleSelection(pic, selected, clSelected = 'framedPicture', clUnselected = null) {
	let ui = iDiv(pic);
	pic.isSelected = !pic.isSelected;
	if (pic.isSelected) {
		if (isdef(clUnselected)) mClassRemove(ui, clUnselected);
		mClass(ui, clSelected);
	} else {
		mClassRemove(ui, clSelected);
		if (isdef(clUnselected)) mClass(ui, clUnselected);
	}
	if (isdef(selected)) {
		if (isList(selected)) {
			if (pic.isSelected) {
				console.assert(!selected.includes(pic), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
				selected.push(pic);
			} else {
				console.assert(selected.includes(pic), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
				removeInPlace(selected, pic);
			}
		} else {
			mClassRemove(iDiv(selected), clSelected);
			if (isdef(clUnselected)) mClass(iDiv(selected), clUnselected);
			selected.isSelected = false;
		}
	}
	return pic.isSelected ? pic : null;
}
function toggleSelectionOfPicture(pic, selectedPics, className = 'framedPicture') {
	let ui = iDiv(pic);
	pic.isSelected = !pic.isSelected;
	if (pic.isSelected) mClass(ui, className); else mClassRemove(ui, className);
	if (isdef(selectedPics)) {
		if (pic.isSelected) {
			console.assert(!selectedPics.includes(pic), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
			selectedPics.push(pic);
		} else {
			console.assert(selectedPics.includes(pic), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
			removeInPlace(selectedPics, pic);
		}
	}
}
function toLetters(s) { return [...s]; }
function top_elem_from_to(arr1, arr2) { arr2.push(arr1.shift()); }
function top_elem_from_to_top(arr1, arr2) { arr2.unshift(arr1.shift()); }
function toWords(s) {
	let arr = s.split(/(?:,|\s|!)+/);
	return arr.filter(x => !isEmpty(x));
}
function unfocusOnEnter(ev) {
	if (ev.key === 'Enter') {
		ev.preventDefault();
		mBy('dummy').focus();
	}
}
function valf(val, def) { return isdef(val) ? val : def; }
function valfi() {
	for (const arg of arguments) {
		if (isdef(arg)) return arg;
	}
	return null;
}
//#endregion basemin

//#region legacy
var StateDict = {};
var EmptyFunc = x => nundef(x) || x == ' ';
var BG_CARD_BACK = randomColor();
class Board {
	constructor(rows, cols, handler, cellStyle) {
		let styles = isdef(cellStyle) ? cellStyle : { margin: 4, w: 150, h: 150, bg: 'white', fg: 'black' };
		this.rows = rows;
		this.cols = cols;
		let items = this.items = iGrid(this.rows, this.cols, dTable, styles);
		items.map(x => {
			let d = iDiv(x);
			mCenterFlex(d);
			d.onclick = handler;
		});
	}
	get(ir, c) {
		if (isdef(c)) {
			let idx = ir * this.cols + c;
			return this.items[idx];
		} else {
			return this.items[ir];
		}
	}
	getState() {
		return this.items.map(x => x.label);
	}
	setState(arr, colors) {
		if (isEmpty(arr)) return;
		if (isList(arr[0])) { arr = arrFlatten(arr); }
		for (let i = 0; i < arr.length; i++) {
			let item = this.items[i];
			let val = arr[i];
			if (!EmptyFunc(val)) {
				addLabel(item, val, { fz: 60, fg: colors[val] });
			} else item.label = val;
		}
	}
	clear() {
		for (const item of this.items) {
			let dLabel = iLabel(item);
			if (isdef(dLabel)) { removeLabel(item); item.label = null; }
		}
	}
}
class Board2D {
	constructor(rows, cols, dParent, cellStyles, boardStyles, handler) {
		cellStyles = this.cellStyles = isdef(cellStyles) ? cellStyles : { margin: 4, w: 150, h: 150, bg: 'white', fg: 'black' };
		boardStyles = this.boardStyles = isdef(boardStyles) ? boardStyles : { bg: 'silver', fg: 'black' };
		this.rows = rows;
		this.cols = cols;
		this.dParent = dParent;
		let dBoard = this.dBoard = mDiv(dParent);//, boardStyles);
		let items = this.items = this.fill(dBoard, this.rows, this.cols, null, cellStyles);
	}
	fill(d, rows, cols, items, cellStyles) {
		if (nundef(items)) items = [];
		clearElement(d);
		mStyle(d, { display: 'grid', 'grid-template-columns': cols });
		for (let i = 0; i < rows * cols; i++) {
			let item = items[i];
			if (isdef(item)) {
				let d1 = iDiv(item);
				if (isdef(d1)) mAppend(d, iDiv(item));
				else {
					d1 = mDiv(d, cellStyles); iAdd(item, { div: d1 }); mAppend(d, d1);
				}
			} else {
				let [r, c] = iToRowCol(i);
				item = { row: r, col: c, index: i };
				let d1 = mDiv(d, cellStyles); iAdd(item, { div: d1 }); mAppend(d, d1);
			}
			mStyle(iDiv(item), cellStyles);
			items.push(item)
		}
		return items;
	}
	get(ir, c) {
		if (isdef(c)) {
			let idx = ir * this.cols + c;
			return this.items[idx];
		} else {
			return this.items[ir];
		}
	}
	getState() {
		return this.items.map(x => x.label);
	}
	setState(arr, colors) {
		if (isEmpty(arr)) return;
		if (isList(arr[0])) { arr = arrFlatten(arr); }
		for (let i = 0; i < arr.length; i++) {
			let item = this.items[i];
			let val = arr[i];
			if (!EmptyFunc(val)) {
				addLabel(item, val, { fz: 60, fg: colors[val] });
			} else item.label = val;
		}
	}
	clear() {
		for (const item of this.items) {
			let dLabel = iLabel(item);
			if (isdef(dLabel)) { removeLabel(item); item.label = null; }
		}
	}
}
class AGraph {
	constructor() {
		this.init(...arguments);
		this.posDict = {};
	}
	init() {
		let defOptions = {
			maxZoom: 1,
			minZoom: .001,
			motionBlur: false,
			zoomingEnabled: false,
			userZoomingEnabled: false,
			panningEnabled: false,
			userPanningEnabled: false,
			boxSelectionEnabled: false,
			layout: { name: 'preset' },
			elements: [],
		};
		this.cy = cytoscape(defOptions);
	}
	clear() { this.cy.destroy(); }
	getComponents() { return this.cy.elements().components(); }
	getComponentIds() { return this.cy.elements().components().map(x => x.id()); }
	getCommonEdgeId(nid1, nid2) { return nid1 + '_' + nid2; }
	getNumComponents() { return this.cy.elements().components().length; }
	getNode(id) { return this.cy.getElementById(id); }
	getEdge(id) { return this.cy.getElementById(id); }
	getNodes() { return this.cy.nodes(); }
	getNodeIds() { return this.cy.nodes().map(x => x.id()); }
	getNodeData() { return this.cy.nodes().map(x => x.data()); }
	getNodePositions() { return this.cy.nodes.map(x => x.position()); }
	getEdges() { return this.cy.edges(); }
	getEdgeIds() { return this.cy.edges().map(x => x.id()); }
	getPosition(id) {
		let node = this.getNode(id);
		let pos = node.renderedPosition();
		return pos; //this.cy.getElementById(id).renderedPosition();
	}
	getSize(id) {
		let node = this.getNode(id);
		let pos = node.bb();//renderedBoundingBox();
		return pos; //this.cy.getElementById(id).renderedPosition();
	}
	getProp(id, prop) { return this.cy.getElementById(id).data(prop); }
	getDegree(id) { return this.cy.getElementById(id).degree(); }
	getNodeWithMaxDegree(idlist) {
		if (nundef(idlist)) idlist = this.cy.elements().filter('node').map(x => x.data().id);
		let imax = arrMinMax(idlist, x => this.getDegree(x)).imax;
		let id = idlist[imax];
		return id;
	}
	getShortestPathsFrom(id) { let res = this.cy.elements().dijkstra('#' + id); return res; }
	getShortestPathFromTo(nid1, nid2) {
		let funcs = this.dijkstra = this.getShortestPathsFrom(nid1);
		let path = funcs.pathTo('#' + nid2);
		return path;
	}
	getLengthOfShortestPath(nid1, nid2) {
		let funcs = this.dijkstra = this.getShortestPathsFrom(nid1);
		let len = funcs.distanceTo('#' + nid2);
		return len;
	}
	setPositionData(prop = 'center') {
		let ids = this.getNodeIds();
		for (const id of ids) {
			let pos = this.getProp(id, prop);
			if (isdef(pos)) this.setPosition(id, pos.x, pos.y);
			else return false;
		}
		return true;
	}
	sortNodesByDegree(idlist, descending = true) {
		if (nundef(idlist)) idlist = this.cy.nodes.map(x => x.data().id);
		let nodes = idlist.map(x => this.getNode(x));
		for (const n of nodes) {
			n.degree = this.getDegree(n.id());
		}
		if (descending) sortByDescending(nodes, 'degree'); else sortBy(nodes, 'degree');
		return nodes;
	}
	storeCurrentPositions(prop = 'center') {
		for (const n of this.getNodes()) {
			let id = n.id();
			let pos = this.getPosition(id);
			this.setProp(id, prop, pos);
		}
	}
	addNode(data, coords) {
		if (nundef(data)) data = {};
		if (nundef(data.id)) data.id = getFruid();
		if (isdef(coords)) {
			coords.x -= this.cy.pan().x;
			coords.y -= this.cy.pan().y;
		} else { coords = { x: 0, y: 0 }; }
		var ele = this.cy.add({
			group: 'nodes',
			data: data,
			position: coords
		});
		return ele.id();
	}
	addNodes(n, datalist, coordlist) {
		let ids = [];
		if (nundef(datalist)) datalist = new Array(n).map(x => ({ id: getFruid() }));
		if (nundef(coordlist)) coordlist = new Array(n).map(x => ({ coords: { x: 0, y: 0 } }));
		for (let i = 0; i < n; i++) {
			let id = this.addNode(datalist[i], coordlist[i]);
			ids.push(id);
		}
		return ids;
	}
	addEdge(nid1, nid2, data) {
		if (nundef(data)) data = {};
		data.id = this.getCommonEdgeId(nid1, nid2);
		data.source = nid1;
		data.target = nid2;
		var ele = this.cy.add({
			group: 'edges',
			data: data,
		});
		return ele.id();
	}
	addEdges(nOrNodePairList) {
		if (isNumber(nOrNodePairList)) {
			let nids = this.getNodeIds();
			let prod = arrPairs(nids);
			nOrNodePairList = choose(prod, nOrNodePairList);
		}
		let res = [];
		for (const pair of nOrNodePairList) {
			res.push(this.addEdge(pair[0], pair[1]));
		}
		return res;
	}
	removeNode(node) { this.removeElement(node); return this.getNodeIds(); }
	removeEdge(edge) { this.removeElement(edge); return this.getEdgeIds(); }
	removeElement(ne) { if (!isString(ne)) ne = ne.id(); this.cy.getElementById(ne).remove(); }
	setPosition(id, x, y) { this.cy.getElementById(id).position({ x: x, y: y }); }
	setProp(id, prop, val) { this.cy.getElementById(id).data(prop, val); }
}
class UIGraph extends AGraph {
	init(dParent, styles = {}) {
		let defOptions = {
			maxZoom: 1,
			minZoom: .001,
			motionBlur: false,
			wheelSensitivity: 0.05,
			zoomingEnabled: true,
			userZoomingEnabled: true,
			panningEnabled: true,
			userPanningEnabled: true,
			boxSelectionEnabled: false,
			elements: [],
		};
		this.id = getUID();
		let dOuter = mDiv(dParent, styles.outer, this.id);//, 'Outer graph');
		let gStyles = valf(styles.inner, { w: 640, h: 420 });
		let dContainer = mDiv(dOuter, { position: 'relative', w: gStyles.w, h: gStyles.h, align: 'left' });
		let styleDict = {
			node: { 'label': 'data(label)', width: 25, height: 25, 'background-color': 'red', color: "#fff", "text-valign": "center", "text-halign": "center" },
			edge: { width: 2, 'line-color': 'silver', 'curve-style': 'haystack', },
			'node.high': { 'background-color': 'yellow' },
			'node.trans': { opacity: '0.5' },
		}
		for (const ks of ['node', 'edge', 'node.high', 'node.trans']) {
			if (isdef(styles[ks])) {
				let mStyles = styles[ks];
				let cyStyles = translateStylesToCy(mStyles, ks);
				copyKeys(cyStyles, styleDict[ks]);
			}
		}
		let cyStyle = [];
		for (const k in styleDict) { cyStyle.push({ selector: k, style: styleDict[k] }); }
		let options = { container: dContainer, style: cyStyle };
		copyKeys(options, defOptions);
		this.cy = cytoscape(defOptions);
		iAdd(this, { div: dOuter, dCy: dContainer });
	}
	hex(rows, cols, wCell, hCell) {
		let centers = this.hexPositions = getCentersFromRowsCols('hex', rows, cols, wCell, hCell)[0];
		this.storePositions('hex', centers);
		this.storePositions('preset', centers);
		this.retrievePositions('hex');
		this.cy.layout({ name: 'preset' }).run();
		this.center();
	}
	hex1(rows, cols, wCell, hCell) {
		let centers = this.hexPositions = getCentersFromRowsCols('hex1', rows, cols, wCell, hCell)[0];
		this.storePositions('hex1', centers);
		this.storePositions('preset', centers);
		let nodes = this.getNodes();
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			let center = centers[i];
			node.data('center', center);
		}
		this.retrievePositions('hex1');
		this.cy.layout({ name: 'preset' }).run();
		this.center();
	}
	breadthfirst() { this.cy.layout({ name: 'breadthfirst', animate: true }).run(); }
	circle() { this.cy.layout({ name: 'circle', animate: 'end' }).run(); }
	concentric() { this.cy.layout({ name: 'concentric', animate: true }).run(); }
	comcola() {
		let defaults = {
			name: 'cola',
			animate: true, // whether to show the layout as it's running
			refresh: 1, // number of ticks per frame; higher is faster but more jerky
			maxSimulationTime: 4000, // max length in ms to run the layout
			ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
			fit: true, // on every layout reposition of nodes, fit the viewport
			padding: 30, // padding around the simulation
			boundingBox: undefined, //{x1:0,y1:0,x2:200,y2:200,w:200,h:200}, //undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
			nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
			ready: function () { }, // on layoutready
			stop: function () { }, // on layoutstop
			randomize: false, // use random node positions at beginning of layout
			avoidOverlap: true, // if true, prevents overlap of node bounding boxes
			handleDisconnected: true, // if true, avoids disconnected components from overlapping
			convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
			nodeSpacing: function (node) { return 10; }, // extra spacing around nodes
			flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
			alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }
			gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]
			edgeLength: undefined, // sets edge length directly in simulation
			edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
			edgeJaccardLength: undefined, // jaccard edge length in simulation
			unconstrIter: undefined, // unconstrained initial layout iterations
			userConstIter: undefined, // initial layout iterations with user-specified constraints
			allConstIter: undefined, // initial layout iterations with all constraints including non-overlap
			infinite: false // overrides all other options for a forces-all-the-time mode
		};
		let options = {
			name: 'cola',
			convergenceThreshold: 100,
			boundingBox: { x1: 20, y1: 20, w: 200, h: 200 },
		};
		copyKeys(options, defaults);
		console.log(defaults.boundingBox)
		this.cy.layout(defaults).run();
	}
	cola() { this.cy.layout({ name: 'cola' }).run(); }
	cose() { this.cy.layout({ name: 'cose', animate: 'end' }).run(); }
	euler() { this.cy.layout({ name: 'euler', fit: true, padding: 25, animate: 'end' }).run(); }
	fcose() {
		var defaultOptions = {
			quality: "default",
			randomize: true,
			animate: true,
			animationDuration: 500,
			animationEasing: undefined,
			fit: true,
			padding: 30,
			nodeDimensionsIncludeLabels: false,
			uniformNodeDimensions: false,
			packComponents: true,
			step: "all",
			/* spectral layout options */
			samplingType: true,
			sampleSize: 25,
			nodeSeparation: 75,
			piTol: 0.0000001,
			/* incremental layout options */
			nodeRepulsion: node => 4500,
			idealEdgeLength: edge => 50,
			edgeElasticity: edge => 0.45,
			nestingFactor: 0.1,
			numIter: 2500,
			tile: true,
			tilingPaddingVertical: 10,
			tilingPaddingHorizontal: 10,
			gravity: 0.25,
			gravityRangeCompound: 1.5,
			gravityCompound: 1.0,
			gravityRange: 3.8,
			initialEnergyOnIncremental: 0.3,
			/* constraint options */
			fixedNodeConstraint: undefined,
			alignmentConstraint: undefined,
			relativePlacementConstraint: undefined,
			/* layout event callbacks */
			ready: () => { }, // on layoutready
			stop: () => { }, // on layoutstop
			name: 'fcose',
		};
		this.cy.layout(defaultOptions).run(); //{name: 'fcose'}).run(); 
	}
	gridLayout() { this.cy.layout({ name: 'grid', animate: true }).run(); }
	presetLayout_dep() {
		let hasCenterProp = this.setPositionData();
		if (!hasCenterProp) {
			console.log('no positions are preset: store first!');
		} else {
			let options = {
				name: 'preset',
				positions: undefined, //function (n){return this.getNode(n.id()).data().center;}, //this.posDict, //undefined, // undefined, // map of (node id) => (position obj); or function(node){ return somPos; }
				zoom: undefined, // the zoom level to set (prob want fit = false if set)
				pan: undefined, // the pan level to set (prob want fit = false if set)
				fit: true, // whether to fit to viewport
				padding: 30, // padding on fit
				animate: true, // whether to transition the node positions
				animationDuration: 500, // duration of animation in ms if enabled
				animationEasing: undefined, // easing of animation if enabled
				animateFilter: function (node, i) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
				ready: undefined, // callback on layoutready
				stop: undefined, // callback on layoutstop
				transform: function (node, position) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
			};
			this.cy.layout(options);
			this.reset();
		}
	}
	presetLayout() {
		this.retrievePositions('prest');
		this.cy.layout({ name: 'preset' }).run();
		this.center();
	}
	randomLayout() { this.cy.layout({ name: 'random', animate: 'true' }).run(); }
	klay() {
		let klayDefaults = {
			addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
			aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
			borderSpacing: 20, // Minimal amount of space to be left to the border
			compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
			crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
			/* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
			INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
			cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
			/* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
			INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values.*/
			direction: 'UNDEFINED', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
			/* UNDEFINED, RIGHT, LEFT, DOWN, UP */
			edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
			edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
			feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
			fixedAlignment: 'NONE', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
			/* NONE Chooses the smallest layout from the four possible candidates.
			LEFTUP Chooses the left-up candidate from the four possible candidates.
			RIGHTUP Chooses the right-up candidate from the four possible candidates.
			LEFTDOWN Chooses the left-down candidate from the four possible candidates.
			RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
			BALANCED Creates a balanced layout from the four possible candidates. */
			inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
			layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
			linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
			mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
			mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
			nodeLayering: 'NETWORK_SIMPLEX', // Strategy for node layering.
			/* NETWORK_SIMPLEX This algorithm tries to minimize the length of edges. This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a result yet can be set with the Maximal Iterations option.
			LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
			INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
			nodePlacement: 'BRANDES_KOEPF', // Strategy for Node Placement
			/* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
			LINEAR_SEGMENTS Computes a balanced placement.
			INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
			SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
			randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
			routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
			separateConnectedComponents: true, // Whether each connected component should be processed separately
			spacing: 20, // Overall setting for the minimal amount of space to be left between objects
			thoroughness: 7 // How much effort should be spent to produce a nice layout..
		};
		var options = {
			nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
			fit: true, // Whether to fit
			padding: 20, // Padding on fit
			animate: true, // Whether to transition the node positions
			animateFilter: function (node, i) { return true; }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
			animationDuration: 500, // Duration of animation in ms if enabled
			animationEasing: undefined, // Easing of animation if enabled
			transform: function (node, pos) { return pos; }, // A function that applies a transform to the final node position
			ready: this.reset.bind(this), // Callback on layoutready
			stop: undefined, // Callback on layoutstop
			klay: {
				addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
				aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
				borderSpacing: 20, // Minimal amount of space to be left to the border
				compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
				crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
				cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
				direction: 'UNDEFINED', // Overall direction of edges: /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
				edgeRouting: 'ORTHOGONAL', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
				edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
				feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
				fixedAlignment: 'NONE', // node placer alignment: NONE | LEFTUP | RIGHTUP | LEFTDOWN | RIGHTDOWN | BALANCED
				inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
				layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
				linearSegmentsDeflectionDampening: 0.3,// 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
				mergeEdges: false, // Edges that have no ports are merged so they touch the connected nodes at the same points.
				mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
				nodeLayering: 'NETWORK_SIMPLEX', // Strategy for node layering NETWORK_SIMPLEX (expensive!) | LONGEST_PATH | INTERACTIVE comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
				nodePlacement: 'INTERACTIVE', // Strategy for Node Placement BRANDES_KOEPF | LINEAR_SEGMENTS | INTERACTIVE | SIMPLE
				/* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
				LINEAR_SEGMENTS Computes a balanced placement.
				INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
				SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
				randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
				routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
				separateConnectedComponents: true, // Whether each connected component should be processed separately
				spacing: 20, // Overall setting for the minimal amount of space to be left between objects
				thoroughness: 3 // How much effort should be spent to produce a nice layout..
			},
			name: 'klay',
			priority: function (edge) { return null; }, // Edges with a non-nil value are skipped when greedy edge cycle breaking is enabled
		};
		this.cy.layout(options).run();
	}
	retrievePositions(key) {
		if (nundef(key)) key = 'prest';
		let di = this.posDict[key];
		for (const n of this.getNodes()) {
			let id = n.id();
			let pos = di[id];
			if (isdef(pos)) this.setPosition(id, pos.x, pos.y);
		}
	}
	storePositions(key, poslist = []) {
		if (nundef(key)) key = 'prest';
		this.posDict[key] = {};
		let i = 0;
		for (const n of this.getNodes()) {
			let id = n.id();
			let pos = valf(poslist[i], this.getPosition(id));
			i += 1;
			this.posDict[key][id] = pos;
		}
	}
	storeSizes(key, poslist = []) {
		if (nundef(key)) key = 'size';
		this.posDict[key] = {};
		let i = 0;
		for (const n of this.getNodes()) {
			let id = n.id();
			let pos = valf(poslist[i], this.getSize(id));
			i += 1;
			this.posDict[key][id] = pos;
		}
	}
	fit() { this.cy.fit(); }
	center() { this.cy.center(); } //console.log('bb:', this.cy.elements().bb()); }
	reset() { this.pan0(); this.zoom1(); this.center(); this.fit(); }
	pan0() { this.cy.pan({ x: 0, y: 0 }); }
	zoom1() { this.cy.zoom(1); }
	isPan() { return this.cy.panningEnabled(); }
	isZoom() { return this.cy.zoomingEnabled(); }
	enablePanZoom() { this.pan(true); this.zoom(true); }
	pan(isOn, reset = true) {
		this.cy.panningEnabled(isOn);
		this.cy.userPanningEnabled(isOn);
		if (!isOn && reset) { this.pan0(); this.center(); }
	}
	zoom(isOn, minZoom = .25, maxZoom = 1, reset = true) {
		this.cy.zoomingEnabled(isOn);
		this.cy.userZoomingEnabled(isOn);
		if (!isOn && reset) { this.zoom1(); this.center(); }
		else if (isOn) { this.cy.minZoom(minZoom); this.cy.maxZoom(maxZoom); }
	}
	setSizeToContent() {
		this.cy.zoomingEnabled(false);
		this.updateBounds();
	}
	updateBounds() {
		var bounds = this.cy.elements().boundingBox();
		let dContainer = this.live.dCy;
		dContainer.css('height', bounds.h + 100);
		dContainer.css('width', bounds.w + 100);
		this.cy.center();
		this.cy.resize();
		dContainer.cytoscapeEdgehandles('resize');
	}
	enableDD() { this.enableDragging(); }
	disableDD() { this.disableDragging(); }
	enableDragging() { this.cy.nodes().grabify(); }
	disableDragging() { this.cy.nodes().ungrabify(); }
	showGraph() { }
	showControls(dWhere, lWhich) {
		if (!this.hasControls) this.addLayoutControls(dWhere, lWhich);
		if (nundef(dWhere)) dWhere = iDiv(this);
	}
	showExtent() { let bb = this.cy.elements().bb(); console.log('graph size:', bb.w, bb.h); }
	showSize() { this.showExtent(); }
	hideGraph() { }
	hideControls() { }
	mount() { }
	unmount() { }
	closeLayoutControls() { if (isdef(this.sb)) hide(this.sb); }
	addLayoutControls(dParent, buttonlist) {
		if (nundef(dParent)) dParent = iDiv(this);
		let buttons = {
			BFS: mButton('BFS', () => this.breadthfirst(), dParent, {}, ['tbb']),
			circle: mButton('circle', () => this.circle(), dParent, {}, ['tbb']),
			CC: mButton('CC', () => this.concentric(), dParent, {}, ['tbb']),
			cola: mButton('cola', () => this.comcola(), dParent, {}, ['tbb']),
			cose: mButton('cose', () => this.cose(), dParent, {}, ['tbb']),
			euler: mButton('euler', () => this.euler(), dParent, {}, ['tbb']),
			fcose: mButton('fcose', () => this.fcose(), dParent, {}, ['tbb']),
			grid: mButton('grid', () => this.gridLayout(), dParent, {}, ['tbb']),
			klay: mButton('klay', () => this.klay(), dParent, {}, ['tbb']),
			prest: mButton('prest', () => this.presetLayout(), dParent, {}, ['tbb']),
			rand: mButton('rand', () => this.randomLayout(), dParent, {}, ['tbb']),
			center: mButton('center', () => this.center(), dParent, {}, ['tbb']),
			fit: mButton('fit', () => this.fit(), dParent, {}, ['tbb']),
			reset: mButton('reset', () => this.reset(), dParent, {}, ['tbb']),
			show: mButton('show', () => this.showGraph(), dParent, {}, ['tbb']),
			hide: mButton('hide', () => this.hideGraph(), dParent, {}, ['tbb']),
			store: mButton('store', () => this.storeCurrentPositions(), dParent, {}, ['tbb']),
		};
		for (const b in buttons) {
			if (isdef(buttonlist) && !buttonlist.includes(b)) hide(buttons[b]);
		}
		return buttons;
	}
	addVisual(dParent, styles = {}) {
		if (this.hasVisual) return;
		this.hasVisual = true;
		this.id = nundef(dParent.id) ? getUID() : dParent.id;
		let styleDict = {
			node: { 'width': 25, 'height': 25, 'background-color': 'red', "color": "#fff", 'label': 'data(id)', "text-valign": "center", "text-halign": "center", },
			edge: { 'width': 2, 'line-color': 'silver', 'curve-style': 'haystack', },
			'node.highlight': { 'background-color': 'yellow' },
			'node.trans': { 'opacity': '0.5' },
		}
		for (const ks of ['node', 'edge', 'node.highlight', 'node.trans']) {
			if (isdef(styles[ks])) {
				for (const k in styles[ks]) {
					let [prop, val] = translateToCssStyle(k, styles[ks][k], false);
					styleDict[ks][prop] = val;
				}
			}
		}
		let cyStyle = [];
		for (const k in styleDict) { cyStyle.push({ selector: k, style: styleDict[k] }); }
		let size = getSize(dParent);
		let d1 = mDiv(dParent, { position: 'relative', bg: 'green', w: size.w, left: 0, top: 0, h: size.h, align: 'left' });
		this.cy.mount(d1);
		this.cy.style(cyStyle);
		this.enablePanZoom();
		iAdd(this, { div: dParent, dCy: d1 });
	}
	nodeEvent(evname, handler) { this.cy.on(evname, 'node', ev => handler(ev.target)); }
	mStyle(elid, styles, group = 'node') {
		if (isString(elid)) elid = this.cy.getElementById(elid);
		let di = translateStylesToCy(styles, group);
		for (const k in di) {
			elid.style(k, di[k]);
		}
	}
	setLabel(id, label, styles) {
		let ele = this.cy.getElementById(id);
		ele.data('label', label);
		this.mStyle(id, styles, isdef(this.getNode(id)) ? 'node' : 'edge');
	}
	setStyle(elid, prop, val) {
		if (isString(elid)) elid = this.cy.getElementById(elid);
		elid.style(prop, val);
	}
	setClass(elid, className) {
		if (isString(elid)) elid = this.cy.getElementById(elid);
		elid.class(className);
	}
}
class MazeGraph extends AGraph {
	constructor(dParent, rows, cols, sz, gap = 4) {
		super();
		[this.cols, this.rows, this.sz, this.gap] = [cols, rows, sz, gap];
		let m = this.m = this.createMaze(cols, rows, sz, gap);
		let dMaze = this.dMaze = this.createDiv(dParent, cols, rows, sz, gap);
		let szMaze = getSize(dMaze);
		let dGraph = this.dGraph = mDiv(dParent, { align: 'left', w: szMaze.w, h: szMaze.h, bg: 'pink', maleft: 20 }, 'd_graph');//, opacity: 0 });
		this.mazeId = dGraph.id = getUID();
		let sb = this.sb = mDiv(dParent, { w: 40 }); mCenterCenterFlex(this.sb);
		hide(dGraph); hide(sb);
		this.items = this.createCellItems();
	}
	clear() { super.clear(); } //dTable.firstChild.remove(); } //mBy(this.mazeId).remove();}
	getTopLeftCell() { return this.getCell(0, 0); }
	getTopRightCell() { return this.getCell(0, this.cols - 1); }
	getBottomLeftCell() { return this.getCell(this.rows - 1, 0); }
	getBottomRightCell() { return this.getCell(this.rows - 1, this.cols - 1); }
	getCell(row, col) { return this.matrix[row][col]; }// mBy(this.getCommonIdTable(row, col)); }
	getCommonId(row, col) { return '' + row + "-" + col; }
	getCommonIdTable(row, col) { return 'td_' + this.getCommonId(row, col); }
	getRCI(edgeId) {
		let [r1, c1, r2, c2] = allNumbers(edgeId).map(x => Math.abs(x));	//console.log('r,c 1:',r1,c1,'\nr,c 2:',r2,c2);
		let i1, i2; //indices that have to be switched form 1 to 0
		i1 = r1 < r2 ? 2 : r1 > r2 ? 0 : c1 < c2 ? 1 : 3;
		i2 = i1 == 0 ? 2 : i1 == 1 ? 3 : i1 == 2 ? 0 : 1;
		return [r1, c1, i1, r2, c2, i2];
	}
	getRelativeDirections(item1, item2) {
		let [r1, c1, r2, c2] = [item1.row, item1.col, item2.row, item2.col];//allNumbers(edgeId).map(x=>Math.abs(x));	//console.log('r,c 1:',r1,c1,'\nr,c 2:',r2,c2);
		let i1, i2; //indices that have to be switched form 1 to 0
		i1 = r1 < r2 ? 2 : r1 > r2 ? 0 : c1 < c2 ? 1 : 3;
		i2 = i1 == 0 ? 2 : i1 == 1 ? 3 : i1 == 2 ? 0 : 1;
		return [i1, i2];
	}
	createCellItems() {
		let items = [];
		this.matrix = [];
		for (let r = 0; r < this.rows; r++) {
			this.matrix[r] = [];
			for (let c = 0; c < this.cols; c++) {
				let id = this.getCommonId(r, c);
				let item = { id: id, nid: id, nodeId: id, cellId: this.getCommonIdTable(r, c), row: r, col: c, sz: this.sz, marr: this.m[r, c] };
				delete Items[id];
				iAdd(item, { div: mBy(this.getCommonIdTable(r, c)) });
				items.push(item);
				this.matrix[r][c] = item;
			}
		}
		return items;
	}
	createDiv(dParent, cols, rows, sz, gap = 1) {
		let [wCell, hCell] = [sz, sz];
		let [wTotal, hTotal] = [cols * (wCell + gap) + gap, rows * (hCell + gap) + gap];
		let dGridOuter = this.dMaze = mDiv(dParent, { wmin: wTotal, hmin: hTotal, position: 'relative' });
		let m = this.m;
		let [x, y] = [0, 0];
		let sBorder = `${gap}px solid black`;
		let noBorder = `${gap}px solid transparent`;
		this.dCells = [];
		for (var r = 0; r < m.length; r++) {
			x = 0;
			this.dCells[r] = [];
			for (var c = 0; c < m[r].length; c++) {
				let info = m[r][c];
				let dCell = mDiv(dGridOuter, { w: wCell, h: hCell, position: 'absolute', top: y, left: x, bg: 'gray' });
				dCell.id = this.getCommonIdTable(r, c);
				dCell.style.borderTop = info[0] == 0 ? sBorder : noBorder;
				dCell.style.borderRight = info[1] == 0 ? sBorder : noBorder;
				dCell.style.borderBottom = info[2] == 0 ? sBorder : noBorder;
				dCell.style.borderLeft = info[3] == 0 ? sBorder : noBorder;
				x += wCell + gap;
				this.dCells[r].push(dCell);
			}
			y += hCell + gap;
		}
		return dGridOuter;
	}
	createDiv_orig(dParent, cols, rows, sz, gap) {
		let [wCell, hCell] = [sz, sz];
		let [wTotal, hTotal] = [cols * (wCell + gap), rows * (hCell + gap)];
		let dGridOuter = this.dMaze = mDiv(dParent, { wmin: wTotal, hmin: hTotal });
		let m = this.m;
		let id = 'tMaze';
		setCSSVariable('--wCell', `${wCell}px`);
		setCSSVariable('--hCell', `${hCell}px`);
		let tMaze = createElementFromHtml(`
			<table id="${id}">
			<tbody></tbody>
			</table>
		`);
		mAppend(dGridOuter, tMaze);
		let sBorder = `${1}px solid black`;
		for (var i = 0; i < m.length; i++) {
			$('#tMaze > tbody').append("<tr>");
			for (var j = 0; j < m[i].length; j++) {
				var selector = this.getCommonIdTable(i, j);
				$('#tMaze > tbody').append("<td id='" + selector + "'>&nbsp;</td>");
				if (m[i][j][0] == 0) { $('#' + selector).css('border-top', sBorder); }
				if (m[i][j][1] == 0) { $('#' + selector).css('border-right', sBorder); }
				if (m[i][j][2] == 0) { $('#' + selector).css('border-bottom', sBorder); }
				if (m[i][j][3] == 0) { $('#' + selector).css('border-left', sBorder); }
			}
			$('tMmaze > tbody').append("</tr>");
		}
		return dGridOuter;
	}
	createMaze(cols, rows, sz, gap) {
		var dxy = sz + 2 * gap;
		var offs = dxy / 2 + gap;
		var totalCells = cols * rows;
		var cells = new Array();
		var unvis = new Array();
		for (var i = 0; i < rows; i++) {
			cells[i] = new Array();
			unvis[i] = new Array();
			for (var j = 0; j < cols; j++) {
				cells[i][j] = [0, 0, 0, 0];
				let pos = { x: offs + dxy * j, y: offs + dxy * i };
				this.addNode({ id: this.getCommonId(i, j), row: i, col: j, center: pos }, pos);
				unvis[i][j] = true;
			}
		}
		var currentCell = [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
		var path = [currentCell];
		unvis[currentCell[0]][currentCell[1]] = false;
		var visited = 1;
		while (visited < totalCells) {
			var pot = [[currentCell[0] - 1, currentCell[1], 0, 2],
			[currentCell[0], currentCell[1] + 1, 1, 3],
			[currentCell[0] + 1, currentCell[1], 2, 0],
			[currentCell[0], currentCell[1] - 1, 3, 1]];
			var neighbors = new Array();
			for (var l = 0; l < 4; l++) {
				if (pot[l][0] > -1 && pot[l][0] < rows && pot[l][1] > -1 && pot[l][1] < cols && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
			}
			if (neighbors.length) {
				let next = neighbors[Math.floor(Math.random() * neighbors.length)];
				cells[currentCell[0]][currentCell[1]][next[2]] = 1;
				cells[next[0]][next[1]][next[3]] = 1;
				let row = currentCell[0];
				let col = currentCell[1];
				let row2 = next[0];
				let col2 = next[1];
				this.addEdge(this.getCommonId(row, col), this.getCommonId(row2, col2), {});
				unvis[next[0]][next[1]] = false;
				visited++;
				currentCell = [next[0], next[1]];
				path.push(currentCell);
			}
			else {
				currentCell = path.pop();
			}
		}
		return cells;
	}
	setItemBorder(item, dir) {
		let prop = getBorderPropertyForDirection(dir);
		iDiv(item).style[prop] = `${this.gap}px solid black`;
	}
	setItemColor(item, color) { mStyle(iDiv(item), { bg: color }); }
	setItemContent(item, text) { iDiv(item).innerHTML = text; }
	removeItemContent(item) { iDiv(item).innerHTML = ''; }
	disconnectCells(nid1, nid2) {
		this.removeEdge(this.getCommonEdgeId(nid1, nid2));
		let [item1, item2] = [Items[nid1], Items[nid2]];
		let [dir1, dir2] = this.getRelativeDirections(item1, item2);
		this.setItemBorder(item1, dir1);
		this.setItemBorder(item2, dir2);
	}
	cutPath(path, min, max) {
		let edges = path.edges();
		let len = edges.length;
		let [imin, imax] = [Math.floor(len * min), Math.floor(len * max)];
		let i = randomNumber(imin, imax);
		let edge = edges[i];
		let [nid1, nid2] = edge.connectedNodes().map(x => x.id());
		this.disconnectCells(nid1, nid2);
	}
	breadCrumbs(path, color = 'sienna', sz = 10) {
		for (const cell of path.nodes().map(x => Items[x.id()])) {
			mCellContent(iDiv(cell), { w: sz, h: sz, bg: color, fg: 'white', rounding: '50%' });
		}
	}
	colorComponents() {
		let comps = this.getComponents();
		let wheel = getColorWheel('red', comps.length);
		let i = 0;
		for (const comp of comps) {
			this.breadCrumbs(comp, wheel[i]); i += 1;
		}
	}
	showGraph() {
		this.dGraph.style.opacity = 1;
		if (this.hasVisual) { show(this.dGraph); return; }
		this.addVisual(this.dGraph);
		this.storeCurrentPositions();
		this.addLayoutControls(this.sb, ['show', 'hide', 'prest', 'grid', 'klay', 'rand', 'euler', 'reset', 'store']);//,'grid','euler','prest');		
	}
	hideGraph() {
		if (isdef(this.dGraph) && this.hasVisual) {
			this.dGraph.style.display = 'none';
		}
	}
}
class Card52 {
	static toString(c) { return c.rank + ' of ' + c.suit; }
	static _getKey(i) {
		if (i >= 52) return 'card_J1';
		let rank = Card52.getRank(i);
		let suit = Card52.getSuit(i);
		return 'card_' + rank + suit;
	}
	static _fromKey(k) {
		let ranks = 'A23456789TJQK';
		let suits = 'SHDC';
		let ir = ranks.indexOf(k[0]); //=> zahl zwischen 0 und 12
		let is = suits.indexOf(k[1]); //=> zahle zwischen 0 und 3
		return is * 13 + ir;
	}
	static getRankValue(i) { if (nundef(i)) return null; let r = i % 13; return r == 0 ? 12 : r - 1; }
	static getRank(i) {
		let rank = (i % 13);
		if (rank == 0) rank = 'A';
		else if (rank >= 9) rank = ['T', 'J', 'Q', 'K'][rank - 9];
		else rank = rank + 1;
		return rank;
	}
	static getSuit(i) {
		let s = ['S', 'H', 'D', 'C'][divInt(i, 13)];
		return s;
	}
	static getShortString(c) { return c.suit + c.rank; }
	static turnFaceDown(c, color) {
		if (!c.faceUp) return;
		let svgCode = C52.card_2B; //C52 is cached asset loaded in _start
		c.div.innerHTML = svgCode;
		if (isdef(color)) c.div.children[0].children[1].setAttribute('fill', color);
		c.faceUp = false;
	}
	static turnFaceUp(c) {
		if (c.faceUp) return;
		c.div.innerHTML = C52[c.key];
		c.faceUp = true;
	}
	static fromSR(sr, h) { return Card52.fromShortString(sr, h); }
	static fromShortString(sr, h) {
		let key = sr[1].toUpperCase() + sr[0].toUpperCase();
		let i = Card52._fromKey(key);
		console.log('card from ', sr, 'is', key, 'i', i)
		return Card52.getItem(i, h);
	}
	static get(sr, h) { return Card52.fromSR(sr, h); }
	static getItem(i, h = 110, w) {
		if (nundef(w)) w = h * .7;
		if (nundef(i)) i = randomNumber(0, 51);
		if (isString(i) && i.length == 2) { i = Card52._fromKey(i[1].toUpperCase() + i[0].toUpperCase()); }
		let c = Card52._createUi(i, undefined, w, h);
		c.i = c.val = i;
		return c;
	}
	static _createUi(irankey, suit, w, h) {
		let rank = irankey;
		if (nundef(irankey) && nundef(suit)) {
			[rank, suit] = Card52.randomRankSuit();
		} else if (nundef(irankey)) {
			irankey = '2';
			suit = 'B';
		} else if (nundef(suit)) {
			if (isNumber(irankey)) irankey = Card52._getKey(irankey);
			rank = irankey[5];
			suit = irankey[6];
		}
		if (rank == '10') rank = 'T';
		if (rank == '1') rank = 'A';
		if (nundef(suit)) suit = 'H'; else suit = suit[0].toUpperCase(); //joker:J1,J2, back:1B,2B
		let cardKey = 'card_' + rank + suit;
		let svgCode = C52[cardKey]; //C52 is cached asset loaded in _start
		svgCode = '<div>' + svgCode + '</div>';
		let el = mCreateFrom(svgCode);
		if (isdef(h) || isdef(w)) { mSize(el, w, h); }
		return { rank: rank, suit: suit, key: cardKey, div: el, w: w, h: h, faceUp: true }; //this is a card!
	}
	static random() { return Card52.getItem(randomNumber(0, 51)); }
	static randomRankSuit() {
		let c = Card52.random();
		return [c.rank, c.suit];
	}
	static show(icard, dParent, h = 110, w = undefined) {
		if (isNumber(icard)) {
			if (nundef(w)) w = h * .7;
			icard = Card52.getItem(icard, h, w);
		}
		mAppend(dParent, icard.div);
	}
}
class DeckClass {
	constructor(f) { this.data = []; if (isdef(f)) if (isString(f)) this['init' + f](); else if (isList(f)) this.init(f); }
	init(arr) { this.data = arr; }
	initEmpty() { this.data = []; }
	initNumber(n, shuffled = true) { this.initTest(n, shuffled); }
	initTest(n, shuffled = true) { this.data = range(0, n - 1); if (shuffled) this.shuffle(); }
	init52(shuffled = true, jokers = 0) { this.data = range(0, 51 + jokers); if (shuffled) this.shuffle(); }
	init52_double(shuffled = true, jokers = 0) { this.data = range(0, 103 + jokers); if (shuffled) this.shuffle(); }
	init52_no_suits(n = 4, shuffled = true, jokers = 0) { this.data = range(0, 13 * n + jokers - 1); if (shuffled) this.shuffle(); }
	initRandomHand52(n) { this.data = choose(range(0, 51), n); }
	addTop(i) { this.data.push(i); return this; }
	addBottom(i) { this.data.unshift(i); return this; }
	bottom() { return this.data[0]; }
	cards() { return this.data; }
	count() { return this.data.length; }
	clear() { this.data = []; }
	deal(n) { return this.data.splice(0, n); }
	dealDeck(n) { let d1 = new DeckClass(); d1.init(this.data.splice(0, n)); return d1; }
	popTop() { return this.data.pop(); }
	popBottom() { return this.data.shift(); }
	remTop() { this.data.pop(); return this; }
	remBottom() { this.data.shift(); return this; }
	remove(i) { removeInPlace(this.data, i); return this; }
	removeAtIndex(i) { return this.data.splice(i, 1)[0]; }
	removeFromIndex(i, n) { return this.data.splice(i, n); }
	setData(arr, shuffled = false) { this.data = arr; if (shuffled) this.shuffle(); }
	sort() {
		this.data.sort((a, b) => Number(a) - Number(b));
		return this;
	}
	shuffle() { shuffle(this.data); return this; }
	top() { return arrLast(this.data); }
	toString() { return this.data.toString(); }//.join(','); }
}
class Cardz {
	static toString(c) { return c.rank + ' of ' + c.suit; }
	static _getKey(i) {
		if (i >= 52) return 'card_J1';
		let rank = Card52.getRank(i);
		let suit = Card52.getSuit(i);
		return 'card_' + rank + suit;
	}
	static _fromKey(k) {
		let ranks = 'A23456789TJQK';
		let suits = 'SHDC';
		let i_rank = ranks.indexOf(k[0]); //=> zahl zwischen 0 und 12
		let i_suit = suits.indexOf(k[1]); //=> zahle zwischen 0 und 3
		return i_suit * ranks.length + i_rank;
	}
	static getRankValue(i) { if (nundef(i)) return null; let r = i % 13; return r == 0 ? 12 : r - 1; }
	static getRank(i) {
		let rank = (i % 13);
		if (rank == 0) rank = 'A';
		else if (rank >= 9) rank = ['T', 'J', 'Q', 'K'][rank - 9];
		else rank = rank + 1;
		return rank;
	}
	static getSuit(i) {
		let s = ['S', 'H', 'D', 'C'][divInt(i, 13)];
		return s;
	}
	static getShortString(c) { return c.suit + c.rank; }
	static turnFaceDown(c, color) {
		if (!c.faceUp) return;
		let svgCode = C52.card_2B; //C52 is cached asset loaded in _start
		c.div.innerHTML = svgCode;
		if (isdef(color)) c.div.children[0].children[1].setAttribute('fill', color);
		c.faceUp = false;
	}
	static turnFaceUp(c) {
		if (c.faceUp) return;
		c.div.innerHTML = C52[c.key];
		c.faceUp = true;
	}
	static fromSR(sr) { return Card52.fromShortString(sr); }
	static fromShortString(sr) {
		let key = sr[1].toUpperCase() + sr[0].toUpperCase();
		let i = Card52._fromKey(key);
		console.log(key, 'i', i)
		return Card52.getItem(i);
	}
	static getItem(i, h = 110, w) {
		if (nundef(w)) w = h * .7;
		if (nundef(i)) i = randomNumber(0, 51);
		if (isString(i) && i.length == 2) { i = Card52._fromKey(i[1].toUpperCase() + i[0].toUpperCase()); }
		let c = Card52._createUi(i, undefined, w, h);
		c.i = c.val = i;
		return c;
	}
	static _createUi(irankey, suit, w, h) {
		let rank = irankey;
		if (nundef(irankey) && nundef(suit)) {
			[rank, suit] = Card52.randomRankSuit();
		} else if (nundef(irankey)) {
			irankey = '2';
			suit = 'B';
		} else if (nundef(suit)) {
			if (isNumber(irankey)) irankey = Card52._getKey(irankey);
			rank = irankey[5];
			suit = irankey[6];
		}
		if (rank == '10') rank = 'T';
		if (rank == '1') rank = 'A';
		if (nundef(suit)) suit = 'H'; else suit = suit[0].toUpperCase(); //joker:J1,J2, back:1B,2B
		let cardKey = 'card_' + rank + suit;
		let svgCode = C52[cardKey]; //C52 is cached asset loaded in _start
		svgCode = '<div>' + svgCode + '</div>';
		let el = mCreateFrom(svgCode);
		if (isdef(h) || isdef(w)) { mSize(el, w, h); }
		return { rank: rank, suit: suit, key: cardKey, div: el, w: w, h: h, faceUp: true }; //this is a card!
	}
	static random() { return Card52.getItem(randomNumber(0, 51)); }
	static randomRankSuit() {
		let c = Card52.random();
		return [c.rank, c.suit];
	}
	static show(icard, dParent, h = 110, w = undefined) {
		if (isNumber(icard)) {
			if (nundef(w)) w = h * .7;
			icard = Card52.getItem(icard, h, w);
		}
		mAppend(dParent, icard.div);
	}
}
class Deck1 extends Array {
	initTest(n, shuffled = true) { range(0, n).map(x => this.push(Card52.getItem(x))); if (shuffled) this.shuffle(); }
	initEmpty() { }
	init52(shuffled = true, jokers = 0) {
		range(0, 51 + jokers).map(x => this.push(Card52.getItem(x)));
		if (shuffled) this.shuffle();
	}
	add(otherDeck) { while (otherDeck.length > 0) { this.unshift(otherDeck.pop()); } return this; }
	count() { return this.length; }
	static transferTopFromToBottom(d1, d2) { let c = d1.pop(); d2.putUnderPile(c); return c; }
	deal(n) { return this.splice(0, n); }
	getIndices() { return this.map(x => x.i); }
	log() { console.log(this); }
	putUnderPile(x) { this.push(x); }
	putOnTop(x) { this.unshift(x); }
	showDeck(dParent, splay, ovPercent = 0, faceUp = undefined, contStyles = {}) {
		if (isdef(faceUp)) { if (faceUp == true) this.turnFaceUp(); else this.turnFaceDown(); }
		splayout(this, dParent, contStyles, ovPercent, splay);
	}
	shuffle() { shuffle(this); }
	topCard() { return this[this.length - 1]; }
	turnFaceUp() {
		if (isEmpty(this) || this[0].faceUp) return;
		this.map(x => Card52.turnFaceUp(x));
	}
	turnFaceDown() {
		if (isEmpty(this) || !this[0].faceUp) return;
		this.map(x => Card52.turnFaceDown(x));
	}
}
class Karte {
	static random(sym = 'bee', h = 220) {
		return Karte.get(sym, h);
		return Card52.random();
	}
	static c1(info, n, fg, h, w) {
		let d = mDiv();
		let svg = mgTag('svg', d, { class: 'card', face: '2C', height: '100%', width: '100%', preserveAspectRatio: 'none', viewBox: "-120 -168 240 336" });
		let g = mgTag('g', svg);
		let rect = mgTag('rect', g, { width: 239, height: 335, x: -120, y: 168, rx: 12, ry: 12, fill: "white", stroke: "black" });
		let t = mgTag('text', g, { 'text-anchor': "middle", 'dominant-baseline': "middle", x: 0, y: 0, fill: fg }, { fz: 1000 }, 'HALLO');
		if (nundef(w)) w = h * .7;
		if (isdef(h) || isdef(w)) { mSize(d, w, h); }
		console.log('d', d)
		return { key: getUID(), div: d, w: w, h: h, faceUp: true }; //this is a card!
	}
	static card(info, n, fg, h, w) {
		let x = `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
			face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
			<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>				
			</symbol>
			<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>				
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>`;
		let h1 = { xs: 24, s: 27, m: 42, l: 60, xl: 70, xxl: 100 };
		let left = [0, 50, 100, 120];
		let upperLeftNumber = `<use xlink:href="#${fg}${n}" height="42" x="-120" y="-156"></use>`
			`<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
			<g transform="rotate(180)">
				<use xlink:href="#${fg}${n}" height="42" x="-120" y="-156"></use>
				<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
			</g>
		</svg>`;
		let svgCode = x;
		svgCode = '<div>' + svgCode + '</div>';
		let el = mCreateFrom(svgCode);
		if (nundef(w)) w = h * .7;
		if (isdef(h) || isdef(w)) { mSize(el, w, h); }
		return { key: getUID(), div: el, w: w, h: h, faceUp: true }; //this is a card!
	}
	static get52(suit, rank, fg, bg, h, w, faceUp) {
		let key = suit.toLowerCase();
		let di = {
			h: 'hearts', s: 'spades', p: 'spades', c: 'clubs', t: 'clubs', d: 'diamonds', k: 'diamonds',
			j: 'joker', '*': 'joker'
		};
		if (isdef(di[key])) key = di[key];
		let di2 = { spades: 'spade suit', hearts: 'heart suit', diamonds: 'diamond suit', clubs: 'club suit' };
		if (isdef(di2[key])) key = di2[key];
		let info = Syms[key];
		return Karte.get(key, 300, rank, fg);
		let fz = info.family == 'emoNoto' ? 750 : 1000;
	}
	static get(sym = 'bee', h = 110, n = 2, fg = 'indigo', w) {
		let info = Syms[sym];
		n = 2;
		ensureColorNames();
		if (nundef(fg)) fg = sym == 'spades' || sym == 'clubs' ? 'black' : sym == 'hearts' || sym == 'diamonds' ? 'red' : chooseRandom(Object.keys(ColorNames)); 
		let cardKey = info.family == 'emoNoto' ? 'card0' : 'card52';
		let basic = {
			card0: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
				face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
					<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
						<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-weight:bold;">${n}</text>				
					</symbol>
					<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
						<text text-anchor="middle" dominant-baseline="middle" x="0" y="-150" fill="red" style="font-size:750px;font-family:${info.family};">${info.text}</text>				
					</symbol>
					<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
					<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
					<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
					<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
					<g transform="rotate(180)">
						<use xlink:href="#${fg}${n}" height="42" x="-118" y="-156"></use>
						<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
						<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
					</g>
				</svg>`,
			card52: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
				face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
					<symbol id="${fg}${n}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
						<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="${fg}" style="font-size:1000px;font-family:opensans;">${n}</text>				
					</symbol>
					<symbol id="${info.E}" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
						<text text-anchor="middle" dominant-baseline="middle" x="0" y="50" fill="${fg}" style="font-size:800px;font-family:${info.family};">${info.text}</text>				
					</symbol>
					<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
					<use xlink:href="#${fg}${n}" height="40" x="-116.4" y="-156"></use>
					<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
					<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
					<g transform="rotate(180)">
						<use xlink:href="#${fg}${n}" height="40" x="-116.4" y="-156"></use>
						<use xlink:href="#${info.E}" height="26.769" x="-111.784" y="-119"></use>
						<use xlink:href="#${info.E}" height="70" x="-35" y="-135.588"></use>
					</g>
				</svg>`,
			card7: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
				face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
					<symbol id="VC2" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
						<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="red" style="font-size:750px;font-family:opensans;">A</text>				
					</symbol>
					<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
					<use xlink:href="#VC2" height="32" x="-114.4" y="-156"></use>
					<use xlink:href="#VC2" height="26.769" x="-111.784" y="-119"></use>
					<use xlink:href="#VC2" height="70" x="-35" y="-135.588"></use>
					<g transform="rotate(180)">
						<use xlink:href="#VC2" height="32" x="-114.4" y="-156"></use>
						<use xlink:href="#VC2" height="26.769" x="-111.784" y="-119"></use>
						<use xlink:href="#VC2" height="70" x="-35" y="-135.588"></use>
					</g>
				</svg>`,
			card6: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
				face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
					<symbol id="VC2" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
						<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="red" style="font-size:750px;font-family:opensans;">A</text>				
					</symbol>
					<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
					<use xlink:href="#VC2" height="32" x="-114.4" y="-156"></use>
				</svg>`,
			card5: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
				face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
					<symbol id="SC2" viewBox="-600 -600 1200 1200" preserveAspectRatio="xMinYMid">
						<path d="M30 150C35 385 85 400 130 500L-130 500C-85 400 -35 385 -30 150A10 10 0 0 0 -50 150A210 210 0 1 1 -124 -51A10 10 0 0 0 -110 -65A230 230 0 1 1 110 -65A10 10 0 0 0 124 -51A210 210 0 1 1 50 150A10 10 0 0 0 30 150Z" 
							fill="black">
						</path>
					</symbol>
					<symbol id="VC2" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
						<path d="M-225 -225C-245 -265 -200 -460 0 -460C 200 -460 225 -325 225 -225C225 -25 -225 160 -225 460L225 460L225 300" 
							stroke="black" stroke-width="80" stroke-linecap="square" stroke-miterlimit="1.5" fill="none">
						</path>
					</symbol>
					<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
					<use xlink:href="#VC2" height="32" x="-114.4" y="-156"></use>
					<use xlink:href="#SC2" height="26.769" x="-111.784" y="-119"></use>
					<use xlink:href="#SC2" height="70" x="-35" y="-135.588"></use>
					<g transform="rotate(180)">
						<use xlink:href="#VC2" height="32" x="-114.4" y="-156"></use>
						<use xlink:href="#SC2" height="26.769" x="-111.784" y="-119"></use>
						<use xlink:href="#SC2" height="70" x="-35" y="-135.588"></use>
					</g>
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="red" style="font-size:16px;font-family:opensans;">I love SVG!</text>				
					<text text-anchor="middle" dominant-baseline="hanging" x="0" y="-156" fill="blue" style="font-size:16px;font-family:opensans;">YES</text>				
					<text text-anchor="middle" dominant-baseline="hanging" x="0" y="-156" fill="green" transform="rotate(180)" style="font-size:16px;font-family:opensans;">YES</text>				
				</svg>`,
			card4: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
				face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
					<symbol id="VC2" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
						<text dominant-baseline="hanging" text-anchor="middle" x="0" y="0" fill="red" style="font-size:600px;font-family:${info.family};">${info.text}</text>				
					</symbol>
					<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
					<use xlink:href="#VC2" height="32" x="-114.4" y="-156" dominant-baseline="hanging" text-anchor="middle" ></use>
					<g transform="rotate(180)">
						<use xlink:href="#VC2" height="32" x="-114.4" y="-156" dominant-baseline="hanging" text-anchor="middle" ></use>
					</g>
					<text dominant-baseline="hanging" text-anchor="middle" x="0" y="0" fill="red" style="font-size:600px;font-family:${info.family};">${info.text}</text>				
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="red" style="font-size:16px;font-family:opensans;">I love SVG!</text>				
					<text text-anchor="middle" dominant-baseline="hanging" x="0" y="-156" fill="blue" style="font-size:16px;font-family:opensans;">YES</text>				
					<text text-anchor="middle" dominant-baseline="hanging" x="0" y="-156" fill="green" transform="rotate(180)" style="font-size:16px;font-family:opensans;">YES</text>				
				</svg>`,
			card3: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
				face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
					<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
					<text dominant-baseline="hanging" x="-114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
					<text  text-anchor="end" dominant-baseline="hanging" x="114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
					<text text-anchor="middle" dominant-baseline="hanging" x="0" y="-156" fill="blue" style="font-size:16px;font-family:opensans;">YES</text>				
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="red" style="font-size:16px;font-family:opensans;">I love SVG!</text>				
					<g transform="rotate(180)">
						<text dominant-baseline="hanging" x="-114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
						<text  text-anchor="end" dominant-baseline="hanging" x="114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
						<text text-anchor="middle" dominant-baseline="hanging" x="0" y="-156" fill="blue" style="font-size:16px;font-family:opensans;">YES</text>				
					</g>
				</svg>`,
			card2: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
				face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
					<symbol id="VC2" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
						<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="red" style="font-size:500px;font-family:${info.family};">${info.text}</text>				
					</symbol>
					<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
					<text dominant-baseline="hanging" x="-114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
					<text  text-anchor="end" dominant-baseline="hanging" x="114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
					<text text-anchor="middle" dominant-baseline="hanging" x="0" y="-156" fill="blue" style="font-size:16px;font-family:opensans;">YES</text>				
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="red" style="font-size:16px;font-family:opensans;">I love SVG!</text>				
					<g transform="rotate(180)">
						<text dominant-baseline="hanging" x="-114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
						<text  text-anchor="end" dominant-baseline="hanging" x="114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
						<text text-anchor="middle" dominant-baseline="hanging" x="0" y="-156" fill="blue" style="font-size:16px;font-family:opensans;">YES</text>				
					</g>
				</svg>`,
			card1: `
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" 
				face="2C" height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
					<symbol id="VC2">
					</symbol>
					<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
					<use xlink:href="#VC2" height="32" x="-114.4" y="-156"></use>
					<use xlink:href="#VC2" height="32" x="0" y="0"></use>
					<text text-anchor="middle" dominant-baseline="middle" x="0" y="0" fill="red" style="font-size:16px;font-family:opensans;">I love SVG!</text>				
					<g transform="rotate(180)">
						<text dominant-baseline="hanging" x="-114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
						<text text-anchor="end" dominant-baseline="hanging" x="114" y="-156" fill="red" style="font-size:30px;font-family:${info.family};">${info.text}</text>				
						<text text-anchor="middle" dominant-baseline="hanging" x="0" y="-156" fill="blue" style="font-size:16px;font-family:opensans;">YES</text>				
					</g>
				</svg>`
		};
		let svgCode = basic[cardKey];
		svgCode = '<div>' + svgCode + '</div>';
		let el = mCreateFrom(svgCode);
		if (nundef(w)) w = h * .7;
		if (isdef(h) || isdef(w)) { mSize(el, w, h); }
		return { key: getUID(), div: el, w: w, h: h, faceUp: true }; //this is a card!
	}
}
function _calc_hex_col_array(rows, cols) {
	let colarr = []; //how many cols in each row
	let even = rows % 2 == 0;
	for (let i = 0; i < rows; i++) {
		colarr[i] = cols;
		if (even && i < (rows / 2) - 1) cols += 1;
		else if (even && i > rows / 2) cols -= 1;
		else if (!even && i < (rows - 1) / 2) cols += 1;
		else if (!even || i >= (rows - 1) / 2) cols -= 1;
	}
	return colarr;
}
function _calc_hex_col_array_old(rows, cols) {
	let colarr = []; //how many cols in each row
	for (let i = 0; i < rows; i++) {
		colarr[i] = cols;
		if (i < (rows - 1) / 2) cols += 1;
		else cols -= 1;
	}
	return colarr;
}
function addRowsCols(items) {
	let byrc = {};
	let byx = sortBy(items, 'x');
	let c = 0, x = byx[0].x;
	for (let i = 0; i < byx.length; i++) {
		let item = byx[i];
		if (!isCloseTo(item.x, x, 2)) { c += 1; x = item.x; }
		item.col = c;
	}
	let byy = sortBy(items, 'y');
	let r = 0, y = byy[0].y;
	for (let i = 0; i < byy.length; i++) {
		let item = byy[i];
		if (!isCloseTo(item.y, y, 2)) { r += 1; y = item.y; }
		item.row = r;
		lookupSet(byrc, [item.row, item.col], item);
	}
	return byrc;
}
function anim1(elem, prop, from, to, ms) {
	if (prop == 'left') elem.style.position = 'absolute';
	if (isNumber(from)) from = '' + from + 'px';
	if (isNumber(to)) to = '' + to + 'px';
}
function applyStyles(g, id, styles) { g.mStyle(id, styles, isdef(g.getNode(id)) ? 'node' : 'edge'); }
function ari_deck_add_safe(otree, n, arr) {
	ari_ensure_deck(otree, n);
	deck_add(otree.deck, n, arr);
}
function aristoUi(dParent, g) {
	clearTable();
	let d1 = mDiv(dParent, { w: '100%' }); mFlex(d1, 'v');
	let dWorld = mDiv(d1, { bg: 'random', hmin: 170, flex: 1 });
	mFlex(dWorld);
	iAdd(g.me, { div: cardZone(d1, g.me, 2) });
	let others = g.others;
	for (let i = 0; i < others.length; i++) {
		let pl = others[i];
		iAdd(pl, { div: cardZone(d1, pl) });
	}
	for (const o of [g.draw_pile, g.market, g.buy_cards, g.discard_pile]) { iAdd(o, { div: cardZone(dWorld, o) }); }
	for (const name of ['draw_pile', 'market', 'buy_cards', 'discard_pile']) { g[name + 'Items'] = showCards(g[name]); }
	for (const pl of g.allPlayers) {
		pl.handItems = showCards({ div: iDiv(pl), type: pl == g.me ? 'hand' : 'handHidden', cards: pl.hand });
		if (isdef(pl.stall)) pl.stallItems = showCards({ div: iDiv(pl), type: g.stallsHidden ? 'cardsHidden' : 'cards', cards: pl.stall });
		if (isdef(pl.buildings)) {
			for (const building of pl.buildings) {
				let bItem = showCards({ div: iDiv(pl), type: 'hand', cards: building });
				lookupAddToList(pl, ['buildingItems'], bItem);
			}
		}
	}
}
function arrToMatrix(arr, rows, cols) {
	let i = 0, res = [];
	for (let r = 0; r < rows; r++) {
		let rarr = [];
		for (let c = 0; c < cols; c++) {
			let a = arr[i]; i++;
			rarr.push(a);
		}
		res.push(rarr);
	}
	return res;
}
function bCapturedPieces(plSym, arr, idx, rows, cols, includeDiagonals = true) {
	let res = [];
	let nei = bNei(arr, idx, rows, cols, includeDiagonals);
	for (let dir = 0; dir < 8; dir++) {
		let i = nei[dir];
		if (nundef(i)) continue;
		let el = arr[i];
		if (EmptyFunc(el) || el == plSym) continue;
		let inew = [];
		let MAX = 100, cmax = 0;
		while (isOppPiece(el, plSym)) {
			if (cmax > MAX) break; cmax += 1;
			inew.push(i);
			i = bNeiDir(arr, i, dir, rows, cols);
			if (nundef(i)) break;
			el = arr[i];
		}
		if (el == plSym) {
			res = res.concat(inew);
		}
	}
	return res;
}
function bCheck(r, c, rows, cols) { return r >= 0 && r < rows && c >= 0 && c < cols ? r * cols + c : null; }
function bCreateEmpty(rows, cols) { return new Array(rows * cols).fill(null); }
function bFreeRayDir(arr, idx, dir, rows, cols) {
	let indices = [];
	let i = idx;
	while (i < arr.length) {
		i = bNeiDir(arr, i, dir, rows, cols);
		if (!i || !EmptyFunc(arr[i])) break; else indices.push(i);
	}
	return indices;
}
function bFreeRayDir1(arr, idx, dir, rows, cols) {
	let indices = [];
	let i = idx;
	while (i < arr.length) {
		i = bNeiDir(arr, i, dir, rows, cols);
		if (!i) break;
		else indices.push(i);
		if (!EmptyFunc(arr[i])) break;
	}
	return indices;
}
function bFullCol(arr, icol, rows, cols) {
	let iStart = icol;
	let x = arr[iStart]; if (EmptyFunc(x)) return null;
	for (let i = iStart + cols; i < iStart + (cols * rows); i += cols) if (arr[i] != x) return null;
	return x;
}
function bFullDiag(arr, rows, cols) {
	let iStart = 0;
	let x = arr[iStart]; if (EmptyFunc(x)) return null;
	for (let i = iStart + cols + 1; i < arr.length; i += cols + 1) { if (arr[i] != x) return null; }//console.log(i,arr[i]); }
	return x;
}
function bFullDiag2(arr, rows, cols) {
	let iStart = cols - 1;
	let x = arr[iStart]; if (EmptyFunc(x)) return null;
	for (let i = iStart + cols - 1; i < arr.length - 1; i += cols - 1) { if (arr[i] != x) return null; }//console.log(i,arr[i]); }
	return x;
}
function bFullRow(arr, irow, rows, cols) {
	let iStart = irow * cols;
	let x = arr[iStart]; if (EmptyFunc(x)) return null;
	for (let i = iStart + 1; i < iStart + cols; i++) if (arr[i] != x) return null;
	return x;
}
function bGetChunks(arr2d, rowsEach, colsEach) {
	let res = [];
	let [rTotal, cTotal] = [arr2d.length, arr2d[0].length];
	for (let r = 0; r < rTotal; r += rowsEach) {
		let m1 = [];
		for (let c = 0; c < cTotal; c += colsEach) {
			m1 = bGetSubMatrix(arr2d, r, rowsEach, c, colsEach);
			res.push(arrFlatten(m1));
		}
	}
	return res;
}
function bGetChunksWithIndices(arr2d, rowsEach, colsEach) {
	let res = [];
	let [rTotal, cTotal] = [arr2d.length, arr2d[0].length];
	for (let r = 0; r < rTotal; r += rowsEach) {
		let m1 = [];
		for (let c = 0; c < cTotal; c += colsEach) {
			m1 = bGetSubMatrixWithIndices(arr2d, r, rowsEach, c, colsEach);
			res.push(arrFlatten(m1));
		}
	}
	return res;
}
function bGetCol(arr, icol, rows, cols) {
	let iStart = icol;
	let res = [];
	for (let i = iStart; i < iStart + (cols * rows); i += cols) res.push(arr[i]);
	return res;
}
function bGetCols(arr2d) {
	let rows = arr2d.length;
	let cols = arr2d[0].length;
	let res = [];
	for (let c = 0; c < cols; c++) { res.push([]); }
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			res[c].push(arr2d[r][c]);
		}
	}
	return res;
}
function bGetRow(arr, irow, rows, cols) {
	let iStart = irow * cols;
	let arrNew = arr.slice(iStart, iStart + cols);
	let res = [];
	for (let i = iStart; i < iStart + cols; i++) res.push(arr[i]);
	console.assert(sameList(arrNew, res), 'NOOOOOO');
	return res;
}
function bGetRows(arr2d) {
	return arr2d;
}
function bGetSubMatrix(arr2d, rFrom, rows, cFrom, cols) {
	let res = []; for (let i = 0; i < rows; i++) res.push([]);
	let [rTotal, cTotal] = [arr2d.length, arr2d[0].length];
	let rIndex = 0;
	for (let r = rFrom; r < rFrom + rows; r++) {
		for (let c = cFrom; c < cFrom + cols; c++) {
			res[rIndex].push(arr2d[r][c]);
		}
		rIndex += 1;
	}
	return res;
}
function bGetSubMatrixWithIndices(arr2d, rFrom, rows, cFrom, cols) {
	let res = []; for (let i = 0; i < rows; i++) res.push([]);
	let [rTotal, cTotal] = [arr2d.length, arr2d[0].length];
	let rIndex = 0;
	for (let r = rFrom; r < rFrom + rows; r++) {
		for (let c = cFrom; c < cFrom + cols; c++) {
			res[rIndex].push({ row: r, col: c, val: arr2d[r][c] });
		}
		rIndex += 1;
	}
	return res;
}
function bNei(arr, idx, rows, cols, includeDiagonals = true) {
	let nei = [];
	let [r, c] = iToRowCol(idx, rows, cols);
	if (r > 0) nei.push(idx - cols); else nei.push(null);
	if (r > 0 && c < cols - 1 && includeDiagonals) nei.push(idx - cols + 1); else nei.push(null);
	if (c < cols - 1) nei.push(idx + 1); else nei.push(null);
	if (r < rows - 1 && c < cols - 1 && includeDiagonals) nei.push(idx + cols + 1); else nei.push(null);
	if (r < rows - 1) nei.push(idx + cols); else nei.push(null);
	if (r < rows - 1 && c > 0 && includeDiagonals) nei.push(idx + cols - 1); else nei.push(null);
	if (c > 0) nei.push(idx - 1); else nei.push(null);
	if (r > 0 && c > 0 && includeDiagonals) nei.push(idx - cols - 1); else nei.push(null);
	return nei;
}
function bNeiDir(arr, idx, dir, rows, cols, includeDiagonals = true) {
	let [r, c] = iToRowCol(idx, rows, cols);
	switch (dir) {
		case 0: if (r > 0) return (idx - cols); else return (null);
		case 1: if (r > 0 && c < cols - 1 && includeDiagonals) return (idx - cols + 1); else return (null);
		case 2: if (c < cols - 1) return (idx + 1); else return (null);
		case 3: if (r < rows - 1 && c < cols - 1 && includeDiagonals) return (idx + cols + 1); else return (null);
		case 4: if (r < rows - 1) return (idx + cols); else return (null);
		case 5: if (r < rows - 1 && c > 0 && includeDiagonals) return (idx + cols - 1); else return (null);
		case 6: if (c > 0) return (idx - 1); else return (null);
		case 7: if (r > 0 && c > 0 && includeDiagonals) return (idx - cols - 1); else return (null);
	}
	return null;
}
function boardArrOmitFirstRowCol(boardArr, rows, cols) {
	let res = [];
	for (let r = 1; r < rows; r++) {
		for (let c = 1; c < cols; c++) {
			let i = iFromRowCol(r, c, rows, cols);
			res.push(boardArr[i]);
		}
	}
	return res;
}
function boardToNode(state) {
	let res = new Array();
	for (let i = 0; i < state.length; i++) {
		if (state[i] == null) res[i] = ' ';
		else res[i] = state[i];
	}
	return res;
}
function bPartialCol(arr, icol, rows, cols) {
	let iStart = icol;
	let x = null;
	for (let i = iStart; i < iStart + (cols * rows); i += cols) { if (EmptyFunc(arr[i])) continue; else if (EmptyFunc(x)) x = arr[i]; else if (arr[i] != x) return null; }
	return x;
}
function bPartialDiag(arr, rows, cols) {
	let iStart = 0;
	let x = null;
	for (let i = iStart; i < arr.length; i += cols + 1) { if (EmptyFunc(arr[i])) continue; else if (EmptyFunc(x)) x = arr[i]; else if (arr[i] != x) return null; }
	return x;
}
function bPartialDiag2(arr, rows, cols) {
	let iStart = cols - 1;
	let x = null;
	for (let i = iStart; i < arr.length - 1; i += cols - 1) {
		if (EmptyFunc(arr[i])) continue; else if (EmptyFunc(x)) x = arr[i]; else if (arr[i] != x) return null;
	}
	return x;
}
function bPartialRow(arr, irow, rows, cols) {
	let iStart = irow * cols;
	let x = null;
	for (let i = iStart; i < iStart + cols; i++) {
		if (EmptyFunc(arr[i])) continue;
		else if (EmptyFunc(x)) x = arr[i];
		else if (arr[i] != x) return null;
	}
	return x;
}
function bRayDir(arr, idx, dir, rows, cols) {
	let indices = [];
	let i = idx;
	while (i < arr.length) {
		let i = bNeiDir(arr, i, dir, rows, cols);
		if (!i) break; else indices.push(i);
	}
	return indices;
}
function bStrideCol(arr, icol, rows, cols, stride) {
	for (let i = 0; i <= rows - stride; i++) {
		let ch = bStrideColFrom(arr, i, icol, rows, cols, stride);
		if (ch) return ch;
	}
	return null;
}
function bStrideColFrom(arr, irow, icol, rows, cols, stride) {
	if (rows - irow < stride) return null;
	let iStart = irow * cols + icol;
	let x = arr[iStart];
	if (EmptyFunc(x)) return null;
	for (let i = iStart + cols; i < iStart + cols * stride; i += cols) if (arr[i] != x) return null;
	return x;
}
function bStrideDiag2From(arr, irow, icol, rows, cols, stride) {
	if (rows - irow < stride || icol - stride + 1 < 0) return null;
	let iStart = irow * cols + icol;
	let x = arr[iStart];
	if (EmptyFunc(x)) return null;
	for (let i = iStart + cols - 1; i < iStart + (cols - 1) * stride; i += cols - 1) if (arr[i] != x) return null;
	return x;
}
function bStrideDiagFrom(arr, irow, icol, rows, cols, stride) {
	if (rows - irow < stride || cols - icol < stride) return null;
	let iStart = irow * cols + icol;
	let x = arr[iStart];
	if (EmptyFunc(x)) return null;
	for (let i = iStart + cols + 1; i < iStart + (cols + 1) * stride; i += cols + 1) if (arr[i] != x) return null;
	return x;
}
function bStrideRow(arr, irow, rows, cols, stride) {
	for (let i = 0; i <= cols - stride; i++) {
		let ch = bStrideRowFrom(arr, irow, i, rows, cols, stride);
		if (ch) return ch;
	}
	return null;
}
function bStrideRowFrom(arr, irow, icol, rows, cols, stride) {
	if (cols - icol < stride) return null;
	let iStart = irow * cols + icol;
	let x = arr[iStart];
	if (EmptyFunc(x)) return null;
	for (let i = iStart + 1; i < iStart + stride; i++) if (arr[i] != x) return null;
	return x;
}
function cardInno1(key, wCard = 420) {
	if (nundef(key)) key = chooseRandom(Object.keys(Cinno));
	let f = wCard / 420;
	let [w, h, szSym, paSym, fz, pa, bth, vGapTxt, rnd, gap] = [420 * f, 200 * f, 100 * f, 8 * f, 100 * f * .8, 20 * f, 4 * f, 8 * f, 10 * f, 6 * f].map(x => Math.ceil(x));
	let info = Cinno[key];
	info.key = key;
	let cdict = { red: RED, blue: 'royalblue', green: 'green', yellow: 'yelloworange', purple: 'indigo' };
	info.c = getColorDictColor(cdict[info.color]);
	let d = mDiv();
	mSize(d, w, h);
	mStyle(d, { fz: pa, margin: 8, align: 'left', bg: info.c, rounding: rnd, patop: paSym, paright: pa, pabottom: szSym, paleft: szSym + paSym, border: '' + bth + 'px solid silver', position: 'relative' })
	mText(info.key.toUpperCase(), d, { fz: pa, weight: 'bold', margin: 'auto' });
	mLinebreak(d);
	for (const dog of info.dogmas) {
		let text = replaceSymbols(dog);
		let d1 = mText(text, d); //,{mabot:14});
		d1.style.marginBottom = '' + vGapTxt + 'px';
	}
	let syms = []; let d1;
	szSym -= gap;
	let sdict = {
		tower: { k: 'white-tower', bg: 'dimgray' }, clock: { k: 'watch', bg: 'navy' }, crown: { k: 'crown', bg: 'black' },
		tree: { k: 'tree', bg: GREEN },
		bulb: { k: 'lightbulb', bg: 'purple' }, factory: { k: 'factory', bg: 'red' }
	};
	for (const s in sdict) { sdict[s].sym = Syms[sdict[s].k]; }
	for (const sym of info.resources) {
		let isEcho = false;
		if (sym == 'None') {
			d1 = mDiv(d, { fz: fz * .75, fg: 'black', bg: 'white', rounding: '50%', display: 'inline' });
			let d2 = mText('' + info.age, d1, {});
			mClass(d2, 'centerCentered');
		} else if (sym == 'echo') {
			let text = info.echo;
			console.log('info.echo', info.echo);
			if (isList(info.echo)) text = info.echo[0];
			text = replaceSymbols(text);
			wEcho = szSym;
			let [w1, h1, w2, h2] = [wEcho, szSym, wEcho - 8, szSym - 8];
			d1 = mDiv(d, { display: 'inline', fg: 'white', bg: 'dimgray', rounding: 6, h: h1, w: w1 });
			let [bestFont, w3, h3] = fitFont(text, 20, w2, h2);
			let d2 = mDiv(d1, { w: w3, h: h3, fz: bestFont }, null, text);
			mCenterCenterFlex(d1);
			isEcho = true;
		} else if (isNumber(sym)) {
			d1 = mDiv(d, { fz: fz * .75, fg: 'white', bg: 'brown', border: '2px solid black', rounding: '50%', display: 'inline' });
			mCenterCenterFlex(d1);
			let d2 = mText('' + info.age, d1, {});
		} else {
			let key = sdict[sym].k;
			let mi = mPic(key, d, { w: szSym, fz: szSym * .8, bg: sdict[sym].bg, rounding: '10%' });
			d1 = iDiv(mi);
		}
		syms.push({ isEcho: isEcho, div: d1 });
	}
	placeSymbol(syms[0], szSym, gap, { left: 0, top: 0 });
	placeSymbol(syms[1], szSym, gap, { left: 0, bottom: 0 });
	placeSymbol(syms[2], szSym, gap, { left: w / 2, bottom: 0 });
	placeSymbol(syms[3], szSym, gap, { right: 0, bottom: 0 });
	info.div = d;
	return info;
}
function cardPattern(n, sym) {
	let di = {
		1: [sym],
		2: [[sym], [sym]],
		3: [[sym], [sym], [sym]],
		4: [[sym, sym], [sym, sym]],
		5: [[sym, sym], [sym], [sym, sym]],
		6: [[sym, sym], [sym, sym], [sym, sym]],
		7: [[sym, sym], [sym, sym, sym], [sym, sym]],
		8: [[sym, sym, sym], [sym, sym], [sym, sym, sym]],
		9: [[sym, sym, sym], [sym, sym, sym], [sym, sym, sym]],
		10: [[sym, sym, sym], [sym, sym, sym, sym], [sym, sym, sym]],
		11: [[sym, sym, sym, sym], [sym, sym, sym], [sym, sym, sym, sym]],
		12: [[sym, sym, sym, sym], [sym, sym, sym, sym], [sym, sym, sym, sym]],
		13: [[sym, sym, sym], [sym, sym], [sym, sym, sym], [sym, sym], [sym, sym, sym]],
		14: [[sym, sym, sym, sym], [sym, sym, sym, sym], [sym, sym, sym, sym]],
		15: [[sym, sym, sym, sym], [sym, sym, sym, sym], [sym, sym, sym, sym]],
	};
	return di[n];
}
function cardZone(dParent, o, flex = 1, hmin = 170) {
	let dOuter = mDiv(dParent, { bg: o.color, fg: 'contrast', flex: flex, hmin: hmin }, 'd' + o.name, o.name);
	let dInner = mDiv(dOuter);
	mFlex(dInner); dInner.style.alignContent = 'flex-start';
	return dInner;
}
function catanBoard(dParent, rows, topcols, styles = {}) {
	let g = hex1Board(dParent, rows, topcols, styles);
	hexCornerNodes(g);
}
function cBlank(dParent, styles = {}, id) {
	if (nundef(styles.h)) styles.h = Card.sz;
	if (nundef(styles.w)) styles.w = styles.h * .7;
	if (nundef(styles.bg)) styles.bg = 'white';
	styles.position = 'relative';
	let [w, h, sz] = [styles.w, styles.h, Math.min(styles.w, styles.h)];
	if (nundef(styles.rounding)) styles.rounding = sz * .05;
	let d = mDiv(dParent, styles, id, null, 'card');
	let item = mItem(null, { div: d }, { type: 'card', sz: sz, rounding: styles.rounding });
	copyKeys(styles, item);
	return item;
}
function cBlankSvg(dParent, styles = {}) {
	if (nundef(styles.h)) styles.h = Card.sz;
	if (nundef(styles.w)) styles.w = styles.h * .7;
	if (nundef(styles.bg)) styles.bg = 'white';
	styles.position = 'relative';
	let [w, h, sz] = [styles.w, styles.h, Math.min(styles.w, styles.h)];
	if (nundef(styles.rounding)) styles.rounding = sz * .05;
	let d = mDiv(dParent, styles, null, null, 'card');
	let svg = mgTag('svg', d, { width: '100%', height: '100%' }); //,background:'transparent'});
	let g = mgTag('g', svg);
	let item = mItem(null, { div: d, svg: svg, g: g }, { type: 'card', sz: sz });
	copyKeys(styles, item);
	return item;
}
function cCircle(c, sz, n, disp = -90) {
	let rad = sz / 2;
	centers = getEllipsePoints(rad, rad, n, disp)
	centers = centers.map(pt => ({ x: pt.X + c.x, y: pt.Y + c.y }));
	return centers;
}
function check_complete_set(fenlist) {
	if (fenlist.length != 3) return false;
	let [f1, f2, f3] = fenlist;
	console.log('set clicked', f1, f2, f3)
	for (let i = 0; i < f1.length; i++) {
		let [a, b, c] = [f1[i], f2[i], f3[i]];
		console.log('...set clicked', a, b, c)
		let correct = (a == b && b == c) || (a != b && b != c && a != c);
		if (!correct) return false;
	}
	return true;
}
function checkBoardEmpty(arr) { for (const x of arr) { if (!EmptyFunc(x)) return false; } return true; }
function checkBoardFull(arr) { for (const x of arr) if (EmptyFunc(x)) return false; return true; }
function checkPotentialTTT(arr, rows, cols) { return checkwinnersPossible(arr, rows, cols); }
function checkSudokuRule(matrix) {
	let i = 0;
	for (const arr of matrix) {
		let dd = hasDuplicate(arr);
		if (dd) {
			let err = { type: 'row', row: i, col: dd.i, val: dd.val, info: dd, i: i };
			return err;
		}
		i += 1;
	}
	i = 0;
	for (const arr of bGetCols(matrix)) {
		let dd = hasDuplicate(arr);
		if (dd) {
			let err = { type: 'column', col: i, row: dd.i, val: dd.val, i: i, info: dd };
			return err;
		}
		i += 1;
	}
	let [rows, cols] = [matrix.length, matrix[0].length];
	let rowsEach = rows == 9 ? 3 : 2;
	let colsEach = cols == 4 ? 2 : 3;
	let chunks = bGetChunksWithIndices(matrix, rowsEach, colsEach);
	i = 0;
	for (const arr of chunks) {
		let dd = hasDuplicate(arr);
		if (dd) {
			let val = dd.val;
			let err = { type: 'quadrant', row: val.row, col: val.col, val: val.val, i: i, info: dd };
		}
		i += 1;
	}
	return null;
}
function checkSudokuRule_trial1(matrix) {
	for (const arr of matrix) { let dd = hasDuplicate(arr); if (dd) return { type: 'row', info: dd }; }
	for (const arr of bGetCols(matrix)) { let dd = hasDuplicate(arr); if (dd) return { type: 'column', info: dd }; }
	let chunks = bGetChunks(matrix, 2, 2);
	for (const arr of chunks) { let dd = hasDuplicate(arr); if (dd) return { type: 'quadrant', info: dd }; }
	return null;
}
function checkwinners(arr, rows, cols) {
	for (i = 0; i < rows; i++) { let ch = bFullRow(arr, i, rows, cols); if (ch) return ch; }
	for (i = 0; i < cols; i++) { let ch = bFullCol(arr, i, rows, cols); if (ch) return ch; }
	let ch = bFullDiag(arr, rows, cols); if (ch) return ch;
	ch = bFullDiag2(arr, rows, cols); if (ch) return ch;
	return null;
}
function checkwinnersC4(arr, rows = 6, cols = 7, stride = 4) {
	for (i = 0; i < rows; i++) { let ch = bStrideRow(arr, i, rows, cols, stride); if (ch) return ch; }
	for (i = 0; i < cols; i++) { let ch = bStrideCol(arr, i, rows, cols, stride); if (ch) return ch; }
	for (i = 0; i < rows; i++) {
		for (j = 0; j < cols; j++) {
			let ch = bStrideDiagFrom(arr, i, j, rows, cols, stride); if (ch) return ch;
			ch = bStrideDiag2From(arr, i, j, rows, cols, stride); if (ch) return ch;
		}
	}
	return null;
}
function checkwinnersPossible(arr, rows, cols) {
	for (i = 0; i < rows; i++) { let ch = bPartialRow(arr, i, rows, cols); if (ch) return ch; }
	for (i = 0; i < cols; i++) { let ch = bPartialCol(arr, i, rows, cols); if (ch) return ch; }
	let ch = bPartialDiag(arr, rows, cols); if (ch) return ch;
	ch = bPartialDiag2(arr, rows, cols); if (ch) return ch;
	return null;
}
function checkwinnersTTT(arr, rows, cols) { return checkwinners(arr, rows, cols); }
function circleCenters(rows, cols, wCell, hCell) {
	let [w, h] = [cols * wCell, rows * hCell];
	let cx = w / 2;
	let cy = h / 2;
	let centers = [{ x: cx, y: cy }];
	let rx = cx + wCell / 2; let dradx = rx / wCell;
	let ry = cy + hCell / 2; let drady = ry / hCell;
	let nSchichten = Math.floor(Math.min(dradx, drady));
	for (let i = 1; i < nSchichten; i++) {
		let [newCenters, wsch, hsch] = oneCircleCenters(i * 2 + 1, i * 2 + 1, wCell, hCell);
		for (const nc of newCenters) {
			centers.push({ x: nc.x + cx - wsch / 2, y: nc.y + cy - hsch / 2 });
		}
	}
	return [centers, wCell * cols, hCell * rows];
}
function cLandscape(dParent, styles = {}, id) {
	if (nundef(styles.w)) styles.w = Card.sz;
	if (nundef(styles.h)) styles.h = styles.w * .65;
	return cBlank(dParent, styles, id);
}
function clearStatus() { clearFleetingMessage(); }
function clearTable() {
	clearElement('dTable');
	clearElement('dHistory');
	show_title();
	clearElement('dMessage');
	clearElement('dInstruction');
	clearElement('dTitleRight');
	hide('bPauseContinue');
}
function correctPolys(polys, approx = 10) {
	let clusters = [];
	for (const p of polys) {
		for (const pt of p) {
			let found = false;
			for (const cl of clusters) {
				for (const v of cl) {
					let dx = Math.abs(v.x - pt.x);
					let dy = Math.abs(v.y - pt.y);
					if (dx < approx && dy < approx) {
						cl.push(pt);
						found = true;
						break;
					}
				}
				if (found) break;
			}
			if (!found) {
				clusters.push([pt]);
			}
		}
	}
	let vertices = [];
	for (const cl of clusters) {
		let sumx = 0;
		let sumy = 0;
		let len = cl.length;
		for (const pt of cl) {
			sumx += pt.x;
			sumy += pt.y;
		}
		vertices.push({ x: Math.round(sumx / len), y: Math.round(sumy / len) });
	}
	for (const p of polys) {
		for (const pt of p) {
			let found = false;
			for (const v of vertices) {
				let dx = Math.abs(v.x - pt.x);
				let dy = Math.abs(v.y - pt.y);
				if (dx < approx && dy < approx) {
					if (dx != 0 || dy != 0) {
						pt.x = v.x;
						pt.y = v.y;
					}
					found = true;
				}
				if (found) break;
			}
			if (!found) {
				error('point not found in vertices!!! ' + pt.x + ' ' + pt.y);
			}
		}
	}
	return vertices;
}
function cPortrait(dParent, styles = {}, id) {
	if (nundef(styles.h)) styles.h = Card.sz;
	if (nundef(styles.w)) styles.w = styles.h * .7;
	return cBlank(dParent, styles, id);
}
function create_set_card(fen, dParent, card_styles) {
	let myinfo = info_from_fen(fen);
	let info = { shape: 'circle', color: BLUE, num: 1, shading: 'solid', background: 'white', text: 'none' };
	copyKeys(myinfo, info);
	let card = draw_set_card(dParent, info, card_styles);
	card.fen = fen; //fen_from_info(info);
	return card;
}
function cRound(dParent, styles = {}, id) {
	styles.w = valf(styles.w, Card.sz);
	styles.h = valf(styles.h, Card.sz);
	styles.rounding = '50%';
	return cBlank(dParent, styles, id);
}
function cTitleArea(card, h, styles, classes) {
	let dCard = iDiv(card);
	let dTitle = mDiv(dCard, { w: '100%', h: h, overflow: 'hidden', upperRounding: card.rounding });
	let dMain = mDiv(dCard, { w: '100%', h: card.h - h, lowerRounding: card.rounding });
	iAdd(card, { dTitle: dTitle, dMain: dMain });
	if (isdef(styles)) mStyle(dTitle, styles);
	return [dTitle, dMain];
}
function dachain(ms = 0) {
	console.log('TestInfo', TestInfo)
	if (!isEmpty(DA.chain) && !(DA.test.running && DA.test.step == true)) {
		dachainext(ms);
	} else if (isEmpty(DA.chain)) console.log('DA.chain EMPTY ' + DA.test.iter)
}
function dachainext(ms = 0) {
	let f = DA.chain.shift();
	if (ms > 0) TOMan.TO[getUID('f')] = setTimeout(f, ms);
	else f();
}
function deck_add(deck, n, arr) { let els = deck_deal(deck, n); els.map(x => arr.push(x)); return arr; }
function deck_deal(deck, n) { return deck.splice(0, n); }
function destroySudokuRule(pattern, rows, cols) {
	let sz = Math.min(rows, cols);
	let [r1, r2] = choose(range(0, sz - 1), 2);
	let c = chooseRandom(range(0, sz - 1));
	if (coin(50)) { arrSwap2d(pattern, r1, c, r2, c); }
	else if (coin(50)) { arrSwap2d(pattern, c, r1, c, r2); }
}
function draw_set_card(dParent, info, card_styles) {
	let card = cLandscape(dParent, card_styles);
	card.info = info;
	let d = iDiv(card);
	mCenterCenterFlex(d);
	let sz = card.sz / 2.8;
	let bg, shape = info.shape, text;
	switch (info.shading) {
		case 'solid': bg = info.color; break;
		case 'gradient': bg = `linear-gradient(${info.color}, silver)`; break;
		case 'empty': bg = `repeating-linear-gradient(
			45deg,
			${info.color},
			${info.color} 10px,
			silver 10px,
			silver 20px
		)`; break;
	}
	mStyle(d, { bg: info.background });
	switch (info.text) {
		case 'none': text = null; break;
		case 'letter': text = randomLetter(); break;
		case 'number': text = '' + randomDigit(); break;
	}
	let styles = { w: sz, h: sz, margin: sz / 10 };
	for (let i = 0; i < info.num; i++) {
		let d1 = drawShape(shape, d, styles);
		if (info.shading == 'gradient') { d1.style.backgroundColor = info.color; mClass(d1, 'polka-dot'); } else mStyle(d1, { bg: bg });
		if (shape == 'circle') console.log('circle', d1);
		if (isdef(text)) { mCenterCenterFlex(d1); mText(text, d1, { fz: sz / 1.75, fg: 'black', family: 'impact' }); }
	}
	return card;
}
function draw_set_card_test(dParent) {
	let card = cLandscape(dParent, { w: 120 });
	let d = iDiv(card, { h: '100%' });
	mCenterCenterFlex(d);
	let sz = card.sz / 4;
	let styles = { w: sz, h: sz, bg: `linear-gradient(${RED},black`, margin: sz / 10, border: `solid 3px ${GREEN}` };
	let d1 = drawShape('circle', d, styles); mCenterCenterFlex(d1); mText('A', d1, { fz: sz / 4, fg: 'white' });
	drawShape('circle', d, styles);
	drawShape('circle', d, styles);
}
function expandBoard(board, rNew, cNew, iInsert) {
	let [boardArrOld, rOld, cOld] = [board.fields.map(x => isdef(x.item) ? x.item.index : null), board.rows, board.cols];
	let boardArrNew = new Array(rNew * cNew);
	for (let r = 0; r < rNew; r++) {
		for (let c = 0; c < cNew; c++) {
			let i = iFromRowCol(r, c, rNew, cNew);
			let x = (rOld != rNew) ? r : c;
			if (x < iInsert) {
				let iOld = iFromRowCol(r, c, rOld, cOld);
				boardArrNew[i] = boardArrOld[iOld];
			}
			else if (x == iInsert) boardArrNew[i] = null;
			else {
				let [ir, ic] = (rOld != rNew) ? [r - 1, c] : [r, c - 1];
				let iOld = iFromRowCol(ir, ic, rOld, cOld);
				boardArrNew[i] = boardArrOld[iOld];
			}
		}
	}
	return { rows: rNew, cols: cNew, boardArr: boardArrNew, extras: [] };
}
function fen_from_info(info) {
	let all_attrs = gSet_attributes();
	let keys = get_keys(all_attrs);
	let fen = '';
	for (const prop of keys) {
		let val = info[prop];
		let i = all_attrs[prop].indexOf(val);
		fen += '' + i;
	}
	return fen;
}
function fillColarr(colarr, items) {
	let i = 0;
	let result = [];
	for (const r of colarr) {
		let arr = [];
		for (let c = 0; c < r; c++) {
			arr.push(items[i]); i++;
		}
		result.push(arr);
	}
	return result;
}
function fitFont(text, fz = 20, w2 = 200, h2 = 100) {
	let e1, e2, r1, r2;
	e1 = mDiv(dTable, { w: w2, h: h2, display: 'inline-block' });
	do {
		e2 = mDiv(e1, { fz: fz, display: 'inline-block' }, null, text);
		r1 = getRect(e1);
		r2 = getRect(e2);
		e2.remove();
		fz -= 1;
	} while (r1.w * r1.h < r2.w * r2.h);
	e1.remove();
	return [fz + 1, r2.w, r2.h];
}
function fitSvg(el) {
	const box = el.querySelector('text').getBBox();
	el.style.width = `${box.width}px`;
	el.style.height = `${box.height}px`;
}
function gameItem(name, color) { return mItem(name2id(name), null, { color: isdef(color) ? color : randomColor(), name: name }); }
function get_card_div(R1 = '1', SB = 'B') {
	let key52 = get_card_key52(R1, SB);
	let svgCode = C52['card_1B']; //joker:J1,J2, back:1B,2B
	svgCode = '<div>' + svgCode + '</div>';
	let el = mCreateFrom(svgCode);
	[w, h] = [isdef(w) ? w : Card.w, isdef(h) ? h : Card.sz];
	mSize(el, w, h);
	return el;
}
function get_card_key52(R1 = '1', SB = 'B') {
	return `card_${Rank1}${SuitB}`;
}
function get_create_staged(fen, options, player_names) {
	let t = create_table(options, player_names);
	t.fen = fen;
	to_server({ table: t }, 'delete_and_create_staged');
}
function get_random_attr_val(attr_list) {
	let all_attrs = gSet_attributes();
	return attr_list.map(x => chooseRandom(all_attrs[x]));
}
function get_splay_number(wsplay) { return wsplay == 'none' ? 0 : wsplay == 'left' ? 1 : wsplay == 'right' ? 2 : wsplay == 'up' ? 3 : 4; }
function get_splay_word(nsplay) { return nsplay == 0 ? 'none' : nsplay == 1 ? 'left' : nsplay == 2 ? 'right' : dsplay == 3 ? 'up' : 'deck'; }
function getCenters(layout, rows, cols, wCell, hCell,) {
	if (layout == 'quad') { return quadCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex') { return hexCenters(rows, cols, wCell, hCell); }
	else if (layout == 'circle') { return circleCenters(rows, cols, wCell, hCell); }
}
function getCentersFromAreaSize(layout, wBoard, hBoard, wCell, hCell) {
	let info;
	if (layout == 'quad') { info = quadCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex') { info = hexCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex1') { info = hex1Centers(rows, cols, wCell, hCell); }
	else if (layout == 'circle') { info = circleCenters(rows, cols, wCell, hCell); }
	return info;
}
function getCentersFromRowsCols(layout, rows, cols, wCell, hCell) {
	let info;
	if (layout == 'quad') { info = quadCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex') { info = hexCenters(rows, cols, wCell, hCell); }
	else if (layout == 'hex1') { info = hex1Centers(rows, cols, wCell, hCell); }
	else if (layout == 'circle') { info = circleCenters(rows, cols, wCell, hCell); }
	return info;
}
function getCornerVertices(centers, w = 100, h = 100) {
	let polys = [];
	for (const pt of centers) {
		let poly = getHexPoly(pt.x, pt.y, w, h);
		polys.push(poly);
	}
	let vertices = correctPolys(polys, 1);
	return vertices;
}
function getSudokuPattern(r, c) {
	let patterns = {
		44: [
			[[0, 1, 2, 3], [2, 3, 0, 1], [3, 0, 1, 2], [1, 2, 3, 0]],
			[[0, 1, 2, 3], [3, 2, 0, 1], [2, 3, 1, 0], [1, 0, 3, 2]],
			[[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]],
		],
	};
	return chooseRandom(patterns['' + r + c]);
}
function getSudokuPatternFromDB(r, c, index) {
	let key = '' + r + 'x' + c;
	let numSamples = Object.keys(DB.games.gColoku.samples[key]).length;
	if (nundef(index)) index = randomNumber(0, numSamples - 1); else if (index >= numSamples) index = 1;
	let sample = DB.games.gColoku.samples[key][index];
	let pattern = sudokuSampleToIndexMatrix(sample.sol, r, c);
	let puzzle = sudokuSampleToIndexMatrix(sample.min, r, c);
	return { pattern: pattern, puzzle: puzzle };
}
function giRep(gi, dParent, styles, shape, prefix, content) {
	gi = isString(gi) ? gi[1] == '_' ? Items[gi] : Items[name2id(gi)] : gi;
	let id = gi.id;
	let name = gi.name;
	let d = mShape(shape, dParent, styles);
	d.id = (isdef(prefix) ? prefix : '') + id;
	let key = isdef(prefix) ? prefix : 'div';
	d.innerHTML = content;
	let di = {}; di[key] = d; iAdd(gi, di);
	return d;
}
function gSet_attributes() {
	const all_attrs = {
		shape: ['circle', 'triangle', 'square'],
		color: [RED, BLUE, GREEN],
		num: [1, 2, 3],
		shading: ['solid', 'empty', 'gradient'],
		background: ['white', 'grey', 'black'],
		text: ['none', 'letter', 'number'],
	};
	return all_attrs;
}
function has_farm(uname) { return firstCond(UI.players[uname].buildinglist, x => x.type == 'farm'); }
function hasDuplicate(arr, efunc) {
	let di = {};
	if (nundef(efunc)) efunc = x => { return x === ' ' };
	let i = -1;
	for (const a of arr) {
		i += 1;
		if (efunc(a)) continue; //!isNumber(a) && a==' ') {console.log('H!',a);continue;}
		if (a in di) return { i: i, val: a };
		di[a] = true;
	}
	return false;
}
function hex1Board(dParent, rows, topcols, styles = {}) {
	let g = new UIGraph(dParent, styles);
	let [w, h] = [valf(lookup(styles, ['node', 'w']), 50), valf(lookup(styles, ['node', 'h']), 50)];
	let total = hex1Count(rows, topcols);
	let nids = g.addNodes(total);
	g.hex1(rows, topcols, w + 4, h + 4);
	let indices = hex1Indices(rows, topcols);
	let ids = g.getNodeIds();
	let di = {};
	for (let i = 0; i < ids.length; i++) {
		let [row, col] = [indices[i].row, indices[i].col];
		let id = ids[i];
		lookupSet(di, [row, col], id);
		g.setProp(id, 'row', row);
		g.setProp(id, 'col', col);
		g.setProp(id, 'label', `${row},${col}`);
	}
	for (let i = 0; i < ids.length; i++) {
		let [row, col] = [indices[i].row, indices[i].col];
		let id = ids[i];
		let nid2 = lookup(di, [row, col + 2]); if (nid2) g.addEdge(id, nid2);
		nid2 = lookup(di, [row + 1, col - 1]); if (nid2) g.addEdge(id, nid2);
		nid2 = lookup(di, [row + 1, col + 1]); if (nid2) g.addEdge(id, nid2);
	}
	let byrc = {};
	for (const r in di) {
		byrc[r] = {};
		for (const c in di[r]) {
			byrc[r][c] = g.getNode(di[r][c]).data();
		}
	}
	g.di = di;
	g.byrc = byrc;
	g.rc = (i, j, f) => (isdef(f)) ? f(g.getNode(di[i][j])) : g.getNode(di[i][j]);
	return g;
}
function hex1Centers(rows, cols, wCell = 100, hCell = null) {
	let colarr = _calc_hex_col_array(rows, cols);
	let maxcols = arrMax(colarr);
	if (nundef(hCell)) hCell = (hCell / .866);
	let hline = hCell * .75;
	let offX = wCell / 2, offY = hCell / 2;
	let centers = [];
	let x = 0; y = 0;
	for (let r = 0; r < colarr.length; r++) {
		let n = colarr[r];
		for (let c = 0; c < n; c++) {
			let dx = (maxcols - n) * wCell / 2;
			let dy = r * hline;
			let center = { x: dx + c * wCell + offX, y: dy + offY };
			centers.push(center);
		}
	}
	return [centers, wCell * maxcols, hCell / 4 + rows * hline];
}
function hex1Count(rows, topcols) {
	let colarr = _calc_hex_col_array(rows, topcols);
	let total = 0;
	for (let r = 0; r < colarr.length; r++) { total += colarr[r]; }
	return total;
}
function hex1Indices(rows, topcols) {
	let colarr = _calc_hex_col_array(rows, topcols);
	let iStart = Math.floor(rows / 2);
	let inc = -1;
	let res = [];
	for (let r = 0; r < colarr.length; r++) {
		let n = colarr[r];
		for (let c = 0; c < n; c++) {
			let icol = iStart + 2 * c;
			let irow = r;
			res.push({ row: irow, col: icol });
		}
		if (iStart == 0) inc = 1;
		iStart += inc;
	}
	return res;
}
function hexCenters(rows, cols, wCell = 100, hCell) {
	if (nundef(hCell)) hCell = (hCell / .866);
	let hline = hCell * .75;
	let offX = wCell / 2, offY = hCell / 2;
	let centers = [];
	let startSmaller = Math.floor(rows / 2) % 2 == 1;
	let x = 0; y = 0;
	for (let r = 0; r < rows; r++) {
		let isSmaller = startSmaller && r % 2 == 0 || !startSmaller && r % 2 == 1;
		let curCols = isSmaller ? cols - 1 : cols;
		let dx = isSmaller ? wCell / 2 : 0;
		dx += offX;
		for (let c = 0; c < curCols; c++) {
			let center = { x: dx + c * wCell, y: offY + r * hline };
			centers.push(center);
		}
	}
	return [centers, wCell * cols, hCell / 4 + rows * hline];
}
function hexCornerNodes(g) {
	let nodes = g.getNodes();
	let centers = nodes.map(x => x.data('center'));
	let vertices = getCornerVertices(centers);
	for (const f of nodes) {
		let center = f.data('center');
		console.log('center', center)
	}
}
function hide_history_popup() {	let d = mBy('dHistoryPopup');	if (isdef(d)) {mAppend(UI.dHistoryParent,UI.dHistory);mRemove(d);}}
function hide_options_popup() {	let d = mBy('dOptions');	if (isdef(d)) mRemove(d);}
function i52(i) { return isList(i) ? i.map(x => Card52.getItem(x)) : Card52.getItem(i); }
function iAppend52(i, dParent, faceUp) {
	let item = i52(i);
	iFace(item, faceUp);
	mAppend(dParent, item.div);
	return item;
}
function id2name(id) { id.substring(2).split('_').join(' '); }
function iFace(item, faceUp) { if (isdef(faceUp)) faceUp ? iFaceUp(item) : iFaceDown(item); }
function iFaceDown(item) { Card52.turnFaceDown(item); }
function iFaceUp(item) { Card52.turnFaceUp(item); }
function iFromRowCol(row, col, rows, cols) { return row * cols + col; }
function iH00(iarr, dParent, styles, id) {
	function iH00Zone(dTable, nmax = 7, padding = 10) {
		let sz = netHandSize(nmax);
		return mZone(dTable, { wmin: sz.w, h: sz.h, padding: padding }); //, rounding: 10, bg:'blue' });
	}
	let h = isdef(Items[id]) ? Items[id] : { arr: iarr, styles: styles, id: id };
	if (nundef(h.zone)) h.zone = iH00Zone(dParent); else clearElement(h.zone);
	let items = i52(iarr);
	h.iHand = iSplay(items, h.zone);
	return h;
}
function iH00_dep(iarr, dParent, styles, id) {
	function iH00Zone(dTable, nmax = 3, padding = 10) {
		let sz = netHandSize(nmax);
		return mZone(dTable, { wmin: sz.w, h: sz.h, padding: padding, rounding: 10 });
	}
	let data = DA[id] = {};
	let h = data.deck = new DeckClass();
	h.init(iarr);
	h = data;
	if (nundef(h.zone)) h.zone = iH00Zone(dParent); else clearElement(h.zone);
	if (nundef(h.iHand)) {
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	} else if (redo) {
		clearElement(h.zone);
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	}
	return h;
}
function iH01(iarr, dParent, styles, id, overlap) {
	function iH01Zone(dTable, nmax = 3, padding = 10) {
		let sz = netHandSize(nmax);
		return mZone(dTable, { wmin: sz.w, h: sz.h, padding: padding }); //, rounding: 10, bg:'blue' });
	}
	let h = isdef(Items[id]) ? Items[id] : { arr: iarr, styles: styles, id: id };
	if (nundef(h.zone)) h.zone = iH01Zone(dParent); else clearElement(h.zone);
	let items = i52(iarr);
	h.iHand = iSplay(items, h.zone, {}, 'right', overlap);
	return h;
}
function iHand52(i) {
	let hand = iSplay(i, dTable);
}
function iHandZone(dParent, styles, nmax) {
	if (nundef(styles)) styles = { bg: 'random', rounding: 10 };
	if (isdef(nmax)) {
		console.log('nmax', nmax)
		let sz = netHandSize(nmax);
		styles.w = sz.w;
		styles.h = sz.h;
	}
	return mZone(dParent, styles);
}
function iHandZone_test(dTable, nmax = 10, padding = 10) {
	let sz = netHandSize(nmax);
	return mZone(dTable, { wmin: sz.w, h: sz.h, bg: 'random', padding: padding, rounding: 10 });
}
function iMakeHand(iarr, dParent, styles, id) {
	let data = DA[id] = {};
	let h = data.deck = new DeckClass();
	h.init(iarr);
	iPresentHand(data, dParent, styles);
	return data;
}
function iMakeHand_test(dParent, iarr, id) {
	let data = DA[id] = {};
	let h = data.deck = new DeckClass();
	h.init(iarr);
	iPresentHand_test(dParent, data);
	return data;
}
function indexDiff(a, b, s) {
	let ia = s.indexOf(a);
	let ib = s.indexOf(b);
	console.log('index of', a, 'is', ia)
	console.log('index of', b, 'is', ib)
	return ia - ib;
}
function info_from_fen(fen) {
	let all_attrs = gSet_attributes();
	let keys = get_keys(all_attrs);
	let info = {};
	for (let i = 0; i < fen.length; i++) {
		let prop = keys[i];
		let val = all_attrs[prop][Number(fen[i])];
		info[prop] = val;
	}
	return info;
}
function inno_calc_visible_syms(board, splays = {}) {
	let res = {};
	INNO.symNames.map(x => res[x] = 0);
	for (const color in board) {
		let res_color = inno_calc_visible_syms_pile(board[color], splays[color]);
		for (const k in res) { res[k] += res_color[k]; }
	}
	return res;
}
function inno_calc_visible_syms_pile(keys, dir) {
	let [cards, totals] = [keys.map(x => InnoById[x]), {}];
	INNO.symNames.map(x => totals[x] = 0);
	if (isEmpty(keys)) return totals;
	let top = cards.shift();
	for (const k of top.resources) {
		if (isdef(totals[k])) totals[k] += 1;
	}
	if (nundef(dir) || dir == 0) return totals;
	if (dir == 1) {
	} else if (dir == 2) {
		for (const c of cards) {
			for (const k in totals) {
				if (c.resources[0] == k) totals[k]++;
				if (c.resources[1] == k) totals[k]++;
			}
		}
	}
	return totals;
}
function inno_card(dParent, keyOrName) {
	if (nundef(keyOrName)) keyOrName = chooseRandom(get_keys(InnoById));
	let cardInfo, name, key, id;
	if (isdef(InnoById[keyOrName])) { id = key = keyOrName; cardInfo = InnoById[id]; name = cardInfo.name; }
	else if (isdef(InnoByName[keyOrName])) { name = keyOrName; cardInfo = InnoByName[name]; id = key = cardInfo.id; };
	let sym = INNO.sym[cardInfo.type];
	let info = Syms[sym.key];
	let card = cBlank(dParent, { fg: 'black', bg: INNO.color[cardInfo.color], w: Card.sz, h: Card.sz * .65, margin: 10 });
	let [dCard, sz, szTitle, margin] = [iDiv(card), Card.sz / 5, cardInfo.exp[0] == 'A' ? Card.sz / 12 : Card.sz / 8, 4];
	let [dTitle, dMain] = cTitleArea(card, szTitle);
	let d = mAddContent(dTitle, name, {
		patop: 4, bg: sym.bg, fg: 'white', h: szTitle, fz: szTitle * .7, align: 'center',
		position: 'relative'
	});
	mAddContent(d, cardInfo.age, { hpadding: szTitle / 4, float: 'right' });
	let s = mSym(sym.key, d, { hpadding: szTitle / 4, h: szTitle * .7, fg: sym.fg, float: 'left' });
	let positions = ['tl', 'bl', 'bc', 'br'];
	for (let i = 0; i < 4; i++) {
		let r = cardInfo.resources[i];
		let pos = positions[i];
		if (r in INNO.sym) { innoSym(r, dMain, sz, pos, margin); }
		else if (r == 'None') { innoAgeNumber(cardInfo.age, dMain, sz, pos, margin); }
		else if (isNumber(r)) { innoBonusNumber(r, dMain, sz, pos, margin); }
		else if (r == 'echo') { innoEcho(cardInfo.echo, dMain, sz, pos, margin); }
		else if (r == 'inspire') { innoInspire(cardInfo.inspire, dMain, sz, pos, margin); }
	}
	if (isdef(cardInfo.dogmas)) {
		let box = mBoxFromMargins(dMain, 10, margin, sz + margin, sz + 2 * margin); //,{bg:'grey',alpha:.5, rounding:10});
		mStyle(box, { align: 'left' });
		let text = '';
		for (const dog of cardInfo.dogmas) {
			let t = startsWith(dog, 'I demand') ? ('I <b>demand</b>' + dog.substring(8)) : startsWith(dog, 'I compell') ? ('I <b>compell</b>' + dog.substring(8)) : dog;
			text += `<span style="color:${sym.bg};font-family:${info.family}">${info.text}</span>` + '&nbsp;' + t + '<br>';
		}
		let t2 = innoText(text);
		mFillText(t2, box);
	} else if (isdef(cardInfo.res_city)) {
		let positions = ['tc', 'tr'];
		for (let i = 0; i < 2; i++) {
			let r = cardInfo.res_city[i];
			let pos = positions[i];
			if (r == 'flag') { innoFlag(cardInfo.type, dMain, sz, pos, margin); }
			else if (r in INNO.sym) { innoSym(r, dMain, sz, pos, margin); }
			else if (r == 'None') { innoAgeNumber(cardInfo.age, dMain, sz, pos, margin); }
			else if (isNumber(r)) { innoBonusNumber(r, dMain, sz, pos, margin); }
			else if (r == 'echo') { innoEcho(cardInfo.echo, dMain, sz, pos, margin); }
			else if (r == 'inspire') { innoInspire(cardInfo.inspire, dMain, sz, pos, margin); }
		}
	}
	card.info = cardInfo;
	return card;
}
function inno_card_fixed_font(dParent, keyOrName) {
	if (nundef(keyOrName)) keyOrName = chooseRandom(get_keys(InnoById));
	let cardInfo, name, key, id;
	if (isdef(InnoById[keyOrName])) { id = key = keyOrName; cardInfo = InnoById[id]; name = cardInfo.name; }
	else if (isdef(InnoByName[keyOrName])) { name = keyOrName; cardInfo = InnoByName[name]; id = key = cardInfo.id; };
	let sym = INNO.sym[cardInfo.type];
	let info = Syms[sym.key];
	let card = cBlank(dParent, { fg: 'black', bg: INNO.color[cardInfo.color], w: Card.sz, h: Card.sz * .65, margin: 10 });
	let [dCard, sz, szTitle, margin] = [iDiv(card), Card.sz / 5, cardInfo.exp[0] == 'A' ? Card.sz / 12 : Card.sz / 8, 4];
	let [dTitle, dMain] = cTitleArea(card, szTitle);
	let d = mAddContent(dTitle, name, {
		patop: 4, bg: sym.bg, fg: 'white', h: szTitle, fz: szTitle * .7, align: 'center',
		position: 'relative'
	});
	mAddContent(d, cardInfo.age, { hpadding: szTitle / 4, float: 'right' });
	let s = mSym(sym.key, d, { hpadding: szTitle / 4, h: szTitle * .7, fg: sym.fg, float: 'left' });
	let positions = ['tl', 'bl', 'bc', 'br'];
	for (let i = 0; i < 4; i++) {
		let r = cardInfo.resources[i];
		let pos = positions[i];
		if (r in INNO.sym) { innoSym(r, dMain, sz, pos, margin); }
		else if (r == 'None') { innoAgeNumber(cardInfo.age, dMain, sz, pos, margin); }
		else if (isNumber(r)) { innoBonusNumber(r, dMain, sz, pos, margin); }
		else if (r == 'echo') { innoEcho(cardInfo.echo, dMain, sz, pos, margin); }
	}
	let box = mBoxFromMargins(dMain, 10, margin, sz + margin, sz + 2 * margin); //,{bg:'grey',alpha:.5, rounding:10});
	console.log('box', box);
	mStyle(box, { align: 'left', padding: 4 });
	let text = '';
	for (const dog of cardInfo.dogmas) {
		let t = startsWith(dog, 'I demand') ? ('I <b>demand</b>' + dog.substring(8)) : startsWith(dog, 'I compell') ? ('I <b>compell</b>' + dog.substring(8)) : dog;
		text += `<span style="color:${sym.bg};font-family:${info.family}">${info.text}</span>` + '&nbsp;' + t + '<br>';
	}
	let t2 = innoText(text);
	mText(t2, box, { fz: 10 });
	card.info = cardInfo;
	return card;
}
function inno_create_card_assets() {
	Dinno = { A: {}, B: {}, C: {}, E: {}, F: {} };
	InnoById = {}; // id is: exp[0] + age-1 + name[0]; for basic,echoes and artifacts this id is unique!
	InnoByName = {};
	for (const exp in Cinno) {
		for (const name in Cinno[exp]) {
			let c = Cinno[exp][name];
			c.name = name;
			c.exp = exp;
			let id = inno_get_id(c); //exp[0] + c.age - 1 + c.name[0];
			c.id = c.key = id;
			if (isdef(InnoById[id])) { console.log('duplicate id', id, InnoById[id].name, c.name); }
			InnoById[id] = c;
			let key_name = name.toLowerCase().trim();
			if (isdef(InnoByName[key_name])) console.log('duplicate name', name);
			InnoByName[key_name] = c;
			lookupAddToList(Dinno, [exp[0], c.age], c.id);
		}
	}
}
function inno_get_basic_deck_age(otree, min_age) {
	for (let i = min_age; i <= 10; i++) {
		let deck = otree.decks.B[i];
		let len = deck.length;
		if (len > 0) return i;
	}
	return 11;
}
function inno_get_cardinfo(key) { return InnoById[key]; }
function inno_get_deck_age(otree, deck_letter, min_age = 1) {
	let deck_age = inno_get_basic_deck_age(otree, min_age);
	if (deck_letter == 'B') return deck_age;
	let deck = otree.decks[deck_letter][deck_age];
	while (deck_age <= 10 && isEmpty(deck)) { deck_age += 1; deck = otree.decks[deck_letter][deck_age]; }
	return deck_age;
}
function inno_get_hand_actions(otree, uname) {
	let actions = [];
	otree[uname].hand.map(x => actions.push(`${uname}.hand.${x}`));
	return actions;
}
function inno_get_id(c) { return normalize_string(c.name); }//.toLowerCase().trim(); }
function inno_get_object_keys(otree) {
	let keys = {}; for (const k in InnoById) keys[k] = true;
	for (const k of otree.plorder) keys[k] = true;
	for (const k of ['decks', 'board', 'splays', 'hand', 'green', 'purple', 'blue', 'red', 'yellow', 'forecast', 'scored', 'artifact', 'special_achievements', 'achievements']) keys[k] = true;
	let decknames = 'ABCEF';
	for (let i = 0; i < decknames.length; i++) { keys[decknames[i]] = true; }
	for (let age = 1; age <= 10; age++) { keys['' + age] = true; }
	return keys;
}
function inno_get_phase(iphase) { return INNO.phases[iphase].key; }
function inno_get_player_age(otree, uname) {
	let top = inno_get_top_card_info(otree, uname);
	let maxage = arrMinMax(top, x => x.age).max;
	return maxage;
}
function inno_get_splay(otree, path) {
	let [uname, x, color, y] = path.split('.');
	let splay = otree[uname].splays[color];
	return splay;
}
function inno_get_top_card_actions(otree, uname) {
	let keys = inno_get_top_card_keys(otree, uname);
	let res = keys.map(x => `${uname}.board.${inno_get_cardinfo(x).color}.${x}`);
	return res;
}
function inno_get_top_card_info(otree, uname) { return inno_get_top_card_keys(otree, uname).map(x => inno_get_cardinfo(x)); }
function inno_get_top_card_keys(otree, uname) {
	let pl = otree[uname];
	let board = pl.board;
	let top = [];
	for (const k in board) { if (!isEmpty(board[k])) top.push(arrFirst(board[k])); }
	return top;
}
function inno_present_board(dParent, board) {
	let dBoard = mDiv(dParent, {}, null, 'board');
	mFlex(dBoard);
	let boardItemLists = [];
	for (const color in board) {
		let cardlist = board[color];
		let d = mDiv(dBoard);
		let items = inno_present_cards(d, cardlist);
		boardItemLists.push(items);
	}
	return boardItemLists;
}
function inno_present_card(dParent, k) { let card = inno_card(dParent, k); card.key = card.info.key; return card; }
function inno_present_cards(dParent, keys) {
	let items = [];
	for (const k of keys) {
		let card = inno_present_card(dParent, k);
		items.push(card);
	}
	return items;
}
function inno_present_hand(dParent, hand) {
	let dHand = mDiv(dParent, {}, null, 'hand');
	mFlexWrap(dHand); mLinebreak(dHand);
	let handItems = inno_present_cards(dHand, hand);
	return handItems;
}
function inno_setup(player_names) {
	inno_shuffle_decks();//shuffle all decks (remove to test deterministically)
	let pre_fen = {};
	let decks = pre_fen.decks = jsCopy(Dinno);
	pre_fen.achievements = [];
	for (const age in decks.B) { last_elem_from_to(decks.B[age], pre_fen.achievements); }
	pre_fen.special_achievements = ['monument', 'empire', 'world', 'wonder', 'universe', 'legend', 'repute', 'fame', 'glory', 'victory', 'supremacy', 'destiny', 'wealth', 'heritage', 'history'];
	let pls = pre_fen.players = {};
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	for (const plname of player_names) {
		let pl = pls[plname] = {
			hand: [],
			board: { blue: [], red: [], green: [], yellow: [], purple: [] },
			splays: { blue: 0, red: 0, green: 0, yellow: 0, purple: 0 },
			achievements: [],
			scored: [],
			forecast: [],
			artifact: null
		};
		last_elem_from_to(deck1, pl.hand); last_elem_from_to(deck2, pl.hand);
	}
	pre_fen.plorder = jsCopy(player_names); //get_random_player_order(player_names);
	let fen = {
		players: pre_fen.players,
		decks: pre_fen.decks,
	};
	addKeys(pre_fen, fen);
	return fen; //[player_names.map(x=>x),fen];
}
function inno_show_other_player_info(ev) {
	console.log('enter', ev.target);
	let id = evToId(ev);
	let g = Session;
	let plname = stringAfter(id, '_');
	let pl = firstCond(g.players, x => x.name == plname);
	console.log('player info for', pl);
}
function inno_shuffle_decks() {
	for (const exp in Dinno) {
		for (const age in Dinno[exp]) {
			shuffle(Dinno[exp][age]);
		}
	}
}
function inno_stat_sym(key, n, dParent, sz) {
	let d = mDiv(dParent, { display: 'flex', dir: 'c', fz: sz });
	let s = mSym(INNO.sym[key].key, d, { h: sz, fz: sz, fg: INNO.sym[key].fg });
	d.innerHTML += `<span>${n}</span>`;
	return d;
}
function innoAgeNumber(n, dParent, sz, pos, margin = 10) {
	let x = Card.sz * .04; sz -= x; //margin += x / 2;
	let hOff = 0; //margin / 2;
	let styles = { wmin: sz * 1.1, h: sz, bg: '#131313', align: 'center' };
	let box = mShape('hexFlat', dParent, styles); mPlace(box, pos, margin, margin - hOff / 2); //mPlace(box, pos, margin + hOff / 2, margin);
	s = mDiv(box, { fz: sz * .6, fg: 'white', display: 'inline-block' }, null, n);
	mPlace(s, 'cc'); //, 'vertical-align': 'text-top'  },null,n); 
	return box;
}
function innoBonusNumber(n, dParent, sz, pos, margin = 10) {
	let hOff = margin / 2;
	let styles = { w: sz, h: sz - hOff, bg: 'brown', box: true, align: 'center' };
	let box = mShape('circle', dParent, styles); mPlace(box, pos, margin + hOff / 2, margin);
	let dText = mDiv(box, { fz: sz * .1, fg: 'black', 'line-height': sz * .1, matop: sz * .05 }, null, 'bonus');
	let dNum = mDiv(box, { fz: sz * .7, fg: 'black', 'line-height': sz * .65 }, null, n);
	return box;
}
function innoEcho(text, dParent, sz, pos, margin = 10) {
	if (isList(text)) text = text.join('<br>');
	margin /= 2;
	sz += margin / 4;
	let box = mDiv(dParent, { w: sz, h: sz, bg: 'black', fg: 'white', rounding: 10 });
	mPlace(box, pos, margin);
	box.onclick = (ev) => makeInfobox(ev, box, 3);
	let t2 = innoText(text);
	mFillText(t2, box);
	return box;
}
function innoFlag(cardType, dParent, sz, pos, margin = 10) {
	let box = mDiv(dParent, { w: sz, h: sz, bg: INNO.sym.flag.bg, rounding: 10 }); if (isdef(pos)) mPlace(box, pos, margin);
	s = mSym(INNO.sym.flag.key, box, { sz: sz * .75, fg: INNO.sym[cardType].bg }, 'cc');
	return box;
}
function innoInspire(text, dParent, sz, pos, margin = 10) {
	if (isList(text)) text = text.join('<br>');
	margin /= 2;
	sz += margin / 4;
	let box = mDiv(dParent, { w: sz, h: sz, bg: '#ffffff80', fg: 'black', rounding: 10 });
	mPlace(box, pos, margin);
	box.onclick = (ev) => makeInfobox(ev, box, 3);
	let t2 = innoText(text);
	mFillText(t2, box);
	return box;
}
function innoSym(key, dParent, sz, pos, margin = 10) {
	let box = mDiv(dParent, { w: sz, h: sz, bg: INNO.sym[key].bg, rounding: 10 }); if (isdef(pos)) mPlace(box, pos, margin);
	s = mSym(INNO.sym[key].key, box, { sz: sz * .75, fg: INNO.sym[key].fg }, 'cc');
	return box;
}
function innoSymInline(key, dParent) {
	s = mSymInline(INNO.sym[key].key, dParent, { fg: INNO.sym[key].fg, bg: INNO.sym[key].bg, rounding: 10 });
	return s;
}
function innoText(text) {
	for (const s in INNO.sym) { INNO.sym[s].sym = Syms[INNO.sym[s].key]; }
	let parts = text.split('[');
	let s = parts[0];
	for (let i = 1; i < parts.length; i++) {
		let part = parts[i];
		let kw = stringBefore(part, ']');
		let sp;
		let fz = Card.sz * .04;
		if (Object.keys(INNO.sym).includes(kw)) { let o = INNO.sym[kw]; sp = makeSymbolSpan(o.sym, o.bg, o.fg, fz * .9, '20%'); }
		else if (isNumber(kw)) { sp = makeNumberSpan(kw, '#232323', 'white', fz * .9, '20%'); }
		s += sp + stringAfter(part, ']');
	}
	return s;
}
function insertColNew(board, cClick) { return expandBoard(board, board.rows, board.cols + 1, cClick + 1); }
function insertRowNew(board, cClick) { return expandBoard(board, board.rows + 1, board.cols, cClick + 1); }
function iPresentHand(h, dParent, styles, redo = true) {
	if (nundef(h.zone)) h.zone = iHandZone(dParent, styles); else clearElement(h.zone);
	if (nundef(h.iHand)) {
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	} else if (redo) {
		clearElement(h.zone);
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	}
	return h;
}
function iPresentHand_test(dParent, h, redo = true) {
	if (nundef(h.zone)) h.zone = iHandZone_test(dParent); else clearElement(h.zone);
	if (nundef(h.iHand)) {
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	} else if (redo) {
		clearElement(h.zone);
		let items = i52(h.deck.cards());
		h.iHand = iSplay(items, h.zone);
	}
	return h;
}
function iRemakeHand(data) {
	let zone = data.zone;
	let deck = data.deck;
	let items = i52(deck.cards());
	clearElement(zone);
	data.iHand = iSplay(items, zone);
	return data;
}
function iResize52(i, h) { let w = h * .7; return iResize(i, w, h); }
function is_card(o) { return isdef(o.rank) || isdef(o.o) && isdef(o.o.rank); }
function isOppPiece(sym, plSym) { return sym && sym != plSym; }
function iSortHand(dParent, h) {
	let d = h.deck;
	d.sort();
	iPresentHand(dParent, h);
}
function iSortHand_test(dParent, h) {
	let d = h.deck;
	d.sort();
	iPresentHand_test(dParent, h);
}
function iSplay52(i, iContainer, splay = 'right', ov = 20, ovUnit = '%', createiHand = true, rememberFunc = true) {
	let ilist = !isList(i) ? i : [i];
	let items = isNumber(i[0]) ? i52(ilist) : ilist;
	let res = iSplay(items, iContainer, null, 'right', 20, '%', true);
	return res;
}
function iTableBounds(i) { return iBounds(i, dTable); }
function iToRowCol(idx, rows, cols) { let c = idx % cols; let r = (idx - c) / rows; return [r, c]; }
function make_goal_set(deck, prob_different) {
	let [fen1, fen2, fen3] = [deck[0], '', ''];  // 0102
	let n = fen1.length;
	let different = randomNumber(0, n - 1);
	for (let i = 0; i < n; i++) {
		let l1 = fen1[i];
		let same = i == different ? false : coin(prob_different);
		let inc = coin() ? 1 : -1;
		let [l2, l3] = same ? [l1, l1] : ['' + (3 + Number(l1) + inc * 1) % 3, '' + (3 + Number(l1) + inc * 2) % 3];
		fen2 += l2; fen3 += l3;
	}
	return [fen1, fen2, fen3];
}
function make_set_deck(n_or_attr_list) {
	let all_attrs = gSet_attributes();
	let keys = get_keys(all_attrs);
	let n = isNumber(n_or_attr_list) ? n_or_attr_list : n_or_attr_list.length;
	let attrs = isNumber(n_or_attr_list) ? arrTake(keys, n) : n_or_attr_list;
	let list = ['0', '1', '2']; //because each attribute has exactly 3 possible values
	let i = 1;
	while (i < n) {
		let [l1, l2, l3] = [jsCopy(list), jsCopy(list), jsCopy(list)];
		l1 = l1.map(x => '0' + x); l2 = l2.map(x => '1' + x); l3 = l3.map(x => '2' + x);
		list = l1.concat(l2).concat(l3);
		i++;
	}
	return list;
}
function makeEdge(dParent, v1, v2, dFromEdge, ew = 20) {
	let switched = false;
	if (v1.x == v2.x) {
		if (v1.y > v2.y) { let h = v2; v2 = v1; v1 = h; switched = true; }
		let w = ew / 2;
		let sp = `polygon(${v1.x - w + ew}px ${v1.y + dFromEdge + ew}px, ${v1.x + w + ew}px ${v1.y + dFromEdge + ew}px, ${v2.x + w + ew}px ${v2.y - dFromEdge + ew}px, ${v2.x - w + ew}px ${v2.y - dFromEdge + ew}px)`;
		let de = mDiv(dParent, { position: 'absolute', left: -ew, top: -ew, w: '120%', h: '120%' });
		mClass(de, 'edge');
		mStyle(de, { 'clip-path': sp });
		return mItem(null, { div: de }, { type: 'edge' }, true);
	}
	if (v1.x > v2.x) { let h = v2; v2 = v1; v1 = h; switched = true; }
	let dx = v2.x - v1.x;
	let dy = v2.y - v1.y;
	let m = dy / dx;
	let [x1, y1, x2, y2] = [v1.x, v1.y, v2.x, v2.y];
	let alpha = Math.atan(m);
	let xa = x1 + dFromEdge * Math.cos(alpha);
	let ya = y1 + dFromEdge * Math.sin(alpha);
	let xe = x2 - dFromEdge * Math.cos(alpha);
	let ye = y2 - dFromEdge * Math.sin(alpha);
	let m2 = -1 / m;
	let beta = Math.atan(m2);
	let w = ew / 2;
	let x1t = xa + w * Math.cos(beta);
	let y1t = ya + w * Math.sin(beta);
	let x1b = xa - w * Math.cos(beta);
	let y1b = ya - w * Math.sin(beta);
	let x2t = xe + w * Math.cos(beta);
	let y2t = ye + w * Math.sin(beta);
	let x2b = xe - w * Math.cos(beta);
	let y2b = ye - w * Math.sin(beta);
	let de = mDiv(dParent, { position: 'absolute', left: 0, top: 0, w: '120%', h: '120%' });
	mStyle(de, { 'clip-path': `polygon(${x1t}px ${y1t}px, ${x2t}px ${y2t}px, ${x2b}px ${y2b}px, ${x1b}px ${y1b}px)` });
	mClass(de, 'edge');
	return mItem(null, { div: de }, { type: 'edge' }, true);
}
function makeInfobox(ev, elem, scale) {
	let t = ev.target; while (isdef(t) && t != elem) t = t.parentNode; if (nundef(t)) { console.log('WRONG click', ev.target); return; }
	let di = DA.infobox; if (isdef(di)) {
		let inner = di.innerHTML;
		di.remove();
		DA.infobox = null;
		if (inner == elem.innerHTML) return;
	}
	let r = getRectInt(elem, dTable);
	let d = DA.infobox = mDiv(dTable, {
		bg: 'black', rounding: 10, fz: 24, position: 'absolute',
		w: r.w, h: r.h, left: r.l, top: r.t, transform: `scale(${scale})`
	}, 'dInfoBox', elem.innerHTML);
	d.innerHTML += '<div style="font-size:6px">click to close</div><br>';
	d.onclick = () => { d.remove(); DA.infobox = null; }
}
function makeInnoNumberDiv(n, fz) {
	return `<span style='background:white;color:black;padding:2px 10px;border-radius:50%'>${n}</span>`;
}
function makeInnoSymbolDiv(info, bg, fz = 20) {
	return `<div style='text-align:center;display:inline;background-color:${bg};width:40px;padding:2px ${fz / 2}px;
	font-size:${fz}px;font-family:${info.family}'>${info.text}</div>`;
}
function makeNumberSpan(n, bg, fg, fz, rounding = '50%') {
	return `<span style='font-size:${fz}px;background:${bg};color:${fg};padding:0px 5px;border-radius:${rounding}'>${n}</span>`;
}
function makeSymbolSpan(info, bg, fg, fz, rounding = '50%') {
	let patop = Math.min(2, fz * .2);
	let pad = '5% 10%'; pad = '3px 5px'; pad = `${patop}px ${patop * 2}px`;
	if (info.key == 'queen-crown') pad = `${patop}px ${patop}px ${1}px ${patop}px`;
	else if (info.key == 'leaf') pad = `${1}px ${patop}px ${patop}px ${patop}px`;
	else if (info.key == 'white-tower') pad = `${patop}px ${patop * 2}px ${patop - 1}px ${patop * 2}px`;
	return `<div style='box-sizing:border-box;padding:${pad};min-height:${fz + 3}px;display:inline-block;font-family:${info.family};font-size:${fz}px;background:${bg};color:${fg};border-radius:${rounding}'>${info.text}</div>`;
}
function mCols(dParent, arr, itemStyles = { bg: 'random' }, rowStyles, colStyles, akku) {
	let d0 = mDiv100(dParent, { display: 'flex', 'justify-content': 'space-between' }); //,'align-items':'center'});
	if (isdef(colStyles)) mStyle(d0, colStyles);
	for (let i = 0; i < arr.length; i++) {
		let content = arr[i];
		if (isList(content)) {
			d1 = mDiv(d0); //,null,randomName());
			mRows(d1, content, itemStyles, rowStyles, colStyles, akku);
		} else {
			d1 = mContent(content, d0, itemStyles); //mDiv(d0, styles, null, content);
			akku.push(d1);
		}
	}
}
function mColsX(dParent, arr, itemStyles = { bg: 'random' }, rowStyles, colStyles, akku) {
	let d0 = mDiv100(dParent, { display: 'flex', 'justify-content': 'space-between' }); //,'align-items':'center'});
	if (isdef(colStyles)) mStyle(d0, colStyles);
	for (let i = 0; i < arr.length; i++) {
		let content = arr[i];
		if (isList(content)) {
			d1 = mDiv(d0); //,null,randomName());
			mRowsX(d1, content, itemStyles, rowStyles, colStyles, akku);
		} else {
			d1 = mContentX(content, d0, itemStyles); //mDiv(d0, styles, null, content);
			akku.push(d1);
		}
	}
}
function mContainerSplay(d, splay, w, h, num, ov) {
	if (nundef(splay)) splay = 2;
	if (!isNumber(splay)) splay = get_splay_number(splay);
	if (isString(ov) && ov[ov.length - 1] == '%') ov = splay == 0 ? 1 : splay == 3 ? Number(ov) * h / 100 : Number(ov) * w / 100;
	if (splay == 3) {
		d.style.display = 'grid';
		d.style.gridTemplateRows = `repeat(${num},${ov}px)`;
		console.log('HAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLLLLLLLOOOOOOOOOOOOOOOOOOOOOOOOO')
		d.style.minHeight = `${h + (num - 1) * (ov * 1.1)}px`;
	} else if (splay == 2 || splay == 1) {
		d.style.display = 'grid';
		d.style.gridTemplateColumns = `repeat(${num},${ov}px)`;
		let wnew = w + (num - 1) * (ov * 1.1);
		d.style.minWidth = `${w + (num - 1) * (ov * 1.1)}px`;
	} else if (splay == 0) {
		d.style.display = 'grid'; ov = .5
		d.style.gridTemplateColumns = `repeat(${num},${ov}px)`;
		d.style.minWidth = `${w + (num - 1) * (ov * 1.1)}px`;
	} else if (splay == 5) { //lead card has wider splay than rest
		d.style.display = 'grid';
		d.style.gridTemplateColumns = `${ov}px repeat(${num-1},${ov/2}px)`; //100px repeat(auto-fill, 100px)
		d.style.minWidth = `${w + (num) * (ov/2 * 1.1)}px`;
	} else if (splay == 4) {
		d.style.position = 'relative';
		if (nundef(ov)) ov = .5;
		d.style.minWidth = `${w + (num - 1) * (ov * 1.1)}px`;
		d.style.minHeight = `${h + (num - 1) * (ov * 1.1)}px`;
	}
}
function mContainerSplay_WORKS(d, splay, w, h, num, ov) {
	if (!isNumber(splay)) splay = get_splay_number(splay);
	if (isString(ov) && ov[ov.length - 1] == '%') ov = splay == 0 ? 1 : splay == 3 ? Number(ov) * h / 100 : Number(ov) * w / 100;
	if (splay == 3) {
		d.style.display = 'grid';
		d.style.gridTemplateRows = `repeat(${num},${ov}px)`;
		d.style.height = `${h + (num - 1) * (ov * 1.1)}px`;
	} else if (splay == 2 || splay == 1) {
		d.style.display = 'grid';
		d.style.gridTemplateColumns = `repeat(${num},${ov}px)`;
		d.style.width = `${w + (num - 1) * (ov * 1.1)}px`;
	} else if (splay == 0) {
		d.style.display = 'grid'; ov = .5
		d.style.gridTemplateColumns = `repeat(${num},${ov}px)`;
		d.style.width = `${w + (num - 1) * (ov * 1.1)}px`;
	} else if (splay == 4) {
		d.style.position = 'relative';
		if (nundef(ov)) ov = .5;
		d.style.width = `${w + (num - 1) * (ov * 1.1)}px`;
		d.style.height = `${h + (num - 1) * (ov * 1.1)}px`;
	}
}
function mContent(content, dParent, styles) {
	let d1 = isdef(Syms[content]) ? mSymInDivShrink(content, dParent, styles) : mDiv(dParent, styles, null, content);
	return d1;
}
function mContentX(content, dParent, styles = { sz: Card.sz / 5, fg: 'random' }) {
	let [key, scale] = isDict(content) ? [content.key, content.scale] : [content, 1];
	if (scale != 1) { styles.transform = `scale(${scale},${Math.abs(scale)})`; }
	let dResult = mDiv(dParent);
	let ds = isdef(Syms[key]) ? mSym(key, dResult, styles) : mDiv(dResult, styles, null, key);
	return dResult;
}
function mFillText(text, box, padding = 10, perleft = 10, pertop = 20) {
	let r = mMeasure(box);
	let [fz, w, h] = fitFont(text, 14, r.w - padding, r.h - padding);
	let dText = mDiv(box, {
		w: w, h: h, fz: fz,
		position: 'absolute', transform: `translate(-${perleft}%,-${pertop}%)`, top: `${pertop}%`, left: `${perleft}%`
	}, null, text);
	return dText;
}
function mgPos(card, el, x = 0, y = 0, unit = '%', anchor = 'center') {
	mAppend(iG(card), el);
	let box = el.getBBox();
	console.log('rect', box);
	el.setAttribute('x', x);
	el.setAttribute('y', y);
}
function mgShape(key) {
}
function mgSize(el, h, w) {
	el.setAttribute('height', h);
	if (isdef(w)) el.setAttribute('width', w);
}
function mgSuit(key) {
	let el = gCreate('use');
	el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + key);
	return el;
}
function mgSuit1(card, key, h, x, y) {
	el = document.createElementNS('http://www.w3.org/2000/svg', 'use');
	el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${key}`);
	el.setAttribute('height', h);
	el.setAttribute('width', h);
	el.setAttribute('x', x);
	el.setAttribute('y', y);
	mAppend(iG(card), el);
	return el;
}
function mgSym(key) {
	let el = gCreate('text');
	let info = Syms[key];
	mStyle(el, { family: info.family });
	el.innerHTML = info.text;
	return el;
}
function mItemSplay(item, list, splay, ov = .5) {
	if (!isNumber(splay)) splay = get_splay_number(splay);
	let d = iDiv(item);
	let idx = list.indexOf(item.key);
	if (splay == 4) {
		let offset = (list.length - idx) * ov;
		mStyle(d, { position: 'absolute', left: offset, top: offset }); //,Z:list.length - idx});
		d.style.zIndex = list.length - idx;
	} else {
		d.style.zIndex = splay != 2 ? list.length - idx : 0;
	}
}
function mPlaceText(text, where, dParent, styles, innerStyles, classes) {
	let box;
	if (where.length == 4) {
		let [t, r, b, l] = where;
		box = mBoxFromMargins(dParent, t, r, b, l);
	} else if (where.length == 3) {
		let [wb, hb, place] = where;
		box = mDiv(dParent, { w: wb, h: hb });
		mPlace(box, place);
	}
	let r = mMeasure(box);
	let [fz, w, h] = fitFont(text, 20, r.w, r.h);
	console.log('res', fz, w, h);
	let dText = mDiv(box, {
		w: w, h: h, fz: fz,
		position: 'absolute', transform: 'translate(-50%,-50%)', top: '50%', left: '50%'
	}, null, text);
	if (isdef(styles)) mStyle(box, styles);
	if (isdef(innerStyles)) mStyle(dText, innerStyles);
	if (isdef(classes)) mStyle(box, classes);
	return box;
}
function mRows(dParent, arr, itemStyles = { bg: 'random' }, rowStyles, colStyles, akku) {
	let d0 = mDiv100(dParent, { display: 'flex', dir: 'column', 'justify-content': 'space-between' });//,'align-items':'center'});
	if (isdef(rowStyles)) mStyle(d0, rowStyles);
	for (let i = 0; i < arr.length; i++) {
		let content = arr[i];
		if (isList(content)) {
			let d1 = mDiv(d0); //,null,randomName());
			mCols(d1, content, itemStyles, rowStyles, colStyles, akku);
		} else {
			d1 = mContent(content, d0, itemStyles); //mDiv(d0, styles, null, content);
			akku.push(d1);
		}
	}
}
function mRowsX(dParent, arr, itemStyles = { bg: 'random' }, rowStyles, colStyles, akku) {
	let d0 = mDiv100(dParent, { display: 'flex', dir: 'column', 'justify-content': 'space-between' });//,'align-items':'center'});
	if (isdef(rowStyles)) mStyle(d0, rowStyles);
	for (let i = 0; i < arr.length; i++) {
		let content = arr[i];
		if (isList(content)) {
			let d1 = mDiv(d0); 
			mColsX(d1, content, itemStyles, rowStyles, colStyles, akku);
		} else {
			d1 = mContentX(content, d0, itemStyles); 
			akku.push(d1);
		}
	}
}
function mSymbol(key, dParent, sz, styles = {}) {
	console.log('key', key)
	let info = symbolDict[key];
	fzStandard = info.fz;
	hStandard = info.h[0];
	wStandard = info.w[0];
	let fzMax = fzStandard * sz / Math.max(hStandard, wStandard);
	fzMax *= .9;
	let fz = isdef(styles.fz) && styles.fz < fzMax ? styles.fz : fzMax;
	let wi = wStandard * fz / 100;
	let hi = hStandard * fz / 100;
	let vpadding = 2 + Math.ceil((sz - hi) / 2); console.log('***vpadding', vpadding)
	let hpadding = Math.ceil((sz - wi) / 2);
	let margin = '' + vpadding + 'px ' + hpadding + 'px'; //''+vpadding+'px '+hpadding+' ';
	let newStyles = deepmergeOverride({ fz: fz, align: 'center', w: sz, h: sz, bg: 'white' }, styles);
	newStyles.fz = fz;
	let d = mDiv(dParent, newStyles);
	console.log(key, info)
	let txt = mText(info.text, d, { family: info.family });
	console.log('-----------', margin, hpadding, vpadding);
	mStyle(txt, { margin: margin, 'box-sizing': 'border-box' });
	return d;
}
function mSymFramed(info, bg, sz) {
	let [w, h, fz] = [sz, sz, sz * .7];
	return mCreateFrom(`<div style='
	text-align:center;display:inline;background-color:${bg};
	font-size:${fz}px;overflow:hidden;
	font-family:${info.family}'>${info.text}</div>`);
}
function mSymInDiv(sym, dParent, styles = { sz: Card.sz / 5, fg: 'random' }) {
	dResult = mDiv(dParent);
	ds = mSym(sym, dResult, styles);
	return dResult;
}
function mSymInDivShrink(sym, dParent, styles = { sz: Card.sz / 5, fg: 'random' }) {
	dResult = mDiv(dParent);
	let ds = mSym(sym, dResult, styles);
	let scale = chooseRandom([.5, .75, 1, 1.25]);
	let [scaleX, scaleY] = [coin() ? scale : -scale, scale];
	if (coin()) ds.style.transform = `scale(${scaleX},${scaleY})`;
	return dResult;
}
function mSymInline(key, dParent, styles) {
	let info = Syms[key];
	styles.family = info.family;
	let el = mSpan(dParent, styles, null, info.text);
	return text;
}
function mTableCommands(rowitems, di) {
	let t = rowitems[0].div.parentNode;
	mTableHeader(t, 'commands');
	for (const item of rowitems) {
		let drow = item.div;
		let dcol = mTableCol(drow);
		let colitem = { div: dcol, key: 'commands', val: null };
		item.colitems.push(colitem);
		let html = '';
		for (const k in di) {
			html += di[k](item); //`<a href="/loggedin/${item.o.name}">login</a>`);
		}
		dcol.innerHTML = html;
	}
}
function name2id(name) { return 'd_' + name.split(' ').join('_'); }
function neighborhood(items, byrc) {
	let adjList = [];
	let di = {};
	for (const info of items) {
		if (info.type != 'field') continue;
		let [r, c] = [info.row, info.col];
		info.nodeItems = [
			lookup(byrc, [r - 2, c]),
			lookup(byrc, [r - 1, c + 1]),
			lookup(byrc, [r + 1, c + 1]),
			lookup(byrc, [r + 2, c]),
			lookup(byrc, [r + 1, c - 1]),
			lookup(byrc, [r - 1, c - 1]),
		];
		info.nodes = info.nodeItems.map(x => isdef(x) ? x.id : null);
		delete info.nodeItems;
		for (let i = 0; i < 6; i++) {
			let n1 = info.nodes[i];
			if (n1 == null) continue;
			let n2 = info.nodes[(i + 1 % 6)];
			if (n2 == null) continue;
			if (lookup(di, [n1, n2]) || lookup(di, [n2, n1])) continue;
			lookupSet(di, [n1, n2], true);
			adjList.push([n1, n2]);
		}
		info.neiItems = [
			lookup(byrc, [r - 3, c + 1]),
			lookup(byrc, [r, c + 2]),
			lookup(byrc, [r + 3, c + 1]),
			lookup(byrc, [r + 3, c - 1]),
			lookup(byrc, [r, c - 2]),
			lookup(byrc, [r - 3, c - 1]),
		];
		info.nei = info.neiItems.map(x => isdef(x) ? x.id : null);
		delete info.neiItems;
	}
}
function netHandSize(nmax, hCard, wCard, ovPercent = 20, splay = 'right') {
	let isHorizontal = splay == 'right' || splay == 'left';
	if (nundef(hCard)) hCard = 110;
	if (nundef(wCard)) wCard = Math.round(hCard * .7);
	return isHorizontal ? { w: wCard + (nmax - 1) * wCard * ovPercent / 100, h: hCard } : { w: wCard, h: hCard + (nmax - 1) * hCard * ovPercent / 100 };
}
function onclick_cancelmenu() { hide('dMenu'); }
function onclick_home() { stopgame(); start_with_assets(); }
function onclick_lamp() {
	DA.simple = !DA.simple;
	if (DA.simple) show_simple_ui(); else show_advanced_ui();
	if (isVisible('dTables')) onclick_tables();
}
function onclick_last_test() {
	stop_game();
	stop_polling();
	DA.test.iter = 0;
	DA.test.suiteRunning = false;
	onclick_ut_n('ari', DA.test.number);
}
function onclick_pause_continue() {
	let b = mBy('bPauseContinue');
	clearTimeout(TO.ai);
	onclick_stoppolling();
	show_status('game is paused', true);
	mStyle(b, { fg: 'grey' });
}
function onclick_player_in_gametable(uname, tablename, rid) {
	stopgame();
	U = firstCond(Serverdata.users, x => x.name == uname);
	send_or_sim({ friendly: tablename, uname: U.name,  }, 'table');
}
function onclick_reset_past() { stopgame(); phpPost({ app: 'simple' }, 'delete_past'); }
function onclick_run_tests() {
	stop_game();
	stop_polling();
	shield_on();
	DA.test.iter = 0;
	DA.test.suiteRunning = true;
	if (nundef(DA.test.list)) {
		console.log('taking default DA.test.list');
		DA.test.list = [100, 101];
	}
	test_engine_run_next(DA.test.list);
}
function onclick_step() {
	DA.test.step = true;
	DA.test.running = true;
	if (!isEmpty(DA.chain)) { dachainext(1000); return; }
	let testnumber = valf(mBy('intestnumber').value, 110);
	if (!isNumber(testnumber)) testnumber = 110;
	console.log('test for step is', testnumber);
	DA.test.number = testnumber;
	onclick_last_test();
}
function onclick_ut_n(g, n) {
	DA.test.running = true;
	let [fen, player_names] = window[`${g}_ut${n}_create_staged`]();
	get_create_staged(fen, { level_setting: 'min' }, player_names);
}
function oneCircleCenters(rows, cols, wCell, hCell) {
	let [w, h] = [cols * wCell, rows * hCell];
	let cx = w / 2;
	let cy = h / 2;
	let centers = [{ x: cx, y: cy }];
	let n = 8;
	let radx = cx - wCell / 2;
	let rady = cy - hCell / 2;
	let peri = Math.min(radx, rady) * 2 * Math.PI;
	n = Math.floor(peri / Math.min(wCell, hCell));
	while (n > 4 && n % 4 != 0 && n % 6 != 0) n -= 1;
	centers = getEllipsePoints(radx, rady, n)
	centers = centers.map(pt => ({ x: pt.X + cx, y: pt.Y + cy }));
	return [centers, wCell * cols, hCell * rows];
}
function placeSymbol(sym, szSym, margin, posStyles) {
	let d = iDiv(sym);
	posStyles.position = 'absolute';
	posStyles.margin = margin;
	posStyles.h = szSym;
	posStyles.w = szSym; //sym.isEcho ? szSym * 3 : szSym;
	mStyle(d, posStyles); // { position: 'absolute', w: w, h: szSym, left: left, top: top, margin: margin });
}
function printBoard(arr, rows, cols, reduced = true) {
	let arrR = boardArrOmitFirstRowCol(arr, rows, cols);
	let s = toBoardString(arrR, rows, cols);
	console.log('board', s);
}
function printMatrix(arr2d, title = 'result') {
	let rows = arr2d.length;
	let cols = arr2d[0].length;
	let arr = arrFlatten(arr2d);
	let s = toBoardString(arr, rows, cols);
	console.log(title, s)
}
function printState(state, cols, rows) {
	let formattedString = '';
	state.forEach((cell, index) => {
		formattedString += isdef(cell) ? ` ${cell == '0' ? ' ' : cell} |` : '   |';
		if ((index + 1) % cols == 0) {
			formattedString = formattedString.slice(0, -1);
			if (index < rows * cols - 1) {
				let s = '\u2015\u2015\u2015 '.repeat(cols);
				formattedString += '\n' + s + '\n'; //\u2015\u2015\u2015 \u2015\u2015\u2015 \u2015\u2015\u2015\n';
			}
		}
	});
	console.log('%c' + formattedString, 'color: #6d4e42;font-size:10px');
	console.log();
}
function quadCenters(rows, cols, wCell, hCell) {
	let offX = wCell / 2, offY = hCell / 2;
	let centers = [];
	let x = 0; y = 0;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let center = { x: x + offX, y: y + offY };
			centers.push(center);
			x += wCell;
		}
		y += hCell; x = 0;
	}
	return [centers, wCell * cols, hCell * rows];
}
function randomC52() { return Card52.getShortString(randomCard52()); }
function randomCard52() { return Card52.random(); }
function randomRank() { return Card52.randomRankSuit[0]; }
function randomSuit() { return Card52.randomRankSuit[1]; }
function reduceBoard(board, rNew, cNew, iModify) {
	let [boardArrOld, rOld, cOld] = [board.fields.map(x => isdef(x.item) ? x.item.index : null), board.rows, board.cols];
	let rest = [];
	if (rOld > rNew) { rest = bGetRow(boardArrOld, iModify, rOld, cOld).filter(x => x != null); }
	else if (cOld > cNew) { rest = bGetCol(boardArrOld, iModify, rOld, cOld).filter(x => x != null); }
	let boardArrNew = new Array(rNew * cNew);
	for (let r = 0; r < rNew; r++) {
		for (let c = 0; c < cNew; c++) {
			let i = iFromRowCol(r, c, rNew, cNew);
			let x = (rOld != rNew) ? r : c;
			if (x < iModify) {
				let iOld = iFromRowCol(r, c, rOld, cOld);
				boardArrNew[i] = boardArrOld[iOld];
			}
			else {
				let [ir, ic] = (rOld != rNew) ? [r + 1, c] : [r, c + 1];
				let iOld = iFromRowCol(ir, ic, rOld, cOld);
				boardArrNew[i] = boardArrOld[iOld];
			}
		}
	}
	return { rows: rNew, cols: cNew, boardArr: boardArrNew, extras: rest };
}
function removeColNew(board, cClick) { return reduceBoard(board, board.rows, board.cols - 1, cClick); }
function removeRowNew(board, cClick) { return reduceBoard(board, board.rows - 1, board.cols, cClick); }
function rPlayerOrder(players) { return shuffle(jsCopy(players)); }
function set_card_constants(w, h, ranks, suits, deckletters, numjokers = 0, ovdeck = .25, ovw = '20%', ovh = '20%') {
	Card = {};
	Card.sz = valf(h, 300);
	Card.h = h;
	Card.w = isdef(w) ? w : Card.sz * .7;
	Card.gap = Card.sz * .05;
	Card.ovdeck = ovdeck;
	Card.ovw = isString(ovw) ? Card.w * firstNumber(ovw) / 100 : ovw;
	Card.ovh = isString(ovh) ? Card.h * firstNumber(ovh) / 100 : ovh;
	Card.ranks = valf(ranks, '23456789TJQKA');
	Card.suits = valf(suits, 'SHDC');
	Card.decks = valf(deckletters, 'rb'); //colors of backside rbgyop (red,blue,green,yellow,orange,purple)
	Card.numdecks = deckletters.length;
	Card.numjokers = numjokers;
}
function setSymLabel(g, id, key, styles = {}) {
	if (nundef(Syms[key])) return;
	let info = Syms[key];
	console.log('family', info.family);
	g.setLabel(id, info.text, addKeys({ fz: 40, family: info.family }, styles));
}
function show_advanced_ui() {
	show('dButtons');
	show('dTest0');
	show('dTopAdvanced');
	DA.testing = true;
	DA.test = { iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [100, 101] };
	DA.test.list = arrRange(100, 101); //[];// [100, 101, 102, 103, 104];
	DA.test.number = 306; // do NOT set this to 107 in real mode!
	DA.staged_moves = []; DA.iter = 100; DA.auto_moves = {};
}
function show_card(dParent, key, type = 'aristo') {
	if (type == 'spotit') {
		Card.sz = 200;
		let [rows, cols, numCards, setName] = [3, 2, 2, valf(key, 'animals')];
		let infos = spotitDeal(rows, cols, numCards, setName); //backend
		let items = [];//frontend
		for (const info of infos) {
			let item = spotitCard(info, dParent, { margin: 10 }, spotitOnClickSymbol);
			mStyle(iDiv(item), { padding: 12 });
			items.push(item);
		}
	} else if (type == 'aristo') {
		let card = ari_get_card(valf(key, 'ASr'));
		mAppend(dParent, iDiv(card))
	}
}
function show_medium_ui() { DA.testing = false; hide('dButtons'); hide('dTest0'); hide('dTopAdvanced'); toggle_games_off(); } //toggle_tables_off();  }
function show_settings_orig(options) {
	clearElement('dTitleRight');
	let dParent = mDiv(mBy('dTitleRight'), { display: 'flex', fg: 'red' }, null, options.mode == 'hotseat' ? 'h' : '');
	let d = miPic('gear', dParent, { fz: 20, padding: 6, h: 40, box: true, matop: 2, rounding: '50%', cursor: 'pointer' });
	d.onmouseenter = () => show_options_popup(options);
	d.onmouseleave = hide_options_popup;
}
function show_simple_ui_orig() {
	DA.testing = false;
	hide('dButtons');
	hide('dTest0');
	hide('dTopAdvanced');
	toggle_games_off();
	toggle_tables_off();
	toggle_users_on();
}
function show_status_orig(msg = '', stay) {
	if (isdef(stay)) showFleetingMessage(msg, mBy('dStatus'), { fg: 'red' }, 1000, 0, false);
	else showFleetingMessage(msg, mBy('dStatus'), { fg: 'black' });  
}
function show_title_left(s, styles, funnyLetters = false) {
	let d = mBy('dTitleLeft');
	d.innerHTML = `${funnyLetters ? mColorLetters(s) : s}`;
	if (isdef(styles)) mStyle(d, styles);
}
function show_title_right(s, styles, funnyLetters = false) {
	let d = mBy('dTitleRight');
	d.innerHTML = `${funnyLetters ? mColorLetters(s) : s}`;
	if (isdef(styles)) mStyle(d, styles);
}
function show_user() {
	if (isdef(U) && U.name != 'anonymous') {
		let uname = U.name;
		let sz = 36;
		let html = `
		<div username='${uname}' style='display:flex;align-items:center;gap:6px;height:100%'>
			<img src='../base/assets/images/${uname}.jpg' width='${sz}' height='${sz}' class='img_person' style='border:3px solid ${U.color};margin:0'>
			<span>${uname}</span>
		</div>`;
		show_title_left(html, { fg: U.color });
	}
	else show_home_logo();
}
function show_x_button(dParent) {
	let b = mButton('close', () => hide(dParent), dParent, { maleft: '95%' });
}
function showCards(o, type) {
	let d2 = iDiv(o);
	if (nundef(type)) type = isdef(o.type) ? o.type : 'hand';
	let arr = type == 'deck' ? o.deck.cards() : o.cards;
	let cont = type == 'deck' ? stdDeckContainer(d2, arr.length) : startsWith(type, 'cards') ? stdCardsContainer(d2, arr.length) : stdHandContainer(d2, arr.length);
	let items = arr.map(x => Card52.getItem(x % 52));
	if (endsWith(type, 'Hidden') || type == 'deck') items.map(x => Card52.turnFaceDown(x, BG_CARD_BACK));
	items.map(x => mAppend(cont, iDiv(x)));
	return items;
}
function sort_cards_orig(hand, bysuit = true, byrank = true) {
	let ranked = hand.map(x => ({ x: x, r: x[0], s: x[1] }));
	let rankstr = 'A23456789TJQK';
	if (bysuit && byrank) {
		sortByFunc(ranked, x => 3 * x.s.charCodeAt(0) + 2 * rankstr.indexOf(x.r));
	} else if (bysuit) {
		sortByFunc(ranked, x => x.s.charCodeAt(0));
	} else if (byrank) {
		sortByFunc(ranked, x => rankstr.indexOf(x.r));
	}
	return ranked.map(x => x.x);
}
function splayout(elems, dParent, w, h, x, y, overlap = 20, splay = 'right') {
	function splayRight(elems, d, x, y, overlap) {
		for (const c of elems) {
			mAppend(d, c);
			mStyle(c, { position: 'absolute', left: x, top: y });
			x += overlap;
		}
		return [x, y];
	}
	function splayLeft(elems, d, x, y, overlap) {
		x += (elems.length - 2) * overlap;
		let xLast = x;
		for (const c of elems) {
			mAppend(d, c);
			mStyle(c, { position: 'absolute', left: x, top: y });
			x -= overlap;
		}
		return [xLast, y];
	}
	function splayDown(elems, d, x, y, overlap) {
		for (const c of elems) {
			mAppend(d, c);
			mStyle(c, { position: 'absolute', left: x, top: y });
			y += overlap;
		}
		return [x, y];
	}
	function splayUp(elems, d, x, y, overlap) {
		y += (elems.length - 1) * overlap;
		let yLast = y;
		for (const c of elems) {
			mAppend(d, c);
			mStyle(c, { position: 'absolute', left: x, top: y });
			y -= overlap;
		}
		return [x, yLast];
	}
	if (isEmpty(elems)) return { w: 0, h: 0 };
	mStyle(dParent, { display: 'block', position: 'relative' });
	[x, y] = (eval('splay' + capitalize(splay)))(elems, dParent, x, y, overlap);
	let isHorizontal = splay == 'right' || splay == 'left';
	let sz = { w: (isHorizontal ? (x - overlap + w) : w), h: (isHorizontal ? h : (y - overlap + h)) };
	return sz;
}
function spotitCard(info, dParent, cardStyles, onClickSym) {
	let styles = copyKeys({ w: Card.sz, h: Card.sz }, cardStyles);
	let card = cRound(dParent, cardStyles, info.id);
	addKeys(info, card);
	let d = iDiv(card);
	card.pattern = fillColarr(card.colarr, card.keys);
	let symStyles = { sz: Card.sz / (card.rows + 1), fg: 'random', hmargin: 8, vmargin: 4, cursor: 'pointer' };
	let syms = [];
	mRows(iDiv(card), card.pattern, symStyles, { 'justify-content': 'center' }, { 'justify-content': 'center' }, syms);
	for (let i = 0; i < info.keys.length; i++) {
		let key = card.keys[i];
		let sym = syms[i];
		card.live[key] = sym;
		sym.setAttribute('key', key);
		sym.onclick = onClickSym;
	}
	return card;
}
function spotitDeal(rows, cols, numCards, setName) {
	let colarr = _calc_hex_col_array(rows, cols);
	let perCard = arrSum(colarr);
	let nShared = (numCards * (numCards - 1)) / 2;
	let nUnique = perCard - numCards + 1;
	let keys = choose(oneWordKeys(KeySets[setName]), nShared + numCards * nUnique);
	let dupls = keys.slice(0, nShared); //these keys are shared: cards 1 and 2 share the first one, 1 and 3 the second one,...
	let uniqs = keys.slice(nShared);
	let infos = [];
	for (let i = 0; i < numCards; i++) {
		let keylist = uniqs.slice(i * nUnique, i * nUnique + nUnique);
		let info = { id: getUID(), shares: {}, keys: keylist, rows: rows, cols: cols, colarr: colarr };
		infos.push(info);
	}
	let iShared = 0;
	for (let i = 0; i < numCards; i++) {
		for (let j = i + 1; j < numCards; j++) {
			let c1 = infos[i];
			let c2 = infos[j];
			let dupl = dupls[iShared++];
			c1.keys.push(dupl);
			c1.shares[c2.id] = dupl;
			c2.shares[c1.id] = dupl;
			c2.keys.push(dupl);
		}
	}
	for (const info of infos) { shuffle(info.keys); }
	return infos;
}
function spotitFindCardSharingSymbol(card, key) {
	let id = firstCondDict(card.shares, x => x == key);
	return Items[id];
}
function spotitFindSymbol(card, key) { let k = firstCondDictKey(card.live, x => x == key); return card.live[k]; }
function spotitOnClickSymbol(ev) {
	let keyClicked = evToProp(ev, 'key');
	let id = evToId(ev);
	if (isdef(keyClicked) && isdef(Items[id])) {
		let item = Items[id];
		console.log('clicked key', keyClicked, 'of card', id, item);
		if (Object.values(item.shares).includes(keyClicked)) {
			console.log('success!!!');//success!
			let otherCard = spotitFindCardSharingSymbol(item, keyClicked);
			let cardSymbol = ev.target;
			let otherSymbol = spotitFindSymbol(otherCard, keyClicked);
			Selected = { success: true, feedbackUI: [cardSymbol, otherSymbol] };
		} else {
			console.log('fail!!!!!!!!'); //fail
			let cardSymbol = ev.target;
			Selected = { success: false, feedbackUI: [cardSymbol] };
		}
	}
}
function stdCardsContainer(dParent, n, ov = 80, styles = {}) { return stdRowOverlapContainer(dParent, n, n * ov + 22, ov, addKeys({ paleft: 20, patop: 10 }, styles)); }
function stdColOverlapContainer(dParent, n, wGrid, wCell, styles) {
	addKeys({
		h: wGrid,
		gap: 0,
		display: 'inline-grid',
		'grid-template-rows': `repeat(${n}, ${wCell}px)`
	}, styles);
	return mDiv(dParent, styles);
}
function stdDeckContainer(dParent, n, ov = .25, styles = {}) { return stdRowOverlapContainer(dParent, n, 140, ov, addKeys({ padding: 10 }, styles)); }
function stdGridContainer(dParent, wCell, styles = {}) {
	addKeys({
		wmax: 500,
		margin: 'auto',
		padding: 10,
		gap: 0,
		display: 'grid',
		bg: 'green',
		'grid-template-columns': `repeat(${20}, ${wCell}px)`
	}, styles);
	return mDiv(dParent, styles);
}
function stdHandContainer(dParent, n, ov = 20, styles = {}) { return stdRowOverlapContainer(dParent, n, 76 + n * ov + 22, ov, addKeys({ padding: 10 }, styles)); }
function stdRowOverlapContainer(dParent, n, wGrid, wCell, styles) {
	addKeys({
		w: wGrid,
		gap: 0,
		display: 'inline-grid',
		'grid-template-columns': `repeat(${n}, ${wCell}px)`
	}, styles);
	return mDiv(dParent, styles);
}
function stdRowsColsContainer(dParent, cols, styles = {}) {
	addKeys({
		margin: 'auto',
		padding: 10,
		gap: 10,
		display: 'grid',
		bg: 'green',
		'grid-template-columns': `repeat(${cols}, 1fr)`
	}, styles);
	return mDiv(dParent, styles);
}
function stringToMatrix(s, rows, cols) {
	if (isNumber(s)) s = String(s);
	let letters = toLetterArray(s);
	let nums = letters.map(x => Number(x));
	let matrix = arrToMatrix(nums, rows, cols);
}
function sudokuSampleToIndexMatrix(s, rows, cols) {
	if (isNumber(s)) s = String(s);
	let letters = toLetterArray(s);
	let nums = letters.map(x => Number(x));
	let res = [];
	for (const n of nums) {
		if (n === 0) res.push(' ');
		else res.push(n - 1);
	}
	let matrix = arrToMatrix(res, rows, cols);
	return matrix;
}
function test_add_building() {
	let [A, fen, uname] = [Z.A, Z.fen, Z.uname];
	let type = rChoose(['farm', 'estate', 'chateau']);
	add_a_correct_building_to(fen, uname, type);
	take_turn_fen();
}
function test_add_schwein() {
	let [A, fen, uname] = [Z.A, Z.fen, Z.uname];
	let type = rChoose(['farm', 'estate', 'chateau']);
	let keys = deck_deal(fen.deck, type[0] == 'f' ? 4 : type[0] == 'e' ? 5 : 6);
	fen.players[uname].buildings[type].push({ list: keys, h: null });
	take_turn_fen();
}
function test_endgame() {
	let [A, fen, uname] = [Z.A, Z.fen, Z.uname];
	fen.actionsCompleted = [];
	for (const plname of fen.plorder) {
		add_a_correct_building_to(fen, plname, 'chateau');
		add_a_correct_building_to(fen, plname, rChoose(['farm', 'estate', 'chateau']));
		if (coin()) add_a_correct_building_to(fen, plname, rChoose(['farm', 'estate', 'chateau']));
		fen.actionsCompleted.push(plname);
	}
	Z.stage = 5;
	Z.phase = 'king';
	take_turn_fen();
}
function test_skip_to_actions() {
	let [A, fen, uname] = [Z.A, Z.fen, Z.uname];
	Z.phase = 'king';
	Z.stage = 5;
	fen.actionsCompleted = [];
	let i = arrMinMax(fen.plorder, x => fen.players[x].hand.length).imin;
	let pl_min_hand = fen.plorder[i];
	console.log('pl w/ min hand is', pl_min_hand);
	let pl = fen.players[pl_min_hand];
	pl.hand = pl.hand.concat(fen.market);
	fen.market = deck_deal(fen.deck, 2);
	for (const plname of fen.plorder) {
		pl = fen.players[plname];
		let n = rNumber(1, pl.hand.length);
		pl.stall = pl.hand.splice(0, n);
	}
	Z.turn = [fen.plorder[rNumber(0, fen.plorder.length - 1)]];
	fen.total_pl_actions = fen.num_actions = fen.players[Z.turn[0]].stall.length;
	fen.action_number = 1;
	take_turn_fen();
}
function test_skip_to_tax() {
	let [A, fen, uname] = [Z.A, Z.fen, Z.uname];
	Z.phase = 'jack';
	Z.stage = 5;
	let iturn = fen.plorder.length - 1;
	Z.turn = [fen.plorder[iturn]];
	fen.actionsCompleted = fen.plorder.slice(0, iturn);
	console.log('fen.actionsCompleted', fen.actionsCompleted);
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		pl.hand = pl.hand.concat(deck_deal(fen.deck, rNumber(0, 5)));
	}
	take_turn_fen();
}
function testanim0() {
	let [fen, phase, stage, deck, market] = [Z.fen, Z.phase, Z.stage, Z.deck, Z.market];
	let ms = 400;
	let item = deck.topmost;
	mAnimate(iDiv(item), 'transform', [`scale(1,1)`, `scale(0,1)`],
		() => {
			if (item.faceUp) face_down(item); else face_up(item);
			mAnimate(iDiv(item), 'transform', [`scale(0,1)`, `scale(1,1)`], null,
				ms / 2, 'ease-in', 0, 'both');
		}, ms / 2, 'ease-out', 100, 'both');
}
function testanim1() {
	let [fen, phase, deck, market] = [Z.fen, Z.phase, Z.deck, Z.market];
	DA.qanim = [];
	let n_market = phase == 'jack' ? 3 : 2;
	fen.stage = Z.stage = phase == 'jack' ? 12 : phase == 'queen' ? 11 : 4;
	for (let i = 0; i < n_market; i++) {
		DA.qanim = DA.qanim.concat([
			[qanim_flip_topmost, [deck]],
			[qanim_move_topmost, [deck, market]],
			[q_move_topmost, [deck, market]],
		]);
	}
	DA.qanim.push([q_mirror_fen, ['deck', 'market']]);
	DA.qanim.push([ari_pre_action, []]);
	qanim();
}
function testjourney0() {
	let [fen, uname] = [Z.fen, Z.uname];
	let plist = find_players_with_potential_journey(fen);
	console.log('journey players', plist);
	if (!plist.includes(uname)) {
		set_nextplayer_after_journey(); //der macht ja auch find_players_with_potential_journey .....
		console.log('Z.turn', Z.turn)
		take_turn_fen();
	}
}
function testSplitIntoNumbersAndWords() {
	let ss = ['1k 2queen', '1 k 12 q', '12king2queen', '31 ace 2queen', '1 3 3 4', '1 10 3 8', '1J3As', '12 koenig 2 Ass'];
	for (const s of ss) {
		let x = splitIntoNumbersAndWords(s);
	}
}
function toBoardString(arr, rows, cols) {
	let s = '\n';
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			let item = arr[r * cols + c];
			s += '' + (nundef(item) ? '_' : item) + ' ';
		}
		s += '\n';
	}
	return s;
}
function toggle_games_off() { let a = mBy('aGames'); hide('dGames'); mStyle(a, { bg: 'silver' }); }
function toggle_games_on() { let a = mBy('aGames'); mStyle(a, { bg: 'skyblue' }); }
function toggle_tables_off() { let a = mBy('aTables'); hide('dTables'); mStyle(a, { bg: 'silver' }); }
function toggle_tables_on() { let a = mBy('aTables'); mStyle(a, { bg: '#afe78f' }); } //'lightgreen' }); }
function toggle_users_off() { let a = mBy('aUsers'); hide('dUsers'); mStyle(a, { bg: 'silver' }); }
function toggle_users_on() { let a = mBy('aUsers'); mStyle(a, { bg: 'coral' }); }
function useSymbolElemNO(key = 'Treff', h = 50, x = 0, y = 0) {
	return mCreateFrom(`<use xlink:href="#${key}" height="${h}" x="${x}" y="${y}"></use>`);
}
//#endregion legacy

//#region apiserver
function _poll() {
	if (nundef(U) || nundef(Z) || nundef(Z.friendly)) { console.log('poll without U or Z!!!', U, Z); return; }
	show_polling_signal();
	if (nundef(DA.pollCounter)) DA.pollCounter = 0; DA.pollCounter++; console.log('polling'); //, DA.pollCounter);
	if (Z.game == 'feedback' && i_am_host()) {
		send_or_sim({ friendly: Z.friendly, uname: Z.uplayer, fen: Z.fen, write_fen: true, auto: true }, 'table');
	} else send_or_sim({ friendly: Z.friendly, uname: Z.uplayer, auto: true }, 'table');
}
function autopoll(ms) { TO.poll = setTimeout(_poll, valf(ms, valf(Z.options.poll, 2000))); }
function ensure_polling() { }
function handle_result(result, cmd) {
	if (result.trim() == "") return;
	let obj;
	try { obj = JSON.parse(result); } catch { console.log('ERROR:', result); }
	if (Clientdata.AUTORESET) { Clientdata.AUTORESET = false; if (result.auto == true) { console.log('message bounced'); return; } }
	DA.result = jsCopy(obj); //console.log('DA.result', DA.result);
	processServerdata(obj, cmd);
	switch (cmd) {
		case "assets": load_assets(obj); start_with_assets(); break;
		case "users": show_users(); break;
		case "tables": show_tables(); break;
		case "delete_table":
		case "delete_tables": show_tables(); break;
		case "table1":
			update_table();
			console.log('cmd', cmd)
			console.log('obj', obj)
			for (const k in obj) { if (isLiteral(obj[k])) { console.log(k, obj[k]); } }
			clear_timeouts();
			gamestep();
			break;
		case "gameover":
		case "table":
		case "startgame":
			update_table();
			if (Z.skip_presentation) { Z.func.state_info(mBy('dTitleLeft')); autopoll(); return; }
			clear_timeouts();
			gamestep();
			break;
	}
}
function load_assets(obj) {
	Config = jsyaml.load(obj.config);
	Syms = jsyaml.load(obj.syms);
	SymKeys = Object.keys(Syms);
	ByGroupSubgroup = jsyaml.load(obj.symGSG);
	C52 = jsyaml.load(obj.c52);
	Cinno = jsyaml.load(obj.cinno);
	Info = jsyaml.load(obj.info);
	Sayings = jsyaml.load(obj.sayings);
	create_card_assets_c52();
	KeySets = getKeySets();
	assertion(isdef(Config), 'NO Config!!!!!!!!!!!!!!!!!!!!!!!!');
}
function phpPost(data, cmd) {
	if (DA.TEST1 === true && cmd == 'table') { cmd = 'table1'; }
	pollStop();
	var o = {};
	o.data = valf(data, {});
	o.cmd = cmd;
	o = JSON.stringify(o);
	if (DA.SIMSIM && (DA.exclusive || ['table', 'startgame', 'gameover', 'tables'].includes(cmd))) {
		sendSIMSIM(o, DA.exclusive);
		FORCE_REDRAW = true;
		if (DA.exclusive) return;
	} else if (DA.simulate) {
		sendSIMSIM(o, true, true);
		FORCE_REDRAW = true;
		return;
	}
	clear_transaction();
	var xml = new XMLHttpRequest();
	loader_on();
	xml.onload = function () {
		if (xml.readyState == 4 || xml.status == 200) {
			loader_off();
			handle_result(xml.responseText, cmd);
		} else { console.log('WTF?????') }
	}
	xml.open("POST", "api.php", true);
	xml.send(o);
}
function pollStop() { clearTimeout(TO.poll); Clientdata.AUTORESET = true; }
function processServerdata(obj, cmd) {
	if (isdef(Serverdata.table)) Serverdata.prevtable = jsCopy(Serverdata.table);
	if (isdef(obj.playerdata)) {
		let old_playerdata = valf(Serverdata.playerdata, []);
		let di = list2dict(old_playerdata, 'name');
		Serverdata.playerdata = if_stringified(obj.playerdata);
		Serverdata.playerdata_changed_for = [];
		for (const o of Serverdata.playerdata) {
			let old = di[o.name];
			o.state = isEmpty(o.state) ? '' : if_stringified(o.state);
			o.state1 = isEmpty(o.state1) ? '' : if_stringified(o.state1);
			o.state2 = isEmpty(o.state2) ? '' : if_stringified(o.state2);
			let changed = nundef(old) ? true : !simpleCompare(old, o);
			if (changed) {
				Serverdata.playerdata_changed_for.push(o.name);
			}
		}
	} else if (isdef(Serverdata.playerdata)) {
		Serverdata.playerdata_changed_for = Serverdata.playerdata.map(x => x.name);
		Serverdata.playerdata = [];
	} else Serverdata.playerdata_changed_for = [];
	for (const k in obj) {
		if (k == 'tables') Serverdata.tables = obj.tables.map(x => unpack_table(x));
		else if (k == 'table') { Serverdata.table = unpack_table(obj.table); }
		else if (k == 'users') Serverdata[k] = obj[k];
		else if (k == 'playerdata') continue;
		else if (cmd != 'assets') Serverdata[k] = obj[k];
	}
	if (isdef(obj.table)) {
		assertion(isdef(Serverdata.table) && obj.table.id == Serverdata.table.id, 'table NOT in Serverdata or table id mismatch');
		let i = Serverdata.tables.findIndex(x => x.id == obj.table.id);
		if (i != -1) { Serverdata.tables[i] = Serverdata.table; } else Serverdata.tables.push(Serverdata.table);
	}
	else if (isdef(Serverdata.table)) {
		let t = Serverdata.tables.find(x => x.id == Serverdata.table.id);
		if (nundef(t)) delete Serverdata.table;
	}
}
function send_or_sim(o, cmd) {
	Counter.server += 1; //console.log('send_or_sim '+Counter.server);
	phpPost(o, cmd);
}
function stopPolling() { pollStop(); }
function unpack_table(table) {
	for (const k of ['players', 'fen', 'options', 'scoring']) {
		let val = table[k];
		if (isdef(table[k])) table[k] = if_stringified(val); if (nundef(table[k])) table[k] = {}; //JSON.parse(table[k]); else table[k] = {};
	}
	if (isdef(table.modified)) { table.modified = Number(table.modified); table.timestamp = new Date(table.modified); table.stime = stringBeforeLast(table.timestamp.toString(), 'G').trim(); }
	assertion(isdef(window[table.game]), 'game function for ' + table.game + ' not defined in window');
	if (isdef(table.game)) { table.func = window[table.game](); }
	if (isdef(table.options.mode)) { table.mode = table.options.mode; }
	delete table.action; delete table.expected;
	return table;
}
function update_table() {
	assertion(isdef(U), 'NO USER LOGGED IN WHEN GETTING TABLE FROM SERVER!!!!!!!!!!!!!!!!!!!!', U);
	if (nundef(Z) || nundef(Z.prev)) Z = { prev: {} };
	for (const wichtig of ['playerdata', 'notes', 'uplayer', 'uname', 'friendly', 'step', 'round', 'phase', 'stage', 'timestamp', 'modified', 'stime', 'mode', 'scoring']) {
		if (isdef(Z[wichtig])) Z.prev[wichtig] = jsCopy(Z[wichtig]);
	}
	Z.prev.turn = Clientdata.last_turn = Clientdata.this_turn;
	copyKeys(Serverdata, Z);
	if (isdef(Serverdata.table)) { copyKeys(Serverdata.table, Z); Z.playerlist = Z.players; copyKeys(Serverdata.table.fen, Z); }
	assertion(isdef(Z.fen), 'no fen in Z bei cmd=table or startgame!!!', Serverdata);
	assertion(isdef(Z.host), 'TABLE HAS NOT HOST IN UPDATE_TABLE!!!!!!!!!!!!!!')
	Clientdata.this_turn = Z.turn;
	set_user(U.name); //sets Z.uname
	assertion(!isEmpty(Z.turn), 'turn empty!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', Z.turn);
	let [fen, uname, turn, mode, host] = [Z.fen, Z.uname, Z.fen.turn, Z.mode, Z.host];
	let role = Z.role = !is_playing(uname, fen) ? 'spectator' : fen.turn.includes(uname) ? 'active' : 'inactive';
	let upl = role != 'spectator' ? uname : turn[0];
	if (Z.game == 'accuse') {
		if (isdef(Clientdata.mode)) Z.mode = Clientdata.mode;
		if (mode == 'hotseat' && turn.length > 1) {
			let next = get_next_in_list(Z.prev.uplayer, Z.turn); if (next) upl = next;
		} else if (turn.length > 1 && uname == host) { //hand membership round
			let bots = turn_has_bots_that_must_move();
			if (!isEmpty(bots)) upl = bots[0];
		} else if (uname == host && !is_human_player(turn[0])) {
			upl = turn[0];
		} else if (mode == 'hotseat') { 
			upl = turn[0]; 
		} 
	} else {
		upl = Z.role == 'active' ? uname : turn[0];
		if (mode == 'hotseat' && turn.length > 1) { let next = get_next_in_list(Z.prev.uplayer, Z.turn); if (next) upl = next; }
		if (mode == 'multi' && Z.role == 'inactive' && (uname != host || is_human_player(upl))) { upl = uname; }
	}
	set_player(upl, fen); //sets uplayer
	let pl = Z.pl;
	Z.playmode = pl.playmode; //could be human | ai | hybrid (that's for later!!!)
	Z.strategy = uname == pl.name ? valf(Clientdata.strategy, pl.strategy) : pl.strategy; //humans are really hybrids: they have default strategy 'random'
	let [uplayer, friendly, modified] = [Z.uplayer, Z.friendly, Z.modified];
	Z.uplayer_data = firstCond(Z.playerdata, x => x.name == Z.uplayer);
	let sametable = !FORCE_REDRAW && friendly == Z.prev.friendly && modified <= Z.prev.modified && uplayer == Z.prev.uplayer;
	let sameplayerdata = isEmpty(Z.playerdata_changed_for);
	let myplayerdatachanged = Z.playerdata_changed_for.includes(Z.uplayer);
	let specialcase = !i_am_host() && !i_am_acting_host() && !i_am_trigger() && !myplayerdatachanged;
	Z.skip_presentation = sametable && (sameplayerdata || specialcase);
	if (DA.TEST1 && DA.TEST0 && (!sametable || !sameplayerdata)) {
		console.log('======>Z.skip_presentation', Z.skip_presentation, '\nplayerdata_changed_for', Z.playerdata_changed_for);
		console.log('_______ *** THE END *** ___________')
	}
	FORCE_REDRAW = false;
}
//#endregion apiserver

//#region apisimphp
const GT = {}; //tables
function apiphp(o, saveFromZ = false) {
	let [data, cmd] = [o.data, o.cmd];
	let result = {}, friendly, uname, state, player_status, fen;
	if (saveFromZ && isdef(data.friendly) && !db_table_exists(data.friendly)) {
		let res = db_new_table(data.friendly, Z.game, Z.host, jsCopy(Z.playerlist), jsCopy(Z.fen), jsCopy(Z.options));
		if (isdef(Z.playerdata)) res.playerdata = jsCopy(Z.playerdata);
	}
	if (cmd == 'table') {
		if (isdef(data.auto)) result.auto = data.auto;
		friendly = data.friendly;
		uname = data.uname;
		result.status = "table";
		if (isdef(data.clear_players)) {
			result.playerdata = db_clear_players(friendly);
			result.status = "clear_players";
		} else if (isdef(data.write_player) && isdef(data.state)) {
			player_status = isdef(data.player_status) ? data.player_status : '';
			result.playerdata = db_write_player(friendly, uname, data.state, player_status);
			result.status = "write_player";
		} else {
			result.playerdata = db_read_playerdata(friendly);
		}
		if (isdef(data.write_fen)) {
			result.table = db_write_fen(friendly, data.fen);
			result.status += " write_fen";
		} else {
			result.table = db_read_table(friendly);
		}
	} else if (cmd == 'startgame') {
		let res = db_new_table(data.friendly, data.game, data.host, data.players, data.fen, data.options);
		result.table = res.table;
		result.playerdata = res.playerdata;
		result.status = `startgame ${data.friendly}`;
	} else if (cmd == 'tables') {
		result.tables = dict2list(GT, 'friendly').map(x => x.table);
		result.status = "tables";
	} else if (cmd == 'gameover') {
		result.table = db_write_fen(data.friendly, data.fen, data.scoring);
		result.status = `scored table ${data.friendly}`;
	}
	return result;
}
function data_from_client(raw) {
	assertion(is_stringified(raw), 'data should be stringified json!!!!!!!!!!!!!!!', raw);
	let js = JSON.parse(raw);
	return js;
}
function db_clear_players(friendly) {
	assertion(isdef(GT[friendly]), `table ${friendly} does NOT exist!!!!`);
	let t = GT[friendly]; //for now only 1 copy!
	for (const pldata of t.playerdata) { pldata.state = null; pldata.player_status = null; }
	return t.playerdata;
}
function db_new_table(friendly, game, host, players, fen, options) {
	let table = { friendly, game, host, players, fen, options };
	table.modified = Date.now();	//console.log(table.modified,typeof table.modified);
	let playerdata = [];
	for (const plname of players) {
		playerdata.push({ name: `${plname}`, state: null, player_status: null });
	}
	let res = { table, playerdata };
	GT[friendly] = res;
	return res;
}
function db_read_playerdata(friendly) {
	assertion(isdef(GT[friendly]), `table ${friendly} does NOT exist!!!!`);
	return GT[friendly].playerdata;
}
function db_read_table(friendly) {
	assertion(isdef(GT[friendly]), `table ${friendly} does NOT exist!!!!`);
	return GT[friendly].table;
}
function db_table_exists(friendly) { return isdef(GT[friendly]); }
function db_write_fen(friendly, fen, scoring = null) {
	assertion(isdef(GT[friendly]), `table ${friendly} does NOT exist!!!!`);
	let t = GT[friendly];
	let table = t.table;
	table.fen = fen; table.scoring = scoring; table.phase = isdef(scoring) ? 'over' : '';
	table.modified = Date.now();	//console.log(table.modified,typeof table.modified);
	return table;
}
function db_write_player(friendly, uname, state, player_status) {
	assertion(isdef(GT[friendly]), `table ${friendly} does NOT exist!!!!`);
	let t = GT[friendly];
	let pldata = firstCond(t.playerdata, x => x.name == uname);
	pldata.state = state;
	pldata.player_status = player_status;
	pldata.checked = Date.now();
	return t.playerdata;
}
function sendSIMSIM(o, exclusive = false, saveFromZ = false) {
	o = data_from_client(o);	//console.log('sendSIMSIM', o,exclusive);
	let result = apiphp(o, saveFromZ); //console.log('result', result); //this is server send!!! 
	if (TESTING && o.cmd == 'startgame') { for (const func of DA.test.mods) func(result.table); }
	let res = JSON.stringify(result);
	if (exclusive) { if_hotseat_autoswitch(result); handle_result(res, o.cmd); } else { console.log('sendSIMSIM testresult', result); }
}
//#endregion apisimphp

//#region cards
function accuse_get_card(ckey, h, w, backcolor = BLUE, ov = .3) {
	if (is_color(ckey)) {
		return get_color_card(ckey,h)
	} else if (ckey.length > 3) {
		return get_number_card(ckey, h, null, backcolor, ov);
	} else {
		let info = get_c52j_info(ckey, backcolor);
		let card = cardFromInfo(info, h, w, ov);
		return card;
	}
}
function accuse_get_card_func(hcard = 80, backcolor = BLUE) { return ckey => accuse_get_card(ckey, hcard, null, backcolor); }
function aggregate_player_hands_by_rank(fen) {
	let di_ranks = {};
	let akku = [];
	for (const uname in fen.players) {
		let pl = fen.players[uname];
		let hand = pl.hand;
		for (const c of hand) {
			akku.push(c);
			let r = c[0];
			if (isdef(di_ranks[r])) di_ranks[r] += 1; else di_ranks[r] = 1;
		}
	}
	fen.akku = akku;
	return di_ranks;
}
function anim_face_down(item, ms = 300, callback = null) { face_up(item); anim_toggle_face(item, callback); }
function anim_face_up(item, ms = 300, callback = null) { face_down(item); anim_toggle_face(item, callback); }
function anim_toggle_face(item, ms = 300, callback = null) {
	let d = iDiv(item);
	mClass(d, 'aniflip');
	TO.anim = setTimeout(() => {
		if (item.faceUp) face_down(item); else face_up(item); mClassRemove(d, 'aniflip');
		if (isdef(callback)) callback();
	}, ms);
}
function ari_get_card(ckey, h, w, ov = .3) {
	let type = ckey[2];
	let sz = { largecard: 100, smallcard: 50 };
	let info = type == 'n' ? to_aristocard(ckey, sz.largecard) : type == 'l' ? to_luxurycard(ckey, sz.largecard) : type == 'r' ? to_rumorcard(ckey, sz.smallcard) : to_commissioncard(ckey, sz.smallcard);
	let card = cardFromInfo(info, h, w, ov);
	if (type == 'l') luxury_card_deco(card);
	else if (type == 'h') heritage_card_deco(card);
	return card;
}
function ari_get_card_large(ckey, h, w, ov = .2) {
	let type = ckey[2];
	let sz = { largecard: 120, smallcard: 80 };
	let info = type == 'n' ? to_aristocard(ckey, sz.largecard) : type == 'l' ? to_luxurycard(ckey, sz.largecard) : type == 'r' ? to_rumorcard(ckey, sz.smallcard) : to_commissioncard(ckey, sz.smallcard);
	let card = cardFromInfo(info, h, w, ov);
	if (type == 'l') luxury_card_deco(card);
	return card;
}
function calc_hand_value(hand, card_func = ferro_get_card) {
	let vals = hand.map(x => card_func(x).val);
	let sum = vals.reduce((a, b) => a + b, 0);
	return sum;
}
function cardFromInfo(info, h, w, ov) {
	let svgCode = C52[info.c52key];
	let ckey = info.key;
	if (info.rank == '*') {
		let color = get_color_of_card(ckey);
		if (color != 'red') svgCode = colored_jolly(color);
	}
	svgCode = '<div>' + svgCode + '</div>';
	let el = mCreateFrom(svgCode);
	h = valf(h, valf(info.h, 100));
	w = valf(w, h * .7);
	mSize(el, w, h);
	let res = {};
	copyKeys(info, res);
	copyKeys({ w: w, h: h, faceUp: true, div: el }, res);
	if (isdef(ov)) res.ov = ov;
	return res;
}
function colored_jolly(color) {
	let id = `J_${color}`;
	let svg = `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="card" face="1J" 
		height="100%" preserveAspectRatio="none" viewBox="-120 -168 240 336" width="100%">
		<symbol id="J11" preserveAspectRatio="none" viewBox="0 0 1300 2000">
		<path fill="#FC4" d="M1095,1000A445,445 0 0 1 650,1445 445,445 0 0 1 205,1000 445,445 0 0 1 650,555 445,445 0 0 1 1095,1000Z"></path>
		</symbol>
		<symbol id="${id}" preserveAspectRatio="none" viewBox="0 0 1300 2000">
		<path fill="${color}" d="M317.05664,1294.416 100,1620l220,-60 40,240 140,-200 160,200 40,-200 180,180 60,-220 260,60 -236.67969,-304.3027A445,445 0 0 1 650,1445 445,445 0 0 1 317.05664,1294.416ZM831.71484,249.10742C687.94378,262.65874 542.4812,256.33752 420,520 369.08062,331.38331 278.61481,370.61289 187.77148,412.01367a75,75 0 0 1 2.52344,19.12695 75,75 0 0 1 -16.78515,47.19532c66.827,55.25537 117.57478,127.8247 155.77539,213.90429A445,445 0 0 1 650,555 445,445 0 0 1 924.33984,650.26562c42.39917,-50.4556 91.60026,-93.34711 167.51176,-106.5332a75,75 0 0 1 -0.6524,-9.14258 75,75 0 0 1 14.6172,-44.3457C1026.3517,437.47479 931.12146,446.83238 840,440 761.98041,388.07638 804.10248,338.17898 853.51758,288.4043a75,75 0 0 1 -21.80274,-39.29688z"></path>
		</symbol>
		<symbol id="J13" preserveAspectRatio="none" viewBox="0 0 1300 2000">
		<path fill="#44F" d="M879.65521,937.6026a40,40 0 0 1 -40,40 40,40 0 0 1 -40,-40 40,40 0 0 1 40,-40 40,40 0 0 1 40,40zm-379.31039,0a40,40 0 0 1 -40,40 40,40 0 0 1 -40,-40 40,40 0 0 1 40,-40 40,40 0 0 1 40,40z"></path>
		</symbol>
		<symbol id="J14" preserveAspectRatio="none" viewBox="0 0 1300 2000">
		<path stroke="#44F" stroke-linecap="round" stroke-linejoin="round" stroke-width="6" fill="none" d="M317.05664,1294.416 100,1620l220,-60 40,240 140,-200 160,200 40,-200 180,180 60,-220 260,60 -236.67969,-304.3027M1241.1987,534.58948a75,75 0 0 1 -75,75 75,75 0 0 1 -75,-75 75,75 0 0 1 75,-75 75,75 0 0 1 75,75zM980.11493,234.09686a75,75 0 0 1 -75,75 75,75 0 0 1 -75,-75 75,75 0 0 1 75,-75 75,75 0 0 1 75,75zM190.29556,431.1412a75,75 0 0 1 -75,75 75,75 0 0 1 -74.999997,-75 75,75 0 0 1 74.999997,-75 75,75 0 0 1 75,75zM924.3457,650.27148c42.40088,-50.45397 91.5936,-93.35356 167.5059,-106.53906 -0.4037,-3.03138 -0.6215,-6.0846 -0.6524,-9.14258 0.03,-15.96068 5.1503,-31.4957 14.6172,-44.3457C1026.3517,437.47479 931.12146,446.83238 840,440 761.98041,388.07638 804.10248,338.17898 853.51758,288.4043 842.40414,277.84182 834.79487,264.12701 831.71484,249.10742 687.94378,262.65874 542.4812,256.33752 420,520 369.08062,331.38331 278.61481,370.61289 187.77148,412.01367c1.66108,6.24042 2.50924,12.66925 2.52344,19.12695 -0.0209,17.1896 -5.94587,33.85038 -16.7832,47.19336 66.82714,55.25532 117.5686,127.8306 155.76953,213.91016M384.88867,1140c51.89013,98.343 153.91815,159.9189 265.11133,160 111.19809,-0.076 213.23257,-61.6527 265.125,-160M1095,1000A445,445 0 0 1 650,1445 445,445 0 0 1 205,1000 445,445 0 0 1 650,555 445,445 0 0 1 1095,1000Z"></path>
		</symbol>
		<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
		<text x="-110" y="-115" fill="${color}" stroke="${color}" style="font:bold 60px sans-serif">*</text>
		<use width="202.8" height="312" x="-101.4" y="-156" xlink:href="#J11"></use>
		<use width="202.8" height="312" x="-101.4" y="-156" xlink:href="#${id}"></use>
		<use width="202.8" height="312" x="-101.4" y="-156" xlink:href="#J13"></use>
		<use width="202.8" height="312" x="-101.4" y="-156" xlink:href="#J14"></use>
		</svg>
	`;
	return svg;
}
function correct_handsorting(hand, plname) {
	let pl = Z.fen.players[plname];
	let [cs, pls, locs] = [Clientdata.handsorting, pl.handsorting, localStorage.getItem('handsorting')];
	let s = cs ?? pls ?? locs ?? Config.games[Z.game].defaulthandsorting;
	hand = sort_cards(hand, s == 'suit', 'CDSH', true, Z.func.rankstr);
	return hand;
}
function create_card_assets_c52() {
	let ranknames = { A: 'Ace', K: 'King', T: '10', J: 'Jack', Q: 'Queen' };
	let suitnames = { S: 'Spades', H: 'Hearts', C: 'Clubs', D: 'Diamonds' };
	let rankstr = '23456789TJQKA';
	let suitstr = 'SHDC';
	sz = 100;
	let di = {};
	for (const r of toLetters(rankstr)) {
		for (const s of toLetters(suitstr)) {
			let k = r + s;
			let info = di[k] = { key: k, val: 1, irank: rankstr.indexOf(r), isuit: suitstr.indexOf(s), rank: r, suit: s, color: RED, c52key: 'card_' + r + s, w: sz * .7, h: sz, sz: sz, ov: .25, friendly: `${isNumber(r) ? r : ranknames[r]} of ${suitnames[s]}`, short: `${r}${s}` };
			info.isort = info.isuit * 13 + info.irank;
		}
	}
	C52Cards = di;
	return di;
}
function create_fen_deck(cardtype, num_decks = 1, num_jokers = 0) {
	let arr = get_keys(C52Cards).map(x => x + cardtype);
	let newarr = [];
	while (num_decks > 0) { newarr = newarr.concat(arr); num_decks--; }
	while (num_jokers > 0) { newarr.push('*H' + cardtype); num_jokers--; }
	return newarr;
}
function face_down(item, color, texture) {
	if (!item.faceUp) return;
	if (isdef(texture) || lookup(item, ['live', 'dCover'])) {
		face_down_alt(item, color, texture);
	} else {
		let svgCode = C52.card_2B; //C52 is cached asset loaded in _start
		item.div.innerHTML = svgCode;
		if (nundef(color)) color = item.color;
		if (isdef(item.color)) item.div.children[0].children[1].setAttribute('fill', item.color);
	}
	item.faceUp = false;
}
function face_down_alt(item, bg, texture_name) {
	let dCover = item.live.dCover;
	if (nundef(dCover)) {
		let d = iDiv(item);
		dCover = item.live.dCover = mDiv(d, { background: bg, rounding: mGetStyle(d, 'rounding'), position: 'absolute', width: '100%', height: '100%', left: 0, top: 0 });
		let t = get_texture(texture_name);
		dCover.style.backgroundImage = t;
		dCover.style.backgroundRepeat = 'repeat';
	} else mStyle(dCover, { display: 'block' });
}
function face_up(item) {
	if (item.faceUp) return;
	if (lookup(item, ['live', 'dCover'])) mStyle(item.live.dCover, { display: 'none' });
	else item.div.innerHTML = isdef(item.c52key) ? C52[item.c52key] : item.html;
	item.faceUp = true;
}
function ferro_get_card(ckey, h, w, ov = .25) {
	let type = ckey[2];
	let info = ckey[0] == '*' ? get_joker_info() : jsCopy(C52Cards[ckey.substring(0, 2)]);
	info.key = ckey;
	info.cardtype = ckey[2]; //n,l,c=mini...
	let [r, s] = [info.rank, info.suit];
	info.val = r == '*' ? 50 : r == 'A' ? 20 : 'TJQK'.includes(r) ? 10 : Number(r);
	info.color = RED;
	info.sz = info.h = valf(h, Config.ui.card.h);
	info.w = valf(w, info.sz * .7);
	info.irank = '23456789TJQKA*'.indexOf(r);
	info.isuit = 'SHCDJ'.indexOf(s);
	info.isort = info.isuit * 14 + info.irank;
	let card = cardFromInfo(info, h, w, ov);
	return card;
}
function find_index_of_jolly(j) { return j.findIndex(x => is_jolly(x)); }
function find_jolly_rank(j, rankstr = 'A23456789TJQKA') {
	let jolly_idx = find_index_of_jolly(j);
	if (jolly_idx == -1) return false;
	if (jolly_idx > 0) {
		let rank_before_index = j[jolly_idx - 1][0];
		let rank_needed = rankstr[rankstr.indexOf(rank_before_index) + 1];
		return rank_needed;
	} else {
		let rank_after_index = j[jolly_idx + 1][0];
		let rank_needed = rank_after_index == 'A' ? 'K' : rankstr[rankstr.indexOf(rank_after_index) - 1];
		return rank_needed;
	}
}
function get_c52j_info(ckey, backcolor = BLUE) {
	let info;
	if (ckey[0] == '*') {
		info = {
			c52key: `card_0J`, //'card_1J', //`card_${1+n%2}`,
			color: "#e6194B",
			friendly: "Joker",
			key: ckey,
			h: 100,
			ov: 0.25,
			rank: "*",
			short: "J",
			suit: ckey[1],
			sz: 100,
			val: 0,
			w: 70,
		};
	} else {
		info = jsCopy(C52Cards[ckey.substring(0, 2)]);
	}
	info.key = ckey;
	info.cardtype = ckey[2];
	let [r, s] = [info.rank, info.suit];
	info.val = r == '*' ? 0 : r == 'A' ? 1 : 'TJQK'.includes(r) ? 10 : Number(r);
	info.color = backcolor;
	info.sz = info.h = sz;
	info.w = valf(w, sz * .7);
	let ranks = valf(lookup(Z, ['fen', 'ranks']), '*A23456789TJQK'); //Z.fen.ranks;
	info.irank = ranks.indexOf(r);
	info.isuit = 'SHCD'.indexOf(s);
	info.isort = info.isuit * ranks.length + info.irank;
	return info;
}
function get_color_of_card(ckey) { return is_color(ckey) ? ckey : ckey.length == 3 ? ['H', 'D'].includes(ckey[1]) ? 'red' : 'black' : stringAfter(ckey, '_'); }
function get_container_styles(styles = {}) { let defaults = valf(Config.ui.container, {}); defaults.position = 'relative'; addKeys(defaults, styles); return styles; }
function get_containertitle_styles(styles = {}) { let defaults = valf(Config.ui.containertitle, {}); defaults.position = 'absolute'; addKeys(defaults, styles); return styles; }
function get_group_rank(j) { let non_jolly_key = firstCond(j, x => !is_jolly(x)); return non_jolly_key[0]; }
function get_joker_info() {
	return {
		c52key: `card_0J`, //'card_1J', //`card_${1+n%2}`,
		color: "#e6194B",
		friendly: "Joker",
		key: '*Hn',
		h: 100,
		irank: 14,
		isort: 100,
		isuit: 3,
		ov: 0.25,
		rank: "*",
		short: "J",
		suit: "H",
		sz: 100,
		val: 1,
		w: 70,
	};
}
function get_sequence_suit(j) { let non_jolly_key = firstCond(j, x => !is_jolly(x)); return non_jolly_key[1]; }
function has_at_most_n_jolly(j, n = 1) { return j.filter(x => is_jolly(x)).length <= n; }
function has_jolly(j) { return firstCond(j, x => is_jolly(x)); }
function heritage_card_deco(card) {
	let d = iDiv(card); mStyle(d, { position: 'relative' });
	let d1 = mDiv(d, { fg: 'silver', fz: 11, family: 'tangerine', position: 'absolute', right: '36%', top: 1 }, null, 'heritage');
}
function is_card_key(ckey, rankstr = '*A23456789TJQK', suitstr = 'SHCD') {
	return is_nc_card(ckey) || is_color(ckey) || rankstr.includes(ckey[0]) && suitstr.includes(ckey[1]);
}
function is_joker(card) { return is_jolly(card.key); }
function is_jolly(ckey) { return ckey[0] == '*'; }
function is_overlapping_set(cards, max_jollies_allowed = 1, seqlen = 7, group_same_suit_allowed = true) {
	let istart = 0;
	let inextstart = 0;
	let lmin = 3;
	let legal = true;
	if (cards.length < lmin) return false;
	while (legal && istart <= cards.length - lmin) {
		let cl = cards.slice(istart, istart + lmin);
		let set = ferro_is_set(cl, max_jollies_allowed, seqlen, group_same_suit_allowed);
		if (set) { istart++; inextstart = Math.min(istart + lmin, cards.length - 3); }
		else if (!set && inextstart == istart) return false;
		else istart++;
	}
	return cards.map(x => x.key);
}
function jolly_matches(key, j, rankstr = 'A23456789TJQKA') {
	let jolly_idx = find_index_of_jolly(j);
	if (jolly_idx == -1) return false;
	if (is_group(j)) {
		let r = get_group_rank(j);
		if (key[0] == r) return true;
	} else if (jolly_idx > 0) {
		let rank_before_index = j[jolly_idx - 1][0];
		let suit_needed = j[jolly_idx - 1][1];
		let rank_needed = rankstr[rankstr.indexOf(rank_before_index) + 1];
		if (key[0] == rank_needed && key[1] == suit_needed) return true;
	} else {
		let rank_after_index = j[jolly_idx + 1][0];
		let suit_needed = j[jolly_idx + 1][1];
		let rank_needed = rank_after_index == 'A' ? 'K' : rankstr[rankstr.indexOf(rank_after_index) - 1];
		if (key[0] == rank_needed && key[1] == suit_needed) return true;
	}
	return false;
}
function luxury_card_deco(card) {
	let d = iDiv(card); mStyle(d, { position: 'relative' });
	let d1 = mDiv(d, { fg: 'dimgray', fz: 11, family: 'tangerine', position: 'absolute', left: 0, top: 0, 'writing-mode': 'vertical-rl', transform: 'scale(-1)', top: '35%' }, null, 'Luxury');
	let html = `<img height=${18} src="../base/assets/images/icons/deco0.svg" style="transform:scaleX(-1);">`;
	d1 = mDiv(d, { position: 'absolute', bottom: -2, left: 3, opacity: .25 }, null, html);
}
function pop_top(o) {
	if (isEmpty(o.list)) return null;
	let t = o.get_topcard();	//console.log('===>get_topcard:',t.key)
	o.list.shift();
	o.renew(o.list, o.cardcontainer, o.items, o.get_card_func);
	return t;
}
function remove_card_shadow(c) { iDiv(c).firstChild.setAttribute('class', null); }
function replace_jolly(key, j) {
	let jolly_idx = find_index_of_jolly(j);
	j[jolly_idx] = key;
}
function set_card_border(item, thickness = 1, color = 'black', dasharray) {
	let d = iDiv(item);
	let rect = lastDescendantOfType('rect', d);
	if (rect) {
		rect.setAttribute('stroke-width', thickness);
		rect.setAttribute('stroke', color);
		if (isdef(dasharray)) rect.setAttribute('stroke-dasharray', dasharray);
	} else {
		mStyle(d, { border: `solid ${1}px ${color}` })
	}
}
function set_card_style(item, styles = {}, className) {
	console.log('set_card_style', item, styles);
	let d = iDiv(item);
	let svg = findDescendantOfType('svg', d);
	let rect = findDescendantOfType('rect', svg);
	if (isdef(styles.shadow)) {
		let shadow = styles.shadow;
		delete styles.shadow;
		let hexcolor = colorFrom(styles.shadow);
		svg.style.filter = `drop-shadow(4px 5px 2px ${hexcolor})`;
	}
	if (isdef(styles.bg)) {
		let hexcolor = colorFrom(styles.bg);
		rect.setAttribute('stroke-width', 14); rect.setAttribute('stroke', hexcolor);
	}
	assertion(rect, 'NO RECT FOUND IN ELEM', d);
	mStyle(d, styles);
	if (isdef(className)) mClass(svg, className);
}
function set_card_style_works(c, styles, className) {
	let d = iDiv(c);
	mStyle(d, styles);
	d.firstChild.setAttribute('class', className);
}
function sheriff_card(name, color) {
	let di = SHERIFF.cards;
	let info = valf(di[name], { ksym: 'crossbow', kcenter: 'green apple', label: 'crossbow', type: 'contraband', value: 9, penalty: 4 });
	let bcolor = SHERIFF.color[info.type]; // type == 'legal' ? 'lime' : type == 'contraband' ? 'crimson' : 'orangered';
	let c = cPortrait(null, { margin: 12, border: `solid 4px ${bcolor}`, bg: valf(color, colorLight('gold', 60)) });
	let d = iDiv(c);
	let ds = mSym(info.ksym, d, { sz: 30 }, 'tl');
	ds = mSymText(info.value, d, { sz: 25, rounding: '50%', bg: 'gold', margin: 3 }, 'tr');
	ds = mText(info.label.toUpperCase(), d, { family: 'Algerian', w: '100%', fz: 12, align: 'center', position: 'absolute', bottom: 0 });//mPlace(ds,'tc',0,8)
	ds = mText(info.label.toUpperCase(), d, { family: 'Algerian', w: '100%', fz: 12, align: 'center', position: 'absolute', top: 0 });//mPlace(ds,'tc',0,8)
	ds = mSymText(info.penalty, d, { sz: 25, rounding: '50%', bg: 'crimson', margin: 3 }, 'br');
	ds = mSym(info.kcenter, d, { sz: 70 }, 'cc'); mPos(ds, 'calc( 50% - 35px )', 'calc( 50% - 35px )');
	return c;
}
function sort_cards(hand, bySuit = true, suits = 'CDHS', byRank = true, rankstr = '23456789TJQKA') {
	if (bySuit && byRank) {
		let buckets = arrBuckets(hand, x => x[1], suits);
		for (const b of buckets) { sort_cards(b.list, false, null, true, rankstr); } //sort each bucket by rank!
		hand.length = 0; buckets.map(x => x.list.map(y => hand.push(y))); //aggregate buckets to form hand
	} else if (bySuit) hand.sort((a, b) => suits.indexOf(a[1]) - suits.indexOf(b[1])); //.charCodeAt(1)-b.charCodeAt(1)); 
	else if (byRank) hand.sort((a, b) => rankstr.indexOf(a[0]) - rankstr.indexOf(b[0]));
	return hand;
}
function sortByRank(ckeys, rankstr = '23456789TJQKA') {
	let ranks = toLetters(rankstr);
	ckeys.sort((a, b) => ranks.indexOf(a[0]) - ranks.indexOf(b[0]));
	return ckeys;
}
function sortCardItemsByRank(items, rankstr = '23456789TJQKA') {
	let ranks = toLetters(rankstr);
	items.sort((a, b) => ranks.indexOf(a.key[0]) - ranks.indexOf(b.key[0]));
	return items;
}
function sortCardItemsBySuit(items, suitstr = 'CDSH') {
	let ranks = toLetters(suitstr);
	items.sort((a, b) => ranks.indexOf(a.key[1]) - ranks.indexOf(b.key[1]));
	return items;
}
function sortCardItemsToSequence(items, rankstr = '23456789TJQKA', jolly_allowed = 1) {
	let ranks = toLetters(rankstr);
	let n = items.length;
	let jollies = items.filter(x => is_joker(x));
	if (jollies.length > jolly_allowed) { return null; } //if has jollies, make sure that there are no more than jolly_allowed
	let no_jolly = items.filter(x => !is_joker(x));
	let sorted = sortCardItemsByRank(no_jolly, rankstr);
	let partial_sequences = [], seq = [sorted[0]], first, second;
	for (let i = 0; i < sorted.length - 1; i++) {
		first = sorted[i];
		second = sorted[i + 1];
		diff = second.irank - first.irank;
		if (diff == 1) { seq.push(second); }
		else {
			partial_sequences.push({ seq: seq, len: seq.length, diff_to_next: diff });
			seq = [second];
		}
	}
	diff = sorted[0].irank - (sorted[sorted.length - 1].irank - rankstr.length)
	if (!isEmpty(seq)) {
		partial_sequences.push({ seq: seq, len: seq.length, diff_to_next: diff });
	} else {
		arrLast(partial_sequences).diff_to_next = diff;
	}
	let i_max_diff = partial_sequences.findIndex(x => x.diff_to_next == Math.max(...partial_sequences.map(x => x.diff_to_next)));
	let max_diff = partial_sequences[i_max_diff].diff_to_next;
	let istart = (i_max_diff + 1) % partial_sequences.length;
	let final_sequence = [];
	let jollies_needed = 0;
	let len = partial_sequences.length;
	let ij = 0;
	for (let i = 0; i < len; i++) {
		let index = (i + istart) % len;
		let list = partial_sequences[index].seq;
		final_sequence = final_sequence.concat(list);
		let nj = partial_sequences[index].diff_to_next - 1;
		if (i < len - 1) {
			for (let j = 0; j < nj; j++) { final_sequence.push(jollies[ij++]); }
			jollies_needed += nj;
		}
	}
	for (let i = 0; i < final_sequence.length; i++) { items[i] = final_sequence[i]; }
	return jollies_needed;
}
function spread_hand(path, ov) {
	let hand = lookup(UI, path.split('.'));
	assertion(hand, 'hand does NOT exist', path);
	if (hand.ctype != 'hand') return;
	if (isEmpty(hand.items)) return;
	let card = hand.items[0];
	if (nundef(ov)) ov = card.ov;
	if (hand.ov == ov) return;
	hand.ov = ov;
	let cont = hand.cardcontainer;
	let items = hand.items;
	mContainerSplay(cont, hand.splay, card.w, card.h, items.length, ov * card.w);
}
function symbolcolor(card, color) {
	let d = iDiv(card);
	let els = d.getElementsByTagName('symbol'); // findDescendantOfType('symbol', d);
	console.log('list', els)
	for (const el of els) {
		let html = el.innerHTML;
		let html1 = replaceAll(html, 'red', color);
		let html2 = replaceAll(html1, 'black', color);
		el.innerHTML = html2;
	}
}
function to_aristocard(ckey, sz = 100, color = RED, w) {
	let info = jsCopy(C52Cards[ckey.substring(0, 2)]);
	info.key = ckey;
	info.cardtype = ckey[2];
	let [r, s] = [info.rank, info.suit];
	info.val = r == 'A' ? 1 : 'TJQK'.includes(r) ? 10 : Number(r);
	info.color = color;
	info.sz = info.h = sz;
	info.w = valf(w, sz * .7);
	info.irank = 'A23456789TJQK'.indexOf(r);
	info.isuit = 'SHCD'.indexOf(s);
	info.isort = info.isuit * 13 + info.irank;
	return info;
}
function to_commissioncard(ckey, sz = 40, color = GREEN, w) { return to_aristocard(ckey, sz, color); }
function to_luxurycard(ckey, sz = 100, color = 'gold', w) { return to_aristocard(ckey, sz, color); }
function to_rumorcard(ckey, sz = 40, color = GREEN, w) { return to_aristocard(ckey, sz, color); }
function toggle_face(item) { if (item.faceUp) face_down(item); else face_up(item); }
function ui_add_cards_to_deck_container(cont, items, list) {
	if (nundef(list)) list = items.map(x => x.key);
	for (const item of items) {
		mAppend(cont, iDiv(item));
		mItemSplay(item, list, 4, Card.ovdeck);
		face_down(item);
	}
	return items[0];
}
function ui_add_cards_to_hand_container(cont, items, list) {
	if (nundef(list)) list = items.map(x => x.key);
	for (const item of items) {
		mAppend(cont, iDiv(item));
		mItemSplay(item, list, 2, Card.ovw);
	}
}
function ui_add_container_title(title, cont, items, show_if_empty) {
	if (isdef(title) && (!isEmpty(items) || show_if_empty)) {
		let st = get_containertitle_styles();
		let stmeasure = jsCopy(st); delete stmeasure.position;
		let elem = mText(title, cont, stmeasure);
		let sz = getSizeNeeded(elem);
		let offsetx = valf(st.left, 0);
		let cont_wmin = mGetStyle(cont, 'wmin');
		let my_min = sz.w + offsetx * 1.5;
		let wmin = !isNumber(cont_wmin) ? my_min : Math.max(valf(cont_wmin, 0), my_min);
		mStyle(cont, { wmin: wmin });
		mStyle(elem, st);
	}
}
function ui_make_container(dParent, styles = { bg: 'random', padding: 10 }) {
	let id = getUID('u');
	let d = mDiv(dParent, styles, id);
	return d;
}
function ui_make_deck_container(list, dParent, styles = { bg: 'random', padding: 10 }, get_card_func) {
	let id = getUID('u'); // 'deck_cont'; //getUID('u');
	let d = mDiv(dParent, styles, id);
	if (isEmpty(list)) return d;
	let c = get_card_func(list[0]);
	mContainerSplay(d, 4, c.w, c.h, n, 0);
	return d;
}
function ui_make_hand_container(items, dParent, styles = { bg: 'random', padding: 10 }) {
	let id = getUID('u');
	let d = mDiv(dParent, styles, id);
	if (!isEmpty(items)) {
		let card = items[0];
		mContainerSplay(d, 2, card.w, card.h, items.length, card.ov * card.w);
	}
	return d;
}
function ui_type_building(b, dParent, styles = {}, path = 'farm', title = '', get_card_func = ari_get_card, separate_lead = false, ishidden = false) {
	let cont = ui_make_container(dParent, get_container_styles(styles));
	let cardcont = mDiv(cont);
	let list = b.list;
	let d = mDiv(dParent);
	let items = list.map(x => get_card_func(x));
	reindex_items(items);
	let d_harvest = null;
	if (isdef(b.h)) {
		let keycard = items[0];
		let d = iDiv(keycard);
		mStyle(d, { position: 'relative' });
		d_harvest = mDiv(d, { position: 'absolute', w: 20, h: 20, bg: 'orange', opacity: .5, fg: 'black', top: '45%', left: -10, rounding: '50%', align: 'center' }, null, 'H');
	}
	let d_rumors = null, rumorItems = [];
	if (!isEmpty(b.rumors)) {
		let d = cont;
		mStyle(d, { position: 'relative' });
		d_rumors = mDiv(d, { display: 'flex', gap: 2, position: 'absolute', h: 30, bottom: 0, right: 0 }); //,bg:'green'});
		for (const rumor of b.rumors) {
			let dr = mDiv(d_rumors, { h: 24, w: 16, vmargin: 3, align: 'center', bg: 'dimgray', rounding: 2 }, null, 'R');
			rumorItems.push({ div: dr, key: rumor });
		}
	}
	let card = isEmpty(items) ? { w: 1, h: 100, ov: 0 } : items[0];
	let [ov, splay] = separate_lead ? [card.ov * 1.5, 5] : [card.ov, 2];
	mContainerSplay(cardcont, 5, card.w, card.h, items.length, card.ov * 1.5 * card.w);
	ui_add_cards_to_hand_container(cardcont, items, list);
	ui_add_container_title(title, cont, items);
	let uischweine = [];
	for (let i = 1; i < items.length; i++) {
		let item = items[i];
		if (!b.schweine.includes(i)) face_down(item); else add_ui_schwein(item, uischweine);
	}
	return {
		ctype: 'hand',
		list: list,
		path: path,
		container: cont,
		cardcontainer: cardcont,
		items: items,
		schweine: uischweine,
		harvest: d_harvest,
		rumors: rumorItems,
		keycard: items[0],
	};
}
function ui_type_church(list, dParent, styles = {}, path = 'trick', title = '', get_card_func = ari_get_card, show_if_empty = false) {
	let cont = ui_make_container(dParent, get_container_styles(styles));
	let cardcont = mDiv(cont, { display: 'flex' });
	let items = [];
	let n = Z.plorder.length;
	let inc = 90;
	let rotation = n % 2 ? 0 : 90;
	for (const ckey of list) {
		let d = mDiv(cardcont, { origin: 'center', transform: `rotate( ${rotation}deg )`, position: 'absolute', left: 8 });
		let c = get_card_func(ckey);
		if (ckey != arrLast(list)) face_down(c);
		mAppend(d, iDiv(c));
		remove_card_shadow(c);
		let item = { card: c, div: d };
		items.push(item);
		rotation += inc;
	}
	ui_add_container_title(title, cont, items, show_if_empty);
	return {
		list: list,
		path: path,
		container: cont,
		cardcontainer: cardcont,
		items: items,
	}
}
function ui_type_deck(list, dParent, styles = {}, path = 'deck', title = 'deck', get_card_func = ari_get_card, show_if_empty = false) {
	let cont = ui_make_container(dParent, get_container_styles(styles));
	let cardcont = mDiv(cont);
	let items = [];
	ensure_ui(list, cardcont, items, get_card_func);
	ui_add_container_title(title, cont, items, show_if_empty);
	function get_topcard() { return isEmpty(list) ? null : items[0]; }
	function get_bottomcard() { return isEmpty(list) ? null : arrLast(items); }
	function ensure_ui(list, cardcont, items, get_card_func) {
		clearElement(cardcont); arrClear(items); if (isEmpty(list)) return;
		let n = Math.min(2, list.length); let ct = get_card_func(list[0]); items.push(ct); if (n > 1) { let cb = get_card_func(arrLast(list)); items.push(cb); }
		mStyle(cardcont, { position: 'relative', wmin: ct.w + 8, hmin: ct.h });
		for (let i = items.length - 1; i >= 0; i--) { let x = items[i]; face_down(x); mAppend(cardcont, iDiv(x)); mStyle(iDiv(x), { position: 'absolute', top: 0, left: 0 }) }
		mText(list.length, iDiv(ct), { position: 'absolute', left: list.length >= 100 ? '10%' : '25%', top: 10, fz: ct.h / 3 }); //add number of cards in deck to top card
	}
	return {
		ctype: 'deck',
		container: cont,
		cardcontainer: cardcont,
		items: items,
		list: list,
		title: title,
		path: path,
		func: get_card_func,
		get_topcard: get_topcard,
		get_bottomcard: get_bottomcard,
		get_card_func: get_card_func,
		renew: ensure_ui,
	};
}
function ui_type_hand(list, dParent, styles = {}, path = 'hand', title = 'hand', get_card_func = ari_get_card, show_if_empty = false) {
	let cont = ui_make_container(dParent, get_container_styles(styles));
	let items = list.map(x => get_card_func(x));
	let cardcont = mDiv(cont);
	let card = isEmpty(items) ? { w: 1, h: Config.ui.card.h, ov: 0 } : items[0];
	let splay = 2;
	mContainerSplay(cardcont, splay, card.w, card.h, items.length, card.ov * card.w);
	ui_add_cards_to_hand_container(cardcont, items, list);
	ui_add_container_title(title, cont, items, show_if_empty);
	return {
		ctype: 'hand',
		list: list,
		path: path,
		container: cont,
		cardcontainer: cardcont,
		splay: splay,
		items: items,
	};
}
function ui_type_lead_hand(list, dParent, styles = {}, path = 'hand', title = 'hand', get_card_func = ari_get_card, show_if_empty = false) {
	let hcard = isdef(styles.h) ? styles.h - 30 : Config.ui.card.h;
	addKeys(get_container_styles(styles), styles);
	let cont = ui_make_container(dParent, styles);
	let items = list.map(x => get_card_func(x, hcard));
	let cardcont = mDiv(cont);
	let card = isEmpty(items) ? { w: 1, h: hcard, ov: 0 } : items[0];
	let splay = 5;
	mContainerSplay(cardcont, splay, card.w, card.h, items.length, card.ov * card.w);
	ui_add_cards_to_hand_container(cardcont, items, list);
	ui_add_container_title(title, cont, items, show_if_empty);
	return {
		ctype: 'hand',
		list: list,
		path: path,
		container: cont,
		cardcontainer: cardcont,
		splay: splay,
		items: items,
	};
}
function ui_type_market(list, dParent, styles = {}, path = 'market', title = 'market', get_card_func = ari_get_card, show_if_empty = false) {
	let cont = ui_make_container(dParent, get_container_styles(styles));
	let cardcont = mDiv(cont, { display: 'flex', gap: 2 });
	let items = list.map(x => get_card_func(x));
	items.map(x => mAppend(cardcont, iDiv(x)));
	ui_add_container_title(title, cont, items, show_if_empty);
	return {
		ctype: 'market',
		list: list,
		path: path,
		container: cont,
		cardcontainer: cardcont,
		items: items,
	};
}
function ui_type_rank_count(list, dParent, styles, path, title, get_card_func, show_if_empty = false) {
	let cont = ui_make_container(dParent, get_container_styles(styles));
	let cardcont = mDiv(cont, { display: 'flex' });
	let items = [];
	for (const o of list) {
		let d = mDiv(cardcont, { display: 'flex', dir: 'c', padding: 1, fz: 12, align: 'center', position: 'relative' });
		let c = get_card_func(o.key);
		mAppend(d, iDiv(c));
		remove_card_shadow(c);
		d.innerHTML += `<span style="font-weight:bold">${o.count}</span>`;
		let item = { card: c, count: o.count, div: d };
		items.push(item);
	}
	ui_add_container_title(title, cont, items, show_if_empty);
	return {
		list: list,
		path: path,
		container: cont,
		cardcontainer: cardcont,
		items: items,
	}
}
//#endregion cards

//#region gamehelpers
const CORNERS0 = ['♠', '♡']; //, '♣', '♢'];
const CORNERS = ['◢', '◣', '◤', '◥'];
const CORNERS2 = ['⬔', '⬕'];
const CORNERS3 = ['⮜', '⮝', '⮞', '⮟'];
const CORNERS4 = ['⭐', '⭑']; //, '⭒', '⭓'];
const CORNERS5 = ['⬛', '⬜']; //, '⭒', '⭓'];
var WhichCorner = 0;
function activate_playerstats(items) {
	let fen = Z.fen;
	for (const plname in fen.players) {
		let ui = items[plname];
		let d = iDiv(ui);
		d.onclick = () => { switch_uname(plname); onclick_reload(); }
	}
}
function activate_ui() {
	if (uiActivated) { DA.ai_is_moving = false; return; }
	uiActivated = true; DA.ai_is_moving = false;
}
function ai_move(ms = 100) {
	DA.ai_is_moving = true;
	let [A, fen] = [valf(Z.A, {}), Z.fen];
	let selitems;
	if (Z.game == 'accuse' && Z.stage == 'hand') {
		selitems = [];
	} else if (Z.game == 'ferro') {
		if (Z.stage == 'card_selection') {
			let uplayer = Z.uplayer;
			let i1 = firstCond(A.items, x => x.path.includes(`${uplayer}.hand`));
			let i2 = firstCond(A.items, x => x.key == 'discard');
			selitems = [i1, i2];
		} else if (Z.stage == 'buy_or_pass') {
			selitems = [A.items[1]]; //waehlt immer pass
		} else selitems = [A.items[0]];
	} else if (Z.game == 'bluff') {
		let [newbid, handler] = bluff_ai();
		if (newbid) { fen.newbid = newbid; UI.dAnzeige.innerHTML = bid_to_string(newbid); }
		else if (handler != handle_gehtHoch) { bluff_generate_random_bid(); }
		A.callback = handler;
		selitems = [];
	} else if (A.command == 'trade') {
		selitems = ai_pick_legal_trade();
	} else if (A.command == 'exchange') {
		selitems = ai_pick_legal_exchange();
	} else if (A.command == 'upgrade') {
		selitems = [rChoose(A.items)];
	} else if (A.command == 'rumor') {
		selitems = [];
		let buildings = A.items.filter(x => x.path.includes('building'));
		let rumors = A.items.filter(x => !x.path.includes('building'));
		selitems = [rChoose(buildings), rChoose(rumors)];
	} else if (ARI.stage[Z.stage] == 'rumors_weitergeben') {
		let players = A.items.filter(x => Z.plorder.includes(x.key))
		let rumors = A.items.filter(x => !Z.plorder.includes(x.key))
		selitems = [rChoose(players), rChoose(rumors)];
	} else if (ARI.stage[Z.stage] == 'journey') {
		selitems = []; // always pass!
	} else {
		let items = A.items;
		let nmin = A.minselected;
		let nmax = Math.min(A.maxselected, items.length);
		let nselect = rNumber(nmin, nmax);
		selitems = rChoose(items, nselect); if (!isList(selitems)) selitems = [selitems];
	}
	for (const item of selitems) {
		select_last(item, select_toggle);
		if (isdef(item.submit_on_click)) A.selected.pop();
	}
	clearTimeout(TO.ai);
	loader_on();
	TO.ai = setTimeout(() => { if (isdef(A.callback)) A.callback(); loader_off(); }, ms);
}
function ai_schummler() { }
function animate_card_approx(card, goal, ms, callback) {
	let d = iDiv(card);
	let dgoal = iDiv(goal); //das muss irgendein UI item sein!
	let r = getRect(d);
	let rgoal = getRect(dgoal);
	let c = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
	let cgoal = { x: rgoal.x + rgoal.w / 2, y: rgoal.y + rgoal.h / 2 };
	let v = { x: cgoal.x - c.x, y: cgoal.y - c.y };
	mAnimateList(d, { transform: `translateX(${v.x}px) translateY(${v.y}px)`, opacity: 0 }, callback, ms, 'linear');
}
function animate_card_exchange(i0, i1, callback) {
	ari_make_unselectable(i0);
	ari_make_unselectable(i1);
	let d0 = iDiv(i0.o);
	let d1 = iDiv(i1.o);
	let r0 = getRect(d0);
	let r1 = getRect(d1);
	let c0 = { x: r0.x + r0.w / 2, y: r0.y + r0.h / 2 };
	let c1 = { x: r1.x + r1.w / 2, y: r1.y + r1.h / 2 };
	let v = { x: c1.x - c0.x, y: c1.y - c0.y };
	mTranslateBy(d0, v.x, v.y);
	mTranslateBy(d1, -v.x, -v.y, 700, callback);
}
function animate_card_transfer(card, goal, callback) {
	let d = iDiv(card);
	let dgoal = iDiv(goal); //das muss irgendein UI item sein!
	let r = getRect(d);
	let rgoal = getRect(dgoal);
	let c = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
	let cgoal = { x: rgoal.x + rgoal.w / 2, y: rgoal.y + rgoal.h / 2 };
	let v = { x: cgoal.x - c.x, y: cgoal.y - c.y };
	mTranslateBy(d, v.x, v.y, 700, callback);
}
function animate_title() {
	var rev = "fwd";
	function titlebar(val) {
		var msg = "Hallodi!";
		var res = " ";
		var speed = 100;
		var pos = val;
		msg = "   |-" + msg + "-|";
		var le = msg.length;
		if (rev == "fwd") {
			if (pos < le) {
				pos = pos + 1;
				scroll = msg.substr(0, pos);
				document.title = scroll;
				timer = window.setTimeout("titlebar(" + pos + ")", speed);
			}
			else {
				rev = "bwd";
				timer = window.setTimeout("titlebar(" + pos + ")", speed);
			}
		}
		else {
			if (pos > 0) {
				pos = pos - 1;
				var ale = le - pos;
				scrol = msg.substr(ale, le);
				document.title = scrol;
				timer = window.setTimeout("titlebar(" + pos + ")", speed);
			}
			else {
				rev = "fwd";
				timer = window.setTimeout("titlebar(" + pos + ")", speed);
			}
		}
	}
	titlebar(0);
}
function animatedTitle(msg = 'DU BIST DRAN!!!!!') {
	TO.titleInterval = setInterval(() => {
		let corner = CORNERS[WhichCorner++ % CORNERS.length];
		document.title = `${corner} ${msg}`; //'⌞&amp;21543;    U+231E \0xE2Fo\u0027o Bar';
	}, 1000);
}
function ari_show_handsorting_buttons_for(plname) {
	if (Z.role == 'spectator' || isdef(mBy('dHandButtons'))) return;
	let fen = Z.fen;
	let pl = fen.players[plname];
	if (pl.hand.length <= 1) return;
	let d = UI.players[plname].hand.container; mStyle(d, { position: 'relative' });
	let dHandButtons = mDiv(d, { position: 'absolute', bottom: -2, left: 52, height: 25 }, 'dHandButtons');
	show_player_button('sort', dHandButtons, onclick_by_rank);
}
function beautify_history(lines, title, fen, uplayer) {
	let html = `<div class="history"><span style="color:red;font-weight:bold;">${title}: </span>`;
	for (const l of lines) {
		let words = toWords(l);
		for (const w1 of words) {
			if (is_card_key(w1)) { html += mCardText(w1); continue; }
			w = w1.toLowerCase();
			if (isdef(fen.players[w])) {
				html += `<span style="color:${get_user_color(w)};font-weight:bold"> ${w} </span>`;
			} else html += ` ${w} `;
		}
		if (lines.length > 1) html = html.trim() + (l == arrLast(lines) ? '.' : ', ');
	}
	html += "</div>";
	return html;
}
function clear_screen() { mShieldsOff(); clear_status(); clear_title(); for (const ch of arrChildren('dScreen')) mClear(ch); mClassRemove('dTexture', 'wood'); mStyle(document.body, { bg: 'white', fg: 'black' }); }
function clear_status() { if (nundef(mBy('dStatus'))) return; clearTimeout(TO.fleeting); mRemove("dStatus"); }
function clear_title() { mClear('dTitleMiddle'); mClear('dTitleLeft'); mClear('dTitleRight'); }
function clearPlayers(){
	for(const item of DA.allPlayers){
		if (item.isSelected && !is_loggedin(item.uname)){
			style_not_playing(item,'',DA.playerlist);
		}
	}
	assertion(!isEmpty(DA.playerlist),"uname removed from playerlist!!!!!!!!!!!!!!!")
	DA.lastName = DA.playerlist[0].uname; // DA.allPlayers.find(x=>x.uname == DA.playerlist[0]);
}
function collect_game_specific_options(game) {
	let poss = Config.games[game].options;
	if (nundef(poss)) return;
	let di = {};
	for (const p in poss) {
		let key = p;
		let vals = poss[p];
		if (isString(vals) && vals.split(',').length <= 1) {
			di[p] = isNumber(vals) ? Number(vals) : vals;
			continue;
		}
		let fs = mBy(`d_${p}`);
		let val = get_checked_radios(fs)[0];
		di[p] = isNumber(val) ? Number(val) : val;
	}
	return di;
}
function compute_hidden(plname) {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	let pl = fen.players[plname];
	let hidden;
	if (isdef(fen.winners)) hidden = false;
	else if (Z.role == 'spectator') hidden = plname != uplayer;
	else if (Z.mode == 'hotseat') hidden = (pl.playmode == 'bot' || plname != uplayer);
	else hidden = plname != Z.uname;
	return hidden;
}
function deactivate_ui() { uiActivated = false; DA.ai_is_moving = true; }
function delete_table(friendly) { stopgame(); phpPost({ friendly: friendly }, 'delete_table'); }
function ev_to_gname(ev) { evNoBubble(ev); return evToTargetAttribute(ev, 'gamename'); }
function find_card(index, ui_item) { return ui_item.items[index]; }
function gamestep() {
	show_admin_ui();
	DA.running = true; clear_screen(); dTable = mBy('dTable'); mClass('dTexture', 'wood');
	if (Z.game == 'aristo') { if (Z.role != Clientdata.role || Z.mode == 'multi' && Z.role != 'active') mFall(dTable); Clientdata.role = Z.role; }//else mTableTransition(dTable, 2000);
	else mFall(dTable);
	shield_off();
	show_title();
	show_role();
	Z.func.present(dTable);	// *** Z.uname und Z.uplayer ist IMMER da! ***
	if (isdef(Z.scoring.winners)) { show_winners(); animatedTitle('GAMEOVER!'); }
	else if (Z.func.check_gameover(Z)) {
		let winners = show_winners();
		Z.scoring = { winners: winners }
		sendgameover(winners[0], Z.friendly, Z.fen, Z.scoring);
	} else if (is_shield_mode()) {
		staticTitle();
		if (!DA.no_shield == true) { hide('bRestartMove'); shield_on(); } //mShield(dTable.firstChild.childNodes[1])} //if (isdef(Z.fen.shield)) mShield(dTable);  }
		autopoll();
	} else {
		Z.A = { level: 0, di: {}, ll: [], items: [], selected: [], tree: null, breadcrumbs: [], sib: [], command: null, autosubmit: Config.autosubmit };
		copyKeys(jsCopy(Z.fen), Z);
		copyKeys(UI, Z);
		activate_ui(Z);
		Z.func.activate_ui();
		if (Z.isWaiting == true || Z.mode != 'multi') staticTitle(); else animatedTitle();
		if (Z.options.zen_mode != 'yes' && Z.mode != 'hotseat' && Z.fen.keeppolling) {
			autopoll();
			console.log('gamestep autopoll');
		}
	}
	if (TESTING == true) landing();	//DA.max=100;DA.runs=valf(DA.runs+1,0);if (DA.runs<DA.max) onclick_restart();
}
function generate_table_name(n) {
	let existing = Serverdata.tables.map(x => x.friendly);
	while (true) {
		let cap = rChoose(Info.capital);
		let parts = cap.split(' ');
		if (parts.length == 2) cap = stringBefore(cap, ' '); else cap = stringBefore(cap, '-');
		cap = cap.trim();
		let s = (n == 2 ? 'duel of ' : rChoose(['battle of ', 'war of '])) + cap;
		if (!existing.includes(s)) return s;
	}
}
function get_admin_player(list) {
	let res = valf(firstCond(list, x => x == 'mimi'), firstCond(list, x => ['felix', 'amanda', 'lauren'].includes(x)));
	return res ?? list[0]; //if (!res) return list[0];
}
function get_default_options(gamename) {
	let options = {};
	for (const k in Config.games[gamename].options) options[k] = arrLast(Config.games[gamename].options[k]);
	return options;
}
function get_game_color(game) { return colorFrom(Config.games[game].color); }
function get_logout_button() {
	let html = `<a id="aLogout" href="javascript:onclick_logout()">logout</a>`;
	return mCreateFrom(html);
}
function get_multi_trigger() { return lookup(Z, ['fen', 'trigger']); }
function get_next_human_player(plname) {
	if (nundef(plname)) return null;
	let [prevturn, mode, turn, uname, plorder, fen, host] = [Z.prev.turn, Z.mode, Z.turn, Z.uname, Z.plorder, Z.fen, Z.host];
	let same = isString(plname) && isList(prevturn) && sameList(prevturn, turn);
	if (!same) return null;
	let plnew = get_next_player(Z, plname);
	while (fen.players[plnew].playmode == 'bot') {
		plnew = get_next_player(Z, plnew);
		if (plnew == plname) break;
	}
	return plnew;
}
function get_next_in_list(el, list) {
	let iturn = list.indexOf(el);
	let nextplayer = list[(iturn + 1) % list.length];
	return nextplayer;
}
function get_next_player(g, uname) {
	let plorder = g.fen.plorder;
	let iturn = plorder.indexOf(uname);
	let nextplayer = plorder[(iturn + 1) % plorder.length];
	return nextplayer;
}
function get_playmode(uname) { return Z.fen.players[uname].playmode; }
function get_present_order() {
	let [fen, uplayer, uname] = [Z.fen, Z.uplayer, Z.uname];
	assertion(is_human_player(uplayer) || uname == Z.host, "PRESENT ORDER ME WRONG!!!!!!!!!!!!!")
	let uname_plays = fen.plorder.includes(uname);
	let is_bot = !is_human_player(uplayer);
	let show_first = Z.mode == 'multi' && uname_plays && !is_bot ? Z.uname : uplayer;
	return arrCycle(Z.fen.plorder, Z.fen.plorder.indexOf(show_first));
}
function get_present_order_accuse() {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	let show_first = uplayer;
	console.log('uplayer', uplayer)
	return arrCycle(Z.fen.plorder, Z.fen.plorder.indexOf(show_first));
}
function get_screen_distance(child, newParent) {
	child = toElem(child);
	newParent = toElem(newParent);
	const parentOriginal = child.parentNode;
	let children = arrChildren(parentOriginal);
	let iChild = children.indexOf(child);
	let sibling = iChild == children.length - 1 ? null : children[iChild + 1];
	const x0 = child.getBoundingClientRect().left;
	const y0 = child.getBoundingClientRect().top;
	newParent.appendChild(child);
	const x1 = child.getBoundingClientRect().left;
	const y1 = child.getBoundingClientRect().top;
	if (sibling) parentOriginal.insertBefore(child, sibling); else parentOriginal.appendChild(child);
	return [x1 - x0, y1 - y0];
}
function get_texture(name) { return `url(../base/assets/images/textures/${name}.png)`; }
function get_user_color(uname) { let u = firstCond(Serverdata.users, x => x.name == uname); return colorFrom(u.color); }
function get_user_pic(uname, sz = 50, border = 'solid medium white') {
	let html = get_user_pic_html(uname, sz, border); // `<img src='../base/assets/images/${uname}.jpg' width='${sz}' height='${sz}' class='img_person' style='margin:0px 4px;border:${border}'>`
	return mCreateFrom(html);
}
function get_user_pic_and_name(uname, dParent, sz = 50, border = 'solid medium white') {
	let html = `
			<div username='${uname}' style='text-align:center;font-size:${sz / 2.8}px'>
				<img src='../base/assets/images/${uname}.jpg' width='${sz}' height='${sz}' class='img_person' style='margin:0;border:${border}'>
				<div style='margin-top:${-sz / 6}px'>${uname}</div>
			</div>`;
	let elem = mCreateFrom(html);
	mAppend(dParent, elem);
	return elem;
}
function get_user_pic_html(uname, sz = 50, border = 'solid medium white') {
	return `<img src='../base/assets/images/${uname}.jpg' width='${sz}' height='${sz}' class='img_person' style='margin:0px 4px;border:${border}'>`
}
function get_waiting_html(sz = 30) { return `<img src="../base/assets/images/active_player.gif" height="${sz}" style="margin:0px ${sz / 3}px" />`; }
function hFunc(content, funcname, arg1, arg2, arg3) {
	let html = `<a style='color:blue' href="javascript:${funcname}('${arg1}','${arg2}','${arg3}');">${content}</a>`;
	return html;
}
function hide_buildings() {
	let uplayer = Z.uplayer;
	let buildings = UI.players[uplayer].buildinglist;
	for (const b of buildings) {
		for (let i = 1; i < b.items.length; i++) {
			let card = b.items[i];
			if (b.schweine.includes(card)) continue;
			face_down(b.items[i]);
		}
	}
}
function HPLayout() {
	if (isdef(UI.DRR)) UI.DRR.remove();
	mInsert(UI.dRechts, UI.dHistory);
	Clientdata.historyLayout = 'hp';
}
function HRPLayout() {
	let dr = UI.dRechts;
	dr.remove();
	let drr = UI.DRR = mDiv(dTable);
	mAppend(drr, UI.dHistory);
	mAppend(dTable, dr);
	Clientdata.historyLayout = 'hrp';
}
function i_am_acting_host() { return U.name == Z.fen.acting_host; }
function i_am_host() { return U.name == Z.host; }
function i_am_trigger() { return is_multi_trigger(U.name); }
function if_hotseat_autoswitch(result) {
	if (isdef(result.table) && isdef(Z) && Z.mode == 'hotseat') { //!DA.AUTOSWITCH) {
		let turn = lookup(result, ['table', 'fen', 'turn']);
		assertion(isdef(turn), 'turn is NOT defined (_sendSIMSIM) !!!!');
		let uname = turn.length == 1 ? turn[0] : get_next_in_list(U.name, turn);
		if (uname != U.name) switch_uname(uname);
	}
}
function is_advanced_user() {
	let advancedUsers = ['mimi', 'felix', 'bob', 'buddy', 'minnow', 'nimble', 'leo']; //, 'guest', 'felix'];
	return isdef(U) && ((advancedUsers.includes(DA.secretuser) || advancedUsers.includes(U.name)));
}
function is_ai_player(plname) {
	let [fen, name] = [Z.fen, valf(plname, Z.uplayer)];
	return lookup(fen, ['players', name, 'playmode']) == 'bot';
}
function is_collect_mode() { return Z.turn.length > 1; }
function is_color(s) { return isdef(ColorDi[s.toLowerCase()]); }
function is_current_player_bot() {
	let [fen, uplayer, turn] = [Z.fen, Z.uplayer, Z.turn];
	let curplayer = Z.turn[0];
	if (fen.players[curplayer].playmode == 'bot') return true; else return false;
}
function is_human_player(plname) {
	let [fen, name] = [Z.fen, valf(plname, Z.uplayer)];
	return lookup(fen, ['players', name, 'playmode']) == 'human';
}
function is_just_my_turn() {
	return isEmpty(Z.turn.filter(x => x != Z.uplayer));
}
function is_loggedin(name){return isdef(U) && U.name == name;}
function is_multi_stage() { return isdef(Z.fen.trigger); }
function is_multi_trigger(plname) { return lookup(Z, ['fen', 'trigger']) == plname; }
function is_player(s) { return isdef(Z.fen.players[s]); }
function is_playerdata_set(plname) {
	return isdef(Z.playerdata) && !isEmpty(Z.playerdata) && !isEmpty(Z.playerdata.find(x => x.name == plname).state);
}
function is_playing(pl, fen) {
	return isList(fen.plorder) && fen.plorder.includes(pl) || isList(fen.roundorder) && fen.roundorder.includes(pl) || Z.game == 'feedback' && isdef(Z.fen.players[pl]);
}
function is_shield_mode() {
	return Z.role == 'spectator'
		|| Z.mode == 'multi' && Z.role == 'inactive' && Z.host != Z.uname
		|| Z.mode == 'multi' && Z.role == 'inactive' && Z.pl.playmode != 'bot'
}
function new_cards_animation(n = 2) {
	let [stage, A, fen, plorder, uplayer, deck] = [Z.stage, Z.A, Z.fen, Z.plorder, Z.uplayer, Z.deck];
	let pl = fen.players[uplayer];
	if (stage == 'card_selection' && !isEmpty(pl.newcards)) {
		let anim_elems = [];
		for (const key of pl.newcards) {
			let ui = lastCond(UI.players[uplayer].hand.items, x => x.key == key);
			if (nundef(ui)) { pl.newcards = []; return; }
			ui = iDiv(ui);
			anim_elems.push(ui);
		}
		delete pl.newcards;
		anim_elems.map(x => mPulse(x, n * 1000));
	}
}
function path2fen(fen, path) { let o = lookup(fen, path.split('.')); return o; }
function path2UI(path) {
	let res = lookup(UI, path.split('.'));
	return res;
}
function PHLayout() {
	if (isdef(UI.DRR)) UI.DRR.remove();
	mAppend(UI.dRechts, UI.dHistory);
	Clientdata.historyLayout = 'ph';
}
function player_stat_count(key, n, dParent, styles = {}) {
	let sz = valf(styles.sz, 16);
	addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'start', fz: sz, align: 'center' }, styles);
	let d = mDiv(dParent, styles);
	if (isdef(Syms[key])) mSym(key, d, { h: sz, 'line-height': sz, w: '100%' });
	else mText(key, d, { h: sz, fz: sz, w: '100%' });
	d.innerHTML += `<span style="font-weight:bold">${n}</span>`;
	return d;
}
function prep_move() {
	let [fen, uplayer, pl] = [Z.fen, Z.uplayer, Z.pl];
	for (const k of ['round', 'phase', 'stage', 'step', 'turn']) { fen[k] = Z[k]; }
	deactivate_ui();
	clear_timeouts();
}
function PRHLayout() {
	let drr = UI.DRR = mDiv(dTable);
	mAppend(drr, UI.dHistory);
	Clientdata.historyLayout = 'prh';
}
function remove_hourglass(uname) { let d = mBy(`dh_${uname}`); if (isdef(d)) mRemove(d); }
function remove_player(fen, uname) {
	if (nundef(fen.original_players)) fen.original_players = jsCopy(fen.players);
	removeInPlace(fen.plorder, uname);
	delete fen.players[uname];
	return fen.plorder;
}
function round_change_animation(n = 2) {
	let [stage, A, fen, plorder, uplayer, deck] = [Z.stage, Z.A, Z.fen, Z.plorder, Z.uplayer, Z.deck];
	let pl = fen.players[uplayer];
	if (pl.roundchange) {
		let d = mBy('dTitleLeft');
		mStyle(d, { 'transform-origin': '0% 0%' });
		mPulse(d, n * 1000);
		show_special_message(`${fen.round_winner} won round ${Z.round - 1}!!!`)
		delete pl.roundchange;
	}
}
function sendgameover(plname, friendly, fen, scoring) {
	let o = { winners: plname, friendly: friendly, fen: fen, scoring: scoring };
	phpPost(o, 'gameover');
}
function set_player(name, fen) {
	if (isdef(PL) && PL.name != name) { Z.prev.pl = PL; Z.prev.uplayer = PL.name; }
	PL = Z.pl = firstCond(Serverdata.users, x => x.name == name);
	copyKeys(fen.players[name], PL);
	Z.uplayer = name;
}
function set_player_strategy(val) {
	Z.strategy = Clientdata.strategy = Z.pl.strategy = val;
	mRemove('dOptions')
}
function set_user(name) {
	if (isdef(Z) && isdef(U) && U.name != name) {
		Z.prev.u = U;
		Z.prev.uname = U.name;
	}
	U = firstCond(Serverdata.users, x => x.name == name);
	if (isdef(Z)) {
		Z.u = U;
		Z.uname = name;
	}
}
function shield_off() {
	mStyle('dAdmin', { bg: 'white' });
}
function shield_on() {
	mShield(dTable.firstChild.childNodes[1]);
	mStyle('dAdmin', { bg: 'silver' });
}
function show_admin_ui() {
	for (const id of ['bSpotitStart', 'bClearAck', 'bRandomMove', 'bSkipPlayer', 'bRestartMove', 'dTakeover', 'bExperience']) hide(id);
	if (Z.game == 'spotit' && Z.uname == Z.host && Z.stage == 'init') show('bSpotitStart');
	else if (Z.game == 'bluff' && Z.uname == Z.host && Z.stage == 1) show('bClearAck');
	else if (Z.uname == Z.host && Z.stage == 'round_end') show('bClearAck');
	else if (Z.game == 'ferro' && Z.uname == 'mimi' && Z.stage != 'card_selection') show('bClearAck');
	if (Z.game == 'accuse' && lookup(Z, ['fen', 'players', Z.uplayer, 'experience']) > 0) show('bExperience');
	if (['ferro', 'bluff', 'aristo', 'a_game'].includes(Z.game) && (Z.role == 'active' || Z.mode == 'hotseat')) {
		show('bRandomMove');
	}
	if (Z.uname == Z.host || Z.uname == 'mimi' || Z.uname == 'felix') show('dHostButtons'); else hide('dHostButtons');
	if (DA.showTestButtons == true) show('dTestButtons'); else hide('dTestButtons');
}
function show_fleeting_message(s, dParent, styles, id, ms = 2000) {
	let d = mDiv(dParent, styles, id, s);
	mFadeRemove(d, ms);
}
function show_game_menu(gamename) {
	stopgame();
	show('dMenu'); mClear('dMenu');
	let dMenu = mBy('dMenu');
	let dForm = mDiv(dMenu, { align: 'center' }, 'fMenuInput');
	let dInputs = mDiv(dForm, {}, 'dMenuInput');
	let dButtons = mDiv(dForm, {}, 'dMenuButtons');
	let bstart = mButton('start', () => {
		let players = DA.playerlist.map(x => ({ name: x.uname, playmode: x.playmode }));
		let game = gamename;
		let options = collect_game_specific_options(game);
		for (const pl of players) { if (isEmpty(pl.strategy)) pl.strategy = valf(options.strategy, 'random'); }
		startgame(game, players, options); hide('dMenu');
	}, dButtons, {}, ['button', 'enabled']);
	let bcancel = mButton('cancel', () => { hide('dMenu'); }, dButtons, {}, ['button', 'enabled']);
	let bclear = mButton('clear players', clearPlayers, dButtons, {}, ['button', 'enabled']);
	let d = dInputs; mClear(d); mCenterFlex(d);
	let dPlayers = mDiv(d, { gap: 6 });
	mCenterFlex(dPlayers);
	DA.playerlist = [];
	DA.allPlayers = [];
	DA.lastName = null;
	let params = [gamename, DA.playerlist];
	let funcs = [style_not_playing, style_playing_as_human, style_playing_as_bot];
	for (const u of Serverdata.users) {
		let d = get_user_pic_and_name(u.name, dPlayers, 40);
		mStyle(d, { w: 60, cursor: 'pointer' })
		let item = { uname: u.name, div: d, state: 0, strategy: '', isSelected: false };
		DA.allPlayers.push(item);
		if (is_loggedin(u.name)) { toggle_select(item, funcs, gamename, DA.playerlist); DA.lastName = U.name; }
		else d.onclick = ev => {
			if (ev.shiftKey) {
				let list = Serverdata.users;
				if (nundef(DA.lastName)) DA.lastName = list[0].name;
				let x1 = list.find(x => x.name == DA.lastName);
				let i1 = list.indexOf(x1);
				let x2 = list.find(x => x.name == item.uname);
				let i2 = list.indexOf(x2);
				if (i1 == i2) return;
				if (i1 > i2) [i1, i2] = [i2, i1];
				assertion(i1 < i2, "NOT IN CORRECT ORDER!!!!!")
				for (let i = i1; i <= i2; i++) {
					let xitem = DA.allPlayers[i];
					if (xitem.isSelected) continue;
					style_playing_as_human(xitem, gamename, DA.playerlist);
				}
				DA.lastName = item.uname;
			} else {
				toggle_select(item, funcs, gamename, DA.playerlist);
				if (item.isSelected) DA.lastName = item.uname;
			}
		}
	}
	mDiv(d,{w:'100%',fz:11,fg:'#444'},null,'(use SHIFT to multi-select players)'); //'SHIFT<br>multiselect');
	mLinebreak(d, 1);
	show_game_options(d, gamename);
	mFall('dMenu');
}
function show_game_options(dParent, game) {
	mRemoveChildrenFromIndex(dParent, 2);
	let poss = Config.games[game].options;
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(','); // make a list 
			if (list.length <= 1) continue;
			let fs = mRadioGroup(dParent, {}, `d_${key}`, key);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measure_fieldset(fs);
		}
	}
}
function show_games(ms = 500) {
	let dParent = mBy('dGames');
	mClear(dParent);
	mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
	let d = mDiv(dParent, { fg: 'white', animation: 'appear 1s ease both' }, 'game_menu'); mFlexWrap(d);
	let gamelist = 'accuse aristo bluff wise spotit ferro'; if (DA.TEST0) gamelist += ' a_game';
	for (const gname of toWords(gamelist)) {
		let g = Config.games[gname];
		let [sym, bg, color, id] = [Syms[g.logo], g.color, null, getUID()];
		let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 15, wmin: 140, height: 90, bg: bg, position: 'relative' }, g.id);
		d1.setAttribute('gamename', gname);
		d1.onclick = onclick_game_menu_item;
		mCenterFlex(d1);
		mDiv(d1, { fz: 50, family: sym.family, 'line-height': 55 }, null, sym.text);
		mLinebreak(d1);
		mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
	}
}
function show_handsorting_buttons_for(plname, styles = {}) {
	if (Z.role == 'spectator' || isdef(mBy('dHandButtons'))) return;
	let fen = Z.fen;
	let pl = fen.players[plname];
	if (pl.hand.length <= 1) return;
	let d = UI.players[plname].hand.container; mStyle(d, { position: 'relative', wmin: 155 }); //,bg:'green' });
	addKeys({ position: 'absolute', left: 58, bottom: -8, height: 25 }, styles);
	let dHandButtons = mDiv(d, styles, 'dHandButtons');
	show_player_button('rank', dHandButtons, onclick_by_rank);
	show_player_button('suit', dHandButtons, onclick_by_suit);
}
function show_history(fen, dParent) {
	if (!isEmpty(fen.history)) {
		let html = '';
		for (const o of jsCopy(fen.history).reverse()) {
			html += beautify_history(o.lines, o.title, fen);
		}
		let dHistory = mDiv(dParent, { maright: 10, hpadding: 12, bg: colorLight('#EDC690', 50), box: true, matop: 4, rounding: 10, patop: 10, pabottom: 10, hmax: `calc( 100vh - 250px )`, 'overflow-y': 'auto', w: 260 }, null, html); //JSON.stringify(fen.history));
		UI.dHistoryParent = dParent;
		UI.dHistory = dHistory;
		if (isdef(Clientdata.historyLayout)) { show_history_layout(Clientdata.historyLayout); }
	}
}
function show_history_layout(layout) {
	assertion(isdef(UI.dHistoryParent) && isdef(UI.dHistory), 'UI.dHistoryParent && UI.dHistory do NOT exist!!!');
	if (layout == 'ph') PHLayout();
	else if (layout == 'hp') HPLayout();
	else if (layout == 'prh') PRHLayout();
	else if (layout == 'hrp') HRPLayout();
	else PHLayout();
}
function show_history_popup() {
	if (isEmpty(Z.fen.history)) return;
	assertion(isdef(UI.dHistoryParent) && isdef(UI.dHistory), 'UI.dHistoryParent && UI.dHistory do NOT exist!!!');
	let l = valf(Clientdata.historyLayout, 'ph');
	let cycle = ['ph', 'hp', 'prh', 'hrp'];
	let i = (cycle.indexOf(l) + 1) % cycle.length;
	show_history_layout(cycle[i]);
}
function show_home_logo() {
	let bg = colorLight();
	let dParent = mBy('dAdminLeft');
	clearElement(dParent);
	let d = miPic('castle', dParent, { cursor: 'pointer', fz: 24, padding: 6, h: 36, box: true, margin: 2 }); //, bg: bg, rounding: '50%' });
	d.onclick = onclick_home;
	let version = 'v0.0.1';
	let html = `version ${version}`
	mText(html, dParent, { fz: 12 });
}
function show_hourglass(uname, d, sz, stylesPos = {}) {
	let html = get_waiting_html(sz);
	mStyle(d, { position: 'relative' });
	addKeys({ position: 'absolute' }, stylesPos);
	let dw = mDiv(d, stylesPos, `dh_${uname}`, html);
}
function show_instruction(msg) { mBy('dSelections0').innerHTML = msg; }
function show_message(msg = '', stay = false) {
	mStyle(dTable, { transition: 'all 1s ease' });
	let d = mBy('dMessage'); d.innerHTML = msg;
	if (stay) return;
	let ms = 1000, delay = 3000;
	let anim = d.animate([{ transform: `scale(1,1)`, opacity: 1 }, { transform: `scale(1,0)`, opacity: 0 },], { duration: 1000, easing: 'ease', delay: delay });
	dTable.animate([{ transform: 'translateY(0px)' }, { transform: 'translateY(-56px)' },], { fill: 'none', duration: ms, easing: 'ease', delay: delay });
	anim.onfinish = () => {
		mClear(d);
	}
}
function show_MMM(msg) { show_fleeting_message(msg, mBy('dMMM')); }
function show_options_popup(options) {
	let opresent = {};
	let di = { mode: 'gamemode', yes: true, no: false };
	let keys = get_keys(options);
	keys.sort();
	for (const k of get_keys(options).sort()) {
		let key = valf(di[k], k);
		let val = valf(di[options[k]], options[k]);
		opresent[key] = val;
	}
	let x = mYaml(mCreate('div'), opresent);
	let dpop = mPopup(x.innerHTML, dTable, { fz: 16, fg: 'white', top: 0, right: 0, border: 'white', padding: 10, bg: 'dimgray' }, 'dOptions');
	mInsert(dpop, mCreateFrom(`<div style="text-align:center;width:100%;font-family:Algerian;font-size:22px;">${Z.game}</div>`));
}
function show_player_button(caption, ui_item, handler) {
	let d = ui_item.container ?? iDiv(ui_item);
	let styles = { rounding: 6, bg: 'silver', fg: 'black', border: 0, maleft: 10 };
	let b = mButton(caption, handler, d, styles, 'enabled');
	return b;
}
function show_playerdatastate() {
	for (const pldata of Z.playerdata) {
		console.log('player', pldata.name, `status=${isEmpty(pldata.player_status) ? 'none' : pldata.player_status}`, pldata.state);
	}
}
function show_polling_signal() {
	if (DA.TEST0 != true) return;
	let d1 = mDiv(mBy('dAdmin'), { position: 'fixed', top: 10, left: 73 });
	let bg = Z.skip_presentation == true ? 'grey' : 'green'; //valf(DA.reloadColor, 'green')
	let d2 = mDiv(d1, { width: 20, height: 20, bg: bg, rounding: 10, display: 'inline-block' });
	mFadeRemove(d1, 1000);
}
function show_progress() {
	if (isdef(Z.fen.progress)) {
		let d = mBy('dTitleLeft');
		let former = mBy('dProgress');
		if (isdef(former)) former.remove();
		let dprogress = mDiv(d, {}, 'dProgress', `<div>${Z.fen.progress}</div>`);
	}
}
function show_role() {
	if (Z.game == 'accuse'){show_role_accuse(); return;}
	let d = mBy('dAdminMiddle');
	clearElement(d);
	let hotseatplayer = Z.uname != Z.uplayer && Z.mode == 'hotseat' && Z.host == Z.uname;
	let styles, text;
	let boldstyle = { fg: 'red', weight: 'bold', fz: 20 };
	let normalstyle = { fg: 'black', weight: null, fz: null };
	let location = ''; //`<span style="color:dimgray;font-family:Algerian">${Z.friendly}  </span>`; // `in ${stringAfter(Z.friendly,'of ')}`;
	if (hotseatplayer) {
		styles = boldstyle;
		text = `your turn for ${Z.uplayer}`;
	} else if (Z.role == 'spectator') {
		styles = normalstyle;
		text = `(spectating)`;
	} else if (Z.role == 'active') {
		styles = boldstyle;
		text = `It's your turn!!!`;
	} else if (Z.role == 'waiting') {
		text = `waiting for players to complete their moves...`;
	} else {
		assertion(Z.role == 'inactive', 'role is not active or inactive or spectating ' + Z.role);
		styles = normalstyle;
		text = `(${Z.turn[0]}'s turn)`;
	}
	d.innerHTML = location + text;
	mStyle(d, styles);
}
function show_settings(dParent) {
	let [options, fen, uplayer] = [Z.options, Z.fen, Z.uplayer];
	clearElement(dParent);
	mFlex(dParent);
	mStyle(dParent, { 'justify-content': 'end', gap: 12, paright: 10 })
	let playmode = get_playmode(uplayer); //console.log('playmode',playmode,'uplayer',uplayer);
	let game_mode = Z.mode;
	let st = { fz: 20, padding: 0, h: 40, box: true, matop: 2, rounding: '50%', cursor: 'pointer' };
	let dHistoryButton = miPic('scroll', dParent, st);
	dHistoryButton.onclick = show_history_popup;
	if (isdef(Config.games[Z.game].options.strategy)) {
		let dStrategy = miPic('chess pawn', dParent, st);
		dStrategy.onclick = show_strategy_popup;
	}
	let d = miPic('gear', dParent, st);
	options.playmode = playmode;
	d.onmouseenter = () => show_options_popup(options);
	d.onmouseleave = hide_options_popup;
}
function show_status(s) {
	if (is_advanced_user()) {
		clear_status();
		if (!TESTING && !s.includes('reload')) show_fleeting_message(s, 'dTest', { fz: 14, position: 'absolute', top: 5, right: 10 }, 'dStatus');
	}
}
function show_strategy_popup() {
	let dpop = mPopup('', dTable, { fz: 16, fg: 'white', top: 0, right: 0, border: 'white', padding: 10, bg: 'dimgray' }, 'dOptions');
	mAppend(dpop, mCreateFrom(`<div style="text-align:center;width:100%;font-family:Algerian;font-size:22px;">${Z.game}</div>`));
	mDiv(dpop, { matop: 5, maleft: 10 }, null, `choose strategy:`);
	let vals = Config.games[Z.game].options.strategy.split(',');
	let key = 'strategy';
	let fs = mRadioGroup(dpop, { fg: 'white' }, `d_${key}`); //,`${key}`, {fg:'white',border:'1px solid red'});
	for (const v of vals) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, set_player_strategy, key, v == Z.strategy); }
	measure_fieldset(fs);
}
function show_tables(ms = 500) {
	clear_screen();
	let dParent = mBy('dTables');
	mClear(dParent);
	show_games();
	let tables = Serverdata.tables;
	if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
	tables.map(x => x.game_friendly = Config.games[x.game].friendly);
	mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
	let t = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'players'], 'tables', false);
	mTableCommandify(t.rowitems, {
		0: (item, val) => hFunc(val, 'onclick_table', val, item.id),
	});
	let d = iDiv(t);
	for (const ri of t.rowitems) {
		let r = iDiv(ri);
		let h = hFunc('delete', 'delete_table', ri.o.friendly);
		c = mAppend(r, mCreate('td'));
		c.innerHTML = h;
	}
}
function show_title() {
	settingsOn = Z.func.state_info(mBy('dTitleLeft'));
	if (nundef(settingsOn) || settingsOn) show_settings(mBy('dTitleRight'));
	mBy('dTablename').innerHTML = Z.friendly;
}
function show_username(loadTable = false) {
	let uname = U.name;
	let dpic = get_user_pic(uname, 30);
	let d = mBy('dAdminRight');
	mClear(d);
	if (['felix','mimi','lauren','amanda'].includes(uname)) add_advanced_ui(d); //mAppend(d, get_advanced_menu_buttons());
	mAppend(d, get_logout_button());
	mAppend(d, dpic);
	if (is_advanced_user()) { show('dAdvanced1'); } else { hide('dAdvanced'); hide('dAdvanced1'); }
	if (!TESTING && !DA.running) {
		if (!loadTable) phpPost({ app: 'easy' }, 'tables'); 
		else if (!isEmpty(Serverdata.tables)) {
			onclick_table(Serverdata.tables[0].friendly);
		}
	}
}
function show_users(ms = 300) {
	let dParent = mBy('dUsers');
	mClear(dParent);
	for (const u of Serverdata.users) {
		if (['ally', 'bob', 'leo'].includes(u.name)) continue;
		let d = get_user_pic_and_name(u.name, dParent);
		d.onclick = () => onclick_user(u.name);
		mStyle(d, { cursor: 'pointer' });
	}
	mFall(dParent, ms);
}
function show_view_buildings_button(plname) {
	if (Z.role == 'spectator' || isdef(mBy('dPlayerButtons'))) return;
	if (isEmpty(UI.players[plname].buildinglist)) return;
	let d1 = iDiv(UI.players[plname]); mStyle(d1, { position: 'relative' });
	let d2 = mDiv(d1, { position: 'absolute', top: 8, left: 50, height: 25 }, 'dPlayerButtons');
	show_player_button('view buildings', d2, onclick_view_buildings);
}
function show_waiting_for_ack_message() {
	let dInstruction = mBy('dSelections0');
	mClass(dInstruction, 'instruction');
	mCenterCenterFlex(dInstruction);
	mBy('dSelections0').innerHTML = 'waiting for next round to start...'; //.remove();
}
function show_waiting_message(msg) {
	let dInstruction = mBy('dSelections0');
	mClass(dInstruction, 'instruction');
	mCenterCenterFlex(dInstruction);
	mBy('dSelections0').innerHTML = msg;
}
function show_winners() {
	let winners = Z.fen.winners;
	let multiple_winners = winners.length > 1;
	let winners_html = winners.map(x => get_user_pic_html(x, 35)).join(' ');
	let msg = `
		<div style="display:flex;gap:10px;align-items:center">
			<div style="color:red;font-size:22px;font-weight:bold;">GAME OVER! the winner${multiple_winners ? 's are: ' : ' is '}</div>
			<div style="padding-top:5px;">${winners_html}</div>
		</div>
	`;
	show_message(msg, true);
	mShield(dTable);
	hide('bRestartMove');
	return Z.fen.winners;
}
function shuffletest(list) {
	for (let i = 0; i < 100; i++) {
		shuffle(list);
		console.log('shuffle: ' + jsCopy(list));
	}
}
function sss() { show_playerdatastate(); }
function sss1() {
	let [fen, A, uplayer, plorder, data] = [Z.fen, Z.A, Z.uplayer, Z.plorder, Z.uplayer_data];
	let s = 'no data.state for player ' + uplayer;
	if (isDict(data.state)) {
		s = `${uplayer} passes `;
		for (const k in data.state.di) {
			s += `${k} ${data.state.di[k]}, `;
		}
	}
	console.log(s);
}
function start() {
	DA.showTestButtons = true;
	let uname = DA.secretuser = localStorage.getItem('uname');
	if (isdef(uname)) U = { name: uname };
	phpPost({ app: 'simple' }, 'assets');
}
function start_game_with_players(n, game = 'accuse', opts = {}) {
	let numplayers = n;
	let list = jsCopy(Serverdata.users).map(x => x.name);
	removeInPlace(list, 'mimi');
	removeInPlace(list, 'felix');
	let playernames = rChoose(list, numplayers - 2);
	playernames = ['mimi', 'felix'].concat(playernames);
	let uname = U.name;
	removeInPlace(playernames,uname);
	playernames.unshift(uname);
	let playmodes = playernames.map(x => 'human');
	let players = [];
	for (let i = 0; i < n; i++) players.push({ name: playernames[i], playmode: playmodes[i] });
	addKeys({ mode: 'multi' }, opts);
	startgame(game, players, opts);
}
function start_with_assets(reload = false) {
	DA.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; if (DA.isFirefox) console.log('using Firefox!')
	show_home_logo();
	if (nundef(U)) { show_users(); return; }
	show_username(reload);
	if (DA.TEST0 || DA.showTestButtons) show('dTestButtons');
}
function startgame(game, players, options = {}) {
	if (nundef(game)) game = 'a_game';
	let default_options = {}; for (const k in Config.games[game].options) default_options[k] = arrLast(Config.games[game].options[k].split(','));
	addKeys(default_options, options); //ensure options
	if (nundef(players)) players = rChoose(Serverdata.users, 2).map(x => ({ name: x.name })); //, playmode: 'human', strategy:valf(options.strategy,'random') })); //ensure players
	let playernames = players.map(x => x.name);
	let fen = window[game]().setup(playernames, options);
	if (nundef(fen.round)) fen.round = 1;
	if (nundef(fen.phase)) fen.phase = '';
	if (nundef(fen.stage)) fen.stage = 0;
	if (nundef(fen.step)) fen.step = 0;
	if (nundef(fen.turn)) fen.turn = [fen.plorder[0]]; else if (DA.TESTSTART1 && fen.turn.length == 1) fen.turn = [playernames[0]];
	players.map(x => { let pl = fen.players[x.name]; pl.playmode = valf(x.playmode, 'human'); pl.strategy = valf(x.strategy, valf(options.strategy, 'random')); });
	if (options.mode == 'solo') {
		let me = isdef(U) && isdef(fen.players[U.name]) ? U.name : rChoose(playernames);
		for (const plname of playernames) {
			if (plname == me) continue;
			fen.players[plname].playmode = 'bot';
		}
		options.mode = 'hotseat';
	}
	for (const k in options) { if (isNumber(options[k])) options[k] = parseInt(options[k]); }
	let o = {
		friendly: generate_table_name(players.length), game: game, host: playernames[0], players: playernames,
		fen: fen, options: options
	};
	ensure_polling(); // macht einfach nur Pollmode = 'auto'
	phpPost(o, 'startgame');
}
function staticTitle() {
	clearInterval(TO.titleInterval);
	let url = window.location.href;
	let loc = url.includes('telecave') ? 'telecave' : 'local';
	let game = isdef(Z) ? stringAfter(Z.friendly, 'of ') : '♠ GAMES ♠';
	document.title = `(${loc}) ${game}`;
}
function status_message_new(msg, dParent, styles = {}) {
}
function stopgame() {
	if (!DA.running) return;
	DA.running = false;
	DA.noshow = 0;
	clear_timeouts();
	hide('bRestartMove');
	hide('dHostButtons');
	mStyle('dAdmin', { bg: 'white' });
	mClear('dAdminMiddle')
	for (const id of ['bSpotitStart', 'bClearAck', 'bRandomMove', 'bSkipPlayer']) hide(id);
	pollStop();
	Z = null; delete Serverdata.table; delete Serverdata.playerdata; Clientdata = {};
	staticTitle();
}
function switch_uname(plname) {
	set_user(plname);
	show_username();
}
function tableLayoutMR(dParent, m = 7, r = 1) {
	let ui = UI; ui.players = {};
	clearElement(dParent);
	let bg = 'transparent';
	let [dMiddle, dRechts] = [ui.dMiddle, ui.dRechts] = mColFlex(dParent, [m, r], [bg, bg]);
	mCenterFlex(dMiddle, false); //no horizontal centering!
	let dOben = ui.dOben = mDiv(dMiddle, { w: '100%', display: 'block' }, 'dOben');
	let dSelections = ui.dSelections = mDiv(dOben, {}, 'dSelections');
	for (let i = 0; i <= 5; i++) { ui[`dSelections${i}`] = mDiv(dSelections, {}, `dSelections${i}`); }
	let dActions = ui.dActions = mDiv(dOben, { w: '100%' });
	for (let i = 0; i <= 5; i++) { ui[`dActions${i}`] = mDiv(dActions, { w: '100%' }, `dActions${i}`); }
	ui.dError = mDiv(dOben, { w: '100%', bg: 'red', fg: 'yellow', hpadding: 12, box: true }, 'dError');
	let dSubmitOrRestart = ui.dSubmitOrRestart = mDiv(dOben, { w: '100%' });
	let dOpenTable = ui.dOpenTable = mDiv(dMiddle, { w: '100%', padding: 10 }); mFlexWrap(dOpenTable);// mLinebreak(d_table);
	return [dOben, dOpenTable, dMiddle, dRechts];
}
function take_feedback_host(write_fen = true, write_player = false, clear_players = false, player_status = null) {
	prep_move();
	let o = { uname: Z.uplayer, friendly: Z.friendly };
	if (isdef(Z.fen)) o.fen = Z.fen;
	if (write_fen) { assertion(isdef(Z.fen) && isdef(Z.fen.turn), 'write_fen without fen!!!!'); o.write_fen = true; }
	if (write_player) { o.write_player = true; o.state = Z.state; } //console.log('writing playerstate for', Z.uplayer, Z.state); }
	if (clear_players) o.clear_players = true;
	o.player_status = player_status;
	o.auto = true;
	let cmd = 'table';
	send_or_sim(o, cmd);
}
function take_turn(write_fen = true, write_player = false, clear_players = false, player_status = null) {
	prep_move();
	let o = { uname: Z.uplayer, friendly: Z.friendly };
	if (isdef(Z.fen)) o.fen = Z.fen;
	if (write_fen) { assertion(isdef(Z.fen) && isdef(Z.fen.turn), 'write_fen without fen!!!!'); o.write_fen = true; }
	if (write_player) {
		o.write_player = true;
		if (isdef(Z.state)) o.state = Z.state;
		if (isdef(Z.state1)) o.state1 = Z.state1;
		if (isdef(Z.state2)) o.state2 = Z.state2;
	}
	if (clear_players) {
		o.clear_players = true; delete Z.playerdata; delete o.fen.pldata;
	}
	o.player_status = player_status;
	let cmd = 'table';
	send_or_sim(o, cmd);
}
function take_turn_fen() { take_turn(); }
function take_turn_fen_clear() { take_turn(true, false, true); }
function take_turn_fen_write() { take_turn(true, true); }
function take_turn_multi() { if (isdef(Z.state)) take_turn(false, true); else take_turn(false, false); }
function take_turn_spotit() { take_turn(true, true); }
function take_turn_state1() { if (isdef(Z.state1)) take_turn(false, true); else take_turn(false, false); }
function take_turn_state2() { if (isdef(Z.state2)) take_turn(false, true); else take_turn(false, false); }
function take_turn_waiting() { take_turn(true, false, false, null); }
function take_turn_write() { take_turn_multi(); }
function ui_player_info(dParent, outerStyles = { dir: 'column' }, innerStyles = {}) {
	let fen = Z.fen;
	if (nundef(outerStyles.display)) outerStyles.display = 'flex';
	mStyle(dParent, outerStyles);
	let items = {};
	let styles = jsCopy(innerStyles); addKeys({ rounding: 10, bg: '#00000050', margin: 4, padding: 4, patop: 12, box: true, 'border-style': 'solid', 'border-width': 6 }, styles);
	let order = get_present_order();
	for (const plname of order) {
		let pl = fen.players[plname];
		let uname = pl.name;
		let imgPath = `../base/assets/images/${uname}.jpg`;
		styles['border-color'] = get_user_color(uname);
		let item = mDivItem(dParent, styles, name2id(uname));
		let d = iDiv(item);
		let picstyle = { w: 50, h: 50, box: true };
		let ucolor = get_user_color(uname);
		if (pl.playmode == 'bot') {
			copyKeys({ rounding: 0, border: `double 6px ${ucolor}` }, picstyle);
		} else {
			copyKeys({ rounding: '50%', border: `solid 2px white` }, picstyle);
		}
		let img = mImage(imgPath, d, picstyle, 'img_person');
		items[uname] = item;
	}
	if (DA.SIMSIM || is_advanced_user()) activate_playerstats(items)
	return items;
}
//#endregion gamehelpers

//#region onclick
function onclick_ack() {
	if (nundef(Z) || nundef(Z.func.clear_ack)) return;
	Z.func.clear_ack();
}
function onclick_advanced_menu() { DA.showTestButtons = toggle_visibility('dTestButtons'); }
function onclick_advanced_mode() { Clientdata.mode = toggle_mode(); } //onclick_reload(); }
function onclick_advanced_test() {
	DA.showTestButtons = toggle_visibility('dTestButtons');
	style_advanced_button();
}
function onclick_by_rank() {
	let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
	let items = ui_get_hand_items(uplayer).map(x => x.o);
	let h = UI.players[uplayer].hand;
	pl.handsorting = 'rank'; //{ n: items.length, by: 'rank' };
	Clientdata.handsorting = pl.handsorting;
	localStorage.setItem('handsorting', Clientdata.handsorting);
	let cardcont = h.cardcontainer;
	let ch = arrChildren(cardcont);
	ch.map(x => x.remove());
	let sorted = sortCardItemsByRank(items, Z.func.rankstr); //window[Z.game.toUpperCase()].rankstr); //'23456789TJQKA*');
	h.sortedBy = 'rank';
	for (const item of sorted) {
		mAppend(cardcont, iDiv(item));
	}
}
function onclick_by_suit() {
	let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
	let items = ui_get_hand_items(uplayer).map(x => x.o);
	let h = UI.players[uplayer].hand;
	Clientdata.handsorting = pl.handsorting = 'suit'; //{ n: items.length, by: 'suit' };
	localStorage.setItem('handsorting', Clientdata.handsorting);
	let cardcont = h.cardcontainer;
	let ch = arrChildren(cardcont);
	ch.map(x => x.remove());
	let sorted = sortCardItemsByRank(items, Z.func.rankstr); //'23456789TJQKA*');
	sorted = sortCardItemsBySuit(sorted);
	h.sortedBy = 'suit';
	for (const item of sorted) {
		mAppend(cardcont, iDiv(item));
	}
}
function onclick_experience() {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	let plnames = get_other_players();
	let nums = range(1, fen.players[uplayer].experience);
	if (isEmpty(nums)) { show_special_message('you dont have any experience points!'); return; }
	show_special_popup('select player and number of experience points to gift:', send_experience_points, {}, plnames, nums);
}
function onclick_game_menu_item(ev) { show_game_menu(ev_to_gname(ev)); }
function onclick_logout() {
	mFadeClearShow('dAdminRight', 300);
	mClear('dAdminMiddle');
	stopgame();
	clear_screen();
	U = null;
	show_users();
}
function onclick_random() {
	if (uiActivated && !DA.ai_is_moving) ai_move(300);
	else if (!uiActivated) console.log('NOP: ui not activated...');
	else if (DA.ai_is_moving) console.log('NOP: ai is (or was already) moving...');
	else console.log('NOP: unknown...');
}
function onclick_reload() {
	if (isdef(Z)) {
		if (Z.game == 'fritz' && nundef(Z.fen.winners)) {
			console.log(Z);
			Z.fen.players[Z.uplayer].time_left = stop_timer();
			take_turn_fen();
		} else {
			FORCE_REDRAW = true; send_or_sim({ friendly: Z.friendly, uname: Z.uplayer, auto: false }, 'table');
		}
	} else if (U) { onclick_tables(); }
	else { show_users(); }
}
function onclick_reload_after_switching() { DA.pollCounter = 0; DA.reloadColor = rColor(); onclick_reload(); }
function onclick_remove_host() {
	let [role, host, game, fen, uplayer, turn, stage] = [Z.role, Z.host, Z.game, Z.fen, Z.uplayer, Z.turn, Z.stage];
}
function onclick_reset_all() { stopgame(); phpPost({ app: 'simple' }, 'delete_tables'); }
function onclick_restart() {
	let [game, fen, plorder, host] = [Z.game, Z.fen, Z.plorder, Z.host];
	Z.scoring = {};
	if (nundef(fen.original_players)) fen.original_players = fen.players;
	let playernames = [host].concat(get_keys(fen.original_players).filter(x => x != host));
	let playmodes = playernames.map(x => fen.original_players[x].playmode);
	let strategies = playernames.map(x => fen.original_players[x].strategy);
	let default_options = {}; for (const k in Config.games[game].options) default_options[k] = arrLast(Config.games[game].options[k].split(','));
	addKeys(default_options, Z.options);
	fen = Z.fen = Z.func.setup(playernames, Z.options);
	[Z.plorder, Z.stage, Z.turn, Z.round, Z.step, Z.phase] = [fen.plorder, fen.stage, fen.turn, 1, 1, fen.phase];
	if (DA.TESTSTART1) Z.turn = fen.turn = [Z.host];
	let i = 0; playernames.map(x => { let pl = fen.players[x]; pl.name = x; pl.strategy = strategies[i]; pl.playmode = playmodes[i++]; });
	take_turn_fen_clear();
}
function onclick_restart_move() { clear_transaction(); onclick_reload(); }
function onclick_skip() {
	let [game, fen, uplayer, turn, stage] = [Z.game, Z.fen, Z.uplayer, Z.turn, Z.stage];
	if (game == 'spotit') return;
	else if (game == 'bluff' && stage == 1 || game == 'ferro' && stage == 'auto_ack') { onclick_ack(); }
	else if (game == 'aristo') {
		Z.uplayer = Z.turn[0];
		Z.A = { level: 0, di: {}, ll: [], items: [], selected: [], tree: null, breadcrumbs: [], sib: [], command: null };
		copyKeys(jsCopy(Z.fen), Z);
		copyKeys(UI, Z);
		activate_ui(Z);
		Z.func.activate_ui();
		ai_move();
	} else {
		let plskip = Z.turn[0];
		Z.turn = [get_next_player(Z, plskip)];
		Z.uplayer = plskip;
		take_turn_fen();
	}
}
function onclick_skip_membership_selection() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	for (const pld of Z.playerdata) {
		if (isDict(pld.state)) continue;
		let plname = pld.name;
		let pl = fen.players[plname];
		pld.state = { item: rChoose(pl.hand) };
	}
	relegate_to_host(Z.playerdata);
}
function onclick_start_spotit() {
	let [game, fen, uplayer, turn, stage] = [Z.game, Z.fen, Z.uplayer, Z.turn, Z.stage];
	Z.stage = 'move';
	Z.turn = jsCopy(Z.plorder);
	take_turn_fen();
}
function onclick_status() { query_status(); }
function onclick_table(tablename) {
	send_or_sim({ friendly: tablename, uname: U.name }, 'table');
}
function onclick_tables() { phpPost({ app: 'simple' }, 'tables'); }
function onclick_tithe_all() {
	let [game, fen, uplayer, turn, stage] = [Z.game, Z.fen, Z.uplayer, Z.turn, Z.stage];
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		if (isdef(pl.tithes)) { continue; }
		pl.tithes = { val: rNumber(8, 10) };
	}
	proceed_to_newcards_selection();
}
function onclick_user(uname) {
	U = firstCond(Serverdata.users, x => x.name == uname);
	localStorage.setItem('uname', U.name);
	DA.secretuser = U.name;
	let elem = firstCond(arrChildren('dUsers'), x => x.getAttribute('username') == uname);
	let img = elem.children[0];
	mShrinkTranslate(img, .75, 'dAdminRight', 400, show_username);
	mFadeClear('dUsers', 300);
}
function onclick_view_buildings() {
	let [game, fen, uplayer, turn, stage] = [Z.game, Z.fen, Z.uplayer, Z.turn, Z.stage];
	let buildings = UI.players[uplayer].buildinglist;
	for (const b of buildings) b.items.map(x => face_up(x));
	TO.buildings = setTimeout(hide_buildings, 5000);
}
function onclick_vote_1() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	let pld = Z.playerdata.filter(x => !isDict(x.state));
	let pld1 = rChoose(pld);
	pld1.state = { item: rChoose(fen.players[pld1.name].hand) };
	relegate_to_host(Z.playerdata);
}
function onclick_vote_empty() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	for (const pld of Z.playerdata) {
		if (isDict(pld.state)) continue;
		pld.state = { item: '' };
	}
	relegate_to_host(Z.playerdata);
}
function onclick_vote_president() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	let pls = rChoose(Z.turn, 2);
	let pld0 = Z.playerdata.find(x => x.name == pls[0]);
	let pld1 = Z.playerdata.find(x => x.name == pls[1]);
	pld0.state = { item: get_random_ballot_card() };
	pld1.state = { item: get_random_ballot_card() };
	relegate_to_host(Z.playerdata);
}
function onclick_vote_random() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	for (const pld of Z.playerdata) {
		if (isDict(pld.state)) continue;
		let plname = pld.name;
		let pl = fen.players[plname];
		pld.state = { item: (coin() ? '' : rChoose(pl.hand)) };
	}
	relegate_to_host(Z.playerdata);
}
function onclick_vote_red() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	for (const pld of Z.playerdata) {
		if (isDict(pld.state)) continue;
		let plname = pld.name;
		let pl = fen.players[plname];
		let list = pl.hand.filter(x => get_color_of_card(x) == 'red');
		pld.state = { item: isEmpty(list) ? '' : rChoose(list) };
	}
	relegate_to_host(Z.playerdata);
}
function style_advanced_button(){
	let b = mBy('dAdvancedUI').children[0];
	if (DA.showTestButtons) { b.innerHTML = ' '; mStyle(b, { bg:GREEN,opacity:1 });} //fg: 'green' }) }
	else { b.innerHTML = ' '; mStyle(b, { bg:'silver',opacity:.5 });} //fg: 'black' }) }
}
function style_not_playing(item, game, list) {
	let ui = iDiv(item); let uname = ui.getAttribute('username');
	mStyle(ui, { bg: 'transparent', fg: 'black' });
	arrLast(arrChildren(ui)).innerHTML = uname;
	item.ifunc = 0; item.playmode = 'none'; removeInPlace(list, item);
	item.isSelected = false;
}
function style_playing_as_bot(item, game, list) {
	let ui = iDiv(item); let uname = ui.getAttribute('username'); let bg = get_game_color(game);
	mStyle(ui, { bg: bg, fg: colorIdealText(bg) });
	arrLast(arrChildren(ui)).innerHTML = uname.substring(0, 3) + 'bot';
	item.ifunc = 2; item.playmode = 'bot';
	item.isSelected = true;
}
function style_playing_as_human(item, game, list) {
	let ui = iDiv(item); let uname = ui.getAttribute('username');
	mStyle(ui, { bg: get_user_color(uname), fg: colorIdealText(get_user_color(uname)) });
	arrLast(arrChildren(ui)).innerHTML = uname;
	item.ifunc = 1; item.playmode = 'human'; list.push(item);
	item.isSelected = true;
}
function test_start_aristo(n = 3, mode = 'multi') {
	let game = 'aristo';
	let playernames = arrTake(['mimi', 'felix', 'amanda', 'lauren', 'gul', 'nasi'], n);
	let playmodes = ['human', 'human', 'human', 'human', 'human', 'human'];
	let strategies = ['random', 'random', 'random', 'random', 'random', 'random', 'random'];
	let i = 0; let players = playernames.map(x => ({ name: x, strategy: strategies[i], playmode: playmodes[i++] }));
	let options = { mode: mode, commission: 'no' };
	startgame(game, players, options);
}
function test_start_ferro(mode = 'multi') {
	let game = 'ferro';
	let playernames = ['mimi', 'lauren', 'felix'];
	let playmodes = ['human', 'human', 'human'];
	let strategies = ['random', 'random', 'random'];
	let i = 0; let players = playernames.map(x => ({ name: x, strategy: strategies[i], playmode: playmodes[i++] }));
	let options = { mode: mode, thinking_time: 20 };
	startgame(game, players, options);
}
function toggle_select(item, funcs) {
	let params = [...arguments];
	let ifunc = (valf(item.ifunc, 0) + 1) % funcs.length; let f = funcs[ifunc]; f(item, ...params.slice(2));
}
//#endregion onclick

//#region select
function add_transaction(cmd) {
	if (!DA.simulate) start_transaction();
	DA.transactionlist.push(cmd);
}
function ari_make_selectable(item, dParent, dInstruction) {
	let A = Z.A;
	switch (item.itemtype) {
		case 'card': make_card_selectable(item); break;
		case 'container': make_container_selectable(item); break;
		case 'player': make_container_selectable(item); break;
		case 'string': make_string_selectable(item); break;
	}
}
function ari_make_selected(item) {
	let A = Z.A;
	switch (item.itemtype) {
		case 'card': make_card_selected(item); break;
		case 'container': make_container_selected(item); break;
		case 'player': make_container_selected(item); break;
		case 'string': make_string_selected(item); break;
	}
}
function ari_make_unselectable(item) {
	let A = Z.A;
	switch (item.itemtype) {
		case 'card': make_card_unselectable(item); break;
		case 'container': make_container_unselectable(item); break;
		case 'player': make_container_unselectable(item); break;
		case 'string': make_string_unselectable(item); break;
	}
}
function ari_make_unselected(item) {
	let A = Z.A;
	switch (item.itemtype) {
		case 'card': make_card_unselected(item); break;
		case 'container': make_container_unselected(item); break;
		case 'player': make_container_unselected(item); break;
		case 'string': make_string_unselected(item); break;
	}
}
function clear_selection() {
	let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
	if (nundef(Z.A) || isEmpty(A.selected)) return;
	let selitems = A.selected.map(x => A.items[x]);
	for (const item of selitems) { ari_make_unselected(item); }
	A.selected = [];
}
function clear_transaction() { DA.simulate = false; DA.transactionlist = []; }
function continue_after_error() {
	dError.innerHTML = ''; if (isdef(DA.callback)) { DA.callback(); delete (DA.callback); }
}
function make_card_selectable(item) { 
	let d = iDiv(item.o); 
	mClass(d, 'selectable'); 
	if (Z.game != 'aristo') { spread_hand(item.path, .3); } 
	mClass(d.parentNode, 'selectable_parent'); 
}
function make_card_selected(item) {
	let color = isdef(Z.func.get_selection_color) ? Z.func.get_selection_color(item) : 'red';
	set_card_border(item, 13, color);
	if (DA.magnify_on_select) mClass(iDiv(item.o), 'mag');
}
function make_card_unselectable(item) { let d = iDiv(item.o); d.onclick = null; mClassRemove(d, 'selectable'); mClassRemove(d.parentNode, 'selectable_parent'); spread_hand(item.path); }
function make_card_unselected(item) { set_card_border(item); if (DA.magnify_on_select) mClassRemove(iDiv(item.o), 'mag'); }
function make_container_selectable(item) { let d = iDiv(item); mClass(d, 'selectable'); mClass(d, 'selectable_parent'); }
function make_container_selected(item) { let d = iDiv(item); mClass(d, 'selected_parent'); }
function make_container_unselectable(item) { let d = iDiv(item); d.onclick = null; mClassRemove(d, 'selectable'); mClassRemove(d, 'selectable_parent'); }
function make_container_unselected(item) { let d = iDiv(item); mClassRemove(d, 'selected_parent'); }
function make_deck_selectable(item) { }
function make_deck_selected(item) { }
function make_deck_unselectable(item) { }
function make_deck_unselected(item) { }
function make_hand_selectable(item) { }
function make_hand_selected(item) { }
function make_hand_unselectable(item) { }
function make_hand_unselected(item) { }
function make_market_selectable(item) { }
function make_market_selected(item) { }
function make_market_unselectable(item) { }
function make_market_unselected(item) { }
function make_string_selectable(item) { let d = mBy(item.id); mClass(d, 'selectable_button'); }
function make_string_selected(item) { let d = mBy(item.id); item.bg = mGetStyle(d, 'bg'); item.fg = mGetStyle(d, 'fg'); mStyle(d, { bg: 'yellow', fg: 'black' }); } //console.log('item', item, 'd', d); 
function make_string_unselectable(item) { let d = mBy(item.id); d.onclick = null; mClassRemove(d, 'selectable_button'); }
function make_string_unselected(item) { let d = mBy(item.id); mStyle(d, { bg: item.bg, fg: item.fg }); } //mClassRemove(d, 'string_selected'); }
function pack_table(o) {
	for (const k of ['players', 'fen', 'state', 'player_status', 'options', 'scoring', 'notes', 'turn']) {
		let val = o[k];
		if (isdef(val)) o[k] = JSON.stringify(val);
	}
	return JSON.stringify({ table: o, playerdata: JSON.stringify(o.playerdata) });
}
function remove_from_selection(card) {
	if (nundef(Z.A)) return;
	let A = Z.A;
	let item = firstCond(A.items, x => x.id == card.id);
	if (isdef(item)) {
		let idx = item.index;
		A.items.splice(item.index, 1);
		removeInPlace(A.selected, item.index);
		make_card_unselectable(item);
		make_card_unselected(item);
		reindex_items(A.items);
	}
}
function restart_selection_process() {
	let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
	if (Z.game != 'ferro') {
		console.log('attempt to restart selection process in non-ferro game!!!');
		return;
	}
	A.selectedCards.map(x => ari_make_unselected(x));
	mClear('dSelections0');
	Z.A = { level: 0, di: {}, ll: [], items: [], selected: [], tree: null, breadcrumbs: [], sib: [], command: null };
	Z.stage = 'card_selection';
	ferro_pre_action();
}
function select_add_items(items, callback = null, instruction = null, min = 0, max = 100, prevent_autoselect = false) { //, show_submit_button=true) {
	let A = Z.A;
	select_clear_previous_level();
	A.level++; A.items = items; A.callback = callback; A.selected = []; A.minselected = min; A.maxselected = max;
	show_progress();
	let dInstruction = mBy('dSelections0');
	mClass(dInstruction, 'instruction');
	mCenterCenterFlex(dInstruction);
	dInstruction.innerHTML = (Z.role == 'active' ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` : `${Z.uplayer}`) + "&nbsp;" + instruction; // + '</div>';
	if (too_many_string_items(A)) { mLinebreak(dInstruction, 4); } //console.log('triggered!!!') }
	let has_submit_items = false;
	let buttonstyle = { maleft: 10, vmargin: 2, rounding: 6, padding: '4px 12px 5px 12px', border: '0px solid transparent', outline: 'none' }
	for (const item of A.items) {
		let type = item.itemtype = is_card(item) ? 'card' : is_player(item.a)? 'player': isdef(item.o) ? 'container' : is_color(item.a)? 'color' : 'string'; // nundef(item.submit_on_click) ? 'string' : 'submit';
		if (isdef(item.submit_on_click)) { has_submit_items = true; }
		let id = item.id = lookup(item, ['o', 'id']) ? item.o.id : getUID(); A.di[id] = item;
		if (type == 'string' || type == 'color') { //make button for this item!
			let handler = ev => select_last(item, isdef(item.submit_on_click) ? callback : select_toggle, ev);
			item.div = mButton(item.a, handler, dInstruction, buttonstyle, null, id);
			if (type == 'color') mStyle(item.div,{bg:item.a,fg:'contrast'});
		} else {
			let ui = item.div = iDiv(item.o);
			ui.onclick = ev => select_last(item, select_toggle, ev); 
			ui.id = id;
		}
	}
	let show_submit_button = !has_submit_items && (A.minselected != A.maxselected || !A.autosubmit);
	if (show_submit_button) { mButton('submit', callback, dInstruction, buttonstyle, 'selectable_button', 'bSubmit'); }
	let show_restart_button = A.level > 1; 
	if (show_restart_button) { mButton('restart', onclick_reload, dInstruction, buttonstyle, 'selectable_button', 'bReload'); }
	let dParent = window[`dActions${A.level}`];
	for (const item of A.items) { ari_make_selectable(item, dParent, dInstruction); }
	assertion(A.items.length >= min, 'less options than min selection!!!!', A.items.length, 'min is', min); //TODO: sollte das passieren, check in ari_pre_action die mins!!!
	if (A.items.length == min && !is_ai_player() && !prevent_autoselect) {
		for (const item of A.items) { A.selected.push(item.index); ari_make_selected(item); }
		if (A.autosubmit) {
			loader_on();
			setTimeout(() => { if (callback) callback(); loader_off(); }, 800);
		}
	} else if (is_ai_player()) {
		ai_move();
	} else if (TESTING && isdef(DA.test)) {
		if (DA.test.iter >= DA.auto_moves.length) {
			if (isdef(DA.test.end)) DA.test.end();
			activate_ui();
			return;
		}
		let selection = DA.auto_moves[DA.test.iter++];
		if (selection) {
			deactivate_ui();
			let numbers = [];
			for (const el of selection) {
				if (el == 'last') {
					numbers.push(A.items.length - 1);
				} else if (el == 'random') {
					numbers.push(rNumber(0, A.items.length - 1));
				} else if (isString(el)) {
					let commands = A.items.map(x => x.key);
					let idx = commands.indexOf(el);
					numbers.push(idx);
				} else numbers.push(el);
			}
			selection = numbers;
			A.selected = selection;
			if (selection.length == 1) A.command = A.items[A.selected[0]].key;
			A.last_selected = A.items[A.selected[0]];
			select_highlight();
			setTimeout(() => {
				if (A.callback) A.callback();
			}, 1000);
		} else { activate_ui(); }
	} else { activate_ui(); }
}
function select_clear_previous_level() {
	let A = Z.A;
	if (!isEmpty(A.items)) {
		console.assert(A.level >= 1, 'have items but level is ' + A.level);
		A.ll.push({ items: A.items, selected: A.selected });
		let dsel = Z.game == 'accuse'?mBy(`dTitleMiddle`):mBy(`dSelections1`); // mBy(`dSelections${A.level}`)
		mStyle(dsel, { display: 'flex', 'align-items': 'center', padding: 10, box: true, gap: 10 });
		for (const item of A.items) {
			ari_make_unselectable(item);
			if (A.keep_selection) continue;
			ari_make_unselected(item);
			if (!A.selected.includes(item.index)) continue;
			if (item.itemtype == 'card') {
				let d = iDiv(item);
				let card = item.o;
				let mini = mDiv(dsel, { bg: 'yellow', fg: 'black', hpadding: 2, border: '1px solid black' }, null, card.friendly);
			} else if (item.itemtype == 'container') {
				let list = item.o.list;
				let cards = list.map(x => ari_get_card(x, 30, 30 * .7));
				let cont2 = ui_make_hand_container(cards, dsel, { bg: 'transparent' });
				ui_add_cards_to_hand_container(cont2, cards, list);
			} else if (item.itemtype == 'string') {
				let db = mDiv(dsel, { bg: 'yellow', fg: 'black', border: 'black', hpadding: 4 }, item.id, item.a);
			} else if (item.itemtype == 'color') {
				let db = mDiv(dsel, { bg: item.a, fg: 'contrast', border: 'black', hpadding: 4 }, item.id, item.a);
			} else if (item.itemtype == 'player') {
				let db = mDiv(dsel, {  }, item.id, `<span style="color:${get_user_color(item.a)};font-weight:bold"> ${item.a} </span>`);
			}
		}
	}
}
function select_confirm_weiter(callback) {
	select_add_items(ui_get_string_items(['weiter']), callback, 'may click to continue', 1, 1, Z.mode == 'multi');
}
function select_error(msg, callback = null, stay = false) {
	let [A] = [Z.A];
	DA.callback = callback;
	if (A.maxselected == 1 && A.selected.length > 0) {
		let item = A.items[A.selected[0]];
		ari_make_unselected(item);
		A.selected = [];
	} else if (A.selected.length == 2) {
		let item = A.items[A.selected[1]];
		ari_make_unselected(item);
		A.selected = [A.selected[0]];
	}
	dError.innerHTML = msg;
	if (stay) {
		dError.innerHTML += '<br><button onclick="continue_after_error()">CLICK TO CONTINUE</button>';
	} else {
		TO.error = setTimeout(continue_after_error, 3000);
	}
}
function select_highlight() { let A = Z.A; for (const i of A.selected) { let a = A.items[i]; ari_make_selected(a, true); } }//console.log('a', a); } }
function select_last(item, callback, ev) {
	if (isdef(ev)) evNoBubble(ev);
	Z.A.last_selected = item; callback(item, ev);
}
function select_timer(ms, callback) {
	let d = mBy('dSelections0');
	let dtimer = mDiv(d, { w: 80, maleft: 10, fg: 'red', weight: 'bold' }, 'dTimer');
	if (isdef(DA.timer)) { DA.timer.clear(); DA.timer = null; }
	let timer = DA.timer = new SimpleTimer(dtimer, 1000, null, ms, callback);
	timer.start();
	return dtimer;
}
function select_toggle() { //item,ev) {
	if (!uiActivated) { console.log('ui is deactivated!!!'); return; }
	let A = Z.A;
	let item = A.last_selected;
	if (A.selected.includes(item.index)) {
		removeInPlace(A.selected, item.index);
		ari_make_unselected(item);
	} else {
		if (A.maxselected == 1 && !isEmpty(A.selected)) { ari_make_unselected(A.items[A.selected[0]]); A.selected = []; }
		A.selected.push(item.index);
		ari_make_selected(item);
		if (!DA.ai_is_moving && A.selected.length >= A.maxselected && A.autosubmit) {
			setTimeout(() => A.callback(), 100);
		}
	}
}
function start_transaction() {
	if (DA.simulate) return;
	DA.simulate = true;
	DA.snapshot = { fen: jsCopy(Z.fen), stage: Z.stage, round: Z.round, phase: Z.phase, turn: Z.turn }; //brauch ich eigentlich nicht
	DA.transactionlist = [];
}
function stop_timer() {
	if (isdef(DA.timer)) {
		let res = DA.timer.clear();
		DA.timer = null;
		return isNumber(res) ? res : 0;
	}
	return 0;
}
//#endregion select

//#region sim
function add_to_chain(list) { DA.chain = DA.chain.concat(list); }
function ari_test_hand_to_discard(fen, uname, keep = 0) {
	let list = fen.players[uname].hand;
	while (fen.open_discard.length < 4 && list.length > keep) top_elem_from_to(list, fen.open_discard);
	while (list.length > keep) top_elem_from_to(list, fen.deck_discard);
}
function ari_ut0_create_staged() {
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	for (const uname in fen.players) {
		let pl = fen.players[uname];
		while (!isEmpty(pl.hand)) last_elem_from_to(pl.hand, fen.deck);
	}
	fen.players.mimi.hand = 'AHb ADb 2Cb 4Cb 6Cb KCb QDb'.split(' ');
	fen.players.leo.hand = 'ACb ASb 2Db 4Db 6Db KDb QSb'.split(' ');
	fen.players.mimi.buildings.farm = [{ list: '4Cr 4Sr 4Sb 4Dr'.split(' '), h: null }, { list: '5Cr 5Sr 5Sb 5Dr'.split(' '), h: null }];
	fen.players.mimi.buildings.estate = [{ list: 'TCr TSr TSb TDr TDb'.split(' '), h: null }];
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut1_create_staged() {
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	top_elem_from_to(fen.deck, fen.market);
	top_elem_from_to(fen.deck, fen.market);
	fen.stage = 4;
	top_elem_from_to(fen.players.mimi.hand, fen.players.mimi.stall);
	top_elem_from_to(fen.players.mimi.hand, fen.players.mimi.stall);
	fen.iturn = 1;
	fen.turn = ['leo'];
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut10_create_staged() { //just setup
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut100_create_staged() { //tax
	console.log('*** test 100: tax ***');
	DA.test.number = 100;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'amanda', 'felix', 'lauren', 'blade'];
	let fen = ari_setup(player_names);
	ari_test_hand_to_discard(fen, 'mimi'); //mimi has no hand!
	deck_add(fen.deck, 3, fen.players.amanda.hand); //amanda has to pay 3 tax
	ari_test_hand_to_discard(fen, 'felix', 3); //felix hand size 3, no tax!
	deck_add(fen.deck, 1, fen.players.blade.hand); //blade has to pay 1 tax
	let sz = ARI.sz_hand;
	fen.pl_tax = { mimi: -sz, amanda: 3, felix: -sz + 3, lauren: 0, blade: 1 };
	[fen.iturn, fen.turn] = [1, ['amanda']];
	fen.stage = 2;
	DA.fen0 = fen;
	DA.staged_moves = [];
	DA.iter = 100;
	DA.iter_verify = 3;
	DA.verify = (ot) => {
		let res = forAll(ot.plorder, x => ot[x].hand.length <= sz);
		if (!res) for (const uname of ot.plorder) console.log('pl', uname, 'hand', ot[uname].hand.length, 'should be', Math.min(sz, DA.fen0.players[uname].hand.length));
		return res;
	};
	DA.auto_moves = {
		amanda_1: [[0, 1, 2]],
		blade_2: [[0]],
	}
	return [fen, player_names];
}
function ari_ut101_create_staged() { //stall selection with empty hands
	console.log('*** test 101: stall selection 5 players ***');
	DA.test.number = 101;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'amanda', 'felix', 'lauren', 'blade'];
	let fen = ari_setup(player_names);
	ari_test_hand_to_discard(fen, 'mimi'); //mimi has no hand!
	ari_test_hand_to_discard(fen, 'felix'); //felix has no hand!
	fen.stage = 3;
	DA.fen0 = fen;
	DA.staged_moves = [];
	DA.iter = 100;
	DA.iter_verify = 6;
	DA.verify = (ot) => {
		let stall_sz = { mimi: 0, amanda: 3, felix: 0, lauren: 1, blade: 2 };
		let res = forAll(ot.plorder, x => ot[x].stall.length == stall_sz[x]);
		if (!res) for (const uname of ot.plorder) console.log('pl', uname, 'stall', ot[uname].stall.length, 'should be', stall_sz[uname]);
		return res;
	};
	DA.auto_moves = {
		amanda_2: [[0, 1, 2]],
		lauren_4: [[0]],
		blade_5: [[0, 1]],
	}
	return [fen, player_names];
}
function ari_ut102_create_staged() { //stall selection with empty hands
	console.log('*** test 102: stall selection mimi-leo ***');
	DA.test.number = 102;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	ari_test_hand_to_discard(fen, 'mimi'); //mimi has no hand! this makes sure that it is leo's turn!
	fen.stage = 3;
	DA.fen0 = fen;
	DA.iter_verify = 3;
	DA.verify = (ot) => {
		let stall_sz = { mimi: 0, leo: 3 };
		let res = forAll(ot.plorder, x => ot[x].stall.length == stall_sz[x]);
		if (!res) for (const uname of ot.plorder) console.log('pl', uname, 'stall', ot[uname].stall.length, 'should be', stall_sz[uname]);
		return res;
	};
	DA.auto_moves = {
		leo_2: [[0, 1, 2]],
	};
	return [fen, player_names];
}
function ari_ut103_create_staged() { //trade
	console.log('*** test 103: trade ***');
	DA.test.number = 103;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen, 2);
	DA.fen0 = fen;
	DA.auto_moves = {
		mimi_1: [['trade'], [1, 3]],
		mimi_2: [['pass']],
		leo_3: [['trade'], [1, 3]],
		leo_4: [['pass']],
	};
	DA.iter_verify = 5;
	DA.verify = (ot) => {
		let res = firstCond(ot.mimi.hand, x => x == DA.fen0.market[1]);
		if (!res) console.log('mimi stall does not contain market card from start!!!');
		return res;
	};
	return [fen, player_names];
}
function ari_ut104_create_staged() { //downgrade from estate to farm
	console.log('*** test 104: downgrade from estate to farm ***');
	DA.test.number = 104;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	stage_building(fen, fen.iturn, 'estate');
	DA.fen0 = fen;
	DA.iter_verify = 2;
	DA.verify = (ot) => {
		let stall_sz = { mimi: 0, leo: 3 };
		let res = ot.mimi.buildings.farm.length == 1 && ot.mimi.buildings.estate.length == 0;
		if (!res) console.log('mimi buildings', ot.mimi.buildings);
		return res;
	};
	DA.auto_moves = {
		mimi_1: [['downgrade'], [0]],
	};
	return [fen, player_names];
}
function ari_ut105_create_staged() { //visit
	console.log('*** test 105: visit ***');
	DA.test.number = 105;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo', 'meckele'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	stage_replace_hand_cards_by(fen, 'mimi', ['QSy']);
	stage_building(fen, fen.iturn, 'estate');
	stage_building(fen, 1, 'estate');
	stage_building(fen, 2, 'estate');
	fen.phase = 'queen';
	DA.fen0 = fen;
	DA.iter_verify = 2;
	DA.verify = (ot) => {
		let uname_visited = ot.uname;
		let building = ot[uname_visited].buildings.estate[0];
		let res = ot.mimi.coins == 2 || ot.mimi.coins == 4 || ot.mimi.hand.length + ot.mimi.stall.length == 6;
		if (!res) console.log('mimi visit payment did not work!', building.list);
		return res;
	};
	DA.auto_moves = {
		mimi_1: [['visit'], [0], [0], ['pass']],
	};
	return [fen, player_names];
}
function ari_ut106_create_staged() { //double visit
	console.log('*** test 106: double visit ***');
	DA.test.number = 106;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo', 'meckele'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	stage_replace_hand_cards_by(fen, 'mimi', ['QSy', 'QSg']);
	stage_building(fen, fen.iturn, 'estate');
	stage_building(fen, 1, 'chateau');
	stage_building(fen, 2, 'chateau');
	fen.phase = 'queen';
	DA.fen0 = fen;
	DA.auto_moves = {
		mimi_1: [['visit'], [0], [0]],
		mimi_2: [['visit'], [0], [0]],
	};
	DA.iter_verify = 3;
	DA.verify = (ot) => {
		let uname_visited = ot.plorder[1];
		let chateau = ot[uname_visited].buildings.chateau;
		console.log('chateau:', uname_visited, chateau);
		let res = ot.mimi.coins == 5 || ot[uname_visited].buildings.chateau.length == 0;
		if (!res) console.log('double visit failed or building is correct!!!');
		return res;
	};
	return [fen, player_names];
}
function ari_ut107_create_staged() { //end game
	console.log('*** test 107: end game ***');
	DA.test.number = 107;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	stage_correct_buildings(fen, { mimi: { farm: 2, estate: 2, chateau: 1 }, leo: { farm: 3 } });
	DA.fen0 = fen;
	DA.auto_moves = {
		mimi_1: [['pass']],
		leo_2: [['pass']],
		3: [[0]], //mimi is ending the game
	};
	DA.iter_verify = 4;
	DA.verify = (ot) => {
		let res = ot.winners = 'mimi';
		if (!res) console.log('end game mimi should win didnt work!', ot);
		return res;
	};
	return [fen, player_names];
}
function ari_ut108_create_staged() { //buy from open discard
	console.log('*** test 108: buy from open discard ***');
	DA.test.number = 108;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	fen.open_discard = deck_deal(fen.deck, 4);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	stage_correct_buildings(fen, { mimi: { farm: 2, estate: 2, chateau: 1 }, leo: { farm: 3 } });
	fen.phase = 'jack';
	DA.fen0 = fen;
	DA.auto_moves = {
		mimi_1: [['buy'], [0], [0]],
	};
	DA.iter_verify = 2;
	DA.verify = (ot) => {
		let res = ot.open_discard.length == 3 && ot.mimi.hand.length == 5 && ot.mimi.coins == 2
			|| arrLast(ot.open_discard)[0] == 'J' && ot.mimi.hand.length == 4 && ot.mimi.coins == 3;
		if (!res) console.log('buy form discard does not work!', ot.mimi, ot.open_discard);
		return res;
	};
	return [fen, player_names];
}
function ari_ut109_create_staged() { //harvest
	console.log('*** test 109: harvest ***');
	DA.test.number = 109;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo', 'meckele'];
	let fen = ari_setup(player_names);
	fen.open_discard = deck_deal(fen.deck, 4);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	stage_correct_buildings(fen, { mimi: { farm: 2, estate: 2 }, leo: { farm: 3 }, meckele: { farm: 2 } });
	fen.phase = 'jack';
	DA.fen0 = fen;
	DA.auto_moves = [
		[[]],
		[['pass']], [['pass']], [['pass']], //end of jack phase
		[[0]], [[0]], [[0]], //tax: one each
		[[0, 1]], [[0, 1]], [[0, 1]], //stall selection
		[['harvest'], [0]],
	];
	DA.iter_verify = 11;
	DA.verify = (ot) => {
		let uname = ot.uname;
		let res = ot[uname].buildings.farm[0].h == null && ot[uname].hand.length == 6;
		if (!res) console.log('harvest FAIL!', ot[uname]);
		return res;
	};
	return [fen, player_names];
}
function ari_ut11_create_staged() { //buy
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	let [mimi, leo] = [fen.players.mimi, fen.players.leo];
	mimi.buildings.farm = [{ list: deck_deal(fen.deck, 4), h: null }];
	leo.buildings.farm = [{ list: deck_deal(fen.deck, 4), h: null }];
	fen.open_discard = deck_deal(fen.deck, 4);
	fen.market = deck_deal(fen.deck, 2);
	fen.phase = 'king';
	arisim_stage_4(fen, 3, 3);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut110_create_staged() { //end game 2
	console.log('*** test 110: end game 2 ***');
	DA.test.number = 110;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	fen.open_discard = deck_deal(fen.players.mimi.hand, 2);
	deck_add(fen.players.leo.hand, 2, fen.open_discard);
	stage_correct_buildings(fen, { mimi: { farm: 2, estate: 2, chateau: 1 }, leo: { farm: 3 } });
	fen.phase = 'jack';
	DA.fen0 = fen;
	DA.auto_moves = [
		[[]],
		[['pass']], [['pass']], //end of jack phase
		[[0]], [[0]], //stall selection king phase
		[['pass']], [['pass']], //end of king phase
		[[1]], //NOT ending game!
	];
	DA.iter_verify = 8;
	DA.verify = (ot) => {
		let res = ot.stage == 3;
		if (!res) console.log('Not ending game FAIL!', ot.stage);
		return res;
	};
	return [fen, player_names];
}
function ari_ut111_create_staged() { //auction payment test
	console.log('*** test 111: auction payment test ***');
	DA.test.number = 111;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo', 'meckele'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	fen.open_discard = deck_deal(fen.players.mimi.hand, 2);
	deck_add(fen.players.leo.hand, 2, fen.open_discard);
	fen.phase = 'queen';
	DA.fen0 = fen;
	DA.auto_moves = {
		1: [['pass']],
		2: [['pass']],
		3: [['pass']],
		4: [[0]],
		5: [[1]],
		6: [[2]],
		7: [[0]],
	};
	DA.iter_verify = 8;
	DA.verify = (ot) => {
		let coins = ot.plorder.map(x => ot[x].coins);
		let sum = arrSum(coins);
		let res = sum == 8;
		if (!res) console.log('payment for auction card wrong', coins, sum);
		return res;
	};
	return [fen, player_names];
}
function ari_ut112_create_staged() { //auction payment test 2
	console.log('*** test 112: auction payment test 2 ***');
	DA.test.number = 112;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo', 'meckele', 'felix', 'amanda'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	fen.phase = 'queen';
	DA.fen0 = fen;
	DA.auto_moves = {
		1: [['pass']],
		2: [['pass']],
		3: [['pass']],
		4: [['pass']],
		5: [['pass']],
		6: [[1]],
		7: [[0]],
		8: [[2]],
		9: [[2]],
		10: [[1]],
		11: [[0]], //card
		12: [[1]], //card
	};
	DA.iter_verify = 13;
	DA.verify = (ot) => {
		let coins = ot.plorder.map(x => ot[x].coins);
		let sum = arrSum(coins);
		let res = sum == 11;
		if (!res) console.log('payment for auction card wrong', coins, sum);
		return res;
	};
	return [fen, player_names];
}
function ari_ut113_create_staged() { //buy from open discard w/ jack
	console.log('*** test 113: buy from open discard w/ jack ***');
	DA.test.number = 113;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	fen.open_discard = deck_deal(fen.deck, 4);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	stage_replace_hand_cards_by(fen, 'mimi', ['JSy']);
	stage_correct_buildings(fen, { mimi: { farm: 2, estate: 2, chateau: 1 }, leo: { farm: 3 } });
	fen.phase = 'jack';
	DA.fen0 = fen;
	DA.auto_moves = {
		mimi_1: [['buy'], [0], [0]],
	};
	DA.iter_verify = 2;
	DA.verify = (ot) => {
		let res = ot.open_discard.length == 3 && ot.mimi.hand.length == 5 && ot.mimi.coins == 2
			|| arrLast(ot.open_discard)[0] == 'J' && ot.mimi.hand.length == 4 && ot.mimi.coins == 3;
		if (!res) console.log('buy form discard does not work!', ot.mimi, ot.open_discard);
		return res;
	};
	return [fen, player_names];
}
function ari_ut12_create_staged() { //just setup 5 players
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'amanda', 'felix', 'lauren', 'blade'];
	let fen = ari_setup(player_names);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut13_create_staged() { //2 hands empty in stage 4
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'amanda', 'felix', 'lauren', 'blade'];
	let fen = ari_setup(player_names);
	ari_test_hand_to_discard(fen, 'mimi');
	ari_test_hand_to_discard(fen, 'lauren');
	console.log('mimi', fen.players.mimi)
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut14_create_staged() { //pickup single card
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'amanda', 'felix', 'lauren', 'blade'];
	let fen = ari_setup(player_names);
	DA.fen0 = jsCopy(fen);
	arisim_stage_3(fen);
	arisim_stage_4_all(fen, 1);
	DA.staged_moves = [];
	DA.iter = 100;
	DA.iter_verify = 2;
	DA.verify = (ot) => {
		let plast = arrLast(ot.round);
		let ok = sameList(ot[plast].hand, DA.fen0.players[plast].hand);
		console.log('pl', plast, 'hand', ot[plast].hand, 'should be', DA.fen0.players[plast].hand);
		return ok;
	}
	return [fen, player_names];
}
function ari_ut15_create_staged() { //4 hands empty in stage 4
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'amanda', 'felix', 'lauren', 'blade'];
	let fen = DA.fen0 = ari_setup(player_names);
	ari_test_hand_to_discard(fen, 'mimi');
	ari_test_hand_to_discard(fen, 'amanda');
	ari_test_hand_to_discard(fen, 'lauren');
	ari_test_hand_to_discard(fen, 'blade');
	DA.staged_moves = [];
	DA.iter = 100;
	DA.iter_verify = 3;
	DA.verify = (ot) => ot.uname == 'felix';
	return [fen, player_names];
}
function ari_ut16_create_staged() { //just setup mimi, leo
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut2_create_staged() {
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4(fen);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut206_create_staged() { //prep double visit
	console.log('*** test 206: prep double visit ***');
	DA.test.number = 206;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo', 'meckele'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	stage_replace_hand_cards_by(fen, 'mimi', ['QSy', 'QSg']);
	stage_building(fen, fen.iturn, 'estate');
	fen.players.leo.buildings.farm = [{ list: '4Cy 4Sy 4Hy 6Dy'.split(' '), h: null }, { list: '5Cy JSy 5Sy 5Dy'.split(' '), h: null }];
	fen.phase = 'queen';
	DA.fen0 = fen;
	return [fen, player_names];
}
function ari_ut3_create_staged() {
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	for (const uname in fen.players) {
		let pl = fen.players[uname];
		while (!isEmpty(pl.hand)) last_elem_from_to(pl.hand, fen.deck);
	}
	fen.players.mimi.hand = 'AHb ADb 2Cb 4Cb 6Cb KCb QDb'.split(' ');
	fen.players.leo.hand = 'ACb KDb QSb ASb 2Db 4Db 6Db'.split(' ');
	fen.players.mimi.buildings.farm = [{ list: '4Cr 7Sr 4Sb 4Dr'.split(' '), h: null }];//, { list: '5Cr 5Sr 5Sb 5Dr'.split(' '), h: null }];
	fen.players.leo.buildings.estate = [{ list: 'TCr 7Sr TSb TDr TDb'.split(' '), h: null }];
	fen.market = 'KSb 3Sb'.split(' ');
	arisim_stage_4(fen, 3, 2);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut306_create_staged() { //prep double visit
	console.log('*** test 306: prep double visit ***');
	DA.test.number = 306;
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo', 'meckele'];
	let fen = ari_setup(player_names);
	arisim_stage_3(fen);
	arisim_stage_4_all_mimi_starts(fen);
	stage_replace_hand_cards_by(fen, 'mimi', ['QSy', 'QSg']);
	stage_building(fen, fen.iturn, 'estate');
	fen.players.leo.buildings.farm = [{ list: '4Cy 4Sy 4Hy 6Dy'.split(' '), h: null }, { list: '5Cy JSy 5Sy 5Dy'.split(' '), h: null }];
	fen.phase = 'queen';
	DA.fen0 = fen;
	DA.auto_moves = [[],
	[['visit'], ['last'], [0]],
	[['visit'], ['last'], [1]],
	[['pass']],
	];
	return [fen, player_names];
}
function ari_ut4_create_staged() { //start in queen phase
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	for (const uname in fen.players) {
		let pl = fen.players[uname];
		while (!isEmpty(pl.hand)) last_elem_from_to(pl.hand, fen.deck);
	}
	fen.players.mimi.hand = 'AHb ADb 2Cb 4Cb 6Cb KCb QDb'.split(' ');
	fen.players.leo.hand = 'ACb KDb QSb ASb 2Db 4Db 6Db'.split(' ');
	fen.players.mimi.buildings.farm = [{ list: '4Cr 7Sr 4Sb 4Dr'.split(' '), h: null }];//, { list: '5Cr 5Sr 5Sb 5Dr'.split(' '), h: null }];
	fen.players.leo.buildings.estate = [{ list: 'TCr 7Sr TSb TDr TDb'.split(' '), h: null }];
	fen.market = 'KSb 3Sb'.split(' ');
	fen.phase = 'queen';
	fen.stage = 11;
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut5_create_staged() { //start in jack phase
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	for (const uname in fen.players) {
		let pl = fen.players[uname];
		while (!isEmpty(pl.hand)) last_elem_from_to(pl.hand, fen.deck);
	}
	fen.players.mimi.hand = 'AHb ADb 2Cb 4Cb 6Cb KCb QDb'.split(' ');
	fen.players.leo.hand = 'ACb KDb QSb ASb 2Db 4Db 6Db'.split(' ');
	fen.players.mimi.buildings.farm = [{ list: '4Cr 7Sr 4Sb 4Dr'.split(' '), h: null }];//, { list: '5Cr 5Sr 5Sb 5Dr'.split(' '), h: null }];
	fen.players.leo.buildings.estate = [{ list: 'TCr 7Sr TSb TDr TDb'.split(' '), h: null }];
	fen.phase = 'jack';
	fen.stage = 3;
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut6_create_staged() { //start in jack phase
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	for (const uname in fen.players) {
		let pl = fen.players[uname];
		while (!isEmpty(pl.hand)) last_elem_from_to(pl.hand, fen.deck);
	}
	fen.players.mimi.hand = 'AHb ADb 2Cb 4Cb 6Cb KCb QDb'.split(' ');
	fen.players.leo.hand = 'ACb KDb QSb ASb 2Db 4Db 6Db'.split(' ');
	fen.players.mimi.buildings.farm = [{ list: '4Cr 7Sr 4Sb 4Dr'.split(' '), h: null }];//, { list: '5Cr 5Sr 5Sb 5Dr'.split(' '), h: null }];
	fen.players.leo.buildings.estate = [{ list: 'TCr 7Sr TSb TDr TDb'.split(' '), h: null }];
	for (let i = 0; i < 3; i++) {
		top_elem_from_to(fen.deck, fen.market);
	}
	fen.phase = 'jack';
	arisim_stage_4(fen);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut7_create_staged() { //double visit
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	for (const uname in fen.players) {
		let pl = fen.players[uname];
		while (!isEmpty(pl.hand)) last_elem_from_to(pl.hand, fen.deck);
	}
	fen.players.mimi.hand = 'AHb ADb 2Cb 4Cb 6Cb QCb QDb'.split(' ');
	fen.players.leo.hand = 'ACb KDb QSb ASb 2Db 4Db 6Db'.split(' ');
	fen.players.mimi.buildings.farm = [{ list: '4Cr 7Sr 4Sb 4Dr'.split(' '), h: null }];//, { list: '5Cr 5Sr 5Sb 5Dr'.split(' '), h: null }];
	fen.players.leo.buildings.estate = [{ list: 'TCr 7Sr TSb TDr TDb'.split(' '), h: null }];
	for (let i = 0; i < 3; i++) {
		top_elem_from_to(fen.deck, fen.market);
	}
	fen.phase = 'jack';
	arisim_stage_4(fen);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut8_create_staged() { //harvest, tax
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	deck_add(fen.deck, 1, fen.players.mimi.hand); //'AHb ADb 2Cb 4Cb 6Cb QCb QDb'.split(' ');
	fen.players.mimi.buildings.farm = [{ list: deck_deal(fen.deck, 4), h: '3Hb' }];//, { list: '5Cr 5Sr 5Sb 5Dr'.split(' '), h: null }];
	fen.players.leo.buildings.farm = [{ list: deck_deal(fen.deck, 4), h: null }];
	fen.players.leo.buildings.estate = [{ list: deck_deal(fen.deck, 5), h: null }];
	fen.market = deck_deal(fen.deck, 3);
	fen.phase = 'jack';
	arisim_stage_4(fen);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function ari_ut9_create_staged() { //transfer to new round
	Session.cur_game = 'gAristo';
	let player_names = ['mimi', 'leo'];
	let fen = ari_setup(player_names);
	for (const uname in fen.players) {
		let pl = fen.players[uname];
		while (!isEmpty(pl.hand)) last_elem_from_to(pl.hand, fen.deck);
	}
	fen.players.mimi.hand = 'AHb ADb 2Cb 4Cb 6Cb QCb QDb'.split(' ');
	fen.players.leo.hand = 'ACb KDb QSb ASb 2Db 4Db 6Db'.split(' ');
	fen.players.mimi.buildings.farm = [{ list: '4Cr 7Sr 4Sb 4Dr'.split(' '), h: '3Hb' }];//, { list: '5Cr 5Sr 5Sb 5Dr'.split(' '), h: null }];
	fen.players.leo.buildings.farm = [{ list: 'JCr JSr JSb JDr'.split(' '), h: '3Sr' }];
	fen.players.leo.buildings.estate = [{ list: 'TCr 7Sr TSb TDr TDb'.split(' '), h: null }];
	for (let i = 0; i < 3; i++) {
		top_elem_from_to(fen.deck, fen.market);
	}
	fen.phase = 'king';
	arisim_stage_4(fen);
	DA.staged_moves = [];
	DA.iter = 100;
	return [fen, player_names];
}
function arisim_stage_3(fen) {
	top_elem_from_to(fen.deck, fen.market);
	top_elem_from_to(fen.deck, fen.market);
	if (fen.phase == 'jack') top_elem_from_to(fen.deck, fen.market);
	fen.stage = 4;
}
function arisim_stage_4(fen, n_mimi = 2, n_leo = 3) {
	for (let i = 0; i < n_mimi; i++) top_elem_from_to(fen.players.mimi.hand, fen.players.mimi.stall);
	for (let i = 0; i < n_leo; i++)	top_elem_from_to(fen.players.leo.hand, fen.players.leo.stall);
	fen.stage = 5;
	let valmimi = fen.players.mimi.stall_value = arrSum(fen.players.mimi.stall.map(x => ari_get_card(x).val));
	let valleo = fen.players.leo.stall_value = arrSum(fen.players.leo.stall.map(x => ari_get_card(x).val));
	let minplayer = valmimi <= valleo ? 'mimi' : 'leo';
	fen.iturn = fen.plorder.indexOf(minplayer); fen.turn = [minplayer];
	fen.num_actions = fen.total_pl_actions = fen.players[minplayer].stall.length;
	fen.action_number = 1;
}
function arisim_stage_4_all(fen, n = 3, changeturn = true) {
	for (let i = 0; i < n; i++) top_elem_from_to(fen.players.mimi.hand, fen.players.mimi.stall);
	let others = get_keys(fen.players).filter(x => x != 'mimi');
	for (const plname of others) {
		for (let i = 0; i < n; i++)	top_elem_from_to(fen.players[plname].hand, fen.players[plname].stall);
	}
	let list = [];
	for (const plname of get_keys(fen.players)) {
		fen.players[plname].stall_value = arrSum(fen.players[plname].stall.map(x => ari_get_card(x).val));
		list.push({ uname: plname, val: fen.players[plname].stall_value });
	}
	fen.stage = 5;
	list = sortBy(list, 'val');
	let minplayer = list[0].uname;
	fen.iturn = fen.plorder.indexOf(minplayer);
	if (changeturn) fen.turn = [minplayer];
	fen.num_actions = fen.total_pl_actions = fen.players[fen.turn[0]].stall.length;
	fen.action_number = 1;
}
function arisim_stage_4_all_mimi_starts(fen, n = 3) {
	for (let i = 0; i < n; i++) top_elem_from_to(fen.players.mimi.hand, fen.players.mimi.stall);
	let others = get_keys(fen.players).filter(x => x != 'mimi');
	for (const uname of others) {
		for (let i = 0; i < n; i++)	top_elem_from_to(fen.players[uname].hand, fen.players[uname].stall);
	}
	let list = [];
	for (const uname of get_keys(fen.players)) {
		fen.players[uname].stall_value = arrSum(fen.players[uname].stall.map(x => ari_get_card(x).val));
		list.push({ uname: uname, val: fen.players[uname].stall_value });
	}
	fen.stage = 5;
	list = sortBy(list, 'val');
	let minplayer = list[0].uname;
	if (minplayer != 'mimi') {
		console.log('NOT mimi!!! minplayer', minplayer)
		let best_stall = fen.players[minplayer].stall;
		let best_stall_value = fen.players[minplayer].stall_value;
		fen.players[minplayer].stall = fen.players.mimi.stall;
		fen.players[minplayer].stall_value = fen.players.mimi.stall_value;
		fen.players.mimi.stall = best_stall;
		fen.players.mimi.stall_value = best_stall_value;
		minplayer = 'mimi';
	}
	fen.iturn = fen.plorder.indexOf(minplayer);
	fen.turn = [minplayer];
	console.assert(fen.turn == ['mimi'], 'WTF?????????????????');
	fen.num_actions = fen.total_pl_actions = fen.players[minplayer].stall.length;
	fen.action_number = 1;
}
function ferro_ut0_create_staged() { //prep double visit
	console.log('*** test ferro 0: buy_or_pass with no coins ***');
	DA.test.number = 0;
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let otherplayer = firstCond(fen.plorder, (p) => p != uplayer);
	let pl = fen.players[otherplayer];
	pl.coins = 0;
	DA.fen0 = fen;
	DA.auto_moves = [[],
	[['visit'], ['last'], [0]],
	[['visit'], ['last'], [1]],
	[['pass']],
	];
	return [fen, player_names];
}
function inno_undo_random_deal(fen) {
	for (const uname in fen.players) {
		let pl = fen.players[uname];
		last_elem_from_to(pl.hand, fen.decks.E[1]);
		last_elem_from_to(pl.hand, fen.decks.B[1]);
	}
}
function inno_ut0_create_staged() {
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	console.log('fen', fen)
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('agriculture', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	DA.staged_moves = ['mimi.hand.agriculture', 'leo.hand.metalworking', 'mimi.board.yellow.agriculture', 'mimi.hand.comb',
		'leo.board.red.metalworking', 'leo.board.red.metalworking', 'mimi.board.yellow.agriculture', 'pass', 'mimi.board.yellow.agriculture', 'pass'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut1_create_staged() {
	console.log('*** TEST: activate agriculture ***');
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('agriculture', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	DA.staged_moves = ['mimi.hand.agriculture', 'leo.hand.metalworking', 'mimi.board.yellow.agriculture', 'mimi.hand.comb'];//,'mimi.hand.comb','leo.board.red.metalworking'];
	DA.iter = 13;
	return [fen, player_names];
}
function inno_ut10_create_staged() {
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('agriculture', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	DA.staged_moves = ['mimi.hand.agriculture', 'leo.hand.metalworking', 'draw', 'draw', 'draw', 'draw'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut11_create_staged() {
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('agriculture', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	DA.staged_moves = ['mimi.hand.agriculture', 'leo.hand.metalworking', 'draw', 'draw', 'draw', 'draw', 'meld', 'meld', 'draw', 'draw', 'meld', 'meld'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut12_create_staged() {
	console.log('*** TEST: activate code_of_laws ***');
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('code_of_laws', deck1, mimi.hand);
	elem_from_to('puppet', deck2, mimi.hand);
	elem_from_to('sailing', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	DA.staged_moves = ['mimi.hand.code_of_laws', 'leo.hand.sailing', 'mimi.board.purple.code_of_laws', 'leo.hand.soap', 'mimi.hand.puppet'];//,'mimi.hand.comb','leo.board.red.metalworking'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut2_create_staged() {
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('agriculture', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	DA.staged_moves = ['mimi.hand.agriculture', 'leo.hand.metalworking'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut3_create_staged() {
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo', 'felix', 'amanda'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo, felix, amanda] = [fen.decks, fen.players.mimi, fen.players.leo, fen.players.felix, fen.players.amanda];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('wheel', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	elem_from_to('agriculture', deck1, felix.hand);
	elem_from_to('chopsticks', deck2, felix.hand);
	elem_from_to('pottery', deck1, amanda.hand);
	elem_from_to('dice', deck2, amanda.hand);
	DA.staged_moves = ['mimi.hand.wheel', 'leo.hand.metalworking', 'felix.hand.agriculture', 'amanda.hand.dice'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut4_create_staged() {
	console.log('*** TEST: sharing agriculture ***');
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo', 'felix'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo, felix] = [fen.decks, fen.players.mimi, fen.players.leo, fen.players.felix];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('pottery', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	elem_from_to('agriculture', deck1, felix.hand);
	elem_from_to('chopsticks', deck2, felix.hand);
	DA.staged_moves = ['mimi.hand.pottery', 'leo.hand.soap', 'felix.hand.agriculture'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut5_create_staged() {
	console.log('*** TEST: sharing metalworking ***');
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo', 'felix'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo, felix] = [fen.decks, fen.players.mimi, fen.players.leo, fen.players.felix];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('wheel', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	elem_from_to('agriculture', deck1, felix.hand);
	elem_from_to('chopsticks', deck2, felix.hand);
	DA.staged_moves = ['mimi.hand.wheel', 'leo.hand.metalworking', 'felix.hand.agriculture', 'draw.decks.B.1'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut6_create_staged() {
	console.log('*** TEST: draw ***');
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('wheel', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	DA.staged_moves = ['mimi.hand.wheel', 'leo.hand.soap'];//,'draw.decks.B.1'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut7_create_staged() {
	console.log('*** TEST: draw 2 ***');
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('wheel', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('soap', deck2, leo.hand);
	DA.staged_moves = ['mimi.hand.wheel', 'leo.hand.soap', 'decks.E.1', 'decks.B.1', 'decks.B.1'];//,'draw.decks.B.1'];
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut8_create_staged() {
	console.log('*** TEST: splay up ***');
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('agriculture', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('puppet', deck2, leo.hand);
	elem_from_to('chopsticks', deck2, mimi.board.yellow);
	elem_from_to('soap', deck2, mimi.board.yellow);
	elem_from_to('fermenting', decks.B[2], mimi.board.yellow);
	fen.players.mimi.splays.yellow = 3;
	DA.iter = 100;
	return [fen, player_names];
}
function inno_ut9_create_staged() {
	console.log('*** TEST: splay complex ***');
	Session.cur_game = 'gPreinno';
	let player_names = ['mimi', 'leo'];
	let fen = inno_setup(player_names);
	let [decks, mimi, leo] = [fen.decks, fen.players.mimi, fen.players.leo];
	let deck1 = decks.B[1]; let deck2 = decks.E[1];
	inno_undo_random_deal(fen);
	elem_from_to('agriculture', deck1, mimi.hand);
	elem_from_to('comb', deck2, mimi.hand);
	elem_from_to('metalworking', deck1, leo.hand);
	elem_from_to('puppet', deck2, leo.hand);
	let mydeck1 = decks.B[1].map(x => ({ key: x, deck: decks.B[1] }));
	let mydeck2 = decks.B[2].map(x => ({ key: x, deck: decks.B[2] }));
	let mydeck3 = decks.B[3].map(x => ({ key: x, deck: decks.B[3] }));
	let mydecks = mydeck1.concat(mydeck2).concat(mydeck3);
	for (const x of mydecks) { elem_from_to(x.key, x.deck, mimi.board[inno_get_cardinfo(x.key).color]); }
	fen.players.mimi.splays.blue = 3;
	fen.players.mimi.splays.red = 0;
	fen.players.mimi.splays.green = 1;
	fen.players.mimi.splays.yellow = 2;
	fen.players.mimi.splays.purple = 2;
	DA.iter = 100;
	return [fen, player_names];
}
function stage_building(fen, i_pl, type) {
	let n = type == 'chateau' ? 6 : type == 'estate' ? 5 : 4;
	let plname = fen.plorder[i_pl];
	lookupSet(fen.players[plname], ['buildings', type], []);
	let building = { list: deck_deal(fen.deck, n), h: null, type: type, schweine: [] };
	building.lead = building.list[0];
	fen.players[plname].buildings[type].push(building);
	return building;
}
function stage_building_new(fen, i_pl, type, n_openschwein, n_closedschwein) {
	let n = type == 'chateau' ? 6 : type == 'estate' ? 5 : 4;
	let plname = fen.plorder[i_pl];
	lookupSet(fen.players[plname], ['buildings', type], []);
	let building = { list: deck_deal(fen.deck, 1), h: null, type: type, schweine: [] };
	let k = building.lead = building.list[0];
	let other = k[0] == 'Q' ? '2' : 'Q';
	let i, j;
	for (i = 1; i <= n_openschwein; i++) { building.schweine.push(i); building.list.push(other + rSuit('CSHD') + 'n'); }
	for (j = 1; j <= n_closedschwein; j++) { building.list.push(other + rSuit('CSHD') + 'n'); }
	while (building.list.length < n) { building.list.push(k); j++; }
	fen.players[plname].buildings[type].push(building); 
	return building;
}
function stage_correct_buildings(fen, o) { //unames, types, ranks) {
	let ranks = toLetters('A23456789TJQK');
	let irank = 0;
	for (const uname in o) {
		let pl = fen.players[uname];
		let bo = pl.buildings;
		let dinums = o[uname];
		for (const type in dinums) {
			let n = dinums[type];
			for (let i = 0; i < n; i++) {
				let r = ranks[irank]; irank++;
				let s = type == 'farm' ? `${r}Cn ${r}Sn ${r}Sn ${r}Dn` :
					type == 'estate' ? `${r}Cn ${r}Sn ${r}Sn ${r}Dn ${r}Cn` : `${r}Cn ${r}Sn ${r}Sn ${r}Dn ${r}Cn ${r}Hn`;
				bo[type].push({ list: s.split(' '), h: null });
			}
		}
	}
}
function stage_replace_hand_cards_by(fen, uname, keys) { let i = 0; for (const key of keys) fen.players[uname].hand[i++] = key; }
function test_engine_run_next(list) {
	if (nundef(list)) {
		list = DA.test.list = arrRange(100, DA.test.number - 1); //[101, 102, 103];
	}
	if (isEmpty(list)) {
		console.log('*** all tests finished ***');
		DA.test.suiteRunning = DA.test.running = false;
		shield_off();
		return;
	}
	let n = list.shift();
	DA.test.iter = 0;
	onclick_ut_n('ari', n);
}
function verify_unit_test(otree) {
	if (isdef(DA.verify) && DA.test.iter == DA.iter_verify) {
		DA.test.running = false;
		let res = DA.verify(otree);
		console.log('***UNIT TEST ' + DA.test.number, res ? 'passed...' : 'FAILED!!!!!!!!!!!!!!!!');
		console.assert(res, '*** _ TEST FAIL ***')
		if (DA.test.suiteRunning) test_engine_run_next(DA.test.list);
	}
	return true;
}
//#endregion sim

//#region test
function add_a_correct_building_to(fen, uname, type) {
	let ranks = lookupSet(DA, ['test', 'extra', 'ranks'], 'A23456789TJQK');
	if (ranks.length <= 0) {
		console.log('===>ranks empty!', ranks)
		ranks = lookupSetOverride(DA, ['test', 'extra', 'ranks'], 'A23456789TJQK');
	}
	let r = ranks[0]; lookupSetOverride(DA, ['test', 'extra', 'ranks'], ranks.substring(1));
	let keys = [`${r}Sn`, `${r}Hn`, `${r}Cn`, `${r}Dn`];
	if (type != 'farm') keys.push(`${r}Cn`); if (type == 'chateau') keys.push(`${r}Hn`);
	fen.players[uname].buildings[type].push({ list: keys, h: null });
}
function add_a_schwein(fen, uname) {
	let type = rChoose(['farm', 'estate', 'chateau']);
	let keys = deck_deal(fen.deck, type[0] == 'f' ? 4 : type[0] == 'e' ? 5 : 6);
	fen.players[uname].buildings[type].push({ list: keys, h: null });
}
function add_rumors_to_buildings(o) {
	fen = o.fen;
	for (const plname of fen.plorder) {
		let buildings = fen.players[plname].buildings;
		for (const type in buildings) {
			for (const b of buildings[type]) {
				if (type == 'farm') b.h = rCard('n');
				b.rumors = arrFunc(2, () => rCard('r'));
			}
		}
	}
}
function bluff_start_bid(o) {
	let ranks = rChoose(BLUFF.rankstr, 2).map(x => BLUFF.toword[x]);
	let b2 = coin(10) ? '_' : rNumber(1, 4);
	o.fen.lastbid = [rNumber(1, 4), ranks[0], b2, b2 == '_' ? '_' : ranks[1]];
}
function drawcard(key, dParent, sz) {
	let d1;
	let card = ari_get_card(key, sz);
	mAppend(dParent, iDiv(card));
	let d = iDiv(card); mStyle(d, { position: 'relative', margin: 20 });
	let h = sz * .6;
	let w = h / 6.5;
	let left = sz >= 300 ? 7 : sz >= 200 ? 5 : sz >= 100 ? 3 : 3;
	let bottom = sz >= 300 ? 0 : sz >= 200 ? -1 : sz >= 100 ? -2 : -3;
	let matop = (sz - h) / 2;
	let html = `<img height=${sz / 3} src="./base/assets/images/icons/deco0.svg" style="transform:scaleX(-1);">`;
	d1 = mDiv(d, { position: 'absolute', bottom: bottom, left: left, opacity: .5 }, null, html);
	let dt = mDiv(d, { family: 'Algerian' }, null, 'luxury');
	mPlace(dt, 'tc', 0, '50%')
}
function each_hand_of_one(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		pl.hand = [rChoose(['4Hn', '5Hn', 'QHn', 'KHn', 'AHn'])];
		pl.goals['33'] = true; pl.roundgoal = '33';
		pl.journeys.push(['4Hn', '4Sn', '*Hn'], ['5Hn', '5Sn', '*Hn'], ['QHn', 'QSn', '*Hn']);
	}
	fen.players[uplayer].hand = ['4Cn'];
}
function ensure_actions(fen) { fen.actionsCompleted = []; }
function ensure_market(fen, n) { fen.stallSelected = []; deck_add(fen.deck, n - fen.market.length, fen.market); }
function ensure_stall(fen, uplayer, n) { let pl = fen.players[uplayer]; deck_add(fen.deck, n - pl.stall.length, pl.stall); }
function ensure_stallSelected(fen) { if (nundef(fen.stallSelected)) fen.stallSelected = []; }
function fentest_accuse() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	let numplayers = 12;
	let list = jsCopy(Serverdata.users).map(x => x.name);
	let list1 = arrWithout(list, ['mimi', 'felix']);
	console.log('list1', list1)
	let playernames = arrTake(list1, numplayers - 2);
	playernames = ['mimi', 'felix'].concat(playernames);
	startgame('accuse', playernames.map(x => ({ name: x, playmode: ['mimi', 'felix'].includes(x) ? 'human' : 'bot' })), { mode: 'multi' });
}
function fentest_wise() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	let playernames = [U.name, 'felix'];
	startgame('wise', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function fentest0_min_items() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	let pl = fen.players[uplayer];
	[pl.hand, pl.stall, Z.stage, Z.phase] = [['JSn', '2Hn', '3Hn', '3Dn', '3Cn', '4Hn'], ['QSn', 'KHn'], 5, 'king'];
	ensure_actions(fen);
	take_turn_fen();
}
function fentest1_auction() {
	Z.stage = 12;
	Z.phase = 'jack';
	ensure_market(Z.fen, 3);
	take_turn_fen();
}
function fentest10_ferro_end_of_round_goals() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	let pl = fen.players[plorder[0]];
	pl.hand = ['3Hn', '3Hn', '3Hn', '3Hn'];
	pl = fen.players[plorder[1]];
	pl.journeys = [['3Cn', '3Hn', '3Hn', '3Hn']];
	pl.goals['4'] = true;
	pl.hand = ['3Hn', 'KSn'];
	take_turn_fen();
}
function fentest2_accuse() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	let numplayers = 5;
	let list = jsCopy(Serverdata.users).map(x => x.name);
	let list1 = arrWithout(list, ['mimi', 'felix']);
	let playernames = arrTake(list1, numplayers - 2);
	playernames = ['mimi', 'felix'].concat(playernames);
	startgame('accuse', playernames.map(x => ({ name: x, playmode: ['mimi', 'felix'].includes(x) ? 'human' : 'bot' })), { mode: 'hotseat' });
}
function fentest2_build() {
	Z.stage = 5;
	Z.phase = 'king';
	ensure_stall(Z.fen, Z.uplayer, 4);
	ensure_actions(Z.fen);
	take_turn_fen();
}
function fentest3_clear_players() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	take_turn_fen_clear();
}
function fentest4_emptyvotes_add_policies() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	fen.cardsrevealed = true;
	Z.options.empty_vote = 'add policy';
	for (const pld of Z.playerdata) {
		pld.state = { item: '' }
	}
	accuse_evaluate_votes();
}
function fentest4_emptyvotes_no_policies() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	fen.policies = [];
	fen.cardsrevealed = true;
	Z.options.empty_vote = 'add policy';
	for (const pld of Z.playerdata) {
		pld.state = { item: '' }
	}
	accuse_evaluate_votes();
}
function fentest4_emptyvotes_win_policy() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	fen.cardsrevealed = true;
	Z.options.empty_vote = 'win policy';
	for (const pld of Z.playerdata) {
		pld.state = { item: '' }
	}
	accuse_evaluate_votes();
}
function fentest4_visit() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	fen.actionsCompleted = [];
	for (const plname of fen.plorder) {
		add_a_schwein(fen, plname);
	}
	Z.stage = 5;
	Z.phase = 'queen';
	take_turn_fen();
}
function fentest5_consensus() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	fen.cardsrevealed = true;
	Z.options.empty_vote = 'win policy';
	for (const pld of Z.playerdata) {
		let r = rChoose(toLetters(fen.ranks));
		let s = rChoose(toLetters('HD'));
		pld.state = { item: `${r}${s}n` };
	}
	accuse_evaluate_votes();
}
function fentest5_coupdetat() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	fen.cardsrevealed = true;
	Z.options.empty_vote = 'win policy';
	Z.options.consensus = "coupdetat";
	for (const pld of Z.playerdata) {
		let r = 'A'; //all players tied!!!
		let s = rChoose(toLetters('HD'));
		pld.state = { item: `${r}${s}n` };
	}
	accuse_evaluate_votes();
}
function fentest5_coupdetat_maybe() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	fen.cardsrevealed = true;
	for (const pld of Z.playerdata) {
		let r = rChoose(['A', 'Q', 'K', 'J']);
		let s = rChoose(toLetters('HD'));
		pld.state = { item: `${r}${s}n` };
	}
	accuse_evaluate_votes();
}
function fentest5_market_opens() {
	Z.stage = 3;
	Z.phase = 'king';
	take_turn_fen();
}
function fentest5_no_coupdetat() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	fen.cardsrevealed = true;
	Z.options.empty_vote = 'win policy';
	Z.options.consensus = "coupdetat";
	for (const pld of Z.playerdata) {
		let r = 'K'; //all players tied!!!
		let s = rChoose(toLetters('HD'));
		pld.state = { item: `${r}${s}n` };
	}
	accuse_evaluate_votes();
}
function fentest5_tied_consensus() {
	let [game, A, fen, uplayer, plorder] = [Z.game, Z.A, Z.fen, Z.uplayer, Z.plorder];
	fen.cardsrevealed = true;
	Z.options.empty_vote = 'win policy';
	Z.options.consensus = 'policy';
	for (const pld of Z.playerdata) {
		let r = 'Q'; //all players tied!!!
		let s = rChoose(toLetters('HD'));
		pld.state = { item: `${r}${s}n` };
	}
	accuse_evaluate_votes();
}
function fentest6_endgame() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	fen.actionsCompleted = [];
	for (const plname of fen.plorder) {
		add_a_correct_building_to(fen, plname, 'chateau');
		add_a_correct_building_to(fen, plname, rChoose(['farm', 'estate', 'chateau']));
		if (coin()) add_a_correct_building_to(fen, plname, rChoose(['farm', 'estate', 'chateau']));
		fen.actionsCompleted.push(plname);
	}
	fen.pl_gameover = [];
	for (const plname of fen.plorder) {
		let bcorrect = ari_get_correct_buildings(fen.players[plname].buildings);
		let can_end = ari_check_end_condition(bcorrect);
		if (can_end) fen.pl_gameover.push(plname);
	}
	if (isEmpty(fen.pl_gameover)) { console.log('try again!!!!!!!!!!!'); return; }
	Z.stage = 10;
	Z.phase = 'king';
	take_turn_fen(true);
}
function fentest6_start11() { start_game_with_players(11, 'accuse', { stability: 2, rounds: 2, cardtype: 'num', colors: 3 }); }
function fentest6_start14() { start_game_with_players(14); }
function fentest6_start4() { start_game_with_players(4, 'accuse', { stability: 1, cardtype: 'c52', rounds: 1 }); }
function fentest6_start5() { start_game_with_players(5, 'accuse', { stability: 2, cardtype: 'num' }); }
function fentest6_start6() { start_game_with_players(6, 'accuse', { stability: 2, cardtype: 'c52' }); }
function fentest6_start8() { start_game_with_players(8, 'accuse', { stability: 2, cardtype: 'c52' }); }
function fentest7_cards() {
	mClear('dTable');
	dTable = mBy('dTable'); mStyle(dTable, { gap: 10 }); mCenterFlex(dTable);
	for (let i = 0; i < 10; i++) {
		show_number_card(`${rNumber(1, 999)}_${rColor()}`, 100);
	}
}
function fentest7_gameover() {
	let [game, A, fen, uplayer] = [Z.game, Z.A, Z.fen, Z.uplayer];
	if (game == 'aristo') fentest6_endgame();
	else if (game == 'spotit') {
		for (const plname in fen.players) { fen.players[plname].score = Z.options.winning_score - 1; }
		take_turn_fen();
	} else if (game == 'bluff') {
		let pl = fen.players[uplayer];
		while (pl.handsize < Z.options.max_handsize) inc_handsize(fen, uplayer); //.handsize = Z.options.max_handsize; }
		deck_add(fen.deck, 1, pl.hand);
		take_turn_fen();
	}
}
function fentest7_jokers() {
	mClear(dTable);
	for (const k of [0, 1]) {
		let card = accuse_get_card(`${k}Jn`, 140);
		mAppend(dTable, iDiv(card));
		console.log('svg', iDiv(card))
	}
}
function fentest8_ferro_transation_error() {
	let [game, A, fen, uplayer] = [Z.game, Z.A, Z.fen, 'mimi']; //Z.uplayer];
	let pl = fen.players[uplayer];
	pl.goals['3'] = true;
	pl.hand.push('3Hn', '3Hn', '3Hn');
	Z.turn = ['mimi'];
	take_turn_fen();
}
function fentest9_ferro_transation_error() {
	let [game, A, fen, uplayer] = [Z.game, Z.A, Z.fen, 'mimi']; //Z.uplayer];
	let pl = fen.players[uplayer];
	pl.goals['3'] = true;
	pl.goals['4'] = true;
	pl.goals['5'] = true;
	pl.hand = ['3Hn', '3Hn', '3Hn', '2Cn', '2Cn', '2Cn', '*Cn', 'ACn', '*Cn'];
	Z.turn = ['mimi'];
	let other = firstCond(Z.playerlist, x => x != uplayer);
	pl = fen.players[other];
	pl.goals['4'] = true;
	pl.journeys = [['3Hn', '3Hn', '3Hn'], ['AHn', 'ACn', 'ACn', '*Cn']];
	take_turn_fen();
}
function get_building_with_rumor(fen, plname) {
	let buildings = fen.players[plname].buildings;
	for (const type in buildings) {
		let i = 0;
		for (const b of buildings[type]) {
			if (isdef(b.rumors)) {
				b.type = type;
				b.path = `players.${plname}.buildings.${type}.${i}`;
				return b;
			}
			i++;
		}
	}
	return null;
}
function getfen1() {
	let res = {
		"players": {
			"guest": {
				"score": 0,
				"name": "guest",
				"idleft": "JSh",
				"color": "#1e90ff",
				"idright": "JHh",
				"hand": [
					"5Dn",
					"7Sn",
					"5Cn",
					"9Sn",
					"4Dn",
					"7Cn"
				],
				"playmode": "bot",
				"strategy": "random",
				"membership": "8Sn"
			},
			"lauren": {
				"score": 0,
				"name": "lauren",
				"idleft": "JHh",
				"color": "#004054",
				"idright": "KHh",
				"hand": [
					"2Cn",
					"4Sn",
					"6Hn",
					"8Hn",
					"2Sn",
					"9Cn"
				],
				"playmode": "bot",
				"strategy": "random",
				"membership": "3Dn"
			},
			"gul": {
				"score": 0,
				"name": "gul",
				"idleft": "KHh",
				"color": "#6fccc3",
				"idright": "KSh",
				"hand": [
					"TDn",
					"7Dn",
					"8Cn",
					"7Hn",
					"TCn",
					"5Hn"
				],
				"playmode": "bot",
				"strategy": "random",
				"membership": "4Hn"
			},
			"felix": {
				"score": 0,
				"name": "felix",
				"idleft": "KSh",
				"color": "#4363d8",
				"idright": "QHh",
				"hand": [
					"TSn",
					"2Hn",
					"4Cn",
					"5Sn",
					"2Dn"
				],
				"playmode": "human",
				"strategy": "random",
				"membership": "8Dn"
			},
			"mimi": {
				"score": 0,
				"name": "mimi",
				"idleft": "QHh",
				"color": "#76AEEBFF",
				"idright": "JSh",
				"hand": [
					"3Cn",
					"9Hn",
					"3Hn",
					"9Dn",
					"3Sn",
					"THn"
				],
				"playmode": "human",
				"strategy": "random",
				"membership": "6Dn"
			}
		},
		"plorder": [
			"guest",
			"lauren",
			"gul",
			"felix",
			"mimi"
		],
		"history": [
			{
				"title": "*** game start ***",
				"lines": []
			},
			{
				"title": "membership",
				"lines": [
					"mimi 6Dn",
					"felix 8Dn",
					"guest 8Sn",
					"gul 4Hn",
					"lauren 3Dn"
				]
			},
			{
				"title": "poll",
				"lines": [
					"mimi 3Hn",
					"felix 6Sn"
				]
			},
			{
				"title": "president",
				"lines": [
					"felix wins presidency!"
				]
			}
		],
		"rounds": 1,
		"stability": 2,
		"deck_identities": [
			"QSh"
		],
		"phase": "1",
		"stage": "president",
		"step": 0,
		"turn": [
			"felix"
		],
		"deck_discard": [
			"6Sn"
		],
		"deck_ballots": [
			"6Cn"
		],
		"handsize": 7,
		"policies": [],
		"validvoters": [
			"felix",
			"mimi"
		],
		"round": 1,
		"cardsrevealed": true,
		"president": "felix",
		"isprovisional": false
	}
	return res;
}
function give_each_jolly_group(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		pl.journeys.push(['4Hn', '4Sn', '*Hn']);
		pl.goals['3'] = true; pl.roundgoal = '3';
	}
	fen.players[uplayer].hand.push('4Cn');
}
function give_one_player_0_coins(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let otherplayer = firstCond(fen.plorder, (p) => p != uplayer);
	let pl = fen.players[otherplayer];
	pl.coins = 0;
}
function give_other_blackmailed_building(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let b1 = stage_building(fen, 1, 'farm'); b1.rumors = ['KHr'];
	b1.isblackmailed = true;
	set_queen_phase(o);
}
function give_other_jolly_group(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let otherplayer = firstCond(fen.plorder, (p) => p != uplayer);
	let pl = fen.players[otherplayer];
	pl.journeys.push(['2Hn', '2Sn', '*Hn']);
	pl.goals['3'] = true; pl.roundgoal = '3';
	fen.players[uplayer].hand.push('2Cn');
}
function give_other_jolly_sequence(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let otherplayer = firstCond(fen.plorder, (p) => p != uplayer);
	let pl = fen.players[otherplayer];
	pl.journeys.push(['KHn', 'AHn', '*Hn', '3Hn', '4Hn', '5Hn', '6Hn']);
	pl.goals['7R'] = true; pl.roundgoal = '7R';
	fen.players[uplayer].hand.push('2Hn', '5Hn', 'JHn', 'QHn');
}
function give_other_various_buildings(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let other = firstCond(o.fen.plorder, (p) => p != uplayer);
	return give_various_buildings_to(o, other);
}
function give_player_7R(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.hand = ['7Cn', '8Cn', 'TCn', 'JCn', 'QCn', 'KCn', 'ACn', '*Hn', '8Cn', '2Hn', '2Sn', '2Hn'];
	let otherplayer = firstCond(fen.plorder, (p) => p != uplayer);
	let plother = fen.players[otherplayer];
	plother.hand.unshift('9Cn', '2Sn', '2Hn', '6Cn', '5Cn');
}
function give_player_achieve_5(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.hand = ['6Hn', '6Hn', '6Hn', '6Hn', '*Hn', '4Cn', '4Cn', '4Cn', '3Dn', '3Dn', '2Sn', 'KHn', 'QSn'];
	for (const plname of fen.plorder) {
		if (plname == uplayer) continue;
		let pl1 = fen.players[plname];
		pl1.journeys = [['2Cn', '2Hn', '*Hn']];
	}
}
function give_player_group(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.journeys = [['2Hn', '2Sn', '2Hn']];
}
function give_player_hand_group(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.hand = ['2Hn', '2Sn', '2Hn', '3Hn', '3Sn', '3Hn', '4Hn', '4Sn', '*Hn'];
}
function give_player_hand_groups(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.hand = ['2Hn', '2Hn', '2Sn', '2Cn', '3Sn', '3Hn', '4Hn', '4Sn', '*Hn'];
}
function give_player_jolly(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.hand.push('*Hn');
}
function give_player_jolly_sequence(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.journeys.push(['KHn', 'AHn', '*Hn', '3Hn', '4Hn', '5Hn', '6Hn']);
	pl.goals['7R'] = true; pl.roundgoal = '7R';
	fen.players[uplayer].hand.push('2Hn', 'JHn', 'QHn');
}
function give_player_king(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	fen.players[uplayer].hand.push('KHn');
}
function give_player_luxury_cards(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	fen.players[uplayer].hand.push('AHl', 'AHl', 'AHl');
}
function give_player_multiple_commission_cards(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.hand.push('QCn', 'QHn');
	pl.stall.push('QDn', 'QSn');
	pl.commissions.push('QCc');
}
function give_player_one_ferro_set(o) {
	o.fen.players[o.fen.turn[0]].hand = ['*Hn', 'KHn', 'KCn'];
}
function give_player_only_4_cards(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	fen.players[uplayer].hand = ['AHn', 'AHn'];
	fen.players[uplayer].stall = ['ACn', 'ASn'];
}
function give_player_only_one_card(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.hand = ['4Hn'];
}
function give_player_queen(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	fen.players[uplayer].hand.push('QHn');
}
function give_player_sequence(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let pl = fen.players[uplayer];
	pl.hand = ['2Sn', '3Sn', '4Sn', '5Sn', '6Sn', '7Sn', '8Sn', '9Sn', 'ASn'];
}
function give_player_two_ferro_sets(o) {
	o.fen.players[o.fen.turn[0]].hand = ['*Hn', 'KHn', 'KCn', 'QHn', 'QCn', 'QDn'];
}
function give_player_various_buildings(o) {
	let plname = o.fen.turn[0];
	return give_various_buildings_to(o, plname);
}
function give_players_buildings(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	stage_correct_buildings(fen, { mimi: { estate: 1 }, amanda: { chateau: 1 } });
	fen.stage = 5;
	fen.phase = 'king';
}
function give_players_buildings_plus(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let di = {};
	for (const plname of fen.plorder) { di[plname] = { estate: 1, farm: 1, chateau: 1 }; }
	stage_correct_buildings(fen, di);
	ari_add_harvest_cards(fen);
	fen.stage = o.stage = 5;
	fen.phase = 'king';
}
function give_players_empty_stalls(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let n = rChoose([2, 3]);
	fen.market = deck_deal(fen.deck, 2);
	fen.stage = 4, fen.actionsCompleted = [], fen.stallSelected = jsCopy(fen.plorder);
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		pl.stall = [];
		pl.stall_value = 0;
	}
}
function give_players_hand_A2(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		pl.hand = ['ACn', '2Cn', '3Cn', '5Hn', '7Hn', '7Sn', '7Cn', '7Dn'];
	}
	[fen.stage, fen.turn] = set_journey_or_stall_stage(fen, o.options, fen.phase);
}
function give_players_hand_journey(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		arrExtend(pl.hand, ['ACn', '2Cn', '3Cn']);
	}
}
function give_players_schwein(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	for (let i = 0; i < fen.plorder.length; i++) {
		let b = stage_building(fen, i, 'farm');
		b.h = 'KHn';
		b.schweine = [2];
		let b1 = stage_building(fen, i, 'estate');
	}
	[fen.turn, fen.stage] = [[uplayer], 5];
	fen.phase = 'king';
}
function give_players_schwein_old(o, isOpen = true) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let b = stage_building(fen, 1, 'farm');
	b.h = 'KHn';
	if (isOpen) b.schweine = [b.list[2]];
	fen.stage = 5;
	fen.phase = 'king';
}
function give_players_schweine_variety(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let b = stage_building_new(fen, 1, 'farm', 1, 1);
	b = stage_building_new(fen, 1, 'farm', 1, 0);
	b = stage_building_new(fen, 1, 'farm', 0, 0);
	b = stage_building_new(fen, 1, 'farm', 0, 1);
	b = stage_building_new(fen, 1, 'farm', 0, 2);
	b = stage_building(fen, 0, 'farm'); b.h = 'KHn'; b.schweine = [2];
	[fen.turn, fen.stage] = [[uplayer], 5];
	fen.phase = 'king';
}
function give_players_stalls(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let n = rChoose([2, 3]);
	fen.market = deck_deal(fen.deck, 2);
	fen.stage = 4, fen.actionsCompleted = [], fen.stallSelected = jsCopy(fen.plorder);
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		for (let i = 0; i < n; i++)	top_elem_from_to(pl.hand, pl.stall);
		pl.stall_value = calc_stall_value(fen, plname);
	}
}
function give_various_buildings_to(o, plname) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let i = fen.plorder.indexOf(plname);
	let b1 = stage_building(fen, i, 'farm'); b1.rumors = ['KHr'];
	let b2 = stage_building(fen, i, 'farm');
	let lead = b2.lead; //console.log('lead', lead);
	b2.rumors = ['4Cr', `${lead[0]}Cr`];
	let b3 = stage_building(fen, i, 'farm');
	return plname;
}
function landing() { if (isdef(DA.landing)) DA.landing(); } //onclick_by_rank(); } //show_strategy_popup(); } //onclick_random(); }//show_history_popup(); }
function ltest_aristo_simple() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'gul', 'amanda', 'lauren']; //, 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { commission: 'no' });
}
function ltest0_card() { let c = ari_get_card('QSn'); mAppend(dTable, iDiv(c)); }
function ltest1_card() { let c = cLandscape(dTable, { margin: 12 }); }
function ltest10_ferro_sim() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_one_player_0_coins], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.auto_moves = [['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'felix', playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest100_auction() {
	TESTING = true; DA.testing = true; DA.test = { mods: [set_auction_phase], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat', commission: 'no', rumors: 'no' });
}
function ltest101_commission() {
	TESTING = true; DA.testing = true; DA.test = { mods: [set_queen_phase, give_player_multiple_commission_cards], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat', commission: 'yes', rumors: 'no' });
}
function ltest102_luxurycard() {
	let dTable = mBy('dTable'); clearElement(dTable); mStyle(dTable, { hmin: 400 });
	drawcard('AHl', dTable, 300);
	drawcard('AHl', dTable, 200);
	drawcard('AHl', dTable, 100);
}
function ltest103_aristo_journey() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_luxury_cards], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat', commission: 'no', rumors: 'no' });
}
function ltest105_aristo_church() {
	TESTING = true; DA.testing = true;
	DA.test = { mods: [give_players_stalls, make_church], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest106_aristo_build() {
	TESTING = true; DA.testing = true; DA.test = { mods: [set_king_phase, give_player_only_4_cards], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest107_aristo_build() {
	TESTING = true; DA.testing = true; DA.test = { mods: [set_king_phase, give_players_schweine_variety], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })));
}
function ltest107_aristo_inspect_schwein() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_schwein, set_queen_phase], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	let playernames = [U.name, 'felix'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest108_animate_coin() {
	TESTING = true; DA.testing = true; DA.test = { mods: [set_king_phase, give_players_schweine_variety], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	let playernames = [U.name, 'felix'];
	DA.landing = () => {
		d = UI.player_stat_items[Z.uplayer].dCoin;
		anim1(d);
	};
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest108_aristo_inspect_schwein() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_schweine_variety, set_queen_phase], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	let playernames = [U.name, 'felix'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest109_ferro() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_achieve_5], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];
	let playernames = ['mimi', 'felix', 'gul'];//, 'amanda', 'lauren', 'valerie', 'guest', 'nimble', 'sheeba', 'sarah']; //, 'gul', 'amanda', 'lauren'];
	startgame('ferro', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest109_spotit() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	let playernames = [U.name, 'felix'];
	startgame('spotit', playernames.map(x => ({ name: x, playmode: 'human' })), {});
}
function ltest11_ferro_discard() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { console.log('discard:', Z.fen.deck_discard); }
	DA.auto_moves = [['random'], [1], [1], ['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest110_auction() {
	TESTING = true; DA.testing = true; DA.test = { mods: [set_auction_phase], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat', commission: 'no', rumors: 'no' });
}
function ltest110_fritz() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'amanda', 'lauren'];
	startgame('fritz', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest111_start() {
	show_home_logo();
	if (nundef(U)) { show_users(); return; } show_username();
	if (DA.TEST0) show('dTestButtons');
}
function ltest12_ferro_buy() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { console.log('discard:', Z.fen.deck_discard); }
	DA.auto_moves = [['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest2_card() {
	let c = cPortrait(dTable, { margin: 12, border: 'solid 4px lime', bg: 'lightgreen' });
	let d = iDiv(c);
	console.log('d', d)
	let ds = mSym('red apple', d, { sz: 30 }, 'tl');
	ds = mSymText(2, d, { sz: 25, rounding: '50%', bg: 'gold', margin: 3 }, 'tr');
	ds = mText('APPLES', d, { family: 'Algerian', w: '100%', fz: 12, align: 'center', position: 'absolute', bottom: 0 });//mPlace(ds,'tc',0,8)
	ds = mSymText(2, d, { sz: 25, rounding: '50%', bg: 'crimson', margin: 3 }, 'br');
	ds = mSym('green apple', d, { sz: 70 }, 'cc');
}
function ltest20_spotit_adaptive() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { console.log('discard:', Z.fen); }
	DA.auto_moves = [];
	startgame('spotit', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest21_spotit() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { console.log('discard:', Z.fen); }
	DA.auto_moves = [];
	startgame('spotit', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat', adaptive: false });
}
function ltest22_ferro_action1() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest23_aristo_building_downgrade() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_buildings], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest24_ferro_jolly() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [give_other_jolly_group], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest25_ferro_jolly() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [give_each_jolly_group], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest26_ferro_endgame() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [each_hand_of_one], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest27_ferro_commands() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [['random']];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest28_ferro_jolly_complex() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [give_other_jolly_group], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest29_ferro_play() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_hand_group, o => o.round = 2], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [[0, 1, 2], [1]];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest3_card() {
	let di = SHERIFF.cards;
	for (const name in di) {
		let c = sheriff_card(name); //, color); 
		mAppend(dTable, iDiv(c));
	}
}
function ltest30_ferro_jolly_jolly() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [give_each_jolly_group, give_player_jolly], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest31_ferro_rollback() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [small_hands, give_other_jolly_group, o => o.round = 1], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest32_select_error() {
	DA.magnify_on_select = true; // *** NEW! ***
	TESTING = true; DA.testing = true; DA.test = { mods: [small_hands, give_other_jolly_group, o => o.round = 4], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => ferro_transaction_error(['44', '5', '55', '7R'], ['jolly', 'anlegen'], 'take_turn_single');
	DA.auto_moves = [];//[['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest33_ferro_sequence() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_sequence, give_other_jolly_group, o => o.round = 1], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [[2, 3, 6, 9, 10, 11, 12]];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest34_ferro_anlegen() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [give_other_jolly_group, o => o.round = 1], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [[0, 14]];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest35_ferro_sequence_anlegen() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [give_other_jolly_sequence, o => o.round = 1], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest36_ferro_two_sequence() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_jolly_sequence, give_player_sequence, o => o.round = 1], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [[0, 1, 2, 3, 4, 5, 6, 7, 8]];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest37_ferro_4_players() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }, { name: 'felix', playmode: 'human' }, { name: 'gul', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest38_ferro_end_of_round() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_group, give_player_only_one_card], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'nasi', playmode: 'human' }, { name: 'felix', playmode: 'human' }, { name: 'gul', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest39_ferro_7R() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_7R], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [[0, 1, 2, 3, 4, 5, 6, 7]];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }, { name: 'felix', playmode: 'human' }, { name: 'gul', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest4_sheriff() {
	let di = SHERIFF.cards;
	for (const name in di) { let c = sheriff_card(name); mAppend(dTable, iDiv(c)); }
}
function ltest40_ferro_7R_anlegen() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_7R], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [[0, 1, 2, 3, 4, 5, 6, 7]];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }, { name: 'felix', playmode: 'human' }, { name: 'gul', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest41_frenzy_DD() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('fritz', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest42_aristo() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest43_fritz_discard_pile() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [make_deck_discard], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('fritz', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest44_ferro_7R() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_7R], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = []; //[0, 1, 2, 3, 4, 5, 6]];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }, { name: 'felix', playmode: 'human' }, { name: 'gul', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest45_fritz() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('fritz', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest46_fritz_endgame() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = {
		mods: [o => { let pl = o.fen.players[o.fen.turn[0]].hand = ['4Hn', '2Cn', '3Cn']; }], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0]
	};
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('fritz', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest47_aristo() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest48_aristo_church() {
	TESTING = true; DA.testing = true; DA.test = {
		mods: [give_players_stalls], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0]
	};
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest49_aristo_church() {
	TESTING = true; DA.testing = true; DA.test = {
		mods: [give_players_stalls, make_church, set_player_tithes], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0]
	};
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest5_jokerhtml() {
	let html = `
		<div style="position: absolute; top: 0px; left: 0px; width: 200px; height: 300px; background: blue">
			HALLLLLLLLLLLLLLLLLLLLOOOOOOOOOOOOOOOOOOO
			<!-- joker svg orig -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				class="card"
				face="0J"
				height="100%"
				preserveAspectRatio="none"
				viewBox="-120 -168 240 336"
				width="100%"
			>
				<symbol id="J11" preserveAspectRatio="none" viewBox="0 0 1300 2000">
					<path fill="#FC4" d="M1095,1000A445,445 0 0 1 650,1445 445,445 0 0 1 205,1000 445,445 0 0 1 650,555 445,445 0 0 1 1095,1000Z"></path>
				</symbol>
				<symbol id="J12" preserveAspectRatio="none" viewBox="0 0 1300 2000">
					<path
						fill="red"
						d="M317.05664,1294.416 100,1620l220,-60 40,240 140,-200 160,200 40,-200 180,180 60,-220 260,60 -236.67969,-304.3027A445,445 0 0 1 650,1445 445,445 0 0 1 317.05664,1294.416ZM831.71484,249.10742C687.94378,262.65874 542.4812,256.33752 420,520 369.08062,331.38331 278.61481,370.61289 187.77148,412.01367a75,75 0 0 1 2.52344,19.12695 75,75 0 0 1 -16.78515,47.19532c66.827,55.25537 117.57478,127.8247 155.77539,213.90429A445,445 0 0 1 650,555 445,445 0 0 1 924.33984,650.26562c42.39917,-50.4556 91.60026,-93.34711 167.51176,-106.5332a75,75 0 0 1 -0.6524,-9.14258 75,75 0 0 1 14.6172,-44.3457C1026.3517,437.47479 931.12146,446.83238 840,440 761.98041,388.07638 804.10248,338.17898 853.51758,288.4043a75,75 0 0 1 -21.80274,-39.29688z"
					></path>
				</symbol>
				<symbol id="J13" preserveAspectRatio="none" viewBox="0 0 1300 2000">
					<path
						fill="#44F"
						d="M879.65521,937.6026a40,40 0 0 1 -40,40 40,40 0 0 1 -40,-40 40,40 0 0 1 40,-40 40,40 0 0 1 40,40zm-379.31039,0a40,40 0 0 1 -40,40 40,40 0 0 1 -40,-40 40,40 0 0 1 40,-40 40,40 0 0 1 40,40z"
					></path>
				</symbol>
				<symbol id="J14" preserveAspectRatio="none" viewBox="0 0 1300 2000">
					<path
						stroke="#44F"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="6"
						fill="none"
						d="M317.05664,1294.416 100,1620l220,-60 40,240 140,-200 160,200 40,-200 180,180 60,-220 260,60 -236.67969,-304.3027M1241.1987,534.58948a75,75 0 0 1 -75,75 75,75 0 0 1 -75,-75 75,75 0 0 1 75,-75 75,75 0 0 1 75,75zM980.11493,234.09686a75,75 0 0 1 -75,75 75,75 0 0 1 -75,-75 75,75 0 0 1 75,-75 75,75 0 0 1 75,75zM190.29556,431.1412a75,75 0 0 1 -75,75 75,75 0 0 1 -74.999997,-75 75,75 0 0 1 74.999997,-75 75,75 0 0 1 75,75zM924.3457,650.27148c42.40088,-50.45397 91.5936,-93.35356 167.5059,-106.53906 -0.4037,-3.03138 -0.6215,-6.0846 -0.6524,-9.14258 0.03,-15.96068 5.1503,-31.4957 14.6172,-44.3457C1026.3517,437.47479 931.12146,446.83238 840,440 761.98041,388.07638 804.10248,338.17898 853.51758,288.4043 842.40414,277.84182 834.79487,264.12701 831.71484,249.10742 687.94378,262.65874 542.4812,256.33752 420,520 369.08062,331.38331 278.61481,370.61289 187.77148,412.01367c1.66108,6.24042 2.50924,12.66925 2.52344,19.12695 -0.0209,17.1896 -5.94587,33.85038 -16.7832,47.19336 66.82714,55.25532 117.5686,127.8306 155.76953,213.91016M384.88867,1140c51.89013,98.343 153.91815,159.9189 265.11133,160 111.19809,-0.076 213.23257,-61.6527 265.125,-160M1095,1000A445,445 0 0 1 650,1445 445,445 0 0 1 205,1000 445,445 0 0 1 650,555 445,445 0 0 1 1095,1000Z"
					></path>
				</symbol>
				<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
				<text x="-110" y="-115" fill="red" stroke="red" style="font:bold 60px sans-serif">*</text>
				<use width="202.8" height="312" x="-101.4" y="-156" xlink:href="#J11"></use>
				<use width="202.8" height="312" x="-101.4" y="-156" xlink:href="#J12"></use>
				<use width="202.8" height="312" x="-101.4" y="-156" xlink:href="#J13"></use>
				<use width="202.8" height="312" x="-101.4" y="-156" xlink:href="#J14"></use>
			</svg>
		</div>
	`;
	document.body.appendChild(mCreateFrom(html));
}
function ltest50_aristo_church() {
	TESTING = true; DA.testing = true; DA.test = {
		mods: [give_players_stalls, make_church], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0]
	};
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest51_aristo_church_downgrade() {
	TESTING = true; DA.testing = true; DA.test = {
		mods: [give_players_stalls, prep_for_church_downgrade], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0]
	};
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest52_aristo_church_empty() {
	TESTING = true; DA.testing = true; DA.test = {
		mods: [give_players_empty_stalls], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0]
	};
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest53_fritz_endround() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = {
		mods: [o => { let pl = o.fen.players[o.fen.turn[0]].hand = ['4Hn']; }], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0]
	};
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('fritz', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest54_fritz_outoftime() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = {
		mods: [make_both_run_out_of_time], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0]
	};
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('fritz', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest55_fritz_set_with_same_suits() {
	DA.magnify_on_select = true;
	TESTING = true; DA.testing = true; DA.test = {
		mods: [give_player_hand_groups], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0]
	};
	DA.test.end = () => { };
	DA.auto_moves = [];
	startgame('fritz', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest56_algo_overlapping_sets() {
	let cards = ['2Hn', '3Hn', '4Hn', '5Hn', '6Hn', '7Hn', '7Cn', '7Dn', '7Hn'].map(x => fritz_get_card(x));
	let res = is_overlapping_set(cards, 1, 3, false); //ok
	console.log('res:', res);
	res = is_overlapping_set(['2Hn', '3Hn', '4Hn', '3Hn', '2Hn'].map(x => fritz_get_card(x)), 1, 3, false); //ok
	console.log('res:', res);
	res = is_overlapping_set(['2Hn', '3Hn', '4Hn', '3Hn'].map(x => fritz_get_card(x)), 1, 3, false); //false ok
	console.log('res:', res);
	res = is_overlapping_set(['2Hn', '3Hn', '3Hn', '3Cn'].map(x => fritz_get_card(x)), 1, 3, false); //false ok
	console.log('res:', res);
	res = is_overlapping_set(['2Hn', '3Hn', '4Hn', '5Hn', '5Cn', '5Dn', '5Cn', '5Hn'].map(x => fritz_get_card(x)), 1, 3, false); //ok
	console.log('res:', res);
	res = is_overlapping_set(['2Hn', '3Hn', '4Hn', '5Hn', '5Cn', '5Cn', '5Cn', '5Hn', '6Hn', '7Hn'].map(x => fritz_get_card(x)), 1, 3, false); //false ok
	console.log('res:', res);
	res = is_overlapping_set(['2Hn', '*Hn', '2Cn', '3Hn', '4Cn'].map(x => fritz_get_card(x)), 1, 3, false);
	console.log('res:', res);
	res = is_overlapping_set(['2Hn', '*Hn', '2Cn', '3Cn', '4Cn'].map(x => fritz_get_card(x)), 1, 3, false);
	console.log('res:', res);
	res = is_overlapping_set(['4Hn', '3Hn', '2Hn', '2Cn', '2Sn', '3Sn', '4Sn'].map(x => fritz_get_card(x)), 1, 3, false); //ok
	console.log('res:', res);
	res = is_overlapping_set(['4Hn', '3Hn'].map(x => fritz_get_card(x)), 1, 3, false); //ok FEHLER!!!
	console.log('res:', res);
	res = is_overlapping_set(['4Hn'].map(x => fritz_get_card(x)), 1, 3, false); //ok FEHLER!!!
	console.log('res:', res);
}
function ltest57_aristo() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest58_aristo_building_rumor_harvest() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_buildings_plus, add_rumors_to_buildings, give_player_queen], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest59_arrTakeLast() {
	let x = arrTakeLast([0, 1, 2, 3, 4, 5], 3, 2); console.log('x', x);
	x = arrTakeLast({ blue: 1, red: 2, green: 3 }, 2, 2); console.log('x', x);
	x = arrTakeLast([0, 1, 2, 3, 4, 5], 10, 0); console.log('x', x);
}
function ltest6_bluff_skin() {
	startgame('bluff', [{ name: 'valerie', playmode: 'human' }, { name: 'felix', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest60_aristo_inspect_schwein() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_schwein, add_rumors_to_buildings], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest61_aristo_inspect_correct() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_buildings, add_rumors_to_buildings], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest62_aristo_inspect_closed_schwein() {
	TESTING = true; DA.testing = true; DA.test = { mods: [x => give_players_schwein(x, false), add_rumors_to_buildings], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest63_aristo_blackmail() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_other_various_buildings, set_queen_phase], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest64_aristo_blackmailed_building() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_other_blackmailed_building], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest65_stamp() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest66_stamp_style() {
	dTable = mBy('dTable'); mClass('dTexture', 'wood'); mCenterFlex(dTable);
	let hand = ['2Hn', '3Hn', '4Hn', '5Hn', '6Hn', '7Hn', '8Hn', '9Hn', 'THn', 'JHn', 'QHn', 'KHn', 'AHn'];
	let ui = ui_type_hand(hand, dTable);
	mStamp(ui.container, 'blackmail');
}
function ltest67_aristo_blackmail_owner() {
	TESTING = true; DA.testing = true; DA.test = { mods: [set_blackmail_owner_stage], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest68_aristo_blackmail_owner_defend() {
	TESTING = true; DA.testing = true; DA.test = { mods: [set_blackmail_owner_stage_defend], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	startgame('aristo', [{ name: U.name, playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest69_ferro_is_group() {
	let j = ['*Hn', '8Dn', '8Hn'];
	let x = is_group(j);
	console.log('is_group', x);
	j = ['8Hn', '*Dn', '8Hn'];
	x = is_group(j);
	console.log('is_group', x);
}
function ltest7_ferro_skin() {
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'felix', playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest70_aristo_church() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_stalls, make_church], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'leo', 'gul']; //, 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest71_ferro() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'leo', 'gul']; //, 'gul', 'amanda', 'lauren'];
	startgame('ferro', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest72_ferro() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'gul', 'amanda', 'lauren', 'valerie', 'guest', 'nimble', 'sheeba', 'sarah']; //, 'gul', 'amanda', 'lauren'];
	startgame('ferro', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest73_ferro_deck_empty() {
	TESTING = true; DA.testing = true; DA.test = { mods: [make_deck_empty], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'gul', 'amanda', 'lauren', 'valerie', 'guest', 'nimble', 'sheeba', 'sarah']; //, 'gul', 'amanda', 'lauren'];
	startgame('ferro', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest74_ferro_scroll_history() {
	TESTING = true; DA.testing = true; DA.test = { mods: [make_long_history], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = ['mimi', 'felix', 'gul', 'amanda', 'lauren', 'valerie', 'guest', 'nimble', 'sheeba', 'sarah']; //, 'gul', 'amanda', 'lauren'];
	startgame('ferro', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest75_ferro_multi() {
	TESTING = true; DA.testing = true; DA.test = { mods: [make_long_history], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [['random']];//[['random']];
	let playernames = ['mimi', 'felix', 'gul', 'amanda', 'lauren', 'valerie', 'guest', 'nimble', 'sheeba', 'sarah']; //, 'gul', 'amanda', 'lauren'];
	startgame('ferro', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'multi' });
}
function ltest76_aristo_multi() {
	TESTING = true; DA.testing = true; DA.test = { mods: [make_long_history], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = ['mimi', 'felix', 'gul'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'multi', rumors: 'no', commission: 'no', journey: 'no' });
}
function ltest77_aristo_church() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_stalls, make_church], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'leo', 'gul']; //, 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest78_aristo_church() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_stalls, make_church], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [['random'], ['random']];
	let playernames = [U.name, 'felix']; //, 'gul', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest79_bluff_multi() {
	TESTING = true; DA.testing = true; DA.test = { mods: [make_long_history], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = ['mimi', 'felix']; //, 'gul', 'amanda', 'lauren'];
	startgame('bluff', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'multi' });
}
function ltest8_ferro_sim() {
	TESTING = true; DA.testing = true; DA.test = { iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.auto_moves = [['last']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'felix', playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest80_fritz_multi() {
	TESTING = true; DA.testing = true; DA.test = { mods: [make_long_history], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = ['mimi', 'felix']; //, 'gul', 'amanda', 'lauren'];
	startgame('fritz', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'multi' });
}
function ltest81_spotit_multi() {
	TESTING = true; DA.testing = true; DA.test = { mods: [make_long_history], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = ['mimi', 'felix']; //, 'gul', 'amanda', 'lauren'];
	startgame('spotit', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'multi' });
}
function ltest82_ferro() {
	TESTING = true; DA.testing = true; DA.test = { mods: [make_long_history], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];
	let playernames = ['mimi', 'felix', 'gul'];//, 'amanda', 'lauren', 'valerie', 'guest', 'nimble', 'sheeba', 'sarah']; //, 'gul', 'amanda', 'lauren'];
	startgame('ferro', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest83_ferro_multi() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = ['mimi', 'felix']; //, 'gul', 'amanda']; //, 'lauren', 'valerie', 'guest', 'nimble', 'sheeba', 'sarah']; //, 'gul', 'amanda', 'lauren'];
	startgame('ferro', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'multi' });
}
function ltest83_svg() {
	dTable = mBy('dTexture'); mCenterFlex(dTable); mStyle(dTable, { hmin: 500 }); mClass(dTable, 'wood');
	mStyle(dTable, { gap: 10 });
	let card;
	card = cBlankSvg(dTable);
	console.log('card', card); //mClass(iDiv(card),'hoverScale')
	let g = iG(card); //console.log('g', g);
	let x = mgSuit('Pik'); //console.log('x', x);
	mgSize(x, 40);
	mgPos(card, x); //,50,50);
}
function ltest84_svg() {
	let dTable = mBy('dTable'); clearElement(dTable); mStyle(dTable, { hmin: 400 })
	let card = cBlank(dTable); let d = iDiv(card); let sz = card.h / 6;
	let i = 0;
	for (let suit of ['H', 'S', 'D', 'C']) {
		let s1 = mSuit(suit, d, { w: sz, h: sz }); //console.log('s1', s1);
		mPos(s1, sz * i, 0); i++;
	}
}
function ltest85_card_short_text() {
	let dTable = mBy('dTable'); clearElement(dTable); mStyle(dTable, { hmin: 400 });
	let ckey = 'KCn';
	let sz = 20;
	let d = mDiv(dTable, {}, null, `hallo das ist ein ${mCardText(ckey)}.`);
	return;
}
function ltest86_ferro() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_player_two_ferro_sets, make_long_history], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];
	let playernames = ['mimi', 'felix', 'gul'];//, 'amanda', 'lauren', 'valerie', 'guest', 'nimble', 'sheeba', 'sarah']; //, 'gul', 'amanda', 'lauren'];
	startgame('ferro', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest87_aristo() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest88_aristo_market() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_stalls], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest89_aristo_journey() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat', commission: 'no', rumors: 'no' });
}
function ltest9_ferro_sim() {
	TESTING = true; DA.testing = true; DA.test = { iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.auto_moves = [['random']];
	startgame('ferro', [{ name: U.name, playmode: 'human' }, { name: 'felix', playmode: 'human' }, { name: 'amanda', playmode: 'human' }], { mode: 'hotseat' });
}
function ltest90_bluff() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'amanda', 'lauren'];
	startgame('bluff', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest90_bluff_ueberbiete() {
	TESTING = true; DA.testing = true; DA.test = { mods: [bluff_start_bid], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'amanda', 'lauren'];
	startgame('bluff', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest91_bluff_strategy() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = ['mimi', 'lauren', 'felix'];
	let playmodes = ['human', 'bot', 'bot'];
	let strategy = ['', 'random', 'clairvoyant'];
	let i = 0; let players = playernames.map(x => ({ name: x, strategy: strategy[i], playmode: playmodes[i++] }));
	let options = { mode: 'hotseat' };
	startgame('bluff', players, options);
}
function ltest92_bluff_bots() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = ['mimi', 'lauren', 'felix'];
	let playmodes = ['bot', 'bot', 'bot'];
	let strategy = ['random', 'perfect', 'clairvoyant'];
	let i = 0; let players = playernames.map(x => ({ name: x, strategy: strategy[i], playmode: playmodes[i++] }));
	let options = { mode: 'hotseat' };
	startgame('bluff', players, options);
}
function ltest93_bluff() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'amanda', 'lauren'];
	startgame('bluff', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest94_aristo_journey() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_hand_journey], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat', commission: 'no', rumors: 'no' });
}
function ltest95_aristo_rumor_action() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_buildings_plus, set_queen_phase, give_player_king], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat' });
}
function ltest96_aristo_visit() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_schwein, set_queen_phase, give_player_queen], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix', 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat', commission: 'no', rumors: 'no' });
}
function ltest97_find_sequences() {
	let x = follows_in_rank('ACn', '2Cn', 'A23456789TJQK');
	console.log('follows', x);
	x = find_sequences(['ACn', '2Cn', '3Hn', '5Hn', '7Hn', '7Sn', '7Cn', '7Dn'], 2, 'A23456789TJQK');
	console.log('follows', x);
}
function ltest98_weired_blatt_aendern() {
	TESTING = true; DA.testing = true; DA.test = { mods: [give_players_hand_A2], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'amanda', 'lauren'];
	startgame('aristo', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat', commission: 'no', rumors: 'no' });
}
function ltest99_fritz() {
	TESTING = true; DA.testing = true; DA.test = { mods: [], iter: 0, maxiter: 200, running: false, step: true, suiteRunning: false, number: 0, list: [0] };
	DA.test.end = () => { }; //console.log('discard:',Z.fen.deck_discard);}
	DA.auto_moves = [];//[['random']];
	let playernames = [U.name, 'felix']; //, 'amanda', 'lauren'];
	startgame('fritz', playernames.map(x => ({ name: x, playmode: 'human' })), { mode: 'hotseat', commission: 'no', rumors: 'no' });
}
function make_both_run_out_of_time(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		pl.time_left = 100;
	}
}
function make_church(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	fen.stage = 1004;
	fen.market = ['JHn', 'QSn'];
}
function make_deck_discard(o) {
	let fen = o.fen;
	let uplayer = o.uplayer;
	fen.deck_discard = ['2Sn', '3Sn', '4Sn', '5Sn', '6Sn', '7Sn', '8Sn', '9Sn', 'TSn'];
	fen.journeys = [['2Dn', '3Dn', '4Dn'], ['5Sn', '6Sn', '7Sn']];
}
function make_deck_empty(o) {
	let fen = o.fen;
	fen.deck_discard = fen.deck;
	output_arr_short(fen.deck);
	fen.deck = [];
}
function make_long_history(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	fen.history = [];
	for (let i = 0; i < 100; i++) {
		let lines = [`${rChoose(get_keys(fen.players))} discards ${rCard()}`];
		let title = 'discard';
		fen.history.push({ title: title, lines: lines });
	}
}
function prep_for_church_downgrade(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	fen.stage = 1004;
	fen.market = ['JHn', 'QSn'];
	let ob = {}; ob[uplayer] = { estate: 1 }; stage_correct_buildings(fen, ob);
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		pl.hand = ['JHn', 'QSn']; pl.stall = ['JHn', 'QSn'];
		if (plname == uplayer) {
			pl.hand = ['2Hn', '2Sn']; pl.stall = ['AHn', 'ASn'];
		}
	}
}
function set_auction_phase(o) {
	fen = o.fen;
	fen.phase = o.phase = 'jack';
	fen.turn = [fen.plorder[0]];
	fen.stage = 12;
	ensure_market(fen, 3);
}
function set_blackmail_owner_stage(o) {
	set_queen_phase(o); //hier wird manchmal trn geaendert!!!
	let fen = o.fen;
	let uplayer = fen.turn[0];
	console.log('blackmailed is', uplayer)
	give_various_buildings_to(o, uplayer);
	let other = firstCond(fen.plorder, (p) => p != uplayer);
	let building = get_building_with_rumor(o.fen, uplayer);
	let payment = { o: null, a: 'coin', key: 'coin', friendly: 'coin', path: null };
	fen.blackmail = { blackmailer: other, blackmailed: uplayer, payment: payment, building_path: building.path };
	building.isblackmailed = true;
	fen.stage = o.stage = 33;
}
function set_blackmail_owner_stage_defend(o) {
	set_blackmail_owner_stage(o);
	console.log('==>blackmailed is', o.fen.turn[0])
	let fen = o.fen;
	let uplayer = fen.turn[0];
	console.log('==>blackmailed is', uplayer)
	let building = path2fen(fen, fen.blackmail.building_path);
	let lead = building.lead;
	fen.players[uplayer].rumors.push(`${lead[0]}Cr`);
	let plname = fen.blackmail.blackmailed;
	let rumors = fen.players[plname].rumors;
	console.log('lead', lead, 'blackmailed rumors', rumors);
}
function set_king_phase(o) { set_queen_phase(o); o.phase = o.fen.phase = 'king'; }
function set_player_tithes(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	let min = 1000, minplayer = null;
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		let hkey = pl.hand[0];
		let val = ari_get_card(hkey).val;
		pl.tithes = { keys: [hkey], val: val };
		if (val < min) { min = val; minplayer = plname; }
		console.log('player', plname, 'tithes', pl.tithes);
	}
	let sorted = sortByDescending(fen.plorder, x => fen.players[x].tithes.val);
	fen.church_order = jsCopy(fen.plorder);
	fen.tithe_minimum =
		fen.stage = 21;
}
function set_queen_phase(o) {
	fen = o.fen;
	fen.phase = o.phase = 'queen';
	arisim_stage_3(fen);
	arisim_stage_4_all(fen, 3, false);
	ensure_actions(fen);
	fen.turn = [fen.plorder[0]];
}
function small_hands(o) {
	let [fen, uplayer] = [o.fen, o.fen.turn[0]];
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		pl.hand.sort();
		pl.hand = arrTake(pl.hand, 7); //journeys.push(['4Hn', '4Sn', '*Hn']);
	}
}
function start_tests() {
	ltest99_fritz(); //ltest_aristo_simple(); //ltest105_aristo_church(); //ltest107_aristo_build(); //ltest111_start();
}
function test_ferro_goal_sorting() {
	let av = ['7R', '3', '5', '33'];
	av = ['33', '3', '5', '4'];
	av.sort((a, b) => Z.fen.allGoals.indexOf(a) - Z.fen.allGoals.indexOf(b));
	return av;
}
function test_ferro_is_set() {
	let cards = ['9Sn', '7Sn', '8Sn', '9Sn'].map(x => fritz_get_card(x));
	let set = ferro_is_set(cards, 1, 3);
	console.log(set);
}
function test0_aristo_setup() {
	let g = { func: aristo(), options: get_default_options('aristo') };
	g.fen = g.func.setup(['felix', 'mimi'], {});
	console.log('fen', g.fen);
}
function test1_show_users() {
	show_users();
}
function test10_0() {
	lookupSet(DA, ['svgsym', suit, color], html);
	let color = 'orange';
	let treff = `
	<path	d="M30 150C35 385 85 400 130 500L-130 500C-85 400 -35 385 -30 150A10 10 0 0 0 -50 150A210 210 0 1 1 -124 -51A10 10 0 0 0 -110 -65A230 230 0 1 1 110 -65A10 10 0 0 0 124 -51A210 210 0 1 1 50 150A10 10 0 0 0 30 150Z"	fill="${color}"></path>
	`;
	let idsym = getUID('x');
	let sym = `
	<symbol id="Treff" viewBox="-600 -600 1200 1200" preserveAspectRatio="xMinYMid">
	`
}
function test10_queen_html() {
	let htmlWORKS = `
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			face="QS"
			height="100%"
			preserveAspectRatio="none"
			viewBox="-120 -168 240 336"
			width="100%"
			fill="#ffff00"
			stroke="green"
			>
			<defs><rect id="XSQ" width="164.8" height="260.8" x="-82.4" y="-130.4"></rect></defs>
			<symbol id="VSQ" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<path
					d="M-260 100C40 100 -40 460 260 460M-175 0L-175 -285A175 175 0 0 1 175 -285L175 285A175 175 0 0 1 -175 285Z"
					stroke="green"
					stroke-width="80"
					stroke-linecap="square"
					stroke-miterlimit="1.5"
					fill="none"
				></path>
			</symbol>
			<symbol id="SSQ" viewBox="-600 -600 1200 1200" preserveAspectRatio="xMinYMid">
				<path
					d="M0 -500C100 -250 355 -100 355 185A150 150 0 0 1 55 185A10 10 0 0 0 35 185C35 385 85 400 130 500L-130 500C-85 400 -35 385 -35 185A10 10 0 0 0 -55 185A150 150 0 0 1 -355 185C-355 -100 -100 -250 0 -500Z"
					fill="green"
				></path>
			</symbol>
			<symbol id="SQ1" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					fill="green"
					d="M635.39648,0 851.86719,312.33789C895.10685,299.11869 938.83136,290.34833 975,285 924.90197,188.22401 899.89439,94.153799 874.11133,0ZM295.52539,27.285156C246.27551,180.9799 142.75435,335.54042 209.25195,483.08398l-17.43359,13.44922c1.76531,151.10099 30.08527,286.57163 74.54102,398.60938 18.12594,21.287 38.56227,42.11564 61.47851,64.11523 3.61128,3.46683 7.28461,6.96262 11.33789,10.61914L901.47852,970l-0.41407,-0.51953c-0.12219,-0.138 -0.23745,-0.27418 -0.35937,-0.41211 15.27725,17.28278 32.6506,35.12574 52.3164,53.54294C1030.1434,1094.8366 1080,1150 1130,1250c52.9819,-70.6425 98.186,-110.0972 170,-152.7871v-37.6016c-68.6196,39.3343 -116.9422,76.6549 -164.5547,131.9668 -44.9491,-77.8482 -93.9175,-130.6069 -160.20897,-192.68943 -76.05982,-71.23062 -114.27421,-131.59148 -129.3711,-180.42578 -15.09688,-48.8343 -8.90849,-86.60287 7.94922,-120.96875 28.31708,-57.72677 91.51367,-102.35489 139.07032,-133.86328l-26.7793,-21.49024C896.53697,588.11019 793.22595,665.67487 806.10938,786.48828L699.86133,787.5 568.0625,939.89258 429.48438,939.86328C578.06034,763.29892 745.82856,594.02803 899.1875,455.09961l-9.56836,-10.99023c-28.86687,-3.02061 -55.64392,-10.37642 -80.51758,-21.42774 -1.77605,4.17261 -4.43372,8.02096 -7.94336,11.23438C665.11643,558.39566 525.46983,665.166 419.78906,829.43164L392.45703,811.84766C501.69344,642.05529 644.58723,533.12674 779.21875,409.9375l17.51367,6.86328c-17.74437,-8.98707 -34.48695,-19.8921 -50.29101,-32.48437 -124.71285,29.03155 -208.27492,36.48099 -267.26758,31.98242 0,0 -19.31641,14.60547 -29.31641,14.60547 -15,0 -25.58008,-5.64453 -30.58008,-5.64453 -5,0 -10,5 -25,5 -15,0 -30,-25 -40,-50 -1.51422,-2.01895 -3.01443,-4.07919 -4.23242,-5.79297l-39.21875,30.25586 10.50977,-0.54493c7.17244,138.45299 -1.25836,281.23598 43.02929,408.13477l-27.41796,17.66602c-1.32891,-2.13106 -2.43311,-4.45616 -3.26758,-6.95704C288.22851,692.7888 295.29422,552.70428 289.59766,421.09961l-69.70313,53.77344 20.20508,-16.59375C187.08454,297.85994 265.54029,182.85491 300.0957,58.960938ZM85,80c-55.000004,50 -100.000004,145 -35,145 9.343263,0 15.215964,-5.70961 19.599609,-15.58984l-0.05469,54.80664C63.116922,255.80043 55.218717,250 45,250c-34.999996,0 -39.999996,70 -5,70 24.46345,0 22.957588,-43.08208 10.8125,-44.93164 53.48157,5.0855 -15.809214,250.16385 -15.302734,296.2207 0.268193,24.38822 6.628431,48.73678 31.46289,56.20899C48.176742,632.49354 35,645.1697 35,660 35,674.30844 47.265656,686.61054 65.384766,692.25586 41.674751,699.57565 35,720.74035 35,740 35,776.24391 48.1356,836.13212 55.517578,866.33008 82.604368,846.54619 106.08392,825.42866 128.83984,800.21875 132.14826,778.91478 135,756.88968 135,740 135,720.60063 128.2285,699.26867 104.15234,691.95898 118.02756,686.75065 129.28173,676.58841 135,660c0,-14.83344 -13.18185,-27.51102 -30.78711,-32.89844 24.05654,-8.65812 30.01787,-32.21714 30.27734,-55.8125C134.99671,525.23221 65.705931,280.15386 119.1875,275.06836 107.04241,276.91792 105.53655,320 130,320c35,0 30,-70 -5,-70 -10.83425,0 -19.06007,6.52154 -25.074219,15.02148L100.25195,209.2793C104.49041,218.99863 110.42097,225 120,225 185,225 140,130 85,80Zm641.48047,287.83789c-86.62544,19.83455 -151.78802,28.17022 -200.80469,29.24219 -14.2248,6.27415 -30.07191,11.92239 -45.7793,18.95898 58.99266,4.49857 142.55438,-2.95118 267.19727,-32.03711 -7.7527,-5.20716 -14.38853,-10.76914 -20.61328,-16.16406zm-370.49024,88.29102c29.62693,11.74538 64.9141,21.55877 110.0293,25.15039 51.3028,4.08421 115.55629,0.48608 200.56445,-14.4043C568.01187,553.99998 468.15967,644.25595 384.25,765.71289 359.23837,670.90747 359.53927,564.67648 355.99023,456.12891ZM1182.5,473.75c-24.0403,0 -48.0562,17.34722 -29.8594,52.02344A45,42.5 0 0 1 1182.5,515a45,42.5 0 0 1 29.8652,10.76367C1230.552,491.09427 1206.538,473.75 1182.5,473.75Zm-54.6914,47.48047c-45.2477,0.77462 -37.6424,97.7377 22.793,66.2168A45,42.5 0 0 1 1137.5,557.5a45,42.5 0 0 1 13.1113,-29.94336c-8.6891,-4.53343 -16.2978,-6.43753 -22.8027,-6.32617zm109.3828,0c-6.5027,-0.11132 -14.1076,1.79222 -22.793,6.32226A45,42.5 0 0 1 1227.5,557.5a45,42.5 0 0 1 -13.1094,29.94336c60.4429,31.53409 68.0505,-65.43824 22.8008,-66.21289zm-24.8301,67.99414A45,42.5 0 0 1 1182.5,600 45,42.5 0 0 1 1152.6348,589.23633c-11.9875,22.85174 -5.6311,38.16959 6.9726,45.95898 -23.6821,34.46419 -48.941,66.02584 -74.9492,96.20703C1079.1653,675.69528 1058.4509,645.45798 1005,670c37.225,16.12754 38.5709,70.31699 75.9492,65.69727 -5.8664,6.76063 -11.768,13.45662 -17.6972,20.10156l15.207,1.88672c7.2551,-8.19076 14.4623,-16.46748 21.6113,-24.85352 5.1929,39.08146 35.0698,-7.57452 67.2129,-5.5 -16.4802,-41.743 -32.0495,-10.50502 -66.4785,4.63672 24.5708,-28.86629 48.4073,-59.08334 70.8027,-91.95508 26.5679,6.12811 61.7407,-10.79807 40.7539,-50.78906zM1255,655c-32.9633,38.74398 -63.8666,77.97963 -125,110 16.8191,30.21345 26.6544,60.2083 30,90 47.2312,18.32372 82.8871,51.83723 115,90 2.3419,-37.0436 -4.2974,-71.38724 -30,-100 23.3498,-4.99857 40.0029,-20.01884 50,-45 -14.5281,-24.40208 -35.9759,-32.69918 -60,-35 44.8752,-32.16719 30.2665,-71.33926 20,-110zM811.88477,817.78516c10.86486,41.66548 35.34229,88.00659 78.58593,139.42382 -4.92291,-5.82285 -9.66276,-11.58316 -14.2207,-17.2539l-286.46289,-0.0586 64.60547,-0.45703 75.1914,-86.93945 93.88282,-0.33984c-4.9028,-11.9067 -8.74345,-23.39087 -11.58203,-34.375zM377.5,842.5c4.42321,0 9.31831,2.00257 14.86719,9.24023C397.91606,858.97789 402.5,871.0223 402.5,885c0,13.9777 -4.58394,26.0221 -10.13281,33.25977C386.81831,925.49743 381.92321,927.5 377.5,927.5c-4.42321,0 -9.31831,-2.00257 -14.86719,-9.24023C357.08394,911.0221 352.5,898.9777 352.5,885c0,-13.9777 4.58394,-26.02211 10.13281,-33.25977C368.18169,844.50257 373.07679,842.5 377.5,842.5Z"
				></path>
			</symbol>
			<symbol id="SQ2" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					fill="red"
					d="M557.51758,0 805.9668,330.45703 851.01367,311.99805 635.36719,0Zm78.02148,0 63.76563,90.75C709.99966,65.000167 725,65 725,65 716.50651,26.779299 728.31462,17.104416 733.20117,0ZM820,265 851.86719,312.33789C877.5079,304.49903 903.31958,298.22492 927.6543,293.26562 907.75762,290.72138 885.5191,284.6565 865,270c-10,5 -30,10 -45,-5zm99.12695,216.28711C764.14521,621.01648 595.55342,787.07572 470.35547,940.01172L525,940 685,755h120.41797l-0.0547,-0.41211c6.37431,-102.76161 97.50088,-170.65811 160.41211,-212.22851zm-727.41992,15.5625 -59.86133,46.34766 -0.39648,0.30468c1.93099,12.0459 3.10803,21.69313 3.04101,27.78711 -0.25947,23.59536 -6.2208,47.15438 -30.27734,55.8125C121.81815,632.48898 135,645.16656 135,660 129.28173,676.58841 118.02756,686.75065 104.15234,691.95898 128.2285,699.26867 135,720.60063 135,740c0,16.88968 -2.85174,38.91478 -6.16016,60.21875 -1.95154,2.162 -3.90854,4.29257 -5.87304,6.39453C138.56664,789.96704 153.92711,771.43051 170,750 200.25102,810.50205 230.44886,854.59181 266.85742,895.71484 221.90196,783.10482 193.58426,647.63449 191.70703,496.84961ZM44.53125,610.36133 0,644.61523V902.7832C30.797744,884.46615 56.707359,866.73637 80.427734,846.89844 72.427991,853.57027 64.158102,860.01913 55.517578,866.33008 48.1356,836.13212 35,776.24391 35,740 35,720.74035 41.674751,699.57565 65.384766,692.25586 47.265656,686.61054 35,674.30844 35,660 35,645.1697 48.176742,632.49354 66.972656,627.49805 56.528563,624.35562 49.361734,618.22105 44.53125,610.36133Zm1190.09765,68.79687 -1.1211,1.04688c-20.0542,23.0427 -41.8711,45.665 -71.7441,65.72265 27.117,39.37142 36.6532,80.37363 27.7441,123.12891 25.4392,14.76465 47.2329,33.87001 67.875,55.8418 -10.0896,-28.95393 -26.9566,-68.05217 -64.6191,-89.36328C1229.865,829.72137 1245.3631,819.51581 1260,800c-28.5778,-21.24841 -50.4759,-15.94491 -77.3027,-15.66992 39.149,-21.89578 49.9371,-64.78262 51.9316,-105.17188zM110.74609,819.23828c-0.7889,0.78628 -1.58065,1.56702 -2.37304,2.3457 0.792,-0.77791 1.58362,-1.55961 2.37304,-2.3457zm-5.15234,5.05078c-0.76819,0.74251 -1.53476,1.48679 -2.30664,2.22266 0.77112,-0.73534 1.53841,-1.48017 2.30664,-2.22266zm-5.26172,5.00586c-2.077449,1.94603 -4.165139,3.87648 -6.273436,5.7793 2.104356,-1.90192 4.194747,-3.83083 6.273436,-5.7793zm-6.539061,6.02149c-1.467973,1.32281 -2.945132,2.63598 -4.429688,3.93945 1.482456,-1.30407 2.961518,-2.61456 4.429688,-3.93945zM377.5,862.5a11,22.5 0 0 0 -11,22.5 11,22.5 0 0 0 11,22.5 11,22.5 0 0 0 11,-22.5 11,22.5 0 0 0 -11,-22.5zm225.17578,127.46484a10,10 0 0 0 -10,10 10,10 0 0 0 10,9.99996 10,10 0 0 0 10,-9.99996 10,10 0 0 0 -10,-10zM420,990a10,10 0 0 0 -10,10 10,10 0 0 0 10,10 10,10 0 0 0 10,-10 10,10 0 0 0 -10,-10zm91.13281,0.41016a10,10 0 0 0 -10,10.00004 10,10 0 0 0 10,10 10,10 0 0 0 10,-10 10,10 0 0 0 -10,-10.00004z"
				></path>
			</symbol>
			<symbol id="SQ3" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					fill="#44F"
					d="M472.5,150a12.5,20 0 0 0 -12.5,20 12.5,20 0 0 0 12.5,20 12.5,20 0 0 0 12.5,-20 12.5,20 0 0 0 -12.5,-20zm-140,5a12.5,20 0 0 0 -12.5,20 12.5,20 0 0 0 12.5,20 12.5,20 0 0 0 12.5,-20 12.5,20 0 0 0 -12.5,-20zm23.49023,301.12891c3.54904,108.54757 3.24814,214.77856 28.25977,309.58398 83.90967,-121.45694 183.76187,-211.71291 282.33398,-298.83789 -85.00816,14.89038 -149.26165,18.48851 -200.56445,14.4043 -45.1152,-3.59162 -80.40237,-13.40501 -110.0293,-25.15039zm42.92579,22.92187c22.57573,0.10326 52.52779,2.34383 83.49804,6.2461 65.74558,8.28415 118.15335,21.65893 117.05469,29.87304 -1.09829,8.2139 -56.30922,5.07893 -122.05273,-3.20508 -65.73948,-8.28354 -117.1185,-18.57868 -116.02735,-26.79296 0.53448,-4.02047 14.07178,-6.22853 37.52735,-6.1211zM1117.5,492.5c2.4011,8.40385 4.2266,18.24941 5.4746,28.84375v0.36133c7.3876,-1.36391 16.4655,0.0837 27.2324,5.62304l-21.2675,-21.26757a1.50015,1.50015 0 0 1 1.0449,-2.57617 1.50015,1.50015 0 0 1 1.0761,0.45507l21.2676,21.26758c-5.5291,-10.74776 -6.9807,-19.81297 -5.6289,-27.19336 -10.7286,-1.24895 -20.7021,-3.08593 -29.1992,-5.51367zm130,0c-8.4251,2.40718 -18.2988,4.23414 -28.9238,5.48242h-0.2793c1.3613,7.38557 -0.087,16.46062 -5.6231,27.22266l21.2657,-21.26563a1.50015,1.50015 0 0 1 1.0312,-0.45312 1.50015,1.50015 0 0 1 1.0898,2.57422l-21.2675,21.26757c10.7565,-5.53399 19.8272,-6.98416 27.2109,-5.62695v-0.17187c1.2486,-10.6649 3.081,-20.57644 5.4961,-29.0293zm-853.59961,15.25781c20.38428,0.10329 47.42876,2.34386 75.39258,6.2461 59.36368,8.28422 106.68388,21.65899 105.69141,29.87304 -0.99271,8.21355 -49.91699,8.15671 -109.27735,-0.12695 -59.36371,-8.28422 -106.68391,-21.659 -105.69141,-29.87305 0.48636,-4.01928 12.70935,-6.22659 33.88477,-6.11914zm7.69531,34.67969c15.09367,-0.0753 32.61454,0.81411 50.47852,2.5625 51.50146,5.04084 94.00823,14.75226 93.67578,23.00391 -0.32891,8.2521 -42.34749,10.85536 -93.84961,5.81445C400.39893,568.77752 358.91755,558.00165 359.25,549.75c0.20345,-5.08688 15.52034,-7.17888 42.3457,-7.3125zm590.81446,21.09375c-26.28817,17.83124 -58.00395,39.71623 -85.84375,65.82227L1063.252,755.79883c5.9292,-6.64494 11.8308,-13.34093 17.6972,-20.10156C1043.5709,740.31699 1042.225,686.12754 1005,670c53.4509,-24.54202 74.1653,5.69528 79.6582,61.40234 18.288,-21.22222 36.2025,-43.13214 53.4609,-66.25 -50.4965,-31.89003 -99.3677,-65.63189 -145.70894,-101.62109zm92.24804,167.87109c-1.2353,1.43353 -2.4703,2.86748 -3.709,4.29493 1.3064,-0.16146 2.6533,-0.388 4.0508,-0.69727 -0.1038,-1.21628 -0.2241,-2.40447 -0.3418,-3.59766zm-21.4062,24.39649 1.3242,1.02344C1092.8236,758.22045 1130,765 1130,765c33.2353,-17.40792 57.5278,-36.95014 78.082,-57.38477 -19.9562,-11.65548 -39.7017,-23.55345 -59.2109,-35.71875 -15.5528,20.88792 -31.6462,40.7815 -48.0664,60.07227 34.429,-15.14174 49.9983,-46.37972 66.4785,-4.63672 -32.1431,-2.07452 -62.02,44.58146 -67.2129,5.5 -7.149,8.38604 -14.3562,16.66276 -21.6113,24.85352zM399.88477,574.98828c12.13924,-0.0753 26.23048,0.81416 40.59765,2.5625 41.42116,5.04089 74.78321,15.81675 74.51563,24.06836 -0.26463,8.25206 -34.05885,10.85531 -75.48047,5.81445 -41.42116,-5.04089 -74.78321,-15.81675 -74.51563,-24.06836 0.16364,-5.08693 13.30756,-8.24338 34.88282,-8.37695zm814.90823,12.6836 21.2675,21.26757a1.50015,1.50015 0 1 1 -2.121,2.1211l-21.2657,-21.26563c5.5369,10.76367 6.9837,19.84044 5.6211,27.22656h0.3223c10.6094,1.24816 20.4685,3.07443 28.8828,5.47852 -2.4278,-8.49731 -4.2627,-18.47029 -5.5117,-29.19922 -7.3807,1.35234 -16.4468,-0.0994 -27.1953,-5.6289zm-64.5879,0.002c-10.7501,5.53028 -19.8161,6.98044 -27.1973,5.62695v0.0723c-1.2488,10.70195 -3.0853,20.64836 -5.5078,29.12695 8.4975,-2.42785 18.4701,-4.26471 29.1992,-5.51367 -1.3518,-7.38039 0.1,-16.44561 5.6289,-27.19336l-21.2676,21.26758a1.50015,1.50015 0 1 1 -2.121,-2.1211zM399.95117,608.2207c7.75591,-0.014 16.33902,0.59569 25.04883,1.7793 30.51033,4.14665 55.19775,16.74619 55.24414,25 0.0491,8.25469 -24.64792,11.5847 -55.16016,7.4375 -30.51033,-4.14665 -55.28173,-14.19933 -55.32812,-22.45312 -0.0324,-5.62262 11.68692,-11.73096 30.19531,-11.76368zm2.94141,36.28321c3.92832,-0.0157 8.00124,0.15115 12.10742,0.49609 25.08573,2.10744 44.77796,7.02839 45.42188,14.97852 0.64298,7.94981 -19.17087,12.68576 -44.25586,10.57812 -25.08573,-2.10744 -45.94398,-10.26081 -46.5879,-18.21094 -0.52278,-6.4668 13.79255,-7.76393 33.31446,-7.84179zm-6.3711,30.78125c1.53788,10e-4 3.10151,0.0612 4.67383,0.17968 15.24356,1.1523 28.12847,7.43255 28.7793,14.02735 0.6519,6.59512 -11.17778,11.00764 -26.42188,9.85547 -15.24356,-1.1523 -28.12847,-7.43255 -28.77929,-14.02735 -0.57317,-5.81151 8.60794,-10.04793 21.74804,-10.03515zm-2.7207,30.4707c0.97501,0.002 1.96625,0.0499 2.96289,0.14453 9.66123,0.91446 17.82809,5.89851 18.24219,11.13281 0.4126,5.23472 -7.08576,8.73687 -16.74805,7.82227 -9.66123,-0.91446 -17.82809,-5.89851 -18.24219,-11.13281 -0.3645,-4.61356 5.45528,-7.97697 13.78516,-7.9668zm906.19922,0.0781 -34.2773,2.85547c0.2249,20.00253 -6.7832,39.15319 -30.7188,56.31055 24.0241,2.30082 45.4719,10.59792 60,35 -9.9971,24.98116 -26.6502,40.00143 -50,45 19.6816,21.91005 28.1768,47.18324 30.0293,74.45312l0.01,0.008 24.957,11.09375zm-167.2656,64.20508c0.2372,0.44647 0.4708,0.89347 0.7051,1.33985 -0.2343,-0.44637 -0.4679,-0.89339 -0.7051,-1.33985zm3.041,5.88282c0.083,0.16606 0.171,0.33199 0.2539,0.49804 -0.083,-0.16604 -0.1705,-0.33202 -0.2539,-0.49804zm2.6758,5.48437c0.2147,0.45253 0.425,0.90499 0.6367,1.35742 -0.2117,-0.45239 -0.4219,-0.90493 -0.6367,-1.35742zm2.455,5.32422c0.1795,0.40036 0.3641,0.80089 0.5411,1.20117 -0.177,-0.40029 -0.3615,-0.80081 -0.5411,-1.20117zm2.5958,5.98437c0.2099,0.50184 0.413,1.00415 0.6191,1.50586 -0.2062,-0.5018 -0.4092,-1.00393 -0.6191,-1.50586zm2.0703,5.11719c0.1975,0.50277 0.4,1.00516 0.5937,1.50781 -0.1937,-0.50252 -0.3962,-1.00516 -0.5937,-1.50781zm2.3418,6.1875c0.1922,0.53072 0.3764,1.06121 0.5644,1.5918 -0.188,-0.53055 -0.3722,-1.06112 -0.5644,-1.5918zm1.7324,4.96485c0.2042,0.60477 0.4106,1.20984 0.6094,1.81445 -0.1988,-0.60461 -0.4051,-1.20971 -0.6094,-1.81445zm2.0273,6.26562c0.1846,0.60177 0.3579,1.20308 0.5371,1.80469 -0.1792,-0.60139 -0.3525,-1.20313 -0.5371,-1.80469zm1.4688,5.00977c0.1799,0.63781 0.3593,1.27644 0.5332,1.91406 -0.174,-0.63786 -0.3532,-1.27602 -0.5332,-1.91406zM377.5,842.5c-4.42321,0 -9.31831,2.00257 -14.86719,9.24023C357.08394,858.97789 352.5,871.0223 352.5,885c0,13.9777 4.58394,26.0221 10.13281,33.25977 5.54888,7.23766 10.44398,9.24023 14.86719,9.24023 4.42321,0 9.31831,-2.00257 14.86719,-9.24023C397.91606,911.0221 402.5,898.9777 402.5,885c0,-13.9777 -4.58394,-26.02211 -10.13281,-33.25977C386.81831,844.50257 381.92321,842.5 377.5,842.5Zm-0.27344,4.79492c2.95574,0.0879 5.94922,5.08008 5.94922,10.70508 10.93128,-0.11104 14.67749,3.31056 5.67578,13 13.69744,3.7436 10.6454,8.69968 2.83789,14 7.80751,5.30032 10.85955,10.2564 -2.83789,14 9.00171,9.68944 5.2555,13.11104 -5.67578,13 0,10 -9.4596,18 -11.35156,0 -10.93128,0.11104 -14.67748,-3.31056 -5.67578,-13 -13.69744,-3.7436 -10.6454,-8.69968 -2.83789,-14 -7.80751,-5.30032 -10.85955,-10.2564 2.83789,-14 -9.0017,-9.68944 -5.2555,-13.11104 5.67578,-13 0.82773,-7.875 3.10344,-10.77344 5.40234,-10.70508zm352.35742,5.20508 -75.1914,86.93945 43.0039,-0.041L744.44531,885H840l-15,-32.5zm29.72266,65 -19.23047,22.23633L876.25,939.95508 860,917.5Zm-104.13476,52.41992 -315.75977,0.17969c2.43984,2.47881 4.98787,4.87423 7.56641,7.28906 15.37025,14.39437 29.32058,28.43253 41.91015,42.12693 1.06974,-4.4442 6.04965,-11.1309 16.11133,-19.5156 -30,-25 -15,-34.99999 15,-15 30,-19.99999 45,-10 15,15 30,25 15,35 -15,15 -11.06914,7.3794 -20.08451,10.6644 -25.5625,10.6289 1.31057,1.4627 2.62767,2.9262 3.90625,4.3809l256.41797,-0.1328zm-170.01172,4.44531C490.60938,974.21875 499.75,977.5 511,985c30,-19.99999 45,-10 15,15 30,25 15,35 -15,15 -30,20 -45,10 -15,-15 -18.75,-15.625 -19.92188,-25.39063 -10.83984,-25.63477zm91,0C581.60938,974.21875 590.75,977.5 602,985c30,-19.99999 45,-10 15,15 30,25 15,35 -15,15 -30,20 -45,10 -15,-15 -18.75,-15.625 -19.92188,-25.39063 -10.83984,-25.63477z"
				></path>
			</symbol>
			<symbol id="SQ4" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					fill="green"
					d="M499.67383,0C598.83088,212.42554 698.5156,423.78371 891.07812,444.24805L557.50781,0ZM299.89844,59.855469C265.54099,182.85387 187.08454,297.85994 240.09961,458.2793L349.875,372.94531C322.20549,333.64118 300,282.28964 300,255c0,-20 5.00324,-149.9992 5,-155 -10e-4,-2.004308 -2.41143,-19.27436 -5.10156,-40.144531zM899.91016,454.8418C746.55122,593.77022 578.78424,763.04072 429.50781,939.46875l40.84766,0.54297C595.55342,787.07576 764.14431,621.01748 918.95508,481.37891Zm65.79101,87.45703c-28.87179,19.18723 -64.12524,44.12835 -93.97851,75.52344l25.55078,20.04296c30.22964,-29.84438 65.96002,-54.59002 95.59961,-73.97851 -9.28135,-6.87909 -18.47109,-14.10656 -27.17188,-21.58789zM685,755 525.10156,939.88281 570,940 699.86133,787.5H806.65039L805,755Z"
				></path>
			</symbol>
			<symbol id="SQ5" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					stroke="#44F"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="6"
					fill="none"
					d="M435,885A57.5,75.000002 0 0 1 377.5,960.00001 57.5,75.000002 0 0 1 320,885 57.5,75.000002 0 0 1 377.5,810 57.5,75.000002 0 0 1 435,885v0M417.07718,940H876.02627M308.27069,940h28.75722M339.49097,970H901.47783M131.84482,543.19629 351.03451,374.58883M6.9310566e-5,644.61533 44.832165,610.1291M1138.1663,665.18229C1077.9926,627.18313 1020.1253,586.55302 965.29601,542.45758M1208.5796,707.90733c-20.1878,-11.78458 -40.1599,-23.81534 -59.8906,-36.12132M557.51806,-3.5577172e-4 965.44559,542.57786M1299.7291,1059.765c-68.4773,39.2778 -116.7334,76.5733 -164.2838,131.8131 -44.9491,-77.8482 -93.9175,-130.6069 -160.20897,-192.68943 -76.05982,-71.23062 -114.27421,-131.59148 -129.3711,-180.42578 -15.09688,-48.8343 -8.90849,-86.60287 7.94922,-120.96875 28.31708,-57.72677 91.51285,-102.35515 139.0695,-133.86354M499.68528,0.03748108C598.83742,212.45251 698.51437,423.77834 890.34164,443.851M364.36489,812.31243C320.07724,685.41364 328.50886,542.63024 321.33642,404.17725c76.71711,39.85219 163.35704,77.44074 457.8821,5.76082C644.587,533.12731 501.69292,642.05444 392.45651,811.84681M355.97656,456.125c29.62956,11.74764 64.92126,21.56216 110.04297,25.1543 51.30556,4.08443 115.56309,0.48617 200.57813,-14.40625 -98.57798,87.12824 -198.39177,177.48156 -282.2461,298.86133 -24.96545,-94.92731 -24.7974,-201.06283 -28.375,-309.60938v0M867.34252,440.4065C719.62961,574.07588 560.4386,730.57461 436.09373,879.43791M223.89186,472.86906c-0.82324,183.16931 37.98603,343.48203 98.11552,466.27071M191.49798,496.71315c2.08648,150.92196 30.40471,286.39171 75.55251,398.73891M429.507,939.46794C578.78343,763.03991 746.55158,593.76963 899.91052,454.84121M470.35494,940.01166C595.55289,787.0757 764.14488,621.01728 918.95565,481.37871M525,940 685,755h120.41872M567.92551,940.0502 699.86133,787.5h106.78892M611.46541,939.39021 714.72266,820h97.2642M654.39213,939.43943 729.58398,852.5h93.89714M697.39662,939.39902 744.44531,885h95.04566M740.07521,939.73575 759.30664,917.5H860M906.39152,629.42293 1063.7852,756.67736M871.92369,617.813 1043.2441,757.01082M459.61865,481.34795C414.86903,573.51288 406.45192,669.62669 385,765M303.65592,-0.00221915C259.09343,162.78907 138.61386,327.07777 209.42337,483.4732M240.09997,458.27954C187.0849,297.86018 265.54056,182.85405 300.09597,58.960082M805.81085,330.134c14.88787,-6.44544 30.42237,-12.16006 46.14865,-17.2138M0.09725143,902.73906C71.866196,860.06685 117.03718,820.61709 170,750c50,100 99.8567,155.1639 176.97865,227.3892 281.56105,263.6842 94.15072,409.6105 -13.08443,480.4695M377.5,842.5c4.42321,0 9.31831,2.00257 14.86719,9.24023C397.91606,858.97789 402.5,871.0223 402.5,885c0,13.9777 -4.58394,26.0221 -10.13281,33.25977C386.81831,925.49743 381.92321,927.5 377.5,927.5c-4.42321,0 -9.31831,-2.00257 -14.86719,-9.24023C357.08394,911.0221 352.5,898.9777 352.5,885c0,-13.9777 4.58394,-26.02211 10.13281,-33.25977C368.18169,844.50257 373.07679,842.5 377.5,842.5v0M1130,765c16.8191,30.21345 26.6544,60.2083 30,90 47.2312,18.32372 82.8871,51.83723 115,90 2.3419,-37.0436 -4.2974,-71.38724 -30,-100 23.3498,-4.99857 40.0029,-20.01884 50,-45 -14.5281,-24.40208 -35.9759,-32.69918 -60,-35 44.8752,-32.16719 30.2665,-71.33926 20,-110 -32.9633,38.74398 -63.8666,77.97963 -125,110v0M1300,705.83334l-34.3239,2.86032M1299.9997,930.55544l-26.1711,-11.63161M1192.7269,836.42558c37.6985,20.41997 54.5672,59.51932 65.2796,89.01033M1182.9686,784.9233c26.555,-0.86899 48.4536,-6.17171 77.0314,15.0767 -14.6369,19.51581 -30.1358,29.72065 -67.2011,34.6433M1234.6287,679.15791c-1.9945,40.38926 -12.7829,83.27561 -52.2037,104.5774M1162.3431,745.42454c26.5383,39.87481 36.0743,80.87688 26.979,123.43436M1130,765c0,0 -82.1675,-15 -95,-5 -12.8325,10 -32.9691,31.30714 -40,40 -31.97044,39.52731 3.64509,49.72935 20,30M1050,800c-59.31161,25.45028 -64.22618,120.61499 20,25M1041.1933,853.52948c-14.9444,32.29436 0.7581,60.30105 58.5,-5.24847M1062.1853,882.59071C1040.9944,921.29246 1103.755,918.14402 1160,855M1063.2524,755.79961c33.572,-37.62441 66.2866,-76.82735 96.4461,-120.73492M1078.4582,757.6865c32.4929,-36.68328 64.0954,-75.00591 93.2554,-117.82589M1085,735c-4.9523,-58.0017 -25.4042,-90.06768 -80,-65 38.526,16.69119 38.6175,74.15849 80,65v0M1005,670c37.8073,-6.25375 56.1399,40.79694 80,65M1100,732.33169c35,-15 50.6726,-47.07119 67.2824,-5 -32.2824,-2.08351 -62.2824,45 -67.2824,5v0M1100.0662,732.84533c26.3257,8.26747 52.4616,-23.9051 67.2162,-5.51364M1155.0001,585.00001C1080.0001,630 1080,484.99999 1155,530c-45,-75 100,-75 55,0 75,-45 75,100 10e-5,55 45,75.00001 -100.0001,74.99999 -55,10e-6v0M1242.5,557.5c-60,0 -60,0 -60,-60 0,60 0,60 -60,60 60,0 60,0 60,60 0,-60 0,-60 60,-60v0M1122.9743,521.34338c-1.248,-10.59434 -3.0726,-20.43952 -5.4737,-28.84337 8.5766,2.45046 18.6544,4.30045 29.4977,5.54996M1146.7554,616.97813c-10.7509,1.24908 -20.7424,3.08971 -29.255,5.52188 2.4225,-8.47859 4.2581,-18.42426 5.5069,-29.12621M1241.9485,592.9857c1.2496,10.84959 3.1002,20.93331 5.5519,29.5143 -8.4143,-2.40409 -18.2735,-4.23021 -28.8829,-5.47837M1218.5761,497.98319c10.625,-1.24828 20.4988,-3.07601 28.9239,-5.48319 -2.4151,8.45286 -4.2469,18.3639 -5.4955,29.0288M357.95908,386.26136c-4.7848,-2.30618 -9.52375,-4.6875 -14.28345,-7.12611M748.06895,383.93902C622.45119,413.08814 538.88863,420.5377 479.79194,417.07826M355.99023,456.12891c29.62693,11.74538 64.9141,21.55877 110.0293,25.15039 51.3028,4.08421 115.55629,0.48608 200.56445,-14.4043C568.01187,553.99998 468.15967,644.25595 384.25,765.71289 359.23837,670.90747 359.53927,564.67648 355.99023,456.12891v0M85,135c10.787262,31.12992 5,90 35,90 65,0 20,-95 -35,-145 -55.000004,50 -100.000004,145 -35,145 30,0 24.21273,-58.87008 35,-90v0M40,285c0,0 0,-10 10,-10 12.88094,0 15,45 -10,45 -34.999996,0 -29.999996,-70 5,-70 30,0 40,50 40,50 0,0 10,-50 40,-50 35,0 40,70 5,70 -25,0 -22.88094,-45 -10,-45 10,0 10,10 10,10M120,275c-55,2.66831 15,250 14.49097,296.289C134.16784,600.67311 125,630 85,630 45,630 35.832163,600.67311 35.509031,571.289 35,525 105,277.66831 50,275M70,264.98358V208.33333M100,265.18883V208.74384M103.20611,627.39263C121.81764,632.48836 135,645.16656 135,660c0,19.32997 -22.38576,35 -50,35 -27.614237,0 -50,-15.67003 -50,-35 0,-14.8303 13.176786,-27.50627 31.782083,-32.60414M65.931232,692.4756C41.674852,699.57662 35,720.74035 35,740c0,36.24391 13.136211,96.133 20.364326,126.34321M128.36935,800.67704C132.14739,778.91407 135,756.88968 135,740c0,-19.39937 -6.77205,-40.73054 -31.46191,-47.67672M256.89224,885h6.38602M1.1417102e-4,884.99999 28.737098,885M245.57157,870h11.90122M2.5229169e-5,870.00002 51.088175,870M233.67034,855h18.57752M4.1609595e-5,854.99999 52.539543,855M222.93022,840h24.09272M7.6084636e-5,840.00001 49.346532,840M212.77064,825h29.89819M4.2336546e-5,825.00002 46.443795,825M203.1916,810h34.54258M4.0905762e-6,810.00002 43.541058,810M194.48339,795h38.89668M129.46208,795h5.22493M-3.8457096e-5,795.00001 40.638321,795M186.06545,780h42.96051M131.78427,780h14.51368M-3.1733115e-5,780.00001 38.316131,780M178.22806,765h46.73407M133.81618,765h24.67327M10,765H36.284215M134.68701,750h86.50156M10,750H34.542573M134.97728,735h83.01828M15,735H35.12312M132.65509,720H205M15,720H37.844594M155,705h45M325,510c-11.82334,-17.57111 -24.45521,-31.94743 -45.42097,-47.16261 -21.67788,-15.73198 -32.01525,9.6364 -23.86278,22.70472M325,540c-13.68399,-15.7169 -40.72661,-39.31758 -62.25684,-51.80699 -20.39713,-11.83211 -26.52283,15.09906 -9.53546,27.99468M326.64903,572.53873c-13.68399,-15.7169 -40.42328,-39.85576 -62.25684,-51.80699 -33.04187,-18.08643 -43.83934,14.15892 -2.74316,31.80699M329.68204,632.14459c-13.68399,-15.7169 -40.42328,-39.85576 -62.25684,-51.80699 -30.81157,-16.86561 -37.65608,16.8659 -5.11631,35.80661M328.06764,597.68777c-13.86078,-13.59047 -33.31597,-27.70524 -50.77313,-39.51278 -22.07438,-14.9305 -34.10496,4.47364 -22.83565,17.22609M332.19576,659.38835c-13.77031,-13.23256 -32.62008,-26.88451 -49.58329,-38.35795 -24.04479,-16.26322 -36.17268,12.27173 -19.25152,25.31598M335.48063,686.60634C319.24375,673.64242 295.51352,659.7442 277.4252,650.3376c-31.2697,-16.26141 -36.88691,20.47944 -3.29829,37.12122M339.44241,709.94356C293.812,671.34406 241.20364,684.64228 285,715M345.57813,743.85785c-49.78299,-42.23381 -140.14002,-42.27022 -51.45386,5.50004M359.15379,797.42734C296.30783,757.35598 217.41506,767.9862 315.25691,808.08817M356.15219,815.71589c-43.41581,-18.1629 -92.79129,0.20988 -43.97099,13.65755M335.79649,833.55074c-36.46249,-11.38361 -55.92576,9.42664 -11.42381,20.21059M323.63736,467.38673c-7.1925,-7.58612 -15.51039,-14.89158 -25.85855,-22.4014 -17.52111,-12.71535 -26.71907,0.32727 -25.12324,12.4885M322.15877,428.22708c-1.31784,-1.00168 -2.67007,-2.00587 -4.05887,-3.01374 -19.41173,-14.0874 -28.60717,3.4419 -24.22651,16.36102M351.5017,769.34668c-41.8286,-32.62324 -87.13007,-22.98664 -57.82646,2.59886M396.50984,805.03398c97.55186,1.04019 65.93584,25.61549 21.19412,25.63392M410.20409,785.71584c31.87867,-11.92022 60.58013,-9.17207 74.95842,-1.62887 16.81695,8.82258 14.04006,24.2047 -26.16419,30.34906M430.54986,757.7319c58.57662,-11.0001 103.69453,13.94896 55.48459,26.1888M451.62343,729.60393c67.42086,-18.09697 125.45489,10.74224 49.42624,33.66324M469.15226,707.61747c69.25339,-23.47062 135.42699,4.47512 67.15155,28.14525M497.03474,675.73394c50.50234,-8.00778 88.6752,9.66559 55.551,28.0217M514.06286,656.56715c77.25396,-19.94453 157.95502,17.262 48.7626,27.75334M550.91529,618.31036c57.1762,-5.00205 100.00874,18.02731 40.2256,35.03407M568.89077,600.93936c75.24789,-19.79781 151.84194,14.60918 51.22446,34.33609M596.84001,574.15634c55.64482,-7.64299 102.46778,11.7471 64.24628,28.76475M620.73761,552.10789c71.56974,-16.51587 140.66537,14.62009 53.45997,34.06378M660.73433,515.56983c57.1151,-4.52529 99.00079,18.87447 36.45506,35.78648M684.38719,494.58861c73.88041,-16.89549 144.8643,16.89901 43.68109,36.08147M722.79564,460.82624c57.76542,-5.50387 101.75016,17.65976 42.02455,34.7974M748.43052,437.7647c68.01755,-11.92015 127.59071,17.4385 43.80212,36.02686M645.55164,273.86211C640.4516,285.47932 635.59316,297.26013 610,295c-14.37233,81.30224 -73.77303,98.38804 -130,120 0,0 -19.41945,15.64589 -29.41945,15.64589C435.58055,430.64589 425,425 420,425c-5,0 -10,5 -25,5 -15,0 -30,-25 -40,-50 -30,-40 -55,-96.04455 -55,-125 0,-20 5.003,-149.9992 5,-155 -0.002,-3.089335 -5.72781,-42.445846 -10.1037,-72.07356M622.93321,240.32144C616.61632,250.552 609.19352,264.74236 615,265c2.73428,0.12132 6.96971,-10.37759 10.24354,-19.90618M904.16018,494.81448l50.56379,54.17549M889.99031,508.2039l48.73454,52.21558M875.34795,521.08709l48.01937,51.44933M861.63691,534.96812l46.15447,49.45122M847.01655,547.87487l45.96336,49.24646M832.83302,561.24966l35.28817,37.80876M818.66315,574.63908l24.02599,25.74214M803.86532,587.3557l17.84203,19.11646M790.06402,601.14003l8.92784,9.56554M482.75862,925h55.41872M495.89491,910h55.00821M508.21018,895h55.82923M521.34647,880h55.41872M534.48276,865h55.41872M552.95566,845H585M790,820v32.5M765,820v32.5M740,820v32.5M703.26765,833.26765l22.578,22.578M684.08867,854.08867l23.39901,23.39901M665.93596,875.93596l22.78325,22.78325M648.19376,898.19376l22.578,22.578M629.22003,919.22003l20.73071,20.73071M791.29599,310.75526c15.62961,-6.29692 31.83381,-11.83473 48.11454,-16.69002M776.15664,290.35133c15.84539,-6.35519 32.2728,-11.93292 48.76488,-16.81275M760.82223,270.4856c16.18061,-6.50419 32.97255,-12.19625 49.8241,-17.16102M746.54814,252.22866c16.42632,-6.7965 33.54246,-12.73644 50.75899,-17.91046M739.12096,229.17409c11.71799,-4.608 23.73402,-8.79725 35.84163,-12.5995M726.54679,208.22774c8.46394,-3.2756 17.07495,-6.33535 25.75602,-9.1911M711.68624,188.33917c5.39484,-2.00758 10.85695,-3.94932 16.37032,-5.82515M900.40882,94.431781C848.5463,114.25376 796.72828,69.769511 761.4322,93.621964 715,125.00001 755,185 789.33498,165.18883 821.13528,146.84017 790,105 775,115c-9.30261,6.20174 -14.88842,18.30946 -10,25 6.18042,8.45885 10.48873,9.62814 20,5M901.46652,97.13303C861.76115,135.4564 879.34663,201.01228 842.74068,222.52055 794.42332,250.91 757.5027,188.96753 790.17065,166.51363c30.25635,-20.79631 54.6061,25.32412 39.1205,34.55428 -9.60379,5.72429 -22.93675,5.55043 -26.86936,-1.74304 -4.972,-9.22111 -4.17161,-13.61293 4.10189,-20.20332M765,180l90,-60M845,160c-10,-10 -45.467,-11.35662 -55,5 22.00764,-11.03808 34.76336,-24.75676 25,-45M795,230c25,30 50,20 75,10 24.05541,32.7653 64.66095,38.66637 105,45M725,130C715,110 740,85 755,75 749.14905,51.948962 757.70702,26.00987 766.59362,0.00490542M700,90c10,-25 25,-25 25,-25 -8.48271,-38.172217 3.28893,-47.867055 8.18679,-64.93099617M427.96416,0.01822477C445.06535,51.748024 483.31343,78.400493 539.31946,83.994433M446.67053,0.04362022C462.63103,38.843647 492.03631,61.699978 533.14043,70.683071M461.24526,0.01603427C475.22521,27.447203 496.92922,45.718691 525.58366,55.74792M476.99588,0.10806452C487.38028,16.453559 500.99836,28.964352 517.63646,37.893813M371.26432,0.04443925C356.34418,40.196712 340.91798,80.075485 304.69652,100.28589M355.60874,0.04353776C343.34293,31.804187 329.13875,61.845937 302.67098,80.298673M339.57059,0.02060224C329.73362,23.196287 317.89132,44.53011 299.71459,59.883794M325.15652,0.08430598C317.46458,14.722402 308.27692,27.964826 296.26758,38.544057M305,120c41.1016,-25.066138 61.56092,-14.28714 80,0 20,55 -15,110 -14.41945,151.6763 0.21559,15.47674 11.72696,13.44856 19.41945,13.3237 4.99934,-0.0811 15,10 15,10M305,125c29.58587,-20.97635 55.47603,-17.50669 80,-5M430,245c20,0 20,30 5,30 -40,5 -40,-10 -5,0M365,315v10l5,-5 -5,-5v0M455,320l5,-5v10l-5,-5v0M370,320c0,0 5,5 10,5 5,0 5.24415,-4.00984 12.32219,-4.4848C400,320 400,325 405,325c5,0 15,-10 20,-10 5,0 15,5 20,5h10M390,340c3.06957,28.45212 45.6136,8.68856 45,5 -5,5 -44.77199,31.85105 -45,-5v0M430,135c51.53607,-36.718861 85.86501,-16.18211 120,5 -35.40475,-25.98218 -85,-45 -120,-5v0M540,160C525,160 503.52953,134.61544 483.61398,136.45137 453.79885,139.1999 445,175 430,180 447.93464,158.59181 463.7944,151.78059 478.07024,151.93493 507.27438,152.25068 515,185 550,175M430,180c15,-10 32.80939,10.04302 45.17423,9.94542C504.08195,189.71723 519.49385,175 530,175M380,175c-20,0 -30.87367,-19.1648 -47.03192,-20.29027 -12.3413,-0.85961 -29.19452,12.61246 -29.19452,17.61246 0,7.07107 11.23734,20.70784 22.74316,23.25836C342.90794,199.21402 362.81244,175.3491 380,175v0M305,165c22.64276,-42.75014 64.95345,-9.49214 65,-5M820,265c15,15 35,10 45,5 20.5191,14.6565 42.75671,20.72048 62.68286,23.22939M851.86653 312.33707C895.10619 299.11787 938.83136 290.34833 975 285C924.90149 188.22308 899.90057 94.152754 874.11725 -0.0019513659 M851.86653,312.33707C895.10619,299.11787 938.83136,290.34833 975,285 924.90149,188.22308 899.90057,94.152754 874.11725,-0.00195137M851.01315,311.99775 635.36748,-2.4089679e-4M927.65339,293.26472C907.75671,290.72048 885.5191,284.6565 865,270c-10,5 -30,10 -45,-5"
				></path>
			</symbol>
			<symbol id="SQ6" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					stroke="#44F"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="3"
					fill="none"
					d="M986.60333,811.20184l17.52527,26.83701m3.5763,5.47663 14.2883,21.88014M993.49031,800.86775c12.59499,20.81314 26.36539,39.79428 40.67199,57.93996m3.6811,4.63683c6.0574,7.57938 12.2001,15.02588 18.3803,22.41378m3.5795,4.26824c4.9357,5.87225 9.8895,11.71638 14.8372,17.56998M1002.2895,791.27746c25.6547,42.89167 56.3312,77.95704 86.5273,113.77117M1011.3206,782.24417c26.5981,44.89853 58.7236,81.18275 90.1523,118.55299M1018.2105,775.40469C1045.4382,820.51985 1078.1971,857.01507 1110,895M91.990234,409.08984c5.346491,34.39969 12.364566,69.89746 17.978516,99.54297 5.61395,29.64551 9.60751,54.84672 9.52344,62.49219 -0.14502,13.18721 -2.60383,25.09508 -7.35157,32.2207C107.39289,610.47133 101.33414,615 85,615 68.665861,615 62.607113,610.47133 57.859375,603.3457M95.230469,511.42383c2.783382,14.69817 5.162021,28.28252 6.812501,38.99023 1.65048,10.70771 2.46055,19.51658 2.44922,20.54688 -0.12561,11.42229 -3.03694,21.37127 -4.833987,24.06836 -1.554361,2.33286 -1.96098,2.67133 -3.316406,3.33203C94.986371,599.02203 91.780811,600 85,600M99.244141,641.85938C113.48363,645.75807 120,654.05348 120,660c0,3.87456 -2.13436,8.18273 -8.24609,12.46094C105.64218,676.73915 95.96981,680 85,680 74.030191,680 64.357824,676.73915 58.246094,672.46094M99.476562,706.76367c8.835718,2.48582 12.847888,6.43575 15.929688,11.99805C118.48805,724.32402 120,732.04575 120,740c0,15.20071 -2.70618,36.77501 -6.41016,58.11133M102.94922,660.2832C99.903483,662.33803 92.860098,665 85,665c-7.997241,0 -15.198086,-2.76015 -18.152344,-4.82812M102.28516,726.03125C103.52282,728.2651 105,733.94656 105,740c0,13.42041 -2.56634,34.6744 -6.189453,55.54492M726.75998,368.27894C639.85431,387.67178 574.6926,396.00751 524.83867,397.57475M715.61309,356.58894C649.94086,370.7787 597.12268,378.4618 554.16847,381.63062M703.03893,344.25945c-49.76763,10.38288 -91.8849,16.91189 -127.75629,20.52287M690.7875,331.76901c-38.30305,7.6982 -71.90839,13.04175 -101.50758,16.49148M680.13806,318.87243c-30.03631,5.82677 -57.08899,10.16495 -81.51547,13.25269M670.20516,305.76564c-23.347,4.36958 -44.8345,7.81564 -64.64196,10.45774M659.57286,292.71511c-18.04772,3.23925 -34.94556,5.91034 -50.78275,8.07274M390,380c11.94547,-13.95601 27.22073,-12.69836 45,0M440,195c10,15 30,15 45,15M310,205c50,25 60,-30 70,-30M350.01995,162.05531c1.14299,3.17833 1.7863,6.76631 1.7863,10.56373 0,13.03628 -7.58139,23.60427 -16.9335,23.60427 -9.35211,0 -16.93349,-10.568 -16.93349,-23.60427 0,-5.79795 1.49965,-11.10766 3.98776,-15.21654M488.55832,153.60687c1.90775,3.81995 3.02626,8.46304 3.02626,13.4703 0,13.03628 -7.58139,23.60427 -16.9335,23.60427 -9.35211,0 -16.93349,-10.568 -16.93349,-23.60427 0,-4.03258 0.72545,-7.82898 2.00436,-11.14943"
				></path>
				<use xlink:href="#SSQ" height="90" transform="translate(1188,935)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(1194,1043)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(1096,1033)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(1022,947)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(918,851)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(897,726)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="green"></rect>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ1"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ1"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ2"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ2"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ3"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ3"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ4"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ4"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ5"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ5"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ6"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ6"></use>
			<use xlink:href="#VSQ" height="32" x="-114.4" y="-156"></use>
			<use xlink:href="#SSQ" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#SSQ" height="55.68" x="36.088" y="-132.16"></use>
			<g transform="rotate(180)">
				<use xlink:href="#VSQ" height="32" x="-114.4" y="-156"></use>
				<use xlink:href="#SSQ" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#SSQ" height="55.68" x="36.088" y="-132.16"></use>
			</g>
			<use xlink:href="#XSQ" stroke="#44F" fill="none"></use>
		</svg>
		`;
	let d1 = mDiv();
	d1.innerHTML = html;
	mAppend(dTable, d1);
}
function test10_verrueckt() {
	let styles = { bg: 'yellow', fg: 'red', border: 'random', thickness: 20, shadow: 'green', rotate: 45, scale: 2 };
	let html = `
			<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			class="card"
			face="QS"
			height="100%"
			preserveAspectRatio="none"
			viewBox="-120 -168 240 336"
			width="100%"
			fill="#ffff00"
			stroke="#ff0000"
			>
			<defs><rect id="XSQ" width="164.8" height="260.8" x="-82.4" y="-130.4"></rect></defs>
			<symbol id="VSQ" viewBox="-500 -500 1000 1000" preserveAspectRatio="xMinYMid">
				<path
					d="M-260 100C40 100 -40 460 260 460M-175 0L-175 -285A175 175 0 0 1 175 -285L175 285A175 175 0 0 1 -175 285Z"
					stroke="black"
					stroke-width="80"
					stroke-linecap="square"
					stroke-miterlimit="1.5"
					fill="none"
				></path>
			</symbol>
			<symbol id="SSQ" viewBox="-600 -600 1200 1200" preserveAspectRatio="xMinYMid">
				<path
					d="M0 -500C100 -250 355 -100 355 185A150 150 0 0 1 55 185A10 10 0 0 0 35 185C35 385 85 400 130 500L-130 500C-85 400 -35 385 -35 185A10 10 0 0 0 -55 185A150 150 0 0 1 -355 185C-355 -100 -100 -250 0 -500Z"
					fill="black"
				></path>
			</symbol>
			<symbol id="SQ1" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					fill="#FC4"
					d="M635.39648,0 851.86719,312.33789C895.10685,299.11869 938.83136,290.34833 975,285 924.90197,188.22401 899.89439,94.153799 874.11133,0ZM295.52539,27.285156C246.27551,180.9799 142.75435,335.54042 209.25195,483.08398l-17.43359,13.44922c1.76531,151.10099 30.08527,286.57163 74.54102,398.60938 18.12594,21.287 38.56227,42.11564 61.47851,64.11523 3.61128,3.46683 7.28461,6.96262 11.33789,10.61914L901.47852,970l-0.41407,-0.51953c-0.12219,-0.138 -0.23745,-0.27418 -0.35937,-0.41211 15.27725,17.28278 32.6506,35.12574 52.3164,53.54294C1030.1434,1094.8366 1080,1150 1130,1250c52.9819,-70.6425 98.186,-110.0972 170,-152.7871v-37.6016c-68.6196,39.3343 -116.9422,76.6549 -164.5547,131.9668 -44.9491,-77.8482 -93.9175,-130.6069 -160.20897,-192.68943 -76.05982,-71.23062 -114.27421,-131.59148 -129.3711,-180.42578 -15.09688,-48.8343 -8.90849,-86.60287 7.94922,-120.96875 28.31708,-57.72677 91.51367,-102.35489 139.07032,-133.86328l-26.7793,-21.49024C896.53697,588.11019 793.22595,665.67487 806.10938,786.48828L699.86133,787.5 568.0625,939.89258 429.48438,939.86328C578.06034,763.29892 745.82856,594.02803 899.1875,455.09961l-9.56836,-10.99023c-28.86687,-3.02061 -55.64392,-10.37642 -80.51758,-21.42774 -1.77605,4.17261 -4.43372,8.02096 -7.94336,11.23438C665.11643,558.39566 525.46983,665.166 419.78906,829.43164L392.45703,811.84766C501.69344,642.05529 644.58723,533.12674 779.21875,409.9375l17.51367,6.86328c-17.74437,-8.98707 -34.48695,-19.8921 -50.29101,-32.48437 -124.71285,29.03155 -208.27492,36.48099 -267.26758,31.98242 0,0 -19.31641,14.60547 -29.31641,14.60547 -15,0 -25.58008,-5.64453 -30.58008,-5.64453 -5,0 -10,5 -25,5 -15,0 -30,-25 -40,-50 -1.51422,-2.01895 -3.01443,-4.07919 -4.23242,-5.79297l-39.21875,30.25586 10.50977,-0.54493c7.17244,138.45299 -1.25836,281.23598 43.02929,408.13477l-27.41796,17.66602c-1.32891,-2.13106 -2.43311,-4.45616 -3.26758,-6.95704C288.22851,692.7888 295.29422,552.70428 289.59766,421.09961l-69.70313,53.77344 20.20508,-16.59375C187.08454,297.85994 265.54029,182.85491 300.0957,58.960938ZM85,80c-55.000004,50 -100.000004,145 -35,145 9.343263,0 15.215964,-5.70961 19.599609,-15.58984l-0.05469,54.80664C63.116922,255.80043 55.218717,250 45,250c-34.999996,0 -39.999996,70 -5,70 24.46345,0 22.957588,-43.08208 10.8125,-44.93164 53.48157,5.0855 -15.809214,250.16385 -15.302734,296.2207 0.268193,24.38822 6.628431,48.73678 31.46289,56.20899C48.176742,632.49354 35,645.1697 35,660 35,674.30844 47.265656,686.61054 65.384766,692.25586 41.674751,699.57565 35,720.74035 35,740 35,776.24391 48.1356,836.13212 55.517578,866.33008 82.604368,846.54619 106.08392,825.42866 128.83984,800.21875 132.14826,778.91478 135,756.88968 135,740 135,720.60063 128.2285,699.26867 104.15234,691.95898 118.02756,686.75065 129.28173,676.58841 135,660c0,-14.83344 -13.18185,-27.51102 -30.78711,-32.89844 24.05654,-8.65812 30.01787,-32.21714 30.27734,-55.8125C134.99671,525.23221 65.705931,280.15386 119.1875,275.06836 107.04241,276.91792 105.53655,320 130,320c35,0 30,-70 -5,-70 -10.83425,0 -19.06007,6.52154 -25.074219,15.02148L100.25195,209.2793C104.49041,218.99863 110.42097,225 120,225 185,225 140,130 85,80Zm641.48047,287.83789c-86.62544,19.83455 -151.78802,28.17022 -200.80469,29.24219 -14.2248,6.27415 -30.07191,11.92239 -45.7793,18.95898 58.99266,4.49857 142.55438,-2.95118 267.19727,-32.03711 -7.7527,-5.20716 -14.38853,-10.76914 -20.61328,-16.16406zm-370.49024,88.29102c29.62693,11.74538 64.9141,21.55877 110.0293,25.15039 51.3028,4.08421 115.55629,0.48608 200.56445,-14.4043C568.01187,553.99998 468.15967,644.25595 384.25,765.71289 359.23837,670.90747 359.53927,564.67648 355.99023,456.12891ZM1182.5,473.75c-24.0403,0 -48.0562,17.34722 -29.8594,52.02344A45,42.5 0 0 1 1182.5,515a45,42.5 0 0 1 29.8652,10.76367C1230.552,491.09427 1206.538,473.75 1182.5,473.75Zm-54.6914,47.48047c-45.2477,0.77462 -37.6424,97.7377 22.793,66.2168A45,42.5 0 0 1 1137.5,557.5a45,42.5 0 0 1 13.1113,-29.94336c-8.6891,-4.53343 -16.2978,-6.43753 -22.8027,-6.32617zm109.3828,0c-6.5027,-0.11132 -14.1076,1.79222 -22.793,6.32226A45,42.5 0 0 1 1227.5,557.5a45,42.5 0 0 1 -13.1094,29.94336c60.4429,31.53409 68.0505,-65.43824 22.8008,-66.21289zm-24.8301,67.99414A45,42.5 0 0 1 1182.5,600 45,42.5 0 0 1 1152.6348,589.23633c-11.9875,22.85174 -5.6311,38.16959 6.9726,45.95898 -23.6821,34.46419 -48.941,66.02584 -74.9492,96.20703C1079.1653,675.69528 1058.4509,645.45798 1005,670c37.225,16.12754 38.5709,70.31699 75.9492,65.69727 -5.8664,6.76063 -11.768,13.45662 -17.6972,20.10156l15.207,1.88672c7.2551,-8.19076 14.4623,-16.46748 21.6113,-24.85352 5.1929,39.08146 35.0698,-7.57452 67.2129,-5.5 -16.4802,-41.743 -32.0495,-10.50502 -66.4785,4.63672 24.5708,-28.86629 48.4073,-59.08334 70.8027,-91.95508 26.5679,6.12811 61.7407,-10.79807 40.7539,-50.78906zM1255,655c-32.9633,38.74398 -63.8666,77.97963 -125,110 16.8191,30.21345 26.6544,60.2083 30,90 47.2312,18.32372 82.8871,51.83723 115,90 2.3419,-37.0436 -4.2974,-71.38724 -30,-100 23.3498,-4.99857 40.0029,-20.01884 50,-45 -14.5281,-24.40208 -35.9759,-32.69918 -60,-35 44.8752,-32.16719 30.2665,-71.33926 20,-110zM811.88477,817.78516c10.86486,41.66548 35.34229,88.00659 78.58593,139.42382 -4.92291,-5.82285 -9.66276,-11.58316 -14.2207,-17.2539l-286.46289,-0.0586 64.60547,-0.45703 75.1914,-86.93945 93.88282,-0.33984c-4.9028,-11.9067 -8.74345,-23.39087 -11.58203,-34.375zM377.5,842.5c4.42321,0 9.31831,2.00257 14.86719,9.24023C397.91606,858.97789 402.5,871.0223 402.5,885c0,13.9777 -4.58394,26.0221 -10.13281,33.25977C386.81831,925.49743 381.92321,927.5 377.5,927.5c-4.42321,0 -9.31831,-2.00257 -14.86719,-9.24023C357.08394,911.0221 352.5,898.9777 352.5,885c0,-13.9777 4.58394,-26.02211 10.13281,-33.25977C368.18169,844.50257 373.07679,842.5 377.5,842.5Z"
				></path>
			</symbol>
			<symbol id="SQ2" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					fill="red"
					d="M557.51758,0 805.9668,330.45703 851.01367,311.99805 635.36719,0Zm78.02148,0 63.76563,90.75C709.99966,65.000167 725,65 725,65 716.50651,26.779299 728.31462,17.104416 733.20117,0ZM820,265 851.86719,312.33789C877.5079,304.49903 903.31958,298.22492 927.6543,293.26562 907.75762,290.72138 885.5191,284.6565 865,270c-10,5 -30,10 -45,-5zm99.12695,216.28711C764.14521,621.01648 595.55342,787.07572 470.35547,940.01172L525,940 685,755h120.41797l-0.0547,-0.41211c6.37431,-102.76161 97.50088,-170.65811 160.41211,-212.22851zm-727.41992,15.5625 -59.86133,46.34766 -0.39648,0.30468c1.93099,12.0459 3.10803,21.69313 3.04101,27.78711 -0.25947,23.59536 -6.2208,47.15438 -30.27734,55.8125C121.81815,632.48898 135,645.16656 135,660 129.28173,676.58841 118.02756,686.75065 104.15234,691.95898 128.2285,699.26867 135,720.60063 135,740c0,16.88968 -2.85174,38.91478 -6.16016,60.21875 -1.95154,2.162 -3.90854,4.29257 -5.87304,6.39453C138.56664,789.96704 153.92711,771.43051 170,750 200.25102,810.50205 230.44886,854.59181 266.85742,895.71484 221.90196,783.10482 193.58426,647.63449 191.70703,496.84961ZM44.53125,610.36133 0,644.61523V902.7832C30.797744,884.46615 56.707359,866.73637 80.427734,846.89844 72.427991,853.57027 64.158102,860.01913 55.517578,866.33008 48.1356,836.13212 35,776.24391 35,740 35,720.74035 41.674751,699.57565 65.384766,692.25586 47.265656,686.61054 35,674.30844 35,660 35,645.1697 48.176742,632.49354 66.972656,627.49805 56.528563,624.35562 49.361734,618.22105 44.53125,610.36133Zm1190.09765,68.79687 -1.1211,1.04688c-20.0542,23.0427 -41.8711,45.665 -71.7441,65.72265 27.117,39.37142 36.6532,80.37363 27.7441,123.12891 25.4392,14.76465 47.2329,33.87001 67.875,55.8418 -10.0896,-28.95393 -26.9566,-68.05217 -64.6191,-89.36328C1229.865,829.72137 1245.3631,819.51581 1260,800c-28.5778,-21.24841 -50.4759,-15.94491 -77.3027,-15.66992 39.149,-21.89578 49.9371,-64.78262 51.9316,-105.17188zM110.74609,819.23828c-0.7889,0.78628 -1.58065,1.56702 -2.37304,2.3457 0.792,-0.77791 1.58362,-1.55961 2.37304,-2.3457zm-5.15234,5.05078c-0.76819,0.74251 -1.53476,1.48679 -2.30664,2.22266 0.77112,-0.73534 1.53841,-1.48017 2.30664,-2.22266zm-5.26172,5.00586c-2.077449,1.94603 -4.165139,3.87648 -6.273436,5.7793 2.104356,-1.90192 4.194747,-3.83083 6.273436,-5.7793zm-6.539061,6.02149c-1.467973,1.32281 -2.945132,2.63598 -4.429688,3.93945 1.482456,-1.30407 2.961518,-2.61456 4.429688,-3.93945zM377.5,862.5a11,22.5 0 0 0 -11,22.5 11,22.5 0 0 0 11,22.5 11,22.5 0 0 0 11,-22.5 11,22.5 0 0 0 -11,-22.5zm225.17578,127.46484a10,10 0 0 0 -10,10 10,10 0 0 0 10,9.99996 10,10 0 0 0 10,-9.99996 10,10 0 0 0 -10,-10zM420,990a10,10 0 0 0 -10,10 10,10 0 0 0 10,10 10,10 0 0 0 10,-10 10,10 0 0 0 -10,-10zm91.13281,0.41016a10,10 0 0 0 -10,10.00004 10,10 0 0 0 10,10 10,10 0 0 0 10,-10 10,10 0 0 0 -10,-10.00004z"
				></path>
			</symbol>
			<symbol id="SQ3" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					fill="#44F"
					d="M472.5,150a12.5,20 0 0 0 -12.5,20 12.5,20 0 0 0 12.5,20 12.5,20 0 0 0 12.5,-20 12.5,20 0 0 0 -12.5,-20zm-140,5a12.5,20 0 0 0 -12.5,20 12.5,20 0 0 0 12.5,20 12.5,20 0 0 0 12.5,-20 12.5,20 0 0 0 -12.5,-20zm23.49023,301.12891c3.54904,108.54757 3.24814,214.77856 28.25977,309.58398 83.90967,-121.45694 183.76187,-211.71291 282.33398,-298.83789 -85.00816,14.89038 -149.26165,18.48851 -200.56445,14.4043 -45.1152,-3.59162 -80.40237,-13.40501 -110.0293,-25.15039zm42.92579,22.92187c22.57573,0.10326 52.52779,2.34383 83.49804,6.2461 65.74558,8.28415 118.15335,21.65893 117.05469,29.87304 -1.09829,8.2139 -56.30922,5.07893 -122.05273,-3.20508 -65.73948,-8.28354 -117.1185,-18.57868 -116.02735,-26.79296 0.53448,-4.02047 14.07178,-6.22853 37.52735,-6.1211zM1117.5,492.5c2.4011,8.40385 4.2266,18.24941 5.4746,28.84375v0.36133c7.3876,-1.36391 16.4655,0.0837 27.2324,5.62304l-21.2675,-21.26757a1.50015,1.50015 0 0 1 1.0449,-2.57617 1.50015,1.50015 0 0 1 1.0761,0.45507l21.2676,21.26758c-5.5291,-10.74776 -6.9807,-19.81297 -5.6289,-27.19336 -10.7286,-1.24895 -20.7021,-3.08593 -29.1992,-5.51367zm130,0c-8.4251,2.40718 -18.2988,4.23414 -28.9238,5.48242h-0.2793c1.3613,7.38557 -0.087,16.46062 -5.6231,27.22266l21.2657,-21.26563a1.50015,1.50015 0 0 1 1.0312,-0.45312 1.50015,1.50015 0 0 1 1.0898,2.57422l-21.2675,21.26757c10.7565,-5.53399 19.8272,-6.98416 27.2109,-5.62695v-0.17187c1.2486,-10.6649 3.081,-20.57644 5.4961,-29.0293zm-853.59961,15.25781c20.38428,0.10329 47.42876,2.34386 75.39258,6.2461 59.36368,8.28422 106.68388,21.65899 105.69141,29.87304 -0.99271,8.21355 -49.91699,8.15671 -109.27735,-0.12695 -59.36371,-8.28422 -106.68391,-21.659 -105.69141,-29.87305 0.48636,-4.01928 12.70935,-6.22659 33.88477,-6.11914zm7.69531,34.67969c15.09367,-0.0753 32.61454,0.81411 50.47852,2.5625 51.50146,5.04084 94.00823,14.75226 93.67578,23.00391 -0.32891,8.2521 -42.34749,10.85536 -93.84961,5.81445C400.39893,568.77752 358.91755,558.00165 359.25,549.75c0.20345,-5.08688 15.52034,-7.17888 42.3457,-7.3125zm590.81446,21.09375c-26.28817,17.83124 -58.00395,39.71623 -85.84375,65.82227L1063.252,755.79883c5.9292,-6.64494 11.8308,-13.34093 17.6972,-20.10156C1043.5709,740.31699 1042.225,686.12754 1005,670c53.4509,-24.54202 74.1653,5.69528 79.6582,61.40234 18.288,-21.22222 36.2025,-43.13214 53.4609,-66.25 -50.4965,-31.89003 -99.3677,-65.63189 -145.70894,-101.62109zm92.24804,167.87109c-1.2353,1.43353 -2.4703,2.86748 -3.709,4.29493 1.3064,-0.16146 2.6533,-0.388 4.0508,-0.69727 -0.1038,-1.21628 -0.2241,-2.40447 -0.3418,-3.59766zm-21.4062,24.39649 1.3242,1.02344C1092.8236,758.22045 1130,765 1130,765c33.2353,-17.40792 57.5278,-36.95014 78.082,-57.38477 -19.9562,-11.65548 -39.7017,-23.55345 -59.2109,-35.71875 -15.5528,20.88792 -31.6462,40.7815 -48.0664,60.07227 34.429,-15.14174 49.9983,-46.37972 66.4785,-4.63672 -32.1431,-2.07452 -62.02,44.58146 -67.2129,5.5 -7.149,8.38604 -14.3562,16.66276 -21.6113,24.85352zM399.88477,574.98828c12.13924,-0.0753 26.23048,0.81416 40.59765,2.5625 41.42116,5.04089 74.78321,15.81675 74.51563,24.06836 -0.26463,8.25206 -34.05885,10.85531 -75.48047,5.81445 -41.42116,-5.04089 -74.78321,-15.81675 -74.51563,-24.06836 0.16364,-5.08693 13.30756,-8.24338 34.88282,-8.37695zm814.90823,12.6836 21.2675,21.26757a1.50015,1.50015 0 1 1 -2.121,2.1211l-21.2657,-21.26563c5.5369,10.76367 6.9837,19.84044 5.6211,27.22656h0.3223c10.6094,1.24816 20.4685,3.07443 28.8828,5.47852 -2.4278,-8.49731 -4.2627,-18.47029 -5.5117,-29.19922 -7.3807,1.35234 -16.4468,-0.0994 -27.1953,-5.6289zm-64.5879,0.002c-10.7501,5.53028 -19.8161,6.98044 -27.1973,5.62695v0.0723c-1.2488,10.70195 -3.0853,20.64836 -5.5078,29.12695 8.4975,-2.42785 18.4701,-4.26471 29.1992,-5.51367 -1.3518,-7.38039 0.1,-16.44561 5.6289,-27.19336l-21.2676,21.26758a1.50015,1.50015 0 1 1 -2.121,-2.1211zM399.95117,608.2207c7.75591,-0.014 16.33902,0.59569 25.04883,1.7793 30.51033,4.14665 55.19775,16.74619 55.24414,25 0.0491,8.25469 -24.64792,11.5847 -55.16016,7.4375 -30.51033,-4.14665 -55.28173,-14.19933 -55.32812,-22.45312 -0.0324,-5.62262 11.68692,-11.73096 30.19531,-11.76368zm2.94141,36.28321c3.92832,-0.0157 8.00124,0.15115 12.10742,0.49609 25.08573,2.10744 44.77796,7.02839 45.42188,14.97852 0.64298,7.94981 -19.17087,12.68576 -44.25586,10.57812 -25.08573,-2.10744 -45.94398,-10.26081 -46.5879,-18.21094 -0.52278,-6.4668 13.79255,-7.76393 33.31446,-7.84179zm-6.3711,30.78125c1.53788,10e-4 3.10151,0.0612 4.67383,0.17968 15.24356,1.1523 28.12847,7.43255 28.7793,14.02735 0.6519,6.59512 -11.17778,11.00764 -26.42188,9.85547 -15.24356,-1.1523 -28.12847,-7.43255 -28.77929,-14.02735 -0.57317,-5.81151 8.60794,-10.04793 21.74804,-10.03515zm-2.7207,30.4707c0.97501,0.002 1.96625,0.0499 2.96289,0.14453 9.66123,0.91446 17.82809,5.89851 18.24219,11.13281 0.4126,5.23472 -7.08576,8.73687 -16.74805,7.82227 -9.66123,-0.91446 -17.82809,-5.89851 -18.24219,-11.13281 -0.3645,-4.61356 5.45528,-7.97697 13.78516,-7.9668zm906.19922,0.0781 -34.2773,2.85547c0.2249,20.00253 -6.7832,39.15319 -30.7188,56.31055 24.0241,2.30082 45.4719,10.59792 60,35 -9.9971,24.98116 -26.6502,40.00143 -50,45 19.6816,21.91005 28.1768,47.18324 30.0293,74.45312l0.01,0.008 24.957,11.09375zm-167.2656,64.20508c0.2372,0.44647 0.4708,0.89347 0.7051,1.33985 -0.2343,-0.44637 -0.4679,-0.89339 -0.7051,-1.33985zm3.041,5.88282c0.083,0.16606 0.171,0.33199 0.2539,0.49804 -0.083,-0.16604 -0.1705,-0.33202 -0.2539,-0.49804zm2.6758,5.48437c0.2147,0.45253 0.425,0.90499 0.6367,1.35742 -0.2117,-0.45239 -0.4219,-0.90493 -0.6367,-1.35742zm2.455,5.32422c0.1795,0.40036 0.3641,0.80089 0.5411,1.20117 -0.177,-0.40029 -0.3615,-0.80081 -0.5411,-1.20117zm2.5958,5.98437c0.2099,0.50184 0.413,1.00415 0.6191,1.50586 -0.2062,-0.5018 -0.4092,-1.00393 -0.6191,-1.50586zm2.0703,5.11719c0.1975,0.50277 0.4,1.00516 0.5937,1.50781 -0.1937,-0.50252 -0.3962,-1.00516 -0.5937,-1.50781zm2.3418,6.1875c0.1922,0.53072 0.3764,1.06121 0.5644,1.5918 -0.188,-0.53055 -0.3722,-1.06112 -0.5644,-1.5918zm1.7324,4.96485c0.2042,0.60477 0.4106,1.20984 0.6094,1.81445 -0.1988,-0.60461 -0.4051,-1.20971 -0.6094,-1.81445zm2.0273,6.26562c0.1846,0.60177 0.3579,1.20308 0.5371,1.80469 -0.1792,-0.60139 -0.3525,-1.20313 -0.5371,-1.80469zm1.4688,5.00977c0.1799,0.63781 0.3593,1.27644 0.5332,1.91406 -0.174,-0.63786 -0.3532,-1.27602 -0.5332,-1.91406zM377.5,842.5c-4.42321,0 -9.31831,2.00257 -14.86719,9.24023C357.08394,858.97789 352.5,871.0223 352.5,885c0,13.9777 4.58394,26.0221 10.13281,33.25977 5.54888,7.23766 10.44398,9.24023 14.86719,9.24023 4.42321,0 9.31831,-2.00257 14.86719,-9.24023C397.91606,911.0221 402.5,898.9777 402.5,885c0,-13.9777 -4.58394,-26.02211 -10.13281,-33.25977C386.81831,844.50257 381.92321,842.5 377.5,842.5Zm-0.27344,4.79492c2.95574,0.0879 5.94922,5.08008 5.94922,10.70508 10.93128,-0.11104 14.67749,3.31056 5.67578,13 13.69744,3.7436 10.6454,8.69968 2.83789,14 7.80751,5.30032 10.85955,10.2564 -2.83789,14 9.00171,9.68944 5.2555,13.11104 -5.67578,13 0,10 -9.4596,18 -11.35156,0 -10.93128,0.11104 -14.67748,-3.31056 -5.67578,-13 -13.69744,-3.7436 -10.6454,-8.69968 -2.83789,-14 -7.80751,-5.30032 -10.85955,-10.2564 2.83789,-14 -9.0017,-9.68944 -5.2555,-13.11104 5.67578,-13 0.82773,-7.875 3.10344,-10.77344 5.40234,-10.70508zm352.35742,5.20508 -75.1914,86.93945 43.0039,-0.041L744.44531,885H840l-15,-32.5zm29.72266,65 -19.23047,22.23633L876.25,939.95508 860,917.5Zm-104.13476,52.41992 -315.75977,0.17969c2.43984,2.47881 4.98787,4.87423 7.56641,7.28906 15.37025,14.39437 29.32058,28.43253 41.91015,42.12693 1.06974,-4.4442 6.04965,-11.1309 16.11133,-19.5156 -30,-25 -15,-34.99999 15,-15 30,-19.99999 45,-10 15,15 30,25 15,35 -15,15 -11.06914,7.3794 -20.08451,10.6644 -25.5625,10.6289 1.31057,1.4627 2.62767,2.9262 3.90625,4.3809l256.41797,-0.1328zm-170.01172,4.44531C490.60938,974.21875 499.75,977.5 511,985c30,-19.99999 45,-10 15,15 30,25 15,35 -15,15 -30,20 -45,10 -15,-15 -18.75,-15.625 -19.92188,-25.39063 -10.83984,-25.63477zm91,0C581.60938,974.21875 590.75,977.5 602,985c30,-19.99999 45,-10 15,15 30,25 15,35 -15,15 -30,20 -45,10 -15,-15 -18.75,-15.625 -19.92188,-25.39063 -10.83984,-25.63477z"
				></path>
			</symbol>
			<symbol id="SQ4" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					fill="black"
					d="M499.67383,0C598.83088,212.42554 698.5156,423.78371 891.07812,444.24805L557.50781,0ZM299.89844,59.855469C265.54099,182.85387 187.08454,297.85994 240.09961,458.2793L349.875,372.94531C322.20549,333.64118 300,282.28964 300,255c0,-20 5.00324,-149.9992 5,-155 -10e-4,-2.004308 -2.41143,-19.27436 -5.10156,-40.144531zM899.91016,454.8418C746.55122,593.77022 578.78424,763.04072 429.50781,939.46875l40.84766,0.54297C595.55342,787.07576 764.14431,621.01748 918.95508,481.37891Zm65.79101,87.45703c-28.87179,19.18723 -64.12524,44.12835 -93.97851,75.52344l25.55078,20.04296c30.22964,-29.84438 65.96002,-54.59002 95.59961,-73.97851 -9.28135,-6.87909 -18.47109,-14.10656 -27.17188,-21.58789zM685,755 525.10156,939.88281 570,940 699.86133,787.5H806.65039L805,755Z"
				></path>
			</symbol>
			<symbol id="SQ5" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					stroke="#44F"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="6"
					fill="none"
					d="M435,885A57.5,75.000002 0 0 1 377.5,960.00001 57.5,75.000002 0 0 1 320,885 57.5,75.000002 0 0 1 377.5,810 57.5,75.000002 0 0 1 435,885v0M417.07718,940H876.02627M308.27069,940h28.75722M339.49097,970H901.47783M131.84482,543.19629 351.03451,374.58883M6.9310566e-5,644.61533 44.832165,610.1291M1138.1663,665.18229C1077.9926,627.18313 1020.1253,586.55302 965.29601,542.45758M1208.5796,707.90733c-20.1878,-11.78458 -40.1599,-23.81534 -59.8906,-36.12132M557.51806,-3.5577172e-4 965.44559,542.57786M1299.7291,1059.765c-68.4773,39.2778 -116.7334,76.5733 -164.2838,131.8131 -44.9491,-77.8482 -93.9175,-130.6069 -160.20897,-192.68943 -76.05982,-71.23062 -114.27421,-131.59148 -129.3711,-180.42578 -15.09688,-48.8343 -8.90849,-86.60287 7.94922,-120.96875 28.31708,-57.72677 91.51285,-102.35515 139.0695,-133.86354M499.68528,0.03748108C598.83742,212.45251 698.51437,423.77834 890.34164,443.851M364.36489,812.31243C320.07724,685.41364 328.50886,542.63024 321.33642,404.17725c76.71711,39.85219 163.35704,77.44074 457.8821,5.76082C644.587,533.12731 501.69292,642.05444 392.45651,811.84681M355.97656,456.125c29.62956,11.74764 64.92126,21.56216 110.04297,25.1543 51.30556,4.08443 115.56309,0.48617 200.57813,-14.40625 -98.57798,87.12824 -198.39177,177.48156 -282.2461,298.86133 -24.96545,-94.92731 -24.7974,-201.06283 -28.375,-309.60938v0M867.34252,440.4065C719.62961,574.07588 560.4386,730.57461 436.09373,879.43791M223.89186,472.86906c-0.82324,183.16931 37.98603,343.48203 98.11552,466.27071M191.49798,496.71315c2.08648,150.92196 30.40471,286.39171 75.55251,398.73891M429.507,939.46794C578.78343,763.03991 746.55158,593.76963 899.91052,454.84121M470.35494,940.01166C595.55289,787.0757 764.14488,621.01728 918.95565,481.37871M525,940 685,755h120.41872M567.92551,940.0502 699.86133,787.5h106.78892M611.46541,939.39021 714.72266,820h97.2642M654.39213,939.43943 729.58398,852.5h93.89714M697.39662,939.39902 744.44531,885h95.04566M740.07521,939.73575 759.30664,917.5H860M906.39152,629.42293 1063.7852,756.67736M871.92369,617.813 1043.2441,757.01082M459.61865,481.34795C414.86903,573.51288 406.45192,669.62669 385,765M303.65592,-0.00221915C259.09343,162.78907 138.61386,327.07777 209.42337,483.4732M240.09997,458.27954C187.0849,297.86018 265.54056,182.85405 300.09597,58.960082M805.81085,330.134c14.88787,-6.44544 30.42237,-12.16006 46.14865,-17.2138M0.09725143,902.73906C71.866196,860.06685 117.03718,820.61709 170,750c50,100 99.8567,155.1639 176.97865,227.3892 281.56105,263.6842 94.15072,409.6105 -13.08443,480.4695M377.5,842.5c4.42321,0 9.31831,2.00257 14.86719,9.24023C397.91606,858.97789 402.5,871.0223 402.5,885c0,13.9777 -4.58394,26.0221 -10.13281,33.25977C386.81831,925.49743 381.92321,927.5 377.5,927.5c-4.42321,0 -9.31831,-2.00257 -14.86719,-9.24023C357.08394,911.0221 352.5,898.9777 352.5,885c0,-13.9777 4.58394,-26.02211 10.13281,-33.25977C368.18169,844.50257 373.07679,842.5 377.5,842.5v0M1130,765c16.8191,30.21345 26.6544,60.2083 30,90 47.2312,18.32372 82.8871,51.83723 115,90 2.3419,-37.0436 -4.2974,-71.38724 -30,-100 23.3498,-4.99857 40.0029,-20.01884 50,-45 -14.5281,-24.40208 -35.9759,-32.69918 -60,-35 44.8752,-32.16719 30.2665,-71.33926 20,-110 -32.9633,38.74398 -63.8666,77.97963 -125,110v0M1300,705.83334l-34.3239,2.86032M1299.9997,930.55544l-26.1711,-11.63161M1192.7269,836.42558c37.6985,20.41997 54.5672,59.51932 65.2796,89.01033M1182.9686,784.9233c26.555,-0.86899 48.4536,-6.17171 77.0314,15.0767 -14.6369,19.51581 -30.1358,29.72065 -67.2011,34.6433M1234.6287,679.15791c-1.9945,40.38926 -12.7829,83.27561 -52.2037,104.5774M1162.3431,745.42454c26.5383,39.87481 36.0743,80.87688 26.979,123.43436M1130,765c0,0 -82.1675,-15 -95,-5 -12.8325,10 -32.9691,31.30714 -40,40 -31.97044,39.52731 3.64509,49.72935 20,30M1050,800c-59.31161,25.45028 -64.22618,120.61499 20,25M1041.1933,853.52948c-14.9444,32.29436 0.7581,60.30105 58.5,-5.24847M1062.1853,882.59071C1040.9944,921.29246 1103.755,918.14402 1160,855M1063.2524,755.79961c33.572,-37.62441 66.2866,-76.82735 96.4461,-120.73492M1078.4582,757.6865c32.4929,-36.68328 64.0954,-75.00591 93.2554,-117.82589M1085,735c-4.9523,-58.0017 -25.4042,-90.06768 -80,-65 38.526,16.69119 38.6175,74.15849 80,65v0M1005,670c37.8073,-6.25375 56.1399,40.79694 80,65M1100,732.33169c35,-15 50.6726,-47.07119 67.2824,-5 -32.2824,-2.08351 -62.2824,45 -67.2824,5v0M1100.0662,732.84533c26.3257,8.26747 52.4616,-23.9051 67.2162,-5.51364M1155.0001,585.00001C1080.0001,630 1080,484.99999 1155,530c-45,-75 100,-75 55,0 75,-45 75,100 10e-5,55 45,75.00001 -100.0001,74.99999 -55,10e-6v0M1242.5,557.5c-60,0 -60,0 -60,-60 0,60 0,60 -60,60 60,0 60,0 60,60 0,-60 0,-60 60,-60v0M1122.9743,521.34338c-1.248,-10.59434 -3.0726,-20.43952 -5.4737,-28.84337 8.5766,2.45046 18.6544,4.30045 29.4977,5.54996M1146.7554,616.97813c-10.7509,1.24908 -20.7424,3.08971 -29.255,5.52188 2.4225,-8.47859 4.2581,-18.42426 5.5069,-29.12621M1241.9485,592.9857c1.2496,10.84959 3.1002,20.93331 5.5519,29.5143 -8.4143,-2.40409 -18.2735,-4.23021 -28.8829,-5.47837M1218.5761,497.98319c10.625,-1.24828 20.4988,-3.07601 28.9239,-5.48319 -2.4151,8.45286 -4.2469,18.3639 -5.4955,29.0288M357.95908,386.26136c-4.7848,-2.30618 -9.52375,-4.6875 -14.28345,-7.12611M748.06895,383.93902C622.45119,413.08814 538.88863,420.5377 479.79194,417.07826M355.99023,456.12891c29.62693,11.74538 64.9141,21.55877 110.0293,25.15039 51.3028,4.08421 115.55629,0.48608 200.56445,-14.4043C568.01187,553.99998 468.15967,644.25595 384.25,765.71289 359.23837,670.90747 359.53927,564.67648 355.99023,456.12891v0M85,135c10.787262,31.12992 5,90 35,90 65,0 20,-95 -35,-145 -55.000004,50 -100.000004,145 -35,145 30,0 24.21273,-58.87008 35,-90v0M40,285c0,0 0,-10 10,-10 12.88094,0 15,45 -10,45 -34.999996,0 -29.999996,-70 5,-70 30,0 40,50 40,50 0,0 10,-50 40,-50 35,0 40,70 5,70 -25,0 -22.88094,-45 -10,-45 10,0 10,10 10,10M120,275c-55,2.66831 15,250 14.49097,296.289C134.16784,600.67311 125,630 85,630 45,630 35.832163,600.67311 35.509031,571.289 35,525 105,277.66831 50,275M70,264.98358V208.33333M100,265.18883V208.74384M103.20611,627.39263C121.81764,632.48836 135,645.16656 135,660c0,19.32997 -22.38576,35 -50,35 -27.614237,0 -50,-15.67003 -50,-35 0,-14.8303 13.176786,-27.50627 31.782083,-32.60414M65.931232,692.4756C41.674852,699.57662 35,720.74035 35,740c0,36.24391 13.136211,96.133 20.364326,126.34321M128.36935,800.67704C132.14739,778.91407 135,756.88968 135,740c0,-19.39937 -6.77205,-40.73054 -31.46191,-47.67672M256.89224,885h6.38602M1.1417102e-4,884.99999 28.737098,885M245.57157,870h11.90122M2.5229169e-5,870.00002 51.088175,870M233.67034,855h18.57752M4.1609595e-5,854.99999 52.539543,855M222.93022,840h24.09272M7.6084636e-5,840.00001 49.346532,840M212.77064,825h29.89819M4.2336546e-5,825.00002 46.443795,825M203.1916,810h34.54258M4.0905762e-6,810.00002 43.541058,810M194.48339,795h38.89668M129.46208,795h5.22493M-3.8457096e-5,795.00001 40.638321,795M186.06545,780h42.96051M131.78427,780h14.51368M-3.1733115e-5,780.00001 38.316131,780M178.22806,765h46.73407M133.81618,765h24.67327M10,765H36.284215M134.68701,750h86.50156M10,750H34.542573M134.97728,735h83.01828M15,735H35.12312M132.65509,720H205M15,720H37.844594M155,705h45M325,510c-11.82334,-17.57111 -24.45521,-31.94743 -45.42097,-47.16261 -21.67788,-15.73198 -32.01525,9.6364 -23.86278,22.70472M325,540c-13.68399,-15.7169 -40.72661,-39.31758 -62.25684,-51.80699 -20.39713,-11.83211 -26.52283,15.09906 -9.53546,27.99468M326.64903,572.53873c-13.68399,-15.7169 -40.42328,-39.85576 -62.25684,-51.80699 -33.04187,-18.08643 -43.83934,14.15892 -2.74316,31.80699M329.68204,632.14459c-13.68399,-15.7169 -40.42328,-39.85576 -62.25684,-51.80699 -30.81157,-16.86561 -37.65608,16.8659 -5.11631,35.80661M328.06764,597.68777c-13.86078,-13.59047 -33.31597,-27.70524 -50.77313,-39.51278 -22.07438,-14.9305 -34.10496,4.47364 -22.83565,17.22609M332.19576,659.38835c-13.77031,-13.23256 -32.62008,-26.88451 -49.58329,-38.35795 -24.04479,-16.26322 -36.17268,12.27173 -19.25152,25.31598M335.48063,686.60634C319.24375,673.64242 295.51352,659.7442 277.4252,650.3376c-31.2697,-16.26141 -36.88691,20.47944 -3.29829,37.12122M339.44241,709.94356C293.812,671.34406 241.20364,684.64228 285,715M345.57813,743.85785c-49.78299,-42.23381 -140.14002,-42.27022 -51.45386,5.50004M359.15379,797.42734C296.30783,757.35598 217.41506,767.9862 315.25691,808.08817M356.15219,815.71589c-43.41581,-18.1629 -92.79129,0.20988 -43.97099,13.65755M335.79649,833.55074c-36.46249,-11.38361 -55.92576,9.42664 -11.42381,20.21059M323.63736,467.38673c-7.1925,-7.58612 -15.51039,-14.89158 -25.85855,-22.4014 -17.52111,-12.71535 -26.71907,0.32727 -25.12324,12.4885M322.15877,428.22708c-1.31784,-1.00168 -2.67007,-2.00587 -4.05887,-3.01374 -19.41173,-14.0874 -28.60717,3.4419 -24.22651,16.36102M351.5017,769.34668c-41.8286,-32.62324 -87.13007,-22.98664 -57.82646,2.59886M396.50984,805.03398c97.55186,1.04019 65.93584,25.61549 21.19412,25.63392M410.20409,785.71584c31.87867,-11.92022 60.58013,-9.17207 74.95842,-1.62887 16.81695,8.82258 14.04006,24.2047 -26.16419,30.34906M430.54986,757.7319c58.57662,-11.0001 103.69453,13.94896 55.48459,26.1888M451.62343,729.60393c67.42086,-18.09697 125.45489,10.74224 49.42624,33.66324M469.15226,707.61747c69.25339,-23.47062 135.42699,4.47512 67.15155,28.14525M497.03474,675.73394c50.50234,-8.00778 88.6752,9.66559 55.551,28.0217M514.06286,656.56715c77.25396,-19.94453 157.95502,17.262 48.7626,27.75334M550.91529,618.31036c57.1762,-5.00205 100.00874,18.02731 40.2256,35.03407M568.89077,600.93936c75.24789,-19.79781 151.84194,14.60918 51.22446,34.33609M596.84001,574.15634c55.64482,-7.64299 102.46778,11.7471 64.24628,28.76475M620.73761,552.10789c71.56974,-16.51587 140.66537,14.62009 53.45997,34.06378M660.73433,515.56983c57.1151,-4.52529 99.00079,18.87447 36.45506,35.78648M684.38719,494.58861c73.88041,-16.89549 144.8643,16.89901 43.68109,36.08147M722.79564,460.82624c57.76542,-5.50387 101.75016,17.65976 42.02455,34.7974M748.43052,437.7647c68.01755,-11.92015 127.59071,17.4385 43.80212,36.02686M645.55164,273.86211C640.4516,285.47932 635.59316,297.26013 610,295c-14.37233,81.30224 -73.77303,98.38804 -130,120 0,0 -19.41945,15.64589 -29.41945,15.64589C435.58055,430.64589 425,425 420,425c-5,0 -10,5 -25,5 -15,0 -30,-25 -40,-50 -30,-40 -55,-96.04455 -55,-125 0,-20 5.003,-149.9992 5,-155 -0.002,-3.089335 -5.72781,-42.445846 -10.1037,-72.07356M622.93321,240.32144C616.61632,250.552 609.19352,264.74236 615,265c2.73428,0.12132 6.96971,-10.37759 10.24354,-19.90618M904.16018,494.81448l50.56379,54.17549M889.99031,508.2039l48.73454,52.21558M875.34795,521.08709l48.01937,51.44933M861.63691,534.96812l46.15447,49.45122M847.01655,547.87487l45.96336,49.24646M832.83302,561.24966l35.28817,37.80876M818.66315,574.63908l24.02599,25.74214M803.86532,587.3557l17.84203,19.11646M790.06402,601.14003l8.92784,9.56554M482.75862,925h55.41872M495.89491,910h55.00821M508.21018,895h55.82923M521.34647,880h55.41872M534.48276,865h55.41872M552.95566,845H585M790,820v32.5M765,820v32.5M740,820v32.5M703.26765,833.26765l22.578,22.578M684.08867,854.08867l23.39901,23.39901M665.93596,875.93596l22.78325,22.78325M648.19376,898.19376l22.578,22.578M629.22003,919.22003l20.73071,20.73071M791.29599,310.75526c15.62961,-6.29692 31.83381,-11.83473 48.11454,-16.69002M776.15664,290.35133c15.84539,-6.35519 32.2728,-11.93292 48.76488,-16.81275M760.82223,270.4856c16.18061,-6.50419 32.97255,-12.19625 49.8241,-17.16102M746.54814,252.22866c16.42632,-6.7965 33.54246,-12.73644 50.75899,-17.91046M739.12096,229.17409c11.71799,-4.608 23.73402,-8.79725 35.84163,-12.5995M726.54679,208.22774c8.46394,-3.2756 17.07495,-6.33535 25.75602,-9.1911M711.68624,188.33917c5.39484,-2.00758 10.85695,-3.94932 16.37032,-5.82515M900.40882,94.431781C848.5463,114.25376 796.72828,69.769511 761.4322,93.621964 715,125.00001 755,185 789.33498,165.18883 821.13528,146.84017 790,105 775,115c-9.30261,6.20174 -14.88842,18.30946 -10,25 6.18042,8.45885 10.48873,9.62814 20,5M901.46652,97.13303C861.76115,135.4564 879.34663,201.01228 842.74068,222.52055 794.42332,250.91 757.5027,188.96753 790.17065,166.51363c30.25635,-20.79631 54.6061,25.32412 39.1205,34.55428 -9.60379,5.72429 -22.93675,5.55043 -26.86936,-1.74304 -4.972,-9.22111 -4.17161,-13.61293 4.10189,-20.20332M765,180l90,-60M845,160c-10,-10 -45.467,-11.35662 -55,5 22.00764,-11.03808 34.76336,-24.75676 25,-45M795,230c25,30 50,20 75,10 24.05541,32.7653 64.66095,38.66637 105,45M725,130C715,110 740,85 755,75 749.14905,51.948962 757.70702,26.00987 766.59362,0.00490542M700,90c10,-25 25,-25 25,-25 -8.48271,-38.172217 3.28893,-47.867055 8.18679,-64.93099617M427.96416,0.01822477C445.06535,51.748024 483.31343,78.400493 539.31946,83.994433M446.67053,0.04362022C462.63103,38.843647 492.03631,61.699978 533.14043,70.683071M461.24526,0.01603427C475.22521,27.447203 496.92922,45.718691 525.58366,55.74792M476.99588,0.10806452C487.38028,16.453559 500.99836,28.964352 517.63646,37.893813M371.26432,0.04443925C356.34418,40.196712 340.91798,80.075485 304.69652,100.28589M355.60874,0.04353776C343.34293,31.804187 329.13875,61.845937 302.67098,80.298673M339.57059,0.02060224C329.73362,23.196287 317.89132,44.53011 299.71459,59.883794M325.15652,0.08430598C317.46458,14.722402 308.27692,27.964826 296.26758,38.544057M305,120c41.1016,-25.066138 61.56092,-14.28714 80,0 20,55 -15,110 -14.41945,151.6763 0.21559,15.47674 11.72696,13.44856 19.41945,13.3237 4.99934,-0.0811 15,10 15,10M305,125c29.58587,-20.97635 55.47603,-17.50669 80,-5M430,245c20,0 20,30 5,30 -40,5 -40,-10 -5,0M365,315v10l5,-5 -5,-5v0M455,320l5,-5v10l-5,-5v0M370,320c0,0 5,5 10,5 5,0 5.24415,-4.00984 12.32219,-4.4848C400,320 400,325 405,325c5,0 15,-10 20,-10 5,0 15,5 20,5h10M390,340c3.06957,28.45212 45.6136,8.68856 45,5 -5,5 -44.77199,31.85105 -45,-5v0M430,135c51.53607,-36.718861 85.86501,-16.18211 120,5 -35.40475,-25.98218 -85,-45 -120,-5v0M540,160C525,160 503.52953,134.61544 483.61398,136.45137 453.79885,139.1999 445,175 430,180 447.93464,158.59181 463.7944,151.78059 478.07024,151.93493 507.27438,152.25068 515,185 550,175M430,180c15,-10 32.80939,10.04302 45.17423,9.94542C504.08195,189.71723 519.49385,175 530,175M380,175c-20,0 -30.87367,-19.1648 -47.03192,-20.29027 -12.3413,-0.85961 -29.19452,12.61246 -29.19452,17.61246 0,7.07107 11.23734,20.70784 22.74316,23.25836C342.90794,199.21402 362.81244,175.3491 380,175v0M305,165c22.64276,-42.75014 64.95345,-9.49214 65,-5M820,265c15,15 35,10 45,5 20.5191,14.6565 42.75671,20.72048 62.68286,23.22939M851.86653 312.33707C895.10619 299.11787 938.83136 290.34833 975 285C924.90149 188.22308 899.90057 94.152754 874.11725 -0.0019513659 M851.86653,312.33707C895.10619,299.11787 938.83136,290.34833 975,285 924.90149,188.22308 899.90057,94.152754 874.11725,-0.00195137M851.01315,311.99775 635.36748,-2.4089679e-4M927.65339,293.26472C907.75671,290.72048 885.5191,284.6565 865,270c-10,5 -30,10 -45,-5"
				></path>
			</symbol>
			<symbol id="SQ6" preserveAspectRatio="none" viewBox="0 0 1300 2000">
				<path
					stroke="#44F"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="3"
					fill="none"
					d="M986.60333,811.20184l17.52527,26.83701m3.5763,5.47663 14.2883,21.88014M993.49031,800.86775c12.59499,20.81314 26.36539,39.79428 40.67199,57.93996m3.6811,4.63683c6.0574,7.57938 12.2001,15.02588 18.3803,22.41378m3.5795,4.26824c4.9357,5.87225 9.8895,11.71638 14.8372,17.56998M1002.2895,791.27746c25.6547,42.89167 56.3312,77.95704 86.5273,113.77117M1011.3206,782.24417c26.5981,44.89853 58.7236,81.18275 90.1523,118.55299M1018.2105,775.40469C1045.4382,820.51985 1078.1971,857.01507 1110,895M91.990234,409.08984c5.346491,34.39969 12.364566,69.89746 17.978516,99.54297 5.61395,29.64551 9.60751,54.84672 9.52344,62.49219 -0.14502,13.18721 -2.60383,25.09508 -7.35157,32.2207C107.39289,610.47133 101.33414,615 85,615 68.665861,615 62.607113,610.47133 57.859375,603.3457M95.230469,511.42383c2.783382,14.69817 5.162021,28.28252 6.812501,38.99023 1.65048,10.70771 2.46055,19.51658 2.44922,20.54688 -0.12561,11.42229 -3.03694,21.37127 -4.833987,24.06836 -1.554361,2.33286 -1.96098,2.67133 -3.316406,3.33203C94.986371,599.02203 91.780811,600 85,600M99.244141,641.85938C113.48363,645.75807 120,654.05348 120,660c0,3.87456 -2.13436,8.18273 -8.24609,12.46094C105.64218,676.73915 95.96981,680 85,680 74.030191,680 64.357824,676.73915 58.246094,672.46094M99.476562,706.76367c8.835718,2.48582 12.847888,6.43575 15.929688,11.99805C118.48805,724.32402 120,732.04575 120,740c0,15.20071 -2.70618,36.77501 -6.41016,58.11133M102.94922,660.2832C99.903483,662.33803 92.860098,665 85,665c-7.997241,0 -15.198086,-2.76015 -18.152344,-4.82812M102.28516,726.03125C103.52282,728.2651 105,733.94656 105,740c0,13.42041 -2.56634,34.6744 -6.189453,55.54492M726.75998,368.27894C639.85431,387.67178 574.6926,396.00751 524.83867,397.57475M715.61309,356.58894C649.94086,370.7787 597.12268,378.4618 554.16847,381.63062M703.03893,344.25945c-49.76763,10.38288 -91.8849,16.91189 -127.75629,20.52287M690.7875,331.76901c-38.30305,7.6982 -71.90839,13.04175 -101.50758,16.49148M680.13806,318.87243c-30.03631,5.82677 -57.08899,10.16495 -81.51547,13.25269M670.20516,305.76564c-23.347,4.36958 -44.8345,7.81564 -64.64196,10.45774M659.57286,292.71511c-18.04772,3.23925 -34.94556,5.91034 -50.78275,8.07274M390,380c11.94547,-13.95601 27.22073,-12.69836 45,0M440,195c10,15 30,15 45,15M310,205c50,25 60,-30 70,-30M350.01995,162.05531c1.14299,3.17833 1.7863,6.76631 1.7863,10.56373 0,13.03628 -7.58139,23.60427 -16.9335,23.60427 -9.35211,0 -16.93349,-10.568 -16.93349,-23.60427 0,-5.79795 1.49965,-11.10766 3.98776,-15.21654M488.55832,153.60687c1.90775,3.81995 3.02626,8.46304 3.02626,13.4703 0,13.03628 -7.58139,23.60427 -16.9335,23.60427 -9.35211,0 -16.93349,-10.568 -16.93349,-23.60427 0,-4.03258 0.72545,-7.82898 2.00436,-11.14943"
				></path>
				<use xlink:href="#SSQ" height="90" transform="translate(1188,935)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(1194,1043)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(1096,1033)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(1022,947)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(918,851)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
				<use xlink:href="#SSQ" height="90" transform="translate(897,726)scale(1,0.972)rotate(-40)translate(-45,-45)"></use>
			</symbol>
			<rect width="239" height="335" x="-119.5" y="-167.5" rx="12" ry="12" fill="white" stroke="black"></rect>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ1"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ1"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ2"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ2"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ3"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ3"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ4"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ4"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ5"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ5"></use>
			<use width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ6"></use>
			<use transform="rotate(180)" width="164.8" height="260.8" x="-82.4" y="-130.4" xlink:href="#SQ6"></use>
			<use xlink:href="#VSQ" height="32" x="-114.4" y="-156"></use>
			<use xlink:href="#SSQ" height="26.769" x="-111.784" y="-119"></use>
			<use xlink:href="#SSQ" height="55.68" x="36.088" y="-132.16"></use>
			<g transform="rotate(180)">
				<use xlink:href="#VSQ" height="32" x="-114.4" y="-156"></use>
				<use xlink:href="#SSQ" height="26.769" x="-111.784" y="-119"></use>
				<use xlink:href="#SSQ" height="55.68" x="36.088" y="-132.16"></use>
			</g>
			<use xlink:href="#XSQ" stroke="#44F" fill="none"></use>
		</svg>
	`;
	html = replaceAllFast(html, 'black', 'green');
	mDiv(dTable, {}, null, html);
	return;
}
function test100_partial_sequences() {
	let hand = ['AHn', '2Hn', '3Hn', '4Hn', '5Hn', '6Hn', '7Hn', '8Hn']; //jollies needed=0
	hand = ['AHn', '2Hn', '3Hn', '4Hn', '5Hn', '7Hn', '8Hn'];//jollies needed=1
	hand = ['4Hn', '7Hn', 'AHn', '2Hn', '5Hn', '6Hn', '3Hn', '8Hn']; //jollies needed=0
	hand = ['4Hn', '7Hn', 'AHn', '2Hn', '3Hn', '8Hn']; //jollies needed=2
	hand = ['4Hn', '7Hn', 'AHn', '2Hn', '9Hn', 'THn', 'QHn', '3Hn', '8Hn']; //jollies needed=2
	hand = ['4Hn', '7Hn', 'AHn', '2Hn', 'THn', 'QHn', '3Hn', '8Hn']; //jollies needed=3
	let items = hand.map(x => ferro_get_card(x));
	console.log('items', items);
	sortCardItemsToSequence(items);
}
function test11_cardcoloring() {
	let dTable = mBy('dTable'); clearElement(dTable);
	let card = ari_get_card('KHn');
	mAppend(dTable, iDiv(card));
	let d = mDiv(dTable, {}, null, queen_html());
}
function test12_try_svg() {
}
function test2_onclick_user() {
	let ms = 300;
	show_users(300);
	setTimeout(() => onclick_user('felix'), 400);
}
function test3_show_tables() {
	phpPost({ app: 'easy' }, 'tables');
}
function test4_direct_login_onclick_user() {
	show_users();
	let uplayer = localStorage.getItem('uname');
	if (isdef(uplayer)) onclick_user(uplayer);
}
function test7_add_hand_card() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	let card = prompt('enter card (eg. 8H');
	fen.players[uplayer].hand.push(card + 'n');
	take_turn_fen();
}
function test9_just_1_card() {
	let dTable = mBy('dTable')
	clearElement(dTable);
	let card = ari_get_card('QSn', 200);
	mAppend(dTable, iDiv(card));
	return card;
}
function testKartePositionSuit() {
	let dTable = mBy('dTable'); clearElement(dTable); mStyle(dTable, { hmin: 400 })
	let card = cBlank(dTable); let d = iDiv(card); let sz = card.h / 6;
	let i = 0;
	for (let suit of ['H', 'S', 'D', 'C']) {
		let s1 = mSuit(suit, d, { w: sz, h: sz }); //console.log('s1', s1);
		mPos(s1, sz * i, 0); i++;
	}
}
//#endregion test

//#region accuse
function accuse() {
	function state_info(dParent) {
		let histinfo = !isEmpty(Z.fen.generations) ? '(' + Z.fen.generations.map(x => x.color == 'white' ? '_' : x.color).join(', ') + ')' : '';
		dParent.innerHTML = Z.phase > Z.options.rounds ? `game over ${histinfo}!` : `generation ${Z.fen.phase}/${Z.options.rounds} ${histinfo}`; //`phase: ${Z.phase}, turn: ${Z.turn}, stage:${Z.stage}`; 
		return false;
	}
	function setup(players, options) {
		let fen = {
			players: {}, plorder: jsCopy(players),
			history: [{ title: '*** game start ***', lines: [] }],
			rounds: options.rounds, stability: options.stability, cardtype: options.cardtype,
			handsize: Number(options.handsize) + (players.length > 9 ? 0 : 1),
			colors: arrTake(get_nc_color_array(), Number(options.colors)),
		};
		shuffle(fen.plorder);
		let plorder = fen.plorder;
		let num = Math.max(7, Math.ceil(players.length / 2));
		let deck_identities = fen.deck_identities = [];
		for (let i = 0; i < num; i++) {
			for (const c of fen.colors) {
				deck_identities.push(c);
			}
		}
		shuffle(deck_identities);
		for (const plname of plorder) {
			let pl = fen.players[plname] = {
				score: 0,
				experience: 0,
				name: plname,
				idleft: deck_deal(deck_identities, 1)[0],
				color: get_user_color(plname),
			};
		}
		for (let i = 0; i < plorder.length; i++) {
			let j = (i + 1) % plorder.length;
			fen.players[plorder[i]].idright = fen.players[plorder[j]].idleft;
		}
		[fen.phase, fen.stage, fen.step, fen.turn] = ['1', 'membership', 0, jsCopy(fen.plorder)];
		start_new_generation(fen, fen.plorder, options);
		return fen;
	}
	function check_gameover() {
		if (Z.phase <= Z.fen.rounds) return false;
		let [fen, num] = [Z.fen, Z.fen.rounds];
		for (const plname in fen.players) {
			let pl = fen.players[plname];
			let cleft = get_color_of_card(pl.idleft);
			let cright = get_color_of_card(pl.idright);
			for (const sess of fen.generations) {
				if (sess.color == cleft) pl.score += 1;
				if (sess.color == cright) pl.score += 1;
			}
		}
		let playerlist = dict2list(fen.players, 'name');
		let sorted = sortByDescending(playerlist, 'score');
		let max_score = sorted[0].score;
		let all_winners = sorted.filter(x => x.score == max_score);
		let sorted2 = sortByDescending(all_winners, 'experience');
		let max_experience = sorted2[0].experience;
		let all_experience = sorted2.filter(x => x.experience == max_experience);
		fen.winners = all_experience.map(x => x.name);
		return fen.winners;
	}
	return { state_info, setup, present: accuse_present, check_gameover, activate_ui: accuse_activate };
}
function accuse_activate() {
	let [pldata, stage, A, fen, phase, uplayer, turn, uname, host] = [Z.playerdata, Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	let donelist = Z.playerdata.filter(x => isDict(x.state) && isdef(x.state.item));
	let complete = ['hand', 'membership', 'tied_consensus'].includes(stage) && donelist.length >= turn.length || stage == 'round' && firstCond(pldata, x => isDict(x.state));
	if (complete && !sameList(turn, [Z.host])) {
		relegate_to_host(donelist);
		return;
	}
	let waiting = isdef(donelist.find(x => x.name == uplayer)) && turn.length > 1;
	assertion(!complete || sameList(turn, [Z.host]), 'complete hat nicht zu host uebergeben!!!!!!!!!!')
	assertion(!complete || !waiting, 'ERROR WAITING WHEN COMPLETE!!!')
	Z.isWaiting = waiting; //das ist nur fuer page tab title animated vs static
	assertion(turn.length == 1 || ['membership', 'hand', 'round'].includes(stage), "FALSCHE ASSUMPTION!!!!!!!!!!!!!");
	if (turn.length == 1) check_experience_states();
	if (waiting) {
		accuse_show_selected_state(donelist.find(x => x.name == uplayer).state);
		if (Z.mode != 'multi') { take_turn_waiting(); return; }
		autopoll();
	} else if (stage == 'handresolve') {
		assertion(uplayer == Z.host && fen.cardsrevealed, 'NOT THE STARTER WHO COMPLETES THE STAGE!!!')
		DA.gobutton = mButton('evaluate cards', accuse_evaluate_votes, dTable, {}, ['donebutton', 'enabled']);
	} else if (stage == 'membershipresolve') {
		assertion(uplayer == Z.host, 'NOT THE STARTER WHO COMPLETES THE STAGE!!!')
		let histest = [];
		for (const pldata of fen.pldata) { //Z.playerdata) {
			let plname = pldata.name;
			let card = pldata.state.item;
			assertion(!isEmpty(card), "INVALID MEMBERSHIP SELECTION!!!!!!!!!!!!", uplayer)
			let pl = fen.players[plname];
			pl.membership = card;
			removeInPlace(pl.hand, card);
			histest.push(`${plname} ${DA.showTestButtons ? card : ''}`); //TODO:KEEP secret!!!!!!!!!!!!!!!!!!!!!!
		}
		ari_history_list(histest, 'membership');
		start_new_poll();
	} else if (stage == 'roundresolve') {
		assertion(uplayer == Z.host, 'NOT THE STARTER WHO COMPLETES THE STAGE!!!')
		Z.turn = jsCopy(Z.plorder);
		Z.phase = Number(Z.phase) + 1;
		stage = Z.stage = Z.phase > fen.rounds ? 'gameover' : 'membership';
		if (stage == 'membership') {
			for (const pl in fen.players) { delete fen.players[pl].membership; }
			start_new_generation(fen, Z.plorder, Z.options);
		}
		take_turn_fen_clear();
	} else if (stage == 'president') {
		let parley_action_available = get_others_with_at_least_one_hand_card().length >= 1;
		addIf(fen.presidents_poll, fen.president);
		if (parley_action_available) {
			select_add_items(ui_get_string_items(['parley']), president_parley, 'may parley cards', 0, 1);
		} else {
			Z.stage = 'president_2';
			accuse_activate();
		}
	} else if (stage == 'president_2') {
		let accuse_action_available = !fen.isprovisional || fen.players[uplayer].hand.length >= 1;
		let actions = ['defect', 'resign'];
		if (accuse_action_available) actions.unshift('accuse');
		select_add_items(ui_get_string_items(actions), president_action, 'must select action to play', 1, 1);
	} else if (stage == 'pay_for_accuse') {
		select_add_items(ui_get_hand_items(uplayer), pay_for_accuse_action, 'must pay a card for accuse action', 1, 1);
	} else if (stage == 'accuse_action_select_player') {
		let plnames = get_keys(fen.players);
		let validplayers = plnames.filter(x => fen.players[x].hand.length >= 1 && x != uplayer && !fen.presidents_poll.includes(x));
		select_add_items(ui_get_player_items(validplayers), accuse_submit_accused, 'must select player name', 1, 1);
	} else if (stage == 'accuse_action_select_color') {
		select_add_items(ui_get_string_items(fen.colors), accuse_submit_accused_color, 'must select color', 1, 1);
	} else if (stage == 'accuse_action_entlarvt') {
		select_add_items(ui_get_hand_items(uplayer), accuse_replaced_membership, 'must select new alliance', 1, 1);
	} else if (stage == 'accuse_action_provisional') {
		select_add_items(ui_get_hand_items(uplayer), accuse_replaced_membership, 'must select new alliance', 1, 1);
	} else if (stage == 'accuse_action_policy') {
		select_add_items(ui_get_hand_items(uplayer), accuse_enact_policy, 'may enact a policy', 0, 1);
	} else if (stage == 'accuse_action_new_president') {
		set_new_president();
	} else if (stage == 'parley_select_player') {
		let players = get_others_with_at_least_one_hand_card();
		select_add_items(ui_get_player_items(players), parley_player_selected, 'must select player to exchange cards with', 1, 1);
	} else if (stage == 'parley_select_cards') {
		select_add_items(ui_get_hand_items(uplayer), parley_cards_selected, 'may select cards to exchange', 0, fen.maxcards);
	} else if (stage == 'parley_opponent_selects') {
		let n = fen.player_cards.length;
		select_add_items(ui_get_hand_items(uplayer), parley_opponent_selected, `must select ${n} cards`, n, n);
	} else if (stage == 'defect_membership') {
		select_add_items(ui_get_hand_items(uplayer), defect_resolve, 'may replace your alliance', 0, 1);
	} else if (stage == 'membership') {
		select_add_items(ui_get_hand_items(uplayer), accuse_submit_membership, 'must select your alliance', 1, 1);
	} else if (stage == 'hand') {
		select_add_items(ui_get_hand_items(uplayer), accuse_submit_card, 'may select card to play', 0, 1);
	} else if (stage == 'round') {
		show_special_message(`generation end! ${fen.generations[fen.phase - 1].color} wins`, false, 3000, 0, { top: 67 })
		if (is_ai_player(uplayer)) accuse_onclick_weiter();
		else {
			mLinebreak(dTable, 12)
			mButton('WEITER', accuse_onclick_weiter, dTable, {}, ['donebutton', 'enabled']);
		}
	} else {
		alert(`PROBLEM!!! unknown stage ${stage}`)
	}
}
function accuse_ai_move(bot) {
	let [pl, fen, stage] = [Z.fen.players[bot], Z.fen, Z.stage];
	if (stage == 'hand') {
		pl.move = { state: { item: '' } }
	} else if (stage == 'membership') {
	}
}
function accuse_discard(card) { Z.fen.deck_discard.push(card) }
function accuse_enact_policy() {
	let [A, uplayer, fen, accused] = [Z.A, Z.uplayer, Z.fen, Z.fen.accused];
	let card = isEmpty(A.selected) ? '' : A.items[A.selected[0]].a;
	if (!isEmpty(card)) {
		lookupAddToList(fen, ['policies'], get_color_of_card(card));
		removeInPlace(fen.players[uplayer].hand, card);
		ari_history_list(`${uplayer} enacts a ${get_color_of_card(card)} policy`, 'policy')
		let policies_needed = fen.stability - fen.crisis;
		let arr = arrTakeLast(fen.policies, policies_needed);
		let color = arrAllSame(arr, get_color_of_card);
		if (color && arr.length >= policies_needed) {
			fen.dominance = true;
			ari_history_list(`${color} dominance reached!`, 'generation ends')
			accuse_score_update(color);
			Z.turn = jsCopy(Z.plorder);
			Z.stage = 'round';
			take_turn_fen_clear();
		} else {
			president_end();
		}
	} else {
		president_end();
	}
}
function accuse_evaluate_votes() {
	let [stage, A, fen, phase, uplayer, turn, uname, host] = [Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	assertion(uplayer == host && fen.cardsrevealed, 'NOT THE STARTER WHO COMPLETES THE STAGE!!!')
	let votes = [];
	for (const pldata of fen.pldata) { //Z.playerdata) {
		let plname = pldata.name;
		let card = pldata.state.item;
		if (!isEmpty(card)) votes.push({ plname: plname, card: card });
		else removeInPlace(fen.validvoters, plname);
	}
	ari_history_list(votes.map(x => `${x.plname} ${x.card}`), 'votes');
	if (isEmpty(votes)) { eval_empty_votes(votes); return; }
	let color = arrSame(votes, x => get_color_of_card(x.card));
	if (color) { eval_consensus(votes, color); return; }
	let max_votes = get_max_votes(votes);
	if (max_votes.length == 1) { eval_president(max_votes[0]); }
	else { eval_tie(max_votes, votes); }
}
function accuse_onclick_weiter() {
	Z.state = { item: Z.uplayer };
	take_turn_multi();
}
function accuse_player_stat(dParent, plname, hvotecard, himg, hstatfz, gap) {
	let players = Z.fen.players;
	let pl = players[plname];
	let onturn = Z.turn.includes(plname);
	let sz = himg; //onturn?100:50;
	let bcolor = plname == Z.uplayer ? 'lime' : 'silver';
	let border = pl.playmode == 'bot' ? `double 5px ${bcolor}` : `solid 5px ${bcolor}`;
	let rounding = pl.playmode == 'bot' ? '0px' : '50%';
	let d = mDiv(dParent, { align: 'center' });
	let card = mDiv(d, { hmin: hvotecard + gap, bg: 'transparent', mabottom: gap, paright: 4 }); mCenterFlex(card);
	let wstats = sz * 1.3;
	let dcombine = mDiv(d, { w: wstats, margin: 'auto' }); //,{padding:6});
	let dimg = mDiv(dcombine, { padding: 0 }, null, `<img src='../base/assets/images/${plname}.jpg' style="border-radius:${rounding};border:${border};box-sizing:border-box" width=${sz} height=${sz}>`); mCenterFlex(dimg);
	let stats = mDiv(dcombine, { align: 'center', w: wstats, bg: 'silver', rounding: 10 }); mCenterFlex(stats);
	let x = lookupSetOverride(UI, ['stats', plname], { douter: d, dcombi: dcombine, dstats: stats, dimg: dimg, dcard: card });
	let numcols = 3;
	accuse_player_stat_count('star', pl.score, stats, { sz: hstatfz }, numcols);
	accuse_player_stat_count('hand with fingers splayed', pl.hand.length, stats, { sz: hstatfz }, numcols);
	accuse_player_stat_count('eye', pl.experience, stats, { sz: hstatfz }, numcols);
	return x;
}
function accuse_player_stat_count(key, n, dParent, styles = {}, numcols) {
	let sz = valf(styles.sz, 8);
	let d = mDiv(dParent, { w: `${100 / numcols}%`, align: 'center' });
	let dsym;
	if (isdef(Syms[key])) dsym = mSym(key, d, { h: sz, 'line-height': sz, w: '100%' });
	else dsym = mText(key, d, { h: sz, fz: sz, w: '100%' });
	let dn = mDiv(d, { fz: 2 * sz, weight: 'bold' }, null, n);
	return d;
}
function accuse_present(dParent) {
	mStyle(mBy('dTitle'), { display: 'grid', 'grid-template-columns': 'auto 1fr auto', h: 32 });
	DA.no_shield = true;
	let [fen, ui, stage, uplayer] = [Z.fen, UI, Z.stage, Z.uplayer];
	if (firsttime) { fen = Z.fen = getfen1(); firsttime = false; }
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent, 1, 0);
	let dt = dTable = dOpenTable; clearElement(dt); mCenterFlex(dt); mStyle(dt, { hmin: 700 })
	show_history(fen, dRechts);
	if (isdef(fen.msg)) { show_message(fen.msg, true); }
	let [hlg, hsm] = [80, 50];
	let [hpolcard, hvotecard, himg, hstatfz, hnetcard, hhandcard, gap] = [hsm, hlg, 50, 8, hsm, hlg, 4];
	let [hpol, hstat, hhand] = [hpolcard + 25, hvotecard + himg + hstatfz * 5 + gap * 2, hhandcard + 25];
	let [d1, d2, d3, d4, d5] = [mDiv(dt), mDiv(dt), mDiv(dt), mDiv(dt), mDiv(dt)];
	let [color, n] = get_policies_to_win();
	UI.policies = ui_type_accuse_policies(fen.policies, d1, { h: hpol }, '', 'policies', accuse_get_card_func(hsm, GREEN), false);
	mStyle(d1, { h: isEmpty(fen.policies) ? 40 : hpol, w: '90%', display: 'flex', gap: 12 })
	let msg = color == 'any' ? `${n} policies are needed to win!` : n <= 0 ? `${capitalize(color)} wins generation ${fen.generations.length}!` : `${capitalize(color)} needs ${n} more policies`
	let x = mDiv(d1, { h: isEmpty(fen.policies) ? 40 : hpolcard }, null, msg); mCenterCenterFlex(x)
	let [wgap, hgap] = [20, 12];
	let players = fen.players;
	let wneeded = (himg + wgap) * fen.plorder.length + wgap;
	let wouter = '95%';
	let order = get_present_order();
	let me = order[0];
	if (Z.phase > Z.options.rounds) show_playerstats_over(d2); else show_playerstats_orig(d2);
	mStyle(d3, { hmin: hstat, w: wouter }); mCenterFlex(d3);
	let dnet = mDiv(d3, { w: wneeded });
	let wrest = wneeded - 2 * himg;
	dnet.style.gridTemplateColumns = `64px 1fr 64px`;
	dnet.style.display = 'inline-grid';
	dnet.style.padding = `${hgap}px ${wgap}px`;
	let pl = fen.players[me];
	let par = (64 - hnetcard * .7) / 2;
	let d_idright = mDiv(dnet, { w: 64, padding: par });
	let idright = get_color_card(pl.idright, hnetcard); mAppend(d_idright, iDiv(idright))
	let dme_stats = mDiv(dnet, { display: 'flex', 'justify-content': 'center', 'align-items': 'space-evenly' });
	let dx = accuse_player_stat(dme_stats, me, hvotecard, himg, hstatfz, gap);
	let d_idleft = mDiv(dnet, { w: 64, padding: par });
	let idleft = get_color_card(pl.idleft, hnetcard); mAppend(d_idleft, iDiv(idleft))
	mStyle(d4, { margin: 10, h: hhand, w: '90%' }); mCenterFlex(d4);
	let handui = ui_type_accuse_hand(pl.hand, d4, { h: hhand }, `players.${uplayer}.hand`, 'hand', accuse_get_card_func(hhandcard));
	lookupSetOverride(ui, ['players', uplayer, 'hand'], handui);
	presentcards(hvotecard);
	let plnames = stage == 'round' || stage == 'gameover' ? order : [me];
	plnames.map(x => show_membership_color(x, hnetcard, himg));
}
function accuse_replaced_membership() {
	let [stage, A, uplayer, fen, accused] = [Z.stage, Z.A, Z.uplayer, Z.fen, Z.fen.accused];
	assertion(accused == uplayer, "accuse_replace_membership: WRONG PLAYER!!!!")
	let card = A.items[A.selected[0]].a;
	let pl = fen.players[uplayer];
	accuse_discard(pl.membership)
	pl.membership = card;
	removeInPlace(pl.hand, card);
	ari_history_list(`${accused} chooses new membership` + (DA.showTestButtons ? ` ${card}` : ''), 'accuse');
	delete fen.msg;
	if (stage == 'accuse_action_entlarvt'){
		Z.turn = [fen.president];
		Z.stage = 'accuse_action_policy';
		take_turn_fen_clear(); //!!!!clear added!!!!
	}else{
		fen.newpresident = accused;
		set_new_president();
	}
}
function accuse_score_update(color) {
	let [fen] = [Z.fen];
	let generation_entry = { color: color };
	let plgeneration = generation_entry.players = {};
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		plgeneration[plname] = get_color_of_card(pl.membership); // { left: get_color_of_card(pl.idleft), middle: get_color_of_card(pl.membership), right: get_color_of_card(pl.idright) };
		if (get_color_of_card(pl.membership) == color) pl.score += 1;
	}
	lookupAddToList(fen, ['generations'], generation_entry);
}
function accuse_show_selected_state(state) {
	let [fen, uplayer, stage] = [Z.fen, Z.uplayer, Z.stage];
	let mystate = state.item;
	if (!isEmpty(mystate)) {
		let handui = lookup(UI, ['players', uplayer, 'hand']);
		let items = handui.items;
		let cardui = items.find(x => x.key == mystate)
		if (stage == 'hand' && isdef(cardui)) make_card_selected(cardui);
		else if (stage == 'membership' && isdef(cardui)) make_card_selected(cardui);
		else mDiv(dTable, {}, null, 'WAITING FOR PLAYERS TO COMPLETE....');
	}
}
function accuse_show_sitting_order(fen) {
	if (nundef(fen)) fen = Z.fen;
	for (const plname of fen.turn) {
		let pl = fen.players[plname];
	}
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
	}
}
function accuse_submit_accused() {
	let [A, uplayer, fen] = [Z.A, Z.uplayer, Z.fen];
	let plname = A.items[A.selected[0]].a;
	fen.accused = plname;
	Z.stage = 'accuse_action_select_color';
	ari_history_list(`${uplayer} accuses ${plname}`, 'accuse')
	accuse_activate();
}
function accuse_submit_accused_color() {
	let [A, uplayer, fen, accused] = [Z.A, Z.uplayer, Z.fen, Z.fen.accused];
	let color = A.items[A.selected[0]].a;
	let card = fen.players[accused].membership;
	let real_color = get_color_of_card(card);
	ari_history_list(`${uplayer} guesses ${color == real_color ? 'CORRECT' : 'WRONG'} (${color})`, 'accuse')
	console.log(`PRESIDENT GUESSES ${color == real_color ? 'CORRECT' : 'WRONG!!!'}!!!`);
	fen.msg = `PRESIDENT GUESSES ${color == real_color ? 'CORRECT' : 'WRONG!!!'}!!!`;
	if (color == real_color) {
		Z.turn = [accused];
		fen.players[uplayer].hand.push(card);
		fen.wrong_guesses = 0;
		delete fen.players[accused].membership;
		Z.stage = 'accuse_action_entlarvt';
		take_turn_fen_clear(); //!!!!clear added!!!!
	} else {
		Z.turn = [accused];
		fen.players[accused].hand.push(card);
		fen.wrong_guesses += 1;
		delete fen.players[accused].membership;
		Z.stage = 'accuse_action_provisional';
		take_turn_fen_clear(); //!!!!clear added!!!!
	}
}
function accuse_submit_card() {
	let A = Z.A;
	let card = isEmpty(A.selected) ? '' : A.items[A.selected[0]].a;
	Z.state = { item: card };
	take_turn_multi();
}
function accuse_submit_membership() {
	let A = Z.A;
	let card = A.items[A.selected[0]].a;
	Z.state = { item: card };
	take_turn_multi();
}
function add_advanced_ui(dParent) {
	mDiv(dParent, {}, 'dAdvancedUI');
	show_advanced_ui_buttons();
}
function arrAllSame(arr, func) {
	if (isEmpty(arr)) return false;
	let arr1 = arr.map(x => func(x));
	let sample = arr1[0];
	for (let i = 1; i < arr1.length; i++) if (arr1[i] != sample) return false;
	return sample;
}
function arrSame(arr, func) {
	if (isEmpty(arr)) return true;
	let x = func(arr[0]);
	for (let i = 1; i < arr.length; i++) {
		if (func(arr[i]) != x) return false;
	}
	return x;
}
function calcNumRanks(total, repeat, ncolors) {
	let d = Math.ceil(total / (repeat * ncolors));
	return range(1, d + 1);
}
function check_enough_policies_or_start_new_poll(msg_new_poll) {
	let [stage, A, fen, phase, uplayer, turn, uname, host] = [Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	let policies_needed = fen.stability - fen.crisis;
	let arr = arrTakeLast(fen.policies, policies_needed);
	let color = arrAllSame(arr, get_color_of_card);
	if (color && arr.length >= policies_needed) {
		fen.dominance = true;
		ari_history_list(`${color} dominance reached!`, 'generation ends')
		accuse_score_update(color);
		Z.turn = jsCopy(Z.plorder);
		Z.stage = 'round';
		take_turn_fen_clear();
		return true;
	} else {
		ari_history_list(msg_new_poll, 'new poll')
		start_new_poll();
		return false;
	}
}
function check_experience_states() {
	let [pldata, stage, A, fen, phase, uplayer, turn, uname, host] = [Z.playerdata, Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	let donelist = Z.playerdata.filter(x => isDict(x.state1));
	for (const x of donelist) {
		let plfrom = x.name;
		let plto = x.state1.plname;
		let num = Number(x.state1.num);
		fen.players[plfrom].experience -= num;
		fen.players[plto].experience += num;
		ari_history_list(`${plfrom} bribes ${plto}: ${num} points!`, 'corruption!')
		x.state1 = null; //reset fuer den fall dass multiple times in accuse_activate gehe!!!!
	}
}
function defect_resolve() {
	let [A, uplayer, fen] = [Z.A, Z.uplayer, Z.fen];
	let card = A.items[A.selected[0]].a;
	let pl = fen.players[uplayer];
	let mem = pl.membership;
	pl.membership = card;
	removeInPlace(pl.hand, card);
	let def = Z.options.defected;
	console.log('defected', def);
	if (def == 'remove') accuse_discard(mem);
	else if (def == 'exchange') pl.hand.push(mem);
	else if (def == 'draw') pl.hand.push(fen.deck_discard.shift())
	ari_history_list(`${uplayer} replaces membership`, 'defect')
	president_end();
}
function eval_consensus(votes, color) {
	let [stage, A, fen, phase, uplayer, turn, uname, host] = [Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	let vsorted = sortCardObjectsByRankDesc(votes, fen.ranks, 'card');
	let opt = valf(Z.options.consensus, 'policy');
	if (opt == 'policy') {
		fen.policies.push(color); //get_color_card(color)); //color == 'red' ? 'QDn' : 'QSn'); //last_policy);
		fen.validvoters = jsCopy(Z.plorder);
		check_enough_policies_or_start_new_poll(`consensus on ${color}`);
	} else if (opt == "coupdetat") {
		let ace_present = vsorted.find(x => is_ace(x.card));
		if (isdef(ace_present)) {
			ari_history_list(`coup succeeded! ${color} wins!`, 'generation ends');
			accuse_score_update(color);
			Z.turn = jsCopy(Z.plorder);
			Z.stage = 'round';
			take_turn_fen_clear();
		} else { //just add a policy
			fen.policies.push(color); //get_color_card(color)); //color == 'red' ? 'QDn' : 'QSn'); 
			fen.validvoters = jsCopy(Z.plorder);
			check_enough_policies_or_start_new_poll(`consensus on ${color}`);
		}
	} else if (opt == 'generation') {
		ari_history_list(`consensus on ${color}!`, 'generation ends');
		accuse_score_update(color);
		Z.turn = jsCopy(Z.plorder);
		Z.stage = 'round';
		take_turn_fen_clear();
	} else if (opt == 'playerpolicy') { // opt == 'policy'
		let tie = vsorted.length > 1 && getRankOf(vsorted[0].card) == getRankOf(vsorted[1].card);
		if (tie) {
			let maxrank = getRankOf(vsorted[0].card);
			let tied_votes = arrTakeWhile(vsorted, x => getRankOf(x.card) == maxrank);
			let tied_players = tied_votes.map(x => x.plname);
			console.log('tied', tied_votes, tied_players);
			Z.turn = tied_players;
			Z.stage = 'tied_consensus';
			fen.tied_votes = tied_votes;
			take_turn_fen_clear();
		} else {
			let winner = vsorted[0];
			fen.policies.push(winner.card);
			removeInPlace(fen.players[winner.plname].hand, winner.card);
			fen.validvoters = jsCopy(Z.plorder);
			check_enough_policies_or_start_new_poll(`consensus on ${color}`);
		}
	}
}
function eval_empty_votes(votes) {
	let [stage, A, fen, phase, uplayer, turn, uname, host] = [Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	let last_policy = arrLast(fen.policies);
	if (last_policy) {
		fen.policies.push(last_policy);
	}
	fen.validvoters = jsCopy(Z.plorder);
	check_enough_policies_or_start_new_poll(`no one voted: policy repeat`);
}
function eval_president(winning_vote) {
	let [stage, A, fen, phase, uplayer, turn, uname, host] = [Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	let plwinner = winning_vote.plname;
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		if (isdef(pl.pending) && !isEmpty(pl.pending)) pl.pending.map(x => pl.hand.push(x));
		delete pl.pending;
	}
	removeInPlace(fen.players[plwinner].hand, winning_vote.card);
	fen.deck_discard.push(winning_vote.card);
	fen.president = plwinner;
	fen.players[plwinner].experience += 1;
	fen.isprovisional = false;
	ari_history_list(`${plwinner} wins presidency!`, 'president');
	Z.turn = [plwinner];
	Z.stage = 'president';
	take_turn_fen_clear();
}
function eval_tie(max_votes, votes) {
	let [stage, A, fen, phase, uplayer, turn, uname, host] = [Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	ari_history_list('tie! new poll round', 'poll');
	for (const v of votes) {
		let plname = v.plname;
		let pl = fen.players[plname];
		lookupAddToList(pl, ['pending'], v.card)
		removeInPlace(pl.hand, v.card);
	}
	start_new_poll();
}
function get_advanced_menu_button() {
	let html = `<a id="aAdvancedMenu" href="javascript:onclick_advanced_menu()">T</a>`;
	let b = mCreateFrom(html);
	mStyle(b, { bg: 'silver', hpadding: 6, maright: 10, rounding: 4 });
	mStyle(b, { bg: 'silver', hpadding: 6, maright: 10, rounding: 4 });
	mClass(b, 'hop1')
	return b;
}
function get_advanced_menu_buttons() {
	let html = `<a href="javascript:onclick_advanced_test()">T</a>`;
	let btest = mCreateFrom(html);
	let mode = 'multi';
	html = `<a href="javascript:onclick_advanced_mode()">${mode[0].toUpperCase()}</a>`;
	let bmode = mCreateFrom(html);
	let d = mCreate('div');
	mAppend(d, btest);
	mAppend(d, bmode);
	let styles = { bg: 'silver', wmin: 25, h: 25, rounding: '50%', maright: 10, align: 'center' };
	mStyle(btest, styles);
	mStyle(bmode, styles);
	mClass(btest, 'hop1')
	mClass(bmode, 'hop1')
	return d;
}
function get_bots_on_turn() {
	let players = Z.turn;
	return players.filter(x => Z.fen.players[x].playmode != 'human');
}
function get_color_card(ckey, h, opts = {}) {
	let color;
	if (nundef(ckey)) color = 'transparent'; else color = is_color(ckey) ? ckey : get_color_of_card(ckey);
	let type = 'color';
	let info = { friendly: color, color: valf(opts.bg, BLUE) }
	info.ckey = color;
	let el = mDiv(null, { bg: color == 'black' ? '#222' : color, rounding: h / 10, border: 'silver' });
	h = valf(h, valf(info.h, 100));
	w = valf(opts.w, h * .7);
	mSize(el, w, h);
	let card = {};
	copyKeys(info, card);
	copyKeys({ sz: h, w: w, h: h, faceUp: true, div: el }, card);
	card.ov = valf(opts.ov, .3);
	return card;
}
function get_max_votes(votes) {
	let [stage, A, fen, phase, uplayer, turn, uname, host] = [Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	let vsorted = sortCardObjectsByRankDesc(votes, fen.ranks, 'card');
	let maxrank = getRankOf(vsorted[0].card);
	let tied_votes = arrTakeWhile(vsorted, x => getRankOf(x.card) == maxrank);
	return tied_votes;
}
function get_nc_color_array() { return ['red', 'black', 'blue', 'green', 'gold', 'hotpink', 'cyan'] }
function get_nc_complement_array(color) { return { red: '#ff9999', black: '#999', blue: BLUE, green: GREEN, gold: 'lightgoldenrodyellow', hotpink: 'pink', cyan: TEAL }[color]; }
function get_number_card(ckey, h = 100, w = null, backcolor = BLUE, ov = .3) {
	let info = {};
	let color = stringAfter(ckey, '_');
	let num = stringBefore(ckey, '_');
	info.key = ckey;
	info.cardtype = 'num';
	let [r, s] = [info.rank, info.suit] = [Number(num), color];
	info.val = r; // Number(num);
	info.color = backcolor;
	let sz = info.sz = info.h = h;
	w = info.w = valf(w, sz * .7);
	if (!isList(Z.fen.ranks)) Z.fen.ranks = calcNumRanks(get_keys(Z.fen.players).length * Z.fen.handsize, 2, Z.fen.colors.length);
	let ranks = valf(lookup(Z, ['fen', 'ranks']), range(100)); //Z.fen.ranks;
	info.irank = ranks.indexOf(r);
	info.isuit = valf(lookup(Z, ['fen', 'colors']), get_nc_color_array()).indexOf(s); //range(100));'SHCD'.indexOf(s);
	info.isort = info.isuit * ranks.length + info.irank;
	let d = mDiv(null, { h: h, w: w, rounding: 4, bg: 'white', border: 'silver' }, null, null, 'card');
	let [sm, lg] = [sz / 8, sz / 4]
	let styles = { fg: color, h: sm, fz: sm, hline: sm, weight: 'bold' };
	for (const pos of ['tl', 'tr']) {
		let d1 = mDiv(d, styles, null, num);
		mPlace(d1, pos, 2, 2);
	}
	for (const pos of ['bl', 'br']) {
		let d1 = mDiv(d, styles, null, num);
		d1.style.transform = 'rotate(180deg)';
		mPlace(d1, pos, 2, 2);
	}
	let dbig = mDiv(d, { matop: (h - lg) / 2, family: 'algerian', fg: color, fz: lg, h: lg, w: w, hline: lg, align: 'center' }, null, num);
	let res = {};
	copyKeys(info, res);
	copyKeys({ w: info.w, h: info.h, faceUp: true, div: d }, res);
	if (isdef(ov)) res.ov = ov;
	return res;
}
function get_other_players() { return get_keys(Z.fen.players).filter(x => x != Z.uplayer); }
function get_others_with_at_least_one_hand_card() {
	return get_keys(Z.fen.players).filter(x => x != Z.uplayer && Z.fen.players[x].hand.length >= 1);
}
function get_player_card(plname) { let pld = get_player_data(plname); return pld ? pld.state.item : null; }
function get_player_data(plname) { return firstCond(Z.playerdata, x => x.name == plname); }
function get_player_state(plname) { let pld = get_player_data(plname); return pld ? pld.state : null; }
function get_players_with_at_least_one_hand_card() {
	return get_keys(Z.fen.players).filter(x => Z.fen.players[x].hand.length >= 1);
}
function get_policies_to_win() {
	let fen = Z.fen;
	let policies_needed = fen.stability - fen.crisis;
	if (isEmpty(fen.policies)) return ['any', policies_needed];
	let revlist = jsCopy(fen.policies).reverse();
	let color = get_color_of_card(revlist[0]);
	let samecolorlist = arrTakeWhile(revlist, x => get_color_of_card(x) == color);
	return [color, Math.max(0, policies_needed - samecolorlist.length)];
}
function get_random_ballot_card() {
	let [fen] = [Z.fen];
	return fen.cardtype == 'num' ? `${rChoose(fen.ranks)}_${rChoose(fen.colors)}` : `${rCard('n', fen.ranks, 'SHDC')}`;
}
function get_valid_voters() {
	return Z.fen.validvoters.filter(x => Z.fen.players[x].hand.length >= 1);
}
function getRankOf(ckey, ranks) {
	if (is_nc_card(ckey)) return Number(stringBefore(ckey, '_'));
	if (nundef(ranks)) ranks = valf(lookup(Z, ['fen', 'ranks']), 'A23456789TJQK');
	return ckey[0];
}
function gift_experience_points() {
	let selected = DA.popupitems.filter(x => x.isSelected);
	if (selected.length < 2) {
		return;
	}
	let plname_item = selected.find(x => x.irow == 0);
	let plname = plname_item.a;
	let num_item = selected.find(x => x.irow == 1);
	let num = Number(num_item.a);
	mRemove('dBandMessage');
	Z.state1 = { plname: plname, num: num };
	take_turn_state1();
}
function has_player_state(plname) { let pld = get_player_data(plname); return pld ? pld.state : false; }
function is_ace(ckey) { return ckey[0] == 'A' || firstNumber(ckey) == 1; }
function is_nc_card(ckey) { return ckey.includes('_'); }
function parley_cards_selected() {
	let [A, uplayer, fen] = [Z.A, Z.uplayer, Z.fen];
	let player_cards = fen.player_cards = A.selected.map(x => A.items[x].a);
	Z.turn = [fen.other];
	Z.stage = 'parley_opponent_selects';
	take_turn_fen_clear(); //!!!!clear added!!!!
}
function parley_opponent_selected() {
	let [A, uplayer, fen] = [Z.A, Z.uplayer, Z.fen];
	let opp_cards = A.selected.map(x => A.items[x].a);
	let pl1 = fen.players[fen.president];
	let pl2 = fen.players[uplayer];
	fen.player_cards.map(x => removeInPlace(pl1.hand, x))
	fen.player_cards.map(x => pl2.hand.push(x));
	opp_cards.map(x => removeInPlace(pl2.hand, x))
	opp_cards.map(x => pl1.hand.push(x));
	ari_history_list(`president ${fen.president} exchanged ${opp_cards.length} cards with ${uplayer}`, 'parley')
	Z.stage = 'president_2';
	Z.turn = [fen.president];
	take_turn_fen_clear();
}
function parley_player_selected() {
	let [A, uplayer, fen] = [Z.A, Z.uplayer, Z.fen];
	let other = fen.other = A.items[A.selected[0]].a;
	fen.maxcards = Math.min(fen.players[other].hand.length, fen.players[uplayer].hand.length);
	Z.stage = 'parley_select_cards'
	accuse_activate();
}
function pay_for_accuse_action() {
	let [A, uplayer, fen] = [Z.A, Z.uplayer, Z.fen];
	let card = A.items[A.selected[0]].a;
	removeInPlace(fen.players[uplayer].hand, card); accuse_discard(card)
	redraw_hand();
	Z.stage = 'accuse_action_select_player';
	ari_history_list(`${uplayer} pays for accuse action`, 'accuse')
	accuse_activate();
}
function presentcards(h) {
	let [pldata, stage, A, fen, phase, uplayer, turn, uname, host] = [Z.playerdata, Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	let donelist = isdef(fen.pldata) ? fen.pldata : Z.playerdata.filter(x => isDict(x.state) && isdef(x.state.item));
	if (!startsWith(stage, 'hand') && !startsWith(stage, 'membership')) return;
	for (const pld of donelist) {
		let plname = pld.name;
		let plui = lookup(UI, ['stats', plname]);
		let dcard = plui.dcard;
		if (isEmpty(arrChildren(dcard))) {
			let card = pld.state.item;
			let actualcard = plui.actualcard = !isEmpty(card);
			let card1 = plui.card = accuse_get_card(actualcard ? card : 'AHn', h)
			mAppend(dcard, iDiv(card1));
		}
		if (!Z.fen.cardsrevealed || !plui.actualcard) face_down(plui.card);
	}
}
function president_action() {
	let [A, uplayer, fen] = [Z.A, Z.uplayer, Z.fen];
	let action = A.items[A.selected[0]].a;
	if (action == 'accuse') {
		Z.stage = 'accuse_action_select_player'; //provisional does NOT pay anymore
		accuse_activate();
	} else if (action == 'parley') {
		Z.stage = 'parley_select_player';
		accuse_activate();
	} else if (action == 'defect') {
		Z.stage = 'defect_membership';
		accuse_activate();
	} else if (action == 'resign') {
		ari_history_list(`${uplayer} resigns as president`, 'resign')
		president_end();
	}
}
function president_end() {
	let fen = Z.fen;
	delete fen.president;
	delete fen.newpresident;
	delete fen.isprovisional;
	delete fen.player_cards;
	delete fen.accused;
	fen.validvoters = jsCopy(fen.plorder);
	start_new_poll();
}
function president_parley() {
	let [A, uplayer, fen] = [Z.A, Z.uplayer, Z.fen];
	if (!isEmpty(A.selected)) {
		Z.stage = 'parley_select_player';
		accuse_activate();
	} else {
		Z.stage = 'president_2';
		accuse_activate();
	}
}
function redraw_hand() {
	let [uplayer, fen, ui, dt] = [Z.uplayer, Z.fen, UI, dTable];
	let ch = arrChildren(dt);
	let handui = UI.players[uplayer].hand.container;
	handui.remove();
	let pl = fen.players[uplayer];
	lookupSetOverride(ui, ['players', uplayer, 'hand'], ui_type_hand(pl.hand, dt, { paleft: 25 }, `players.${uplayer}.hand`));
}
function relegate_to_host(list) {
	let [stage, A, fen, phase, uplayer, turn, uname, host] = [Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host];
	if (stage == 'hand') fen.cardsrevealed = true;
	Z.turn = [Z.host];
	fen.pldata = list;
	Z.stage = Z.stage + 'resolve';
	take_turn_fen(); //das ist ein fen override in multiturn!!!!!!!
	return;
}
function send_experience_points() {
	console.log('sending experience points.....')
}
function set_new_president() {
	let fen = Z.fen;
	if (fen.wrong_guesses >= 3) {
		ari_history_list(`too many wrong guesses!!!`, 'abort');
		president_end();
	} else {
		fen.president = fen.newpresident;
		delete fen.newpresident;
		fen.isprovisional = true;
		Z.stage = 'president';
		Z.turn = [fen.president];
		ari_history_list(`new president is ${fen.president}`, 'provisional president')
		take_turn_fen_clear(); //!!!!clear added!!!!
	}
}
function show_advanced_ui_buttons() {
	let dParent = mBy('dAdvancedUI');
	mClear(dParent)
	let sz = 20;
	let styles = { bg: 'silver', wmin: sz, h: sz, rounding: '50%', maright: 10, align: 'center' };
	mButton(' ', onclick_advanced_test, dParent, styles, 'enabled');
	style_advanced_button();
}
function show_membership_color(plname, hnetcard, himg) {
	let dx = lookup(UI, ['stats', plname]);
	let pl = Z.fen.players[plname];
	if (nundef(pl.membership)) return;
	let c = get_color_of_card(pl.membership);
	mStyle(dx.dcombi, { bg: c, rounding: hnetcard / 10, patop: 4 })
	mStyle(dx.dstats, { bg: c, fg: 'white' });
	dx.dimg.firstChild.width = dx.dimg.firstChild.height = himg - 10;
}
function show_number_card(ckey, sz) {
	let card = cBlank(dTable, { h: sz, border: 'silver' });
	let d = iDiv(card, { margin: 10 });
	let color = stringAfter(ckey, '_');
	let num = stringBefore(ckey, '_');
	let [sm, lg] = [sz / 8, sz / 4]
	let styles = { fg: color, h: sm, fz: sm, hline: sm, weight: 'bold' };
	for (const pos of ['tl', 'tr']) {
		let d1 = mDiv(d, styles, null, num);
		mPlace(d1, pos, 2, 2);
	}
	for (const pos of ['bl', 'br']) {
		let d1 = mDiv(d, styles, null, num);
		d1.style.transform = 'rotate(180deg)';
		mPlace(d1, pos, 2, 2);
	}
	let dbig = mDiv(d, { family: 'algerian', fg: color, fz: lg, h: lg, w: '100%', hline: lg, align: 'center' }, null, num);
	mPlace(dbig, 'cc');
	return card;
}
function show_playerstats_orig(d2) {
	let [fen, ui, stage, uplayer] = [Z.fen, UI, Z.stage, Z.uplayer];
	let [hlg, hsm] = [80, 50];
	let [hpolcard, hvotecard, himg, hstatfz, hnetcard, hhandcard, gap] = [hsm, hlg, 50, 8, hsm, hlg, 4];
	let [hpol, hstat, hhand] = [hpolcard + 25, hvotecard + himg + hstatfz * 5 + gap * 2, hhandcard + 25];
	let [wgap, hgap] = [20, 12];
	let players = fen.players;
	let wneeded = (himg + wgap) * fen.plorder.length + wgap;
	let wouter = '95%';
	mStyle(d2, { hmin: hstat, wmin: wouter }); mCenterFlex(d2);
	let dstats = mDiv(d2, { wmin: wneeded });
	let order = get_present_order();
	let me = order[0];
	dstats.style.gridTemplateColumns = 'repeat(' + (fen.plorder.length - 1) + ',1fr)';
	dstats.style.display = 'inline-grid';
	dstats.style.padding = dstats.style.gap = `${hgap}px ${wgap}px`;
	assertion(me == uplayer, "MEEEEEEEEEEEEEEE")
	for (const plname of order.slice(1)) { accuse_player_stat(dstats, plname, hvotecard, himg, hstatfz, gap); }
	mLinebreak(d2)
}
function show_playerstats_over(d2) {
	let [fen, ui, stage, uplayer] = [Z.fen, UI, Z.stage, Z.uplayer];
	let [hlg, hsm] = [80, 50];
	let [hpolcard, hvotecard, himg, hstatfz, hnetcard, hhandcard, gap] = [hsm, hlg, 50, 8, hsm, hlg, 4];
	let [hpol, hstat, hhand] = [hpolcard + 25, hvotecard + himg + hstatfz * 5 + gap * 2, hhandcard + 25];
	let [wgap, hgap] = [10, 12]; //NEW!
	let players = fen.players;
	let order = get_present_order();
	let me = order[0];
	let ncols = order.length - 1 + order.length - 2;
	let wneeded = (himg + wgap) * ncols + wgap;
	let wouter = '95%';
	mStyle(d2, { hmin: hstat, wmin: wouter }); mCenterFlex(d2);
	let dstats = mDiv(d2, { wmin: wneeded });
	let szcols = '1fr'; //isover?'auto':'1fr';
	dstats.style.gridTemplateColumns = `repeat(${ncols},${szcols})`; // 'repeat(' + ncols + `,1fr)`;
	dstats.style.display = 'inline-grid';
	dstats.style.padding = dstats.style.gap = `${hgap}px ${wgap}px`;
	assertion(me == uplayer, "MEEEEEEEEEEEEEEE")
	for (const plname of order.slice(1)) {
		let dshell1 = mDiv(dstats); mCenterCenterFlex(dshell1)
		accuse_player_stat(dshell1, plname, hvotecard, himg, hstatfz, gap);
		if (plname == arrLast(order)) break;
		let dshell2 = mDiv(dstats); mCenterCenterFlex(dshell2)
		let dncshell = mDiv(dshell2); //,{bg:'green'}); //{h:141,patop:90,bg:GREEN});
		let dummy = mDiv(dncshell, { h: 50, bg: 'transparent' })
		let netcard = get_color_card(fen.players[plname].idright, 50);
		mAppend(dncshell, iDiv(netcard));
	}
	mLinebreak(d2)
}
function show_role_accuse() {
	let d = mBy('dAdminMiddle');
	clearElement(d);
	let [role, pldata, stage, fen, phase, uplayer, turn, uname, host, mode] = [Z.role, Z.playerdata, Z.stage, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host, Z.mode];
	let styles, text;
	let boldstyle = { fg: 'red', weight: 'bold', fz: 20 };
	let normalstyle = { fg: 'black', weight: null, fz: null };
	if (mode == 'hotseat') {
		text = `hotseat: <span style='color:${get_user_color(uplayer)}'>${uplayer}</span>`;
		styles = boldstyle;
		styles.wmin = 220;
		d.innerHTML = text; mStyle(d, styles);
	} else if (role == 'spectator') {
		styles = normalstyle;
		text = `(spectating)`;
		d.innerHTML = text; mStyle(d, styles);
	} else if (role == 'inactive' && !DA.showTestButtons) {
		styles = normalstyle;
		text = `(${turn[0]}'s turn)`;
		d.innerHTML = text; mStyle(d, styles);
	} else if (role == 'active' && turn.length > 1 && !has_player_state(uplayer)) {
		styles = boldstyle;
		text = `It's your turn!!!`;
		d.innerHTML = text; mStyle(d, styles);
	} else if (role == 'active' && turn.length == 1) {
		styles = boldstyle;
		text = `It's your turn!!!`;
		d.innerHTML = text; mStyle(d, styles);
	} else if (DA.showTestButtons) {
		let pls = turn.filter(x => x != uname && !has_player_state(x));
		if (isEmpty(pls)) pls = [host];
		let dpics = mDiv(d, { gap: 10 }); mCenterCenterFlex(dpics);
		for (const plname of pls) {
			let pic = get_user_pic(plname, sz = 30, border = 'solid medium white');
			mStyle(pic, { cursor: 'pointer' })
			pic.onclick = () => transferToPlayer(plname);
			mAppend(dpics, pic);
		}
	} else {
		styles = normalstyle;
		text = `(waiting for other players)`;
		d.innerHTML = text; mStyle(d, styles);
	}
}
function show_special_popup(title, onsubmit, styles = {}) {
	let dParent = mBy('dBandMessage');
	if (nundef(dParent)) dParent = mDiv(document.body, {}, 'dBandMessage');
	show(dParent);
	clearElement(dParent);
	addKeys({ position: 'fixed', top: 154, classname: 'slow_gradient_blink', vpadding: 10, align: 'center', position: 'absolute', fg: 'white', fz: 24, w: '100vw' }, styles);
	if (!isEmpty(styles.classname)) { mClass(dParent, styles.classname); }
	delete styles.classname;
	mStyle(dParent, styles);
	mDiv(dParent, {}, null, title)
	let dContent = mDiv(dParent, { bg: 'silver' })
	DA.popupitems = [];
	let irow = 0;
	let buttonstyle = { maleft: 10, vmargin: 2, rounding: 6, padding: '4px 12px 5px 12px', border: '0px solid transparent', outline: 'none' }
	for (const list of [...arguments].slice(3)) {
		let d = mDiv(dContent, { padding: 10 }, `d_line_${irow}`);
		mCenterFlex(d);
		let items = ui_get_string_items(list);
		DA.popupitems = DA.popupitems.concat(items);
		let sample = items[0];
		let type = sample.itemtype = isNumber(sample.a) ? 'number' : is_card(sample.a) ? 'card' : is_player(sample.a) ? 'player' : isdef(sample.o) ? 'container' : is_color(sample.a) ? 'color' : 'string';
		let icol = 0;
		for (const item of items) {
			item.div = mButton(item.a, unselect_select, d, buttonstyle, 'selectable_button', `b_${irow}_${icol}`);
			item.id = item.div.id;
			item.irow = irow;
			item.icol = icol;
			if (type == 'color') mStyle(item.div, { bg: item.a, fg: 'contrast' });
			icol++;
		}
		irow++;
	}
	mButton("submit", gift_experience_points, dContent, buttonstyle, ['donebutton', 'enabled']);
	mButton("cancel", () => { mRemove('dBandMessage'); }, dContent, buttonstyle, ['donebutton', 'enabled']);
}
function show_takeover_ui() {
	DA.omnipower = true;
	let [pldata, stage, A, fen, phase, uplayer, turn, uname, host, mode] = [Z.playerdata, Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.turn, Z.uname, Z.host, Z.mode];
	if (mode != 'multi') return;
	if (turn.length > 1 && turn.includes(uname) && !has_player_state(uname)) return;
	if (turn.length == 1 && turn[0] == uplayer) return;
	let dTakeover = mBy('dTakeover'); show(dTakeover); mClear(dTakeover);
	dTakeover.innerHTML = '' + stage + ': ';
	let pls = turn.filter(x => x != uname && !has_player_state(x));
	if (isEmpty(pls)) pls = [host];
	for (const plname of pls) {
		let pic = get_user_pic(plname, sz = 35, border = 'solid medium white');
		mStyle(pic, { cursor: 'pointer' })
		pic.onclick = () => transferToPlayer(plname);
		mAppend(dTakeover, pic);
	}
}
function sortCardObjectsByRank(arr, ranks, ckeyprop) {
	if (isEmpty(arr)) return [];
	if (is_nc_card(arr[0][ckeyprop])) return sortByFunc(arr, x => Number(stringBefore(x[ckeyprop], '_')));
	if (nundef(ranks)) ranks = valf(lookup(Z, ['fen', 'ranks']), 'A23456789TJQK');
	return sortByFunc(arr, x => ranks.indexOf(x[ckeyprop][0]));
}
function sortCardObjectsByRankDesc(arr, ranks, ckeyprop) {
	let res = sortCardObjectsByRank(arr, ranks, ckeyprop);
	return arrReverse(res);
}
function sortCardsByRank(arr, ranks) {
	if (isEmpty(arr)) return [];
	if (is_nc_card(arr[0])) return sortByFunc(arr, x => Number(stringBefore(x, '_')));
	if (nundef(ranks)) ranks = valf(lookup(Z, ['fen', 'ranks']), 'A23456789TJQK');
	return sortByFunc(arr, x => ranks.indexOf(x[0]));
}
function sortCardsByRankDesc(arr, ranks) {
	let res = sortCardsByRank(arr, ranks);
	return arrReverse(res);
}
function start_new_generation(fen, players, options) {
	let deck_discard = fen.deck_discard = [];
	let deck_ballots = [];
	let handsize = fen.handsize;
	let ctype = fen.cardtype;
	if (ctype == 'c52') {
		let ranks = fen.ranks = '*A23456789TJQK';
		let tb = {
			4: ['4', '5', 5, 12, 1],
			5: ['4', 'T', 6, 2, 1],
			6: ['2', 'T', 6, 0, 1],
			7: ['A', 'T', 6, 2, 1],
			8: ['2', 'K', 6, 0, 1],
			9: ['A', 'K', 6, 0, 1],
			10: ['2', 'K', 5, 2, 1],
			11: ['A', 'K', 5, 3, 1],
			12: ['2', '8', 5, 4, 2],
			13: ['2', '9', 5, 2, 2],
			14: ['2', '9', 5, 2, 2], //add 4 10s
		};
		if (nundef(players)) players = get_keys(fen.players);
		let N = players.length;
		let [r0, r1, hz, jo, numdecks] = tb[N];
		for (let i = ranks.indexOf(r0); i <= ranks.indexOf(r1); i++) {
			for (let nd = 0; nd < numdecks; nd++) {
				let c = ranks[i];
				for (const suit of 'SHDC') { deck_ballots.push(c + suit + 'n'); }
			}
		}
		if (N == 14) { for (const suit of 'SHDC') { deck_ballots.push('T' + suit + 'n'); } }
		for (let i = 0; i < jo; i++) { deck_ballots.push('*' + (i % 2 ? 'H' : 'S') + 'n'); }
	} else if (ctype == 'num') {
		let ncolors = fen.colors.length;
		let nplayers = get_keys(fen.players).length;
		let ranks = fen.ranks = calcNumRanks(players.length * handsize, 2, ncolors);
		let ncards = handsize * nplayers;
		let colors = fen.colors;
		let n = 1;
		while (deck_ballots.length < ncards) {
			for (const i of range(2)) {
				for (const c of colors) { deck_ballots.push(`${n}_${c}`); }
				if (deck_ballots.length >= ncards) break;
			}
			n++;
		}
		n--;
		fen.ranks = range(1, n);
	}
	shuffle(deck_ballots); //console.log('deck', deck_ballots);
	fen.deck_ballots = deck_ballots;
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		pl.hand = deck_deal(deck_ballots, handsize);
	}
	let gens = lookup(fen, ['generations']);
	let last_winning_color = gens && gens.length >= 1 ? arrLast(gens).color : null;
	fen.policies = [];
	if (last_winning_color && fen.colors.includes(last_winning_color)) {
		fen.policies.push(last_winning_color); //get_color_card(last_winning_color)); //'Q' + (last_winning_color == 'red' ? 'H' : 'S') + 'n');
	}
	fen.validvoters = jsCopy(players)
	fen.crisis = 0;
	delete fen.president;
	delete fen.newpresident;
	delete fen.isprovisional;
	delete fen.player_cards;
	delete fen.accused;
	delete fen.dominance;
}
function start_new_poll() {
	Z.stage = 'hand';
	Z.fen.cardsrevealed = false;
	Z.fen.wrong_guesses = 0;
	Z.fen.presidents_poll = [];
	Z.turn = get_valid_voters();
	take_turn_fen_clear();
}
function there_are_bots() {
	let players = get_values(Z.fen.players);
	return firstCond(players, x => x.playmode != 'human');
}
function toggle_mode() {
	let mode = valf(Clientdata.mode, Z.mode);
	let newmode = mode == 'multi' ? 'hotseat' : 'multi';
	let b = mBy('dAdvancedUI').children[1];
	if (newmode == 'multi') { b.innerHTML = 'M'; mStyle(b, { fg: 'blue' }) }
	else { b.innerHTML = 'H'; mStyle(b, { fg: 'red' }) }
	return newmode;
}
function toggle_visibility(elem) {
	elem = toElem(elem);
	if (nundef(elem)) return;
	let vis = elem.style.display;
	if (vis == 'none') { show(elem); return true; } else { hide(elem); return false; }
}
function transferToPlayer(plname) {
	stopgame();
	clear_screen();
	set_user(plname);	//U = firstCond(Serverdata.users, x => x.name == plname);	//localStorage.setItem('uname', U.name); DA.secretuser = U.name;
	assertion(U.name == plname, 'set_user nicht geklappt!!!!!!!')
	show_username(true);
}
function turn_has_bots_that_must_move() {
	let [turn, pldata] = [Z.turn, Z.playerdata];
	if (isEmpty(pldata)) return [];
	let pldata_dict = list2dict(pldata, 'name');
	let bots_on_turn = turn.filter(x => Z.fen.players[x].playmode != 'human');
	for (const bot of bots_on_turn) {
	}
	let no_pldata = bots_on_turn.filter(x => !isDict(pldata_dict[x].state));
	let is_bot_turn = turn.length == bots_on_turn.length;
	if (is_bot_turn && turn.length == 1) return [turn];
	return no_pldata;
}
function ui_add_accuse_container_title(title, cont, items, show_if_empty) {
	if (isdef(title) && (!isEmpty(items) || show_if_empty)) {
		let elem = mText(title, cont, { margin: 3 });
		return elem;
	}
	return null;
}
function ui_get_player_items(playernames) {
	let items = [], i = 0;
	for (const plname of playernames) {
		let plui = UI.stats[plname];
		plui.div = plui.dimg;
		plui.itemtype = 'player';
		let item = { o: plui, a: plname, key: plname, friendly: plname, path: `stats.${plname}`, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_type_accuse_hand(list, dParent, styles = {}, path = 'hand', title = 'hand', get_card_func = ari_get_card, show_if_empty = false) {
	let cont = ui_make_container(dParent, styles);
	let items = list.map(x => get_card_func(x));
	let cardcont = mDiv(cont);
	let card = isEmpty(items) ? { w: 1, h: valf(styles.h, Config.ui.card.h), ov: 0 } : items[0];
	let splay = 2;
	mContainerSplay(cardcont, splay, card.w, card.h, items.length, card.ov * card.w);
	ui_add_cards_to_hand_container(cardcont, items, list);
	let dtitle = ui_add_accuse_container_title(title, cont, items, show_if_empty);
	return {
		ctype: 'hand',
		list: list,
		path: path,
		container: cont,
		cardcontainer: cardcont,
		splay: splay,
		items: items,
		dtitle: dtitle,
	};
}
function ui_type_accuse_policies(list, dParent, styles = {}, path = 'hand', title = 'hand', get_card_func = ari_get_card, show_if_empty = false) {
	let cont = ui_make_container(dParent, styles);
	let items = list.map(x => get_card_func(x));
	for (const item of items) {
		let d = iDiv(item);
		let color = item.ckey;
		let c = get_nc_complement_array(color); //colorMix((color,.7)
		mStyle(d, { bg: c, border: color }); //`solid 2px ${color}`,box:true}); //color,thickness:3,box:true}); //'#ddd',border:item.ckey});
	}
	let cardcont = mDiv(cont);
	let card = isEmpty(items) ? { w: 1, h: valf(styles.h, Config.ui.card.h), ov: 0 } : items[0];
	let splay = 2;
	mContainerSplay(cardcont, splay, card.w, card.h, items.length, card.ov * card.w);
	ui_add_cards_to_hand_container(cardcont, items, list);
	let dtitle = ui_add_accuse_container_title(title, cont, items, show_if_empty);
	return {
		ctype: 'hand',
		list: list,
		path: path,
		container: cont,
		cardcontainer: cardcont,
		splay: splay,
		items: items,
		dtitle: dtitle,
	};
}
function unselect_select(ev) {
	let id = evToId(ev);
	let [irow, icol] = allNumbers(id);
	let newitem = null;
	for (const item of DA.popupitems) {
		let id1 = iDiv(item).id;
		let [irow1, icol1] = allNumbers(id1);
		if (irow1 == irow && icol1 != icol && item.isSelected) {
			make_string_unselected(item);
			item.isSelected = false;
		} else if (irow1 == irow && icol1 == icol) {
			newitem = item;
		}
	}
	if (newitem.isSelected) { make_string_unselected(newitem); newitem.isSelected = false; }
	else { make_string_selected(newitem); newitem.isSelected = true; }
}
//#endregion accuse

//#region aristo
function a2_pay_with_card(item) {
	let fen = Z.fen;
	let source = lookup(fen, item.path.split('.'));
	elem_from_to_top(item.key, source, fen.deck_discard);
	ari_reorg_discard(fen);
}
function a2_pay_with_coin(uplayer) {
	let fen = Z.fen;
	fen.players[uplayer].coins -= 1;
}
function add_auction_history() {
	let [fen, plorder] = [Z.fen, Z.plorder];
	for (const plname of fen.plorder) {
		if (nundef(fen.buy[plname])) continue;
		ari_history_list([`${plname} buys ${fen.buy[plname].a} for ${fen.second_most}`], 'auction');
	}
}
function add_schwein(card, fenbuilding, uibuilding) {
	if (isdef(uibuilding)) add_ui_schwein(card, uibuilding.schweine);
	let ckey = isString(card) ? card : card.key;
	let index = isString(card) ? fenbuilding.list.indexOf(ckey) : card.index;
	fenbuilding.schweine.push(index);
	console.log('fen schweine', fenbuilding.schweine);
}
function add_ui_schwein(item, uischweine) {
	uischweine.push(item);
	mStyle(iDiv(item), { position: 'relative' });
	miPic('pig', iDiv(item), { position: 'absolute', top: 30, left: 0, fz: 30 });
	face_up(item);
}
function aggregate_player(fen, prop) {
	let res = [];
	for (const uplayer in fen.players) {
		let list = fen.players[uplayer][prop];
		res = res.concat(list);
	}
	return res;
}
function ai_pick_legal_exchange() {
	let [A, fen, uplayer, items] = [Z.A, Z.fen, Z.uplayer, Z.A.items];
	let firstPick = rChoose(items, 1, x => x.path.includes('building'));
	let secondPick = rChoose(items, 1, x => !x.path.includes('building'));
	return [firstPick, secondPick];
}
function ai_pick_legal_trade() {
	let [A, fen, uplayer, items] = [Z.A, Z.fen, Z.uplayer, Z.A.items];
	let stall = fen.players[uplayer].stall;
	let firstPick = rChoose(items, 1, x => x.path.includes(uplayer)); //stall.includes(x.key));
	let secondPick = rChoose(items, 1, x => !x.path.includes(uplayer));
	return [firstPick, secondPick];
}
function animbuilding(ui_building, ms = 800, callback = null) {
	let d = ui_building.cardcontainer;
	let ani = [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }];
	let options = {
		duration: ms,
		iterations: 1,
		easing: 'ease-out',
	};
	let a = d.animate(ani, options);
	a.onfinish = callback;
}
function animcoin(plname, ms = 800, callback = null) {
	let d = UI.player_stat_items[plname].dCoin;
	let ani = [{ transform: 'scale(1)' }, { transform: 'scale(3)' }, { transform: 'scale(1)' }];
	let options = {
		duration: ms,
		iterations: 1,
		easing: 'ease-out',
	};
	let a = d.animate(ani, options);
	a.onfinish = () => {
		let uplayer = Z.uplayer;
		let dAmount = UI.player_stat_items[uplayer].dAmount;
		dAmount.innerHTML = Z.fen.players[uplayer].coins;
		mStyle(dAmount, { fg: 'red' });
		if (callback) callback();
	};
}
function animtest(d, ms = 1000, callback) {
	let spinAway = [
		{ transform: 'rotate(0) scale(1)' },
		{ transform: 'rotate(360deg) scale(0)' }
	];
	spinAway = [
		{ transform: 'rotate(0) scale(1)' },
		{ transform: 'rotate(180deg) scale(0)' },
		{ transform: 'rotate(360deg) scale(2)' }
	];
	spinAway = [
		{ transform: 'scale(1)' },
		{ transform: 'scale(3)' },
		{ transform: 'scale(1)' }
	];
	let options = {
		duration: ms,
		iterations: 1,
		easing: 'ease-out', //'cubic-bezier(.24,.65,.78,.03)',
	}
	d.addEventListener('click', (ev) => {
		evNoBubble(ev);
		let a = d.animate(spinAway, options);
		a.onfinish = callback;
	});
}
function anipulse(d, ms = 3000, callback) {
	let a = d.animate(
		[{
			'background-color': '#2ba805',
			'box-shadow': '0 0 3px #2ba805'
		},
		{
			'background-color': `#49e819`,
			'box-shadow': `0 0 10px #49e819`,
		},
		{
			'background-color': `#2ba805`,
			'box-shadow': `0 0 3px #2ba805`
		}], { fill: 'both', duration: ms, easing: 'ease', delay: 1000 });
	a.onfinish = callback;
	return a;
}
function ari_activate_ui() { ari_pre_action(); }
function ari_add_hand_card() {
	let fen = Z.fen;
	for (const uplayer of fen.plorder) {
		ari_ensure_deck(fen, 1);
		top_elem_from_to(fen.deck, fen.players[uplayer].hand);
	}
}
function ari_add_harvest_cards(fen) {
	for (const plname of fen.plorder) {
		for (const f of fen.players[plname].buildings.farm) {
			if (nundef(f.h)) {
				let list = [];
				ari_ensure_deck(fen, 1);
				top_elem_from_to(fen.deck, list);
				f.h = list[0];
			}
		}
	}
}
function ari_add_rumor(fenbuilding, key) {
	if (nundef(fenbuilding.rumors)) fenbuilding.rumors = [];
	fenbuilding.rumors.push(key);
}
function ari_calc_fictive_vps(fen, plname) {
	let pl = fen.players[plname];
	let bs = pl.buildings;
	let vps = calc_building_vps(bs);
	return vps;
}
function ari_calc_real_vps(fen, plname) {
	let pl = fen.players[plname];
	let bs = ari_get_correct_buildings(pl.buildings);
	let vps = calc_building_vps(bs);
	for (const btype in bs) {
		let blist = bs[btype];
		for (const b of blist) {
			let lead = b.list[0];
			if (firstCond(pl.commissions, x => x[0] == lead[0])) {
				vps += 1;
			}
		}
	}
	return vps;
}
function ari_check_action_available(a, fen, uplayer) {
	let cards;
	let pl = fen.players[uplayer];
	if (a == 'trade') {
		cards = ari_get_all_trading_cards(fen);
		let not_pl_stall = cards.filter(x => !pl.stall.includes(x.key));
		return cards.length >= 2 && pl.stall.length > 0 && not_pl_stall.length > 0;
	} else if (a == 'exchange') {
		cards = ari_get_all_wrong_building_cards(fen, uplayer);
		return cards.length > 0 && (pl.hand.length + pl.stall.length > 0);
	} else if (a == 'build') {
		let res = ari_get_player_hand_and_stall(fen, uplayer);
		if (res.length < 4) return false;
		let has_a_king = firstCond(res, x => x[0] == 'K');
		if (pl.coins < 1 && !has_a_king) return false;
		if (fen.phase != 'king' && (!has_a_king || res.length < 5)) return false;
		if (pl.coin == 0 && res.length < 5) return false;
		return true;
	} else if (a == 'upgrade') {
		if (isEmpty(pl.buildings.farm) && isEmpty(pl.buildings.estate)) return false;
		let res = ari_get_player_hand_and_stall(fen, uplayer);
		if (isEmpty(res)) return false;
		let has_a_king = firstCond(res, x => x[0] == 'K');
		if (pl.coins < 1 && !has_a_king) return false;
		if (fen.phase != 'king' && !has_a_king) return false;
		if (pl.coin == 0 && res.length < 2) return false;
		return true;
	} else if (a == 'downgrade') {
		if (isEmpty(pl.buildings.chateau) && isEmpty(pl.buildings.estate)) return false;
		return true;
	} else if (a == 'buy') {
		if (fen.open_discard.length == 0) return false;
		let res = ari_get_player_hand_and_stall(fen, uplayer);
		let has_a_jack = firstCond(res, x => x[0] == 'J');
		if (pl.coins < 1 && !has_a_jack) return false;
		if (fen.phase != 'jack' && !has_a_jack) return false;
		return true;
	} else if (a == 'visit') {
		let others = fen.plorder.filter(x => x != uplayer);
		let n = 0;
		for (const plname of others) {
			for (const k in fen.players[plname].buildings) {
				n += fen.players[plname].buildings[k].length;
			}
		}
		if (n == 0) return false;
		let res = ari_get_player_hand_and_stall(fen, uplayer);
		let has_a_queen = firstCond(res, x => x[0] == 'Q');
		if (pl.coins < 1 && !has_a_queen) return false;
		if (fen.phase != 'queen' && !has_a_queen) return false;
		return true;
	} else if (a == 'harvest') {
		let harvests = ari_get_all_building_harvest_cards(fen, uplayer);
		return !isEmpty(harvests);
	} else if (a == 'pickup') {
		return !isEmpty(pl.stall);
	} else if (a == 'sell') {
		return pl.stall.length >= 2;
	} else if (a == 'pass') {
		return true;
	} else if (a == 'commission') {
		for (const c of pl.commissions) {
			let rank = c[0];
			if (firstCond(pl.stall, x => x[0] == rank)) return true; //nur wenn in stall!!!!!!
		}
		return false;
	} else if (a == 'rumor') {
		if (isEmpty(pl.rumors)) return false;
		let others = fen.plorder.filter(x => x != uplayer);
		let n = 0;
		for (const plname of others) {
			for (const k in fen.players[plname].buildings) {
				n += fen.players[plname].buildings[k].length;
			}
		}
		if (n == 0) return false;
		return true;
	} else if (a == 'inspect') {
		if (isEmpty(pl.rumors)) return false;
		let others = fen.plorder.filter(x => x != uplayer);
		let n = 0;
		for (const plname of others) {
			for (const k in fen.players[plname].buildings) {
				n += fen.players[plname].buildings[k].length;
			}
		}
		return n > 0;
	} else if (a == 'blackmail') {
		let others = fen.plorder.filter(x => x != uplayer);
		let n = 0;
		for (const plname of others) {
			for (const k in fen.players[plname].buildings) {
				let list = fen.players[plname].buildings[k];
				let building_with_rumor = firstCond(list, x => !isEmpty(x.rumors));
				if (building_with_rumor) n++;
			}
		}
		if (n == 0) return false;
		let res = ari_get_player_hand_and_stall(fen, uplayer);
		let has_a_queen = firstCond(res, x => x[0] == 'Q');
		if (pl.coins < 1 && !has_a_queen) return false;
		if (fen.phase != 'queen' && !has_a_queen) return false;
		return true;
	} else if (a == 'buy rumor') {
		if (fen.deck_rumors.length == 0) return false;
		if (pl.coins < 1) return false;
		return true;
	}
}
function ari_check_end_condition(blist) {
	let nchateau = blist.chateau.length;
	let nfarm = blist.farm.length;
	let nestate = blist.estate.length;
	if (nchateau >= 2 || nchateau >= 1 && nfarm >= 3 || nchateau >= 1 && nestate >= 2) {
		return true;
	}
	return false;
}
function ari_clear_church() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	for (const prop of ['church', 'church_order', 'selorder', 'tithemin', 'tithe_minimum', 'toBeSelected', 'candidates']) delete fen[prop];
	for (const plname in fen.players) {
		delete fen.players[plname].tithes;
	}
	fen.church = ari_deck_deal_safe(fen, Z.plorder.length);
}
function ari_deck_deal_safe(fen, n) { ari_ensure_deck(fen, n); return deck_deal(fen.deck, n); }
function ari_ensure_deck(fen, n) {
	if (fen.deck.length < n) { ari_refill_deck(fen); }
}
function ari_get_actions(uplayer) {
	let fen = Z.fen;
	let actions = exp_rumors(Z.options) ? ['trade', 'exchange', 'build', 'upgrade', 'downgrade', 'buy', 'buy rumor', 'rumor', 'inspect', 'blackmail', 'harvest', 'pickup', 'sell', 'tithe', 'commission']
		: ['trade', 'exchange', 'build', 'upgrade', 'downgrade', 'buy', 'visit', 'harvest', 'pickup', 'sell', 'tithe', 'commission'];
	if (Config.autosubmit) actions.push('pass'); ////, 'pass'];
	let avail_actions = [];
	for (const a of actions) {
		let avail = ari_check_action_available(a, fen, uplayer);
		if (avail) avail_actions.push(a);
	}
	return avail_actions;
}
function ari_get_all_building_harvest_cards(fen, uplayer) {
	let res = [];
	let pl = fen.players[uplayer];
	for (const b of pl.buildings.farm) {
		if (b.h) res.push({ b: b, h: b.h });
	}
	return res;
}
function ari_get_all_trading_cards(fen) {
	let res = [];
	fen.market.map(c => res.push({ key: c, path: 'market' }));
	for (const uplayer of fen.plorder) {
		let pl = fen.players[uplayer];
		let stall = pl.stall;
		stall.map(x => res.push({ key: x, path: `players.${uplayer}.stall` }));
	}
	return res;
}
function ari_get_all_wrong_building_cards(fen, uplayer) {
	let res = [];
	let pl = fen.players[uplayer];
	for (const k in pl.buildings) {
		for (const b of pl.buildings[k]) {
			let bcards = b.list;
			let lead = bcards[0];
			let [rank, suit] = [lead[0], lead[1]];
			for (let i = 1; i < bcards.length; i++) {
				if (bcards[i][0] != rank) res.push({ c: bcards[i], building: b });
			}
		}
	}
	return res;
}
function ari_get_building_type(obuilding) { let n = obuilding.list.length; return n == 4 ? 'farm' : n == 5 ? 'estate' : 'chateau'; }
function ari_get_correct_buildings(buildings) {
	let bcorrect = { farm: [], estate: [], chateau: [] };
	for (const type in buildings) {
		for (const b of buildings[type]) {
			let list = b.list;
			let lead = list[0];
			let iscorrect = true;
			for (const key of arrFromIndex(list, 1)) {
				if (key[0] != lead[0]) { iscorrect = false; continue; }
			}
			if (iscorrect) {
				lookupAddIfToList(bcorrect, [type], b);
			}
		}
	}
	return bcorrect; // [bcorrect, realvps];
}
function ari_get_first_tax_payer(fen, pl_tax) { return ari_get_tax_payer(fen, pl_tax, 0); }
function ari_get_max_journey_length(fen, uplayer) {
	let pl = fen.players[uplayer];
	let sorted_journeys = sortByDescending(pl.journeys.map(x => ({ arr: x, len: x.length })), 'len');
	return isEmpty(pl.journeys) ? 0 : sorted_journeys[0].len;
}
function ari_get_player_hand_and_stall(fen, uplayer) {
	let res = [];
	res = res.concat(fen.players[uplayer].hand);
	res = res.concat(fen.players[uplayer].stall);
	return res;
}
function ari_get_tax_payer(fen, pl_tax, ifrom = 0) {
	let iturn = ifrom;
	let uplayer = fen.plorder[iturn];
	if (nundef(uplayer)) return null;
	while (pl_tax[uplayer] <= 0) {
		iturn++;
		if (iturn >= fen.plorder.length) return null;
		uplayer = fen.plorder[iturn];
	}
	return uplayer;
}
function ari_history_list(lines, title = '', fen) {
	if (nundef(fen)) fen = Z.fen;
	if (nundef(fen.history)) fen.history = [];
	if (isString(lines)) lines = [lines];
	fen.history.push({ title: title, lines: lines });
}
function ari_move_herald(fen) {
	fen.heraldorder = arrCycle(fen.heraldorder, 1);
	ari_history_list([`*** new herald: ${fen.heraldorder[0]} ***`], 'herald');
	return fen.heraldorder[0];
}
function ari_move_market_to_discard() {
	let fen = Z.fen;
	while (fen.market.length > 0) {
		elem_from_to_top(fen.market[0], fen.market, fen.deck_discard);
	}
	ari_reorg_discard();
}
function ari_move_stalls_to_hands() {
	let fen = Z.fen;
	for (const uplayer of fen.plorder) {
		fen.players[uplayer].hand = fen.players[uplayer].hand.concat(fen.players[uplayer].stall);
		fen.players[uplayer].stall = [];
	}
}
function ari_next_action() {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	deactivate_ui();
	console.assert(isdef(Z.num_actions));
	fen.num_actions -= 1;
	fen.action_number += 1;
	if (fen.num_actions <= 0) {
		fen.total_pl_actions = 0;
		lookupAddIfToList(fen, ['actionsCompleted'], uplayer);
		let next = ari_select_next_player_according_to_stall_value(fen);
		if (!next) {
			ari_next_phase();
		} else {
			Z.turn = [next];
		}
	} else {
		Z.stage = 5;
	}
	take_turn_fen();
}
function ari_next_phase() {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	ari_move_market_to_discard();
	ari_move_stalls_to_hands();
	ari_add_hand_card();
	delete fen.actionsCompleted;
	delete fen.stallSelected;
	Z.turn = [fen.plorder[0]];
	if (Z.stage == 10) {
		Z.phase = 'queen';
		[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, Z.phase);
	} else if (fen.phase == 'king') {
		fen.pl_gameover = [];
		for (const plname of fen.plorder) {
			let bcorrect = ari_get_correct_buildings(fen.players[plname].buildings);
			let can_end = ari_check_end_condition(bcorrect);
			if (can_end) fen.pl_gameover.push(plname);
		}
		if (!isEmpty(fen.pl_gameover)) {
			Z.stage = 10;
			Z.turn = [fen.pl_gameover[0]];
		} else {
			Z.phase = 'queen';
			[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, Z.phase);
		}
	} else if (fen.phase == 'queen') {
		for (const uplayer of fen.plorder) {
			for (const k in fen.players[uplayer].buildings) {
				if (k == 'farm') continue;
				let n = fen.players[uplayer].buildings[k].length;
				fen.players[uplayer].coins += n;
				if (n > 0) ari_history_list([`${uplayer} gets ${n} coins for ${k} buildings`], 'payout');
			}
		}
		Z.phase = 'jack';
		[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, Z.phase);
	} else {
		fen.herald = ari_move_herald(fen, uplayer);
		fen.plorder = jsCopy(fen.heraldorder);
		ari_add_harvest_cards(fen);
		Z.phase = 'king';
		let taxneeded = ari_tax_phase_needed(fen);
		Z.turn = taxneeded ? fen.turn : [fen.herald];
		if (taxneeded) Z.stage = 2; else[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, Z.phase);
	}
	return Z.stage;
}
function ari_open_market(fen, phase, deck, market) {
	DA.qanim = [];
	let n_market = phase == 'jack' ? 3 : 2;
	fen.stage = Z.stage = phase == 'jack' ? 12 : phase == 'queen' ? 11 : 4;
	fen.stallSelected = [];
	delete fen.passed;
	for (let i = 0; i < n_market; i++) {
		DA.qanim.push([qanim_flip_topmost, [deck]]);
		DA.qanim.push([qanim_move_topmost, [deck, market]]);
		DA.qanim.push([q_move_topmost, [deck, market]]);
	}
	DA.qanim.push([q_mirror_fen, ['deck', 'market']]);
	DA.qanim.push([ari_pre_action, []]);
	qanim();
}
function ari_open_rumors(stage = 28) {
	let [fen, deck] = [Z.fen, UI.deck_rumors];
	DA.qanim = [];
	fen.stage = Z.stage = stage;
	let n = Math.min(2, fen.deck_rumors.length);
	let cards = arrTake(fen.deck_rumors, n);
	let uicards = cards.map(x => ari_get_card(x));
	let dest = UI.rumor_top = ui_type_market([], deck.container.parentNode, { maleft: 12 }, `rumor_top`, 'rumor_top', ari_get_card);
	mMagnifyOnHoverControlPopup(dest.cardcontainer);
	for (let i = 0; i < n; i++) {
		DA.qanim.push([qanim_flip_topmost, [deck]]);
		DA.qanim.push([qanim_move_topmost, [deck, dest]]);
		DA.qanim.push([q_move_topmost, [deck, dest]]);
	}
	DA.qanim.push([q_mirror_fen, ['deck_rumors', 'rumor_top']]);
	DA.qanim.push([ari_pre_action, []]);
	qanim();
}
function ari_pre_action() {
	let [stage, A, fen, phase, uplayer, deck, market] = [Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer, Z.deck, Z.market];
	if (Z.num_actions > 0) fen.progress = `(action ${Z.action_number} of ${Z.total_pl_actions})`; else delete fen.progress;
	show_progress();
	switch (ARI.stage[stage]) {
		case 'action: command': Z.stage = 6; select_add_items(ui_get_commands(uplayer), process_command, 'must select an action', 1, 1); break; //5
		case 'action step 2':
			switch (A.command) {
				case 'trade': select_add_items(ui_get_trade_items(uplayer), post_trade, 'must select 2 cards to trade', 2, 2); break;
				case 'build': select_add_items(ui_get_payment_items('K'), payment_complete, 'must select payment for building', 1, 1); break;
				case 'upgrade': select_add_items(ui_get_payment_items('K'), payment_complete, 'must select payment for upgrade', 1, 1); break;
				case 'downgrade': select_add_items(ui_get_building_items(uplayer, A.payment), process_downgrade, 'must select a building to downgrade', 1, 1); break;
				case 'pickup': select_add_items(ui_get_stall_items(uplayer), post_pickup, 'must select a stall card to take into your hand', 1, 1); break;
				case 'harvest': select_add_items(ui_get_harvest_items(uplayer), post_harvest, 'must select a farm to harvest from', 1, 1); break;
				case 'sell': select_add_items(ui_get_stall_items(uplayer), post_sell, 'must select 2 stall cards to sell', 2, 2); break;
				case 'buy': select_add_items(ui_get_payment_items('J'), payment_complete, 'must select payment option', 1, 1); break;
				case 'buy rumor': ari_open_rumors(); break;
				case 'exchange': select_add_items(ui_get_exchange_items(uplayer), post_exchange, 'must select cards to exchange', 2, 2); break;
				case 'visit': select_add_items(ui_get_payment_items('Q'), payment_complete, 'must select payment for visiting', 1, 1); break;
				case 'rumor': select_add_items(ui_get_other_buildings_and_rumors(uplayer), process_rumor, 'must select a building and a rumor card to place', 2, 2); break;
				case 'inspect': select_add_items(ui_get_other_buildings(uplayer), process_inspect, 'must select building to visit', 1, 1); break;
				case 'blackmail': select_add_items(ui_get_payment_items('Q'), payment_complete, 'must select payment for blackmailing', 1, 1); break;
				case 'commission': select_add_items(ui_get_commission_items(uplayer), process_commission, 'must select a card to commission', 1, 1); break;
				case 'pass': post_pass(); break;
			}
			break;
		case 'pick_schwein': select_add_items(ui_get_schweine_candidates(A.uibuilding), post_inspect, 'must select the new schwein', 1, 1); break;
		case 'comm_weitergeben': if (!is_playerdata_set(uplayer)) select_add_items(ui_get_all_commission_items(uplayer), process_comm_setup, `must select ${fen.comm_setup_num} card${fen.comm_setup_num > 1 ? 's' : ''} to discard`, fen.comm_setup_num, fen.comm_setup_num); break;
		case 'rumors_weitergeben':
			let rumitems = ui_get_rumors_and_players_items(uplayer);
			if (isEmpty(rumitems)) {
				show_waiting_message('waiting for other players...');
				Z.state = null;
				let done = rumor_playerdata_complete();
				if (done){
					Z.turn = [Z.host];
					Z.stage = 105; //'next_rumors_setup_stage';
					clear_transaction();
					take_turn_fen();
				}else autopoll();
			} else select_add_items(rumitems, process_rumors_setup, `must select a player and a rumor to pass on`, 2, 2);
			break;
		case 'next_rumor_setup_stage': post_rumor_setup(); break;
		case 'buy rumor': select_add_items(ui_get_top_rumors(), post_buy_rumor, 'must select one of the new rumor cards', 1, 1); break;
		case 'rumor discard': select_add_items(ui_get_rumors_items(uplayer), process_rumor_discard, 'must select a rumor card to discard', 1, 1); break;
		case 'rumor_both': select_add_items(ui_get_top_rumors(), post_rumor_both, 'must select one of the new rumor cards', 1, 1); break;
		case 'blackmail': select_add_items(ui_get_other_buildings_with_rumors(uplayer), process_blackmail, 'must select a building to blackmail', 1, 1); break;
		case 'blackmail_owner': select_add_items(ui_get_blackmailed_items(), being_blackmailed, 'must react to BLACKMAIL!!!', 1, 1); break; //console.log('YOU ARE BEING BLACKMAILED!!!',uplayer); break;
		case 'accept_blackmail': select_add_items(ui_get_stall_items(uplayer), post_accept_blackmail, 'must select a card to pay off blackmailer', 1, 1); break;
		case 'blackmail_complete': post_blackmail(); break;
		case 'journey': select_add_items(ui_get_hand_and_journey_items(uplayer), process_journey, 'may form new journey or add cards to existing one'); break;
		case 'add new journey': post_new_journey(); break;
		case 'auto market': ari_open_market(fen, phase, deck, market); break;
		case 'TEST_starts_in_stall_selection_complete':
			if (is_stall_selection_complete()) {
				delete fen.stallSelected;
				fen.actionsCompleted = [];
				if (check_if_church()) ari_start_church_stage(); else ari_start_action_stage();
			} else select_add_items(ui_get_hand_items(uplayer), post_stall_selected, 'must select your stall'); break;
		case 'stall selection': select_add_items(ui_get_hand_items(uplayer), post_stall_selected, 'must select cards for stall'); break;
		case 'church': select_add_items(ui_get_hand_and_stall_items(uplayer), post_tithe, `must select cards to tithe ${isdef(fen.tithemin) ? `(current minimum is ${fen.tithemin})` : ''}`, 1, 100); break;
		case 'church_minplayer_tithe_add': select_add_items(ui_get_hand_and_stall_items(uplayer), post_tithe_minimum, `must select cards to reach at least ${fen.tithe_minimum}`, 1, 100); break;
		case 'church_minplayer_tithe_downgrade': select_add_items(ui_get_building_items(uplayer, A.payment), process_downgrade, 'must select a building to downgrade', 1, 1); break;
		case 'church_minplayer_tithe': console.log('NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
			let pl = fen.players[uplayer];
			let hst = pl.hand.concat(pl.stall);
			let vals = hst.map(x => ari_get_card(x).val);
			let sum = arrSum(vals);
			let min = fen.tithe_minimum;
			if (sum < min) {
				ari_history_list([`${uplayer} must downgrade a building to tithe ${min}!`], 'downgrade');
				select_add_items(ui_get_building_items(uplayer, A.payment), process_downgrade, 'must select a building to downgrade', 1, 1);
			} else {
				ari_history_list([`${uplayer} must tithe more cards to reach ${min}!`], 'tithe');
				select_add_items(ui_get_hand_and_stall_items(uplayer), post_tithe_minimum, `must select cards to reach at least ${fen.tithe_minimum}`, 1, 100);
			}
			break;
		case 'church_newcards':
			reveal_church_cards();
			let items = ui_get_church_items(uplayer);
			let num_select = items.length == fen.church.length ? 1 : 2;
			let instr = num_select == 1 ? `must select a card for ${fen.candidates[0]}` : 'must select card and player';
			select_add_items(items, post_church, instr, num_select, num_select);
			break;
		case 'complementing_market_after_church':
			select_add_items(ui_get_hand_items(uplayer), post_complementing_market_after_church, 'may complement stall'); break;
		case 'tax': let n = fen.pl_tax[uplayer]; select_add_items(ui_get_hand_items(uplayer), post_tax, `must pay ${n} card${if_plural(n)} tax`, n, n); break;
		case 'build': select_add_items(ui_get_build_items(uplayer, A.payment), post_build, 'must select cards to build (first card determines rank)', 4, 6, true); break;
		case 'commission_stall': select_add_items(ui_get_commission_stall_items(), process_commission_stall, 'must select matching stall card to discard', 1, 1); break;
		case 'commission new': select_add_items(ui_get_commission_new_items(uplayer), post_commission, 'must select a new commission', 1, 1); break;
		case 'upgrade': select_add_items(ui_get_build_items(uplayer, A.payment), process_upgrade, 'must select card(s) to upgrade a building', 1); break;
		case 'select building to upgrade': select_add_items(ui_get_farms_estates_items(uplayer), post_upgrade, 'must select a building', 1, 1); break;
		case 'select downgrade cards': select_add_items(A.possible_downgrade_cards, post_downgrade, 'must select card(s) to downgrade a building', 1, is_in_middle_of_church() ? 1 : 100); break;
		case 'buy': select_add_items(ui_get_open_discard_items(uplayer, A.payment), post_buy, 'must select a card to buy', 1, 1); break;
		case 'visit': select_add_items(ui_get_other_buildings(uplayer, A.payment), process_visit, 'must select a building to visit', 1, 1); break;
		case 'visit destroy': select_add_items(ui_get_string_items(['destroy', 'get cash']), post_visit, 'must destroy the building or select the cash', 1, 1); break;
		case 'ball': select_add_items(ui_get_hand_items(uplayer), post_ball, 'may add cards to the ball'); break;
		case 'auction: bid': select_add_items(ui_get_coin_amounts(uplayer), process_auction, 'must bid for the auction', 1, 1); break;
		case 'auction: buy': select_add_items(ui_get_market_items(), post_auction, 'must buy a card', 1, 1); break;
		case 'end game?': select_add_items(ui_get_endgame(uplayer), post_endgame, 'may end the game here and now or go on!', 1, 1); break;
		case 'pick luxury or journey cards': select_add_items(ui_get_string_items(['luxury cards', 'journey cards']), post_luxury_or_journey_cards, 'must select luxury cards or getting cards from the other end of the journey', 1, 1); break;
		case 'next_comm_setup_stage': select_confirm_weiter(post_comm_setup_stage); break;
		default: console.log('stage is', stage); break;
	}
}
function ari_present(dParent) {
	let [fen, ui, uplayer, stage, pl] = [Z.fen, UI, Z.uplayer, Z.stage, Z.pl];
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent);
	if (fen.num_actions > 0 && (Z.role == 'active' || Z.mode == 'hotseat')) {
		mStyle(dOben, { hmin: 110 })
	}
	ari_stats(dRechts);
	show_history(fen, dRechts);
	let deck = ui.deck = ui_type_deck(fen.deck, dOpenTable, { maleft: 12 }, 'deck', 'deck', ari_get_card);
	let market = ui.market = ui_type_market(fen.market, dOpenTable, { maleft: 12 }, 'market', 'market', ari_get_card, true);
	let open_discard = ui.open_discard = ui_type_market(fen.open_discard, dOpenTable, { maleft: 12 }, 'open_discard', 'discard', ari_get_card);
	let deck_discard = ui.deck_discard = ui_type_deck(fen.deck_discard, dOpenTable, { maleft: 12 }, 'deck_discard', '', ari_get_card);
	if (exp_commissions(Z.options)) {
		let open_commissions = ui.open_commissions = ui_type_market(fen.open_commissions, dOpenTable, { maleft: 12 }, 'open_commissions', 'bank', ari_get_card);
		mMagnifyOnHoverControlPopup(ui.open_commissions.cardcontainer);
		let deck_commission = ui.deck_commission = ui_type_deck(fen.deck_commission, dOpenTable, { maleft: 4 }, 'deck_commission', '', ari_get_card);
		let comm = ui.commissioned = ui_type_rank_count(fen.commissioned, dOpenTable, {}, 'commissioned', 'sentiment', ari_get_card);
		if (comm.items.length > 0) { let isent = arrLast(comm.items); let dsent = iDiv(isent); set_card_border(dsent, 15, 'green'); }
	}
	if (exp_church(Z.options)) {
		let church = ui.church = ui_type_church(fen.church, dOpenTable, { maleft: 28 }, 'church', 'church', ari_get_card);
	}
	if (exp_rumors(Z.options)) {
		let deck_rumors = ui.deck_rumors = ui_type_deck(fen.deck_rumors, dOpenTable, { maleft: 25 }, 'deck_rumors', 'rumors', ari_get_card);
	}
	let uname_plays = fen.plorder.includes(Z.uname);
	let show_first = uname_plays && Z.mode == 'multi' ? Z.uname : uplayer;
	let order = get_present_order();
	for (const plname of order) {
		let pl = fen.players[plname];
		let playerstyles = { w: '100%', bg: '#ffffff80', fg: 'black', padding: 4, margin: 4, rounding: 9, border: `2px ${get_user_color(plname)} solid` };
		let d = mDiv(dMiddle, playerstyles, null, get_user_pic_html(plname, 25));
		mFlexWrap(d);
		mLinebreak(d, 9);
		let hidden = compute_hidden(plname);
		ari_present_player(plname, d, hidden);
	}
	ari_show_handsorting_buttons_for(Z.mode == 'hotseat' ? Z.uplayer : Z.uname); delete Clientdata.handsorting;
	show_view_buildings_button(uplayer);
	let desc = ARI.stage[Z.stage];
	Z.isWaiting = false;
	if (isdef(fen.winners)) ari_reveal_all_buildings(fen);
	else if (desc == 'comm_weitergeben' && is_playerdata_set(uplayer)) {
		if ((Z.mode == 'hotseat' || Z.host == uplayer) && check_resolve()) {
			Z.turn = [Z.host];
			Z.stage = 104; //'next_comm_setup_stage';
		}
		show_waiting_message(`waiting for other players...`);
		Z.isWaiting = true;
	}
}
function ari_present_player(plname, d, ishidden = false) {
	let fen = Z.fen;
	let pl = fen.players[plname];
	let ui = UI.players[plname] = { div: d };
	let hand = ui.hand = ui_type_hand(pl.hand, d, {}, `players.${plname}.hand`, 'hand', ari_get_card);
	if (ishidden) { hand.items.map(x => face_down(x)); }
	let stall = ui.stall = ui_type_market(pl.stall, d, { maleft: 12 }, `players.${plname}.stall`, 'stall', ari_get_card);
	if (fen.stage < 5 && ishidden) { stall.items.map(x => face_down(x)); }
	if (exp_commissions(Z.options)) { 
		if (!ishidden) pl.commissions = correct_handsorting(pl.commissions, plname);
		ui.commissions = ui_type_market(pl.commissions, d, { maleft: 12 }, `players.${plname}.commissions`, 'commissions', Z.stage == 23 ? ari_get_card_large : ari_get_card);
		if (ishidden) { ui.commissions.items.map(x => face_down(x)); }
		else mMagnifyOnHoverControlPopup(ui.commissions.cardcontainer);
	}
	if (exp_rumors(Z.options)) { 
		if (!ishidden) pl.rumors = correct_handsorting(pl.rumors, plname);
		ui.rumors = ui_type_market(pl.rumors, d, { maleft: 12 }, `players.${plname}.rumors`, 'rumors', Z.stage == 24 ? ari_get_card_large : ari_get_card);
		if (ishidden) { ui.rumors.items.map(x => face_down(x)); }
		else mMagnifyOnHoverControlPopup(ui.rumors.cardcontainer);
	}
	ui.journeys = [];
	let i = 0;
	for (const j of pl.journeys) {
		let jui = ui_type_hand(j, d, { maleft: 12 }, `players.${plname}.journeys.${i}`, '', ari_get_card);//list, dParent, path, title, get_card_func
		i += 1;
		ui.journeys.push(jui);
	}
	mLinebreak(d, 8);
	ui.buildinglist = [];
	ui.indexOfFirstBuilding = arrChildren(d).length;
	for (const k in pl.buildings) {
		let i = 0;
		for (const b of pl.buildings[k]) {
			let type = k;
			let b_ui = ui_type_building(b, d, { maleft: 8 }, `players.${plname}.buildings.${k}.${i}`, type, ari_get_card, true, ishidden);
			b_ui.type = k;
			ui.buildinglist.push(b_ui);
			if (b.isblackmailed) { mStamp(b_ui.cardcontainer, 'blackmail'); }
			lookupAddToList(ui, ['buildings', k], b_ui); //GEHT!!!!!!!!!!!!!!!!!!!!!
			i += 1;
		}
	}
}
function ari_refill_deck(fen) {
	fen.deck = fen.deck.concat(fen.open_discard).concat(fen.deck_discard);
	shuffle(fen.deck);
	fen.open_discard = [];
	fen.deck_discard = [];
	console.log('deck refilled: contains', fen.deck.length, 'cards');
}
function ari_reorg_discard() {
	let fen = Z.fen;
	while (fen.deck_discard.length > 0 && fen.open_discard.length < 4) {
		bottom_elem_from_to(fen.deck_discard, fen.open_discard);
	}
}
function ari_reveal_all_buildings(fen) {
	for (const plname of fen.plorder) {
		let gbs = UI.players[plname].buildinglist;
		for (const gb of gbs) {
			gb.items.map(x => face_up(x));
		}
	}
}
function ari_select_next_player_according_to_stall_value() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	Z.stage = 5;
	let minval = 100000;
	let minplayer = null;
	for (const uname of fen.plorder) {
		if (fen.actionsCompleted.includes(uname)) continue;
		let stall = fen.players[uname].stall;
		if (isEmpty(stall)) { fen.actionsCompleted.push(uname); continue; }
		let val = fen.players[uname].stall_value = arrSum(stall.map(x => ari_get_card(x).val));
		if (val < minval) { minval = val; minplayer = uname; }
	}
	if (!minplayer) {
		return null;
	} else {
		Z.turn = fen.turn = [minplayer];
		fen.num_actions = fen.total_pl_actions = fen.players[minplayer].stall.length;
		fen.action_number = 1;
		return minplayer;
	}
}
function ari_start_action_stage() {
	let next = ari_select_next_player_according_to_stall_value();
	if (!next) { ari_next_phase(); }
	take_turn_fen();
}
function ari_start_church_stage() {
	let [fen] = [Z.fen];
	let order = fen.plorder = fen.church_order = determine_church_turn_order();
	[Z.turn, Z.stage] = [[order[0]], 17];
	ari_history_list([`inquisition starts!`], 'church');
	take_turn_fen();
}
function ari_state(dParent) {
	function get_phase_html() {
		if (isEmpty(Z.phase) || Z.phase == 'over') return null; //capitalize(Z.friendly);
		let rank = Z.phase[0].toUpperCase();
		let card = ari_get_card(rank + 'Hn', 40);
		let d = iDiv(card);
		mClassRemove(d.firstChild, 'card');
		return iDiv(card).outerHTML;
	}
	if (DA.TEST0 == true) {
		let html = `${Z.stage}`;
		if (isdef(Z.playerdata)) {
			let trigger = get_multi_trigger();
			if (trigger) html += ` trigger:${trigger}`;
			for (const data of Z.playerdata) {
				if (data.name == trigger) continue;
				let name = data.name;
				let state = data.state;
				let s_state = object2string(state);
				html += ` ${name}:'${s_state}'`; // (${typeof state})`;
			}
			dParent.innerHTML += ` ${Z.playerdata.map(x => x.name)}`;
		}
		dParent.innerHTML = html;
		return;
	}
	let user_html = get_user_pic_html(Z.uplayer, 30);
	let phase_html = get_phase_html();
	let html = '';
	if (phase_html) html += `${Z.phase}:&nbsp;${phase_html}`;
	if (Z.stage == 17) { html += `&nbsp;&nbsp;CHURCH EVENT!!!`; }
	else if (TESTING) { html += `&nbsp;&nbsp;&nbsp;stage: ${ARI.stage[Z.stage]}`; }
	else html += `&nbsp;player: ${user_html} `;
	dParent.innerHTML = html;
}
function ari_stats(dParent) {
	let player_stat_items = UI.player_stat_items = ui_player_info(dParent); //fen.plorder.map(x => fen.players[x]));
	let fen = Z.fen;
	let herald = fen.heraldorder[0];
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		let item = player_stat_items[plname];
		let d = iDiv(item); mCenterFlex(d); mLinebreak(d);
		if (plname == herald) {
			mSym('tied-scroll', d, { fg: 'gold', fz: 24, padding: 4 }, 'TR');
		}
		if (exp_church(Z.options)) {
			if (isdef(pl.tithes)) {
				player_stat_count('cross', pl.tithes.val, d);
			}
		}
		let dCoin = player_stat_count('coin', pl.coins, d);
		item.dCoin = dCoin.firstChild;
		item.dAmount = dCoin.children[1];
		let list = pl.hand.concat(pl.stall);
		let list_luxury = list.filter(x => x[2] == 'l');
		player_stat_count('pinching hand', list.length, d);
		let d1 = player_stat_count('hand-holding-usd', list_luxury.length, d);
		mStyle(d1.firstChild, { fg: 'gold', fz: 20 })
		if (!isEmpty(fen.players[plname].stall) && fen.stage >= 5 && fen.stage <= 6) {
			player_stat_count('shinto shrine', !fen.actionsCompleted.includes(plname) || fen.stage < 6 ? calc_stall_value(fen, plname) : '_', d);
		}
		player_stat_count('star', plname == U.name || isdef(fen.winners) ? ari_calc_real_vps(fen, plname) : ari_calc_fictive_vps(fen, plname), d);
		if (fen.turn.includes(plname)) {
			show_hourglass(plname, d, 30, { left: -3, top: 0 }); //'calc( 50% - 36px )' });
		}
	}
}
function ari_tax_phase_needed(fen) {
	let pl_tax = {};
	let need_tax_phase = false;
	for (const uplayer of fen.plorder) {
		let hsz = fen.players[uplayer].hand.length;
		let nchateaus = fen.players[uplayer].buildings.chateau.length;
		let allowed = ARI.sz_hand + nchateaus;
		let diff = hsz - allowed;
		if (diff > 0) need_tax_phase = true;
		pl_tax[uplayer] = diff;
	}
	if (need_tax_phase) {
		fen.turn = [ari_get_first_tax_payer(fen, pl_tax)];
		fen.pl_tax = pl_tax;
		fen.stage = 2;
		return true;
	} else {
		fen.stage = 3;
		return false;
	}
}
function aristo() {
	const rankstr = 'A23456789TJQK*';
	function setup(players, options) {
		let fen = { players: {}, plorder: jsCopy(players), history: [] };
		let n = players.length;
		let num_decks = fen.num_decks = 2 + (n >= 8 ? 2 : n >= 6 ? 1 : 0); // 2 + (n > 5 ? Math.ceil((n - 5) / 2) : 0); //<=5?2:Math.max(2,Math.ceil(players.length/3));
		let deck = fen.deck = create_fen_deck('n', num_decks);
		shuffle(deck);
		let deck_commission = fen.deck_commission = create_fen_deck('c'); shuffle(deck_commission);
		let deck_luxury = fen.deck_luxury = create_fen_deck('l'); shuffle(deck_luxury);
		let deck_rumors = fen.deck_rumors = exp_rumors(options) ? create_fen_deck('r') : []; shuffle(deck_rumors);
		shuffle(fen.plorder);
		fen.market = [];
		fen.deck_discard = [];
		fen.open_discard = [];
		fen.commissioned = []; //eg., [Q,A,5,...]
		fen.open_commissions = exp_commissions(options) ? deck_deal(deck_commission, 3) : [];
		fen.church = exp_church(options) ? deck_deal(deck, players.length) : [];
		for (const plname of players) {
			let pl = fen.players[plname] = {
				hand: deck_deal(deck, 7),
				commissions: exp_commissions(options) ? deck_deal(deck_commission, 4) : [],
				rumors: exp_rumors(options) ? deck_deal(deck_rumors, players.length - 1) : [],
				journeys: [], //options.journey == 'no' ? [] : coin() ? [['QSr', 'KSr']] : [['3Cr', '4Cr']],
				buildings: { farm: [], estate: [], chateau: [] },
				stall: [],
				stall_value: 0,
				coins: 3,
				vps: 0,
				score: 0,
				name: plname,
				color: get_user_color(plname),
			};
		}
		fen.phase = 'king'; //TODO: king !!!!!!!
		fen.num_actions = 0;
		fen.herald = fen.plorder[0];
		fen.heraldorder = jsCopy(fen.plorder);
		if (exp_commissions(options)) {
			ari_history_list([`commission trading starts`], 'commissions', fen);
			[fen.stage, fen.turn] = [23, options.mode == 'hotseat' ? [fen.plorder[0]] : fen.plorder]; fen.comm_setup_num = 3; fen.keeppolling = true;
		} else if (exp_rumors(options) && fen.plorder.length > 2) {
			ari_history_list([`gossiping starts`], 'rumors', fen);
			[fen.stage, fen.turn] = [24, options.mode == 'hotseat' ? [fen.plorder[0]] : fen.plorder]; 
		} else[fen.stage, fen.turn] = set_journey_or_stall_stage(fen, options, fen.phase);
		return fen;
	}
	function activate_ui() { ari_activate_ui(); }
	function check_gameover(z) { return isdef(z.fen.winners) ? z.fen.winners : false; }
	function present(dParent) { ari_present(dParent); }
	function stats(dParent) { ari_stats(dParent); }
	function state_info(dParent) { ari_state(dParent); }
	function get_selection_color(item) {
		if (Z.stage == 41 && Z.A.selected.length == 1) return 'blue'; return 'red';
	}
	return { get_selection_color, rankstr, setup, activate_ui, check_gameover, present, state_info, stats };
}
function being_blackmailed() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	let cmd = item.key;
	console.log('selected reaction to blackmail:', item.key);
	if (cmd == 'accept') { Z.stage = 34; ari_pre_action(); }
	else if (cmd == 'reject') { post_reject_blackmail(); }
	else { post_defend_blackmail(); }
}
function building_is_correct(b) {
	let key = b.keycard.key;
	let list = b.list;
	for (let i = 0; i < list.length; i++) { if (list[i][0] != key[0]) return false; }
	return true;
}
function calc_building_vps(bs) {
	let res = 0;
	res += bs.farm.length;
	res += bs.estate.length * 2;
	res += bs.chateau.length * 3;
	return res;
}
function calc_stall_value(fen, plname) { let st = fen.players[plname].stall; if (isEmpty(st)) return 0; else return arrSum(st.map(x => ari_get_card(x).val)); }
function check_correct_journey(A, fen, uplayer) {
	let items = A.selected.map(x => A.items[x]);
	if (items.length < 2) {
		select_error('please select at least 2 items!'); return [null, null, null];//a total of at least 2 items must be selected
	}
	let carditems = items.filter(x => is_card(x));
	if (isEmpty(carditems)) {
		select_error('please select at least 1 card!'); return [null, null, null];//at least one hand card must be selected
	} else if (items.length - carditems.length > 1) {
		select_error('please select no more than 1 journey!'); return [null, null, null];//at most one journey must be selected
	}
	let journeyitem = firstCond(items, x => !is_card(x));
	let cards = journeyitem ? jsCopy(journeyitem.o.list) : [];
	cards = cards.concat(carditems.map(x => x.o.key));
	let jlegal = is_journey(cards);
	if (!jlegal || jlegal.length != cards.length) {
		select_error('this is not a legal journey!!'); return [null, null, null];//is this a legal journey?
	}
	return [carditems, journeyitem, jlegal];
}
function check_if_church() {
	let [fen, A, uplayer, plorder] = [Z.fen, Z.A, Z.uplayer, Z.plorder];
	let jacks = fen.market.filter(x => x[0] == 'J');
	let queens = fen.market.filter(x => x[0] == 'Q');
	for (const plname of plorder) {
		let pl = fen.players[plname];
		let pl_jacks = pl.stall.filter(x => x[0] == 'J');
		let pl_queens = pl.stall.filter(x => x[0] == 'Q');
		jacks = jacks.concat(pl_jacks);
		queens = queens.concat(pl_queens);
	}
	let ischurch = false;
	for (const j of jacks) {
		if (firstCond(queens, x => x[1] != j[1])) ischurch = true;
	}
	return ischurch;
}
function check_resolve(){
	let can_resolve = true;
	for (const plname of Z.plorder) {
		let data1 = firstCond(Z.playerdata, x => x.name == plname && !isEmpty(x.state));
		if (nundef(data1)) { can_resolve = false; break; }
	}
	return can_resolve;
}
function determine_church_turn_order() {
	let [fen, A, uplayer, plorder] = [Z.fen, Z.A, Z.uplayer, Z.plorder];
	let initial = [];
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		pl.vps = ari_calc_fictive_vps(fen, plname);
		pl.max_journey_length = ari_get_max_journey_length(fen, plname);
		pl.score = pl.vps * 10000 + pl.max_journey_length * 100 + pl.coins;
		initial.push(pl);
	}
	let sorted = sortByDescending(initial, 'score');
	return sorted.map(x => x.name);
}
function exchange_items_in_fen(fen, o0, o1) {
	let p0 = o0.path.split('.'); if (isdef(fen.players[p0[0]])) p0.unshift('players');
	let p1 = o1.path.split('.'); if (isdef(fen.players[p1[0]])) p1.unshift('players');
	let list0 = lookup(fen, p0);
	let list1 = lookup(fen, p1); //['players'].concat(o1.path.split('.')));
	if (isDict(list0) && isdef(list0.list)) list0 = list0.list;
	if (isDict(list1) && isdef(list1.list)) list1 = list1.list;
	elem_from_to(o0.key, list0, list1);
	elem_from_to(o1.key, list1, list0);
}
function exp_church(options) { return options.church == 'yes'; }
function exp_commissions(options) { return options.commission == 'yes'; }
function exp_journeys(options) { return options.journey == 'yes'; }
function exp_rumors(options) { return options.rumors == 'yes'; }
function find_common_ancestor(d1, d2) { return dTable; }
function find_journeys(fen, uplayer) {
	let h = fen.players[uplayer].hand;
	let seqs = find_sequences(h, 2, 'A23456789TJQK');
	if (!isEmpty(seqs)) return seqs;
	let existing_journeys = aggregate_player(fen, 'journeys');
	for (const j of existing_journeys) {
		let h1 = j.concat(h);
		let seqs1 = find_sequences(h1, j.length + 1, 'A23456789TJQK');
		if (!isEmpty(seqs1)) return seqs1;
	}
	return seqs;
}
function find_players_with_potential_journey(fen) {
	let res = [];
	for (const uplayer of fen.plorder) {
		if (isdef(fen.passed) && fen.passed.includes(uplayer)) continue;
		let j = find_journeys(fen, uplayer);
		if (!isEmpty(j)) res.push(uplayer);
	}
	return res;
}
function find_sequences(blatt, n = 2, rankstr = '23456789TJQKA', allow_cycle = false) {
	let suitlists = get_suitlists_sorted_by_rank(blatt, rankstr, true); //true...remove_duplicates
	let seqs = [];
	for (const lst of get_values(suitlists)) {
		let len = lst.length;
		if (len < n) continue;
		let l = allow_cycle ? lst.concat(lst) : lst;
		for (let istart = 0; istart < len; istart++) {
			let seq = [l[istart]];
			let i = istart;
			while (i + 1 < l.length && follows_in_rank(l[i], l[i + 1], rankstr)) {
				seq.push(l[i + 1]);
				i++;
			}
			if (seq.length >= n) seqs.push(seq);
		}
	}
	return seqs;
}
function follows_in_rank(c1, c2, rankstr) {
	return get_rank_index(c2, rankstr) - get_rank_index(c1, rankstr) == 1;
	let i1 = rankstr.indexOf(c1[0]);
	let i2 = rankstr.indexOf(c2[0]);
	console.log('follows?', c1, i1, c2, i2, i2 - i1)
	return rankstr.indexOf(c2[0]) - rankstr.indexOf(c1[0]) == 1;
}
function get_auction_history(fen) {
	let lines = [];
	let revorder = jsCopy(fen.plorder).reverse();
	for (const uplayer of revorder) {
		if (nundef(fen.buy[uplayer])) continue;
		lines.push(`${uplayer} buys ${fen.buy[uplayer].a} for ${fen.second_most}`);
	}
	lines.push(`auction winner(s)${fen.maxplayers.length > 1 ? 's' : ''}: ${fen.maxplayers.join(', ')}`);
	for (const uplayer of revorder) {
		lines.push(`${uplayer} bids ${fen.auction[uplayer]}`);
	}
	return lines;
}
function get_pay_history(payment, uplayer) { return [`${uplayer} pays with ${payment}`]; }
function get_rank_index(ckey, rankstr = '23456789TJQKA') { return rankstr.indexOf(ckey[0]); }
function get_schweine(fenbuilding) { return fenbuilding.schweine; }
function get_schweine_ui(uibuilding) { return uibuilding.schweine; }
function get_suitlists_sorted_by_rank(blatt, rankstr = '23456789TJQKA', remove_duplicates = false) {
	let di = {};
	for (const k of blatt) {
		let suit = k[1];
		if (nundef(di[suit])) di[suit] = [];
		if (remove_duplicates) addIf(di[suit], k); else di[suit].push(k);
	}
	for (const s in di) {
		sortByRank(di[s], rankstr);
	}
	return di;
}
function get_tax_history(tax) {
	let hlines = [];
	console.log('tax', tax);
	for (const uplayer in tax) {
		hlines.push(`player ${uplayer} paid ${tax[uplayer]} in tax`);
	}
	return hlines;
}
function get_trade_history(uplayer, i0, i1) {
	if (i1.path.includes(uplayer)) { let h = i0; i0 = i1; i1 = h; }
	return [`${uplayer} trades ${i0.key} (from own stall) for ${i1.key} (from ${i1.path == 'market' ? 'market' : stringBetween(i1.path, '.', '.')})`];
}
function has_schweine(fenbuilding) { return !isEmpty(fenbuilding.schweine); }
function is_in_middle_of_church() {
	let [fen, A, uplayer, plorder] = [Z.fen, Z.A, Z.uplayer, Z.plorder];
	return isdef(fen.players[uplayer].tithes);
}
function is_journey(cards) {
	let jlist = find_sequences(cards, cards.length, 'A23456789TJQK');
	let j = firstCond(jlist, x => x.length == cards.length);
	return j;
}
function is_stall_selection_complete() { return Z.fen.stallSelected.length == Z.fen.plorder.length; }
function matches_on_either_end(card, j) {
	let key = card.key;
	let jfirst = arrFirst(j.o.list);
	let jlast = arrLast(j.o.list);
	rankstr = 'A23456789TJQK';
	let [s, s1, s2] = [key[1], jfirst[1], jlast[1]];
	let anfang = s == s1 && follows_in_rank(key, jfirst, rankstr);
	let ende = s == s2 && follows_in_rank(jlast, key, rankstr);
	return anfang || ende; // follows_in_rank(rcard,rjfirst,rankstr) || follows_in_rank(rjlast, rcard, rankstr);
}
function output_arr_short(arr) {
	console.log('output_arr_short', getFunctionsNameThatCalledThisFunction());
	console.log('deck top 3', jsCopy(arrTake(arr, 3))); console.log('deck bottom 3', jsCopy(arrTakeLast(arr, 3)));
}
function payment_complete() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	A.payment = A.items[A.selected[0]];
	let nextstage = Z.stage = ARI.stage[A.command];
	ari_pre_action();
}
function post_accept_blackmail() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	let blackmailer = fen.blackmail.blackmailer;
	let blackmailed = fen.blackmail.blackmailed;
	let building_path = fen.blackmail.building_path;
	let fenbuilding = path2fen(fen, building_path);
	let building_owner = stringAfter(building_path, '.'); building_owner = stringBefore(building_owner, '.');
	assertion(building_owner == blackmailed && blackmailed == uplayer, 'blackmailed and uplayer and building owner must be same');
	elem_from_to(item.key, fen.players[blackmailed].stall, fen.players[blackmailer].hand);
	ari_history_list([`${blackmailed} accepts: gives ${item.key} to ${blackmailer}`], 'blackmail');
	delete fenbuilding.isblackmailed;
	[Z.stage, Z.turn] = [35, [blackmailer]];
	take_turn_fen();
}
function post_auction() {
	console.assert(Z.stage == 13, 'WRONG STAGE IN POST AUCTION ' + Z.stage);
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let item = A.selected.map(x => A.items[x])[0]; // A.items.filter(x => A.selected.includes(x.index)).map(x => x.key);
	lookupSet(fen, ['buy', uplayer], { key: item.key, index: A.selected[0] });
	ari_history_list([`${uplayer} selects ${item.key}`], 'auction');
	for (const plname of fen.maxplayers) {
		if (!lookup(fen, ['buy', plname])) {
			Z.turn = [plname]; //fen.plorder[iturn];
			take_turn_fen(); //wenn send mache muss ich die ui nicht korrigieren!
			return;
		}
	}
	let buylist = dict2list(fen.buy, 'playername');
	let discardlist = [];
	for (const plname of fen.maxplayers) {
		let choice = fen.buy[plname]; //{key:item.key,index:A.selected[0]}
		let n = arrCount(buylist, x => x.index == choice.index);
		let is_unique = n == 1; //!firstCond(buylist, x => x.id != plname && x.key == choice);
		if (is_unique) {
			fen.players[plname].coins -= fen.second_most;
			let x = UI.player_stat_items[plname].dCoin; mPulse1(x); //console.log('dCoin: ', x); 
			elem_from_to(choice.key, fen.market, fen.players[plname].hand);
			ari_history_list([`${plname} buys ${choice.key} for ${fen.second_most}`], 'auction');
			let card = find_card(choice.index, UI.market);
			animate_card_transfer(card, arrLast(UI.players[plname].hand.items)); //UI.player_stat_items[plname]);
		} else {
			addIf(discardlist, choice.key);
			delete fen.buy[plname];
		}
	}
	for (const key of discardlist) {
		elem_from_to(key, fen.market, fen.deck_discard);
		ari_reorg_discard(fen);
		ari_history_list([`${key} is discarded`], 'auction');
	}
	delete fen.second_most;
	delete fen.maxplayers;
	delete fen.buy;
	delete fen.auction;
	Z.stage = 4;
	Z.turn = [fen.plorder[0]];
	setTimeout(take_turn_fen, 1000); //take_turn_fen(); 
}
function post_ball() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let keys = A.selected.map(x => A.items[x]).map(x => x.key);
	keys.map(x => lookupAddIfToList(fen, ['ball', uplayer], x));
	keys.map(x => removeInPlace(fen.players[uplayer].hand, x));
	let iturn = fen.plorder.indexOf(uplayer) + 1;
	if (iturn >= fen.plorder.length) { //alle sind durch ball selection
		if (isdef(fen.ball)) {
			let all = [];
			for (const c of fen.market) all.push(c);
			for (const uplayer in fen.ball) for (const c of fen.ball[uplayer]) all.push(c);
			shuffle(all);
			fen.market = [];
			for (let i = 0; i < 2; i++) top_elem_from_to(all, fen.market);
			for (const uplayer in fen.ball) for (let i = 0; i < fen.ball[uplayer].length; i++) top_elem_from_to(all, fen.players[uplayer].hand);
			delete fen.ball;
		} //else { console.log('empty ball!!!'); }
		iturn = 0;
		Z.stage = 4;
		console.assert(fen.phase == 'queen', 'wie bitte noch nicht in queen phase?!!!!!!!!!!!');
	}
	Z.turn = [fen.plorder[iturn]];
	ari_history_list([`${uplayer} added ${keys.length} card${plural(keys.length)} to ball!`], 'ball');
	take_turn_fen(); //wenn send mache muss ich die ui nicht korrigieren!
}
function post_blackmail() {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	ari_history_list([`blackmail complete!`], 'blackmail');
	delete fen.blackmail;
	ari_next_action();
}
function post_build() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	if (A.selected.length < 4 || A.selected.length > 6) {
		select_error('select 4, 5, or 6 cards to build!');
		return;
	}
	let building_items = A.selected.map(x => A.items[x]);
	let building_type = building_items.length == 4 ? 'farm' : building_items.length == '5' ? 'estate' : 'chateau';
	fen.players[uplayer].buildings[building_type].push({ list: building_items.map(x => x.key), h: null, schweine: [], lead: building_items[0].key });
	for (const item of building_items) {
		let source = lookup(fen, item.path.split('.'));
		removeInPlace(source, item.key);
	}
	ari_history_list([`${uplayer} builds a ${building_type}`], 'build');
	let is_coin_pay = process_payment();
	let ms = 1800;
	if (is_coin_pay) animcoin(Z.uplayer, 1000);
	remove_ui_items(building_items);
	let pl = fen.players[uplayer];
	let nfarms = pl.buildings.farm.length;
	let nestates = pl.buildings.estate.length;
	let nchateaus = pl.buildings.chateau.length;
	let index = building_type == 'farm' ? nfarms - 1 : building_type == 'estate' ? nfarms + nestates - 1 : nfarms + nestates + nchateaus - 1;
	console.log('index of new building is', index);
	let ifinal = UI.players[uplayer].indexOfFirstBuilding + index;
	console.log('ifinal', ifinal);
	let dpl = iDiv(UI.players[uplayer]);
	let akku = [];
	while (dpl.children.length > ifinal) { akku.push(dpl.lastChild); dpl.removeChild(dpl.lastChild); }
	let fenbuilding = arrLast(fen.players[uplayer].buildings[building_type]);
	let newbuilding = ui_type_building(fenbuilding, dpl, { maleft: 8 }, `players.${uplayer}.buildings.${building_type}.${index}`, building_type, ari_get_card, true, false);
	animbuilding(newbuilding, ms, ari_next_action);
	akku.map(x => mAppend(dpl, x));
}
function post_buy() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let item = A.items[A.selected[0]];
	elem_from_to(item.key, fen.open_discard, fen.players[uplayer].hand);
	ari_history_list([`${uplayer} buys ${item.key}`], 'buy')
	ari_reorg_discard();
	console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
	process_payment();
	setTimeout(ari_next_action, 1000); //ari_next_action();
}
function post_buy_rumor() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	let non_selected = A.items.filter(x => x.index != A.selected[0]);
	let rumor = item.key;
	for (const item of non_selected) { fen.deck_rumors.push(item.key); }
	fen.players[uplayer].rumors.push(rumor);
	fen.players[uplayer].coins -= 1;
	ari_history_list([`${uplayer} bought a rumor`], 'rumor');
	ari_next_action();
}
function post_church() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let pl = fen.players[uplayer];
	let items = A.selected.map(x => A.items[x]);
	let card = items.find(x => x.path && x.path.includes('church')); if (isdef(card)) card = card.key;
	let cand = items.length > 1 ? items.find(x => !x.path) : fen.candidates[0];
	if (isdef(cand) && isDict(cand)) cand = cand.key;
	if (nundef(card) || nundef(cand)) {
		select_error(`You must select a card ${items.length > 1 ? 'and a candidate' : ''}!`);
		return;
	}
	elem_from_to(card, fen.church, fen.players[cand].hand);
	ari_history_list([`${uplayer} gives ${cand} card ${card}`], 'new cards');
	removeInPlace(fen.toBeSelected, cand);
	if (fen.church.length == 1) {
		let cand = fen.toBeSelected[0];
		let card = fen.church[0];
		elem_from_to(card, fen.church, fen.players[cand].hand);
		ari_history_list([`${cand} receives last card: ${card}`], 'new cards');
		Z.stage = 14;
		let plorder = fen.plorder = jsCopy(fen.heraldorder);
		Z.turn = [plorder[0]];
		take_turn_fen();
	} else {
		Z.turn = [get_next_in_list(uplayer, fen.selorder)];
		take_turn_fen();
	}
}
function post_comm_setup_stage() {
	let [fen, A, uplayer, plorder, pl] = [Z.fen, Z.A, Z.uplayer, Z.plorder, Z.pl];
	let achtungHack=false;
	let new_playerdata=[];
	for (const data of Z.playerdata) {
		let o=data;
		if (is_stringified(data)){
			console.log('achtungHack: data is stringified');
			o=JSON.parse(data);
			achtungHack=true;
		}else if (is_stringified(data.state)){
			console.log('achtungHack: data.state is stringified');
			o.state = JSON.parse(data.state);
			achtungHack = true;
		}
		new_playerdata.push(o);
		let state = o.state;
		let giver = state.giver;
		let receiver = state.receiver;
		let keys = state.keys;
		keys.map(x => elem_from_to(x, fen.players[giver].commissions, fen.players[receiver].commissions));
	}
	if (achtungHack) {Z.playerdata = new_playerdata;}
	fen.comm_setup_num -= 1;
	if (fen.comm_setup_num <= 0) {
		delete fen.comm_setup_di;
		delete fen.comm_setup_num;
		delete fen.keeppolling;
		ari_history_list([`commission trading ends`], 'commissions');
		if (exp_rumors && plorder.length > 2) {
			[Z.stage, Z.turn] = [24, Z.options.mode == 'hotseat' ? [fen.plorder[0]] : fen.plorder]; 
			ari_history_list([`gossiping starts`], 'rumors');
		} else { [Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, fen.phase); }
	} else {
		[Z.stage, Z.turn] = [23, Z.options.mode == 'hotseat' ? [fen.plorder[0]] : fen.plorder];
	}
	take_turn_fen_clear();
}
function post_commission() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let comm_selected = A.items[A.selected[0]];
	let stall_item = A.commission_stall_item;
	console.log('stall_item:', stall_item);
	let rank = A.commission.key[0];
	if (nundef(fen.commissioned)) fen.commissioned = [];
	let x = firstCond(fen.commissioned, x => x.rank == rank);
	if (x) { removeInPlace(fen.commissioned, x); }
	else { x = { key: A.commission.key, rank: rank, count: 0 }; }
	x.count += 1;
	let pl = fen.players[uplayer];
	let top = isEmpty(fen.commissioned) ? null : arrLast(fen.commissioned);
	let rankstr = 'A23456789TJQK';
	let points = !top || get_rank_index(rank, rankstr) >= get_rank_index(top.rank, rankstr) ? 1 : 0;
	points += Number(x.count);
	pl.coins += points;
	fen.commissioned.push(x);
	let key = stall_item.key;
	removeInPlace(pl.stall, key); // das muss aendern!!!!!!!!!!!!!
	if (comm_selected.path == 'open_commissions') {
		removeInPlace(fen.open_commissions, comm_selected.key);
		top_elem_from_to(fen.deck_commission, fen.open_commissions);
	} else {
		removeInPlace(fen.deck_commission, comm_selected.key);
	}
	arrReplace(pl.commissions, [A.commission.key], [comm_selected.key]);
	ari_history_list([`${uplayer} commissions card ${A.commission.key}`, `${uplayer} gets ${points} coin${if_plural(points)} for commissioning ${A.commission.key}`], 'commission');
	ari_next_action();
}
function post_complementing_market_after_church() {
	let [fen, A, uplayer, plorder] = [Z.fen, Z.A, Z.uplayer, Z.plorder];
	let pl = fen.players[uplayer];
	let selectedKeys = A.selected.map(i => A.items[i].key);
	for (const ckey of selectedKeys) {
		elem_from_to(ckey, fen.players[uplayer].hand, fen.players[uplayer].stall);
	}
	if (selectedKeys.length > 0) ari_history_list([`${uplayer} complements stall`], 'complement stall');
	let next = get_next_player(Z, uplayer);
	if (next == plorder[0]) {
		ari_clear_church();
		ari_start_action_stage();
	} else {
		Z.turn = [next];
		take_turn_fen();
	}
}
function post_defend_blackmail() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let blackmailer = fen.blackmail.blackmailer;
	let blackmailed = fen.blackmail.blackmailed;
	let building_path = fen.blackmail.building_path;
	let fenbuilding = path2fen(fen, building_path);
	let building_owner = stringAfter(building_path, '.'); building_owner = stringBefore(building_owner, '.');
	assertion(building_owner == blackmailed && blackmailed == uplayer, 'blackmailed and uplayer and building owner must be same');
	let rumors = fen.players[building_owner].rumors;
	let lead = fenbuilding.lead;
	let brumors = fenbuilding.rumors;
	let match = firstCond(rumors, x => x[0] == lead[0]);
	removeInPlace(rumors, match);
	brumors.pop();
	ari_history_list([`${blackmailed} defends: pays matching rumor to deflect blackmail, 1 rumor is removed from building`], 'blackmail');
	delete fenbuilding.isblackmailed;
	[Z.stage, Z.turn] = [35, [blackmailer]];
	take_turn_fen();
}
function post_downgrade() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let pl = fen.players[uplayer];
	A.downgrade_cards = A.selected.map(x => A.items[x]); //
	let obuilding = lookup(fen, A.building.path.split('.'));
	let n = obuilding.list.length;
	let nremove = A.downgrade_cards.length;
	let nfinal = n - nremove;
	let type = A.building.o.type;
	let list = pl.buildings[type];
	removeInPlace(list, obuilding);
	let cards = A.downgrade_cards.map(x => x.key);
	if (nfinal < 4) {
		pl.hand = pl.hand.concat(obuilding.list);
	} else if (nfinal == 4) {
		pl.buildings.farm.push(obuilding);
		pl.hand = pl.hand.concat(cards);
	} else if (nfinal == 5) {
		pl.buildings.estate.push(obuilding);
		pl.hand = pl.hand.concat(cards);
	} else if (nfinal == 6) {
		pl.buildings.chateau.push(obuilding);
		pl.hand = pl.hand.concat(cards);
	}
	A.downgrade_cards.map(x => removeInPlace(obuilding.list, x.key));
	if (isdef(pl.tithes)) {
		for (const c of cards) removeInPlace(pl.hand, c);
	}
	ari_history_list([`${uplayer} downgrades to ${ari_get_building_type(obuilding)}`], 'downgrade');
	if (isdef(pl.tithes)) { proceed_to_newcards_selection(); } else ari_next_action(fen, uplayer);
}
function post_endgame() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	if (A.selected[0] == 0) {
		console.log('GAMEOVER!!!!!!!!!!!!!!!!!!!');
		for (const plname of fen.plorder) {
			let pl = fen.players[plname];
			pl.vps = ari_calc_real_vps(fen, plname);
			pl.max_journey_length = ari_get_max_journey_length(fen, plname);
			pl.score = pl.vps * 10000 + pl.max_journey_length * 100 + pl.coins;
			console.log('score', plname, pl.score);
		}
		let playerlist = dict2list(fen.players, 'name');
		let sorted = sortByDescending(playerlist, 'score');
		console.log('scores', sorted.map(x => `${x.name}:${x.score}`));
		let max_score = sorted[0].score;
		let all_winners = sorted.filter(x => x.score == max_score);
		fen.winners = all_winners.map(x => x.name);
		console.log('winners:', fen.winners)
		take_turn_fen();
	} else {
		let iturn = fen.pl_gameover.indexOf(uplayer) + 1;
		if (iturn >= fen.pl_gameover.length) { //niemand wollte beenden: move to queen phase!
			delete fen.pl_gameover;
			Z.turn = [fen.plorder[0]];
			Z.phase = 'queen';
			[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, Z.phase);
			take_turn_fen();
		} else {
			Z.turn = [fen.pl_gameover[iturn]];
			take_turn_fen();
		}
	}
}
function post_exchange() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	if (A.selected.length != 2) {
		select_error('please, select exactly 2 cards!');
		return;
	}
	let i0 = A.items[A.selected[0]];
	let i1 = A.items[A.selected[1]];
	let [p0, p1] = [i0.path, i1.path];
	if (p0.includes('build') == p1.includes('build')) {
		select_error('select exactly one building card and one of your hand or stall cards!');
		return;
	}
	let ibuilding = p0.includes('build') ? i0 : i1;
	let ihandstall = ibuilding == i0 ? i1 : i0;
	let fenbuilding = lookup(fen, ibuilding.path.split('.')); //stringBeforeLast(ibuilding.path, '.').split('.'));
	let ib_index = ibuilding.o.index; //index of the building card within building!
	if (fenbuilding.schweine.includes(ib_index)) {
		fenbuilding.schweine.splice(fenbuilding.schweine.indexOf(ib_index), 1);
	}
	let pl = fen.players[uplayer];
	let list2 = ihandstall.path.includes('hand') ? pl.hand : pl.stall;
	let i2 = list2.indexOf(ihandstall.o.key)
	exchange_by_index(fenbuilding.list, ib_index, list2, i2);
	ari_history_list([`${uplayer} exchanges card in ${ari_get_building_type(fenbuilding)}`], 'exchange');
	animate_card_exchange(ibuilding, ihandstall, ari_next_action);
}
function post_harvest() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	let obuilding = lookup(fen, item.path.split('.'));
	fen.players[uplayer].hand.push(obuilding.h);
	obuilding.h = null;
	ari_history_list([`${uplayer} harvests`], 'harvest');
	ari_next_action();
}
function post_inspect() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let schwein = A.items[A.selected[0]].o;
	turn_new_schwein_up(schwein, A.fenbuilding, A.uibuilding);
}
function post_luxury_or_journey_cards() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	let luxury_selected = A.selected[0] == 0;
	console.log('carditems', A.carditems);
	let n = A.carditems.length;
	if (luxury_selected) {
		let cardstoreplace = A.carditems.map(x => x.key); //add n luxury cards to player hand
		arrReplace(fen.players[uplayer].hand, cardstoreplace, deck_deal(fen.deck_luxury, n));
	} else {
		let len = A.jlegal.length;
		let handcards = firstCond(A.carditems, x => A.jlegal[0] == x.key) ? arrFromIndex(A.jlegal, len - n) : A.jlegal.slice(0, n);
		console.log('handcards', handcards);
		arrExtend(fen.players[uplayer].hand, handcards);
		A.jlegal = arrMinus(A.jlegal, handcards);
		let cardstoremove = A.carditems.map(x => x.key);
		arrRemove(fen.players[uplayer].hand, cardstoremove);
	}
	let path = A.journeyitem.path;
	let parts = path.split('.');
	let owner = parts[1];
	console.log('path', path, 'parts', parts, 'owner', owner)
	fen.players[owner].journeys.splice(Number(parts[3]), 1, A.jlegal);
	[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, Z.phase); //set_nextplayer_after_journey();
	ari_history_list([`${uplayer} added to existing journey and takes ${luxury_selected ? 'luxury cards' : 'journey cards'}`], 'journey');
	take_turn_fen();
}
function post_new_journey() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	fen.players[uplayer].journeys.push(A.jlegal);
	arrReplace(fen.players[uplayer].hand, A.jlegal, deck_deal(fen.deck_luxury, A.jlegal.length));
	ari_history_list([`${uplayer} added journey`], 'journey');
	[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, Z.phase);
	take_turn_fen();
}
function post_pass() {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	let n = fen.total_pl_actions - fen.num_actions;
	ari_history_list([`${uplayer} passes after ${n} action${plural(n)}`], 'pass');
	fen.num_actions = 0;
	ari_next_action();
}
function post_pickup() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	elem_from_to(item.key, fen.players[uplayer].stall, fen.players[uplayer].hand);
	ari_history_list([`${uplayer} picks up ${item.key}`], 'pickup');
	ari_next_action();
}
function post_reject_blackmail() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	let blackmailer = fen.blackmail.blackmailer;
	let blackmailed = fen.blackmail.blackmailed;
	let building_path = fen.blackmail.building_path;
	let fenbuilding = path2fen(fen, building_path);
	let building_owner = stringAfter(building_path, '.'); building_owner = stringBefore(building_owner, '.');
	assertion(building_owner == blackmailed && blackmailed == uplayer, 'blackmailed and uplayer and building owner must be same');
	ari_history_list([`${blackmailed} rejects!`], 'blackmail');
	let rumors = fenbuilding.rumors;
	let has_lead_rumor = firstCond(rumors, x => x[0] == fenbuilding.lead[0]);
	if (has_lead_rumor) {
		let stall = fen.players[blackmailed].stall;
		fen.players[blackmailer].hand = fen.players[blackmailer].hand.concat(stall);
		fen.players[blackmailed].stall = [];
		ari_history_list([`RUMOR CORRECT!!! ${blackmailed} looses entire stall to ${blackmailer}`], 'blackmail');
	} else {
		ari_history_list([`${blackmailed} was lucky!!! rumors incorrect`], 'blackmail');
	}
	delete fenbuilding.rumors;
	delete fenbuilding.isblackmailed;
	[Z.stage, Z.turn] = [35, [blackmailer]];
	take_turn_fen();
}
function post_rumor_both() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	let non_selected = A.items.filter(x => x.index != A.selected[0])[0];
	let rumor = item.key;
	let rumor_other = non_selected.key;
	fen.players[uplayer].rumors.push(rumor);
	fen.players[A.owner].rumors.push(rumor_other);
	ari_history_list([`${uplayer} got a rumor, ${A.owner} got one too`], 'rumor');
	ari_next_action();
}
function post_rumor_setup() {
	let [fen, A, uplayer, plorder] = [Z.fen, Z.A, Z.uplayer, Z.plorder];
	for (const plname of plorder) { fen.players[plname].rumors = []; }
	for (const plname of plorder) {
		let data = firstCond(Z.playerdata, x => x.name == plname);
		let di = data.state.di;
		for (const k in di) {
			arrPlus(fen.players[k].rumors, di[k]);
		}
	}
	ari_history_list([`gossiping ends`], 'rumors');
	[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, fen.phase);
	take_turn_fen_clear();
}
function post_sell() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	if (A.selected.length != 2) {
		select_error('select exactly 2 cards to sell!');
		return;
	}
	for (const i of A.selected) {
		let c = A.items[i].key;
		elem_from_to(c, fen.players[uplayer].stall, fen.deck_discard);
	}
	ari_reorg_discard();
	fen.players[uplayer].coins += 1;
	let [i1, i2] = A.selected.map(x => A.items[x].key)
	ari_history_list([`${uplayer} sells ${i1} and ${i2}`], 'sell');
	ari_next_action(fen, uplayer);
}
function post_stall_selected() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let selectedKeys = A.selected.map(i => A.items[i].key);
	for (const ckey of selectedKeys) {
		elem_from_to(ckey, fen.players[uplayer].hand, fen.players[uplayer].stall);
	}
	ensure_stallSelected(fen);
	fen.stallSelected.push(uplayer);
	ari_history_list([`${uplayer} puts up a stall for ${selectedKeys.length} action${plural(selectedKeys.length)}`], 'market');
	if (is_stall_selection_complete()) {
		delete fen.stallSelected;
		fen.actionsCompleted = [];
		if (check_if_church()) ari_start_church_stage(); else ari_start_action_stage();
	} else {
		Z.turn = [get_next_player(Z, uplayer)];
		take_turn_fen();
	}
}
function post_tax() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let items = A.selected.map(x => A.items[x]);
	let n = fen.pl_tax[uplayer];
	if (items.length != n) {
		select_error(`please select exactly ${n} cards`);
		return;
	}
	for (const item of items) {
		elem_from_to_top(item.key, fen.players[uplayer].hand, fen.deck_discard);
	}
	ari_reorg_discard();
	ari_history_list([`${uplayer} pays tax: ${fen.pl_tax[uplayer]}`], 'tax');
	fen.pl_tax[uplayer] = 0;
	let iturn = fen.plorder.indexOf(uplayer);
	let plnext = ari_get_tax_payer(fen, fen.pl_tax, iturn + 1);
	if (plnext == null) {
		[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, 'king');
		delete fen.pl_tax;
	} else {
		Z.turn = [plnext];
	}
	take_turn_fen(fen, uplayer);
}
function post_tithe() {
	let [fen, A, uplayer, plorder] = [Z.fen, Z.A, Z.uplayer, Z.plorder];
	let items = A.selected.map(x => A.items[x]);
	if (items.length == 0) { select_error('No cards selected!'); return; }
	let st = items.map(x => ({ key: x.key, path: x.path }));
	let val = arrSum(st.map(x => ari_get_card(x.key).val));
	lookupSet(fen, ['players', uplayer, 'tithes'], { keys: st, val: val });
	remove_tithes_from_play(fen, uplayer);
	let pldone = plorder.filter(x => isdef(fen.players[x].tithes));
	let minplayers = arrMin(pldone, x => fen.players[x].tithes.val);
	let minplayer = isList(minplayers) ? minplayers[0] : minplayers;
	let minval = fen.tithemin = fen.players[minplayer].tithes.val;
	let next = get_next_in_list(uplayer, fen.church_order);
	if (next == fen.church_order[0]) {
		assertion(sameList(pldone, plorder), 'NOT all players have tithes!!!!!!!', pldone);
		if (minplayers.length > 1) { proceed_to_newcards_selection(); return; }
		else {
			pldone = pldone.filter(x => x != minplayer);
			let sorted = sortBy(pldone, x => fen.players[x].tithes.val);
			let second_min = sorted[0];
			fen.tithe_minimum = fen.players[second_min].tithes.val - minval;
			let pl = fen.players[minplayer];
			let hst = pl.hand.concat(pl.stall);
			let vals = hst.map(x => ari_get_card(x).val);
			let sum = isEmpty(vals) ? 0 : arrSum(vals);
			let min = fen.tithe_minimum;
			if (sum < min) {
				pl.hand = [];
				pl.stall = [];
				let buildings = arrFlatten(get_values(pl.buildings));
				console.log('buildings', buildings);
				if (isEmpty(buildings)) {
					ari_history_list([`${minplayer} does not have a building to downgrade!`], 'downgrade');
					proceed_to_newcards_selection();
					return;
				}
				ari_history_list([`${minplayer} must downgrade a building to tithe ${min}!`], 'downgrade');
				Z.stage = 22;
			} else {
				ari_history_list([`${minplayer} must tithe more cards to reach ${min}!`], 'tithe');
				Z.stage = 21;
			}
			Z.turn = [minplayer];
		}
	} else {
		Z.turn = [next];
	}
	take_turn_fen();
}
function post_tithe_minimum() {
	let [fen, A, uplayer, plorder] = [Z.fen, Z.A, Z.uplayer, Z.plorder];
	let pl = fen.players[uplayer];
	let items = A.selected.map(x => A.items[x]);
	let st = items.map(x => ({ key: x.key, path: x.path }));
	pl.tithes.keys = pl.tithes.keys.concat(st);
	let newval = arrSum(st.map(x => ari_get_card(x.key).val));
	pl.tithes.val += newval;
	console.log('tithe_minimum', fen.tithe_minimum);
	console.log('val', pl.tithes.val);
	if (newval < fen.tithe_minimum) {
		select_error(`you need to tithe at least ${fen.tithe_minimum} to reach minimum`);
		return;
	}
	remove_tithes_from_play(fen, uplayer, st);
	proceed_to_newcards_selection();
}
function post_trade() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	if (A.selected.length != 2) {
		select_error('please, select exactly 2 cards!');
		return;
	}
	let i0 = A.items[A.selected[0]];
	let i1 = A.items[A.selected[1]];
	let num_own_stall = [i0, i1].filter(x => x.path.includes(uplayer)).length;
	if (i0.path == i1.path) {
		select_error('you cannot trade cards from the same group');
		return;
	} else if (num_own_stall != 1) {
		select_error('you have to pick one card of your stall and one other card');
		return;
	} else {
		let list0 = lookup(fen, i0.path.split('.'));
		let list1 = lookup(fen, i1.path.split('.'));
		exchange_by_index(list0, i0.o.index, list1, i1.o.index);
		ari_history_list(get_trade_history(uplayer, i0, i1), 'trade');
		animate_card_exchange(i0, i1, ari_next_action);
	}
}
function post_upgrade() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	A.building = A.items[A.selected[0]];
	let gb = A.building;
	let b = lookup(fen, gb.path.split('.'));
	let n = A.upgrade_cards.length;
	let type0 = gb.o.type;
	let len = gb.o.list.length + n;
	let type1 = len == 5 ? 'estate' : 'chateau';
	let target = lookup(fen, gb.path.split('.'));
	for (const o of A.upgrade_cards) {
		let source = lookup(fen, o.path.split('.'));
		elem_from_to(o.key, source, target.list);
	}
	let bres = target; //lookup(otree,target);
	bres.h = null;
	removeInPlace(fen.players[uplayer].buildings[type0], bres);
	fen.players[uplayer].buildings[type1].push(bres);
	ari_history_list([`${uplayer} upgrades a ${type0}`], 'upgrade');
	console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
	process_payment();
	setTimeout(ari_next_action, 1000); //ari_next_action();
}
function post_visit() {
	let [fen, A, uplayer, building, obuilding, owner] = [Z.fen, Z.A, Z.uplayer, Z.A.building, Z.A.obuilding, Z.A.buildingowner];
	let buildingtype = Z.A.building.o.type;
	let res = A.selected[0] == 0; //confirm('destroy the building?'); //TODO das muss besser werden!!!!!!!
	if (!res) {
		if (fen.players[owner].coins > 0) {
			fen.players[owner].coins -= 1;
			fen.players[uplayer].coins += 1;
		}
	} else {
		let list = obuilding.list;
		let correct_key = list[0];
		let rank = correct_key[0];
		while (list.length > 0) {
			let ckey = list[0];
			if (ckey[0] != rank) {
				elem_from_to_top(ckey, list, fen.deck_discard);
			} else {
				elem_from_to(ckey, list, fen.players[owner].hand);
			}
		}
		if (isdef(obuilding.h)) {
			fen.deck_discard.unshift(obuilding.h);
		}
		ari_reorg_discard(fen);
		let blist = lookup(fen, stringBeforeLast(building.path, '.').split('.')); //building.path.split('.')); //stringBeforeLast(ibuilding.path, '.').split('.'));, stringBeforeLast(building.path, '.').split('.'));
		removeInPlace(blist, obuilding);
	}
	ari_history_list([`${uplayer} visited ${buildingtype} of ${owner} resulting in ${res ? 'destruction' : 'payoff'}`,], 'visit');
	ari_next_action(fen, uplayer);
}
function proceed_to_newcards_selection() {
	let fen = Z.fen;
	let selorder = fen.selorder = sortByFuncDescending(fen.church_order, x => fen.players[x].tithes.val);
	fen.toBeSelected = jsCopy(selorder);
	fen.plorder = selorder;
	Z.turn = [selorder[0]];
	Z.stage = 19;
	take_turn_fen();
}
function process_auction() {
	let [fen, A, uplayer, plorder] = [Z.fen, Z.A, Z.uplayer, Z.plorder];
	if (isEmpty(A.selected)) A.selected = [0];
	let playerbid = Number(valf(A.items[A.selected[0]].a, '0')); //A.selected.map(x => A.items[x]); 
	lookupSet(fen, ['auction', uplayer], playerbid);
	let iturn = fen.plorder.indexOf(uplayer) + 1;
	if (iturn >= fen.plorder.length) { //console.log('auction over!');
		let list = dict2list(fen.auction, 'uplayer');
		list = sortByDescending(list, 'value');
		let max = list[0].value;
		if (max == 0) {
			Z.stage = 4;
			Z.turn = [fen.plorder[0]];
			take_turn_fen();
			return;
		}
		let second = fen.second_most = list.length == 1 ? randomNumber(0, max) : list[1].value;
		Z.stage = 13;
		let maxplayers = fen.maxplayers = list.filter(x => x.value == max).map(x => x.uplayer);
		Z.turn = [maxplayers[0]];
		for (const plname of plorder) {
			ari_history_list([`${plname} bids ${fen.auction[plname]}`], 'auction');
		}
		ari_history_list([`auction winner${if_plural(fen.maxplayers.length)}: ${fen.maxplayers.join(', ')} (price: ${fen.second_most} coin)`], 'auction');
	} else {
		Z.turn = [fen.plorder[iturn]];
	}
	take_turn_fen(); //wenn send mache muss ich die ui nicht korrigieren!
}
function process_blackmail() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	console.log('selected building to blackmail:', item);
	let building_owner = stringAfter(item.o.path, '.'); building_owner = stringBefore(building_owner, '.');
	let path = item.o.path;
	fen.blackmail = { blackmailer: uplayer, blackmailed: building_owner, payment: A.payment, building_path: path };
	let fenbuilding = lookup(fen, path.split('.'));
	console.log('blackmail:', fen.blackmail);
	fenbuilding.isblackmailed = true;
	ari_history_list([`${uplayer} is blackmailing ${building_owner}`], 'blackmail');
	[Z.stage, Z.turn] = [33, [building_owner]];
	console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
	process_payment();
	setTimeout(take_turn_fen, 1000); //take_turn_fen();
}
function process_comm_setup() {
	let [fen, A, uplayer, plorder,pl] = [Z.fen, Z.A, Z.uplayer, Z.plorder,Z.pl];
	assertion(fen.keeppolling == true, "keeppolling must be true for process_comm_setup!!!");
	if (DA.hallo) {
		console.log('process_comm_setup:', Z.playerdata, Z.stage,uplayer,pl);
		return;
	}
	let items = A.selected.map(x => A.items[x]);
	let next = get_next_player(Z, uplayer);
	let receiver = next;
	let giver = uplayer;
	let keys = items.map(x => x.key);
	Z.state = { giver:giver, receiver:receiver, keys:keys };
	assertion(isdef(Z.playerdata), "Z.playerdata must be defined for process_comm_setup!!!");
	let data = firstCond(Z.playerdata, x => x.name == uplayer);
	assertion(isdef(data), `MISSING: playerdata for ${uplayer}`);
	data.state = Z.state;
	let can_resolve = check_resolve();
	if (can_resolve) {
		Z.turn = [Z.host];
		Z.stage = 104; //'next_comm_setup_stage';
		take_turn_fen_write();
	} else {
		if (Z.mode == 'hotseat') { Z.turn = [get_next_player(Z, uplayer)]; take_turn_fen_write(); }
		else take_turn_multi();
	}
}
function process_command() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	let item = A.last_selected;
	if (nundef(item)) { post_pass(); return; }
	A.selected = [item.index];
	let a = A.items[A.selected[0]];
	A.command = a.key;
	ari_pre_action();
}
function process_commission() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	A.commission = A.items[A.selected[0]];
	if (A.commission.similar.length > 1) {
		Z.stage = 37;
	} else {
		A.commission_stall_item = A.commission.similar[0];
		Z.stage = 16;
	}
	ari_pre_action();
}
function process_commission_stall() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	console.log('process_commission_stall selected', A.selected, 'item', A.items[A.selected[0]]);
	Z.A.commission_stall_item = A.items[A.selected[0]];
	Z.stage = 16;
	ari_pre_action();
}
function process_downgrade() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	A.building = A.items[A.selected[0]];
	fen.stage = Z.stage = 103;
	let items = ui_get_hidden_building_items(A.building.o);
	items.map(x => face_up(x.o));
	A.possible_downgrade_cards = items;
	ari_pre_action();
}
function process_inspect() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	let cards = item.o.items;
	cards.map(x => face_up(x))
	weiter_process_inspect();
}
function process_journey() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	if (isEmpty(A.selected)) {
		if (nundef(fen.passed)) fen.passed = []; fen.passed.push(uplayer);
		[Z.stage, Z.turn] = set_journey_or_stall_stage(fen, Z.options, Z.phase); //set_nextplayer_after_journey();
		take_turn_fen();
		return;
	}
	let sel = A.selected.map(x => A.items[x].key);
	let [carditems, journeyitem, jlegal] = check_correct_journey(A, fen, uplayer);
	if (!carditems) return;
	delete fen.passed; //at this point, a player has selected successful journey so all players can enter journey round again!
	[A.carditems, A.journeyitem, A.jlegal] = [carditems, journeyitem, jlegal];
	Z.stage = A.journeyitem ? 30 : 31;
	ari_pre_action();
}
function process_payment() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let item = A.payment;
	is_coin_pay = nundef(item.o);
	if (is_coin_pay) a2_pay_with_coin(uplayer); else a2_pay_with_card(item);
	ari_history_list(get_pay_history(is_coin_pay ? 'coin' : item.o.key, uplayer), 'payment');
	A.payment_complete = true;
	return is_coin_pay;
}
function process_rumor() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let items = A.selected.map(x => A.items[x]);
	let building = firstCond(items, x => x.path.includes('building'));
	let rumor = firstCond(items, x => !x.path.includes('building'));
	if (nundef(building) || nundef(rumor)) {
		select_error('you must select exactly one building and one rumor card!');
		return;
	}
	let fenbuilding = lookup(fen, building.path.split('.'));
	lookupAddToList(fenbuilding, ['rumors'], rumor.key);
	removeInPlace(fen.players[uplayer].rumors, rumor.key);
	ari_history_list([`${uplayer} added rumor to ${ari_get_building_type(fenbuilding)}`,], 'rumor');
	ari_next_action(fen, uplayer);
}
function process_rumor_discard() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	console.log('.........items', A.items, A.selected, item);
	let rumor = item.key;
	removeInPlace(fen.players[uplayer].rumors, rumor);
	ari_history_list([`building is correct! ${uplayer} had to discard rumor (${rumor})`], 'rumor');
	ari_next_action();
}
function process_rumors_setup() {
	let [fen, A, uplayer, plorder, data] = [Z.fen, Z.A, Z.uplayer, Z.plorder, Z.uplayer_data];
	let items = A.selected.map(x => A.items[x]);
	let receiver = firstCond(items, x => plorder.includes(x.key)).key;
	let rumor = firstCond(items, x => !plorder.includes(x.key));
	if (nundef(receiver) || nundef(rumor)) {
		select_error('you must select exactly one player and one rumor card!');
		return;
	}
	assertion(isdef(data), 'no data for player ' + uplayer); //	sss(); //console.log('data',data);
	rumor_update_playerdata(data, receiver, rumor);
	let playerdata_complete = rumor_playerdata_complete();
	if (playerdata_complete) {
		Z.turn = [Z.host];
		Z.stage = 105; //'next_rumors_setup_stage';
		clear_transaction();
		take_turn_fen_write();
	} else if (isEmpty(data.state.remaining)) {
		clear_transaction();
		take_turn_write();
	} else {
		add_transaction('rumorsetup');
		take_turn_write();
	}
}
function process_upgrade() {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let n = A.selected.length;
	if (n > 2 || n == 2 && !has_farm(uplayer)) {
		select_error('too many cards selected!');
		return;
	} else if (n == 0) {
		select_error('please select hand or stall card(s) to upgrade!');
		return;
	}
	A.upgrade_cards = A.selected.map(x => A.items[x]);
	Z.stage = fen.stage = 102;
	ari_pre_action();
}
function process_visit() {
	alert('NOT IMPLEMENTED!');
	process_payment();
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let item = A.items[A.selected[0]];
	let obuilding = lookup(fen, item.path.split('.'));
	let parts = item.path.split('.');
	let owner = parts[1];
	if (isdef(obuilding.schweine)) {
		Z.stage = 46;
		A.building = item;
		A.obuilding = obuilding;
		A.buildingowner = owner;
		ari_pre_action();
		return;
	} else {
		let cards = item.o.items;
		let key = cards[0].rank;
		for (const c of cards) {
			if (c.rank != key) { schweine = true; schweine = c.key; face_up(c); break; }
		}
		if (schweine) {
			if (fen.players[owner].coins > 0) {
				fen.players[owner].coins--;
				fen.players[uplayer].coins++;
			}
			let b = lookup(fen, item.path.split('.'));
			b.schweine = schweine;
		}
		ari_history_list([
			`${uplayer} visited ${ari_get_building_type(obuilding)} of ${owner} resulting in ${schweine ? 'schweine' : 'ok'} ${ari_get_building_type(obuilding)}`,
		], 'visit');
	}
}
function q_mirror_fen() {
	let fen = Z.fen;
	for (const prop of arguments) {
		let ui = UI[prop];
		fen[prop] = ui.list;
	}
	qanim();
}
function q_move_topmost(uideck, uito) {
	let topmost = pop_top(uideck); //pop_deck(uideck);
	let dfrom = iDiv(topmost);
	dfrom.remove();
	dfrom.style.position = 'static';
	dfrom.style.zIndex = 0;
	uito.items.push(topmost);
	uito.list = uito.items.map(x => x.key);
	mAppend(uito.cardcontainer, dfrom);
	qanim();
}
function qanim() {
	if (!isEmpty(DA.qanim)) {
		let [f, params] = DA.qanim.shift();
		f(...params);
	} //else console.log('...anim q done!')
}
function qanim_flip(card, ms = 400) {
	mAnimate(iDiv(card), 'transform', [`scale(1,1)`, `scale(0,1)`],
		() => {
			if (card.faceUp) face_down(card); else face_up(card);
			mAnimate(iDiv(card), 'transform', [`scale(0,1)`, `scale(1,1)`], qanim, ms / 2, 'ease-in', 0, 'both');
		},
		ms / 2, 'ease-out', 0, 'both');
}
function qanim_flip_topmost(deck, ms = 400) {
	qanim_flip(deck.get_topcard(), ms);
}
function qanim_move(card, uifrom, uito, ms = 400) {
	let dfrom = iDiv(card);
	let dto = isEmpty(uito.items) ? uito.cardcontainer : iDiv(arrLast(uito.items));
	let dParent = find_common_ancestor(dfrom, dto);
	let rfrom = getRect(dfrom, dParent);
	let rto = getRect(dto, dParent);
	dfrom.style.zIndex = 100;
	let [offx, offy] = isEmpty(uito.items) ? [4, 4] : [card.w, 0];
	let a = mAnimate(dfrom, 'transform',
		[`translate(${offx + rto.l - rfrom.l}px, ${offy + rto.t - rfrom.t}px)`], qanim,
		ms, 'ease');
}
function qanim_move_topmost(uideck, uito, ms = 400) {
	let card = uideck.get_topcard();
	qanim_move(card, uideck, uito, ms);
}
function reindex_items(items) { let i = 0; items.map(x => { x.index = i; i++; }); }
function remove_hover_ui(b) { b.onmouseenter = null; b.onmouseleave = null; }
function remove_tithes_from_play(fen, plname, tithes) {
	let pl = fen.players[plname];
	if (nundef(tithes)) tithes = pl.tithes.keys;
	for (const tithe of tithes) {
		if (tithe.path.includes('hand')) { removeInPlace(pl.hand, tithe.key); }
		else if (tithe.path.includes('stall')) { removeInPlace(pl.stall, tithe.key); }
	}
	ari_history_list([`${plname} tithes ${tithes.map(x => x.key).join(', ')}!`], 'tithe');
}
function remove_ui_items(items) {
	console.log('remove_ui_items', items);
	for (const item of items) {
		let card = item.o;
		make_card_unselectable(item);
		iDiv(item.o).remove();
	}
}
function reveal_church_cards() {
	let [fen, A, uplayer, plorder] = [Z.fen, Z.A, Z.uplayer, Z.plorder];
	let pl = fen.players[uplayer];
	let uichurch = UI.church;
	let dOpenTable = UI.dOpenTable;
	let church_cards = uichurch.items;
	uichurch.container.remove();
	UI.church = uichurch = ui_type_market(fen.church, dOpenTable, { maleft: 25 }, 'church', 'church');
}
function rumor_playerdata_complete() {
	for (const pldata of Z.playerdata) {
		if (isEmpty(pldata.state) || !isEmpty(pldata.state.remaining)) return false;
	}
	return true;
}
function rumor_update_playerdata(data, receiver, rumor) {
	let remaining = arrMinus(data.state.remaining, rumor.key); //fen.players[uplayer].rumors = arrMinus(fen.players[uplayer].rumors, rumor.key);
	lookupAddToList(data, ['state', 'di', receiver], rumor.key);
	lookupAddToList(data, ['state', 'receivers'], receiver);
	lookupSetOverride(data, ['state', 'remaining'], remaining);
	Z.state = data.state; //genau DAS muss gesendet werden!!!!!
}
function set_hover_ui(b, item) {
	let isCard = isdef(item.c52key);
	let d = iDiv(item);
	b.onmouseenter = () => {
		if (isCard) {
			let rs = Array.from(d.getElementsByTagName('rect'));
			let r = arrLast(rs);
			let fill = b.fill = r.getAttribute('fill');
			r.setAttribute('fill', 'silver');
		} else {
			let hallo = mGetStyle(d, 'bg');
			let bg = isEmpty(hallo) ? 'transparent' : valf(mGetStyle(d, 'bg'), 'transparent');
			d.setAttribute('bg', bg);
			mStyle(d, { bg: 'silver' });
		}
	}
	b.onmouseleave = () => {
		if (isCard) {
			let rs = Array.from(d.getElementsByTagName('rect'));
			let r = arrLast(rs);
			r.setAttribute('fill', b.fill);
		} else {
			let bg = d.getAttribute('bg');
			mStyle(d, { bg: bg });
		}
	}
}
function set_journey_or_stall_stage(fen, options, phase) {
	let pljourney = exp_journeys(options) ? find_players_with_potential_journey(fen) : [];
	let stage, turn;
	if (isEmpty(pljourney)) { delete fen.passed; turn = [fen.plorder[0]]; ari_ensure_deck(fen, phase == 'jack' ? 3 : 2); stage = 3; }
	else { turn = [pljourney[0]]; stage = 1; }
	return [stage, turn];
}
function too_many_string_items(A) { return A.items.filter(x => nundef(x.o)).length >= 8; }
function turn_new_schwein_up(schwein, fenbuilding, uibuilding) {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let is_first_schwein = isEmpty(fenbuilding.schweine);
	add_schwein(schwein, fenbuilding, uibuilding);
	ari_history_list([`${uplayer} reveals a schwein!`], 'inspect');
	if (is_first_schwein) {
		console.log('unique AND first new schwein');
		show_instruction('found schwein - both players get a rumor!');
		let owner = stringAfter(uibuilding.path, '.');
		owner = stringBefore(owner, '.');
		console.log('owner', owner, 'uplayer', uplayer);
		A.owner = owner;
		ari_open_rumors(32);
	} else {
		console.log('unique new schwein (gibt schon schweine)')
		show_instruction('found schwein - you gain a rumor!');
		let rumor = fen.deck_rumors[0]; fen.deck_rumors.shift();
		fen.players[uplayer].rumors.push(rumor);
		ari_history_list([`${uplayer} inspects a schweine building!`], 'inspect');
		ari_next_action();
	}
}
function ui_get_all_commission_items(uplayer) {
	let items = [], i = 0;
	let comm = UI.players[uplayer].commissions;
	for (const o of comm.items) {
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: comm.path, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_all_hidden_building_items(uplayer) {
	let items = [];
	for (const gb of UI.players[uplayer].buildinglist) {
		items = items.concat(ui_get_hidden_building_items(gb));
	}
	reindex_items(items);
	return items;
}
function ui_get_blackmailed_items() {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	let commands = ['accept', 'reject'];
	let rumors = fen.players[uplayer].rumors;
	let b = path2fen(fen, fen.blackmail.building_path);
	if (nundef(b.lead)) b.lead = b.list[0];
	if (isList(rumors) && firstCond(rumors, x => x[0] == b.lead[0])) {
		commands.push('defend');
	}
	return ui_get_string_items(commands);
}
function ui_get_build_items(uplayer, except) {
	let items = ui_get_hand_and_stall_items(uplayer);
	if (is_card(except)) items = items.filter(x => x.key != except.key);
	reindex_items(items);
	return items;
}
function ui_get_building_items(uplayer) {
	let gblist = UI.players[uplayer].buildinglist;
	let items = [], i = 0;
	for (const o of gblist) {
		let name = o.type + ' ' + (o.list[0][0] == 'T' ? '10' : o.list[0][0]);
		o.div = o.container;
		let item = { o: o, a: name, key: o.list[0], friendly: name, path: o.path, index: i, ui: o.container };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_building_items_of_type(uplayer, types = ['farm', 'estate', 'chateau']) {
	let gblist = UI.players[uplayer].buildinglist.filter(x => types.includes(x.type));
	let items = [], i = 0;
	for (const o of gblist) {
		let name = o.type + ' ' + (o.list[0][0] == 'T' ? '10' : o.list[0][0]);
		o.div = o.container;
		let item = { o: o, a: name, key: o.list[0], friendly: name, path: o.path, index: i, ui: o.container };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_buildings(gblist) {
	let items = [], i = 0;
	for (const o of gblist) {
		let name = o.type + ' ' + (o.list[0][0] == 'T' ? '10' : o.list[0][0]);
		o.div = o.container;
		let item = { o: o, a: name, key: o.list[0], friendly: name, path: o.path, index: i, ui: o.container };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_church_items(uplayer) {
	let fen = Z.fen;
	let items = [], i = 0;
	let church = UI.church;
	for (const o of church.items) {
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: church.path, index: i };
		i++;
		items.push(item);
	}
	let candidates = fen.candidates = arrMinus(fen.toBeSelected, uplayer);
	if (candidates.length > 1) {
		let player_items = ui_get_string_items(candidates);
		items = items.concat(player_items);
		reindex_items(items);
	}
	return items;
}
function ui_get_coin_amounts(uplayer) {
	let items = [];
	for (let i = 0; i <= Z.fen.players[uplayer].coins; i++) {
		let cmd = '' + i;
		let item = { o: null, a: cmd, key: cmd, friendly: cmd, path: null, index: i };
		items.push(item);
	}
	return items;
}
function ui_get_commands(uplayer) {
	let avail = ari_get_actions(uplayer);
	let items = [], i = 0;
	for (const cmd of avail) { //just strings!
		let item = { o: null, a: cmd, key: cmd, friendly: cmd, path: null, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_commission_items(uplayer) {
	let items = [], i = 0;
	let comm = UI.players[uplayer].commissions;
	let stall = ui_get_stall_items(uplayer);
	for (const o of comm.items) {
		let rank = o.key[0];
		let similar = firstCond(stall, x => x.key[0] == rank);
		if (!similar) continue;
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: comm.path, index: i, similar: stall.filter(x => x.key[0] == rank) }; // similar: similar };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_commission_new_items(uplayer) {
	let items = [], i = 0;
	let comm = UI.open_commissions;
	for (const o of comm.items) {
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: comm.path, index: i };
		i++;
		items.push(item);
	}
	let topdeck = UI.deck_commission.get_topcard();
	items.push({ o: topdeck, a: topdeck.key, key: topdeck.key, friendly: topdeck.short, path: 'deck_commission', index: i });
	return items;
}
function ui_get_commission_stall_items() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	console.log('ui_get_commission_stall_items similar', A.commission.similar);
	let items = A.commission.similar;
	reindex_items(items);
	return items;
}
function ui_get_deck_item(uideck) {
	let topdeck = uideck.get_topcard();
	let item = { o: topdeck, a: topdeck.key, key: topdeck.key, friendly: topdeck.short, path: uideck.path, index: 0 };
	return item;
}
function ui_get_endgame(uplayer) { return ui_get_string_items(['end game', 'go on']); }
function ui_get_estates_chateaus_items(uplayer) { return ui_get_building_items_of_type(uplayer, ['estate', 'chateau']); }
function ui_get_exchange_items(uplayer) {
	let ihand = ui_get_hand_items(uplayer);
	let istall = ui_get_stall_items(uplayer);
	let irepair = ui_get_all_hidden_building_items(uplayer);
	irepair.map(x => face_up(x.o));
	let items = ihand.concat(istall).concat(irepair);
	reindex_items(items);
	return items;
}
function ui_get_farms_estates_items(uplayer) { return ui_get_building_items_of_type(uplayer, ['farm', 'estate']); }
function ui_get_hand_and_journey_items(uplayer) {
	let items = ui_get_hand_items(uplayer);
	let matching = [];
	for (const plname of Z.plorder) {
		let jitems = ui_get_journey_items(plname);
		for (const j of jitems) {
			for (const card of items) {
				if (matches_on_either_end(card, j)) { matching.push(j); break; }
			}
		}
	}
	items = items.concat(matching);
	reindex_items(items);
	return items;
}
function ui_get_hand_and_stall_items(uplayer) {
	let items = ui_get_hand_items(uplayer);
	items = items.concat(ui_get_stall_items(uplayer));
	reindex_items(items);
	return items;
}
function ui_get_hand_items(uplayer) {
	let items = [], i = 0;
	let hand = UI.players[uplayer].hand;
	for (const o of hand.items) {
		o.index = i;
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: hand.path, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_hand_items_minus(uplayer, cardlist) {
	if (!isList(cardlist)) cardlist = [cardlist];
	let items = [], i = 0;
	let hand = UI.players[uplayer].hand;
	for (const o of hand.items) {
		if (cardlist.includes(o)) continue;
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: hand.path, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_harvest_items(uplayer) {
	let items = []; let i = 0;
	for (const gb of UI.players[uplayer].buildinglist) {
		if (isdef(gb.harvest)) {
			let d = gb.harvest;
			mStyle(d, { cursor: 'pointer', opacity: 1 });
			gb.div = d;
			let name = 'H' + i + ':' + (gb.list[0][0] == 'T' ? '10' : gb.list[0][0]);
			let item = { o: gb, a: name, key: name, friendly: name, path: gb.path, index: i };
			i++;
			items.push(item);
		}
	}
	return items;
}
function ui_get_hidden_building_items(uibuilding) {
	let items = [];
	for (let i = 1; i < uibuilding.items.length; i++) {
		let o = uibuilding.items[i];
		o.index = i;
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: uibuilding.path, index: i - 1 };
		items.push(item);
	}
	return items;
}
function ui_get_journey_items(plname) {
	let gblist = UI.players[plname].journeys;
	let items = [], i = 0;
	for (const o of gblist) {
		let name = `${plname}_j${i}`;
		o.div = o.container;
		let item = { o: o, a: name, key: o.list[0], friendly: name, path: o.path, index: i, ui: o.container };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_market_items() {
	let items = [], i = 0;
	for (const o of UI.market.items) {
		o.index = i;
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: `market`, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_open_discard_items() {
	let items = [], i = 0;
	for (const o of UI.open_discard.items) {
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: `open_discard`, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_other_buildings(uplayer) {
	let items = [];
	for (const plname of Z.plorder) {
		if (plname == uplayer) continue;
		items = items.concat(ui_get_buildings(UI.players[plname].buildinglist));
	}
	reindex_items(items);
	return items;
}
function ui_get_other_buildings_and_rumors(uplayer) {
	let items = ui_get_other_buildings(uplayer);
	items = items.concat(ui_get_rumors_items(uplayer));
	reindex_items(items);
	return items;
}
function ui_get_other_buildings_with_rumors(uplayer) {
	let items = [];
	for (const plname of Z.plorder) {
		if (plname == uplayer) continue;
		items = items.concat(ui_get_buildings(UI.players[plname].buildinglist.filter(x => !isEmpty(x.rumors))));
	}
	reindex_items(items);
	return items;
}
function ui_get_payment_items(pay_letter) {
	let [fen, A, uplayer] = [Z.fen, Z.A, Z.uplayer];
	let items = ui_get_hand_and_stall_items(uplayer); //gets all hand and stall cards
	let n = items.length;
	items = items.filter(x => x.key[0] == pay_letter);
	if (n == 4 && A.command == 'build') items = []; //das ist damit min building items gewahrt bleibt!
	if (n == 1 && A.command == 'upgrade') items = []; //das ist damit min upgrade items gewahrt bleibt!
	if (fen.players[uplayer].coins > 0 && fen.phase[0].toUpperCase() == pay_letter) {
		items.push({ o: null, a: 'coin', key: 'coin', friendly: 'coin', path: null });
	}
	let i = 0; items.map(x => { x.index = i; i++; }); //need to reindex when concat!!!
	return items;
}
function ui_get_rumors_and_players_items(uplayer) {
	let items = [], i = 0;
	let comm = UI.players[uplayer].rumors;
	let [data, pl] = [Z.uplayer_data, Z.pl];
	assertion(isdef(data), 'no data for player ' + uplayer);
	if (!isDict(data.state)) data.state = { remaining: jsCopy(pl.rumors), receivers: [], di: {} };
	let rem = data.state.remaining;
	for (const k of rem) {
		let o = firstCond(comm.items, x => x.key == k);
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: comm.path, index: i };
		i++;
		items.push(item);
	}
	let players = [];
	let receivers = data.state.receivers;
	for (const plname in UI.players) {
		if (plname == uplayer || receivers.includes(plname)) continue;
		players.push(plname);
	}
	items = items.concat(ui_get_string_items(players));
	reindex_items(items);
	return items;
}
function ui_get_rumors_items(uplayer) {
	let items = [], i = 0;
	let rum = UI.players[uplayer].rumors;
	for (const o of rum.items) {
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: rum.path, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_schweine_candidates(uibuilding) {
	let items = ui_get_hidden_building_items(uibuilding);
	items = items.filter(x => x.o.key[0] != uibuilding.keycard.key[0]);
	reindex_items(items);
	return items;
}
function ui_get_stall_items(uplayer) {
	let items = [], i = 0;
	let stall = UI.players[uplayer].stall;
	for (const o of stall.items) {
		o.index = i;
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: stall.path, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_string_items(commands) {
	let items = [], i = 0;
	for (const cmd of commands) { //just strings!
		let item = { o: null, a: cmd, key: cmd, friendly: cmd, path: null, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_top_rumors() {
	let items = [], i = 0;
	for (const o of UI.rumor_top.items) {
		let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: `rumor_top`, index: i };
		i++;
		items.push(item);
	}
	return items;
}
function ui_get_trade_items(uplayer) {
	let items = ui_get_market_items(uplayer);
	items = items.concat(ui_get_stall_items(uplayer));//zuerst eigene!
	for (const plname of Z.fen.plorder) {
		if (plname != uplayer) items = items.concat(ui_get_stall_items(plname));
	}
	reindex_items(items);
	return items;
}
function weiter_process_inspect() {
	let [stage, A, fen, uplayer] = [Z.stage, Z.A, Z.fen, Z.uplayer];
	let item = A.items[A.selected[0]];
	let uibuilding = A.uibuilding = item.o;
	let fenbuilding = A.fenbuilding = lookup(fen, uibuilding.path.split('.'));
	let key = uibuilding.keycard.key;
	let cards = uibuilding.items;
	let schweine_cand = [];
	for (let i = 1; i < cards.length; i++) {
		if (fenbuilding.schweine.includes(i)) continue; //if index i is already in schweine, skip this card
		let card = cards[i];
		if (card.key == key) continue;
		assertion(i == card.index, 'wrong card index!!!!')
		schweine_cand.push(card); //add this card to schweine_cand
	}
	if (schweine_cand.length > 1) {
		Z.stage = 38;
		ari_pre_action();
	} else if (schweine_cand.length == 1) {
		setTimeout(() => turn_new_schwein_up(schweine_cand[0], fenbuilding, uibuilding), 3000);
	} else if (isEmpty(fenbuilding.schweine)) {
		Z.stage = 29;
		ari_history_list([`${uplayer} inspects a correct building`], 'inspect');
		show_instruction('the building is CORRECT - You loose 1 rumor')
		setTimeout(ari_pre_action, 2000); //ari_pre_action();
	} else {
		let rumor = fen.deck_rumors[0]; fen.deck_rumors.shift();
		fen.players[uplayer].rumors.push(rumor);
		show_instruction('no additional schwein has been found - you gain 1 rumor')
		ari_history_list([`${uplayer} inspects a schweine!`], 'inspect');
		setTimeout(ari_next_action, 2000);
	}
}
//#endregion aristo

//#region bluff
function apply_skin1(item) {
	let d = item.container; mCenterFlex(d); mStyle(d, { position: 'relative', w: 400 }); //,bg:'pink'});
	mText(`${item.label}: <span style="font-size:20px;margin:10px;color:red">${item.content}</span>`, d);
	let b = mButton(item.caption, item.handler, d, { position: 'absolute', right: 0, top: 'calc( 50% - 12px )', h: 24 }, ['selectbutton', 'enabled']);
	console.log('button', b)
}
function apply_skin2(item) {
	let d = item.container; mCenterFlex(d); mStyle(d, { position: 'relative', w: 400 }); //,bg:'pink'});
	let h = 24;
	let top = `calc( 50% - ${h / 2}px )`
	mText(item.label + ':', d, { position: 'absolute', left: 0, top: top, h: h });
	mText(`<span style="font-size:20px;margin:10px;color:red">${item.content}</span>`, d);
	item.button = mButton(item.caption, item.handler, d, { position: 'absolute', right: 0, top: top, h: h, w: 80 }, ['selectbutton', 'enabled']);
}
function apply_skin3(item) {
	let d = item.container; mCenterCenterFlex(d); mStyle(d, { position: 'relative', w: 400 }); //,bg:'pink'});
	let h = 24;
	let top = `calc( 50% - ${h / 2}px )`
	mText(item.label + ':', d, { position: 'absolute', left: 0, top: top, h: h });
	let panel = UI.dAnzeige = item.panel = mDiv(d, { bg: '#ffffff80', padding: '4px 12px', w: 200, align: 'center', rounding: 8 });
	let words = toWords(item.content)
	let panelitems = UI.panelItems = item.panelitems = [];
	for (let i = 0; i < 4; i++) {
		let text = valf(words[i], '');
		let dw = mDiv(panel, { hpadding: 4, display: 'inline', fz: 22, weight: 'bold', fg: 'red' }, `dbid_${i}`, text);
		panelitems.push({ div: dw, index: i, initial: text, state: 'unselected' })
	}
	let b = item.buttonX = mDiv(panel, { fz: 10, hpadding: 4, bg: 'white' }, null, 'CLR', 'enabled'); mPlace(b, 'tr', 2)
	b.onclick = bluff_clear_panel;
	item.button = mButton(item.caption, item.handler, d, { position: 'absolute', right: 0, top: top, h: h, w: 80 }, ['selectbutton', 'enabled']);
}
function bid_to_string(bid) { return bid.join(' '); }
function bluff() {
	const rankstr = '3456789TJQKA2';	
	function setup(players, options) {
		let fen = { players: {}, plorder: jsCopy(players), history: {}, stage: 'move', phase: '' };
		let num_cards_needed = players.length * options.max_handsize;
		let num_decks_needed = fen.num_decks = Math.ceil(num_cards_needed / 52);
		let deck = fen.deck = create_fen_deck('n', num_decks_needed);
		shuffle(deck);
		shuffle(fen.plorder);
		fen.turn = [fen.plorder[0]];
		for (const plname of fen.plorder) {
			let handsize = options.min_handsize;
			fen.players[plname] = {
				hand: deck_deal(deck, handsize),
				handsize: handsize,
				name: plname,
				color: get_user_color(plname),
			};
		}
		fen.stage = 0;
		return fen;
	}
	function clear_ack() { if (Z.stage == 1) { bluff_change_to_turn_round(); take_turn_fen(); } }
	function check_gameover(Z) { let pls = get_keys(Z.fen.players); if (pls.length < 2) Z.fen.winners = pls; return valf(Z.fen.winners, false); }
	function activate_ui() { bluff_activate_new(); }
	function present(dParent) { bluff_present(dParent); }
	function stats(dParent) { bluff_stats(dParent); }
	function state_info(dParent) { bluff_state(dParent); }
	return { rankstr, setup, activate_ui, check_gameover, clear_ack, present, state_info, stats };
}
function bluff_activate_new() {
	let [z, A, fen, stage, uplayer, ui, dt] = [Z, Z.A, Z.fen, Z.stage, Z.uplayer, UI, UI.dOpenTable];
	if (stage == 1) bluff_activate_stage1(); else { bluff_activate_stage0(); if (is_ai_player()) ai_move(1000); }
}
function bluff_activate_stage0() {
	let [z, A, fen, stage, uplayer, ui, dt] = [Z, Z.A, Z.fen, Z.stage, Z.uplayer, UI, UI.dOpenTable];
	if (isdef(fen.lastbid)) show(ui.currentBidItem.button);
	bluff_show_new_bid(dt);
	mLinebreak(dt, 10);
	bluff_button_panel1(dt, fen.newbid, 50);
}
function bluff_activate_stage1() {
	let [z, A, fen, stage, uplayer, ui, dt] = [Z, Z.A, Z.fen, Z.stage, Z.uplayer, UI, UI.dOpenTable];
	if (isdef(DA.ack) && isdef(DA.ack[uplayer])) { console.log('DA.ack', DA.ack); mText('...waiting for ack', dt); return; }
	if (isdef(ui.dHandsize)) mPulse(ui.dHandsize, 2000);
}
function bluff_ai() {
	let [A, fen, uplayer, pl] = [Z.A, Z.fen, Z.uplayer, Z.pl];
	const torank = { _: '_', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: 'T', jack: 'J', queen: 'Q', king: 'K', ace: 'A' };
	const toword = { _: '_', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', T: 'ten', J: 'jack', Q: 'queen', K: 'king', A: 'ace' };
	let words = get_keys(torank).slice(1); // words sind three, four, ..., king, ace
	let all_hand_cards = aggregate_elements(dict2list(fen.players, 'name'), 'hand'); // all cards in play
	let no_twos = all_hand_cards.filter(x => x[0] != '2'); // alle Karten ohne 2er
	let rankstr = '3456789TJQKA2';
	sortByRank(all_hand_cards, rankstr);
	let byrank = aggregate_player_hands_by_rank(fen);
	let rank_list = dict2list(byrank, 'rank');
	let unique_ranks = sortByRank(get_keys(byrank));
	let myranks = sortByRank(pl.hand.map(x => x[0]));
	let my_unique = unique_ranks.filter(x => myranks.includes(x));
	rank_list.map(x => { x.mine = myranks.includes(x.rank); x.irank = rankstr.indexOf(x.rank); x.i = x.irank + 100 * x.value; });
	rank_list = rank_list.filter(x=>x.rank != '2');
	sortByDescending(rank_list, 'i');
	let maxcount = rank_list[0].value;
	let mymaxcount = rank_list.filter(x => x.mine)[0].value;
	let expected = all_hand_cards.length / 13; // auch 2er gibt es soviele!
	let nreason = Math.max(1, Math.round(expected * 2));
	let n_twos = all_hand_cards.filter(x => x[0] == '2').length;
	let have2 = firstCond(rank_list,x=>x.rank=='2' && x.mine);
	return botbest(rank_list, maxcount, mymaxcount, expected, nreason, n_twos, have2, words, fen);
}
function bluff_button_panel1(dt, bid, sz) {
	let n = bid[0] == '_' ? 1 : Number(bid[0]);
	let arr1 = arrRange(n, n + 5);
	let arr2 = toLetters('3456789TJQKA');
	let arr3 = arrRange(0, 5);
	let arr4 = toLetters('3456789TJQKA');
	let dPanel = mDiv(dt, { gap: 5 });
	[d1, d2, d3, d4] = mColFlex(dPanel, [1, 2, 1, 2]);//,[YELLOW,ORANGE,RED,BLUE]);
	UI.dn1 = create_bluff_input1(d1, arr1, 1, sz, 0); d1.onmouseenter = () => iHigh(UI.panelItems[0]); d1.onmouseleave = () => iUnhigh(UI.panelItems[0]);
	UI.dr1 = create_bluff_input1(d2, arr2, 2, sz, 1); d2.onmouseenter = () => iHigh(UI.panelItems[1]); d2.onmouseleave = () => iUnhigh(UI.panelItems[1]);
	UI.dn2 = create_bluff_input1(d3, arr3, 1, sz, 2); d3.onmouseenter = () => iHigh(UI.panelItems[2]); d3.onmouseleave = () => iUnhigh(UI.panelItems[2]);
	UI.dr2 = create_bluff_input1(d4, arr4, 2, sz, 3); d4.onmouseenter = () => iHigh(UI.panelItems[3]); d4.onmouseleave = () => iUnhigh(UI.panelItems[3]);
}
function bluff_change_to_ack_round(fen, nextplayer) {
	[Z.stage, Z.turn] = [1, [get_admin_player(fen.plorder)]];
	fen.keeppolling = true;
	fen.nextturn = [nextplayer]; //next player after ack!
}
function bluff_change_to_turn_round() {
	let [fen, stage] = [Z.fen, Z.stage];
	assertion(stage == 1, "ALREADY IN TURN ROUND!!!!!!!!!!!!!!!!!!!!!!");
	Z.stage = 0;
	Z.turn = fen.nextturn;
	Z.round += 1;
	for (const k of ['bidder', 'loser', 'aufheber', 'lastbid', 'lastbidder']) delete fen[k];
	for (const k of ['nextturn', 'keeppolling']) delete fen[k];
	for (const plname of fen.plorder) { delete fen.players[plname].lastbid; }
}
function bluff_clear_panel() {
	for (const item of UI.panelItems) {
		let d = iDiv(item);
		d.innerHTML = '_';
	}
	Z.fen.newbid = ['_', '_', '_', '_'];
}
function bluff_convert2ranks(b) { return [b[0], BLUFF.torank[b[1]], b[2]=='_'?0:b[2], BLUFF.torank[b[3]]]; }
function bluff_convert2words(b) { return [b[0], BLUFF.toword[b[1]], b[2]<1?'_':b[2], BLUFF.toword[b[3]]]; }
function bluff_generate_random_bid() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	const di2 = { _: '_', three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 'T', jack: 'J', queen: 'Q', king: 'K', ace: 'A' };
	let words = get_keys(di2).slice(1);
	let b = isdef(fen.lastbid) ? jsCopy(fen.lastbid) : null;
	if (isdef(b)) {
		assertion(b[0] >= (b[2] == '_' ? 0 : b[2]), 'bluff_generate_random_bid: bid not formatted correctly!!!!!!!', b)
		let nmax = calc_reasonable_max(fen);
		let n = b[0] == '_' ? 1 : Number(b[0]);
		let done = false;
		if (n > nmax + 1) {
			const di = { '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', T: 'ten', J: 'jack', Q: 'queen', K: 'king', A: 'ace' };
			let rankstr = '3456789TJQKA';
			let w1 = di2[b[1]];
			let idx = isdef(w1) ? rankstr.indexOf(w1) : -1;
			if (idx >= 0 && idx < rankstr.length - 2) {
				let r = rankstr[idx + 1];
				b[1] = di[r];
				done = true;
			}
		}
		if (!done) {
			if (b[3] == '_') { b[2] = 1; b[3] = rChoose(words, 1, x => x != b[1]); }
			else if (b[0] > b[2]) { b[2] += 1; } //console.log('new bid is now:', b); }
			else { b[0] += coin(80) ? 1 : 2; if (coin()) b[2] = b[3] = '_'; }
		}
	} else {
		let nmax = calc_reasonable_max(fen);
		let nmin = Math.max(nmax - 1, 1);
		let arr_nmax = arrRange(1, nmax);
		let arr_nmin = arrRange(1, nmin);
		b = [rChoose(arr_nmax), rChoose(words), rChoose(arr_nmin), rChoose(words)];
		if (b[1] == b[3]) b[3] = rChoose(words, 1, x => x != b[1]);
		if (coin()) b[2] = b[3] = '_';
	}
	fen.newbid = b;
	UI.dAnzeige.innerHTML = bid_to_string(b);
}
function bluff_present(dParent) {
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent, 1, 0); ///tableLayoutOMR(dParent, 5, 1);
	let [fen, uplayer, ui, stage, dt] = [Z.fen, Z.uplayer, UI, Z.stage, dOpenTable];
	clearElement(dt); mCenterFlex(dt);
	if (stage == 1) { DA.no_shield = true; } else { DA.ack = {}; DA.no_shield = false; }
	bluff_stats(dt);
	mLinebreak(dt, 10);
	bluff_show_cards(dt);
	mLinebreak(dt, 4);
	let item = ui.currentBidItem = bluff_show_current_bid(dt);
	hide(item.button);
	mLinebreak(dt, 10);
	if (stage == 1) {
		show_waiting_for_ack_message();
		let loser = fen.loser;
		let msg1 = fen.war_drin ? 'war drin!' : 'war NICHT drin!!!';
		let msg2 = isdef(fen.players[loser]) ? `${capitalize(loser)} will get ${fen.players[loser].handsize} cards!` : `${capitalize(loser)} is out!`;
		mText(`<span style="color:red">${msg1} ${msg2}</span>`, dt, { fz: 22 });
		mLinebreak(dt, 4);
	}
}
function bluff_reset_to_current_bid() { onclick_reload(); }
function bluff_show_cards(dt) {
	let [fen, ui, stage, uplayer] = [Z.fen, UI, Z.stage, Z.uplayer];
	let pl = fen.players[uplayer], upl = ui.players[uplayer] = {};
	mText(stage == 1 ? "all players' cards: " : "player's hand: ", dt); mLinebreak(dt, 2);
	let cards = stage == 1 ? fen.akku : pl.hand;
	cards = sort_cards(cards, false, 'CDSH', true, '3456789TJQKA2'); // immer by rank!
	let hand = upl.hand = ui_type_hand(cards, dt, { hmin: 160 }, null, '', ckey => ari_get_card(ckey, 150));
	let uname_plays = isdef(fen.players[Z.uname]);;//Z.turn.includes(Z.uname);
	let ishidden = stage == 0 && uname_plays && uplayer != Z.uname && Z.mode != 'hotseat';
	if (ishidden) { hand.items.map(x => face_down(x)); }
}
function bluff_show_current_bid(dt) {
	let fen = Z.fen;
	let bid = fen.oldbid = valf(fen.lastbid, ['_', '_', '_', '_']);
	let d = mDiv(dt);
	let content = `${bid_to_string(bid)}`;
	let item = { container: d, label: 'current bid', content: content, caption: 'geht hoch!', handler: handle_gehtHoch };
	apply_skin2(item);
	return item;
}
function bluff_show_new_bid(dt) {
	let fen = Z.fen;
	let bid = fen.oldbid = valf(fen.lastbid, ['_', '_', '_', '_']);
	fen.newbid = jsCopy(bid); // ['4', 'queen', '3', 'jack'];
	let d = mDiv(dt);
	let content = `${bid_to_string(bid)}`;
	let item = { container: d, label: 'YOUR bid', content: content, caption: 'BID', handler: handle_bid };
	apply_skin3(item);
}
function bluff_state(dParent) {
	let user_html = get_user_pic_html(Z.uplayer, 30);
	dParent.innerHTML = `Round ${Z.round}:&nbsp;player: ${user_html} `;
}
function bluff_stats(dParent) {
	let player_stat_items = UI.player_stat_items = ui_player_info(dParent, {}, { 'border-width': 1, margin: 10, wmax: 180 });
	let fen = Z.fen;
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		let item = player_stat_items[plname];
		let d = iDiv(item); mCenterFlex(d); mLinebreak(d);
		if (fen.turn.includes(plname)) {
			let dh = show_hourglass(plname, d, 20, { left: -4, top: 0 });
		}
		let dhz = mDiv(d, { fg: pl.handsize == Z.options.max_handsize ? 'yellow' : 'white' }, null, `hand: ${pl.handsize}`); mLinebreak(d);
		if (plname == fen.loser) UI.dHandsize = dhz;
		let elem = mDiv(d, { fg: plname == fen.lastbidder ? 'red' : 'white' }, null, `${valf(pl.lastbid, ['_']).join(' ')}`);
		let szhand = getSizeNeeded(dhz);
		let sz = getSizeNeeded(elem);
		let w = Math.max(szhand.w + 20, sz.w + 20, 80);
		mStyle(d, { w: w }); //, bg: 'blue' });
		mLinebreak(d);
	}
	return player_stat_items[Z.uplayer];
}
function bot_clairvoyant(list, maxvalue, mmax, exp, nreas, n2, have2, words, fen) {
	let reduced_list = list.filter(x=>x.value == list[0].value || x.mine);
	let res=reduced_list.length>=2?rChoose(list,2):[reduced_list[0],{value:0,rank:'_'}];
	let max=res[0].value>=res[1].value?res[0]:res[1];let min=res[0].value<res[1].value?res[0]:res[1];
	let b=[max.value,max.rank,min.value,min.rank];
	if (isdef(fen.lastbid)) {
		let [n1, r1, n2, r2] = bluff_convert2ranks(fen.lastbid);
		if (!is_bid_higher_than(bluff_convert2words(b), fen.lastbid)) {
			return [null, handle_gehtHoch];
		}
	} 
	return [bluff_convert2words(b), handle_bid];
}
function bot_perfect(list, max, mmax, exp, nreas, n2, have2, words, fen) {
	let i=0;while(list[i].rank == '2') i++;
	let b = [list[i].value+n2, list[i].rank, list[i+1].value, list[i+1].rank];
	list.map(x => console.log(x)); //
	console.log('b:', b);
	if (isdef(fen.lastbid)) {
		let [n1, r1, n2, r2] = bluff_convert2ranks(fen.lastbid);
		if (!is_bid_higher_than(bluff_convert2words(b), fen.lastbid)) {
			return [null, handle_gehtHoch];
		}
	} 
	return [bluff_convert2words(b), handle_bid];
}
function bot_random(list, max, mmax, exp, nreas, n2, have2, words, fen) {
	let ranks = rChoose('3456789TJQKA', 2);
	let b;
	if (nundef(fen.lastbid)) b = [rNumber(1, nreas), ranks[0], rNumber(1, nreas), ranks[1]];
	else if (fen.lastbid[0] > nreas + 2) {
		return [null, handle_gehtHoch];
	} else {
		[n1, r1, n2, r2] = bluff_convert2ranks(fen.lastbid);
		assertion(isNumber(n1) && n1>0 && isNumber(n2), 'bot_random: n1 or n2 is not a number OR n1<=0!!!!!!!',n1,n2);
		if ((n1 + n2) / 2 > nreas && coin(50)) {
			return [null, handle_gehtHoch];
		} else if ((n1 + n2) / 2 <= nreas + 1) b = n1 <= nreas + 1 ? [n1 + 1, r1, n2, r2] : [n1, r1, n2 + 1, r2];
		else {
			let [i1, i2] = [BLUFF.rankstr.indexOf(r1), BLUFF.rankstr.indexOf(r2)];
			let s = '3456789TJQKA';
			let imin = Math.min(i1, i2); let imax = Math.max(i1, i2); let i = imax == i1 ? 1 : 2;
			let [smin, between, smax] = [s.substring(0, imin), s.substring(imin + 1, imax), s.substring(imax + 1, s.length)];
			if (!isEmpty(smax)) { if (i == 1) b = [n1, rChoose(smax), n2, r2]; else b = [n1, r1, n2, rChoose(smax)]; }
			else if (!isEmpty(between)) { if (i == 2) b = [n1, rChoose(between), n2, r2]; else b = [n1, r1, n2, rChoose(between)]; }
			else return [null, handle_gehtHoch];
		}
	}
	return [bluff_convert2words(b), handle_bid];
}
function botbest(list, max, mmax, exp, nreas, n2, have2, words, fen) {
	if (nundef(DA.ctrandom))DA.ctrandom = 1;console.log(`${DA.ctrandom++}: ${Z.uplayer} using strategy`,Z.strategy)
	let bot = window[`bot_${Z.strategy}`];
	let [b, f] = bot(list, max, mmax, exp, nreas, n2, have2, words, fen);
	assertion(!b || b[2]!=0, 'bot returned bid with n2==0');
	return [b, f];
}
function calc_bid_minus_cards(fen, bid) {
	let di2 = { _: '_', three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 'T', jack: 'J', queen: 'Q', king: 'K', ace: 'A' };
	let di_ranks = aggregate_player_hands_by_rank(fen);
	let [brauch1, r1, brauch2, r2] = bid;
	[r1, r2] = [di2[r1], di2[r2]];
	if (brauch1 == '_') brauch1 = 0;
	if (brauch2 == '_') brauch2 = 0;
	let hab1 = valf(di_ranks[r1], 0);
	let hab2 = valf(di_ranks[r2], 0);
	let wildcards = valf(di_ranks['2'], 0);
	let diff1 = Math.max(0, brauch1 - hab1);
	let diff2 = Math.max(0, brauch2 - hab2);
	return diff1 + diff2 - wildcards;
}
function calc_reasonable_max(fen) {
	let allcards = [];
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		allcards = allcards.concat(pl.hand);
	}
	let ncards = allcards.length;
	let nmax = Math.floor(ncards / 13) + 1;
	return nmax;
}
function create_bluff_input1(dParent, arr, units = 1, sz, index) {
	let d = mDiv(dParent, { gap: 5, w: units * sz * 1.35 }); mCenterFlex(d);
	for (const a of arr) {
		let da = mDiv(d, { align: 'center', wmin: 20, padding: 4, cursor: 'pointer', rounding: 4, bg: units == 1 ? '#e4914b' : 'sienna', fg: 'contrast' }, null, a == 'T' ? '10' : a); //units == 1?a:di[a]);
		da.onclick = () => input_to_anzeige1(a, index);
	}
	return d;
}
function get_robot_personality(name) { return { erratic: 20, bluff: 20, random: 20, risk: 20, passive: 20, clairvoyant: 20, aggressive: 20 }; }
function handle_bid() {
	let [z, A, fen, uplayer, ui] = [Z, Z.A, Z.fen, Z.uplayer, UI];
	let oldbid = jsCopy(fen.oldbid);
	let bid = jsCopy(fen.newbid);
	let ranks = '23456789TJQKA';
	bid = normalize_bid(bid);
	let higher = is_bid_higher_than(bid, oldbid);
	if (bid[2] == 0) bid[2] = '_';
	if (!higher) {
		select_error('the bid you entered is not high enough!');
	} else {
		fen.lastbid = fen.players[uplayer].lastbid = bid; //fen.newbid;
		fen.lastbidder = uplayer;
		delete fen.oldbid; delete fen.newbid;
		Z.turn = [get_next_player(Z, uplayer)];
		take_turn_fen();
	}
}
function handle_gehtHoch() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	let [bid, bidder] = [fen.lastbid, fen.lastbidder];
	let diff = calc_bid_minus_cards(fen, bid); // hier wird schon der akku gemacht!!! ich kann also jetzt die cards renewen!!!
	let aufheber = uplayer;
	let loser = diff > 0 ? bidder : aufheber;
	let war_drin = fen.war_drin = diff <= 0;
	let loser_handsize = inc_handsize(fen, loser);
	new_deal(fen);
	let nextplayer;
	if (loser_handsize > Z.options.max_handsize) {
		nextplayer = get_next_player(Z, loser)
		let plorder = fen.plorder = remove_player(fen, loser);
	} else {
		nextplayer = loser;
	}
	fen.loser = loser; fen.bidder = bidder; fen.aufheber = aufheber;
	bluff_change_to_ack_round(fen, nextplayer);
	take_turn_fen();
}
function iHigh(item) { let d = iDiv(item); mStyle(d, { bg: 'darkgray' }); }
function inc_handsize(fen, uname) {
	let pl = fen.players[uname];
	pl.handsize = Number(pl.handsize) + 1;
	return pl.handsize;
}
function input_to_anzeige1(caption, index) {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	const di = { '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', T: 'ten', J: 'jack', Q: 'queen', K: 'king', A: 'ace' };
	let bid = fen.newbid;
	if (index == 0) {
		bid[0] = Number(caption);
		if (bid[0] == 0) {
			bid[0] = '_'; bid[1] = '_';
		} else if (bid[1] == '_') {
			let hand = fen.players[uplayer].hand;
			let c1 = arrLast(hand); //highest
			let r = c1[0];
			if (r == '2') r = bid[3] == 'ace' ? 'K' : 'A';
			if (di[r] == bid[3]) bid[1] = bid[3] == 'three' ? 'four' : 'three'; else bid[1] = di[r];
		}
	} else if (index == 1) {
		bid[1] = di[caption];
		if (bid[0] == '_') bid[0] = 1;
		if (bid[3] == bid[1]) { bid[0] = bid[0] + bid[2]; bid[2] = bid[3] = '_'; }
	} else if (index == 2) {
		bid[2] = Number(caption);
		if (bid[2] == 0) {
			bid[2] = '_'; bid[3] = '_';
		} else if (bid[3] == '_') {
			let hand = fen.players[uplayer].hand;
			let c1 = hand[0];
			let r = c1[0];
			if (r == '2') r = bid[1] == 'ace' ? 'K' : 'A';
			if (di[r] == bid[1]) bid[3] = bid[1] == 'three' ? 'four' : 'three'; else bid[3] = di[r];
		}
	} else {
		bid[3] = di[caption];
		if (bid[2] == '_') bid[2] = 1;
		if (bid[3] == bid[1]) { bid[0] = bid[0] + bid[2]; bid[1] = bid[3]; bid[2] = bid[3] = '_'; }
	}
	for (let i = 0; i < 4; i++)	iDiv(UI.panelItems[i]).innerHTML = bid[i];
}
function is_bid_higher_than(bid, oldbid) {
	bid = jsCopy(bid);
	if (bid[0] == '_') bid[0] = 0;
	if (bid[2] == '_') bid[2] = 0;
	if (oldbid[0] == '_') oldbid[0] = 0;
	if (oldbid[2] == '_') oldbid[2] = 0;
	let higher = bid[0] > oldbid[0]
		|| bid[0] == oldbid[0] && is_higher_ranked_name(bid[1], oldbid[1])
		|| bid[0] == oldbid[0] && bid[1] == oldbid[1] && bid[2] > oldbid[2]
		|| bid[0] == oldbid[0] && bid[1] == oldbid[1] && bid[2] == oldbid[2] && is_higher_ranked_name(bid[3], oldbid[3]);
	return higher;
}
function is_higher_ranked_name(f1, f2) {
	let di2 = { _: 0, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, jack: 11, queen: 12, king: 13, ace: 14 };
	return di2[f1] > di2[f2];
}
function iUnhigh(item) { let d = iDiv(item); mStyle(d, { bg: 'transparent' }); }
function new_deal(fen) {
	let deck = fen.deck = create_fen_deck('n', fen.num_decks);
	shuffle(deck);
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		let handsize = pl.handsize;
		pl.hand = deck_deal(deck, handsize);
	}
}
function normalize_bid(bid) {
	let need_to_sort = bid[0] == '_' && bid[2] != '_'
		|| bid[2] != '_' && bid[2] > bid[0]
		|| bid[2] == bid[0] && is_higher_ranked_name(bid[3], bid[1]);
	if (need_to_sort) {
		let [h0, h1] = [bid[0], bid[1]];
		[bid[0], bid[1]] = [bid[2], bid[3]];
		[bid[2], bid[3]] = [h0, h1];
	}
	return bid;
}
//#endregion bluff

//#region fritz
function add_card_to_group(card, oldgroup, oldindex, targetcard, targetgroup) {
	card.groupid = targetgroup.id;
	if (card.source == 'hand') {
		let hand = UI.players[Z.uplayer].hand;
		removeInPlace(hand.items, card);
	}
	card.source = 'group';
	mDroppable(iDiv(card), drop_card_fritz, dragover_fritz);
	if (nundef(targetcard)) { //} || targetcard.id == arrLast(targetgroup.ids)) {
		targetgroup.ids.push(card.id);
		mAppend(iDiv(targetgroup), iDiv(card));
	} else {
		let index = targetgroup.ids.indexOf(targetcard.id) + 1;
		targetgroup.ids.splice(index, 0, card.id);
		mClear(iDiv(targetgroup));
		for (let i = 0; i < targetgroup.ids.length; i++) {
			let c = Items[targetgroup.ids[i]];
			mAppend(iDiv(targetgroup), iDiv(c));
		}
	}
	resplay_container(targetgroup);
}
function calc_fritz_score() {
	let [round, plorder, stage, A, fen, uplayer] = [Z.round, Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
	for (const plname of fen.roundorder) {
		let pl = fen.players[plname];
		if (nundef(pl.score)) pl.score = 0;
		else pl.score += calc_hand_value(pl.hand.concat(pl.loosecards), fritz_get_card);
	}
}
function cleanup_or_resplay(oldgroup) {
	if (isdef(oldgroup) && isEmpty(oldgroup.ids)) {
		let oldgroupid = oldgroup.id;
		mRemove(iDiv(oldgroup));
		removeInPlace(DA.TJ, oldgroup);
		delete Items[oldgroupid];
	} else if (isdef(oldgroup)) { oldgroup.ov = .3222; resplay_container(oldgroup, .3222) }
}
function clear_quick_buttons() {
	if (isdef(DA.bQuick)) { DA.bQuick.remove(); delete DA.bQuick; }
}
function deck_deal_safe_fritz(fen, plname, n = 1) {
	if (fen.deck.length < n) {
		fen.deck = create_fen_deck('n', fen.num_decks, 0); 
		fen.loosecards.push('*Hn'); //1 jolly kommt dazu!
	}
	let new_cards = deck_deal(fen.deck, n);
	fen.players[plname].hand.push(...new_cards);
	new_cards.map(x => lookupAddToList(fen.players[plname], ['newcards'], x));
	return new_cards;
}
function drag(ev) { clear_quick_buttons(); ev.dataTransfer.setData("text", ev.target.id); }
function dragover_fritz(ev){
	ev.preventDefault();
	ev.dataTransfer.dropEffect = "move"; //macht so ein kleines kastel, 'copy' (default) macht ein kastel mit einem +
	let target_id = evToClosestId(ev);
	let d=mBy(target_id);
	mStyle(d,{bg:'red'});
	if (target_id == 'dOpenTable') {
	} else if (isdef(Items[target_id])) {
		let targetcard = Items[target_id];
		let targetgroup = Items[targetcard.groupid];
	} else {
	}
}
function drop_card_fritz(ev) {
	ev.preventDefault();
	evNoBubble(ev);
	if (isdef(mBy('ddhint'))) mRemove(mBy('ddhint')); //removes the text saying 'drag and drop cards here'
	var data = ev.dataTransfer.getData("text");
	let card = Items[data];
	let target_id = evToClosestId(ev);
	if (card.source == 'discard') {
		let [discard, loose] = arrSplitAtIndex(UI.deck_discard.items, card.index);
		c = loose[0];
		loose = loose.slice(1);
		assertion(c == card, 'NEEEEEEEE');
		for (const c of loose) {
			console.log('card', c.key, 'source', c.source)
			if (c.source == 'discard') frnew(c, { target: 'dummy' });
		}
	}
	if (target_id == 'dOpenTable') {
		frnew(card, ev);
	} else if (isdef(Items[target_id])) {
		let targetcard = Items[target_id];
		let targetgroup = Items[targetcard.groupid];
		fradd(card, targetgroup, targetcard);
	} else {
	}
}
function end_of_round_fritz(plname) {
	let [A, fen, uplayer, plorder] = [Z.A, Z.fen, Z.uplayer, Z.plorder];
	let pl = fen.players[uplayer];
	calc_fritz_score();
	ari_history_list([`${plname} wins the round`], 'round over');
	fen.round_winner = plname;
	plorder = fen.plorder = jsCopy(fen.roundorder); //restore fen.plorder to contain all players
	if (Z.round >= fen.maxrounds) {
		fen.winners = find_players_with_min_score();
		ari_history_list([`game over: ${fen.winners.join(', ')} win${fen.winners.length == 1 ? 's' : ''}`], 'game over');
		Z.stage = 'game_over';
		console.log('end of game: stage', Z.stage, '\nplorder', fen.plorder, '\nturn', Z.turn);
	} else {
		let starter = fen.starter = get_next_in_list(fen.starter, plorder);
		console.log('starter', starter);
		Z.turn = [starter];
		Z.round += 1;
		fritz_new_table(fen, Z.options);
		fritz_new_player_hands(fen, Z.turn[0], Z.options);
	}
}
function end_of_turn_fritz() {
	let [A, fen, uplayer, plorder] = [Z.A, Z.fen, Z.uplayer, Z.plorder];
	let pl = fen.players[uplayer];
	clear_quick_buttons();
	let ms = fen.players[uplayer].time_left = stop_timer();
	let ploose = {};
	fen.journeys = [];
	fen.loosecards = [];
	for (const plname in fen.players) { fen.players[plname].loosecards = []; }
	for (const group of DA.TJ) {
		let ch = arrChildren(iDiv(group));
		let cards = ch.map(x => Items[x.id]);
		let set = Z.options.overlapping == 'yes' ? is_overlapping_set(cards, Z.options.jokers_per_group, 3, false)
			: ferro_is_set(cards, Z.options.jokers_per_group, 3, false);
		if (!set) {
			for (const card of cards) {
				if (is_joker(card)) {
					fen.loosecards.push(card.key);
					continue;
				}
				let owner = valf(card.owner, uplayer);
				lookupAddToList(ploose, [owner], card.key);
			}
		} else {
			let j = set; //[];
			fen.journeys.push(j);
		}
	}
	for (const plname in ploose) {
		fen.players[plname].loosecards = ploose[plname];
	}
	let discard = UI.deck_discard.items.filter(x => x.source == 'discard');
	fen.deck_discard = discard.map(x => x.key);
	if (!isEmpty(A.selected)) {
		let ui_discarded_card = A.selected.map(x => A.items[x].o)[0];
		removeInPlace(UI.players[uplayer].hand.items, ui_discarded_card);
		ckey = ui_discarded_card.key;
		elem_from_to(ckey, fen.players[uplayer].hand, fen.deck_discard);
		ari_history_list([`${uplayer} discards ${ckey}`], 'discard');
	}
	let uihand = UI.players[uplayer].hand.items; //.filter(x => x.source == 'hand');
	let fenhand_vorher = fen.players[uplayer].hand;
	let fenhand = fen.players[uplayer].hand = uihand.filter(x => x.source == 'hand').map(x => x.key);
	if (isEmpty(fenhand) && isEmpty(fen.players[uplayer].loosecards)) {
		end_of_round_fritz(uplayer);
	} else if (ms <= 100) {
		console.log(`time is up for ${uplayer}!!!`);
		ari_history_list([`${uplayer} runs out of time`], 'timeout');
		if (fen.plorder.length <= 1) { end_of_round_fritz(uplayer); }
		else { Z.turn = [get_next_player(Z, uplayer)]; deck_deal_safe_fritz(fen, Z.turn[0]); removeInPlace(fen.plorder, uplayer); }
	} else { Z.turn = [get_next_player(Z, uplayer)]; deck_deal_safe_fritz(fen, Z.turn[0]); }
	take_turn_fen();
}
function fradd(card, targetgroup, targetcard) {
	let [oldgroup, oldindex] = untie_card(card);
	assertion(isdef(targetgroup.id), 'NO ID IN fradd!!!!!!!', targetgroup);
	add_card_to_group(card, oldgroup, oldindex, targetcard, targetgroup);
	if (targetgroup != oldgroup) cleanup_or_resplay(oldgroup);
}
function fritz() {
	const rankstr = 'A23456789TJQK*';
	function setup(players, options) {
		let fen = { players: {}, plorder: jsCopy(players), history: [], maxrounds: options.cycles * players.length };
		let n = players.length;
		fen.num_decks = 2 + (n >= 9 ? 2 : n >= 7 ? 1 : 0); //n == 2 ? 1 : 2 + (n > 5 ? Math.ceil((n - 5) / 2) : 0); //<=5?2:Math.max(2,Math.ceil(players.length/3));
		fritz_new_table(fen, options);
		let deck = fen.deck;
		shuffle(fen.plorder);
		let starter = fen.starter = fen.plorder[0];
		fen.roundorder = jsCopy(fen.plorder);
		let handsize = valf(Number(options.handsize), 11);
		for (const plname of players) {
			let pl = fen.players[plname] = {
				hand: deck_deal(deck, plname == starter ? handsize + 1 : handsize),
				loosecards: [],
				time_left: options.seconds_per_game * 1000, //seconds
				score: 0,
				name: plname,
				color: get_user_color(plname),
			};
		}
		[fen.phase, fen.stage, fen.turn] = ['', 'card_selection', [starter]];
		return fen;
	}
	function activate_ui() { fritz_activate_ui(); }
	function check_gameover() { return isdef(Z.fen.winners) ? Z.fen.winners : false; }
	function present(dParent) { fritz_present(dParent); }
	function stats(dParent) { fritz_stats(dParent); }
	function state_info(dParent) { fritz_state_info(dParent); }
	return { rankstr, setup, activate_ui, check_gameover, present, state_info, stats };
}
function fritz_activate_ui() {
	let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
	A.autosubmit = false;
	new_cards_animation(1);
	round_change_animation(1);
	select_add_items(ui_get_hand_items(uplayer), end_of_turn_fritz, 'must drag drop cards to assemble groups, then discard 1 hand card', 0, 1);
	A.items.map(x => iDiv(x).onclick = ev => {
		let card = Items[x.id];
		let item = x;
		clear_quick_buttons();
		select_last(item, select_toggle, ev);
		if (item.index == A.selected[0]) {
			let pos = get_mouse_pos(ev);
			let b = DA.bQuick = mButton('discard', ev => {
				b.remove();
				end_of_turn_fritz();
			}, document.body, { position: 'absolute', left: pos.x - 40, top: pos.y - 10 }, 'selectbutton');
		}
	});
	UI.timer = select_timer(fen.players[uplayer].time_left + Z.options.seconds_per_move * 1000, end_of_turn_fritz);
}
function fritz_card(ckey, h, w, ov, draggable) {
	let type = ckey[2];
	let info = ckey[0] == '*' ? get_joker_info() : jsCopy(C52Cards[ckey.substring(0, 2)]);
	info.key = ckey;
	info.cardtype = ckey[2]; //n,l,c=mini...
	let [r, s] = [info.rank, info.suit];
	info.val = r == '*' ? 25 : r == 'A' ? 1 : 'TJQK'.includes(r) ? 10 : Number(r);
	info.color = RED;
	info.sz = info.h = valf(h, Config.ui.card.h);
	info.w = valf(w, info.sz * .7);
	info.irank = '23456789TJQKA*'.indexOf(r);
	info.isuit = 'SHCDJ'.indexOf(s);
	info.isort = info.isuit * 14 + info.irank;
	let card = cardFromInfo(info, h, w, ov);
	card.id = iDiv(card).id = getUID('c');
	Items[card.id] = card;
	if (draggable && Z.role == 'active') mDraggable(card);
	return card;
}
function fritz_get_card(ckey, h, w, ov = .25) { return fritz_card(ckey, h, w, ov, true); }
function fritz_get_hint_card(ckey) { return fritz_card(ckey, 50, 30, .25, false); }
function fritz_new_player_hands(fen, starter, options) {
	let handsize = options.handsize;
	let deck = fen.deck;
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		pl.hand = deck_deal(deck, plname == starter ? handsize + 1 : handsize);
		pl.loosecards = [];
		pl.time_left = options.seconds_per_game * 1000; //seconds
		pl.roundchange = true;
		delete pl.handsorting;
		delete pl.newcards;
	}
}
function fritz_new_table(fen, options) {
	fen.deck = create_fen_deck('n', fen.num_decks, 0);
	fen.deck_discard = [];
	fen.journeys = [];
	fen.loosecards = arrRepeat(options.jokers, '*Hn'); // ['*Hn'];
	shuffle(fen.deck);
}
function fritz_present(dParent) {
	DA.hovergroup = null;
	let [fen, ui, uplayer, stage, pl] = [Z.fen, UI, Z.uplayer, Z.stage, Z.pl];
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent); mFlexWrap(dOpenTable)
	Config.ui.card.h = 130;
	Config.ui.container.h = Config.ui.card.h + 30;
	if (isEmpty(fen.deck_discard)) {
		mText('discard pile is empty!', dOpenTable);
		ui.deck_discard = { items: [] }
	} else {
		mText('discard pile:', dOpenTable);mLinebreak(dOpenTable);
		let deck_discard = ui.deck_discard = ui_type_hand(fen.deck_discard, dOpenTable, { maright: 25 }, 'deck_discard', null, fritz_get_card, true);
		let i = 0; deck_discard.items.map(x => { x.source = 'discard'; x.index = i++ });
	}
	mLinebreak(dOpenTable);
	mDiv(dOpenTable, { box:true,w:'100%' }, null, '<hr>');
	let ddarea = UI.ddarea = mDiv(dOpenTable, { border: 'dashed 1px black', bg: '#eeeeee80', box: true, hmin: 162, wmin: 245, padding: '5px 50px 5px 5px', margin: 5 });
	mDroppable(ddarea, drop_card_fritz, dragover_fritz); ddarea.id = 'dOpenTable'; Items[ddarea.id] = ddarea;
	mFlexWrap(ddarea)
	fritz_stats(dRechts);
	show_history(fen, dRechts);
	DA.TJ = [];
	for (const j of fen.journeys) {
		let cards = j.map(x => fritz_get_card(x));
		frnew(cards[0], { target: 'hallo' });
		for (let i = 1; i < cards.length; i++) { fradd(cards[i], Items[cards[0].groupid]); }
	}
	let loosecards = ui.loosecards = jsCopy(fen.loosecards).map(c => fritz_get_card(c));
	for (const plname of fen.plorder) {
		let cards = fen.players[plname].loosecards.map(c => fritz_get_card(c));
		cards.map(x => x.owner = plname);
		loosecards = loosecards.concat(cards);
	}
	for (const looseui of loosecards) {
		let card = looseui;
		frnew(card, { target: 'hallo' });
	}
	for (const group of DA.TJ) {
		assertion(isdef(group.id), 'no group id', group);
		let d = iDiv(group);
		let ch = arrChildren(iDiv(group));
		let cards = ch.map(x => Items[x.id]);
		cards.map(x => mDroppable(x, drop_card_fritz, dragover_fritz));
	}
	if (arrChildren(ddarea).length == 0) {
		let d = mDiv(ddarea, { 'pointer-events': 'none', maleft: 45, align: 'center', hmin: 40, w: '100%', fz: 12, fg: 'dimgray' }, 'ddhint', 'drag and drop cards here');
	}
	ui.players = {};
	let uname_plays = fen.plorder.includes(Z.uname);
	let plmain = uname_plays && Z.mode == 'multi' ? Z.uname : uplayer;
	fritz_present_player(plmain, dMiddle);
	if (TESTING) {
		for (const plname of arrMinus(fen.plorder, plmain)) {
			fritz_present_player(plname, dMiddle);
		}
	}
	show_handsorting_buttons_for(Z.mode == 'hotseat' ? Z.uplayer : Z.uname,{left: 58, bottom:-1});
}
function fritz_present_player(playername, dMiddle) {
	let [fen, ui, stage] = [Z.fen, UI, Z.stage];
	let pl = fen.players[playername];
	let playerstyles = { w: '100%', bg: '#ffffff80', fg: 'black', padding: 4, margin: 4, rounding: 10, border: `2px ${get_user_color(playername)} solid` };
	let d = mDiv(dMiddle, playerstyles, null, get_user_pic_html(playername, 25)); mFlexWrap(d); mLinebreak(d, 10);
	pl.hand = correct_handsorting(pl.hand,playername);
	let upl = ui.players[playername] = { div: d };
	upl.hand = ui_type_hand(pl.hand, d, {}, `players.${playername}.hand`, 'hand', fritz_get_card);
	upl.hand.items.map(x => x.source = 'hand');
	let ploose = pl.loosecards;
	if (!isEmpty(ploose)) {
		upl.loose = ui_type_market(ploose, d, {}, `players.${playername}.loose`, 'untouchables', fritz_get_hint_card);
		upl.loose.items.map(x => x.source = 'loose');
	} else {
	}
}
function fritz_state_info(dParent) {
	let user_html = get_user_pic_html(Z.uplayer, 30);
	dParent.innerHTML = `Round ${Z.round}:&nbsp;player: ${user_html} `;
}
function fritz_stats(dParent) {
	let player_stat_items = UI.player_stat_items = ui_player_info(dParent);
	let fen = Z.fen;
	console.log('players',get_keys(fen.players));
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		console.log('uname',plname);
		let item = player_stat_items[plname];
		let d = iDiv(item); mCenterFlex(d); mLinebreak(d);
		player_stat_count('hand with fingers splayed', calc_hand_value(pl.hand.concat(pl.loosecards), fritz_get_card), d);
		player_stat_count('star', pl.score, d);
		if (fen.turn.includes(plname)) { show_hourglass(plname, d, 30, { left: -3, top: 0 }); }
		else if (!fen.plorder.includes(plname)) mStyle(d, { opacity: 0.5 });
	}
}
function frnew(card, ev) {
	let [oldgroup, oldindex] = untie_card(card);
	let id = getUID('g');
	let d = mDiv(Items.dOpenTable, { display: 'grid', margin: 10 }, id); //, transition:'all * .5s' }, id);
	let targetgroup = { div: d, id: id, ids: [], ov: .5222 };
	assertion(isdef(DA.TJ), 'DA.TJ undefined in frnew!!!');
	DA.TJ.push(targetgroup);
	Items[id] = targetgroup;
	assertion(isdef(targetgroup.id), 'NO ID IN frnew!!!!!!!', targetgroup);
	add_card_to_group(card, oldgroup, oldindex, null, targetgroup);
	if (targetgroup != oldgroup) cleanup_or_resplay(oldgroup);
}
function output_loose_and_journeys(fen) {
	for (const j of fen.journeys) { console.log('journey', j.join(', ')); }
	for (const plname in fen.players) { console.log('loosecards', plname, fen.players[plname].loosecards.join(', ')); }
}
function output_scores() {
	let fen = Z.fen;
	for (const plname in fen.players) {
		let pl = fen.players[plname];
	}
}
function resplay_container(targetgroup, ovpercent) {
	let d = iDiv(targetgroup);
	let card = Items[targetgroup.ids[0]];
	let ov = valf(targetgroup.ov, .1222)
	mContainerSplay(d, 2, card.w, card.h, arrChildren(d).length, ov * card.w);
	let items = arrChildren(d).map(x => Items[x.id]);
	ui_add_cards_to_hand_container(d, items);
}
function untie_card(card) {
	remove_from_selection(card);
	clear_selection();
	let oldgroupid = card.groupid;
	if (isdef(oldgroupid)) delete card.owner;
	let oldgroup = Items[oldgroupid];
	let oldindex = isdef(oldgroup) ? oldgroup.ids.indexOf(card.id) : null;
	if (isdef(oldgroup)) removeInPlace(oldgroup.ids, card.id);
	return [oldgroup, oldindex]; // {oldindex:oldindex,oldgroup:oldgroup};
}
//#endregion fritz

//#region ferro
function calc_ferro_highest_goal_achieved(pl) {
	let jsorted = jsCopy(pl.journeys).sort((a, b) => b.length - a.length);
	let di = {
		'3': jsorted.length > 0 && is_group(jsorted[0]) && jsorted[0].length >= 3,
		'33': jsorted.length > 1 && is_group(jsorted[0]) && jsorted[0].length >= 3
			&& is_group(jsorted[1]) && jsorted[1].length >= 3,
		'4': jsorted.length > 0 && is_group(jsorted[0]) && jsorted[0].length >= 4,
		'44': jsorted.length > 1 && is_group(jsorted[0]) && jsorted[0].length >= 4
			&& is_group(jsorted[1]) && jsorted[1].length >= 4,
		'5': jsorted.length > 0 && is_group(jsorted[0]) && jsorted[0].length >= 5,
		'55': jsorted.length > 1 && is_group(jsorted[0]) && jsorted[0].length >= 5
			&& is_group(jsorted[1]) && jsorted[1].length >= 5,
		'7R': jsorted.length > 0 && is_sequence(jsorted[0]) && jsorted[0].length >= 7,
	};
	for (const k of Z.fen.availableGoals) { // ['7R', '55', '5', '44', '4', '33', '3']) {
		if (pl.goals[k]) {
			console.log('player', pl.name, 'already achieved goal', k);
			continue;
		}
		let achieved = di[k];
		if (achieved) {
			return k;
		}
	}
	return null;
}
function calc_ferro_score(roundwinner) {
	let [round, plorder, stage, A, fen, uplayer] = [Z.round, Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
	assertion(roundwinner == uplayer, '_calc_ferro_score: roundwinner != uplayer');
	for (const plname of plorder) {
		let pl = fen.players[plname];
		pl.newcards = [];
		if (nundef(pl.score)) pl.score = 0;
		if (uplayer == plname) pl.score -= round * 5;
		else pl.score += calc_hand_value(pl.hand);
	}
}
function deck_deal_safe_ferro(fen, plname, n) {
	if (fen.deck.length < n) {
		fen.deck = fen.deck.concat(fen.deck_discard.reverse());
		fen.deck_discard = [];
	}
	let new_cards = deck_deal(fen.deck, n);
	fen.players[plname].hand.push(...new_cards);
	new_cards.map(x => lookupAddToList(fen.players[plname], ['newcards'], x));
	return new_cards;
}
function end_of_round_ferro() {
	let [plorder, stage, A, fen, uplayer] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
	calc_ferro_score(uplayer);
	if (Z.options.phase_order == 'anti') {
		for (const plname of plorder) {
			let pl = fen.players[plname];
			if (!pl.roundgoal) pl.goals[get_round_goal()] = true;
		}
	}
	ari_history_list([`${uplayer} wins the round`], 'round');
	fen.round_winner = uplayer;
	[Z.stage, Z.turn] = ['round_end', [Z.host]]; //jsCopy(plorder)];
	take_turn_fen();
}
function ferro() {
	const rankstr = '23456789TJQKA*';
	function setup(players, options) {
		let fen = { players: {}, plorder: jsCopy(players), history: [] };
		options.jokers_per_group = 1;
		fen.allGoals = ['7R', '55', '5', '44', '4', '33', '3'];
		fen.availableGoals = options.maxrounds == 1 ? [rChoose(fen.allGoals)] : options.maxrounds < 7 ? rChoose(fen.allGoals, options.maxrounds) : fen.allGoals;
		fen.availableGoals.sort((a, b) => fen.allGoals.indexOf(a) - fen.allGoals.indexOf(b)); //sorted most difficult first
		fen.roundGoals = arrReverse(fen.availableGoals); //sorted easiest first!
		let n = players.length;
		let num_decks = fen.num_decks = 2 + (n >= 9 ? 2 : n >= 7 ? 1 : 0); // 2 + (n > 5 ? Math.ceil((n - 5) / 2) : 0); //<=5?2:Math.max(2,Math.ceil(players.length/3));
		let deck = fen.deck = create_fen_deck('n', num_decks, 4 * num_decks);
		let deck_discard = fen.deck_discard = [];
		shuffle(deck);
		if (DA.TESTING != true) { shuffle(fen.plorder);shuffle(fen.plorder); } //shuffletest(fen.plorder);		}
		let starter = fen.plorder[0];
		let handsize = valf(Number(options.handsize), 11);
		for (const plname of players) {
			let pl = fen.players[plname] = {
				hand: deck_deal(deck, plname == starter ? handsize + 1 : handsize),
				journeys: [],
				roundgoal: false,
				coins: options.coins, //0, //10,
				vps: 0,
				score: 0,
				name: plname,
				color: get_user_color(plname),
			};
			pl.goals = {};
			for (const g of fen.availableGoals) { pl.goals[g] = 0; }//console.log('g',g);  { 3: 0, 33: 0, 4: 0, 44: 0, 5: 0, 55: 0, '7R': 0 };
		}
		fen.phase = ''; //TODO: king !!!!!!!
		[fen.stage, fen.turn] = ['card_selection', [starter]];
		return fen;
	}
	function activate_ui() { ferro_activate_ui(); }
	function check_gameover() { return isdef(Z.fen.winners) ? Z.fen.winners : false; }
	function clear_ack() {
		if (Z.stage == 'round_end') { start_new_round_ferro(); take_turn_fen(); }
		else if (Z.stage != 'card_selection') {
			for (const plname of Z.fen.canbuy) {
				let pldata = firstCond(Z.playerdata, x => x.name == plname);
				if (isdef(pldata) && lookup(pldata, ['state', 'buy']) == true) {
					Z.fen.buyer = plname;
					break;
				}
			}
			Z.stage = 'can_resolve';
			ferro_change_to_card_selection();
		}
	}
	function present(dParent) { ferro_present(dParent); }
	function stats(dParent) { ferro_stats(dParent); }
	function state_info(dParent) { ferro_state(dParent); }
	return { rankstr, setup, activate_ui, check_gameover, clear_ack, present, state_info, stats };
}
function ferro_ack_uplayer() { if (Z.mode == 'multi') { ferro_ack_uplayer_multi(); } else { ferro_ack_uplayer_hotseat(); } }
function ferro_ack_uplayer_hotseat() {
	let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
	let buy = !isEmpty(A.selected) && A.selected[0] == 0;
	if (buy || uplayer == fen.lastplayer) { fen.buyer = uplayer;[Z.turn, Z.stage] = [[get_multi_trigger()], 'can_resolve']; }
	else { Z.turn = [get_next_in_list(uplayer, fen.canbuy)]; }
	take_turn_fen();
}
function ferro_ack_uplayer_multi() {
	let [A, uplayer] = [Z.A, Z.uplayer];
	stopPolling();
	let o_pldata = Z.playerdata.find(x => x.name == uplayer);
	Z.state = o_pldata.state = { buy: !isEmpty(A.selected) && A.selected[0] == 0 };
	let can_resolve = ferro_check_resolve();
	if (can_resolve) {
		assertion(Z.stage == 'buy_or_pass', 'stage is not buy_or_pass when checking can_resolve!');
		Z.stage = 'can_resolve';
		[Z.turn, Z.stage] = [[get_multi_trigger()], 'can_resolve'];
		take_turn_fen_write();
	} else { take_turn_multi(); }
}
function ferro_activate_ui() { ferro_pre_action(); }
function ferro_change_to_buy_pass() {
	let [plorder, stage, A, fen, uplayer] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
	let nextplayer = get_next_player(Z, uplayer); //player after buy_or_pass round
	let newturn = jsCopy(plorder); while (newturn[0] != nextplayer) { newturn = arrCycle(newturn, 1); } //console.log('newturn', newturn);
	fen.canbuy = newturn.filter(x => x != uplayer && fen.players[x].coins > 0); //fen.canbuy list ist angeordnet nach reihenfolge der frage
	fen.trigger = uplayer; //NEIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!get_admin_player(fen.plorder); // uplayer;
	fen.buyer = null;
	fen.nextturn = [nextplayer];
	if (isEmpty(fen.canbuy)) { Z.stage = 'can_resolve'; ferro_change_to_card_selection(); return; }
	else if (Z.mode == 'multi') { [Z.stage, Z.turn] = ['buy_or_pass', fen.canbuy]; fen.keeppolling = true; take_turn_fen_clear(); }
	else {
		fen.canbuy.map(x => fen.players[x].buy = 'unset');
		fen.lastplayer = arrLast(fen.canbuy);
		[Z.stage, Z.turn] = ['buy_or_pass', [fen.canbuy[0]]];
		take_turn_fen();
	}
}
function ferro_change_to_card_selection() {
	let [fen, stage] = [Z.fen, Z.stage];
	assertion(stage != 'card_selection', "ALREADY IN TURN ROUND!!!!!!!!!!!!!!!!!!!!!!");
	assertion(stage == 'can_resolve', "change to card_selection: NOT IN can_resolve stage!!!!!!!!!!!!!!!!!!!!!!");
	assertion(Z.uplayer == 'mimi' || Z.uplayer == fen.trigger, "mixup uplayer in change_to_card_selection!!!!!!!!!!!!!!!!!!!!!!");
	if (isdef(fen.buyer)) {
		let plname = fen.buyer;
		let pl = fen.players[plname];
		let card = fen.deck_discard.shift();
		pl.hand.push(card);
		lookupAddToList(pl, ['newcards'], card);
		deck_deal_safe_ferro(fen, plname, 1);
		pl.coins -= 1; //pay
		ari_history_list([`${plname} bought ${card}`], 'buy');
	}
	let nextplayer = fen.nextturn[0];
	deck_deal_safe_ferro(fen, nextplayer, 1);
	Z.turn = fen.nextturn;
	Z.stage = 'card_selection';
	for (const k of ['buyer', 'canbuy', 'nextturn', 'trigger', 'lastplayer']) delete fen[k];//cleanup buy_or_pass multi-turn!!!!!!!!!!!!!
	delete fen.keeppolling;
	clear_transaction();
	take_turn_fen();
}
function ferro_check_resolve() {
	let [pldata, stage, A, fen, plorder, uplayer, deck, turn] = [Z.playerdata, Z.stage, Z.A, Z.fen, Z.plorder, Z.uplayer, Z.deck, Z.turn];
	let pl = fen.players[uplayer];
	assertion(stage == 'buy_or_pass', "check_resolve NOT IN buy_or_pass stage!!!!!!!!!");
	assertion(isdef(pldata), "no playerdata in buy_or_pass stage!!!!!!!!!!!!!!!!!!!!!!!");
	let done = true;
	for (const plname of turn) {
		let data = firstCond(pldata, x => x.name == plname);
		assertion(isdef(data), 'no pldata for', plname);
		let state = data.state;
		if (isEmpty(state)) done = false;
		else if (state.buy == true) fen.buyer = plname;
		else continue;
		break;
	}
	return done;
}
function ferro_is_set(cards, max_jollies_allowed = 1, seqlen = 7, group_same_suit_allowed = true) {
	if (cards.length < 3) return false;
	let num_jollies_in_cards = cards.filter(x => is_joker(x)).length;
	if (num_jollies_in_cards > max_jollies_allowed) return false;
	cards = sortCardItemsByRank(cards.map(x => x), rankstr = '23456789TJQKA*');
	let rank = cards[0].rank;
	let isgroup = cards.every(x => x.rank == rank || is_joker(x));
	let suits = cards.filter(x => !is_joker(x)).map(x => x.suit);
	let num_duplicate_suits = suits.filter(x => suits.filter(y => y == x).length > 1).length;
	if (isgroup && !group_same_suit_allowed && num_duplicate_suits > 0) return false;
	else if (isgroup) return cards.map(x => x.key);
	let suit = cards[0].suit;
	if (!cards.every(x => is_jolly(x.key) || x.suit == suit)) return false;
	let keys = cards.map(x => x.key);
	if (keys.length != new Set(keys).size) return false;
	let at_most_jollies = Math.min(num_jollies_in_cards, max_jollies_allowed);
	let num_jolly = sortCardItemsToSequence(cards, rankstr = '23456789TJQKA', at_most_jollies);
	let cond1 = num_jolly <= at_most_jollies; //this sequence does not need more jollies than it should
	let cond2 = cards.length >= seqlen; //console.log('cond2', cond2);
	if (cond1 && cond2) return cards.map(x => x.key); else return false;
}
function ferro_pre_action() {
	let [stage, A, fen, plorder, uplayer, deck] = [Z.stage, Z.A, Z.fen, Z.plorder, Z.uplayer, Z.deck];
	switch (stage) {
		case 'can_resolve': if (Z.options.auto_weiter) ferro_change_to_card_selection(); else { select_add_items(ui_get_string_items(['weiter']), ferro_change_to_card_selection, 'may click to continue', 1, 1, Z.mode == 'multi'); select_timer(2000, ferro_change_to_card_selection); } break;
		case 'buy_or_pass': if (!is_playerdata_set(uplayer)) { select_add_items(ui_get_buy_or_pass_items(), ferro_ack_uplayer, 'may click discard pile to buy or pass', 1, 1); if (uplayer != 'nasi') select_timer(Z.options.thinking_time * 1000, ferro_ack_uplayer); } break;
		case 'card_selection': select_add_items(ui_get_ferro_items(uplayer), fp_card_selection, 'must select one or more cards', 1, 100); break;
		default: console.log('stage is', stage); break;
	}
}
function ferro_present(dParent) {
	if (DA.simulate == true) show('bRestartMove'); else hide('bRestartMove'); //console.log('DA', DA);
	let [fen, ui, uplayer, stage, pl] = [Z.fen, UI, Z.uplayer, Z.stage, Z.pl];
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent);
	ferro_stats(dRechts);
	show_history(fen, dRechts);
	let deck = ui.deck = ui_type_deck(fen.deck, dOpenTable, { maleft: 12 }, 'deck', 'deck', ferro_get_card);
	let deck_discard = ui.deck_discard = ui_type_deck(fen.deck_discard, dOpenTable, { maleft: 12 }, 'deck_discard', '', ferro_get_card);
	if (!isEmpty(deck_discard.items)) face_up(deck_discard.get_topcard());
	order = get_present_order();
	for (const plname of order) {
		let pl = fen.players[plname];
		let playerstyles = { w: '100%', bg: '#ffffff80', fg: 'black', padding: 4, margin: 4, rounding: 10, border: `2px ${get_user_color(plname)} solid` };
		let d = mDiv(dMiddle, playerstyles, null, get_user_pic_html(plname, 25));
		mFlexWrap(d);
		mLinebreak(d, 10);
		let hidden = compute_hidden(plname);
		ferro_present_player(plname, d, hidden);
	}
	Z.isWaiting = false;
	if (Z.stage == 'round_end') {
		show_waiting_for_ack_message();
		if (Z.role=='active' || i_am_host()) {
			show('bClearAck');
		}
	} else if (Z.stage == 'buy_or_pass' && uplayer == fen.trigger && ferro_check_resolve()) {
		assertion(Z.stage == 'buy_or_pass', 'stage is not buy_or_pass when checking can_resolve!');
		Z.stage = 'can_resolve';
		[Z.turn, Z.stage] = [[get_multi_trigger()], 'can_resolve'];
		take_turn_fen(); return;
	} else if (Z.stage == 'buy_or_pass' && (Z.role != 'active' || is_playerdata_set(uplayer))) {
		assertion(isdef(Z.playerdata), 'playerdata is not defined in buy_or_pass (present ferro)');
		let pl_not_done = Z.playerdata.filter(x => Z.turn.includes(x.name) && isEmpty(x.state)).map(x => x.name);
		show_waiting_message(`waiting for possible buy decision...`);
		Z.isWaiting = true;
	}
	show_handsorting_buttons_for(Z.mode == 'hotseat' ? Z.uplayer : Z.uname, { bottom: -2 });
	new_cards_animation();
}
function ferro_present_player(plname, d, ishidden = false) {
	let fen = Z.fen;
	let pl = fen.players[plname];
	let ui = UI.players[plname] = { div: d };
	Config.ui.card.h = ishidden ? 100 : 150;
	Config.ui.container.h = Config.ui.card.h + 30;
	if (!ishidden) pl.hand = correct_handsorting(pl.hand, plname);
	let hand = ui.hand = ui_type_hand(pl.hand, d, {}, `players.${plname}.hand`, 'hand', ferro_get_card);
	if (ishidden) { hand.items.map(x => face_down(x)); }
	ui.journeys = [];
	let i = 0;
	for (const j of pl.journeys) {
		let jui = ui_type_lead_hand(j, d, { maleft: 12, h: 130 }, `players.${plname}.journeys.${i}`, '', ferro_get_card);//list, dParent, path, title, get_card_func
		i += 1;
		ui.journeys.push(jui);
	}
}
function ferro_process_discard() {
	let [plorder, stage, A, fen, uplayer] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
	let pl = fen.players[uplayer];
	if (!isEmpty(pl.journeys) && !pl.roundgoal) {
		let goal = is_fixed_goal() ? get_round_goal() : calc_ferro_highest_goal_achieved(pl);
		pl.roundgoal = goal;
		pl.goals[goal] = true;
		ari_history_list([`${pl.name} achieved goal ${pl.roundgoal}`], 'achieve');
	}
	let c = A.selectedCards[0].key;
	elem_from_to_top(c, fen.players[uplayer].hand, fen.deck_discard);
	ari_history_list([`${uplayer} discards ${c}`], 'discard');
	if (fen.players[uplayer].hand.length == 0) { end_of_round_ferro(); } else ferro_change_to_buy_pass(); //ferro_change_to_ack_round();
}
function ferro_process_jolly(key, j) {
	let [plorder, stage, A, fen, uplayer] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
	let a = key;
	let b = j.find(x => x[0] == '*');
	arrReplace1(fen.players[uplayer].hand, a, b);
	replace_jolly(key, j);
	ari_history_list([`${uplayer} replaces for jolly`], 'jolly');
	Z.stage = 'card_selection';
}
function ferro_process_set(keys) {
	let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
	if (is_group(keys)) {
		keys = sort_cards(keys, true, 'CDSH', true, '23456789TJQKA*');
	}
	let j = [];
	keys.map(x => elem_from_to(x, fen.players[uplayer].hand, j));
	fen.players[uplayer].journeys.push(j);
	ari_history_list([`${uplayer} reveals ${j.join(', ')}`], 'auflegen');
	Z.stage = 'card_selection';
}
function ferro_state(dParent) {
	if (DA.TEST0 == true) {
		let html = `${Z.stage}`;
		if (isdef(Z.playerdata)) {
			let trigger = get_multi_trigger();
			if (trigger) html += ` trigger:${trigger}`;
			for (const data of Z.playerdata) {
				if (data.name == trigger) continue;
				let name = data.name;
				let state = data.state;
				let s_state = object2string(state);
				html += ` ${name}:'${s_state}'`; // (${typeof state})`;
			}
			dParent.innerHTML += ` ${Z.playerdata.map(x => x.name)}`;
		}
		dParent.innerHTML = html;
		return;
	}
	if (Z.stage == 'round_end') {
		dParent.innerHTML = `Round ${Z.round} ended by &nbsp;${get_user_pic_html(Z.fen.round_winner, 30)}`;
	} else if (is_fixed_goal()) {
		let goal = get_round_goal();
		console.log('goal', goal);
		let goal_html = `<div style="font-weight:bold;border-radius:50%;background:white;color:red;line-height:100%;padding:4px 8px">${goal}</div>`;
		dParent.innerHTML = `Round ${Z.round}:&nbsp;&nbsp;minimum:&nbsp;${goal_html}`;
	} else {
		let user_html = get_user_pic_html(Z.stage == 'buy_or_pass' ? Z.fen.nextturn[0] : Z.turn[0], 30);
		dParent.innerHTML = `Round ${Z.round}:&nbsp;${Z.stage == 'buy_or_pass' ? 'next ' : ''}turn: ${user_html} `;
	}
}
function ferro_stats(dParent) {
	let player_stat_items = UI.player_stat_items = ui_player_info(dParent);
	let fen = Z.fen;
	for (const plname in fen.players) {
		let pl = fen.players[plname];
		let item = player_stat_items[plname];
		let d = iDiv(item); mCenterFlex(d); mStyle(d, { wmin: 150 }); mLinebreak(d);
		player_stat_count('coin', pl.coins, d);
		player_stat_count('pinching hand', pl.hand.length, d);
		if (!compute_hidden(plname)) player_stat_count('hand with fingers splayed', calc_hand_value(pl.hand), d);
		player_stat_count('star', pl.score, d);
		mLinebreak(d, 4);
		if (!is_fixed_goal()) {
			let d2 = mDiv(d, { padding: 4, display: 'flex' }, `d_${plname}_goals`);
			if (fen.availableGoals.length < 4) { mStyle(d2, { wmin: 120 }); mCenterFlex(d2); }
			let sz = 16;
			let styles_done = { h: sz, fz: sz, maleft: 6, fg: 'grey', 'text-decoration': 'line-through green', weight: 'bold' };
			let styles_todo = { h: sz, fz: sz, maleft: 6, border: 'red', weight: 'bold', padding: 4, 'line-height': sz }; // 'text-decoration': 'underline red', 
			for (const k of fen.roundGoals) { //in pl.goals) {
				mText(k, d2, pl.goals[k] ? styles_done : styles_todo);
			}
		}
		if (fen.turn.includes(plname)) { show_hourglass(plname, d, 30, { left: -3, top: 0 }); }
	}
}
function ferro_transaction_error() {
	let d = mDiv(dError, { padding: 10, align: 'center' }, null, `Illegal turn sequence - transaction cannot be completed!!!<br>press reload and try again!<br>`);
	mButton('RELOAD', onclick_reload, d, { margin: 10 });
	clear_transaction();
}
function find_players_with_max_score() {
	let [plorder, stage, A, fen, uplayer] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
	let maxscore = -Infinity;
	let maxscorepls = [];
	for (const plname of plorder) {
		let pl = fen.players[plname];
		if (pl.score > maxscore) { maxscore = pl.score; maxscorepls = [plname]; }
		else if (pl.score == maxscore) maxscorepls.push(plname);
	}
	return maxscorepls;
}
function find_players_with_min_score() {
	let [plorder, stage, A, fen, uplayer] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
	let minscore = Infinity;
	let minscorepls = [];
	for (const plname of plorder) {
		let pl = fen.players[plname];
		if (pl.score < minscore) { minscore = pl.score; minscorepls = [plname]; }
		else if (pl.score == minscore) minscorepls.push(plname);
	}
	return minscorepls;
}
function fp_card_selection() {
	let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
	let selitems = A.selectedCards = A.selected.map(x => A.items[x]);
	let cards = selitems.map(x => x.o);
	let cmd = A.last_selected.key;
	if (cmd == 'discard') {
		if (selitems.length != 1) { select_error('select exactly 1 hand card to discard!'); return; }
		let item = selitems[0];
		if (!item.path.includes(`${uplayer}.hand`)) { select_error('select a hand card to discard!', () => { ari_make_unselected(item); A.selected = []; }); return; }
		assertion(DA.transactionlist.length == 0 || DA.simulate, '!!!!!!!!!!!!!!!!transactionlist is not empty!');
		if (DA.transactionlist.length > 0) {
			console.log('VERIFYING TRANSACTION............')
			let legal = verify_min_req();
			clear_transaction();
			if (legal) {
				ferro_process_discard(); //discard selected card
			} else {
				ferro_transaction_error();
			}
		} else {
			ferro_process_discard(); //discard selected card
		}
	} else if (cmd == 'jolly') {
		if (selitems.length != 2) { select_error('select a hand card and the jolly you want!'); return; }
		let handcard = selitems.find(x => !is_joker(x.o) && x.path.includes(`${uplayer}.hand`));
		let jolly = selitems.find(x => is_joker(x.o) && !x.path.includes(`${uplayer}.hand`));
		if (!isdef(handcard) || !isdef(jolly)) { select_error('select a hand card and the jolly you want!'); return; }
		let key = handcard.key;
		let j = path2fen(fen, jolly.path);
		if (!jolly_matches(key, j)) { select_error('your card does not match jolly!'); return; }
		if (pl.journeys.length == 0) { add_transaction(cmd); }
		ferro_process_jolly(key, j);
		take_turn_fen();
	} else if (cmd == 'auflegen') {
		if (selitems.length < 3) { select_error('select cards to form a group!'); return; }
		else if (pl.hand.length == selitems.length) { select_error('you need to keep a card for discard!!', clear_selection); return; }
		let newset = ferro_is_set(cards, Z.options.jokers_per_group);
		if (!newset) { select_error('this is NOT a valid set!'); return; }
		let is_illegal = is_correct_group_illegal(cards);
		if (is_illegal) { select_error(is_illegal); return; }
		if (pl.journeys.length == 0) { add_transaction(cmd); }
		let keys = newset; //cards.map(x => x.key);
		ferro_process_set(keys);
		take_turn_fen();
	} else if (cmd == 'anlegen') {
		if (selitems.length < 1) { select_error('select at least 1 hand card and the first card of a group!'); return; }
		else if (pl.hand.length == selitems.length - 1) { select_error('you need to keep a card for discard!!', clear_selection); return; }
		let handcards = selitems.filter(x => !is_joker(x.o) && x.path.includes(`${uplayer}.hand`));
		let groupcard = selitems.find(x => !is_joker(x.o) && !x.path.includes(`${uplayer}.hand`));
		if (isEmpty(handcards) || !isdef(groupcard)) { select_error('select 1 or more hand cards and the first card of a group!'); return; }
		let hand_rank = handcards[0].key[0];
		let handcards_same_rank = handcards.every(x => x.key[0] == hand_rank);
		let j = path2fen(fen, groupcard.path);
		if (is_group(j)) {
			if (!handcards_same_rank) { select_error('all hand cards must have the same rank!'); return; }
			let group_rank = groupcard.key[0];
			if (group_rank == hand_rank) {
				for (const h of handcards) {
					elem_from_to(h.key, fen.players[uplayer].hand, j);
				}
				if (pl.journeys.length == 0) { add_transaction(cmd); }
				take_turn_fen();
				return;
			} else {
				select_error('hand cards do not match the group!');
				return;
			}
		} else { //its a sequence!
			let suit = get_sequence_suit(j);
			let handkeys = handcards.map(x => x.key); //console.log('suit',suit,'keys', keys);
			if (firstCond(handkeys, x => x[1] != suit)) { select_error('hand card suit does not match the group!'); return; }
			let ij = j.findIndex(x => is_jolly(x));
			let j_has_jolly = ij > -1;
			let rank_to_be_relaced_by_jolly = j_has_jolly ? find_jolly_rank(j) : null;
			let r = rank_to_be_relaced_by_jolly;
			if (r) {
				j[ij] = r + suit + 'n';
			}
			keys = handkeys.concat(j);
			let allcards = keys.map(x => ferro_get_card(x)); // handcards.concat(j.map(x=>ferro_get_card(x)));
			let jneeded = sortCardItemsToSequence(allcards, undefined, 0);
			if (jneeded == 0) {
				let seq = allcards.map(x => x.key);
				if (r) { arrReplace1(seq, r + suit + 'n', '*Hn'); }
				j.length = 0;
				j.push(...seq);
				for (const k of handkeys) { removeInPlace(fen.players[uplayer].hand, k); }
				if (pl.journeys.length == 0) { add_transaction(cmd); }
				take_turn_fen();
			} else {
				if (r != null) { j[ij] = '*Hn'; }
				select_error('hand cards cannot be added to sequence!');
				return;
			}
		}
	}
}
function get_available_goals(plname) {
	return Z.fen.availableGoals.filter(x => !Z.fen.players[plname].goals[x]);
}
function get_round_goal() { return Z.fen.roundGoals[Z.round - 1]; } //get_keys(Z.fen.players[Z.uplayer].goals).sort()[Z.round - 1]; }
function is_correct_group(j, n = 3) { let r = j[0][0]; return j.length >= n && has_at_most_n_jolly(j, Z.options.jokers_per_group) && j.every(x => is_jolly(x) || x[0] == r); }
function is_correct_group_illegal(cards) {
	let keys = cards.map(x => x.key);
	let isgroup = is_group(keys);
	if (isgroup) return false;
	if (is_fixed_goal() && get_round_goal() != '7R') {
		return `the goal for this round is ${get_round_goal()}!`;
	}
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	let pl = fen.players[uplayer];
	if (!is_fixed_goal() && pl.goals['7R'] == true) return `you can only have one sequence of 7!`;
	if (pl.journeys.find(x => is_sequence(x))) return `you can only have one sequence of 7!`;
	if (pl.roundgoal) return `row of 7 NOT allowed except if it is the round goal!`;
	return false;
}
function is_fixed_goal() { return Z.options.phase_order == 'fixed'; }
function is_group(j) {
	if (j.length < 3) return false;
	let rank = firstCond(j, x => !is_jolly(x))[0];
	return j.every(x => is_jolly(x) || x[0] == rank);
}
function is_sequence(j) { return !is_group(j); }
function length_of_each_array(arr) {
	let res = []
	for (const a of arr) {
		res.push(a.length);
	}
	return res.sort((a, b) => b - a);
}
function longest_array(arr) {
	let max = 0;
	for (const a of arr) {
		if (a.length > max) max = a.length;
	}
	return max;
}
function onclick_clear_selection_ferro() { clear_selection(); }
function start_new_round_ferro() {
	let [plorder, stage, A, fen, uplayer] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
	let pl = fen.players[uplayer];
	Z.stage = 'card_selection';
	fen.plorder = arrCycle(plorder, 1);
	let starter = fen.plorder[0];
	Z.turn = fen.turn = [starter];
	let deck = fen.deck = create_fen_deck('n', fen.num_decks, fen.num_decks * 4);
	let deck_discard = fen.deck_discard = [];
	shuffle(deck);
	let handsize = valf(Number(Z.options.handsize), 11);
	for (const plname of fen.plorder) {
		let pl = fen.players[plname];
		pl.hand = deck_deal(deck, plname == starter ? handsize + 1 : handsize);
		pl.journeys = [];
		pl.roundgoal = false;
		pl.roundchange = true;
		delete pl.handsorting;
	}
	Z.round += 1;
	if (Z.round > Z.options.maxrounds) {
		ari_history_list([`game over`], 'game');
		Z.stage = 'game_over';
		fen.winners = find_players_with_min_score();
	}
}
function ui_get_buy_or_pass_items() {
	let items = [], i = 0;
	if (!isEmpty(UI.deck_discard.items)) items.push(ui_get_deck_item(UI.deck_discard));
	items = items.concat(ui_get_string_items(['pass']));
	reindex_items(items);
	return items;
}
function ui_get_ferro_items() {
	let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
	let items = ui_get_hand_items(uplayer);	//hand items
	for (const plname of plorder) {
		let jlist = UI.players[plname].journeys;
		for (const jitem of jlist) {
			for (const o of jitem.items) {
				if (!is_joker(o)) { continue; }
				let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: jitem.path, index: 0 };
				items.push(item);
			}
		}
	}
	for (const plname of plorder) {
		let jlist = UI.players[plname].journeys;
		for (const jitem of jlist) {
			let o = jitem.items[0]; // lead card
			let item = { o: o, a: o.key, key: o.key, friendly: o.short, path: jitem.path, index: 0 };
			items.push(item);
		}
	}
	let cmds = ui_get_submit_items(['discard', 'auflegen', 'jolly', 'anlegen']);
	items = items.concat(cmds);
	reindex_items(items);
	return items;
}
function ui_get_submit_items(commands) {
	let items = [], i = 0;
	for (const cmd of commands) { //just strings!
		let item = { o: null, a: cmd, key: cmd, friendly: cmd, path: null, index: i, submit_on_click: true, itemtype: 'submit' };
		i++;
		items.push(item);
	}
	return items;
}
function verify_min_req() {
	let [fen, uplayer] = [Z.fen, Z.uplayer];
	let pl = fen.players[uplayer];
	let jsorted = jsCopy(pl.journeys).sort((a, b) => b.length - a.length);
	let di = {
		'3': jsorted.length > 0 && is_group(jsorted[0]) && jsorted[0].length >= 3,
		'33': jsorted.length > 1 && is_group(jsorted[0]) && jsorted[0].length >= 3
			&& is_group(jsorted[1]) && jsorted[1].length >= 3,
		'4': jsorted.length > 0 && is_group(jsorted[0]) && jsorted[0].length >= 4,
		'44': jsorted.length > 1 && is_group(jsorted[0]) && jsorted[0].length >= 4
			&& is_group(jsorted[1]) && jsorted[1].length >= 4,
		'5': jsorted.length > 0 && is_group(jsorted[0]) && jsorted[0].length >= 5,
		'55': jsorted.length > 1 && is_group(jsorted[0]) && jsorted[0].length >= 5
			&& is_group(jsorted[1]) && jsorted[1].length >= 5,
		'7R': jsorted.length > 0 && is_sequence(jsorted[0]) && jsorted[0].length >= 7,
	};
	let goals = is_fixed_goal() ? [get_round_goal()] : get_available_goals(uplayer);
	for (const g of goals) {
		if (di[g] == true) { return true; } //console.log('achieved',g);
	}
	return false;
}
//#endregion ferro

//#region spotit
function cal_num_syms_adaptive() {
	let [uplayer, fen] = [Z.uplayer, Z.fen];
	let pl = fen.players[uplayer];
	pl.score = get_player_score(pl.name);
	let by_score = dict2list(fen.players);
	for (const pl of by_score) { pl.score = get_player_score(pl.name); }
	let avg_score = 0;
	for (const pl of by_score) { avg_score += pl.score; }
	avg_score /= by_score.length;
	let di = { nasi: -3, gul: -3, sheeba: -2, mimi: -1, annabel: 1 };
	let baseline = valf(di[uplayer], 0);
	let dn = baseline + Math.floor(pl.score - avg_score);
	let n = Z.options.num_symbols;
	let nfinal = Math.max(4, Math.min(14, dn + n));
	return nfinal;
}
function calc_syms(numSyms) {
	let n = numSyms, rows, realrows, colarr;
	if (n == 3) { rows = 2; realrows = 1; colarr = [1, 2]; }
	else if (n == 4) { rows = 2; realrows = 2; colarr = [2, 2]; }
	else if (n == 5) { rows = 3; realrows = 3; colarr = [1, 3, 1]; }
	else if (n == 6) { rows = 3.3; realrows = 3; colarr = [2, 3, 1]; }
	else if (n == 7) { rows = 3; realrows = 3; colarr = [2, 3, 2]; } //default
	else if (n == 8) { rows = 3.8; realrows = 4; colarr = [1, 3, 3, 1]; }
	else if (n == 9) { rows = 4; realrows = 4; colarr = [2, 3, 3, 1]; }
	else if (n == 10) { rows = 4; realrows = 4; colarr = [2, 3, 3, 2]; }
	else if (n == 11) { rows = 4.5; realrows = 4; colarr = [2, 3, 4, 2]; }
	else if (n == 12) { rows = 5; realrows = 5; colarr = [1, 3, 4, 3, 1]; }
	else if (n == 13) { rows = 5; realrows = 5; colarr = [2, 3, 4, 3, 1]; }
	else if (n == 14) { rows = 5; realrows = 5; colarr = [2, 3, 4, 3, 2]; }
	else if (n == 15) { rows = 5.5; realrows = 5; colarr = [2, 3, 5, 3, 2]; }
	else if (n == 16) { rows = 5.5; realrows = 5; colarr = [2, 3, 5, 4, 2]; }
	else if (n == 17) { rows = 5.5; realrows = 5; colarr = [2, 4, 5, 4, 2]; } //17
	else if (n == 18) { rows = 5.8; realrows = 5; colarr = [2, 4, 5, 4, 3]; } //18
	return [rows, realrows, colarr];
}
function ensure_score(plname) {
	let sc = 0;
	if (isdef(Z.playerdata)) {
		let pldata = valf(firstCond(Z.playerdata, x => x.name == plname), { name: plname, state: { score: 0 } });
		sc = isdef(pldata.state)?pldata.state.score:0;
	} else Z.playerdata = Z.plorder.map(x=>[{name:x,state:{score:0}}]);
	lookupSet(Z.fen, ['players', plname, 'score'], sc);
}
function find_shared_keys(keylist, keylists) {
	let shared = [];
	for (const keylist2 of keylists) {
		for (const key of keylist) {
			if (keylist2.includes(key)) {
				shared.push(key);
			}
		}
	}
	return shared;
}
function get_player_score(plname) { ensure_score(plname); return Z.fen.players[plname].score; }
function inc_player_score(plname) { ensure_score(plname); return Z.fen.players[plname].score += 1; }
function modify_item_for_adaptive(item, items, n) {
	item.numSyms = n;
	[item.rows, item.cols, item.colarr] = calc_syms(item.numSyms);
	let other_items = items.filter(x => x != item);
	let shared_syms = find_shared_keys(item.keys, other_items.map(x => x.keys));
	let other_symbols = item.keys.filter(x => !shared_syms.includes(x));
	item.keys = shared_syms;
	let num_missing = item.numSyms - item.keys.length;
	item.keys = item.keys.concat(rChoose(other_symbols, num_missing));
	shuffle(item.keys);
	item.scales = item.keys.map(x => rChoose([1, .75, 1.2, .9, .8]));
}
function spotit() {
	function setup(players, options) {
		let fen = { players: {}, plorder: jsCopy(players), turn: [players[0]], stage: 'init', phase: '' };
		for (const plname of players) {
			fen.players[plname] = {
				score: 0, name: plname, color: get_user_color(plname),
			};
		}
		fen.items = spotit_item_fen(options);
		if (nundef(options.mode)) options.mode = 'multi';
		return fen;
	}
	function check_gameover() {
		for (const uname of Z.plorder) {
			let cond = get_player_score(uname) >= Z.options.winning_score;
			if (cond) { Z.fen.winners = [uname]; return Z.fen.winners; }
		}
		return false;
	}
	function state_info(dParent) { spotit_state(dParent); }
	function present(dParent) { spotit_present(dParent); }
	function stats(dParent) { spotit_stats(dParent); }
	function activate_ui() { spotit_activate(); }
	return { setup, activate_ui, check_gameover, present, state_info, stats };
}
function spotit_activate() {
	let [stage, uplayer, host, plorder, fen] = [Z.stage, Z.uplayer, Z.host, Z.plorder, Z.fen];
	if (stage == 'move' && uplayer == host && get_player_score(host) >= 1) {
		let bots = plorder.filter(x => fen.players[x].playmode == 'bot');
		if (isEmpty(bots)) return;
		let bot = rChoose(bots);
		TO.main = setTimeout(() => spotit_move(bot, true), rNumber(2000, 9000));
	}
}
function spotit_card(info, dParent, cardStyles, onClickSym) {
	Card.sz = 300;
	copyKeys({ w: Card.sz, h: Card.sz }, cardStyles);
	let card = cRound(dParent, cardStyles, info.id);
	addKeys(info, card);
	card.faceUp = true;
	let zipped = [];
	for (let i = 0; i < card.keys.length; i++) {
		zipped.push({ key: card.keys[i], scale: card.scales[i] });
	}
	card.pattern = fillColarr(card.colarr, zipped);
	let symStyles = { sz: Card.sz / (card.rows + 1), fg: 'random', hmargin: 10, vmargin: 6, cursor: 'pointer' };
	let syms = [];
	mRowsX(iDiv(card), card.pattern, symStyles, { 'justify-content': 'center' }, { 'justify-content': 'center' }, syms);
	for (let i = 0; i < info.keys.length; i++) {
		let key = card.keys[i];
		let sym = syms[i];
		card.live[key] = sym;
		sym.setAttribute('key', key);
		sym.onclick = ev => onClickSym(ev, key); //ev, sym, key, card);
	}
	return card;
}
function spotit_create_sample(numCards, numSyms, vocab, lang, min_scale, max_scale) {
	lang = valf(lang, 'E');
	let [rows, cols, colarr] = calc_syms(numSyms);
	let perCard = arrSum(colarr);
	let nShared = (numCards * (numCards - 1)) / 2;
	let nUnique = perCard - numCards + 1;
	let numKeysNeeded = nShared + numCards * nUnique;
	let nMin = numKeysNeeded + 3;
	let keypool = setKeys({ nMin: nMin, lang: valf(lang, 'E'), key: valf(vocab, 'animals'), keySets: KeySets, filterFunc: (_, x) => !x.includes(' ') });
	let keys = choose(keypool, numKeysNeeded);
	let dupls = keys.slice(0, nShared); //these keys are shared: cards 1 and 2 share the first one, 1 and 3 the second one,...
	let uniqs = keys.slice(nShared);
	let infos = [];
	for (let i = 0; i < numCards; i++) {
		let keylist = uniqs.slice(i * nUnique, (i + 1) * nUnique);
		let info = { id: getUID(), shares: {}, keys: keylist, rows: rows, cols: cols, colarr: colarr, num_syms: perCard };
		infos.push(info);
	}
	let iShared = 0;
	for (let i = 0; i < numCards; i++) {
		for (let j = i + 1; j < numCards; j++) {
			let c1 = infos[i];
			let c2 = infos[j];
			let dupl = dupls[iShared++];
			c1.keys.push(dupl);
			c1.shares[c2.id] = dupl;
			c2.shares[c1.id] = dupl;
			c2.keys.push(dupl);
		}
	}
	for (const info of infos) { shuffle(info.keys); }
	for (const info of infos) {
		info.scales = info.keys.map(x => chooseRandom([.5, .75, 1, 1.2]));
	}
	for (const info of infos) {
		let zipped = [];
		for (let i = 0; i < info.keys.length; i++) {
			zipped.push({ key: info.keys[i], scale: info.scales[i] });
		}
		info.pattern = fillColarr(info.colarr, zipped);
	}
	return infos;
}
function spotit_find_shared(card, keyClicked) {
	let success = false, othercard = null;
	for (const c of Z.cards) {
		if (c == card) continue;
		if (c.keys.includes(keyClicked)) { success = true; othercard = c; }
	}
	return [success, othercard];
}
function spotit_interact(ev, key) {
	ev.cancelBubble = true;
	if (!uiActivated) { console.log('ui NOT activated'); return; }
	let keyClicked = evToProp(ev, 'key');
	let id = evToId(ev);
	if (isdef(keyClicked) && isdef(Items[id])) {
		let item = Items[id];
		let dsym = ev.target;
		let card = Items[id];
		let [success, othercard] = spotit_find_shared(card, keyClicked);
		spotit_move(Z.uplayer, success);
	}
}
function spotit_item_fen(options) {
	let o = {
		num_cards: valf(options.num_cards, 2),
		num_symbols: options.adaptive == 'yes' ? 14 : valf(options.num_symbols, 7),
		vocab: valf(options.vocab, 'lifePlus'),
		lang: 'E',
		min_scale: valf(options.min_scale, 0.75),
		max_scale: valf(options.max_scale, 1.25),
	};
	let items = spotit_create_sample(o.num_cards, o.num_symbols, o.vocab, o.lang, o.min_scale, o.max_scale);
	let item_fens = [];
	for (const item of items) {
		let arr = arrFlatten(item.pattern);
		let ifen = arr.map(x => `${x.key}:${x.scale}`).join(' ');
		item_fens.push(ifen);
	}
	let res = item_fens.join(',');
	return res;
}
function spotit_move(uplayer, success) {
	if (success) {
		inc_player_score(uplayer);
		assertion(get_player_score(uplayer) >= 1, 'player score should be >= 1');
		Z.fen.items = spotit_item_fen(Z.options);
		Z.state = { score: get_player_score(uplayer) };
		take_turn_spotit();
	} else {
		let d = mShield(dTable, { bg: '#000000aa', fg: 'red', fz: 60, align: 'center' });
		d.innerHTML = 'NOPE!!! try again!';
		TO.spotit_penalty = setTimeout(() => d.remove(), 2000);
	}
}
function spotit_present(dParent) {
	let [fen, ui, stage, uplayer] = [Z.fen, UI, Z.stage, Z.uplayer];
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent, 1, 0); ///tableLayoutOMR(dParent, 5, 1);
	spotit_read_all_scores();
	let dt = dOpenTable; clearElement(dt); mCenterFlex(dt);
	spotit_stats(dt);
	mLinebreak(dt, 10);
	let ks_for_cards = fen.items.split(',');
	let numCards = ks_for_cards.length;
	let items = Z.items = [];
	Items = [];
	let i = 0;
	for (const s of ks_for_cards) {
		let ks_list = s.split(' ');
		let item = {};
		item.keys = ks_list.map(x => stringBefore(x, ':'));
		item.scales = ks_list.map(x => stringAfter(x, ':')).map(x => Number(x));
		item.index = i; i++;
		let n = item.numSyms = item.keys.length;
		let [rows, cols, colarr] = calc_syms(item.numSyms);
		item.colarr = colarr;
		item.rows = rows;
		items.push(item);
	}
	Z.cards = [];
	let is_adaptive = Z.options.adaptive == 'yes';
	let nsyms = is_adaptive ? cal_num_syms_adaptive() : Z.options.num_symbols;
	for (const item of items) {
		if (is_adaptive) { modify_item_for_adaptive(item, items, nsyms); }
		let card = spotit_card(item, dt, { margin: 20, padding: 10 }, spotit_interact);
		Z.cards.push(card);
		if (Z.stage == 'init') {
			face_down(card, GREEN, 'food');
		}
	}
	mLinebreak(dt, 10);
}
function spotit_read_all_scores() {
	if (nundef(Z.playerdata)) {
		Z.playerdata = [];
		for (const pl in Z.fen.players) {
			Z.playerdata.push({
				name: pl,
				state: { score: 0 },
			});
		}
	}
	for (const pldata of Z.playerdata) {
		let plname = pldata.name;
		let state = pldata.state;
		let score = !isEmpty(state) ? state.score : 0;
		let fenscore = lookupSet(Z.fen, ['players', plname, 'score'], score);
		Z.fen.players[plname].score = Math.max(fenscore, score);
	}
}
function spotit_state(dParent) {
	let user_html = get_user_pic_html(Z.uplayer, 30);
	let msg = Z.stage == 'init' ? `getting ready...` : `player: ${user_html}`;
	dParent.innerHTML = `Round ${Z.round}:&nbsp;${msg} `;
}
function spotit_stats(d) {
	let players = Z.fen.players;
	let d1 = mDiv(d, { display: 'flex', 'justify-content': 'center', 'align-items': 'space-evenly' });
	for (const plname of get_present_order()) {
		let pl = players[plname];
		let onturn = Z.turn.includes(plname);
		let sz = 50; //onturn?100:50;
		let bcolor = plname == Z.uplayer ? 'lime' : 'silver';
		let border = pl.playmode == 'bot' ? `double 5px ${bcolor}` : `solid 5px ${bcolor}`;
		let rounding = pl.playmode == 'bot' ? '0px' : '50%';
		let d2 = mDiv(d1, { margin: 4, align: 'center' }, null, `<img src='../base/assets/images/${plname}.jpg' style="border-radius:${rounding};display:block;border:${border};box-sizing:border-box" class='img_person' width=${sz} height=${sz}>${get_player_score(plname)}`);
	}
}
//#endregion spotit

//#region wise
function wise() {
	function state_info(dParent) { return; }//dParent.innerHTML = `stage: ${Z.stage}`; }
	function setup(players, options) {
		let fen = { players: {}, plorder: jsCopy(players), history: [], num: options.num };
		let starter = fen.starter = fen.plorder[0];
		Sayings = shuffle(Sayings);
		fen.index = 0;
		fen.saying = Sayings[fen.index];
		for (const plname of players) {
			let pl = fen.players[plname] = {
				score: 0,
				name: plname,
				color: get_user_color(plname),
			};
		}
		[fen.phase, fen.stage, fen.step, fen.turn] = ['one', 'write', 0, jsCopy(fen.plorder)];
		return fen;
	}
	function check_gameover() {
		let winners = [];
		for (const plname of Z.plorder) {
			let cond = get_player_score(plname) >= Z.options.winning_score;
			if (cond) { winners.push(plname); }
		}
		if (!isEmpty(winners)) Z.fen.winners = winners;
		return isEmpty(winners)?false:Z.fen.winners;
	}
	function post_collect() { agmove_resolve(); } //console.log('YEAH!!!! post_collect',Z); ag_post_collect(); }
	return { post_collect, state_info, setup, present: wise_present, check_gameover, activate_ui: wise_activate };
}
function wise_activate() {
	let [pldata, stage, A, fen, phase, uplayer] = [Z.playerdata, Z.stage, Z.A, Z.fen, Z.phase, Z.uplayer];
	let donelist = Z.playerdata.filter(x => isDict(x.state));
	let complete = donelist.length == Z.plorder.length;
	let resolvable = uplayer == fen.starter && complete;
	let waiting = !resolvable && isdef(donelist.find(x => x.name == uplayer));
	console.log(uplayer, stage, 'done', donelist, 'complete', complete, 'waiting', waiting);
	Z.isWaiting = false;
	if (waiting) {
		mDiv(dTable, {}, null, 'WAITING FOR PLAYERS TO COMPLETE....');
		if (complete) {
			Z.turn = [fen.starter];
			if (Z.mode != 'multi') take_turn_waiting();
		}
		Z.isWaiting = true;
		autopoll();
	} else if (stage == 'write' && resolvable) {
		assertion(uplayer == fen.starter, 'NOT THE STARTER WHO COMPLETES THE STAGE!!!')
		let start = fen.saying.start.toLowerCase();
		let sentences = [];
		for (const pldata of Z.playerdata) {
			let plname = pldata.name;
			let text = start + ' ' + pldata.state.text;
			sentences.push({ plname: plname, text: text.toLowerCase() });
		}
		sentences.push({ plname: '', text: start + ' ' + fen.saying.end.toLowerCase() });
		fen.sentences = shuffle(sentences);
		Z.turn = jsCopy(Z.plorder);
		Z.stage = 'select';
		take_turn_fen_clear();
	} else if (stage == 'write') {
		let d = mCreate('form');
		let dt = dTable;
		mAppend(dt, d);
		d.autocomplete = "off";
		d.action = "javascript:void(0);";
		mDiv(d, { fz: 20 }, 'dForm', fen.saying.start.toLowerCase() + '...');
		Z.form = d;
		mLinebreak(d, 10);
		mInput(d, { wmin: 600 }, 'i_end', 'enter ending');
		d.onsubmit = wise_submit_text;
	} else if (stage == 'select' && resolvable) {
		assertion(uplayer == fen.starter, 'NOT THE STARTER WHO COMPLETES THE STAGE!!!')
		let d = mDiv(dTable, {});
		fen.result = {};
		for (const pldata of Z.playerdata) {
			let selecting = pldata.name;
			let selected = pldata.state.plname;
			let text = pldata.state.text;
			if (isEmpty(selected)) { //} || selected === null || !selected || nundef(selected)){ // nundef(selected)) {
				console.log('REINGEGANGEN!!!!!!!!!!!!!!')
				fen.players[selecting].score += 1;
				selected = 'correct';
			} else if (selecting != selected) {
				fen.players[selected].score += 1;
			}
			fen.result[selecting] = { plname: selected, text: text };
		}
		delete fen.sentences;
		Z.turn = jsCopy(Z.plorder);
		Z.stage = 'round';
		take_turn_fen_clear();
	} else if (stage == 'select') {
		let d = mDiv(dTable, {});
		let i = 1;
		for (const s of fen.sentences) {
			let d1 = mDiv(d, { fz: 20, hline: 30 }, `dsent_${s.plname}`, '' + (i++) + ') ' + s.text, 'hop1');
			d1.onclick = wise_select_sentence;
		}
	} else if (stage == 'round' && resolvable) {
		assertion(uplayer == fen.starter, 'NOT THE STARTER WHO COMPLETES THE STAGE!!!')
		delete fen.result;
		Z.turn = jsCopy(Z.plorder);
		fen.index++;
		fen.saying = Sayings[fen.index];
		Z.stage = 'write';
		take_turn_fen_clear();
	} else if (stage == 'round') {
		let d = mDiv(dTable, {});
		for (const plname in fen.result) {
			let o = fen.result[plname];
			let d1 = mDiv(d, { fz: 20, hline: 30 }, null, `${plname} selected ${o.plname}: ${o.text}`);
		}
		mLinebreak(dTable, 12)
		mButton('WEITER', wise_onclick_weiter, dTable, {}, ['donebutton', 'enabled']);
	}else{
		console.log('Z',Z)
		alert('PROBLEM!!!')
	}
}
function wise_onclick_weiter() {
	Z.state = { plname: Z.uplayer };
	take_turn_multi();
}
function wise_present(dParent) {
	let [fen, ui, stage, uplayer] = [Z.fen, UI, Z.stage, Z.uplayer];
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent, 1, 0); ///tableLayoutOMR(dParent, 5, 1);
	let dt = dTable = dOpenTable; clearElement(dt); mCenterFlex(dt);
	wise_stats(dt);
	mLinebreak(dt, 10);
}
function wise_select_sentence(ev) {
	if (!uiActivated) return;
	let text = ev.target.innerHTML;
	let plname = stringAfter(ev.target.id, 'dsent_')
	Z.state = { plname: plname, text: text };
	take_turn_multi();
}
function wise_stats(d) {
	let players = Z.fen.players;
	let d1 = mDiv(d, { display: 'flex', 'justify-content': 'center', 'align-items': 'space-evenly' });
	for (const plname of get_present_order()) {
		let pl = players[plname];
		let onturn = Z.turn.includes(plname);
		let sz = 50; //onturn?100:50;
		let bcolor = plname == Z.uplayer ? 'lime' : 'silver';
		let border = pl.playmode == 'bot' ? `double 5px ${bcolor}` : `solid 5px ${bcolor}`;
		let rounding = pl.playmode == 'bot' ? '0px' : '50%';
		let d2 = mDiv(d1, { margin: 4, align: 'center' }, null, `<img src='../base/assets/images/${plname}.jpg' style="border-radius:${rounding};display:block;border:${border};box-sizing:border-box" class='img_person' width=${sz} height=${sz}>${get_player_score(plname)}`);
	}
}
function wise_submit_text(ev) { ev.preventDefault(); let text = mBy('i_end').value; Z.state = { text: text }; take_turn_multi(); }
//#endregion wise

