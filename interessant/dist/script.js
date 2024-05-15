const $context = document.querySelector('.js-picker');
const $title = document.querySelector('.js-picker__colorValue');
const $subtitle = document.querySelector('.js-picker__colorName');
const $cursor = document.querySelector('.js-cursor');

// global X/Y cursor position
let x = 0;let y = 0;
let cursor = { x: 0, y: 0, z: 0 };

// mouseCoordinates <-> color system mapping
let axis = { x: 'h', y: 'l', z: 's' };

// global RAF ticking status
let ticking = false;

// initial color
let color = chroma($title.innerHTML);

// color system information
let hsl = {
  h: color.get('hsl.h'),
  s: color.get('hsl.s'),
  l: color.get('hsl.l') };



function place(e) {
  let h = e.pageX / $context.clientWidth;
  let l = e.pageY / $context.clientHeight;
  let $el = document.createElement('div');
  $el.classList.add('picked');
  $el.style.background = color.hex();
  $el.style.left = `${h * 100}%`;
  $el.style.top = `${l * 100}%`;
  $context.appendChild($el);
}

function moveCursor(e) {
  hsl[axis.x] = x = e.pageX / Math.round($context.clientWidth * 0.99);
  hsl[axis.y] = y = e.pageY / Math.round($context.clientHeight * 0.99);
  requestTick();
}

function wheelEvent(e) {
  const delta = (e.wheelDelta || e.detail || e.originalEvent.wheelDelta || e.originalEvent.detail) > 0 ? 0.01 : -0.01;
  hsl[axis.z] = Math.max(0, Math.min(1, hsl[axis.z] - delta));
  requestTick();
}

let oldHex;

function tick() {
  let hex = color.set('hsl', [hsl.h * 360, hsl.s, hsl.l]).hex();
  if (hex !== oldHex) {
    $context.style.background = hex;
    $context.style.color = color.luminance() < .4 ? '#fff' : '#000';
    $title.innerHTML = hex;
    $subtitle.innerHTML = getClosestNamedColor(hex).name;
    oldHex = hex;
  }
  $cursor.style.top = `${y * 100}%`;
  $cursor.style.left = `${x * 100}%`;
  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(tick);
    ticking = true;
  }
}

function zigzag(n, max) {
  return max - Math.abs(n % (2 * max) - max);
}

if (!('ontouchstart' in document.documentElement)) {
  document.documentElement.addEventListener("mousemove", moveCursor);
  document.documentElement.addEventListener("click", place);
  $context.addEventListener("mousewheel", wheelEvent, false);
  $context.addEventListener("DOMMouseScroll", wheelEvent, false);
} else {
  let xyTouch = new Hammer($context);
  xyTouch.get('pan').set({ direction: Hammer.DIRECTION_ALL });
  xyTouch.on("panleft panright panup pandown", ev => {
    hsl[axis.x] = x = ev.pointers[0].pageX / $context.clientWidth;
    hsl[axis.y] = y = ev.pointers[0].pageY / $context.clientHeight;
    /*
    let deltaY = ev.deltaY > 0 ? 0.00001 : -0.00001;
    let deltaX = ev.deltaX > 0 ? 0.01 : -0.01;
    */
    requestTick();
  });
  let zTouch = new Hammer($context);
  zTouch.get('pan').set({ direction: Hammer.DIRECTION_ALL, pointers: 2 });
  zTouch.on("panup pandown", ev => {
    let delta = ev.deltaY > 0 ? 0.01 : -0.01;
    hsl[axis.z] = Math.max(0, Math.min(1, hsl[axis.z] - delta));
    requestTick();
  });
}