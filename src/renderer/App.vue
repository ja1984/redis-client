<template>
  <div id="app" :class="{'app--theme-dark': darkMode}">
    <side-bar :redis="redis" :server="selectedServer" :selectedFullKey="selectedFullKey" @setKey="setSelectedKey"></side-bar>
    <main-content :redis="redis" :keyObject="selectedKey"></main-content>
    <server-select @selectServer="selectServer" :redis="redis" :show="selectedServer === null"></server-select>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar';
import MainContent from '@/components/MainContent';
import ServerSelect from '@/components/ServerSelect';
const Redis = require('ioredis');
const { systemPreferences } = require('electron').remote;

// const redis = new Redis(6379, '127.0.0.1');
export default {
  name: 'redis-client',
  components: {
    MainContent,
    SideBar,
    ServerSelect,
  },
  data() {
    return {
      selectedKey: null,
      selectedServer: null,
      redis: null,
      darkMode: false,
    };
  },
  methods: {
    selectServer(server) {
      this.redis = new Redis(server.port, server.host);
      this.selectedServer = server;
    },
    setSelectedKey(key) {
      this.selectedKey = key;
    },
  },
  computed: {
    selectedFullKey() {
      if (this.selectedKey === null) return '';
      return this.selectedKey.key;
    },
  },
  mounted() {
    if (systemPreferences) {
      // systemPreferences.setAppLevelAppearance('dark');
      this.darkMode = systemPreferences.isDarkMode();
    }

    systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
      this.darkMode = systemPreferences.isDarkMode();
    });

    // Add testdata for redis
    // for (let i = 0; i < 1000; i += 1) {
    //   redis.set(`a:key2:a:${i}`, 'testdata');
    // }
    // for (let i = 0; i < 1000; i += 1) {
    //   redis.set(`b:c:d:e:${i}`, 'testdata');
    // }
    // for (let i = 0; i < 2000; i += 1) {
    //   redis.set(`c:${i}`, 'testdata');
    // }
    // for (let i = 0; i < 4000; i += 1) {
    //   redis.set(`d:${i}`, 'testdata');
    // }

    // redis.scan(cursor, 'MATCH', pattern, 'COUNT', fetchCount, (err, res) => {

    // // redis.get('wordpress-api:Production:chancehill.com:getlanguages').then((res) => {
    // //   console.log(res);
    // // });
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
/* 
:not(input):not(textarea),
:not(input):not(textarea)::after,
:not(input):not(textarea)::before {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
} */
input,
button,
textarea,
:focus {
  outline: none;
}

/* a:not([draggable="true"]),
img:not([draggable="true"]) {
  -webkit-user-drag: none;
  user-drag: none; 
}
a[href^="http://"],
a[href^="https://"],
a[href^="ftp://"] {
  -webkit-user-drag: auto;
  user-drag: auto; 
} */

body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

html {
  font-size: 62.5%;
}

body,
input,
select {
  font-size: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

@media (prefers-color-scheme: dark) {
  body {
    background: red;
  }
}

.form-field input, .form-field select {
  width: 100%;
}

input, select {
  border: none;
  padding: 1.2rem;
  background: #fff;
  border: 0.1rem solid #dfdfdf;
  border-radius: 0.3rem;
  height: 4.4rem;
}

select {
  -webkit-appearance: none;
  -webkit-border-radius: 0px;
  border-radius: 0.3rem;
}

.form-field .short-width {
  width: 15rem;
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  background: #fff;
  color: #333;
}

#app.app--theme-dark {
  background: #282d3a;
  color: #eee;
}

.row {
  display: flex;
}

.row.row--center-vert {
  align-items: center;
}
.row.row--spaced {
  margin: 0 -0.5rem;
}

.row.row--spaced .column {
  padding: 0 0.5rem;
}

.column {
  flex: 1;
}

.column.column--wrap {
  flex: none;
}

.button {
  color: #fff;
  background: #ccc;
  display: inline-block;
  text-decoration: none;
  border-radius: 0.3rem;
  padding: 1rem 1.7rem;
  border: none;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all ease 0.3s;
  font-family: inherit;
  font-size: 1.4rem;
  line-height: 1;
  text-align: center;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.button.button--transparent {
  background: transparent;
  color: #333;
}
.button.button--primary {
  background: #2196F3;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-to,
.modal-leave {
  opacity: 1;
}

/* CSS */
</style>
