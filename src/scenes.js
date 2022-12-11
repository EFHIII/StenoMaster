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
  let lessonNames = lessons.map(a => a.name);
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
      if(lessonNames.indexOf(value.replace(/-/g, ' ')) >= 0) {
        onLesson = lessonNames.indexOf(value.replace(/-/g, ' '));
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

changeScene(scene);
