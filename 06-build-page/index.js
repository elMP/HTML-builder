const path = require('path');
const fs = require('fs/promises');
const fs1 = require('fs');

const pathToTemplate = path.join(__dirname, 'template.html');
const pathToDist = path.join(__dirname, 'project-dist');
const indexHtml = path.join(__dirname, 'project-dist', 'index.html');
const pathToStylesFolder = path.join(__dirname, 'styles');
const pathToSourceFolder = path.join(__dirname, 'assets');
const pathToCopyFolder = path.join(__dirname, 'project-dist', 'assets');

(async () => {
  await fs.mkdir(pathToDist, { recursive: true });

  const bundle = path.join(__dirname, 'project-dist', 'style.css');
  fs1.open(bundle, 'w', (err) => {
    if (err) throw err;
  });

  let template = await fs.readFile(pathToTemplate, { encoding: 'utf-8' });
  const components = findComponents(template);

  components.forEach((component) => {
    (async () => {
      const pathToComponent = path.join(
        __dirname,
        'components',
        `${component}.html`
      );
      let componentContent = await fs.readFile(pathToComponent, {
        encoding: 'utf-8',
      });
      template = replaceComponent(template, component, componentContent);
      await fs.writeFile(indexHtml, template);
    })();
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

  await copyAssetsFolder(pathToSourceFolder, pathToCopyFolder);
})();

function findComponents(template) {
  let tags = [];
  let pos = 0;

  while (~template.indexOf('{{', pos)) {
    let startPosition = template.indexOf('{{', pos);
    let endPosition = template.indexOf('}}', startPosition + 2);
    let tag = template.slice(startPosition + 2, endPosition);
    tags.push(tag);
    pos = endPosition + 2;
  }

  return tags;
}

function replaceComponent(template, component, content) {
  let pos = template.indexOf(`{{${component}}}`);

  return (
    template.substr(0, pos) +
    content +
    template.substr(pos + component.length + 4)
  );
}

async function copyAssetsFolder(pathToSourceFolder, pathToCopyFolder) {
  try {
    await fs.rm(pathToCopyFolder, { recursive: true });
  } catch {
    //
  }
  try {
    await fs.mkdir(pathToCopyFolder, { recursive: true });
  } catch {
    //
  }

  let files = await fs.readdir(pathToSourceFolder, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isDirectory()) {
      (async () => {
        let pathToSourceSubFolder = path.join(pathToSourceFolder, file.name);
        let pathToCopySubFolder = path.join(pathToCopyFolder, file.name);
        await copyAssetsFolder(pathToSourceSubFolder, pathToCopySubFolder);
      })();
    } else
      (async () => {
        let pathToSourceFile = path.join(pathToSourceFolder, file.name);
        let pathToCopyFile = path.join(pathToCopyFolder, file.name);
        try {
          await fs.copyFile(pathToSourceFile, pathToCopyFile);
        } catch {
          //
        }
      })();
  });
}
