// local storage
function setStorage(cname, cvalue) {
  localStorage.setItem(cname, cvalue);
}

function getStorage(cname) {
  return localStorage.getItem(cname) || "";
}

function logWord(wordA, mistake) {
  let word = [wordA[0].slice(1).replace(/<\/?u>/g, ''), wordA[1]];
  if(!/\w/.test(word)) return;
  let simpler = word[0].toLowerCase().replace(/<\/?[ib]>/g, '');
  if(simpler !== word[0] &&
    problemWords.hasOwnProperty(simpler) &&
    word[1].join('/') === problemWords[simpler][2].join('/')) {
    if(mistake) {
      problemWords[simpler][0]++;
    } else {
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
  } else {
    problemWords[word[0]][1]++;
  }
}

function saveStorage() {
  if(!makeSaves) return;
  let storage = {
    lessons: lessons,
    lessonProgress: lessonProgress,
    problemWords: problemWords,
    version: version,
  };
  //console.log(JSON.stringify(storage));
  setStorage(storageName, JSON.stringify(storage));
}

function loadStorage() {
  let storage = getStorage(storageName);
  if(storage) {
    try {
      storage = JSON.parse(storage);
      let storageVersion = 0;
      for(let v in storage) {
        switch(v) {
          case 'version':
            storageVersion = storage[v];
            break;
          case 'lessons':
            lessons = storage[v];
            break;
          case 'lessonProgress':
            lessonProgress = storage[v];
            break;
          case 'problemWords':
            problemWords = storage[v];
            if(scene == 'problems') {
              loadProblems();
            }
            break;
          default:
            console.log(`${v} deprecated`);
        }
      }
      if(storageVersion < version) {
        // fix storage
        lessons = [];
        lessonProgress = {};
        problemWords = {};
      }
    } catch (e) {
      console.error(e);
    }
  }
}

loadStorage();
