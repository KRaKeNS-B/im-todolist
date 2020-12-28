import constants from '@/store/constants';

const mutations = {
  addNewTask(state) {
    state.newTask.id = new Date().getTime();

    state.taskList.unshift(state.newTask);

    state.newTask = { ...constants.defaultTask };
  },
  addTask(state, task) {
    if (task) {
      state.taskList.unshift(task);
    }
  },
  updateNewTaskText(state, text) {
    state.newTask.text = text;
  },
  updateTaskList(state, taskList) {
    state.taskList = taskList
      .filter((task) => (task || false))
      .map(({
        text = '',
        messageId = null,
        message = {
          id: null,
        },
        ticketId = null,
        ticket = {
          id: null,
          publicId: null,
        },
        groupId = null,
        group = {
          id: null,
          name: null,
        },
        done = false,
        important = false,
        id = new Date().getTime(),
      }) => ({
        text,
        message: message.id ? message : { id: messageId },
        ticket: ticket.id ? ticket : { id: ticketId, publicId: null },
        group: group.id ? group : { id: groupId, name: null },
        done,
        important,
        id,
      }));
  },
  setLastContextmenuEvent(state, event) {
    state.lastContextmenuEvent = event;
  },
  setLastTaskId(state, taskId) {
    state.lastNewTaskId = taskId;
  },
};

export default mutations;
