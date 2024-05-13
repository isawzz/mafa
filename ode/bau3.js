
async function onclickBlendMode(item) {

  //console.log('WASSSSSSSSSSSSSS'); //return;
	U.bgImage = item.bgImage;
	U.bgBlend = item.bgBlend;
	U.bgSize = item.bgSize;
	U.bgRepeat = item.bgRepeat;

	setTexture(item);

  await postUserChange(U,);
}





