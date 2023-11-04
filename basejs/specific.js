//#region videmo?
function run03(sp, defaults, sdata) {
  R = new RSG(sp, defaults, sdata);
  console.log('before gen10 habe', R.gens.G.length, R.getSpec());
  phase = 1013;
  R.gen10();
  R.gen11();
  R.gen12();
  R.gen13();
  phase = 14;
  R.gen14();
  phase = 21;
  R.gen21('table');
  presentRoot_dep(R.getSpec().ROOT, 'tree');
}
function run04(sp, defaults, sdata) {
  WR.G = R1 = new RSG(sp, defaults, sdata);
  genG('table', R1);
  setTimeout(() => binding01(WR.G), 500);
}
function run05(sp, defaults, sdata) {
  WR.inc = R = new RSG(sp, defaults, sdata);
  ensureRtree(R);
  generateUis('table', R);
  updateOutput(R);
}
function run06(sp, defaults, sdata) {
  WR.inc = T = R = new RSG(sp, defaults, sdata);
  ensureRtree(R);
  R.baseArea = 'table';
  createStaticUi(R.baseArea, R);
  updateOutput(R);
  addNewlyCreatedServerObjects(sdata, R);
  updateOutput(R);
  for (let i = 0; i < 5; i++) testAddObject(R);
  updateOutput(R);
  activateUis(R);
}
function run07() {
  let d = mDiv(mBy('table'));
  mSize(d, 400, 300);
  mColor(d, 'blue');
  let canvas = aSvgg(d);
  let svg = d.children[0];
  console.log('svg', svg);
  createfilter(svg, "-50%", "-50%", "200%", "200%", ["feGaussianBlur"], ["stdDeviation", "5"]);
  let g1 = agShape(canvas, 'circle', 50, 50, 'gold');
  let ci = g1.children[0];
  console.log(ci);
  addClass(d, 'blur')
}
function run08() {
  let d = mDiv(mBy('table'));
  mSize(d, 400, 300);
  mColor(d, 'blue');
  let canvas = aSvgg(d);
  let svg = d.children[0];
  let g1 = agShape(canvas, 'rect', 250, 250, 'gold');
  let text = agText(g1, 'hallo', 'black', '16px AlgerianRegular').elem;
  let ci = g1.children[0];
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id", "f1");
  var gaussianFilter = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
  gaussianFilter.setAttribute("stdDeviation", "2");
  filter.appendChild(gaussianFilter);
  defs.appendChild(filter);
  svg.appendChild(defs);
  text.setAttribute("filter", "url(#f1)");
}
function run09() {
  let paper = mDivG('table', 400, 300, 'blue');
  let svg = paper.parentNode;
  let u = `<use x="100" y="100" xlink:href="assets/svg/animals.svg#bird" />`;
  console.log(svg);
  return;
  let g = agShape(Canvas, 'rect', 250, 250, 'gold');
}
function runAllTests() {
  iTEST = 0;
  startTestLoop();
}
function runAllTestSeries() {
  iTEST = 0;
  iTESTSERIES = 1;
  startTestSeries();
}
function runBEHAVIOR(oid, pool, behList, VisList) {
  let res = {};
  for (const functionPair of behList) {
    let doFilterFunc = functionPair[0];
    let doFunc = functionPair[1];
    let o = pool[oid];
    if (nundef(o) || !doFilterFunc(oid, o)) {
      continue;
    }
    for (const functionPair of VisList) {
      let visFilterFunc = functionPair[0];
      let visFunc = functionPair[1];
      console.log(o);
      if (visFilterFunc(oid, o)) {
        let params = doFunc(oid, o);
        visFunc(oid, o, ...params);
        for (const par of params) {
          if (isDict(par) && 'id' in par) res[par.id] = par;
        }
      }
    }
  }
  return res;
}
function runBEHAVIOR_new(oid, pool, behaviors) {
  let res = {};
  for (const name in behaviors) {
    let o = pool[oid];
    let todo = behaviors[name](oid, o, G.serverData.phase);
    if (isdef(todo)) {
      let params = isdef(todo.vis) ? todo.vis.map(x => getVisual(x)) : [];
      for (const vis of params) clearElement(vis.elem);
      let res = todo.f(oid, o, ...params);
    }
  }
  return res;
}
function runBehaviors(oid, pool, behaviors) {
  let res = [];
  for (const name in behaviors) {
    let o = pool[oid];
    let todo = behaviors[name](oid, o, G.serverData.phase);
    if (isdef(todo)) {
      let visualsToBeUpdated = isdef(todo.vis) ? todo.vis.map(x => getVisual(x)) : [];
      let updated = FUNCS[todo.f](oid, o, ...visualsToBeUpdated);
      if (updated) res.push(oid);
    }
  }
  return res;
}
function runBindings(oid, pool) {
  for (const k in BINDINGS) {
  }
}
function runClientTest() {
  imageFileTests();
}
async function runNextSeries(listSeries, series, from, to) {
  let timeOUT = 500;
  if (isEmpty(listSeries)) {
    console.log('*** ALL TESTS COMPLETED! ***');
    hide('btnStop');
    isTraceOn = SHOW_TRACE;
    return;
  } else if (STOP) {
    STOP = false;
    isTraceOn = SHOW_TRACE;
    hide('btnStop');
    return;
  } else if (from >= to) {
    let series = testEngine.series;
    removeInPlace(listSeries, series);
    if (isEmpty(listSeries)) {
      console.log('*** ALL TESTS COMPLETED! ***');
      STOP = false;
      isTraceOn = SHOW_TRACE;
      hide('btnStop');
      return;
    }
    series = listSeries[0];
    let imax = await testEngine.loadSeries(series);
    setTimeout(async () => { await runNextSeries(listSeries, series, 0, imax); }, timeOUT * 2);
  } else {
    let series = listSeries[0];
    let index = from;
    await testEngine.loadTestCase(series, index);
    await rParse(RSG_SOURCE, { defs: testEngine.defs, spec: testEngine.spec, sdata: testEngine.sdata });
    setTimeout(async () => { await runNextSeries(listSeries, series, from + 1, to); }, timeOUT);
  }
}
function runTest() {
  editLayoutTests();
}
//#endregion