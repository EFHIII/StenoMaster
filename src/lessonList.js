let mc;

function toggleFolder(e) {
  console.log(e.target);
  let at = e.target;
  mc = at;
  if(at.classList[0] === 'deleteFolder') {
    while(at.classList[0] !== 'folder') {
      at = at.parentElement;
    }
    delete lessons[at.dataset.name];
    saveStorage();
    at.parentElement.remove();
    return;
  }
  while(at.classList[0] !== 'folder') {
    at = at.parentElement;
  }
  let visible = at.parentElement.children[1].style.display === '';
  at.children[0].innerText = visible ? '▸' : '▾';
  at.parentElement.children[1].style.display = visible ? 'none' : '';
}

function updateLessonList() {
  let updated = '';
  for(let folderName in lessons) {
    let folder = lessons[folderName];
    updated +=
      `<div>
        <span class='folder' data-name='${folderName}'><span class='colapse'>▾</span>${folderName} <span class='deleteFolder'>✖</span></span>
      <div>`;
    for(let lesson of folder) {
      let tried = lessonProgress.hasOwnProperty(lesson.name);
      let completed = tried ? lessonProgress[lesson.name].completed : 0;
      let repeated = completed >= lesson.repetitions;
      let accurately = tried ? lessonProgress[lesson.name].accurateCompleted : 0;
      updated +=
        `<span class='lessonLinkInfo' ${repeated && accurately > 0 ? `style='color:green'` : ``}>` +
        `${repeated ? `${accurately}` : `${completed}/${lesson.repetitions}`}` +
        `&nbsp;</span><span class='lessonLinkName'>` +
        `<a class='lessonLink' href='?lesson=` +
        lesson.name.replace(/ /g, '-') +
        (
          autoAdvance ?
          (repetitions === 10 ? '' : '&repetitions=' + repetitions) +
          (accuracyTarget === 96 ? '' : '&accuracy=' + accuracyTarget) +
          (atAccuracy === 1 ? '' : '&at-accuracy=' + atAccuracy) :
          '&auto-advance=false'
        ) +
        `'>` +
        `${lesson.name}</a> ` +
        `${tried ? `<span class='lessonLinkBest'> ${lessonProgress[lesson.name].fastest} WPM</span>` : ''}` +
        `</span><br>`;
    }
    updated += `</div></div>`;
  }
  lessonList.innerHTML = updated;
  document.querySelectorAll('.folder').forEach(el => el.addEventListener('click', toggleFolder));
  if(Object.keys(lessons).length > 1 && Object.keys(lessons).map(a=>lessons[a].length).reduce((a,b)=>a+b) > 20) {
    document.querySelectorAll('.folder').forEach(el => el.click());
  }
}

function loadProblems() {
  let txt = `<div class="customLinks"><a href="?pyramid=true">Pyramid Drill</a><br>` +
    `Problem Words</div><br>`;
  let total = 0;
  let bad = [];
  for(let word in problemWords) {
    let accuracy = 1 - problemWords[word][0] / problemWords[word][1];
    if(accuracy < 0.98) {
      let acTemp = accuracy;
      let color = 'green';
      if(accuracy < 0.7) {
        color = 'Crimson';
      } else if(accuracy < 0.8) {
        color = 'DarkOrange';
      } else if(accuracy < 0.9) {
        color = 'OliveDrab';
      }
      accuracy = (accuracy * 1000 >> 0) / 10;
      bad.push([acTemp, `<div style='text-align:right;'><span style='color: ${color}'>${accuracy}% </span><span style='width: 50%;display:inline-block;'>${word}&nbsp;</span></div><div style='text-align:left;'>&nbsp;/${problemWords[word][2].join('/').replace(/\^/g,'S')}</div>`]);
      total++;
    }
  }
  if(total == 0) {
    txt = `<div>No problem words</div>`;
  } else {
    bad = bad.sort((a, b) => a[0] - b[0]);
    for(let word of bad) {
      txt += word[1];
    }
  }
  sceneDivs.problems.innerHTML = txt;
}

function deleteLessons() {
  if(!/^(y|yes)$/i.test(prompt('Are you sure you want to delete every lesson?\nYes/No').trim())) return;
  lessons = {};
  saveStorage();
  updateLessonList();
};

document.getElementById('deleteLessons').addEventListener('click', deleteLessons);

updateLessonList();
