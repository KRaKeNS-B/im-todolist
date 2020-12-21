<template>
  <div class="todolist__tasks">

    <draggable v-model="tasks" @end="onEnd">
      <transition-group>
        <TodolistTask v-for="task in tasks" :key="task.id" :task="task"/>
      </transition-group>
    </draggable>
  <br>
    <div>
      <TodolistTask v-for="task in tasksDone" :key="task.id" :task="task"/>
    </div>
  </div>
</template>

<script>
import TodolistTask from '@/components/TodolistTask';
import draggable from 'vuedraggable';

export default {
  name: 'TaskList',
  components: { TodolistTask, draggable },
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
    onEnd(e) {
      console.log(e);
      const { newIndex } = e;
      const { oldIndex } = e;
      const oldTotalIndex = this.allTasks.indexOf(this.tasks[oldIndex]);
      const newTotalIndex = this.allTasks.indexOf(this.tasks[newIndex]);

      const { taskList } = this.$store.state;
      const item = taskList[oldTotalIndex];
      taskList.splice(oldTotalIndex, 1);
      taskList.splice(newTotalIndex, 0, item);
      this.$store.dispatch('saveTasksToLocalStorage');
    },
  },
};
</script>
