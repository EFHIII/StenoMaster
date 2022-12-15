// #^STKPWHRAO*EUFRPBLGTSDZ
function shortToLongSteno(str) {
  let ans = {
    '#': /[0-9]/.test(str),
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
      } else if(finalNumbers.indexOf(str[i]) >= 0) {
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
  if(str['*']) ans += '*';
  if(!str['*'] && !str['A'] && !str['O'] && !str['E'] && !str['U']) ans += '-';
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
    ans = ans.replace('-', '');
  }

  return basicToPlover(ans);
}

function stenoToStenoTape(steno) {
  let ans = [];
  let strokes = steno.replace(/\//g,' ').split(' ');
  for(let stroke of strokes) {
    let str = stroke.slice();

    const numberTranslation = {
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

    for(let number in numberTranslation) {
      if(str.indexOf(number) >= 0) {
        if(str[0] !== '#') {
          str = '#' + str;
        }
        str = str.replace(number, numberTranslation[number]);
      }
    }

    let stenoOrder = '#STKPWHRAO*EUFRPBLGTSDZ';

    for(let i = 0; i < stenoOrder.length; i++) {
      if(i > 10) {
        if(str[i] === '-') {
          str = str.substring(0, i) + str.substring(i + 1);
        }
      }
      if(str[i] !== stenoOrder[i]) {
        str = str.substring(0, i) + ' ' + str.substring(i);
      }
    }

    ans.push(str);
  }
  return ans;
}

function stenoTapeToSteno(steno) {
  let ans = '';
  for(let stroke of steno) {
    if(stroke.length < 23) {
      stroke = ' ' + stroke;
    }
    if(stroke[0] === '#') {
      stroke = ' ' +
      ((stroke[1]+stroke[2]+stroke[4]+stroke[6]+stroke[9]+stroke[13]+stroke[15]+stroke[17]+stroke[19] === '         ') ? '#' : '') +
      (stroke[1] === ' ' ? ' ' : '1') +
      (stroke[2] === ' ' ? ' ' : '2') + stroke[3] +
      (stroke[4] === ' ' ? ' ' : '3') + stroke[5] +
      (stroke[6] === ' ' ? ' ' : '4') + stroke[7] +
      (stroke[8] === ' ' ? ' ' : '5') +
      (stroke[9] === ' ' ? ' ' : '0') + stroke.slice(10, 13) +
      (stroke[13] === ' ' ? ' ' : '6') + stroke[14] +
      (stroke[15] === ' ' ? ' ' : '7') + stroke[16] +
      (stroke[17] === ' ' ? ' ' : '8') + stroke[18] +
      (stroke[19] === ' ' ? ' ' : '9') + stroke.slice(20);
    }

    ans += stroke.slice(0, 13).replace(/ /g,'');
    if(stroke.slice(13).replace(/ /g, '').length === 0) {
      ans += ' ';
      continue;
    }
    if(stroke.slice(8, 13).replace(/ /g,'').length === 0) {
      ans += '-';
    }
    ans += stroke.slice(13).replace(/ /g,'') + ' ';
  }
  return ans.slice(0, -1);
}

function basicToPlover(steno) {
  return (stenoTapeToSteno(stenoToStenoTape(steno.replace(/\^/g,'S')))
  .replace(/^-([6-9])/,'$1').replace(/([1-4])-([6-9])/,'$1$2'));
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
    '#': '#',
    '^': '^',
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

  for(let char of word) {
    if(/\d/.test(char)) {
      ans['#'] = true;
      ans[numberTranslation[char]] = true;
      continue;
    }
    if(!conversion.hasOwnProperty(char)) {
      throw (`error\nin ${word}\n${char} not convertable`);
    }
    ans[conversion[char]] = true;
  }

  return ans;
}

function toPlover(word) {
  return LongToShortSteno(MasterToLongSteno(word));
}
