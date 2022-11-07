const path = require('path');
const fs = require('fs');

const myFile = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(myFile, 'utf-8');

readableStream.on('data', function (chunk) {
  console.log(chunk);
});
