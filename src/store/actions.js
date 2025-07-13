import axiosClient from "../axios";

export function getUser({commit}, data) {
  return axiosClient.get('/auth/me', data)
    .then(({data}) => {
      commit('setUser', data);
      return data;
    })
}

export function login({commit}, data) {
  return axiosClient.post('/auth/login', data)
    .then(({data}) => {
      commit('setUser', data.user);
      commit('setToken', data.token)
      return data;
    })
}

export function logout({commit}) {
  return axiosClient.post('/auth/logout')
    .then((response) => {
      commit('setToken', null)

      return response;
    })
}
