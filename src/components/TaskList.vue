<template>
  <div class="todolist__tasks">
    <TodolistTask
      v-for="task in tasks"
      :key="task.id"
      :task="task"
    />

    <br>

    <TodolistTask
      v-for="task in tasksDone"
      :key="task.id"
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
      return this.$store.state.taskList.filter((t) => !t.done);
    },
    tasksDone() {
      return this.$store.state.taskList.filter((t) => t.done);
    },
    allTasks() {
      return this.$store.state.taskList;
    },
  },
};
</script>
