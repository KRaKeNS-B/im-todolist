import Vue from 'vue';
import Vuex from 'vuex';
import actions from '@/store/actions';
import mutations from '@/store/mutations';
import constants from '@/store/constants';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    taskList: [],
    newTask: constants.defaultTask,
    lastContextmenuEvent: null,
    lastNewTaskId: null,
  },
  mutations,
  actions,
  modules: {
  },
});
