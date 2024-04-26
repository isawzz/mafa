function _cloneIfNecessary(value, optionsArgument) {
  var clone = optionsArgument && optionsArgument.clone === true
  return (clone && _isMergeableObject(value)) ? deepmerge(_emptyTarget(value), value, optionsArgument) : value
}
function _deepMerge(target, source, optionsArgument) {
  var array = Array.isArray(source);
  var options = optionsArgument || { arrayMerge: _defaultArrayMerge }
  var arrayMerge = options.arrayMerge || _defaultArrayMerge
  if (array) {
    return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : _cloneIfNecessary(source, optionsArgument)
  } else {
    return _mergeObject(target, source, optionsArgument)
  }
}
function _defaultArrayMerge(target, source, optionsArgument) {
  var destination = target.slice()
  source.forEach(function (e, i) {
    if (typeof destination[i] === 'undefined') {
      destination[i] = _cloneIfNecessary(e, optionsArgument)
    } else if (_isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument)
    } else if (target.indexOf(e) === -1) {
      destination.push(_cloneIfNecessary(e, optionsArgument))
    }
  })
  return destination
}
function _deqSound() {
  let key = _qSound.shift();
  let url = _audioSources[key];
  _sndPlayer = new Audio(url);
  _sndPlayer.onended = _whenSoundPaused;
  _sndPlayer.onloadeddata = () => { _loaded = true; _sndPlayer.play(); };
  _sndPlayer.load();
}
function _emptyTarget(val) {
  return Array.isArray(val) ? [] : {}
}
function _isMergeableObject(val) {
  var nonNullObject = val && typeof val === 'object'
  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]'
}
function _mergeObject(target, source, optionsArgument) {
  var destination = {}
  if (_isMergeableObject(target)) {
    Object.keys(target).forEach(function (key) {
      destination[key] = _cloneIfNecessary(target[key], optionsArgument)
    })
  }
  Object.keys(source).forEach(function (key) {
    if (!_isMergeableObject(source[key]) || !target[key]) {
      destination[key] = _cloneIfNecessary(source[key], optionsArgument)
    } else {
      destination[key] = _deepMerge(target[key], source[key], optionsArgument)
    }
  })
  return destination;
}
function _overwriteMerge(destinationArray, sourceArray, options) { return sourceArray }
function _poll() {
  if (nundef(U) || nundef(Z) || nundef(Z.friendly)) { console.log('poll without U or Z!!!', U, Z); return; }
  show_polling_signal();
  if (nundef(DA.pollCounter)) DA.pollCounter = 0; DA.pollCounter++; console.log('polling');
  if (Z.game == 'feedback' && i_am_host()) {
    send_or_sim({ friendly: Z.friendly, uname: Z.uplayer, fen: Z.fen, write_fen: true, auto: true }, 'table');
  } else send_or_sim({ friendly: Z.friendly, uname: Z.uplayer, auto: true }, 'table');
}
function _simpleOptions(options = {}, defsOuter = {}) {
  options.showPic = valf(options.showPic, isdef(options.fzPic));
  options.showLabels = isdef(options.fz);
  options.szPic = { w: options.w, h: options.h };
  options.fzText = options.fz;
  if (nundef(options.rounding)) options.rounding = 4;
  if (nundef(options.margin)) options.margin = 4;
  if (nundef(options.padding)) options.padding = 0;
  if (nundef(options.labelStyles)) options.labelStyles = {};
  if (options.showLabels) { if (nundef(options.labelPos)) options.labelBottom = true; options.labelStyles.fz = options.fzText; }
  options.picStyles = { fz: options.fzPic };
  let [w, h] = [options.szPic.w, options.szPic.h];
  options.outerStyles = {
    w: w, h: h, bg: options.bg, fg: options.fg,
    display: 'inline-flex', 'flex-direction': 'column',
    'justify-content': 'center', 'align-items': 'center', 'vertical-align': 'top',
    padding: 0, box: true, margin: options.margin, rounding: options.rounding,
  };
  if (isdef(defsOuter)) addKeys(defsOuter, options.outerStyles);
  return options;
}
function _start_game(gamename, players, options) { }
async function _switchToOtherUser(name1,name2) {
  let uname = await mGetRoute('otherUser',{name1,name2});
  await switchToUser(uname);
}
function _whenSoundPaused() {
  _sndPlayer = null;
  _sndPlayerIdle = true;
  _loaded = false;
  if (!isEmpty(_qSound)) { _deqSound(); } else { _idleSound = true; }
}
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
function add_card_to_group(card, oldgroup, oldindex, targetcard, targetgroup) {
  card.groupid = targetgroup.id;
  if (card.source == 'hand') {
    let hand = UI.players[Z.uplayer].hand;
    removeInPlace(hand.items, card);
  }
  card.source = 'group';
  mDroppable(iDiv(card), drop_card_fritz, dragover_fritz);
  if (nundef(targetcard)) {
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
function add_new_user(udata, save = true) {
  console.log('WILL NOT ADD NEW USERS AT THIS TIME!!!', udata); return;
  console.assert(isDict(udata) && isdef(udata.name) && isString(udata.name) && udata.name.length < 50, 'CANNOT ADD THIS WEIRED USER ' + udata.name);
  DB.users[udata.name] = udata;
  if (save) db_save();
  return udata;
}
async function add_users_to_sql_db(not_in_sql_db) { to_server(not_in_sql_db, 'add_users'); }
function addAREA(id, o) {
  if (AREAS[id]) {
    error('AREAS ' + id + ' exists already!!! ');
    error(o);
    return;
  }
  AREAS[id] = o;
}
function addBadge(dParent, level, clickHandler, animateRubberband = false) {
  let fg = '#00000080';
  let textColor = 'white';
  let isText = true; let isOmoji = false;
  let i = level - 1;
  let key = levelKeys[i];
  let k = replaceAll(key, ' ', '-');
  let item = getItem(k);
  let label = item.label = "level " + i;
  let h = window.innerHeight;
  let sz = h / 14;
  let options = _simpleOptions({ w: sz, h: sz, fz: sz / 4, fzPic: sz / 2, bg: levelColors[i], fg: textColor });
  options.handler = clickHandler;
  let d = makeItemDiv(item, options);
  mAppend(dParent, d);
  item.index = i;
  badges.push(item);
  return arrLast(badges);
}
function addDummy(dParent, place) {
  let b = mButton('', null, dParent, { opacity: 0, h: 0, w: 0, padding: 0, margin: 0, outline: 'none', border: 'none', bg: 'transparent' });
  if (isdef(place)) mPlace(b, place);
  b.id = 'dummy';
}
function addEditable(dParent, styles = {}, opts = {}) {
  addKeys({ tag: 'input', classes: 'plain' }, opts)
  addKeys({ wmax: '90%', box: true }, styles);
  let x = mDom(dParent, styles, opts);
  x.focus();
  x.addEventListener('keyup', ev => {
    if (ev.key == 'Enter') {
      mDummyFocus();
      if (isdef(opts.onEnter)) opts.onEnter(ev)
    }
  });
  return x;
}
function addIf(arr, el) { if (!arr.includes(el)) arr.push(el); }
function addKeys(ofrom, oto) { for (const k in ofrom) if (nundef(oto[k])) oto[k] = ofrom[k]; return oto; }
function addPeepToCrowd() {
  const peep = removeRandomFromArray(availablePeeps)
  const walk = getRandomFromArray(walks)({
    peep,
    props: resetPeep({
      peep,
      stage,
    })
  }).eventCallback('onComplete', () => {
    removePeepFromCrowd(peep)
    addPeepToCrowd()
  })
  peep.walk = walk
  crowd.push(peep)
  crowd.sort((a, b) => a.anchorY - b.anchorY)
  return peep
}
function addToolX(cropper, d) {
  let img = cropper.img;
  function createCropTool() {
    let rg = mRadioGroup(d, {}, 'rSizes', 'Select crop area: '); mClass(rg, 'input');
    let handler = cropper.setSize;
    mRadio('manual', [0, 0], 'rSizes', rg, {}, handler, 'rSizes', true)
    let [w, h] = [img.offsetWidth, img.offsetHeight];
    if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, handler, 'rSizes', false)
    else {
      let [w1, h1] = [w, w / .7];
      let [w2, h2] = [h * .7, h];
      if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, handler, 'rSizes', false)
      else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, handler, 'rSizes', false)
    }
    if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, handler, 'rSizes', false)
    else {
      let [w1, h1] = [w, w * .7];
      let [w2, h2] = [h / .7, h];
      if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, handler, 'rSizes', false)
      else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, handler, 'rSizes', false)
    }
    mDom(rg, { fz: 14, margin: 12 }, { html: '(or use mouse to select)' });
    return rg;
  }
  function createSquareTool() {
    let rg = mRadioGroup(d, {}, 'rSquare', 'Resize (cropped area) to height: '); mClass(rg, 'input');
    let handler = x => squareTo(cropper, x);
    mRadio(`${'just crop'}`, 0, 'rSquare', rg, {}, cropper.crop, 'rSquare', false)
    for (const h of [128, 200, 300, 400, 500, 600, 700, 800]) {
      mRadio(`${h}`, h, 'rSquare', rg, {}, handler, 'rSquare', false)
    }
    return rg;
  }
  let rgCrop = createCropTool();
  let rgResize = createSquareTool();
}
function adjustComplex(panData) {
  let [x0, y0] = [panData.posStart.x, panData.posStart.y];
  let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];
  let [wImg, hImg] = [panData.img.width, panData.img.height];
  let ideal = panData.cropStartSize.w;
  let [cx0, cy0] = [panData.cropStartPos.l + ideal / 2, panData.cropStartPos.t + ideal / 2];
  let [cx, cy] = [cx0 + dx, cy0 + dy];
  cx = clamp(cx, ideal / 2, wImg - ideal / 2); cy = clamp(cy, ideal / 2, hImg - ideal / 2); 
  let lNew = clamp(cx - ideal / 2, 0, wImg); 
  let tNew = clamp(cy - ideal / 2, 0, hImg); 
  let rNew = clamp(cx + ideal / 2, 0, wImg); 
  let bNew = clamp(cy + ideal / 2, 0, hImg); 
  let wNew = Math.min(Math.abs(cx - lNew) * 2, Math.abs(rNew - cx) * 2);
  let hNew = Math.min(Math.abs(cy - tNew) * 2, Math.abs(bNew - cy) * 2); 
  mStyle(panData.dCrop, { left: cx - wNew / 2, top: cy - hNew / 2, w: wNew, h: hNew });
}
function adjustCropper(img, dc, sz) {
  let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
  let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
  mStyle(dc, { left: cx - radx, top: cy - rady, w: sz, h: sz });
}
function adjustCropperBy(dc, x, y, dx, dy, wImg, hImg, szIdeal) {
  console.log('_________\ndx', dx, 'dy', dy)
  if (nundef(wImg)) {
    mStyle(dc, { left: x + dx, top: y + dy }); //,w:sz,h:sz});
    return;
  }
  console.log('image sz', wImg, hImg)
  let [l, t, w, h] = [mGetStyle(dc, 'left'), mGetStyle(dc, 'top'), mGetStyle(dc, 'w'), mGetStyle(dc, 'h')]; console.log('dims', l, t, w, h);
  let [cx, cy] = [l + w / 2, t + h / 2];
  let [cxNew, cyNew] = [cx + dx, cy + dy]; console.log('new center', cxNew, cyNew)
  let newDist = Math.min(cxNew, cyNew, wImg - cxNew, hImg - cyNew); console.log('newDist', newDist)
  let wNew = Math.min(szIdeal, newDist * 2);
  let hNew = Math.min(szIdeal, newDist * 2);
  let xNew = cxNew - wNew / 2;
  let yNew = cyNew - hNew / 2;
  mStyle(dc, { left: xNew, top: yNew, w: wNew, h: hNew }); //,w:sz,h:sz});
}
function adjustCropperBySimple(dc, x, y, dx, dy) { mStyle(dc, { left: x + dx, top: y + dy }); }
function agColoredShape(g, shape, w, h, color) {
  SHAPEFUNCS[shape](g, w, h);
  gBg(g, color);
}
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
function ai_move(ms = 100) {
  DA.ai_is_moving = true;
  let [A, fen] = [valf(Z.A, {}), Z.fen];
  let selitems;
  if (Z.game == 'ferro') {
    if (Z.stage == 'card_selection') {
      let uplayer = Z.uplayer;
      let i1 = firstCond(A.items, x => x.path.includes(`${uplayer}.hand`));
      let i2 = firstCond(A.items, x => x.key == 'discard');
      selitems = [i1, i2];
    } else if (Z.stage == 'buy_or_pass') {
      selitems = [A.items[1]];
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
    selitems = [];
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
function ai_pick_legal_exchange() {
  let [A, fen, uplayer, items] = [Z.A, Z.fen, Z.uplayer, Z.A.items];
  let firstPick = rChoose(items, 1, x => x.path.includes('building'));
  let secondPick = rChoose(items, 1, x => !x.path.includes('building'));
  return [firstPick, secondPick];
}
function ai_pick_legal_trade() {
  let [A, fen, uplayer, items] = [Z.A, Z.fen, Z.uplayer, Z.A.items];
  let stall = fen.players[uplayer].stall;
  let firstPick = rChoose(items, 1, x => x.path.includes(uplayer));
  let secondPick = rChoose(items, 1, x => !x.path.includes(uplayer));
  return [firstPick, secondPick];
}
function allCondDict(d, func) {
  let res = [];
  for (const k in d) { if (func(d[k])) res.push(k); }
  return res;
}
function allNumbers(s) {
  let m = s.match(/\-.\d+|\-\d+|\.\d+|\d+\.\d+|\d+\b|\d+(?=\w)/g);
  if (m) return m.map(v => +v); else return null;
}
function allow_polling() { IS_POLLING_ALLOWED = true; if (isdef(DA.poll)) poll(); }
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
function animate(elem, aniclass, timeoutms) {
  mClass(elem, aniclass);
  TOMan.TO.anim = setTimeout(() => mRemoveClass(elem, aniclass), timeoutms);
}
function animatedTitle(msg = 'DU BIST DRAN!!!!!') {
  TO.titleInterval = setInterval(() => {
    let corner = CORNERS[WhichCorner++ % CORNERS.length];
    document.title = `${corner} ${msg}`;
  }, 1000);
}
function annotate(sp) {
  for (const k in sp) {
    let node = sp[k];
    node.pool = [];
    let pool = makePool(node);
    for (const oid in pool) {
      let o = pool[oid];
      if (!evalCond(o, node)) continue;
      if (nundef(o.RSG)) o.RSG = {};
      let rsg = o.RSG;
      rsg[k] = true;
      node.pool.push(oid);
    }
  }
}
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
function applyColorkey(item) {
  let l = item.live;
  let sShade = '0 0 0 ' + item.textShadowColor;
  item.shadeStyles = { 'text-shadow': sShade, fg: colorFrom('black', l.options.contrast) };
  let ui = l.options.showPic ? l.dPic : l.dLabel;
  mStyleX(ui, item.shadeStyles);
}
function ari_get_card(ckey, h, w, ov = .3) {
  let type = ckey[2];
  let sz = { largecard: 100, smallcard: 50 };
  let info = type == 'n' ? to_aristocard(ckey, sz.largecard) : type == 'l' ? to_luxurycard(ckey, sz.largecard) : type == 'r' ? to_rumorcard(ckey, sz.smallcard) : to_commissioncard(ckey, sz.smallcard);
  let card = cardFromInfo(info, h, w, ov);
  if (type == 'l') luxury_card_deco(card);
  return card;
}
function ari_history_list(lines, title = '', fen) {
  if (nundef(fen)) fen = Z.fen;
  if (nundef(fen.history)) fen.history = [];
  fen.history.push({ title: title, lines: lines });
}
function ari_make_selectable(item, dParent, dInstruction) {
  let A = Z.A;
  switch (item.itemtype) {
    case 'card': make_card_selectable(item); break;
    case 'container': make_container_selectable(item); break;
    case 'string': make_string_selectable(item); break;
  }
}
function ari_make_selected(item) {
  let A = Z.A;
  switch (item.itemtype) {
    case 'card': make_card_selected(item); break;
    case 'container': make_container_selected(item); break;
    case 'string': make_string_selected(item); break;
  }
}
function ari_make_unselectable(item) {
  let A = Z.A;
  switch (item.itemtype) {
    case 'card': make_card_unselectable(item); break;
    case 'container': make_container_unselectable(item); break;
    case 'string': make_string_unselectable(item); break;
  }
}
function ari_make_unselected(item) {
  let A = Z.A;
  switch (item.itemtype) {
    case 'card': make_card_unselected(item); break;
    case 'container': make_container_unselected(item); break;
    case 'string': make_string_unselected(item); break;
  }
}
function arrAllSameOrDifferent(arr) {
  if (arr.length === 0) {
    return true; 
  }
  const allSame = arr.every(element => element === arr[0]);
  if (allSame) {
    return true;
  }
  const uniqueElements = new Set(arr);
  const allDifferent = uniqueElements.size === arr.length;
  return allDifferent;
}
function arrAverage(arr, prop) {
  let n = arr.length; if (!n) return 0;
  let sum = arrSum(arr, prop);
  return sum / n;
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
function arrClear(arr) { arr.length = 0; return arr; }
function arrCycle(arr, count) { return arrRotate(arr, count); }
function arrLast(arr) { return arr.length > 0 ? arr[arr.length - 1] : null; }
function arrMax(arr, f) { return arrMinMax(arr, f).max; }
function arrMinMax(arr, func) {
  if (nundef(func)) func = x => x;
  else if (isString(func)) { let val = func; func = x => x[val]; }
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
function arrMinus(arr, b) { if (isList(b)) return arr.filter(x => !b.includes(x)); else return arr.filter(x => x != b); }
function arrNext(list, el) {
  let iturn = list.indexOf(el);
  let nextplayer = list[(iturn + 1) % list.length];
  return nextplayer;
}
function arrRange(from = 1, to = 10, step = 1) { let res = []; for (let i = from; i <= to; i += step)res.push(i); return res; }
function arrRemoveDuplicates(arr) { return Array.from(new Set(arr)); }
function arrRemovip(arr, el) {
  let i = arr.indexOf(el);
  if (i > -1) arr.splice(i, 1);
  return i;
}
function arrRepeat(n, el) { let res = []; for (let i = 0; i < n; i++) res.push(el); return res; }
function arrReplace1(arr, elweg, eldazu) {
  let i = arr.indexOf(elweg);
  arr[i] = eldazu;
  return arr;
}
function arrRotate(arr, count) {
  var unshift = Array.prototype.unshift,
    splice = Array.prototype.splice;
  var len = arr.length >>> 0, count = count >> 0;
  let arr1 = jsCopy(arr);
  unshift.apply(arr1, splice.call(arr1, count % len, len));
  return arr1;
}
function arrShuffle(arr) { if (isEmpty(arr)) return []; else return fisherYates(arr); }
function arrSplitAtIndex(arr, i) {
  return [arr.slice(0, i), arr.slice(i)];
}
function arrSum(arr, props) {
  if (nundef(props)) return arr.reduce((a, b) => a + b);
  if (!isList(props)) props = [props];
  return arr.reduce((a, b) => a + (lookup(b, props) || 0), 0);
}
function arrTake(arr, n = 0, from = 0) {
  if (isDict(arr)) {
    let keys = Object.keys(arr);
    return n > 0 ? keys.slice(from, from + n).map(x => (arr[x])) : keys.slice(from).map(x => (arr[x]));
  } else return n > 0 ? arr.slice(from, from + n) : arr.slice(from);
}
function arrTakeFromTo(arr, a, b) { return takeFromTo(arr, a, b); }
function arrTakeWhile(arr, func) {
  let res = [];
  for (const a of arr) {
    if (func(a)) res.push(a); else break;
  }
  return res;
}
function arrWithout(arr, b) { return arrMinus(arr, b); }
function assertion(cond) {
  if (!cond) {
    let args = [...arguments];
    for (const a of args) {
      console.log('\n', a);
    }
    throw new Error('TERMINATING!!!')
  }
}
function assets_parse(o) {
  where(o);
  for (const k in o) {
    let text = o[k];
    if (k == 'allSyms') {
      symbolDict = Syms = jsyaml.load(text);
      SymKeys = Object.keys(Syms);
    } else if (k == 'symGSG') {
      ByGroupSubgroup = jsyaml.load(text);
    } else if (k == 'allWP') {
      WordP = jsyaml.load(text);
    } else if (k == 'fens') {
      FenPositionList = csv2list(text);
    } else if (k.startsWith('db_')) {
      let okey = stringAfter(k, '_');
      DB[okey] = jsyaml.load(text);
    } else {
      window[capitalize(k)] = jsyaml.load(text);
    }
  }
  if (nundef(KeySets) && isdef(o.symGSG)) { KeySets = getKeySets(); }
}
function autopoll(ms) { TO.poll = setTimeout(_poll, valf(ms, valf(Z.options.poll, 2000))); }
function badges_off() {
  hide('dLeftSide');
  delete Session.is_badges;
  Badges = [];
}
function beautify_history(lines, title, fen, uplayer) {
  let html = `<div class="history"><span style="color:red;font-weight:bold;">${title}: </span>`;
  for (const l of lines) {
    let words = toWords(l);
    for (const w1 of words) {
      if (is_card_key(w1)) {
        html += mCardText(w1);
        continue;
      }
      w = w1.toLowerCase();
      if (isdef(fen.players[w])) {
        html += `<span style="color:${get_user_color(w)};font-weight:bold"> ${w} </span>`;
      } else html += ` ${w} `;
    }
  }
  html += "</div>";
  return html;
}
function bestContrastingColor(color, colorlist = ['white', 'black']) {
  let contrast = 0;
  let result = null;
  let rgb = colorRGB(color, true);
  rgb = [rgb.r, rgb.g, rgb.b];
  for (c1 of colorlist) {
    let x = colorRGB(c1, true)
    x = [x.r, x.g, x.b];
    let c = getContrast(rgb, x);
    if (c > contrast) { contrast = c; result = c1; }
  }
  return result;
}
function bid_to_string(bid) { return bid.join(' '); }
function buyProgressCard(ev) {
  let o = evToAttrElem(ev, 'key');
  console.log('player buys', o.val);
  o.elem.remove();
  let spot = M.selectedCivSpot
  if (isdef(spot)) {
    spot.innerHTML = '';
    let [w, h] = [mGetStyle(spot, 'w'), mGetStyle(spot, 'h')];
    mAppend(spot, o.elem);
    mStyle(o.elem, { h: h, w: w });
    o.elem.onclick = () => selectCivSpot(spot)
    mClassRemove(M.selectedCivSpot, 'shadow');
    M.selectedCivSpot = null;
  }
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
function calc_fritz_score() {
  let [round, plorder, stage, A, fen, uplayer] = [Z.round, Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer];
  for (const plname of fen.roundorder) {
    let pl = fen.players[plname];
    if (nundef(pl.score)) pl.score = 0;
    else pl.score += calc_hand_value(pl.hand.concat(pl.loosecards), fritz_get_card);
  }
}
function calc_hand_value(hand, card_func = ferro_get_card) {
  let vals = hand.map(x => card_func(x).val);
  let sum = vals.reduce((a, b) => a + b, 0);
  return sum;
}
function calcBotLevel(table) {
  let humanPlayers = dict2list(table.fen.players).filter(x => x.playmode == 'human');
  if (isEmpty(humanPlayers) || getGameOption('use_level') == 'no') return null;
  let level = arrAverage(humanPlayers, 'level');
  return level;
}
function calcBotSpeed(table) {
  let speed = 2000 + Math.round(Math.random() * 2000); 
  let botLevel = calcBotLevel(table);
  return botLevel ? botLevel == 1 ? speed : speed * 4 / botLevel : speed;
}
function canAct() { return (aiActivated || uiActivated) && !auxOpen; }
function cancel_game() { iClear('dMenu'); }
function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function cardFromInfo(info, h, w, ov) {
  let svgCode = C52[info.c52key];
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
function cardRect(ctx, x, y, color) {
  let dark = '#635651';
  let light = '#D9C7BD';
  delta = 20;
  let ybar = y + 33;
  let o = findNextBar(ctx, x, x + 100, ybar, ybar + 20, color, 10);
  if (nundef(o)) o = findNextBar(ctx, x, x + 100, ybar, ybar + 20, color, 15);
  console.log('bar', o);
  let xnew = o.x;
  let o1 = findNextBar(ctx, xnew, xnew + 20, ybar, ybar + 20, dark, delta);
  if (nundef(o1)) o1 = findNextBar(ctx, xnew, xnew + 20, ybar, ybar + 20, dark, delta + 10);
  console.log('dark', o1)
  let xx = o1.x + 30;
  let o2 = findNextBar(ctx, xx, xx + 100, ybar, ybar + 20, color, delta);
  console.log('bar', o2)
  let xline = x + 33;
  let o3 = findNextLine(ctx, xline, xline + 20, y, y + 100, color)
  if (nundef(o3)) o3 = findNextLine(ctx, xline, xline + 20, y, y + 100, color, delta)
  console.log('line', o3)
  let ynew = o3.y;
  let o4 = findNextLine(ctx, xline, xline + 20, ynew, ynew + 20, dark, delta)
  if (nundef(o4)) o4 = findNextLine(ctx, xline, xline + 20, ynew, ynew + 20, dark, delta + 10)
  console.log('line', o4)
  ynew = o4.y + 80;
  let o5 = findNextLine(ctx, xline, xline + 20, ynew, ynew + 100, color)
  console.log('line', o5)
  return { x: o1.x, y: o4.y, w: o2.x - o1.x, h: o5.y - o4.y };
}
function cBlank(dParent, styles = {}, opts = {}) {
  if (nundef(styles.h)) styles.h = valf(styles.sz, 100);
  if (nundef(styles.w)) styles.w = styles.h * .7;
  if (nundef(styles.bg)) styles.bg = 'white';
  styles.position = 'relative';
  if (nundef(styles.rounding)) styles.rounding = Math.min(styles.w, styles.h) * .05;
  addKeys({ className: 'card' }, opts);
  let d = mDom(dParent, styles, opts);
  opts.type = 'card';
  addKeys(styles, opts);
  let item = mItem(d ? { div: d } : {}, opts);
  return item;
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
function check_poll_table_seen(obj) {
  console.assert(isdef(obj.table), 'check_poll_table_seen NO TABLE!!!!');
  let t = obj.table;
  if (t.status == 'seen' || t.status == 'past') {
    DA.poll.onsuccess(obj);
  } else {
    TOTicker = setTimeout(poll, DA.poll.ms);
  }
}
function check_poll_table_show(obj) {
  if (isdef(obj) && !isEmpty(obj.table) && obj.table.status == 'show') {
    DA.poll.onsuccess(obj);
  } else {
    TOTicker = setTimeout(poll, DA.poll.ms);
  }
}
function check_poll_table_started(obj) {
  if (isdef(obj) && !isEmpty(obj.tables)) {
    DA.poll.onsuccess(obj);
  } else {
    let dcheck = document.getElementById('ddd_logout');
    if (!dcheck) {
      present_non_admin_waiting_screen();
    }
    TOTicker = setTimeout(poll, DA.poll.ms);
  }
}
function checkInterrupt(items) {
  return isdef(T) && items[0] == T.items[0] && isdef(DA.Tprev) && T.items[0] == DA.Tprev.items[0];
}
function checkToInput(ev, inp, grid) {
  let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
  let names = checklist.filter(x => x.checked).map(x => x.name);
  sortCheckboxes(grid);
  names.sort();
  inp.value = names.join(', ') + ', ';
}
function choose(arr, n, excepti) { return rChoose(arr, n, null, excepti); }
function chooseRandom(arr) { return rChoose(arr); }
function clamp(x, min, max) { return Math.min(Math.max(x, min), max); }
function cLandscape(dParent, styles = {}, opts = {}) {
  if (nundef(styles.w)) styles.w = 100;
  if (nundef(styles.h)) styles.h = styles.w * .65;
  return cBlank(dParent, styles, opts);
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
function clear_screen() { mShieldsOff(); clear_status(); clear_title(); for (const ch of arrChildren('dScreen')) mClear(ch); mClassRemove('dTexture', 'wood'); mStyle(document.body, { bg: 'white', fg: 'black' }); }
function clear_selection() {
  let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
  if (nundef(Z.A) || isEmpty(A.selected)) return;
  let selitems = A.selected.map(x => A.items[x]);
  for (const item of selitems) { ari_make_unselected(item); }
  A.selected = [];
}
function clear_status() { if (nundef(mBy('dStatus'))) return; clearTimeout(TO.fleeting); mRemove("dStatus"); }
function clear_table_all() {
  clear_table_events();
  if (isdef(mBy('table'))) clearEvents();
  resetUIDs();
  Items = {};
}
function clear_table_events() {
  clear_timeouts();
  STOPAUS = true;
  pauseSound();
  DELAY = 1000;
  uiActivated = aiActivated = false;
  onclick = null;
  clearMarkers();
}
function clear_timeouts() {
  for (const k in TO) clearTimeout(TO[k]);
  stop_simple_timer();
}
function clear_title() { mClear('dTitleMiddle'); mClear('dTitleLeft'); mClear('dTitleRight'); }
function clear_transaction() { DA.simulate = false; DA.transactionlist = []; }
function clearBodyDiv(styles = {}, opts = {}) { document.body.innerHTML = ''; return mDom(document.body, styles, opts) }
function clearCell(cell) { mClear(cell); mStyle(cell, { opacity: 0 }); }
function clearElement(elem) {
  if (isString(elem)) elem = document.getElementById(elem);
  if (window.jQuery == undefined) { elem.innerHTML = ''; return elem; }
  while (elem.firstChild) {
    $(elem.firstChild).remove();
  }
  return elem;
}
function clearEvents() { 
  for (const k in TO) {clearTimeout(TO[k]);TO[k]=null;} 
  for (const k in ANIM) {if (isdef(ANIM[k])) ANIM[k].cancel();ANIM[k]=null;} 
}
function clearFleetingMessage() {
  if (isdef(dFleetingMessage)) {
    dFleetingMessage.remove();
    dFleetingMessage = null;
  }
}
function clearMain() { DA.counter = 0; clearEvents(); mClear('dMain'); mClear('dTitle'); }
function clearMarkers() {
  for (const m of Markers) {
    mRemove(m);
  }
  Markers = [];
}
function clearParent(ev) { mClear(ev.target.parentNode); }
function clearTimeouts() {
  onclick = null;
  clearTimeout(TOMain);
  clearTimeout(TOFleetingMessage);
  clearTimeout(TOTrial);
  if (isdef(TOList)) { for (const k in TOList) { TOList[k].map(x => clearTimeout(x)); } }
}
function clearZones() {
  for (const k in Zones) {
    clearElement(Zones[k].dData);
  }
}
async function clickFirstTable() {
  let table = Serverdata.tables.find(x => x.status == 'started' && x.playerNames.includes(getUname()));
  if (table) { await onclickTable(table.id); return Clientdata.table; }
}
function clickOnElemWithAttr(prop, val) {
  let d = document.querySelectorAll(`[${prop}="${val}"]`)[0];
  if (isdef(d)) d.click();
  return d;
}
async function clickOnGame(gamename) { await showGameMenu(gamename); }
async function clickOnItem(elem, key) {
  if (nundef(UI.selectedImages)) UI.selectedImages = [];
  let collname = elem.getAttribute('collname');
  let selist = UI.selectedImages;
  let selkey = collGenSelkey(key, collname); 
  toggleSelectionOfPicture(elem, selkey, UI.selectedImages);
  if (isEmpty(selist)) { collDisableListCommands(); collDisableItemCommands(); }
  else if (selist.length == 1) { collEnableListCommands(); collEnableItemCommands(); }
  else { collDisableItemCommands(); collEnableListCommands(); }
}
async function clickOnPlayer(name) { return await showGameMenuPlayerDialog(name); }
function cloneIfNecessary(value, optionsArgument) {
  var clone = optionsArgument && optionsArgument.clone === true
  return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}
function close_sidebar() {
  let d = mBy('left_panel'); d.style.flex = 0;
  DA.left_panel = 'closed';
}
function closeApps() {
  if (isdef(DA.calendar)) { closePopup(); delete DA.calendar; }
  mClear('dMain');
  mClear(dTitle);
}
function closeLeftSidebar() { mClear('dLeft'); mStyle('dLeft', { w: 0, wmin: 0 }) }
function closePopup(name = 'dPopup') { if (isdef(mBy(name))) mBy(name).remove(); }
function cmdDisable(cmd) { mClass(iDiv(cmd), 'disabled') }
function cmdEnable(cmd) { mClassRemove(iDiv(cmd), 'disabled') }
function cNumber(ckey, styles = {}, opts = {}) { 
  addKeys({ border: 'silver', h: 100 }, styles);
  addKeys({ backcolor: BLUE, ov: .3, key: ckey, type: 'num' }, opts);
  let c = cPortrait(null, styles, opts); 
  let sym = c.rank = stringBefore(ckey, '_');
  let color = c.suit = c.val = stringAfter(ckey, '_');
  let sz = c.h;
  let [sm, lg, w, h] = [sz / 8, sz / 4, c.w, c.h];
  let styleSmall = { fg: color, h: sm, fz: sm, hline: sm, weight: 'bold' };
  cPrintSym(c, sym, styleSmall, 'tl')
  cPrintSym(c, sym, styleSmall, 'tr')
  styleSmall.transform = 'rotate(180deg)';
  cPrintSym(c, sym, styleSmall, 'bl')
  cPrintSym(c, sym, styleSmall, 'br')
  let styleBig = { matop: (h - lg) / 2, family: 'algerian', fg: color, fz: lg, h: lg, w: w, hline: lg, align: 'center' }
  styleBig = { display: 'inline', family: 'algerian', fg: color, fz: lg, hline: lg }
  cPrintSym(c, sym, styleBig, 'cc')
  return c;
}
async function codebaseExtendFromProject(project) {
  let globlist = await codeParseFile('../basejs/allghuge.js');
  let funclist = await codeParseFile('../basejs/allfhuge.js');
  let list = globlist.concat(funclist);
  let bykey = list2dict(list, 'key');
  let bytype = {};
  for (const k in bykey) { let o = bykey[k]; lookupAddIfToList(bytype, [o.type], o); }
  let htmlFile = `../${project}/index.html`;
  let html = await route_path_text(htmlFile);
  html = removeCommentLines(html, '<!--', '-->');
  let dirhtml = `../${project}`;
  let files = extractFilesFromHtml(html, htmlFile);
  files = files.filter(x => !x.includes('../all'));
  console.log('files', files)
  let [globtext, functext, functextold] = await codebaseFromFiles(files, bykey, bytype, list);
  return [globtext, functext, functextold];
}
async function codebaseFromFiles(files, bykey, bytype, list) {
  let olist = [];
  for (const path of files) {
    let opath = await codeParseFile(path);
    olist = olist.concat(opath);
  }
  let mytype = {}, mykey = {};
  for (const o of olist) { mykey[o.key] = o; }
  for (const k in mykey) { let o = mykey[k]; lookupAddIfToList(mytype, [o.type], o); }
  let dupltext = '';
  for (const k in mykey) {
    let onew = mykey[k];
    let oold = bykey[k];
    if (isdef(oold) && onew.code == oold.code) {
      console.log('override w/ SAME code', k);
    } else if (isdef(oold)) {
      console.log('override w/ DIFFERENT code', k);
      oold.oldcode = oold.code;
      oold.code = onew.code;
      dupltext += oold.oldcode + '\n' + oold.code + '\n';
    } else {
      bykey[k] = onew;
      lookupAddIfToList(bytype, [onew.type], onew);
      list.push(onew);
    }
  }
  let globtext = '', functext = '', functextold = '';
  for (const type of ['const', 'var', 'class']) {
    if (nundef(bytype[type])) continue;
    for (const o of bytype[type]) { if (!isEmptyOrWhiteSpace(o.code)) globtext += o.code + '\n'; }
  }
  let sortedFuncKeys = sortCaseInsensitive(bytype.function.map(x => x.key)).filter(x => !['step', 'Number'].includes(x));
  sortedFuncKeys.map(x => functext += isEmptyOrWhiteSpace(bykey[x].code) ? '' : (bykey[x].code + '\n'));
  sortedFuncKeys.map(x => functextold += (isdef(bykey[x].oldcode) ? bykey[x].oldcode : bykey[x].code) + '\n');
  return [globtext, functext, functextold]
}
function codeParseBlock(lines, i) {
  let l = lines[i];
  let type = l[0] == 'a' ? ithWord(l, 1) : ithWord(l, 0);
  let key = l[0] == 'a' ? ithWord(l, 2, true) : ithWord(l, 1, true);
  let code = l + '\n'; i++; l = lines[i];
  while (i < lines.length && !(['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x)) && !l.startsWith('}'))) {
    if (!(l.trim().startsWith('//') || isEmptyOrWhiteSpace(l))) code += l + '\n';
    i++; l = lines[i];
  }
  code = replaceAllSpecialChars(code, '\t', '  ');
  code = code.trim();
  return [{ key: key, type: type, code: code }, i];
}
function codeParseBlocks(text) {
  let lines = text.split('\r\n');
  lines = lines.map(x => removeTrailingComments(x));
  let i = 0, o = null, res = [];
  while (i < lines.length) {
    let l = lines[i];
    if (['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x))) {
      [o, iLineAfterBlock] = codeParseBlock(lines, i);
      i = iLineAfterBlock;
      res.push(o)
    } else i++;
  }
  return res;
}
async function codeParseFile(path) {
  let text = await route_path_text(path);
  let olist = codeParseBlocks(text);
  return olist;
}
function coin(percent = 50) { return Math.random() * 100 < percent; }
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
function collCancelEditing(d) { d.remove(); }
function collClear() { closeLeftSidebar(); clearMain(); }
function collClearSelections() {
  let arr = Array.from(document.getElementsByClassName('framedPicture'));//find all visible uis for selected images
  arr.forEach(collUnselect);
  UI.selectedImages = [];
  collDisableListCommands();
  collDisableItemCommands();
}
function collClosePrimary() { let d = iDiv(UI.collPrimary); mClear(d); UI.collPrimary.isOpen = false; }
function collCloseSecondary() {
  let d = iDiv(UI.collSecondary);
  mClear(d);
  mStyle(d, { w: 0, wmin: 0, border: 'transparent' });
  UI.collSecondary.isOpen = false;
  cmdEnable(UI.asSecondary);
}
async function collDelete(collname) {
  if (collLocked(collname) || !collExists(collname)) return;
  let keys = M.byCollection[collname];
  collPreReload(collname);
  let di = {}, deletedKeys = []; 
  for (const k of keys) {
    await collDeleteOrRemove(k, collname, di, deletedKeys);
  }
  let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys, collname, deletedCollection: true });
  await loadAssets();
  collPostReload(); 
}
async function collDeleteOrRemove(k, collname, di, deletedKeys) {
  let item = M.superdi[k];
  let colls = item.colls;
  assertion(colls.includes(collname), `item ${k} from coll ${collname} does not have ${collname} in colls!!!!!!`)
  if (colls.length == 1) {
    console.log('deleting', k, '!!!!!!!!!!!!');
    deletedKeys.push(k);
  } else if (isdef(item.img) && item.img.includes(`/${collname}/`)) {
    removeInPlace(item.colls, collname);
    let olddir = collname;
    let newdir = item.colls[0];
    let filename = stringAfterLast(item.img, '/');
    item.img = item.img.replace(olddir, newdir);
    let resp = await mPostRoute('moveImage', { olddir, newdir, filename });
    if (isdef(resp.newpath)) item.img = resp.newpath;
    console.log('moveImage:', resp)
    di[k] = item;
  } else {
    removeInPlace(item.colls, collname);
    di[k] = item;
  }
}
function collDisableItemCommands() {
  for (const cmd of [UI.asAvatar, UI.editCollItem]) {
    if (nundef(cmd)) continue;
    cmdDisable(cmd);
  }
}
function collDisableListCommands() {
  for (const cmd of [UI.collClearSelections, UI.deleteSelected, UI.addSelected, UI.removeSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
    if (nundef(cmd)) continue;
    cmdDisable(cmd);
  }
}
function collect_game_specific_options(game) {
  let poss = Config.games[game].options;
  if (nundef(poss)) return;
  let di = {};
  for (const p in poss) {
    let fs = mBy(`d_${p}`);
    let val = get_checked_radios(fs)[0];
    di[p] = isNumber(val) ? Number(val) : val;
  }
  return di;
}
function collectCats(klist) {
  let cats = [];
  for (const k of klist) {
    M.superdi[k].cats.map(x => addIf(cats, x));
  }
  return cats;
}
async function collectFromPrevious(gamename){
  let id = 'dPlayerOptions';
  let lastpl = DA.lastPlayerItem;
  let dold = mBy(id);
  if (isdef(dold)) { await collectPlayerOptions(lastpl, gamename); dold.remove(); }
}
function collectOptions() {
  let poss = Serverdata.config.games[DA.gamename].options;
  let options = DA.options = {};
  if (nundef(poss)) return options;
  for (const p in poss) {
    let fs = mBy(`d_${p}`);
    let val = get_checked_radios(fs)[0];
    options[p] = isNumber(val) ? Number(val) : val;
  }
  return options;
}
async function collectPlayerOptions(pl, gamename) {
  let name = pl.name;
  let options = valf(pl[gamename], {});
  let poss = Serverdata.config.games[gamename].ploptions;
  if (nundef(poss)) return options;
  for (const p in poss) {
    let fs = mBy(`d_${p}`);
    let val = get_checked_radios(fs)[0]; 
    options[p] = isNumber(val) ? Number(val) : val;
  }
  pl[gamename] = options;
  let id = 'dPlayerOptions'; mRemoveIfExists(id);//mRemove(d);
  let uold = Serverdata.users[pl.name];
  let unew = {};
  for (const k in pl) {
    if (['div', 'isSelected'].includes(k)) continue;
    unew[k] = jsCopy(pl[k]);
  }
  for (const k in unew[gamename]) {
    if (lookup(uold, [gamename, k]) != unew[gamename][k]) {
      let res = await postUserChange(unew);
      copyKeys(res,DA.allPlayers[name]);
      return;
    }
  }
}
function collectPlayers() {
  let players = {};
  if (isList(DA.playerList)) {
    for (const name of DA.playerList) {
      players[name] = DA.allPlayers[name];
    }
  }
  if (TESTING == 'felixAmanda') {
    if (nundef(players.felix)) players.felix = createGamePlayer('felix', DA.gamename)
    if (nundef(players.amanda)) players.amanda = createGamePlayer('amanda', DA.gamename)
  }
  return players;
}
function collEnableItemCommands() {
  for (const cmd of [UI.asAvatar, UI.editCollItem]) {
    if (nundef(cmd)) continue;
    cmdEnable(cmd);
  }
}
function collEnableListCommands() {
  for (const cmd of [UI.collClearSelections, UI.addSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
    if (nundef(cmd)) continue;
    cmdEnable(cmd);
  }
  let selist = UI.selectedImages;
  let colls = selist.filter(x => !collLocked(stringAfter(x, '@')));
  if (isEmpty(colls)) return;
  for (const cmd of [UI.deleteSelected, UI.removeSelected,]) {
    if (nundef(cmd)) continue;
    cmdEnable(cmd);
  }
}
function collExists(collname) { return isdef(M.byCollection[collname]); }
function collFilterImages(coll, s) {
  let di = {};
  for (const k of coll.masterKeys) { di[k] = true; }
  let list = isEmpty(s) ? Object.keys(di) : isdef(M.byCat[s]) ? M.byCat[s].filter(x => isdef(di[x])) : [];
  if (nundef(list) || isEmpty(list)) {
    list = [];
    for (const k of coll.masterKeys) {
      let o = M.superdi[k];
      if (k.includes(s) || o.friendly.toLowerCase().includes(s)) list.push(k);
    }
  }
  return list;
}
function collFindEmptyCell(coll) {
  let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
  if (nundef(cell)) {
    coll.index++;
    coll.cells.map(x => { mClear(x); mStyle(x, { opacity: 0 }); });
    cell = coll.cells[0];
  }
  return cell;
}
async function collFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, coll) {
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
  let filename = (isdef(M.superdi[friendly]) ? 'i' + get_timestamp() : friendly) + '.png'; //console.log('filename', filename);
  let o = { image: dataUrl, coll: coll.name, path: filename };
  let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
  let key = stringBefore(filename, '.');
  let imgPath = `../assets/img/${coll.name}/${filename}`;
  let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [coll.name] };
  dPopup.remove();
  await collOnDroppedItem(item, coll);
}
function collFromElement(elem) {
  let id = findAttributeInAncestors(elem, 'id'); //console.log('ancestor is',id);//find Ancestor with id collPrimary or collSecondary
  let coll = id == 'collPrimary' ? UI.collPrimary : id == 'collSecondary' ? UI.collSecondary : null;
  return coll;
}
function collGenSelkey(key, collname) { return `${key}@${collname}`; }
function collInitCollection(name, coll) {
  let isReload = isdef(coll.index) && coll.name == name;
  if (!isReload) {
    coll.index = 0; coll.pageIndex = 1; coll.name = name; coll.filter = null;
  }
  let list = [];
  if (name == 'all' || isEmpty(name)) {
    list = Object.keys(M.superdi);
  } else if (isdef(M.byCollection[name])) {
    list = M.byCollection[name];
  } else list = []; 
  if (coll == UI.collPrimary) localStorage.setItem('collection', name)
  let dMenu = coll.dMenu;
  mClear(dMenu);
  let d = mDom(dMenu); mFlexV(d);
  mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });
  let colls = M.collections;
  let dlColl = mDatalist(d, colls, { placeholder: "<select from list>" });
  dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value, coll);
  dlColl.inpElem.value = name;
  list = sortByFunc(list, x => M.superdi[x].friendly); 
  coll.masterKeys = list;
  coll.keys = coll.filter ? collFilterImages(coll, coll.filter) : list;
  let cats = collectCats(coll.keys);
  cats.sort();
  d = mDom(dMenu); mFlexV(d);
  let wLabel = coll.cols < 6 ? 117 : 'auto';
  mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit: true, html: 'Filter:' });
  let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>", value: coll.filter });
  dlCat.inpElem.oninput = oninputCollFilter;
  d = mDom(dMenu, { gap: 10, align: 'right' });
  if (coll.cols < 6) mStyle(d, { w100: true });
  if (coll == UI.collSecondary) mButton('done', onclickCollDone, d, { w: 70, margin: 0, maleft: 10 }, 'input');
  mButton('prev', onclickCollPrev, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
  mButton('next', onclickCollNext, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');
  collClearSelections();
  showImageBatch(coll);
}
function collKeyCollnameFromElem(elem) { return { key: elem.getAttribute('key'), collname: elem.getAttribute('collname') }; }
function collKeyCollnameFromSelkey(selkey) { return { key: stringBefore(selkey, '@'), collname: stringAfter(selkey, '@') }; }
function collLocked(collname) {
  if (getUname() != '____unsafe' && ['all', 'amanda', 'animals', 'big', 'emo', 'fa6', 'icon', 'nations', 'users'].includes(collname)) {
    return true;
  }
  return false;
}
async function collOnDropImage(url, dDrop) {
  let item = UI.draggedItem;
  UI.draggedItem = null;
  let coll = UI.collSecondary;
  if (isdef(item)) return await collOnDroppedItem(item, coll);
  else return await collOnDroppedUrl(url, coll);
}
async function collOnDroppedItem(item, coll) {
  assertion(isdef(item.key), 'NO KEY!!!!!');
  await collAddItem(coll, item.key, item);
  collOpenSecondary(4, 3);
  showImageBatch(coll, -1);
}
async function collOnDroppedUrl(url, coll) {
  let m = await imgMeasure(url); console.log('sz', m);
  let dPopup = mDom(document.body, { position: 'fixed', top: 0, left: 0, wmin: 400, hmin: 400, bg: 'pink' });
  let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 300];
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
  let k = coll.masterKeys.find(x => x == `${coll.name}${iDefault}`);
  while (isdef(k)) { iDefault++; k = coll.masterKeys.find(x => x == `${coll.name}${iDefault}`); }
  defaultName = `${coll.name}${iDefault}`;
  inpFriendly.value = defaultName;
  mDom(dinp, { h: 1 });
  mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
  let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });
  let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
  mButton('cancel', () => collCancelEditing(dPopup), db2, { w: 70 }, 'input');
  mButton('OK', () => collFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, coll), db2, { w: 70 }, 'input');
}
function collOpenPrimary(rows, cols) { collPresent(UI.collPrimary, rows, cols); UI.collPrimary.isOpen = true; }
function collOpenSecondary(rows, cols) {
  let coll = UI.collSecondary;
  let d = iDiv(coll);
  mStyle(d, { wmin: 450, border: 'white' });
  collPresent(coll, rows, cols);
  coll.isOpen = true;
  coll.dInstruction.innerHTML = '* drag images into the shaded area *'
  let grid = coll.grid;
  mStyle(grid, { bg: '#00000030' })
  enableImageOrItemDrop(grid, collOnDropImage);
  cmdDisable(UI.asSecondary);
}
function collPostReload() {
  if (UI.collPrimary.isOpen) { collInitCollection(UI.collPrimary.name, UI.collPrimary); }
  if (UI.collSecondary.isOpen) { collInitCollection(UI.collSecondary.name, UI.collSecondary); }
  collClearSelections();
}
function collPreReload(name) { if (name == UI.collSecondary.name) { collCloseSecondary(); UI.collSecondary.name = null; } }
function collPresent(coll, rows, cols) {
  let d1 = iDiv(coll);
  if (nundef(rows)) rows = coll.rows;
  if (nundef(cols)) cols = coll.cols;
  mClear(d1);
  let w = coll.w = 140 * cols;
  mStyle(d1, { wmax: w, w: w })
  let dMenu = coll.dMenu = mDom(d1, { padding: 12, wmax: w, w: w }, { className: 'title' });
  mFlexVWrap(dMenu);
  mStyle(dMenu, { gap: 10 });
  let fg = getThemeFg();
  let dInstruction = coll.dInstruction = mDom(d1, { align: 'center', fg: fg }, { html: '* press Control key when hovering to magnify image! *' })
  coll.rows = rows; coll.cols = cols;
  coll.grid = mGrid(coll.rows, coll.cols, d1, { maleft: 10, 'align-self': 'start' });
  coll.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < coll.rows * coll.cols; i++) {
    let d = mDom(coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    coll.cells.push(d);
  }
  mStyle(dInstruction, { w: mGetStyle(coll.grid, 'w') });
  coll.dPageIndex = mDom(d1, { fg: fg, padding: 10, align: 'right' });
  collInitCollection(coll.name, coll);
}
async function collRename(oldname, newname) {
  if (collLocked(oldname) || !collExists(oldname) || !isAlphanumeric(newname)) {
    showMessage(`Cannot rename collection ${oldname} to ${newname}`);
    return;
  }
  console.log('rename collection', oldname, 'to', newname)
  collPreReload(oldname);
  let needToRenameDir = false;
  let di = {};
  for (const k of M.byCollection[oldname]) {
    let item = M.superdi[k];
    let path = item.img;
    if (isString(path) && path.includes(`img/${oldname}/`)) {
      item.img = `../assets/img/${newname}/${stringAfterLast(path, '/')}`;
      needToRenameDir = true;
    }
    removeInPlace(item.colls, oldname)
    item.colls.push(newname);
    di[k] = item;
  }
  if (needToRenameDir) {
    let resp = await mPostRoute('renameImgDir', { oldname, newname });
    console.log('response from server', resp)
  }
  let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: [] }); console.log('response from server', res)
  await loadAssets();
  if (UI.collPrimary.name == oldname) UI.collPrimary.name = newname;
  if (UI.collSecondary.name == oldname) UI.collSecondary.name = newname;
  collPostReload();
}
function collSelect(elem) { mClass(elem, 'framedPicture'); }
async function collShowImageInCell(cell, src) {
  mStyle(cell, { opacity: 1 });
  mClass(cell, 'magnifiable');
  let img = mDom(cell, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img' });
  await loadImageAsync(src, img);
  return img;
}
function collSidebar() {
  let wmin = 170;
  mStyle('dLeft', { wmin: wmin, });
  let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 160, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
  let gap = 5;
  UI.collSelectAll = mCommand(d, 'collSelectAll', 'Select All'); mNewline(d, gap);
  UI.collSelectPage = mCommand(d, 'collSelectPage', 'Select Page'); mNewline(d, gap);
  UI.collClearSelections = mCommand(d, 'collClearSelections', 'Clear Selection'); mNewline(d, gap);
  UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d, gap);
  UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d, gap);
  UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d, gap);
  UI.addSelected = mCommand(d, 'addSelected', 'Add Selected'); mNewline(d, gap);
  UI.removeSelected = mCommand(d, 'removeSelected', 'Remove Selected'); mNewline(d, gap);
  UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d, 3 * gap);
  collDisableListCommands();
  UI.newCollection = mCommand(d, 'newCollection', 'New Collection'); mNewline(d, gap);
  UI.asSecondary = mCommand(d, 'asSecondary', 'Open DragDrop'); mNewline(d, gap);
  UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
  UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);
  UI.asAvatar = mCommand(d, 'asAvatar', 'Set Avatar'); mNewline(d, gap);
}
function collUnselect(elem) { mClassRemove(elem, 'framedPicture'); }
function colorContrast(dDrop, list = ['white', 'black']) {
  let bg = mGetStyle(dDrop, 'bg'); return bestContrastingColor(bg, list);
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
    } else if (cAny.startsWith('rand')) {
      let spec = capitalize(cAny.substring(4));
      if (isdef(window['color' + spec])) {
        c = window['color' + spec]();
      } else c = rColor();
      if (a == undefined) return c;
      return c + (a == 1 ? '' : alphaToHex(a));
    } else if (cAny.startsWith('linear')) {
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
          return a == 1 ? cAny : 'hsla' + cAny.substring(3, cAny.length - 1) + ',' + a + ')';
        }
      } else {
        if (cAny[3] == 'a') {
          cAny = HSLAToRGBA(cAny);
        } else {
          cAny = HSLToRGB(cAny);
        }
        return colorFrom(cAny, a, false);
      }
    } else {
      ensureColorDict();
      let c = ColorDi[cAny];
      if (nundef(c)) {
        if (cAny.startsWith('rand')) {
          let spec = cAny.substring(4);
          if (isdef(window['color' + spec])) {
            c = window['color' + spec](res);
          } else c = rColor();
        } else {
          console.log('color not available:', cAny);
          throw new Error('color not found: ' + cAny)
          return '#00000000';
        }
      } else c = c.c;
      if (a == undefined) return c;
      c = c.substring(0, 7);
      return c + (a == 1 ? '' : alphaToHex(a));
    }
  } else if (Array.isArray(cAny)) {
    if (cAny.length == 3 && isNumber(cAny[0])) {
      let r = cAny[0];
      let g = cAny[1];
      let b = cAny[2];
      return a == undefined || a == 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
    } else {
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
function colorHexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
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
}
function colorHSLBuild(hue, sat = 100, lum = 50) { let result = "hsl(" + hue + ',' + sat + '%,' + lum + '%)'; return result; }
function colorIdealText(bg, grayPreferred = false) {
  let rgb = colorRGB(bg, true);
  const nThreshold = 105;
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
function colorLighter(c, zero1 = .2, log = true) {
  c = colorFrom(c);
  return pSBC(zero1, c, undefined, !log);
}
function colorLum(cAny, percent = false) {
  let hsl = colorHSL(cAny, true);
  return percent ? hsl.l * 100 : hsl.l;
}
function colorNameToHexString(str) {
  var ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  return ctx.fillStyle;
}
function colorPalette(color, type = 'shade') {
  color = colorFrom(color);
  return colorShades(color);
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
    let c = pSBC(frac, color, undefined, true);
    res.push(c);
  }
  return res;
}
function colorTrans(cAny, alpha = 0.5) {
  return colorFrom(cAny, alpha);
}
function computeColor(c) { return (c == 'random') ? randomColor() : c; }
function conslog(s){console.log(s,window[s])}
function contains(s, sSub) { return s.toLowerCase().includes(sSub.toLowerCase()); }
function convert_from_row(row) {
  for (const k in row) {
    let val = row[k];
    if (isNumber(val)) row[k] = Number(val);
    if (isString(val) && val[0] == '{') { row[k] = JSON.parse(val); }
    if (val == 'null') row[k] = null;
    if (k == 'players' && isString(row[k])) row[k] = val.split(',');
  }
}
function convert_from_server(obj) {
  if (isdef(obj.table)) convert_from_row(obj.table);
  if (isdef(obj.playerdata)) {
    for (const row of obj.playerdata) {
      convert_from_row(row);
    }
  }
  if (isdef(obj.moves)) {
    for (const row of obj.moves) {
      convert_from_row(row);
    }
  }
}
function copyKeys(ofrom, oto, except = {}, only = null) {
  let keys = isdef(only) ? only : Object.keys(ofrom);
  for (const k of keys) {
    if (isdef(except[k])) continue;
    oto[k] = ofrom[k];
  }
  return oto;
}
function correct_handsorting(hand, plname) {
  let pl = Z.fen.players[plname];
  let [cs, pls, locs] = [Clientdata.handsorting, pl.handsorting, localStorage.getItem('handsorting')];
  let s = cs ?? pls ?? locs ?? Config.games[Z.game].defaulthandsorting;
  hand = sort_cards(hand, s == 'suit', 'CDSH', true, Z.func.rankstr);
  return hand;
}
function correctFuncName(specType) {
  switch (specType) {
    case 'list': specType = 'liste'; break;
    case 'dict': specType = 'dicti'; break;
    case undefined: specType = 'panel'; break;
  }
  return specType;
}
function cPortrait(dParent, styles = {}, opts = {}) {
  if (nundef(styles.h)) styles.h = 100;
  if (nundef(styles.w)) styles.w = styles.h * .7;
  return cBlank(dParent, styles, opts);
}
function cPrintSym(card, sym, styles, pos) {
  let d = iDiv(card);
  let opts = {};
  if (isNumber(sym)) {
    opts.html = sym;
  } else if (sym.includes('/')) {
    opts.tag = 'img';
    opts.src = sym;
  }
  let d1 = mDom(d, styles, opts);
  mPlace(d1, pos, pos[0] == 'c' ? 0 : 2, pos[1] == 'c' ? 0 : 2);
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
function create_random_players(n = 1) {
  let colors = rWheel(n);
  let res = [{ name: myname, playmode: 'human', color: colors[0] }];
  let names = rChoose(MyNames, n - 1);
  if (!isList(names)) names = [names];
  for (let i = 1; i < n; i++) {
    let pl = { name: names[i - 1], playmode: 'bot', color: colors[i], strategy: 'random' };
    res.push(pl);
  }
  return res;
}
function create_set_card(fen, dParent, card_styles) {
  let myinfo = info_from_fen(fen);
  let info = { shape: 'circle', color: BLUE, num: 1, shading: 'solid', background: 'white', text: 'none' };
  copyKeys(myinfo, info);
  let card = draw_set_card(dParent, info, card_styles);
  card.fen = fen;
  return card;
}
function createConfirmationModal(dParent,question) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  const questionText = document.createElement("p");
  questionText.textContent = question;
  modalContent.appendChild(questionText);
  const yesButton = document.createElement("button");
  yesButton.textContent = "Yes";
  yesButton.addEventListener("click", () => {
    modal.style.display = "none"; // Close the modal
  });
  modalContent.appendChild(yesButton);
  const noButton = document.createElement("button");
  noButton.textContent = "No";
  noButton.addEventListener("click", () => {
    modal.style.display = "none"; // Close the modal
  });
  modalContent.appendChild(noButton);
  modal.appendChild(modalContent);
  dParent.appendChild(modal);
}
function createContactsContent(myusers, msgs) {
  let mydata = uiGetContactStylesAndStart();
  mydata += uiGetContacts(myusers, msgs);
  return mydata;
}
function createGamePlayer(name, gamename, opts = {}) {
  let pl = jsCopy(Serverdata.users[name]);
  let plopts = valf(pl[gamename], {}); delete pl[gamename];
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
function createInteractiveCanvas(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 300 / Math.min(img.width, img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      let isDragging = false;
      let rect = {x: 100, y: 100, width: 50, height: 50}; // Initial rectangle properties
      let dragOffsetX, dragOffsetY;
      function isMouseInRect(x, y) {
        return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
      }
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight); 
        ctx.fillStyle = 'red';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height); 
      }
      canvas.addEventListener('mousedown', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (isMouseInRect(x, y)) {
          isDragging = true;
          dragOffsetX = x - rect.x;
          dragOffsetY = y - rect.y;
        }
      });
      canvas.addEventListener('mousemove', (event) => {
        if (isDragging) {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          rect.x = x - dragOffsetX;
          rect.y = y - dragOffsetY;
          draw(); 
        }
      });
      canvas.addEventListener('mouseup', () => {
        isDragging = false;
      });
      draw(); 
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
function createMarker(markerId) {
  let divs = document.getElementsByClassName('feedbackMarker');
  let d;
  d = mCreate('div');
  d.innerHTML = MarkerText[markerId];
  mClass(d, 'feedbackMarker');
  document.body.appendChild(d);
  Markers.push(d);
  return d;
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
    if (TESTING && gamename == 'setgame') {
      let keys = ['playmode','score','level','name','color','key'];
      let osorted={};
      for (const k of keys) {osorted[k]=o[k];      }
      pdict[name]=osorted;
    }else  pdict[name] = o;
  }
  assertion(playerNames[0] == me, `_addTable: owner should be ${me} and first in ${playerNames.join(',')}`);
  console.log('creating table with',pdict); //das geht
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
function createScaledCanvasFromImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 300 / Math.min(img.width, img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
async function cropOrExpandImageAndGetDataUrl(imageSrc, x, y) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const dx = isdef(x) ? x * scale : (canvas.width - scaledWidth) / 2;
      const dy = isdef(y) ? y * scale : (canvas.height - scaledHeight) / 2;
      ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    img.onerror = (error) => reject(error);
    img.src = imageSrc;
  });
}
async function cropOrExpandImageAndGetDataUrl_trial1_W(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const dx = (canvas.width - scaledWidth) / 2;
      const dy = (canvas.height - scaledHeight) / 2;
      ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    img.onerror = (error) => reject(error);
    img.src = imageSrc;
  });
}
function cropTo(tool, wnew, hnew) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
  let xnew = x + (wnew - w) / 2;
  let ynew = y + (hnew - h) / 2;
  redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
function cRound(dParent, styles = {}, opts = {}) {
  styles.w = valf(styles.w, 100);
  styles.h = valf(styles.h, 100);
  styles.rounding = '50%';
  return cBlank(dParent, styles, opts);
}
function csv2list(allText, hasHeadings = true) {
  var numHeadings = 11;
  var allTextLines = allText.split(/\r\n|\n/);
  var headings = allTextLines[0].split(',');
  numHeadings = headings.length;
  let entries = allTextLines.splice(1);
  var records = [];
  for (const e of entries) {
    let o = {};
    let values = e.split(',');
    for (let i = 0; i < numHeadings; i++) {
      let k = headings[i];
      o[k] = values[i];
    }
    records.push(o);
  }
  return records;
}
function cycle(x, min, max) { let d = max - min; return (x - min) % d + min; }
function danext() { if (isdef(DA.next)) { let f = DA.next; DA.next = null; f(); } }
function data_from_client(raw) {
  assertion(is_stringified(raw), 'data should be stringified json!!!!!!!!!!!!!!!', raw);
  let js = JSON.parse(raw);
  return js;
}
function db_clear_players(friendly) {
  assertion(isdef(GT[friendly]), `table ${friendly} does NOT exist!!!!`);
  let t = GT[friendly];
  for (const pldata of t.playerdata) { pldata.state = null; pldata.player_status = null; }
  return t.playerdata;
}
function db_new_table(friendly, game, host, players, fen, options) {
  let table = { friendly, game, host, players, fen, options };
  table.modified = Date.now();
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
function db_save() {
  if (!is_online()) { console.log('not saving! (no internet)'); return; }
  let txt = jsyaml.dump(DB);
  to_server({ db: txt }, 'dbsave');
}
function db_table_exists(friendly) { return isdef(GT[friendly]); }
function db_write_fen(friendly, fen, scoring = null) {
  assertion(isdef(GT[friendly]), `table ${friendly} does NOT exist!!!!`);
  let t = GT[friendly];
  let table = t.table;
  table.fen = fen; table.scoring = scoring; table.phase = isdef(scoring) ? 'over' : '';
  table.modified = Date.now();
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
async function dbSaveX(callback) {
  if (USELIVESERVER) {
    return;
  }
  if (BlockServerSend1) { setTimeout(() => dbSaveX(callback), 1000); }
  else {
    let path = './MZZ/DB.yaml';
    let resp = await postData('http://localhost:3000/db', { obj: DB, path: path });
    BlockServerSend1 = false;
    if (callback) callback();
  }
}
function deactivate_ui() { uiActivated = false; DA.ai_is_moving = true; }
function deck_deal(deck, n) { return deck.splice(0, n); }
function deck_deal_safe_fritz(fen, plname, n = 1) {
  if (fen.deck.length < n) {
    fen.deck = create_fen_deck('n', fen.num_decks, 0);
    fen.loosecards.push('*Hn');
  }
  let new_cards = deck_deal(fen.deck, n);
  fen.players[plname].hand.push(...new_cards);
  new_cards.map(x => lookupAddToList(fen.players[plname], ['newcards'], x));
  return new_cards;
}
function deckDeal(deck, n) { return deck.splice(0, n); }
function decrease_handicap_if_winstreak(winners, game) {
  for (const w of winners) {
    let o = lookupSet(DB.users, [w, 'games', game], {});
    o.winstreak = DB.users[w].games[game].winstreak = isdef(o.winstreak) ? o.winstreak + 1 : 1;
    if (o.winstreak >= 3) {
      lookupSetOverride(DB.users, [w, 'games', game, 'startlevel'], Math.min(o.startlevel + 1, Session.maxlevel));
      delete o.winstreak;
      console.log('...startlevel of', w, 'is increased to', get_startlevel(w, game));
    }
    console.log('user', w, 'db entry', o);
  }
}
function deepmerge(target, source, optionsArgument) {
  var array = Array.isArray(source);
  var options = optionsArgument || { arrayMerge: defaultArrayMerge }
  var arrayMerge = options.arrayMerge || defaultArrayMerge
  if (array) {
    return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
  } else {
    return mergeObject(target, source, optionsArgument)
  }
}
function deepMerge(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    return mergeArrays(target, source);
  } else if (isObject(target) && isObject(source)) {
    const output = Object.assign({}, target);
    Object.keys(source).forEach(key => {
      if (isObject(source[key]) || Array.isArray(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
    return output;
  }
  return source;
}
function deepMergeConcatLists(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  } else if (isObject(target) && isObject(source)) {
    const output = Object.assign({}, target);
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMergeConcatLists(target[key], source[key]);
        }
      } else if (Array.isArray(source[key])) {
        output[key] = target[key] ? deepMergeConcatLists(target[key], source[key]) : source[key];
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
    return output;
  }
  return source;
}
function deepMergeIndex(target, source) {
  if (typeof target !== 'object' || typeof source !== 'object') {
    throw new Error('Both arguments must be objects');
  }
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (target.hasOwnProperty(key)) {
        if (typeof target[key] === 'object' && typeof source[key] === 'object') {
          target[key] = deepMergeIndex(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
function deepmergeOverride(base, drueber) { return mergeOverrideArrays(base, drueber); }
function deepMergeOverrideLists(target,source) {
  let output = Object.assign({}, source);
  if (isObject(source) && isObject(target)) {
    Object.keys(target).forEach(key => {
      if (isObject(target[key])) {
        if (!(key in source))
          Object.assign(output, { [key]: target[key] });
        else
          output[key] = deepMergeOverrideLists(source[key], target[key]);
      } else {
        Object.assign(output, { [key]: target[key] });
      }
    });
  }
  return output;
}
function default_allowDrop(ev) { ev.preventDefault(); }
function defaultArrayMerge(target, source, optionsArgument) {
  var destination = target.slice()
  source.forEach(function (e, i) {
    if (typeof destination[i] === 'undefined') {
      destination[i] = cloneIfNecessary(e, optionsArgument)
    } else if (isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument)
    } else if (target.indexOf(e) === -1) {
      destination.push(cloneIfNecessary(e, optionsArgument))
    }
  })
  return destination
}
function defaultGameFunc() {
  function setup(table) { let fen = { players: table.players, turn: [table.owner] }; delete table.players; }
  async function activate(table) { console.log('activate for', getUname()) }
  function checkGameover(table) { return false; }
  async function present(table) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
  async function hybridMove(table) { console.log('hybrid moves for', getUname()) }
  async function botMove(table) { console.log('robot moves for', getUname()) }
  async function stepComplete(table, o) { console.log(`integrate if step complete for ${table.friendly}`); }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}
async function deleteEvent(id) {
  let result = await simpleUpload('postEvent', { id });
  delete Items[id];
  mBy(id).remove();
}
function deleteKeyFromLocalSuperdi(k) {
  delete M.superdi[k];
  let fri = item.friendly;
  let lst = M.byFriendly[fri];
  removeInPlace(lst, k); if (isEmpty(lst)) { delete M.byFriendly[fri]; removeInPlace(M.names, fri); }
  for (const cat of item.cats) {
    let lst = M.byCat[cat];
    removeInPlace(lst, k); if (isEmpty(lst)) { delete M.byCat[cat]; removeInPlace(M.categories, cat); }
  }
}
function detectSessionType() {
  let loc = window.location.href;
  DA.sessionType =
    loc.includes('vidulus') ? 'vps' :
      loc.includes('telecave') ? 'telecave' : loc.includes('8080') ? 'php'
        : loc.includes(':40') ? 'nodejs'
          : loc.includes(':60') ? 'flask' : 'live';
  return DA.sessionType;
}
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
function doYourThing(inp, grid) {
  let words = extractWords(inp.value, ' ').map(x => x.toLowerCase());
  let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
  let allNames = checklist.map(x => x.name);
  let names = checklist.filter(x => x.checked).map(x => x.name);
  for (const w of words) {
    if (!allNames.includes(w)) {
      let div = mCheckbox(grid, w);
      let chk = div.firstChild;
      chk.checked = true;
      chk.addEventListener('click', ev => checkToInput(ev, inp, grid))
      needToSortChildren = true;
    } else {
      let chk = checklist.find(x => x.name == w);
      if (!chk.checked) chk.checked = true;
    }
  }
  for (const name of names) {
    if (!words.includes(name)) {
      let chk = checklist.find(x => x.name == name);
      chk.checked = false;
    }
  }
  sortCheckboxes(grid);
  words.sort();
  inp.value = words.join(', ') + ', ';
}
function drag(ev) {
  let elem = ev.target;
  dragStartOffset = getRelCoords(ev, $(elem));
  draggedElement = elem;
}
function dragover_fritz(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
  let target_id = evToClosestId(ev);
  let d = mBy(target_id);
  mStyle(d, { bg: 'red' });
  if (target_id == 'dOpenTable') {
  } else if (isdef(Items[target_id])) {
    let targetcard = Items[target_id];
    let targetgroup = Items[targetcard.groupid];
  } else {
  }
}
function draw() {
  background(51);
  for (let i = 0; i < tree.length; i++) {
    tree[i].show();
    if (jittering) tree[i].jitter();
  }
  for (let i = 0; i < leaves.length; i++) {
    let l = leaves[i].current;
    noStroke();
    fill(0, 255, 100, 100);
    ellipse(l.x, l.y, 8, 8);
    if (jittering) leaves[i].current.y += random(0, 2);
  }
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
  let bg = 'indigo'; //`linear-gradient(${RED},black`
  let styles = { w: sz, h: sz, bg, margin: 4 }; // sz / 10, border: `solid 3px ${GREEN}` };
  let d1 = drawShape('circle', d, styles); //mCenterCenterFlex(d1); mText('A', d1, { fz: sz / 4, fg: 'white' });
  drawShape('circle', d, styles);
  drawShape('circle', d, styles);
}
function drawPix(ctx, x, y, color = 'red', sz = 5) {
  ctx.fillStyle = color;
  ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz)
}
function drawPixFrame(ctx, x, y, color = 'red', sz = 5) {
  ctx.strokeStyle = color;
  ctx.strokeRect(x - sz / 2, y - sz / 2, sz, sz)
}
function drawShape(key, dParent, styles, classes, sizing) {
  if (nundef(styles)) styles = { w: 96, h: 96, bg: 'random' };
  if (nundef(sizing)) sizing = { hgrow: true, wgrow: true };
  let d = mDiv(dParent, styles, null, null, classes, sizing);
  if (key == 'circle' || key == 'ellipse') mStyle(d, { rounding: '50%' });
  else mStyle(d, { 'clip-path': PolyClips[key] });
  return d;
}
function drop(ev) {
  ev.preventDefault();
  let targetElem = findDragTarget(ev);
  targetElem.appendChild(draggedElement);
  setDropPosition(ev, draggedElement, targetElem, isdef(draggedElement.dropPosition) ? draggedElement.dropPosition : dropPosition);
}
function drop_card_fritz(ev) {
  ev.preventDefault();
  evNoBubble(ev);
  if (isdef(mBy('ddhint'))) mRemove(mBy('ddhint'));
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
function dump(...arr) {
  for (const a of arr) {
  }
}
function elem_from_to(el, arr1, arr2) { removeInPlace(arr1, el); arr2.push(el); }
function empty(arr) {
  let result = arr === undefined || !arr || (isString(arr) && (arr == 'undefined' || arr == '')) || (Array.isArray(arr) && arr.length == 0) || emptyDict(arr);
  testHelpers(typeof arr, result ? 'EMPTY' : arr);
  return result;
}
function emptyDict(obj) {
  let test = Object.entries(obj).length === 0 && obj.constructor === Object;
  return test;
}
function emptyTarget(val) {
  return Array.isArray(val) ? [] : {}
}
function enableImageDrop(element, onDropCallback) {
  const originalBorderStyle = element.style.border;
  element.addEventListener('dragover', function(event) {
    event.preventDefault();
  });
  element.addEventListener('dragenter', function(event) {
    element.style.border = '2px solid red';
  });
  element.addEventListener('drop', function(event) {
    event.preventDefault(); 
    element.style.border = originalBorderStyle; 
    const files = event.dataTransfer.files; 
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) { // Check if the dropped file is an image
        onDropCallback(file); 
      }
    }
  });
  element.addEventListener('dragleave', function(event) {
    element.style.border = originalBorderStyle;
  });
}
function enableImageDrop_trial1_W(elem, onDropCallback) {
  const originalBorderStyle = elem.style.border; 
  elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
  elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
  elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping
  elem.addEventListener('drop', function (event) {
    event.preventDefault(); 
    elem.style.border = originalBorderStyle; 
    const files = event.dataTransfer.files; 
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) { // Check if the dropped file is an image
        onDropCallback(file); 
      }
    }
  });
}
function enableImageOrItemDrop(elem, onDropCallback) {
  const originalBorderStyle = elem.style.border; 
  elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
  elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
  elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping
  elem.addEventListener('drop', function (event) {
    event.preventDefault(); 
    elem.style.border = originalBorderStyle; 
    if (isdef(UI.draggedItem)) {
      onDropCallback(null, elem);
      return;
    }
    const files = event.dataTransfer.files; 
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = evReader => {
        onDropCallback(evReader.target.result, elem);
      };
      reader.readAsDataURL(files[0]);
    }
  });
}
async function encryptData(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    { kty: 'RSA', e: 'AQAB', n: 'your_public_key_here' },
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    dataBuffer
  );
  return new Uint8Array(encryptedBuffer).toString();
}
function end_of_round_fritz(plname) {
  let [A, fen, uplayer, plorder] = [Z.A, Z.fen, Z.uplayer, Z.plorder];
  let pl = fen.players[uplayer];
  calc_fritz_score();
  ari_history_list([`${plname} wins the round`], 'round over');
  fen.round_winner = plname;
  plorder = fen.plorder = jsCopy(fen.roundorder);
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
      let j = set;
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
  let uihand = UI.players[uplayer].hand.items;
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
function endsWith(s, sSub) { let i = s.indexOf(sSub); return i >= 0 && i == s.length - sSub.length; }
function ensure_polling() { }
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
    lightblue: { c: 'lightblue', D: 'hellblau' },
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
function ensureColorNames() {
  if (isdef(ColorNames)) return;
  ColorNames = {};
  let names = getColorNames();
  let hexes = getColorHexes();
  for (let i = 0; i < names.length; i++) {
    ColorNames[names[i].toLowerCase()] = '#' + hexes[i];
  }
}
function enterInterruptState() {
  clearTimeouts();
  if (isdef(G.instance)) G.instance.clear();
  auxOpen = true;
}
function error(msg) {
  let fname = getFunctionsNameThatCalledThisFunction();
  console.log(fname, 'ERROR!!!!! ', msg);
}
function ev_to_gname(ev) { evNoBubble(ev); return evToTargetAttribute(ev, 'gamename'); }
function evalCond(o, condKey, condVal) {
  let func = FUNCTIONS[condKey];
  if (isString(func)) func = window[func];
  if (nundef(func)) {
    if (nundef(o[condKey])) return null;
    if (isList(condVal)) {
      for (const v of condVal) if (o[condKey] == v) return true;
      return null;
    } else {
      return isdef(o[condKey]) ? o[condKey] == condVal : null;
    }
  }
  return func(o, condVal);
}
function evalConds(o, conds) {
  for (const [f, v] of Object.entries(conds)) {
    if (!evalCond(o, f, v)) return false;
  }
  return true;
}
function evNoBubble(ev) { ev.preventDefault(); ev.cancelBubble = true; }
function evToAttr(ev, attr) {
  let elem = ev.target;
  let val = null;
  while (nundef(val) && isdef(elem)) {
    val = elem.getAttribute(attr);
    if (isdef(val)) return val;
    elem = elem.parentNode;
  }
  return null;
}
function evToAttrElem(ev, attr) {
  let elem = ev.target;
  let val = null;
  while (nundef(val) && isdef(elem)) {
    val = elem.getAttribute(attr);
    if (isdef(val)) return { val, elem };
    elem = elem.parentNode;
  }
  return null;
}
function evToClass(ev, className) {
  let elem = findParentWithClass(ev.target, className);
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
function evToItem(ev) {
  let id = evToId(ev);
  let item = Items[id];
  return item;
}
function evToTargetAttribute(ev, attr) {
  let elem = ev.target;
  let val = null;
  while (nundef(val) && isdef(elem)) {
    val = elem.getAttribute(attr);
    elem = elem.parentNode;
  }
  return val;
}
function exitToAddon(callback) {
  AD.callback = callback;
  enterInterruptState(); auxOpen = false;
  AD.run();
}
function extendRect(r4) { r4.l = r4.x; r4.t = r4.y; r4.r = r4.x + r4.w; r4.b = r4.t + r4.h; }
function extractFilesFromHtml(html, htmlfile, ext = 'js') {
  let prefix = ext == 'js' ? 'script src="' : 'link rel="stylesheet" href="';
  let dirhtml = stringBeforeLast(htmlfile, '/');
  let project = stringAfter(dirhtml, '/'); if (project.includes('/')) project = stringBefore(project, '/');
  let parts = html.split(prefix);
  parts.shift();
  let files = parts.map(x => stringBefore(x, '"'));
  files = files.filter(x => !x.includes('alibs/') && !x.includes('assets/'));
  let files2 = [];
  for (const f of files) {
    if (f.startsWith(dirhtml)) { files2.push(f); continue; }
    if (f.startsWith('./')) { files2.push(dirhtml + f.substring(1)); continue; }
    if (f.startsWith('../') && stringCount(dirhtml, '../') == 1) {
      files2.push(f); continue;
    }
    if (!f.includes('/')) { files2.push(dirhtml + '/' + f); continue; }
    if (isLetter(f[0])) { files2.push(dirhtml + '/' + f); continue; }
    console.log('PROBLEM!', f)
  }
  files = files2;
  return files;
}
function extractTime(input) {
  const regex = /\b([0-9]|1[0-9]|2[0-3])[h:]*\S*\b/g;
  const match = input.match(regex);
  if (match) {
    let time = match[0];
    let text = input.replace(time, '').trim();
    return [time, text];
  } else {
    return ['', input];
  }
}
function extractWords(s, allowed) {
  let specialChars = toLetters(' ,-.!?;:');
  if (isdef(allowed)) specialChars = arrMinus(specialChars, toLetters(allowed));
  let parts = splitAtAnyOf(s, specialChars.join('')).map(x => x.trim());
  return parts.filter(x => !isEmpty(x));
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
function findAttributeInAncestors(elem, attr) {
  let val;
  while (elem && nundef(val = elem.getAttribute(attr))) { elem = elem.parentNode; }
  return val;
}
function findBottomLine(ct, w, h, cgoal) {
  let [_, restlist] = findPointsBoth(ct, 0, w, h - 30, h, cgoal, 20);
  let o = nextLine(ct, restlist, 'green');
  return o.val;
}
function findDarkBars(ctx, w, h, cgoal, diffleft, diffright) {
  let [restlist, _] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
  let num = 201;
  let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
  let res = [];
  while (num > 100 && i < colors.length) {
    let color = colors[i++];
    let o = nextBar(ctx, restlist, color);
    restlist = o.rest;
    num = o.line.length;
    res.push(o)
  }
  console.log('result', res);
  let diff = 243;
  let cand = res.filter(o => o.val >= 40 && o.val <= 500);
  let [kleinere, groessere] = findMidlines(cand, diff);
  let topmost, bottommost;
  for (const l3 of res) {
    let distleft = kleinere.val - l3.val;
    let distright = l3.val - groessere.val;
    if (isWithinDelta(distleft, diffleft, 2)) {
      topmost = l3;
    }
    if (isWithinDelta(distright, diffright, 2)) {
      bottommost = l3;
    }
  }
  let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? w : bottommost.val]
  return [ytop, kleinere.val, groessere.val, ybottom, topmost, kleinere, groessere, bottommost];
}
function findDarkLines(ctx, w, h, cgoal) {
  let [_, restlist] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
  let y, num = 201;
  let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'crimson', 'seagreen', 'skyblue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
  let res = [];
  while (i < colors.length) {
    let color = colors[i++];
    let o = nextLine(ctx, restlist, color);
    if (!o.line) { console.log('o', o); break; }
    restlist = o.rest;
    num = o.line.length;
    if (num > 112) res.push(o)
  }
  console.log('result', res);
  let diff = 261, diff2 = 22;
  let [kleinere, groessere] = findMidlines(res, diff);
  let topmost, bottommost;
  for (const l3 of res) {
    if (isWithinDelta(kleinere.val - l3.val, diff2, 2)) {
      topmost = l3;
    }
    if (isWithinDelta(l3.val - groessere.val, diff2, 2)) {
      bottommost = l3;
    }
  }
  let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? h : bottommost.val]
  return [ytop, kleinere.val, groessere.val, ybottom, topmost, kleinere, groessere, bottommost];
}
function findDragTarget(ev) {
  let targetElem = ev.target;
  while (!targetElem.ondragover) targetElem = targetElem.parentNode;
  return targetElem;
}
function findEdgeHor(ctx, x1, x2, h, cgoal, lighting = true) {
  let [list, _] = findPoints(ctx, x1, x2, 0, h, cgoal, 20);
  if (lighting) list = list.filter(o => isLightAfter(ctx, o.x, o.y) && isLightBefore(ctx, o.x, o.y));
  let vfreq = findMostFrequentVal(list, 'x');
  return list.filter(o => o.x == vfreq);
}
function findEdgesApart(list, dx, dy, prop) {
  list.map(o => o.nei = findPointAtDistance(o, dx, dy, list, 10))
  list = list.filter(o => o.nei)
  let vfreq = findMostFrequentVal(list, prop); console.log(prop, vfreq)
  let good = list.filter(o => isWithinDelta(o[prop], vfreq, 3));
  let rest = list.filter(o => !isWithinDelta(o[prop], vfreq, 3));
  vfreq = findMostFrequentVal(rest, prop); console.log(prop, vfreq)
  let good2 = list.filter(o => o[prop] == vfreq);
  list = good.concat(good2);
  return list;
}
function findEdgeVert(ctx, y1, y2, w, cgoal, lighting = true) {
  let [_, list] = findPoints(ctx, 0, w, y1, y2, cgoal, 20);
  let vfreq = findMostFrequentVal(list, 'y');
  return list.filter(o => o.y == vfreq);
}
function findLeftLine(ct, w, h, cgoal, xStart = 0) {
  let [restlist, _] = findPointsBoth(ct, xStart, xStart + 40, 0, h, cgoal, 20);
  let o = nextBar(ct, restlist, 'red');
  return o.val;
}
function findMidlines(res, diff) {
  let mid1, mid2;
  for (const l1 of res) {
    for (const l2 of res) {
      if (isWithinDelta(Math.abs(l1.val - l2.val), diff, 2)) {
        mid1 = l1; mid2 = l2;
      }
    }
    if (isdef(mid1)) break;
  }
  let kleinere = mid1.val < mid2.val ? mid1 : mid2;
  let groessere = mid1 == kleinere ? mid2 : mid1;
  return [kleinere, groessere];
}
function findMostFrequentVal(arr, prop, delta = 0) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  let frequencyMap = new Map();
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i][prop];
    frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
  }
  let mostFrequentY;
  let maxFrequency = 0;
  for (let [val, frequency] of frequencyMap) {
    if (frequency > maxFrequency) {
      mostFrequentY = val;
      maxFrequency = frequency;
    }
  }
  return mostFrequentY;
}
function findNextBar(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
  for (let x = x1; x < x2; x++) {
    for (let y = y1; y < y2; y++) {
      let c = isPix(ctx, x, y, cgoal, delta);
      if (c) {
        drawPixFrame(ctx, x - 1, y - 1, 'red', 3)
        let len = 1, yy = y + 1; xx = x;
        while (yy < y2) {
          let p = getPixRgb(ctx, xx, yy);
          let c1 = isPix(ctx, xx, yy, cgoal, delta + 10);
          yy++;
          if (c1) len++;
        }
        return { c, x, y, len };
      }
    }
  }
}
function findNextLine(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      let c = isPix(ctx, x, y, cgoal, delta);
      if (c) {
        drawPixFrame(ctx, x - 1, y - 1, 'red', 3)
        let len = 1, xx = x + 1; yy = y;
        while (xx < x2) {
          let p = getPixRgb(ctx, xx, yy);
          let c1 = isPix(ctx, xx, yy, cgoal, delta + 10);
          xx++;
          if (c1) len++;
        }
        return { c, x, y, len };
      }
    }
  }
}
function findParentWithClass(elem, className) { while (elem && !mHasClass(elem, className)) { elem = elem.parentNode; } return elem; }
function findParentWithId(elem) { while (elem && !(elem.id)) { elem = elem.parentNode; } return elem; }
function findPointAtDistance(pt, dx, dy, list, delta = 0) {
  for (const p1 of list) {
    if (isWithinDelta(Math.abs(pt.x - p1.x), dx, delta) && isWithinDelta(Math.abs(pt.y - p1.y), dy, delta)) return p1;
  }
  return null;
}
function findPoints(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
  let p;
  let resy = [], resx = [];
  cgoal = colorRGB(cgoal, true);
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      p = isPixDark(ctx, x, y, cgoal, delta);
      if (p) {
        let l = isLightBeforeV(ctx, x, y);
        let d = isLightAfterV(ctx, x, y);
        if (l || d) resy.push({ x, y })
        l = isLightBefore(ctx, x, y);
        d = isLightAfter(ctx, x, y);
        if (l || d) resx.push({ x, y })
      }
    }
  }
  return [resx, resy];
}
function findPointsBoth(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
  let p;
  let resy = [], resx = [];
  cgoal = colorRGB(cgoal, true);
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      p = isPixDark(ctx, x, y, cgoal, delta);
      if (p) {
        let l = isLightBeforeV(ctx, x, y);
        let d = isLightAfterV(ctx, x, y);
        if (l && d) resy.push({ x, y })
        l = isLightBefore(ctx, x, y);
        d = isLightAfter(ctx, x, y);
        if (l && d) resx.push({ x, y })
      }
    }
  }
  return [resx, resy];
}
function findRectSample(ctx, x1, x2, y1, y2, cgoal, sz = 4, lightCounts = false) {
  let p;
  cgoal = colorRGB(cgoal, true);
  for (let yStart = y1; yStart <= y2; yStart += sz) {
    for (let xStart = x1; xStart <= x2; xStart += sz) {
      let found = true;
      for (let x = xStart; x < xStart + sz; x++) {
        for (let y = yStart; y < yStart + sz; y++) {
          p = isPix(ctx, x, y, cgoal, 20);
          if (lightCounts && isPix(ctx, x, y, 'white', 10)) p = true;
          if (!p) { found = false; break; }
        }
        if (!found) break;
      }
      if (found) return true;
    }
  }
  return false;
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
function first(arr) {
  return arr.length > 0 ? arr[0] : null;
}
function firstCond(arr, func) {
  if (nundef(arr)) return null;
  for (const a of arr) {
    if (func(a)) return a;
  }
  return null;
}
function firstCondDictKeys(dict, func) {
  for (const k in dict) { if (func(k)) return k; }
  return null;
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
  if (arr.length == 2 && coin()) { return arr; }
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
function format2Digits(i) { return (i < 10) ? "0" + i : i; }
function formatLegend(key){
  return key.includes('per') ? stringBefore(key, '_') + '/' + stringAfterLast(key, '_') 
  : key.includes('_')? replaceAll(key,'_',' '): key;
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
    fen.num_decks = 2 + (n >= 9 ? 2 : n >= 7 ? 1 : 0);
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
        time_left: options.seconds_per_game * 1000,
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
  info.cardtype = ckey[2];
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
    pl.time_left = options.seconds_per_game * 1000;
    pl.roundchange = true;
    delete pl.handsorting;
    delete pl.newcards;
  }
}
function fritz_new_table(fen, options) {
  fen.deck = create_fen_deck('n', fen.num_decks, 0);
  fen.deck_discard = [];
  fen.journeys = [];
  fen.loosecards = arrRepeat(options.jokers, '*Hn');
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
    mText('discard pile:', dOpenTable); mLinebreak(dOpenTable);
    let deck_discard = ui.deck_discard = ui_type_hand(fen.deck_discard, dOpenTable, { maright: 25 }, 'deck_discard', null, fritz_get_card, true);
    let i = 0; deck_discard.items.map(x => { x.source = 'discard'; x.index = i++ });
  }
  mLinebreak(dOpenTable);
  mDiv(dOpenTable, { box: true, w: '100%' }, null, '<hr>');
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
  show_handsorting_buttons_for(Z.mode == 'hotseat' ? Z.uplayer : Z.uname, { left: 58, bottom: -1 });
}
function fritz_present_player(playername, dMiddle) {
  let [fen, ui, stage] = [Z.fen, UI, Z.stage];
  let pl = fen.players[playername];
  let playerstyles = { w: '100%', bg: '#ffffff80', fg: 'black', padding: 4, margin: 4, rounding: 10, border: `2px ${get_user_color(playername)} solid` };
  let d = mDiv(dMiddle, playerstyles, null, get_user_pic_html(playername, 25)); mFlexWrap(d); mLinebreak(d, 10);
  pl.hand = correct_handsorting(pl.hand, playername);
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
  console.log('players', get_keys(fen.players));
  for (const plname in fen.players) {
    let pl = fen.players[plname];
    console.log('uname', plname);
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
  let d = mDiv(Items.dOpenTable, { display: 'grid', margin: 10 }, id);
  let targetgroup = { div: d, id: id, ids: [], ov: .5222 };
  assertion(isdef(DA.TJ), 'DA.TJ undefined in frnew!!!');
  DA.TJ.push(targetgroup);
  Items[id] = targetgroup;
  assertion(isdef(targetgroup.id), 'NO ID IN frnew!!!!!!!', targetgroup);
  add_card_to_group(card, oldgroup, oldindex, null, targetgroup);
  if (targetgroup != oldgroup) cleanup_or_resplay(oldgroup);
}
function from_server(result, type) {
  if (type == "modify_table") { console.log('______from server:', type, '\nresult:', result); }
  if (result.trim() == "") return;
  var obj = JSON.parse(result);
  convert_from_server(obj);
  switch (type) {
    case "intro": got_intro(obj); break;
    case 'non_admin_reload': got_non_admin_reload(obj); break;
    case "games": got_games(obj); break;
    case "play_start": got_play_start(obj); break;
    case "play": got_play(obj); break;
    case 'modify_table': got_modify_table(obj); break;
    case 'create_table_and_start': got_create_table(obj); break;
    case 'send_move': got_send_move(obj); break;
    case 'seen': poll_for_table_seen_or_deleted(); break;
    case 'standard_assets':
    case 'assets': assets_parse(obj.response); break;
    case 'dictionary': got_dictionary(obj); break;
    case "get_tables": got_tables(obj); break;
    case "get_user_game_tables": got_user_game_tables(obj); break;
    case "poll_table_started": check_poll_table_started(obj); break;
    case "poll_table_show": check_poll_table_show(obj); break;
    case "poll_table_seen": check_poll_table_seen(obj); break;
    case "get_past_tables": test_user_endscreen(obj); break;
    case "contacts": present_contacts(obj); break;
    case "login": present_login(obj); break;
    case "dbsave": console.log('db has been saved to server:'); break;
    case 'delete_table': get_games(obj); break;
    case 'save_and_delete': alert(`${obj.message}, ranking:${obj.fen}`);
      console.assert(is_admin(), 'SAVE_AND_DELETE NOT SENT BEI ADMIN!!!!');
      get_games();
      break;
    case 'create_table':
      Session.cur_tid = obj.table.id;
      Session.cur_table = obj.table;
      break;
    case "join_table":
      status_message('You have joined the game! Wait for the host to start it!');
      update_cur_table(obj, 'red');
      break;
    case "toggle_join":
      let t = obj.table;
      let st = obj.player_status;
      update_cur_table(obj, st == 'joined' ? 'red' : 'orange');
      status_message(`You have ${st == 'joined' ? 'joined' : 'left'} the game! Wait for the host to start it!`);
      break;
    case "start_table":
      update_cur_table(obj, 'green');
      status_message('You have started the game! ', obj.table.status);
      break;
    default: break;
  }
  danext();
}
function gamestep() {
  show_admin_ui();
  DA.running = true; clear_screen(); dTable = mBy('dTable'); mClass('dTexture', 'wood');
  if (Z.game == 'aristo') { if (Z.role != Clientdata.role || Z.mode == 'multi' && Z.role != 'active') mFall(dTable); Clientdata.role = Z.role; }
  else mFall(dTable);
  shield_off();
  show_title();
  show_role();
  Z.func.present(dTable);
  if (isdef(Z.scoring.winners)) { show_winners(); animatedTitle('GAMEOVER!'); }
  else if (Z.func.check_gameover(Z)) {
    let winners = show_winners();
    Z.scoring = { winners: winners }
    sendgameover(winners[0], Z.friendly, Z.fen, Z.scoring);
  } else if (is_shield_mode()) {
    staticTitle();
    if (!DA.no_shield == true) { hide('bRestartMove'); shield_on(); }
    autopoll();
  } else {
    Z.A = { level: 0, di: {}, ll: [], items: [], selected: [], tree: null, breadcrumbs: [], sib: [], command: null, autosubmit: Config.autosubmit };
    copyKeys(jsCopy(Z.fen), Z);
    copyKeys(UI, Z);
    activate_ui(Z);
    Z.func.activate_ui();
    if (Z.isWaiting == true || Z.mode != 'multi') staticTitle(); else animatedTitle();
    if (Z.options.zen_mode != 'yes' && Z.mode != 'hotseat' && Z.fen.keeppolling && Z.uplayer_data.player_status != 'stop') {
      autopoll();
      console.log('gamestep autopoll');
    }
  }
  if (TESTING == true) landing();
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
function gCreate(tag) { return document.createElementNS('http:/' + '/www.w3.org/2000/svg', tag); }
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
function gEllipse(w, h) { let r = gCreate('ellipse'); r.setAttribute('rx', w / 2); r.setAttribute('ry', h / 2); return r; }
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
function generateArrayColors(startColor, endColor, numSteps) {
  const colors = [];
  let step = 0;
  while (step < numSteps) {
    const currentColor = mixColors(startColor, endColor, step / numSteps);
    colors.push(currentColor);
    step++;
  }
  return colors;
}
function generateEventId(tsDay, tsCreated) { return `${rLetter()}_${tsDay}_${tsCreated}`; }
function generateRandomWords(n, unique = false) {
  const sampleWords = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'victoria plum', 'watermelon', 'xigua', 'yuzu', 'zucchini'];
  let randomWords = [];
  for (let i = 0; i < n; i++) {
    const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)];
    randomWords.push(randomWord);
  }
  return randomWords;
}
function generateTableId() { return rUniqueId(20); }
function generateTableName(n) {
  let existing = Serverdata.tables.map(x => x.friendly);
  while (true) {
    let cap = rChoose(M.capital);
    let parts = cap.split(' ');
    if (parts.length == 2) cap = stringBefore(cap, ' '); else cap = stringBefore(cap, '-');
    cap = cap.trim();
    let arr = ['battle of ', 'rally of ', 'showdown in ', 'summit of ', 'joust of ', 'tournament of ', 'rendezvous in ', 'soirée in ', 'festival of '];//,'encounter in ']; //['battle of ', 'war of ']
    let s = (n == 2 ? 'duel of ' : rChoose(arr)) + cap;
    if (!existing.includes(s)) return s;
  }
}
function get_chats(e) { get_data({ username: CURRENT_CHAT_USER }, "chats"); }
function get_checked_radios(rg) {
  let inputs = rg.getElementsByTagName('INPUT');
  let list = [];
  for (const ch of inputs) {
    if (ch.checked) list.push(ch.value);
  }
  return list;
}
function get_contacts(e) { get_data({}, "contacts"); }
function get_container_styles(styles = {}) { let defaults = valf(Config.ui.container, {}); defaults.position = 'relative'; addKeys(defaults, styles); return styles; }
function get_containertitle_styles(styles = {}) { let defaults = valf(Config.ui.containertitle, {}); defaults.position = 'absolute'; addKeys(defaults, styles); return styles; }
function get_data(find, type) {
  var xml = new XMLHttpRequest();
  var loader_holder = mBy("loader_holder");
  loader_holder.className = "loader_on";
  xml.onload = function () {
    if (xml.readyState == 4 || xml.status == 200) {
      loader_holder.className = "loader_off";
      handle_result(xml.responseText, type);
    }
  }
  var data = {};
  data.find = find;
  data.data_type = type;
  data = JSON.stringify(data);
  xml.open("POST", "test.php", true);
  xml.send(data);
}
function get_dictionary() {
  let u = DB.users[Session.cur_user];
  let lang = valf(u.lang, 'E');
  if (isdef(Dictionary) && isdef(Dictionary[lang])) return;
  to_server(lang, 'dictionary');
}
function get_game_option(g, key) {
  let set_option = lookup(Session, ['cur_table', 'options', key]);
  if (set_option) return set_option;
  let opts = g.options[key];
  let defval = opts.split(',')[0];
  return defval;
}
function get_games() {
  let d = mBy('inner_left_panel');
  d.innerHTML = "GAMES ARE DISPLAYED HERE!";
  get_data({ assets: nundef(Syms) }, 'games');
}
function get_image_path(userdata) {
  let p = '../base/assets/images/';
  if (userdata.image) p += userdata.name; else p += 'unknown_user';
  p += '.jpg';
  if (is_online()) p += '?=' + Date.now();
  return p;
}
function get_joker_info() {
  return {
    c52key: `card_0J`,
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
function get_keys(o) { return Object.keys(o); }
function get_logout_button() {
  let html = `<a id="aLogout" href="javascript:onclick_logout()">logout</a>`;
  return mCreateFrom(html);
}
function get_mouse_pos(ev) {
  let x = ev.pageX - document.body.scrollLeft;
  let y = ev.pageY - document.body.scrollTop;
  return ({ x: x, y: y });
}
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
function get_now() { return Date.now(); }
function get_number_card(ckey, h = 100, w = null, backcolor = BLUE, ov = .3) {
  let info = {};
  let color = stringAfter(ckey, '_');
  let num = stringBefore(ckey, '_');
  info.key = ckey;
  info.cardtype = 'num';
  let [r, s] = [info.rank, info.suit] = [Number(num), color];
  info.val = r; 
  info.color = backcolor;
  let sz = info.sz = info.h = h;
  w = info.w = valf(w, sz * .7);
  let d = mDom(null, { h: h, w: w, rounding: 4, bg: 'white', border: 'silver' }, { className: 'card' });
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
function get_play(e) {
  get_data({ username: Username, gamename: CURRENT_GAME, assets: nundef(Syms) }, "play");
}
function get_play_start() { Session.cur_menu = 'play'; to_server({ uname: Session.cur_user, tid: Session.cur_tid }, 'play_start'); }
function get_playmode(uname) { return Z.fen.players[uname].playmode; }
function get_preferred_lang(uname) { return lookup(DB.users, [uname, 'lang']) ?? 'E'; }
function get_present_order() {
  let [fen, uplayer, uname] = [Z.fen, Z.uplayer, Z.uname];
  let uname_plays = fen.plorder.includes(Z.uname);
  let show_first = uname_plays && Z.mode == 'multi' ? Z.uname : uplayer;
  return arrCycle(Z.fen.plorder, Z.fen.plorder.indexOf(show_first));
}
function get_score_fen_from_cur_players() {
  let players = get_values(Session.cur_players);
  let sorted = sortByDescending(players, 'score');
  let list = sorted.map(x => `${x.name}:${x.score}`);
  let fen = list.join(',');
  return fen;
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
function get_splay_number(wsplay) { return wsplay == 'none' ? 0 : wsplay == 'left' ? 1 : wsplay == 'right' ? 2 : wsplay == 'up' ? 3 : 4; }
function get_startlevel(user, game) { return lookup(DB.users, [user, 'games', game, 'startlevel']) ?? lookup(DB.games, [game, 'def_startlevel']) ?? 0; }
function get_timestamp() { return Date.now(); }
function get_user_color(uname) { let u = firstCond(Serverdata.users, x => x.name == uname); return colorFrom(u.color); }
function get_user_in_intro_screen(username) {
  load_user(username);
  get_dictionary();
  got_user_in_intro_screen();
}
function get_user_names() { return Object.keys(DB.users); }
function get_user_pic(uname, sz = 50, border = 'solid medium white') {
  let html = get_user_pic_html(uname, sz, border);
  return mCreateFrom(html);
}
function get_user_pic_and_name(uname, dParent, sz = 50, border = 'solid medium white') {
  let html = `
      <div username='${uname}' style='text-align:center;font-size:${sz / 2.8}px'>
        <img src='../base/assets/users/${uname}.jpg' width='${sz}' height='${sz}' class='img_person' style='margin:0;border:${border}'>
        <div style='margin-top:${-sz / 6}px'>${uname}</div>
      </div>`;
  let elem = mCreateFrom(html);
  mAppend(dParent, elem);
  return elem;
}
function get_user_pic_html(uname, sz = 50, border = 'solid medium white') {
  return `<img src='../base/assets/users/${uname}.jpg' width='${sz}' height='${sz}' class='img_person' style='margin:0px 4px;border:${border}'>`
}
function get_values(o) { return Object.values(o); }
function get_waiting_html(sz = 30) { return `<img src="../assets/icons/active_player.gif" height="${sz}" style="margin:0px ${sz / 3}px" />`; }
function get3ColLine(dParent, idleft, idmiddle, idright, styles = {}) {
  let dOuter = mDiv(dParent);
  let middleStyles = { fz: styles.fz, family: styles.family };
  delete styles.fz; delete styles.family;
  styles = mergeOverride({ wmin: '100%', hmin: 30, vpadding: 4, hpadding: 10, box: true }, styles);
  mStyleX(dOuter, styles);
  let dInner = mDiv(dOuter, { position: 'relative' });
  let l = mDiv(dInner, { family: 'arial', fz: 16, display: 'inline-block', position: 'absolute', wmin: 20 }, idleft)
  let m = mDiv(dInner, { fz: middleStyles.fz, family: middleStyles.family, w: '100%', align: 'center' }, idmiddle);
  let r = mDiv(dInner, { family: 'arial', fz: 16, display: 'inline-block', position: 'absolute', wmin: 20, top: 0, right: 0 }, idright);
  return dOuter;
}
function get3ColLineName(dParent, name, styles = {}) {
  name = 'd' + capitalize(name);
  let dLine = get3ColLine(dParent, name + 'Left', name, name + 'Right', styles);
  return dLine;
}
function getAnimals() {
  let gr = 'Animals & Nature';
  let result = [];
  for (const sg in ByGroupSubgroup[gr]) {
    if (startsWith(sg, 'anim')) result = result.concat(ByGroupSubgroup[gr][sg]);
  }
  return result;
}
function getBar(ctx, list, val) {
  let res = list.filter(p => isWithinDelta(p.x, val, 2) && (isLightBefore(ctx, p.x, p.y) || isLightAfter(ctx, p.x, p.y)));
  return res;
}
function getBg(d) { let style = window.getComputedStyle(toElem(d)); let bg = valf(style.backgroundColor, style.background); return colorHex(bg); }
function getBrowser() {
  var userAgent = navigator.userAgent;
  if (userAgent.match(/chrome|chromium|crios/i)) {
    return "Chrome";
  }
  else if (userAgent.match(/firefox|fxios/i)) {
    return "Firefox";
  }
  else if (userAgent.match(/safari/i)) {
    return "Safari";
  }
  else if (userAgent.match(/msie|trident/i)) {
    return "Internet Explorer";
  }
  else if (userAgent.match(/edg/i)) {
    return "Edge";
  }
  else {
    return "Other";
  }
}
function getButtonCaptionName(name){ return `bTest${name}`;}
function getButtonCaptionNames(table){  return isdef(table) ? table.playerNames : ['felix', 'gul', 'amanda', 'lauren', 'mimi'];}
function getButtonId(key) { return 'b' + capitalize(key); }
function getCheckedNames(dParent) {
  let checks = Array.from(dParent.querySelectorAll('input[type="checkbox"]')); //dParent.getElementsByTagName('input'));
  let res = [];
  for (const ch of checks) {
    if (ch.checked) res.push(ch.name);
  }
  return res;
}
function getCivSpot(civ, row, col, fact = 1) {
  let rAdvisor = { x: 11, y: 27, w: 87, h: 136 }; //von persia
  let rColony1 = { x: 10, y: 193, w: 87, h: 137 }; //von japan
  let rColony2 = { x: 122, y: 192, w: 87, h: 136 }; //von india
  let rColonyUpPersia = { x: 122, y: 26, w: 87, h: 136 }; //von portugal
  let rBuilding1 = { x: 132, y: 26, w: 87, h: 136 }; //von portugal
  let rBuilding1Persia = { x: 243, y: 26, w: 87, h: 136 }; //von persia
  let rBuilding2 = { x: 243, y: 28, w: 87, h: 136 };
  let dxBuildings = rBuilding2.x - (rBuilding1.x + rBuilding1.w);
  let rWic = { x: 700, y: 26, w: 87, h: 136 }; //calculated
  let rLastWonder = { x: 700, y: 193, w: 87, h: 136 };
  let rWonder = { x: 674, y: 193, w: 87, h: 136 };
  let dxWonders = 25;
  for (const r of [rAdvisor, rColony1, rColony2, rColonyUpPersia, rBuilding1, rBuilding1Persia, rBuilding2, rWic, rLastWonder, rWonder]) {
    r.x *= fact; r.y *= fact; r.w *= fact; r.h *= fact;
  }
  dxBuildings *= fact;
  dxWonders *= fact;
  if (row == 0 && col == 0) return rAdvisor;
  if (row == 0 && col == 1 && civ == 'persia') return rColonyUpPersia;
  if (row == 0 && col == 1) return rBuilding1;
  if (row == 0 && col == 2 && civ == 'persia') return rBuilding1Persia;
  if (row == 0 && col == 2) return rBuilding2;
  if (row == 0 && col == 6) return rWic;
  let r, dist;
  if (row == 0) {
    r = rBuilding2;
    dist = dxBuildings + r.w
    return { x: r.x + dist * (col - 2), y: r.y, w: r.w, h: r.h };
  }
  if (row == 1 && col == 0) return rColony1;
  if (row == 1 && col == 1 && civ != 'china' && civ != 'poland') return rColony2;
  if (row == 1 && col == 6) return rLastWonder;
  r = rLastWonder;
  dist = dxWonders + r.w;
  return { x: r.x - dist * (6 - col), y: r.y, w: r.w, h: r.h };
}
function getColorDictColor(c) { return isdef(ColorDict[c]) ? ColorDict[c].c : c; }
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
function getContrast(rgb1, rgb2) {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05)
    / (darkest + 0.05);
}
function getCssVar(varname) { return getComputedStyle(document.body).getPropertyValue(varname); }
function getCSSVariable(varname) { return getCssVar(varname); }
function getDivId(key) { return 'd' + capitalize(key); }
function getDynId(loc, oid) { return loc + '@' + oid; }
async function getEvent(id, cachedOk = true) {
  let res = lookup(Serverdata, ['events', id]);
  if (!cachedOk) Serverdata.events[id] = await mGetRoute('event', { id });
  return res;
}
async function getEvents(cachedOk = false) {
  if (!cachedOk) Serverdata.events = await mGetRoute('events');
  return Serverdata.events;
}
function getEventValue(o) {
  if (isEmpty(o.time)) return o.text;
  return o.time + ' ' + stringBefore(o.text, '\n');
}
function getExtendedColors(bg, fg) {
  bg = computeColor(bg);
  fg = computeColor(fg);
  if (bg == 'inherit' && (nundef(fg) || fg == 'contrast')) {
    fg = 'inherit';
  } else if (fg == 'contrast' && isdef(bg) && bg != 'inherit') fg = colorIdealText(bg);
  else if (bg == 'contrast' && isdef(fg) && fg != 'inherit') { bg = colorIdealText(fg); }
  return [bg, fg];
}
function getFunctionsNameThatCalledThisFunction() {
  let c1 = getFunctionsNameThatCalledThisFunction.caller;
  if (nundef(c1)) return 'no caller!';
  let c2 = c1.caller;
  if (nundef(c2)) return 'no caller!';
  return c2.name;
}
function getGameColor(gamename) { return Serverdata.config.games[gamename].color; }
function getGameFriendly(game) { return Serverdata.config.games[game].friendly; }
function getGameOption(prop) { return lookup(Clientdata, ['table', 'options', prop]); }
function getGamePlayerOptions(gamename) { return Serverdata.config.games[gamename].ploptions; }
function getGameProp(prop) { return Serverdata.config.games[Clientdata.table.game][prop]; }
function getGameValues() {
  let user = U.id;
  let game = G.id;
  let level = G.level;
  let settings = { numColors: 1, numRepeat: 1, numPics: 1, numSteps: 1, colors: ColorList };
  settings = mergeOverride(settings, DB.settings);
  if (isdef(U.settings)) settings = mergeOverride(settings, U.settings);
  if (isdef(DB.games[game])) settings = mergeOverride(settings, DB.games[game]);
  let next = lookup(DB.games, [game, 'levels', level]); if (next) settings = mergeOverride(settings, next);
  next = lookup(U, ['games', game]); if (next) settings = mergeOverride(settings, next);
  next = lookup(U, ['games', game, 'levels', level]); if (next) settings = mergeOverride(settings, next);
  delete settings.levels;
  Speech.setLanguage(settings.language);
  return settings;
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
function getIdKey(elem) { let id = mBy(elem).id; return id.substring(1).toLowerCase(); }
function getItem(k) { return infoToItem(Syms[k]); }
function getKeySets() {
  makeCategories();
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
function getLevelColor(n) {
  const levelColors = [LIGHTBLUE, BLUE, GREEN, YELLOW, 'orange', RED, '#222',
    GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue', 'deeppink', //** MAXLEVEL 10 */
    TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE, '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'palegreen', '#e6194B'];
  return levelColors[n - 1]; 
}
function getLine(ctx, list, val) {
  let res = list.filter(p => isWithinDelta(p.y, val, 2) && (isLightBeforeV(ctx, p.x, p.y) || isLightAfterV(ctx, p.x, p.y)));
  let ls = sortBy(res, 'x');
  let segments = [], seg = [];
  let i = -1; let lastx = -1;
  while (++i < ls.length) {
    let el = ls[i];
    if (lastx >= 0 && el.x > lastx + 1) {
      segments.push(seg); seg = [];
    } else {
      if (el.x != lastx) seg.push(el);
    }
    lastx = el.x;
  }
  segments.push(seg);
  let len = 0, best = null;
  for (const s of segments) { if (s.length > len) { len = s.length; best = s } }
  return best;
}
function getMouseCoordinates(event) {
  const image = event.target;
  const offsetX = event.clientX +
    (window.scrollX !== undefined ? window.scrollX : (document.documentElement || document.body.parentNode || document.body).scrollLeft) -
    12;
  const offsetY = event.clientY +
    (window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop) -
    124;
  return { x: offsetX, y: offsetY };
}
function getMouseCoordinatesRelativeToElement(ev, elem) {
  if (nundef(elem)) elem = ev.target;
  const rect = elem.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;
  return { x, y };
}
function getNature() {
  let gr = 'Animals & Nature';
  let result = [];
  for (const sg in ByGroupSubgroup[gr]) {
    result = result.concat(ByGroupSubgroup[gr][sg]);
  }
  return result;
}
function getO(n, R) { let oid = n.oid; if (isdef(oid)) return R.getO(oid); else return null; }
function getParams(areaName, oSpec, oid) {
  let params = oSpec.params ? oSpec.params : {};
  let panels = oSpec.panels ? oSpec.panels : [];
  let num = panels.length;
  let or = params.orientation ? params.orientation == 'h' ? 'rows'
    : 'columns' : DEF_ORIENTATION;
  let split = params.split ? params.split : DEF_SPLIT;
  let bg = oSpec.color ? oSpec.color : randomColor();
  let fg = bg ? colorIdealText(bg) : null;
  let id = oSpec.id ? oSpec.id : areaName;
  if (oid) { id = getDynId(id, oid); }
  let parent = mBy(areaName);
  if (oSpec.id) {
    parent.id = id;
    addAREA(id, oSpec);
    parent.innerHTML = id;
  }
  if (bg) { mColor(parent, bg, fg); }
  return [num, or, split, bg, fg, id, panels, parent];
}
function getParamsForMaPicStyle(desc = 'segoeBlack') {
  desc = desc.toLowerCase();
  switch (desc) {
    case 'twittertext': return { isText: true, isOmoji: false };
    case 'twitterimage': return { isText: false, isOmoji: false };
    case 'openmojitext': return { isText: true, isOmoji: true };
    case 'openmojiimage': return { isText: false, isOmoji: true };
    case 'openmojiblacktext': return { isText: true, isOmoji: 'openmoBlack' };
    case 'segoe': return { isText: true, isOmoji: 'segoe ui emoji' };
    case 'segoeblack': return { isText: true, isOmoji: 'segoe ui symbol' };
    default: return { isText: true, isOmoji: false };
  }
}
function getPixRgb(ctx, x, y) {
  var pix = ctx.getImageData(x, y, 1, 1).data;
  var red = pix[0]; var green = pix[1]; var blue = pix[2];
  return { r: red, g: green, b: blue };
}
function getPlayerProp(prop) { let pl = Clientdata.table.fen.players[getUname()]; return pl[prop]; }
function getPlayersWithMaxScore(fen) {
  let list = dict2list(fen.players, 'name');
  list = sortByDescending(list, 'score');
  maxlist = arrTakeWhile(list, x => x.score == list[0].score);
  return maxlist.map(x => x.name);
}
function getPlaymode(idOrTable, name) {
  if (isDict(idOrTable)) {
    let table = idOrTable;
    return isdef(table.fen) ? table.fen.players[name].playmode : 'no fen';
  } else if (Clientdata.table) {
    return Clientdata.table.id == idOrTable ? Clientdata.table.fen.players[name].playmode : 'wrong table';
  } else return 'NO table!';
}
function getRandomFromArray(array) { return (array[randomIndex(array) | 0]) }
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
  addKeys({ l: r.x, t: r.y, r: r.x + r.w, b: r.y + r.h }, r);
  return r;
}
function getRectInt(elem, relto) {
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
  let r4 = { x: Math.round(res.left), y: Math.round(res.top), w: Math.round(res.width), h: Math.round(res.height) };
  extendRect(r4);
  return r4;
}
function getRelCoords(ev, elem) {
  let x = ev.pageX - elem.offset().left;
  let y = ev.pageY - elem.offset().top;
  return { x: x, y: y };
}
function getServerurl() {
  let type = detectSessionType();
  let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
  return server;
}
function getSizeNeeded(elem) {
  var d = elem.cloneNode(true);
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
function getThemeBg() { let style = window.getComputedStyle(document.body); let bg = valf(style.backgroundColor, style.background); return colorHex(bg); }
function getThemeDark() { return getCSSVariable('--bgNav'); } //  let bg=getThemeBg();return colorIdealText(bg);}
function getThemeFg() { return getCSSVariable('--fgButtonHover'); } //  let bg=getThemeBg();return colorIdealText(bg);}
function getTimeElapsed() { return TimeElapsed + msElapsedSince(TimestampStarted); }
function getTurnPlayers(fen) {
  return fen.turn.join(', ');
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
function getUname() { assertion(Clientdata.curUser == U.name, `getUname!!!!!!!${Clientdata.curUser} != ${U.name}`); return Clientdata.curUser; }
async function getUser(name, cachedOk = false) {
  let res = lookup(Serverdata, ['users', name]);
  if (!res || !cachedOk) res = await mGetRoute('user', { name });
  if (!res) {
    let key = isdef(M.superdi[name]) ? name : rChoose(Object.keys(M.superdi))
    res = await postUserChange({ name, color: rChoose(M.playerColors), key });
  }
  Serverdata.users[name] = res;
  return res;
}
function getUserColor(uname) { return Serverdata.users[uname].color; }
function gFg(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gG() { return gCreate('g'); }
function gHex(w, h) { let pts = size2hex(w, h); return gPoly(pts); }
function gLine(x1, y1, x2, y2) { let r = gCreate('line'); r.setAttribute('x1', x1); r.setAttribute('y1', y1); r.setAttribute('x2', x2); r.setAttribute('y2', y2); return r; }
function got_create_table(obj) { Session.cur_tid = obj.table.id; Session.cur_table = obj.table; present_table(obj); }
function got_dictionary(obj) {
  let lang = obj.lang;
  let x = obj.dict;
  Dictionary[lang] = to_words(x);
  return;
  let keys = get_keys(obj).filter(x => endsWith(x, 'dict'));
  console.log('keys', keys)
  if (isEmpty(keys)) return;
  if (nundef(Dictionary)) Dictionary = {};
  let l = obj.lang;
  for (const k of keys) {
    if (nundef(Dictionary[l])) {
      Dictionary[l] = to_words(obj[k]);
    }
  }
}
function got_games(obj) {
  let tables = obj.tables;
  let bygame = set_tables_by_game(obj, false);
  set_most_recent_table_as_cur_tid(tables);
  present_games();
}
function got_intro(obj) {
  Session.users = obj.users;
  Session.users_by_name = {};
  for (const u of Session.users) {
    Session.users_by_name[u.username] = u;
    if (isdef(DB.users[u.username])) { copyKeys(DB.users[u.username], u); }
  }
  present_intro();
}
function got_modify_table(obj) { Session.cur_tid = obj.table.id; Session.cur_table = obj.table; present_table(obj); }
function got_non_admin_reload(obj) {
  in_game_off();
  in_game_open_prompt_off();
  console.log('got_non_admin reload: obj', obj)
  set_tables_by_game(obj);
  tables = obj.tables;
  if (isEmpty(tables)) {
    console.assert(nundef(Session.cur_tid), 'reload no table still cur_tid!!!!!')
    get_user_in_intro_screen();
  } else {
    get_play_start();
  }
}
function got_play(obj) { present_table(obj); }
function got_play_start(obj) {
  console.log('got_play_start', obj);
  let table = obj.table;
  console.log('fen', table.fen);
  let lang = get_preferred_lang(Session.cur_user);
  set_start_data_from_fen(obj.table.fen, obj.table.game);
  let lang2 = get_preferred_lang(Session.cur_user);
  if (lang != lang2) get_dictionary();
  present_table(obj);
}
function got_send_move(obj) { present_table(obj); }
function got_tables(obj) {
  set_tables_by_game(obj);
  if (isdef(Session.cur_tid)) { get_play(); } else get_games();
}
function got_user_game_tables(obj) {
  let tables = obj.tables;
  if (!isEmpty(tables)) { Session.cur_tid = tables[0].id; Session.cur_table = tables[0]; }
}
function got_user_in_intro_screen() {
  show('dIntro'); clearElement('dIntro');
  intro_show_user_image(Session.cur_user);
  present_wait_for_table_to_start();
}
function gPoly(pts) { let r = gCreate('polygon'); if (pts) r.setAttribute('points', pts); return r; }
function gPos(g, x, y) { g.style.transform = `translate(${x}px, ${y}px)`; }
function gRect(w, h) { let r = gCreate('rect'); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('x', -w / 2); r.setAttribute('y', -h / 2); return r; }
function gRounding(r, rounding) {
  r.setAttribute('rx', rounding);
  r.setAttribute('ry', rounding);
}
function gSet() {
  function set_fen() {
    let items = Session.items;
    let fen = items.map(x => x.fen).join(',');
    return fen;
  }
  function set_prompt(g, fen) {
    let [n, rows, cols] = [g.num_attrs, g.rows, g.cols];
    let all_attrs = gSet_attributes();
    let attrs_in_play = arrTake(get_keys(all_attrs), n);
    let deck = g.deck = make_set_deck(n);
    shuffle(deck);
    let goal = Goal = { set: make_goal_set(deck, g.prob_different), cards: [] };
    let dCards = stdRowsColsContainer(dTable, cols, styles = { bg: 'transparent' });
    let card_styles = { w: cols > 4 ? 130 : 160 };
    let items = g.items = [];
    let deck_rest = arrWithout(deck, goal.set);
    let fens = choose(deck_rest, rows * cols - 3);
    let all_fens = goal.set.concat(fens);
    shuffle(all_fens);
    if (isdef(fen)) { all_fens = fen.split(','); }
    for (const f of all_fens) {
      let item = create_set_card(f, dCards, card_styles);
      let d = iDiv(item);
      mStyle(d, { cursor: 'pointer' });
      d.onclick = set_interact;
      if (Goal.set.includes(item.fen)) Goal.cards.push(item);
      items.push(item);
    }
    g.selected = [];
    return items;
  }
  function set_interact(ev) {
    ev.cancelBubble = true;
    if (!canAct()) { console.log('no act'); return; }
    let id = evToId(ev);
    if (isdef(Items[id])) {
      let item = Items[id];
      toggleSelectionOfPicture(item, Session.selected);
      if (Session.selected.length == 3) {
        let correct = check_complete_set(Session.selected.map(x => x.fen));
        if (correct) {
          Selected = { isCorrect: true, feedbackUI: Session.selected.map(x => iDiv(x)) };
        } else {
          Selected = { isCorrect: false, correctUis: Goal.cards.map(x => iDiv(x)), feedbackUI: null, animation: 'onPulse1' };
        }
        set_eval();
      }
    }
  }
  function set_eval() {
    if (!canAct()) return;
    uiActivated = false; clear_timeouts();
    IsAnswerCorrect = Selected.isCorrect;
    race_set_fen();
    race_update_my_score(IsAnswerCorrect ? 1 : 0);
    let delay = show_feedback(IsAnswerCorrect);
    setTimeout(() => {
      in_game_open_prompt_off();
      clear_table_events();
      race_send_move();
    }, delay);
  }
  return {
    prompt: set_prompt,
    fen: set_fen,
  }
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
function gShape(shape, w = 20, h = 20, color = 'green', rounding) {
  let el = gG();
  if (nundef(shape)) shape = 'rect';
  if (shape != 'line') agColoredShape(el, shape, w, h, color);
  else gStroke(el, color, w);
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
function gStroke(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gSvg() { return gCreate('svg'); }
function handle_gehtHoch() {
  let [A, fen, uplayer] = [Z.A, Z.fen, Z.uplayer];
  let [bid, bidder] = [fen.lastbid, fen.lastbidder];
  let diff = calc_bid_minus_cards(fen, bid);
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
function handle_result(result, cmd) {
  if (verbose) console.log('cmd', cmd, '\nresult', result);
  if (result.trim() == "") return;
  let obj;
  try { obj = JSON.parse(result); } catch { console.log('ERROR:', result); }
  if (Clientdata.AUTORESET) { Clientdata.AUTORESET = false; if (result.auto == true) { console.log('message bounced'); return; } }
  DA.result = jsCopy(obj);
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
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : null;
}
function hFunc(content, funcname, arg1, arg2, arg3) {
  let html = `<a style='color:blue' href="javascript:${funcname}('${arg1}','${arg2}','${arg3}');">${content}</a>`;
  return html;
}
function hide(elem) {
  if (isString(elem)) elem = document.getElementById(elem);
  if (nundef(elem)) return;
  if (isSvg(elem)) {
    elem.setAttribute('style', 'visibility:hidden;display:none');
  } else {
    elem.style.display = 'none';
  }
}
function hide_options_popup() { let d = mBy('dOptions'); if (isdef(d)) mRemove(d); }
function hourglassUpdate() {
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
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
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
function i_am_acting_host() { return U.name == Z.fen.acting_host; }
function i_am_host() { return U.name == Z.host; }
function i_am_trigger() { return is_multi_trigger(U.name); }
function iAdd(item, liveprops={}, addprops={}) {
  let id, l;
  if (isString(item)) { id = item; item = valf(Items[id], {}); }
  let el = valf(liveprops.div, liveprops.ui, iDiv(item), null);
  id = valnwhite(addprops.id, item.id, (el ? el.id : getUID()), getUID());
  item.id = id; if (nundef(Items[id])) Items[id] = item; if (el) el.id = id;
  if (nundef(item.live)) item.live = {};
  l = item.live;
  for (const k in liveprops) {
    let val = liveprops[k];
    if (nundef(val)) { continue; }
    l[k] = val;
    if (isdef(val.id) && val.id != id) { lookupAddIfToList(val, ['memberOf'], id); }
  }
  if (isdef(addprops)) copyKeys(addprops, item);
  return item;
}
function iClear(item) {
  if (nundef(item)) return;
  if (isString(item)) { let id = item; if (isdef(Items[id])) item = Items[id]; else item = toElem(id); }
  let d = iDiv(item);
  if (isdef(d)) {
    let desc = Array.from(d.querySelectorAll('[id]:not([id=""])'));
    desc = desc.filter(x => isdef(Items[x.id]))
    for (const item1 of desc) iDelete(item1.id);
    mClear(d);
  }
}
function idealTextColor(bg, grayPreferred = false, nThreshold = 105) {
  if (bg.substring(0, 1) != '#') bg = colorNameToHexString(bg);
  rgb = hexToRgb(bg);
  r = rgb.r;
  g = rgb.g;
  b = rgb.b;
  var bgDelta = r * 0.299 + g * 0.587 + b * 0.114; 
  var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
  if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
  return foreColor;
}
function iDelete(id) {
  delete Items[id];
}
function iDiv(i) { return isdef(i.live) ? i.live.div : valf(i.div, i.ui, i); } //isdef(i.div) ? i.div : i; }
function if_hotseat_autoswitch(result) {
  if (isdef(result.table) && isdef(Z) && Z.mode == 'hotseat') {
    let turn = lookup(result, ['table', 'fen', 'turn']);
    assertion(isdef(turn), 'turn is NOT defined (_sendSIMSIM) !!!!');
    let uname = turn.length == 1 ? turn[0] : arrNext(turn, U.name);
    if (uname != U.name) switch_uname(uname);
  }
}
function if_stringified(obj) { return is_stringified(obj) ? JSON.parse(obj) : obj; }
async function imgAsIsInDiv(url, dParent) {
  let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
  let sz = 300;
  let img = await imgAsync(d, {}, { tag: 'img', src: url });
  let [w, h] = [img.width, img.height]; console.log('sz', w, h);
  let scale = sz / img.height;
  return [img, scale];
}
async function imgAsync(dParent, styles, opts) {
  let path = opts.src;
  delete opts.src;
  addKeys({ tag: 'img' }, opts); //if forget
  return new Promise((resolve, reject) => {
    const img = mDom(dParent, styles, opts);
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = path;
  });
}
function imgBackground(d, src) {
  d.style.backgroundImage = `url('${src}')`; //../assets/games/nations/civs/civ_${pl1.civ}.png')`;
  d.style.backgroundSize = 'cover';
}
async function imgCrop(img, dc, wOrig, hOrig) {
  let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); console.log('dims', dims);
  let wScale = img.width / wOrig;
  let hScale = img.height / hOrig;
  console.log('scale', wScale, hScale, wOrig, hOrig, img.width, img.height)
  let d1 = mDom(document.body, { margin: 10 });
  let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)
}
function imgExpand(img, dc, sz) { img.width += 20; adjustCropper(img, dc, sz); return [img.width, img.height]; }
async function imgMeasure(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
    img.onload = () => {
      resolve({ img: img, w: img.width, h: img.height });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = src;
  });
}
function imgReset(img, dc, sz, w, h) { img.width = w; img.height = h; adjustCropper(img, dc, sz); return [w, h]; }
async function imgScaledToHeightInDiv(url, dParent, sz = 300) {
  let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
  let img = await imgAsync(d, {}, { tag: 'img', src: url });
  let [w, h] = [img.width, img.height]; console.log('orig', w, h);
  let scale = sz / img.height;
  img.width *= scale;
  img.height *= scale;
  mStyle(img, { w: img.width, h: img.height })
  return [img, scale];
}
function imgSquish(img, dc, sz) { let w = mGetStyle(dc, 'w'); if (img.width == w) return; else { img.width = Math.max(img.width - 20, w); adjustCropper(img, dc, sz); return [img.width, img.height]; } }
function imgToDataUrl(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/png');
  return dataUrl;
}
async function imgToServer(canvas, path) {
  let dataUrl = canvas.toDataURL('image/png');
  let o = { image: dataUrl, path: path };
  console.log('...postImage o', o)
  let resp = await mPostRoute('postImage', o);
  return resp;
}
function in_game() { return isdef(mBy('table')) && Session.in_game == `${Session.cur_user} ${Session.cur_tid}`; }
function in_game_off() { Session.in_game = null; }
function in_game_on() { Session.in_game = `${Session.cur_user} ${Session.cur_tid}`; }
function in_game_open_prompt() { return uiActivated && Session.in_prompt == `${Session.cur_user} ${Session.cur_tid}`; }
function in_game_open_prompt_off() { Session.in_prompt = null; }
function in_game_open_prompt_on() { Session.in_prompt = `${Session.cur_user} ${Session.cur_tid}`; }
function inc_handsize(fen, uname) {
  let pl = fen.players[uname];
  pl.handsize = Number(pl.handsize) + 1;
  return pl.handsize;
}
function increase_handicap_if_losestreak(losers, game) {
  console.log('winners', losers);
  for (const w of losers) {
    let o = lookupSet(DB.users, [w, 'games', game], {});
    if (nundef(o.losestreak)) o.losestreak = 1; else o.losestreak += 1;
    if (o.losestreak >= 1) {
      lookupSetOverride(o, ['startlevel'], Math.max(o.startlevel - 1, 0));
      o.losestreak = 0;
      console.log('...startlevel of', w, 'is decreased to', get_startlevel(w, game));
    }
  }
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
function infoToItem(x) { let item = { info: x, key: x.key }; item.id = iRegister(item); return item; }
function initCodingUI() {
  mStyle('dMain', { bg: 'silver' });
  [dTable, dSidebar] = mCols100('dMain', '1fr auto', 0);
  let [dtitle, dta] = mRows100(dTable, 'auto 1fr', 2);
  mDiv(dtitle, { padding: 10, fg: 'white', fz: 24 }, null, 'OUTPUT:');
  AU.ta = mTextArea100(dta, { fz: 20, padding: 10, family: 'opensans' });
}
function initCrowd() {
  while (availablePeeps.length) {
    addPeepToCrowd().walk.progress(Math.random())
  }
}
function initTable() {
  clearElement(dTableBackground);
  setTableBackground(RED, 'white', true);
  let ltitle = get3ColLineName(dTableBackground, 'title', { hmin: 30 });
  mStyleX(dTitle, { maleft: -50 })
  let ltable = get3ColLineName(dTableBackground, 'table', {});
  let lbottom = get3ColLineName(dTableBackground, 'bottom', { position: 'absolute', bottom: 30 });
}
function inpToChecklist(ev, grid) {
  let key = ev.key;
  let inp = ev.target;
  if (key == 'Backspace') {
    let s = inp.value;
    let cursorPos = inp.selectionStart;
    let ch = cursorPos == 0 ? null : inp.value[cursorPos - 1];
    if (!ch || isWhiteSpace(ch)) {
      doYourThing(inp, grid);
    }
    console.log('Backspace', ch);
    return;
  }
  if (key == 'Enter') ev.preventDefault();
  if (isExpressionSeparator(key) || key == 'Enter') doYourThing(inp, grid);
}
function instructionUpdate() {
}
function interrupt() {
  STOPAUS = true;
  uiActivated = aiActivated = false;
  clearTimeouts();
  if (isdef(G.clear)) G.clear();
  TOMan.clear();
  clearMarkers();
}
function INTERRUPT() {
  DA.merged = get_now(); 
  if (isdef(TO.SLEEPTIMEOUT)) { clearEvents(); } 
  DA.Tprev = T; T = null;
  delete DA.stopAutobot;
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
function intersectionOfArrays() {
  let arrs = arguments[0]; console.log('arrs', arrs);
  if (!arrs.every(Array.isArray)) arrs = Array.from(arguments);
  return arrs.reduce((acc, array) => acc.filter(element => array.includes(element)));
}
function intro_create_score_table(fen) {
  let dParent = mBy('dIntro');
  let d = mDiv(dParent, { margin: 'auto', w: 300 });
  html = `<div style='text-align:center;margin-top:100px'>
  <table id='customers'><tr><th>player</th><th>score</th></tr>
  `;
  let plparts = fen.split(',');
  for (const pl of plparts) {
    html += `<tr><td>${stringBefore(pl, ':')}</td><td>${stringAfter(pl, ':')}</td></tr>`
  }
  html += '</table></div>';
  d.innerHTML = html;
}
function intro_show_user_image(uname) {
  let dParent = mBy('dIntro');
  let d = mDiv(dParent, { margin: 'auto', w: 300 });
  let html = `
  <div style='text-align:center;margin-top:100px'>
    <img src='../base/assets/images/${uname}.jpg' class="img_person" height=200 />
  </div>
  `;
  d.innerHTML = html;
}
function iRegister(item, id) { let uid = isdef(id) ? id : getUID(); Items[uid] = item; return uid; }
function is_admin(name) { return ['mimi'].includes(isdef(name) ? name : Session.cur_user); }
function is_advanced_user() {
  let advancedUsers = ['mimi', 'bob', 'buddy', 'minnow', 'nimble', 'leo'];
  return isdef(U) && ((advancedUsers.includes(DA.secretuser) || advancedUsers.includes(U.name)));
}
function is_ai_player(plname) {
  let [fen, name] = [Z.fen, valf(plname, Z.uplayer)];
  return lookup(fen, ['players', name, 'playmode']) == 'bot';
}
function is_card(o) { return isdef(o.rank) || isdef(o.o) && isdef(o.o.rank); }
function is_card_key(ckey, rankstr = '*A23456789TJQK', suitstr = 'SHCD') { return rankstr.includes(ckey[0]) && suitstr.includes(ckey[1]); }
function is_game_host() { return Session.cur_table.host == Session.cur_user; }
function is_human_player(plname) {
  let [fen, name] = [Z.fen, valf(plname, Z.uplayer)];
  return lookup(fen, ['players', name, 'playmode']) == 'human';
}
function is_joker(card) { return is_jolly(card.key); }
function is_jolly(ckey) { return ckey[0] == '*'; }
function is_multi_trigger(plname) { return lookup(Z, ['fen', 'trigger']) == plname; }
function is_online() { return lookup(DA, ['internet']); }
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
function is_playing(pl, fen) {
  return isList(fen.plorder) && fen.plorder.includes(pl) || isList(fen.roundorder) && fen.roundorder.includes(pl) || Z.game == 'feedback' && isdef(Z.fen.players[pl]);
}
function is_shield_mode() {
  return Z.role == 'spectator'
    || Z.mode == 'multi' && Z.role == 'inactive' && Z.host != Z.uname
    || Z.mode == 'multi' && Z.role == 'inactive' && Z.pl.playmode != 'bot'
}
function is_stringified(obj) {
  if (isString(obj)) {
    return '"{[('.includes(obj[0]) || obj[0] == "'";
  }
  return false;
}
function isAlphaNum(s) { query = /^[a-zA-Z0-9]+$/; return query.test(s); }
function isAlphanumeric(s) { for (const ch of s) { if (!isLetter(ch) && !isDigit(ch)) return false; } return isLetter(s[0]); }
function isBetween(n, a, b) { return n >= a && n <= b }
function isdef(x) { return x !== null && x !== undefined; }
function isDict(d) { let res = (d !== null) && (typeof (d) == 'object') && !isList(d); return res; }
function isDigit(s) { return /^[0-9]$/i.test(s); }
function isEmpty(arr) {
  return arr === undefined || !arr
    || (isString(arr) && (arr == 'undefined' || arr == ''))
    || (Array.isArray(arr) && arr.length == 0)
    || Object.entries(arr).length === 0;
}
function isEmptyOrWhiteSpace(s) { return isEmpty(s.trim()); }
function isExpressionSeparator(ch) { return ',-.!?;:'.includes(ch); }
function isGrayColor(color, diff = 60) {
  const rgb = colorHexToRgb(color);
  return Math.abs(rgb.r - rgb.g) + Math.abs(rgb.r - rgb.b) + Math.abs(rgb.g - rgb.b) < 3 * diff;
}
function isLetter(s) { return /^[a-zA-Z]$/i.test(s); }
function isLightAfter(ctx, x, y) {
  for (let p = x + 1; p < x + 4; p++) if (isPixLight(ctx, p, y)) return true;
  return false;
}
function isLightAfterV(ctx, x, y) {
  for (let p = y + 1; p < y + 5; p++) if (isPixLight(ctx, x, p)) return true;
  return false;
}
function isLightBefore(ctx, x, y) {
  for (let p = x - 4; p < x - 1; p++) if (isPixLight(ctx, p, y)) return true;
  return false;
}
function isLightBeforeV(ctx, x, y) {
  for (let p = y - 4; p < y - 1; p++) if (isPixLight(ctx, x, p)) return true;
  return false;
}
function isList(arr) { return Array.isArray(arr); }
function isLiteral(x) { return isString(x) || isNumber(x); }
function isMergeableObject(val) {
  var nonNullObject = val && typeof val === 'object'
  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]'
}
function isMyTurn(fen) {  return fen.turn.includes(getUname())}
function isNumber(x) { return x !== ' ' && x !== true && x !== false && isdef(x) && (x == 0 || !isNaN(+x)); }
function isNumeric(x) { return !isNaN(+x); }
function isObject(item) { return item && typeof item === 'object' && !Array.isArray(item); }
function isPix(ctx, x, y, color, delta = 10) {
  let rgb = isString(color) ? colorRGB(color, true) : color;
  let p = getPixRgb(ctx, x, y);
  let found = isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
  return found ? p : null;
}
function isPixDark(ctx, x, y) {
  var pix = ctx.getImageData(x, y, 1, 1).data;
  var red = pix[0]; var green = pix[1]; var blue = pix[2];
  return green < 100 && blue < 100;
}
function isPixLight(ctx, x, y) {
  var pix = ctx.getImageData(x, y, 1, 1).data;
  var red = pix[0]; var green = pix[1]; var blue = pix[2];
  return red + green + blue > 520;
}
function isPointOutsideOf(form, x, y) { const r = form.getBoundingClientRect(); return (x < r.left || x > r.right || y < r.top || y > r.bottom); }
function isSameDate(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}
function isSet(x) { return (isDict(x) && (x.set || x._set)); }
function isString(param) { return typeof param == 'string'; }
function isSvg(elem) { return startsWith(elem.constructor.name, 'SVG'); }
function isTimeForAddon() {
  if (nundef(ADS)) return false;
  if (isEmpty(U.avAddons)) return false;
  if (isdef(AD) && AD.running && AD.checkEndCondition()) {
    console.log('END!')
    AD.die();
    U.addons[AD.key].open = false;
    AD = null;
  }
  if (isdef(AD)) return AD.isTimeForAddon();
  let open = allCondDict(U.addons, x => x.open == true);
  if (isEmpty(open)) {
    console.log('open is empty! choosing a random addon!')
    let k = chooseRandom(U.avAddons);
    AD = new ADS[k].cl(k, ADS[k], {});
  } else if (open.length == 1) {
    let k = open[0];
    AD = new ADS[k].cl(k, ADS[k], U.addons[k]);
  } else {
    let k = chooseRandom(open);
    AD = new ADS[k].cl(k, ADS[k], U.addons[k]);
  }
  return AD.isTimeForAddon();
}
function isWhiteSpace(s) { let white = new RegExp(/^\s$/); return white.test(s.charAt(0)); }
function isWithinDelta(n, goal, delta) { return isBetween(n, goal - delta, goal + delta) }
function isWordSeparator(ch) { return ' ,-.!?;:'.includes(ch); }
function ithWord(s, n, allow_) {
  let ws = toWords(s, allow_);
  return ws[Math.min(n, ws.length - 1)];
}
function jsCopy(o) { return JSON.parse(JSON.stringify(o)); }
function jsonToYaml(o) { let y = jsyaml.dump(o); return y; }
function keyDownHandler(ev) {
  if (IsControlKeyDown && MAGNIFIER_IMAGE) return;
  if (!MAGNIFIER_IMAGE && ev.key == 'Control') {
    IsControlKeyDown = true;
    let hoveredElements = document.querySelectorAll(":hover");
    let cand = Array.from(hoveredElements).find(x => mHasClass(x, 'magnifiable'));
    if (isdef(cand)) mMagnify(cand);
  }
}
function keyUpHandler(ev) {
  if (ev.key == 'Control') {
    IsControlKeyDown = false;
    mMagnifyOff();
  }
}
function landing() { if (isdef(DA.landing)) DA.landing(); }
function last(arr) {
  return arr.length > 0 ? arr[arr.length - 1] : null;
}
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
function lastOfLanguage(key, language) {
  let y = symbolDict[key];
  let w = y[language];
  let last = stringAfterLast(w, '|');
  return last.trim();
}
function list2dict(arr, keyprop = 'id', uniqueKeys = true) {
  let di = {};
  for (const a of arr) {
    let key = typeof (a) == 'object' ? a[keyprop] : a;
    if (uniqueKeys) lookupSet(di, [key], a);
    else lookupAddToList(di, [key], a);
  }
  return di;
}
function liste(areaName, oSpec, oid, o) {
  let [num, or, split, bg, fg, id, panels, parent] = getParams(areaName, oSpec, oid);
  parent.style.display = 'inline-grid';
  return parent;
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
function load_user(name, display_ui = true) {
  if (nundef(name)) name = 'guest';
  let udata = lookup(DB, ['users', name]);
  if (!udata) udata = add_new_user({ name: name, color: randomColor(), motto: random_motto(), image: false, games: {}, tables: {} });
  Session.cur_user = name;
  if (!is_admin(name)) localStorage.setItem('user', name);
  if (display_ui) show_user(udata);
  if (name == 'mimi') show('dAdminButtons'); else hide('dAdminButtons');
  return udata;
}
async function loadAndMakeInteractive(imageUrl) {
  try {
    const canvas = await createInteractiveCanvas(imageUrl);
    document.body.appendChild(canvas);
  } catch (error) {
    console.error("Error loading image:", error);
  }
}
async function loadAndScaleImage(imageUrl) {
  try {
    const canvas = await createScaledCanvasFromImage(imageUrl);
    document.body.appendChild(canvas);
  } catch (error) {
    console.error("Error loading image:", error);
  }
}
async function loadAssets() {
  M = await mGetYaml('../y/m.yaml');
  let [di, byColl, byFriendly, byCat] = [M.superdi, {}, {}, {}];
  for (const k in di) {
    let o = di[k];
    for (const cat of o.cats) lookupAddIfToList(byCat, [cat], k);
    for (const coll of o.colls) lookupAddIfToList(byColl, [coll], k);
    lookupAddIfToList(byFriendly, [o.friendly], k)
  }
  M.byCat = byCat;
  M.byCollection = byColl;
  M.byFriendly = byFriendly;
  M.categories = Object.keys(byCat); M.categories.sort();
  M.collections = Object.keys(byColl); M.collections.sort();
  M.names = Object.keys(byFriendly); M.names.sort();
}
function loader_off() { let d = mBy('loader_holder'); if (isdef(d)) d.className = 'loader_off'; }
function loader_on() { let d = mBy('loader_holder'); if (isdef(d)) d.className = 'loader_on'; }
async function loadImageAsync(src, img) {
  return new Promise((resolve, reject) => {
    img.onload = async () => {
      resolve(img);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = src;
  });
}
function loadPlayerColors() {
  let [hstep, hmin, hmax] = [20, 0, 359];
  let [lstep, lmin, lmax] = [20, 50, 60];
  let [sstep, smin, smax] = [30, 70, 100];
  let [whites, blacks, all] = [[], [], []];
  for (let h = hmin; h < hmax; h += hstep) {
    for (let l = lmin; l <= lmax; l += lstep) {
      for (let s = smin; s <= smax; s += sstep) {
        let o = { h: h, s: s, l: l };
        let c = hslToHexCOOL(o);
        o.c = c;
        all.push(o);
        let fg = idealTextColor(c);
        if (fg == 'white') whites.push(c); else blacks.push(c);
      }
    }
  }
  DA.allColors = all;
  blacks.push('#FFDD33')
  let plColors = whites.concat(blacks);
  shuffle(plColors);
  let userColors = {
    "afia": "#69c963",
    "ally": "#6660f3",
    "amanda": "#339940FF",
    "annabel": "#ADA0EEFF",
    "bob": "#033993",
    "buddy": "midnightblue",
    "felix": BLUE,
    "guest": "dodgerblue",
    "gul": "#6fccc3",
    "lauren": BLUEGREEN,
    "leo": "#C19450FF",
    "mac": ORANGE,
    "minnow": "#F28DB2",
    "mimi": "#76AEEBFF",
    "nasi": "#EC4169FF",
    "nimble": "#6E52CCFF",
    "sarah": "deeppink",
    "sheeba": "gold",
    "valerie": "lightgreen"
  };
  for (const plname in userColors) {
    let uc = userColors[plname];
    uc = colorHex(uc);
    let already = firstCond(all, x => x.c.toLowerCase() == uc.substring(0, 7).toLowerCase());
    if (already) console.log('present', uc);
  }
  ensureColorDict();
  ensureColorNames();
  let allColors = Object.values(ColorDi).map(x => x.c);
  let list = Object.values(userColors).concat(plColors.concat(allColors).concat(Object.values(ColorNames)));
  list = list.filter(x => colorLum(x) < .85);
  list = list.filter(x => !isGrayColor(x));
  let s = new Set(list);
  list = Array.from(s);
  let hsllist = list.map(x => colorHSL(x, true));
  sortByMultipleProperties(hsllist, 'h', 'l');
  list = hsllist.map(x => colorHex(x));
  list = arrRemoveDuplicates(list);
  M.playerColors = list;
  return list;
}
function logItems() { Object.keys(Items).sort().forEach(k => console.log('Items', Items[k])); }
function lookup(dict, keys) {
  let d = dict;
  let ilast = keys.length - 1;
  let i = 0;
  for (const k of keys) {
    if (k === undefined) break;
    let e = d[k];
    if (e === undefined || e === null) return null;
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
    if (nundef(k)) continue;
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
    if (nundef(k)) continue;
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
    if (nundef(k)) continue;
    if (nundef(d[k])) d[k] = {};
    d = d[k];
    i += 1;
  }
  return d;
}
function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function luxury_card_deco(card) {
  let d = iDiv(card); mStyle(d, { position: 'relative' });
  let d1 = mDiv(d, { fg: 'dimgray', fz: 11, family: 'tangerine', position: 'absolute', left: 0, top: 0, 'writing-mode': 'vertical-rl', transform: 'scale(-1)', top: '35%' }, null, 'Luxury');
  let html = `<img height=${18} src="../base/assets/icons/deco0.svg" style="transform:scaleX(-1);">`;
  d1 = mDiv(d, { position: 'absolute', bottom: -2, left: 3, opacity: .25 }, null, html);
}
function maButton(caption, handler, dParent, styles) {
  let a = mLink("javascript:void(0)", dParent, {}, null, caption, 'a');
  a.onclick = handler;
  if (isdef(styles)) mStyle(a, styles);
  return a;
}
function make_card_selectable(item) { let d = iDiv(item.o); mClass(d, 'selectable'); if (Z.game != 'aristo') { spread_hand(item.path, .3); } mClass(d.parentNode, 'selectable_parent'); }
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
function make_csv_for_rankings() {
  let csv = 'players,';
  let games = get_values(DB.games);
  let gamenames = games.map(x => x.friendly).join(',');
  csv += gamenames;
  for (const name in DB.users) {
    let [dbuser, values, usergames] = [DB.users[name], [], []];
    for (const gname in dbuser.games) {
      let rec = dbuser.games[gname];
      if (isdef(rec.total) && rec.total > 0) usergames.push(gname);
    }
    if (isEmpty(usergames)) continue;
    for (const gname in DB.games) {
      let info = lookupSet(DB.users, [name, 'games', gname], {});
      if (nundef(info.total)) values.push('0/0'); else values.push(`${info.wins}/${info.total}`);
    }
    if (!isEmpty(values)) csv += `\n${name},` + values.join(',');
  }
  return csv;
}
function make_goal_set(deck, prob_different) {
  let [fen1, fen2, fen3] = [deck[0], '', ''];
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
function make_players(playernames) {
  let o = Session.cur_players = {};
  for (const plname of playernames) {
    o[plname] = { name: plname, color: getColorDictColor(DB.users[plname].color), imgPath: `../base/assets/images/${plname}.jpg`, score: 0 };
  }
  Session.cur_me = o[Session.cur_user];
  Session.cur_others = get_values(o).filter(x => x.name != Session.cur_user);
}
function make_set_deck(n_or_attr_list) {
  let all_attrs = gSet_attributes();
  let keys = get_keys(all_attrs);
  let n = isNumber(n_or_attr_list) ? n_or_attr_list : n_or_attr_list.length;
  let attrs = isNumber(n_or_attr_list) ? arrTake(keys, n) : n_or_attr_list;
  let list = ['0', '1', '2'];
  let i = 1;
  while (i < n) {
    let [l1, l2, l3] = [jsCopy(list), jsCopy(list), jsCopy(list)];
    l1 = l1.map(x => '0' + x); l2 = l2.map(x => '1' + x); l3 = l3.map(x => '2' + x);
    list = l1.concat(l2).concat(l3);
    i++;
  }
  return list;
}
function make_string_selectable(item) { let d = mBy(item.id); mClass(d, 'selectable_button'); }
function make_string_selected(item) { let d = mBy(item.id); item.bg = mGetStyle(d, 'bg'); item.fg = mGetStyle(d, 'fg'); mStyle(d, { bg: 'yellow', fg: 'black' }); }
function make_string_unselectable(item) { let d = mBy(item.id); d.onclick = null; mClassRemove(d, 'selectable_button'); }
function make_string_unselected(item) { let d = mBy(item.id); mStyle(d, { bg: item.bg, fg: item.fg }); }
function makeArrayWithParts(keys) {
  let arr = []; keys[0].split('_').map(x => arr.push([]));
  for (const key of keys) {
    let parts = key.split('_');
    for (let i = 0; i < parts.length; i++) arr[i].push(parts[i]);
  }
  return arr;
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
function makeDefaultPool(fromData) {
  if (nundef(fromData) || isEmpty(fromData.table) && isEmpty(fromData.players)) return {};
  if (nundef(fromData.table)) fromData.table = {};
  let data = jsCopy(fromData.table);
  for (const k in fromData.players) {
    data[k] = jsCopy(fromData.players[k]);
  }
  return data;
}
function makeItemDiv(item, options) {
  if (isdef(options.outerStyles) && isdef(options.ifs)) copyKeys(item, options.outerStyles, {}, Object.keys(options.ifs));
  let dOuter = mCreate('div', options.outerStyles, item.id);
  if (isdef(item.textShadowColor)) {
    let sShade = '0 0 0 ' + item.textShadowColor;
    if (options.showPic) {
      options.picStyles['text-shadow'] = sShade;
      options.picStyles.fg = colorFrom('black', options.contrast);
    } else {
      options.labelStyles['text-shadow'] = sShade;
      options.labelStyles.fg = colorFrom('black', options.contrast);
    }
  }
  let dLabel;
  if (options.showLabels && options.labelTop == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }
  let dPic;
  if (options.showPic) {
    dPic = mDiv(dOuter, { family: item.info.family });
    dPic.innerHTML = item.info.text;
    if (isdef(options.picStyles)) mStyleX(dPic, options.picStyles);
  }
  if (options.showLabels && options.labelBottom == true) { dLabel = mText(item.label, dOuter, options.labelStyles); }
  if (isdef(options.handler)) dOuter.onclick = options.handler;
  iAdd(item, { options: options, div: dOuter, dLabel: dLabel, dPic: dPic });
  if (isdef(item.textShadowColor)) { applyColorkey(item, options); }
  return dOuter;
}
function makePool(cond, source, R) {
  if (nundef(cond)) return [];
  else if (cond == 'all') return source;
  let pool = [];
  for (const oid of source) {
    let o = R.getO(oid);
    if (!evalConds(o, cond)) continue;
    pool.push(oid);
  }
  return pool;
}
function makeSVG(tag, attrs) {
  var el = "<" + tag;
  for (var k in attrs)
    el += " " + k + "=\"" + attrs[k] + "\"";
  return el + "/>";
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
function mAnimateTo(elem, prop, val, callback, msDuration = 1000, easing = 'cubic-bezier(1,-0.03,.86,.68)', delay = 0) {
  let o = {};
  o[prop] = isString(val) || prop == 'opacity' ? val : '' + val + 'px';
  let kflist = [o];
  let opts = { duration: msDuration, fill: 'forwards', easing: easing, delay: delay };
  let a = toElem(elem).animate(kflist, opts);
  if (isdef(callback)) { a.onfinish = callback; }
  return a;
}
function mAppend(d, child) { toElem(d).appendChild(child); return child; }
function markerFail() { return createMarker(MarkerId.FAIL); }
function markerSuccess() { return createMarker(MarkerId.SUCCESS); }
function mButton(caption, handler, dParent, styles, classes, id) {
  let x = mCreate('button');
  x.innerHTML = caption;
  if (isdef(handler)) x.onclick = handler;
  if (isdef(dParent)) toElem(dParent).appendChild(x);
  if (isdef(styles)) mStyle(x, styles);
  if (isdef(classes)) mClass(x, classes);
  if (isdef(id)) x.id = id;
  return x;
}
function mButtonX(dParent, handler, sz = 30, offset = 0, color = 'white') {
  mIfNotRelative(dParent);
  let bx = mDom(dParent, { position: 'absolute', top: -2 + offset, right: -5 + offset, w: sz, h: sz, cursor: 'pointer' }, { className: 'hop1' });
  bx.onclick = ev => { evNoBubble(ev); handler(ev); } 
  let o = M.superdi.xmark;
  el = mDom(bx, { fz: sz, hline: sz, family: 'fa6', fg: color, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
}
function mBy(id) { return document.getElementById(id); }
function mCardText(ckey, sz, color) { return is_jolly(ckey) ? '<span style="font-family:Algerian">jolly</span>' : `${ckey[0]}${mSuit(ckey, sz, color)}`; }
function mCenterCenter(d, gap) { mCenterCenterFlex(d, gap); }
function mCenterCenterFlex(d, gap) { mCenterFlex(d, true, true, true, gap); }
function mCenterFlex(d, hCenter = true, vCenter = false, wrap = true, gap = null) {
  let styles = { display: 'flex' };
  if (hCenter) styles['justify-content'] = 'center';
  styles['align-content'] = vCenter ? 'center' : 'flex-start';
  if (wrap) styles['flex-wrap'] = 'wrap';
  if (gap) styles.gap = gap;
  mStyle(d, styles);
}
function mCheckbox(dg, name, value) {
  let di = mDom(dg, { display: 'inline-block' });
  let chk = mDom(di, {}, { tag: 'input', type: 'checkbox', id: getUID('c'), name: name });
  if (isdef(value)) chk.checked = value;
  let label = mDom(di, {}, { tag: 'label', html: name, for: chk.id });
  return di;
}
function mClass(d) {
  d = toElem(d);
  if (arguments.length == 2) {
    let arg = arguments[1];
    if (isString(arg) && arg.indexOf(' ') > 0) { arg = [toWords(arg)]; }
    else if (isString(arg)) arg = [arg];
    if (isList(arg)) {
      for (let i = 0; i < arg.length; i++) {
        d.classList.add(arg[i]);
      }
    }
  } else for (let i = 1; i < arguments.length; i++) d.classList.add(arguments[i]);
}
function mClassRemove(d) { d = toElem(d); for (let i = 1; i < arguments.length; i++) d.classList.remove(arguments[i]); }
function mClassReplace(d, weg, her) { mClassRemove(d, weg); mClass(d, her); }
function mClear(d) {
  toElem(d).innerHTML = '';
}
function mColFlex(dParent, chflex = [1, 5, 1], bgs) {
  let styles = { opacity: 1, display: 'flex', aitems: 'stretch', 'flex-flow': 'nowrap' };
  mStyle(dParent, styles);
  let res = [];
  for (let i = 0; i < chflex.length; i++) {
    let bg = isdef(bgs) ? bgs[i] : null;
    let d1 = mDiv(dParent, { flex: chflex[i], bg: bg });
    res.push(d1);
  }
  return res;
}
function mColor(d, bg, fg) { return mStyle(d, { 'background-color': bg, 'color': fg }); }
function mColorLetters(s, brightness) {
  return toLetters(s).map(x => `<div style='display:inline-block;transform:rotate(${rChoose([10, 5, -10, -5])}deg);color:${rColor(brightness)}'>${x == ' ' ? '&nbsp;' : x}</div>`).join('');
}
function mCols100(dParent, spec, gap = 4) {
  let grid = mDiv(dParent, { padding: gap, gap: gap, box: true, display: 'grid', h: '100%', w: '100%' })
  grid.style.gridTemplateColumns = spec;
  let res = [];
  for (const i of range(stringCount(spec, ' ') + 1)) {
    let d = mDiv(grid, { h: '100%', w: '100%', box: true })
    res.push(d);
  }
  return res;
}
function mCommand(dParent, key, html, open, close) {
  if (nundef(html)) html = capitalize(key);
  if (nundef(open)) open = window[`onclick${capitalize(key)}`];
  if (nundef(close)) close = () => { console.log('close', key) }
  let d = mDom(dParent, { display: 'inline-block' }, { key: key });
  let a = mDom(d, {}, { key: `${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: onclickCommand })
  return { dParent, elem: d, div: a, key, open, close };
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
  } else if (splay == 5) {
    d.style.display = 'grid';
    d.style.gridTemplateColumns = `${ov}px repeat(${num - 1},${ov / 2}px)`;
    d.style.minWidth = `${w + (num) * (ov / 2 * 1.1)}px`;
  } else if (splay == 4) {
    d.style.position = 'relative';
    if (nundef(ov)) ov = .5;
    d.style.minWidth = `${w + (num - 1) * (ov * 1.1)}px`;
    d.style.minHeight = `${h + (num - 1) * (ov * 1.1)}px`;
  }
}
function mCreate(tag, styles, id) { let d = document.createElement(tag); if (isdef(id)) d.id = id; if (isdef(styles)) mStyle(d, styles); return d; }
function mCreateFrom(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
function mCropResizePan(dParent, img, dButtons) {
  let [worig, horig] = [img.offsetWidth, img.offsetHeight];
  mStyle(dParent, { w: worig, h: horig, position: 'relative' });
  const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
  const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black', cursor: 'move' });
  let sz = 16;
  const centerBox = mDom(cropBox, { bg: 'red', w: sz, h: sz, rounding: '50%', position: 'absolute' });
  const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
  const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
  const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });
  let isResizing = null;
  let resizeStartW;
  let resizeStartH;
  function startResize(e) {
    e.preventDefault(); evNoBubble(e);
    isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
    [resizeStartW, resizeStartH] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)];
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  }
  function resize(e) {
    if (!isResizing) return;
    e.preventDefault(); evNoBubble(e);
    let newWidth, newHeight;
    if (isResizing == 'w') {
      newWidth = e.clientX;
      newHeight = img.height;
    } else if (isResizing == 'h') {
      newWidth = img.width;
      newHeight = e.clientY;
    } else if (isResizing == 'wh') {
      newHeight = e.clientY;
      let aspectRatio = img.width / img.height;
      newWidth = aspectRatio * newHeight;
    }
    [img, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
    setRect(0, 0, newWidth, newHeight);
  }
  function stopResize() {
    isResizing = null;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
    let [wnew, hnew] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)]
    redrawImage(img, dParent, 0, 0, resizeStartW, resizeStartH, wnew, hnew, () => setRect(0, 0, wnew, hnew))
  }
  function resizeTo(wnew, hnew) {
    if (hnew == 0) hnew = img.height;
    if (wnew == 0) {
      let aspectRatio = img.width / img.height;
      wnew = aspectRatio * hnew;
    }
    redrawImage(img, dParent, 0, 0, img.width, img.height, wnew, hnew, () => setRect(0, 0, wnew, hnew))
  }
  let isCropping = false;
  let cropStartX;
  let cropStartY;
  function startCrop(ev) {
    ev.preventDefault();
    isCropping = true;
    let pt = getMouseCoordinates(ev);
    [cropStartX, cropStartY] = [pt.x, pt.y - 24];
    document.addEventListener('mousemove', crop); //cropCenter);
    document.addEventListener('mouseup', stopCrop);
  }
  function crop(ev) {
    ev.preventDefault();
    if (isCropping) {
      evNoBubble(ev);
      let pt = getMouseCoordinates(ev);
      let [mouseX, mouseY] = [pt.x, pt.y];
      const width = Math.abs(mouseX - cropStartX);
      const height = Math.abs(mouseY - cropStartY);
      const left = Math.min(mouseX, cropStartX);
      const top = Math.min(mouseY, cropStartY);
      setRect(left, top, width, height);
    }
  }
  function cropX(e) {
    e.preventDefault();
    if (isCropping) {
      const mouseX = e.clientX - dParent.offsetLeft;
      const mouseY = e.clientY - dParent.offsetTop;
      const width = Math.abs(mouseX - cropStartX);
      const height = 300;
      const left = Math.min(mouseX, cropStartX);
      const top = 0;
      setRect(left, top, width, height);
    }
  }
  function cropCenter(e) {
    e.preventDefault();
    if (isCropping) {
      const mouseX = e.clientX - dParent.offsetLeft;
      const mouseY = e.clientY - dParent.offsetTop;
      const radiusX = Math.abs(mouseX - cropStartX);
      const radiusY = Math.abs(mouseY - cropStartY);
      const centerX = cropStartX;
      const centerY = cropStartY;
      const width = radiusX * 2;
      const height = radiusY * 2;
      const left = centerX - radiusX;
      const top = centerY - radiusY;
      setRect(left, top, width, height);
    }
  }
  function stopCrop() {
    isCropping = false;
    document.removeEventListener('mousemove', crop);
    document.removeEventListener('mouseup', stopCrop);
  }
  function cropImage() {
    let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
    redrawImage(img, dParent, x, y, w, h, w, h, () => setRect(0, 0, w, h))
  }
  function cropTo(wnew, hnew) {
    let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
    let xnew = x + (wnew - w) / 2;
    let ynew = y + (hnew - h) / 2;
    redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
  }
  let isPanning = false;
  let panStartX;
  let panStartY;
  let cboxX;
  let cboxY;
  function startPan(e) {
    e.preventDefault(); evNoBubble(e);
    isPanning = true;
    panStartX = e.clientX - dParent.offsetLeft;
    panStartY = e.clientY - dParent.offsetTop;
    cboxX = parseInt(cropBox.style.left)
    cboxY = parseInt(cropBox.style.top)
    document.addEventListener('mousemove', pan); //cropCenter);
    document.addEventListener('mouseup', stopPan);
  }
  function pan(e) {
    e.preventDefault();
    if (isPanning) {
      evNoBubble(e);
      const mouseX = e.clientX - dParent.offsetLeft;
      const mouseY = e.clientY - dParent.offsetTop;
      let diffX = panStartX - mouseX;
      let diffY = panStartY - mouseY;
      const left = cboxX - diffX
      const top = cboxY - diffY
      setRect(left, top, parseInt(cropBox.style.width), parseInt(cropBox.style.height));
    }
  }
  function stopPan() {
    isPanning = false;
    document.removeEventListener('mousemove', crop);
    document.removeEventListener('mouseup', stopCrop);
  }
  function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
  function setRect(left, top, width, height) {
    mStyle(cropBox, { left: left, top: top, w: width, h: height });
    messageBox.innerHTML = `size: ${Math.round(width)} x ${Math.round(height)}`;
    mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
  }
  function show_cropbox() { cropBox.style.display = 'block' }
  function hide_cropbox() { cropBox.style.display = 'none' }
  function setSize(wnew, hnew) {
    if (isList(wnew)) [wnew, hnew] = wnew;
    if (wnew == 0 || hnew == 0) {
      setRect(0, 0, worig, horig);
      return;
    }
    let [x, y, w, h] = getRect();
    let [cx, cy] = [x + w / 2, y + h / 2];
    let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];
    setRect(xnew, ynew, wnew, hnew);
  }
  wHandle.addEventListener('mousedown', startResize);
  hHandle.addEventListener('mousedown', startResize);
  whHandle.addEventListener('mousedown', startResize);
  cropBox.addEventListener('mousedown', startCrop);
  messageBox.addEventListener('mousedown', startPan);
  setRect(0, 0, worig, horig);
  return {
    cropBox: cropBox,
    dParent: dParent,
    elem: cropBox,
    img: img,
    messageBox: messageBox,
    crop: cropImage,
    getRect: getRect,
    hide: hide_cropbox,
    resizeTo: resizeTo,
    setRect: setRect,
    setSize: setSize,
    show: show_cropbox,
  }
}
function mDatalist(dParent, list, opts = {}) {
  var mylist = list;
  var opts = opts;
  addKeys({ alpha: true, filter: 'contains' }, opts);
  let d = mDiv(toElem(dParent));
  let optid = getUID('dl');
  let inp = mDom(d, { w: 180, maleft: 4 }, { tag: 'input', className: 'input', placeholder: valf(opts.placeholder, '') });
  if (isdef(opts.value)) inp.value = opts.value;
  let datalist = mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
  var elem = d;
  for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
  inp.setAttribute('list', optid);
  if (opts.onupdate) {
    inp.addEventListener('keyup', opts.onupdate);
  } else if (isdef(opts.edit)) {
    inp.onmousedown = () => inp.value = '';
  } else {
    inp.onblur = () => {
      const isValueSelected = list.includes(inp.value);
      if (!isValueSelected) {
        inp.value = inp.getAttribute('prev_value'); // Restore the previous value if no selection is made
      }
    }
    inp.onmousedown = () => { inp.setAttribute('prev_value', inp.value); inp.value = ''; }
  }
  return {
    list: mylist,
    elem: elem,
    inpElem: inp,
    listElem: datalist,
    opts: opts,
  }
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
  dParent = toElem(dParent);
  let d = mCreate('div');
  if (dParent) mAppend(dParent, d);
  if (isdef(styles)) mStyle(d, styles);
  if (isdef(classes)) mClass(d, classes);
  if (isdef(id)) d.id = id;
  if (isdef(inner)) d.innerHTML = inner;
  if (isdef(sizing)) { setRect(d, sizing); }
  return d;
}
function mDivItem(dParent, styles, id, content) {
  if (nundef(id)) id = getUID();
  let d = mDiv(dParent, styles, id, content);
  return mItem(id, { div: d });
}
function mDom(dParent, styles = {}, opts = {}) {
  let tag = valf(opts.tag, 'div');
  let d = document.createElement(tag);
  if (isdef(dParent)) mAppend(dParent, d);
  if (tag == 'textarea') styles.wrap = 'hard';
  const aliases = {
    classes: 'className',
    inner: 'innerHTML',
    html: 'innerHTML',
    w: 'width',
    h: 'height',
  };
  for (const opt in opts) {
    let name = valf(aliases[opt], opt), val = opts[opt];
    if (['style', 'tag', 'innerHTML', 'className', 'checked', 'value'].includes(name) || name.startsWith('on')) d[name] = val;
    else d.setAttribute(name, val);
  }
  mStyle(d, styles);
  return d;
}
function mDraggable(item) {
  let d = iDiv(item);
  d.draggable = true;
  d.ondragstart = drag;
}
function mDroppable(item, handler, dragoverhandler) {
  let d = iDiv(item);
  d.ondragover = isdef(dragoverhandler) ? dragoverhandler : default_allowDrop;
  d.ondrop = handler;
}
function mDropZone(dropZone, onDrop) {
  dropZone.setAttribute('allowDrop', true)
  dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #007bff';
  });
  dropZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
  });
  dropZone.addEventListener('drop', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = ev => {
        onDrop(ev.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  });
  return dropZone;
}
function mDropZone1(dropZone, onDrop) {
  dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #007bff';
  });
  dropZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
  });
  dropZone.addEventListener('drop', function (evDrop) {
    evDrop.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const files = evDrop.dataTransfer.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = evReader => {
        onDrop(evReader.target.result, dropZone);
      };
      reader.readAsDataURL(files[0]);
    }
  });
  return dropZone;
}
function mDummyFocus() {
  if (nundef(mBy('dummy'))) addDummy(document.body, 'cc');
  mBy('dummy').focus();
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
function measureElement(el) {
  let info = window.getComputedStyle(el, null);
  return { w: info.width, h: info.height };
}
function measureHeight(elem) { return mGetStyle(elem, 'h') }
function measureHeightOfTextStyle(dParent, styles = {}) {
  let d = mDom(dParent, styles, { html: 'Hql' });
  let s = measureElement(d);
  d.remove();
  return firstNumber(s.h);
}
function measureWidth(elem) { return mGetStyle(elem, 'w') }
function menuCloseCurrent(menu) {
  let curKey = lookup(menu, ['cur']);
  if (curKey) {
    let cur = menu.commands[curKey];
    mClassRemove(iDiv(cur), 'activeLink'); //unselect cur command
    cur.close();
  }
}
function menuCommand(dParent, menuKey, key, html, open, close) {
  let cmd = mCommand(dParent, key, html, open, close);
  let a = iDiv(cmd);
  a.setAttribute('key', `${menuKey}_${key}`);
  a.onclick = onclickMenu;
  cmd.menuKey = menuKey;
  return cmd;
}
function menuDisable(menu, key) { mClass(iDiv(menu.commands[key]), 'disabled') }
function menuEnable(menu, key) { mClassRemove(iDiv(menu.commands[key]), 'disabled') }
async function menuOpen(menu, key) {
  let cmd = menu.commands[key];  
  menu.cur = key;
  mClass(iDiv(cmd), 'activeLink'); //console.log('cmd',cmd)
  await cmd.open();
}
function mergeArrays(target, source) {
  function getKey(item) { return item.key || item.id || item.name; }
  const merged = Array.from(target);
  const keyMap = {};
  target.forEach((item, index) => {
    const itemKey = getKey(item);
    if (itemKey) keyMap[itemKey] = index;
  });
  source.forEach((item) => {
    const itemKey = getKey(item);
    if (itemKey && keyMap[itemKey] !== undefined) {
      merged[keyMap[itemKey]] = deepMerge(target[keyMap[itemKey]], item);
    } else {
      merged.push(item);
    }
  });
  return merged;
}
function mergeDynSetNodes(o) {
  let merged = {};
  let interpool = null;
  for (const nodeId in o.RSG) {
    let node = jsCopy(dynSpec[nodeId]);
    let pool = node.pool;
    if (pool) {
      if (!interpool) interpool = pool;
      else interpool = intersection(interpool, pool);
    }
    merged = deepmerge(merged, node);
  }
  merged.pool = interpool;
  return merged;
}
function mergeIncludingPrototype(oid, o) {
  let merged = mergeDynSetNodes(o);
  merged.oid = oid;
  let t = merged.type;
  let info;
  if (t && PROTO[t]) {
    info = deepmerge(merged, jsCopy(PROTO[t]));
  } else info = merged;
  return info;
}
function mergeObject(target, source, optionsArgument) {
  var destination = {}
  if (isMergeableObject(target)) {
    Object.keys(target).forEach(function (key) {
      destination[key] = cloneIfNecessary(target[key], optionsArgument)
    })
  }
  Object.keys(source).forEach(function (key) {
    if (!isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneIfNecessary(source[key], optionsArgument)
    } else {
      destination[key] = deepmerge(target[key], source[key], optionsArgument)
    }
  })
  return destination;
}
function mergeOverride(base, drueber) { return _deepMerge(base, drueber, { arrayMerge: _overwriteMerge }); }
function mergeOverrideArrays(base, drueber) {
  return deepmerge(base, drueber, { arrayMerge: overwriteMerge });
}
function mExists(d) { return isdef(toElem(d)); }
function mFadeClear(d, ms = 800, callback = null) { return mAnimateTo(d, 'opacity', 0, () => { mClear(d); if (callback) callback(); }, ms); }
function mFadeClearShow(d, ms = 800, callback = null) { return mAnimate(d, 'opacity', [1, 0], () => { mClear(d); if (callback) callback(); }, ms); }
function mFadeRemove(d, ms = 800, callback = null) { return mAnimateTo(d, 'opacity', 0, () => { mRemove(d); if (callback) callback(); }, ms); }
function mFall(d, ms = 800, dist = 50) { toElem(d).animate([{ opacity: 0, transform: `translateY(-${dist}px)` }, { opacity: 1, transform: 'translateY(0px)' },], { fill: 'both', duration: ms, easing: 'ease' }); }
function mFlex(d, or = 'h') {
  d = toElem(d);
  d.style.display = 'flex';
  d.style.flexFlow = (or == 'v' ? 'column' : 'row') + ' ' + (or == 'w' ? 'wrap' : 'nowrap');
}
function mFlexV(d) { mStyle(d, { display: 'flex', 'align-items': 'center' }); }
function mFlexVWrap(d) { mStyle(d, { display: 'flex', 'align-items': 'center', 'flex-flow': 'row wrap' }); }
function mFlexWrap(d) { mFlex(d, 'w'); }
function mGadget(name, styles = {}, opts = {}) {
  let d = document.body;
  let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
  addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
  let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
  let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
  mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
  return { name, dialog, form, inp }
}
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
      if (isPointOutsideOf(form, ev.clientX, ev.clientY)) {
        resolve(null);
        dialog.remove();
      }
    });
    dialog.addEventListener('keydown', ev => { if (ev.key === 'Escape') { dialog.remove(); resolve(null); } });
    let evalFunc;
    if (type == 'multi') evalFunc = uiGadgetTypeMulti(form, content, styles, opts);
    else if (type == 'text') evalFunc = uiGadgetTypeText(form, content, styles, opts);
    else if (type == 'yesno') evalFunc = uiGadgetTypeYesNo(form, content, styles, opts);
    else if (type == 'select') evalFunc = uiGadgetTypeSelect(form, content, styles, opts);
    else if (type == 'checklist') evalFunc = uiGadgetTypeCheckList(form, content, styles, opts);
    else if (type == 'checklistinput') evalFunc = uiGadgetTypeCheckListInput(form, content, styles, opts);
    dialog.showModal();
    form.onsubmit = (ev) => {
      ev.preventDefault();
      let val = evalFunc();
      dialog.remove();
      resolve(val);
    };
  });
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
  return json;
}
async function mGetRoute(route, o = {}) {
  let server = getServerurl();
  server += `/${route}?`;
  for (const k in o) { server += `${k}=${o[k]}&`; }
  const response = await fetch(server, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });
  return tryJSONParse(await response.text());
}
function mGetStyle(elem, prop) {
  let val;
  elem = toElem(elem);
  if (prop == 'bg') { val = getStyleProp(elem, 'background-color'); if (isEmpty(val)) return getStyleProp(elem, 'background'); }
  else if (isdef(STYLE_PARAMS[prop])) { val = getStyleProp(elem, STYLE_PARAMS[prop]); }
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
  if (nundef(val)) val = getStyleProp(elem, prop);
  if (val.endsWith('px')) return firstNumber(val); else return val;
}
function mGetStyles(elem, proplist) {
  let res = {};
  for (const p of proplist) { res[p] = mGetStyle(elem, p) }
  return res;
}
async function mGetYaml(path = '../base/assets/m.txt') {
  let res = await fetch(path);
  let text = await res.text();
  let di = jsyaml.load(text);
  return di;
}
function mGrid(rows, cols, dParent, styles = {}) {
  addKeys({ display: 'inline-grid', gridCols: 'repeat(' + cols + ',1fr)' }, styles);
  if (rows) styles.gridRows = 'repeat(' + rows + ',auto)';
  else styles.overy = 'auto';
  let d = mDiv(dParent, styles);
  return d;
}
function mGridFromElements(dParent, elems, maxHeight, numColumns) {
  dParent.innerHTML = '';
  let cols = `repeat(${numColumns}, 1fr)`; //'repeat(auto-fill, minmax(0, 1fr))';
  let grid = mDom(dParent, { display: 'inline-grid', gridCols: cols, gap: 10, padding: 4, overy: 'auto', hmax: maxHeight })
  elems.forEach(x => mAppend(grid, x));
  return grid;
}
function mGridFromItems(dParent, items, maxHeight, numColumns) { return mGridFromElements(dParent, items.map(x => iDiv(x)), maxHeight, numColumns); }
function mHasClass(el, className) {
  if (el.classList) return el.classList.contains(className);
  else {
    let x = !!el.className; 
    return isString(x) && !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }
}
function mIfNotRelative(d) { if (isEmpty(d.style.position)) d.style.position = 'relative'; }
function mImage() { return mImg(...arguments); }
function mimali(c, n) {
  function whh(c1, c2) { return generateArrayColors(colorHex(c1), colorHex(c2), 10); }
  function genc(c, hinc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, hsl.s * 100, hsl.l * 100); }
  function cinc(c, hinc, sinc, linc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, clamp(hsl.s * 100 + sinc, 0, 100), clamp(hsl.l * 100 + linc, 0, 100)); }
  function arrd(c, hinc, sinc, linc, n) { let r = []; for (let i = 0; i < n; i++) { r.push(cinc(c, hinc * i, sinc * i, linc * i)); } return r; }
  function light(c, lper = 75) { let hsl = colorHSL(c, true); return colorHSLBuild(hsl.h, hsl.s * 100, lper); }
  function sat(c, sper = 100) { let hsl = colorHSL(c, true); return colorHSLBuild(sper, hsl.s * 100, hsl.l * 100); }
  function hue(c, hdeg) { let hsl = colorHSL(c, true); return colorHSLBuild(hdeg, hsl.s * 100, hsl.l * 100); }
  c = light(c, 75);
  let diff = Math.round(360 / n)
  wheel = arrd(c, diff, 0, 0, n);
  return wheel;
}
function mImg(path, dParent, styles, classes, callback) {
  let d = mCreate('img');
  if (isdef(callback)) d.onload = callback;
  d.src = path;
  if (isdef(dParent)) mAppend(dParent, d);
  if (isdef(styles)) mStyle(d, styles);
  if (isdef(classes)) mClass(d, classes);
  if (isdef(styles.w)) d.setAttribute('width', styles.w + 'px');
  if (isdef(styles.h)) d.setAttribute('height', styles.h + 'px');
  return d;
}
function mInput(dParent, styles, id, placeholder, classtr = 'input', tabindex = null, value = '', selectOnClick = false, type = "text") {
  let html = `<input type="${type}" autocomplete="off" ${selectOnClick ? 'onclick="this.select();"' : ''} id=${id} class="${classtr}" placeholder="${valf(placeholder, '')}" tabindex="${tabindex}" value="${value}">`;
  let d = mAppend(dParent, mCreateFrom(html));
  if (isdef(styles)) mStyle(d, styles);
  return d;
}
function mInsert(dParent, el, index = 0) { dParent.insertBefore(el, dParent.childNodes[index]); return el; }
function miPic(item, dParent, styles, classes) {
  let info = isString(item) ? Syms[item] : isdef(item.info) ? item.info : item;
  let d = mDiv(dParent);
  d.innerHTML = info.text;
  if (nundef(styles)) styles = {};
  let family = info.family;
  addKeys({ family: family, fz: 50, display: 'inline-block' }, styles);
  mStyle(d, styles);
  if (isdef(classes)) mClass(d, classes);
  mCenterCenterFlex(d);
  return d;
}
function mItem(liveprops = {}, opts = {}) {
  let id = valf(opts.id, getUID());
  let item = opts;
  item.live = liveprops;
  item.id = id;
  let d = iDiv(item); if (isdef(d)) d.id = id;
  Items[id] = item;
  return item;
}
function mItemSplay(item, list, splay, ov = .5) {
  if (!isNumber(splay)) splay = get_splay_number(splay);
  let d = iDiv(item);
  let idx = list.indexOf(item.key);
  if (splay == 4) {
    let offset = (list.length - idx) * ov;
    mStyle(d, { position: 'absolute', left: offset, top: offset });
    d.style.zIndex = list.length - idx;
  } else {
    d.style.zIndex = splay != 2 ? list.length - idx : 0;
  }
}
function mixColors(color1, color2, weight) {
  const hex1 = color1.substring(1);
  const hex2 = color2.substring(1);
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  const r = Math.floor(r1 * (1 - weight) + r2 * weight);
  const g = Math.floor(g1 * (1 - weight) + g2 * weight);
  const b = Math.floor(b1 * (1 - weight) + b2 * weight);
  const hex = colorHex({ r: r, g: g, b: b }); // '#' + r.toString(16) + g.toString(16) + b.toString(16);
  return hex;
}
function mLinebreak(dParent, gap) {
  dParent = toElem(dParent);
  let d;
  let display = getComputedStyle(dParent).display;
  if (display == 'flex') {
    d = mDiv(dParent, { fz: 2, 'flex-basis': '100%', h: 0, w: '100%' }, null, ' &nbsp; ');
  } else {
    d = mDiv(dParent, {}, null, '<br>');
  }
  if (isdef(gap)) { d.style.minHeight = gap + 'px'; d.innerHTML = ' &nbsp; '; d.style.opacity = .2; }
  return d;
}
function mLink(href, dParent, styles, id, inner, classes, sizing) {
  let d = mCreate('a');
  if (dParent) mAppend(dParent, d);
  d.href = valf(href, '#');
  if (isdef(styles)) mStyle(d, styles);
  if (isdef(classes)) mClass(d, classes);
  if (isdef(id)) d.id = id;
  if (isdef(inner)) d.innerHTML = inner;
  if (isdef(sizing)) { setRect(d, sizing); }
  return d;
}
function mLMR(dParent) {
  dParent = toElem(dParent);
  let d = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
  let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
  let [l, m, r] = [mDom(d, stflex), mDom(d, stflex), mDom(d, stflex)];
  return [d, l, m, r];
}
function mMagnify(elem, scale = 5) {
  elem.classList.add(`topmost`);
  MAGNIFIER_IMAGE = elem;
  const rect = elem.getBoundingClientRect();
  let [w, h] = [rect.width * scale, rect.height * scale];
  let [cx, cy] = [rect.width / 2 + rect.left, rect.height / 2 + rect.top];
  let [l, t, r, b] = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
  let originX = 'center';
  let originY = 'center';
  let [tx, ty] = [0, 0];
  if (l < 0) { tx = -l / scale; } 
  if (t < 0) { ty = -t / scale; } 
  if (r > window.innerWidth) { tx = -(r - window.innerWidth) / scale; } 
  if (b > window.innerHeight) { ty = -(b - window.innerHeight) / scale; } 
  elem.style.transform = `scale(${scale}) translate(${tx}px,${ty}px)`;
  elem.style.transformOrigin = `${originX} ${originY}`;
}
function mMagnifyOff() {
  if (!MAGNIFIER_IMAGE) return;
  let elem = MAGNIFIER_IMAGE;
  MAGNIFIER_IMAGE = null;
  elem.classList.remove(`topmost`); //magnify4`); 
  elem.style.transform = null;
}
function mMenu(dParent, key) { let [d, l, m, r] = mLMR(dParent); return { dParent, elem: d, l, m, r, key, cur: null }; }
function mNewline(d, gap = 1) { mDom(d, { h: gap }); }
async function mOnclick(menu) {
  UI.nav.activate(menu);
  if (isdef(menu)) await window[`onclick${capitalize(menu)}`](); //eval(`onclick${capitalize(menu)}()`);}
}
function mOnEnter(elem, setter) {
  elem.addEventListener('keydown', ev => {
    if (ev.key == 'Enter') {
      ev.preventDefault();
      mDummyFocus();
      if (setter) setter(ev);
    }
  });
}
function mPlace(elem, pos, offx, offy) {
  elem = toElem(elem);
  pos = pos.toLowerCase();
  let dParent = elem.parentNode; mIfNotRelative(dParent); 
  let vert = valf(offx, 0);
  let hor = isdef(offy) ? offy : vert;
  if (pos[0] == 'c' || pos[1] == 'c') {
    let dpp = dParent.parentNode; 
    let opac = mGetStyle(dParent, 'opacity'); console.log('opac', opac);
    if (nundef(dpp)) { mAppend(document.body, dParent); mStyle(dParent, { opacity: 0 }) }
    let rParent = getRect(dParent);
    let [wParent, hParent] = [rParent.w, rParent.h];
    let rElem = getRect(elem);
    let [wElem, hElem] = [rElem.w, rElem.h];
    if (nundef(dpp)) { dParent.remove(); mStyle(dParent, { opacity: valf(opac, 1) }) }
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
function mPosRel(d, x, y, unit) { d.style.position = 'relative'; if (isdef(x)) mStyle(d, { left: x, top: y }, unit); }
async function mPostRoute(route, o = {}) {
  let server = getServerurl();
  server += `/${route}`;
  const response = await fetch(server, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify(o)
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return 'ERROR 1';
  }
}
function mpOver(d, dParent, fz, color, picStyle) {
  let b = getRect(dParent);
  let cx = b.w / 2 + b.x;
  let cy = b.h / 2 + b.y;
  d.style.top = picStyle == 'segoeBlack' ? ((cy - fz * 2 / 3) + 'px') : ((cy - fz / 2) + 'px');
  d.style.left = picStyle == 'segoeBlack' ? ((cx - fz / 3) + 'px') : ((cx - fz * 1.2 / 2) + 'px');
  d.style.color = color;
  d.style.fontSize = fz + 'px';
  d.style.display = 'block';
  let { isText, isOmoji } = getParamsForMaPicStyle(picStyle);
  d.style.fontFamily = isString(isOmoji) ? isOmoji : isOmoji ? 'emoOpen' : 'emoNoto';
  return d;
}
async function mPrompt(gadget) {
  return new Promise((resolve, reject) => {
    gadget.dialog.showModal();
    gadget.form.onsubmit = (ev) => {
      ev.preventDefault();
      resolve(gadget.inp.value);
      gadget.inp.value = '';
      gadget.dialog.close();
    };
  });
}
function mPulse(d, ms, callback = null) { mClass(d, 'onPulse'); TO[getUID()] = setTimeout(() => { mClassRemove(d, 'onPulse'); if (callback) callback(); }, ms); }
function mRadio(label, val, name, dParent, styles = {}, handler, group_id, is_on) {
  let cursor = styles.cursor; delete styles.cursor;
  let d = mDiv(dParent, styles, group_id + '_' + val);
  let id = isdef(group_id) ? `i_${group_id}_${val}` : getUID();
  let type = isdef(group_id) ? 'radio' : 'checkbox';
  let checked = isdef(is_on) ? is_on : false;
  let inp = mCreateFrom(`<input class='radio' id='${id}' type="${type}" name="${name}" value="${val}">`);
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
function mRemove(elem) {
  elem = toElem(elem); if (nundef(elem)) return;
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
  elem.remove();
}
function mRemoveChildrenFromIndex(dParent, i) { while (dParent.children[i]) { mRemove(dParent.children[i]); } }
function mRemoveClass(d) { for (let i = 1; i < arguments.length; i++) d.classList.remove(arguments[i]); }
function mRemoveIfExists(d){ d=toElem(d);if (isdef(d)) d.remove();}
function mRise(d, ms = 800) {
  toElem(d).animate([{ opacity: 0, transform: 'translateY(50px)' }, { opacity: 1, transform: 'translateY(0px)' },], { fill: 'both', duration: ms, easing: 'ease' });
}
function mRows100(dParent, spec, gap = 4) {
  let grid = mDiv(dParent, { padding: gap, gap: gap, box: true, display: 'grid', h: '100%', w: '100%' })
  grid.style.gridTemplateRows = spec;
  let res = [];
  for (const i of range(stringCount(spec, ' ') + 1)) {
    let d = mDiv(grid, { h: '100%', w: '100%', box: true })
    res.push(d);
  }
  return res;
}
function msElapsedSince(msStart) { return Date.now() - msStart; }
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
function mShrinkTranslate(child, scale, newParent, ms = 800, callback) {
  let [dx, dy] = get_screen_distance(child, newParent);
  mAnimate(child, 'transform', [`translateX(${dx}px) translateY(${dy}px) scale(${scale})`], callback, ms, 'ease');
}
function mSize(d, w, h, unit = 'px', sizing) { if (nundef(h)) h = w; mStyle(d, { width: w, height: h }, unit); if (isdef(sizing)) setRect(d, sizing); }
async function mSleep(ms = 1000) {
  return new Promise(
    (res, rej) => {
      if (ms > 10000) { ms = 10000; }
      if (isdef(TO.SLEEPTIMEOUT)) clearTimeout(TO.SLEEPTIMEOUT);
      TO.SLEEPTIMEOUT = setTimeout(res, ms);
    });
}
function msNow() { return Date.now(); }
function msToTime(ms) {
  let secs = Math.floor(ms / 1000);
  let mins = Math.floor(secs / 60);
  secs = secs - mins * 60;
  let hours = Math.floor(mins / 60);
  mins = mins - hours * 60;
  return { h: hours, m: mins, s: secs };
}
function mStyle(elem, styles = {}, unit = 'px') {
  elem = toElem(elem);
  let style = styles = jsCopy(styles);
  if (isdef(styles.w100)) style.w = '100%';
  if (isdef(styles.h100)) style.h = '100%';
  let bg, fg;
  if (isdef(styles.bg) || isdef(styles.fg)) {
    [bg, fg] = colorsFromBFA(styles.bg, styles.fg, styles.alpha);
  }
  if (isdef(styles.vpadding) || isdef(styles.hpadding)) {
    styles.padding = valf(styles.vpadding, 0) + unit + ' ' + valf(styles.hpadding, 0) + unit;
  }
  if (isdef(styles.vmargin) || isdef(styles.hmargin)) {
    styles.margin = valf(styles.vmargin, 0) + unit + ' ' + valf(styles.hmargin, 0) + unit;
  }
  if (isdef(styles.upperRounding) || isdef(styles.lowerRounding)) {
    let rtop = '' + valf(styles.upperRounding, 0) + unit;
    let rbot = '' + valf(styles.lowerRounding, 0) + unit;
    styles['border-radius'] = rtop + ' ' + rtop + ' ' + rbot + ' ' + rbot;
  }
  if (isdef(styles.box)) styles['box-sizing'] = 'border-box';
  if (isdef(styles.round)) { elem.style.setProperty('border-radius', '50%'); }
  for (const k in styles) {
    if (['round', 'box'].includes(k)) continue;
    let val = styles[k];
    let key = k;
    if (isdef(_STYLE_PARAMS[k])) key = _STYLE_PARAMS[k];
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
    } else if (k.includes('class')) {
      mClass(elem, styles[k]);
    } else if (k == 'border') {
      if (isNumber(val)) val = `solid ${val}px ${isdef(styles.fg) ? styles.fg : '#ffffff80'}`;
      if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
    } else if (k == 'ajcenter') {
      elem.style.setProperty('justify-content', 'center');
      elem.style.setProperty('align-items', 'center');
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
    else if (key == 'wrap') { if (val == 'hard') elem.setAttribute('wrap', 'hard'); else elem.style.flexWrap = 'wrap'; }
    else if (k.startsWith('dir')) {
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
  let family = info.family;
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
function mTableStylify(rowitems, di) {
  for (const item of rowitems) {
    for (const index in di) {
      let colitem = item.colitems[index];
      mStyle(colitem.div,di[index]);
    }
  }
}
function mText(text, dParent, styles, classes) {
  if (!isString(text)) text = text.toString();
  let d = mDiv(dParent);
  if (!isEmpty(text)) { d.innerHTML = text; }
  if (isdef(styles)) mStyle(d, styles);
  if (isdef(classes)) mClass(d, classes);
  return d;
}
function mTextArea100(dParent, styles = {}) {
  mCenterCenterFlex(dParent)
  let html = `<textarea style="width:100%;height:100%;box-sizing:border-box" wrap="hard"></textarea>`;
  let t = mCreateFrom(html);
  mStyle(t, styles);
  mAppend(dParent, t);
  return t;
}
function mYaml(d, js) {
  d.innerHTML = '<pre>' + jsonToYaml(js) + '</pre>';
  return d;
}
function name2id(name) { return 'd_' + name.split(' ').join('_'); }
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
function new_deal(fen) {
  let deck = fen.deck = create_fen_deck('n', fen.num_decks);
  shuffle(deck);
  for (const plname in fen.players) {
    let pl = fen.players[plname];
    let handsize = pl.handsize;
    pl.hand = deck_deal(deck, handsize);
  }
}
function nextBar(ctx, rest, color) {
  list = rest;
  let val = findMostFrequentVal(list, 'x');
  rest = list.filter(p => !isWithinDelta(p.x, val, 2));
  let line = getBar(ctx, list, val);
  line.map(p => drawPix(ctx, p.x, p.y, color));
  return { val, line, rest, color };
}
function nextLine(ctx, rest, color) {
  list = rest;
  let val = findMostFrequentVal(list, 'y');
  rest = list.filter(p => !isWithinDelta(p.y, val, 2));
  let line = getLine(ctx, list, val);
  if (line) line.map(p => drawPix(ctx, p.x, p.y, color));
  return { val, line, rest, color };
}
function normalizeString(s, sep = '_') {
  s = s.toLowerCase().trim();
  let res = '';
  for (let i = 0; i < s.length; i++) { if (isAlphaNum(s[i])) res += s[i]; else res += sep; }
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
function on_poll_table_seen(obj) {
  delete DA.poll;
  update_session(obj);
  if (is_game_host()) {
    let txt = jsyaml.dump(DB);
    DA.next = get_games;
    let fen = get_score_fen_from_cur_players();
    to_server({ tid: Session.cur_tid, fen: fen, uname: Session.cur_user, db: txt }, 'save_and_delete');
  } else {
    show_user_intro_screen(true);
  }
}
function on_poll_table_started(obj) {
  let t = obj.tables[0];
  update_db_user_from_pl_options(t.pl_options, t.game);
  Session.cur_tid = t.id;
  Session.cur_game = t.game;
  delete DA.poll;
  status_message_off();
  hide('divTest');
  close_sidebar();
  mBy('user_info_mini').style.display = 'flex';
  Session.scoring_complete = false;
  get_play();
}
function onclick_by_rank() {
  let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
  let items = ui_get_hand_items(uplayer).map(x => x.o);
  let h = UI.players[uplayer].hand;
  pl.handsorting = 'rank';
  Clientdata.handsorting = pl.handsorting;
  localStorage.setItem('handsorting', Clientdata.handsorting);
  let cardcont = h.cardcontainer;
  let ch = arrChildren(cardcont);
  ch.map(x => x.remove());
  let sorted = sortCardItemsByRank(items, Z.func.rankstr);
  h.sortedBy = 'rank';
  for (const item of sorted) {
    mAppend(cardcont, iDiv(item));
  }
}
function onclick_by_suit() {
  let [plorder, stage, A, fen, uplayer, pl] = [Z.plorder, Z.stage, Z.A, Z.fen, Z.uplayer, Z.fen.players[Z.uplayer]];
  let items = ui_get_hand_items(uplayer).map(x => x.o);
  let h = UI.players[uplayer].hand;
  Clientdata.handsorting = pl.handsorting = 'suit';
  localStorage.setItem('handsorting', Clientdata.handsorting);
  let cardcont = h.cardcontainer;
  let ch = arrChildren(cardcont);
  ch.map(x => x.remove());
  let sorted = sortCardItemsByRank(items, Z.func.rankstr);
  sorted = sortCardItemsBySuit(sorted);
  h.sortedBy = 'suit';
  for (const item of sorted) {
    mAppend(cardcont, iDiv(item));
  }
}
function onclick_game_menu_item(ev) {
  let gamename = ev_to_gname(ev);
  stop_game();
  show_game_options_menu(gamename);
}
function onclick_gameover_screen() {
  let game = Session.cur_game;
  let winners = Session.winners;
  if (!Session.scoring_complete) {
    console.log('scoring...')
    decrease_handicap_if_winstreak(winners, game);
    increase_handicap_if_losestreak();
    Session.scoring_complete = true;
  }
  if (is_admin()) {
    let txt = jsyaml.dump(DB);
    DA.next = get_games;
    let fen = get_score_fen_from_cur_players();
    to_server({ tid: Session.cur_tid, fen: fen, uname: Session.cur_user, db: txt }, 'save_and_delete');
  } else {
    get_got_user_in_intro_screen();
    let t = Session.cur_table;
    let fen = t.status == 'past' ? t.fen : get_score_fen_from_cur_players();
    intro_create_score_table(fen, t.friendly);
  }
}
function onclick_logout() {
  mFadeClearShow('dAdminRight', 300);
  mClear('dAdminMiddle');
  stop_game();
  clear_screen();
  U = null;
  show_users();
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
function onclick_tables() { phpPost({ app: 'simple' }, 'tables'); }
function onclick_user(uname) {
  U = firstCond(Serverdata.users, x => x.name == uname);
  localStorage.setItem('uname', U.name);
  DA.secretuser = U.name;
  let elem = firstCond(arrChildren('dUsers'), x => x.getAttribute('username') == uname);
  let img = elem.children[0];
  mShrinkTranslate(img, .75, 'dAdminRight', 400, show_username);
  mFadeClear('dUsers', 300);
}
async function onclickAddCategory() {
  let selist = UI.selectedImages; 
  let keys = selist.map(x => stringBefore(x, '@'));
  let catlist = M.categories.map(x => ({ name: x, value: false }));
  let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checklist' });
  if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  cats = cats.split('@');
  cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
  if (isEmpty(cats)) { console.log('nothing added'); collClearSelections(); return; }
  let di = {}, changed = false;
  for (const kc of selist) {
    let key = stringBefore(kc, '@');
    let o = M.superdi[key];
    for (const cat of cats) {
      if (o.cats.includes(cat)) continue;
      changed = true;
      o.cats.push(cat);
      di[key] = o;
    }
  }
  if (!changed) { console.log('nothing added'); collClearSelections(); return; }
  console.log('items changed:', Object.keys(di));
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickAddSelected() {
  let selist = UI.selectedImages; 
  let keys = selist.map(x => stringBefore(x, '@'));
  let collist = M.collections.filter(x => !collLocked(x)).map(x => ({ name: x, value: false }));
  let colls = await mGather(iDiv(UI.addSelected), {}, { content: collist, type: 'checklist' });
  if (!colls) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  colls = colls.split('@');
  colls = colls.filter(x => !isEmptyOrWhiteSpace(x))
  if (isEmpty(colls)) { console.log('nothing added'); collClearSelections(); return; }
  let di = {}, changed = false;
  for (const kc of selist) {
    let key = stringBefore(kc, '@');
    let o = M.superdi[key];
    for (const collname of colls) {
      if (o.colls.includes(collname)) continue;
      changed = true;
      o.colls.push(collname);
      di[key] = o;
    }
  }
  if (!changed) { console.log('nothing added'); collClearSelections(); return; }
  console.log('items changed:', Object.keys(di));
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickAsAvatar(ev) {
  let item = UI.selectedImages[0];
  console.log('item', item)
  let o = collKeyCollnameFromSelkey(item);
  let key = o.key;
  let m = M.superdi[key];
  U.key = key;
  let res = await postUserChange(U);
  console.log('res', res)
}
async function onclickAsSecondary(ev) {
  name = UI.collPrimary.name;
  if (name == 'all' || collLocked(name)) {
    showMessage(`ERROR! collection ${name} cannot be altered!`);
    return;
  }
  if (nundef(M.byCollection[name])) {
    showMessage(`ERROR! collection ${name} not found!`);
    return;
  }
  UI.collSecondary.name = name;
  UI.collPrimary.name = 'all';
  collOpenSecondary(4, 3);
  collOpenPrimary(4, 3);
}
function onClickBadgeX(ev) {
  interrupt();
  let item = evToItem(ev);
  setBadgeLevel(item.index);
  userUpdate(['games', G.id, 'startLevel'], item.index);
  auxOpen = false;
  TOMain = setTimeout(G.controller.startGame.bind(G.controller), 100);
}
async function onclickBot() {
  let name = getUname();
  let table = Clientdata.table;
  let plmode = table.fen.players[name].playmode;
  if (plmode == 'bot') return;
  let id = table.id;
  let overrideList = [];
  overrideList.push({ keys: ['fen', 'players', name, 'playmode'], val: 'bot' });
  let res = await sendMergeTable({ id, name, overrideList });
}
async function onclickCatListDone(ui) { ui.setAttribute('proceed', getCheckedNames(ui).join('@')); }
function onclickClear(inp, grid) {
  inp.value = '';
  let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]'));
  checklist.map(x => x.checked = false);
  sortCheckboxes(grid);
}
async function onclickClearPlayers() {
  let me = getUname();
  DA.playerList = [me];
  for (const name in DA.allPlayers) {
    if (name != me) unselectPlayerItem(DA.allPlayers[name]);
  }
  assertion(!isEmpty(DA.playerList), "uname removed from playerList!!!!!!!!!!!!!!!")
  DA.lastName = me;
  mRemoveIfExists('dPlayerOptions')
}
async function onclickCollClearSelections(ev) {
  let colls = [UI.collPrimary];
  if (UI.collSecondary.isOpen) colls.push(UI.collSecondary);
  for (const coll of colls) {
    for (const cell of coll.cells) {
      let d = cell.firstChild;
      collUnselect(d);
    }
  }
  UI.selectedImages = [];
  collDisableListCommands();
}
function onclickCollDone() {
  collCloseSecondary();
  UI.collPrimary.name = UI.collSecondary.name;
  collOpenPrimary(5, 7);
}
async function onclickCollections() {
  let dPanes = mDom('dMain'); mFlex(dPanes);
  let dSecondary = mDom(dPanes, { wmin: 0, w: 0 }, { id: 'collSecondary', className: 'translow' }); //mFlexWrap(dPlus);
  let dPrimary = mDom(dPanes, {}, { id: 'collPrimary' }); //mFlexWrap(d1);
  collSidebar();
  let collName = localStorage.getItem('collection');
  if (nundef(collName) || !M.collections.includes(collName)) collName = 'animals'
  UI.collPrimary = { div: dPrimary, name: collName };
  UI.collSecondary = { div: dSecondary, name: null };
  collOpenPrimary(5, 7);
}
async function onclickCollItem(ev) {
  evNoBubble(ev);
  let o = evToAttrElem(ev, 'key');
  if (!o) return;
  let [key, elem] = [o.val, o.elem];
  if (nundef(key)) { console.log('no key'); return; }
  await clickOnItem(elem, key);
}
async function onclickCollItemLabel(ev) {
  evNoBubble(ev);
  let o = evToAttrElem(ev, 'key');
  if (!o) return;
  let [key, elem] = [o.val, o.elem];
  if (nundef(key)) { console.log('no key'); return; }
  let collname = elem.getAttribute('collname');
  console.log('clicked', key, collname);
  let newfriendly = await mGather(ev.target);
  if (!newfriendly) return;
  if (isEmpty(newfriendly)) { 
    showMessage(`ERROR: name invalid: ${newfriendly}`);
    return;
  }
  console.log('rename friendly to', newfriendly)
  let item = M.superdi[key];
  item.friendly = newfriendly;
  let resp = await mPostRoute('postUpdateItem', { key: key, item: item });
  console.log(resp);
  ev.target.innerHTML = newfriendly;
}
async function onclickCollNext(ev) {
  let coll = collFromElement(ev.target.parentNode)
  showImageBatch(coll, 1);
}
async function onclickCollPrev(ev) {
  let coll = collFromElement(ev.target.parentNode)
  showImageBatch(coll, -1);
}
async function onclickCollSelectAll(ev) {
  let coll = UI.collSecondary.isOpen ? UI.collSecondary : UI.collPrimary;
  for (const cell of coll.cells) {
    let d = cell.firstChild;
    if (nundef(d)) break; 
    collSelect(d);
  }
  for (const k of coll.keys) {
    addIf(UI.selectedImages, collGenSelkey(k, coll.name));
  }
  collEnableListCommands();
}
async function onclickCollSelectPage(ev) {
  let coll = UI.collSecondary.isOpen ? UI.collSecondary : UI.collPrimary;
  for (const cell of coll.cells) {
    let d = cell.firstChild;
    if (nundef(d)) break; 
    collSelect(d);
    let o = collKeyCollnameFromElem(d);
    addIf(UI.selectedImages, collGenSelkey(o.key, o.collname));
  }
  collEnableListCommands();
}
async function onclickColor(ev) {
  let c = ev.target.style.background;
  c = colorHex(c);
  setColors(c);
  U.color = c;
  await postUserChange();
}
async function onclickCommand(ev) {
  let key = evToAttr(ev, 'key');
  assertion(isdef(UI[key]), `command ${key} not in UI!!!`)
  let cmd = UI[key];
  await cmd.open();
}
function onclickDay(d, styles) {
  let tsDay = d.id;
  let tsCreated = Date.now();
  let id = generateEventId(tsDay, tsCreated);
  let uname = U ? getUname() : 'guest';
  let o = { id: id, created: tsCreated, day: tsDay, time: '', text: '', user: uname, shared: false, subscribers: [] };
  Items[id] = o;
  let x = uiTypeEvent(d, o, styles);
  x.inp.focus();
}
async function onclickDeleteCollection(name) {
  if (nundef(name) && UI.collSecondary.isOpen) name = UI.collSecondary.name;
  if (nundef(name)) name = await mGather(iDiv(UI.deleteCollection), 'name');
  if (!name) return;
  let proceed = await mGather(iDiv(UI.deleteCollection), {}, { type: 'yesno', content: `delete collection ${name}?` });
  if (proceed) await collDelete(name);
  if (UI.collSecondary.isOpen && UI.collSecondary.name == name) collCloseSecondary();
  if (UI.collPrimary.name == name) { UI.collPrimary.name = 'all'; collOpenPrimary(); }
}
async function onclickDeleteSelected() {
  let selist = UI.selectedImages;
  let di = {}, deletedKeys = {};
  for (const k of selist) {
    let o = collKeyCollnameFromSelkey(k);
    let key = o.key;
    let collname = o.collname;
    if (collLocked(collname)) continue;
    if (nundef(deletedKeys[collname])) deletedKeys[collname] = [];
    await collDeleteOrRemove(key, collname, di, deletedKeys[collname]);
  }
  if (isEmpty(di) && Object.keys(deletedKeys).every(x => isEmpty(deletedKeys[x]))) {
    showMessage(`ERROR: cannot delete selected items!!!`);
    collClearSelections();
    return;
  }
  console.log('deletedKeys dict: ', deletedKeys);
  for (const k in deletedKeys) {
    let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: deletedKeys[k], collname: k });
    console.log('postUpdateSuperdi', k, res)
    di = {}; 
  }
  await loadAssets();
  collPostReload();
}
async function onclickDeleteTable(id) {
  let res = await mPostRoute('deleteTable', { id });
}
async function onclickEditCategories() {
  let selist = UI.selectedImages; 
  let keys = selist.map(x => stringBefore(x, '@'));
  let arrs = keys.map(x => M.superdi[x].cats);
  let lst = unionOfArrays(arrs); 
  let catlist = M.categories.map(x => ({ name: x, value: lst.includes(x) }));
  sortByDescending(catlist, 'value');
  let cats = await mGather(iDiv(UI.editCategories), {}, { content: catlist, type: 'checklistinput' });
  if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
  if (isEmpty(cats)) { console.log('nothing removed'); collClearSelections(); return; }
  let di = {}, changed = false;
  for (const kc of selist) {
    let key = stringBefore(kc, '@');
    let o = M.superdi[key];
    if (sameList(cats, o.cats)) continue;
    changed = true;
    o.cats = cats;
    di[key] = o;
  }
  if (!changed) { console.log('categories unchanged!', cats); collClearSelections(); return; }
  console.log('items changed:', Object.keys(di));
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickEditCollItem() {
  let selist = UI.selectedImages; 
  let key = selist.map(x => stringBefore(x, '@'))[0];
  let item = M.superdi[key];
  let catlist = M.categories.map(x => ({ name: x, value: item.cats.includes(x) }));
  sortByDescending(catlist, 'value');
  let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checklistinput' });
  if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  cats = cats.split('@');
  cats = cats.filter(x => !isEmptyOrWhiteSpace(x));
  if (sameList(item.cats, cats)) { console.log('no change'); collClearSelections(); return; }
  console.log(`cats of item ${key} set to`, cats);
  item.cats = cats;
  let di = {}; di[key] = item;
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
function onclickExistingEvent(ev) { evNoBubble(ev); showEventOpen(evToId(ev)); }
async function onclickGameMenuItem(ev) {
  let gamename = evToAttr(ev, 'gamename');
  await showGameMenu(gamename);
}
async function onclickGameMenuPlayer(ev) {
  let name = evToAttr(ev, 'username'); //console.log('name',name); return;
  let shift = ev.shiftKey;
  await showGameMenuPlayerDialog(name, shift);
}
async function onclickHome() { UI.nav.activate(); await showDashboard(); }
async function onclickHuman() {
  let name = getUname();
  let table = Clientdata.table;
  let plmode = table.fen.players[name].playmode;
  if (plmode == 'human') return;
  let id = table.id;
  let overrideList = [];
  overrideList.push({ keys: ['fen', 'players', name, 'playmode'], val: 'human' });
  let res = await sendMergeTable({ id, name, overrideList });
}
async function onclickJoinTable(id) {
  let table = Serverdata.tables.find(x => x.id == id);
  let me = getUname();
  assertion(table.status == 'open', 'too late to join! game has already started!')
  assertion(!table.playerNames.includes(me), `${me} already joined!!!`);
  table.players[me] = createGamePlayer(me, table.game);
  table.playerNames.push(me);
  let res = await mPostRoute('postTable', { id, players: table.players, playerNames: table.playerNames });
}
async function onclickLeaveTable(id) {
  let table = Serverdata.tables.find(x => x.id == id);
  let me = getUname();
  assertion(table.status == 'open', 'too late to leave! game has already started!')
  assertion(table.playerNames.includes(me), `${me} NOT in joined players!!!!`);
  delete table.players[me];
  removeInPlace(table.playerNames, me);
  let res = await mPostRoute('postTable', { id, players: table.players, playerNames: table.playerNames });
}
function onclickMenu(ev) {
  let keys = evToAttr(ev, 'key');
  let [menuKey, cmdKey] = keys.split('_');
  let menu = UI[menuKey];
  switchToMenu(menu, cmdKey);
}
async function onclickNATIONS() {
  if (nundef(M.natCards)) M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  M.civs = ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];
  let player = M.player = { civ: rChoose(M.civs) };
  M.ages = { 1: { events: [], progress: [] }, 2: { events: [], progress: [] }, 3: { events: [], progress: [] }, 4: { events: [], progress: [] } };
  for (const k in M.natCards) {
    let c = M.natCards[k];
    if (c.age == 0) continue;
    let age = c.age == 0 ? 1 : c.age;
    if (c.Type == 'event') M.ages[age].events.push(k); else M.ages[age].progress.push(k);
  }
  M.age = 1;
  M.events = M.ages[M.age].events;
  M.progress = M.ages[M.age].progress;
  arrShuffle(M.progress);
  arrShuffle(M.events);
  let d1 = mDiv('dMain'); mFlex(d1);
  UI.coll.rows = 3; UI.coll.cols = 7;
  let bg = mGetStyle('dNav', 'bg');
  let h = 180;
  let dcost = M.costGrid = mGrid(UI.coll.rows, 1, d1, { 'align-self': 'start' });
  for (let cost = 3; cost >= 1; cost--) {
    let d2 = mDom(dcost, { display: 'flex', 'justify-content': 'center', 'flex-flow': 'column', box: true, margin: 2, h: h, overflow: 'hidden' }, {});
    for (let i = 0; i < cost; i++) mDom(d2, { h: 40 }, { tag: 'img', src: `../assets/games/nations/templates/gold.png` });
  }
  UI.coll.grid = mGrid(UI.coll.rows, UI.coll.cols, d1, { 'align-self': 'start' });
  UI.coll.cells = [];
  for (let i = 0; i < UI.coll.rows * UI.coll.cols; i++) {
    let d = mDom(UI.coll.grid, { box: true, margin: 2, h: h, overflow: 'hidden' });
    mCenterCenterFlex(d);
    UI.coll.cells.push(d);
  }
  let n = UI.coll.rows * UI.coll.cols;
  M.market = [];
  for (let i = 0; i < n; i++) {
    let k = M.progress.shift();
    M.market.push(k);
    let card = M.natCards[k];
    let img = mDom(UI.coll.cells[i], { h: h, w: 115 }, { tag: 'img', src: `../assets/games/nations/cards/${k}.png` });
    img.setAttribute('key', k)
    img.onclick = buyProgressCard;
  }
  mDom('dMain', { h: 20 })
  let dciv = mDom('dMain', { w: 800, h: 420, maleft: 52, bg: 'red', position: 'relative' });
  let iciv = await loadImageAsync(`../assets/games/nations/civs/civ_${player.civ}.png`, mDom(dciv, { position: 'absolute' }, { tag: 'img' }));
  M.civCells = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 7; j++) {
      let r = getCivSpot(player.civ, i, j);
      let [dx, dy, dw, dh] = [10, 10, 15, 20]
      let d = mDom(dciv, { box: true, w: r.w + dw, h: r.h + dh, left: r.x - dx, top: r.y - dy, position: 'absolute', overflow: 'hidden' });
      mCenterCenterFlex(d);
      M.civCells.push(d);
      d.onclick = () => selectCivSpot(d);
    }
  }
}
async function onclickNewCollection(name) {
  if (nundef(name)) name = await mGather(iDiv(UI.newCollection));
  if (!name) return;
  if (isEmpty(name)) {
    showMessage(`ERROR! you need to enter a valid name!!!!`);
    return;
  }
  if (collLocked(name)) {
    showMessage(`collection ${name} is Read-Only!`);
    return;
  }
  M.collections.push(name); M.collections.sort();
  UI.collSecondary.name = name;
  collOpenSecondary(4, 3);
  collOpenPrimary(4, 3);
}
async function onclickOpenToJoinGame() {
  let options = collectOptions();
  let players = collectPlayers();
  mRemove('dGameMenu');
  let t = createOpenTable(DA.gamename, players, options);
  let res = await mPostRoute('postTable', t);
}
async function onclickPlan() { await showCalendarApp(); }
async function onclickPlay() {
  await showTables('onclickPlay');
  showGames();
}
async function onclickRemoveCategory() {
  let selist = UI.selectedImages; 
  let keys = selist.map(x => stringBefore(x, '@'));
  let arrs = keys.map(x => M.superdi[x].cats);
  let lst = unionOfArrays(arrs); lst.sort(); 
  let catlist = lst.map(x => ({ name: x, value: false }));
  let cats = await mGather(iDiv(UI.removeCategory), {}, { content: catlist, type: 'checklist' });
  if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  cats = cats.split('@');
  cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
  if (isEmpty(cats)) { console.log('nothing removed'); collClearSelections(); return; }
  let remolist = cats; 
  console.log('remove cats', remolist);
  let di = {}, changed = false;
  for (const kc of selist) {
    let key = stringBefore(kc, '@');
    let o = M.superdi[key];
    for (const cat of cats) {
      if (!o.cats.includes(cat)) continue;
      changed = true;
      removeInPlace(o.cats, cat);
      di[key] = o;
    }
  }
  if (!changed) { console.log('ERROR: none of selected elements has cat in', remolist); collClearSelections(); return; }
  console.log('items changed:', Object.keys(di));
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickRemoveSelected() {
  let selist = UI.selectedImages;
  let di = {};
  for (const k of selist) {
    let o = collKeyCollnameFromSelkey(k);
    let key = o.key;
    let collname = o.collname;
    if (collLocked(collname)) continue;
    let item = M.superdi[key];
    removeInPlace(item.colls, collname);
    di[key] = item;
  }
  if (isEmpty(di)) {
    showMessage(`ERROR: cannot delete selected items!!!`);
    collClearSelections();
    return;
  }
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickRenameCollection(oldname, newname) {
  if (nundef(oldname)) oldname = UI.collSecondary.isOpen ? UI.collSecondary.name : UI.collPrimary.name;
  if (nundef(newname)) {
    let di = await mGather(iDiv(UI.renameCollection), {}, { content: { oldname: valf(oldname, ''), newname: '' }, type: 'multi' });
    if (!di) return;
    [oldname, newname] = [di.oldname, di.newname];
  }
  newname = newname.toLowerCase();
  if (isEmpty(newname)) {
    showMessage(`ERROR! you need to enter a valid new name!!!!`);
    return;
  }
  if (!isAlphanumeric(newname)) {
    showMessage(`ERROR! ${newname} needs to be alphanumeric starting with a letter!`);
    return;
  }
  if (collLocked(oldname)) {
    showMessage(`ERROR: Collection ${oldname} is Read-Only!`);
    return;
  }
  if (!collExists(oldname)) {
    showMessage(`ERROR: Collection ${oldname} not found!`);
    return;
  }
  if (isdef(M.byCollection[newname])) {
    showMessage(`ERROR! Collection ${newname} already exists!!!!`);
    return;
  }
  await collRename(oldname, newname);
}
async function onclickStartGame() {
  await collectFromPrevious(DA.gamename);
  let options = collectOptions(); 
  let players = collectPlayers();
  await startGame(DA.gamename, players, options);
}
async function onclickStartTable(id) {
  let table = Serverdata.tables.find(x => x.id == id); assertion(isdef(table), `table with id ${id} not in Serverdata!`);
  table = setTableToStarted(table);
  let res = await mPostRoute('postTable', table);
}
async function onclickTable(id) {
  await showTable(id)
}
async function onclickTest() { console.log('nations!!!!'); }
async function onclickUser() {
  let uname = await mGather(iDiv(UI.user), { w: 100, margin: 0 }, { content: 'username', align: 'br', placeholder: ' <username> ' });
  if (!uname) return;
  await switchToUser(uname);
}
async function ondropPreviewImage(dParent, url, key) {
  if (isdef(key)) {
    let o = M.superdi[key];
    UI.imgColl.value = o.cats[0];
    UI.imgName.value = o.friendly;
  }
  assertion(dParent == UI.dDrop, `problem bei ondropPreviewImage parent:${dParent}, dDrop:${UI.dDrop}`)
  dParent = UI.dDrop;
  let dButtons = UI.dButtons;
  let dTool = UI.dTool;
  dParent.innerHTML = '';
  dButtons.innerHTML = '';
  dTool.innerHTML = '';
  let img = UI.img = mDom(dParent, {}, { tag: 'img', src: url });
  img.onload = async () => {
    img.onload = null;
    UI.img_orig = new Image(img.offsetWidth, img.offsetHeight);
    UI.url = url;
    let tool = UI.cropper = mCropResizePan(dParent, img);
    addToolX(tool, dTool)
    mDom(dButtons, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })
    mButton('Restart', () => ondropPreviewImage(url), dButtons, { w: 120, maleft: 12 }, 'input');
  }
}
async function ondropSaveUrl(url) {
  console.log('save dropped url to config:', url);
  Serverdata.config = mPostRoute('postConfig', { url: url });
}
async function ondropShowImage(url, dDrop) {
  mClear(dDrop);
  let img = await imgAsync(dDrop, { hmax: 300 }, { src: url });
  console.log('img dims', img.width, img.height); //works!!!
  mStyle(dDrop, { w: img.width, h: img.height + 30, align: 'center' });
  mDom(dDrop, { fg: colorContrast(dDrop, ['blue', 'lime', 'yellow']) }, { className: 'blink', html: 'DONE! now click on where you think the image should be centered!' })
  console.log('DONE! now click on where you think the image should be centered!')
  img.onclick = storeMouseCoords;
}
async function onEventEdited(id, text, time) {
  console.log('onEventEdited', id, text, time)
  let e = Items[id];
  if (nundef(time)) {
    [time, text] = extractTime(text);
  }
  e.time = time;
  e.text = text;
  let result = await simpleUpload('postUpdateEvent', e);
  console.log('result', result)
  Items[id] = lookupSetOverride(Serverdata, ['events', id], e);
  mBy(id).firstChild.value = getEventValue(e);
  closePopup();
}
async function oninputCollFilter(ev) {
  let id = evToId(ev); 
  let coll = UI[id];
  let s = ev.target.value.toLowerCase().trim();
  let list = collFilterImages(coll, s);
  coll.keys = list;
  coll.filter = s;
  coll.index = 0; coll.pageIndex = 1; collClearSelections();
  showImageBatch(coll, 0, false);
}
async function onsockEvent(x) {
  console.log('SOCK::event', x)
  Serverdata.events[x.id] = x;
}
async function onsockMerged(x){
  let isSameTableOpen = lookup(Clientdata, ['table', 'id']) == x.id;
  if (!isSameTableOpen) return;
  await showTable(x);
}
async function onsockSuperdi(x) {
  console.log('SOCK::superdi', x)
}
async function onsockTable(x) {
  let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];
  if (Clientdata.curMenu != 'play') return; //wenn ich nicht in menu play bin mach garnichts
  let me = getUname();
  let isSameTableOpen = lookup(Clientdata, ['table', 'id']) == id;
  if (isSameTableOpen || isNew && turn.includes(me) && !Clientdata.table) return await showTable(id);
  if (!Clientdata.table) return await showTables('onsockTable');
}
async function onsockTables(x) {
  if (Clientdata.curMenu == 'play' && !Clientdata.table) await showTables('onsockTables');
  else if (Clientdata.curMenu == 'play') {
    let id = Clientdata.table.id;
    let exists = x.find(t => t.id == id);
    if (nundef(exists)) await switchToMenu(UI.nav, 'play');
  }
}
function open_game_ui() {
  clear_table_all();
  let hmin = firstNumber(getCssVar('--inner_left_panel_height'));
  mBy("inner_left_panel").innerHTML = `<div style='min-height:${hmin}px'>
  <div id="md" style="display: flex;min-height:${hmin}px">
    <div id="dLeftSide" style="align-self: stretch;min-height:${hmin}px"></div>
    <div id="dRightSide" style='min-height:${hmin}px'>
      <div id="table" class="flexWrap"></div>
    </div>
  </div></div>`;
  initTable();
  badges_off();
}
function open_prompt() {
  console.assert(!uiActivated, 'open_prompt with uiActivated ON !!!!!!!!!!!!!!!!!!!!!!!!!!');
  let game = Session.cur_game;
  let uname = Session.cur_user;
  let g = Session;
  let next = lookup(DB.games, [game]); if (next) copyKeys(next, g);
  next = lookup(DB.users, [uname, 'games', game]); if (next) copyKeys(next, g);
  let level = g.level = valf(g.startlevel, g.def_startlevel);
  lookupSet(DB.users, [uname, 'games', game, 'startlevel'], level);
  next = lookup(DB.games, [game, 'levels']);
  if (next) copyKeys(next[level], g);
  g.maxlevel = valf(get_keys(next).length, 0) - 1;
  g.color = getColorDictColor(g.color);
  for (const k in g.options) {
    g[k] = get_game_option(g, k);
    console.log('g.' + k, g[k]);
  }
  delete g.levels;
  clearEvents(); set_background_color(g.color);
  QContextCounter += 1;
  show_game_name(g.friendly);
  show_title(g.table.friendly);
  show_level(g.level, g.maxlevel);
  if (Session.is_badges) setBadgeLevel(g.level);
  g.startTime = get_timestamp();
  mLinebreak(dTable, 15);
  let items = g.items = spotit_deal(g.num_cards, g.rows, g.cols, g.vocab, g.lang, g.min_scale, g.max_scale);
  Selected = null;
  uiActivated = true;
}
function openGameMenuFor(gamename) { clickOnElemWithAttr('gamename', gamename); }
function openPopup(name = 'dPopup') {
  closePopup();
  let popup = document.createElement('div');
  popup.id = name;
  let defStyle = { padding: 25, bg: 'white', fg: 'black', zIndex: 1000, rounding: 12, position: 'fixed', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', wmin: 300, hmin: 100, border: '1px solid #ccc', };
  mStyle(popup, defStyle);
  mButtonX(popup, 25, 4);
  document.body.appendChild(popup);
  return popup;
}
function overwriteMerge(destinationArray, sourceArray, options) { return sourceArray }
function param_present_contacts(obj, dParent, onclick_func_name) {
  let others = sync_users(obj.users);
  Session.others = others.map(x => x.name);
  let msgs = valf(obj.msgs, {});
  let mydata = `
  <style>
    @keyframes appear{
      0%{opacity:0;transform: translateY(50px)}
      100%{opacity:1;transform: translateY(0px)}
     }
     .contact{
       cursor:pointer;
       transition: all .5s cubic-bezier(0.68, -2, 0.265, 1.55);
     }
     .contact:hover{
       transform: scale(1.1);
     }
  </style>
  <div style="text-align: center; animation: appear 1s ease both">
  `;
  let mydata_list = '';
  for (const r of others) {
    row = r;
    let image = get_image_path(row);
    let mydata_element = `
        <div class='contact' style='position:relative;text-align:center;margin-bottom:18px;' username='${row.name}' 
          onclick='${onclick_func_name}(event)'>
          <img src='${image}' draggable='true' ondragstart='drag(event)' class='img_person sz100' style='margin:0;'/>
          <br>${row.name}`;
    if (isdef(msgs[row.username])) {
      mydata_element += `<div style='width:20px;height:20px;border-radius:50%;background-color:orange;color:white;position:absolute;left:0px;top:0px;'>` + msgs[row.username] + "</div>";
    }
    mydata_element += "</div>";
    mydata_list += mydata_element;
  }
  mydata += mydata_list;
  dParent.innerHTML = mydata;
}
function pauseSound() {
  _qSound = [];
  if (_loaded && isdef(_sndPlayer)) {
    clearTimeout(TOSound);
    _sndPlayer.onended = null;
    _sndPlayer.onpause = whenSoundPaused;
    _sndPlayer.pause();
  }
}
function PHLayout() {
  if (isdef(UI.DRR)) UI.DRR.remove();
  mAppend(UI.dRechts, UI.dHistory);
  Clientdata.historyLayout = 'ph';
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
function player_stat_count(key, n, dParent, styles = {}) {
  let sz = valf(styles.sz, 16);
  addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'start', fz: sz, align: 'center' }, styles);
  let d = mDiv(dParent, styles);
  if (isdef(Syms[key])) mSym(key, d, { h: sz, 'line-height': sz, w: '100%' });
  else mText(key, d, { h: sz, fz: sz, w: '100%' });
  d.innerHTML += `<span style="font-weight:bold">${n}</span>`;
  return d;
}
function playerStatCount(key, n, dParent, styles = {}) {
  let sz = valf(styles.sz, 16);
  addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'center', fz: sz, align: 'center' }, styles);
  let d = mDiv(dParent, styles);
  let o = M.superdi[key];
  if (isdef(o)) showImage(key, d, { h: sz, 'line-height': sz, w: '100%', fg: 'grey' }); //mSym(key, d, { h: sz, 'line-height': sz, w: '100%' });
  else mText(key, d, { h: sz, fz: sz, w: '100%' });
  d.innerHTML += `<span style="font-weight:bold;color:inherit">${n}</span>`;
  return d;
}
function poll() {
  if (IS_POLLING_ALLOWED) {
    if (isdef(DA.poll.func)) DA.poll.data = DA.poll.func(DA.poll.data);
    console.log('...poll')
    to_server(DA.poll.data, DA.poll.type);
  } else console.log('polling OFF!');
}
function poll_for_table_seen_or_deleted() {
  start_polling({ uname: Session.cur_user, tid: Session.cur_tid }, 'poll_table_seen', on_poll_table_seen, 3000);
}
function poll_for_table_started() {
  start_polling(Session.cur_user, 'poll_table_started', on_poll_table_started, 3000);
}
function pollStop() { clearTimeout(TO.poll); Clientdata.AUTORESET = true; }
function polyPointsFrom(w, h, x, y, pointArr) {
  x -= w / 2;
  y -= h / 2;
  let pts = pointArr.map(p => [p.X * w + x, p.Y * h + y]);
  let newpts = [];
  for (const p of pts) {
    newp = { X: p[0], Y: Math.round(p[1]) };
    newpts.push(newp);
  }
  pts = newpts;
  let sPoints = pts.map(p => '' + p.X + ',' + p.Y).join(' ');
  return sPoints;
}
async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return await response.text();
}
async function postEventChange(data) {
  return Serverdata.events[data.id] = await mPostRoute('postEvent', data);
}
async function postImage(img, path) {
  let dataUrl = imgToDataUrl(img);
  let o = { image: dataUrl, path: path };
  let resp = await mPostRoute('postImage', o);
  console.log('resp', resp); //sollte path enthalten!
}
async function postUserChange(data) {
  data = valf(data, U)
  return Serverdata.users[data.name] = await mPostRoute('postUser', data);
}
function posXY(d1, dParent, x, y, unit = 'px', position = 'absolute') {
  if (nundef(position)) position = 'absolute';
  if (dParent && !dParent.style.position) dParent.style.setProperty('position', 'relative');
  d1.style.setProperty('position', position);
  if (isdef(x)) d1.style.setProperty('left', makeUnitString(x, unit));
  if (isdef(y)) d1.style.setProperty('top', makeUnitString(y, unit));
}
async function prelims() {
  let t1 = performance.now();
  Serverdata = await mGetRoute('session'); //session ist: users,config,events
  let t2 = performance.now();
  await loadAssets();
  let t4 = performance.now();
  sockInit();
  UI.nav = showNavbar();
  UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
  dTitle = mBy('dTitle');
  await switchToUser(localStorage.getItem('username'));
  let t5 = performance.now();
  window.onkeydown = keyDownHandler;
  window.onkeyup = keyUpHandler;
  DA.funcs = { setgame: setgame(), }; //implemented games!
  for (const gname in Serverdata.config.games) {
    if (isdef(DA.funcs[gname])) continue;
    DA.funcs[gname] = defaultGameFunc();
  }
  DA.counter = 0;
}
function prep_move() {
  let [fen, uplayer, pl] = [Z.fen, Z.uplayer, Z.pl];
  for (const k of ['round', 'phase', 'stage', 'step', 'turn']) { fen[k] = Z[k]; }
  deactivate_ui();
  clear_timeouts();
}
function present() {
  if (Settings.perspective == 'me') presentFor(me);
  else presentAll();
}
function present_contacts(obj) {
  let others = sync_users(obj.myusers);
  Session.others = others.map(x => x.name);
  var inner_left_panel = mBy("inner_left_panel");
  inner_left_panel.innerHTML = createContactsContent(others, obj.msgs);
}
function present_games() {
  let html = `<div id='game_menu' style="text-align: center; animation: appear 1s ease both">`;
  for (const g of dict2list(DB.games)) { html += ui_game_menu_item(g, Session.tables_by_game[g.id]); }
  mBy('inner_left_panel').innerHTML = html;
  mCenterCenterFlex(mBy('game_menu'));
}
function present_intro() {
  let dParent = mBy('divTest'); show(dParent); clearElement(dParent);
  mStyle(dParent, { position: 'absolute', top: 0, bg: 'green', wmin: '100vw', hmin: '100vw' });
  param_present_contacts(Session, dParent, 'onclick_user_in_intro');
}
function present_login(obj) { param_present_contacts(obj, mBy('inner_left_panel'), 'onclick_user_login'); }
function present_non_admin_waiting_screen() {
  let dParent = mBy('divTest'); show(dParent); clearElement(dParent);
  mStyle(dParent, { position: 'absolute', top: 0, bg: 'green', wmin: '100vw', hmin: '100vw' });
  let dlogout = mDiv(dParent, { position: 'absolute', right: 10, top: 4, cursor: 'pointer' }, 'ddd_logout', `logout`);
  dlogout.onclick = onclick_logout;
  show_user_image(Session.cur_user, dParent);
  status_message_new(`hi, ${capitalize(Session.cur_user)}, a game is starting soon...`, dParent, { classname: 'slow_gradient_blink' });
  mLinebreak(dParent, 100);
  show_rankings(dParent);
}
function present_table(obj) {
  Session.cur_menu = 'play';
  console.assert(isdef(obj.table), 'present_table without obj.table!!!!!!!!!!!!!!');
  update_session(obj);
  let table_status = Session.cur_table.status;
  let my_status = Session.cur_me.player_status;
  let have_another_move = my_status == 'joined';
  if (table_status == 'deleted') { in_game_off(); in_game_open_prompt_off(); status_message_off(); get_games(); return; }
  if (!in_game()) { open_game_ui(); in_game_on(); }
  let d = mBy('table'); d.animate([{ opacity: 0, transform: 'translateY(50px)' }, { opacity: 1, transform: 'translateY(0px)' },], { fill: 'both', duration: 1000, easing: 'ease' });
  if (!have_another_move) { reload_last_game_state(); }
  else if (!in_game_open_prompt()) { open_prompt(); in_game_open_prompt_on(); }
  else { uiActivated = true; }
  update_game_status(Session.cur_players);
  if (table_status == 'over') {
    stop_game();
    let winners = Session.winners = race_check_endcondition();
    if (!isEmpty(winners)) {
      stop_game();
      DA.after_status_message = onclick_gameover_screen;
      show_gameover(winners);
    }
  }
}
function present_table_from_csv(csv_text, dParent) {
  prepare_table();
  dParent.innerHTML = get_table_html();
  import_the_text(csv_text);
}
function present_wait_for_table_to_start() {
  status_message(`hi, ${capitalize(Session.cur_user)}, a game is starting soon...`, { top: 330, classname: 'slow_gradient_blink' });
  poll_for_table_started();
}
function presentAll() {
  clearZones();
  for (const pl of T.players) {
    let zone = Zones[pl.id];
    pl.hand.showDeck(zone.dData, 'right', 0, false);
  }
  showTrick();
}
function presentExtraWorker(item, dParent, styles = {}) {
  let sz = styles.sz;
  addKeys({ paright: 10, bg: 'white', rounding: '50%', hmargin: 8, h: 30, position: 'relative' }, styles)
  let d = mDom(dParent, styles); mFlex(d);
  let img = mDom(d, { h: '100%' }, { tag: 'img', src: '../assets/games/nations/templates/worker.png' })
  let img2 = mDom(d, { h: sz * 2 / 3, w: sz * 2 / 3, position: 'absolute', top: '17%', left: '40%' }, { tag: 'img', src: `../assets/games/nations/templates/${item.o.res}.png` });
  return d;
}
function presentFor(me) {
  clearElement(dTable);
  let others = arrWithout(T.players, [me]);
  for (const pl of others) {
    pl.hand.showDeck(dTable, 'right', 0, false);
  }
  mLinebreak(dTable);
  T.trick.showDeck(dTable, 'right', 20, true);
  mLinebreak(dTable);
  me.hand.showDeck(dTable, 'right', 0, false);
  showFleetingMessage('click to play a card!');
}
function presentImageCropper(url) {
  let d = mDom('dMain', { position: 'absolute', h: 500, w: 500, bg: 'navy' });
  let img = mDom(d, { w: 300, h: 300, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
}
function PRHLayout() {
  let drr = UI.DRR = mDiv(dTable);
  mAppend(drr, UI.dHistory);
  Clientdata.historyLayout = 'prh';
}
function proceed(nextLevel) {
  if (nundef(nextLevel)) nextLevel = currentLevel;
  if (nextLevel > MAXLEVEL) {
    let iGame = gameSequence.indexOf(currentGame) + 1;
    if (iGame == gameSequence.length) {
      soundGoodBye();
      mClass(document.body, 'aniSlowlyDisappear');
      show(dLevelComplete);
      dLevelComplete.innerHTML = 'CONGRATULATIONS! You are done!';
    } else {
      let nextGame = gameSequence[iGame];
      setGoal(nextGame);
    }
  } else if (LevelChange) startLevel(nextLevel);
  else startRound();
}
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
function race_check_endcondition() {
  let players = get_values(Session.cur_players);
  let winners = players.filter(x => x.score >= Session.winning_score).map(x => x.name);
  return winners;
}
function race_set_fen() {
  let me = Session.cur_players[Session.cur_user];
  let fen = Session.cur_funcs.fen();
  me.state = fen;
}
function race_update_my_score(inc) {
  let me = Session.cur_me;
  me.score += inc;
  if (me.score >= Session.winning_score) me.player_status = 'done';
}
function random_motto() { return chooseRandom(["time to play!", "life's good", "one game at a time!", "let's play!", "no place like home", "cafe landmann"]) }
function randomColor() { return rColor(); }
function randomDigit() { let s = '0123456789'; return s[randomNumber(0, s.length - 1)]; }
function randomIndex(array) { return randomRange(0, array.length) | 0 }
function randomLetter() { let s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; return s[randomNumber(0, s.length - 1)]; }
function randomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomRange(min, max) { return min + Math.random() * (max - min) }
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
function rChoose(arr, n = 1, func = null, exceptIndices = null) {
  if (isDict(arr)) arr = dict2list(arr, 'key');
  let indices = arrRange(0, arr.length - 1);
  if (isdef(exceptIndices)) {
    for (const i of exceptIndices) removeInPlace(indices, i);
  }
  if (isdef(func)) indices = indices.filter(x => func(arr[x]));
  if (n == 1) {
    let idx = Math.floor(Math.random() * indices.length);
    return arr[indices[idx]];
  }
  arrShuffle(indices);
  return indices.slice(0, n).map(x => arr[x]);
}
function rColor(brightPerOrAlpha01 = 1, alpha01 = 1, hueVari = 60) {
  let c;
  if (brightPerOrAlpha01 <= 1) {
    c = '#';
    for (let i = 0; i < 6; i++) { c += rChoose(['f', 'c', '9', '6', '3', '0']); }
    alpha01 = brightPerOrAlpha01;
  } else {
    let hue = rHue(hueVari);
    let sat = 100;
    let b = isNumber(brightPerOrAlpha01) ? brightPerOrAlpha01 : brightPerOrAlpha01 == 'dark' ? 25 : brightPerOrAlpha01 == 'light' ? 75 : 50;
    c = colorFromHSL(hue, sat, b);
  }
  return alpha01 < 1 ? colorTrans(c, alpha01) : c;
}
function redrawImage(img, dParent, x, y, wold, hold, w, h, callback) {
  let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, x, y, wold, hold, 0, 0, w, h);
  const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
  img.onload = () => {
    img.onload = null;
    img.width = w;
    img.height = h;
    mStyle(img, { w: w, h: h });
    mStyle(dParent, { w: w, h: h });
    callback();
  }
  img.src = imgDataUrl;
  return imgDataUrl;
}
function reindex_items(items) { let i = 0; items.map(x => { x.index = i; i++; }); }
function reload() {
  console.log('reload!!!')
  if (radio_contacts.checked == true) get_contacts();
  else if (radio_chat.checked == true) get_chats();
  else if (radio_games.checked == true) get_games();
  else if (radio_play.checked == true) get_play();
}
function reload_last_game_state() { if (!in_game_open_prompt()) open_prompt(Session.cur_me.state); }
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
function remove_player(fen, uname) {
  if (nundef(fen.original_players)) fen.original_players = jsCopy(fen.players);
  removeInPlace(fen.plorder, uname);
  delete fen.players[uname];
  return fen.plorder;
}
function removeCommentLines(text, cstart, cend) {
  let lines = text.split('\n');
  let inComment = false, res = '';
  for (const line of lines) {
    let lt = line.trim();
    if (lt.startsWith(cstart) && lt.endsWith(cend)) { continue; }
    if (lt.startsWith(cstart)) { inComment = true; continue; }
    if (lt.endsWith(cend)) { inComment = false; continue; }
    res += line + '\n';
  }
  return res;
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
function removeFromArray(array, i) { return array.splice(i, 1)[0] }
function removeInPlace(arr, el) {
  arrRemovip(arr, el);
}
function removeItemFromArray(array, item) { return removeFromArray(array, array.indexOf(item)) }
function removePeepFromCrowd(peep) {
  removeItemFromArray(crowd, peep)
  availablePeeps.push(peep)
}
function removeRandomFromArray(array) { return removeFromArray(array, randomIndex(array)) }
function removeTrailingComments(line) {
  let icomm = line.indexOf('//');
  let ch = line[icomm - 1];
  if (icomm <= 0 || ch == "'" || ':"`'.includes(ch)) return line;
  if ([':', '"', "'", '`'].some(x => line.indexOf(x) >= 0 && line.indexOf(x) < icomm)) return line;
  return line.substring(0, icomm);
}
function replaceAll(str, sSub, sBy) {
  let regex = new RegExp(sSub, 'g');
  return str.replace(regex, sBy);
}
function replaceAllSpecialChars(str, sSub, sBy) { return str.split(sSub).join(sBy); }
function resetPeep({ stage, peep }) {
  const direction = Math.random() > 0.5 ? 1 : -1
  const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random())
  const startY = stage.height - peep.height + offsetY
  let startX
  let endX
  if (direction === 1) {
    startX = -peep.width
    endX = stage.width
    peep.scaleX = 1
  } else {
    startX = stage.width + peep.width
    endX = 0
    peep.scaleX = -1
  }
  peep.x = startX
  peep.y = startY
  peep.anchorY = startY
  return {
    startX,
    startY,
    endX
  }
}
function resetRound() {
  clearTimeouts();
  clearFleetingMessage();
  clearEvents();
}
function resetUIDs() { UIDCounter = 0; FRUIDCounter = -1; }
function resize() {
  stage.width = Canvas.clientWidth
  stage.height = Canvas.clientHeight
  Canvas.width = stage.width * devicePixelRatio
  Canvas.height = stage.height * devicePixelRatio
  crowd.forEach((peep) => {
    peep.walk.kill()
  })
  crowd.length = 0
  availablePeeps.length = 0
  availablePeeps.push(...allPeeps)
  initCrowd()
}
function resizeTo(tool, wnew, hnew) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  if (hnew == 0) hnew = img.height;
  if (wnew == 0) {
    let aspectRatio = img.width / img.height;
    wnew = aspectRatio * hnew;
  }
  redrawImage(img, dParent, 0, 0, img.width, img.height, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
function resplay_container(targetgroup, ovpercent) {
  let d = iDiv(targetgroup);
  let card = Items[targetgroup.ids[0]];
  let ov = valf(targetgroup.ov, .1222)
  mContainerSplay(d, 2, card.w, card.h, arrChildren(d).length, ov * card.w);
  let items = arrChildren(d).map(x => Items[x.id]);
  ui_add_cards_to_hand_container(d, items);
}
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
function rHue(vari = 36) { return (rNumber(0, vari) * Math.round(360 / vari)) % 360; }
function rLetter(except) { return rLetters(1, except)[0]; }
function rLetters(n, except = []) {
  let all = 'abcdefghijklmnopqrstuvwxyz';
  for (const l of except) all = all.replace(l, '');
  return rChoose(toLetters(all), n);
}
function rNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function root(areaName) {
  setTableSize(areaName, 400, 300);
  UIROOT = jsCopy(SPEC.staticSpec.root);
  for (const k in AREAS) delete AREAS[k];
  PROTO = {};
  INFO = {};
  staticArea(areaName, UIROOT);
  addAREA('root', UIROOT);
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
  let text = diStage(card.age);
  ctx3.fillText(text, x, y);
  return cv3;
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
async function route_path_text(url) {
  let data = await fetch(url);
  let text = await data.text();
  return text;
}
function runderkreis(color, id) {
  return `<div id=${id} style='width:20px;height:20px;border-radius:50%;background-color:${color};color:white;position:absolute;left:0px;top:0px;'>` + '' + "</div>";
}
function rUniqueId(n = 10) { return rChoose(toLetters('0123456789abcdefghijklmnopqABCDEFGHIJKLMNOPQRSTUVWXYZ_'), n).join(''); }
function rWheel(n = 1, hue = null, sat = 100, bri = 50) {
  let d = 360 / n;
  let h = valf(hue, rHue());
  let arr = [];
  for (let i = 0; i < n; i++) {
    console.log('h', h)
    let r = colorFromHSL(h, sat, bri);
    h = (h + d) % 360;
    arr.push(r);
  }
  return arr;
}
function rWord(n = 6) { return rLetters(n).join(''); }
function rWords(n = 1) {
  let words = getColorNames().map(x => x.toLowerCase());
  let arr = rChoose(words, n);
  return arr;
}
function sameList(l1, l2) {
  if (l1.length != l2.length) return false;
  for (const s of l1) {
    if (!l2.includes(s)) return false;
  }
  return true;
}
function saveUser() {
  U.lastGame = G.id;
  if (!startsWith(Username, 'test')) localStorage.setItem('user', Username);
  DB.users[Username] = U;
  dbSaveX();
}
function scaleAnimation(element) {
  let ani = element.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.3)' },
  ], {
    duration: 1000,
    easing: 'ease-in-out',
    iterations: 2,
    direction: 'alternate'
  });
  return ani;
}
function scoring(isCorrect) {
  Score.nTotal += 1;
  if (isCorrect) { Score.nCorrect += 1; if (G.trialNumber == 1) Score.nCorrect1 += 1; }
  percentageCorrect = Math.round(100 * Score.nCorrect / Score.nTotal);
  if (isCorrect) { Score.nPos += 1; Score.nNeg = 0; } else { Score.nPos = 0; Score.nNeg += 1; }
  let levelChange = 0;
  let gameChange = false;
  let nextLevel = G.level;
  let toggle = G.pictureLabels == 'toggle';
  let hasLabels = G.showLabels == true;
  let boundary = G.samplesPerGame;
  let pos = G.incrementLevelOnPositiveStreak;
  let posSeq = pos > 0 && Score.nPos >= pos;
  let halfposSeq = pos > 0 && Score.nPos >= pos / 2;
  let neg = G.decrementLevelOnNegativeStreak;
  let negSeq = neg > 0 && Score.nNeg >= neg;
  let halfnegSeq = neg > 0 && Score.nNeg >= neg / 2;
  let labelsNextRound = G.showLabels;
  if (halfposSeq && hasLabels && toggle) { labelsNextRound = false; }
  else if (posSeq) { levelChange = 1; nextLevel += 1; Score.nPos = 0; }
  if (halfnegSeq && !hasLabels && toggle) { labelsNextRound = true; }
  else if (negSeq) { levelChange = -1; if (nextLevel > 0) nextLevel -= 1; Score.nNeg = 0; }
  if (nextLevel != G.Level && nextLevel > 0 && nextLevel <= G.maxLevel) {
    userUpdate(['games', G.id, 'startLevel'], nextLevel);
  }
  if (Score.nTotal >= boundary) {
    gameChange = true; levelChange = false;
  }
  if (levelChange || gameChange) {
    if (toggle) labelsNextRound = true;
  } else if (!halfnegSeq && toggle && hasLabels && Score.nTotal >= G.samplesPerGame / 2) {
    labelsNextRound = false;
  }
  G.showLabels = labelsNextRound;
  Score.gameChange = gameChange;
  Score.levelChange = levelChange;
  return nextLevel;
}
function select_add_items(items, callback = null, instruction = null, min = 0, max = 100, prevent_autoselect = false) {
  let A = Z.A;
  select_clear_previous_level();
  A.level++; A.items = items; A.callback = callback; A.selected = []; A.minselected = min; A.maxselected = max;
  console.log('A.level', A.level)
  show_stage();
  let dInstruction = mBy('dSelections0');
  mClass(dInstruction, 'instruction');
  mCenterCenterFlex(dInstruction);
  dInstruction.innerHTML = (Z.role == 'active' ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` : `${Z.uplayer}`) + "&nbsp;" + instruction;
  if (too_many_string_items(A)) { mLinebreak(dInstruction, 4); }
  let has_submit_items = false;
  let buttonstyle = { maleft: 10, vmargin: 2, rounding: 6, padding: '4px 12px 5px 12px', border: '0px solid transparent', outline: 'none' }
  for (const item of A.items) {
    let type = item.itemtype = is_card(item) ? 'card' : isdef(item.o) ? 'container' : 'string';
    if (isdef(item.submit_on_click)) { has_submit_items = true; }
    let id = item.id = lookup(item, ['o', 'id']) ? item.o.id : getUID(); A.di[id] = item;
    if (type == 'string') {
      let handler = ev => select_last(item, isdef(item.submit_on_click) ? callback : select_toggle, ev);
      item.div = mButton(item.a, handler, dInstruction, buttonstyle, null, id);
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
  assertion(A.items.length >= min, 'less options than min selection!!!!', A.items.length, 'min is', min);
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
    let dsel = mBy(`dSelections1`);
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
      }
    }
  }
}
function select_highlight() { let A = Z.A; for (const i of A.selected) { let a = A.items[i]; ari_make_selected(a, true); } }
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
function select_toggle() {
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
function selectAddItems(items, callback = null, instruction = null) {
  let [A, fen] = [Clientdata.A, Clientdata.fen];
  A.level++; A.items = items; A.callback = callback; A.selected = []; A.di = {};
  let dInstruction = mBy('dSelections0');
  mClass(dInstruction, 'instruction');
  mCenterCenterFlex(dInstruction);
  mStyle(dInstruction, { 'align-content': 'center', 'justify-content': 'center' })
  dInstruction.innerHTML = (isMyTurn(fen) ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` + "&nbsp;" + instruction : `waiting for: ${getTurnPlayers(fen)}`);
  let buttonstyle = { maleft: 25, vmargin: 2, rounding: 6, padding: '4px 12px 5px 12px', border: '0px solid transparent', outline: 'none' }
  for (const item of A.items) {
    let type = item.itemtype = isdef(item.itemtype) ? item.itemtype : is_card(item) ? 'card' : isdef(M.superdi[item.key]) ? 'sym' : isdef(item.o) ? 'container' : isdef(item.src) ? 'img' : 'string';
    let [el, o, d1, fz, fg] = [null, item.o, dInstruction, 30, 'grey'];
    if (type == 'sym') {
      if (isdef(o.img)) { el = mDom(d1, { h: fz, hmargin: 8, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` }); }
      else if (isdef(o.text)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
      else if (isdef(o.fa6)) el = mDom(d1, { hmargin: 8, fz: fz - 2, hline: fz, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
      else if (isdef(o.fa)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
      else if (isdef(o.ga)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
    } else if (isdef(item.present)) {
      el = item.present(item, d1, { sz: fz, fg: fg });
    } else assertion(false, `WRONG ITEM TYPE ${type}`)
    mStyle(el, { cursor: 'pointer' })
    el.id = getUID(); A.di[el.id] = item;
    el.onclick = callback;
  }
}
function selectCivSpot(d) {
  if (isdef(M.selectedCivSpot)) mClassRemove(M.selectedCivSpot, 'shadow');
  M.selectedCivSpot = d;
  mClass(d, 'shadow')
}
function selectExtraWorker(item) {
}
function selectPlayerItem(item) { mStyle(iDiv(item), { bg: getUserColor(item.name), fg: 'white', border: `white` }); }
function selectText(el) {
  if (el instanceof HTMLTextAreaElement) { el.select(); return; }
  var sel, range;
  if (window.getSelection && document.createRange) {
    sel = window.getSelection();
    if (sel.toString() == '') {
      window.setTimeout(function () {
        range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
      }, 1);
    }
  } else if (document.selection) {
    sel = document.selection.createRange();
    if (sel.text == '') {
      range = document.body.createTextRange();
      range.moveToElementText(el);
      range.select();
    }
  }
}
function selPrep(fen, autosubmit = false) {
  Clientdata.A = { level: 0, di: {}, ll: [], items: [], selected: [], tree: null, breadcrumbs: [], sib: [], command: null, autosubmit: autosubmit };
  Clientdata.fen = fen;
}
function send_or_sim(o, cmd) {
  Counter.server += 1;
  phpPost(o, cmd);
}
function sendgameover(plname, friendly, fen, scoring) {
  let o = { winners: plname, friendly: friendly, fen: fen, scoring: scoring };
  phpPost(o, 'gameover');
}
async function sendMergeTable(o) { 
  if (nundef(o)) {
    let table = Cliendata.table;
    let name = getUname();
    let id = table.id;
    o={name,id,table};
  }else if (nundef(o.name)){
    let table = o;
    let name = getUname();
    let id = table.id;
    o={name,id,table};
  }
  let table =  await mPostRoute('mergeTable', o); 
  await showTable(table);
}
function sendSIMSIM(o, exclusive = false, saveFromZ = false) {
  o = data_from_client(o);
  let result = apiphp(o, saveFromZ);
  if (TESTING && o.cmd == 'startgame') { for (const func of DA.test.mods) func(result.table); }
  let res = JSON.stringify(result);
  if (exclusive) { if_hotseat_autoswitch(result); handle_result(res, o.cmd); } else { console.log('sendSIMSIM testresult', result); }
}
function server_offline(req, type) {
  if (type == 'user_info') console.log('_______to server offline!', 'req', req, 'type', type, 'Session.cur_user', Session.cur_user);
  let response = {};
  switch (type) {
    case 'user_info':
    case 'account':
      if (nundef(req.user)) req.user = Session.cur_user;
      let u = response.message = DB.users[req.user];
      console.log('udata', u);
      response.name = u.name;
      break;
    case 'contacts':
      let usernames = get_user_names().filter(x => x != Session.cur_user);
      response.users = usernames.map(x => DB.users[x]);
      break;
  }
  response.type = type;
  from_server(JSON.stringify(response), type);
}
function server_online(req, type) {
  var xml = new XMLHttpRequest();
  var loader_holder = mBy("loader_holder");
  loader_holder.className = "loader_on";
  xml.onload = function () {
    if (xml.readyState == 4 || xml.status == 200) {
      loader_holder.className = "loader_off";
      from_server(xml.responseText, type);
    }
  }
  var data = { req: req, type: type };
  data = JSON.stringify(data);
  xml.open("POST", "./server/apisi.php", true);
  xml.send(data);
}
function set_background_color(color, elem) { if (nundef(elem)) elem = mBy('md').parentNode; mStyle(elem, { bg: getColorDictColor(color) }); }
function set_card_border(item, thickness = 1, color = 'black', dasharray) {
  let d = iDiv(item);
  let rect = lastDescendantOfType('rect', d);
  assertion(rect, 'NO RECT FOUND IN ELEM', d);
  if (rect) {
    rect.setAttribute('stroke-width', thickness);
    rect.setAttribute('stroke', color);
    if (isdef(dasharray)) rect.setAttribute('stroke-dasharray', dasharray);
  }
}
function set_most_recent_table_as_cur_tid(tables) { if (!isEmpty(tables)) Session.cur_tid = tables[0].id; }
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
function set_preferred_lang(uname, val) { val = val.toUpperCase(); if ('EDSFC'.indexOf(val) >= 0) return lookupSetOverride(DB.users, [uname, 'lang'], val); }
function set_start_data_from_fen(fen, game) {
  let parts = fen.split(',');
  for (const p of parts) {
    let [name, startlevel, lang] = p.split(':');
    startlevel = Number(startlevel);
    set_startlevel(name, game, startlevel);
    set_preferred_lang(name, lang);
  }
}
function set_startlevel(user, game, val) { return lookupSetOverride(DB.users, [user, 'games', game, 'startlevel'], val); }
function set_tables_by_game(obj, is_set_cur_id = true) {
  let tables = Session.tables = obj.tables;
  let bygame = Session.tables_by_game = {};
  if (isEmpty(tables)) {
    Session.cur_tid = null;
    Session.tables_by_game = {};
  } else {
    if (is_set_cur_id) {
      let t = tables[0];
      Session.cur_tid = t.id;
      Session.cur_game = t.game;
    }
    for (const t of tables) { lookupAddToList(bygame, [t.game], t); }
  }
  return bygame;
}
function set_user(name) {
  if (isdef(Z) && isdef(U) && U.name != name) {
    Z.prev.u = U;
    Z.prev.uname = U.name;
  }
  U = firstCond(Serverdata.users, x => x.name == name);
  if (isdef(Z)) {
    Z.u = U;
    Z.uname = Z.uplayer = name;
  }
}
async function setActivate(items) {
  try {
    T.sets = setFindAllSets(items); 
    [T.bNoSet, T.bHint] = setShowButtons(items);
    setActivateCards(items);
    let use_level = getGameOption('use_level'); if (use_level == 'no') { T.bHint.remove(); return; }
    let level = getPlayerProp('level');
    let noset=isEmpty(T.sets);
    T.numHints = level <= 3 ? noset?1:2 : level <= 5 ? 1 : 0;
    if (level > 5){T.bHint.remove();}
    else if (level == 1){  T.autoHints = noset?1: 2; T.hintTimes = [noset?10000:2000,5000]; }
    else if (level == 2){  T.autoHints = noset?1:2; T.hintTimes = [noset?10000:3000,8000]; }
    else if (level == 3){  T.autoHints = 1; T.hintTimes = [noset?10000:4000]; }
    else if (level == 4){  T.autoHints = 1; T.hintTimes = [noset?10000:8000]; }
    let i=0;
    while(i<T.autoHints){
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
function setBadgeLevel(i) {
  G.level = i;
  Score.levelChange = true;
  if (isEmpty(badges)) showBadgesX(dLeiste, G.level, onClickBadgeX, G.maxLevel);
  for (let iBadge = 0; iBadge < G.level; iBadge++) {
    let d1 = iDiv(badges[iBadge]);
    d1.style.opacity = .75;
    d1.style.border = 'transparent';
    d1.children[1].innerHTML = '* ' + (iBadge + 1) + ' *';
    d1.children[0].style.color = 'white';
  }
  let d = iDiv(badges[G.level]);
  d.style.border = '1px solid #00000080';
  d.style.opacity = 1;
  d.children[1].innerHTML = 'Level ' + (G.level + 1);
  d.children[0].style.color = 'white';
  for (let iBadge = G.level + 1; iBadge < badges.length; iBadge++) {
    let d1 = iDiv(badges[iBadge]);
    d1.style.border = 'transparent';
    d1.style.opacity = .25;
    d1.children[1].innerHTML = 'Level ' + (iBadge + 1);
    d1.children[0].style.color = 'black';
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
function setColors(c) {
  let hsl = colorHSL(c, true);
  let [hue, diff, wheel, p] = [hsl.h, 30, [], 20];
  let hstart = (hue + diff);
  for (i = hstart; i <= hstart + 235; i += 20) {
    let h = i % 360;
    let c1 = colorFromHSL(h, 100, 75);
    wheel.push(c1);
  }
  let cc = idealTextColor(c);
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
function setCssVar(varname, val) { document.body.style.setProperty(varname, val); }
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
function setDropPosition(ev, elem, targetElem, dropPos) {
  if (dropPos == 'mouse') {
    var elm = $(targetElem);
    x = ev.pageX - elm.offset().left - dragStartOffset.x;
    y = ev.pageY - elm.offset().top - dragStartOffset.y;
    posXY(elem, targetElem, x, y);
  } else if (dropPos == 'none') {
    return;
  } else if (dropPos == 'center') {
    elem.style.position = elem.style.left = elem.style.top = '';
    elem.classList.add('centeredTL');
  } else if (dropPos == 'centerCentered') {
    elem.style.position = elem.style.left = elem.style.top = '';
    elem.classList.add('centerCentered');
  } else {
    dropPos(ev, elem, targetElem);
  }
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
function setgame() {
  function setup(table) {
    let fen = {};
    fen.players = {};
    for (const name in table.players) {
      let pl = fen.players[name] = table.players[name];
      pl.color = getUserColor(name)
      pl.score = 0;
    }
    fen.deck = setCreateDeck();
    fen.cards = deckDeal(fen.deck, table.options.numCards);
    fen.plorder = jsCopy(table.playerNames);
    fen.turn = jsCopy(table.playerNames); 
    delete table.players;
    return fen;
  }
  async function activate(table,items) { await setActivate(items); } 
  function checkGameover(table) {
    return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  async function present(dParent,table) { return await setPresent(dParent,table); }
  async function hybridMove(table) { await setHybridMove(table); } 
  async function botMove(table,items,name) { await setBotMove(table,items,name); } 
  async function stepComplete(table, o) { }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}
function setGameover(table) {
  table.status = 'over';
  table.winners = getPlayersWithMaxScore(table.fen);
}
function setGoal(index) {
  if (nundef(index)) {
    let rnd = G.numPics < 2 ? 0 : randomNumber(0, G.numPics - 2);
    if (G.numPics >= 2 && rnd == lastPosition && coin(70)) rnd = G.numPics - 1;
    index = rnd;
  }
  lastPosition = index;
  Goal = Pictures[index];
}
function setHintHide() { mClass(T.bHint, 'disabled'); } //mStyle(T.bHint,{display:'hidden'}); } //T.bHint.remove();}
function setKeys({ allowDuplicates, nMin = 25, lang, key, keySets, filterFunc, param, confidence, sortByFunc } = {}) {
  let keys = jsCopy(keySets[key]);
  if (isdef(nMin)) {
    let diff = nMin - keys.length;
    let additionalSet = diff > 0 ? nMin > 100 ? firstCondDictKeys(keySets, k => k != key && keySets[k].length > diff) : 'best100' : null;
    if (additionalSet) KeySets[additionalSet].map(x => addIf(keys, x));
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
function setLanguage(x) { currentLanguage = x; startLevel(); }
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
  let overrideList = [];
  if (m == 3) {
    clearEvents();
    mShield(dOpenTable, { bg: '#00000000' }); //disable ui
    let [me, table] = [getUname(), Clientdata.table];
    let [fen, pl] = [table.fen, table.fen.players[me]];
    let isSet = setCheckIfSet(keys); 
    if (isSet) { 
      assertion(fen.cards.length >= table.options.numCards || isEmpty(fen.deck), `LOGISCHER IRRTUM SET REPLENISH ${fen.cards.length}, deck:${fen.deck.length}`)
      let toomany = Math.max(0, fen.cards.length - table.options.numCards); 
      let need = Math.max(0, 3 - toomany); 
      let newCards = deckDeal(fen.deck, need); 
      for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i])
      overrideList.push({ keys: ['fen', 'cards'], val: table.fen.cards });
      overrideList.push({ keys: ['fen', 'deck'], val: table.fen.deck });
      pl.score++;
      pl.incScore = 1;
    } else {
      pl.score--;
      pl.incScore = -1;
    }
    overrideList.push({ keys: ['fen', 'players', me, 'score'], val: pl.score });
    if (pl.playmode == 'bot') {
      await mSleep(500);
      if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
    }
    let res = await sendMergeTable({ id: table.id, name: me, overrideList }); // console.log('res', res)
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
  let [me, table] = [getUname(), Clientdata.table];
  let [fen, pl] = [table.fen, table.fen.players[me]];
  let overrideList = [];
  if (isEmpty(T.sets)) { 
    pl.score++;
    pl.incScore = 1;
    let newCards = deckDeal(fen.deck, 1); 
    if (!isEmpty(newCards)) {
      fen.cards.push(newCards[0]);
      overrideList.push({ keys: ['fen', 'cards'], val: table.fen.cards });
      overrideList.push({ keys: ['fen', 'deck'], val: table.fen.deck });
    } else {
      setGameover(table);
      overrideList.push({ keys: ['status'], val: table.status });
      overrideList.push({ keys: ['winners'], val: table.winners });
      console.log(`table status is now ${table.status}`);
      assertion(table.status == 'over', "HAAAAAAAAALLLLLLLO")
    }
  } else {
    pl.score--;
    pl.incScore = -1;
  }
  overrideList.push({ keys: ['fen', 'players', me, 'score'], val: pl.score });
  if (pl.playmode == 'bot') {
    await mSleep(500);
    if (checkInterrupt(items)) { console.log('!!!onclick noset!!!'); return; }
  }
  let res = await sendMergeTable({ id: table.id, name: me, overrideList });
}
async function setPlayerNotPlaying(item, gamename) {
  await collectFromPrevious(gamename);
  removeInPlace(DA.playerList, item.name);
  mRemoveIfExists('dPlayerOptions');
  unselectPlayerItem(item);
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
      let userval = p == 'playmode'?'human':lookup(DA.allPlayers, [name, gamename, p]);
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
      measure_fieldset(fs);
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
async function setPresent(dParent,table) {
  const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' }; //'#4b0082' //'#8e44ed' }; //'blueviolet' }; //'#8e44ad' };
  setLoadPatterns('dPage', colors);
  mClear(dParent);
  let d = mDom(dParent, { margin: 10 }); //, bg: '#00000080' }); mCenterFlex(d)
  [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(d);
  let [fen, playerNames, players, turn] = [table.fen, table.playerNames, table.fen.players, table.fen.turn];
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
function setRect(elem, options) {
  let r = getRect(elem);
  elem.rect = r;
  elem.setAttribute('rect', `${r.w} ${r.h} ${r.t} ${r.l} ${r.b} ${r.r}`);
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
function setScoresSameOrHigher(told,tnew){
  if (nundef(told)) return true;
  let [plold,plnew]=[told.fen.players,tnew.fen.players];
  for(const name in plnew){
    if (plold[name].score+plold[name].incScore != plnew[name].score) return false;
    plnew[name].incScore = 0;
  }
  return true;
}
function setShowButtons(items) {
  let buttons = mDom(dOpenTable, { w100: true, gap: 10, matop: 20 }); mCenterCenterFlex(buttons);
  let bno = mButton('NO Set', ()=>setOnclickNoSet(items,true), buttons, { w: 80 }, 'input');
  let bhint = mButton('Hint', ()=>setOnclickHint(items,true), buttons, { w: 80 }, 'input');
  return [bno, bhint];
}
function setStats(table, dParent, layout, showTurn = true) {
  let [fen,me] = [table.fen,getUname()];
  let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
  let player_stat_items = uiTypePlayerStats(fen, me, dParent, layout, style)
  let uselevel = getGameOption('use_level');
  let botLevel = Math.floor(calcBotLevel(table)); 
  for (const plname in fen.players) {
    let pl = fen.players[plname]; 
    let item = player_stat_items[plname];
    if (pl.playmode == 'bot') {
      let c=getLevelColor(botLevel);
      mStyle(item.img,{rounding:0,border:`${c} ${botLevel}px solid`});
    }
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
    playerStatCount('star', pl.score, d);
    if (uselevel != 'yes') continue;
    mDom(d, { fz: 11, round: true, hpadding: 3, fg: 'contrast', bg: getLevelColor(pl.level), position: 'absolute', top: 1, right: 2 }, { html: pl.level })
  }
}
function setTableBackground(bg, fg = 'white', isBase = true) {
  bg = colorHex(bg);
  if (isBase) DA.tableBaseColor = bg;
  mStyleX(dTableBackground, { bg: bg, fg: isdef(fg) ? fg : 'contrast' });
}
function setTableSize(w, h, unit = 'px') {
  let d = mBy('areaTable');
  mStyle(d, { 'min-width': w, 'min-height': h }, unit);
}
function setTableToStarted(table) {
  table.status = 'started';
  table.step = 0;
  table.fen = DA.funcs[table.game].setup(table); 
  return table;
}
function setup() {
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
function shield_off() {
  mStyle('dAdmin', { bg: 'white' });
}
function shield_on() {
  mShield(dTable.firstChild.childNodes[1]);
  mStyle('dAdmin', { bg: 'silver' });
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
function show_admin_ui() {
  for (const id of ['bSpotitStart', 'bClearAck', 'bRandomMove', 'bSkipPlayer', 'bRestartMove']) hide(id);
  if (Z.game == 'spotit' && Z.uname == Z.host && Z.stage == 'init') show('bSpotitStart');
  else if (Z.game == 'bluff' && Z.uname == Z.host && Z.stage == 1) show('bClearAck');
  else if (Z.uname == Z.host && Z.stage == 'round_end') show('bClearAck');
  else if (Z.game == 'ferro' && Z.uname == 'mimi' && Z.stage != 'card_selection') show('bClearAck');
  if (['ferro', 'bluff', 'aristo', 'a_game'].includes(Z.game) && (Z.role == 'active' || Z.mode == 'hotseat')) {
    show('bRandomMove');
  }
  if (Z.uname == Z.host || Z.uname == 'mimi') show('dHostButtons'); else hide('dHostButtons');
  if (DA.TEST0 == true) show('dTestButtons'); else hide('dTestButtons');
}
function show_feedback(is_correct, correction = true) {
  function success() {
    if (isdef(Selected) && isdef(Selected.feedbackUI)) {
      let uilist;
      if (isdef(Selected.positiveFeedbackUI)) uilist = [Selected.positiveFeedbackUI];
      else uilist = isList(Selected.feedbackUI) ? Selected.feedbackUI : [Selected.feedbackUI];
      let sz = getRect(uilist[0]).h;
      for (const ui of uilist) {
        mpOver(markerSuccess(), ui, sz, 'green', 'segoeBlack');
      }
    }
    return 500;
  }
  function fail() {
    if (isdef(Selected) && isdef(Selected.feedbackUI)) {
      let uilist = isList(Selected.feedbackUI) ? Selected.feedbackUI : [Selected.feedbackUI];
      let sz = getRect(uilist[0]).h;
      for (const ui of uilist) {
        mpOver(markerFail(), ui, sz, 'red', 'segoeBlack');
      }
    }
    return 1000;
  }
  if (is_correct) { return success(); }
  else {
    if (correction) {
      let anim = valf(Selected.animation, 'onPulse5');
      for (const ui of Selected.correctUis) { mClass(ui, anim); }
    }
    return fail();
  }
}
function show_game_name(gname) { dGameTitle.innerHTML = gname; }
function show_game_options(dParent, game) {
  mRemoveChildrenFromIndex(dParent, 2);
  let poss = Config.games[game].options;
  if (nundef(poss)) return;
  for (const p in poss) {
    let key = p;
    let val = poss[p];
    if (isString(val)) {
      let list = val.split(',');
      let fs = mRadioGroup(dParent, {}, `d_${key}`, key);
      for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
      measure_fieldset(fs);
    }
  }
}
function show_game_options_menu(gamename) {
  let dMenu = mBy('dMenu'); iClear(dMenu);
  show_standard_title(dMenu, 'Game Options');
  let d = mDiv(dMenu, { align: 'center' }, 'fMenuInput');
  let dOptions = mDiv(d, {}, 'dMenuInput'); mCenterFlex(dOptions);
  let dButtons = mDiv(d, { display: 'flex', justify: 'center', w: '100%' }, 'dMenuButtons');
  DA.playerlist = null;
  show_game_options(dOptions, gamename);
  let astart = maButton('Start', start_game, dButtons);
  let acancel = maButton('Cancel', cancel_game, dButtons);
}
function show_gameover(winners) {
  let pl = Session.cur_players[winners[0]];
  let styles = { bg: pl.color, fg: 'contrast', top: 220, };
  if (winners.length > 1) {
    status_message(`GAME OVER - The winners are ${winners.join(', ')}!!!`, styles);
  } else {
    status_message(`GAME OVER - The winner is ${winners[0]}!!!`, styles);
  }
}
function show_games(ms = 500) {
  let dParent = mBy('dGames');
  mClear(dParent);
  mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
  let d = mDiv(dParent, { fg: 'white', animation: 'appear 1s ease both' }, 'game_menu');
  mCenterFlex(d);
  let gamelist = 'aristo bluff spotit ferro fritz'; if (DA.TEST0) gamelist += ' a_game';
  for (const g of dict2list(Config.games)) {
    if (gamelist.includes(g.id)) {
      let [sym, bg, color, id] = [Syms[g.logo], g.color, null, getUID()];
      let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, vpadding: 15, wmin: 140, bg: bg, position: 'relative' }, g.id);
      d1.setAttribute('gamename', g.id);
      d1.onclick = onclick_game_menu_item;
      mCenterFlex(d1);
      mDiv(d1, { fz: 50, family: sym.family, 'line-height': 55 }, null, sym.text);
      mLinebreak(d1);
      mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
    }
  }
}
function show_handsorting_buttons_for(plname, styles = {}) {
  if (Z.role == 'spectator' || isdef(mBy('dHandButtons'))) return;
  let fen = Z.fen;
  let pl = fen.players[plname];
  if (pl.hand.length <= 1) return;
  let d = UI.players[plname].hand.container; mStyle(d, { position: 'relative', wmin: 155 });
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
    let dHistory = mDiv(dParent, { paleft: 12, bg: colorLight('#EDC690', .5), box: true, matop: 4, rounding: 10, patop: 10, pabottom: 10, w: '100%', hmax: `calc( 100vh - 250px )`, 'overflow-y': 'auto', w: 260 }, null, html);
    UI.dHistoryParent = dParent;
    UI.dHistory = dHistory;
    if (isdef(Clientdata.historyLayout)) {
      show_history_layout(Clientdata.historyLayout);
    }
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
  let d = miPic('castle', dParent, { cursor: 'pointer', fz: 24, padding: 6, h: 36, box: true, margin: 2 });
  d.onclick = db_load;
  let version = 'v0.0.1';
  let html = `version ${version}`
  mText(html, dParent, { fz: 12 });
}
function show_hourglass(uname, d, sz, stylesPos = {}) {
  let html = get_waiting_html(sz);
  mStyle(d, { position: 'relative' });
  addKeys({ position: 'absolute' }, stylesPos);
  let dw = mDom(d, stylesPos, {id:`dh_${uname}`, html});
}
function show_level(level, maxlevel) {
  let handicap = maxlevel - level;
  dLevel.innerHTML = `level: ${level}`;
  mStyle(dLevel, { fg: level >= 8 ? get_user_color() : 'white' });
}
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
function show_polling_signal() {
  if (DA.TEST0 != true) return;
  let d1 = mDiv(mBy('dAdmin'), { position: 'fixed', top: 10, left: 73 });
  let bg = Z.skip_presentation == true ? 'grey' : 'green';
  let d2 = mDiv(d1, { width: 20, height: 20, bg: bg, rounding: 10, display: 'inline-block' });
  mFadeRemove(d1, 1000);
}
function show_rankings(dParent) {
  csv = make_csv_for_rankings();
  let ch = csv[csv.length - 1];
  if (ch == '%' || isNumber(ch)) {
    let d = mDiv(dParent, { align: 'center' }, null, `<h1>All Time Ranking</h1>`);
    let d1 = mDiv(d, { align: 'center', display: 'flex' });
    mCenterCenterFlex(d1);
    present_table_from_csv(csv, d1);
    mLinebreak(dParent);
  }
}
function show_role() {
  let d = mBy('dAdminMiddle');
  clearElement(d);
  let hotseatplayer = Z.uname != Z.uplayer && Z.mode == 'hotseat' && Z.host == Z.uname;
  let styles, text;
  let boldstyle = { fg: 'red', weight: 'bold', fz: 20 };
  let normalstyle = { fg: 'black', weight: null, fz: null };
  let location = '';
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
  let playmode = get_playmode(uplayer);
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
function show_special_message(msg, stay = false, ms = 3000, delay = 0, styles = {}, callback = null) {
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
function show_stage() {
  if (isdef(Z.fen.progress)) {
    let d = mBy('dTitleLeft');
    let former = mBy('dProgress');
    if (isdef(former)) former.remove();
    let dprogress = mDiv(d, {}, 'dProgress', `<div>${Z.fen.progress}</div>`);
  }
}
function show_standard_title(dParent, title) { mText(title, dParent, { margin: 20, fz: 24 }); }
function show_strategy_popup() {
  let dpop = mPopup('', dTable, { fz: 16, fg: 'white', top: 0, right: 0, border: 'white', padding: 10, bg: 'dimgray' }, 'dOptions');
  mAppend(dpop, mCreateFrom(`<div style="text-align:center;width:100%;font-family:Algerian;font-size:22px;">${Z.game}</div>`));
  mDiv(dpop, { matop: 5, maleft: 10 }, null, `choose strategy:`);
  let vals = Config.games[Z.game].options.strategy.split(',');
  let key = 'strategy';
  let fs = mRadioGroup(dpop, { fg: 'white' }, `d_${key}`);
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
  Z.func.state_info(mBy('dTitleLeft'));
  show_settings(mBy('dTitleRight'));
  mBy('dTablename').innerHTML = Z.friendly;
}
function show_title_left(s, styles, funnyLetters = false) {
  let d = mBy('dTitleLeft');
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
function show_user_image(uname, dParent, sz = 300) {
  let d = mDiv(dParent, { margin: 'auto', w: sz });
  let html = `
  <div style='text-align:center;margin-top:50px'>
    <img src='../base/assets/images/${uname}.jpg' class="img_person" height=150 />
  </div>
  `;
  d.innerHTML = html;
  return d;
}
function show_user_intro_screen(is_show_ranking = false, is_start_poll = true) {
  show('dIntro'); clearElement('dIntro');
  intro_show_user_image(Session.cur_user);
  status_message(`hi, ${capitalize(Session.cur_user)}, a game is starting soon...`, { top: 330, classname: 'slow_gradient_blink' });
  if (is_show_ranking) {
    let t = Session.cur_table;
    let fen = t.status == 'past' ? t.fen : get_score_fen_from_cur_players();
    intro_create_score_table(fen);
  }
  if (is_start_poll) poll_for_table_started();
}
function show_username() {
  let uname = U.name;
  let dpic = get_user_pic(uname, 30);
  let d = mBy('dAdminRight');
  mClear(d);
  mAppend(d, get_logout_button());
  mAppend(d, dpic);
  if (is_advanced_user()) { show('dAdvanced1'); } else { hide('dAdvanced'); hide('dAdvanced1'); }
  if (!TESTING && !DA.running) phpPost({ app: 'easy' }, 'tables');
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
function showBadgesX(dParent, level, clickHandler, maxLevel) {
  clearElement(dParent);
  badges = [];
  for (let i = 1; i <= maxLevel + 1; i++) {
    if (i > level) {
      let b = addBadge(dParent, i, clickHandler, false);
      b.live.div.style.opacity = .25;
      b.achieved = false;
    } else {
      let b = addBadge(dParent, i, clickHandler, true);
      b.achieved = true;
    }
  }
}
async function showCalendarApp() {
  if (!U) { console.log('you have to be logged in to use this menu!!!'); return; }
  showTitle('Calendar');
  let d1 = mDiv('dMain', { w: 800, h: 800 }); //, bg: 'white' })
  let x = DA.calendar = await uiTypeCalendar(d1);
}
function showChatMessage(o) {
  let d = mBy('dChatWindow'); if (nundef(d)) return;
  if (o.user == getUname()) mDom(d, { align: 'right' }, { html: `${o.msg}` })
  else mDom(d, { align: 'left' }, { html: `${o.user}: ${o.msg}` })
}
function showChatWindow() {
  let dChat = mDom('dRight', { padding: 10, fg: 'white', box: true }, { id: 'dChat', html: 'Chatbox' });
  UI.chatInput = mInput(dChat, { w: 260 }, 'inpChat', '<your message>', 'input', 1);
  UI.chatWindow = mDom(dChat, {}, { id: 'dChatWindow' });
  mOnEnter(UI.chatInput, ev => {
    let inp = ev.target;
    Socket.emit('message', { user: getUname(), msg: ev.target.value });
    ev.target.value = '';
  });
}
async function showColors() {
  showTitle('Set Color Theme');
  let sz = 30;
  let d = mDom('dMain', { wmax: (sz + 4) * 15, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
  list = M.playerColors.concat(grays);
  for (const c of list) {
    let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c) });
    dc.onclick = onclickColor;
    mStyle(dc, { cursor: 'pointer' });
  }
}
async function showDashboard() {
  let me = getUname();
  mDom('dMain', { fg: getThemeFg() }, { html: `hi, ${me}! this is your dashboard` });
  if (me == 'guest') mDom('dMain',{align:'center',className:'section'},{html:'click username in upper left corner to log in'})
}
function showDeck(keys, dParent, splay, w, h) {
  let d = mDiv(dParent);
  mStyleX(d, { display: 'block', position: 'relative', bg: 'green', padding: 25 });
  let gap = 10;
  let ovPercent = 20;
  let overlap = w * ovPercent / 100;
  let x = y = gap;
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    let c = zInno(k, d);
    mAppend(d, c.div);
    mStyleX(c.div, { position: 'absolute', left: x, top: y });
    c.row = 0;
    c.col = i;
    x += overlap;
    Pictures.push(c);
  }
  d.style.width = (x - overlap + w) + 'px';
  console.log(Pictures[0])
  console.log(Pictures[0].div)
  d.style.height = firstNumber(Pictures[0].div.style.height) + 'px';
}
async function showDirPics(dir, dParent) {
  let imgs = await mGetFiles(dir);
  for (const fname of imgs) {
    let src = `${dir}/${fname}`;
    let sz = 200;
    let styles = { 'object-position': 'center top', 'object-fit': 'cover', h: sz, w: sz, round: true, border: `${rColor()} 2px solid` }
    let img = mDom(dParent, styles, { tag: 'img', src });
  }
}
function showDiv(d) { mStyle(d, { bg: rColor() }); console.log(d, mGetStyle(d, 'w')); }
function showEventOpen(id) {
  let e = Items[id];
  if (!e) return;
  let date = new Date(Number(e.day));
  let [day, month, year] = [date.getDate(), date.getMonth(), date.getFullYear()];
  let time = e.time;
  let popup = openPopup();
  let d = mBy(id);
  let [x, y, w, h, wp, hp] = [d.offsetLeft, d.offsetTop, d.offsetWidth, d.offsetHeight, 300, 180];
  let [left, top] = [Math.max(10, x + w / 2 - wp / 2), Math.min(window.innerHeight - hp - 60, y + h / 2 - hp / 2)]
  mStyle(popup, { left: left, top: top, w: wp, h: hp });
  let dd = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 3, pabottom: 4 }, { html: `date: ${day}.${month}.${year}` });
  let dt = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 20, pabottom: 4 }, { html: `time:` });
  let inpt = mDom(popup, { fz: '80%', maleft: 3, mabottom: 4, w: 60 }, { tag: 'input', value: e.time });
  mOnEnter(inpt);
  console.log('event text:', e.text)
  let ta = mDom(popup, { rounding: 4, matop: 7, box: true, w: '100%', vpadding: 4, hpadding: 10, }, { tag: 'textarea', rows: 7, value: e.text });
  let line = mDom(popup, { matop: 6, w: '100%' }); //,'align-items':'space-between'});
  let buttons = mDom(line, { display: 'inline-block' });
  let bsend = mButton('Save', () => onEventEdited(id, ta.value, inpt.value), buttons);
  mButton('Cancel', () => closePopup(), buttons, { hmargin: 10 })
  mButton('Delete', () => { deleteEvent(id); closePopup(); }, buttons, { fg: 'red' })
  mDom(line, { fz: '90%', maright: 5, float: 'right', }, { html: `by ${e.user}` });
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
async function showGameMenu(gamename) {
  let users = Serverdata.users = await mGetRoute('users');//console.log('users',users);
  mRemoveIfExists('dGameMenu');
  let dMenu = mDom('dMain', {}, { className: 'section', id: 'dGameMenu' });
  mDom(dMenu, { maleft: 12 }, { html: `<h2>game options</h2>` });
  let style = { display: 'flex', justify: 'center', w: '100%', gap: 10, matop: 6 };
  let dPlayers = mDiv(dMenu, style, 'dMenuPlayers'); //mCenterFlex(dPlayers);
  let dOptions = mDiv(dMenu, style, 'dMenuOptions'); //mCenterFlex(dOptions);
  let dButtons = mDiv(dMenu, style, 'dMenuButtons');
  DA.gamename = gamename;
  DA.gameOptions = {};
  DA.playerList = [];
  DA.allPlayers = {};
  DA.lastName = null;
  await showGamePlayers(dPlayers, users);
  await showGameOptions(dOptions, gamename);
  let astart = mButton('Start', onclickStartGame, dButtons, {}, ['button', 'input']);
  let ajoin = mButton('Open to Join', onclickOpenToJoinGame, dButtons, {}, ['button', 'input']);
  let acancel = mButton('Cancel', () => mClear(dMenu), dButtons, {}, ['button', 'input']);
  let bclear = mButton('Clear Players', onclickClearPlayers, dButtons, {}, ['button', 'input']);
}
async function showGameMenuPlayerDialog(name, shift = false) {
  let item = DA.allPlayers[name];
  let gamename = DA.gamename;
  let da = iDiv(item);
  if (!DA.playerList.includes(name)) await setPlayerPlaying(item, gamename);
  else await setPlayerNotPlaying(item, gamename);
}
async function showGameOptions(dParent, game) {
  let poss = Serverdata.config.games[game].options;
  if (nundef(poss)) return;
  for (const p in poss) {
    let key = p; 
    let val = poss[p];
    if (isString(val)) {
      let list = val.split(',');
      let legend = formatLegend(key);
      let fs = mRadioGroup(dParent, {}, `d_${key}`, legend);
      for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
      measure_fieldset(fs);
    }
  }
}
function showGameover(table) {
  let winners = table.winners;
  let msg = winners.length > 1 ? `GAME OVER - The winners are ${winners.join(', ')}!!!` : `GAME OVER - The winner is ${winners[0]}!!!`;
  let d = mBy('ribbon'); if (isdef(d)) d.remove();
  let bg = `linear-gradient(270deg, #fffffd, #00000080)`
  d = mDom(dTitle, { bg, mabottom: 10, align: 'center', padding: 10, fz: 40, w100: true }, { html: msg, id: 'ribbon' });
}
async function showGamePlayers(dParent, users) {
  let me = getUname();
  mStyle(dParent, { wrap: true })
  for (const name in users) {
    let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
    d.setAttribute('username', name)
    let img = showUserImage(name, d, 40); 
    let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
    let item = jsCopy(users[name]);
    item.div = d;
    item.isSelected = false;
    DA.allPlayers[name] = item;
    d.onclick = onclickGameMenuPlayer;
  }
  await clickOnPlayer(me);
}
function showGames(ms = 500) {
  let dParent = mBy('dGameList'); if (isdef(dParent)) { mClear(dParent); } else dParent = mDom('dMain', {}, { className: 'section', id: 'dGameList' });
  mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
  let d = mDiv(dParent, { fg: 'white' }, 'game_menu'); mFlexWrap(d);
  let gamelist = 'accuse aristo bluff ferro nations spotit wise'; if (DA.TEST0) gamelist += ' a_game'; gamelist = toWords(gamelist);
  gamelist = ['setgame']
  for (const gname of gamelist) {
    let g = Serverdata.config.games[gname];
    let [sym, bg, color, id] = [M.superdi[g.logo], g.color, null, getUID()];
    let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 10, w: 140, height: 100, bg: bg, position: 'relative' }, g.id);
    d1.setAttribute('gamename', gname);
    d1.onclick = onclickGameMenuItem;
    mCenterFlex(d1);
    let o = M.superdi[g.logo];
    let el = mDom(d1, { matop: 0, mabottom: 6, fz: 65, hline: 65, family: 'emoNoto', fg: 'white', display: 'inline-block' }, { html: o.text });
    mLinebreak(d1);
    mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
  }
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
function showim1(key, d, styles = {}, opts = {}) {
  let src = M.superdi[key].img;
  let img = mDom(d, styles, { tag: 'img', src });
  return img;
}
function showImage(key, dParent, styles = {}, useSymbol = false) {
  let o = M.superdi[key];
  if (nundef(o)) { console.log('showImage:key not found', key); return; }
  let [w, h] = [valf(styles.w, styles.sz), valf(styles.h, styles.sz)];
  if (nundef(w)) {
    mClear(dParent);
    [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
  } else {
    addKeys({ w: w, h: h }, styles)
    dParent = mDom(dParent, styles);
  }
  let [sz, fz, fg] = [.9 * w, .8 * h, valf(styles.fg, rColor())];
  let hline = valf(styles.hline * fz, fz);
  let d1 = mDiv(dParent, { position: 'relative', h: fz, overflow: 'hidden' });
  mCenterCenterFlex(d1)
  let el = null;
  if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
  assertion(el, 'PROBLEM mit' + key);
  mStyle(el, { cursor: 'pointer' })
  return d1;
}
function showImageBatch(coll, inc = 0, alertEmpty = false) {
  let [keys, index, numCells] = [coll.keys, coll.index, coll.rows * coll.cols];
  if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!');
  if (keys.length <= numCells) inc = 0;
  let newPageIndex = coll.pageIndex + inc;
  let numItems = keys.length;
  let maxPage = Math.max(1, Math.ceil(numItems / numCells)); 
  if (newPageIndex > maxPage) newPageIndex = 1;
  if (newPageIndex < 1) newPageIndex = maxPage;
  index = numCells * (newPageIndex - 1); 
  let list = arrTakeFromTo(keys, index, index + numCells);
  coll.index = index; coll.pageIndex = newPageIndex;
  for (let i = 0; i < list.length; i++) {
    let d = coll.cells[i];
    mStyle(d, { opacity: 1 });
    mClass(d, 'magnifiable')
    let d1 = showImageInBatch(list[i], d);
    d1.setAttribute('collname', coll.name);
    let selkey = collGenSelkey(list[i], coll.name);
    if (isList(UI.selectedImages) && UI.selectedImages.includes(selkey)) collSelect(d1);
  }
  for (let i = list.length; i < numCells; i++) {
    mStyle(coll.cells[i], { opacity: 0 })
  }
  coll.dPageIndex.innerHTML = `page ${coll.pageIndex}/${maxPage}`;
  let [dNext, dPrev] = [mBy('bNext'), mBy('bPrev')];
  if (maxPage == 1) { mClass(dPrev, 'disabled'); mClass(dNext, 'disabled'); }
  else { mClassRemove(dPrev, 'disabled'); mClassRemove(dNext, 'disabled'); }
}
function showImageInBatch(key, dParent, styles = {}) {
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
function showMessage(msg, ms = 3000) {
  let d = mBy('dMessage');
  mStyle(d, { h: 21, bg: 'red', fg: 'yellow' }); //getThemeFg()});
  d.innerHTML = msg;
  clearTimeout(TO.message);
  TO.message = setTimeout(() => mStyle('dMessage', { h: 0 }), ms)
}
function showNavbar() {
  let nav = mMenu('dNav');
  let commands = {};
  commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, clearMain);
  commands.colors = menuCommand(nav.l, 'nav', 'colors', null, showColors, clearMain);
  commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, collClear);
  commands.play = menuCommand(nav.l, 'nav', 'play', 'Tables', onclickPlay, clearMain);
  commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, clearMain);
  nav.commands = commands;
  return nav;
}
async function showTable(table) {
  INTERRUPT(); 
  DA.counter += 1; let me = getUname();
  if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); } 
  if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
  else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }
  Clientdata.table = table; DA.tsTable=DA.merged;
  clearEvents();
  showTitle(`${table.friendly}`);
  let func = DA.funcs[table.game];
  T = {};
  let items = T.items = await func.present('dMain',table);
  mRise('dMain');
  let playmode = getPlaymode(table,me);
  if (TESTING) testUpdateTestButtons();
  if (table.status == 'over') return showGameover(table);
  if (!table.fen.turn.includes(me)) return;
  if (playmode == 'bot') return await func.botMove(table, items, me);
  else return await func.activate(table, items);
}
async function showTables(from) {
  Clientdata.table = null;
  if (TESTING) testUpdateTestButtons();
  let me = getUname();
  let tables = Serverdata.tables = await mGetRoute('tables');
  tables.map(x => x.prior = x.status == 'open' ? 0 : x.turn.includes(me) ? 1 : x.playerNames.includes(me) ? 2 : 3);
  sortBy(tables, 'prior');
  let dParent = mBy('dTableList');
  if (isdef(dParent)) { mClear(dParent); }
  else dParent = mDom('dMain', {}, { className: 'section', id: 'dTableList' });
  if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
  tables.map(x => x.game_friendly = capitalize(Serverdata.config.games[x.game].friendly));
  mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
  let t = UI.tables = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'playerNames'], 'tables', false);
  mTableCommandify(t.rowitems.filter(ri => ri.o.status != 'open'), {
    0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
  });
  mTableStylify(t.rowitems.filter(ri => ri.o.status == 'open'), { 0: { fg: 'blue' }, });
  let d = iDiv(t);
  for (const ri of t.rowitems) {
    let r = iDiv(ri);
    let id = ri.o.id; 
    if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: get_waiting_html(24) }); //'my turn!'});
    if (ri.o.status == 'open') {
      let playerNames = ri.o.playerNames;
      if (playerNames.includes(me)) {
        if (ri.o.owner != me) {
          let h1 = hFunc('leave', 'onclickLeaveTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
        }
      } else {
        let h1 = hFunc('join', 'onclickJoinTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
      }
    }
    if (ri.o.owner != me) continue;
    let h = hFunc('delete', 'onclickDeleteTable', id); let c = mAppend(r, mCreate('td')); c.innerHTML = h;
    if (ri.o.status == 'open') { let h1 = hFunc('start', 'onclickStartTable', id); let c1 = mAppend(r, mCreate('td')); c1.innerHTML = h1; }
  }
}
function showTitle(title) {
  mClear('dTitle');
  return mDom('dTitle', { maleft: 20 }, { tag: 'h1', html: title, classes: 'title' });
}
function showTrick() {
  let dZone = Zones.table.dData;
  let d = mDiv(dZone);
  mStyleX(d, { display: 'flex', position: 'relative' });
  let zIndex = 1;
  for (let i = 0; i < T.trick.length; i++) {
    let c = T.trick[i];
    let direction = i == 0 ? { x: 0, y: -1 } : { x: 0, y: 1 };
    let displ = 10;
    let offset = { x: -35 + direction.x * displ, y: direction.y * displ };
    let d1 = c.div;
    mAppend(d, d1);
    mStyleX(d1, { position: 'absolute', left: offset.x, top: offset.y, z: zIndex });
    zIndex += 1;
  }
}
function showUser() {
  mClear(dUser);
  mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })
  let d;
  d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: getUname(), className: 'activeLink' });
  setColors(U.color)
  d.onclick = onclickUser;
}
function showUserImage(uname, d, sz = 40) {
  let u = Serverdata.users[uname];
  return showim1(u.key, d, { 'object-position': 'center top', 'object-fit': 'cover', h: sz, w: sz, round: true, border: `${u.color} 2px solid` });
}
function shuffle(arr) { if (isEmpty(arr)) return []; else return fisherYates(arr); }
function simpleCompare(o1, o2) {
  let s1 = object2string(o1);
  let s2 = object2string(o2);
  return s1 == s2;
}
async function simpleUpload(route, o) {
  let server = getServerurl();
  server += `/${route}`;
  const response = await fetch(server, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify(o)
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return 'ERROR 1';
  }
}
function size2hex(w = 100, h = 0, x = 0, y = 0) {
  let hexPoints = [{ X: 0.5, Y: 0 }, { X: 1, Y: 0.25 }, { X: 1, Y: 0.75 }, { X: 0.5, Y: 1 }, { X: 0, Y: 0.75 }, { X: 0, Y: 0.25 }];
  if (h == 0) {
    h = (2 * w) / 1.73;
  }
  return polyPointsFrom(w, h, x, y, hexPoints);
}
function sleep() { return new Promise(r => setTimeout(r, m)) }
function sockInit() {
  let server = getServerurl();
  Socket = io(server);
  Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
  Socket.on('event', onsockEvent);
  Socket.on('message', showChatMessage);
  Socket.on('merged', onsockMerged);
  Socket.on('table', onsockTable);
  Socket.on('tables', onsockTables);
  Socket.on('superdi', onsockSuperdi);
}
function sockPostUserChange(oldname, newname) {
  Socket.emit('userChange', { oldname, newname });
}
function sort_cards(hand, bySuit = true, suits = 'CDHS', byRank = true, rankstr = '23456789TJQKA') {
  if (bySuit && byRank) {
    let buckets = arrBuckets(hand, x => x[1], suits);
    for (const b of buckets) { sort_cards(b.list, false, null, true, rankstr); }
    hand.length = 0; buckets.map(x => x.list.map(y => hand.push(y)));
  } else if (bySuit) hand.sort((a, b) => suits.indexOf(a[1]) - suits.indexOf(b[1]));
  else if (byRank) hand.sort((a, b) => rankstr.indexOf(a[0]) - rankstr.indexOf(b[0]));
  return hand;
}
function sortBy(arr, key) { arr.sort((a, b) => (a[key] < b[key] ? -1 : 1)); return arr; }
function sortByDescending(arr, key) { arr.sort((a, b) => (a[key] > b[key] ? -1 : 1)); return arr; }
function sortByFunc(arr, func) { arr.sort((a, b) => (func(a) < func(b) ? -1 : 1)); return arr; }
function sortByMultipleProperties(list) {
  let props = Array.from(arguments).slice(1);
  return list.sort((a, b) => {
    for (const p of props) {
      if (a[p] < b[p]) return -1;
      if (a[p] > b[p]) return 1;
    }
    return 0;
  });
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
function sortCaseInsensitive(list) {
  list.sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()); });
  return list;
}
function sortCheckboxes(grid) {
  let divs = arrChildren(grid);
  divs.map(x => x.remove());
  let chyes = divs.filter(x => x.firstChild.checked == true);
  let chno = divs.filter(x => !chyes.includes(x));
  chyes = sortByFunc(chyes, x => x.firstChild.name);
  chno = sortByFunc(chno, x => x.firstChild.name);
  for (const d of chyes) { mAppend(grid, d) }
  for (const d of chno) { mAppend(grid, d) }
}
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
function squareTo(tool, sznew = 128) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
  if (sznew == 0) sznew = h;
  let sz = Math.max(w, h)
  let [x1, y1] = [x - (sz - w) / 2, y - (sz - h) / 2];
  redrawImage(img, dParent, x1, y1, sz, sz, sznew, sznew, () => tool.setRect(0, 0, sznew, sznew))
}
function stage3_prepContainer(area) { let container = mDiv(area); mPosRel(container); return container; }
function start_game() {
  let gamename = DA.gamename;
  let options = collect_game_specific_options(gamename);
  let players = DA.playerlist ? DA.playerlist.map(x => ({ name: x.uname, playmode: x.playmode, strategy: valf(x.strategy, options.strategy, 'random') })) : create_random_players(options.nplayers);
  _start_game(gamename, players, options); hide('dMenu');
}
function start_polling(data, type, onsuccess, ms = 5000, func) {
  delete DA.poll; allow_polling();
  DA.poll = {
    data: data,
    type: type,
    onsuccess: onsuccess,
    ms: ms,
    func: func
  };
  poll();
}
function start_with_assets() {
  DA.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1; if (DA.isFirefox) console.log('using Firefox!')
  show_home_logo();
  if (nundef(U)) { show_users(); return; }
  show_username();
  if (DA.TEST0) show('dTestButtons');
}
function startgame(game, players, options = {}) {
  if (nundef(game)) game = 'a_game';
  let default_options = {}; for (const k in Config.games[game].options) default_options[k] = arrLast(Config.games[game].options[k].split(','));
  addKeys(default_options, options);
  if (nundef(players)) players = rChoose(Serverdata.users, 2).map(x => ({ name: x.name }));
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
  ensure_polling();
  phpPost(o, 'startgame');
}
async function startGame(gamename, players, options) {
  let table = createOpenTable(gamename, players, options);
  table = setTableToStarted(table); 
  let res = await mPostRoute('postTable', table);
}
function startLevel() {
  Speech.setLanguage(Settings.language);
  getGameValues(Username, G.id, G.level);
  G.instance.startLevel();
  if (G.keys.length < G.numPics) { updateKeySettings(G.numPics + 5); }
  startRound();
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
  }
  panStart(ev);
}
function startRound() {
  if (G.addonActive != true && isTimeForAddon()) {
    G.addonActive = true;
    exitToAddon(startRound); return;
  } else G.addonActive = false;
  resetRound();
  uiActivated = false;
  G.instance.startRound();
  TOMain = setTimeout(() => prompt(), 300);
}
function startsWith(s, sSub) {
  return s.substring(0, sSub.length) == sSub;
}
function startTime(elem) {
  if (nundef(Settings.showTime) || !Settings.showTime) return;
  if (nundef(TimestampStarted)) { TimestampStarted = msNow(); TimeElapsed = 0; }
  if (nundef(elem) && isdef(TimeElem)) { elem = TimeElem; }
  else { if (isString(elem)) elem = mBy(elem); TimeElem = elem; }
  var timeLeft = TimeLeft = Settings.minutesPerUnit * 60000 - getTimeElapsed();
  if (timeLeft > 0) {
    let t = msToTime(timeLeft);
    let s = format2Digits(t.h) + ":" + format2Digits(t.m) + ":" + format2Digits(t.s);
    elem.innerHTML = s;
    setTimeout(() => startTime(elem), 500);
  } else {
    elem.innerHTML = '00:00:00';
    if (OnTimeOver) OnTimeOver();
  }
}
function staticArea(areaName, oSpec) {
  func = correctFuncName(oSpec.type);
  oSpec.ui = window[func](areaName, oSpec);
}
function staticTitle() {
  clearInterval(TO.titleInterval);
  let url = window.location.href;
  let loc = url.includes('telecave') ? 'telecave' : 'local';
  let game = isdef(Z) ? stringAfter(Z.friendly, 'of ') : '♠ GAMES ♠';
  document.title = `(${loc}) ${game}`;
}
function status_message(msg, styles = {}) {
  let d = mBy('dMessage'); show(d); clearElement(d);
  let def_styles = { padding: 20, align: 'center', position: 'absolute', fg: 'contrast', fz: 24, w: '100vw' };
  copyKeys(styles, def_styles);
  let dContent = mDiv(d, def_styles, null, msg);
  return dContent;
}
function status_message_new(msg, dParent, styles = {}) { }
function status_message_off() {
  let d = mBy('dMessage');
  clearElement(d);
  hide(d);
  onclick = null;
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
function stop_game() { console.log('stopgame'); }
function stop_simple_timer() { if (isdef(DA.timer)) { DA.timer.clear(); DA.timer = null; } }
function stop_timer() {
  if (isdef(DA.timer)) {
    let res = DA.timer.clear();
    DA.timer = null;
    return isNumber(res) ? res : 0;
  }
  return 0;
}
function stopAutobot() {
  if (isdef(TO.SLEEPTIMEOUT)) clearTimeout(TO.SLEEPTIMEOUT);
  DA.stopAutobot = true;
}
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
function stringCount(s, sSub, caseInsensitive = true) {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    if (s.slice(i).startsWith(sSub)) n++;
  }
  return n;
  let m = new RegExp(sSub, 'g' + (caseInsensitive ? 'i' : ''));
  let s1 = s.match(m);
  return s1 ? s1.length : 0;
}
function switch_uname(plname) {
  set_user(plname);
  show_username();
}
async function switchToMainMenu(name){return await switchToMenu(UI.nav,name);}
async function switchToMenu(menu, key) {
  menuCloseCurrent(menu);
  Clientdata.curMenu = key; 
  await menuOpen(menu, key);
}
async function switchToOtherUser() {
  let uname = await mGetRoute('otherUser',arguments);
  console.log('uname',uname)
  await switchToUser(uname);
}
async function switchToTables(){return await switchToMainMenu('play');}
async function switchToUser(uname) {
  if (!isEmpty(uname)) uname = normalizeString(uname);
  if (isEmpty(uname)) uname = 'guest';
  sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
  U = await getUser(uname);
  Clientdata.curUser = uname;
  localStorage.setItem('username', uname);
  iDiv(UI.user).innerHTML = uname;
  setColors(U.color);
  if (uname == 'guest') { 
    await switchToMenu(UI.nav, 'home'); 
    menuDisable(UI.nav, 'plan'); 
  }  else {
    menuEnable(UI.nav, 'plan');
    let t = Clientdata.table;
    let cur = Clientdata.curMenu; 
    if (cur == 'play' && isdef(t) && t.playerNames.includes(uname) && t.status == 'started') await showTable(t.id);
    else await switchToMenu(UI.nav, valf(cur, 'home'));
  }
}
function sync_users(php_users) {
  let result = [];
  let changed = false;
  for (const udata of php_users) {
    if (nundef(udata.id)) return php_users;
    let name = udata.username;
    let u = DB.users[name];
    if (nundef(u)) {
      changed = true;
      let db_user = { name: name, color: randomColor(), motto: random_motto(), image: startsWith(udata.image, name), games: {}, tables: {}, };
      add_new_user(db_user, false);
      result.push(db_user);
    } else result.push(u)
  }
  if (changed) db_save();
  if (!is_online()) return result;
  let di = {}; php_users.map(x => di[x.username] = x);
  let not_in_sql_db = [];
  for (const name in DB.users) {
    let u = DB.users[name];
    if (nundef(di[name]) && name != Session.cur_user) { not_in_sql_db.push(name); addIf(result, u); }
  }
  if (!isEmpty(not_in_sql_db)) add_users_to_sql_db(not_in_sql_db);
  return result;
}
function tableLayoutMR(dParent, m = 7, r = 1) {
  let ui = UI; ui.players = {};
  clearElement(dParent);
  let bg = 'transparent';
  let [dMiddle, dRechts] = [ui.dMiddle, ui.dRechts] = mColFlex(dParent, [m, r], [bg, bg]);
  mCenterFlex(dMiddle, false);
  let dOben = ui.dOben = mDiv(dMiddle, { w: '100%', display: 'block' }, 'dOben');
  let dSelections = ui.dSelections = mDiv(dOben, {}, 'dSelections');
  for (let i = 0; i <= 5; i++) { ui[`dSelections${i}`] = mDiv(dSelections, {}, `dSelections${i}`); }
  let dActions = ui.dActions = mDiv(dOben, { w: '100%' });
  for (let i = 0; i <= 5; i++) { ui[`dActions${i}`] = mDiv(dActions, { w: '100%' }, `dActions${i}`); }
  ui.dError = mDiv(dOben, { w: '100%', bg: 'red', fg: 'yellow', hpadding: 12, box: true }, 'dError');
  let dSubmitOrRestart = ui.dSubmitOrRestart = mDiv(dOben, { w: '100%' });
  let dOpenTable = ui.dOpenTable = mDiv(dMiddle, { w: '100%', padding: 10 }); mFlexWrap(dOpenTable);
  return [dOben, dOpenTable, dMiddle, dRechts];
}
function tabtitleUpdate() {
}
function take_turn(write_fen = true, write_player = false, clear_players = false, player_status = null) {
  prep_move();
  let o = { uname: Z.uplayer, friendly: Z.friendly };
  if (isdef(Z.fen)) o.fen = Z.fen;
  if (write_fen) { assertion(isdef(Z.fen) && isdef(Z.fen.turn), 'write_fen without fen!!!!'); o.write_fen = true; }
  if (write_player) { o.write_player = true; o.state = Z.state; }
  if (clear_players) o.clear_players = true;
  o.player_status = player_status;
  let cmd = 'table';
  send_or_sim(o, cmd);
}
function take_turn_fen() { take_turn(); }
function takeFromTo(ad, from, to) {
  if (isDict(ad)) {
    let keys = Object.keys(ad);
    return keys.slice(from, to).map(x => (ad[x]));
  } else return ad.slice(from, to);
}
function test1(map) {
  var baseballIcon = L.icon({
    iconUrl: '../leaf94/baseball-marker.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -28]
  });
  function onEachFeature(feature, layer) {
    var popupContent = '<p>I started out as a GeoJSON ' +
      feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
    if (feature.properties && feature.properties.popupContent) {
      popupContent += feature.properties.popupContent;
    }
    layer.bindPopup(popupContent);
  }
  var bicycleRentalLayer = L.geoJSON([bicycleRental, campus], {
    style: function (feature) {
      return feature.properties && feature.properties.style;
    },
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 8,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }
  }).addTo(map);
  var freeBusLayer = L.geoJSON(freeBus, {
    filter: function (feature, layer) {
      if (feature.properties) {
        return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
      }
      return false;
    },
    onEachFeature: onEachFeature
  }).addTo(map);
  var coorsLayer = L.geoJSON(coorsField, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: baseballIcon });
    },
    onEachFeature: onEachFeature
  }).addTo(map);
}
function testHelpers() {
  if (activatedTests.includes('helpers')) {
    console.log(...arguments);
  }
}
async function testOnclickBot(ev) {
  for (const b of [UI.bTestBot, UI.bTestHuman, UI.bTestHybrid]) {
    if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
  }
  mStyle(UI.bTestBot, { bg: 'red', fg: 'white' });
  await onclickBot();
}
async function testOnclickCaption(ev) {
  let x = ev.target.innerHTML; 
  let b = UI[getButtonCaptionName(name)];
  for (const name of getButtonCaptionNames(Clientdata.table)){
    let b=UI[getButtonCaptionName(name)];
    if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
  }
  mStyle(UI[getButtonCaptionName(x)], { bg: 'red', fg: 'white' });
  await switchToUser(x);
}
async function testOnclickDeck0() {
  let tnew = jsCopy(Clientdata.table);
  tnew.fen.deck = [];
  let res = await sendMergeTable({name:getUname(),id:tnew.id,table:tnew});
  console.log('res', res.fen.deck)
}
async function testOnclickHuman(ev) {
  for (const b of [UI.bTestBot, UI.bTestHuman, UI.bTestHybrid]) {
    if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
  }
  mStyle(UI.bTestHuman, { bg: 'red', fg: 'white' });
  await onclickHuman();
}
async function testOnclickHybrid(ev) {
  for (const b of [UI.bTestBot, UI.bTestHuman, UI.bTestHybrid]) {
    if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
  }
  mStyle(UI.bTestHybrid, { bg: 'red', fg: 'white' });
  await onclickHybrid();
}
async function testOnclickPlaymode(ev) {
  let b=UI.bPlaymode;
  let caption = b.innerHTML;
  if (caption.includes('human')) await onclickHuman(); 
  else await onclickBot(); 
}
function testUpdateTestButtons() {
  let table = Clientdata.table;
  let id = 'dTestButtons'; mRemoveIfExists(id); let dExtra = mDom('dExtra', { display: 'flex', gap: 10 }, { id });
  let me = getUname();
  let names = isdef(table)? []:['amanda', 'felix', 'lauren', 'mimi', 'gul'];
  for (const name of names) {
    let idname = getButtonCaptionName(name);
    let b = UI[idname] = mButton(name, testOnclickCaption, dExtra);
    if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
  }
  if (nundef(table)) return;
  let playmode = getPlaymode(table, me); 
  if (nundef(playmode)) return;
  mDom(dExtra,{},{html:`I'm a ${playmode}`});
  let caption = `Make me ${playmode == 'bot'?'human':'bot'}`;
  UI.bPlaymode = mButton(caption, testOnclickPlaymode, dExtra); 
}
function testUpdateTestButtons_() {
  let table = Clientdata.table;
  let id = 'dTestButtons'; mRemoveIfExists(id); let dExtra = mDom('dExtra', { display: 'flex', gap: 10 }, { id });
  let me = getUname();
  let names = getButtonCaptionNames(table);
  for (const name of names) {
    let idname = getButtonCaptionName(name);
    let b = UI[idname] = mButton(name, testOnclickCaption, dExtra);
    if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
  }
  if (nundef(table)) return;
  let playmode = getPlaymode(table, me); 
  if (nundef(playmode)) return;
  UI.bTestBot = mButton('bot', testOnclickBot, dExtra);
  UI.bTestHuman = mButton('human', testOnclickHuman, dExtra);
  if (playmode == 'bot') mStyle(UI.bTestBot, { bg: 'red', fg: 'white' });
  else if (playmode == 'human') mStyle(UI.bTestHuman, { bg: 'red', fg: 'white' });
}
function timeConversion(duration, format = 'Hmsh') {
  const portions = [];
  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (format.includes('H')) portions.push((hours < 10 ? '0' : '') + hours);
  duration = duration - (hours * msInHour);
  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (format.includes('m')) portions.push((minutes < 10 ? '0' : '') + minutes);
  duration = duration - (minutes * msInMinute);
  const msInSecond = 1000;
  const seconds = Math.trunc(duration / 1000);
  if (format.includes('s')) portions.push((seconds < 10 ? '0' : '') + seconds);
  duration = duration - (seconds * msInSecond);
  const hundreds = duration / 10;
  if (format.includes('h')) portions.push((hundreds < 10 ? '0' : '') + hundreds);
  return portions.join(':');
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
function to_server(req, type, to_php = true) {
  where(type);
  if (!to_php) {
    server_offline(req, type);
  } else if (is_online()) {
    server_online(req, type);
  } else {
    if (type == 'chat') { alert('no internet!'); mClassReplace(mBy("label_chat"), 'enabled', 'disabled'); }
    server_offline(req, type);
  }
}
function to_words(x) {
  let list = x.split('\n');
  let di = {};
  list.map(x => di[x.toLowerCase()] = x);
  return di;
}
function toElem(d) { return isString(d) ? mBy(d) : d; }
function toggle_select(item, funcs) {
  let params = [...arguments];
  let ifunc = (valf(item.ifunc, 0) + 1) % funcs.length; let f = funcs[ifunc]; f(item, ...params.slice(2));
}
function toggleItemSelection(item, selectedItems) {
  let ui = iDiv(item);
  item.isSelected = nundef(item.isSelected) ? true : !item.isSelected;
  if (item.isSelected) mClass(ui, 'framedPicture'); else mRemoveClass(ui, 'framedPicture');
  if (isdef(selectedItems)) {
    if (item.isSelected) {
      console.assert(!selectedItems.includes(item), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
      selectedItems.push(item);
    } else {
      console.assert(selectedItems.includes(item), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
      removeInPlace(selectedItems, item);
    }
  }
}
function toggleSelectionOfPicture(elem, selkey, selectedPics, className = 'framedPicture') {
  if (selectedPics.includes(selkey)) {
    removeInPlace(selectedPics, selkey); collUnselect(elem);
  } else {
    selectedPics.push(selkey); collSelect(elem);
  }
}
function toLetters(s) { return [...s]; }
function too_many_string_items(A) { return A.items.filter(x => nundef(x.o)).length >= 8; }
function toWords(s, allow_ = false) {
  let arr = allow_ ? s.split(/[\W]+/) : s.split(/[\W|_]+/);
  return arr.filter(x => !isEmpty(x));
}
function trim(str) {
  return str.replace(/^\s+|\s+$/gm, '');
}
function tryJSONParse(astext) {
  try {
    const data = JSON.parse(astext);
    return data;
  } catch {
    console.log('text', astext)
    return { message: 'ERROR', text: astext }
  }
}
function turtle() {
  background(51);
  stroke(255);
  translate(width / 2, height);
  for (let i = 0; i < sentence.length; i++) {
    let x = sentence.charAt(i);
    if ('ABF'.includes(x)) { line(0, 0, 0, -len); translate(0, -len); }
    else if (x == '+') rotate(angle);
    else if (x == '-') rotate(-angle);
    else if (x == '[') push();
    else if (x == ']') pop();
  }
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
function ui_game_menu_item(g, g_tables = []) {
  function runderkreis(color, id) {
    return `<div id=${id} style='width:20px;height:20px;border-radius:50%;background-color:${color};color:white;position:absolute;left:0px;top:0px;'>` + '' + "</div>";
  }
  let [sym, bg, color, id] = [Syms[g.logo], g.color, null, getUID()];
  if (!isEmpty(g_tables)) {
    let t = g_tables[0];
    let have_another_move = t.player_status == 'joined';
    color = have_another_move ? 'green' : 'red';
    id = `rk_${t.id}`;
  }
  return `
  <div onclick="onclick_game_menu_item(event)" gamename=${g.id} style='cursor:pointer;border-radius:10px;margin:10px;padding:5px;padding-top:15px;width:120px;height:90px;display:inline-block;background:${bg};position:relative;'>
  ${nundef(color) ? '' : runderkreis(color, id)}
  <span style='font-size:50px;font-family:${sym.family}'>${sym.text}</span><br>${g.friendly.toString()}</div>
  `;
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
function ui_make_container(dParent, styles = { bg: 'random', padding: 10 }) {
  let id = getUID('u');
  let d = mDiv(dParent, styles, id);
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
    let imgPath = `../base/assets/users/${uname}.jpg`;
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
function uid() {
  UID += 1;
  return 'a' + UID;
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
function uiGadgetTypeSelect(form, dict, styles = {}, opts = {}) {
  let select = DA.select = mDom(form, styles, { className: 'input', tag: 'select' });
  if (isList(dict)) dict = list2dict(dict);
  mDom(select, {}, { tag: 'option', html: '' });
  for (const k in dict) {
    let [content, val] = [k, dict[k]];
    mDom(select, {}, { tag: 'option', html: content, value: val });
  }
  mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
  select.addEventListener('change', () => form.submit());
  return () => { console.log('selected', DA.select, DA.select.value); return DA.select.value; }
}
function uiGadgetTypeText(form, content, styles = {}, opts = {}) {
  let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
  mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
  return () => inp.value;
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
async function uiTypeCalendar(dParent) {
  const [wcell, hcell, gap] = [120, 100, 10];
  let outerStyles = {
    rounding: 4, patop: 4, pabottom: 4, weight: 'bold', box: true,
    paleft: gap / 2, w: wcell, hmin: hcell,
    bg: 'black', fg: 'white', cursor: 'pointer'
  }
  let innerStyles = { box: true, padding: 0, align: 'center', bg: 'beige', rounding: 4 };//, w: '95%', hmin: `calc( 100% - 24px )` }; //cellWidth - 28 };
  innerStyles.w = wcell - 11.75;
  innerStyles.hmin = `calc( 100% - 23px )`;//hcell-32
  let fz = 12;
  let h = measureHeightOfTextStyle(dParent, { fz: fz }); console.log('h', h)
  let eventStyles = { fz: fz, hmin: h, w: '100%' };
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dParent = toElem(dParent);
  var container = mDiv(dParent, {}, 'dCalendar');
  var currentDate = new Date();
  var today = new Date();
  let dTitle = mDiv(container, { w: 760, padding: gap, fz: 26, family: 'sans-serif', display: 'flex', justify: 'space-between' }, { className: 'title' });
  var dWeekdays = mGrid(1, 7, container, { gap: gap });
  var dDays = [];
  var info = {};
  for (const w of weekdays) { mDiv(dWeekdays, { w: wcell }, null, w, 'subtitle') };
  var dGrid = mGrid(6, 7, container, { gap: gap });
  var dDate = mDiv(dTitle, { display: 'flex', gap: gap }, 'dDate', '', 'title');
  var dButtons = mDiv(dTitle, { display: 'flex', gap: gap });
  mButton('Prev',
    async () => {
      let m = currentDate.getMonth();
      let y = currentDate.getFullYear();
      if (m == 0) setDate(12, y - 1); else await setDate(m, y);
    },
    dButtons, { w: 70, margin: 0 }, 'input');
  mButton('Next',
    async () => {
      let m = currentDate.getMonth();
      let y = currentDate.getFullYear();
      if (m == 11) setDate(1, y + 1); else await setDate(m + 2, y);
    }, dButtons, { w: 70, margin: 0 }, 'input');
  var dMonth, dYear;
  function getDayDiv(dt) {
    if (dt.getMonth() != currentDate.getMonth() || dt.getFullYear() != currentDate.getFullYear()) return null;
    let i = dt.getDate() + info.dayOffset;
    if (i < 1 || i > info.numDays) return null;
    let ui = dDays[i];
    if (ui.style.opacity === 0) return null;
    return ui.children[0];
  }
  async function setDate(m, y) {
    currentDate.setMonth(m - 1);
    currentDate.setFullYear(y);
    mClear(dDate);
    dMonth = mDiv(dDate, {}, 'dMonth', `${currentDate.toLocaleDateString('en-us', { month: 'long' })}`);
    dYear = mDiv(dDate, {}, 'dYear', `${currentDate.getFullYear()}`);
    mClear(dGrid);
    dDays.length = 0;
    let c = colorHex(mGetStyle('dNav', 'bg')); //info.seedColor; //info.wheel[m-1];
    let dayColors = mimali(c, 43).map(x => colorHex(x))
    for (const i of range(42)) {
      let cell = mDiv(dGrid, outerStyles);
      mStyle(cell, { bg: dayColors[i], fg: 'contrast' })
      dDays[i] = cell;
    }
    populate(currentDate);
    await refreshEvents();
    return { container, date: currentDate, dDate, dGrid, dMonth, dYear, setDate, populate };
  }
  function populate() {
    let dt = currentDate;
    const day = info.day = dt.getDate();
    const month = info.month = dt.getMonth();
    const year = info.year = dt.getFullYear();
    const firstDayOfMonth = info.firstDay = new Date(year, month, 1);
    const daysInMonth = info.numDays = new Date(year, month + 1, 0).getDate();
    const dateString = info.dayString = firstDayOfMonth.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    info.dayOffset = paddingDays - 1;
    for (const i of range(42)) {
      if (i < paddingDays || i >= paddingDays + daysInMonth) { mStyle(dDays[i], { opacity: 0 }); }
    }
    for (let i = paddingDays + 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = dDays[i - 1];
      let date = new Date(year, month, i - paddingDays);
      daySquare.innerText = i - paddingDays + (isSameDate(date, today) ? ' TODAY' : '');
      let d = mDom(daySquare, innerStyles, { id: date.getTime() });
      daySquare.onclick = ev => { evNoBubble(ev); onclickDay(d, eventStyles); }
    }
  }
  async function refreshEvents() {
    let events = await getEvents();
    console.log('refreshing events', events)
    for (const k in events) {
      let o = events[k];
      let dt = new Date(Number(o.day));
      let dDay = getDayDiv(dt);
      if (!dDay) continue;
      uiTypeEvent(dDay, o, eventStyles);
    }
    mDummyFocus();
  }
  await setDate(currentDate.getMonth() + 1, currentDate.getFullYear());
  return { container, date: currentDate, dDate, dGrid, dMonth, dYear, info, getDayDiv, refreshEvents, setDate, populate }
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
function uiTypeEvent(dParent, o, styles = {}) {
  Items[o.id] = o;
  let id = o.id;
  let ui = mDom(dParent, styles, { id: id }); //, className:'no_events'}); //onclick:ev=>evNoBubble(ev) }); 
  mStyle(ui, { overflow: 'hidden', display: 'flex', gap: 2, padding: 2, 'align-items': 'center' }); //,'justify-items':'center'})
  let [wtotal, wbutton, h] = [mGetStyle(dParent, 'w'), 17, styles.hmin];
  let fz = 15;
  let stInput = { overflow: 'hidden', hline: fz * 4 / 5, fz: fz, h: h, border: 'solid 1px silver', box: true, margin: 0, padding: 0 };
  let inp = mDom(ui, stInput, { html: o.text, tag: 'input', className: 'no_outline', onclick: ev => { evNoBubble(ev) } }); //;selectText(ev.target);}});
  inp.value = getEventValue(o);
  inp.addEventListener('keyup', ev => { if (ev.key == 'Enter') { mDummyFocus(); onEventEdited(id, inp.value); } });
  fz = 14;
  let stButton = { overflow: 'hidden', hline: fz * 4 / 5, fz: fz, box: true, fg: 'silver', bg: 'white', family: 'pictoFa', display: 'flex' };
  let b = mDom(ui, stButton, { html: String.fromCharCode('0x' + M.superdi.pen_square.fa) });
  ui.onclick = ev => { evNoBubble(ev); onclickExistingEvent(ev); }
  mStyle(inp, { w: wtotal - wbutton });
  return { ui: ui, inp: inp, id: id };
}
function uiTypeExtraWorker(w) {
  let [res, n] = [stringBefore(w, ':'), Number(stringAfter(w, ':'))];
  let s = `worker (cost:${res} ${n})`
  let present = presentExtraWorker;
  let select = selectExtraWorker;
  return { itemtype: 'worker', a: s, key: `worker_${res}`, o: { res: res, n: n }, friendly: s, present, select }
}
function uiTypePlayerStats(fen, me, dParent, layout, styles = {}) {
  let dOuter = mDom(dParent); dOuter.setAttribute('inert',true); //console.log(dOuter)
  if (layout == 'rowflex') mStyle(dOuter,{display:'flex',justify:'center'});
  else if (layout == 'col') mStyle(dOuter,{display:'flex',dir:'column'});
  addKeys({ rounding: 10, bg: '#00000050', margin: 4, box: true, 'border-style': 'solid', 'border-width': 4 }, styles);
  let show_first = me;
  let order = arrCycle(fen.plorder, fen.plorder.indexOf(show_first));
  let items = {};
  for (const name of order) {
    let pl = fen.players[name];
    styles['border-color'] = name == me?colorLighter(pl.color):pl.color;
    let d = mDom(dOuter, styles, { id: name2id(name) })
    let img = showUserImage(name, d, 40);mStyle(img,{box:true})
    items[name] = { div: d, img, name };
  }
  return items;
}
function unionOfArrays() {
  let arrs = arguments[0]; 
  if (!arrs.every(Array.isArray)) arrs = Array.from(arguments);
  const flattenedArray = arrs.flat();
  return [...new Set(flattenedArray)];
}
function unpack_table(table) {
  for (const k of ['players', 'fen', 'options', 'scoring']) {
    let val = table[k];
    if (isdef(table[k])) table[k] = if_stringified(val); if (nundef(table[k])) table[k] = {};
  }
  if (isdef(table.modified)) { table.modified = Number(table.modified); table.timestamp = new Date(table.modified); table.stime = stringBeforeLast(table.timestamp.toString(), 'G').trim(); }
  assertion(isdef(window[table.game]), 'game function for ' + table.game + ' not defined in window');
  if (isdef(table.game)) { table.func = window[table.game](); }
  if (isdef(table.options.mode)) { table.mode = table.options.mode; }
  delete table.action; delete table.expected;
  return table;
}
function unselectPlayerItem(item) { mStyle(iDiv(item), { bg: 'transparent', fg: 'black', border: `transparent` }); }
function untie_card(card) {
  remove_from_selection(card);
  clear_selection();
  let oldgroupid = card.groupid;
  if (isdef(oldgroupid)) delete card.owner;
  let oldgroup = Items[oldgroupid];
  let oldindex = isdef(oldgroup) ? oldgroup.ids.indexOf(card.id) : null;
  if (isdef(oldgroup)) removeInPlace(oldgroup.ids, card.id);
  return [oldgroup, oldindex];
}
function update_cur_table(obj, color) {
  let t = Session.cur_table;
  let tnew = obj.table;
  if (isdef(obj.player_record)) copyKeys(obj.player_record, tnew);
  copyKeys(tnew, t);
  if (isdef(color)) {
    let d = mBy(`rk_${obj.table.id}`);
    if (isdef(d)) mStyle(d, { bg: color });
  }
}
function update_db_user_from_pl_options(fen, game) {
  let parts = fen.split(',');
  for (const p of parts) {
    let [name, startlevel, lang] = p.split(':');
    startlevel = Number(startlevel);
    set_startlevel(name, game, startlevel);
    set_preferred_lang(name, lang);
  }
}
function update_game_status(players) {
  let d = dTitle;
  clearElement(d);
  let d1 = mDiv(d, { display: 'flex', 'justify-content': 'center', 'align-items': 'space-evenly' });
  for (const plname in players) {
    let pl = players[plname];
    let d2 = mDiv(d1, { margin: 4, align: 'center' }, null, `<img src='${pl.imgPath}' style="display:block" class='img_person' width=50 height=50>${pl.score}`);
  }
}
function update_session(obj) {
  for (const k in obj) { if (isdef(Session[k])) copyKeys(obj[k], Session[k]); else Session[k] = obj[k]; }
  if (isdef(obj.table)) {
    Session.cur_table = Session.table;
    Session.cur_funcs = window[Session.cur_game]();
    if (!isEmpty(obj.playerdata)) make_players(Session.table.players);
    console.assert(isdef(Session.cur_user) && Session.cur_game == Session.table.game && Session.cur_tid == Session.table.id, "SESSION MISMATCH IN GAME_OPEN_FOR_MOVE!!!!!!!!!!!!!!!!!!!!!");
  }
  if (isdef(obj.playerdata)) {
    let o = Session.cur_players;
    for (const rec of obj.playerdata) {
      if (rec.state == 'null') rec.state = null;
      copyKeys(rec, o[rec.name]);
    }
  }
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
  Clientdata.this_turn = Z.turn;
  set_user(U.name);
  assertion(!isEmpty(Z.turn), 'turn empty!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', Z.turn);
  let fen = Z.fen;
  Z.role = !is_playing(Z.uname, fen) ? 'spectator' : fen.turn.includes(Z.uname) ? 'active' : 'inactive';
  let [uname, turn, mode, host] = [Z.uname, fen.turn, Z.mode, Z.host];
  let upl = Z.role == 'active' ? uname : turn[0];
  if (mode == 'hotseat' && turn.length > 1) { let next = get_next_human_player(Z.prev.uplayer); if (next) upl = next; }
  if (mode == 'multi' && Z.role == 'inactive' && (uname != host || is_human_player(upl))) { upl = uname; }
  set_player(upl, fen);
  let pl = Z.pl;
  Z.playmode = pl.playmode;
  Z.strategy = uname == pl.name ? valf(Clientdata.strategy, pl.strategy) : pl.strategy;
  let [uplayer, friendly, modified] = [Z.uplayer, Z.friendly, Z.modified];
  Z.uplayer_data = firstCond(Z.playerdata, x => x.name == Z.uplayer);
  let sametable = !FORCE_REDRAW && friendly == Z.prev.friendly && modified <= Z.prev.modified && uplayer == Z.prev.uplayer;
  let sameplayerdata = isEmpty(Z.playerdata_changed_for);
  let myplayerdatachanged = Z.playerdata_changed_for.includes(Z.uplayer);
  let specialcase = !i_am_host() && !i_am_acting_host() && !i_am_trigger() && !myplayerdatachanged;
  Z.skip_presentation = sametable && (sameplayerdata || specialcase);
  if (DA.TEST0 && (!sametable || !sameplayerdata)) {
    console.log('======>Z.skip_presentation', Z.skip_presentation, '\nplayerdata_changed_for', Z.playerdata_changed_for);
    console.log('_______ *** THE END *** ___________')
  }
  FORCE_REDRAW = false;
}
async function updateClientData() {
}
function updateKeySettings(nMin) {
  if (nundef(G)) return;
  G.keys = setKeys({ nMin, lang: Settings.language, keysets: KeySets, key: Settings.vocab });
}
async function uploadImg(img, unique, coll, name) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, unique + '.png');
      formData.append('collection', coll);
      formData.append('name', name);
      let server = getServerurl();
      server += '/upload';
      try {
        const response = await fetch(server, {
          method: 'POST',
          mode: 'cors',
          body: formData
        });
        if (response.ok) {
          const data = await response.json();
          resolve(data);
        } else {
          reject(response.statusText);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        reject(error);
      }
    });
  });
}
function userUpdate(proplist, val) {
  lookupSetOverride(U, proplist, val);
  saveUser();
}
function valf() {
  for (const arg of arguments) if (isdef(arg)) return arg;
  return null;
}
function valnwhite() {
  for (const arg of arguments) {
    if (nundef(arg) || isEmpty(arg) || isWhiteSpace(arg)) {
      continue;
    }
    return arg;
  }
  return null;
}
function whenSoundPaused() {
  _sndPlayer = null;
  _sndPlayerIdle = true;
  _loaded = false;
  if (!isEmpty(_qSound)) { _deqSound(); } else { _idleSound = true; }
}
function where(o) {
  let fname = getFunctionsNameThatCalledThisFunction();
}
function without(arr, elementToRemove) {
  return arr.filter(function (el) {
    return el !== elementToRemove;
  });
}
