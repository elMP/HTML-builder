const path = require('path');
const fs = require('fs/promises');
const fs1 = require('fs');

const pathToStylesFolder = path.join(__dirname, 'styles');

const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
fs1.open(bundle, 'w', (err) => {
  if (err) throw err;
  console.log("File 'bundle.css' created");
});

(async () => {
  let files = await fs.readdir(pathToStylesFolder);
  files.forEach((file) => {
    if (path.extname(file) === '.css')
      (async () => {
        const pathToFile = path.join(pathToStylesFolder, file);

        let content = await fs.readFile(pathToFile, { encoding: 'utf-8' });
        writeToFile(content);
      })();
  });
})();

function writeToFile(line) {
  fs1.appendFile(bundle, `${line}\n`, (err) => {
    if (err) throw err;
  });
}
