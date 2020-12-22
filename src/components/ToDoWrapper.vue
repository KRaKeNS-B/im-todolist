<template>
  <div class="todolist__wrapper profile" v-if="isOpen">
    <ToDoHeader @click="closeTodolist" />
    <NewTaskInput />
    <TaskList />
  </div>
</template>

<script>
import ToDoHeader from '@/components/ToDoHeader';
import EventBus from '@/components/eventBus';
import NewTaskInput from '@/components/NewTaskInput';
import TaskList from '@/components/TaskList';

export default {
  name: 'ToDoWrapper',
  components: { TaskList, NewTaskInput, ToDoHeader },
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
    handleBackgroundRequest(request) {
      switch (request.type) {
        case 'getTaskList':
        case 'taskListSaved':
          if (request.taskList) {
            this.$store.commit('updateTaskList', request.taskList);
          }
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    this.$store.dispatch('getTaskList');

    chrome.runtime.onMessage.addListener(this.handleBackgroundRequest);
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

.todolist__task {
  padding: 0 16px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  min-height: 48px;
  -webkit-box-shadow: 0 17px 0 -16px #edebe9;
  box-shadow: 0 17px 0 -16px #edebe9;

  &_active {
    -webkit-box-shadow: 0 17px 0 -16px #3763d4;
    box-shadow: 0 17px 0 -16px #3763d4;
  }

  &-add-btn {
    position: relative;
    width: 17px;
    height: 17px;
    cursor: pointer;

    span {
      position: absolute;
      top: 7px;
      left: 0;
      width: 17px;
      height: 1px;
      background: #3763d4;

      &:nth-child(1) {
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        transform: rotate(90deg);
      }
    }
  }

  &-input, &-text {
    font-size: 16px;
    font-family: Roboto,sans-serif;
    padding: 5px 17px 5px 12px;
    -webkit-font-smoothing: antialiased;
    font-weight: 400;
    box-shadow: none;
    margin: 0;
    box-sizing: border-box;
    border-radius: 0;
    border: none;
    background: none transparent;
    width: 100%;
    min-width: 0;
    text-overflow: ellipsis;
    outline: 0;
    line-height: 20px;
  }

  &-text {
    cursor: default;
  }

  &_done {
    text-decoration: line-through;
  }

  &-draggable {
    display: none;
    position: absolute;
    left: 0;
    width: 16px;
    height: 48px;
    text-align: center;
    vertical-align: middle;
    line-height: 48px;
    font-style: normal;
    cursor: grab;
  }

  &:hover &-draggable {
    display: block;
  }
}
</style>
