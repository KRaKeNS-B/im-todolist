import { goToMessage } from '@/helpers/openParentTicket';
import EventBus from '@/components/eventBus';

function addBookmarkIconToTickets(taskList) {
  delOldBookmarks();

  const tasksInCurrentGroup = {};

  getTasksInCurrentGroup(taskList).forEach((task) => {
    const ticketId = `ticket-${task.ticket.id}`;

    if (!tasksInCurrentGroup[ticketId]) {
      tasksInCurrentGroup[ticketId] = [];
    }
    tasksInCurrentGroup[ticketId].push(task);
  });

  const openedTickets = [...document.querySelectorAll('.ticket')];

  openedTickets.filter((ticketNode) => !!tasksInCurrentGroup[ticketNode.id])
    .forEach((ticketNode) => {
      addBookmarkIconToTheTicket(ticketNode, tasksInCurrentGroup[ticketNode.id]);
    });
}

function delOldBookmarks() {
  [...document.querySelectorAll('.todolist__bookmark')].forEach((node) => {
    node.remove();
  });
}

function getTasksInCurrentGroup(taskList) {
  const groupNode = document.querySelector('.group-list__group.active');

  if (groupNode) {
    const currentGroupId = groupNode.id.match(/group-list__group_id_(\d+)/)[1];

    const tasksInGroup = taskList
      .filter((task) => task.group.id === currentGroupId && task.done === false);

    return tasksInGroup;
  }

  return [];
}

function addBookmarkIconToTheTicket(ticketNode, tasks) {
  const iconsWrapper = ticketNode.querySelector('.ticket__action-icons');

  if (iconsWrapper) {
    const bookmarkIcon = iconsWrapper.querySelector('.todolist__bookmark-icon');

    if (!bookmarkIcon) {
      let iconNode = createBookmarkIconNode(tasks.length);

      iconNode = addClickEventToBookmark(ticketNode, tasks, iconNode);

      iconsWrapper.prepend(iconNode);
    }
  }
}

function createBookmarkIconNode(tasksNum) {
  const iconWrapper = document.createElement('span');
  iconWrapper.className = 'ticket__action-icons__icon ticket__users-icon-block todolist__bookmark';

  const iconNode = document.createElement('span');
  iconNode.className = 'todolist__bookmark-icon';

  const textNode = document.createElement('span');
  textNode.className = 'todolist__bookmark-text';
  textNode.innerText = tasksNum > 1 ? `${tasksNum}` : '';

  iconWrapper.append(iconNode);
  iconWrapper.append(textNode);

  return iconWrapper;
}

function addClickEventToBookmark(ticketNode, tasks, iconNode) {
  let currentMessageIndex = 0;

  iconNode.addEventListener('click', () => {
    goToMessage(ticketNode, tasks[currentMessageIndex].message.id);

    EventBus.$emit('OPEN_TODOLIST', {
      type: 'FOCUS_TASK',
      taskId: tasks[currentMessageIndex].id,
    });

    if (currentMessageIndex < tasks.length - 1) {
      currentMessageIndex += 1;
    } else {
      currentMessageIndex = 0;
    }
  });

  return iconNode;
}

function throttleDecorator(func, ms) {
  let isThrottled = false;
  let savedArgs;
  let savedThis;

  function wrapper(...args) {
    if (isThrottled) {
      savedArgs = args;
      savedThis = this;
      return;
    }

    func.apply(this, args);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = null;
        savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

export default throttleDecorator(addBookmarkIconToTickets, 500);
