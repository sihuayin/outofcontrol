import api from '../libs/api'

export const getDocterDatings = (data) => {
  return api.get('/docter/datings', data)
}