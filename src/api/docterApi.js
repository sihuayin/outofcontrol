import api from '../libs/api'

export const getDocterDatings = (data) => {
  return api.get('/docter/datings', data)
}

export const addDocterDating = (data) => {
  return api.post('/docter/one', data)
}