import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    taskList: [],
    newTask: {
      text: '',
      messageId: 0,
      ticketId: 0,
    },
  },
  mutations: {
    addNewTask(state) {
      state.taskList.push(state.newTask);
      state.newTask = {
        text: '',
        messageId: 0,
        ticketId: 0,
      };
    },
    updateNewTaskText(state, text) {
      state.newTask.text = text;
    },
    updateTaskList(state, taskList) {
      state.taskList = taskList || [];
    },
  },
  actions: {
    addNewTask({ commit, dispatch }) {
      commit('addNewTask');
      dispatch('saveTasksToLocalStorage');
    },
    saveTasksToLocalStorage({ state }) {
      chrome.runtime.sendMessage({
        type: 'saveTaskList',
        taskList: state.taskList,
      });
    },
    getTaskList() {
      chrome.runtime.sendMessage({
        type: 'getTaskList',
      });
    },
  },
  modules: {
  },
});

// (response) => {
//   if (response.taskList) {
//     console.warn(response);
//     commit('updateTaskList', response.taskList);
//   }
// })
