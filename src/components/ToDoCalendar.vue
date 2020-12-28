<template>
  <div>
    <DatePicker class="calendar" v-model="date" :attributes="this.attributes"/>

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
// import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import TodolistTask from '@/components/TodolistTask';

export default {
  components: {
    DatePicker,
    TodolistTask,
  },
  data() {
    return {
      date: new Date(),
    };
  },
  watch: {
    date(val) {
      console.log(val);
    },
  },
  methods: {
    getDate(timestamp) {
      const date = new Date();
      date.setTime(timestamp);
      return date;
    },
    isCurrentDate(timestamp) {
      if (!this.date) return false;
      return this.date.getDate() === this.getDate(timestamp).getDate();
    },
    getDotClass(index) {
      if (index === 0) return 'dot-last';
      return 'dot-invisible';
    },
  },
  computed: {
    tasksDone() {
      return this.$store.state.taskList.filter((task) => task.done);
    },
    tasksDoneInCurrentDate() {
      return this.$store.state.taskList.filter((task) => (
        task.done
        && this.isCurrentDate(task.doneTime > 0 ? task.doneTime : task.id)
      ));
    },
    attributes() {
      const result = [];
      this.tasksDone.forEach((task, index) => {
        result.push({
          dates: this.getDate(task.doneTime > 0 ? task.doneTime : task.id),
          dot: {
            color: 'red',
            class: this.getDotClass(index),
          },
          popover: {
            label: task.text.length > 30 ? `${task.text.substr(0, 30)}...` : task.text,
          },
        });
      });
      return result;
    },
  },
};
</script>

<style>
.calendar{
  width: 100% !important;
}
.dot-invisible{
  display: none;
}
.dot-last{
  margin-right: 0px !important;
}
.calendar-task-container{
  overflow: auto;
  margin: 0 5px 0 0;
}
</style>
