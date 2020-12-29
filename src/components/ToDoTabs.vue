<template>
    <div class="tabs-container">
        <div class="tabs">
        <ul>
            <li v-for="tab in tabs" :key="tab.name" :class="{ 'is-active': tab.isActive }">
                <div class="tab-title" @click="selectTab(tab)">{{ tab.name }}</div>
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
  data() {
    return { tabs: [] };
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = (tab.name === selectedTab.name);// eslint-disable-line no-param-reassign
      });
    },
  },
};
</script>

<style>
    .tabs {
        user-select: none;
        _webkit-box-align: stretch;
        align-items: stretch;
        display: flex;
        font-size: 1em;
        _webkit-box-pack: justify;
        overflow: hidden;
        overflow-x: auto;
        white-space: no-wrap;
        min-height: 54px;
    }
    .tabs-container{
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .tabs li {
        display: block;
    }
    .tabs li.is-active .tab-title {
        border-bottom-color: #3763d4;
        color: #3763d4;
    }
    .tabs .tab-title:hover{
      border-bottom-color: #363636;
      color: #363636;
    }
    .tabs .tab-title {
      -webkit-box-align: center;
      align-items: center;
      border-bottom: 1px solid #dbdbdb;
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
      border-bottom: 1px solid #dbdbdb;
      display: flex;
      -webkit-box-flex: 1;
      flex-grow: 1;
      flex-shrink: 0;
      -webkit-box-pack: start;
      justify-content: flex-start;
      padding: 0px;
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
