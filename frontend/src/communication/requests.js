import { LS_JWT } from '../constants'

export const API_ENDPOINT = 'http://localhost:3030/'
export const TEMPLATE_ENDPOINT = API_ENDPOINT + 'templates'
export const LOGIN_ENDPOINT = API_ENDPOINT + 'login'
export const SIGNUP_ENDPOINT= API_ENDPOINT + 'signup'
export const MEMES_ENDPOINT = API_ENDPOINT
export const CREATE_ENDPOINT = API_ENDPOINT + 'create'
export const LIKE_ENDPOINT = API_ENDPOINT + 'like'
export const COMMENT_ENDPOINT = API_ENDPOINT + 'comment'
export const SINGLE_MEME_ENDPOINT = API_ENDPOINT + 'meme'
export const VIEW_ENDPOINT = API_ENDPOINT + 'view'
export const MEME_FROM_TEMPLATE_ENDPOINT = API_ENDPOINT + 'templateurl'
export const MEME_FROM_TEMPLATE_ID_ENDPOINT = API_ENDPOINT + 'templateid'

/**
 * Sends an authorized fetch to the given endpoint
 * @param {string} endpoint - The reiceiver of the http request
 * @param {string} method - The used http method
 * @param {JSON} bodyJson - The JSON that is to be sent in the request body (pass empty object if not needed)
 * @param {*} isNotAuthenticatedCallback - A callback to be called if the authentication failed
 */
export function authorizedFetch(endpoint, method, bodyJson, isNotAuthenticatedCallback) {
  const jwt = localStorage.getItem(LS_JWT);
  console.log(endpoint)
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

/**
 * Call when user views a meme to increase the view count
 * @param {String} id 
 * @param {String} date 
 * @param {*} isNotAuthenticatedCallback 
 */
export function viewMeme(id, date, isNotAuthenticatedCallback){
  authorizedFetch(VIEW_ENDPOINT, 'POST', JSON.stringify({memeId: id, date: date}), isNotAuthenticatedCallback)
  .catch((error) => { console.error('Error:', error) });
}

/**
 * Handles the response of an authorizedFetch fetch
 * @param {*} response - The http response
 * @param {*} isNotAuthenticatedCallback - A callback to be called if the authentication failed
 */
function handleResponse(response, isNotAuthenticatedCallback) {
  if (!response.ok) {
    if (response.status === 401) isNotAuthenticatedCallback();
    return Promise.reject('Server responded with ' + response.status + ' ' + response.statusText);
  }
  return response.json().catch((e)=>{}) // catch if the response is not in the json format and do nothing
}
