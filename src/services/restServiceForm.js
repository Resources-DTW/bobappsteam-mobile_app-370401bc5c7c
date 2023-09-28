// @flow

import { set, isEmpty } from 'lodash';

export default function AppServiceForm({ url, method, form, headers = {}, authToken = null, }) {
  set(headers, 'Accept', 'application/json');
  set(headers, 'Content-Type', 'multipart/form-data');
  if (authToken) {
    set(headers, 'Authorization', `Bearer ${authToken}`);

  }
  const reqBody = {
    method,
    headers
  };
  reqBody.body = form


  return fetch(url, reqBody)
    .then(response => { return response.json() })
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
