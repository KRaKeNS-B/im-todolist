<template>
  <div class="navbar__btn-wrapper">
    <div class="navbar__btn todolist__btn" @click="openToDoList">
      TD
    </div>
  </div>
</template>

<script>
import EventBus from '@/components/eventBus';

export default {
  name: 'todoBtn',
  methods: {
    openToDoList() {
      EventBus.$emit('OPEN_TODOLIST');
    },
  },
};
</script>

<style>
.todolist__btn {
  background-color: #FFF;
  color: #000;
}
</style>
