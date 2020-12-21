function handleContentRequest(request, sender) {
  if (request.type === 'saveTaskList') {
    chrome.storage.local.set({ taskList: request.taskList }, () => {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'taskListSaved',
        taskList: request.taskList,
      });
    });
  } else if (request.type === 'getTaskList') {
    chrome.storage.local.get('taskList', (result) => {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'getTaskList',
        taskList: result.taskList,
      });
    });
  }
}

chrome.runtime.onMessage.addListener(handleContentRequest);
