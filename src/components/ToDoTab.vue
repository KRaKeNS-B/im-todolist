<template>
  <div v-show="isActive" class="tab-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ToDoTab',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.tab-container{
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
