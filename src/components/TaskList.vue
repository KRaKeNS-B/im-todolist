<template>
  <div class="todolist__tasks">
    <TodolistTask
      v-for="(task, index) in tasks"
      :key="index"
      :task="task"
    />
  </div>
</template>

<script>
import TodolistTask from '@/components/TodolistTask';

export default {
  name: 'TaskList',
  components: { TodolistTask },
  computed: {
    tasks() {
      return this.$store.state.taskList;
    },
  },
};
</script>
