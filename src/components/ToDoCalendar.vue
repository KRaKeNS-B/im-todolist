<template>
  <div>
    <Calendar class="calendar" :attributes="this.attributes">
  </div>
</template>

<script>
import Calendar from 'v-calendar/lib/components/calendar.umd';

export default {
  components: {
    Calendar,
  },
  methods: {
    getDate(timestamp) {
      const date = new Date();
      date.setTime(timestamp);
      return date;
    },
  },
  computed: {
    tasksDone() {
      return this.$store.state.taskList.filter((t) => t.done);
    },
    attributes() {
      const result = [];
      this.tasksDone.forEach((task, index) => {
        result.push({
          dates: this.getDate(task.doneTime > 0 ? task.doneTime : task.id),
          dot: {
            color: 'red',
            class: index > 3 ? 'dot-invisible' : '',
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
</style>
