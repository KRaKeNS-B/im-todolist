function handleContentRequest(request, sender) {
  if (request.type === 'saveTaskList') {
    chrome.storage.local.set({ taskList: request.taskList }, () => {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'taskListSaved',
        taskList: request.taskList,
      });
    });
  } else if (request.type === 'getTaskList') {
    // chrome.storage.local.clear();
    chrome.storage.local.get('taskList', (result) => {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'getTaskList',
        taskList: result.taskList,
      });
    });
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Добавить задачу %s',
    contexts: ['selection', 'page'],
    id: 'IM_TODOLIST_CLICK',
    documentUrlPatterns: [
      '*://localhost/*',
      '*://web.involta.work/*',
      '*://m-bobovikov.web-app.involta-messenger.dev-02.h.involta.ru/*',
    ],
  });
});

chrome.contextMenus.onClicked.addListener(({ menuItemId, selectionText }, tab) => {
  if (menuItemId === 'IM_TODOLIST_CLICK') {
    chrome.tabs.sendMessage(tab.id, {
      type: 'getMessageData',
      text: selectionText,
    });
  }
});

chrome.runtime.onMessage.addListener(handleContentRequest);
