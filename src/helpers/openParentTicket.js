async function openParentTicket({
  group = {
    id: null,
  },
  ticket = {
    id: null,
    publicId: null,
  },
  message = {
    id: null,
  },
}) {
  if (await goToTicketGroup(group.id)) {
    closeSearch();
    await timeout(200);

    if (await goToTicket(getTicketNode(ticket.id), message.id)) {
      return;
    }

    findTicket(ticket.publicId);

    await goToTicket(await waitTicket(ticket.id), message.id);
  }
}

async function goToTicketGroup(groupId) {
  const targetGroupNode = getTicketGroupNode(groupId);

  if (targetGroupNode) {
    if (targetGroupNode.classList.contains('active')) {
      return true;
    }

    targetGroupNode.click();
    await timeout();

    return true;
  }

  return false;
}

function closeSearch() {
  const closeBtn = document.querySelector('.search-bar__search-icon_close');
  if (closeBtn) {
    closeBtn.click();
  }
}

function timeout(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function goToTicket(ticketNode, messageId) {
  if (ticketNode) {
    ticketNode.scrollIntoView({ block: 'start', inline: 'start' });
    const isMessageFound = await goToMessage(ticketNode, messageId);
    return isMessageFound;
  }
  return false;
}

function getTicketNode(ticketId) {
  return document.querySelector(`#ticket-${ticketId}`);
}

function getTicketGroupNode(groupId) {
  return document.querySelector(`#group-list__group_id_${groupId}`);
}

function findTicket(ticketId) {
  if (!ticketId) return;

  const searchInput = document.querySelector('#search-bar__input');

  if (searchInput) {
    searchInput.value = `${ticketId}`;

    if ('createEvent' in document) {
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      searchInput.dispatchEvent(evt);
    } else {
      searchInput.fireEvent('oninput');
    }

    const searchBtn = document.querySelector('.search-bar__search-icon_search');

    if (searchBtn) {
      searchBtn.click();
    }
  }
}

async function waitTicket(ticketId) {
  const target = document.querySelector('.tickets-list__scroll-area');

  const rejectTime = 5000;

  return new Promise((resolve) => {
    const observerConfig = {
      childList: true,
      subtree: true,
    };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const ticketNode = getTicketNode(ticketId);

          if (ticketNode) {
            observer.disconnect();
            resolve(ticketNode);
          }
        }
      });
    });

    window.setTimeout(() => {
      resolve(false);
    }, rejectTime);

    observer.observe(target, observerConfig);
  });
}

async function goToMessage(ticketNode, messageId) {
  if (!scrollToMessage(messageId)) {
    const messageListNode = ticketNode.querySelector('.messages-list');
    if (messageListNode) {
      messageListNode.scrollTop = 0;
    }

    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await goToMessage(ticketNode, messageId));
      }, 200);
    });
  }

  return true;
}

function scrollToMessage(messageId) {
  const targetMessageNode = getMessageNode(messageId);

  if (targetMessageNode) {
    highlightMessageForTime(targetMessageNode);

    targetMessageNode.scrollIntoView();
    return true;
  }
  return false;
}

function getMessageNode(messageId) {
  return document.querySelector(`#message-${messageId}`);
}

function highlightMessageForTime(messageNode) {
  enableHighlightMessage(messageNode);

  setTimeout(() => disableHighlightMessage(messageNode), 10000);
}

function enableHighlightMessage(messageNode) {
  messageNode.classList.add('todolist__highlighted-message');
}

function disableHighlightMessage(messageNode) {
  messageNode.classList.remove('todolist__highlighted-message');
  messageNode.classList.add('todolist__highlighted-message_end');

  setTimeout(
    () => messageNode.classList.remove('todolist__highlighted-message_end'),
    1500,
  );
}

export { goToMessage };
export default openParentTicket;
