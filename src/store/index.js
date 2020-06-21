import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const appAxios = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default new Vuex.Store({
  state: {
    auth: {},
  },
  mutations: {
    USER_LOGIN(state, auth) {
      console.log('auth', auth);
      state.auth = auth;
    },
  },
  actions: {
    login({ commit }) {
      appAxios
        .post('/auth/login', { email: 'admin@example.com', password: 'admin' })
        .then((result) => {
          commit('USER_LOGIN', result.data);
        })
        .catch((error) => {
          throw new Error(`API ${error}`);
        });
    },
  },
  modules: {},
});
