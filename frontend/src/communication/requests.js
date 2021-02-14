export const API_ENDPOINT = 'http://localhost:3030/'
export const TEMPLATE_ENDPOINT = API_ENDPOINT + 'memes/templates'
export const LOGIN_ENDPOINT = API_ENDPOINT + 'login'
export const SIGNUP_ENDPOINT= API_ENDPOINT + 'signup'
export const MEMES_ENDPOINT = API_ENDPOINT + 'memes'

export function authorizedFetch(endpoint, method, bodyJson) {
  const jwt = localStorage.getItem('memeGen_jwt')
  if (method === 'GET'){
    return fetch(endpoint, {
      method: method,
      headers: {
        "Authorization": jwt,
      }
    })
  }
  return fetch(endpoint, {
    method: method,
    headers: {
      "Authorization": jwt,
      "Content-Type": "application/json"
    },
    body: bodyJson,
  })
}