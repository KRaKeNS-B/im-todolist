import Vue from 'vue';
import Vuex from 'vuex';
import actions from '@/store/actions';
import mutations from '@/store/mutations';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    taskList: [],
    newTask: {
      text: '',
      messageId: 0,
      ticketId: 0,
      groupId: 0,
      done: false,
      important: false,
      id: new Date().getTime(), // Потом сделать autoincrement с сохранением его значения
    },
    lastContextmenuEvent: null,
    lastNewTaskId: null,
  },
  mutations,
  actions,
  modules: {
  },
});
