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
  U = await postUserChange({ name: U.name, color: BLUEGREEN, texture: '../assets/textures/marble_gold.jpeg', blend: 'multiply' });
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
