<template>
  <div class="todolist__tasks">

    <draggable v-model="tasks" @end="onDragEnd" :handle="`.${draggableClass}`">
      <transition-group>
        <TodolistTask
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :draggableClass="draggableClass"
        />
      </transition-group>
    </draggable>

    <div class="completed_block" @click="onCompletedOpenClick">
      <span v-if="!completedOpened"><b>&#62;</b></span>
      <span v-if="completedOpened"><b>&#8744;</b></span>
      Завершенные задачи
    </div>

    <div v-if="completedOpened">
      <TodolistTask
        v-for="task in tasksDone"
        :key="task.id"
        :task="task"
      />
    </div>
  </div>
</template>

<script>
import TodolistTask from '@/components/TodolistTask';
import draggable from 'vuedraggable';

export default {
  name: 'TaskList',
  components: {
    TodolistTask,
    draggable,
  },
  data() {
    return {
      draggableClass: 'todolist__task-draggable',
      completedOpened: false,
    };
  },
  computed: {
    tasks() {
      return this.$store.state.taskList.filter((t) => !t.done);
    },
    tasksDone() {
      return this.$store.state.taskList.filter((t) => t.done);
    },
    allTasks() {
      return this.$store.state.taskList;
    },
  },
  methods: {
    onDragEnd({ newIndex, oldIndex }) {
      const oldTotalIndex = this.allTasks.indexOf(this.tasks[oldIndex]);
      const newTotalIndex = this.allTasks.indexOf(this.tasks[newIndex]);

      this.$store.dispatch('moveTaskToNewPosition', {
        newIndex: newTotalIndex,
        oldIndex: oldTotalIndex,
      });
    },
    onCompletedOpenClick() {
      this.completedOpened = !this.completedOpened;
    },
  },
};
</script>

<style scoped>
  .completed_block{
    color: #3763d4;
    padding: 20px;
    user-select: none;
    cursor: pointer;
  }
  .completed_block span{
    margin-right: 10px;
    font-size: 1.2em;
    vertical-align: middle;
  }
</style>
