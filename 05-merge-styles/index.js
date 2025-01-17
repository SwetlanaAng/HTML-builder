const fs = require('fs');
const promise = fs.promises;
const path = require('path');

promise
  .rm(path.join(__dirname, 'project-dist', 'bundle.css'), {
    recursive: true,
    force: true,
  })
  .then(() => {
    const output = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'bundle.css'),
    );
    promise
      .readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
      .then((items) => {
        items.forEach((item) => {
          if (
            path.extname(path.join(__dirname, 'styles', item.name)) === '.css'
          ) {
            const input = fs.createReadStream(
              path.join(__dirname, 'styles', item.name),
            );
            input.on('data', (chank) => {
              output.write(chank);
            });
          }
        });
      });
  });
