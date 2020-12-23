const mutations = {
  addNewTask(state) {
    state.taskList.unshift(state.newTask);
    state.newTask = {
      text: '',
      messageId: 0,
      ticketId: 0,
      groupId: 0,
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
        groupId = 0,
        done = false,
        important = false,
        id = new Date().getTime(),
      }) => ({
        text,
        messageId,
        ticketId,
        groupId,
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
