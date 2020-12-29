import constants from '@/store/constants';
import taskDataChecker from '@/helpers/taskDataChecker';

const mutations = {
  addNewTask(state) {
    state.newTask.id = new Date().getTime();

    state.taskList.unshift(state.newTask);

    state.newTask = { ...constants.defaultTask };
  },
  addTask(state, task) {
    if (task) {
      state.taskList.unshift(taskDataChecker(task));
    }
  },
  updateNewTaskText(state, text) {
    state.newTask.text = text;
  },
  updateTaskList(state, taskList) {
    state.taskList = taskList
      .filter((task) => (task || false))
      .map(taskDataChecker);
  },
  setLastContextmenuEvent(state, event) {
    state.lastContextmenuEvent = event;
  },
  setLastTaskId(state, taskId) {
    state.lastNewTaskId = taskId;
  },
};

export default mutations;
