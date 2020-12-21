<template>
  <div class="todolist__task">

    <input type="checkbox" v-model="done">

    <input
      :class="{'todolist__task-text-done': done, 'todolist__task-text': !done}"
      type="text"
      v-model="text"
      class="todolist__task-input"
      placeholder="Напишите комментарий"
      @blur="onBlur">

  </div>
</template>

<script>
export default {
  name: 'TodolistTask',
  data() {
    return {
      text: '',
      done: false,
      hideTimeout: null,
    };
  },
  mounted() {
    this.text = this.task.text;
    this.done = this.task.done;
  },
  watch: {
    async done(val) {
      if (val) {
        this.startHide();
      } else {
        if (this.hideTimeout) clearTimeout(this.hideTimeout);
        this.task.done = false;
        this.$store.dispatch('saveTasksToLocalStorage');
      }
    },
  },
  methods: {
    onBlur() {
      this.task.text = this.text;
      this.$store.dispatch('saveTasksToLocalStorage');
    },
    startHide() {
      if (this.hideTimeout) clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(this.hide, 1000);
    },
    hide() {
      this.task.done = true;
      this.$store.dispatch('saveTasksToLocalStorage');
    },
  },
  props: {
    task: Object,
  },
};
</script>

<style>
  .todolist__task-text{

  }
  .todolist__task-text-done{
    text-decoration: line-through;
  }
</style>
