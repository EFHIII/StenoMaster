function changeScene(toScene) {
  switch(toScene) {
    case 'lesson':
      loadLesson(onLesson);
      break;
    case 'problems':
      loadProblems();
      break;
    case 'pyramid':
      generatePyramid();
      break;
  }
  for(let div in sceneDivs) {
    if(div !== toScene) {
      sceneDivs[div].style.display = 'none';
    }
  }
  for(let div in sceneDivs) {
    if(div === toScene) {
      sceneDivs[div].style.display = 'block';
    }
  }
  scene = toScene;
}

(new URL(window.location.href)).searchParams.forEach((value, name) => {
  let lessonNames = Object.keys(lessons).map(a=>lessons[a].map(a=>a.name.replace(/-/g, ' ')));
  switch(name) {
    case 'problems':
      if(value.toLowerCase() === 'true') {
        scene = 'problems';
      }
      break;
    case 'pyramid':
      if(value.toLowerCase() === 'true') {
        scene = 'pyramid';
      }
      break;
    case 'lesson':
      if(lessonNames.flat().indexOf(value.replace(/-/g, ' ')) >= 0) {
        let index = lessonNames.flat().indexOf(value.replace(/-/g, ' '));
        let at = 0;
        while(index >= lessonNames[at].length) {
          index -= lessonNames[at].length;
          at++;
        }
        onFolder = Object.keys(lessons)[at];
        onLesson = lessonNames[Object.keys(lessons).indexOf(onFolder)].indexOf(value.replace(/-/g, ' '));
        scene = 'lesson';
      }
      break;
    case 'auto-advance':
      if(value.toLowerCase() === 'false') {
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

document.getElementById('accuracyTarget').addEventListener('blur', (event) => {
  let val = Math.max(96, Math.min(100, parseInt(event.target.value)));
  if(event.target.value != val) event.target.value = val
  if(val >= 96 && val <= 100) {
    accuracyTarget = val;
    updateLessonList();
  }
});

document.getElementById('repetitions').addEventListener('blur', (event) => {
  let val = Math.max(1, Math.min(100, parseInt(event.target.value)));
  if(event.target.value != val) event.target.value = val
  if(val >= 1 && val <= 100) {
    repetitions = val;
    updateLessonList();
  }
});

document.getElementById('atAccuracy').addEventListener('blur', (event) => {
  let val = Math.max(1, Math.min(100, parseInt(event.target.value)));
  if(event.target.value != val) event.target.value = val
  if(val >= 1 && val <= 100) {
    atAccuracy = val;
    updateLessonList();
  }
});

changeScene(scene);
