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
import { getAttributesByTasks, getDate, getTaskTimestamp } from '@/helpers/taskHelpers';

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
        .filter((task) => (this.isCurrentDate(getTaskTimestamp(task))));
    },
    attributes() {
      return getAttributesByTasks(this.tasksDone);
    },
  },
  methods: {
    isCurrentDate(timestamp) {
      if (!this.date) return false;
      return this.date.getDate() === getDate(timestamp).getDate();
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
