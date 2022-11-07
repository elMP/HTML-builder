const path = require('path');
const fs = require('fs/promises');

const pathToSourceFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

(async () => {
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

  let files = await fs.readdir(pathToSourceFolder);
  files.forEach((file) => {
    (async () => {
      let pathToSourceFile = path.join(pathToSourceFolder, file);
      let pathToCopyFile = path.join(pathToCopyFolder, file);
      try {
        await fs.copyFile(pathToSourceFile, pathToCopyFile);
        console.log(`${file} was copied to files-copy folder`);
      } catch {
        console.log(`The ${file} could not be copied`);
      }
    })();
  });
})();
