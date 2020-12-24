<template>
  <div class="todolist__wrapper profile" v-if="isOpen">
    <ToDoHeader @click="closeTodolist" />
    <ToDoTabs>
      <ToDoTab name="ToDo" :selected="true">
        <NewTaskInput />
        <TaskList />
      </ToDoTab>
      <ToDoTab name="Календарь">
        <ToDoCalendar class="todolist__calendar"/>
      </ToDoTab>
    </ToDoTabs>
  </div>
</template>

<script>
import ToDoHeader from '@/components/ToDoHeader';
import EventBus from '@/components/eventBus';
import NewTaskInput from '@/components/NewTaskInput';
import TaskList from '@/components/TaskList';
import ToDoTabs from '@/components/ToDoTabs';
import ToDoTab from '@/components/ToDoTab';
import ToDoCalendar from '@/components/ToDoCalendar';

export default {
  name: 'ToDoWrapper',
  components: {
    TaskList,
    NewTaskInput,
    ToDoHeader,
    ToDoTabs,
    ToDoTab,
    ToDoCalendar,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    openTodolist() {
      this.isOpen = true;
      this.$nextTick(() => {
        window.addEventListener('click', this.onBlurTodoList);
      });
    },
    closeTodolist() {
      this.isOpen = false;
      window.removeEventListener('click', this.onBlurTodoList);
    },
    handleBackgroundRequest(request) {
      switch (request.type) {
        case 'getTaskList':
        case 'taskListSaved':
          if (request.taskList) {
            this.$store.commit('updateTaskList', request.taskList);
          }
          break;
        case 'getMessageData':
          this.addNewTaskByMessage(request.text);
          break;
        default:
          break;
      }
    },
    addNewTaskByMessage(taskText) {
      const messageData = this.getMessageData(taskText);
      if (messageData) {
        this.$store.dispatch('addNewTaskByMessage', messageData);
        this.openTodolist();
      }
    },
    getMessageData(taskText) {
      const contextEvent = this.$store.state.lastContextmenuEvent;

      if (!contextEvent) return false;

      const paths = contextEvent.path.filter((el) => (/message-\d+|ticket-\d+/g.test(el.id)));

      if (paths.length < 2) {
        if (taskText) {
          return { messageText: taskText };
        }
        return false;
      }

      const messageNode = (/message-\d+/g.test(paths[0].id)) ? paths[0] : paths[1];
      const ticketNode = (/ticket-\d+/g.test(paths[0].id)) ? paths[0] : paths[1];
      const groupNode = document.querySelector('.group-list__group.active');

      const messageId = messageNode.id.match(/message-(\d+)/)[1];
      const messageText = taskText || messageNode.querySelector('.message__text').innerText;
      const ticketId = ticketNode.id.match(/ticket-(\d+)/)[1];
      const groupId = groupNode.id.match(/group-list__group_id_(\d+)/)[1];

      const result = {
        messageId,
        messageText,
        ticketId,
        groupId,
      };

      console.log(result);

      return result;
    },
    onContextMenuEvent(e) {
      this.$store.commit('setLastContextmenuEvent', e);
    },
    onBlurTodoList(e) {
      const paths = e.path.filter((el) => (/todolist__wrapper|todolist__btn/g.test(el.className)));
      if (paths.length === 0) this.closeTodolist();
    },
  },
  mounted() {
    this.$store.dispatch('getTaskList');

    document.addEventListener('contextmenu', this.onContextMenuEvent);

    chrome.runtime.onMessage.addListener(this.handleBackgroundRequest);
    EventBus.$on('OPEN_TODOLIST', this.openTodolist);
  },
  beforeDestroy() {
    document.removeEventListener('contextmenu', this.onContextMenuEvent);
    window.removeEventListener('click', this.onBlurTodoList);
    EventBus.$off('OPEN_TODOLIST', this.openTodolist);
  },
};
</script>

<style lang="scss">
.todolist__ {
  &wrapper {
    position: absolute;
    top: 0;
    right: 0;
    overflow: hidden;
  }

  &calendar{
    width: calc(100% - 32px);
    margin: 8px 16px;
  }

  &tasks {
    overflow-x: hidden;
    overflow-y: auto;
  }

  &task {
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
    -webkit-box-shadow: 0 17px 0 -16px #EDEBE9;
    box-shadow: 0 17px 0 -16px #EDEBE9;

    &_active {
      -webkit-box-shadow: 0 17px 0 -16px #3763D4;
      box-shadow: 0 17px 0 -16px #3763D4;
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
        background: #3763D4;

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
      font-family: Roboto, sans-serif;
      padding: 10px 17px 10px 12px;
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
      resize: none;
    }

    &-input_textarea {
      overflow: hidden;
    }

    &-text {
      cursor: default;
      word-wrap: break-word;
      word-break: break-word;
      white-space: pre-line;
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

    &-flag {
      position: absolute;
      right: 10px;
      height: 48px;
      text-align: center;
      vertical-align: middle;
      line-height: 48px;
      font-style: normal;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;

      &-svg {
        width: 16px;
        height: 16px;
        fill: #B0BEC5;

        &_active {
          fill: #587BD4;
        }
      }
    }
  }
}
</style>
