<template>
  <div class="todolist__task todolist__task-item">

    <div class="todolist__task-header">

      <div style="flex-grow: 1">Public</div>
      <div>{{task.ticketId}}</div>

    </div>

    <div class="todolist__task-content">
      <input type="checkbox" v-model="done">

      <input
        :class="{
          'todolist__task-text-done': this.done,
          'todolist__task-text': !this.done,
          'todolist__task-text-editing': !this.editing,
        }"
        type="text"
        v-model="text"
        class="todolist__task-input"
        placeholder="Напишите комментарий"
        ref="input"
        @click="onClick"
        @blur="onBlur"/>

    </div>
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
      editing: false,
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
    onBlur(e) {
      this.editing = false;
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
    onClick() {
      this.editing = true;
      this.$refs.input.focus();
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
  .todolist__task-text-editing{
    user-select: none;
  }
  .todolist__task-text-done{
    text-decoration: line-through;
  }
  .todolist__task-item{
    flex-direction: column;
    align-items: start !important;
    cursor: grab;
  }
  .todolist__task-header{
    display: flex;
    flex-direction: row;
    margin-top: 5px;
    width: 100%;
  }
  .todolist__task-content{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
