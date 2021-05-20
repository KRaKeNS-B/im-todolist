export function getAttributesByTasks(tasks) {
  const days = getTasksGroupByDay(tasks);

  return getCalendarAttributes(days);
}

function getTasksGroupByDay(tasks) {
  const days = {};

  tasks.forEach((task) => {
    const key = getTaskKey(task);

    if (!days[key]) days[key] = [];
    days[key].push(task);
  });

  return days;
}

function getCalendarAttributes(tasksByDay) {
  const result = [];

  Object.keys(tasksByDay)
    .forEach((date) => {
      tasksByDay[date].forEach((task, index) => {
        result.push({
          dates: getDate(getTaskTimestamp(task)),
          dot: {
            color: 'red',
            class: getDotClass(index),
          },
          popover: {
            label: getTaskText(task),
          },
        });
      });
    });

  return result;
}

function getTaskKey(task) {
  const date = getDate(getTaskTimestamp(task));
  return `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
}

export function getDate(timestamp) {
  return new Date(timestamp);
}

export function getTaskTimestamp(task) {
  return task.doneTime > 0 ? task.doneTime : task.id;
}

function getTaskText(task) {
  const text = task.text || task.anchorText || '';

  return text.length > 20 ? `${text.substr(0, 20)}...` : text;
}

function getDotClass(index) {
  return index === 0 ? 'dot-last' : 'dot-invisible';
}
