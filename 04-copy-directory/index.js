const fs = require('fs');
const promise = fs.promises;
const path = require('path');
function copyDir() {
  promise
    .readdir(path.join(__dirname, 'files'), { withFileTypes: true })
    .then((items) => {
      promise
        .rm(path.join(__dirname, 'files-copy'), {
          recursive: true,
          force: true,
        })
        .then(() => {
          promise
            .mkdir(
              path.join(__dirname, 'files-copy'),
              { recursive: true },
              (err) => {
                if (err) {
                  return console.error(err);
                }
                console.log('Directory created successfully!');
              },
            )
            .then(() => {
              for (let i = 0; i < items.length; i++) {
                if (items[i].isFile()) {
                  const fileSourse = path.join(
                    __dirname,
                    'files',
                    items[i].name,
                  );
                  const filePath = path.join(
                    __dirname,
                    'files-copy',
                    items[i].name,
                  );
                  promise.copyFile(fileSourse, filePath);
                }
              }
            });
        });
    });
}

copyDir();
