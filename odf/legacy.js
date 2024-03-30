function create_set_card(fen, dParent, card_styles) {
  let myinfo = info_from_fen(fen);
  let info = { shape: 'circle', color: BLUE, num: 1, shading: 'solid', background: 'white', text: 'none' };
  copyKeys(myinfo, info);
  let card = draw_set_card(dParent, info, card_styles);
  card.fen = fen;
  return card;
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
//legacy code! removed the ranks and suits stuff
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

	//sorting index by rank and suit
	// if (!isList(Z.fen.ranks)) Z.fen.ranks = calcNumRanks(get_keys(Z.fen.players).length * Z.fen.handsize, 2, Z.fen.colors.length);
	// //console.log('ranks',Z.fen.ranks);
	// let ranks = valf(lookup(Z, ['fen', 'ranks']), range(100)); //Z.fen.ranks;
	// info.irank = ranks.indexOf(r);
	// info.isuit = valf(lookup(Z, ['fen', 'colors']), get_nc_color_array()).indexOf(s); //range(100));'SHCD'.indexOf(s);
	// info.isort = info.isuit * ranks.length + info.irank;

	//card face
	//let card = cBlank(dTable, { h: sz, w:w, border: 'silver' });
	//let dcard = mDiv(dTable,{h:h,w:w,rounding:4,bg:'white',border:'silver'});
	//console.log('________w',w)

	let d = mDom(null, { h: h, w: w, rounding: 4, bg: 'white', border: 'silver' }, { className: 'card' });
	//console.log('ui',d)

	//let d = iDiv(ui, { margin: 10 });
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
	//mPlace(dbig, 'cc');

	// mSize(ui, info.w, info.h);
	let res = {};
	copyKeys(info, res);
	copyKeys({ w: info.w, h: info.h, faceUp: true, div: d }, res);
	if (isdef(ov)) res.ov = ov;

	return res;
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

//svg zeug
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
function gEllipse(w, h) { let r = gCreate('ellipse'); r.setAttribute('rx', w / 2); r.setAttribute('ry', h / 2); return r; }
function gFg(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gG() { return gCreate('g'); }
function gHex(w, h) { let pts = size2hex(w, h); return gPoly(pts); }
function gLine(x1, y1, x2, y2) { let r = gCreate('line'); r.setAttribute('x1', x1); r.setAttribute('y1', y1); r.setAttribute('x2', x2); r.setAttribute('y2', y2); return r; }
function gPoly(pts) { let r = gCreate('polygon'); if (pts) r.setAttribute('points', pts); return r; }
function gPos(g, x, y) { g.style.transform = `translate(${x}px, ${y}px)`; }
function gRect(w, h) { let r = gCreate('rect'); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('x', -w / 2); r.setAttribute('y', -h / 2); return r; }
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
