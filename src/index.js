'use strict';

import init from './init';
import request from './request';

const label = 'timer';

const search = (words) => {
  console.time(label);
  request(
    '/index/files/_search',
    { query: { terms: { body: words } } },
    'post'
  ).then(({ hits }) => {
    console.log(`found: ${hits.total}`);
    console.timeEnd(label);
  });
};

export default () => {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case 'init': init(); break;
    default: search(args);
  }
};
