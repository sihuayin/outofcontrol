import api from '../libs/api'

export const getSpecialists = (data) => {
  return api.get('/specialist', data)
}