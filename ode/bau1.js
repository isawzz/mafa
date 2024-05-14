function calcRestHeight(dtop){
  let hwin=window.innerHeight;
  let r=getRect(dtop);
  let top=r.y; //console.log('top',top);
  let hmax=hwin-top-20;
  return hmax;
}
async function showColors() {

  let d=mBy('dSettingsColor');mClear(d);
  let di = M.dicolor;
  for (const bucket in di) {
    let list = dict2list(di[bucket]);
    let clist = [];
    for (const c of list) {
      let o = w3color(c.value);
      o.name = c.id;
      o.hex = c.value;
      clist.push(o);
    }
    let sorted = sortByFunc(clist, x => -x.lightness);
    mDom(d, {}, { html: `<br>${bucket}<br>` });
    _showPaletteNames(d, sorted);
  }

  let divs = document.getElementsByClassName('colorbox');
  for (const div of divs) {
    mStyle(div,{cursor:'pointer'})
    div.onclick =async()=>onclickColor(div.getAttribute('dataColor')); 
  }
}








