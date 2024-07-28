//#region tierspiel
async function test153_powerText(){
  await preprelims(); // await prelims(); return;
  let d = clearFlex(); //let deck = jsCopy(M.byCollection.tierspiel).map(x=>wsGenerateCardInfo(x));
  let key = 'bee';
  let fen = wsGenerateCardInfo(key);
  let item = wsItemFromFen(fen); console.log(item)
  // item.power = wsGetPower('lightblue');//'pink'); //'_draw_1_deck'; //_child_1_sym
  wsShowCardItem(item,d,1);
  //wsPowerText(item,item.dpower,{fz:item.fz})
}
async function test152_spiel() {
  await prelims();
  console.log(M.byCollection.tierspiel.length,'animals')
}

//#region tierspiel cards
async function test151_cardWiePresent() {
  await prelims(); 
  let d = clearFlex();
  let deck = jsCopy(M.byCollection.tierspiel).map(x=>wsGenerateCardInfo(x)); console.log(deck.length)
  for(const fen of arrTake(deck,100)){
    //console.log(fen)
    let item = wsItemFromFen(fen); //console.log('item',item)
    wsShowCardItem(item,d,1);
  }

}
async function test151_card() {
  await prelims(); //return;
  let d = clearFlex();
  let keys = jsCopy(M.byCollection.tierspiel);
  //let keys = ['arctic_fox'];
  
  for(const key of keys){
    let item = wsShowCard(key, d, 1); //console.log(item);
    let fen = wsFenFromItem(item); //console.log(fen);
    let item1 = wsFromCardInfo(fen, d, .5);
  }

}
async function test150_mist() {
  let d = clearFlex();

  //let x=50; //wsDrawWorm(d,{bg:'blue',w:x,h:x}); return;
  //let x=50; let d1=mDom(d,{bg:'silver',w:50,h:50}); wsPrintSymbol(d1,x,'omni'); return;

  let fa = 1.25;
  let [w, h, sz] = [100, 100, 10].map(x => x * fa);

  let grid = mGrid(10, 10, d, { w, h, bg: 'red' });
  let ohab = getOhab();

  for (const i of range(100)) {
    //showim2(ohab.imgs[i%3], grid, { w:sz,h:sz }); //, bg: c, 'clip-path': PolyClips.diamond })
    let key = rChoose(['cherries', 'fish', 'forest', 'grain', 'grassland', 'mouse', 'seedling', 'wetland', 'worm', 'omni']);
    wsPrintSymbol(grid, sz, key); //'omni'); 
  }
}
async function test146_card() {
  await prelims(); //return;
  let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); //arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);
  keys = ['arctic_fox'];// panther bear eagle arctic_fox wasp
  let items = [];
  let fa = .25; //1.25;
  for (const key of keys) {
    let o = getDetailedSuperdi(key);
    let [w, h, wtop, htop, hhab, hfood] = [170, 250, 60, 64, 20, 16].map(x => fa * x);
    let card = cBlank(d, { h, w, border: 'silver' });
    let [rounding] = [card.rounding];
    let dCard = iDiv(card);
    let dlt = mDom(dCard, { w: wtop, h: htop, bg: '#ccc' });
    let dParent = dlt;
    mPlace(dlt, 'tl');
    dlt.style.borderTopLeftRadius = dlt.style.borderBottomRightRadius = `${rounding}px`;
    //mCenterCenterFlex(dlt);

    let ohab = o.ohabitat; console.log(ohab.imgs);
    let colors = ohab.colors = [];
    let imgs = ohab.imgs = [];
    colors.push('lightblue'); imgs.push('../assets/games/wingspan/wetland.png');
    colors.push('goldenrod'); imgs.push('../assets/games/wingspan/grassland2.png');
    colors.push('emerald'); imgs.push('../assets/games/wingspan/forest1.png');
    for (let i = 0; i < ohab.imgs.length; i++) {
      let c = ohab.colors[i];
      if (c == 'gray') continue;
      if (i == 2) mLinebreak(dParent);
      let d = showim2(ohab.imgs[i], dParent, { h: hhab, bg: c, 'clip-path': PolyClips.diamond })
      if (i == 2) mStyle(d, { matop: -hhab / 2 });
    }


    // mLinebreak(dlt,0);

    let html = `<img width='${hfood}' height='${hfood}' src='../assets/img/emo/seedling.png' />`;
    let d1 = mDom(dParent, {}, { html })

    break;
    html = `
		<svg width="${hfood}" height="${hfood}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
				<g transform="matrix(1.6,0,0,1.6,-540,-540)">
						<g transform="matrix(8.59167,0,0,8.59167,432.85,422.626)">
								<g>
										<path d="M0,-5.356C-0.427,-5.356 -0.825,-5.247 -1.184,-5.07L-1.487,-6.86C-1.18,-7.11 -0.839,-7.331 -0.47,-7.508C0.341,-7.901 1.273,-8.154 2.148,-8.241L2.17,-8.243C2.227,-8.249 2.283,-8.262 2.338,-8.282C2.695,-8.415 2.877,-8.811 2.745,-9.168C2.612,-9.524 2.216,-9.706 1.859,-9.574C0.872,-9.208 -0.018,-8.809 -0.897,-8.288C-1.327,-8.022 -1.751,-7.73 -2.127,-7.365C-2.478,-7.028 -2.813,-6.676 -3.154,-6.309C-3.37,-6.078 -3.566,-5.826 -3.752,-5.566C-3.756,-5.566 -3.759,-5.568 -3.763,-5.568L-5.106,-5.582C-5.308,-6.864 -6.41,-7.847 -7.749,-7.847C-9.233,-7.847 -10.435,-6.645 -10.435,-5.162C-10.435,-3.679 -9.233,-2.476 -7.749,-2.476C-6.304,-2.476 -5.134,-3.62 -5.074,-5.051L-4.184,-4.886C-4.394,-4.515 -4.579,-4.131 -4.719,-3.739C-4.942,-3.129 -5.117,-2.511 -5.27,-1.883C-6.879,-1.753 -8.148,-0.421 -8.148,1.221C-8.148,2.949 -6.748,4.35 -5.019,4.35C-3.291,4.35 -1.89,2.949 -1.89,1.221C-1.89,-0.297 -2.973,-1.562 -4.408,-1.846C-4.278,-2.39 -4.122,-2.933 -3.938,-3.457C-3.647,-4.336 -3.233,-5.136 -2.609,-5.816C-2.452,-5.994 -2.279,-6.162 -2.1,-6.327L-1.724,-4.714C-2.307,-4.221 -2.686,-3.493 -2.686,-2.67C-2.686,-1.187 -1.483,0.016 0,0.016C1.484,0.016 2.686,-1.187 2.686,-2.67C2.686,-4.153 1.484,-5.356 0,-5.356" style="fill:rgb(152,21,49);fill-rule:nonzero;"/>
								</g>
						</g>
				</g>
		</svg>
    `;
    d1 = mDom(dParent, {}, { html })

    // html = generatePizzaSvg(hfood, 'red', 'yellow', 'blue', 'orange', 'green');
    // d1=mDom(dParent,{},{html});

    html = `
      <svg width="${hfood}" height="${hfood}" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
          <g transform="matrix(1.9,0,0,1.8,-655,-980)">
              <g transform="matrix(7.70232,0,0,7.70232,-3403,-873.691)">
                  <g>
                      <g>
                          <g transform="matrix(1,0,0,1,487.796,189.11)">
                              <path d="M0,-2.293C0.445,-1.498 1.102,-0.729 1.282,-0.522C1.462,-0.316 3.41,-0.035 4.113,0.01C3.948,-0.403 3.671,-0.749 3.079,-1.281C2.586,-1.724 2.109,-1.963 1.47,-2.084C1.11,-2.152 0.279,-2.303 0,-2.293" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                          <g transform="matrix(0.807192,0.590289,0.590289,-0.807192,489.51,186.325)">
                              <path d="M0.599,0.015C0.869,0.113 1.467,0.126 1.68,0.173C1.017,0.749 0.85,1.614 0.599,1.67C0.348,1.727 -0.747,1.767 -1.127,1.674C-1.066,1.536 -0.423,0.405 0.599,0.015" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                          <g transform="matrix(1,0,0,1,493.462,188.018)">
                              <path d="M0,-0.85C-0.107,-1.338 -1.235,-2.168 -1.841,-2.459C-1.935,-2.155 -2.079,-1.594 -2.053,-1.056C-2.024,-0.467 -1.76,0.211 -1.407,0.615C-1.055,1.019 -0.183,1.515 0.13,1.609C0.128,1.597 0.126,1.586 0.124,1.574C-0.042,0.499 0.107,-0.361 0,-0.85" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                          <g transform="matrix(1,0,0,1,493.524,194.883)">
                              <path d="M0,-2.513C-1.031,-2.522 -1.653,-2.448 -2.565,-2.524C-2.161,-1.814 -1.315,-0.599 -0.557,-0.253C0.201,0.094 1.4,-0.3 2.482,-0.291C2.697,-0.289 3.439,-0.2 3.657,-0.152C3.551,-0.509 3.087,-1.833 2.6,-2.147C1.889,-2.607 1.577,-2.5 0,-2.513" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                          <g transform="matrix(1,0,0,1,496.22,189.606)">
                              <path d="M0,-0.012C-0.375,-1.259 -1.609,-2.115 -2.317,-2.551C-2.342,-1.879 -2.343,-1.374 -2.21,-0.514C-2.049,0.535 -1.946,0.574 -1.451,1.053C-1.175,1.319 -0.283,2.43 0.145,2.539C0.145,2.539 0.144,0.467 0,-0.012" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                          <g transform="matrix(-0.506442,0.862274,0.862274,0.506442,497.305,197.132)">
                              <path d="M-1.454,-1.812C-0.793,-3.066 -0.232,-3.44 0.202,-4.508C0.816,-2.36 0.396,0.388 -1.454,1.136C-1.693,1.232 -0.925,0.982 -1.454,1.136C-1.409,0.584 -2.027,-0.726 -1.454,-1.812" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                          <g transform="matrix(1,0,0,1,496.942,193.86)">
                              <path d="M0,-2.164C-0.197,-0.955 0.514,0.481 0.88,0.901C1.246,1.32 1.926,2.192 2.218,2.336C3.808,0.963 1.265,-2.639 0.213,-3.845C0.017,-4.069 -0.193,-4.287 -0.415,-4.5C-0.415,-4.5 -0.002,-3.337 0,-2.164" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                          <g transform="matrix(0.658061,-0.752964,-0.752964,-0.658061,489.682,185.285)">
                              <path d="M-1.083,-0.492C-0.929,-0.19 -0.7,0.149 -0.362,0.372C-0.023,0.597 -1.083,2.385 -1.083,2.385C-1.083,2.385 -1.281,0.976 -1.678,0.238C-1.494,0.048 -1.282,-0.197 -1.083,-0.492" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                          <g transform="matrix(1,0,0,1,493.645,189.424)">
                              <path d="M0,2.503C0.135,2.509 1.42,2.539 1.55,2.55C1.235,2.005 0.612,1.245 0.031,0.771C-0.532,0.313 -1.45,0.27 -2.369,0.204C-2.97,0.161 -3.964,-0.039 -4.563,-0.047C-4.309,0.6 -3.575,1.878 -3.04,2.181C-2.504,2.485 -1.165,2.457 0,2.503" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                          <g transform="matrix(1,0,0,1,498.162,197.672)">
                              <path d="M0,-0.974C0.138,-0.91 0.295,-0.809 0.427,-0.701C0.564,-0.594 0.684,-0.467 0.803,-0.344C0.906,-0.218 0.995,-0.088 1.06,0.052C1.119,0.181 1.236,0.44 1.251,0.547L2.018,-0.089C1.867,-0.346 1.481,-0.74 1.316,-0.866C0.983,-1.134 0.56,-1.408 0.317,-1.521L0,-0.974Z" style="fill:rgb(195,116,45);fill-rule:nonzero;"/>
                          </g>
                      </g>
                  </g>
              </g>
          </g>
      </svg>
    `;
    d1 = mDom(dParent, {}, { html });


    break;


    let dOuter = mDom(dParent); mCenterFlex(dOuter);
    let tokens = rChoose([wsDrawCherries, wsDrawFish, wsDrawGrain, wsDrawMouse, wsDrawOmni, wsDrawSeedling, wsDrawWorm], 1)
    let last = arrLast(tokens);
    let ch = tokens.length == 2 && coin() ? '/' : '+';
    for (const t of tokens) {
      wsDrawFoodToken(dOuter, t, hfood);
      let d1 = mDom(dOuter, { h: hfood }); mCenterCenterFlex(d1);
      if (t == last) break;
      //mDom(d1,{fz:8},{html:'+'})

      // if (t != last) {
      // 	//let d1=mDom(dOuter,{h:sz});mCenterCenterFlex(d1);
      // 	mDom(dOuter, { fz,matop:sz/2 }, { html: ch })
      // }
    }

  }
}
async function test145_card() {
  await prelims(); //return;
  let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); //arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);
  keys = ['arctic_fox'];// panther bear eagle arctic_fox wasp
  let items = [];
  for (const key of keys) {
    //console.log('___', key);
    let o = getDetailedSuperdi(key);
    let ocard = showCardWingspanPortrait(o, d, 100);
    items.push(ocard);
    // showPlaetze(ocard.dPlaetze,rChoose([1,2,3]),'sienna')
    //break;
  }
  // let res = mCluster(items,x=>x.o.ohabitat.list,x=>`${x.key}: ${x.o.habitat}`);
}
async function test145_swSymbols() {
  let d = clearFlex({ bg: 'silver' });
  let sz = 25;
  wsDrawGrain(d, { w: sz, h: sz, bg: 'white' });
}
async function test144_worm() {
  let d = clearFlex();
  let sz = 50;
  let d1 = mDom(d, { w: sz, h: sz, bg: 'red' });
  let html = `
    <svg width="100" height="100" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(1,0,0,1,-344,-152)">
            <g transform="matrix(7.14802,0,0,7.14802,-2977.16,-1174.38)">
                <g id="ws-1">
                    <g id="worm">
                        <g transform="matrix(1,0,0,1,467.653,195.772)">
                            <path d="M0,-8.535C-0.018,-8.351 -0.038,-8.047 -0.036,-7.798C-0.033,-7.536 -0.021,-7.275 0.007,-7.021C0.06,-6.511 0.179,-6.031 0.35,-5.619C0.432,-5.41 0.538,-5.226 0.648,-5.059C0.75,-4.905 0.789,-4.895 0.869,-4.838C1.013,-4.757 1.318,-4.665 1.782,-4.653C2.239,-4.635 2.789,-4.679 3.406,-4.729C3.718,-4.754 4.049,-4.779 4.42,-4.788C4.792,-4.794 5.204,-4.792 5.732,-4.686C6.694,-4.473 7.445,-4.057 8.093,-3.608C8.416,-3.38 8.716,-3.139 8.999,-2.886C9.14,-2.758 9.278,-2.629 9.413,-2.493C9.556,-2.348 9.664,-2.238 9.84,-2.031L9.993,-1.85C10.704,-1.01 10.599,0.248 9.758,0.959C8.918,1.67 7.66,1.564 6.95,0.724C6.866,0.626 6.79,0.513 6.729,0.404C6.711,0.373 6.616,0.251 6.548,0.17C6.473,0.08 6.394,-0.009 6.313,-0.096C6.152,-0.269 5.983,-0.43 5.815,-0.575C5.479,-0.863 5.134,-1.063 4.895,-1.148C4.821,-1.18 4.615,-1.217 4.37,-1.231C4.125,-1.248 3.839,-1.252 3.535,-1.254C2.922,-1.259 2.237,-1.25 1.464,-1.348C0.709,-1.447 -0.233,-1.666 -1.075,-2.345C-1.479,-2.669 -1.84,-3.145 -2.029,-3.534C-2.22,-3.903 -2.374,-4.283 -2.48,-4.66C-2.701,-5.417 -2.79,-6.164 -2.792,-6.886C-2.795,-7.247 -2.774,-7.603 -2.74,-7.957C-2.701,-8.323 -2.657,-8.633 -2.563,-9.056C-2.408,-9.76 -1.711,-10.205 -1.007,-10.049C-0.355,-9.906 0.075,-9.297 0.011,-8.649L0,-8.535Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                        <g transform="matrix(-0.516885,-0.856055,-0.856055,0.516885,474.654,198.339)">
                            <path d="M-0.369,-0.653C-0.561,-0.652 -0.716,-0.461 -0.716,-0.223C-0.716,0.015 -0.561,0.208 -0.369,0.208C-0.177,0.208 -0.021,0.016 -0.021,-0.223C-0.021,-0.46 -0.177,-0.653 -0.369,-0.653" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                        <g transform="matrix(1,0,0,1,474.892,196.692)">
                            <path d="M0,1.752C0.014,1.561 0.041,1.419 0.072,1.26C0.114,1.108 0.14,0.954 0.209,0.811C0.272,0.66 0.356,0.52 0.439,0.401C0.515,0.27 0.593,0.149 0.661,0L1.046,0.377C0.917,0.433 0.806,0.524 0.705,0.613C0.614,0.715 0.525,0.806 0.489,0.922C0.451,1.042 0.417,1.168 0.427,1.297C0.431,1.42 0.458,1.564 0.518,1.653L0,1.752Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                        <g transform="matrix(0.516885,0.856055,0.856055,-0.516885,479.321,195.111)">
                            <path d="M0.369,-0.208C0.561,-0.208 0.716,-0.015 0.716,0.222C0.716,0.461 0.56,0.653 0.369,0.653C0.176,0.653 0.021,0.46 0.021,0.222C0.021,-0.016 0.177,-0.208 0.369,-0.208" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                        <g transform="matrix(1,0,0,1,479.355,194.874)">
                            <path d="M0,0.679C-0.051,0.585 -0.166,0.495 -0.273,0.434C-0.382,0.364 -0.51,0.336 -0.633,0.314C-0.753,0.293 -0.874,0.329 -1.008,0.362C-1.134,0.41 -1.266,0.465 -1.375,0.554L-1.53,0.038C-1.367,0.047 -1.223,0.034 -1.072,0.028C-0.927,0.01 -0.764,0 -0.602,0.015C-0.443,0.02 -0.295,0.069 -0.14,0.102C0.015,0.148 0.152,0.191 0.329,0.267L0,0.679Z" style="fill:rgb(0,95,82);fill-rule:nonzero;"/>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
    `;
  d1.innerHTML = html
}
async function test_swSymbols() {
  let d = clearFlex({ bg: 'silver' });
  let d1 = mDom(d, { bg: 'green', w: 25, h: 25 }, { tag: 'img', src: '../assets/games/wingspan/worm.svg' });
}
async function test_swSymbols_omni() {
  let d = clearFlex({ bg: 'silver' });

  let svgcode = generatePizzaSvg(50, 'red', 'yellow', 'blue', 'orange', 'green');
  console.log(svgcode)

  let d1 = mDom(d, { bg: 'green', w: 25, h: 25 }, { tag: 'img', src: '../assets/games/wingspan/pie3.svg' });
}
async function test141_card() {
  await prelims(); //return;
  let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); //arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);
  keys = ['arctic_fox'];// panther bear eagle arctic_fox wasp
  let items = [];
  for (const key of keys) {
    //console.log('___', key);
    let o = getDetailedSuperdi(key);
    let ocard = showCardWingspanPortrait(o, d, 600);
    items.push(ocard);
    // showPlaetze(ocard.dPlaetze,rChoose([1,2,3]),'sienna')
    //break;
  }
  // let res = mCluster(items,x=>x.o.ohabitat.list,x=>`${x.key}: ${x.o.habitat}`);
}
async function test141_allFoods() {
  await prelims(); //return;
  let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); //arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);
  //keys = ['wasp']; //console.log(M.details.dragonfly); //return;
  let foods = [];
  for (const key of keys) {
    // console.log('___', key);
    let o = getDetailedSuperdi(key);
    let [contained, types] = extractFoods(o.food);
    contained.map(x => addIf(foods, x.key));

  }
  console.log('foods', foods)
}
async function test140_habitat() {
  await prelims(); //return;
  let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); //arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);
  let items = [];
  for (const key of keys) { items.push(getDetailedSuperdi(key)) };


  for (const o of items) {
    let hcolors = o.ohabitat.colors; console.log(hcolors)
    let x = mPizza(d, 50, ...hcolors);
  }


}
async function test139_species() {
  await prelims(); //return;
  let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); //arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);

  //console.log(Object.keys(M.habitat).join(' ')); return;

  //keys = ['wasp']; //console.log(M.details.dragonfly); //return;
  let items = [];
  for (const key of keys) {
    console.log('___', key);
    let o = getDetailedSuperdi(key);
    //console.log(o.ooffsprings.num); if (nundef(o.ooffsprings.num)) break;
    //console.log(o.ohabitat.list)
    let ocard = showCardWingspanPortrait(o, d);
    items.push(ocard);

    showPlaetze(ocard.dPlaetze, rChoose([1, 2, 3]), 'sienna')
    //console.log(o.species)
    //let x=extractSpecies(o.species);
    //console.log('species',x)
  }

  let res = mCluster(items, x => x.o.ohabitat.list, x => `${x.key}: ${x.o.habitat}`);
  //console.log(res)

}

async function test139_wsCard() {
  await prelims(); let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);

  let key = 'walrus';
  let o = getDetailedSuperdi(key); console.log(o); //return;
  let ocard = showInfoCard(key, d);
  let ws = showCardWingspanPortrait(o, d)
}
//#endregion

//#region show object details von M.details
async function test138() {
  await prelims();
  return;
  let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel);
  keys = ['bamboo_weevil']; //rChoose(keys);
  let list = [];
  for (const key of keys) { //}.slice(0,400)){
    let o = getDetailedSuperdi(key);
    showDetailsPresentation(o, d);
    //list.push(o);
    //showObject(o,null,d,{bg:'red',padding:10}); 
  }
}
async function test137() {
  await prelims(); return;
  let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel);
  //keys = ['blue_poison_dart_frog']; //rChoose(keys);
  let list = [];
  for (const key of keys) { //}.slice(0,400)){
    let o = getDetailedSuperdi(key);
    list.push(o);
    //showObject(o,null,d,{bg:'red',padding:10}); 
  }
  list = sortBy(list, 'nweight'); list.map(x => console.log(x.key, x.nweight));
  console.log('N', list.length)
  return;
  for (const key of keys) {
    let w = calcWeight(getDetails(key).weight);
    let text = w.text;
    console.log(key, text, w.avg);
  }
}
async function test136_sortDictionaries() {
  await prelims();
  let superdi = sortDictionary(M.superdi);
  let details = sortDictionary(M.details);
  downloadAsYaml(superdi, 'superdi')
  downloadAsYaml(details, 'details')
}
async function test135() {
  await prelims(); let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel);
  //keys = ['blue_poison_dart_frog']; //rChoose(keys);
  //console.log(calcWeight('a few kg to several tons'));
  //let s = 'a few milligrams to several grams'; let w=calcWeight(s); console.log(w);  return;
  keys.map(x => { console.log(x); console.log(calcWeight(getDetails(x).weight)) });
}
async function test134() {
  await prelims(); let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);
  keys = ['jewel_bug'];
  for (const key of keys.slice(0, 40)) {
    let o = getDetailedSuperdi(key); showObject(o, null, d, { bg: 'red', padding: 10 });
  }
}
async function test133_colors() {
  await prelims();
  //return;
  let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);
  let allcolors = [];
  for (const key of keys) {
    let o = getDetailedSuperdi(key); //showObject(o,null,d,{bg:'red',padding:10}); 
    o.colors.map(x => addIf(allcolors, x));
  }
  console.log('allcolors', allcolors);
}
async function test132_verifyFoodtypeExtraction() {
  await prelims(); let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); //arrShuffle(keys); 
  let cards = deckDeal(keys, 3); // console.log('cards', cards);
  //keys = ['barn_spider'];
  for (const key of keys) {
    let o = getDetailedSuperdi(key);
    let foodEasy = extractFoodType(o.food, true, key);
    let food = extractFoodType(o.food, false, key);
    if (foodEasy != food) console.log('___', key, '\n', o.food, '\neasy', foodEasy, '\ndetect', food)
  }
}
async function test131() {
  await prelims(); let d = clearFlex(); let keys = jsCopy(M.byCollection.tierspiel); arrShuffle(keys); let cards = deckDeal(keys, 3); // console.log('cards', cards);

  let key = 'walrus';
  let o = getDetailedSuperdi(key); showObject(o, null, d, { bg: 'red', padding: 10 });
  return;

  let items = [];
  for (const key of cards.slice(2)) {
    let o = showInfoCard(key, d);

    //showObject(o,Object.keys(o),d,{align:'left'},{showKeys:true}); mLinebreak(d)
    o.key = key;
    items.push(o);
  }
  console.log('items', items[0])
}
//#endregion

//#region svg fuer wingspan food items und pizza circle
async function test130_svgSliced() {
  await prelims(); //return;
  let d = clearFlex({ gap: 0 })
  for (const i of range(100)) mAppend(d, wsGetIcon());

  // let colors = toWords('british_racing_green yellow sangria azure gray',true).map(x=>colorFrom(x));
  // let html = generatePizzaSVG(100,...colors);
  // let d1=mCreateFrom(html);
  // mAppend(d,d1);
}

async function test129_svgWingspan() {
  let html = `
      <svg width="200" height="200" viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
        <!-- Slice 1: Red -->
        <path d="M 0,0 L 100,0 A 100,100 0 0,1 50,87 L 0,0" fill="crimson" />
        
        <!-- Slice 2: Yellow -->
        <path d="M 0,0 L 50,87 A 100,100 0 0,1 -50,87 L 0,0" fill="emerald" />
        
        <!-- Slice 3: Green -->
        <path d="M 0,0 L -50,87 A 100,100 0 0,1 -100,0 L 0,0" fill="yellow" />
        
        <!-- Slice 4: Blue -->
        <path d="M 0,0 L -100,0 A 100,100 0 0,1 -50,-87 L 0,0" fill="blue" />
        
        <!-- Slice 5: Gray -->
        <path d="M 0,0 L -50,-87 A 100,100 0 0,1 50,-87 L 0,0" fill="brown" />
        
        <!-- Slice 6: Brown -->
        <path d="M 0,0 L 50,-87 A 100,100 0 0,1 100,0 L 0,0" fill="gray" />
      </svg>
  
    `;
}
//#endregion

//#region showInfoCard (wingspan cards)
async function test128_tierspiel() {
  await prelims(); return;

  let d = clearFlex();
  let keys = jsCopy(M.byCollection.tierspiel);
  arrShuffle(keys)
  let cards = deckDeal(keys, 3); // console.log('cards', cards);

  let items = [];
  for (const key of cards) {
    let o = showInfoCard(key, d);

    //showObject(o,Object.keys(o),d,{align:'left'},{showKeys:true}); mLinebreak(d)
    o.key = key;
    items.push(o);
  }
  console.log('items', items)

}
//#endregion

//#region image crop pan scale und post
async function test127() {
  await prelims();
  return;
  let data = await getImageData('../assets/img/tierspiel/bee.png');
  //console.log('data',data); return;
  let res = await mPostRoute('postImage', { coll: 'tierspiel', filename: 'zbee.png', image: data });
  console.log('res', res);
}
async function test126() {
  await prelims();
  //await editDetailsFor('bee',iDiv(UI.commands.simpleNew))
  //await simpleOnDroppedUrl_test('../ode/iport.png',UI.simple);
  return;
  let dParent = clearFlex();
  let src = '../ode/iport.png';
  let canvas = createPanZoomCanvas(dParent, src, 400, 400);
  mStyle(canvas, { border: 'red' })
  mLinebreak(dParent)
  mButton('save', () => savePanZoomCanvas(canvas), dParent, {}, 'button');

}
async function test125() {
  await prelims();

  async function onclickSaveCropData() {
    let o = UI.zoomo;
    let pd = UI.panData;
    console.log(o, pd); return;
    let [d, img, wOrig, hOrig, sz, fa, famin] = [o.d, o.img, o.wOrig, o.hOrig, o.sz, o.fa, o.famin];
    if (fa >= 1) { console.log('cant zoom in more!!!', fa); return; }
    fa *= 1.5; if (fa > 1) fa = 1; UI.fa = fa;
    showImgCentered(d, img, wOrig, hOrig, sz, fa, famin);

  }
  function showImgCentered(d, img, wOrig, hOrig, sz, fa, famin) {
    UI.zoomo = { d, img, wOrig, hOrig, sz, fa, famin };
    let wsc = wOrig * fa, hsc = hOrig * fa; console.log('fa', fa);

    let [xwo, ywo] = [(sz - wsc) / 2, (sz - hsc) / 2]

    showImagePartial(d, img, 0, 0, wOrig, hOrig, xwo, ywo, wsc, hsc, sz, sz, wOrig, hOrig); //, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig);
    let szCrop = sz - 100;
    let dc = mDom(d, { position: 'absolute', left: (sz - szCrop) / 2, top: (sz - szCrop) / 2, w: szCrop, h: szCrop, box: true, border: 'red', cursor: 'grab' });
    dc.onmousedown = startPanning;
  }
  async function onclickZoomIn() {
    let o = UI.zoomo;
    let [d, img, wOrig, hOrig, sz, fa, famin] = [o.d, o.img, o.wOrig, o.hOrig, o.sz, o.fa, o.famin];
    if (fa >= 1) { console.log('cant zoom in more!!!', fa); return; }
    fa *= 1.5; if (fa > 1) fa = 1; UI.fa = fa;
    showImgCentered(d, img, wOrig, hOrig, sz, fa, famin);

  }
  async function onclickZoomOut() {
    let o = UI.zoomo;
    let [d, img, wOrig, hOrig, sz, fa, famin] = [o.d, o.img, o.wOrig, o.hOrig, o.sz, o.fa, o.famin];
    if (fa * wOrig <= sz && fa * hOrig <= sz) { console.log('cant zoom out more!!!', wOrig, hOrig, fa, fa * wOrig, fa * hOrig, sz); return; }
    fa *= 0.5; if (fa < famin) fa = famin; UI.fa = fa;
    showImgCentered(d, img, wOrig, hOrig, sz, fa, famin);

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
      UI.panData = panData;
    }
    panStart(ev);
  }

  let dParent = clearFlex();
  //let src="C:\\Users\\tawzz\\Pictures\\diana\\random114_003.png"; geht NICHT!!!!!!
  let src = '../ode/iport.png';
  //console.log('___', src);
  //let img = await imgAsync(d,{},{src});
  let m = await imgMeasure(src);
  let [img, wOrig, hOrig, sz, pad] = [m.img, m.w, m.h, 400, 50];
  //console.log('orig', wOrig, hOrig);
  //img wurde NICHT gezeichnet

  mIfNotRelative(dParent);
  let dPopup = mDom(dParent, { position: 'fixed', top: 40, left: 0, bg: 'pink' });

  let szCrop = sz + 2 * pad;
  //let [wPart,hPart] = [wCrop,hCrop];
  let d = mDom(dPopup, { w: szCrop, h: szCrop }); //, {  }); //, w:wCrop,h:hCrop});//,padding:pad}); //, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
  mIfNotRelative(d);

  let isPortrait = hOrig > wOrig;
  let fa = isPortrait ? szCrop / hOrig : szCrop / wOrig; //console.log('factor', fa);

  showImgCentered(d, img, wOrig, hOrig, szCrop, fa, fa);
  mButton('zoom out', onclickZoomOut, dParent, {}, 'button', 'bZoomOut');
  mButton('zoom in', onclickZoomIn, dParent, {}, 'button', 'bZoomIn');
  mButton('save', onclickSaveCropData, dParent, {}, 'button', 'bZoomSave');


}
function mist_zoomzeug() {
  let [xi, yi, wi, hi, wCrop, hCrop] = [0, 0, wOrig, hOrig, wOrig * fa, hOrig * fa];
  console.log('img', xi, yi, wi, hi, '\ncrop', Math.round(wCrop), Math.round(hCrop), szCrop)
  let dx = isPortrait ? (szCrop - wCrop) / 2 : 0;
  let dy = isPortrait ? (szCrop - hCrop) / 2 : 0;
  let [wCanvas, hCanvas] = [szCrop, szCrop];
  showImagePartial(d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig);
  //showImagePartial(d,img,xi,yi,wi,hi,dx,dy,wCrop,hCrop);

  let o = UI.zoomo = { d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig, fa };



}
function rest() {
  return;
  // let dc=mDom(d,{position:'absolute',left:2*pad,top:2*pad,w:sz,h:sz,border:'red solid 1px'});

  // let o={dc,wOrig,hOrig,img,src,wPart,hPart,wCrop,hCrop,sz,pad,dpad:pad,d}
  // o={src,dc,wOrig,hOrig,img,xi,yi,wi,hi,wc,hc,sz,pad,dpad:pad,d}

  // mButton('zoom out',()=>onclickZoomOut(o),dParent)












  // let b1=mButton('dummy',null,dParent,{opacity:0}); b1.focus();

  // //showim2('hallo','dMain',)
  // //let sz=100; showim2('halloss', 'dMain', { position:'absolute',top:0,left:0, 'object-position': 'center top', 'object-fit': 'cover', h: sz, w: sz, round: true, border: `red 3px solid` });
  // //await switchToUser('mitra');
  // //await switchToMainMenu('simple')
  // //was will ich genau?
}
async function test124_superdiCollsCatsAlerts() {
  await prelims();
  let di = {};

  for (const k in M.superdi) {
    let o = M.superdi[k];
    assertion(isList(o.colls), `${k} does not have colls!`);
    assertion(isList(o.cats), `${k} does not have cats!`);

    if (isEmpty(o.colls)) {
      console.log(`${k} NO MORE colls!!!`, o);
    }
    delete o.key;

    di[k] = o;
  }
  di = sortDictionary(di);
  // downloadAsYaml(di,'superdi');
}
//#endregion

//#region tierspiel
async function test124_animalDetailsYaml() {
  let ad = getAnimalDetails();
  let di = {};
  for (const k in ad) {
    let o = ad[k];
    let knew = normalizeString(k);
    //let lastWord = stringAfterLast(knew, '_');
    di[knew] = o;
  }
  di = sortDictionary(di);
  downloadAsYaml(di, 'diDetails');

}
async function test123() {
  await prelims();
  let di = {};

  for (const k in M.superdi) {
    let o = M.superdi[k];
    // if (isdef(o.key)) console.log('has key!',o);
    //assertion(nundef(o.key),`${k} still has a key!`);
    assertion(isList(o.colls), `${k} does not have colls!`);
    assertion(isList(o.cats), `${k} does not have cats!`);

    for (const s of ['animals', 'critters', 'armadillos', 'owls']) {
      removeInPlace(o.colls, s);
    }
    if (isEmpty(o.colls)) console.log(`${k} NO MORE colls!!!`)
    let validcats = 'animal action building card clothing food emotion gesture wheather user transport sport plant';
    o.cats = o.cats.filter(x => validcats.includes(x));

    delete o.key;

    di[k] = o;
  }
  di = sortDictionary(di);
  downloadAsYaml(di, 'superdi');
}
async function test122() {
  await prelims();
  let di = {};

  for (const k in M.superdi) {
    let o = M.superdi[k];
    delete o.key;
    assertion(isdef(o.colls), `${k} does not have colls!`);
    assertion(isdef(o.cats), `${k} does not have cats!`);
    removeInPlace(o.cats, 'best');
    if (isEmpty(o.colls)) console.log(`${k} in NO collection`)
    if (o.colls.length == 1 && o.colls[0] == 'animals') continue;
    di[k] = o;
  }
  //downloadAsYaml(di,'superdi');
}
async function test121_tierbilderbesser() {
  await prelims(); return;
  let tierfiles = await mGetFiles('../assets/img/tierspiel');
  //console.log(tierfiles);
  let d = clearFlex();
  let keys = M.byCollection.animals;
  let newkeys = M.byCollection.tierspiel;

  let di = {};
  for (const k of keys) {
    let old = M.superdi[k];
    let img = old.img;
    if (tierfiles.some(x => img.includes(x))) {
      console.log('___found', k);
      if (newkeys.includes(k)) {
        console.log('IS in tierspiel!', old);

      }

    }
  }
}
async function test120_normalizeFriendly() {
  await prelims();
  for (const k in M.superdi) {
    let o = M.superdi[k];
    o.friendly = normalizeString(o.friendly);
  }

  downloadAsYaml(M.superdi, 'superdi');
}
async function test119_animalDetails() {
  await prelims();
  let ad = getAnimalDetails();
  let di = {};
  let diDetail = {}, deletedKeys = [], collname = 'tierspiel';
  for (const k in ad) {
    let knew = normalizeString(k);
    let lastWord = stringAfterLast(knew, '_');
    let f1 = M.byFriendly[k];
    let f2 = M.byFriendly[knew];
    let m1 = M.superdi[k];
    let m2 = M.superdi[knew];
    let m3 = M.superdi[lastWord];
    diDetail[knew] = ad[k];
    if (isdef(m2)) { console.log('already have', knew, m2); continue; }

    console.log('___', k);
    if (k != knew && isdef(m1)) console.log(`m1: ${k} in superdi`, m1);
    if (isdef(m2)) console.log(`m2: ${knew} in superdi`, m2);
    if (k != knew && isdef(f1)) console.log(`f1: ${k} in friendly`, f1, M.superdi[f1[0]]);
    if (isdef(f2)) console.log(`f2: ${knew} in friendly`, f2, M.superdi[f2[0]]);

    assertion(nundef(f1), "HALLO DA SIND IMMER NOCH non-normalized friendly strings!!!");

    if (isdef(m1) && m1.colls.includes(collname) && knew != k) { addIf(deletedKeys, k); di[knew] = di[k]; }
    else if (isdef(f2) && nundef(m2)) {
      let kbloed = f2[0];
      let o = M.superdi[kbloed];
      addIf(deletedKeys, kbloed);
      o.friendly = knew;
      let kfinal = nundef(M.superdi[lastWord]) ? lastWord : knew;
      o.key = kfinal;
      console.log('add', o, 'as', kfinal);
      di[kfinal] = o;
    } else if (isdef(f2) && nundef(m1)) {
      let kbloed = f2[0];
      let o = M.superdi[kbloed];
      o.friendly = knew;
      let kfinal = nundef(M.superdi[lastWord]) ? lastWord : kbloed;
      console.log('add', o, 'as', kfinal);
      if (kfinal != kbloed) addIf(deletedKeys, kbloed);
      di[kfinal] = o;
    }


    break;
    //if (isdef(m1) && m1.colls.includes(collname) && knew!=k) {addIf(deletedKeys,k);di[knew]=di[k];}
  }

  console.log('delete:', deletedKeys)
  // let res = await mPostRoute('postUpdateSuperdi', { di });
  // await loadAssets();
  // collPostReload();

  //diDetail = sortDictionary(diDetail);
  //downloadAsYaml(diDetail,'diDetail');
}
//#endregion

//#region settings
async function test118_deleteTheme() {
  await prelims();
  delete Serverdata.config.themes.forest;
  await mPostRoute('postConfig', Serverdata.config)
}
async function test117() {
  await prelims();

}
async function test116_calcPalette() {
  await prelims();

  //console.log('???',typeof colorDistanceHue('red','black'));return;
  return;
  let [pal, palContrast] = await calcUserPalette('mac');
  let d = mPopup(); showPaletteMini(d, pal); mLinebreak(d); showPaletteMini(d, palContrast);
}
async function test115_calcPaletteForUser() {
  await prelims();

  let x = colorDistanceHueLum('#ffffff', '#000000'); console.log(x); //return;
  x = colorDistanceHueLum('#ff0000', '#00ffff'); console.log(x); //return;
  x = colorDistanceHueLum('#ffff00', '#000000'); console.log(x); //return;
  x = colorDistanceHueLum('#006c7f', '#8e846a'); console.log(x); //return;

  //await switchToUser('maya','settings'); 
  await calcUserPalette('lauren');
}
async function test115_calcPaletteForUser_no() {
  await prelims();
  let user = Serverdata.users['lauren'];
  let d = clearFlex({ h: '100vh', w: '100vw', bg: user.color });
  mDom(d, { fg: 'white' }, { html: user.name });
  let palette = await showPaletteFor(d, user.texture, user.color, user.blendMode);
}
//#endregion

//#region mGather refactoring!
async function test114_mGatherCheckListInput() {
  await prelims();
  return;
  await switchToMainMenu('collections');
  await onclickCollSelectAll();
  await onclickEditCategories();
  let d = clearFlex(); let dAnchor = mDom(d, { matop: 100, bg: 'green', padding: 10, align: 'center' }, { html: 'Anchor' });
  let content, res;

  content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  // content={a:true,b:false,c:true};
  // content = ['das','ist','richtig']
  // content = 'ich bin hier im jetzt';
  res = await mGather(dAnchor, { hmax: 510, wmax: 200, pabottom: 10, box: true }, { content, type: 'checkList' });
  console.log('res', res)


}
async function test114_mGatherCheckList() {
  await prelims();
  await switchToMainMenu('collections'); return;
  let d = clearFlex(); let dAnchor = mDom(d, { matop: 100, bg: 'green', padding: 10, align: 'center' }, { html: 'Anchor' });
  let content, res;

  content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  // content={a:true,b:false,c:true};
  // content = ['das','ist','richtig']
  // content = 'ich bin hier im jetzt';
  res = await mGather(dAnchor, { hmax: 510, wmax: 200, pabottom: 10, box: true }, { content, type: 'checkList' });
  console.log('res', res)


}
async function test113_mGather() {
  await prelims();

  // return;
  let d = clearFlex(); let dAnchor = mDom(d, { matop: 100, bg: 'green', padding: 10, align: 'center' }, { html: 'Anchor' });
  let content, res;
  //let name = await mGather(dAnchor); console.log('you picked',name); //OK

  content = { input1: '', input2: '', input3: '' };
  //res = await mGather(dAnchor,{},{content,type: 'multi'}); console.log('you picked',res); //OK object w/ new vals

  content = 'are you happy?';
  //res = await mGather(dAnchor,{},{content,type: 'yesNo'}); console.log('you picked',res); //OK true|false

  content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  content = { a: 1, b: 2, c: 3 };
  content = [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5 }];
  //content = ['das','ist','richtig']
  //content = 'ich bin hier im jetzt';
  res = await mGather(dAnchor, {}, { content, type: 'select' });
  console.log('res', res)


}
async function test112() {
  //wie mach ich ein gadget fuer colorname?
  await prelims();
  let d = clearFlex();

  let dAnchor = mDom(d, { matop: 100, bg: 'green', w: 200, padding: 10, align: 'center' }, { html: 'Anchor' });
  let res;

  let content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  content = { a: 1, b: 2, c: 3 };
  content = [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5 }];
  //content = ['das','ist','richtig']
  //content = 'ich bin hier im jetzt';
  res = await mGather(dAnchor, {}, { content, type: 'select' });
  console.log('res', res)
  // res = uiTypeSelect(content,d); //console.log(res)

  return;

  //res = await mGather(title,{},{content, type: 'select'}); 
  console.log('you picked', res);

  //let name = await mGather(title); console.log('you picked',name); //OK

  content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  //res = await mGather(title,{},{content,type: 'checkList'}); console.log('you picked',res); 

  content = 'restart?'
  //res = await mGather(title,{},{content,type: 'yesno'}); console.log('you picked',res); //OK true|false

  content = [{ name: 'a', value: true }, { name: 'b', value: true }, { name: 'c', value: false }];
  //res = await mGather(title,{},{content,type: 'checkListInput'}); console.log('you picked',res); //OK list of vals

  content = { input1: '', input2: '', input3: '' };
  //res = await mGather(title,{},{content,type: 'multi'}); console.log('you picked',res); //OK object w/ new vals



}
async function test111() {
  //console.log(colorDistance('black','white')); return;
  await prelims();
  let d = clearFlex();
  for (const i of range(30)) {
    let letter = rChoose(['R', 'G', 'Y', 'B', 'M', 'C']);
    let num = rChoose(range(100));
    for (let x = -90; x < 100; x += 30) {
      let [w, b] = x < 0 ? [-x, 0] : x == 0 ? [0, 0] : [0, x]; //rChoose(range(100)),rChoose(range(100))];
      let ncol = letter + num; console.log('___ my ncol', ncol, w, b)
      let color = colorFromNcol(ncol, w, b);
      let w3 = colorO(color);
      w3.myNcol = ncol;
      let realColor = M.colorByName[w3.name];
      let dist = w3.distance;
      if (w3.distance > 20) w3.name = `[${w3.name}]`;
      else w3.name += dist < 5 ? '***' : dist < 10 ? '**' : dist < 15 ? '*' : '';
      //w3.myBucket=colorGetBucket(w3.hex);
      let d1 = showObject(w3, ['name', 'hex', 'distance', 'bucket', 'hue', 'ncol', 'myNcol'], d, { bg: w3.hex, wmin: 233 });
      showObject(realColor, ['name', 'hex', 'bucket'], d, { bg: realColor.hex, wmin: 233 });
      mLinebreak(d)
    }
    mLinebreak(d)
  }


}
//#endregion

//#region colors, palette, ...
async function test108_colorNatVersusW3_BROKEN() {
  await prelims();
  let d = clearFlex();
  for (const i of range(30)) {
    let w3 = rChoose(M.colorList);
    let hex = w3.hex;
    let hwb = colorToHwbRounded(hex);
    let ncol = colorHueToNcol(hwb.h); //console.log('my ncol',ncol)
    console.log('___', w3.hue, w3.ncol, ncol, colorNcolToHue(ncol)); //w3.toNcol()); 
    let nat = colorHueToNat(hwb.h);
    console.log(w3.hue, nat, colorNatToHue(nat)); //w3.toNcol()); 
  }
}
async function test110_colorNatVersusW3() {
  await prelims();
  let d = clearFlex();
  for (const i of range(103)) {
    let c = rChoose(M.colorList); console.log('___', c.hue, c.sat * 100, Math.round(c.lightness * 100), c.hex);
    let hex = c.hex;
    let hsl = colorHexToHslRounded(hex); console.log(hsl)
    assertion(hsl.h == c.hue && hsl.s == Math.round(c.sat * 100) && hsl.l == Math.round(c.lightness * 100), 'WTF')
    //let hex = c.hex; console.log(hex)
  }
}
async function test109_colorNatVersusW3() {
  await prelims();
  let d = clearFlex();
  for (const i of range(103)) {
    let c = rChoose(M.colorList); console.log('___', c.hue, c.sat * 100, Math.round(c.lightness * 100), c.hex);
    let hex = c.hex;
    let hsl = colorHexToHslRounded(hex); console.log(hsl)
    assertion(hsl.h == c.hue && hsl.s == Math.round(c.sat * 100) && hsl.l == Math.round(c.lightness * 100), 'WTF')
    //let hex = c.hex; console.log(hex)
  }
}
async function test108_colorNatVersusW3() {
  await prelims();
  let d = clearFlex();
  for (const i of range(105)) {
    let c = rChoose(M.colorList); console.log(c.red, c.green, c.blue, c.hex);
    let hex = c.hex;
    let [r, g, b] = colorHexToRgbArray(hex); console.log(r, g, b)
    assertion(r == c.red && g == c.green && b == c.blue, 'WTF');
    //let hex = c.hex; console.log(hex)
  }
}
async function test108_ncolHue() {
  for (const i of range(20)) {
    let ncol = colorHueToNcol(i); let hue = colorNcolToHue(ncol);
    // console.log(`i:${i}, ncol:${ncol}, hue:${hue}`);
    assertion(hue == i, `i:${i}, ncol:${ncol}, hue:${hue}`);
  }
}
async function test107_hueTest() {
  await prelims();
  let d = clearFlex();
  let list = [44, 45, 46, 0, 1, 2, 359, 360];
  list.forEach(x => showColorFromHue(d, x))
}
async function test106_hueCheck() {
  await prelims();
  let d = clearFlex();
  //console.log('names',Object.keys(byname));
  for (const i of range(1, 360, 5)) {
    let c = colorHsl360ArgsToHex79(i, 100, 50);
    let w3 = colorNearestNamed(c, M.colorList);
    //let w3=rChoose(dicolorlist);
    let d1 = showObject(w3, ['name', 'hex', 'bucket', 'hue'], d, { bg: w3.hex });
    d1.innerHTML += colorGetBucket(w3.hex);
  }
}
async function test106_bucketCheck() {
  await prelims();
  [dicolorlist, byhex, byname] = getListAndDictsForDicolors();
  //console.log('names',Object.keys(byname));
  let d = clearFlex();
  for (const i of range(3)) {
    let w3 = rChoose(dicolorlist);
    let d1 = showObject(w3, ['name', 'hex', 'bucket', 'hue'], d, { bg: w3.hex });
    d1.innerHTML += colorGetBucket(w3.hex);
  }
}
async function test105_myhwb() {
  let hex = colorTrans('black', .5); //'black'; //'#ffffff'; //rColor(); //'#00ff80'; //
  console.log(colorFrom(hex), hex)
  let c = w3color(hex); console.log(c);
  let hsl = c.toHslaString(); console.log('toHsl', hsl);
  let hbw = c.toHwb(); console.log('toHwb', hbw);
  let w3ncol = c.toNcol(); console.log('toNcol', w3ncol);

  console.log(colorHueToNcol(hsl.h))


}
async function test104_WTF() {
  let hex = '#00ff80'; //rColor(); 
  console.log(colorFrom(hex), hex)
  let c = w3color(hex); console.log(c);
  let x = c.toCmyk(); console.log('toCmyk', x);
  x = c.toCmykString(); console.log('toCmykString', x);
  x = c.toHsl(); console.log('toHsl', x);
  x = c.toHslString(); console.log('toHslString', x);
  x = c.toHslStringDecimal(); console.log('toHslStringDecimal', x);
  x = c.toHwb(); console.log('toHwb', x);
  x = c.toHwbString(); console.log('toHwbString', x);
  x = c.toHwbStringDecimal(); console.log('toHwbStringDecimal', x);
  x = c.toName(); console.log('toName', x);
  x = c.toNcol(); console.log('toNcol', x);
  x = c.toNcolString(); console.log('toNcolString', x);
  x = c.toNcolStringDecimal(); console.log('toNcolStringDecimal', x);
  x = c.toRgb(); console.log('toRgb', x);
  x = c.toRgbString(); console.log('toRgbString', x);
  return;
  let nearestColor = c.toNcol();
  console.log(`The nearest named color to ${hex} is`, nearestColor);
}
async function test103_w3colorNcol() {

  function findNearestNamedColor(hex) {
    let color = w3color(hex);
    let nearestColor = color.toNcol();
    console.log(`The nearest named color to ${hex} is ${nearestColor}`);
  }
  findNearestNamedColor("#ff5733");
  findNearestNamedColor("#3498db");
  findNearestNamedColor("#aabbcc");

}
async function test102() {
  await prelims();
  let namedColors = colorGetDicolorList(); console.log('namedColors', namedColors.length);
  let dp = clearBodyDiv({ bg: 'white', h: '100vh', padding: 10 });
  let d = mDom(dp, { gap: 10 }); mFlexWrap(d);

  let c = rColor(); console.log('c', c); showColor(d, c);
  mLinebreak(d);

  console.log('________ nearest')
  let named = colorNearestNamed(c, namedColors); showColor(d, named);
  console.log('________ nearest 2')
  let named2 = findNearestNamedColor(c, namedColors); showColor(d, named2);

  console.log('________ nearest 2')
  let named3 = w3color(c).toName(); console.log(named3); //showColor(d, named3);

  mLinebreak(d); return;

  console.log('________ farest')
  let contrast = colorFarestNamed(c, namedColors);
  let contrastToAlg1 = colorGetContrast(c, contrast.hex);

  let d1 = showColor(d, contrast); d1.innerHTML += `<br>${contrastToAlg1}`;

  console.log('________ farest 2')
  let contrast2 = findFarestNamedColor(c, namedColors);
  let contrastToAlg2 = colorGetContrast(c, contrast2.hex)

  d1 = showColor(d, contrast2); d1.innerHTML += `<br>${contrastToAlg2}`;

  mLinebreak(d);
  let compl = colorComplement(c); showColor(d, compl);
  let contrastToComplement = colorGetContrast(c, compl)
  let complNamed = colorNearestNamed(compl, namedColors);

  d1 = showColor(d, compl); d1.innerHTML += `<br>${contrastToComplement}`;

  mLinebreak(d);
  showText(d, colorGetContrast(c, 'white'), 'white')
  showText(d, colorGetContrast(c, 'black'), 'black')

}
async function test101_blendModesAppliedToColors() {
  d = mDom(document.body); let d2 = mDom(d, { gap: 10 }); mFlexWrap(d2);

  let color1 = rColor();
  let color2 = rColor();
  mDom(d2, { align: 'center', wmin: 120, padding: 2, bg: color1, fg: colorIdealText(color1) }, { html: color1 });
  mDom(d2, { align: 'center', wmin: 120, padding: 2, bg: color2, fg: colorIdealText(color2) }, { html: color2 });
  mLinebreak(d2);
  for (const blc of getBlendModesCanvas()) {
    let bl = getBlendCSS(blc); console.log(bl)
    let c = colorBlendMode(color1, color2, bl);
    mDom(d2, { align: 'center', wmin: 120, padding: 2, bg: c, fg: colorIdealText(c) }, { html: bl });
  }

}
async function test100_enrichColorBlendModes() {
  const blendModes = [
    'source-over',
    'lighter',
    'copy',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity'
  ];

}
async function test99_calcPaletteForUser() {
  await prelims();
  //await switchToUser('maya','settings'); 
  let d = clearBodyDiv({ bg: 'white', h: '100vh', padding: 10 });
  mFlexWrap(d);
  await analyseColorsForUser(d, 'lauren');
}
async function test98_rgb2hsl() {
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s, l];
  }
  let x = rgbToHsl(0, 0, 255);
  console.log(x)
}
async function test97_calcPalette() {
  await prelims();
  //await switchToUser('maya','settings'); 
  let d = clearBodyDiv({ bg: 'white', h: '100vh', padding: 10 });
  mFlexWrap(d);
  // showBlendMode(d,U.blendMode);
  for (const name in Serverdata.users) {
    let user = Serverdata.users[name];
    let d1 = mDom(d, { align: 'center', bg: user.color, fg: valf(user.fg, colorIdealText(user.color)) });
    mDom(d1, {}, { html: name });
    let palette = await showPaletteFor(d1, user.texture, user.color, user.blendMode);
  }
}
async function test96_() {
  await prelims();
  await switchToUser('maya', 'settings');
}
async function test95_fixThemes() {
  await prelims();
  for (const key in Serverdata.config.themes) {
    let theme = Serverdata.config.themes[key];
    theme.texture = pathFromBgImage(theme.bgImage); delete theme.bgImage;
    theme.blendMode = theme.bgBlend; delete theme.bgBlend;
  }
  await mPostRoute('postConfig', Serverdata.config);
  console.log('themes', Serverdata)
}
async function test95_fixUsers() {
  await prelims();
  for (const name in Serverdata.users) {
    let user = Serverdata.users[name];
    if (nundef(user.imgKey)) user.imgKey = isdef(M.superdi[name]) ? name : 'unknown_user';
    delete user.key;
    if (!isEmpty(user.bgBlend)) { user.blendMode = user.bgBlend; }
    delete user.bgBlend;
    delete user.bgRepeat;
    delete user.bgSize;
    if (!isEmpty(user.bgImage)) { user.texture = pathFromBgImage(user.bgImage); }
    delete user.bgImage;
    delete user.games;
    let res = await postUserChange(user, true);
    if (name == 'guest') console.log(res); else console.log(res.name, res.imgKey)
  }
}
async function test94_showBlendModes() {
  await prelims();
  //await switchToUser('mimi','settings'); //console.log(mBy('dSettingsMenu'))
  //await onclickSettTexture();
}
async function test93_modUsersBgImageToTexture() {
  await prelims();
  for (const name in Serverdata.users) {
    let user = Serverdata.users[name];
    if (isdef(user.bgImage)) {
      user.texture = pathFromBgImage(user.bgImage);
      delete user.bgImage;
      user.blendMode = user.bgBlend;
      delete user.bgBlend;
      delete user.bgSize;
      delete user.bgRepeat;
    }
    user.imgKey = user.key;
    delete user.key;
    await postUserChange(user, true);
  }
  let x = await mGetRoute('users');
  console.log('users', x)
}
async function test92_showBlendModes() {
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
    //console.log(palette); 
    palette.unshift(fill); palette.splice(8);
    showPaletteMini(d1, palette);
  }
}
async function test91_canvasCSSBlendModes() {
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
    //console.log(palette); 
    palette.unshift(fill); palette.splice(8);
    showPaletteMini(d1, palette);
  }
}
//#endregion

//#region colors
async function test90_integrateGetMyColors1() {
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
  let int1 = intersection(hk1, hk3); //hex colors 
  console.log('intersection', int1)
  let skeys = 'name hex bucket', styles = { padding: 10 };
  for (const k of int1) removeInPlace(hk3, k);
  console.log('neue colors', hk3);
  for (const k of hk3) {
    let ofi = h3[k];
    showColorBox(h3[k], skeys, d1, styles);
    let odiname = n1[ofi.name];
    if (isdef(odiname)) {
      assertion(odiname.hex != ofi.hex, "WTF!!!!!!!!!!!!!!!!!");
      console.log(odiname.hex, ofi.hex)
      showColorBox(odiname, skeys, d1, styles);
    } else {
      assertion(nundef(h1[k]), 'WTF!!!!');
      assertion(nundef(n1[ofi.name]), 'WTF name!!!');
      lookupSet(dinew, [ofi.bucket, ofi.name], k);
    }
    mLinebreak(d1)
  }

  //sortDicolor(dinew); //das macht downloadAsYaml!!!

}
async function test90_integrateGetMyColors2() {
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
  let int1 = intersection(hk1, hk2); //hex colors 
  let skeys = 'name hex bucket', styles = { padding: 10 };
  for (const k of int1) removeInPlace(hk2, k);
  console.log(hk2);
  for (const k of hk2) {
    let ofi = h2[k];
    showColorBox(h2[k], skeys, d1, styles);
    let odiname = n1[ofi.name];
    if (isdef(odiname)) {
      assertion(odiname.hex != ofi.hex, "WTF!!!!!!!!!!!!!!!!!");
      console.log(odiname.hex, ofi.hex)
      showColorBox(odiname, skeys, d1, styles);
    } else {
      assertion(nundef(h1[k]), 'WTF!!!!');
      assertion(nundef(n1[ofi.name]), 'WTF name!!!');
      lookupSet(dinew, [ofi.bucket, ofi.name], k);
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
  console.log('1-2', intersection(k1, k2));
  console.log('1-3', intersection(k1, k3));
  console.log('2-3', intersection(k2, k3));

  //hex overlappings: nur 1-2
  let [nk1, nk2, nk3] = [Object.keys(n1), Object.keys(n2), Object.keys(n3)];
  console.log('1-2', intersection(nk1, nk2));
  console.log('1-3', intersection(nk1, nk3));
  console.log('2-3', intersection(nk2, nk3));

  let dParent = clearBodyDiv();
  //let styles = { wmin: 250, padding: 20 };
  for (const list of [l1, l2, l3]) {
    console.log('list', list.length)
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
  console.log('1-2', intersection(k1, k2));
  console.log('1-3', intersection(k1, k3));
  console.log('2-3', intersection(k2, k3));
  let dParent = clearBodyDiv();
  //let styles = { wmin: 250, padding: 20 };
  for (const list of [l1, l2, l3]) {
    console.log('list', list.length)
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
//#endregion

//#region canvas blend modes
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
//#endregion

async function test80() {
  await prelims();

}
async function test79_colorFuncs(){
  let lum = colorGetLum('blue'); console.log(lum);
  // let rgb = colorHexToRgbArray(colorFrom('blue'));
  console.log('_______');
  console.log(colorGetContrast('black','white'))
  console.log(colorGetContrast('black','dimgray'))
  console.log(colorGetContrast('black','#000000'))
  console.log(colorGetContrast('blue','white'))
  console.log(colorGetContrast('yellow','white'))
  console.log(colorGetContrast('yellow','black'))
  console.log('_______');
  console.log(colorGetHue('yellow'));
  console.log(w3color('yellow').hue);

}
async function test78_switch() {
  let d = clearBodyDiv({ padding: 12 });
  let sw = mSwitch(d, 'sBot');
  console.log(sw);
  sw.onchange = onchangeBotSwitch;
}
async function test77_switch() {

  let d = clearBodyDiv({ padding: 12 });

  let html = `
      <label class="switch">
        <input type="checkbox" checked>
        <span class="slider round"></span>
      </label>
      `;
  d.innerHTML = html;
  // let d3=mDom(d,{className:'switch'},{tag:'label'});
  // let inp=mDom(d3,{},{tag:'input',type:'checkbox',checked:true});
  // let sp=mDom(d3,{className:'slider round'},{tag:'span'});
}
async function test76_RESTART() {
  await prelims();

  //await switchToOtherUser('mimi', 'felix');

  //await resetUsers();
  // await switchToUser('mimi');
  // await switchToMenu(UI.nav, 'settings');
  // await onclickSettAddTheme();

  //await switchToMenu(UI.nav, 'play');
  //await clickFirstTable();
  //await onclickSettBlendMode();
  //await switchToMainMenu('plan')

}
async function test75_showColors() {
  let di = await mGetYaml(`../assets/dicolor.yaml`); // alle hex sind unique!!! das ist gut!
  let d = clearBodyDiv({ padding: 12 }); //{ gap: 10 }); mFlexWrap(d);
  for (const bucket in di) {
    let list = dict2list(di[bucket]);
    let clist = [];
    for (const c of list) {
      let o = w3color(c.value);
      //console.log('c',c)
      o.name = c.id;
      o.hex = c.value;
      clist.push(o);
    }

    let sorted = sortByFunc(clist, x => -x.lightness); //(10*x.lightness+x.sat*100));
    //console.log(sorted[0]); return;

    mDom(d, {}, { html: `<br>${bucket}<br>` })
    showPaletteNames(d, sorted);

    //ok jetzt will ich hier onclick attechen das dann die color setzt, erstmal nur die color for simplicity!
    //und zugleich sollen all die anderen colors gesetzt werden in styles!


  }
}
async function test74_checkColorsUnique(){
  let di = await mGetYaml(`../assets/dicolor.yaml`); // alle hex sind unique!!! das ist gut!
  let bykey={};
  for(const k in di){
    for(const name in di[k]){
      let prev=bykey[name];
      if (isdef(prev)) {
        console.log(`${k}:${name}:${di[k][name]} already in ${prev.bucket} ${prev.hex}`);
      } else{
        //console.log('unique:',name);
        bykey[name]={bucket:k,hex:di[k][name],name};
      }
    }
  }
  console.log(Object.keys(bykey).length,bykey);
  let byhex={};
  for(const name in bykey){
    let c=bykey[name];
    let hex=c.hex;
    if (!name.includes('grey') && isdef(byhex[hex])) console.log(`${hex} already in byhex!:`,name,byhex[hex]);
    byhex[hex]={name,bucket:c.bucket,hex};
  }
}
async function test73_addKnownColors(){
  let di = await mGetYaml(`../assets/dicolor.yaml`); // alle hex sind unique!!! das ist gut!
  let bykey={};
  for(const k in di){
    for(const name in di[k]){
      let prev=bykey[name];
      if (isdef(prev)) {
        console.log(`${k}:${name}:${di[k][name]} already in ${prev.bucket} ${prev.hex}`);
      } else{
        //console.log('unique:',name);
        bykey[name]={bucket:k,hex:di[k][name],name};
      }
    }
  }
  console.log(bykey);
  let byhex={};
  for(const name in bykey){
    let c=bykey[name];
    let hex=c.hex;
    if (isdef(byhex[hex])) console.log(`${hex} already in byhex!:`,name,byhex[hex]);
    byhex[hex]={name,bucket:c.bucket,hex};
  }

  ensureColorNames();
  for(const name in ColorNames){
    let oName=bykey[name];
    let newHex = isdef(oName)?oName.hex:null;
    let oldHex=ColorNames[name];
    let oHex=byhex[oldHex];
    let newName = isdef(oHex)?oHex.name:null;
    if (newHex && newHex != oldHex) {
      //console.log('duplicate name!',name,oldHex,newHex);
      if (newName && newName != name){
        //newName ist jetzt der name der fuer diese color im dicolors existiert
        //console.log('...color already in di under name',newName);
      } else {
        //oldHex muss eingetragen werden unter einem neuen namen!
        //gib es in dasselbe bucket wie duplicate oName
        let name1=oName.bucket.substring(0,3)+'_'+name;
        let o={bucket:oName.bucket,hex:oldHex,name:name1}
        bykey[name1]=byhex[oldHex]=o;
        di[o.bucket][name1]=o.hex
        console.log('...added',name1,'to bykey and di')
      }
    }else if (nundef(oName) && isdef(oHex)){
      let altname = replaceAll(oHex.name,'_','');
      if (altname == name){
        //change this name in dicolor!!!
        let bucket=oHex.bucket;
        bykey[name]=bykey[newName]
        delete bykey[newName];
        di[bucket][name]=oldHex;
        delete di[bucket][newName];
        console.log(`same color ${oldHex} renamed from ${oHex.name} to ${name}!!!!`);
      }
      
      
    }else if (nundef(oName)){
      console.log(`bykey missing ${name}:${ColorNames[name]}`);
    }
  }

  //download di as new dict
  downloadAsYaml(di,'dicolors')
}
async function test72_newcolors(){
  let di = await mGetYaml(`../assets/dicolor.yaml`); // alle hex sind unique!!! das ist gut!
  let dires={};
  let byhex={};
  for(const k in di){
    let di1=di[k];
    dires[k]={};
    let list = dict2list(di1,'name');
    //console.log('list',list);
    for(const name in di1){
      let o=w3color(di1[name]);
      o.name=name;
      o.hex=di1[name];
      dires[k][name]=o;
      lookupAddToList(byhex,[o.hex],o)
    }
    //break
  }
  console.log(byhex);
  console.log(dires);

  for(const hex in byhex){
    if (byhex[hex].length>1) console.log('HA!',byhex[hex]);
  }
  console.log(Object.keys(byhex).length);
}
async function test71_missingColors(){

  let filenames = await mGetFiles(`../ode/colors`);// console.log(filenames);
  let di={}
  for(const fname of filenames){
    let text= await mGetText(`../ode/colors/${fname}`);
    let key = stringBefore(fname,'.');
    let bucket=di[key]={};
    //console.log('text',text);
    let lines = text.split('\n'); let i=0;
    for(const line of lines){
      //console.log('line',line);
      let [name,hexrest]=line.split('#');
      let newname='';
      for(const ch of name.trim()) {
        let code = ch.charCodeAt(0);
        if (code == 160 || code == 32 || '-'.includes(ch)) newname+='_';
        else if (code != 9 && !"()'/".includes(ch)) newname+=ch.toLowerCase();
      }
      name = newname;
      //console.log(fname,name);
      if (isEmptyOrWhiteSpace(name)) continue;
      name = name.replaceAll('__',"_");

      let hex = '#'+stringBefore(hexrest,'\t');
      if (hex.length!=7) console.log('FEHLER!!!!!',fname,name,hexrest)
      hex = hex.toLowerCase();
      //if (i++>100) return;
      // parts = splitAtAnyOf line.split('\t');
      // if (parts.length<3) {console.log('line',line,fname);continue;}
      // let name=parts[1].trim(); //stringBefore(line,'#');
      // //name = stringBefore(name,'(');
      // let color = parts[2].trim(); //`#${stringBefore(stringAfter(line,'#'),' ')}`;
      if (isdef(bucket[name])) {
        if (bucket[name] == hex) continue;
        else {console.log('duplicate',fname,name);name+='1';}
      }
      bucket[name]=hex;
      //break;
    }
  }
  //let s='thousand_herb_color chigusa_iro';
  //for(const ch of s) console.log(ch.charCodeAt(0))
  downloadAsYaml(di,'di1');
} 
async function test70_newcolors(){
  let di = await mGetYaml(`../assets/dicolor.yaml`);
  let dires={};
  let byhex={};
  for(const k in di){
    let di1=di[k];
    dires[k]={};
    let list = dict2list(di1,'name');
    //console.log('list',list);
    for(const name in di1){
      let o=w3color(di1[name]);
      o.name=name;
      o.hex=di1[name];
      dires[k][name]=o;
      lookupAddToList(byhex,[o.hex],o)
    }
    //break
  }
  console.log(byhex);
  console.log(dires);

  for(const hex in byhex){
    if (byhex[hex].length>1) console.log('HA!',byhex[hex]);
  }
  console.log(Object.keys(byhex).length);
}
async function test69_colorsYaml(){
  let di = await mGetYaml(`../assets/dicolor.yaml`);
  console.log(di)
}
async function test68_newColors(){

  let filenames = await mGetFiles(`../ode/colors`);// console.log(filenames);
  let di={}
  for(const fname of filenames){
    let text= await mGetText(`../ode/colors/${fname}`);
    let key = stringBefore(fname,'.');
    let bucket=di[key]={};
    //console.log('text',text);
    let lines = text.split('\n');
    for(const line of lines){
      //console.log('line',line);
      parts = line.split('\t');
      if (parts.length<3) {console.log('line',line,fname);continue;}
      let name=parts[1].trim(); //stringBefore(line,'#');
      name = stringBefore(name,'(');
      let color = parts[2].trim(); //`#${stringBefore(stringAfter(line,'#'),' ')}`;
      bucket[name]=color;
      //break;
    }

  }
  console.log(di)
  downloadAsYaml(di,'di1');
} 
async function test67_colors(){
  let olist = getBeautifulColors(); console.log(olist)
  let lists = sortByHues(olist);
	let d = clearBodyDiv({ gap: 10 }); mFlexWrap(d);
  for(const k in lists){
    showPalette(d,lists[k].map(x=>x.hex));
  }

}
async function test66_colors(){
  let olist = getBeautifulColors(); console.log(olist)
  //sortByMultipleProperties(olist, 'hue'); //, 'lightness');
  // let list=sortByFunc(olist,x=>x.lightness); console.log(list)
  let lists = sortByHues(olist);

  // let colors = olist.map(x=>x.hex); console.log(colors)
	let d = clearBodyDiv({ gap: 10 }); mFlexWrap(d);
	// let board = mColorPickerHex(d,colors);

  for(const k in lists){
    showPalette(d,lists[k].map(x=>x.hex));
  }

}
async function test65_changeColors(){
  console.log(w3color('red'))
  let colors = getColormapColors();
	let d = clearBodyDiv({ gap: 10 }); mFlexWrap(d);
	let board = mColorPickerHex(d,colors);
  console.log(board);
  //return;
  //jetzt mach eine palette mit ryb colors
  //showPalette(d,colorSchemeRYB());

  // showPalette(d,levelColors);
  // showPalette(d,Object.values(playerColors));
  // showPalette(d,modernColors);
  // showPalette(d,vibrantColors);
  // showPalette(d,childrenRoomColors);
  // showPalette(d,deepRichColors);

  let list = levelColors.concat(modernColors.concat(Object.values(playerColors).concat(vibrantColors.concat(childrenRoomColors.concat(deepRichColors)))));
  list = list.map(x=>w3color(x));
  list.map(x=>x.hex=x.toHexString());
  //list = sortBy(list,'lightness');
  //list = list.map(x=>x.toHexString());
  let newlist = sortByFunc(list,x=>x.lightness);

  console.log(newlist[1]);
  mDom(d,{bg:newlist[1].hex,w:50,h:50});

  //list = sortByHue(list);
  //list = sortByLum(list);
  showPalette(d,list);

}
async function test64_colorhex(){
  let colors = getColormapColors(); // generateRYBColorHexagon();
  di={
    '#ccbb00':'#FFE119'
  };
  let newColors = [], cnew;
  for(const c of colors){
    let wc=w3color(c);
    let hue = wc.hue;
    let sat = wc.sat*100;
    let lum = wc.lightness*100;
    //console.log(hue,sat,lum);
    let m=hue%30;
    if (isdef(di[c])) cnew = di[c];
    else if (m>25 || m<5){
      let inc=isCloseTo(hue,60)?-3:isCloseTo(hue,0)?5:10;
      hue=(hue+inc)%360;
      cnew=colorToHex79(`hsl(${hue},${sat},${lum})`);
    }else cnew=c;
    newColors.push(cnew);
    //break;
  }
	let d = clearBodyReset100({ gap: 10 }); mFlexWrap(d);
	let board = mColorPickerHex(d,newColors);

  let board2 = mColorPickerHex(d,colors);

}
async function test63_mColorPicker1(){
  colorSchemeRYB();
  return;
	let d = clearBodyReset100({ gap: 10 }); mFlexWrap(d);
	let board = mColorPickerBoard(d);

}
async function test62_mColorPicker(){
	let d = clearBodyReset100({ gap: 10 }); mFlexWrap(d);
	let cpi = mColorPicker(d);
  cpi.setColor();

  //let dhue = mDom(d);
  // hslTable(mDom(d),'hue',cpi.getColor(),0);
  // hslTable(mDom(d),'sat',cpi.getColor(),0);
  // hslTable(mDom(d),'light',cpi.getColor(),0);

}
async function test61_w3Colorpicker(){
  await loadAssets();
  let d = clearBodyReset100({ bg: 'skyblue', overy: 'scroll' }, { id: 'dPage' });
  mDom(d,{},{tag:'input',type:'color'});
}
async function test60_genauerTesten(){
  let c;
  c={h:0,s:1,l:.5}; console.log(colorHsl01ObjectToHex79(c),'(=? ff0000)'); 
  c={h:0,s:100,l:50}; console.log(colorHsl360ObjectToHex79(c),'(=? ff0000)'); 
  c={h:360,s:100,l:50}; console.log(colorHsl360ObjectToHex79(c),'(=? ff0000)'); 
  c='hsl(360,100%,50%)'; console.log(colorHsl360StringToHex79(c),'(=? ff0000)'); 
  c='hsla(360,100%,50%,.5)'; console.log(colorHsl360StringToHex79(c),'(=? ff000080)'); 

  let clist = [{h:0,s:1,l:.5},'deeppink'];
  for(const c of clist){
    console.log('_________',c)
    //let hex = hsl01ObjectToHex79(c); console.log('hex',hex); 

    hex = colorToHex79(c); console.log('hex',hex); 
  }

}
async function test59_ColorDi() {
  ensureColorDict();
  console.log(ColorDi); //entries string: c:hexcolor,[ E:english name, D:german name ]
}
async function test58_color() {
  //await prelims();
  document.body.style.backgroundColor = '#ffff00'; //BLUEGREEN;
  console.log(document.body);
  console.log(document.body.style.backgroundColor);
  //ja ist ja irre! colors werden automatisch in rgb verwandelt!
}
async function test57_colorFrom() {
  //testing anyToHex79
  // let clist = ["#ff0000","#f00",'rgb(255,122,122)', 'rgba(255,122,122,0.5)', [255, 122, 122, 0.5], { r: 255, g: 122, b: 122, a: 0.5 }];
  // for (const c of clist) console.log(c, anyToHex79(c));
  // console.log('____________'); 
  // clist=  ['hsla(300,50%,50%,.5)', { h: 300, s: 50, l: 50 }, hsl360ArgsToHsl01Object(300,50,50,.5)];
  // for (const c of clist) console.log('from',c,'=>', anyToHex79(c));

  let clist = [{h:0,s:1,l:.5}]; //'hsl(0,1,.5)',]; //'#ff0000']; //,BLUEGREEN,'blue','deeppink'];
  //red sollte in hsl360 sein [0,1,.5]
  // for (const c of clist) console.log('from',c,'=>', anyToHex79(c));


  for(const c of clist){
    console.log('_________',c)
    let hex = colorHsl01ObjectToHex79(c); console.log('hex',hex); 
    // let s=hexToHsl360String(hex); console.log('hsl string',s);
    // let hex2=hsl360StringToHex79(s);console.log('hex',hex2); 
    // break;

    // let ch = hexToHsl360String(c0); console.log('hsl',c,ch)
    // let c1 = hsl360StringToHex79(ch); console.log('hsl',c,c1)
    // let cr = hexToRgbString(c0); console.log('rgb',c,cr)
    // let c2 = rgbStringToHex79(cr); 
    // assertion(c0 == c1 && c0 == c2,`ERROR! ${c}: ${c0} ${c1} ${c2}`);
  }

  return;
  console.log(colorHexToRgbArray('#ffff00')); // damit da eine valid hsl rauskommt muss ich h*=360,s*=100,l*=100 nehmen

  let c = '#ffff00';
  for (const c of range(0, 10).map(x => rColor())) {
    let x = colorHexToHsl01Array(c);
    let y = colorHsl01ArrayToHsl360Object(x);
    let x2 = colorFrom(y);
    console.log(c, '=', x2); // damit da eine valid hsl rauskommt muss ich h*=360,s*=100,l*=100 nehmen
  }
}
async function test56_colorthief() {
  ColorThiefObject = new ColorThief();
  console.log(ColorThiefObject);
}
async function test55_cleanUsers() {
  await prelims();
  let users = await mGetRoute('users');
  console.log('users', users);
  for (const name in users) {
    let u = users[name];
    //u.texture = 
    //['button','button98','button97'].map(x=>delete u[x]);
    //await 
  }
}
async function test54_dynBody() {
  let html = `
	<div style="position:fixed;width:100%;z-index:20000">
		<div id="dNav" class="nav p10"></div>
		<div id="dMessage" style='height:0px;padding-left:10px' class="transh"></div>
	</div>
	<div id="dBuffer" style="height:32px;width:100%"></div>
	<div id="dExtra" class="p10hide"></div>
	<div id="dTitle"></div>
	<div id="dPage" style="display:grid;grid-template-columns: auto 1fr auto;">
		<div id="dLeft" class="h100 over0 translow">
		</div>
		<div id="dMain"></div>
		<div id="dRight" class="h100 over0 translow"></div>
	</div>
	<d id="dBottom"></d>
  
  `;
  document.body.innerHTML = html;
  await prelims(); //return;
  M.playerColors = loadPlayerColors(); return;
  console.log(M.playerColors)
  U = await postUserChange({ name: U.name, color: BLUEGREEN, texture: '../assets/textures/marble_gold.jpeg', bgBlend: 'multiply' });
  console.log(U)
  await switchToUser('mimi');
  await switchToMenu(UI.nav, 'settings');

  //console.log(U)
  //setTimeout(colorsUpdate,200)

}
async function test53_clearReset() {
  await loadAssets();
  let d = clearBodyReset100({ bg: 'skyblue', overy: 'scroll' }, { id: 'dPage' });
  mClass(d, 'wood');

}
async function test52() {
  await loadAssets();
  let d = clearBodyDiv({ w: '100vw', h: '100vh' }, { id: 'dPage' });
  // mStyle(d,{'background-blend-mode': 'multiply','background-size':'cover'})
  // let d1=mDom(d,{border:'white',position:'absolute',w:500,h:320,left:700,top:100,'background-blend-mode': 'luminosity','background-size':'cover'},{id:'dPos'})
  mDom(d, {}, { id: 'dTitle' });
  mDom(d, {}, { id: 'dMain' });
  showColors();
  // d=mDom(d,{gap:4},{id:'dSamples'});mCenterFlex(d)
  // let list='normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
  // console.log('list',list.length)
  // for(const [i,mode] of list.entries()){
  //   let id = `dSample${i}`;
  //   mDom(d,{border:'white',w:100,h:100,'background-blend-mode': mode,'background-repeat':'repeat'},{id});
  // }
  // multiply screen overlay darken lighten
}
async function test51() {
  await prelims();
  //await switchToOtherUser('amanda','felix'); // 'diana');
  // await switchToMenu(UI.nav, 'play');
  // await clickFirstTable();
  //showThemeWood();
  console.log(UI.nav)
  await switchToMenu(UI.nav, 'colors');
}
