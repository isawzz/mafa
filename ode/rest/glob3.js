const ANIM={};
var Session = {};
var Clientdata = {};
const allPeeps = []
const availablePeeps = []
const BLUE = '#4363d8';
const BRAUN = '#331606';
const BROWN = '#96613d';
const ColorList = ['lightgreen', 'lightblue', 'yellow', 'red', 'green', 'blue', 'purple', 'violet', 'lightyellow', 'teal', 'orange', 'brown', 'olive', 'deepskyblue', 'deeppink', 'gold', 'black', 'white', 'grey'];
const CORNERS = ['◢', '◣', '◤', '◥'];
const crowd = []
const DEF_ORIENTATION = 'v';
const DEF_SPLIT = 0.5;
const FIREBRICK = '#800000';
const GREEN = '#3cb44b';
const BLUEGREEN = '#004054';
const img = document.createElement('img')
const LIGHTBLUE = '#42d4f4';
const LIGHTGREEN = '#afff45';
const MarkerId = { SUCCESS: 0, FAIL: 1 };
const MarkerText = ['✔️', '❌'];
const MyNames = ['amanda', 'angela', 'erin', 'holly', 'jan', 'karen', 'kelly', 'pam', 'phyllis', 'andy', 'creed', 'darryl', 'david', 'dwight', 'felix', 'gul', 'jim', 'kevin', 'luis', 'michael', 'nil', 'oscar', 'ryan', 'stanley', 'toby', 'wolfgang'];
const names = ['felix', 'amanda', 'sabine', 'tom', 'taka', 'microbe', 'dwight', 'jim', 'michael', 'pam', 'kevin', 'darryl', 'lauren', 'anuj', 'david', 'holly'];
const OLIVE = '#808000';
const ORANGE = '#f58231';
const NEONORANGE = '#ff6700';
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
const PURPLE = '#911eb4';
const RED = '#e6194B';
const stage = {
  width: 0,
  height: 0,
}
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
const STYLE_PARAMS = {
  acontent: 'align-content',
  aitems: 'align-items',
  align: 'text-align',
  aspectRatio: 'aspect-ratio',
  bg: 'background-color',
  dir: 'flex-direction',
  family: 'font-family',
  fg: 'color',
  fontSize: 'font-size',
  fz: 'font-size',
  gridCols: 'grid-template-columns',
  gridRows: 'grid-template-rows',
  h: 'height',
  hgap: 'column-gap',
  hmin: 'min-height',
  hmax: 'max-height',
  hline: 'line-height',
  jcontent: 'justify-content',
  jitems: 'justify-items',
  justify: 'justify-content',
  matop: 'margin-top',
  maleft: 'margin-left',
  mabottom: 'margin-bottom',
  maright: 'margin-right',
  origin: 'transform-origin',
  overx: 'overflow-x',
  overy: 'overflow-y',
  patop: 'padding-top',
  paleft: 'padding-left',
  pabottom: 'padding-bottom',
  paright: 'padding-right',
  place: 'place-items',
  rounding: 'border-radius',
  valign: 'align-items',
  vgap: 'row-gap',
  w: 'width',
  wmin: 'min-width',
  wmax: 'max-width',
  weight: 'font-weight',
  x: 'left',
  xover: 'overflow-x',
  y: 'top',
  yover: 'overflow-y',
  z: 'z-index'
};
const TEAL = '#469990';
const walks = ['normalWalk']
const YELLOW = '#ffe119';
const NEONYELLOW = '#efff04';
const YELLOW2 = '#fff620';
const levelColors = [LIGHTGREEN, LIGHTBLUE, YELLOW, 'orange', RED, GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue',
  'deeppink', TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE,
  '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'deeppink',
  'palegreen', '#e6194B'];
const YELLOW3 = '#ffed01';
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
var _audioSources = {
  incorrect1: '../base/assets/sounds/incorrect1.wav',
  incorrect3: '../base/assets/sounds/incorrect3.mp3',
  goodBye: "../base/assets/sounds/level1.wav",
  down: "../base/assets/sounds/down.mp3",
  levelComplete: "../base/assets/sounds/sound1.wav",
  rubberBand: "../base/assets/sounds/sound2.wav",
  hit: "../base/assets/sounds/hit.wav",
  mozart: "../base/assets/music/mozart_s39_4.mp3",
};
var _idleSound = true;
var _qSound;
var _sndPlayer;
var activatedTests = [];
var ADS;
var aiActivated;
var Animation1;
var AREAS = {};
var auxOpen;
var Badges = [];
var BlockServerSend1 = false;
var ByGroupSubgroup;
var c52;
var C52;
var C52Cards;
var Categories;
var Cinno;
var ColorDi;
var ColorNames;
var Config;
var coorsField = {
  "type": "Feature",
  "properties": {
    "popupContent": "Coors Field"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-104.99404191970824, 39.756213909328125]
  }
};
var Counter = { server: 0 };
var CURRENT_CHAT_USER = "";
var CURRENT_GAME = "";
var currentGame = IS_TESTING ? 'gTouchPic' : 'sequence';
var currentLanguage = 'E';
var currentLevel;
var DELAY = 1000;
var Dictionary;
var draggedElement;
var dragStartOffset;
var dropPosition = 'none';
var dynSpec;
var FenPositionList;
var FORCE_REDRAW = false;
var freeBus = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-105.00341892242432, 39.75383843460583],
          [-105.0008225440979, 39.751891803969535]
        ]
      },
      "properties": {
        "popupContent": "This is a free bus line that will take you across downtown.",
        "underConstruction": false
      },
      "id": 1
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-105.0008225440979, 39.751891803969535],
          [-104.99820470809937, 39.74979664004068]
        ]
      },
      "properties": {
        "popupContent": "This is a free bus line that will take you across downtown.",
        "underConstruction": true
      },
      "id": 2
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-104.99820470809937, 39.74979664004068],
          [-104.98689651489258, 39.741052354709055]
        ]
      },
      "properties": {
        "popupContent": "This is a free bus line that will take you across downtown.",
        "underConstruction": false
      },
      "id": 3
    }
  ]
};
var FRUIDCounter = -1;
var FUNCTIONS = {
  instanceof: 'instanceOf',
  prop: (o, v) => isdef(o[v]),
  no_prop: (o, v) => nundef(o[v]),
  no_spec: (o, v) => false,
}
var GAME = 'ttt';
var gameSequence = IS_TESTING ? ['gSayPicAuto', 'gTouchPic', 'gTouchColors', 'gWritePic', 'gMissingLetter', 'gSayPic'] : ['gSayPic', 'gTouchColors', 'gWritePic'];
var Goal;
var INFO = {};
var Info;
var IS_TESTING = true;
var IsAnswerCorrect;
var IsControlKeyDown = false;
var Items = {};
var KeySets;
var lastPosition = 0;
var LevelChange = true;
var levelKeys = ['island', 'justice star', 'materials science', 'mayan pyramid', 'medieval gate', 'great pyramid', 'meeple', 'smart', 'stone tower', 'trophy cup', 'viking helmet',
  'flower star', 'island', 'justice star', 'materials science', 'mayan pyramid',];
var MAGNIFIER_IMAGE;
var Markers = [];
var MAXLEVEL = 10;
var nMissing;
var OnTimeOver = null;
var Options = {};
var percentageCorrect;
var Pictures = [];
var Players;
var PolyClips = {
  hex: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  test1: 'inset(50% 0% 100% 25% 100% 75% 50% 100% 0% 75% 0% 25% round 10px)',
  test0: 'inset(45% 0% 33% 10% round 10px)',
  hexagon: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  hexF: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  hexFlat: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  hexflat: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  rect: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  sq: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  square: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  tri: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  triangle: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  triUp: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  triup: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  triDown: 'polygon(0% 0%, 100% 0%, 50% 100%)',
  tridown: 'polygon(0% 0%, 100% 0%, 50% 100%)',
  triright: 'polygon(0% 0%, 100% 50%, 0% 100%)',
  triRight: 'polygon(0% 0%, 100% 50%, 0% 100%)',
  trileft: 'polygon(0% 50%, 100% 0%, 100% 100%)',
  triLeft: 'polygon(0% 50%, 100% 0%, 100% 100%)',
  splayup: 'polygon(0% 70%, 100% 70%, 100% 100%, 0% 100%)',
}
var POOLS = {};
var PROTO;
var QContextCounter = 0;
var Sayings;
var Score;
var sData;
var Selected;
var SERVER = 'localhost';
var Serverdata = {};
var Settings;
var SHAPEFUNCS = { 'circle': 'agCircle', 'hex': 'agHex', 'rect': 'agRect', };
var Socket = null;
var SPEC = null;
var Speech;
var STOPAUS = false;
var symbolDict;
var SymKeys;
var Syms;
var TESTING = false;
var TimeElapsed;
var TimeElem;
var TimeLeft;
var TimestampStarted;
var TOFleetingMessage;
var TOList;
var TOMain;
var TOMan;
var TOSound;
var TOTicker;
var TOTrial;
var trialNumber;
var uiActivated = false;
var UID = 0;
var UIDCounter = 0;
var UIROOT;
var USELIVESERVER = false;
var Username;
var WhichCorner = 0;
var WordP;
var Zones = {};
class RSG {
  constructor() {
    this.nodes = {};
    this.uiNodes = {};
    this.isUiActive = false;
    this.uid2oids = {};
    this.oid2uids = {};
    this.path2oid = {};
  }
  add_node(n, oid) {
    this.nodes[oid] = n;
    if (isEmpty(n.path)) this.root = n;
    if (isList(n.content) && n.content.length == 0) {
      n.type = 'empty_list';
    }
    this.path2oid[n.path] = n.oid;
    console.assert(nundef(Items[n.path]), 'duplicate path in Items!!! ' + n.path);
    console.assert(nundef(Items[oid]), 'duplicate oid in Items!!! ' + oid);
    Items[n.oid] = Items[n.path] = n;
  }
  add_ui_node(ui, uid, oid) {
    this.uiNodes[uid] = ui;
    lookupAddIfToList(this.uid2oids, [uid], oid);
    lookupAddIfToList(this.oid2uids, [oid], uid);
    if (Items[oid].type != 'card') console.assert(nundef(Items[uid]), 'duplicate uid in Items!!! ' + uid);
    Items[uid] = ui;
    let o = Items[oid];
    ui.setAttribute('oid', oid);
    iAdd(o, { div: ui });
  }
  getUI(uid) { return this.uiNodes[uid]; }
  get_item_from_path(path) { return Items[path]; }
  get_item(id) {
    if (id[0] == '_') {
      let oid = Items[id].getAttribute('oid');
      return Items[oid];
    } else return Items[id];
  }
}
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
  clear() { let elapsed = this.stop(); clearElement(this.elem); return elapsed; }
  continue() {
    if (!this.running) this.start();
    else if (!this.paused) return;
    else { this.paused = false; this.TO = setInterval(this.tickHandler.bind(this), this.interval); }
  }
  output() {
    this.elem.innerHTML = timeConversion(Math.max(this.msLeft, 0), 'msh');
  }
  pause() {
    if (this.paused || !this.running) return;
    clearInterval(this.TO);
    this.paused = true;
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
  togglePause() { if (this.paused) this.continue(); else this.pause(); }
  start() {
    if (this.running) this.stop();
    this.started = new Date().now;
    this.msLeft = this.msTotal;
    this.msElapsed = 0;
    this.running = true;
    this.output();
    this.TO = setInterval(this.tickHandler.bind(this), this.interval);
  }
  stop() {
    if (!this.running) return;
    clearInterval(this.TO);
    this.TO = null;
    this.running = false;
    return this.msLeft;
  }
}
