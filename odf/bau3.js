function menuAdd(dParent, key, html, handler) {
	if (nundef(html)) html = capitalize(key);
	if (nundef(handler)) handler = window[`onclick${html}`];
	let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	let a = mDom(d, {}, { tag: 'a', href: '#', html: html, className: 'nav-link', onclick: handler })
}

