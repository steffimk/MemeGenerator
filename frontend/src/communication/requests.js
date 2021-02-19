export function authorizedFetch(endpoint, method, bodyJson, isNotAuthenticatedCallback) {
  const jwt = localStorage.getItem('memeGen_jwt');
  if (method === 'GET') {
    return fetch(endpoint, {
      method: method,
      headers: {
        Authorization: jwt,
      },
    }).then((response) => handleResponse(response, isNotAuthenticatedCallback));
  }
  return fetch(endpoint, {
    method: method,
    headers: {
      Authorization: jwt,
      'Content-Type': 'application/json',
    },
    body: bodyJson,
  }).then((response) => handleResponse(response, isNotAuthenticatedCallback));
}

function handleResponse(response, isNotAuthenticatedCallback) {
  if (!response.ok) {
    if (response.status === 401) isNotAuthenticatedCallback();
    return Promise.reject('Server responded with ' + response.status + ' ' + response.statusText);
  }
  return response.json();
}