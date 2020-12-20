import Vue from 'vue';
import ToDoBtn from '@/components/ToDoBtn.vue';
import ToDoWrapper from '@/components/ToDoWrapper.vue';

// function getCurrentCourse() {
//   return document.body.className.match(/course-\d+/)[0];
// }
//
// function handleRequest(request, sender, cb) {
//   if (request.type === 'answers' && Object.keys(request.result).length !== 0) {
//     // courseAnswers = request.result[Object.keys(request.result)];
//     // setAnswers(courseAnswers);
//   }
// }
//
// function requestAnswers(course) {
//   chrome.runtime.sendMessage({
//     type: 'answersRequest',
//     results: course,
//   });
// }
//
// function sendCourseAnswers(answers, course) {
//   chrome.runtime.sendMessage({
//     type: 'saveAnswers',
//     results: { course, answers },
//   });
// }
//
// chrome.runtime.onMessage.addListener(handleRequest);

function mountNavBtn() {
  const navbar = document.querySelector('.navbar__buttons');

  const buttonWrapper = document.createElement('div');
  buttonWrapper.id = 'todolist-open-btn';

  navbar.prepend(buttonWrapper);
}

mountNavBtn();

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
  render: (h) => h(ToDoWrapper),
}).$mount('#todolist-wrapper');
