import Vue from 'vue';
import store from '@/store';
import ToDoBtn from '@/components/ToDoBtn';
import ToDoWrapper from '@/components/ToDoWrapper';

function mountNavBtn() {
  const navbar = document.querySelector('.navbar__buttons');

  const buttonWrapper = document.createElement('div');
  buttonWrapper.id = 'todolist-open-btn';

  navbar.prepend(buttonWrapper);
}

mountNavBtn();

const vueTodoBtn = new Vue({
  render: (h) => h(ToDoBtn),
}).$mount('#todolist-open-btn');

function mountToDoWrapper() {
  const wrapper = document.createElement('div');
  wrapper.id = 'todolist-wrapper';

  document.body.append(wrapper);
}

mountToDoWrapper();

const vueTodoEl = new Vue({
  store,
  render: (h) => h(ToDoWrapper),
}).$mount('#todolist-wrapper');

let chromeRuntimePort = chrome.runtime.connect();

chromeRuntimePort.onDisconnect.addListener(() => {
  vueTodoBtn.$destroy();
  vueTodoBtn.$el.remove();
  vueTodoEl.$destroy();
  vueTodoEl.$el.remove();

  chromeRuntimePort = undefined;
});
