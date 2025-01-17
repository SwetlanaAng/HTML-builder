var fs = require('fs');

var path = require('path');
const promise = fs.promises;
promise
  .readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((items) => {
    for (var i = 0; i < items.length; i++) {
      if (items[i].isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', items[i].name);
        const name = path.basename(filePath);
        const ext = path.extname(filePath).replace('.', '');
        promise.stat(filePath).then((stats) => {
          console.log(`${name} - ${ext} - ${stats.size}`);
        });
      }
    }
  });
