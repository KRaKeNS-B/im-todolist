<template>
  <div class="todolist__task" :class="{'todolist__task_active': isActive}">
    <div
      title="Добавить задачу"
      class="todolist__task-add-btn"
      @click="addNewTask"
    >
      <span></span><span></span>
    </div>
    <input
      type="text"
      v-model="taskText"
      class="todolist__task-input"
    >
  </div>
</template>

<script>
export default {
  name: 'NewTaskInput',
  data() {
    return {
      taskText: '',
    };
  },
  computed: {
    isActive() {
      return this.taskText.length > 0;
    },
  },
  methods: {
    addNewTask() {
      this.$store.commit('addNewTaskByText', this.taskText);
      this.taskText = '';
    },
  },
};
</script>

<style lang="scss">
</style>
