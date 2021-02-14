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