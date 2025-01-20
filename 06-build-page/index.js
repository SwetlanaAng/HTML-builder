const fs = require('fs');
const promise = fs.promises;
const path = require('path');

let components = [];
let myMap = new Map();

function copyDir(nameDir) {
  promise
    .readdir(path.join(__dirname, 'assets', nameDir), { withFileTypes: true })
    .then((items) => {
      promise
        .mkdir(path.join(__dirname, 'project-dist', 'assets', nameDir), {
          recursive: true,
        })
        .then(() => {
          for (let i = 0; i < items.length; i++) {
            if (items[i].isFile()) {
              const fileSourse = path.join(
                __dirname,
                'assets',
                nameDir,
                items[i].name,
              );
              const filePath = path.join(
                __dirname,
                'project-dist',
                'assets',
                nameDir,
                items[i].name,
              );
              promise.copyFile(fileSourse, filePath);
            }
          }
        });
    });
}

function removeProjectDistDir() {
  return promise.rm(path.join(__dirname, 'project-dist'), {
    recursive: true,
    force: true,
  });
}

function makeProjectDistDir() {
  return promise.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true,
  });
}

function copyAssetsToProjectDistDir() {
  return promise
    .readdir(path.join(__dirname, 'assets'), { withFileTypes: true })
    .then((itemsInAssets) => {
      // stats.isDirectory
      itemsInAssets.forEach((itemInAssets) => {
        copyDir(itemInAssets.name);
      });
    });
}

function readComponents() {
  return promise
    .readdir(path.join(__dirname, 'components'), { withFileTypes: true })
    .then((data) => {
      data.forEach((item) => {
        const fileName = item.name.match(/([\w]*\.)*/)[0].replace('.', '');
        components.push(fileName);
      });
    });
}

function createComponentsMap() {
  let arrPromises = [];
  for (let i = 0; i < components.length; i++) {
    let x = promise
      .readFile(
        path.join(__dirname, 'components', `${components[i]}.html`),
        'utf-8',
      )
      .then((data) => {
        myMap.set(components[i], data);
      });
    arrPromises.push(x);
  }
  return Promise.all(arrPromises);
}

function createIndexHtml() {
  const outputHtml = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'index.html'),
  );

  const inputHtml = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );

  inputHtml.on('data', (data) => {
    let str = data;
    for (let el of myMap.keys()) {
      let regExp = new RegExp('{{' + el + '}}', 'g');
      str = str.replace(regExp, myMap.get(el));
    }
    outputHtml.write(str);
  });
}

function createStyleCss() {
  const output = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
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
}

removeProjectDistDir()
  .then(makeProjectDistDir)
  .then(copyAssetsToProjectDistDir)
  .then(readComponents)
  .then(createComponentsMap)
  .then(createIndexHtml)
  .then(createStyleCss);
