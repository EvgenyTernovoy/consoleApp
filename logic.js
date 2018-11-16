const fs = require('fs');
const path = require('path');


const removeDir = dir => {
  const files = fs.readdirSync(dir);

  if (files.length === 0) {
    fs.rmdirSync(dir, err => err && console.log(err));
    return;
  }

  files.forEach(item => {
    removeDir(path.join(dir, item));
  });

  fs.rmdirSync(dir, err => err && console.log(err));
};

const createCollection = (base, targetDir, needDelete) => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(path.join(__dirname, targetDir));
  }

  const readDir = dir => {
    const files = fs.readdirSync(dir);

    files.forEach(item => {
      const localBase = path.join(dir, item);
      const stat = fs.statSync(localBase);

      if (stat.isFile()) {
        const dirName = item.slice(0, 1);
        const neededDir = path.join(targetDir, dirName);

        if (!fs.existsSync(neededDir)) {
          fs.mkdirSync(neededDir);
        }

        const filePath = path.join(neededDir, item);

        if (!fs.existsSync(filePath)) {
          fs.linkSync(localBase, path.join(neededDir, item));
        }

        if (needDelete === 'true') {
          fs.unlinkSync(localBase);
        }
      }

      if (stat.isDirectory()) {
        readDir(localBase);
      }
    });
  };
  readDir(base);

  if (needDelete === 'true') {
    removeDir(base);
  }

  console.log('\n Collection created');
};

module.exports = createCollection;
