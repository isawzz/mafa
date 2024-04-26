const ANIM={};
var Session = {};
var Clientdata = {};
const allPeeps = []
const availablePeeps = []
const BLUE = '#4363d8';
const BROWN = '#96613d';
const ColorList = ['lightgreen', 'lightblue', 'yellow', 'red', 'green', 'blue', 'purple', 'violet', 'lightyellow', 'teal', 'orange', 'brown', 'olive', 'deepskyblue', 'deeppink', 'gold', 'black', 'white', 'grey'];
const crowd = []
const DEF_ORIENTATION = 'v';
const DEF_SPLIT = 0.5;
const FIREBRICK = '#800000';
const GREEN = '#3cb44b';
const BLUEGREEN = '#004054';
const img = document.createElement('img')
const LIGHTBLUE = '#42d4f4';
const LIGHTGREEN = '#afff45';
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
var A;
var activatedTests = [];
var AD;
var ADS;
var aiActivated;
var Animation1;
var AREAS = {};
var AU = {};
var auxOpen;
var Categories;
var ColorDi;
var ColorNames;
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
var currentGame = IS_TESTING ? 'gTouchPic' : 'sequence';
var currentLanguage = 'E';
var currentLevel;
var DA = {};
var DB;
var draggedElement;
var dragStartOffset;
var dropPosition = 'none';
var dynSpec;
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
var FUNCTIONS = {
  instanceof: 'instanceOf',
  prop: (o, v) => isdef(o[v]),
  no_prop: (o, v) => nundef(o[v]),
  no_spec: (o, v) => false,
}
var G = null;
var gameSequence = IS_TESTING ? ['gSayPicAuto', 'gTouchPic', 'gTouchColors', 'gWritePic', 'gMissingLetter', 'gSayPic'] : ['gSayPic', 'gTouchColors', 'gWritePic'];
var Goal;
var I;
var INFO = {};
var IS_TESTING = true;
var IsAnswerCorrect;
var IsControlKeyDown = false;
var Items = {};
var KeySets;
var lastPosition = 0;
var LevelChange = true;
var M = {};
var MAGNIFIER_IMAGE;
var MAXLEVEL = 10;
var nMissing;
var P;
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
var R;
var S = {};
var sData;
var Selected;
var Serverdata = {};
var Settings;
var SHAPEFUNCS = { 'circle': 'agCircle', 'hex': 'agHex', 'rect': 'agRect', };
var Socket = null;
var SPEC = null;
var Speech;
var symbolDict;
var Syms;
var T;
var TESTING = false;
var TO = {};
var TOFleetingMessage;
var TOList;
var TOMain;
var TOMan;
var TOTrial;
var U = null;
var UI = {};
var uiActivated = false;
var UID = 0;
var UIDCounter = 0;
var UIROOT;
var Username;
var Z;
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
