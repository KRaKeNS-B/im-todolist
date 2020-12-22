<template>
  <div class="todolist__task" :class="{'todolist__task_active': editing}">
    <i :class="draggableClass" v-if="draggableClass">&#8286;&#8286;</i>

    <input type="checkbox" v-model="done">

    <span
      class="todolist__task-text"
      :class="{'todolist__task_done': done}"
      @click="onTaskTextClick"
      v-if="!editing"
    >
      {{text}}
    </span>

    <textarea
      v-else
      :class="{'todolist__task_done': done}"
      type="text"
      v-model="text"
      class="todolist__task-input todolist__task-input_textarea"
      rows="1"
      ref="input"
      @blur="onBlur"
      :style="inputStyle"
    ></textarea>

    <i
      class="todolist__task-flag"
      :class="{'todolist__task-flag_active': task.important}"
      @click="onFlagClick"
    >
      &#127987;
    </i>
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
      inputStyle: '',
    };
  },
  props: {
    task: Object,
    draggableClass: String,
  },
  watch: {
    done(val) {
      if (val) {
        this.startHide();
      } else {
        if (this.hideTimeout) clearTimeout(this.hideTimeout);
        this.task.done = false;
        this.$store.dispatch('saveTasksToLocalStorage');
      }
    },
    text() {
      this.resizeTextarea();
    },
  },
  methods: {
    onBlur() {
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
    onTaskTextClick() {
      this.editing = true;
      this.$nextTick(() => {
        this.resizeTextarea();
        this.$refs.input.focus();
      });
    },
    onFlagClick() {
      this.task.important = !this.task.important;
      this.$store.dispatch('saveTasksToLocalStorage');
    },
    resizeTextarea() {
      this.inputStyle = this.$refs.input ? 'height:auto;' : '';
      this.$nextTick(() => {
        this.inputStyle = this.$refs.input ? `height: ${this.$refs.input.scrollHeight}px;` : '';
      });
    },
  },
  mounted() {
    this.text = this.task.text;
    this.done = this.task.done;
  },
};
</script>
