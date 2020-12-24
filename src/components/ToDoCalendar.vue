<template>
  <div>
    <Calendar class="calendar"/>
  </div>
</template>

<script>
import Calendar from 'v-calendar/lib/components/calendar.umd';

export default {
  components: {
    Calendar,
  },
  data() {
    return {
      attributes: [

      ],
    };
  },
};
</script>

<style scoped>
  .calendar{
    width: 100%;
  }
</style>
