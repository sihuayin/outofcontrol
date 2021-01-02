import api from '../libs/api'

export const getSpecialists = (data) => {
  return api.get('/specialists', data)
}

export const videoJoin = (id, data) => {
  return api.post(`/specialist/${id}/join`, data)
}