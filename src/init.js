'use strict';

import fs from 'fs';
import Progress from 'progress';
import request from './request';

const wordLength = 5;
const wordsPerFile = 10000;
const characters = 'abcdef';
const randomFiles = 10000;
const fileDirectory = '../files';

const deleteIndex = () => request('/index', {}, 'delete');
const createIndex = () => request('/index', {}, 'put');
const addFile = (file) => () => request('/index/files', { body: file }, 'post');

const getRandomWord = () => {
  let word = '';
  while (word.length < wordLength) {
    word += characters[Math.floor((Math.random() * 100) % characters.length)];
  }
  return word;
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

  let result = deleteIndex().then(createIndex);

  for (let i = 0; i < randomFiles; i++) {
    const file = getRandomFile();
    saveToFile(i, file);
    generationProgress.tick();
    result = result.then(addFile(file)).then(() => uploadProgress.tick());
  }

  return result;
};
