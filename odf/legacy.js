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
