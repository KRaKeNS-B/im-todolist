<template>
  <div class="tabs-container">
    <div class="tabs">
      <ul>
        <li v-for="tab in tabs" :key="tab.title" :class="{ 'is-active': isActive(tab) }">
          <div class="tab-title" @click="selectTab(tab)">
            {{ tab.title }}
          </div>
        </li>
      </ul>
    </div>
    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToDoTabs',
  model: {
    prop: 'activeTab',
    event: 'update:tab',
  },
  props: {
    activeTab: Object,
    tabs: {
      required: true,
      type: Array,
      validator(value) {
        return value.every((el) => el && el.title !== undefined);
      },
    },
  },
  methods: {
    isActive(tab) {
      if (this.activeTab === undefined) {
        return tab === this.tabs[0];
      }

      return tab === this.activeTab;
    },
    selectTab(selectedTab) {
      this.$emit('update:tab', selectedTab);
    },
  },
  mounted() {
    if (!this.activeTab) {
      this.selectTab(this.tabs[0]);
    }
  },
};
</script>

<style>
.tabs {
  user-select: none;
  -webkit-box-align: stretch;
  align-items: stretch;
  display: flex;
  font-size: 1em;
  -webkit-box-pack: justify;
  overflow: hidden;
  overflow-x: auto;
  white-space: nowrap;
  min-height: 54px;
}

.tabs-container {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tabs li {
  display: block;
}

.tabs li.is-active .tab-title {
  border-bottom-color: #3763D4;
  color: #3763D4;
}

.tabs .tab-title:hover {
  border-bottom-color: #363636;
  color: #363636;
}

.tabs .tab-title {
  -webkit-box-align: center;
  align-items: center;
  border-bottom: 1px solid #DBDBDB;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  margin-bottom: -1px;
  padding: .5em 1em;
  vertical-align: top;
}

.tabs ul {
  -webkit-box-align: center;
  align-items: center;
  border-bottom: 1px solid #DBDBDB;
  display: flex;
  -webkit-box-flex: 1;
  flex-grow: 1;
  flex-shrink: 0;
  -webkit-box-pack: start;
  justify-content: flex-start;
  padding: 0;
  margin: 5px 16px 10px 16px;
}

.tab-title {
  cursor: pointer;
  text-decoration: none;
  transition: none 86ms ease-out;
}

.tab-title:hover {
  color: #363636;
}

.tabs-details {
  overflow: hidden;
  height: 100%;
}
</style>
