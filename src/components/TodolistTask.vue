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
      placeholder="Текст задачи"
      @blur="onBlur"
      :style="inputStyle"
    ></textarea>

    <i
      class="todolist__task-flag"
      @click="onFlagClick"
    >
      <!-- eslint-disable max-len -->
      <svg
        class="todolist__task-flag-svg"
        :class="{'todolist__task-flag-svg_active': task.important}"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 492.771 492.771"
        style="enable-background:new 0 0 492.771 492.771;"
        xml:space="preserve"
      >
        <path
          d="M431.732,279.197l-67.804-76.611l67.804-76.603c3.867-4.371,4.813-10.611,2.406-15.937
          c-2.39-5.325-7.684-8.75-13.537-8.75h-88.16V38.121c0-8.196-6.641-14.846-14.854-14.846H108.432C107.197,10.241,96.355,0,82.993,0
          S58.786,10.241,57.551,23.275h-0.239v2.406v200.18v241.228c0,14.18,11.501,25.682,25.682,25.682
          c14.179,0,25.681-11.502,25.681-25.682V225.861h102.628v63.177c0,8.196,6.642,14.846,14.854,14.846h194.462
          c5.838,0,11.132-3.425,13.538-8.751C436.545,289.809,435.6,283.568,431.732,279.197z"
        />
      </svg>
      <!-- eslint-enable max-len -->
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
      inited: false,
    };
  },
  props: {
    task: Object,
    draggableClass: String,
  },
  computed: {
  },
  watch: {
    done(val) {
      if (!this.inited) return;

      if (val) {
        this.startFinishingTask();
      } else {
        if (this.hideTimeout) clearTimeout(this.hideTimeout);
        this.task.done = false;
        this.task.doneTime = -1;
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
    startFinishingTask() {
      if (this.hideTimeout) clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(this.finishTask, 1000);
    },
    finishTask() {
      this.task.done = true;
      this.task.doneTime = new Date().getTime();
      this.$store.dispatch('saveTasksToLocalStorage');
    },
    onTaskTextClick() {
      if (this.done) return;
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
    isLastNewTaskId() {
      if (this.$store.state.lastNewTaskId === this.task.id) {
        this.onTaskTextClick();
      }
    },
  },
  mounted() {
    this.text = this.task.text;
    this.done = this.task.done;
    this.isLastNewTaskId();
    this.inited = true;
  },
};
</script>
