import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    taskList: [],
  },
  mutations: {
    addNewTaskByText(state, text) {
      state.taskList.push({ text });
    },
  },
  actions: {
  },
  modules: {
  },
});
