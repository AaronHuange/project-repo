const path = require('path');
const fs = require('fs');
const os = require('os');

const getCommandPath = () => process.cwd();

const getCurrentPath = (subPath) => {
  if (subPath) {
    return path.resolve(__dirname, subPath);
  }
  return path.resolve(__dirname);
};

const getPath = (directory, subPath) => {
  if (subPath) {
    return path.resolve(directory, subPath);
  }
  return path.resolve(directory);
};

const existFile = (directory, filePath) => {
  if (filePath) {
    return fs.existsSync(path.resolve(directory, filePath));
  }
  return fs.existsSync(path.resolve(directory));
};

const deleteFile = (filePath) => {
  let files = [];
  if (fs.existsSync(filePath)) {
    if (!fs.statSync(filePath).isDirectory()) {
      fs.unlinkSync(filePath);
      return;
    }

    files = fs.readdirSync(filePath);
    files.forEach((file) => {
      const curPath = path.join(filePath, file);
      if (fs.statSync(curPath).isDirectory()) {
        deleteFile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(filePath);
  } else {
    console.log('给定的路径不存在，请给出正确的路径');
  }
};

// 文件夹复制
const cpSync = (source, destination) => {
  // 如果目标文件夹不存在,递归创建文件夹
  if (!existFile(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // 判断node版本不是16.7.0以上的版本
  /** 主要版本 */
  const major = process.version.match(/v(\d*).(\d*)/)[1];
  /** 特性版本 */
  const minor = process.version.match(/v(\d*).(\d*)/)[2];
  // 则进入兼容处理
  // 这样处理是因为16.7.0的版本支持了直接复制文件夹的操作
  if (Number(major) < 16 || (Number(major) === 16 && Number(minor) < 7)) {
    // 如果存在文件夹 先递归删除该文件夹
    if (fs.existsSync(destination)) fs.rmSync(destination, { recursive: true });
    // 新建文件夹 递归新建
    fs.mkdirSync(destination, { recursive: true });
    // 读取源文件夹
    (fs.readdirSync(source) || []).forEach((fd) => {
      // 循环拼接源文件夹/文件全名称
      const sourceFullName = `${source}/${fd}`;
      // 循环拼接目标文件夹/文件全名称
      const destFullName = `${destination}/${fd}`;
      // 读取文件信息
      const lstatRes = fs.lstatSync(sourceFullName);
      // 是否是文件
      if (lstatRes.isFile()) fs.copyFileSync(sourceFullName, destFullName);
      // 是否是文件夹
      if (lstatRes.isDirectory()) cpSync(sourceFullName, destFullName);
    });
  } else {
    if (!fs.statSync(source).isDirectory()) {
      const fileNames = source.split('/');
      if (existFile(destination, fileNames[fileNames.length - 1])) {
        fs.unlinkSync(`${destination}/${fileNames[fileNames.length - 1]}`);
      }
      fs.cpSync(source, `${destination}/${fileNames[fileNames.length - 1]}`, { force: true, recursive: true });
      return;
    }
    fs.cpSync(source, destination, { force: true, recursive: true });
  }
};

const readFileSync = (filePath) => {
  if (!existFile(filePath) || fs.statSync(filePath).isDirectory()) {
    return '';
  }

  return fs.readFileSync(filePath,'utf8');
};

const writeFileSync = (filePath, content) => {
  fs.writeFileSync(filePath, content + os.EOL);
};

const listFiles = (directory) => fs.readdirSync(path.resolve(__dirname, directory || '.'));

module.exports = {
  getCommandPath, existFile, getCurrentPath, getPath, listFiles, deleteFile, writeFileSync, cpSync, readFileSync
};
