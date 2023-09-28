// @flow

import { set, isEmpty } from 'lodash';

export default function AppService({ url, method, params, headers = {}, authToken = null, }) {
  set(headers, 'Accept', 'application/json');
  set(headers, 'Content-Type', 'application/json');
  if (authToken) {
    set(headers, 'Authorization', `Bearer ${authToken}`);
  }
  const reqBody = {
    method,
    headers
  };
  if (!isEmpty(params)) {
    reqBody.body = JSON.stringify(params);
  }
  return fetch(url, reqBody)
    .then(response => response.json())
    .then((data) => {
      return {
        result: 'ok',
        data
      };
    })
    .catch((error) => {
      return {
        result: 'error',
        message: 'Please check your internet connection!'
      };
    });
}
