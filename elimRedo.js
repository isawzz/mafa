async function onclickUpload() {
  let img = UI.img;
  let name = valnwhite(UI.imgName.value, rUID('img'));
  let unique = isdef(M.superdi[name]) ? rUID('img') : name;
  unique = normalizeString(unique);
  let coll = valnwhite(UI.imgColl.value, 'other');
  let dataUrl = imgToDataUrl(img);
  let o = { image: dataUrl, name: name, unique: unique, coll: coll, path: unique + '.png', ext: 'png' };
  let resp = await mPostRoute('postImage', o);
  console.log('resp', resp)
  await collectAddUploadedImages(); //TODO muss eigentlich nur das eine img adden!
  M.collections.sort();
  M.categories.sort();
  M.names.sort();
}
