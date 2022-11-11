let text = document.getElementById('text');
let keyboard = document.getElementById('keyboard');
let accuracy = document.getElementById('accuracy');
let wpm = document.getElementById('wpm');

let t = Date.now();

let txt = '';
let willDraw = false;

let lessonText = [];
let lessonStrokes = [];
let lessonPhrase = 0;
let lessonStroke = 0;
let mistakes = 0;
let startingTime = 0;

function getFile(file, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType("text/plain");

  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState == XMLHttpRequest.DONE) {
      if(xmlhttp.status == 200) {
        callback(xmlhttp.responseText);
      } else if(xmlhttp.status == 400) {
        console.error('There was an error 400');
      } else {
        console.error(`error ${xmlhttp.status} was returned`);
      }
    }
  };

  xmlhttp.open("GET", file, true);
  xmlhttp.send();
}

function loadLessonText(txt) {
  lessonText = [];
  lessonStrokes = [];
  let lines = txt.split('\n');
  for(let i = 0; i < lines.length - 1; i += 2) {
    lessonText.push(lines[i].replace(/\r/g,''));
    lessonStrokes.push(lines[i + 1].replace(/\r/g,'').split(' ').slice(1));
  }
  lessonPhrase = 0;
  lessonStroke = 0;
  drawLessonText();
}

let onLesson = 0;
function loadLesson(id) {
  onLesson = id % lessons.length;
  getFile('lessons/' + lessons[onLesson] + '.txt', loadLessonText);
}

loadLesson(onLesson);

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

  if(!str) {
    return ans;
  }

  let numberTranslation = {
    '0': 'O',
    '1': 'S',
    '2': 'T',
    '3': 'P',
    '4': 'H',
    '5': 'A',
    '6': '-F',
    '7': '-P',
    '8': '-L',
    '9': '-T',
  };

  let initial = '#STKPWHR';
  let initialNumbers = '1234';
  let vowel = 'AO*EU-';
  let vowelNumbers = '50';
  let final = 'FRPBLGTSDZ';
  let finalNumbers = '6789';

  let at = 'start';

  for(let i = 0; i < str.length; i++) {
    if(at == 'start') {
      if(initial.indexOf(str[i]) >= 0) {
        ans[str[i]] = true;
      } else if(initialNumbers.indexOf(str[i]) >= 0) {
        ans['#'] = true;
        ans[numberTranslation[str[i]]] = true;
      } else if(vowel.indexOf(str[i]) >= 0) {
        if(str[i] !== '-') {
          ans[str[i]] = true;
        }
        at = 'end';
      } else if(vowelNumbers.indexOf(str[i]) >= 0) {
        ans[numberTranslation[str[i]]] = true;
        at = 'end';
      }
    } else if(vowel.indexOf(str[i]) >= 0) {
      ans[str[i]] = true;
    } else if(vowelNumbers.indexOf(str[i]) >= 0) {
      ans[numberTranslation[str[i]]] = true;
    } else if(final.indexOf(str[i]) >= 0) {
      ans['-' + str[i]] = true;
    } else if(finalNumbers.indexOf(str[i]) >= 0) {
      ans[numberTranslation[str[i]]] = true;
    }
  }

  return ans;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function drawLessonText() {
  let textHTML = '';
  for(let i = 0; i < lessonText.length; i++) {
    textHTML += `<span class='phrase${lessonPhrase>i?' typed':''}' id = 'lesson-${i}'>${escapeHtml(lessonText[i])}</span>`;
    if(i < lessonText.length - 1) {
      textHTML += `<span class='${lessonPhrase>i+1?'typed':''}'> </span>`;
    }
  }
  text.innerHTML = textHTML;
  document.getElementById(`lesson-${lessonPhrase}`).scrollIntoView({behavior: 'smooth'});
}

function updateStats() {
  let minutes = (Date.now() - startingTime) / 1000 / 60;
  let strokes = lessonStrokes.reduce((a, b) => a + b.length, 0);
  accuracy.innerText = `${(((strokes - mistakes) / strokes * 1000) >> 0 ) / 10}%`;
  wpm.innerText = `${((strokes / 2 / minutes * 10) >> 0) / 10} WPM`;

  if(mistakes === 0) {
    loadLesson(onLesson + 1);
  }
}

function displayStroke() {
  let stroke = shortToLongSteno(lessonStrokes[lessonPhrase][lessonStroke]);
  for(let key in stroke) {
    if(!stroke[key]) continue;
    let keys = document.getElementsByClassName('steno'+key);
    for(let div of keys) {
      div.style.backgroundColor = 'grey';
    }
  }
}

function hideStroke() {
  for(let key in shortToLongSteno('')) {
    let keys = document.getElementsByClassName('steno'+key);
    for(let div of keys) {
      div.style.backgroundColor = '';
    }
  }
}

function draw() {
  if(Date.now() - t < 12) {
    window.requestAnimationFrame(draw);
    return;
  }
  willDraw = false;
  if(' 1234567890'.indexOf(txt[0]) < 0 || txt === ' ') {
    txt = '';
    return;
  }

  if(txt.slice(1) == lessonStrokes[lessonPhrase][lessonStroke]) {
    hideStroke();
    if(lessonPhrase == 0 && lessonStroke == 0) {
      startingTime = Date.now();
    }
    lessonStroke++;
    if(lessonStroke >= lessonStrokes[lessonPhrase].length) {
      lessonStroke = 0;
      lessonPhrase++;
      if(lessonPhrase >= lessonStrokes.length) {
        updateStats();
        mistakes = 0;
        lessonStroke = 0;
        lessonPhrase = 0;
      }
    }
    drawLessonText();
  }
  else{
    mistakes++;
    displayStroke();
  }

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
