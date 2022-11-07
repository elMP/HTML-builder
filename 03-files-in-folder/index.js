const path = require('path');
const fs = require('fs/promises');

const secretFolder = path.join(__dirname, 'secret-folder');
(async () => {
  let files = await fs.readdir(secretFolder, { withFileTypes: true });
  console.log("Files in directory 'secret-folder':");
  files.forEach((file) => {
    if (!file.isDirectory()) {
      (async () => {
        let pathToFile = path.join(secretFolder, file.name);
        let fileStats = await fs.stat(pathToFile);
        const parseFile = path.parse(file.name);
        console.log(
          `${parseFile.name} - ${parseFile.ext.substring(1)} - ${
            fileStats.size
          } bytes`
        );
      })();
    }
  });
})();
