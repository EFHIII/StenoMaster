let text = document.getElementById('text');
let keyboard = document.getElementById('keyboard');

let t = Date.now();

let txt = '';
let willDraw = false;

// #STKPWHRAO*EUFRPBLGTSDZ
function shortToLongSteno(str) {
  let ans = {
    '#': false,
    'S': false,
    'T': false,
    'K': false,
    'P': false,
    'W': false,
    'H': false,
    'R': false,
    'A': false,
    'O': false,
    '*': false,
    'E': false,
    'U': false,
    '-F': false,
    '-R': false,
    '-P': false,
    '-B': false,
    '-L': false,
    '-G': false,
    '-T': false,
    '-S': false,
    '-D': false,
    '-Z': false,
  };

  let initial = '#STKPWHR';
  let vowel = 'AO*EU-';
  let final = 'FRPBLGTSDZ';

  let at = 'start';

  for(let i = 0; i < str.length; i++) {
    if(at == 'start') {
      if(initial.indexOf(str[i]) >= 0) {
        ans[str[i]] = true;
      }
      else if(vowel.indexOf(str[i]) >= 0) {
        if(str[i] !== '-') {
          ans[str[i]] = true;
        }
        at = 'end';
      }
    }
    else if(vowel.indexOf(str[i]) >= 0) {
      ans[str[i]] = true;
    }
    else if(final.indexOf(str[i]) >= 0) {
      ans['-' + str[i]] = true;
    }
  }

  return ans;
}

function draw() {
  if(Date.now() - t < 12) {
    window.requestAnimationFrame(draw);
    return;
  }
  willDraw = false;

  console.log(txt);
  txt = '';
}

function keydown(event) {
  if(event.key !== 'Shift') {
    txt += event.key;
  }
  t = Date.now();

  if(!willDraw) {
    willDraw = true;
    window.requestAnimationFrame(draw);
  }
}

document.addEventListener('keydown', keydown);
