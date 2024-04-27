function button96() {
  function setup(table) {
    let fen = {};
    fen.players = {};
    for (const name in table.players) {
      let pl = fen.players[name] = table.players[name];
      pl.color = getUserColor(name)
      pl.score = 0;
    }
    fen.number = 0;
    fen.plorder = jsCopy(table.playerNames);
    fen.turn = jsCopy(table.playerNames);
    delete table.players;
    return fen;
  }
  function checkGameover(table) {
    let score_sum = calcScoreSum(table);
    console.log('___check score sum',score_sum);
    if (score_sum >= 5) {
      table.winners = getPlayersWithMaxScore(table.fen);
      table.status = 'over';
      return true;
    } else return false;
    //return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  async function checkValid(table) { return false; } //deprecated

  function present(dParent, table) {
    //assertion(calcScoreSum(table) == table.fen.number, "SCORE MISMATCH!!!! present")
    mClear(dParent);
    let dStats = mDom(dParent);
    let div = mDom(dParent, { margin: 12, align: 'center' }, { id: 'dGameDiv' })
    let bYes = mDom(div, { fz: 100, wmin: 200, className: 'button' }, { tag: 'button', html: `Step:${table.step}` });
    let bNo = mDom(div, { fz: 100, wmin: 200, className: 'button' }, { tag: 'button', html: `Error!` });

    //setStats(table, dOben, 'rowflex', false);
    let layout = 'rowflex';
    let [fen, me] = [table.fen, getUname()];
    let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
    let player_stat_items = uiTypePlayerStats(fen, me, dStats, layout, style)
    for (const plname in fen.players) {
      let pl = fen.players[plname];
      let item = player_stat_items[plname];
      if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
      let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
      playerStatCount('star', pl.score, d);
    }

    return { div, bYes, bNo };
  }
  async function activate(table, T, me) {
    T.bYes.onclick = () => button96OnclickYes(table, T, me, true);
    T.bNo.onclick = () => button96OnclickNo(table, T, me, true);
  }
  async function botMove(table, T, name) {
    TO.button = setTimeout(() => button96OnclickBot(table, T, name), rChoose([1000, 2000, 3000]));
  }
  return { setup, activate, checkGameover, checkValid, present, botMove };
}
async function button96OnclickYes(table, T, name, direct = false) {
  let b = T.bYes;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceStepScore(table, name);
}
async function button96OnclickNo(table, T, name, direct = false) {
  let b = T.bNo;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceError(table,name);
}
async function button96OnclickBot(table, T, name) {
  if (coin(80)) await button96OnclickYes(table, T, name); else await button96OnclickNo(table, T, name);
} 