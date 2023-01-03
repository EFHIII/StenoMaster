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
      const file = files[0];
      document.getElementById('filetext').textContent = file.name;
      parseFile(file);
    }
  })
}

function continuePyramid() {
  pyramidWordsDone++;

  if(pyramidWordsDone > pyramidWords[0].length) {
    generatePyramid();
    return;
  }

  progressDiv.innerHTML = `Pyramid <span style='color:white'>${pyramidWordsDone}</span> word${pyramidWordsDone > 1 ? 's' : ''}`;

  //text.style.textAlign = 'center';

  lessonText = pyramidWords[0].slice(0, pyramidWordsDone);
  lessonStrokes = pyramidWords[1].slice(0, pyramidWordsDone);

  lessonPhrase = 0;
  lessonStroke = 0;
  mistakes = 0;
  recentMistake = false
  autoAdvance = false;
  drawtoLessonText();
}

function generatePyramid() {
  let words = Object.keys(problemWords).filter(a => /[\w\d]/.test(a));
  if(words.length === 0) {
    setTimeout(_ => changeScene('lessonSelect'), 0);
    return;
  }

  words = words.map(a => {
    return [a, (problemWords[a][0] + 10) / Math.max(1, problemWords[a][1])];
  });
  let sumWeight = words.reduce((a, b) => a + b[1], 0);
  let myPyramid = [];
  let myPyramidSteno = [];

  while(words.length > 0) {
    let val = Math.random() * sumWeight;
    let at = 0;
    for(let i = 0; i < words.length; i++) {
      at += words[i][1];
      if(at > val) {
        myPyramid.push(words[i][0]);
        myPyramidSteno.push(problemWords[words[i][0]][2]);
        sumWeight -= words[i][1];
        words.splice(i, 1);
        break;
      }
    }
  }

  myPyramid = myPyramid.map(a => {
    if(/ /.test(a)) {
      return ' <u>' + a + '</u>';
    }
    return ' ' + a;
  })

  pyramidWords = [myPyramid, myPyramidSteno];
  pyramidWordsDone = 0;
  continuePyramid();
}

function parseFile(file) {
  //read the file
  const reader = new FileReader()
  reader.onload = function(e) {
    if(e.target.result[0] === '[') {
      try {
        let newLessons = JSON.parse(e.target.result);
        for(let lesson of newLessons) {
          if(lessons.map(JSON.stringify).indexOf(JSON.stringify(lesson)) < 0) {
            lessons.push(lesson);
          }
        }
        updateLessonList();
        saveStorage();
      } catch (e) {
        console.error(e);
        alert('Error: bad file');
      }
      return;
    }
    makeSaves = false;
    onLesson = 0;
    lessons.unshift({
      name: file.name.replace(/\..+/, ''),
      repetitions: 10
    });
    if(e.target.result.indexOf('\x00') > 0) {
      readSMFile(e.target.result);
    } else {
      readEFHFile(e.target.result);
    }
  }
  reader.readAsText(file);
}

let qq;

function readSMFile(file, static = true) {
  let f = file;
  qq = file;
  f = f.replace(/\r/g, '');
  f = f.split('\n');

  let out = '';

  for(let line of f) {

    console.log(line);

    let txt = line.trim().replace('beneficial\x00pWEPB\x00tpEURBL', 'beneficial\x00pWEPB\x00EF\x00EURBL');
    txt = txt.replace('apparent\x00A\x00pAEURPBT', 'apparent\x00A\x00pAEUR\x00EPBT');

    console.log(txt);


    txt = txt.split('\x00');

    for(let t in txt) {
      txt[t] = txt[t].trim().replace(/([a-z0-9])\s+([a-z0-9])/gi,'$1 $2');
    }

    while(txt[txt.length - 1] == '') {
      txt.pop();
    }

    if(txt.length === 0) continue;

    if(txt[0].indexOf('<') >= 0) {
      txt[0] = `**${txt[0]}**`;
    }

    let strokes = txt.slice(1).join(' ');

    if(txt[0].trim().indexOf(' ') > 0 &&
      (
        strokes.indexOf(' ') < 0 ||
        (
          !/ (FPLT|stpH|RBGS|OEU|OEUS|pPL|AEPL)$/.test(strokes) &&
          !/^(OEUS|OEU|AE) /.test(strokes) &&
          !/^\d+ \w+.?$/.test(txt[0].trim()) &&
          !/^\w+ \d+.?$/.test(txt[0].trim())
        )
      )) {
      txt[0] = `_${txt[0].trim()}_`;
    }

    out += txt.shift();
    out += '\n';
    for(let word in txt) {
      txt[word] = toPlover(txt[word]);
    }
    out += ' ' + txt.join(' ');
    out += '\n';
  }

  readEFHFile(out, static);
}

function readEFHFile(file, static = true) {
  if(static) {
    autoAdvance = false;
    document.getElementById('autoAdvance').checked = false;
  }

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
