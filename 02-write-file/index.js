const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'output.txt'));
const { stdout, stdin, exit } = process;
function byeAndExit() {
  stdout.write('\nThank you! bye-bye\n');
  exit();
}
stdout.write('Please type something!\n');
stdin.on('data', (data) => {
  const str = data.toString();
  if (str.trim() === 'exit') {
    byeAndExit();
  }
  output.write(str);
});
process.on('SIGINT', byeAndExit);
