import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { FirestoreDocument } from '../lib/firebase';
import { User } from '../lib/forms';
import State from './state';
import { getters } from './getters';
Vue.use(Vuex);

export default new Vuex.Store({
  state: new State(),
  mutations: {
    user(state, payload: FirestoreDocument<User> | null) {
      state.user = payload;
    }
  },
  actions: {},
  getters
});
