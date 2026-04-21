const fs = require('fs');
const path = require('path');

const enDir = path.join(__dirname, 'src/locales/en');
const viDir = path.join(__dirname, 'src/locales/vi');

function flattenObject(ob) {
    var toReturn = {};
    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;
        if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;
                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

try {
  const files = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
  let hasMissing = false;

  for (const file of files) {
    const enPath = path.join(enDir, file);
    const viPath = path.join(viDir, file);
    
    let enContent = {}, viContent = {};
    
    try {
        enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    } catch(err) {
        console.error(`Error reading ${file} in EN: ${err.message}`);
    }

    try {
        viContent = JSON.parse(fs.readFileSync(viPath, 'utf8'));
    } catch(err) {
        console.error(`Error reading ${file} in VI: ${err.message}`);
    }

    const enFlat = flattenObject(enContent);
    const viFlat = flattenObject(viContent);

    const enKeys = Object.keys(enFlat);
    const viKeys = Object.keys(viFlat);

    const missingInVi = enKeys.filter(k => !viKeys.includes(k));
    const missingInEn = viKeys.filter(k => !enKeys.includes(k));

    if (missingInVi.length > 0 || missingInEn.length > 0) {
      hasMissing = true;
      console.log('\n--- ' + file + ' ---');
      if (missingInVi.length > 0) {
        console.log('Missing in VI:');
        missingInVi.forEach(k => console.log('  ' + k));
      }
      if (missingInEn.length > 0) {
        console.log('Missing in EN:');
        missingInEn.forEach(k => console.log('  ' + k));
      }
    }
  }

  if (!hasMissing) {
    console.log('\nSUCCESS: All translation keys are perfectly synced between EN and VI.');
  }
} catch (e) {
  console.log('Error comparing keys:', e.message);
}
