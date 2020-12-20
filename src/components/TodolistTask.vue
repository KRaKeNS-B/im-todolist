<template>
  <div class="todolist__task">
    <div class="todolist__task-text">
      {{task.text}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodolistTask',
  props: {
    task: Object,
  },
};
</script>
