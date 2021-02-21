export const colors = ['orange', '#00a170', '#0072b5', '#d2386c']
export const randomColor = (ascii) => colors[ascii%colors.length]
export const dialogStyle =  {
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center'
}
export const LS_USERNAME = 'memeGen_username'
export const LS_JWT = 'memeGen_jwt'

export const FRONTEND_URL = 'http://localhost:3000'
export const GALLERY_URL = FRONTEND_URL + '/gallery'
