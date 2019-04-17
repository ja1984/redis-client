<template>
  <aside class="sidebar">
    <header class="sidebar__header">
      <input type="search" class="sidebar__filter" v-model="filter" placeholder="Type to filter keys">
    </header>
    <section class="key-list">
      <div class="databases">
        <database-list-item v-for="database in databases" :database="database" :redis="redis" @loadKey="loadKey" :key="database.id"></database-list-item>
        <!-- <div class="key-list__key" v-for="(database, index) in databases" :key="database" @click="selectDatabase(index)">
          <div class="row row--center-vert database__listitem" :class="{'database__listitem--dimmed': index > 0}">
            <div class="column column"><i class="fas fa-database"></i>{{database}}</div>
            <div class="column column--wrap">

          <span class="key-list__group__entries">{{0}}</span></div>
            </div>
          </div>
        </div> -->
      </div>
        <key-group :keyGroup="group" v-for="group in groupedKeys.groups" @loadKey="loadKey" :key="group.key"></key-group>
        <div class="key-list__key" v-for="key in groupedKeys.keys" @click="test(key)" :key="key"><i class="fas fa-key"></i>{{key}}</div>
        <!-- <div class="key-list__key" v-for="key in groupedKeys.keys" :key="key"><i class="fas fa-key"></i>{{key}}</div> -->
        <!-- <template v-else>
          <div class="key-list__key"><i class="fas fa-key"></i> {{group.name}}</div>
        </template> -->
      <!-- <div class="key-list__list">
        <RecycleScroller class="scroller" :items="filteredKeys" key-field="key" :itemSize="38">
          <div slot-scope="{ item }">
            <div class="key-list__key"><i class="fas fa-key"></i> {{item}}</div>
          </div>
        </RecycleScroller>
      </div> -->
    </section>
    <!-- <footer>
      <div class="footer__button">
        <i class="fas fa-cog"></i> Settings
      </div>
    </footer> -->
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
  computed: {
    groupedKeys() {
      const keys = this.filteredKeys.concat().sort((a, b) => a.length - b.length);
      const groups = {};
      const singleKeys = [];
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const split = key.split(/:(.+)?/);
        if (split.length === 1) {
          singleKeys.push(split[0]);
        } else {
          const keyGroup = split[0];
          const keyName = split.length > 1 ? split[1] : key;
          const existingGroup = groups[keyGroup];

          if (!existingGroup) {
            groups[keyGroup] = {
              name: keyGroup,
              keys: [keyName],
            };
          } else {
            existingGroup.keys.push(keyName);
          }
        }
      }
      return { groups, keys: singleKeys };
    },
    filteredKeys() {
      if (this.filter.length === 0) return this.keys;
      return this.keys
        .filter(key => key.toLowerCase().includes(this.filter.toLowerCase()));
    },
  },
  mounted() {
    // redis.info().then((res) => {
    //   console.log(res);
    // });

    // this.loadData(0);
  },
  methods: {
    loadKey(key) {
      console.log('sidebar', key);
      this.redis.select(0).then((res) => {
        if (res === 'OK') {
          this.redis.type(key).then((type) => {
            console.log(type);
            switch (type) {
              case 'hash':
                this.loadHash(key);
                break;
              case 'lists':
                this.loadLists(key);
                break;
              case 'sets':
                this.loadSets(key);
                break;
              case 'zset':
                this.loadZSet(key);
                break;
              default:
                this.loadString(key);
                break;
            }
          });
        }
      });
    },
    loadTtl(key) {
      return new Promise((resolve) => {
        this.redis.ttl(key)
          .then(res => resolve(res));
      });
    },
    loadString(key) {
      this.loadTtl(key).then(((ttl) => {
        this.redis.get(key).then((response) => {
          console.log(ttl, response);
          this.$emit('setKey', {
            ttl, data: response, type: 'string', key,
          });
        });
      }));
    },
    loadHash(key) {
      this.redis.get(key).then((response) => {
        console.log(response);
      });
    },
    loadLists(key) {
      this.redis.get(key).then((response) => {
        console.log(response);
      });
    },
    loadSets(key) {
      this.redis.get(key).then((response) => {
        console.log(response);
      });
    },
    loadZSet(key) {
      this.loadTtl(key).then(((ttl) => {
        this.redis.zcard(key).then((response) => {
          this.redis.zrange(key, 0, (response - 1), 'WITHSCORES').then((zrangeResponse) => {
            console.log(ttl, response, zrangeResponse);
            this.$emit('setKey', {
              ttl, data: zrangeResponse, type: 'zset', key,
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
  },
  watch: {
    redis() {
      let serverInfo = {};
      this.redis.info('keyspace').then((res) => {
        serverInfo = this.getServerInfo(res);
      });

      this.redis.config('get', 'databases').then((res) => {
        for (let i = 0; i < res[1]; i += 1) {
          this.redis.select(i).then((res) => { // eslint-disable-line no-loop-func
            if (res === 'OK') {
              const databaseInfo = serverInfo[i];
              this.databases.push({
                id: i,
                keys: databaseInfo ? databaseInfo.keys : 0,
                name: `db${i}`,
              });
            }
          }).catch(console.error);
        }
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
    border-right: .1rem solid #e0e0e0;
  }
  #app.dark .sidebar {
    background: rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, .1);
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
  }

  .key-list__key {
  cursor: pointer;
}

.key-list__keys {
  padding-left: 1rem;
  transition: all ease .3s;
}

.key-list__key:hover {
  background: rgba(127,127,127, .1);
}

  .footer__button {
    padding: 1.5rem;
    background: rgba(0, 0, 0, .1);
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
    border: .1rem solid #dfdfdf;
    border-radius: .3rem;

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
  margin-right: .5rem;
}
.database__listitem--dimmed {
  opacity: .25;
}

.key-list__group__entries--dimmed {
  background-color: #ccc;
}
  .vue-recycle-scroller{position:relative}.vue-recycle-scroller.direction-vertical:not(.page-mode){overflow-y:auto}.vue-recycle-scroller.direction-horizontal:not(.page-mode){overflow-x:auto}.vue-recycle-scroller.direction-horizontal{display:flex}.vue-recycle-scroller__slot{flex:auto 0 0}.vue-recycle-scroller__item-wrapper{flex:1;box-sizing:border-box;overflow:hidden;position:relative}.vue-recycle-scroller.ready .vue-recycle-scroller__item-view{position:absolute;top:0;left:0;will-change:transform}.vue-recycle-scroller.direction-vertical .vue-recycle-scroller__item-wrapper{width:100%}.vue-recycle-scroller.direction-horizontal .vue-recycle-scroller__item-wrapper{height:100%}.vue-recycle-scroller.ready.direction-vertical .vue-recycle-scroller__item-view{width:100%}.vue-recycle-scroller.ready.direction-horizontal .vue-recycle-scroller__item-view{height:100%}.resize-observer[data-v-b329ee4c]{position:absolute;top:0;left:0;z-index:-1;width:100%;height:100%;border:none;background-color:transparent;pointer-events:none;display:block;overflow:hidden;opacity:0}.resize-observer[data-v-b329ee4c] object{display:block;position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1}
</style>
