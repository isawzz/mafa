async function natCardsFinalProcessing() {
  let path = 'y/nat/cards1/';
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  for (const k in M.natCards) {
    let card = M.natCards[k];
    let [age, type] = [card.age, card.Type];
    if (type == 'event' || age == 0) continue;
    let img = await imgAsync(dParentBad, {}, { src: path + k + '.png', tag: 'img' });
    let cv = await rotateAndWriteAge(img, card);
    await imgToServer(cv, `assets/games/nations/cards/${k}.png`);
  }
  async function rotateAndWriteAge(img, card) {
    let diStage = { 0: 'I', 1: 'I', 2: 'II', 3: 'III', 4: 'II II' };
    let [w, h] = [img.width, img.height];
    mDom('dExtra', { h: 4 })
    let cv2 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
    let ctx2 = cv2.getContext('2d');
    ctx2.translate(h, 0)
    ctx2.rotate(90 * Math.PI / 180);
    ctx2.drawImage(img, 0, 0, w, h);
    mDom('dExtra', { h: 4 })
    let cv3 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
    let ctx3 = cv3.getContext('2d');
    ctx3.drawImage(cv2, 0, 0);
    let x = cv3.width / 2;
    let y = cv3.height;
    ctx3.fillStyle = 'white';
    ctx3.font = '20px Arial';
    ctx3.textAlign = 'center';
    let text = diStage[card.age];
    ctx3.fillText(text, x, y);
    return cv3;
  }
}
async function natCardsKleinereCard() {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  let dims = {
    advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
    building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
    golden_age: { diffleft: 91, diffright: 148 },
    wonder: { diffleft: 91, diffright: 148 },
    war: { diffleft: 91, diffright: 148 },
    hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
    urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
    military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
  };
  let k = 'pyramids'; //nur hagia,kremlin und potemkin!
  let card = M.natCards[k];
  let path = `../assets/games/nations/cards/${card.Path}`;
  let type = card.Type;
  let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
  let [wImg, hImg] = [img.width, img.height];
  let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
  let [wCanvas, hCanvas] = [wImg, hImg];
  let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
  let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
  ctx1.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);
  console.log('____________', k)
  let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
  mDom(dParentGood, { h: 10 });
  let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
  let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
  ctx11.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);
  let [x1, x2, y1, y2, dx, dy] = [14, 313, 15, 205, 8, 8];
  ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - 2 * dx, h - 2 * dy);
  let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
  ctx.strokeStyle = diColors[card.Type];
  ctx.lineWidth = 28;
  ctx.strokeRect(0, 0, w, h);
  await imgToServer(canvas, `y/nat/${type}/${k}.png`);
}
async function natCardsManual() {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  let di = { second_boer_war: 'right', opium_war: 'right', balkan_wars: 'right', antikythera_mechanism: 'left', uluru: null, mount_kailash: null, terracotta_army: 'top', uraniborg: 'left', great_barrier_reef: 'right', hawaii: 'left' };
  let list = Object.keys(di);
  list = ['second_boer_war', 'opium_war', 'balkan_wars']; // all done!
  for (const k of list) {
    let card = M.natCards[k];
    let path = `../assets/games/nations/cards/${card.Path}`;
    let type = card.Type;
    let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
    let [wImg, hImg] = [img.width, img.height];
    let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
    let [wCanvas, hCanvas] = [wImg, hImg];
    let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
    let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
    ctx1.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);
    console.log('____________', k)
    let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
    mDom(dParentGood, { h: 10 });
    let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
    let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
    ctx11.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);
    let noside = di[k];
    let xStart = type == 'war' ? 20 : 0;
    let left = noside == 'left' ? 0 : findLeftLine(ctx1, wCanvas, hCanvas, cgoal, xStart); console.log('left', left)
    let right = noside == 'right' ? wCanvas : findRightLine(ctx1, wCanvas, hCanvas, cgoal); console.log('right', right)
    let top = noside == 'top' ? 0 : findTopLine(ctx1, wCanvas, hCanvas, cgoal); console.log('top', top)
    let bot = noside == 'bottom' || type == 'war' ? hCanvas : findBottomLine(ctx1, wCanvas, hCanvas, cgoal); console.log('bot', bot)
    let [x1, x2, y1, y2, dx, dy, factw, facth] = [left, right, top, bot, 8, 8, 2, 2];
    if (k == 'hawaii') { dx = 16; factw = 1.2 }
    else if (k.includes('antiky')) { dx = 16; factw = 1.1; dy = 10; }
    ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - factw * dx, h - facth * dy);
    let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'maroon', wonder: 'sienna' };
    ctx.strokeStyle = diColors[card.Type];
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, w, h);
    await imgToServer(canvas, `y/nat/${type}/${k}.png`);
  }
  function findLeftLine(ct, w, h, cgoal, xStart = 0) {
    let [restlist, _] = findPointsBoth(ct, xStart, xStart + 40, 0, h, cgoal, 20);
    let o = nextBar(ct, restlist, 'red');
    return o.val;
  }
  function findRightLine(ct, w, h, cgoal) {
    let [restlist, _] = findPointsBoth(ct, w - 40, w, 0, h, cgoal, 20);
    let o = nextBar(ct, restlist, 'orange');
    return o.val;
  }
  function findTopLine(ct, w, h, cgoal) {
    let [_, restlist] = findPointsBoth(ct, 0, w, 0, 40, cgoal, 20);
    let o = nextLine(ct, restlist, 'blue');
    return o.val;
  }
  function findBottomLine(ct, w, h, cgoal) {
    let [_, restlist] = findPointsBoth(ct, 0, w, h - 30, h, cgoal, 20);
    let o = nextLine(ct, restlist, 'green');
    return o.val;
  }
}
async function natCardsSaveType(type) {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  list = Object.keys(M.natCards).filter(ck => M.natCards[ck].Type == type && M.natCards[ck].age > 0)
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  mDom(dParentBad, { h: 10 });
  let dims = {
    advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
    building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
    golden_age: { diffleft: 91, diffright: 148 },
    wonder: { diffleft: 91, diffright: 148 },
    war: { diffleft: 91, diffright: 148 },
    hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
    urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
    military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
  };
  for (const k of list) {
    if (['second_boer_war', 'opium_war', 'balkan_wars', 'antikythera_mechanism', 'uluru', 'mount_kailash', 'hawaii', 'great_barrier_reef', 'uraniborg', 'terracotta', 'pyramids', 'hagia', 'kremlin', 'potemkin'].some(x => k.includes(x))) continue;
    console.log('____________', k)
    let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
    let card = M.natCards[k];
    let path = `../assets/games/nations/cards/${card.Path}`;
    let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
    let [wImg, hImg] = [img.width, img.height];
    let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
    let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
    let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
    ctx1.drawImage(img, 0, 0, wImg, hImg);
    mDom(dParentGood, { h: 10 });
    let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
    let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
    ctx11.drawImage(img, 0, 0, wImg, hImg);
    let [diffleft, diffright] = isdef(dims[type]) ? [dims[type].diffleft, dims[type].diffright] : [91, 148];
    let [x1, x2, x3, x4, l, m1, m2, r] = findDarkBars(ctx1, wImg, hImg, cgoal, diffleft, diffright);
    console.log(x1, x2, x3, x4);
    console.log(l, m1, m2, r)
    let [y1, y2, y3, y4, a, b, c, d] = findDarkLines(ctx11, wImg, hImg, cgoal);
    console.log(y1, y2, y3, y4);
    console.log(a, b, c, d)
    let cv2 = mDom(dParentGood, {}, { tag: 'canvas', width: x4 - x1, height: y4 - y1 });
    let ctx2 = cv2.getContext('2d', { willReadFrequently: true });
    ctx2.drawImage(img, -x1, -y1);
    let loff = 5, toff = 5;
    if (nundef(a)) {
      toff = 2 + 24 - y2;
    }
    if (nundef(l)) {
      loff = 2 + diffleft - x2;
    }
    console.log('loff', loff, 'toff', toff)
    ctx.drawImage(cv2, loff, toff);
    let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
    ctx.strokeStyle = diColors[card.Type];
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, w, h);
    await imgToServer(canvas, `y/nat/${type}/${k}.png`);
  }
}
async function natCardsTester() {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let list = rChoose(Object.keys(M.natCards).filter(ck => M.natCards[ck].Type != 'event'), 6);
  list = Object.keys(M.natCards).filter(ck => M.natCards[ck].Type == 'battle' && M.natCards[ck].age > 0)
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  mDom(dParentBad, { h: 10 });
  let dims = {
    advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
    building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
    golden_age: { diffleft: 91, diffright: 148 },
    wonder: { diffleft: 91, diffright: 148 },
    war: { diffleft: 91, diffright: 148 },
    hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
    urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
    military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
  };
  for (const k of list) {
    if (['second_boer_war', 'opium_war', 'balkan_wars', 'antiky', 'uluru', 'mount_kailash', 'hawaii', 'great_barrier_reef', 'uraniborg', 'terracotta', 'pyramids', 'hagia', 'kremlin', 'potemkin'].some(x => k.includes(x))) continue;
    console.log('____________', k)
    let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
    let card = M.natCards[k];
    let path = `../assets/games/nations/cards/${card.Path}`;
    let type = card.Type;
    let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
    let [wImg, hImg] = [img.width, img.height];
    let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
    let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
    let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
    ctx1.drawImage(img, 0, 0, wImg, hImg);
    mDom(dParentGood, { h: 10 });
    let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
    let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
    ctx11.drawImage(img, 0, 0, wImg, hImg);
    let [diffleft, diffright] = isdef(dims[type]) ? [dims[type].diffleft, dims[type].diffright] : [91, 148];
    let [x1, x2, x3, x4, l, m1, m2, r] = findDarkBars(ctx1, wImg, hImg, cgoal, diffleft, diffright);
    console.log(x1, x2, x3, x4);
    console.log(l, m1, m2, r)
    let [y1, y2, y3, y4, a, b, c, d] = findDarkLines(ctx11, wImg, hImg, cgoal);
    console.log(y1, y2, y3, y4);
    console.log(a, b, c, d)
    let cv2 = mDom(dParentGood, {}, { tag: 'canvas', width: x4 - x1, height: y4 - y1 });
    let ctx2 = cv2.getContext('2d', { willReadFrequently: true });
    ctx2.drawImage(img, -x1, -y1);
    let loff = 5, toff = 5;
    if (nundef(a)) {
      toff = 2 + 24 - y2;
    }
    if (nundef(l)) {
      loff = 2 + diffleft - x2;
    }
    console.log('loff', loff, 'toff', toff)
    ctx.drawImage(cv2, loff, toff);
    let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
    ctx.strokeStyle = diColors[card.Type];
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, w, h);
  }
}
async function natCardsWrongFormatAberIntact() {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  let dims = {
    advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
    building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
    golden_age: { diffleft: 91, diffright: 148 },
    wonder: { diffleft: 91, diffright: 148 },
    war: { diffleft: 91, diffright: 148 },
    hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
    urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
    military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
  };
  let k = 'kremlin'; //nur hagia,kremlin und potemkin!
  let card = M.natCards[k];
  let path = `../assets/games/nations/cards/${card.Path}`;
  let type = card.Type;
  let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
  let [wImg, hImg] = [img.width, img.height];
  let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
  let [wCanvas, hCanvas] = [wImg, hImg];
  let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
  let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
  ctx1.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);
  console.log('____________', k)
  let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
  mDom(dParentGood, { h: 10 });
  let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
  let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
  ctx11.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);
  let [x1, x2, y1, y2, dx, dy] = [24, 474, 20, 308, 8, 8];
  ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - 2 * dx, h - 2 * dy);
  let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
  ctx.strokeStyle = diColors[card.Type];
  ctx.lineWidth = 28;
  ctx.strokeRect(0, 0, w, h);
  await imgToServer(canvas, `y/nat/${type}/${k}.png`);
}
async function natCivsToLandscape() {
  async function imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
    if (isdef(mBy('img1'))) mBy('img1').remove();
    let img = mDom(imgParent, { position: 'absolute', top: '100vh', h: width }, { tag: 'img', id: 'img1' });
    await loadImageAsync(src, img);
    await onloadCiv(img, ...arguments);
  }
  async function onloadCiv(img, src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
    let d = viewParent;
    console.log('d', d)
    console.log('img', img)
    mClear(d);
    let canvas = mDom(d, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
    let ctx = canvas.getContext('2d');
    ctx.translate(img.height, 0)
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(img, 0, 0, img.width, img.height)
    if (downloadAtClient) downloadCanvas(canvas);
    if (sendToServer) {
      let dataUrl = canvas.toDataURL('image/png');
      let unique = `civ_${name}`; //_${rName()}`;
      let path = `assets/games/nations/civs/${unique}.png`;
      let o = { image: dataUrl, name: name, unique: unique, coll: 'nations', path: path, ext: 'png' };
      console.log('dataUrl');
      let resp = await mPostRoute('postImage', o);
      console.log('resp', resp);
    }
  }
  let dbody = document.body; dbody.innerHTML = '';
  let d = mDom(dbody, { bg: 'skyblue', hmin: '100vh' }, { id: 'd1' });
  let civlist = ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];
  for (const civ of ['vikings']) {
    let src = `../assets/games/nations/civs_old/${civ}.jpg`;
    let width = 800;
    let name = civ;
    let viewParent = d;
    let imgParent = dbody;
    let sendToServer = true;
    let downloadAtClient = false;
    await imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);
  }
}
function natCreate(owner, players) {
  if (isList(players)) {
    let list = players;
    players = {};
    list.map(x => players[x] = {});
  }
  if (nundef(players[owner])) players[owner] = {};
  let fen = { owner: owner, players: players }
  let playerNames = fen.playerNames = Object.keys(players);
  let numPlayers = fen.numPlayers = playerNames.length;
  fen.age = 1;
  fen.events = [];
  fen.progressCards = [];
  for (const k in M.natCards) {
    let c = M.natCards[k];
    if (c.age != fen.age) continue;
    if (c.Type == 'event') fen.events.push(k); else fen.progressCards.push(k);
  }
  arrShuffle(fen.progressCards);
  fen.progressCards = arrTake(fen.progressCards, 42);
  arrShuffle(fen.events);
  fen.market = [];
  for (let i = 0; i < 21; i++) {
    let k = fen.progressCards.shift();
    fen.market.push(k);
  }
  let civs = rChoose(M.civNames, numPlayers);
  let i = 0;
  for (const name in fen.players) {
    let pl = fen.players[name];
    pl.name = name;
    assertion(isdef(Serverdata.users[name]), `unknown user ${name}`);
    addKeys(Serverdata.users[name], pl);
    if (nundef(pl.civ)) pl.civ = civs[i++];
    if (nundef(pl.level)) pl.level = rChoose(M.levels);
    let civ = M.civs[pl.civ];
    addKeys(civ.res, pl);
    pl.book = 0;
    pl.cards = jsCopy(civ.cards);
    pl.extraWorkers = jsCopy(civ.workers);
  }
  let plorder = fen.plorder = jsCopy(playerNames); arrShuffle(plorder);
  fen.round = 1;
  fen.phase = 'growth'; // growth newEvent action production turnOrder war events  
  fen.turn = jsCopy(fen.playerNames);
  return fen;
}
async function natCreateGame() {
  let id = generateTableId();
  let fen = natCreate(U.name, ['felix', 'amanda']); //{felix:{level:'emperor'},lili:{civ:'rome'},lauren:{civ:'mongolia'}});
  let s = JSON.stringify(fen);
  let res = await mPostRoute('postTable', { status:'started', id: id, fen: fen, game: 'nations', friendly: generateTableName(fen.numPlayers) });
}
async function natDetectBB(card, dParent) {
  dParent = toElem(dParent);
  let path = `../assets/games/nations/cards/${card.Path}`;
  let img = await imgAsync(dParent, {}, { src: path, tag: 'img' })
  let [w, h] = [img.width, img.height];
  if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }
  let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
  let ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  let edgecolor = card.Type == 'event' ? '#6C4F64' : '#59544E'; //'#544744';
  let lightcolor = card.Type == 'event' ? '#E7BB97' : '#DBCEBE';
  let [rect, tmiss, bmiss, lmiss, rmiss] = calcBoundingBox(ctx, w, h, edgecolor, lightcolor);
  let cv1 = mDom(dParent, {}, { tag: 'canvas', width: rect.w, height: rect.h });
  let ct1 = cv1.getContext('2d', { willReadFrequently: true });
  ct1.drawImage(img, -rect.left, -rect.top);
  return [rect, cv1, ct1, tmiss, bmiss, lmiss, rmiss];
}
async function natGameView(fen, plname) {
  clear_timeouts();
  natTitle();
  await natPresent(fen, plname);
  if (!fen.turn.includes(plname)) {
    return;
  }
  selPrep(fen);
  natPreAction()
}
async function natGetEmptyCardCanvas(dParent) {
  dParent = toElem(dParent);
  if (nundef(DA.eimg)) {
    DA.eimg = await imgAsync(dParent, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
    mDom(dParent, { h: 10 });
  }
  let eimg = DA.eimg;
  let [w, h] = [eimg.width, eimg.height];
  let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
  let ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(eimg, 0, 0, w, h);
  return [canvas, ctx, w, h];
}
async function natLoadAssets() {
  if (isdef(M.natCards)) return;
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  M.civs = await mGetYaml('../assets/games/nations/civs.yaml');
  M.civNames = Object.keys(M.civs);
  M.levels = ['chieftain', 'prince', 'king', 'emperor'];
}
async function natLoadCardInfo() {
  async function natCollectTypes(type) {
    let text = await mGetText(`../assets/games/nations/${type}.csv`);
    let list = csv2list(text, hasHeadings = true);
    console.log('list', list.length);
    let diStage = { I: 1, II: 2, III: 3, IV: 4, 'II II': 4 };
    let di = {}, newlist = [];
    for (const card of list) {
      if (type == 'event' && (isdef(card['Name of Event 1']) || isdef(card['Name of Event 2']))) {
        let name1 = card['Name of Event 1'];
        let name2 = card['Name of Event 2'];
        card.Name = isdef(name1) ? name1 : isdef(name2) ? name2 : null;
      }
      if (nundef(card.Name)) { console.log('no', card.Name); continue; }
      let name = card.Name;
      if (name.endsWith(' I')) { name = name.substring(0, name.length - 2); card.Name = name; console.log('name', name); }
      let key = normalizeString(card.Name.toLowerCase());
      let age = valf(diStage[card.Stage], 0);
      let fname = isdef(card.Stage) ? `age${age}_` : '';
      fname += key;
      fname += '.jpg';
      card.Path = fname;
      card.Type = type;
      card.key = key;
      if (isdef(age)) card.age = age; else console.log('no age', key)
      if (isdef(di[key])) console.log('duplicate', key)
      di[key] = card;
      newlist.push(card)
    }
    return newlist;
  }
  let listOfTypes = ['advisor', 'battle', 'building', 'colony', 'military', 'natural', 'war', 'wonder', 'event'];
  let list = [];
  for (const type of listOfTypes) {
    list = list.concat(await natCollectTypes(type));
  }
  let realList = []
  for (const c of list) {
    if (isEmpty(c.Name)) console.log('no name', c); else realList.push(c);
  }
  console.log('final', realList.map(x => x.Name));
  let final = list2dict(realList, 'key');
  downloadAsYaml(final, 'nationsCards')
}
async function natModCard(name, color, idx, dims) {
  let path = `../assets/games/nations/cards/${name}`; //.jpg`;
  let dParent = toElem('dExtra');
  let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
  let [w, h] = [img.width, img.height];
  if (w > h) return natModCardLandscape(dParent, img, name, color, idx, dims, w, h);
  else return natModCardPortrait(dParent, img, name, color, idx, dims, w, h);
}
function natModCardLandscape(dParent, img, name, color, idx, dims, w, h) {
  let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  let [xstart, ystart, xend, yend, isRotated] = [0, 0, w, h, false];
  let y1, y2, x1, x2, prevy, prevx;
  let resy = [ystart, y1, y2, yend, isRotated, prevy] = calcBoundsY(ctx, dims.dx, h, 261);
  console.log('resY', resy, prevy)
  let resx = [xstart, x1, x2, xend, prevx, rot] = allDarkPoints(ctx, w, dims);
  console.log('resX', resx)
  let [wsmall, hsmall] = [xend - xstart, yend - ystart + 1];
  console.log('wsmall', wsmall, 'hsmall', hsmall)
  let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
  let ct1 = cv1.getContext('2d');
  ct1.drawImage(img, -xstart, -ystart, w, h);
  let cv2 = mDom('dMain', {}, { tag: 'canvas', id: `cv${name}`, width: wsmall, height: hsmall });
  let ct2 = cv2.getContext('2d');
  ct2.drawImage(img, -xstart, -ystart, w, h);
  ct2.strokeStyle = color;
  ct2.lineWidth = 20;
  ct2.rect(0, 0, wsmall, hsmall);
  ct2.stroke();
  return cv2;
}
function natModCardPortrait(dParent, img, name, color, idx, dims, w, h) {
  console.log('w', w, 'h', h);
  let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return null;
  let [xstart, ystart, xend, yend, isRotated] = [0, 0, w, h, false];
  let y1, y2, x1, x2, prevy, prevx;
  let resy = [ystart, y1, y2, yend, isRotated, prevy] = calcBoundsY(ctx, dims.dx, h, 261);
  console.log('resY', resy)
  let resx = [xstart, x1, x2, xend, prevx, rot] = allDarkPoints(ctx, w, dims);
  console.log('resX', resx)
  let [wsmall, hsmall] = [xend - xstart, yend - ystart + 1];
  console.log('wsmall', wsmall, 'hsmall', hsmall)
  let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
  let ct1 = cv1.getContext('2d');
  ct1.drawImage(img, -xstart, -ystart, w, h);
  let cv2 = mDom('dMain', {}, { tag: 'canvas', id: `cv${name}`, width: wsmall, height: hsmall });
  let ct2 = cv2.getContext('2d');
  ct2.drawImage(img, -xstart, -ystart, w, h);
  ct2.strokeStyle = color;
  ct2.lineWidth = 20;
  ct2.rect(0, 0, wsmall, hsmall);
  ct2.stroke();
  return cv2;
}
function natPreAction() {
  let [fen, phase] = [Clientdata.fen, Clientdata.fen.phase];
  mDom('dTitleLeft', { bg: mGetStyle(dTitle, 'bg'), fg: 'contrast' }, { html: `Age ${fen.age}.${fen.round}: <b style='color:orange'>${phase}</b> (${getUname()})` })
  switch (phase) {
    case 'growth': selectAddItems(natSelItemsGrowth(fen), natSelectedGrowth, 'g'); break;// 'must select your growth'); break; 
  }
}
async function natPresent(fen, plname) {
  mClear('dMain');
  let dParent = mDiv('dMain');
  let [owner, players, age, round, phase] = [fen.owner, fen.players, fen.age, fen.round, fen.phase]
  let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent);
  mStyle(dOpenTable, { w: 862 })
  let pl = players[plname];
  natPresentMarket(dOpenTable, fen.market, 163);
  mDom(dOpenTable, { h: 10, w: '100%' })
  await natPresentCiv(dOpenTable, pl, .98);
  natStats(fen, plname, dOben)
}
async function natPresentCiv(dParent, pl, fact) {
  let [w, h] = [800 * fact, 420 * fact];
  let dciv = mDom(dParent, { w: w, h: h, maleft: 56, bg: 'red', position: 'relative' });
  let iciv = await loadImageAsync(`../assets/games/nations/civs/civ_${pl.civ}.png`, mDom(dciv, { w: w, h: h, position: 'absolute' }, { tag: 'img' }));
  M.civCells = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 7; j++) {
      let r = getCivSpot(pl.civ, i, j, fact);
      let [dx, dy, dw, dh] = [10, 10, 15, 20].map(x => x * fact)
      let d = mDom(dciv, { box: true, w: r.w + dw, h: r.h + dh, left: r.x - dx, top: r.y - dy, position: 'absolute', overflow: 'hidden' });
      mCenterCenterFlex(d);
      M.civCells.push(d);
    }
  }
}
function natPresentMarket(dParent, market, h) {
  let d1 = mDiv(dParent); mFlex(d1);
  let [rows, cols] = [3, market.length / 3];
  let fact = 1.565; let w = h / fact;
  let dcost = mGrid(rows, 1, d1, { 'align-self': 'start' });
  for (let cost = 3; cost >= 1; cost--) {
    let d2 = mDom(dcost, { display: 'flex', 'justify-content': 'center', 'flex-flow': 'column', box: true, margin: 2, h: h, overflow: 'hidden' }, {});
    for (let i = 0; i < cost; i++) mDom(d2, { h: 40 }, { tag: 'img', src: `../assets/games/nations/templates/gold.png` });
  }
  let grid = mGrid(rows, cols, d1, { 'align-self': 'start' });
  let cells = [];
  for (let i = 0; i < rows * cols; i++) {
    let d = mDom(grid, { box: true, vmargin: 2, hmargin: 5, h: h, w: w, overflow: 'hidden' });
    mCenterCenterFlex(d);
    cells.push(d);
  }
  let n = rows * cols;
  for (let i = 0; i < n; i++) {
    let k = market[i];
    if (k == '_') continue;
    let img = mDom(cells[i], { h: h, w: w }, { tag: 'img', src: `../assets/games/nations/cards/${k}.png` });
    img.setAttribute('key', k)
  }
}
function natSelectedGrowth(ev) {
  let [A, fen] = [Clientdata.A, Clientdata.fen];
  let id = evToId(ev)
  A.selected = A.di[id];
  console.log('selects', A.selected);
  sendMyMove(A.selected.key)
}
function natSelItemsGrowth() {
  let fen = Clientdata.fen; let pl = fen.players[U.name]; assertion(pl, `PLAYER DOES NOT EXIST ${U.name}`);
  let items = [], i = 0;
  for (const cmd of ['gold', 'food', 'stone', 'book']) {
    let item = { o: M.superdi[cmd], a: cmd, key: cmd, friendly: cmd, path: null, index: i }; // src: `../assets/games/nations/templates/${cmd}.${cmd=='book'?'svg':'png'}`, index: i };
    i++;
    items.push(item);
  }
  let w = pl.extraWorkers;
  if (!isEmpty(w)) {
    let wWoDuplicates = arrRemoveDuplicates(w);
    for (const w1 of wWoDuplicates) {
      let item = uiTypeExtraWorker(w1); items.push(item); item.index = i++;
    }
  }
  return items;
}
function natStats(fen, pl, dParent) {
  let player_stat_items = uiTypePlayerStats(fen, pl, dParent, {}, { wmin: 260, bg: 'beige', fg: 'contrast' })
  for (const plname in fen.players) {
    let pl1 = fen.players[plname];
    let item = player_stat_items[plname];
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d);
    playerStatCount('military', pl1.military, d);
    playerStatCount('stability', pl1.stability, d);
    playerStatCount('gold', pl1.gold, d);
    playerStatCount('food', pl1.food, d);
    playerStatCount('stone', pl1.stone, d);
    playerStatCount('book', pl1.book, d);
    playerStatCount('VP', pl1.vp, d);
    playerStatCount('worker', pl1.workers, d);
    mDom(d, { h: 6, w: '100%' });
    mDom(d, { family: 'algerian' }, { html: `${pl1.civ}` })
    if (fen.turn.includes(plname)) {
      show_hourglass(plname, d, 30, { left: -3, top: 0 }); //'calc( 50% - 36px )' });
    }
    mDom(d, { position: 'absolute', top: 0 }, { html: pl1.level })
  }
}
function natTitle() {
  mClear(dTitle);
  mStyle(dTitle, { display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', box: true, h: 42, w: '100%' })
  mDom(dTitle, { display: 'flex', 'justify-content': 'space-evenly', 'align-items': 'center', paleft: 10 }, { id: 'dTitleLeft' })
  mDom(dTitle, {}, { id: 'dTitleMiddle' })
  mDom(dTitle, { display: 'flex', 'justify-content': 'end', 'align-items': 'center', box: true, wmin: 200 }, { id: 'dTitleRight' })
}
