<template>
  <div class="todolist__header">
    <div class="todolist__header-title">To Do</div>
    <close-button @click="$emit('click')" />
  </div>
</template>

<script>
import CloseButton from '@/components/CloseButton';

export default {
  name: 'ToDoHeader',
  components: { CloseButton },
};
</script>

<style lang="scss">
.todolist__header {
  padding: 0 20px;
  min-height: 46px;
  background: #000000;
  color: #fff;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  &-title {
    font-size: 1.3em;
  }
}
</style>
