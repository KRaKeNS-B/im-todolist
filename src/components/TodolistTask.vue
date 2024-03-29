<template>
  <div
    class="todolist__task"
    :class="{
      'todolist__task_active': editing,
      'todolist__task-ticket-link_active': isTaskHasLinkToTicket,
      'todolist__highlighted-message': isFocused,
    }"
    @contextmenu.prevent="openParentTicket"
    ref="task"
  >
    <div
      class="todolist__task-ticket-link"
      v-if="isTaskHasLinkToTicket"
      @click="openParentTicket"
    >
      <div class="todolist__task-ticket-link-group">
        {{task.group.name || 'Устарел'}}
      </div>
      <div class="todolist__task-ticket-link-ticket">
        {{task.ticket.publicId || 'Устарел'}}
      </div>
    </div>

    <i :class="draggableClass" v-if="draggableClass">&#8286;&#8286;</i>

    <input type="checkbox" v-model="done">

    <div class="todolist__task-text-wrapper">
      <div
        class="todolist__task-text"
        :class="{
          'todolist__task_done': done && text,
          'todolist__task-text_empty': !text,
        }"
        @click="onTaskTextClick"
        v-if="!editing"
      >
        {{text || 'Добавьте комментарий...'}}
      </div>
      <textarea
        v-else
        v-model="text"
        class="todolist__task-input todolist__task-input_textarea"
        rows="1"
        ref="input"
        placeholder="Текст задачи"
        @blur="onBlur"
        :style="inputStyle"
      ></textarea>

      <div
        v-if="task.anchorText"
        class="todolist__task-anchor-text"
        :class="{
          'todolist__task_done': done,
        }"
        @click="openParentTicket"
      >
        {{task.anchorText}}...
      </div>
    </div>

    <i
      class="todolist__task-flag"
      @click="onFlagClick"
    >
      <!-- eslint-disable max-len -->
      <svg
        class="todolist__task-flag-svg"
        :class="{'todolist__task-flag-svg_active': task.important}"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 492.771 492.771"
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
import openParentTicketHelper from '@/helpers/openParentTicket';
import EventBus from '@/components/eventBus';

export default {
  name: 'TodolistTask',
  data() {
    return {
      text: '',
      done: false,
      doneTimeout: null,
      editing: false,
      inputStyle: '',
      inited: false,
      isFocused: false,
    };
  },
  props: {
    task: Object,
    draggableClass: String,
  },
  computed: {
    isTaskHasLinkToTicket() {
      return !!this.task.group.id;
    },
  },
  watch: {
    done(val) {
      if (!this.inited) return;

      if (val) {
        this.startFinishingTask();
      } else {
        if (this.doneTimeout) clearTimeout(this.doneTimeout);
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
      if (this.doneTimeout) clearTimeout(this.doneTimeout);
      this.doneTimeout = setTimeout(this.finishTask, 1000);
    },
    finishTask() {
      this.task.done = true;
      this.task.doneTime = new Date().getTime();
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
        this.$nextTick(() => {
          this.inputStyle = this.$refs.input ? `height: ${this.$refs.input.scrollHeight}px;` : '';
        });
      });
    },
    isLastNewTaskId() {
      if (this.$store.state.lastNewTaskId === this.task.id) {
        this.onTaskTextClick();
      }
    },
    openParentTicket() {
      openParentTicketHelper(this.task);
    },
    focusTask(taskId) {
      if (taskId === this.task.id) {
        this.$refs.task.scrollIntoView();
        this.isFocused = true;

        setTimeout(() => {
          this.isFocused = false;
        }, 5000);
      } else {
        this.isFocused = false;
      }
    },
    async initTask() {
      await this.$nextTick();
      this.inited = true;
    },
  },
  mounted() {
    this.text = this.task.text;
    this.done = this.task.done;
    this.isLastNewTaskId();
    this.initTask();

    EventBus.$on('FOCUS_TASK', this.focusTask);
  },
  beforeDestroy() {
    EventBus.$off('FOCUS_TASK', this.focusTask);
  },
};
</script>
