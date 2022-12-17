let storageName = 'EFHIII_SM';

function getStorage(cname) {
  return localStorage.getItem(cname) || "";
}

let problemWords = JSON.parse(getStorage(storageName)).problemWords;

let myDictionaryRaw = {};

for(let word in problemWords) {
  myDictionaryRaw[problemWords[word][2].join('/')] = word.replace(/\x00/g,'/');
}

let staticSteno = {
  'AE': "{^~|'}",
  'OEUS': "{~|'^}",
  'TK-RB/TK-RB': '--',
  'HEUF': '{^-^}',
  'OEU': '{~|"^}',
  'AEZ': "{^'s}",
  'OEUS/OEUS': "{^~|'}",
  'OEU/OEU': '{^~|"}',
  'KOL/KOL': '{^:^}',
  '-FPLT/-FPLT': '{^:}',
  '-FPLT/RBGS': '{^;}',
  '-FPLT': '{.}',
  'STP': '/',
  'P-T': '{&.}',
  'SP-T': '{.^}',
  'STPH': '{?}',
  '-RBGS': '{,}',
  '-Z': '{^s}'
};

for(let key in staticSteno) {
  myDictionaryRaw[key] = staticSteno[key];
}

let txt = document.getElementById('txt');
let dict = document.getElementById('dict');
let errors = document.getElementById('errors');
let result = document.getElementById('txt-result');
let download = document.getElementById('download');

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

dict.innerHTML = escapeHtml(JSON.stringify(myDictionaryRaw, 0, 1).replace(/\n /g, '\n'));


let waiting = false;
let waitingTimeout;
function update(wait = false) {
  if(wait) {
    if(waiting) {
      waiting = Date.now();
      clearTimeout(waitingTimeout);
      waitingTimeout = setTimeout(update, 300);
    }
    else {
      waiting = Date.now();
      waitingTimeout = setTimeout(update, 300);
    }
    return;
  }

  clearTimeout(waitingTimeout);
  waiting = false;
  download.style.display = 'none';

  try {
    myDictionaryRaw = JSON.parse(dict.value);
  }
  catch(e) {
    errors.innerHTML = `<span class='error'>Malformed Dictionary</span>`;
    if(/in JSON at position/.test(e.message)) {
      let erp = parseInt(e.message.slice(e.message.indexOf('in JSON at position') + 20));
      let errt = dict.value.split('\n');

      let at = 0;
      let onLine = 0;
      let index = 0;
      for(let i = 0; i < errt.length && at <= erp; i++) {
        at += errt[i].length + 1;
        onLine++;
      }
      if(onLine > 0) {
        at -= errt[onLine - 1].length + 1;
      }
      index = erp - at;

      result.innerHTML = errt.slice(onLine - 2, onLine).join('\n') +
      '\n' +
      new Array(index + 1).fill('').join(' ') + '^\n' +
      errt.slice(onLine, onLine + 1).join('\n');
    }
    else {
      result.innerHTML = e.message;
    }
    return;
  }

  for(let key in myDictionaryRaw) {
    if(!isSteno.test(key)) {
      errors.innerHTML = `<span class='error'>Invalid Steno</span>`;
      result.innerHTML = key;
      return;
    }
  }

  let myDictionary = new Dictionary();

  myDictionary.addDictionary(myDictionaryRaw);

  let nxt;
  try {
    nxt = myDictionary.nextMissingEntry(txt.value.trim());
  }
  catch(e) {
    errors.innerHTML = ``;
    result.innerHTML = ``;
    console.error(e);
    return;
  }
  if(nxt.missing) {
    errors.innerHTML = `<span class='error'>Missing Dictionary Entry: "${nxt.word}"</span>`;
    result.innerHTML = nxt.string.slice(Math.max(0, nxt.index - 20), nxt.index + 20) +
    '\n' +
    new Array(Math.min(nxt.index + 1, 21)).fill('').join(' ') + '^';
    return;
  }

  let grouped = myDictionary.toStenoGrouped(txt.value.trim());

  let groupedWords = [[...grouped[0]]];
  for(let i = 1; i < grouped.length; i++) {
    if(grouped[i][0][0] === ' ' ||
    /^\s*([^\w\d]+ ?)+$/.test(grouped[i][0]) ||
    /^\s*([^\w\d]+ ?)+$/.test(groupedWords[groupedWords.length - 1][0])) {
      groupedWords.push([...grouped[i]]);
    }
    else {
      groupedWords[groupedWords.length - 1][0] += '/' + grouped[i][0];
      groupedWords[groupedWords.length - 1][1] += '/' + grouped[i][1];
    }
  }

  for(let group in groupedWords) {
    if(!groupedWords[group][1].match(/\//g) || groupedWords[group][1].match(/\//g).length === 1) continue;
    if(groupedWords[group][0].match(/\//g).length !== groupedWords[group][1].match(/\//g).length) {
      groupedWords[group][0] = groupedWords[group][0].replace(/\//g, '');
    }
  }

  let longest = groupedWords.reduce((a, b) => Math.max(b[1].length, a), 0);

  errors.innerHTML = ``;
  result.innerHTML = groupedWords.map(a => a[1].padEnd(longest, ' ') + '│' + a[0]+'\n').join('');
  download.style.display = 'inline';
}

function downloadLesson() {
  let grouped;
  try {
    let myDictionary = new Dictionary();
    myDictionary.addDictionary(myDictionaryRaw);
    grouped = myDictionary.toStenoGrouped(txt.value.trim());
  } catch(e) {
    return;
  }

  let groupedWords = [[...grouped[0]]];
  for(let i = 1; i < grouped.length; i++) {
    if(grouped[i][0][0] === ' ' ||
    /^\s*([^\w\d]+ ?)+$/.test(grouped[i][0]) ||
    /^\s*([^\w\d]+ ?)+$/.test(groupedWords[groupedWords.length - 1][0])) {
      groupedWords.push([...grouped[i]]);
    }
    else {
      groupedWords[groupedWords.length - 1][0] += '/' + grouped[i][0];
      groupedWords[groupedWords.length - 1][1] += '/' + grouped[i][1];
    }
  }

  for(let group in groupedWords) {
    if(!groupedWords[group][1].match(/\//g) || groupedWords[group][1].match(/\//g).length === 1) continue;
    if(groupedWords[group][0].match(/\//g).length !== groupedWords[group][1].match(/\//g).length) {
      groupedWords[group][0] = groupedWords[group][0].replace(/\//g, '');
    }
  }

  for(let group in groupedWords) {
    groupedWords[group][1] = groupedWords[group][1].replace(/\//g, ' ');
  }

  groupedWords = groupedWords.map(a => a[0].trim() + '\n ' + (a[0][0] === ' ' ? '' : '/') + a[1]);

  groupedWords[0] = groupedWords[0].replace('\n /','\n ');

  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(groupedWords.join('\n'));
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "my-lesson.txt");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

document.addEventListener('keydown', _ => update(true));

download.addEventListener('click', _ => downloadLesson());
