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
      done: false,
      important: false,
      id: new Date().getTime(), // Потом сделать autoincrement с сохранением его значения
    },
  },
  mutations: {
    addNewTask(state) {
      state.taskList.push(state.newTask);
      state.newTask = {
        text: '',
        messageId: 0,
        ticketId: 0,
        done: false,
        important: false,
        id: new Date().getTime(),
      };
    },
    updateNewTaskText(state, text) {
      state.newTask.text = text;
    },
    updateTaskList(state, taskList) {
      state.taskList = taskList
        .filter((task) => (task || false))
        .map(({
          text = '',
          messageId = 0,
          ticketId = 0,
          done = false,
          important = false,
          id = new Date().getTime(),
        }) => ({
          text,
          messageId,
          ticketId,
          done,
          important,
          id,
        }));
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
    moveTaskToNewPosition({ state, dispatch, commit }, { newIndex, oldIndex }) {
      const taskList = [...state.taskList];
      const item = taskList[oldIndex];

      taskList.splice(oldIndex, 1);
      taskList.splice(newIndex, 0, item);

      commit('updateTaskList', taskList);
      dispatch('saveTasksToLocalStorage');
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
