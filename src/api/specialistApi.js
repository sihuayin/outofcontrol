import api from '../libs/api'

export const getSpecialists = (id, data) => {
  return api.get(`specialist/${id}/datings`, {params: data})
}

export const videoJoin = (id, data) => {
  return api.post(`/specialist/${id}/join`, data)
}