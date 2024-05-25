onload = start;

async function start() { TESTING = true; await prelims(); }
async function start() { TESTING = true; test90_integrateGetMyColors1(); }

async function test90_integrateGetMyColors1(){
  await prelims();
  let dinew = jsCopy(M.dicolor);
  let dil = getListAndDictsForDicolors();
  let unfi = getListAndDicts(getMyColors2(), 'hex', 'name');
  let beau = getListAndDicts(getMyColors1(), 'hex', 'name');
  let [l1, l2, l3] = [dil[0], unfi[0], beau[0]];
  let [h1, h2, h3] = [dil[1], unfi[1], beau[1]];
  let [n1, n2, n3] = [dil[2], unfi[2], beau[2]];
  let [hk1, hk2, hk3] = [Object.keys(h1), Object.keys(h2), Object.keys(h3)];
  let [nk1, nk2, nk3] = [Object.keys(n1), Object.keys(n2), Object.keys(n3)];

  let dParent = clearBodyDiv(); let d1 = mDom(dParent, { gap: 12, padding: 12 }); mFlexWrap(d1);

  //dicolor anreichern mit neuen colors aus getMyColors2
  let int1 = intersection(hk1,hk3); //hex colors 
  console.log('intersection',int1)
  let skeys = 'name hex bucket', styles={ padding: 10 };
  for(const k of int1) removeInPlace(hk3,k);
  console.log('neue colors',hk3); 
  for(const k of hk3){
    let ofi=h3[k];
    showColorBox(h3[k],skeys,d1,styles);
    let odiname=n1[ofi.name];
    if (isdef(odiname)){
      assertion(odiname.hex != ofi.hex,"WTF!!!!!!!!!!!!!!!!!");
      console.log(odiname.hex,ofi.hex)
      showColorBox(odiname, skeys, d1, styles);
    } else{
      assertion(nundef(h1[k]),'WTF!!!!');
      assertion(nundef(n1[ofi.name]),'WTF name!!!');
      lookupSet(dinew,[ofi.bucket,ofi.name],k);
    }
    mLinebreak(d1)
  }

  //sortDicolor(dinew); //das macht downloadAsYaml!!!

}
async function test90_integrateGetMyColors2(){
  await prelims();
  let dinew = jsCopy(M.dicolor);
  let dil = getListAndDictsForDicolors();
  let unfi = getListAndDicts(getMyColors2(), 'hex', 'name');
  let beau = getListAndDicts(getMyColors1(), 'hex', 'name');
  let [l1, l2, l3] = [dil[0], unfi[0], beau[0]];
  let [h1, h2, h3] = [dil[1], unfi[1], beau[1]];
  let [n1, n2, n3] = [dil[2], unfi[2], beau[2]];
  let [hk1, hk2, hk3] = [Object.keys(h1), Object.keys(h2), Object.keys(h3)];
  let [nk1, nk2, nk3] = [Object.keys(n1), Object.keys(n2), Object.keys(n3)];

  let dParent = clearBodyDiv(); let d1 = mDom(dParent, { gap: 12, padding: 12 }); mFlexWrap(d1);

  //dicolor anreichern mit neuen colors aus getMyColors2
  let int1 = intersection(hk1,hk2); //hex colors 
  let skeys = 'name hex bucket', styles={ padding: 10 };
  for(const k of int1) removeInPlace(hk2,k);
  console.log(hk2);
  for(const k of hk2){
    let ofi=h2[k];
    showColorBox(h2[k],skeys,d1,styles);
    let odiname=n1[ofi.name];
    if (isdef(odiname)){
      assertion(odiname.hex != ofi.hex,"WTF!!!!!!!!!!!!!!!!!");
      console.log(odiname.hex,ofi.hex)
      showColorBox(odiname, skeys, d1, styles);
    } else{
      assertion(nundef(h1[k]),'WTF!!!!');
      assertion(nundef(n1[ofi.name]),'WTF name!!!');
      lookupSet(dinew,[ofi.bucket,ofi.name],k);
    }
    mLinebreak(d1)
  }

  //sortDicolor(dinew); //das macht downloadAsYaml!!!

}

async function test89_colorlists() {
  await prelims();
  let dil = getListAndDictsForDicolors();
  let unfi = getListAndDicts(getMyColors2(), 'hex', 'name');
  let beau = getListAndDicts(getMyColors1(), 'hex', 'name');
  let [l1, l2, l3] = [dil[0], unfi[0], beau[0]];
  let [h1, h2, h3] = [dil[1], unfi[1], beau[1]];
  let [n1, n2, n3] = [dil[2], unfi[2], beau[2]];

  //name overlappings: nur 1-2
  let [k1, k2, k3] = [Object.keys(h1), Object.keys(h2), Object.keys(h3)];
  console.log('1-2',intersection(k1,k2)); 
  console.log('1-3',intersection(k1,k3)); 
  console.log('2-3',intersection(k2,k3)); 
  
  //hex overlappings: nur 1-2
  let [nk1, nk2, nk3] = [Object.keys(n1), Object.keys(n2), Object.keys(n3)];
  console.log('1-2',intersection(nk1,nk2)); 
  console.log('1-3',intersection(nk1,nk3)); 
  console.log('2-3',intersection(nk2,nk3)); 

  let dParent = clearBodyDiv();
  //let styles = { wmin: 250, padding: 20 };
  for (const list of [l1, l2, l3]) {
    console.log('list',list.length)
    showColorBoxes(list, 'name', dParent, { padding: 10 });
    mLinebreak(dParent)
  }
}

async function test88_colorlists() {
  await prelims();
  let dil = getListAndDictsForDicolors();
  let unfi = getListAndDicts(getMyColors2(), 'hex', 'name');
  let beau = getListAndDicts(getMyColors1(), 'hex', 'name');
  let [l1, l2, l3] = [dil[0], unfi[0], beau[0]];
  let [h1, h2, h3] = [dil[1], unfi[1], beau[1]];
  let [k1, k2, k3] = [Object.keys(h1), Object.keys(h2), Object.keys(h3)];
  console.log('1-2',intersection(k1,k2)); 
  console.log('1-3',intersection(k1,k3)); 
  console.log('2-3',intersection(k2,k3)); 
  let dParent = clearBodyDiv();
  //let styles = { wmin: 250, padding: 20 };
  for (const list of [l1, l2, l3]) {
    console.log('list',list.length)
    showColorBoxes(list, 'name', dParent, { padding: 10 });
    mLinebreak(dParent)
  }
}
async function test87_colorPairs() {
  await prelims();

  let dil = getListAndDictsForDicolors();
  let byhex = dil[1]
  let unfiltered = getBeautifulColors();
  let fullColorlist = unfiltered.filter(x => x.sat * 100 >= 50);
  let byhexbeau = list2dict(fullColorlist, 'hex');
  let inBeiden = [], nurInBeautiful = [];

  let nurInUnfitered = [];
  let unfiltDicolors = [];

  for (const c of unfiltered) {
    if (isdef(byhexbeau[c.hex])) {
      if (isdef(byhex[c.hex])) {
        inBeiden.push(byhex[c.hex]);
      } else nurInBeautiful.push(c);
    } else {
      if (isdef(byhex[c.hex])) {
        unfiltDicolors.push(byhex[c.hex]);
      } else nurInUnfitered.push(c);
    }
  }
  console.log('unfiltDicolors', unfiltDicolors.map(x => x.hex));
  console.log('nurInUnfitered', nurInUnfitered.map(x => x.hex));
  return;

  console.log('inBeiden', inBeiden);
  console.log('nurInBeautiful', nurInBeautiful);

  let nurInDicolor = [];
  for (const k in byhex) if (nundef(byhexbeau[k])) nurInDicolor.push(byhex[k]);

  console.log('nurInDicolor', nurInDicolor);

  let dParent = clearBodyDiv();
  let d1 = mDom(dParent, { gap: 12, padding: 12 }); mFlexWrap(d1);

  for (const c of inBeiden) showColorBox(d1, c);

  let colorlist = getMyColors1(); console.log('colors', colorlist);

  let items = [];
  for (var c of colorlist) {
    let item = showColorBox(d1, c); items.push(item);
    items.push(item);
    let c1 = byname[c.name];
    let c2name = replaceAll(c.name, '_', ''); console.log(c2name);
    let c2 = byname[c2name];
    if (isdef(c1)) showColorBox(d1, c1);
    if (c2name != c.name && isdef(c2)) showColorBox(d1, c2);
    mLinebreak(d1)
  }
}
async function test86_andereColors() {
  let colors = getMyColors1(); console.log('colors', colors)
  let d = clearBodyDiv();
  let items = showPaletteNames(d, colors)
  items.map(x => mDom(iDiv(x), {}, { html: x.bucket }));
}
async function test85_superColors() {
  await prelims();
  let listw3 = getBeautifulColors();
  let listDicolor = [];
  let bucketlist = 'yellow orangeyellow orange orangered red magentapink magenta bluemagenta blue cyanblue cyan greencyan green yellowgreen'.split(' ');
  bucketlist = arrCycle(bucketlist, 8);
  for (const bucket of bucketlist) {
    let list = dict2list(M.dicolor[bucket]);
    for (const c of list) {
      let o = w3color(c.value);
      o.name = c.id;
      o.hex = c.value;
      o.bucket = bucket;
      listDicolor.push(o);
    }
  }

  console.log('beautiful', listw3[0]);
  console.log('bucket', listDicolor[0]);
  let byhex = list2dict(listDicolor, 'hex');
  let byname = list2dict(listDicolor, 'name');

  let extra = [];
  for (const c of listw3) {
    if (nundef(byhex[c.hex])) {
      console.log(`${c.hex} NOT in dicolor!`);
      extra.push(c.hex);
    }

  }

  downloadAsYaml(extra, 'extra');



  console.log('die beiden listen muessen gejoined werden irgendwie!')

}
async function test84_canvasCSSBlendModes() {
  let d = clearBodyDiv({ gap: 4 }); mFlexWrap(d);
  let tlist = await getTextures();
  let [fill, src] = [rColor(), rTexture()]; console.log(fill, src);
  //src='../assets/textures/ttranscircles.png';
  for (const blendCSS of arrMinus(getBlendModesCSS(), ['saturation', 'color'])) {
    let d1 = mDom(d);
    let bgBlend = getBlendCanvas(blendCSS)
    mDom(d1, {}, { html: `${bgBlend}<br>${src}<br>` });
    let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
    let palette = await getPaletteFromCanvas(ca.cv);
    console.log(palette); palette.unshift(fill); palette.splice(8);
    showPaletteMini(d1, palette);
  }
}
async function test83_canvasAllBlendModes() {
  let d = clearBodyDiv({ gap: 4 }); mFlexWrap(d);
  let tlist = await getTextures();
  let [fill, src] = [rColor(), rTexture()]; console.log(fill, src);
  //src='../assets/textures/ttranscircles.png';
  for (const bgBlend of getBlendModesCanvas()) {
    let d1 = mDom(d);
    mDom(d1, {}, { html: `${bgBlend}<br>${src}<br>` });
    let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
    let palette = await getPaletteFromCanvas(ca.cv);
    console.log(palette); palette.unshift(fill); palette.splice(8);
    showPaletteMini(d1, palette);
  }
}
async function test82_canvas() {
  let d = clearBodyDiv();
  let tlist = await getTextures();
  // let ca = await getCanvasCtx(d,{w:400,h:300,fill:'blue',bgBlend:'multiply'},{src:tlist[0]});
  let [fill, bgBlend, src] = [rColor(), rBlendCanvas(), rTexture()];
  console.log(fill, bgBlend, src)
  let ca = await getCanvasCtx(d, { w: 400, h: 300, fill, bgBlend }, { src });
  let palette = await getPaletteFromCanvas(ca.cv);
  console.log(palette);
  showPaletteMini(d, palette);

  // let items = showPaletteText(d,getBlendModesCanvas());
  // items.map(x=>iDiv(x).onclick=()=>{modifyCanvasBlendMode(x.text)});
}
async function test81_canvas() {
  await prelims();
  let list = M.textures;
  let d = clearBodyDiv({ bg: 'white', h: '100vh' });
  let canvas = mDom(d, { w: 300, h: 200 }, { tag: 'canvas' });
  let ctx = canvas.getContext('2d');

  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let t = list[0];
  let img = await imgAsync(null, { w: canvas.width, h: canvas.height }, { src: t });

  ctx.globalCompositeOperation = 'multiply';

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);



  return;


}

async function test80() {
  await prelims();

}

async function prelims() {

  ColorThiefObject = new ColorThief();//console.log(ColorThiefObject);
  let t1 = performance.now();
  Serverdata = await mGetRoute('session'); //session ist: users,config,events
  let t2 = performance.now();
  await loadAssets();
  let t4 = performance.now();
  sockInit();
  UI.dTitle = mBy('dTitle');
  let t5 = performance.now();
  window.onkeydown = keyDownHandler;
  window.onkeyup = keyUpHandler;
  DA.funcs = { setgame: setgame(), button96: button96() }; //implemented games!
  for (const gname in Serverdata.config.games) {
    if (isdef(DA.funcs[gname])) continue;
    DA.funcs[gname] = defaultGameFunc();
  }

  let html = `
    <div style="position:fixed;width:100%;z-index:20000">
      <div id="dNav" class="nav p10"></div>
      <div id="dMessage" style='height:0px;padding-left:10px' class="transh"></div>
    </div>
    <div id="dBuffer" style="height:32px;width:100%"></div>
    <div id="dExtra" class="p10hide nav"></div>
    <div id="dTitle"></div>
    <div id="dPage" style="display:grid;grid-template-columns: auto 1fr auto;">
      <div id="dLeft" class="h100 over0 translow nav">
      </div>
      <div id="dMain"></div>
      <div id="dRight" class="h100 over0 translow"></div>
    </div>
    <d id="dBottom"></d>
    
    `;
  document.body.innerHTML = html;
  UI.nav = showNavbar();
  UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
  await switchToUser(localStorage.getItem('username'), localStorage.getItem('menu'));

}
function defaultGameFunc() {
  function setup(table) { let fen = { players: table.players, turn: [table.owner] }; delete table.players; }
  function present(dParent, table) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
  async function activate(table) { console.log('activate for', getUname()) }
  function checkGameover(table) { return false; }
  async function hybridMove(table) { console.log('hybrid moves for', getUname()) }
  async function botMove(table) { console.log('robot moves for', getUname()) }
  async function stepComplete(table, o) { console.log(`integrate if step complete for ${table.friendly}`); }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}

async function updateExtra() {
  mClear('dExtra');
  let d = mDom('dExtra');
  mStyle(d, { display: 'flex', justify: 'space-between' });
  let [left, right] = [mDom(d, { hpadding: 10 }, { id: 'dExtraLeft' }), mDom(d, {}, { id: 'dExtraRight' })];
  if (TESTING) await updateTestButtonsLogin();
}
async function updateTestButtonsLogin(names) {
  if (nundef(names)) names = ['amanda', 'felix', 'lauren', 'mimi', 'gul'];
  let d = mBy('dExtraRight'); mClear(d);
  let me = getUname();
  for (const name of names) {
    let idname = getButtonCaptionName(name);
    let b = UI[idname] = mButton(name, async () => await switchToUser(name), d, { maright: 4, hpadding: 3, wmin: 50, className: 'button' });
    if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
  }
}
async function updateTestButtonsPlayers(table) {
  if (nundef(table)) table = T;
  assertion(table, "NOT TABLE IN updateTestButtonsPlayers")
  let d = mBy('dExtraRight'); mClear(d); //mFlexWrap(d);
  let me = getUname();
  let names = T.playerNames; //addIf(names,'mimi');
  //addIf(names,me);
  let dplayers = mDom(d);
  for (const name of names) {
    let idname = getButtonCaptionName(name);
    let b = UI[idname] = mButton(name, async () => await switchToUser(name), dplayers, { maright: 4, hpadding: 3, wmin: 50, className: 'button' });
    if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
  }

  if (!table.playerNames.includes(me)) return;
  let dbotswitch = mDom(d, { align: 'right', patop: 10, gap: 6 }, { html: 'BOT' }); mFlexLine(dbotswitch, 'end')
  let oSwitch = mSwitch(dbotswitch, {}, { id: 'bot', val: amIHuman(table) ? '' : 'checked' });
  let inp = oSwitch.inp;
  oSwitch.inp.onchange = onchangeBotSwitch;


}

