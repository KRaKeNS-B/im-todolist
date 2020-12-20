<template>
  <div class="todolist__wrapper profile" v-if="isOpen">
    <ToDoHeader @click="closeTodolist" />
    <div class="todolist__tasks"></div>
  </div>
</template>

<script>
import ToDoHeader from '@/components/ToDoHeader';
import EventBus from '@/components/eventBus';

export default {
  name: 'ToDoWrapper',
  components: { ToDoHeader },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    openTodolist() {
      this.isOpen = true;
    },
    closeTodolist() {
      this.isOpen = false;
    },
  },
  mounted() {
    EventBus.$on('OPEN_TODOLIST', this.openTodolist);
  },
  beforeDestroy() {
    EventBus.$off('OPEN_TODOLIST', this.openTodolist);
  },
};
</script>

<style lang="scss">
.todolist__wrapper {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
