const actions = {
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
  addNewTaskByMessage({ dispatch, commit }, {
    message = { id: null },
    messageText,
    ticket = {
      id: null,
      publicId: null,
    },
    group = {
      id: null,
      name: null,
    },
  }) {
    const taskId = new Date().getTime();

    const task = {
      text: messageText,
      message,
      ticket,
      group,
      done: false,
      important: false,
      id: taskId,
    };

    commit('addTask', task);

    commit('setLastTaskId', taskId);

    setTimeout(() => {
      commit('setLastTaskId', null);
    }, 5000);

    dispatch('saveTasksToLocalStorage');
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
};

export default actions;
