const fs = require('fs');
const path = require('path');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const myFile = path.join(__dirname, 'text.txt');
fs.open(myFile, 'w', (err) => {
  if (err) throw err;
  console.log("File 'text.txt' created");
  console.log("Write something. To stop - write 'exit'");
});

readline.on('line', (input) => {
  if (input === 'exit') readline.close();
  else writeToFile(input);
});

readline.on('close', () => {
  console.log('Good bye!');
});

function writeToFile(line) {
  fs.appendFile(myFile, `${line}\n`, (err) => {
    if (err) throw err;
  });
}
