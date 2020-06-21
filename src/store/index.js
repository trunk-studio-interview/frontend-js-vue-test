import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

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
      axios
        .post('/api/auth/login', { email: 'admin@example.com', password: 'admin' })
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
