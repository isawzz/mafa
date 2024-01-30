var dNav;
var Session = {};
var Clientdata = {};
const BLUE = '#4363d8';
const config = {
  src: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png',
  rows: 15,
  cols: 7
}
const DD = {
  yellow: 'gelb', green: 'grün', blue: 'blau', red: 'rot', pink: 'rosa', orange: 'orange', black: 'schwarz',
  white: 'weiss', violet: 'violett', '1st': 'erste', '2nd': 'zweite', '3rd': 'dritte', '4th': 'vierte', '5th': 'fünfte',
  add: 'addiere', subtract: 'subtrahiere', multiply: 'mutipliziere', plus: 'plus', minus: 'minus', times: 'mal',
  'divided by': 'dividiert durch', excellent: 'sehr gut', very: 'sehr', good: 'gut',
  'to the previous number': 'zur vorhergehenden zahl',
  'from the previous number': 'von der vorhergehenden zahl',
  'multiply the previous number by': 'multipliziere die vorhergehende zahl mit',
  'divide the previous number by': 'dividiere die vorhergehende zahl durch',
  'the previous number': 'die vorhergehende zahl', is: 'ist', what: 'was', equals: 'ist gleich', enter: "tippe",
  'to the power of': 'hoch', or: 'oder', less: 'kleiner', greater: 'grösser', than: 'als', equal: 'gleich', and: 'und',
  not: 'nicht', click: 'click', press: 'tippe', quite: 'ziemlich', 'not quite': 'nicht ganz',
  say: 'sage', write: 'schreibe', complete: 'ergänze', 'unequal': 'ungleich', except: 'ausser', EXCEPT: 'AUSSER',
  number: 'Zahl', color: 'farbe', eliminate: 'eliminiere', all: 'alle', with: 'mit', true: 'wahr', false: 'falsch',
  build: 'bilde', count: 'zähle', 'the red dots': 'die roten Punkte',
};
const GREEN = '#3cb44b';
const BLUEGREEN = '#004054';
const img = document.createElement('img')
const names = ['felix', 'amanda', 'sabine', 'tom', 'taka', 'microbe', 'dwight', 'jim', 'michael', 'pam', 'kevin', 'darryl', 'lauren', 'anuj', 'david', 'holly'];
const ORANGE = '#f58231';
const playerColors = {
  red: '#D01013',
  blue: '#003399',
  green: '#58A813',
  orange: '#FF6600',
  yellow: '#FAD302',
  violet: '#55038C',
  pink: '#ED527A',
  beige: '#D99559',
  sky: '#049DD9',
  brown: '#A65F46',
  white: '#FFFFFF',
};
const PlayerColors = {
  red: '#D01013',
  blue: '#003399',
  green: '#58A813',
  orange: '#FF6600',
  yellow: '#FAD302',
  violet: '#55038C',
  pink: '#ED527A',
  beige: '#D99559',
  sky: '#049DD9',
  brown: '#A65F46',
  white: '#FFFFFF',
  lightblue: '#42d4f4',
  lightgreen: '#afff45',
};
const ColorDict = {
  black: { c: 'black', E: 'black', D: 'schwarz' },
  blue: { c: 'blue', E: 'blue', D: 'blau' },
  BLUE: { c: '#4363d8', E: 'blue', D: 'blau' },
  BLUEGREEN: { c: BLUEGREEN, E: 'bluegreen', D: 'blaugrün' },
  blue1: { c: BLUE, E: 'blue', D: 'blau' },
  BRAUN: { c: BRAUN, E: 'brown', D: 'braun' },
  BROWN: { c: BROWN, E: 'brown', D: 'braun' },
  brown: { c: BRAUN, E: 'brown', D: 'braun' },
  deepyellow: { c: YELLOW3, E: 'yellow', D: 'gelb' },
  FIREBRICK: { c: '#800000', E: 'darkred', D: 'rotbraun' },
  gold: { c: 'gold', E: 'gold', D: 'golden' },
  green: { c: 'green', E: 'green', D: 'grün' },
  GREEN: { c: '#3cb44b', E: 'green', D: 'grün' },
  green1: { c: GREEN, E: 'green', D: 'grün' },
  grey: { c: 'grey', E: 'grey', D: 'grau' },
  lightblue: { c: LIGHTBLUE, E: 'lightblue', D: 'hellblau' },
  LIGHTBLUE: { c: '#42d4f4', E: 'lightblue', D: 'hellblau' },
  lightgreen: { c: LIGHTGREEN, E: 'lightgreen', D: 'hellgrün' },
  LIGHTGREEN: { c: '#afff45', E: 'lightgreen', D: 'hellgrün' },
  lightyellow: { c: YELLOW2, E: 'lightyellow', D: 'gelb' },
  olive: { c: OLIVE, E: 'olive', D: 'oliv' },
  OLIVE: { c: '#808000', E: 'olive', D: 'oliv' },
  orange: { c: ORANGE, E: 'orange', D: 'orange' },
  ORANGE: { c: '#f58231', E: 'orange', D: 'orange' },
  pink: { c: 'deeppink', E: 'pink', D: 'rosa' },
  purple: { c: PURPLE, E: 'purple', D: 'lila' },
  PURPLE: { c: '#911eb4', E: 'purple', D: 'lila' },
  red: { c: 'red', E: 'red', D: 'rot' },
  RED: { c: '#e6194B', E: 'red', D: 'rot' },
  red1: { c: RED, E: 'red', D: 'rot' },
  skyblue: { c: 'deepskyblue', E: 'skyblue', D: 'himmelblau' },
  teal: { c: TEAL, E: 'teal', D: 'blaugrün' },
  TEAL: { c: '#469990', E: 'teal', D: 'blaugrün' },
  violet: { c: 'indigo', E: 'violet', D: 'violett' },
  white: { c: 'white', E: 'white', D: 'weiss' },
  yellow: { c: 'yellow', E: 'yellow', D: 'gelb' },
  YELLOW: { c: '#ffe119', E: 'yellow', D: 'gelb' },
  YELLOW2: { c: YELLOW2, E: 'yellow', D: 'gelb' },
  YELLOW3: { c: YELLOW3, E: 'yellow', D: 'gelb' },
};
var A;
var AD;
var App;
var B = {};
var C = null;
var ColorDi;
var ColorNames;
var DA = {};
var DB;
var dBottom;
var dButtons;
var dInstruction;
var dLeft;
var dMain;
var dMenu;
var dMessage;
var dOben;
var dPage;
var dParent;
var dRechts;
var dRight;
var dTitle;
var dTop;
var EC = {};
var ET = {};
var F;
var G = null;
var GAME = 'ttt';
var I;
var iColor;
var Info;
var Items = {};
var lineWidth = 4;
var M = {};
var P;
var PI = Math.pi, interval_id, angle, factor = .67, tree = [], leaves = [], jittering = false;
var PL;
var Players;
var Q;
var R;
var S = {};
var sData;
var Selected;
var Serverdata = {};
var Socket = null;
var SPEC = null;
var Step = 0;
var T;
var Table;
var Tables;
var TO = {};
var Toolbar;
var Turn;
var U = null;
var UI = {};
var UID = 0;
var User;
var V = {};
var WR = {};
var Z;
class Agent {
  constructor(home, speed, zackig, aussehen, startpos) {
    this.home = home;
    this.isMap = is_map(home);
    console.log('is_map?', this.isMap);
    this.pos = isdef(startpos) ? startpos : this.isMap ? home.options.center : null;
    this.speed = speed;
    this.rGen = zackig ? rFloat : rGaussian;
    this.ui = create_agent(home, aussehen);
    if (isdef(startpos)) this.moveto(startpos);
  }
  moveto(coords) {
    if (this.isMap) map_moveto(this.ui, coords); else mPos(this.ui, coords[0], coords[1]);
    this.pos = coords;
  }
  movefor(secs) {
    let f = x => x + this.rGen(-this.speed, this.speed);
    run_for_seconds(secs, () => { map_moveby(this.ui, f, f); })
  }
  move() {
    let f = x => x + rGen(-speed, speed);
    this.interval = setInterval(() => map_moveby(this.ui, f, f), 50);
  }
  stop_moving() { clearInterval(this.interval); }
}
class Game {
  constructor(name, o) {
    this.name = name;
    copyKeys(o, this);
    this.maxLevel = isdef(this.levels) ? Object.keys(this.levels).length - 1 : 0;
    this.id = name;
    this.color = getColorDictColor(this.color);
  }
  clear() { clearTimeout(this.TO); clearFleetingMessage(); }
  startGame() { }
  start_Level() {
    this.keys = setKeysG(this, filterWordByLengthG, 25);
    console.assert(nundef(this.numPics) || this.keys.length >= this.numPics, 'WAAAAAAAAAAAS? nMin in setKeys nicht richtig!!!!! ' + this.numPics + ' ' + this.keys.length)
  }
  startRound() { }
  prompt() {
    myShowPics(this.controller.evaluate.bind(this.controller));
    setGoal();
    show_instruction(`click <b>${Goal.label.toUpperCase()}</b>`, dTitle, `click ${Goal.label}`);
    this.controller.activateUi.bind(this.controller)();
  }
  trialPrompt() {
    sayTryAgain();
    if (this.showHint) shortHintPic();
    return 10;
  }
  activate() { }
  interact() { }
  eval(ev) {
    ev.cancelBubble = true;
    let item = findItemFromEvent(Pictures, ev);
    Selected = { pic: item, feedbackUI: iDiv(item), sz: getRect(iDiv(item)).h };
    Selected.reqAnswer = Goal.label;
    Selected.answer = item.label;
    if (item.label == Goal.label) { return true; } else { return false; }
  }
}
class Player {
  constructor(id, color) {
    this.id = id;
    this.color = getColorDictColor(color);
  }
}