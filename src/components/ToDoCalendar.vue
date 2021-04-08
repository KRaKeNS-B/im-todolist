<template>
  <div>
    <DatePicker class="calendar" v-model="date" :attributes="attributes" />

    <div class="calendar-task-container">
      <TodolistTask
        v-for="task in tasksDoneInCurrentDate"
        :key="task.id"
        :task="task"
      />
    </div>
  </div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import TodolistTask from '@/components/TodolistTask';

export default {
  name: 'ToDoCalendar',
  components: {
    DatePicker,
    TodolistTask,
  },
  data() {
    return {
      date: new Date(),
    };
  },
  computed: {
    tasksDone() {
      return this.$store.state.taskList.filter((task) => task.done);
    },
    tasksDoneInCurrentDate() {
      return this.tasksDone
        .filter((task) => (this.isCurrentDate(task.doneTime > 0 ? task.doneTime : task.id)));
    },
    attributes() {
      const days = {};
      this.tasksDone.forEach((task) => {
        const date = new Date();
        date.setTime(task.doneTime > 0 ? task.doneTime : task.id);
        const key = `${date.getDate()}${date.getMonth()}${date.getFullYear()}`;
        if (!days[key]) days[key] = [];
        days[key].push(task);
      });

      const result = [];

      Object.keys(days).forEach((date) => {
        days[date].forEach((task, index) => {
          result.push({
            dates: this.getDate(task.doneTime > 0 ? task.doneTime : task.id),
            dot: {
              color: 'red',
              class: this.getDotClass(index),
            },
            popover: {
              label: this.getTaskText(task),
            },
          });
        });
      });
  methods: {
    getDate(timestamp) {
      return new Date(timestamp);
    },
    isCurrentDate(timestamp) {
      if (!this.date) return false;
      return this.date.getDate() === this.getDate(timestamp).getDate();
    },
    getDotClass(index) {
      return index === 0 ? 'dot-last' : 'dot-invisible';
    },
    getTaskText(task) {
      const text = task.text ? task.text : task.anchorText;

      return text.length > 20 ? `${text.substr(0, 20)}...` : text;
    },
  },
};
</script>

<style>
.calendar {
  width: 100% !important;
}

.dot-invisible {
  display: none;
}

.dot-last {
  margin: 0 0 22px 22px !important;
}

.calendar-task-container {
  overflow: auto;
  margin: 0 5px 0 0;
}
</style>
