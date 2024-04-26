onload = start;

async function start() { TESTING = true; test51(); }

async function test51() {
  await prelims(); 
  await switchToOtherUser('mimi', 'amanda','gul');
  await switchToMenu(UI.nav, 'play');
}
