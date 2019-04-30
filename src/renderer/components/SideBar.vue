<template>
  <aside class="sidebar">
    <header class="sidebar__header">
      <input
        type="search"
        class="sidebar__filter"
        v-model="filter"
        placeholder="Type to filter keys"
      >
    </header>
    <section class="key-list">
      <div class="databases">
        <database-list-item
          v-for="database in databases"
          :filter="filter"
          :server="server"
          :selectedFullKey="selectedFullKey"
          :database="database"
          :redis="redis"
          @loadKey="loadKey"
          :key="database.id"
        ></database-list-item>
      </div>
    </section>
    <!-- <footer>
      <div class="footer__button">
        <i class="fas fa-cog"></i> Settings
      </div>
    </footer>-->
  </aside>
</template>

<script>
import KeyGroup from '@/components/KeyGroup';
import DatabaseListItem from '@/components/DatabaseListItem';
export default {
  name: 'SideBar',
  props: {
    redis: {
      type: Object,
    },
    server: {
      type: Object,
    },
    selectedFullKey: {
      type: String,
      default: '',
    },
  },
  components: {
    KeyGroup,
    DatabaseListItem,
  },
  data() {
    return {
      keys: [],
      databases: [],
      filter: '',
      groups: {},
      client: null,
    };
  },
  mounted() {
    // redis.info().then((res) => {
    //   console.log(res);
    // });

    // this.loadData(0);
  },
  methods: {
    loadKey(payload) {
      console.log(payload);
      payload.redis.type(payload.key).then((type) => {
        console.log('loadKey', type);
        switch (type) {
          case 'hash':
            this.loadHash(payload);
            break;
          case 'lists':
            this.loadLists(payload);
            break;
          case 'set':
            this.loadSets(payload);
            break;
          case 'zset':
            this.loadZSet(payload);
            break;
          default:
            this.loadString(payload);
            break;
        }
      });
    },
    loadTtl(payload) {
      return new Promise((resolve) => {
        payload.redis.ttl(payload.key)
          .then(res => resolve(res));
      });
    },
    loadString(payload) {
      this.loadTtl(payload).then(((ttl) => {
        payload.redis.get(payload.key).then((response) => {
          this.$emit('setKey', {
            ttl, data: response, type: 'string', key: payload.key,
          });
        });
      }));
    },
    loadHash(payload) {
      payload.redis.get(payload.key).then((response) => {
        console.log('HASH', response);
      });
    },
    loadLists(payload) {
      payload.redis.get(payload.key).then((response) => {
        console.log('LIST', response);
      });
    },
    loadSets(payload) {
      //       2019-04-30 18:06:22 : Connection: Localhost > [runCommand] ttl newset
      // 2019-04-30 18:06:22 : Connection: Localhost > Response received :
      // 2019-04-30 18:06:22 : Connection: Localhost > [runCommand] SCARD newset
      // 2019-04-30 18:06:22 : Connection: Localhost > Response received :
      // 2019-04-30 18:06:22 : Connection: Localhost > [runCommand] SSCAN newset 0 COUNT 10000
      // 2019-04-30 18:06:22 : Connection: Localhost > Response received : Array
      this.loadTtl(payload).then(((ttl) => {
        payload.redis.scard(payload.key).then((response) => {
          console.log(response);
          payload.redis.sscan(payload.key, 0, 'COUNT', 10000).then((sscanResponse) => {
            this.$emit('setKey', {
              ttl, data: sscanResponse, type: 'set', key: payload.key,
            });
          });
        });
      }));
    },
    loadZSet(payload) {
      this.loadTtl(payload).then(((ttl) => {
        payload.redis.zcard(payload.key).then((response) => {
          payload.redis.zrange(payload.key, 0, (response - 1), 'WITHSCORES').then((zrangeResponse) => {
            this.$emit('setKey', {
              ttl, data: zrangeResponse, type: 'zset', key: payload.key,
            });
          });
        });
      }));
    },
    // groupKeys(keys) {
    //   keys.sort((a, b) => a.length - b.length);
    //   const groups = {};
    //   for (let i = 0; i < keys.length; i += 1) {
    //     const key = keys[i];
    //     const split = key.split(':', 1);

    //     const keyGroup = split[0];
    //     const existingGroup = groups[keyGroup];

    //     if (!existingGroup) {
    //       groups[keyGroup] = {
    //         name: keyGroup,
    //         keys: [key],
    //       };
    //     } else {
    //       existingGroup.keys.push(key);
    //     }
    //   }

    //   this.groups = groups;
    // },
    getServerInfo(data) {
      const lines = data.split(/\r\n/);
      const dbstats = {};
      lines.forEach((line) => {
        if (line.length > 0 && !line.startsWith('#')) {
          const parts = line.split(/[\:\=\,]/); //eslint-disable-line
          const value = {};
          value[parts[1]] = parseInt(parts[2], 10);
          value[parts[3]] = parseInt(parts[4], 10);
          value[parts[5]] = parseInt(parts[6], 10);
          dbstats[parts[0].slice(2)] = value;
        }
      });
      return dbstats;
    },
    setupDatabases(numberOfDatabases) {
      let serverInfo = {};
      this.redis.info('keyspace').then((res) => {
        serverInfo = this.getServerInfo(res);
      });
      for (let i = 0; i < numberOfDatabases; i += 1) {
        this.redis.select(i).then((res) => { // eslint-disable-line no-loop-func
          if (res === 'OK') {
            const databaseInfo = serverInfo[i];
            this.databases.push({
              id: i,
              keys: databaseInfo ? databaseInfo.keys : 0,
              name: `db${i}`,
            });
          }
        }).catch(err => console.error(err));
      }
    },
  },
  watch: {
    redis() {
      this.redis.config('get', 'databases').then((res) => {
        this.setupDatabases(res[1]);
      }).catch((err) => {
        console.info('Couldnt use config object so we use static or from settings', err);
        this.setupDatabases(16); // TODO: Get from settings
      });
    },
  },
};
</script>

<style>
.sidebar {
  width: 30rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f6f6f6;
  border-right: 0.1rem solid #e0e0e0;
}
#app.app--theme-dark .sidebar {
  background: rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.key-list {
  flex: 1;
  overflow: hidden;
  overflow-y: scroll;
}

.key-list__list {
  height: 100%;
}

.key-list__key {
  padding: 1rem;
  font-size: 1.4rem;
  padding-left: 2rem;
}

.key-list__key {
  cursor: pointer;
}

/* .key-list__keys .key-list__key {
  padding-left: 2rem;
} */

.key-list__keys {
  transition: all ease 0.3s;
  padding-left: 1rem;
}

.key-list__key:hover {
  background: rgba(127, 127, 127, 0.1);
}

.key-list__key--selected {
  background: #2196f3 !important;
  color: #fff;
}

.footer__button {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.sidebar__header {
  padding: 1rem;
}
.sidebar__filter {
  width: 100%;
  border: none;
  padding: 1.2rem;
  background: #fff;
  border: 0.1rem solid #dfdfdf;
  border-radius: 0.3rem;
}

#app.app--theme-dark .sidebar__filter {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
}

.sidebar__filter:active,
.sidebar__filter:focus {
  outline: none;
}

.scroller {
  height: 100%;
}

/* .vue-recycle-scroller  {
    height: 100%;
    overflow-y: scroll;
  } */

i {
  margin-right: 0.5rem;
}
.database__listitem--dimmed {
  opacity: 0.25;
}

.key-list__group__entries--dimmed {
  background-color: #ccc;
}
.vue-recycle-scroller {
  position: relative;
}
.vue-recycle-scroller.direction-vertical:not(.page-mode) {
  overflow-y: auto;
}
.vue-recycle-scroller.direction-horizontal:not(.page-mode) {
  overflow-x: auto;
}
.vue-recycle-scroller.direction-horizontal {
  display: flex;
}
.vue-recycle-scroller__slot {
  flex: auto 0 0;
}
.vue-recycle-scroller__item-wrapper {
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}
.vue-recycle-scroller.ready .vue-recycle-scroller__item-view {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}
.vue-recycle-scroller.direction-vertical .vue-recycle-scroller__item-wrapper {
  width: 100%;
}
.vue-recycle-scroller.direction-horizontal .vue-recycle-scroller__item-wrapper {
  height: 100%;
}
.vue-recycle-scroller.ready.direction-vertical
  .vue-recycle-scroller__item-view {
  width: 100%;
}
.vue-recycle-scroller.ready.direction-horizontal
  .vue-recycle-scroller__item-view {
  height: 100%;
}
.resize-observer[data-v-b329ee4c] {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  pointer-events: none;
  display: block;
  overflow: hidden;
  opacity: 0;
}
.resize-observer[data-v-b329ee4c] object {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
</style>
