
function cSet() {

}

function setgame() {
	function setup(table) {
		let fen = {};
		fen.players = {};
		for (const o of table.players) {
			let pl = fen.players[o.name] = o;
			pl.score = 0;
		}
		fen.deck = setCreateDeck();
		fen.cards = deckDeal(fen.deck,12);
		fen.turn = jsCopy(table.playerNames); // alle zugleich dran
		return fen;
	}
	function checkGameover(table) { 
		return table.playerNames.some(x=>x.score == table.options.winning_score);
	}
	function present(table, name) { setPresent(table, name); } //if (nundef(name)) name = U.name; showMessage(`BINGO!!! ${table.friendly} view ${name}`); } 
	return { setup, checkGameover, present };
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
function setPresent(table, name) {
	mClear('dMain');
	let d = mDom('dMain', { margin: 10, bg: '#00000080' }); mCenterCenterFlex(d)
	//mDom(d, { fz: 100, fg: 'white' }, { html: `we are playing ${getGameFriendly(table.game)}!!!!` })

	let [fen,playerNames,players,turn]=[table.fen,table.playerNames,table.fen.players,table.fen.turn];
	let cards = fen.cards;
	let dBoard=mGrid(cards.length/3,3,d,{gap:4});
	for(const c of cards){
		//mDom(dBoard,{},{html:c})
		setDrawCard(dBoard,c); break;
	}

}
function setDrawCard(dParent,card){
	const paths = {
		diamond: {
			d: "M25 0 L50 50 L25 100 L0 50 Z"
		},
		squiggle: {
			d: "M38.4,63.4c0,16.1,11,19.9,10.6,28.3c-0.5,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z"
		},
		oval: {
			d: "M25,99.5C14.2,99.5,5.5,90.8,5.5,80V20C5.5,9.2,14.2,0.5,25,0.5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,99.5,25,99.5z"
		}
	}
	const colors = {
		red: '#e74c3c',
		green: '#27ae60',
		purple: '#8e44ad'
	};
	const makeSVG = function(tag, attrs) {
		var el= "<" + tag;
		for (var k in attrs)
			el += " " + k + "=\"" + attrs[k] + "\"";
		return el + "/>";
	}
	
  let shapes = '';
	console.log('card',card);

	let [color,shape,number,fill]=card.split('_');
	fill='solid'
	number=Number(number);
  var attr = paths[shape];
  if(fill=="striped"){
    attr.fill = 'url(#striped-'+color+')';
  } else if(fill=="open"){
    attr.fill = 'none';
  } else if(fill=="solid"){
    attr.fill = colors[color];
  }
  for(var i=0;i<number;i++){
    shapes += '<svg viewbox="-2 -2 54 104">' + makeSVG("path", attr) + '</svg>';
		break;
  }
	let html = '<div class="card1 fill-red"><div class="card-content">' + shapes + '</div>'+ '</div>';

	html=`<div class="card1 fill-red fadeIn"><div class="card-content"><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg><svg viewBox="-2 -2 54 104"><path d="M25 0 L50 50 L25 100 L0 50 Z" fill="#e74c3c"></path></svg></div></div>`
	console.log(html);
	let d=mCreateFrom(html)
	mStyle(dParent,{margin:10,padding:10,bg:'black'})
	mAppend(dParent,d);
	// mAppend(dParent,mDom(null,{w:100,h:100,bg:'red'}));
	// return;
	//let d=mDom(dParent,{},{className:'card fill-'+color, html:'<div class="card-content">' + shapes + '</div>'});
	//let d1=mDom(d,{},{className:'card-content'})
  // var dcard = $("<div />", {
  //   class: 'card fill-'+color,
  //   html: '<div class="card-content">' + shapes + '</div>'
  // }).data("color", color)
  //   .data("shape", shape)
  //   .data("number", number)
  //   .data("fill", fill);
	// console.log(dcard)
	// dParent.append(dcard[0])
  return d;
}

















