import Vue from 'vue';
import store from '@/store';
import ToDoBtn from '@/components/ToDoBtn';
import ToDoWrapper from '@/components/ToDoWrapper';
import VCalendar from 'v-calendar';

function mountNavBtn() {
  const navbar = document.querySelector('.navbar__buttons');

  const buttonWrapper = document.createElement('div');
  buttonWrapper.id = 'todolist-open-btn';

  navbar.prepend(buttonWrapper);
}

mountNavBtn();

Vue.use(VCalendar);
new Vue({
  render: (h) => h(ToDoBtn),
}).$mount('#todolist-open-btn');

function mountToDoWrapper() {
  const wrapper = document.createElement('div');
  wrapper.id = 'todolist-wrapper';

  document.body.append(wrapper);
}

mountToDoWrapper();

new Vue({
  store,
  render: (h) => h(ToDoWrapper),
}).$mount('#todolist-wrapper');
