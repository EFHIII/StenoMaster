const FIXED_DELAY = 20;

function updateProgressText() {
  if(!lessonProgress.hasOwnProperty(lessons[onFolder][onLesson].name)) {
    lessonProgress[lessons[onFolder][onLesson].name] = {
      completed: 0,
      fastest: 0,
      accurateCompleted: 0
    };
  }
  progressDiv.innerHTML = autoAdvance ?
    `${lessons[onFolder][onLesson].name} ` +
    (
      lessons[onFolder][onLesson].repetitions - lessonProgress[lessons[onFolder][onLesson].name].completed > repetitions - progressStatus[0] ?
      `<span style='color:white'>${lessonProgress[lessons[onFolder][onLesson].name].completed}/${lessons[onFolder][onLesson].repetitions}</span> ` :
      `<span style='color:white'>${progressStatus[0]}/${repetitions}</span> `
    ) +
    `with <span style='color:white'>${progressStatus[1]}/${atAccuracy}</span>` +
    ` at ${accuracyTarget}%` :
    lessons[onFolder][onLesson].name;
}

function fixAddedSpans(txt, typed) {
  if(!typed) return escapeHtml(txt);
  if(typed) return escapeHtml(txt).replace(/class='phrase'>/g, "class='phrase typed'>");
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
      let order = [];
      let reverseStack = [];
      let reversing = false;
      for(let r = 0; r < wordParts.length; r++) {
        if(wordParts[r].indexOf('<r>') === 0) {
          reversing = true;
        }
        if(wordParts[r].indexOf('</r>') === 0) {
          reversing = false;
          order.push(...reverseStack);
          reverseStack = [];
        }
        if(reversing) {
          reverseStack.unshift(r);
        }
        else {
          order.push(r);
        }
        if(wordParts[r].indexOf('<r>') > 0) {
          reversing = true;
        }
        if(wordParts[r].indexOf('</r>') > 0) {
          reversing = false;
          order.push(...reverseStack);
          reverseStack = [];
        }
      }

      wordParts = wordParts.map(a => a.replace(/<\/?r>/g,''));

      textHTML += `<span id='lesson-${i}'>`;
      for(let part = 0; part < wordParts.length; part++) {
        textHTML += `<span class='phrase${lessonStroke > order[part] ? ' typed' : ''}'>${fixAddedSpans(wordParts[order[part]], lessonStroke > order[part])}</span>`;
      }
      textHTML += `</span>`;
    } else {
      textHTML += `<span class='phrase${lessonPhrase > i ? ' typed' : ''}' id = 'lesson-${i}'>${fixAddedSpans(lessonText[i].replace(/\x00/g, '').slice(1), lessonPhrase > i)}</span>`;
    }
    if(open && i < lessonText.length - 1 && lessonText[i + 1][0] === ' ') {
      textHTML += `</span>`;
      open = false;
    }
    if(i < lessonText.length - 1 && lessonText[i + 1][0] === ' ') {
      textHTML += `<span class='${lessonPhrase > i + 1 || lessonPhrase > i && lessonStroke > 0 ? 'typed' : ''}'> </span>`;
    }
  }
  if(open) {
    textHTML += `</span>`;
  }
  text.innerHTML = textHTML;
  let nextPhrase = document.getElementById(`lesson-${lessonPhrase}`);
  if(nextPhrase) {
    nextPhrase.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

function updateStats() {
  let minutes = (Date.now() - startingTime) / 1000 / 60;
  let strokes = lessonStrokes.reduce((a, b) => a + b.length, 0);
  let accuracy = (((strokes - mistakes) / strokes * 1000) >> 0) / 10;

  // word = two strokes
  //let wpm = ((strokes / 2 / minutes * 10) >> 0) / 10;
  // word = txt with alpha/num
  //let wpm = (lessonText.filter(a => /[\w\d]/.test(a)).reduce((a, b) => a + b.slice(1).split(' ').length, 0) / minutes * 10 >> 0) / 10;
  // word = 5 chars
  let wpm = ((lessonText.join('').replace(/<\/?\w>/g, '').length / 5 / minutes * 10) >> 0) / 10;
  accuracyDiv.innerText = `${accuracy}%`;
  wpmDiv.innerText = `${wpm} WPM`;

  progressStatus[0]++;
  if((strokes - mistakes) / strokes >= accuracyTarget / 100) {
    progressStatus[1]++;
  }

  if(pyramidWords) {
    continuePyramid();
  } else if(onLesson < 0) {

  } else if(lessonProgress.hasOwnProperty(lessons[onFolder][onLesson].name)) {
    lessonProgress[lessons[onFolder][onLesson].name] = {
      completed: lessonProgress[lessons[onFolder][onLesson].name].completed + 1,
      fastest: (strokes - mistakes) / strokes >= 0.96 ? Math.max(lessonProgress[lessons[onFolder][onLesson].name].fastest, wpm) : lessonProgress[lessons[onFolder][onLesson].name].fastest,
      accurateCompleted: lessonProgress[lessons[onFolder][onLesson].name].accurateCompleted +
        ((strokes - mistakes) / strokes >= 0.96 ? 1 : 0)
    };
    updateProgressText();
  } else {
    lessonProgress[lessons[onFolder][onLesson].name] = {
      completed: 1,
      fastest: wpm,
      accurateCompleted: (strokes - mistakes) / strokes >= 0.96
    };
    updateProgressText();
  }

  saveStorage();

  if(autoAdvance && progressStatus[0] >= repetitions && progressStatus[1] >= atAccuracy &&
    lessonProgress[lessons[onFolder][onLesson].name].completed >= lessons[onFolder][onLesson].repetitions) {
    onLesson++;
    file = null;
    progressStatus = [0, 0];
    setTimeout(_ => {
      wpmDiv.innerText = 'N/A';
      accuracyDiv.innerText = 'N/A';
    }, 2000);
  }

  if(!pyramidWords) {
    setTimeout(_ => loadLesson(onLesson), 2000);
  }
}

function displayStroke() {
  let stroke = shortToLongSteno(lessonStrokes[lessonPhrase][lessonStroke]);
  if(stroke['S'] && (stroke['#'] || (lessonStrokes[lessonPhrase][lessonStroke] === 'STPH'))) {
    stroke['S'] = false;
    stroke['^'] = true;
  }
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

function draw(skip) {
  if((skip !== 'skip' && Date.now() - t < FIXED_DELAY) || txt === ' ' || txt === ' -') {
    window.requestAnimationFrame(draw);
    return;
  }
  willDraw = false;
  if(' 1234567890'.indexOf(txt[0]) < 0) {
    console.log(`invalid: ${txt}`);
    txt = '';
    return;
  }
  if(txt[0] === ' ') {
    txt = txt.slice(1);
  }

  if(!isSteno.test(txt)) {
    console.log(`failed: ${txt}`);
    txt = '';
    return;
  }

  if(txt === lessonStrokes[lessonPhrase][lessonStroke].replace('^', 'S')) {
    pushStenoTape(txt);
    hideStroke();
    if(lessonPhrase === 0 && lessonStroke === 0) {
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
    } else {
      drawtoLessonText();
    }
  } else if(!recentMistake) {
    pushStenoTape(txt, true);
    mistakes++;
    recentMistake = true;
    displayStroke();
    logWord([
      lessonText[lessonPhrase],
      lessonStrokes[lessonPhrase]
    ], true);
  }
  else {
    pushStenoTape(txt, true);
  }

  txt = '';
}

function keydown(event) {
  if(event.key === ' ') {
    event.preventDefault();
  }
  if(event.key === 'Escape') {
    setTimeout(_ => window.location.href = window.location.href.replace(/\?.+/, ''), 0);
    return;
  }
  if(scene !== 'lesson' && scene !== 'pyramid') {
    return;
  }

  if(event.key === 'Backspace' && Date.now() - t > FIXED_DELAY) {
    pushStenoTape('*');
    t = Date.now();
    return;
  }

  if(willDraw && event.key === ' ') {
    draw('skip');
  }

  if(event.key === 'PageUp') {
    onLesson = (onLesson + lessons[onFolder].length - 1) % lessons[onFolder].length;
    file = null;
    progressStatus = [0, 0];
    loadLesson(onLesson);
    return;
  }

  if(event.key === 'PageDown') {
    onLesson = (onLesson + 1) % lessons[onFolder].length;
    file = null;
    progressStatus = [0, 0];
    loadLesson(onLesson);
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

let isNumber = false;

function stenoToHTMLMap(steno, id) {
  return(`<span class='${steno === ' ' ? 'inactive' : 'active'}Steno'>` +
  `${isNumber ? StenoNumberKeys[id] : StenoKeys[id]}</span>`);
}

//#STKPWHRAO*EUFRPBLGTSDZ
function stenoToHTMLTape(steno, mistake) {
  isNumber = stenoToStenoTape(steno)[0][0] === '#';
  let ans = stenoToStenoTape(steno)[0].split('')
  .map(stenoToHTMLMap).join('');
  if(mistake) {
    ans = ans.replace(/'activeSteno'/g, "'activeStenoMistake'");
  }
  return ans;
}

let stenoTapeLog = new Array(12).fill(stenoToHTMLTape(''));

function pushStenoTape(steno, mistake = false) {
  stenoLastStroke.innerHTML = mistake ? `<span class='activeStenoMistake'>${steno}</span>`: steno
  stenoTapeLog.shift();
  stenoTapeLog.push(stenoToHTMLTape(steno, mistake));
  stenoTape.innerHTML = stenoTapeLog.join('<br>');
}
stenoTape.innerHTML = stenoTapeLog.join('<br>');

document.addEventListener('keydown', keydown);
