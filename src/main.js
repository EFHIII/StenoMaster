/* TODO:

auto-generate pyramid drills

from problem words, randomly choose N words (default: 10)

chance of being chosen: m = mistakes, t = total
weighted value:
(m + 10) / (t - m / 2 + 1)
*/

let cookieName = 'EFHIII_SM';
let version = 1;

let autoAdvance = true;
let onLesson = 0;
let scene = 'lessonSelect';

let repetitions = 10;
let accuracyTarget = 96;
let atAccuracy = 1;

let lessonText = [];
let lessonStrokes = [];
let lessonPhrase = 0;
let lessonStroke = 0;
let mistakes = 0;
let problemWords = {};

let sceneDivs = {
  lesson: document.getElementById('lesson'),
  lessonSelect: document.getElementById('lessonSelect'),
  problems: document.getElementById('problems'),
};

function changeScene(toScene) {
  switch(toScene) {
    case 'lesson':
      loadLesson(onLesson);
      break;
    case 'problems':
      loadProblems();
      break;
  }
  for(let div in sceneDivs) {
    if(div == toScene) {
      sceneDivs[div].style.display = 'block';
      continue;
    }
    sceneDivs[div].style.display = 'none';
  }
  scene = toScene;
}

(new URL(window.location.href)).searchParams.forEach((value, name) => {
  let lessonNames = lessons.map(a => a.name);
  switch(name) {
    case 'problems':
      if(lessonNames.indexOf(value)) {
        scene = 'problems';
      }
      break;
    case 'lesson':
      if(lessonNames.indexOf(value) >= 0) {
        onLesson = lessonNames.indexOf(value);
        scene = 'lesson';
      }
      break;
    case 'auto-advance':
      if(value.toLowerCase() == 'false') {
        autoAdvance = false;
      }
      break;
    case 'repetitions':
      if(parseInt(value) >= 1 && parseInt(value) <= 100) {
        repetitions = parseInt(value);
      }
      break;
    case 'accuracy':
      if(parseInt(value) >= 96 && parseInt(value) <= 100) {
        accuracyTarget = parseInt(value);
      }
      break;
    case 'at-accuracy':
      if(parseInt(value) >= 1 && parseInt(value) <= 100) {
        atAccuracy = parseInt(value);
      }
      break;
  }
});

changeScene(scene);

//cookies
function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while(c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if(c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

let lessonProgress = {};

function logWord(word, mistake) {
  let simpler = word[0].toLowerCase().replace(/<\/?[uib]>/g,'');
  if(simpler !== word[0] &&
    problemWords.hasOwnProperty(simpler) &&
    word[1].join('/') === problemWords[simpler][2].join('/')) {
    if(mistake) {
      problemWords[simpler][0]++;
    }
    else {
      problemWords[simpler][1]++;
    }
    if(problemWords.hasOwnProperty(word[0])) {
      problemWords[simpler][0] += problemWords[word[0]][0];
      problemWords[simpler][1] += problemWords[word[0]][1];
      delete problemWords[word[0]];
    }
    return;
  }
  if(!problemWords.hasOwnProperty(word[0])) {
    // [mistakes, total]
    problemWords[word[0]] = [0, 0, word[1]];
  }
  if(mistake) {
    problemWords[word[0]][0]++;
  }
  else {
    problemWords[word[0]][1]++;
  }
}

function saveCookie() {
  let cookie = {
    lessonProgress: lessonProgress,
    problemWords: problemWords,
    version: version,
  };
  //console.log(JSON.stringify(cookie));
  setCookie(cookieName, JSON.stringify(cookie), 365 * 200);
}

function loadCookie() {
  let cookie = getCookie(cookieName);
  if(cookie) {
    try {
      cookie = JSON.parse(cookie);
      let cookieVersion = 0;
      for(let v in cookie) {
        switch (v) {
          case 'version':
            cookieVersion = cookie[v];
            break;
          case 'lessonProgress':
            lessonProgress = cookie[v];
            break;
          case 'problemWords':
            problemWords = cookie[v];
            if(scene == 'problems') {
              loadProblems();
            }
            break;
          default:
            console.log(`${v} deprecated`);
        }
      }
      if(cookieVersion < version) {
        problemWords = {};
        lessonProgress = {};
        problemWords = {};
      }
    } catch (e) {
      console.error(e);
    }
  }
}
loadCookie();

let lessonList = document.getElementById('lessonList');

function toLessonText(lesson) {
  return lesson.name.slice(0,1).toUpperCase()+lesson.name.replace(/-/g,' ').slice(1);
}

function updateLessonList() {
  lessonList.innerHTML = '';
  for(let lesson of lessons) {
    let tried = lessonProgress.hasOwnProperty(lesson.name);
    let completed = tried ? lessonProgress[lesson.name].completed : 0;
    let repeated = completed >= lesson.repetitions;
    let accurately = tried ? lessonProgress[lesson.name].accurateCompleted : 0;
    lessonList.innerHTML +=
      `<span class='lessonLinkInfo' ${repeated && accurately > 0 ? `style='color:green'` : ``}>`+
      `${repeated ? `${accurately}` : `${completed}/${lesson.repetitions}`}`+
      `&nbsp;</span><span class='lessonLinkName'>`+
      `<a class='lessonLink' href='?lesson=` +
        lesson.name +
        (
          autoAdvance ?
          (repetitions === 10 ? '' : '&repetitions=' + repetitions) +
          (accuracyTarget === 96 ? '' : '&accuracy=' + accuracyTarget) +
          (atAccuracy === 1? '' : '&atAccuracy=' + atAccuracy) :
          '&auto-advance=false'
        ) +
        `'>`+
      `${toLessonText(lesson)}</a> `+
      `${tried ? `<span class='lessonLinkBest'> ${lessonProgress[lesson.name].fastest} WPM</span>` : ''}`+
      `</span><br>`;
  }
}

function loadProblems() {
  let txt = '<div>Problem Words</div><br>';
  let total = 0;
  let bad = [];
  for(let word in problemWords) {
    let accuracy = 1 - problemWords[word][0] / problemWords[word][1];
    if(accuracy < 0.98) {
      let acTemp = accuracy;
      let color = 'green';
      if(accuracy < 0.7) {
        color = 'Crimson';
      }
      else if(accuracy < 0.8) {
        color = 'DarkOrange';
      }
      else if(accuracy < 0.9) {
        color = 'OliveDrab';
      }
      accuracy = (accuracy * 1000 >> 0) / 10;
      bad.push([acTemp, `<div style='text-align:right;'><span style='color: ${color}'>${accuracy}% </span><span style='width: 50%;display:inline-block;'>${word.slice(1)}&nbsp;</span></div><div style='text-align:left;'>&nbsp;/${problemWords[word][2].join('/').replace(/\^/g,'S')}</div>`]);
      total++;
    }
  }
  if(total == 0) {
    txt = `<div>No problem words</div>`;
  }
  else {
    bad = bad.sort((a, b) => a[0] - b[0]);
    for(let word of bad) {
      txt += word[1];
    }
  }
  sceneDivs.problems.innerHTML = txt;
}

updateLessonList();

document.getElementById('autoAdvance').addEventListener('change', (event) => {
  autoAdvance = event.target.checked;
  document.getElementById('autoAdvanceSettings').style.display = autoAdvance ? 'block' : 'none';
  updateLessonList();
});

document.getElementById('accuracyTarget').addEventListener('change', (event) => {
  let val = parseInt(event.target.value);
  if(val >= 96 && val <= 100) {
    accuracyTarget = val;
    updateLessonList();
  }
});

document.getElementById('repetitions').addEventListener('change', (event) => {
  let val = parseInt(event.target.value);
  if(val >= 1 && val <= 100) {
    repetitions = val;
    updateLessonList();
  }
});

document.getElementById('atAccuracy').addEventListener('change', (event) => {
  let val = parseInt(event.target.value);
  if(val >= 1 && val <= 100) {
    atAccuracy = val;
    updateLessonList();
  }
});

let text = document.getElementById('text');
let keyboard = document.getElementById('keyboard');
let accuracyDiv = document.getElementById('accuracy');
let wpmDiv = document.getElementById('wpm');
let progressDiv = document.getElementById('progress');

let t = Date.now();

let txt = '';
let willDraw = false;

let startingTime = 0;
let progressStatus = [0, 0];
let recentMistake = false;

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

function updateProgressText() {
  if(!lessonProgress.hasOwnProperty(lessons[onLesson].name)) {
    lessonProgress[lessons[onLesson].name] = {
      completed: 0,
      fastest: 0,
      accurateCompleted: 0
    };
  }
  progressDiv.innerHTML = autoAdvance ?
    `${toLessonText(lessons[onLesson])} `+
    (
      lessons[onLesson].repetitions - lessonProgress[lessons[onLesson].name].completed > repetitions - progressStatus[0] ?
      `<span style='color:white'>${lessonProgress[lessons[onLesson].name].completed}/${lessons[onLesson].repetitions}</span> ` :
      `<span style='color:white'>${progressStatus[0]}/${repetitions}</span> `
    ) +
    `with <span style='color:white'>${progressStatus[1]}/${atAccuracy}</span>`+
    ` at ${accuracyTarget}%`
    :
    toLessonText(lessons[onLesson]);
}

function loadLessonText(txt) {
  lessonText = [];
  lessonStrokes = [];
  let lines = txt.split('\n');
  for(let i = 0; i < lines.length - 1; i += 2) {
    let regex = new RegExp('_.+?_','g');
    let line = lines[i].replace(/\r/g, '');
    line = line.replace(/([^\/])\//g, '$1\x00');
    line = line.replace(/\/\//g, '/');

    // underline
    let matches = line.match(regex) || [];
    for(let match of matches) {
      line = line.replace(match, match.replace('_','<u>').replace('_','</u>'));
    }
    // bold
    regex = new RegExp('\\*\\*.+?\\*\\*','g');
    matches = line.match(regex) || [];
    for(let match of matches) {
      line = line.replace(match, match.replace('**','<b>').replace('**','</b>'));
    }
    // italic
    regex = new RegExp('\\*.+?\\*','g');
    matches = line.match(regex) || [];
    for(let match of matches) {
      line = line.replace(match, match.replace('*','<i>').replace('*','</i>'));
    }

    let steno = lines[i + 1].replace(/\r/g, '').split(' ');

    while(steno.length > 0 && steno[0].length === 0) {
      steno.shift();
    }

    let strokes = lines[i + 1].replace(/[\r\/]/g, '').replace(/^\s+/, '');

    let hadStart = false;
    let startStrokes = ['OEUS', 'OEU', 'AE'];

    let done = false;
    while(!done) {
      done = true;
      for(let stroke of startStrokes) {
        let index = strokes.indexOf(stroke + ' ');
        if(index === 0) {
            lessonText.push((hadStart ? '/' : ' ') + line[0]);
            lessonStrokes.push(strokes.slice(0, index + stroke.length).split(' '));
            line = line.slice(1);
            strokes = strokes.slice(stroke.length + 1);
            done = false;
            hadStart = true;
            break;
        }
      }
    }

    let stopStrokes = ['OEUS OEUS', 'OEU OEU', '-FPLT -FPLT', '-FPLT RBGS', '-FPLT', 'STPH', '-RBGS'];

    let pushAfter = [];

    done = false;
    while(!done) {
      done = true;
      for(let stroke of stopStrokes) {
        let index = strokes.indexOf(' ' + stroke);
        if(index > 0 && index + stroke.length + 1 === strokes.length) {
          pushAfter.unshift([line[line.length - 1], strokes.slice(index + 1)]);
          line = line.slice(0, line.length - 1);
          strokes = strokes.slice(0, index);
          done = false;
          break;
        }
      }
    }

    if(steno[0][0] === '/') {
      hadStart = true;
    }

    if(/\w'\w/.test(line) && strokes.split(' ').length === 2) {
      line = line.replace(/(\w)'(\w)/, "$1\x00'$2");
    }

    lessonText.push((hadStart ? '/' : ' ') + line);
    lessonStrokes.push(strokes.split(' '));

    for(let i = 0; i < pushAfter.length; i++) {
      lessonText.push('/' + pushAfter[i][0]);
      lessonStrokes.push(pushAfter[i][1].split(' '));
    }
  }
  lessonPhrase = 0;
  lessonStroke = 0;
  mistakes = 0;
  recentMistake = false;
  updateProgressText();
  drawtoLessonText();
}

function loadLesson(id) {
  onLesson = id % lessons.length;
  getFile('lessons/' + lessons[onLesson].name + '.txt', loadLessonText);
}

// #^STKPWHRAO*EUFRPBLGTSDZ
function shortToLongSteno(str) {
  let ans = {
    '#': false,
    '^': false,
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
    '1': '^',
    '2': 'T',
    '3': 'P',
    '4': 'H',
    '5': 'A',
    '6': '-F',
    '7': '-P',
    '8': '-L',
    '9': '-T',
  };

  let initial = '#^STKPWHR';
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
    .replace(/'/g, "&#039;")
    .replace(/&lt;u&gt;/g, "<u>")
    .replace(/&lt;\/u&gt;/g, "</u>")
    .replace(/&lt;i&gt;/g, "<i>")
    .replace(/&lt;\/i&gt;/g, "</i>")
    .replace(/&lt;b&gt;/g, "<b>")
    .replace(/&lt;\/b&gt;/g, "</b>");
}

function drawtoLessonText() {
  let textHTML = '';
  let open = false;
  for(let i = 0; i < lessonText.length; i++) {
    if(!open && i < lessonText.length - 1 && lessonText[i + 1][0] === '/') {
      textHTML += `<span class='phrase'>`;
      open = true;
    }

    if(lessonPhrase === i && lessonStroke > 0 && lessonText[i].indexOf('\x00') > 0) {
      let wordParts = lessonText[i].slice(1).split('\x00');
      textHTML += `<span id='lesson-${i}'>`;
      for(let part = 0; part < wordParts.length; part++) {
        textHTML += `<span class='phrase${lessonStroke > part ? ' typed' : ''}'>${escapeHtml(wordParts[part])}</span>`;
      }
      textHTML += `</span>`;
    }
    else {
      textHTML += `<span class='phrase${lessonPhrase > i ? ' typed' : ''}' id = 'lesson-${i}'>${escapeHtml(lessonText[i].replace(/\x00/g, '').slice(1))}</span>`;
    }
    if(open && i < lessonText.length - 1 && lessonText[i + 1][0] === ' ') {
      textHTML += `</span>`;
      open = false;
    }
    if(i < lessonText.length - 1 && lessonText[i + 1][0] === ' ') {
      textHTML += `<span class='${lessonPhrase > i + 1 ? 'typed' : ''}'> </span>`;
    }
  }
  if(open) {
    textHTML += `</span>`;
  }
  text.innerHTML = textHTML;
  let nextPhrase = document.getElementById(`lesson-${lessonPhrase}`);
  if(nextPhrase){
      nextPhrase.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
}

function updateStats() {
  let minutes = (Date.now() - startingTime) / 1000 / 60;
  let strokes = lessonStrokes.reduce((a, b) => a + b.length, 0);
  let accuracy = (((strokes - mistakes) / strokes * 1000) >> 0 ) / 10;
  let wpm = ((strokes / 2 / minutes * 10) >> 0) / 10;
  accuracyDiv.innerText = `${accuracy}%`;
  wpmDiv.innerText = `${wpm} WPM`;

  progressStatus[0]++;
  if((strokes - mistakes) / strokes >= accuracyTarget / 100) {
    progressStatus[1]++;
  }

  if(lessonProgress.hasOwnProperty(lessons[onLesson].name)) {
    lessonProgress[lessons[onLesson].name] = {
      completed: lessonProgress[lessons[onLesson].name].completed + 1,
      fastest: (strokes - mistakes) / strokes >= 0.96 ? Math.max(lessonProgress[lessons[onLesson].name].fastest, wpm) : lessonProgress[lessons[onLesson].name].fastest,
      accurateCompleted: lessonProgress[lessons[onLesson].name].accurateCompleted +
        ((strokes - mistakes) / strokes >= 0.96 ? 1 : 0)
    };
  }
  else{
    lessonProgress[lessons[onLesson].name] = {
      completed: 1,
      fastest: wpm,
      accurateCompleted: (strokes - mistakes) / strokes >= 0.96
    };
  }

  updateProgressText();
  saveCookie();

  if(autoAdvance && progressStatus[0] >= repetitions && progressStatus[1] >= atAccuracy &&
    lessonProgress[lessons[onLesson].name].completed >= lessons[onLesson].repetitions) {
    onLesson++;
    progressStatus = [0, 0];
    setTimeout(_ => {
      wpmDiv.innerText = 'N/A';
      accuracyDiv.innerText = 'N/A';
    }, 2000);
  }

  setTimeout(_ => loadLesson(onLesson), 2000);
}

function displayStroke() {
  let stroke = shortToLongSteno(lessonStrokes[lessonPhrase][lessonStroke]);
  for(let key in stroke) {
    if(!stroke[key]) continue;
    let keys = document.getElementsByClassName('steno' + key);
    for(let div of keys) {
      div.style.backgroundColor = 'grey';
    }
  }
}

function hideStroke() {
  recentMistake = false;
  for(let key in shortToLongSteno('')) {
    let keys = document.getElementsByClassName('steno' + key);
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

  if(txt.slice(1) == lessonStrokes[lessonPhrase][lessonStroke].replace('^', 'S')) {
    hideStroke();
    if(lessonPhrase == 0 && lessonStroke == 0) {
      startingTime = Date.now();
    }
    lessonStroke++;
    if(lessonStroke >= lessonStrokes[lessonPhrase].length) {
      logWord([
        lessonText[lessonPhrase],
        lessonStrokes[lessonPhrase]
      ]);
      lessonStroke = 0;
      lessonPhrase++;
      drawtoLessonText();
      if(lessonPhrase >= lessonStrokes.length) {
        updateStats();
        mistakes = 0;
        lessonStroke = 0;
        lessonPhrase = 0;
      }
    }
    else {
      drawtoLessonText();
    }
  } else if(!recentMistake) {
    mistakes++;
    recentMistake = true;
    displayStroke();
    logWord([
      lessonText[lessonPhrase],
      lessonStrokes[lessonPhrase]
    ], true);
  }

  txt = '';
}

function keydown(event) {
  if(event.key === 'Escape') {
    window.location.href = window.location.href.replace(/\?.+/,'');
  }

  if(scene !== 'lesson') {
    return;
  }

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

// Read file
if(!(window.File && window.FileReader && window.FileList && window.Blob)) {
  document.getElementById('filetext').textContent = "Reading files not supported by this browser";
} else {
  const fileDrop = document.getElementById("filedrop")
  fileDrop.addEventListener("dragenter", () => fileDrop.classList.add("Hover"))
  fileDrop.addEventListener("dragleave", () => fileDrop.classList.remove("Hover"))
  fileDrop.addEventListener("drop", () => fileDrop.classList.remove("Hover"))
  document.getElementById("filedrop").addEventListener("change", e => {
    //get the files
    const files = e.target.files
    if(files.length > 0) {
      const file = files[0]
      document.getElementById('filetext').textContent = file.name
      parseFile(file)
    }
  })
}

function parseFile(file) {
  //read the file
  const reader = new FileReader()
  reader.onload = function(e) {
    lessons.unshift({
      name: file.name.replace(/\..+/,''),
      repetitions: 10
    });
    if(e.target.result.indexOf('\x00') > 0) {
      readSMFile(e.target.result);
    }
    else {
      readEFHFile(e.target.result);
    }
  }
  reader.readAsText(file);
}

function LongToShortSteno(str) {
  let ans = '';

  if(str['#']) ans += '#';
  if(str['^']) ans += '^';
  if(str['S']) ans += 'S';
  if(str['T']) ans += 'T';
  if(str['K']) ans += 'K';
  if(str['P']) ans += 'P';
  if(str['W']) ans += 'W';
  if(str['H']) ans += 'H';
  if(str['R']) ans += 'R';
  if(str['A']) ans += 'A';
  if(str['O']) ans += 'O';
  if(!str['A'] && !str['O'] && !str['E'] && !str['U']) ans += '-';
  if(str['E']) ans += 'E';
  if(str['U']) ans += 'U';
  if(str['-F']) ans += 'F';
  if(str['-R']) ans += 'R';
  if(str['-P']) ans += 'P';
  if(str['-B']) ans += 'B';
  if(str['-L']) ans += 'L';
  if(str['-G']) ans += 'G';
  if(str['-T']) ans += 'T';
  if(str['-S']) ans += 'S';
  if(str['-D']) ans += 'D';
  if(str['-Z']) ans += 'Z';

  if(ans[ans.length - 1] == '-') {
    ans = ans.replace('-','');
  }

  return ans;
}

function MasterToLongSteno(word) {
  let ans = {
    '#': false,
    '^': false,
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

  let conversion = {
    's': 'S',
    't': 'T',
    'K': 'K',
    'p': 'P',
    'W': 'W',
    'H': 'H',
    'r': 'R',
    'A': 'A',
    'O': 'O',
    '*': '*',
    'E': 'E',
    'U': 'U',
    'F': '-F',
    'R': '-R',
    'P': '-P',
    'B': '-B',
    'L': '-L',
    'G': '-G',
    'T': '-T',
    'S': '-S',
    'D': '-D',
    'Z': '-Z',
  };

  for(let char of word) {
    if(!conversion.hasOwnProperty(char)) {
      throw(`error\nin ${word}\n${char} not convertable`);
    }
    ans[conversion[char]] = true;
  }

  return ans;
}

function toPlover(word) {
  return LongToShortSteno(MasterToLongSteno(word));
}

function readSMFile(file) {
  let f = file;
  f = f.replace(/\r/g,'');
  f = f.replace(/SAL/g,'TEST');
  f = f.replace(/STPH/g,'^TPH');
  f = f.replace(/1/g,'#^');
  f = f.split('\n');

  let out = '';

  for(let line of f) {
    let txt = line.trim().split('\x00');
    if(txt == '') continue;
    while(txt[txt.length - 1] == '') {
      txt.pop();
    }

    out += txt.shift();
    out += '\n';
    for(let word in txt) {
      txt[word] = toPlover(txt[word]);
    }
    out += ' '+txt.join(' ');
    out += '\n';
  }

  readEFHFile(out);
}

function readEFHFile(file) {
  autoAdvance = false;
  document.getElementById('autoAdvance').checked = false;

  scene = 'lesson';
  for(let div in sceneDivs) {
    if(div == scene) {
      sceneDivs[div].style.display = 'block';
      continue;
    }
    sceneDivs[div].style.display = 'none';
  }
  loadLessonText(file);
}
