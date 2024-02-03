function collClear(){closeLeftSidebar();clearMain();}

function collSidebar(){

  mStyle('dLeft',{wmin:100});
  let d=mDom('dLeft',{margin:10}); //,fg:getThemeFg()});

  let c1=mDom(d,{padding:4},{html:'new collection',className:'nav-link activeLink'})

  //let t1=toggleAdd('left','arrow_down_long',iDiv(UI.nav).l,{hpadding:9,vpadding:5},{w:0,wmin:0},{wmin:100});

  //mStyle('dLeft',{w:100})
  // let collMenu = mDom('dLeft');
  // let c1=mDom(collMenu,{},{html:'new collection'})
}
function closeLeftSidebar(){
  mClear('dLeft');mStyle('dLeft',{w:0,wmin:0})
}
function mDatalist(dParent, list, opts = {}) {
  var mylist = list;
  var opts = opts; addKeys({ alpha: true, filter: 'contains' }, opts);
  let elem = mDiv(toElem(dParent));
  let optid = getUID('dl');
  var inp = mDom(elem, { w: 200 }, { tag: 'input', className: 'input',  });
  var datalist = mDom(elem, {}, { tag: 'datalist', id: optid, className: 'datalist' });
  for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
  inp.setAttribute('list', optid);
  if (opts.edit){ //onupdate) {
		inp.placeholder = "<enter value>";
		inp.addEventListener('keyup', opts.onupdate); 
	}	else {
		inp.addEventListener('keydown', function(e) {
			if (!['ArrowDown', 'ArrowUp', 'Backspace', 'Delete'].includes(e.code)) {
					e.preventDefault();
			}
		});
		inp.placeholder = '<select from list>'
		inp.onmousedown = () => inp.value = ''

		//inp.setAttribute('readonly',true)
	}
  return {
    list: mylist,
    elem: elem,
    inpElem: inp,
    listElem: datalist,
    opts: opts,
  }
}


