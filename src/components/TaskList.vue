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

    <div class="todolist__show-done-tasks-btn" @click="onDoneTasksOpenClick">
      <span
        class="todolist__show-done-tasks-arrow"
        :class="{ 'todolist__show-done-tasks-arrow_active': isDoneTasksOpened}"
      >
        &#10095;
      </span>
      Завершенные задачи
    </div>

    <div v-if="isDoneTasksOpened">
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
      isDoneTasksOpened: false,
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
    onDoneTasksOpenClick() {
      this.isDoneTasksOpened = !this.isDoneTasksOpened;
    },
  },
};
</script>

<style lang="scss" scoped>
.todolist__show-done-tasks {
  &-btn {
    color: #3763D4;
    padding: 10px 20px;
    user-select: none;
    cursor: pointer;
  }

  &-arrow {
    margin-right: 10px;
    font-size: 1.2em;
    vertical-align: middle;

    &_active {
      transform: rotate(90deg);
      display: inline-block;
    }
  }
}
</style>
