import addBookmarkIconToTickets from '@/helpers/bookmarks';

const actions = {
  addNewTask({ commit, dispatch }) {
    commit('addNewTask');
    dispatch('saveTasksToLocalStorage');
  },
  saveTasksToLocalStorage({ state }) {
    chrome.storage.local.set({ taskList: state.taskList });
  },
  addNewTaskByMessage({ dispatch, commit }, {
    message,
    messageText,
    ticket,
    group,
  }) {
    const taskId = new Date().getTime();

    const shortMessageText = messageText.match(/^(?:.{0,67}(?=\s|$)|\S{0,67})/s);

    const task = {
      anchorText: shortMessageText ? shortMessageText[0] : null,
      message,
      ticket,
      group,
      id: taskId,
    };

    commit('addTask', task);

    commit('setLastTaskId', taskId);

    setTimeout(() => {
      commit('setLastTaskId', null);
    }, 5000);

    dispatch('saveTasksToLocalStorage');
  },
  getTaskList({ commit, state }) {
    chrome.storage.local.get('taskList', (result) => {
      if (result.taskList) {
        commit('updateTaskList', result.taskList);
        addBookmarkIconToTickets(state.taskList);
      }
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
