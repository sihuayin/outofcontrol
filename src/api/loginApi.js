import api from '../libs/api'

export const doLogin = (data) => {
  return api.post('/login', data)
}