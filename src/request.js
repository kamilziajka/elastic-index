'use strict';

import request from 'request-promise';

export default (uri, body, method = 'GET') => request({
  method,
  body: JSON.stringify(body),
  url: `http://localhost:9200${uri}`,
  'content-type': 'application/json',
  transform: JSON.parse
});
