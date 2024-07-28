onload=start;

async function start() { await test2_zusammen(); }

async function test2_articles(){
  //let 
}
async function test2_zusammen(){
  let dir='../wikisaves/filenofile20';
  let files=await mGetFiles(dir,3001);
  files.sort();
  let di={},nodi={};
  for(const f of files){
    let o=await mGetYaml(`${dir}/${f}`);
    if (f.startsWith('file')) addKeys(o,di); else break;//addKeys(o,nodi);
  }
  downloadAsYaml(di,'di');

}
async function test1_quoteFrom(){
  let d=clearFlex();
  let title='Johann Sebastian Bach'; //'Wolfgang Amadeus Mozart';
  let result = await mGetRoute(`quotes/${encodeURIComponent(title)}`,null,3001);
  console.log('was',result);
  d.innerHTML = result;

  let q=[];
  let lis=Array.from(d.querySelectorAll('li'));
  lis = Array.from(document.querySelectorAll('div>ul>li'));  
  console.log(lis);
  for(const li of lis){
    let text = li.textContent;
    let parts = splitAtAnyOf(text,'\n(')
    q.push(parts[0]); 
  }
  console.log(q)

  
}
async function test1_quote(){
  clearFlex();
  let url = 'http://localhost:3001/testquote';
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });

  let res = tryJSONParse(await response.text());
  console.log('was',res);

  
}
async function test0(){

  //console.log('hhhhhhhhhhhhhhh'); return;
	// let res = await mGetRoute('city'); //,{title:'Vienna'});
  let server = getServerurl();
  server += `/city/vienna`;
  //for (const k in o) { server += `${k}=${o[k]}&`; }
  const response = await fetch(server, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });
  let res = tryJSONParse(await response.text());

  console.log('hallo!!!!!!!!!!!!!!!!!!!')
	console.log(res);
	mBy('result').innerHTML = res.text._;

	
}
