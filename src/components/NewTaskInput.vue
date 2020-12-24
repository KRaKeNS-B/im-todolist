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
      v-model="newTaskText"
      class="todolist__task-input"
      placeholder="Добавить задачу"
      @keydown.enter="addNewTask"
    >
  </div>
</template>

<script>
export default {
  name: 'NewTaskInput',
  data() {
    return {
    };
  },
  computed: {
    isActive() {
      return this.newTaskText.length > 0;
    },
    newTaskText: {
      get() {
        return this.$store.state.newTask.text;
      },
      set(newValue) {
        this.$store.commit('updateNewTaskText', newValue);
      },
    },
  },
  methods: {
    addNewTask() {
      if (!this.newTaskText.length) return;
      this.$store.dispatch('addNewTask');
    },
  },
};
</script>

<style lang="scss">
</style>
