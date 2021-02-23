import { LS_JWT } from '../constants'

export const API_ENDPOINT = 'http://localhost:3030/'
export const TEMPLATE_ENDPOINT = API_ENDPOINT + 'templates'
export const LOGIN_ENDPOINT = API_ENDPOINT + 'login'
export const SIGNUP_ENDPOINT= API_ENDPOINT + 'signup'
export const MEMES_ENDPOINT = API_ENDPOINT
export const LIKE_ENDPOINT = API_ENDPOINT + 'like'
export const COMMENT_ENDPOINT = API_ENDPOINT + 'comment'
export const SINGLE_MEME_ENDPOINT = API_ENDPOINT + 'meme'
export const VIEW_ENDPOINT = API_ENDPOINT + 'view'

export function authorizedFetch(endpoint, method, bodyJson, isNotAuthenticatedCallback) {
  const jwt = localStorage.getItem(LS_JWT);
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

export function viewMeme(id, isNotAuthenticatedCallback){
  authorizedFetch(VIEW_ENDPOINT, 'POST', JSON.stringify({memeId: id}), isNotAuthenticatedCallback)
  .catch((error) => { console.error('Error:', error) });
}

function handleResponse(response, isNotAuthenticatedCallback) {
  if (!response.ok) {
    if (response.status === 401) isNotAuthenticatedCallback();
    return Promise.reject('Server responded with ' + response.status + ' ' + response.statusText);
  }
  return response.json();
}
