<template>
  <div class="todolist__wrapper profile" v-if="isOpen">
    <ToDoHeader @click="closeTodolist" />
    <ToDoTabs
      v-model="currentTab"
      :tabs="tabs"
    >
      <ToDoTab :is-active="isActiveTab(tabs[0])">
        <NewTaskInput />
        <TaskList />
      </ToDoTab>
      <ToDoTab :is-active="isActiveTab(tabs[1])">
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
import addBookmarkIconToTickets from '@/helpers/bookmarks';

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
      tabs: [
        { title: 'ToDo' },
        { title: 'Календарь' },
      ],
      currentTab: null,
      isOpen: false,
      ticketListObserver: null,
    };
  },
  methods: {
    isActiveTab(tab) {
      return tab === this.currentTab;
    },
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
            addBookmarkIconToTickets(this.$store.state.taskList);
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

      const messageText = taskText || messageNode.querySelector('.message__text').innerText;

      const result = {
        message: {
          id: messageNode.id.match(/message-(\d+)/)[1],
        },
        messageText,
        ticket: {
          id: ticketNode.id.match(/ticket-(\d+)/)[1],
          publicId: ticketNode.querySelector('.ticket__id-title').innerText,
        },
        group: {
          id: groupNode.id.match(/group-list__group_id_(\d+)/)[1],
          name: groupNode.querySelector('.group-list__group__name').innerText,
        },
      };

      return result;
    },
    onContextMenuEvent(e) {
      this.$store.commit('setLastContextmenuEvent', e);
    },
    observeTicketList() {
      const target = document.querySelector('.tickets-list__scroll-area');

      const observerConfig = {
        childList: true,
      };

      this.ticketListObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            addBookmarkIconToTickets(this.$store.state.taskList);
          }
        });
      });

      this.ticketListObserver.observe(target, observerConfig);
    },
    openTodolistHandler(payload = { type: null }) {
      switch (payload.type) {
        case 'FOCUS_TASK':
          this.openTodolist();
          this.$nextTick(() => {
            EventBus.$emit('FOCUS_TASK', payload.taskId);
          });
          break;
        default:
          this.openTodolist();
          break;
      }
    },
  },
  mounted() {
    this.$store.dispatch('getTaskList');

    document.addEventListener('contextmenu', this.onContextMenuEvent);

    chrome.runtime.onMessage.addListener(this.handleBackgroundRequest);
    EventBus.$on('OPEN_TODOLIST', this.openTodolistHandler);

    this.observeTicketList();
  },
  beforeDestroy() {
    document.removeEventListener('contextmenu', this.onContextMenuEvent);
    EventBus.$off('OPEN_TODOLIST', this.openTodolist);

    if (this.ticketListObserver) this.ticketListObserver.disconnect();
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

  &bookmark {
    cursor: pointer;

    &-text {
      min-height: 1em;
      line-height: 1em;
    }

    &-icon {
      position: relative;
      width: 12px;
      height: 15px;
      padding-top: 5px;

      &:after,
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 0;
        height: 0;
        border-bottom: 15px solid transparent;
      }

      &:after {
        border-right: 12px solid #FEBE10;
      }

      &:before {
        border-left: 12px solid #FEBE10;
      }
    }
  }

  &calendar{
    width: calc(100% - 32px);
    margin: 8px 16px 0 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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

    &-text-wrapper {
      width: 100%;
      margin: 0 20px 0 10px;
    }

    &-input,
    &-text,
    &-anchor-text {
      font-size: 16px;
      font-family: Roboto, sans-serif;
      padding: 10px 0;
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
      display: block;
    }

    &-text {
      cursor: default;
      word-wrap: break-word;
      word-break: break-word;
      white-space: pre-line;

      &_empty {
        color: #b0bec5;
      }
    }

    &-anchor-text {
      border-top: 1px solid #9e9e9e;
      color: #b0bec5;
      font-size: 13px;
      line-height: 16px;
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

    &-ticket-link {
      position: absolute;
      top: 1px;
      display: flex;
      font-size: 0.8em;
      background-color: #b0bec5;
      padding: 0 5px;
      line-height: 1em;
      border-radius: 0 0 4px 4px;
      color: #fff;
      cursor: pointer;

      &_active {
        padding-top: 10px;
      }

      &-group {
        margin-right: 10px;
      }
    }
  }

  &highlighted-message {
    box-shadow: inset 5px 0 0 #febe10;
    transition: box-shadow .5s;

    &_end {
      transition: box-shadow 1s;
    }
  }
}
</style>
