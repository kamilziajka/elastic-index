'use strict';

import fs from 'fs';
import Progress from 'progress';
import request from './request';

const wordsPerFile = 150000;
const randomFiles = 100;
const fileDirectory = '../files';

const label = 'index creation';

const deleteIndex = () => request('/index', {}, 'delete');
const createIndex = () => request('/index', {}, 'put');
const addFile = (file) => () => request('/index/files', { body: file }, 'post');

const getRandomWord = () => {
  let length = 2 + Math.random() * 10;
  return Math.random().toString(36).substring(2, 2 + length);
};

const getRandomFile = () => {
  const words = [];
  while (words.length < wordsPerFile) {
    words.push(getRandomWord());
  }
  return words.join(' ');
};

const saveToFile = (index, content) => {
  if (!fs.existsSync(fileDirectory)) {
    fs.mkdirSync(fileDirectory);
  }

  fs.writeFileSync(
    `${fileDirectory}/file${index + 1}`,
    content
  );
};

export default () => {
  const generationProgress = new Progress(
    'random files [:bar] :percent :etas',
    { total: randomFiles }
  );

  const uploadProgress = new Progress(
    'files upload [:bar] :percent :etas',
    { total: randomFiles }
  );

  console.time(label);
  let result = deleteIndex().then(createIndex);

  for (let i = 0; i < randomFiles; i++) {
    const file = getRandomFile();
    saveToFile(i, file);
    generationProgress.tick();
    result = result.then(addFile(file)).then(() => uploadProgress.tick());
  }

  return result.then(() => {
    console.timeEnd(label);
  });
};
