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
  addNewTaskByMessage({ state, dispatch, commit }, {
    messageId, messageText, ticketId, groupId,
  }) {
    const taskId = new Date().getTime();

    state.taskList.unshift({
      text: messageText,
      messageId,
      ticketId,
      groupId,
      done: false,
      important: false,
      id: taskId,
    });

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
