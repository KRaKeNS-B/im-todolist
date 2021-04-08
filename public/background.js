chrome.runtime.onConnect.addListener((port) => {
  console.log('connected ', port);
});

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
