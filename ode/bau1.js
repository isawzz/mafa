
async function settingsOpen(){
  console.log('open Settings!!!'); mClear('dMain');

	let di=M.dicolor,d=mDom('dMain',{padding:12});
  for(const bucket in di){
    let list = dict2list(di[bucket]);
    let clist=[];
    for(const c of list){
      let o=w3color(c.value);
      //console.log('c',c)
      o.name = c.id;
      o.hex = c.value;
      clist.push(o);
    }

    let sorted = sortByFunc(clist,x=>-x.lightness); //(10*x.lightness+x.sat*100));
    //console.log(sorted[0]); return;

    mDom(d,{},{html:`<br>${bucket}<br>`})
    showPaletteNames(d,sorted);
    
  }

  let divs=document.getElementsByClassName('colorbox');
  for(const div of divs){
    div.onclick=async()=>{
      setColors(div.getAttribute('dataColor'));
      let c=getCSSVariable('--bgBody');
      let hex = colorToHex79(c);
      U.color = hex;
      await postUserChange();
    
    }
    //console.log('HAAAAAAALLLO',div);break;

  }



}
async function settingsClose(){
  //uebernimm current color!
  console.log('close Settings!!!'); mClear('dMain');
}


