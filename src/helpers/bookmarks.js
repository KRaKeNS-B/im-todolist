import { goToMessage } from '@/helpers/openParentTicket';

function addBookmarkIconToTickets(taskList) {
  delOldBookmarks();

  const tasksInCurrentGroup = {};

  getTasksInCurrentGroup(taskList).forEach((task) => {
    const ticketId = `ticket-${task.ticket.id}`;

    if (!tasksInCurrentGroup[ticketId]) {
      tasksInCurrentGroup[ticketId] = [];
    }
    tasksInCurrentGroup[ticketId].push(task.message.id);
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

function addBookmarkIconToTheTicket(ticketNode, messagesId) {
  const iconsWrapper = ticketNode.querySelector('.ticket__action-icons');

  if (iconsWrapper) {
    const bookmarkIcon = iconsWrapper.querySelector('.todolist__bookmark-icon');

    if (!bookmarkIcon) {
      const iconNode = createBookmarkIconNode(messagesId.length);

      let currentMessageIndex = 0;

      iconNode.addEventListener('click', () => {
        console.log('scrollToMessage', messagesId[currentMessageIndex], currentMessageIndex);

        goToMessage(ticketNode, messagesId[currentMessageIndex]);

        if (currentMessageIndex < messagesId.length - 1) {
          currentMessageIndex += 1;
        } else {
          currentMessageIndex = 0;
        }
      });

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

export default addBookmarkIconToTickets;
